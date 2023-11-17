import { BlockType, BlockPermutation, Vector3 } from "@minecraft/server";
interface FillOptions {
    location1: Vector3;
    location2: Vector3;
    blocks: BlockPermutation | BlockType | string | (BlockPermutation | BlockType | string)[];
    hollow?: number;
    maxPlacementsPerTick?: number;
    replace?: BlockType | string;
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
