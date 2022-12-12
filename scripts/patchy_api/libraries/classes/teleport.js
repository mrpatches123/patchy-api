import { Location, BlockLocation, Block, Vector3, Dimension, XYRotation, Player, MinecraftBlockTypes, Vector } from '@minecraft/server';
import { content, randomCoordsOutsideCircle } from '../utilities';
const unsafeBlocks = [
	MinecraftBlockTypes.lava.id,
	MinecraftBlockTypes.flowingLava.id,
	MinecraftBlockTypes.magma.id,
	MinecraftBlockTypes.witherRose.id,
	MinecraftBlockTypes.sweetBerryBush.id,
	MinecraftBlockTypes.fire.id,
	MinecraftBlockTypes.campfire.id,
	MinecraftBlockTypes.cactus.id,
	MinecraftBlockTypes.soulCampfire.id,
	MinecraftBlockTypes.soulFire.id,
	MinecraftBlockTypes.water.id,
	MinecraftBlockTypes.flowingWater.id,
	MinecraftBlockTypes.soulSand.id,
	MinecraftBlockTypes.soulSoil.id

];
content.warn({ unsafeBlocks });
class TeleportBuilder {
	constructor() {

	}
	/**
	 * @typedef {Object} RandomOptions
	 * @property {Number} minRadius optional?
	 * @property {Number} maxRadius
	 * @property {'circle'} type optional? default = 'circle'
	 * @property {Boolean} randomRotation optional? default = 'true'
	 * @property {Number} yMax optional? 
	 * @property {Number} yMin optional? default = -64
	*/
	/**
	 * @typedef {Object} TeleportOptions
	 * @property {Vector3} location
	 * @property {Dimension} dimension
	 * @property {XYRotation} rotation
	 * @property {Vector3} facing
	 * @property {Boolean} keepVelocity
	 * @property {RandomOptions} random
	 */
	/**
	 * @method add 
	 * @param {{[key: String]: TeleportOptions | TeleportOptions[]}} teleportObject if array its random
	 */
	add(teleportObject) {

		teleportObject.forEach((key, value) => {
			const isArray = value instanceof Array;
			if (!(isArray)) value = [value];
			value.forEach((teleportObject, i) => {
				let { location, dimension, face, keepVelocity = false, random } = teleportObject;
				const { minRadius = 0, maxRadius, type = 'circle', randomRotation = true, yMax, yMin = -64 } = random ?? {};
				if (!(location instanceof Location) && !(location instanceof BlockLocation)) {
					return new Error(`location key of teleportObject Key: ${key}, should be a instance of Location or BlockLocation`);
				}
				const rotation = (face instanceof BlockLocation || face instanceof Location) ? undefined : face;
				const facing = (rotation) ? undefined : face;
				if (isArray) {
					if (!this.hasOwnProperty(key)) this[key] = Array(value.length);
					this[key][i] = {
						location,
						dimension,
						rotation,
						facing,
						keepVelocity,
						random: (!random) ? false : {
							minRadius,
							maxRadius,
							type,
							randomRotation,
							yMax,
							yMin
						}
					};
				} else {
					this[key] = {
						location,
						dimension,
						rotation,
						facing,
						keepVelocity,
						random: (!random) ? false : {
							minRadius,
							maxRadius,
							type,
							randomRotation,
							yMax,
							yMin
						}
					};
				}
			});


		});
		// content.warn({ this: this });

	}
	/**
	 * @method remove
	 * @param {String} key 
	 */
	remove(key) {
		delete this[key];
	};
	/**
	 * 
	 * @param {Dimension} dimension 
	 * @param {Vector3} location
	 * @param {Number} yMax 
	 * @param {Number} yMin 
	 * @param {Number} minRadius 
	 * @param {Number} maxRadius 
	 * @returns {{blockFloor: Block, blockAbove: Block, location: Location}}
	 */
	getRandomCoords(dimension, location, yMax, yMin, minRadius, maxRadius, nonRecursive) {
		const yRange = yMax - yMin + 1;
		const { x, z } = location;
		let { x: cx, z: cz } = randomCoordsOutsideCircle(minRadius, maxRadius);
		cx += x, cz += z;
		cx = Math.floor(cx) + 0.5;
		cz = Math.floor(cz) + 0.5;
		location = new Location(cx, yMax, cz);
		const blockFloor = dimension.getBlockFromRay(location, new Vector(0, -1, 0), { maxDistance: yRange, includeLiquidBlocks: true, includePassableBlocks: true });
		location = new Location(cx, blockFloor.location.y + 1, cz);
		return { location, blockFloor, blockAbove: dimension.getBlock(blockFloor.location.offset(0, 1, 0)) };
	}
	/**
	 * 
	 * @param {Dimension} dimension 
	 * @param {Vector3} location
	 * @param {Number} yMax 
	 * @param {Number} yMin 
	 * @param {Number} minRadius 
	 * @param {Number} maxRadius 
	 * @param {Boolean} nonRecursive 
	 * @returns {location: Location}}
	 */
	getRandomSafeCoords(dimension, location, yMax, yMin, minRadius, maxRadius) {
		while (true) {
			const { location: newLocation, blockFloor, blockAbove } = this.getRandomCoords(dimension, location, yMax, yMin, minRadius, maxRadius);
			content.warn({ floorId: blockFloor.typeId, aboveId: blockAbove.typeId });
			if (!unsafeBlocks.includes(blockFloor.typeId) && blockAbove.typeId === MinecraftBlockTypes.air.id) return newLocation;
		}
	}
	/**
	 * @method remove
	 * @param {Player} player 
	 * @param {String} key 
	 */
	teleport(player, key) {
		const { rotation: rotationPlayer } = player;
		if (!this.hasOwnProperty(key)) { return new Error(`teleport: ${key}, does not exist`); }
		let value;
		if (this[key] instanceof Array) value = this[key][Math.floor(Math.random() * this[key].length)];
		else value = this[key];
		let { location, facing, rotation, keepVelocity, dimension, random } = value;
		if (keepVelocity && player instanceof Player) throw new Error(`You cannot keep velocity on players`);
		if (location instanceof BlockLocation) {
			const { x, y, z } = location;
			location = new Location(Math.floor(x) + 0.5, Math.floor(y), Math.floor(z) + 0.5);
		}

		if (facing instanceof BlockLocation) {
			const { x, y, z } = location;

			facing = new Location(Math.floor(x) + 0.5, Math.floor(y), Math.floor(z) + 0.5);
			content.warn({ facing: { bool: facing instanceof BlockLocation, x: facing.x, y: facing.y, z: facing.z } });
		}
		const { minRadius = 0, maxRadius, type = 'circle', randomRotation = true, yMin, yMax } = random;
		if (random instanceof Object) {
			content.warn('-----generating--------------');
			location = this.getRandomSafeCoords(dimension, location, yMax, yMin, minRadius, maxRadius);
			const { x, y, z } = location;
			content.warn({ location });
			if (randomRotation) {
				facing = undefined;
				rotation = {};
				rotation.x = 0; //Math.random() * 180 - 90;
				rotation.y = Math.random() * 360 - 180;
			}
		}
		// content.warn({ facing: { x: facing.x, y: facing.y, z: facing.z } });
		if (facing && !rotation) {
			player.teleportFacing(location, dimension, facing, keepVelocity);
		} else {
			if (!rotation) { rotation = rotationPlayer; }
			const { x: rx, y: ry } = rotation;
			// content.warn({ location: location instanceof BlockLocation || location instanceof Location, dimension: dimension instanceof Dimension, rx, ry });
			player.teleport(location, dimension, rx, ry);
		}
	};
}

const teleportBuilder = new TeleportBuilder();
export default teleportBuilder;