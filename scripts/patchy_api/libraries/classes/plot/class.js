import { BlockAreaSize, Vector, world } from "@minecraft/server";
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
	}
	create(key, rules) {
		content.warn(key, rules);
		if (typeof key !== 'string') throw new Error(`key: ${key}, at param[0] is not of type: String!`);
		if (!(rules instanceof Object)) throw new Error(`rules, at param[1] is not of type: Object!`);
		let { size, start, ruleSets, property, plotNumberIdentifier } = rules;
		content.warn({ plotNumberIdentifier });
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
		const generatedRuleSets = ruleSets.reduce((sumation, ruleSet, i) => {
			const { count, start: startRuleSet, direction, size: sizeRuleSet } = ruleSet;
			const { y } = startRuleSet;
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
				content.warn({ size, change });
				const { x, z } = startRuleSet;
				content.warn({ start: { x: start.x, z: start.z }, size: { x: size.x, z: size.z }, startRuleSet });
				let lastSize = { x: start.x + x * size.x, z: start.z + z * size.z };
				content.warn({ lastSize });
				for (let c = 0; c < count; c++) {
					let currentSize;
					if (startRuleSet instanceof PlotsVector3) {
						currentSize = { x: ((c === 0) ? 0 : change.x) + lastSize.x, y, z: ((c === 0) ? 0 : change.z) + lastSize.z };
						lastSize = currentSize;
					}
					sumation.push({
						...ruleSet, ...{
							start: currentSize
						}
					});

				}
				return sumation;
			}

		}, []);
		(property) ? players.registerProperty(plotNumberIdentifier, { type: 'number' })
			: server.objectiveAdd(plotNumberIdentifier);
		this.plots[key] = {};
		this.plots[key].rules = rules;
		this.plots[key].rules.ruleSets = generatedRuleSets;
		this.plots[key].players = {};
		const plots = databases.get('plots*API');
		content.warn({ plots });
		let { availablePlots = [0], currentIndex = 0, hasBeenSubscribed = false } = plots.get(key);
		content.warn({ hasBeenSubscribed });
		if (hasBeenSubscribed) this.subscribe(key);
		plots.set(key, { availablePlots, currentIndex, hasBeenSubscribed });
		databases.queueSave('plots*API');
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
		eventBuilder.subscribe(`plots*${key}*API`, {
			tickAfterLoad: () => {
				const { plotNumberIdentifier, property, subscribed } = this.plots[key].rules;
				const plots = databases.get('plots*API') ?? databases.add('plots*API');
				const { availablePlots = [0], currentIndex = 0, hasBeenSubscribed = false } = plots.get(key);
				if (availablePlots[0] = 0) {
					this.plots[key].subscribed = false;
					return eventBuilder.unsubscribe(`plots*${key}*API`, 'tickAfterLoad');
				}
				const { ruleSets } = this.plots[key].rules;
				players.get().forEach((player) => {
					content.warn(player.name);
					const { scores, properties, location, memory, rotation } = player;
					let plotNumber;
					if (property) plotNumber = properties[plotNumberIdentifier];
					else plotNumber = scores[plotNumberIdentifier];
					if (!isDefined(plotNumber)) return;
					const { size, start } = ruleSets[plotNumber];
					const middle = new Location((size.x) / 2 + start.x + 1, (size.y) / 2 + start.y + 1, (size.z) / 2 + start.z + 1);

					const { lastLocation = middle } = memory;


					const end = { x: size.x + start.x + 1, y: size.y + start.y + 1, z: size.z + start.z + 1 };
					memory.lastLocation = location;
					if (betweenVector3(location, start, end)) return;
					const { x, y, z } = lastLocation;
					const { x: rx, y: ry } = rotation;
					player.teleport(new Location(x, y, z), overworld, rx, ry);
				});
			}
		});
		this.plots[key].subscribed = true;
	}
	add(player, key) {
		const { scores, properties } = player;
		const { plotNumberIdentifier, property, subscribed } = this.plots[key].rules;
		const plots = databases.get('plots*API') ?? databases.add('plots*API');
		let { availablePlots = [0], currentIndex = 0, hasBeenSubscribed = false } = plots.get(key);
		content.warn({ availablePlots, bool: availablePlots.length, currentIndex });
		if (availablePlots.length <= 1) { availablePlots.push(++currentIndex); };
		content.warn({ availablePlots, bool: availablePlots.length, currentIndex });
		const plotNumber = availablePlots.shift();
		content.warn({ availablePlots, bool: availablePlots.length, currentIndex });
		content.warn({ plotNumberIdentifier });
		if (property) properties[plotNumberIdentifier] = plotNumber;
		else scores[plotNumberIdentifier] = plotNumber;
		content.warn({ plotNumber, prop: properties[plotNumberIdentifier] });
		if (!subscribed) {
			this.subscribe(key);
			hasBeenSubscribed = true;
		}
		plots.set(key, { availablePlots, currentIndex, hasBeenSubscribed });
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
		availablePlots.push(plotNumber);
		availablePlots.sort();
		((property) ? properties : scores)[plotNumberIdentifier] = undefined;
		plots.set(key, { availablePlots, currentIndex, hasBeenSubscribed });
		databases.queueSave('plots*API');
		return true;
	}
}