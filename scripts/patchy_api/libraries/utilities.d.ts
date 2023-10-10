import { Player, Entity, BlockPermutation, Direction, Vector2, Vector3, DisplaySlotId } from '@minecraft/server';
export declare function getXZVectorRY(ry: number): {
    x: number;
    y: number;
    z: number;
};
export declare const content: {
    warn(...messages: any[]): void;
    chatFormat(...messages: any[]): void;
};
export declare function isVector3(target: any): boolean;
export declare function isVector2(target: any): boolean;
export declare function rotationToDirection(rotation: Vector2): "Down" | "East" | "North" | "South" | "Up" | "West" | undefined;
export declare const reverseDirection: {
    Down: string;
    East: string;
    North: string;
    South: string;
    Up: string;
    West: string;
};
export declare function rotationToHorizontalDirection(rotation: Vector2): "East" | "North" | "South" | "West" | undefined;
export declare function isDefined(input: any): boolean;
export declare function permutationClone(permutation: BlockPermutation): any;
export declare function weightsRandom(...weights: number[]): number;
export declare class RemovableTree {
    array: string[];
    constructor(array?: never[]);
    next(key: string): this | undefined;
    last(): string | undefined;
    beforeLast(lastIndex?: number): string | undefined;
}
export declare function typeOf(value: any): any;
export declare function hypot3(n1: number, n2: number, n3: number): number;
export declare function hypot2(n1: number, n2: number): number;
/**
 * @function parseList spreads all arrays in an array into one single array
 * @param {Array} list
 * @returns Array
 */
export declare function parseList(list: any[]): any[] | undefined;
export declare const lockedItemKey = "\u00A71\u00A7a\u00A7s\u00A7w\u00A7A";
export declare const crossHareDataKey = 87;
export declare function randomCoordsOutsideCircle(minRadius: number, maxRadius: number): {
    x: number;
    z: number;
    r: number;
};
/**
 *
 * @param {[{x: number, y: number,z: number},{x: number, y: number,z: number}]} bounds
 * @returns {{x: number, y: number,z: number}}
 */
export declare function randomCoordsInsideRectangle(bounds: [Vector3, Vector3]): Vector3;
export declare function sortRange(array: [[number, number], [number, number]]): number[][];
export declare function sort3DRange(array: [[number, number, number], [number, number, number]]): number[][];
export declare function sort3DVectors(vector1: Vector3, vector2: Vector3): [{
    x: number;
    y: number;
    z: number;
}, {
    x: number;
    y: number;
    z: number;
}];
/**
 *
 * @param {{x: number, y: number, z: number}} target
 * @param {{x: number, y: number, z: number}} vector1
 * @param {{x: number, y: number, z: number}} vector2
 * @returns
 */
