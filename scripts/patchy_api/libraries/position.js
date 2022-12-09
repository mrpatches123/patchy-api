import { Location, BlockLocation } from "@minecraft/server";
import eventBuilder from "./events.js";
import { content, native, sort3DVectors } from '../utilities.js';
import global from "./global.js";
import players from "./players.js";
import teleportBuilder from "./teleport.js";

const { floor } = Math;
class PositionBuilder {
	constructor() {
		eventBuilder.subscribe('position*API', {
			tickAfterLoad: () => {
				players.get().iterate((player) => {
					const { location: { x, y, z } } = player;

					// content.warn({ keys: this.keys() });
					this.forEach((key, { location1, location2, callback }) => {
						const { x: x1, y: y1, z: z1 } = location1;
						if (!location2) {
							if (floor(x) === x1 && floor(y) === y1 && floor(z) === z1) {
								if (typeof callback === 'string') {

								} else {
									callback(player, location1, location2);
								}
							}
						} else {
							const { x: x2, y: y2, z: z2 } = location2;
							content.warn({ x1, x2, x, xb: floor(x) >= x1 && floor(x) <= x2 });
							if (floor(x) >= x1 && floor(x) <= x2 && floor(y) >= y1 && floor(y) <= y2 && floor(z) >= z1 && floor(z) <= z2) {
								content.warn('wlkwkjjwddkjw');
								if (typeof callback === 'string') {
									teleportBuilder.teleport(player, callback);
								} else {
									callback(player, location1, location2);
								}
							}
						}
					});
				});
			}
		});
	}
	// const postionObject = {
	// 	positionKey: {
	// 		callback: () => {

	// 		},
	// 		location1: new BlockLocation(x, y, z), //or location
	// 		'location2?optional': new BlockLocation(x, y, z),
	// 	}
	// };
	/**
	 * @method add 
	 * @param {Object} postionObject 
	 */
	add(postionObject) {
		postionObject.forEach((key, value) => {
			let { callback, location1, location2 } = value;
			if (!(callback instanceof Function)) {
				return new Error(`function key of postionObject Key: ${key}, should be a function`);
			}
			if (!(location1 instanceof Location) && !(location1 instanceof BlockLocation)) {
				return new Error(`location1 key of postionObject Key: ${key}, should be a instance of Location or BlockLocation`);
			}
			if (location2 && !(location1 instanceof Location) && !(location1 instanceof BlockLocation)) {
				return new Error(`location2 key of postionObject Key: ${key}, should be a instance of Location or BlockLocation`);
			}
			if (location2) {
				const [{ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }] = sort3DVectors(location1, location2);
				content.warn({ x1 });
				this[key] = {
					location1: new BlockLocation(x1, y1, z1),
					location2: new BlockLocation(x2, y2, z2),
					callback
				};
				return;
			}
			this[key] = {
				location1,
				callback
			};
		});
		content.warn(this);
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

