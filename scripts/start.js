import { system } from '@minecraft/server';
function startwodjopwpwdjwwpodjdwo() {
    console.warn(`-----------------------------------------------------------------------------------------------------------------------------------------------\n Start at ${(new Date().toString())}`);
}
startwodjopwpwdjwwpodjdwo();
system.beforeEvents.watchdogTerminate.subscribe((event) => {
    event.cancel = true;
});
// String.fromCodePoint(`0xF4${colors[progressColor]}${(i % barFramesCount).toString(16)}`)
// function* test() {
// 	let i = 0;
// 	while (true) {
// 		console.warn(i);
// 		if (i > 3) return;
// 		yield i++;
// 	}
// }
// for (const i of test()) {
// 	console.warn('loop', i);
// }
// world.events.blockBreak.subscribe(({ block, brokenBlockPermutation }) => {
// 	// console.warn(JSON.stringify({ blockId: block.typeId, brokenBlockPermutationId: brokenBlockPermutation.type.id }));
// 	block.setPermutation(brokenBlockPermutation);
// });
// const players = {};
// world.events.itemUseOn.subscribe(event => {
// 	const { source, lastPlaceLocation = event.getBlockLocation() } = event;
// 	const { id } = source;
// 	players[id] = lastPlaceLocation;
// });
// const blockFaceToNumber = {
// 	"down": 0,
// 	"east": 5,
// 	"north": 2,
// 	"south": 3,
// 	"up": 1,
// 	"west": 4,
// };
// function blockFaceToCoords(blockFace, { x, y, z }) {
// 	blockFace = blockFaceToNumber[blockFace];
// 	// content.warn({ blockFace });
// 	let location = [x, y, z];
// 	[
// 		[0, -1, 0],
// 		[0, 1, 0],
// 		[0, 0, -1],
// 		[0, 0, 1],
// 		[-1, 0, 0],
// 		[1, 0, 0]
// 	][blockFace].forEach((coord, i) => location[i] += coord);
// 	[x, y, z] = location;
// 	return { x, y, z };
// 	//return new Location(x,y,z);
// }
// world.events.beforeItemUseOn.subscribe(event => {
// 	const { blockFace, source, item } = event;
// 	const { id } = source;
// 	if (!players[id]) return console.warn('returned');
// 	const { x, y, z } = blockFaceToCoords(blockFace, players[id]);
// 	console.warn(JSON.stringify({ x, y, z }));
// 	if (x !== 207 || y !== 101) return;
// 	event.cancel = true;
// });
// world.events.playerSpawn.subscribe(({ player }) => {
// 	const keys = [];
// 	for (const key in player) {
// 		keys.push(key);
// 	}
// 	console.warn(JSON.stringify(keys));
// });
// world.events.beforeExplosion.subscribe((event) => {
// 	const { source, impactedBlocks } = event;
// 	const { location: { x, y, z } } = source;
// 	const impackedBlocksClone = Array.from(impactedBlocks);
// 	event.impactedBlocks = impackedBlocksClone.filter(({ x: bx, y: by, z: bz }) => Math.hypot(bx - x, by - y, bz - z) < 2);
// });
// import { world, Player, MinecraftBlockTypes, BlockLocation, ItemStack, MinecraftItemTypes, Container } from '@minecraft/server';
// const cropTypes = [
// 	MinecraftBlockTypes.wheat.id,
// 	MinecraftBlockTypes.carrots.id,
// 	MinecraftBlockTypes.potatoes.id,
// 	MinecraftBlockTypes.beetroot.id
// ];
// const cropItems = {
// 	[MinecraftBlockTypes.wheat.id]: new ItemStack(MinecraftItemTypes.wheat, 1),
// 	[MinecraftBlockTypes.carrots.id]: new ItemStack(MinecraftItemTypes.carrot, 1),
// 	[MinecraftBlockTypes.potatoes.id]: new ItemStack(MinecraftItemTypes.potato, 1),
// 	[MinecraftBlockTypes.beetroot.id]: new ItemStack(MinecraftItemTypes.beetroot, 1),
// };
// export function permutationClone(permutation) {
// 	const permutationProperties = [];
// 	/**
// 	 * @type {BlockPermutation}
// 	 */
// 	const blockPermutation = permutation;
// 	blockPermutation.getAllProperties().forEach(({ name, validValues, value }) => {
// 		permutationProperties.push({ name, validValues, value });
// 	});
// 	return permutationProperties;
// }
// world.events.itemUseOn.subscribe(({ source: player, blockLocation }) => {
// 	if (!(player instanceof Player)) return;
// 	const block = player.dimension.getBlock(blockLocation);
// 	console.warn(block?.type?.id, "hi", JSON.stringify(permutationClone(block.permutation)));
// 	if (!cropTypes.includes(block?.type?.id)) return;
// 	/**
// 	 * @type {Container}
// 	 */
// 	const container = player.getComponent("inventory").container;
// 	container.addItem(cropItems[block.typeId]);
// 	const type = block.type;
// 	block.setType(MinecraftBlockTypes.air);
// });
// import { world, MinecraftEntityTypes, Location } from '@minecraft/server';
// world.events.beforeItemUse.subscribe(({ source, item }) => {
// 	console.warn(JSON.stringify({ source: source.typeId, item: item.typeId }));
// });
// /**
//  * @type {string[]}
//  */
// const entityTypeIds = Object.entries(MinecraftEntityTypes).map(([key, { id }]) => id);
// // console.warn(entityTypeIds);
// const excludes = [
// 	MinecraftEntityTypes.wither.id,
// 	MinecraftEntityTypes.enderDragon.id,
// 	MinecraftEntityTypes.tnt.id,
// 	MinecraftEntityTypes.tntMinecart.id,
// 	MinecraftEntityTypes.enderCrystal.id
// ];
// world.events.beforeExplosion.subscribe(({ source }) => {
// 	world.sendMessage(source.typeId);
// });
// world.events.beforeChat.subscribe(({ sender }) => {
// 	const { location: { x, y, z }, dimension } = sender;
// 	const couldNotSpawn = [];
// 	entityTypeIds.forEach(id => {
// 		if (excludes.includes(id)) return;
// 		try {
// 			dimension.spawnEntity(id, {x: x, y: y, z: z});
// 		} catch (error) {
// 			couldNotSpawn.push(id);
// 			// console.warn( error, error.stack);
// 		}
// 	});
// 	console.warn(JSON.stringify(couldNotSpawn));
// });
// import { world, Player, MinecraftItemTypes, BlockLocation } from '@minecraft/server';
// world.events.tick.subscribe(() => {
//     world.sendMessage("hello there!");
// });
// const xyz = ['x', 'y', 'z'];
// const proto = Object.keys(Object.getPrototypeOf({}));
// world.events.tick.subscribe(() => {
// 	world.getAllPlayers().forEach((player) => {
// 		console.warn(player.location.constructor.name);
// 	});
// });
// import { BlockLocation, world, BlockPermutation } from "@minecraft/server";
// export const content = {
// 	warn(...messages) {
// 		console.warn(messages.map(message => JSON.stringify(message, (key, value) => (value instanceof Function) ? '<f>' : value)).join(' '));
// 	}
// };
// const overworld = world.getDimension('overworld');
// function permutationClone(permutation) {
// 	const permutationProperties = [];
// 	/**
// 	 * @type {BlockPermutation}
// 	 */
// 	const blockPermutation = permutation;
// 	blockPermutation.getAllProperties().forEach(({ name, validValues, value }) => {
// 		permutationProperties.push({ name, validValues, value });
// 	});
// 	return permutationProperties;
// }
// world.events.tick.subscribe(() => {
// 	const block = overworld.getBlock({x: 187, y:  105 z:  228));
// 	content.warn(permutationClone(block.permutation));
// });
// const prefix = "!";
// world.events.tick.subscribe((tickevent) => {
// });
// world.events.beforeChat.subscribe((data) => {
// 	const { message, sender } = data;
// 	const isAdmin = sender.hasTag("Admin");
// 	const args = (message.substring(prefix.length).replace(/@(?=\w{2,})/g, '').trim().replace(/ {2,}/g, ' ').match(/".*?"|[\S]+/g) ?? []).map(item => item.replaceAll('"', '')) ?? [];
// 	const command = args.shift();
// 	content.warn({ args });
// 	data.cancel = true;
// 	switch (command) {
// 		case 'h':
// 		case 'help':
// 			data.sender.tell(
// 				`§l§7------------
//                 :arrow_forward:§2Page §a1§7/§a5
//                 §7------------
//                 §f!help | Shows a menu to help you
//                 !update | tells you what we changed in the update
//                 !report | the player you chose you must have clip`);
// 			return;
// 		case 'b':
// 		case 'ban': {
// 			// try {
// 			if (!isAdmin) return sender.tell('your not admin');
// 			// content.warn(player.args[0);
// 			const player = [...world.getPlayers({ name: args[0] })][0];
// 			if (!player) return sender.tell(`Player: ${args[0]}, does not exist!`);
// 			player.addTag('Bannnnnnnnn');
// 			// } catch (error) {
// 			// 	console.warn(error, error.stack);
// 			// }
// 		}
// 	}
// });
// import { system, Player, world, MinecraftBlockTypes, BlockLocation, Block, BlockPermutation } from '@minecraft/server';
// const object = { help: 8, heloo: 9, hejkekj: 8 };
// Object.entries(object).forEach(([key, value]) => {
// 	console.warn(JSON.stringify({ [key]: value }));
// });
// system.events.beforeWatchdogTerminate.subscribe(data => {
// 	data.cancel = true;
// });
// const blockFaceToNumber = {
// 	"down": 0,
// 	"east": 5,
// 	"north": 2,
// 	"south": 3,
// 	"up": 1,
// 	"west": 4,
// };
// const numberToBlockFace = {
// 	0: 'down',
// 	1: 'up',
// 	2: "north",
// 	3: "south",
// 	4: "west",
// 	5: "east"
// };
// export function blockFaceToCoords(blockFace, { x, y, z }) {
// 	blockFace = blockFaceToNumber[blockFace];
// 	// content.warn({ blockFace });
// 	let location = [x, y, z];
// 	[
// 		[0, -1, 0],
// 		[0, 1, 0],
// 		[0, 0, -1],
// 		[0, 0, 1],
// 		[-1, 0, 0],
// 		[1, 0, 0]
// 	][blockFace].forEach((coord, i) => location[i] += coord);
// 	[x, y, z] = location;
// 	console.warn(location);
// 	return {x: x, y:  y z:  z);
// 	//return {x: x, y: y, z: z};
// }
// const clickableBlocks = [
// 	"minecraft:acacia_door",
// 	"minecraft:acacia_trapdoor",
// 	"minecraft:acacia_button",
// 	"minecraft:birch_door",
// 	"minecraft:birch_trapdoor",
// 	"minecraft:birch_button",
// 	"minecraft:crimson_door",
// 	"minecraft:crimson_trapdoor",
// 	"minecraft:crimson_button",
// 	"minecraft:dark_oak_door",
// 	"minecraft:dark_oak_trapdoor",
// 	"minecraft:dark_oak_button",
// 	"minecraft:jungle_door",
// 	"minecraft:jungle_trapdoor",
// 	"minecraft:jungle_button",
// 	"minecraft:mangrove_door",
// 	"minecraft:mangrove_trapdoor",
// 	"minecraft:mangrove_button",
// 	"minecraft:spruce_door",
// 	"minecraft:spruce_trapdoor",
// 	"minecraft:spruce_button",
// 	"minecraft:warped_door",
// 	"minecraft:warped_trapdoor",
// 	"minecraft:warped_button",
// 	"minecraft:wooden_door",
// 	"minecraft:wooden_button",
// 	"minecraft:trapdoor",
// 	"minecraft:iron_door",
// 	"minecraft:iron_trapdoor",
// 	"minecraft:polished_blackstone_button",
// 	"minecraft:lever",
// 	"minecraft:chest",
// 	"minecraft:ender_chest",
// 	"minecraft:barrel",
// 	"minecraft:trapped_chest",
// 	"minecraft:dispenser",
// 	"minecraft:dropper",
// 	"minecraft:furnace",
// 	"minecraft:blast_furnace",
// 	"minecraft:lit_furnace",
// 	"minecraft:lit_blast_furnace",
// 	"minecraft:hopper",
// 	"minecraft:shulker_box",
// 	"minecraft:undyed_shulker_box",
// 	"minecraft:lit_smoker",
// 	"minecraft:smoker"
// ];
// const allDirectionsRotationPlacement = (blockId) => (id, dimension, blockLocation, blockFace, source) => {
// 	dimension.getBlock(blockLocation).setType(MinecraftBlockTypes[blockId]);
// 	/**
// 	 * @type {Block}
// 	 */
// 	const block = dimension.getBlock(blockLocation);
// 	const { permutation } = block;
// 	console.warn(JSON.stringify(permutationClone(permutation)));
// 	const facing_direction = permutation.getProperty('facing_direction');
// 	facing_direction.value = reverseDirection[rotationToDirection(source.rotation)];
// 	block.setPermutation(permutation);
// 	console.warn(JSON.stringify({ t: 28282, [block.typeId]: permutationClone(block.permutation) }));
// };
// const ileagalPlacementActions = {
// 	'minecraft:mob_spawner': true,
// 	'spawn_egg': (id, dimension, blockLocation) => {
// 		dimension.spawnEntity(id.replace('_spawn_egg'), blockLocation);
// 	},
// 	'minecraft:lava_bucket': (id, dimension, blockLocation) => {
// 		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.lava);
// 	},
// 	'minecraft:water_bucket': (id, dimension, blockLocation) => {
// 		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.water);
// 	},
// 	'minecraft:cod_bucket': (id, dimension, blockLocation) => {
// 		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.water);
// 		dimension.spawnEntity('minecraft:cod', blockLocation);
// 	},
// 	'minecraft:salmon_bucket': (id, dimension, blockLocation) => {
// 		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.water);
// 		dimension.spawnEntity('minecraft:salmon', blockLocation);
// 	},
// 	'minecraft:pufferfish_bucket': (id, dimension, blockLocation) => {
// 		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.water);
// 		dimension.spawnEntity('minecraft:pufferfish', blockLocation);
// 	},
// 	'minecraft:tropical_fish_bucket': (id, dimension, blockLocation) => {
// 		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.water);
// 		dimension.spawnEntity('minecraft:tropical_fish', blockLocation);
// 	},
// 	'minecraft:axolotl_bucket': (id, dimension, blockLocation) => {
// 		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.water);
// 		dimension.spawnEntity('minecraft:axolotl', blockLocation);
// 	},
// 	'minecraft:tadpole_bucket': (id, dimension, blockLocation) => {
// 		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.water);
// 		dimension.spawnEntity('minecraft:tadpole', blockLocation);
// 	},
// 	'minecraft:hopper': (id, dimension, blockLocation, blockFace) => {
// 		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.hopper);
// 		/**
// 		 * @type {Block}
// 		 */
// 		const block = dimension.getBlock(blockLocation);
// 		const { permutation } = block;
// 		const facing_direction = permutation.getProperty('facing_direction');
// 		const face = reverseDirection[blockFace];
// 		if (face === 'up') return;
// 		facing_direction.value = face;
// 		block.setPermutation(permutation);
// 		console.warn(JSON.stringify({ t: 28282, [block.typeId]: permutationClone(block.permutation) }));
// 	},
// 	'minecraft:barrel': allDirectionsRotationPlacement('barrel'),
// 	'minecraft:dispenser': allDirectionsRotationPlacement('dispenser'),
// 	'minecraft:lit_furnace': allDirectionsRotationPlacement('furnace'),
// 	'minecraft:furnace': allDirectionsRotationPlacement('furnace'),
// 	'minecraft:shulker_box': allDirectionsRotationPlacement('shulkerBox'),
// 	'minecraft:undyed_shulker_box': allDirectionsRotationPlacement('undyedShulkerBox'),
// };
// const reverseDirection = {
// 	"down": "up",
// 	"east": "west",
// 	"north": "south",
// 	"south": "north",
// 	"up": "down",
// 	"west": "east"
// };
// function permutationClone(permutation) {
// 	const permutationProperties = [];
// 	/**
// 	 * @type {BlockPermutation}
// 	 */
// 	const blockPermutation = permutation;
// 	blockPermutation.getAllProperties().forEach(({ name, validValues, value }) => {
// 		permutationProperties.push({ name, validValues, value });
// 	});
// 	return permutationProperties;
// }
// world.events.beforeItemUseOn.subscribe((event) => {
// 	const { blockFace, blockLocation: blockLocationClickedOn, source, item } = event;
// 	// console.warn();
// 	const { dimension } = source;
// 	const blockClicked = dimension.getBlock(blockLocationClickedOn);
// 	console.warn(blockClicked.typeId);
// 	if (!item.typeId || clickableBlocks.includes(blockClicked.typeId)) return;
// 	if (!ileagalPlacementActions.hasOwnProperty(item.typeId)) return;
// 	event.cancel = true;
// 	const value = ileagalPlacementActions[item.typeId];
// 	console.warn(typeof value);
// 	if (value instanceof Function) {
// 		console.warn(JSON.stringify({ id: item.typeId }));
// 		value(item.typeId, dimension, blockFaceToCoords(blockFace, blockLocationClickedOn), blockFace, source);
// 	} else {
// 		const blockLocation = blockFaceToCoords(blockFace, blockLocationClickedOn);
// 		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.get(item.typeId));
// 	}
// });
// function rotationToDirection(rotation) {
// 	let { x, y } = rotation;
// 	x = (x / 45 + 2) | 0;
// 	y = ((y + 45) / 90 + 2) | 0;
// 	console.warn(x, y);
// 	if (x < 1) return 'up';
// 	else if ((x > 2)) return 'down';
// 	switch (y) {
// 		case 2:
// 			return 'south';
// 		case 4:
// 		case 0:
// 			return 'north';
// 		case 1:
// 			return 'east';
// 		case 3:
// 			return 'west';
// 	}
// };
// import { DynamicPropertiesDefinition, MinecraftEntityTypes, world } from "@minecraft/server";
// world.events.worldInitialize.subscribe((e) => {
// 	let def = new DynamicPropertiesDefinition();
// 	def.defineNumber("testprop");
// 	e.propertyRegistry.registerEntityTypeDynamicProperties(def, MinecraftEntityTypes.player);
// });
// class Time {
// 	constructor() {
// 	}
// 	/**
// 	 * @method start begin counting on the stored key
// 	 * @param {String} key
// 	 */
// 	start(key) {
// 		this[key] = this.now();
// 	}
// 	/**
// 	 * @method end end the counting on the stored key and returns the final value
// 	 * @param {String} key
// 	 * @returns {Number}
// 	 */
// 	end(key) {
// 		const time = this.get(key);
// 		delete this[key];
// 		return time;
// 	}
// 	/**
// 	 * @method get returns the current value stored on the counting key
// 	 * @param {String} key
// 	 * @returns {Number}
// 	 */
// 	get(key) {
// 		return Number(this.now() - this[key]);
// 	}
// 	/**
// 	 * @method now Data.now() fix worthless
// 	 * @param {String} key
// 	 * @returns {Number}
// 	 */
// 	now() {
// 		return (new Date()).getTime();
// 	}
// }
// const time = new Time();
// /**
//  * @function benchmark
//  * @param {() => {}} testFunction
//  * @param {Number} iterations
//  */
// function benchmark(testFunction, iterations = 100) {
// 	time.start('benchmark');
// 	for (let i = 0; i < iterations; i++) {
// 		testFunction;
// 	}
// 	const baseTime = time.end('benchmark');
// 	time.start('benchmark');
// 	for (let i = 0; i < iterations; i++) {
// 		testFunction();
// 	}
// 	const TotalTime = time.end('benchmark');
// 	const exeTime = TotalTime - baseTime;
// 	return { TotalTime, baseTime, exeTime, perI: exeTime / iterations };
// };
// let i = 0;
// world.events.tick.subscribe(() => {
// 	[...world.getPlayers()].forEach((player) => {
// 		if (i++ > 10 && i === 12) {
// 			try {
// 				player.runCommandAsync(`scoreboard objectives add rand dummy`);
// 			} catch (error) { }
// 			const rand = Math.round(Math.random() * 1000000);
// 			const execuetions = 100;
// 			const timeing = benchmark(() => {
// 				player.setDynamicProperty('testprop', rand);
// 				player.getDynamicProperty('testprop');
// 			}, execuetions);
// 			console.warn('prop', JSON.stringify(timeing));
// 			const timeing1 = benchmark(async () => {
// 				await player.runCommandAsync(`scoreboard players set @s rand ${rand}`);
// 				world.scoreboard.getObjective('rand').getScore(player.scoreboard);
// 			}, execuetions);
// 			console.warn('scoreboard', JSON.stringify(timeing1));
// 		}
// 	});
// });
// import { world, EntityEventOptions, MinecraftEntityTypes, MinecraftBlockTypes, BlockLocation } from "@minecraft/server";
// export function pathIsObject(pathArray, object, allowArrays) {
// 	if (!allowArrays) {
// 		// console.warn(`return typeof object?.${pathArray.join('?.')} === 'object' && !Array.isArray(object?.${pathArray.join('?.')})`);
// 		return new Function('object', `return typeof object?.${pathArray.join('?.')} === 'object' && !Array.isArray(object?.${pathArray.join('?.')})`)(object);
// 	} else {
// 		return new Function('object', `return typeof object?.${pathArray.join('?.')} === 'object'`)(object);
// 	}
// }
// export function pathIsSettable(pathArray, object, allowArrays) {
// 	const call = pathArray.slice(0, -1).every((key, i) => pathIsObject(pathArray.slice(0, -(i + 1)), object, allowArrays));
// 	if (pathArray.slice(0, -1).length) {
// 		return call;
// 	} else {
// 		return true;
// 	}
// }
// export function assignToPath(pathArray, object, value, allowArrays = false) {
// 	const mappedPathArray = pathArray.map(value => `[${(typeof value === 'number') ? value : `'${value}'`}]`);
// 	//   	// console.warn(mappedPathArray)
// 	//   // console.warn(pathIsSettable(mappedPathArray, object))
// 	if (pathIsSettable(mappedPathArray, object, allowArrays)) {
// 		// console.warn({ pathIsSettable: `object${mappedPathArray.join('')} = value; return object` });
// 		return new Function('object', 'value', `object${mappedPathArray.join('')} = value; return object`)(object, value);
// 	} else {
// 		let stop = false;
// 		pathArray.forEach((path, i) => {
// 			const newPathArray = mappedPathArray.slice(0, i + 1);
// 			// // console.warn(newPathArray);
// 			if (!stop && !pathIsObject(newPathArray, object, allowArrays)) {
// 				// // console.warn(`object${newPathArray.join('')} = {}; return object`);
// 				object = new Function('object', `object${newPathArray.join('')} = {}; return object`)(object);
// 			} else if (!stop && pathIsSettable(newPathArray, object, allowArrays)) {
// 				return;
// 			} else {
// 				stop = true;
// 			}
// 			// // console.warn('obj', object);
// 		});
// 		if (!stop) {
// 			return assignToPath(pathArray, object, value, allowArrays);
// 		}
// 	}
// }
// const native = {
// 	typeOf(input) {
// 		switch (typeof input) {
// 			case 'object': {
// 				return (Array.isArray(input)) ? 'array' : 'object';
// 			}
// 			default: {
// 				return typeof input;
// 			}
// 		}
// 	},
// 	toConstructed(type) {
// 		switch (type) {
// 			case "object": {
// 				return {};
// 			} case "array": {
// 				return [];
// 			} default: {
// 				return false;
// 			}
// 		}
// 	},
// 	toObject(input) {
// 		let output = this.toConstructed(this.typeOf(input));
// 		if (!output) { return input; }
// 		call(input, []);
// 		function call(input1, path) {
// 			// console.warn(path);
// 			switch (native.typeOf(input1)) {
// 				case "object": {
// 					for (const key in input1) {
// 						call(input1[key], [...path, key]);
// 					}
// 					break;
// 				} case "array": {
// 					output = assignToPath(path, output, [], true);
// 					input1.forEach((item, i) => {
// 						call(item, [...path, i]);
// 					});
// 					break;
// 				} case "function": {
// 					output = assignToPath(path, output, `function() { }`, true);
// 					break;
// 				} default: {
// 					output = assignToPath(path, output, input1, true);
// 					break;
// 				}
// 			}
// 		};
// 		return output;
// 	},
// 	stringify(input, replacer, spacing) {
// 		return JSON.stringify(this.toObject(input), replacer, spacing);
// 	}
// };
// world.events.entityHurt.subscribe(data => {
// 	const { hurtEntity: player } = data;
// 	const health = player.getComponent("health").current;
// 	if (health > 0) return;
// 	console.warn(health);
// }, { entityTypes: ["minecraft:player"] });
// export const content = {
// 	warn(...messages) {
// 		console.warn(messages.map(message => JSON.stringify(message)).join(' '));
// 	}
// };
// const blockFaceToNumber = {
// 	"down": 0,
// 	"east": 5,
// 	"north": 2,
// 	"south": 3,
// 	"up": 1,
// 	"west": 4,
// };
// export function blockFaceToCoords(blockFace, { x, y, z }) {
// 	blockFace = blockFaceToNumber[blockFace];
// 	content.warn({ blockFace });
// 	let location = [x, y, z];
// 	[
// 		[0, -1, 0],
// 		[0, 1, 0],
// 		[0, 0, -1],
// 		[0, 0, 1],
// 		[-1, 0, 0],
// 		[1, 0, 0]
// 	][blockFace].forEach((coord, i) => location[i] += coord);
// 	[x, y, z] = location;
// 	return {x: x, y:  y z:  z);
// 	//return {x: x, y: y, z: z};
// }
// const ileagalPlacementActions = {
// 	'minecraft:mob_spawner': true,
// 	'spawn_egg': (id, dimension, blockLocation) => {
// 		dimension.spawnEntity(id.replace('_spawn_egg'), blockLocation);
// 	},
// 	'minecraft:lava_bucket': (id, dimension, blockLocation) => {
// 		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.lava);
// 	},
// 	'minecraft:water_bucket': (id, dimension, blockLocation) => {
// 		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.water);
// 	},
// 	'minecraft:cod_bucket': (id, dimension, blockLocation) => {
// 		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.water);
// 		dimension.spawnEntity('minecraft:cod', blockLocation);
// 	},
// 	'minecraft:salmon_bucket': (id, dimension, blockLocation) => {
// 		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.water);
// 		dimension.spawnEntity('minecraft:salmon', blockLocation);
// 	},
// 	'minecraft:pufferfish_bucket': (id, dimension, blockLocation) => {
// 		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.water);
// 		dimension.spawnEntity('minecraft:pufferfish', blockLocation);
// 	},
// 	'minecraft:tropical_fish_bucket': (id, dimension, blockLocation) => {
// 		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.water);
// 		dimension.spawnEntity('minecraft:tropical_fish', blockLocation);
// 	},
// 	'minecraft:axolotl_bucket': (id, dimension, blockLocation) => {
// 		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.water);
// 		dimension.spawnEntity('minecraft:axolotl', blockLocation);
// 	},
// 	'minecraft:tadpole_bucket': (id, dimension, blockLocation) => {
// 		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.water);
// 		dimension.spawnEntity('minecraft:tadpole', blockLocation);
// 	},
// 	'minecraft:bee_nest': true,
// 	'minecraft:beehive': true,
// 	'minecraft:moving_block': false
// };
// const ileagalPlacements = Object.keys(ileagalPlacementActions);
// world.events.beforeItemUseOn.subscribe((event) => {
// 	const { blockFace, blockLocation: blockLocationClickedOn, source, item } = event;
// 	const { dimension } = source;
// 	content.warn({ id: item.typeId, name: source.name });
// 	if (!item) return;
// 	const placementId = ileagalPlacements.find(id => item.typeId.includes(id));
// 	if (!placementId) return;
// 	event.cancel = true;
// 	const value = ileagalPlacementActions[placementId];
// 	const blockLocation = blockFaceToCoords(blockFace, blockLocationClickedOn);
// 	if (value instanceof Function) {
// 		value(item.typeId, dimension, blockLocation);
// 	} else {
// 		if (value) dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.get(item.typeId));
// 	}
// });
// const playersBS = {};
// // world.events.playerJoin.subscribe(({ player }) => {
// // 	const { id } = player;
// // 	playersBS[id] = {};
// // 	for (const key in player) {
// // 		const value = player[key];
// // 		if (value instanceof Function) continue;
// // 		playersBS[id][key] = value;
// // 	}
// // 	playersBS[id].inventory = player.getComponent('inventory').container;
// // 	playersBS[id] = player;
// // 	content.warn(Object.entries(playersBS).map(([id, { name }]) => name));
// // });
// // world.events.playerLeave.subscribe(() => {
// // 	const currentIds = [...world.getPlayers()].map(({ id }) => id);
// // 	/**
// // 	 * @type {Player}
// // 	 */
// // 	const player = Object.entries(playersBS).find(([id]) => !currentIds.includes(id));
// // 	const { inventory, dimension, location, name } = player;
// // 	content.warn({ name });
// // 	for (let i = 0; i < inventory.size; i++) {
// // 		const item = inventory.getItem(i);
// // 		if (!item) return;
// // 		dimension.spawnItem(item, location);
// // 	}
// // });
// world.events.tick.subscribe(async () => {
// 	const json = { rawtext: [{ text: '/tellraw: ' }, { translate: "patchy.hello", with: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ text: "man" }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] };
// 	await world.getDimension('overworld').runCommandAsync(`tellraw @a ${JSON.stringify(json)}`);
// 	json.rawtext[0].text = 'world.sendMessage: ';
// 	world.sendMessage(json);
// });
// [{ rawtext: [{ translate: "patchy.hello", with: [{ rawtext: [{ text: "man" }] }] }] }];
//# sourceMappingURL=start.js.map