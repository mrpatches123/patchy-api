import { BlockAreaSize, Vector, world, MinecraftBlockTypes, Dimension, system, Vector2, Vector3 } from "@minecraft/server";
import { andArray, betweenBlockVector3, blockFaceToCoords, content, isDefined, isVector2, isVector3, native, orArray, overworld, server, sort3DVectors } from "../../utilities.js";
import eventBuilder from "../events/export_instance.js";
import databases from "../database.js";
import players from "../players/export_instance.js";
import teleportBuilder, { TeleportObjectOnce } from "../teleport.js";
import { Player } from "../player/class.js";
import gamemode from "../gamemode.js";
import structureBuilder from "../structure/export_instance.js";
import wait from "../wait.js";
import scoreboardBuilder from "../scoreboard.js";
import global from "../global.js";
import propertyBuilder from "../property/export_instance.js";
import { LoadOptions as StructureLoadOptions } from '../structure/class';

const gamemodes = [0, 1, 2];
const opens = [
	MinecraftBlockTypes.chest.id,
];
const buttons = [
	MinecraftBlockTypes.stoneButton.id,
	MinecraftBlockTypes.birchButton.id,
	MinecraftBlockTypes.acaciaButton.id,
	MinecraftBlockTypes.cherryButton.id,
	MinecraftBlockTypes.jungleButton.id,
	MinecraftBlockTypes.spruceButton.id,
	MinecraftBlockTypes.warpedButton.id,
	MinecraftBlockTypes.woodenButton.id,
	MinecraftBlockTypes.bambooButton.id,
	MinecraftBlockTypes.crimsonButton.id,
	MinecraftBlockTypes.darkOakButton.id,
	MinecraftBlockTypes.mangroveButton.id
];
export class PlotsVector3 {
	x: number;
	y: number;
	z: number;
	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}
export class BlockVector3 {
	x: number;
	y: number;
	z: number;
	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}
