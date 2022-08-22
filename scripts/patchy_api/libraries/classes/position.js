import eventBuilder from "./events";
import { sort3DRange } from '../utilities.js';
import global from "./global";
const { floor } = Math;
class PositionBuilder {
	constructor() {

		eventBuilder.subscribe({
			tick: () => {
				global.players.forEach(player => {
					const { location: { x, y, z } } = player;
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
							if (floor(x) >= x1 && floor(x) <= x2 && floor(y) >= y1 && floor(y) <= y2 && floor(z) >= z1 && floor(z) <= z2) {
								if (typeof callback === 'string') {

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
	add(key, callback, location1, location2) {
		if (typeof location2 === 'function') {
			[location1, location2] = sort3DRange([location1, location2]);
		}
		this[key] = {
			location1,
			location2,
			callback
		};
		if (!location2) { return; }
	}
	remove(key) {
		delete this.key;
	}
}
const positionBuilder = new PositionBuilder();
export default positionBuilder;