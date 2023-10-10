import { BlockType, BlockPermutation, Vector3 } from "@minecraft/server";
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
interface BlockOptions {
    type: BlockType;
    permutation: BlockPermutation;
}
interface FillOptions {
    location1: Vector3;
    location2: Vector3;
    blocks: BlockType | BlockOptions | (BlockType | BlockOptions)[];
    hollow: number;
    maxPlacementsPerTick: number;
    replace: BlockType;
}
declare class Fill {
    subscribed: boolean;
    queue: {
        nullId: number;
        fillOptions: FillOptions;
        lastValueIfNullBlock?: IteratorResult<{
            blockLocation: Vector3;
            isFirstBlockOfChunk: boolean;
        }, {
            blockLocation: Vector3;
            isFirstBlockOfChunk: boolean;
        }>;
        iterator: Iterator<{
            blockLocation: Vector3;
            isFirstBlockOfChunk: boolean;
        }, {
            blockLocation: Vector3;
            isFirstBlockOfChunk: boolean;
        }, undefined>;
    }[];
    nullId: number;
    constructor();
    subscribe(): Error | undefined;
    check(fillOptions: FillOptions): void;
    private queuefill;
    private getGenerator;
    box(fillOptions: FillOptions): void;
}
declare const fill: Fill;
export default fill;