interface PlotRuleSet {
	count?: number;
	size?: BlockAreaSize;
	start: { x: number, y: number, z: number; } | PlotsVector3;
	offset?: { x: number, y: number, z: number; };
	direction: 'x' | '-x' | 'z' | '-z';
	blockPlaceMargin?: { x: number, y: number, z: number; };
}
interface Teleport {
	location?: Vector3 | { location: Vector3, offset: Vector3; } | PlotsVector3;
	face?: Vector2 | Vector3 | { location: Vector3, offset: Vector3; } | PlotsVector3;
	dimension?: Dimension;
	key?: string;
}
interface PlotRules {
	size: BlockAreaSize;
	start: { x: number, y: number, z: number; };
	ruleSets?: PlotRuleSet[];
	property?: boolean;
	plotNumberIdentifier?: string;
	defaultPermision?: 'read' | 'write' | 'break' | 'place' | 'open' | 'open-break';
	defaultGamemode?: 0 | 1 | 2;
	/**
	 * default?= false
	 */
	loop?: boolean;
	loopDirection?: 'x' | '-x' | 'z' | '-z';
	teleport?: Teleport;
	structure?: StructureLoadOptions;
	exclusive?: boolean;
	maxX?: number;
	maxZ?: number;
}
scoreboardBuilder.add('blockPlaceMarginOverideX');
scoreboardBuilder.add('blockPlaceMarginOverideY');
scoreboardBuilder.add('blockPlaceMarginOverideZ');
const rotations = ['0_degrees', '90_degrees', '180_degrees', '270_degrees'];
const mirrors = ['none', 'x', 'xz', 'z'];
const animationModes = ['block_by_block', 'layer_by_layer'];
const directions = ['x', '-x', 'z', '-z'];
const permisions = ['read', 'write', 'break', 'place', 'open', 'open-break', 'press'];
function objectVector3(vector3: Vector3) {
	const { x, y, z } = vector3;
	return ({ x, y, z });

}
global.finishedInitialPlotCreate;
export class PlotBuilder {
	subscribedQueue: boolean;
	registeredProperties: boolean;
	creates: Record<string, PlotRules>;
	plots: Record<string, { players: any, rules: PlotRules; }>;
	subscribed: boolean = false;
	constructor() {
		this.plots = {};
		this.creates = {};
		this.subscribedQueue = false;
		this.registeredProperties = false;
	}
	runCreateQueue() {
		const plotThis = this;
		if (!this.subscribedQueue) {
			eventBuilder.subscribe('init_zplotCreateQueue', {
				worldLoad: () => {
					content.warn('runCreateQueue28923382782372388372278');
					const runId = system.runInterval(() => {
						const keys = Object.keys(plotThis.creates);
						// content.warn('init_zplotCreateQueue', keys.length);
						if (!keys.length) return (console.warn('ehy'), plotThis.subscribedQueue = false, system.clearRun(runId), global.finishedInitialPlotCreate = true);

						// content.warn({ plotThis });
						keys.forEach(key => {
							// content.warn(keys);
							const rules = plotThis.creates[key];
							delete plotThis.creates[key];
							const { ruleSets = [], size, start, exclusive } = rules ?? {};
							let maxZ = 0, maxX = 0;
							const reduceCallback = ((sumation: Array<PlotRuleSet>, ruleSet: PlotRuleSet, i: number): Array<PlotRuleSet> => {
								const { count = 0, start: startRuleSet, direction, size: sizeRuleSet } = ruleSet;
								const { y } = start ?? {};
								if (count) {
									let change: Vector3;
									switch (direction) {
										case 'x':
											change = { x: sizeRuleSet?.x ?? size!.x, y: 0, z: 0 };
											break;
										case '-x':
											change = { x: -(sizeRuleSet?.x ?? size!.x), y: 0, z: 0 };
										case 'z':
											change = { x: 0, y: 0, z: sizeRuleSet?.z ?? size!.z };
											break;
										case '-z':
											change = { x: 0, y: 0, z: -(sizeRuleSet?.z ?? size!.z) };
											break;
									}
									// content.warn({ size, change });
									const { x, z } = startRuleSet;
									// content.warn({ start: { x: start.x, z: start.z }, size: { x: size.x, z: size.z }, startRuleSet });
									let lastSize = { x: start!.x + x * size!.x, z: start!.z + z * size!.z };
									// content.warn({ lastSize });
									for (let c = 0; c < count; c++) {
										let currentSize: Vector3;
										if (startRuleSet instanceof PlotsVector3) {
											currentSize = { x: ((c === 0) ? 0 : change.x) + lastSize.x, y: y!, z: ((c === 0) ? 0 : change.z) + lastSize.z };
											lastSize = currentSize;
										}
										const { x: xC = 0, z: zC = 0 } = currentSize! ?? {};
										const rX = xC - x + 1;
										const rZ = zC - z + 1;
										if (rX > maxX) maxX = rX;
										if (rZ > maxZ) maxZ = rZ;
										sumation.push({
											...ruleSet, ...{
												start: currentSize!
											},
											...(sizeRuleSet ? {} : {
												size
											})
										});

									}
									return sumation;
								} else return [] as Array<PlotRuleSet>;

							});
							const generatedRuleSets = ruleSets.reduce(reduceCallback, [] as Array<PlotRuleSet>);
							plotThis.plots[key] = {} as typeof plotThis.plots[typeof key];
							plotThis.plots[key]!.rules = rules!;
							plotThis.plots[key]!.rules.ruleSets = generatedRuleSets;
							plotThis.plots[key]!.players = {};
							Object.assign(plotThis.plots[key]!.rules, { maxX, maxZ });
							const plots = databases.get('plots*API') ?? databases.add('plots*API');
							// content.warn({ t: '11111111111111111', plots, databases: databases.getFromEntity('plots*API') });
							let { availablePlots = [0], currentIndex = 0, hasBeenSubscribed = false } = plots.get(key) ?? {};
							if (hasBeenSubscribed) plotThis.subscribe();
							plots.set(key, (exclusive) ? { hasBeenSubscribed } : { availablePlots, currentIndex, hasBeenSubscribed });
							databases.queueSave('plots*API');
						});
					});
				}
			});
			// content.warn({ eventBuilder });
			this.subscribedQueue = true;

		}
	}
	registerOverides() {
		propertyBuilder.register({
			player: {
				currentPlot: {
					type: 'string',
					maxLength: 32
				},
				gamemodeOveride: {
					type: 'number'
				},
				permisionOveride: {
					type: 'string',
					maxLength: 5
				},
				plotNumberOveride: {
					type: 'number'
				},
				blockPlaceMarginOverideX: {
					type: 'number'
				},
				blockPlaceMarginOverideY: {
					type: 'number'
				},
				blockPlaceMarginOverideZ: {
					type: 'number'
				}
			}
		});
	}
	create(key: string, rules: PlotRules) {
		// content.warn('created plot 4983485734290483094853042-9-0-=00-=');
		if (typeof key !== 'string') throw new Error(`key: ${key}, at params[0] is not of type: String!`);
		if (!(rules instanceof Object)) throw new Error(`rules in rules at params[1] is not of type: Object!`);
		let { size, exclusive, start, ruleSets = [], property, plotNumberIdentifier, structure, teleport, loop = false, loopDirection, defaultPermision, defaultGamemode } = rules;
		// content.warn({ plotNumberIdentifier });
		if (!exclusive && typeof plotNumberIdentifier !== 'string') throw new Error('plotNumberIdentifier in rules at params[1] is not of type: String!');
		if (!exclusive && typeof property !== 'boolean') throw new Error('plotNumberIdentifier in rules at params[1] is not of type: Boolean!');
		if (size && !(size instanceof BlockAreaSize)) throw new Error(`size, in rules at params[1] is not of type: BlockAreaSize!`);
		if (!size && !ruleSets) throw new Error(`size and ruleSets, in rules at params[1] are not defined therefore size in either is not defined!`);
		const indexsSize = ruleSets.reduce((sumation, current, i) => { if (!(current.size instanceof BlockAreaSize)) { sumation.push(i); return sumation; } else return [] as number[]; }, [] as number[]);
		if (!size && ruleSets && indexsSize.length) throw new Error(`ruleSets, at indexs: ${andArray(indexsSize)} in rules at params[1]!`);
		if (!start) throw new Error(`start, in rules at params[1] is not defined!`);
		if (!isVector3(start)) throw new Error(`start, in rules at params[1] is not of type: Vector3!`);
		if (typeof loop !== 'boolean') throw new Error(`loop, in rules at params[1] is defined and not of type: Boolean!`);
		if (!loop && loopDirection) throw new Error(`loopDirection, in rules at params[1] is defined and loop is not defined!`);
		if (loopDirection && !directions.includes(loopDirection)) throw new Error(`loopDirection, in rules at params[1] is defined and not one of the following: ${orArray(directions)}`);
		if (defaultPermision && !permisions.includes(defaultPermision)) throw new Error(`defaultPermision, in rules at params[1] is defined and is not one of the following: ${orArray(permisions)}!`);
		if (defaultGamemode && !gamemodes.includes(defaultGamemode)) throw new Error(`defaultGamemode, in rules at params[1] is defined and is not one of the following: ${orArray(gamemodes)}!`);

		if (structure) {
			if (!(structure instanceof Object)) throw new Error(`structure, in rules at params[1] is defined and not of type: Object!`);
			const { name, location, rotation = '0_degrees', mirror = 'none', animationMode = 'block_by_block', animationSeconds = 0, includesEntites = true, includesBlocks = true, waterlogged = false, integrity = 100, seed } = structure;
			if (typeof name !== 'string') throw new Error(`name in structure in rules at params[1] is not of type: String!`);
			if (!isVector3(location)) throw new Error(`location in structure in rules at params[1] is not of type: Vector3!`);
			if (!rotations.includes(rotation)) throw new Error(`rotation in structure in rules at params[1] is not one of the following: ${orArray(rotations)}!`);
			if (!mirrors.includes(mirror)) throw new Error(`mirror in structure in rules at params[1] is not one of the following: ${orArray(mirrors)}!`);
			if (!animationModes.includes(animationMode)) throw new Error(`animationMode in structure in rules at params[1] is not one of the following: ${orArray(animationModes)}!`);
			if (typeof animationSeconds !== 'number') throw new Error(`animationSeconds in structure in rules at params[1] is not of type: Number!`);
			if (typeof includesEntites !== 'boolean') throw new Error(`includesEntites in structure in rules at params[1] is not of type: Boolean!`);
			if (typeof includesBlocks !== 'boolean') throw new Error(`includesBlocks in structure in rules at params[1] is not of type: Boolean!`);
			if (typeof waterlogged !== 'boolean') throw new Error(`waterlogged in structure in rules at params[1] is not of type: Boolean!`);
			if (typeof integrity !== 'number') throw new Error(`integrity in structure in rules at params[1] is not of type: Number!`);
			if (seed && typeof seed !== 'string') throw new Error(`seed in structure in rules at params[1] is not of type: String!`);
		}
		if (exclusive === true) {
			if (isDefined(structure)) throw new Error(`structure, in rules at params[1] should not be defined as exclusive in rules at params[1] is true!`);
			// if (isDefined(loop)) throw new Error(`loop, in rules at params[1] should not be defined as exclusive in rules at params[1] is true!`);
			if (isDefined(loopDirection)) throw new Error(`loopDirection, in rules at params[1] should not be defined as exclusive in rules at params[1] is true!`);
			if (ruleSets.length > 1) throw new Error(`ruleSet's, in rules at params[1], length should not be greater than 1 as exclusive in rules at params[1] is true!`);
			if (isDefined(plotNumberIdentifier)) throw new Error(`plotNumberIdentifier, in rules at params[1] should not be defined as exclusive in rules at params[1] is true!`);
			if (isDefined(property)) throw new Error(`property, in rules at params[1] should not be defined as exclusive in rules at params[1] is true!`);
		}
		if (teleport) {
			if (!(teleport instanceof Object)) throw new Error(`structure, in rules at params[1] is defined and not of type: Object!`);
			const { location, face, key } = teleport;
			if (key && typeof key !== 'string') throw new Error('key, in rules at params[1] is defined and not of type: String!');
			if (!key) {
				if (!isVector3(location)) throw new Error(`location, in teleport in rules at params[1] is not of type: Vector3!`);
				if (face && !isVector2(face)) throw new Error(`face, in teleport in rules at params[1] is defined and not of type: Vector2 or Vector3!`);
				if (face && !isVector2(face)) throw new Error(`face, in teleport in rules at params[1] is defined and not of type: Vector2 or Vector3!`);
			}
		}

		ruleSets.forEach(({ count, start, direction, offset, blockPlaceMargin }, i) => {
			if (!(start instanceof PlotsVector3) && !(start instanceof BlockVector3)) throw new Error(`start at ruleSets[${i}] in rules at params[1] is not of type: BlockVector3 or PlotVector3  `);
			if (count && typeof count !== 'number') throw new Error(`count at ruleSets[${i}] in rules at params[1] is not of type: number`);
			if (!directions.includes(direction)) throw new Error(`direction, ${direction} at ruleSets[${i}] in rules at params[1] is not one of the following: ${orArray(directions)}`);
			if (offset && !isVector3(offset)) throw new Error(`offset, at ruleSets[${i}] in rules at params[1] is not of type: {x: number, y: number, z: number})}`);
			if (blockPlaceMargin && !isVector3(blockPlaceMargin)) throw new Error(`blockPlaceMargin, at ruleSets[${i}] in rules at params[1] is not of type: {x: number, y: number, z: number})}`);
		});
		this.creates[key] = rules;
		if (!this.registeredProperties) this.registeredProperties = true, this.registerOverides();
		if (!exclusive) {
			(property) ? players.registerProperty(plotNumberIdentifier!, { type: 'number' })
				: server.objectiveAdd(plotNumberIdentifier!);
		}
		// content.warn(key, rules);
		this.runCreateQueue();
		// content.warn({ plot: this });
	}
	query(player: Player, key: string) {
		if (!this.plots.hasOwnProperty(key)) throw new Error(` key: ${key}, does not exist`);
		if (this.plots[key]?.rules?.exclusive) throw new Error(`Cannot get list for key: ${key}, as exclusive is true`);
		const { scores, properties } = player;
		const { plotNumberIdentifier, property } = this.plots[key]!.rules;
		return ((property) ? properties : scores)[plotNumberIdentifier!];
	}
	list(key: string) {
		if (this.plots[key]!.rules.exclusive) throw new Error(`Cannot get list for key: ${key}, as exclusive is true`);
		const plots = databases.get('plots*API') ?? databases.add('plots*API');
		const plotObject = plots.get(key);
		let { availablePlots, currentIndex } = plotObject ?? {};
		return (plotObject) ? { availablePlots, currentIndex } : false;
	}
	/**
	 * @param {Player} player 
	 * @param {string} key 
	 */
	setCurrent(player: Player, key?: string) {
		if (!player) throw new Error('player is not defined at setCurrent');
		player.properties.currentPlot = key;
		player.memory.lastLocation = undefined;
		if (!key) return;
		const { exclusive, teleport: { key: teleportKey } = {} } = this.plots[key]!.rules!;
		if (!exclusive) return;
		if (!teleportKey) return;
		teleportBuilder.teleport(player, teleportKey);
	}
	setOveride(player: Player, type: 'plotNumberOveride' | 'currentPlot' | 'gamemodeOveride' | 'permisionOveride', value: number | string) {
		content.warn({ player: player.name, type, value });
		const { properties } = player;
		properties[type] = value;
	}
	getRuleSet(key: string, number: number) {
		// content.warn({ t: 'getRuleSet', key, number });
		if (!this.plots.hasOwnProperty(key)) throw new Error(`key: ${key}, does not exist!`);

		const { ruleSets, loop, start, loopDirection, maxX = 0, maxZ = 0, exclusive, size } = this.plots[key]!.rules ?? {};

		if (exclusive) return ruleSets?.[0];
		if (typeof number !== 'number') throw new Error('why is number not defined');
		if (!loop) return ruleSets![number];
		const row = Math.floor(number / ruleSets!.length);
		const column = number % ruleSets!.length;
		// content.warn({ row, column });
		const ruleSet = ruleSets![column]!;
		const { start: startRuleSet, offset: { x: ox = 0, y: oy = 0, z: oz = 0 } = {} } = ruleSet;
		let { x, y, z } = startRuleSet;
		// content.warn({ maxX, maxZ, x, y, z, ox });
		switch (loopDirection) {
			case 'x': {
				z += maxZ * row + oz * (row + 1);
				x += ox * (column + 1);
				break;
			} case '-x': {
				z -= maxZ * row - oz * (row + 1);
				x += ox * (column + 1);
				break;
			} case 'z': {
				// content.warn('');
				x += 0;
				z += (size.z + oz * 2) * row;
				break;
			} case '-z': {
				x -= maxX * row - ox * (row + 1);
				z += oz * (row + 1);
				break;
			}
		}
		// content.warn({ maxX, maxZ, x, y, z, ox });
		return { ...ruleSet, ...{ start: { x, y, z } } };
	}
	subscribe() {
		eventBuilder.subscribe(`end_plots*API`, {
			tickAfterLoad: () => {
				players.get().iterate((player) => {
					// content.warn(player.name);
					const { scores, properties, location, memory, rotation } = player;
					let { lastLocation = location, } = memory;
					const { ingorePlotSystem } = scores;
					const { currentPlot } = properties;
					// content.warn({ ingorePlotSystem, currentPlot });

					if (!currentPlot) return;
					if (ingorePlotSystem) return;
					const { plotNumberIdentifier, property, teleport, defaultGamemode, exclusive, size: sizePlot, start: startPlot } = this.plots[currentPlot as string]!.rules;
					const { plotNumberOveride, gamemodeOveride = defaultGamemode } = properties;
					let plotNumber;
					if (exclusive) plotNumber = 0;
					else if (isDefined(plotNumberOveride)) plotNumber = plotNumberOveride;
					else if (property) plotNumber = properties[plotNumberIdentifier as string];
					else plotNumber = scores[plotNumberIdentifier as string];
					// content.warn({ currentPlot, player: player.name, plotNumberOveride: plotNumberOveride ?? 'undefined', plotNumber: plotNumber ?? 'undefined' });


					if (!isDefined(plotNumber)) return;
					// content.warn({ plotNumber, currentPlot });
					const { size = sizePlot, start = startPlot } = this.getRuleSet(currentPlot as string, plotNumber as number) ?? {};
					// content.warn({ t: 'hellodwkj', gamemodeOveride });
					if (isDefined(gamemodeOveride)) {
						const { gamemode: gamemodePlayer } = player;
						if (gamemodePlayer !== gamemodeOveride) player.gamemode = gamemodeOveride as 0 | 1 | 2 | 5;
					}
					const end = { x: size.x + start.x, y: size.y + start.y, z: size.z + start.z };
					const { x, y, z } = lastLocation;
					// content.warn({ lastLocation: objectVector3(lastLocation), start: objectVector3(start), end: objectVector3(end), bool1: betweenBlockVector3(location, start, end), bool2: betweenBlockVector3(lastLocation, start, end) });
					memory.lastLocation = location;
					if (betweenBlockVector3(location, start, end)) return;
					if (betweenBlockVector3(lastLocation, start, end)) {
						const { x, y, z } = lastLocation;
						player.teleport({ x, y, z }, { dimension: overworld, rotation });
					} else {
						// content.warn({ bool: Boolean(teleport) });
						if (teleport) {
							let { location: teleportLocation, face, key } = teleport;
							if (key) teleportBuilder.teleport(player, key);
							else {
								teleportLocation = { location: start as Vector3, offset: teleportLocation as Vector3 };
								if (!isVector2(face)) face = { location: start, offset: face as Vector3 };
								const object = { location: teleportLocation, face, dimension: overworld };
								// content.warn({ teleportLocation: objectVector3(teleportLocation), start: objectVector3(start) });
								teleportBuilder.teleportOnce(player, object as TeleportObjectOnce);
							}
						} else {
							const { x: rx, y: ry } = rotation;
							player.teleport({ x: (size.x) / 2 + start.x, y: start.y, z: (size.z) / 2 + start.z }, { dimension: overworld, rotation: { x: rx, y: ry } });
						}
					}
				});

			},
			blockBreak: ({ player, block, brokenBlockPermutation }) => {
				const { scores, properties, location, memory, rotation } = player;
				const { ingorePlotSystem } = scores;
				const { currentPlot } = properties;
				if (!currentPlot || ingorePlotSystem) return;
				const { plotNumberIdentifier, property, ruleSets, defaultPermision, exclusive, size: defaultSize, start: defaultStart } = this.plots[currentPlot as string]!.rules;
				const { plotNumberOveride, permisionOveride: permision = defaultPermision } = properties;
				let plotNumber;
				if (exclusive) plotNumber = 0;
				else if (isDefined(plotNumberOveride)) plotNumber = plotNumberOveride;
				else if (property) plotNumber = properties[plotNumberIdentifier!];
				else plotNumber = scores[plotNumberIdentifier!];
				if (!isDefined(plotNumber)) return;
				switch (permision) {
					case 'break':
					case 'open-break':
					case 'write': {
						const ruleSet = this.getRuleSet(currentPlot as string, plotNumber as number)!;

						const { size = defaultSize, start: { x: sx, y: sy, z: sz } = defaultStart, blockPlaceMargin: blockPlaceMarginDefault } = ruleSet;
						const { x: mxD = 0, y: myD = 0, z: mzD = 0 } = blockPlaceMarginDefault ?? {};
						const { blockPlaceMarginOverideX: mx = mxD, blockPlaceMarginOverideY: my = myD, blockPlaceMarginOverideZ: mz = mzD } = properties;

						const start = { x: sx + (mx as number), y: sy + (my as number), z: sz + (mz as number) };
						const end = { x: size.x + sx - (mx as number), y: size.y + sy - (my as number), z: size.z + sz - (mz as number) };
						if (betweenBlockVector3(block.location, start, end)) return;
					}
					case 'open':
					case 'place':
					case 'read': {
						block.setPermutation(brokenBlockPermutation);
						break;
					}
				}


			},
			beforeItemUseOn: (event) => {
				const { blockFace, source: player, block: { location: blockLocation } } = event;
				if (!(player instanceof Player)) return;
				const { scores, properties, location, memory, rotation, dimension, isSneaking } = player;
				const { ingorePlotSystem } = scores;
				const { currentPlot } = properties;
				if (!currentPlot || ingorePlotSystem) return;
				const { plotNumberIdentifier, property, ruleSets, defaultPermision, defaultGamemode, exclusive, size: defaultSize, start: defaultStart } = this.plots[currentPlot as string]!.rules;
				const { plotNumberOveride, permisionOveride: permision = defaultPermision } = properties;
				let plotNumber;
				if (exclusive) plotNumber = 0;
				else if (isDefined(plotNumberOveride)) plotNumber = plotNumberOveride;
				else if (property) plotNumber = properties[plotNumberIdentifier!];
				else plotNumber = scores[plotNumberIdentifier!];
				if (!isDefined(plotNumber)) return;
				// content.warn({ permision });
				switch (permision) {
					case 'press': {
						if (buttons.includes(dimension.getBlock(blockLocation)?.typeId!) && !isSneaking) {
							return;
						}
					}
					case 'open':
					case 'open-break': {
						if (opens.includes(dimension.getBlock(blockLocation)?.typeId!) && !isSneaking) {
							return;
						}
					}
					case 'place':
					case 'write': {
						const ruleSet = this.getRuleSet(currentPlot as string, plotNumber as number);
						const { size = defaultSize, start: { x: sx, y: sy, z: sz } = defaultStart, blockPlaceMargin: blockPlaceMarginDefault } = ruleSet!;
						const { x: mxD = 0, y: myD = 0, z: mzD = 0 } = blockPlaceMarginDefault!;
						const { blockPlaceMarginOverideX: mx = mxD, blockPlaceMarginOverideY: my = myD, blockPlaceMarginOverideZ: mz = mzD } = properties;
						const start = { x: sx + (mx as number), y: sy + (my as number), z: sz + (mz as number) };
						const end = { x: size.x + sx - (mx as number), y: size.y + sy - (my as number), z: size.z + sz - (mz as number) };
						// content.warn({ t: 'beforeItemUseOn', start, end });
						const blockPlaceLocation = blockFaceToCoords(blockFace, blockLocation);
						if (betweenBlockVector3(blockPlaceLocation, start, end)) return;
					}
					case 'break':
					case 'read': {
						event.cancel = true;
						break;
					}
				}


			},
			// beforePlayerScaffoldPlace: (event) => {
			// 	const { blockLocation, player } = event;
			// 	const { scores, properties, location, memory, rotation, dimension, isSneaking } = player;
			// 	const { ingorePlotSystem } = scores;
			// 	const { currentPlot } = properties;
			// 	if (!currentPlot || ingorePlotSystem) return;
			// 	const { plotNumberIdentifier, property, ruleSets, defaultPermision, defaultGamemode, exclusive, size: defaultSize, start: defaultStart } = this.plots[currentPlot].rules;
			// 	const { plotNumberOveride, permisionOveride: permision = defaultPermision } = properties;
			// 	let plotNumber;
			// 	if (exclusive) plotNumber = 0;
			// 	else if (isDefined(plotNumberOveride)) plotNumber = plotNumberOveride;
			// 	else if (property) plotNumber = properties[plotNumberIdentifier];
			// 	else plotNumber = scores[plotNumberIdentifier];
			// 	if (!isDefined(plotNumber)) return;
			// 	switch (permision) {
			// 		case 'place':
			// 		case 'write': {
			// 			const ruleSet = this.getRuleSet(currentPlot, plotNumber);
			// 			const { size = defaultSize, start: { x: sx, y: sy, z: sz } = defaultStart, blockPlaceMargin: { x: mx = 0, y: my = 0, z: mz = 0 } = {} } = ruleSet ?? {};
			// 			const start = { x: sx + mx, y: sy + my, z: sz + mz };
			// 			const end = { x: size.x + sx - mx, y: size.y + sy - my, z: size.z + sz - mz };
			// 			content.warn({ t: 'beforeItemUseOn', start, end, bool: betweenBlockVector3(blockLocation, start, end) });
			// 			if (betweenBlockVector3(blockLocation, start, end)) return;
			// 		}
			// 		case 'break':
			// 		case 'read': {
			// 			event.cancel = true;
			// 			break;
			// 		}
			// 	}


			// },
		});
		this.subscribed = true;
	}
	/**
	 * @param {import('../player/class').Player} player 
	 * @param {string} key 
	 * @param {number | undefined} plotNumber 
	 * @returns {{ wasAdded: boolean, plotNumber: Number | undefined, full: boolean}}
	 */
	add(player: import('../player/class').Player, key: string, plotNumber: number | undefined): { wasAdded: boolean; plotNumber?: number | undefined; full: boolean; } {
		// content.warn({ bool: !isDefined(plotNumber), plotNumber: plotNumber ?? 'undefined' });
		const { scores, properties } = player;
		const { subscribed } = this;
		const { plotNumberIdentifier, property, loop, teleport, structure, ruleSets = [] } = this.plots[key]!.rules;
		const queryNumber = this.query(player, key);
		if (isDefined(queryNumber)) return { wasAdded: false, plotNumber: queryNumber as number, full: false };
		const plots = databases.get('plots*API');
		if (!plots) throw new Error('why does the plots*API db not exist');
		const plot = plots.get(key);
		if (!plot) throw new Error(`plot: ${key}, does not exist`);
		let { availablePlots, currentIndex, hasBeenSubscribed } = plot;
		if (!loop && ruleSets.length === currentIndex && !availablePlots.length) return { wasAdded: false, full: true };
		if (!isDefined(plotNumber)) {
			plotNumber = availablePlots.shift();
			if (availablePlots.length === 0) availablePlots.push(++currentIndex);
		} else if (availablePlots.includes(plotNumber)) availablePlots = (availablePlots as number[]).filter(number => number !== plotNumber);
		else if (currentIndex < plotNumber!) {
			for (let i = currentIndex + 1; i < plotNumber!; i++) availablePlots.push(i);
			currentIndex = plotNumber! + 1;
		}
		else return { wasAdded: false, full: false };

		if (property) properties[plotNumberIdentifier!] = plotNumber;
		else scores[plotNumberIdentifier!] = plotNumber;

		// content.warn({ plotNumber, property, score: scores[plotNumberIdentifier] });
		if (!subscribed) {
			this.subscribe();
			hasBeenSubscribed = true;
		}
		const ruleSet = this.getRuleSet(key, plotNumber!);
		let loadId: number | undefined;
		if (structure) {
			const { start: { x, y, z } } = ruleSet!;
			const { x: sx, y: sy, z: sz } = structure.location;
			content.warn({ t: 'structure', sx, sy, sz, x: sx + x, y: sy + y, z: sz + z });
			loadId = structureBuilder.load({ ...structure, ...{ location: { x: sx + x, y: sy + y, z: sz + z } } });
		}


		if (teleport) {
			// content.warn('9090909090909090909');
			wait.add(`${player}*plot*structure`, () => {
				const test = (!loadId) ? true : structureBuilder.getLoadStatus(loadId)!.done;
				// content.warn({ test, loadId, done: structureBuilder.getLoadStatus(loadId)?.done });
				return test;
			},
				() => {
					let { location: teleportLocation, face, key } = teleport;
					if (key) { teleportBuilder.teleport(player, key); return true; }
					else {
						const { start: { x, y, z } } = ruleSet!;
						const startLocation = { x, y, z };
						teleportLocation = { location: startLocation, offset: teleportLocation as Vector3 };
						// content.warn(native.stringify(face));
						if (isVector3(face)) face = { location: startLocation, offset: face as Vector3 };
						// content.warn(native.stringify(face));
						teleportBuilder.teleportOnce(player, { location: teleportLocation, face: face as Vector3, dimension: overworld });
						return true;
					}
				}, { once: true, start: true, remove: true, afterLoad: true });
		}
		plots.set(key, { availablePlots, currentIndex, hasBeenSubscribed });
		// content.chatFormat({ databases });
		databases.queueSave('plots*API');
		return { wasAdded: true, plotNumber, full: false };
	}
	reset(key: string) {
		const plots = databases.get('plots*API') ?? databases.add('plots*API');
		plots.set(key, { availablePlots: [0], currentIndex: 0, hasBeenSubscribed: false });
		databases.queueSave('plots*API');
	}
	remove(player: Player, key: string) {
		const plots = databases.get('plots*API') ?? databases.add('plots*API');
		const { availablePlots = [0], currentIndex = 0, hasBeenSubscribed = false } = plots.get(key);
		const { scores, properties } = player;
		const { plotNumberIdentifier, property } = this.plots[key]!.rules;
		const plotNumber = ((property) ? properties : scores)[plotNumberIdentifier!];
		if (!isDefined(plotNumber)) return false;
		if (!availablePlots.includes(plotNumber)) availablePlots.push(plotNumber);
		availablePlots.sort();
		this.setCurrent(player, undefined);
		if (property) properties[plotNumberIdentifier!] = undefined;
		else scores[plotNumberIdentifier!] = undefined;
		plots.set(key, { availablePlots, currentIndex, hasBeenSubscribed });
		databases.queueSave('plots*API');
		return true;
	}
}





