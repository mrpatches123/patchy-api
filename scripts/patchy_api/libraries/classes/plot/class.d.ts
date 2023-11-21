import { BlockAreaSize, Dimension, Vector2, Vector3 } from "@minecraft/server";
import { Player } from "../player/class.js";
import { LoadOptions as StructureLoadOptions } from '../structure/class';
export declare class PlotsVector3 {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number);
}
export declare class BlockVector3 {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number);
}
interface PlotRuleSet {
    count?: number;
    size?: BlockAreaSize;
    start: {
        x: number;
        y: number;
        z: number;
    } | PlotsVector3;
    offset?: {
        x: number;
        y: number;
        z: number;
    };
    direction: 'x' | '-x' | 'z' | '-z';
    blockPlaceMargin?: {
        x: number;
        y: number;
        z: number;
    };
}
interface Teleport {
    location?: Vector3 | {
        location: Vector3;
        offset: Vector3;
    } | PlotsVector3;
    face?: Vector2 | Vector3 | {
        location: Vector3;
        offset: Vector3;
    } | PlotsVector3;
    dimension?: Dimension;
    key?: string;
}
interface PlotRules {
    size: BlockAreaSize;
    start: {
        x: number;
        y: number;
        z: number;
    };
    ruleSets?: PlotRuleSet[];
    property?: boolean;
    plotNumberIdentifier?: string;
    defaultPermision?: 'read' | 'write' | 'break' | 'place' | 'open' | 'open-break' | 'press';
    defaultGamemode?: 0 | 1 | 2;
    /**
     * default?= false
     */
    loop?: boolean;
    loopDirection?: 'x' | '-x' | 'z' | '-z';
    teleport?: Teleport;
    structure?: StructureLoadOptions;
    exclusive?: boolean;
    maxX?: number;
    maxZ?: number;
}
export declare class PlotBuilder {
    subscribedQueue: boolean;
    registeredProperties: boolean;
    creates: Record<string, PlotRules>;
    plots: Record<string, {
        players: any;
        rules: PlotRules;
    }>;
    subscribed: boolean;
    constructor();
    runCreateQueue(): void;
    create(key: string, rules: PlotRules): void;
    query(player: Player, key: string): number | undefined;
    list(key: string): {
        availablePlots: number[];
        currentIndex: number;
    } | undefined;
    /**
     * @param {Player} player
     * @param {string} key
     */
    setCurrent(player: Player, key?: string): void;
    setOveride(player: Player, type: 'plotNumberOveride' | 'currentPlot' | 'gamemodeOveride' | 'permisionOveride' | 'blockPlaceMarginOverideX' | 'blockPlaceMarginOverideY' | 'blockPlaceMarginOverideZ', value?: number | string): void;
    getRuleSet(key: string, number: number): PlotRuleSet | undefined;
    subscribe(): void;
    /**
     * @param {import('../player/class').Player} player
     * @param {string} key
     * @param {number | undefined} plotNumber
     * @returns {{ wasAdded: boolean, plotNumber: Number | undefined, full: boolean}}
     */
    add(player: import('../player/class').Player, key: string, plotNumber?: number): {
        wasAdded: boolean;
        plotNumber?: number | undefined;
        full: boolean;
    };
    reset(key: string): void;
    remove(player: Player, key: string): boolean;
}
export {};
