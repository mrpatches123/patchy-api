// import { BlockLocation, Location, } from "@minecraft/server";
// const { hypot } = Math;
// const locationTypes = {
// 	Location,
// 	BlockLocation
// };
// const locationFunctions = {
// 	distanceBetween({ x: x1, y: y1, z: z1 }) {
// 		const { x, y, z } = this;
// 		return hypot(x1 - x, y1 - y, z1 - z);
// 	},
// 	horizontalDistanceBetween({ x: x1, z: z1 }) {
// 		const { x, z } = this;
// 		return hypot(x1 - x, z1 - z);
// 	},
// 	verticalDistanceBetween({ y: y1 }) {
// 		const { y } = this;
// 		return hypot(y1 - y);
// 	},
// 	queryTopSolid(dimension = overworld, ceiling = 319) {
// 		const { x, z } = this;
// 		const locations = {
// 			x: x.floor(), y: ceiling z: z.floor())
// 			.blocksBetween({ x: x.floor(), y: -64 z: z.floor())).reverse();
// 			for(const location of locations) {
// 				// content.warn({ location: native.stringify(location), block: native.stringify(dimension.getBlock(location)) });
// 				if (!dimension.getBlock(location).isEmpty) {
// 					return location.y;
// 				}
// 			}
// 			// console.warn('jdjhwjwjwj');
// 		},
// 			toOverworld({ id } = {}) {
// 				const { x, y, z } = this;
// 				if (id === 'minecraft:nether') {
// 					return new locationTypes[this.constructor.name](x * 8, y * 8, z * 8);
// 				} else {
// 					return this;
// 				}
// 			},
// 				toBlockLocation() {
// 			const { x, y, z } = this;
// 			return { x: x.floor(), y: y.floor() z: z.floor());
// 		},
// 		toLocation() {
// 			const { x, y, z } = this;
// 			return { x: x, y: y, z: z };
// 		}
// 	};
// 	Object.assign(Location.prototype, locationFunctions);
// 	Object.assign(BlockLocation.prototype, locationFunctions);
// 	Object.assign(Object.prototype, locationFunctions);