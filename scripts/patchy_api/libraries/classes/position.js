import eventBuilder from "./events/export_instance.js";
import { content, sort3DRange, sort3DVectors } from '../utilities.js';
import global from "./global.js";
import players from "./players/export_instance.js";
import { Vector3, Player, BlockLocation, Location } from "@minecraft/server";
const { floor } = Math;
class PositionBuilder {
	constructor() {
		eventBuilder.subscribe('position*API', {
			tickAfterLoad: () => {
				players.get().iterate((player) => {

					this.forEach((key, { noLoop = false }) => {
						// content.warn(key, noLoop);
						if (noLoop) return;
						this.check(player, key);
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
		const { location: { x, y, z } } = player;
		const { location1, location2, callback } = this[key];
		const { x: x1, y: y1, z: z1 } = location1;
		if (!location2) {
			return floor(x) === x1 && floor(y) === y1 && floor(z) === z1;
		} else {
			const { x: x2, y: y2, z: z2 } = location2;
			return floor(x) >= x1 && floor(x) <= x2 && floor(y) >= y1 && floor(y) <= y2 && floor(z) >= z1 && floor(z) <= z2;
		}
	};
	/**
	 * @method check
	 * @param {Player} player
	 * @param {String} key
	 */
	check(player, key) {
		const { location: { x, y, z } } = player;
		const { location1, location2, callback } = this[key];
		const { x: x1, y: y1, z: z1 } = location1;
		if (!this.test(player, key)) return;
		if (typeof callback === 'string') {

		} else {
			callback(player, location1, location2);
		}

	}
	/**
	 * @typedef {Object} PostionObject
	 * @property {Vector3} location1
	 * @property {Vector3} location2
	 * @property {(player: Player, location1: Vector3, location2: Vector3) => {}} callback
	 */
	/**
	 * @method add 
	 * @param {{[key: String] : PostionObject}} postionObject 
	 */
	add(postionObject) {
		postionObject.forEach((key, value) => {

			let { callback, location1, location2, noLoop, testOnly } = value;
			if (testOnly && typeof testOnly !== 'boolean') return new Error(`testOnly key of postionObject Key: ${key}, should be a boolean`);
			if (!testOnly && !(callback instanceof Function)) {
				return new Error(`function key of postionObject Key: ${key}, should be a function`);
			}
			if (!(location1 instanceof Location) && !(location1 instanceof BlockLocation)) {
				return new Error(`location1 key of postionObject Key: ${key}, should be a instance of Location or BlockLocation`);
			}
			if (location2 && !(location1 instanceof Location) && !(location1 instanceof BlockLocation)) {
				return new Error(`location2 key of postionObject Key: ${key}, should be a instance of Location or BlockLocation`);
			}
			if (location2) {
				// const { x: x1, y: y1, z: z1 } = location1, { x: x2, y: y2, z: z2 } = location2;
				const [{ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }] = sort3DVectors(location1, location2);
				this[key] = {
					location1: new BlockLocation(x1, y1, z1),
					location2: new BlockLocation(x2, y2, z2),
					callback,
					noLoop
				};
			} else {
				const { x, y, z } = location1;
				this[key] = {
					location1: new BlockLocation(x, y, z),
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
		delete this[key];
	}
	/**
	 * @method removeKeys 
	 * @param {string} key 
	 * @param ...
	 */
	removeKeys(...keys) {
		keys.forEach(key => {
			delete this[key];
		});
	}
}
const positionBuilder = new PositionBuilder();
export default positionBuilder;

