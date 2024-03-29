import { MinecraftBlockTypes, Block } from '@minecraft/server';
import { preformance, native, blockFaceToCoords, content, eventBuilder, players, time } from '../../patchy_api/modules.js';

import {
	MinecraftEnchantmentTypes,
	Container,
	EnchantmentList,
	Enchantment,
	world,
	system
} from "@minecraft/server";

const byPassTag = "admin";

system.run(function enchantCheck() {
	world.getAllPlayers().forEach((player) => {
		if (player.hasTag(byPassTag)) return;
		/**
		 * @type {{container: Container}}
		 */
		const { container } = player.getComponent("inventory");
		if (container.size === container.emptySlotsCount) return;
		for (let i = 0; i < container.size; i++) {
			const item = container.getItem(i);
			if (!item) continue;
			/**
			* @type {{enchantments: EnchantmentList}}
			 */
			const { enchantments } = item.getComponent("enchantments");
			const enchantmentIterator = enchantments[Symbol.iterator]();
			let set = false;
			// for (const enchant of enchantments) {
			for (let object = enchantmentIterator.next(); !object?.done; object = enchantmentIterator.next()) {
				/**
				 * @type {{value: Enchantment}}
				 */
				const { value: enchant } = object;
				const { type: { id, maxLevel }, level } = enchant;
				if (level <= maxLevel) continue;
				enchantments.removeEnchantment(enchant.type);
				item.getComponent("enchantments").enchantments = enchantments;
				set = true;
			}
			if (!set) continue;
			container.setItem(i, item);
		}
	});
	system.run(enchantCheck);
});
// eventBuilder.subscribe('anti32k', {
// 	playerJoined: ({ player }) => {
// 		// players.get().iterate((player) => {
// 		const { selectedSlot } = player;
// 		content.warn({ selectedSlot });
// 		/**
// 		 * @type {{container: Container}}
// 		 */
// 		const { container } = player.getComponent('inventory');
// 		const mainHand = container.getItem(selectedSlot);
// 		if (!mainHand) return;
// 		/**
// 		 * @type {{enchantments: EnchantmentList}}
// 		 */
// 		const { enchantments } = mainHand.getComponent('enchantments');
// 		const enchantmentIterator = enchantments[Symbol.iterator]();
// 		preformance.print(preformance.test({
// 			forOf: () => {
// 				for (const enchantment of enchantments) {
// 					enchantment;
// 				}
// 			},
// 			for: () => {
// 				for (let object = enchantmentIterator.next(); !object?.done; object = enchantmentIterator.next()) {
// 					object.value;
// 				}
// 			},
// 			while: () => {
// 				let object;
// 				while (!object?.done) {
// 					object = enchantmentIterator.next();
// 					object.value;
// 				}
// 			}
// 		}, 1000, enchantmentIterator));

// 		// });
// 	}

// });
const exemptedBlocks = [
	'minecraft:shulker_box',
	'minecraft:undyed_shulker_box'
];
const ileagalPlacementActions = {
	'minecraft:mob_spawner': true,
	'spawn_egg': (id, dimension, blockLocation) => {
		dimension.spawnEntity(id.replace('_spawn_egg'), blockLocation);
	},
	'minecraft:lava_bucket': (id, dimension, blockLocation) => {
		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.lava);
	},
	'minecraft:water_bucket': (id, dimension, blockLocation) => {
		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.water);
	},
	'minecraft:cod_bucket': (id, dimension, blockLocation) => {
		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.water);
		dimension.spawnEntity('minecraft:cod', blockLocation);
	},
	'minecraft:salmon_bucket': (id, dimension, blockLocation) => {
		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.water);
		dimension.spawnEntity('minecraft:salmon', blockLocation);
	},
	'minecraft:pufferfish_bucket': (id, dimension, blockLocation) => {
		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.water);
		dimension.spawnEntity('minecraft:pufferfish', blockLocation);
	},
	'minecraft:tropical_fish_bucket': (id, dimension, blockLocation) => {
		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.water);
		dimension.spawnEntity('minecraft:tropical_fish', blockLocation);
	},
	'minecraft:axolotl_bucket': (id, dimension, blockLocation) => {
		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.water);
		dimension.spawnEntity('minecraft:axolotl', blockLocation);
	},
	'minecraft:tadpole_bucket': (id, dimension, blockLocation) => {
		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.water);
		dimension.spawnEntity('minecraft:tadpole', blockLocation);
	},
	'minecraft:hopper': (id, dimension, blockLocation) => {
		/**
		 * @type {Block}
		 */
		const block = dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.hopper);


	}
};
const ileagalPlacements = Object.keys(ileagalPlacementActions);


world.events.beforeItemUseOn.subscribe((event) => {
	const { blockFace, blockLocation: blockLocationClickedOn, source, item } = event;
	const { dimension } = source;
	const placementId = ileagalPlacements.find(id => item.id.includes(id));
	if (!placementId) return;
	event.cancel = true;
	const value = ileagalPlacementActions[placementId];
	if (value instanceof Function) {
		value(id, dimension, blockLocationClickedOn);
	} else {
		const blockLocation = blockFaceToCoords(blockFace, blockLocationClickedOn);
		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.get(item.id));
	}
	content.warn({ id: item.id, placementId });
});

// const { block, dimension } = event;
// 	const { type, location: BlockLocation, permutation } = block;
// 	const { id: blockId } = type;
// 	if (!exemptedBlocks.includes(blockId)) {
// 		const block = dimension.getBlock(BlockLocation);
// 		block.setType(MinecraftBlockTypes.air);
// 		block.setType(type);
// 		block.setPermutation(permutation);
// 	}

