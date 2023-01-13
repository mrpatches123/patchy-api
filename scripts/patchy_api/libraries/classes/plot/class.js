import { BlockAreaSize, Vector, world, Location } from "@minecraft/server";
import { andArray, betweenVector3, content, isDefined, isVector3, native, orArray, overworld, server, sort3DVectors } from "../../utilities.js";
import eventBuilder from "../events/export_instance.js";
import databases from "../database.js";
import players from "../players/export_instance.js";
export class PlotsVector3 {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}
export class BlockVector3 {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

const directions = ['x', '-x', 'z', '-z'];
export class PlotBuilder {
	constructor() {
		this.plots = {};
		this.creates = {};
		this.subscribedQueue = false;
	}
	runCreateQueue() {
		content.warn('runCreateQueue28923382782372388372278');
		const plotThis = this;
		if (!this.subscribedQueue) {
			eventBuilder.subscribe('init_zplotCreateQueue', {
				tickAfterLoad: () => {

					const keys = Object.keys(plotThis.creates);
					content.warn('init_zplotCreateQueue', keys.length);
					if (!keys.length) return console.warn('ehy'), plotThis.subscribedQueue = false, eventBuilder.unsubscribe('init_zplotCreateQueue', 'tickAfterLoad');

					// content.warn({ plotThis });
					keys.forEach(key => {

						const rules = plotThis.creates[key];
						delete plotThis.creates[key];
						const { ruleSets, size, start } = rules;

						const generatedRuleSets = ruleSets.reduce((sumation, ruleSet, i) => {
							const { count, start: startRuleSet, direction, size: sizeRuleSet } = ruleSet;
							const { y } = start;
							if (count) {
								let change;
								switch (direction) {
									case 'x':
										change = { x: sizeRuleSet?.x ?? size.x, z: 0 };
										break;
									case '-x':
										change = { x: -(sizeRuleSet?.x ?? size.x), z: 0 };
									case 'z':
										change = { x: 0, z: sizeRuleSet?.z ?? size.z };
										break;
									case '-z':
										change = { x: 0, z: -(sizeRuleSet?.z ?? size.z) };
										break;
								}
								// content.warn({ size, change });
								const { x, z } = startRuleSet;
								// content.warn({ start: { x: start.x, z: start.z }, size: { x: size.x, z: size.z }, startRuleSet });
								let lastSize = { x: start.x + x * size.x, z: start.z + z * size.z };
								// content.warn({ lastSize });
								for (let c = 0; c < count; c++) {
									let currentSize;
									if (startRuleSet instanceof PlotsVector3) {
										currentSize = { x: ((c === 0) ? 0 : change.x) + lastSize.x, y, z: ((c === 0) ? 0 : change.z) + lastSize.z };
										lastSize = currentSize;
									}
									sumation.push({
										...ruleSet, ...{
											start: currentSize
										},
										...(sizeRuleSet ? {} : {
											size
										})
									});

								}
								return sumation;
							}

						}, []);
						plotThis.plots[key] = {};
						plotThis.plots[key].rules = rules;
						plotThis.plots[key].rules.ruleSets = generatedRuleSets;
						plotThis.plots[key].players = {};
						const plots = databases.get('plots*API') ?? databases.add('plots*API');
						content.warn({ t: '11111111111111111', plots, databases: databases.getFromEntity('plots*API') });
						let { availablePlots = [0], currentIndex = 0, hasBeenSubscribed = false } = plots.get(key) ?? {};
						if (hasBeenSubscribed) plotThis.subscribe(key);
						plots.set(key, { availablePlots, currentIndex, hasBeenSubscribed });
						databases.queueSave('plots*API');

					});
				}
			});
			// content.warn({ eventBuilder });
			this.subscribedQueue = true;
		}

	}
	create(key, rules) {
		// content.warn(key, rules);
		if (typeof key !== 'string') throw new Error(`key: ${key}, at param[0] is not of type: String!`);
		if (!(rules instanceof Object)) throw new Error(`rules, at param[1] is not of type: Object!`);
		let { size, start, ruleSets, property, plotNumberIdentifier } = rules;
		// content.warn({ plotNumberIdentifier });
		if (typeof plotNumberIdentifier !== 'string') throw new Error('plotNumberIdentifier: at param[1] is not of type: String!');
		if (typeof property !== 'boolean') throw new Error('plotNumberIdentifier: at param[1] is not of type: Boolean!');
		if (size && !(size instanceof BlockAreaSize)) throw new Error(`size, in rules at param[1] is not of type: BlockAreaSize!`);
		if (!size && !ruleSets) throw new Error(`size and ruleSets, in rules at param[1] are not defined therefore size in either is not defined!`);
		const indexsSize = ruleSets.reduce((sumation, current, i) => { if (!(current.size instanceof BlockAreaSize)) { sumation.push(i); return sumation; } }, []);
		if (!size && ruleSets && indexsSize.length) throw new Error(`ruleSets, at indexs: ${andArray(indexsSize)} in rules at param[1]  `);
		if (!start) throw new Error(`start, in rules at param[1] is not defined`);
		if (!isVector3(start)) throw new Error(`start, in rules at param[1] is not of type: vector3`);
		ruleSets.forEach(({ count, start, direction, offset }, i) => {
			if (!(start instanceof PlotsVector3) && !(start instanceof BlockVector3)) throw new Error(`start at ruleSets[${i}] in rules at param[1] is not of type: BlockVector3 or PlotVector3  `);
			if (count && typeof count !== 'number') throw new Error(`count at ruleSets[${i}] in rules at param[1] is not of type: number`);
			if (!directions.includes(direction)) throw new Error(`direction, ${direction} at ruleSets[${i}] in rules at param[1] is not one of the following: ${orArray(directions)}`);
			if (offset && !isVector3(offset)) throw new Error(`offset, at ruleSets[${i}] in rules at param[1] is not of type: {x: number, y: number, z: number})}`);
		});
		this.creates[key] = rules;
		(property) ? players.registerProperty(plotNumberIdentifier, { type: 'number' })
			: server.objectiveAdd(plotNumberIdentifier);
		this.runCreateQueue();
		// content.warn({ plot: this });
	}
	query(player, key) {
		const { scores, properties } = player;
		const { plotNumberIdentifier, property } = this.plots[key].rules;
		return ((property) ? properties : scores)[plotNumberIdentifier];
	}
	set(player, key, plotNumber) {
		const { scores, properties } = player;
		const { plotNumberIdentifier, property, subscribed } = this.plots[key];
		const plots = databases.get('plots*API') ?? databases.add('plots*API');
		let { availablePlots = [0], currentIndex = 0, hasBeenSubscribed = false } = plots.get(key);
		if (currentIndex >= plotNumber && !availablePlots.includes(plotNumber)) return false;
		if (currentIndex < plotNumber) {
			for (let i = currentIndex + 1; i < plotNumber; i++) {
				availablePlots.push(i);
			}
		}
		((property) ? properties : scores)[plotNumberIdentifier] = plotNumber;
		availablePlots = availablePlots.filter(value => value !== plotNumber);
		plots.set(key, { availablePlots, currentIndex, hasBeenSubscribed });
		databases.queueSave('plots*API');
		return true;
	}
	list(key) {
		const plots = databases.get('plots*API') ?? databases.add('plots*API');
		let { availablePlots = [0] } = plots.get(key);
		return availablePlots;
	}
	subscribe(key) {
		content.warn(`end_plots*${key}*API`);
		eventBuilder.subscribe(`end_plots*${key}*API`, {
			tickAfterLoad: () => {

				const { plotNumberIdentifier, property, subscribed } = this.plots[key].rules;
				// const plots = databases.get('plots*API') ?? databases.add('plots*API');
				// const { availablePlots = [0] } = plots.get(key);
				// if (availablePlots[0] === 0) {
				// 	this.plots[key].subscribed = false;
				// 	return eventBuilder.unsubscribe(`end_plots*${key}*API`, 'tickAfterLoad');
				// }
				const { ruleSets } = this.plots[key].rules;
				players.get().iterate((player) => {
					// content.warn(player.name);
					const { scores, properties, location, memory, rotation } = player;
					let plotNumber;
					if (property) plotNumber = properties[plotNumberIdentifier];
					else plotNumber = scores[plotNumberIdentifier];
					content.warn(plotNumber);
					if (!isDefined(plotNumber)) return;
					const { size, start } = ruleSets[plotNumber];
					const middle = new Location((size.x) / 2 + start.x, start.y, (size.z) / 2 + start.z);

					let { lastLocation = location } = memory;


					const end = { x: size.x + start.x, y: size.y + start.y, z: size.z + start.z };
					memory.lastLocation = location;
					if (betweenVector3(location, start, end)) return;
					let fixedLocation = (betweenVector3(lastLocation, start, end)) ? lastLocation : middle;
					const { x, y, z } = fixedLocation;
					const { x: rx, y: ry } = rotation;

					player.teleport(new Location(x, y, z), overworld, rx, ry);
				});
			}
		});
		this.plots[key].subscribed = true;
	}
	add(player, key) {
		const { scores, properties } = player;
		const { subscribed } = this.plots[key];
		const { plotNumberIdentifier, property } = this.plots[key].rules;
		const plots = databases.get('plots*API');
		if (!plots) throw new Error('why does the plots*API db not exist');
		const plot = plots.get(key);
		if (!plot) throw new Error(`plot: ${key}, does not exist`);
		let { availablePlots, currentIndex, hasBeenSubscribed } = plot;
		if (availablePlots.length <= 1) { availablePlots.push(++currentIndex); };
		const plotNumber = availablePlots.shift();
		if (property) properties[plotNumberIdentifier] = plotNumber;
		else scores[plotNumberIdentifier] = plotNumber;
		if (!subscribed) {
			this.subscribe(key);
			hasBeenSubscribed = true;
		}
		content.warn({ availablePlots, currentIndex, hasBeenSubscribed });
		plots.set(key, { availablePlots, currentIndex, hasBeenSubscribed });
		content.chatFormat({ databases });
		databases.queueSave('plots*API');
	}
	reset(key) {
		const plots = databases.get('plots*API') ?? databases.add('plots*API');
		plots.set(key, { availablePlots: [0], currentIndex: 0, hasBeenSubscribed: false });
		databases.queueSave('plots*API');
	}
	remove(player, key) {
		const plots = databases.get('plots*API') ?? databases.add('plots*API');
		const { availablePlots = [0], currentIndex = 0, hasBeenSubscribed = false } = plots.get(key);
		const { scores, properties } = player;
		const { plotNumberIdentifier, property, subscribed } = this.plots[key].rules;
		const plotNumber = ((property) ? properties : scores)[plotNumberIdentifier];
		if (!isDefined(plotNumber)) return false;
		if (!availablePlots.includes(plotNumber)) availablePlots.push(plotNumber);
		availablePlots.sort();
		((property) ? properties : scores)[plotNumberIdentifier] = undefined;
		plots.set(key, { availablePlots, currentIndex, hasBeenSubscribed });
		databases.queueSave('plots*API');
		return true;
	}
}