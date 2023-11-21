import { Player } from './player/class.js';
import { Vector3 } from "@minecraft/server";
interface PostionObject {
    location1: {
        x: number;
        y: number;
        z: number;
    };
    location2?: {
        x: number;
        y: number;
        z: number;
    };
    callback?: (player: Player, location1: {
        x: number;
        y: number;
        z: number;
    }, location2?: {
        x: number;
        y: number;
        z: number;
    }) => void;
    noLoop?: boolean;
    testOnly?: boolean;
}
declare class PositionBuilder {
    positions: Record<string, {
        noLoop?: boolean;
        location1?: Vector3;
        location2?: Vector3;
        callback?: (player: Player, location1: {
            x: number;
            y: number;
            z: number;
        }, location2?: {
            x: number;
            y: number;
            z: number;
        }) => any;
    }>;
    constructor();
    /**
     * @method test
     * @param {Player} player
     * @param {String} key
     */
    test(player: Player, key: string): boolean;
    /**
     * @method check
     * @param {Player} player
     * @param {String} key
     * @returns {Boolean}
     */
    check(player: Player, key: string): boolean;
    /**
     * @method add
     * @param {{[key: String] : PostionObject}} postionObject
     */
    add(postionObject: {
        [key: string]: PostionObject;
    }): void;
    /**
     * @method remove
     * @param {string} key
     */
    remove(key: string): void;
    /**
     * @method removeKeys
     * @param {string} key
     * @param ...
     */
    removeKeys(...keys: string[]): void;
}
declare const positionBuilder: PositionBuilder;
export default positionBuilder;
