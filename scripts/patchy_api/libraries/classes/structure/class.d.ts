import { Dimension } from '@minecraft/server';
interface SaveOptions {
    name: string;
    dimension: Dimension;
    location1: import('@minecraft/server').Vector3;
    location2: Vector3;
    saveMode?: 'memory' | 'disk';
    includesEntites?: boolean;
    includesBlocks?: boolean;
}
type SaveIterator = Iterator<[import('@minecraft/server').Vector3, import('@minecraft/server').Vector3, number, number], [import('@minecraft/server').Vector3, import('@minecraft/server').Vector3, number, number]>;
export interface LoadOptions {
    dimension: Dimension;
    location: import('@minecraft/server').Vector3;
    name: string;
    rotation?: '0_degrees' | '90_degrees' | '180_degrees' | '270_degrees';
    mirror?: 'none' | 'x' | 'xz' | 'z';
    animationMode?: 'block_by_block' | 'layer_by_layer';
    animationSeconds?: number;
    includesEntites?: boolean;
    includesBlocks?: boolean;
    waterlogged?: boolean;
    integrity?: Number;
    seed?: string;
}
type Vector3 = {
    x: number;
    y: number;
    z: number;
};
export declare class StructureBuilder {
    saveQueue: [string, Dimension, SaveIterator, SaveOptions, number][];
    loadQueue: [LoadOptions, number][];
    subscribedLoadQueue: boolean;
    subscribedSaveQueue: boolean;
    vars: Record<string, any>;
    loadId: number;
    saveId: number;
    loads: Record<number, {
        started: boolean;
        done: boolean;
    }>;
    saves: Record<number, {
        started: boolean;
        done: boolean;
    }>;
    getSaveStatus(id: number): {
        started: boolean;
        done: boolean;
    } | undefined;
    getLoadStatus(id: number): {
        started: boolean;
        done: boolean;
    } | undefined;
    save(options: SaveOptions): number;
    subscribeSaveQueue(): void;
    queueSave(name: string, dimension: Dimension, iterator: SaveIterator, options: SaveOptions, id: number): void;
    /**
     * @private
     */
    getSaveIterator(location1: Vector3, location2: Vector3): SaveIterator;
    subscribeLoadQueue(): void;
    /**
     * @param {LoadOptions} options
     * @param {number} id
     */
    queueLoad(options: LoadOptions, id: number): void;
    /**
     * @param {LoadOptions} options
     * @returns {number}
     */
    load(options: LoadOptions): number;
}
export {};
