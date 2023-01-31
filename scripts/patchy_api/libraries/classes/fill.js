import { BlockLocation, BlockType, BlockPermutation, system, BlockAreaSize } from "@minecraft/server";
import { content, overworld, sort3DVectors } from "../utilities.js";
/**
 * @typedef {Object} BlockOptions
 * @property {BlockType} type
 * @property {BlockPermutation} permutation
 */
/**
 * @typedef {Object} FillOptions
 * @property {{x: number, y: number, z: number}} location1
 * @property {{x: number, y: number, z: number}} location2
 * @property {BlockType | BlockOptions | (BlockType | BlockOptions)[]} blocks
 * @property {Number} hollow default?=0 which is solid and the number = thickness 
 * @property {Number} maxPlacementsPerTick default?=8192 and 0 is infinity
 * @property {BlockType} replace 
 */

function isVector3(target) {
	// content.warn(typeof target === 'object', !(target instanceof Array), 'x' in target, 'y' in target, 'z' in target);
	return typeof target === 'object' && !(target instanceof Array) && 'x' in target && 'y' in target && 'z' in target;
}
class Fill {
	constructor() {
		this.queue = [];
	}
	queuefill(fillOptions) {
		getGenerator();
	}
	/**
	 * @method check
	 * @param {FillOptions} fillOptions
	 * @private
	 */
	check(fillOptions) {
		const { location1, location2, blocks, hollow = 0, maxPlacementsPerTick = 512 } = fillOptions;
		if (!(fillOptions instanceof Object)) throw new Error('fillOptions at params[0] is not of type: Object!');

		if (!isVector3(location1)) throw new Error('location1 in fillOptions at params[0] is not of type: {x: number, y: number, z: number}!');

		if (!isVector3(location2)) throw new Error('location2 in fillOptions at params[0] is not of type: {x: number, y: number, z: number}!');

		if (!(blocks instanceof BlockType) && !(blocks instanceof Array) && !(blocks instanceof Object)) throw new Error('blocks at params[0] is not of type: Object, Array, or BlockType!');

		if (blocks instanceof Array) blocks.forEach((block, i) => {
			if (!(block instanceof BlockType) && !(block instanceof Object)) throw new Error(`blocks[${i}] in params[0] is not of type: Object or BlockType!`);

			if (block instanceof BlockType) return;
			const { type, permutation } = block;
			if (!(type instanceof BlockType)) throw new Error(`type in blocks[${i}] in fillOptions at params[0] is not of type: Object or BlockType!`);
			if (!(permutation instanceof BlockPermutation)) throw new Error(`permutation in blocks[${i}] in fillOptions at params[0] is not of type: Object or BlockType!`);
		});

		if (typeof hollow !== 'number') throw new Error('hollow in fillOptions at params[0] is not of type: Number!');
		if (typeof maxPlacementsPerTick !== 'number') throw new Error('maxPlacementsPerTick in fillOptions at params[0] is not of type: Number!');

	}
	/**
	 * @method getGenerator
	 * @param {FillOptions} fillOptions 
	 * @param {String} type 
	 * @returns {Generator<BlockLocation,undefined,BlockLocation>}
	 * @private
	 */
	getGenerator(fillOptions, type) {
		const { location1, location2, blocks, hollow = 0, maxPlacementsPerTick = 2048 } = fillOptions;
		const { x: x1, y: y1, z: z1 } = location1, { x: x2, y: y2, z: z2 } = location2;
		const length = x2 - x1 + 1, height = y2 - y1 + 1, width = z2 - z1 + 1;
		const area = width * length;
		const volume = area * height;
		// content.warn({ width, length, height, location1: { x1, y1, z1 }, location2: { x2, y2, z2 }, t: 'why nioweroirwuwru', area, volume });
		switch (type) {
			case 'circle':
				return function* () {
					for (let i = 0, x = x1, y = y1, z = z1; i < area; i++, x++) {
						if (x > length) x = x1, z++;
						// if (z > width) x = x1, y++;
						if (x - x1 > length / 2) continue;
						if (z - z1 > width / 2) continue;
						yield new BlockLocation(x, y, z);
					}
				};
			case 'box':

				return function* () {
					for (let i = 0, x = 0, y = 0, z = 0; i < volume; i++, x++) {
						if (x >= length) x = 0, z++;
						if (z >= width) z = 0, y++;
						yield new BlockLocation(x + x1, y + y1, z + z1);
					}
				};
			case 'sphere':
				return function* () {
					for (let i = 0, x = x1, y = y1, z = z1; i < volume; i++, x++) {
						if (x > length) x = x1, z++;
						if (z > width) x = x1, y++;
						if (Math.abs(x - x1) > length / 2) continue;
						if (Math.abs(z - z1) > width / 2) continue;
						if (Math.abs(y - y1) > height / 2) continue;
						yield new BlockLocation(x, y, z);
					}
				};
			case 'cylinder':
				return function* () {
					for (let i = 0, x = x1, y = y1, z = z1; i < volume; i++, x++) {
						if (x > length) x = x1, z++;
						if (z > width) x = x1, y++;
						if (x - x1 > length / 2) continue;
						if (z - z1 > width / 2) continue;
						yield new BlockLocation(x, y, z);
					}
				};
		}
	}
	/**
	 * @method fill
	 * @param {FillOptions} fillOptions
	 * @param {String} type
	 * @private
	 */
	fill(fillOptions, type) {

		const { location1, location2, blocks, hollow = 0, maxPlacementsPerTick = 8191, replace } = fillOptions;
		const generator = this.getGenerator(fillOptions, type);

		const iterator = generator();
		const blocksIsArray = blocks instanceof Array;

		function tick() {

			for (let i = 0; i < maxPlacementsPerTick; i++) {

				const current = iterator.next();
				// content.warn({ t: 'wdwwdwd', i, done: current.done, t2: 'why not work' });
				if (current.done) return;

				/**
				 * @type {BlockLocation}
				 */
				const blockLocation = current.value;
				const { x, y, z } = blockLocation;
				// content.warn({ x, y, z });
				let blockOptions;
				if (blocksIsArray) {
					blockOptions = blocks[Math.floor(Math.random() * blocks.length)];
				} else {
					blockOptions = blocks;
				}
				const block = overworld.getBlock(blockLocation);
				const blockType = (blockOptions instanceof BlockType) ? blockOptions : blockOptions.type;
				// content.warn({ replace: replace?.id, blockType: blockType.id, bool: blockOptions?.permutation instanceof BlockPermutation });
				if (replace && block.typeId !== replace.id) continue;
				block.setType(blockType);
				if (blockOptions instanceof BlockType) continue;
				if (!(blockOptions?.permutation instanceof BlockPermutation)) continue;
				block.setPermutation(blockOptions.permutation);
			}
			system.run(tick);
		}
		tick();
	};
	/**
	 * @pro
	 * @param {FillOptions} fillOptions 
	 */
	box(fillOptions) {
		// content.warn('ehhjwhjwd');
		this.check(fillOptions);
		// content.warn('wklkwdklwd');
		this.fill(fillOptions, 'box');
	}
	circle(fillOptions) {
		this.check(fillOptions);
		this.fill(fillOptions, 'circle');
	};
	sphere(fillOptions) {
		this.check(fillOptions);
		this.fill(fillOptions, 'sphere');
	};
	cylinder() {
		this.check(fillOptions);
		this.fill(fillOptions, 'cylinder');
	}
}
const fill = new Fill();
export default fill;