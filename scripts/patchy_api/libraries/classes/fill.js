import { BlockType, BlockPermutation, system } from "@minecraft/server";
import { overworld, sort3DVectors } from "../utilities.js";
function isVector3(target) {
    // content.warn(typeof target === 'object', !(target instanceof Array), 'x' in target, 'y' in target, 'z' in target);
    return typeof target === 'object' && !(target instanceof Array) && 'x' in target && 'y' in target && 'z' in target;
}
class Fill {
    constructor() {
        this.queue = [];
        this.subscribed = false;
        this.nullId = 0;
    }
    subscribe() {
        if (this.subscribed)
            return new Error('how did you subscribe this again');
        const fillThis = this;
        function run() {
            system.run(async () => {
                try {
                    if (!fillThis.queue.length)
                        return;
                    run();
                    const { fillOptions, iterator, lastValueIfNullBlock = false } = fillThis.queue[0] ?? {};
                    const { location1, location2, blocks, hollow = 0, maxPlacementsPerTick = 2048, replace } = fillOptions ?? {};
                    const blocksIsArray = blocks instanceof Array;
                    for (let i = 0; i < maxPlacementsPerTick; i++) {
                        const current = (lastValueIfNullBlock) ? lastValueIfNullBlock : iterator.next();
                        // content.warn({ t: 'wdwwdwd', i, done: current.done, t2: 'why not work' });
                        if (current.done) {
                            fillThis.queue.shift(), await overworld.runCommandAsync(`tickingarea remove fillTickAPI`).catch(error => { });
                            break;
                        }
                        const { blockLocation, isFirstBlockOfChunk } = current.value;
                        const { x, y, z } = blockLocation;
                        if (isFirstBlockOfChunk) {
                            await overworld.runCommandAsync(`tickingarea remove fillTickAPI`).catch(error => { });
                            await overworld.runCommandAsync(`tickingarea add ${x} 0 ${z} ${x + 15} 0 ${z + 15} fillTickAPI true`).catch(error => { });
                        }
                        // content.warn({ x, y, z });
                        let blockOptions;
                        if (blocksIsArray) {
                            blockOptions = blocks[Math.floor(Math.random() * blocks.length)];
                        }
                        else {
                            blockOptions = blocks;
                        }
                        const block = overworld.getBlock(blockLocation);
                        if (!block) {
                            if (fillThis.queue[0])
                                fillThis.queue[0].lastValueIfNullBlock = current;
                            break;
                        }
                        else {
                            if (fillThis.queue[0])
                                fillThis.queue[0].lastValueIfNullBlock = undefined;
                        }
                        const blockType = (blockOptions instanceof BlockType) ? blockOptions : blockOptions.type;
                        // content.warn({ replace: replace?.id, blockType: blockType.id, bool: blockOptions?.permutation instanceof BlockPermutation });
                        if (replace && block.typeId !== replace.id)
                            continue;
                        block.setType(blockType);
                        if (blockOptions instanceof BlockType)
                            continue;
                        if (!(blockOptions?.permutation instanceof BlockPermutation))
                            continue;
                        block.setPermutation(blockOptions.permutation);
                        if (isFirstBlockOfChunk)
                            break;
                    }
                }
                catch (error) {
                    console.warn(error, error.stack);
                }
            });
        }
        run();
    }
    check(fillOptions) {
        const { location1, location2, blocks, hollow = 0, maxPlacementsPerTick = 2048 } = fillOptions;
        if (!(fillOptions instanceof Object))
            throw new Error('fillOptions at params[0] is not of type: Object!');
        if (!isVector3(location1))
            throw new Error('location1 in fillOptions at params[0] is not of type: {x: number, y: number, z: number}!');
        if (!isVector3(location2))
            throw new Error('location2 in fillOptions at params[0] is not of type: {x: number, y: number, z: number}!');
        const { y: y1 } = location1;
        const { y: y2 } = location2;
        if (y1 > 319 || y1 < -64)
            throw new Error(`y, ${y1} in location1 in fillOptions at params[0] is less than -64 or greater than 319 which cannot be filled!`);
        if (y2 > 319 || y2 < -64)
            throw new Error(`y, ${y2} in location2 in fillOptions at params[0] is less than -64 or greater than 319 which cannot be filled!`);
        if (!(blocks instanceof BlockType) && !(blocks instanceof Array) && !(blocks instanceof Object))
            throw new Error('blocks at params[0] is not of type: Object, Array, or BlockType!');
        if (blocks instanceof Array)
            blocks.forEach((block, i) => {
                if (!(block instanceof BlockType) && !(block instanceof Object))
                    throw new Error(`blocks[${i}] in params[0] is not of type: Object or BlockType!`);
                if (block instanceof BlockType)
                    return;
                const { type, permutation } = block;
                if (!(type instanceof BlockType))
                    throw new Error(`type in blocks[${i}] in fillOptions at params[0] is not of type: Object or BlockType!`);
                if (!(permutation instanceof BlockPermutation))
                    throw new Error(`permutation in blocks[${i}] in fillOptions at params[0] is not of type: Object or BlockType!`);
            });
        if (typeof hollow !== 'number')
            throw new Error('hollow in fillOptions at params[0] is not of type: Number!');
        if (typeof maxPlacementsPerTick !== 'number')
            throw new Error('maxPlacementsPerTick in fillOptions at params[0] is not of type: Number!');
    }
    queuefill(fillOptions) {
        const generator = this.getGenerator(fillOptions);
        const iterator = generator();
        this.queue.push({ iterator, fillOptions, nullId: this.nullId++ });
        this.subscribe();
    }
    getGenerator(fillOptions) {
        const [location1, location2] = sort3DVectors(fillOptions.location1, fillOptions.location2);
        const { x: x1 = 0, y: y1 = 0, z: z1 = 0 } = location1 ?? {}, { x: x2 = 0, y: y2 = 0, z: z2 = 0 } = location2 ?? {};
        const startChunkX = Math.floor(x1 / 16);
        const endChunkX = Math.floor(x2 / 16);
        const startChunkZ = Math.floor(z1 / 16);
        const endChunkZ = Math.floor(z2 / 16);
        let x, y, z;
        return (function* () {
            for (let cx = startChunkX; cx <= endChunkX; cx++) {
                for (let cz = startChunkZ; cz <= endChunkZ; cz++) {
                    const startX = Math.max(cx * 16, x1);
                    const endX = Math.min(cx * 16 + 15, x2);
                    const startZ = Math.max(cz * 16, z1);
                    const endZ = Math.min(cz * 16 + 15, z2);
                    for (y = y1; y <= y2; y++) {
                        for (x = startX; x <= endX; x++) {
                            for (z = startZ; z <= endZ; z++) {
                                const isFirstBlockOfChunk = x === startX && y === y1 && z === startZ;
                                yield { blockLocation: { x, y, z }, isFirstBlockOfChunk };
                            }
                        }
                    }
                }
            }
        });
    }
    // getGenerator(fillOptions, type) {
    // 	const { location1, location2, blocks, hollow = 0, maxPlacementsPerTick = 1 } = fillOptions;
    // 	const { x: x1, y: y1, z: z1 } = location1, { x: x2, y: y2, z: z2 } = location2;
    // 	const length = x2 - x1 + 1, height = y2 - y1 + 1, width = z2 - z1 + 1;
    // 	const area = width * length;
    // 	const volume = area * height;
    // 	// content.warn({ width, length, height, location1: { x1, y1, z1 }, location2: { x2, y2, z2 }, t: 'why nioweroirwuwru', area, volume });
    // 	switch (type) {
    // 		case 'box':
    // 			return function* () {
    // 				for (let i = 0, x = 0, y = 0, z = 0, csX = 0, csZ = 0, mX, mZ; i < volume; i++, x++) {
    // 					if (x >= length) {
    // 						mX = x, x = csX, z++;
    // 					} else if (!((x + x1) % 16)) {
    // 						content.warn({ bool: y >= height - 1 && !((z + z1 + 1) % 16) && x < length - 1, x, y, z, mX, mZ, csX, csZ, modX: (x + x1) % 16, modZ: (z + z1 + 1) % 16, height, lessX: x < length - 1, maxHeight: y >= height - 1 });
    // 						if (y >= height - 1 && !((z + z1 + 2) % 16) && x < length - 1) csX = mX + 1;
    // 						else mX = x, x = csX, z++;
    // 					};
    // 					if (z >= length) {
    // 						mZ = z, z = csZ, y++;
    // 					} else if (!((z + z1) % 16)) {
    // 						if (y >= height - 1 && x >= length && z < length) csZ = mZ, csX = 0;
    // 						else mZ = z, z = csZ, y++;
    // 					};
    // 					if (y >= height) y = 0;
    // 					yield {x: x + x1, y:  y + y1 z:  z + z1);
    // 				}
    // 			};
    // 		case 'circle':
    // 			return function* () {
    // 				for (let i = 0, x = x1, y = y1, z = z1; i < area; i++, x++) {
    // 					if (x > length) x = x1, z++;
    // 					// if (z > width) x = x1, y++;
    // 					if (x - x1 > length / 2) continue;
    // 					if (z - z1 > width / 2) continue;
    // 					yield {x: x, y:  y z:  z);
    // 				}
    // 			};
    // 		case 'sphere':
    // 			return function* () {
    // 				for (let i = 0, x = x1, y = y1, z = z1; i < volume; i++, x++) {
    // 					if (x > length) x = x1, z++;
    // 					if (z > width) x = x1, y++;
    // 					if (Math.abs(x - x1) > length / 2) continue;
    // 					if (Math.abs(z - z1) > width / 2) continue;
    // 					if (Math.abs(y - y1) > height / 2) continue;
    // 					yield {x: x, y:  y z:  z);
    // 				}
    // 			};
    // 		case 'cylinder':
    // 			return function* () {
    // 				for (let i = 0, x = x1, y = y1, z = z1; i < volume; i++, x++) {
    // 					if (x > length) x = x1, z++;
    // 					if (z > width) x = x1, y++;
    // 					if (x - x1 > length / 2) continue;
    // 					if (z - z1 > width / 2) continue;
    // 					yield {x: x, y:  y z:  z);
    // 				}
    // 			};
    // 	}
    // }
    box(fillOptions) {
        // content.warn('ehhjwhjwd');
        this.check(fillOptions);
        // content.warn('wklkwdklwd');
        this.queuefill(fillOptions);
    }
}
const fill = new Fill();
export default fill;
//# sourceMappingURL=fill.js.map