// world.events.beforeItemUse.subscribe(({ item, source }) => {
// 	if (item.typeId !== 'minecraft:compass') return;
// 	formBuilder.show(source, 'test', source.id);
// });

// world.events.beforeDataDrivenEntityTriggerEvent.subscribe(),

// const chunkSize = 100;
// eventBuilder.subscribe('chunktest', {
// 	worldLoad: () => {
// 		time.start('test');
// 		const string = generateRandomString(1000000);
// 		const genTime = time.end('test');
// 		time.start('test');
// 		chunkString(string, chunkSize);
// 		const chunkStringTime = time.end('test');
// 		time.start('test');
// 		chunkStringRegex(string, chunkSize);
// 		const chunkStringRegexTime = time.end('test');
// 		content.warn({ t: 'chunkstring test in ms', chunkStringTime, chunkStringRegexTime, genTime, stringlength: string.length, chunkSize });
// 	}
// });
// const global = {};
// global.players = {};
// const maxCord = 30000000;
// world.events.tick.subscribe(() => {
// 	Array.from(world.getPlayers(), (player) => {
// 		const { location, name, rotation, dimension } = player;
// 		const { x, y, z } = location;
// 		if (!global.players.hasOwnProperty[name]) global.players[name] = {};
// 		let { lastLocation = {x: 0, y: 100, z: 0}, lastRotation: { x: lrx, y: lry } = rotation } = global.players[name];
// 		const { x: lx, y: ly, z: lz } = lastLocation;
// 		if (Math.abs(lx) > maxCord || Math.abs(ly) > maxCord || Math.abs(lz) > maxCord) {
// 			lastLocation = {x: 0, y: 100, z: 0};
// 			console.warn('why');
// 		};
// 		if (Math.abs(x) > maxCord || Math.abs(y) > maxCord || Math.abs(z) > maxCord) {
// 			player.teleport(lastLocation, dimension, lrx, lry);
// 		}
// 		// console.warn(JSON.stringify({ lastLocation: { x: lastLocation.x, y: lastLocation.y, z: lastLocation.z }, location: { x, y, z }, test: lastLocation.equals(location) }));
// 		Object.assign(global.players[name], { lastLocation: location, lastRotation: rotation });
// 	});
// });
// const arrays = [[], [], [], []];
// const deltaTimeArray = [];
// world.events.tick.subscribe(({ deltaTime }) => {
// 	deltaTimeArray.push(deltaTime);
// 	if (deltaTimeArray.length > 100) deltaTimeArray.shift();
// 	const tps = 1 / (deltaTimeArray.reduce((s, c) => s + c) / deltaTimeArray.length);
// 	// console.warn(JSON.stringify({ tps: (tps >= 20) ? 19.99 : tps.toFixed(2) }));
// 	[...world.getPlayers()].forEach((player) => {
// 		const { selectedSlot } = player;
// 		/**
// 		 * @type Container
// 		 */



// 		const inventory = player.getComponent('inventory').container;
// 		// if (inventory.size === inventory.emptySlotsCount) return;
// 		// console.warn(inventory.size, inventory().emptySlotsCount);
// 		for (let i = 0; i < inventory.size; i++) {
// 			const item = inventory.getItem(i);
// 			if (!item) continue;
// 			// if (item.id === 'minecraft:mob_spawner') {
// 			// 	inventory.setItem(i, Object.assign(item, { amount: 0 }));
// 			// 	continue;
// 			// }
// 			let changed;
// 			/**
// 			 * @type EnchantmentList
// 			 */
// 			const enchantmentList = item.getComponent('minecraft:enchantments').enchantments;
// 			[...enchantmentList].forEach((enchantment) => {
// 				const { level, type } = enchantment;
// 				const { id, maxLevel } = type;
// 				if (level > maxLevel) {
// 					// console.warn(item.id, id, level);
// 					changed = true;
// 					enchantmentList.removeEnchantment(type);
// 				}
// 			});
// 			if (changed) {
// 				let enchantmentListNew = item.getComponent('minecraft:enchantments');
// 				enchantmentListNew.enchantments = enchantmentList;
// 				inventory.setItem(i, item);
// 			}


// 		}
// 	});
// });

// // console.warn(time.end('test'));
// const excludedEntities = [
// 	'patches:database',
// 	'minecraft:player',
// 	'minecraft:item',
// 	'minecraft:ender_pearl',
// 	'minecraft:egg',
// 	'minecraft:trident',
// 	'minecraft:arrow',
// 	'minecraft:splash_potion',
// 	'minecraft:fishing_hook',
// 	'minecraft:tnt',
// 	'minecraft:falling_block'
// ];
// const ileagalEntities = [
// 	'minecraft:command_block_minecart',
// 	'minecraft:moving_block',
// 	'minecraft:npc'
// ];

// // const randomNumber = Math.floor(Math.random() * 1000000);
// world.events.beforeItemUseOn.subscribe((events) => {

// });
// world.events.entityCreate.subscribe(({ entity }) => {
// 	const { dimension, id: entityId, location, rotation } = entity;
// 	const length = [...dimension.getEntities()].length;
// 	const { x, z } = location;
// 	if (excludedEntities.includes(entityId) || entity.hasTag(`fixed`)) return;
// 	entity.teleport(new Location(x, -65, z), dimension, 0, 0);
// 	entity.kill();
// 	if (length > 300) return;
// 	if (!ileagalEntities.includes(entityId)) {
// 		try {
// 			const newEntity = dimension.spawnEntity(entityId, location);
// 			newEntity.addTag(`fixed`);
// 		} catch (error) {
// 			console.warn(`${error} - ${entityId} is broke`);
// 		}
// 	}
// });