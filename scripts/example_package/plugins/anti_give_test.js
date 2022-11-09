import { world, Player, Location, InventoryComponentContainer, EnchantmentList, Enchantment, MinecraftBlockTypes } from '@minecraft/server';
import { native, overworld, time, blockFaceToCoords, content, formBuilder } from '../../patchy_api/modules.js';
const global = {};
global.players = {};
const maxCord = 30000000;
world.events.tick.subscribe(() => {
	Array.from(world.getPlayers(), (player) => {
		const { location, name, rotation, dimension } = player;
		const { x, y, z } = location;
		if (!global.players.hasOwnProperty[name]) global.players[name] = {};
		let { lastLocation = new Location(0, 100, 0), lastRotation: { x: lrx, y: lry } = rotation } = global.players[name];
		const { x: lx, y: ly, z: lz } = lastLocation;
		if (Math.abs(lx) > maxCord || Math.abs(ly) > maxCord || Math.abs(lz) > maxCord) {
			lastLocation = new Location(0, 100, 0);
			console.warn('why');
		};
		if (Math.abs(x) > maxCord || Math.abs(y) > maxCord || Math.abs(z) > maxCord) {
			player.teleport(lastLocation, dimension, lrx, lry);
		}
		// console.warn(JSON.stringify({ lastLocation: { x: lastLocation.x, y: lastLocation.y, z: lastLocation.z }, location: { x, y, z }, test: lastLocation.equals(location) }));
		Object.assign(global.players[name], { lastLocation: location, lastRotation: rotation });
	});
});
const arrays = [[], [], [], []];
const deltaTimeArray = [];
world.events.tick.subscribe(({ deltaTime }) => {
	deltaTimeArray.push(deltaTime);
	if (deltaTimeArray.length > 100) deltaTimeArray.shift();
	const tps = 1 / (deltaTimeArray.reduce((s, c) => s + c) / deltaTimeArray.length);
	// console.warn(JSON.stringify({ tps: (tps >= 20) ? 19.99 : tps.toFixed(2) }));
	[...world.getPlayers()].forEach((player) => {
		const { selectedSlot } = player;
		/**
		 * @type InventoryComponentContainer
		 */

		const inventory = player.getComponent('inventory').container;
		// if (inventory.size === inventory.emptySlotsCount) return;
		// console.warn(inventory.size, inventory().emptySlotsCount);
		for (let i = 0; i < inventory.size; i++) {
			const item = inventory.getItem(i);
			if (!item) continue;
			// if (item.id === 'minecraft:mob_spawner') {
			// 	inventory.setItem(i, Object.assign(item, { amount: 0 }));
			// 	continue;
			// }
			let changed;
			/**
			 * @type EnchantmentList
			 */
			const enchantmentList = item.getComponent('minecraft:enchantments').enchantments;
			[...enchantmentList].forEach((enchantment) => {
				const { level, type } = enchantment;
				const { id, maxLevel } = type;
				if (level > maxLevel) {
					// console.warn(item.id, id, level);
					changed = true;
					enchantmentList.removeEnchantment(type);
				}
			});
			if (changed) {
				let enchantmentListNew = item.getComponent('minecraft:enchantments');
				enchantmentListNew.enchantments = enchantmentList;
				inventory.setItem(i, item);
			}


		}
	});
});

// console.warn(time.end('test'));
const excludedEntities = [
	'patches:database',
	'minecraft:player',
	'minecraft:item',
	'minecraft:ender_pearl',
	'minecraft:egg',
	'minecraft:trident',
	'minecraft:arrow',
	'minecraft:splash_potion',
	'minecraft:fishing_hook',
	'minecraft:tnt',
	'minecraft:falling_block'
];
const ileagalEntities = [
	'minecraft:command_block_minecart',
	'minecraft:moving_block',
	'minecraft:npc'
];

// const randomNumber = Math.floor(Math.random() * 1000000);
world.events.beforeItemUseOn.subscribe((events) => {

});
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
const exemptedBlocks = [
	'minecraft:shulker_box',
	'minecraft:undyed_shulker_box'
];
const ileagalBlocks = [
	'minecraft:mob_spawner'
];


world.events.beforeItemUseOn.subscribe((event) => {
	const { blockFace, blockLocation: blockLocationClickedOn, source, item } = event;
	const { dimension } = source;
	if (ileagalBlocks.includes(item.id)) {
		event.cancel = true;
		const blockLocation = blockFaceToCoords(blockFace, blockLocationClickedOn);
		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.get(item.id));
	}
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

world.events.beforeItemUse.subscribe(({ item, source }) => {
	if (item.typeId !== 'minecraft:compass') return;
	formBuilder.show(source, 'test', source.id);
});

// world.events.beforeDataDrivenEntityTriggerEvent.subscribe(),
