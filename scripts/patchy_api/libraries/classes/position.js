import eventBuilder from "./events/export_instance.js";
import { sort3DVectors, isVector3 } from '../utilities.js';
import players from "./players/export_instance.js";
import teleportBuilder from './teleport.js';
const { floor } = Math;
class PositionBuilder {
    constructor() {
        this.positions = {};
        const positionThis = this;
        eventBuilder.subscribe('position*API', {
            tickAfterLoad: () => {
                players.get().iterate((player) => {
                    // content.warn(PositionThis);
                    Object.entries(positionThis.positions).forEach(([key, { noLoop = false }]) => {
                        if (noLoop)
                            return;
                        positionThis.check(player, key);
                    });
                });
            }
        });
    }
    /**
     * @method test
     * @param {Player} player
     * @param {String} key
     */
    test(player, key) {
        const { location: { x, y, z }, gamemode } = player;
        if (gamemode === 5)
            return false;
        const { location1 = { x: 0, y: 0, z: 0 }, location2, callback } = this.positions[key] ?? {};
        const { x: x1, y: y1, z: z1 } = location1;
        if (!location2) {
            return floor(x) === x1 && floor(y) === y1 && floor(z) === z1;
        }
        else {
            const { x: x2, y: y2, z: z2 } = location2;
            return floor(x) >= x1 && floor(x) <= x2 && floor(y) >= y1 && floor(y) <= y2 && floor(z) >= z1 && floor(z) <= z2;
        }
    }
    ;
    /**
     * @method check
     * @param {Player} player
     * @param {String} key
     * @returns {Boolean}
     */
    check(player, key) {
        const { location1 = { x: 0, y: 0, z: 0 }, location2, callback } = this.positions[key] ?? {};
        if (!this.test(player, key))
            return false;
        if (typeof callback === 'string') {
            teleportBuilder.teleport(player, callback);
        }
        else {
            if (callback instanceof Function)
                callback(player, location1, location2);
        }
        return true;
    }
    /**
     * @method add
     * @param {{[key: String] : PostionObject}} postionObject
     */
    add(postionObject) {
        Object.entries(postionObject).forEach(([key, value]) => {
            let { callback, location1, location2, noLoop, testOnly } = value;
            if (testOnly && typeof testOnly !== 'boolean')
                return new Error(`testOnly key of postionObject Key: ${key}, should be a boolean`);
            if (!testOnly && !(callback instanceof Function)) {
                return new Error(`function key of postionObject Key: ${key}, should be a function`);
            }
            if (!isVector3(location1))
                throw new Error(`location1 key of postionObject Key: ${key}, should be a instance of Vetcor4`);
            if (location2 && !isVector3(location1))
                throw new Error(`location2 key of postionObject Key: ${key}, should be a instance of Vector3`);
            if (location2) {
                // const { x: x1, y: y1, z: z1 } = location1, { x: x2, y: y2, z: z2 } = location2;
                const [{ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }] = sort3DVectors(location1, location2);
                this.positions[key] = {
                    location1: { x: x1, y: y1, z: z1 },
                    location2: { x: x2, y: y2, z: z2 },
                    callback,
                    noLoop
                };
            }
            else {
                const { x, y, z } = location1;
                this.positions[key] = {
                    location1: { x, y, z },
                    callback,
                    noLoop
                };
            }
        });
    }
    /**
     * @method remove
     * @param {string} key
     */
    remove(key) {
        delete this.positions[key];
    }
    /**
     * @method removeKeys
     * @param {string} key
     * @param ...
     */
    removeKeys(...keys) {
        keys.forEach(key => {
            delete this.positions[key];
        });
    }
}
const positionBuilder = new PositionBuilder();
export default positionBuilder;
//# sourceMappingURL=position.js.map