export declare function betweenVector3(target: Vector3, vector1: Vector3, vector2: Vector3): boolean;
export declare function betweenBlockVector3(target: Vector3, vector1: Vector3, vector2: Vector3): boolean;
export declare function andArray(array?: any[]): any;
export declare function orArray(array?: any[]): any;
export declare const blockFaceToNumber: {
    Down: number;
    East: number;
    North: number;
    South: number;
    Up: number;
    West: number;
};
export declare const clickableBlocks: string[];
export declare function randomIntegerBetween(min: number, max: number): number;
export declare function relativeParse(player: Player, input: string, direction: keyof Vector3): number;
export declare function blockFaceToCoords(blockFaceDir: Direction, { x, y, z }: Vector3): {
    x: number;
    y: number;
    z: number;
};
export declare function offsetVector3(Vector3: Vector3, offsetVector3: Vector3): Vector3;
export declare function pathIsObject(pathArray: string[], object: any, allowArrays?: boolean): any;
export declare function pathIsSettable(pathArray: string[], object: any, allowArrays?: boolean): boolean;
export declare function assignToPath(pathArray: string[], object: any, value: any, allowArrays?: boolean): any;
declare const native: {
    typeOf(input: any): "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "array";
    toConstructed(type: any): {} | [] | false;
    toObject<t>(input: t): t;
    stringify(value: any, replacer?: (string | number)[] | null | undefined, space?: string | number | undefined): string;
};
export { native };
export declare function toProperCase(string: string): string;
export declare function toCamelCase(str: string): string;
export declare const staff: {
    sendMessage(message: any, exludePlayer: string): void;
};
export declare const server: {
    /**
     *
     * @param {String} objective
     * @param {Player} player
     * @param {value} value
     * @param {'List' | 'Sidebar' | 'BelowName' } updateId
     */
    setPlayerScoreboard(objective: string, player: Player, value: number, updateId?: DisplaySlotId): Promise<void>;
    tellraw(message: any): void;
    /**
     * @method scoreTest
     * @param {String} objective
     * @param {Player} target Also be Entity or String
     * @param {Player} findParticipant
     * @returns
     */
    scoreTest(objective: string, target: Player | Entity | string): number | undefined;
    objectiveAdd(objective: string, displayName?: string): true | undefined;
    objectiveRemove(objective: string): true | undefined;
    /**
     * @param {String} objective
     * @param {import('@minecraft/server').Player} player
     * @param {Number} value
     * @param {'list' | 'sidebar' | 'belowName' } updateId
     */
    scoreResetPlayer(objective: string, target: Player | Entity | string): boolean;
    scoreSetPlayer(objective: string, target: Player | Entity | string, value?: number, updateId?: DisplaySlotId): number | undefined;
};
/**
 * @param {number} seconds
 * @returns {string}
 */
export declare function formatSeconds(seconds: number): string;
/**
 * @param {{x: number, y: number, z: number}} vector
 * @returns {{x: number, y: number}}
 */
export declare function vector3ToRotation(vector: Vector3): {
    x: number;
    y: number;
};
/**
 * @param {{x: number, y: number}} rotation
 * @returns {{x: number, y: number, z: number}}
 */
/**
 * @param {Array<String>} commandArray Commands.
 * @param {String} dimension The dimension command should be run in. If left blank it will run in the: Overworld.
 * @returns {Array<String>} Returns the following array for each object in the array.
 */
export declare function combine(target: any, source: any): any;
export declare function ItemsGet(id: string, log?: boolean): import("@minecraft/server").ItemType;
export declare const colors: string[];
/**
 *
 * @param {Number} value 0-1
 * @param {Bool} reversed
 * @returns {String}
 */
export declare function rainbowWeight(value: number, reversed?: boolean): any;
export declare function rainbow(): string | undefined;
export declare function getNames(): void;
export declare function createArrayBetween(min: number, max: number): any[];
export declare function obfuscate255(string: string): string;
export declare function deobfuscate255(string: string): string;
export declare const overworld: import("@minecraft/server").Dimension, nether: import("@minecraft/server").Dimension, end: import("@minecraft/server").Dimension;
export declare function chunkStringRegex(str: string, length: number): RegExpMatchArray | null;
export declare function chunkString(str: string, length: number): any[];
/**
 * @param {String} str
 * @param {Number} length
 * @returns {Array}
 */
export declare function chunkStringBytes(str: string, length: number): string[];
/**
 *
 * @param {string} str
 * @param {number} length
 * @returns
 */
export declare function chunkStringReverse(str: string, length: number): any[];
export declare function generateRandomString(length: number): string;
/**
 * do not \ on the @
 * @example parseCommand('!give \@"bat is bob" iron_sword {"data":6, "enchantments": {"sharpness":3}}', '!'); //returns ['give','bat is bob','iron_sword','{"data":6,"enchantments":{"sharpness":3}}']
 */
export declare function parseCommand(message: string, prefix: string): string[];
export declare function metricNumbers(value: number, place?: number): string | number;
export declare function fixSciNumberString(string: string | number): string | undefined;
export declare function formatNumber(number: number | string): string;
export declare function formatDecimal(number: number): string;
export declare function randomValue(array: any[]): any;
export declare function formatMS(ms: number, formal?: boolean): string;
