import { Block, Dimension, Vector3 } from '@minecraft/server';
import { Player } from './player/class.js';
interface RandomOptions {
    minRadius: number;
    maxRadius: number;
    type: 'circle';
    randomRotation?: boolean;
    yMax: number;
    yMin: number;
}
interface TeleportOptions {
    location: {
        x: number;
        y: number;
        z: number;
    };
    dimension: Dimension;
    facing?: {
        x: number;
        y: number;
        z: number;
    };
    rotation?: {
        x: number;
        y: number;
    };
    face?: {
        x: number;
        y: number;
        z: number;
    };
    keepVelocity?: boolean;
    random?: RandomOptions;
}
interface RelitiveOffset {
    location: Vector3;
    offset: Vector3;
}
export interface TeleportObjectOnce {
    location: Vector3 | RelitiveOffset;
    face: {
        x: number;
        y: number;
    } | Vector3 | RelitiveOffset;
    dimension: Dimension;
}
declare class TeleportBuilder {
    teleports: {
        [key: string]: TeleportOptions[];
    };
    /**
     * @method add
     * @param {{[key: String]: TeleportOptions | TeleportOptions[]}} teleportObject if array its random
     */
    add(teleportObject: {
        [key: string]: TeleportOptions | TeleportOptions[];
    }): void;
    /**
     * @method remove
     * @param {String} key
     */
    remove(key: string): void;
    /**
     *
     * @param {Dimension} dimension
     * @param {{x: number, y: number, z: number}} location
     * @param {Number} yMax
     * @param {Number} yMin
     * @param {Number} minRadius
     * @param {Number} maxRadius
     * @returns {{blockFloor: Block, blockAbove: Block, location: {x: number, y: number, z: number}}
     */
    getRandomCoords(dimension: Dimension, location: {
        x: number;
        y: number;
        z: number;
    }, yMax: number, yMin: number, minRadius: number, maxRadius: number): false | {
        location: {
            x: number;
            y: number;
            z: number;
        };
        blockFloor: Block;
        blockAbove: Block | undefined;
    };
    getRandomSafeCoords(dimension: Dimension, location: {
        x: number;
        y: number;
        z: number;
    }, yMax: number, yMin: number, minRadius: number, maxRadius: number): {
        x: number;
        y: number;
        z: number;
    } | undefined;
    /**
     * @param {Player} player
     * @param {TeleportObjectOnce} teleportObject
     */
    teleportOnce(player: Player, teleportObject: TeleportObjectOnce): void;
    /**
     * @method remove
     * @param {Player} player
     * @param {String} key
     */
    teleport(player: Player, key: string): Error | undefined;
}
declare const teleportBuilder: TeleportBuilder;
export default teleportBuilder;
