import { blockFaceToCoords, eventBuilder, players, permutationClone, content } from "../../../../patchy_api/modules.js";
import placements from "./placements.js";
import clickableBlocks from "./clickable_blocks.js";
import discipline from '../../../libraries/discipline.js';
import { Container, MinecraftBlockTypes, system } from "@minecraft/server";

eventBuilder.subscribe('nbt', {
	beforeItemUseOn: (event) => {
		const { source, blockFace, blockLocation, item, } = event;
		const { dimension, isSneaking } = source;
		const { typeId } = item;
		const blockUsedOn = dimension.getBlock(blockLocation);
		const { typeId: blockId } = blockUsedOn;
		if (clickableBlocks.includes(blockId) && !isSneaking) return;
		const placeBlockLocation = blockFaceToCoords(blockFace, blockLocation);
		if (!placements.hasOwnProperty(typeId)) return;
		const { [typeId]: action } = placements;
		switch (typeof action) {
			case "function":
				event.cancel = true;
				action(dimension, placeBlockLocation, blockFace, source);
				break;
			case "boolean":
				event.cancel = true;
				system.run(() => mainHand.amount--);
				if (!action) return;
				dimension.getBlock(placeBlockLocation).setType(MinecraftBlockTypes.get(item.typeId));
				break;
			case "number":
				discipline.check(source, `§4placed §1${typeId}`, "nbt", action);
				event.cancel = true;
				system.run(() => mainHand.amount--);
				break;
		}
		const { mainHand } = source;

	},
	blockPlace: ({ block, player, dimension }) => {
		const { scores } = player;
		if (scores.staff) return;
		const { typeId: blockId } = block;
		if (blockId !== MinecraftBlockTypes.chest.id && blockId !== MinecraftBlockTypes.trappedChest.id) return;
		const { permutation } = block;
		const facingDirection = permutation.getProperty('facing_direction');
		const { value } = facingDirection;
		content.warn({ value });
		let flag = true;
		switch (value) {

			case "west": {

				const left = dimension.getBlock(block.location.offset(0, 0, -1));
				if (left.typeId === blockId && left.permutation.getProperty('facing_direction').value === value) {
					/**
					 * @type {{container: Container}}
					 */
					const { container } = block.getComponent('inventory');
					system.run(() => {
						for (let i = 27; i < container.size; i++) {
							const item = container.getItem(i);
							if (!item) continue;
							flag = true;
							container.setItem(i, Object.assign(item, { amount: 0 }));
						}
					});
					break;
				}
				const right = dimension.getBlock(block.location.offset(0, 0, 1));
				if (right.typeId === blockId && right.permutation.getProperty('facing_direction').value === value) {
					/**
					 * @type {{container: Container}}
					 */
					const { container } = block.getComponent('inventory');
					system.run(() => {
						for (let i = 27; i < container.size; i++) {
							const item = container.getItem(i);
							if (!item) continue;
							flag = true;
							container.setItem(i, Object.assign(item, { amount: 0 }));
						}
					});
					break;
				}
				/**
				 * @type {{container: Container}}
				 */
				const { container } = block.getComponent('inventory');
				system.run(() => {
					for (let i = 0; i < 27; i++) {
						const item = container.getItem(i);
						if (!item) continue;
						flag = true;
						container.setItem(i, Object.assign(item, { amount: 0 }));
					}
				});
				break;
			} case "east": {
				const right = dimension.getBlock(block.location.offset(0, 0, 1));
				if (right.typeId === blockId && right.permutation.getProperty('facing_direction').value === value) {
					/**
					 * @type {{container: Container}}
					 */
					const { container } = block.getComponent('inventory');
					system.run(() => {
						for (let i = 27; i < container.size; i++) {
							const item = container.getItem(i);
							if (!item) continue;
							flag = true;
							container.setItem(i, Object.assign(item, { amount: 0 }));
						}
					});
					break;
				}
				const left = dimension.getBlock(block.location.offset(0, 0, -1));
				if (left.typeId === blockId && left.permutation.getProperty('facing_direction').value === value) {
					/**
					 * @type {{container: Container}}
					 */
					const { container } = block.getComponent('inventory');
					system.run(() => {
						for (let i = 27; i < container.size; i++) {
							const item = container.getItem(i);
							if (!item) continue;
							flag = true;
							container.setItem(i, Object.assign(item, { amount: 0 }));
						}
					});
					break;
				}
				/**
				 * @type {{container: Container}}
				 */
				const { container } = block.getComponent('inventory');
				system.run(() => {
					for (let i = 0; i < 27; i++) {
						const item = container.getItem(i);
						if (!item) continue;
						flag = true;
						container.setItem(i, Object.assign(item, { amount: 0 }));
					}
				});
				break;
			} case "south": {
				const right = dimension.getBlock(block.location.offset(1, 0, 0));
				if (right.typeId === blockId && right.permutation.getProperty('facing_direction').value === value) {
					/**
					 * @type {{container: Container}}
					 */
					const { container } = block.getComponent('inventory');
					system.run(() => {
						for (let i = 27; i < container.size; i++) {
							const item = container.getItem(i);
							if (!item) continue;
							flag = true;
							container.setItem(i, Object.assign(item, { amount: 0 }));
						}
					});
					break;
				}
				const left = dimension.getBlock(block.location.offset(-1, 0, 0));
				if (left.typeId === blockId && left.permutation.getProperty('facing_direction').value === value) {
					/**
					 * @type {{container: Container}}
					 */
					const { container } = block.getComponent('inventory');
					system.run(() => {
						for (let i = 27; i < container.size; i++) {
							const item = container.getItem(i);
							if (!item) continue;
							flag = true;
							container.setItem(i, Object.assign(item, { amount: 0 }));
						}
					});
					break;
				}
				/**
				 * @type {{container: Container}}
				 */
				const { container } = block.getComponent('inventory');
				system.run(() => {
					for (let i = 0; i < 27; i++) {
						const item = container.getItem(i);
						if (!item) continue;
						flag = true;
						container.setItem(i, Object.assign(item, { amount: 0 }));
					}
				});
				break;
			}
			case "north": {
				const left = dimension.getBlock(block.location.offset(-1, 0, 0));
				if (left.typeId === blockId && left.permutation.getProperty('facing_direction').value === value) {
					/**
					 * @type {{container: Container}}
					 */
					const { container } = block.getComponent('inventory');
					system.run(() => {
						for (let i = 27; i < container.size; i++) {
							const item = container.getItem(i);
							if (!item) continue;
							flag = true;
							container.setItem(i, Object.assign(item, { amount: 0 }));
						}
					});
					break;
				}
				const right = dimension.getBlock(block.location.offset(1, 0, 0));
				if (right.typeId === blockId && right.permutation.getProperty('facing_direction').value === value) {
					/**
					 * @type {{container: Container}}
					 */
					const { container } = block.getComponent('inventory');
					system.run(() => {
						for (let i = 27; i < container.size; i++) {
							const item = container.getItem(i);
							if (!item) continue;
							flag = true;
							container.setItem(i, Object.assign(item, { amount: 0 }));
						}
					});
					break;
				}
				/**
				 * @type {{container: Container}}
				 */
				const { container } = block.getComponent('inventory');
				system.run(() => {
					for (let i = 0; i < 27; i++) {
						const item = container.getItem(i);
						if (!item) continue;
						flag = true;
						container.setItem(i, Object.assign(item, { amount: 0 }));
					}
				});
				break;
			}
		}
		if (!flag) return;
		discipline.check(player, "§4failed §1Chest NBT", "nbt");

	}
});