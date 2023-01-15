import { BlockLocation, Block, Dimension, Player, MinecraftBlockTypes, MinecraftItemTypes, system, ItemStack } from "@minecraft/server";
import { rotationToDirection, permutationClone } from '../../../../patchy_api/modules.js';

const bucket = new ItemStack(MinecraftItemTypes.bucket, 1, 0);
const reverseDirection = {
	"down": "up",
	"east": "west",
	"north": "south",
	"south": "north",
	"up": "down",
	"west": "east"
};
function rotationToDirection(rotation) {
	let { x, y } = rotation;

	x = (x / 45 + 2) | 0;
	y = ((y + 45) / 90 + 2) | 0;
	console.warn(x, y);
	if (x < 1) return 'up';
	else if ((x > 2)) return 'down';
	switch (y) {
		case 2:
			return 'south';
		case 4:
		case 0:
			return 'north';
		case 1:
			return 'east';
		case 3:
			return 'west';
	}
};
const allDirectionsRotationPlacement = (blockId) => (dimension, blockLocation, blockFace, source) => {

	dimension.getBlock(blockLocation).setType(MinecraftBlockTypes[blockId]);
	/**
	 * @type {Block}
	 */
	const block = dimension.getBlock(blockLocation);
	const { permutation } = block;
	const facing_direction = permutation.getProperty('facing_direction');
	facing_direction.value = reverseDirection[rotationToDirection(source.rotation)];
	block.setPermutation(permutation);
	const { mainHand } = source;
	system.run(() => mainHand.amount--);
};



/**
 * @type {{[key: string]: ((dimension: Dimension, blockLocation: BlockLocation, blockFace: String, source: Player) => {}) | boolean | number} }
 */
export default ({
	"minecraft:caldron": true,
	'minecraft:flower_pot': true,
	'minecraft:beehive': true,
	'minecraft:bee_nest': true,
	'minecraft:moving_block': 3,
	'minecraft:mob_spawner': true,
	'spawn_egg': (dimension, blockLocation, blockFace, source) => {
		dimension.spawnEntity(id.replace('_spawn_egg'), blockLocation);
		const { mainHand } = source;
		system.run(() => mainHand.amount--);
	},
	'minecraft:lava_bucket': (dimension, blockLocation, blockFace, source) => {
		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.flowingLava);
		const { mainHand, container } = source;
		system.run(() => (mainHand.amount--, container.addItem(bucket)));
	},
	'minecraft:water_bucket': (dimension, blockLocation, blockFace, source) => {
		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.flowingWater);
		const { mainHand, container } = source;
		system.run(() => (mainHand.amount--, container.addItem(bucket)));
	},
	'minecraft:cod_bucket': (dimension, blockLocation, blockFace, source) => {
		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.flowingWater);
		dimension.spawnEntity('minecraft:cod', blockLocation);
		const { mainHand, container } = source;
		system.run(() => (mainHand.amount--, container.addItem(bucket)));
	},
	'minecraft:salmon_bucket': (dimension, blockLocation, blockFace, source) => {
		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.flowingWater);
		dimension.spawnEntity('minecraft:salmon', blockLocation);
		const { mainHand, container } = source;
		system.run(() => (mainHand.amount--, container.addItem(bucket)));
	},
	'minecraft:pufferfish_bucket': (dimension, blockLocation, blockFace, source) => {
		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.flowingWater);
		dimension.spawnEntity('minecraft:pufferfish', blockLocation);
		const { mainHand, container } = source;
		system.run(() => (mainHand.amount--, container.addItem(bucket)));
	},
	'minecraft:tropical_fish_bucket': (dimension, blockLocation, blockFace, source) => {
		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.flowingWater);
		dimension.spawnEntity('minecraft:tropical_fish', blockLocation);
		const { mainHand, container } = source;
		system.run(() => (mainHand.amount--, container.addItem(bucket)));
	},
	'minecraft:axolotl_bucket': (dimension, blockLocation, blockFace, source) => {
		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.flowingWater);
		dimension.spawnEntity('minecraft:axolotl', blockLocation);
		const { mainHand, container } = source;
		system.run(() => (mainHand.amount--, container.addItem(bucket)));
	},
	'minecraft:tadpole_bucket': (dimension, blockLocation, blockFace, source) => {
		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.flowingWater);
		dimension.spawnEntity('minecraft:tadpole', blockLocation);
		const { mainHand, container } = source;
		system.run(() => (mainHand.amount--, container.addItem(bucket)));
	},
	'minecraft:hopper': (dimension, blockLocation, blockFace, source) => {

		dimension.getBlock(blockLocation).setType(MinecraftBlockTypes.hopper);
		/**
		 * @type {Block}
		 */
		const block = dimension.getBlock(blockLocation);
		const { permutation } = block;
		const facing_direction = permutation.getProperty('facing_direction');
		const face = reverseDirection[blockFace];
		if (face === 'up') return;
		facing_direction.value = face;
		block.setPermutation(permutation);
		console.warn(JSON.stringify({ t: 28282, [block.typeId]: permutationClone(block.permutation) }));
		const { mainHand } = source;
		system.run(() => mainHand.amount--);

	},
	'minecraft:barrel': allDirectionsRotationPlacement('barrel'),
	'minecraft:dispenser': allDirectionsRotationPlacement('dispenser'),
	'minecraft:lit_furnace': allDirectionsRotationPlacement('furnace'),
	'minecraft:furnace': allDirectionsRotationPlacement('furnace'),
	// 'minecraft:shulker_box': allDirectionsRotationPlacement('shulkerBox'),
	// 'minecraft:undyed_shulker_box': allDirectionsRotationPlacement('undyedShulkerBox'),
});