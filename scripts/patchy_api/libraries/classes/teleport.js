import { Block, Dimension, XYRotation, MinecraftBlockTypes, Vector } from '@minecraft/server';
import { content, isVector2, isVector3, native, offsetVector3, randomCoordsOutsideCircle } from '../utilities.js';
import { Player } from './player/class.js';
import time from './time.js';
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
	MinecraftBlockTypes.soulSoil.id,
	MinecraftBlockTypes.cactus.id
];
function objectVector3(vector3) {
	const { x, y, z } = vector3;
	return ({ x, y, z });

}
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
	 * @property {{x: number, y: number, z: number}} location
	 * @property {Dimension} dimension
	 * @property {XYRotation} rotation
	 * @property {{x: number, y: number, z: number}} face
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
				if (!isVector3(location)) throw new Error(`location key of teleportObject Key: ${key}, should be a instance of Vector3`);
				const rotation = (isVector3(face)) ? undefined : face;
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
	 * @param {{x: number, y: number, z: number}} location
	 * @param {Number} yMax 
	 * @param {Number} yMin 
	 * @param {Number} minRadius 
	 * @param {Number} maxRadius 
	 * @returns {{blockFloor: Block, blockAbove: Block, location: import('@minecraft/server').Vector3}}
	 */
	getRandomCoords(dimension, location, yMax, yMin, minRadius, maxRadius, nonRecursive) {
		time.start('tpTest');
		const yRange = yMax - yMin + 1;
		const { x, z } = location;

		let { x: cx, z: cz } = randomCoordsOutsideCircle(minRadius, maxRadius);

		cx += x, cz += z;
		cx = Math.floor(cx) + 0.5;
		cz = Math.floor(cz) + 0.5;
		location = { x: cx, y: yMax, z: cz };

		const blockFloor = dimension.getBlockFromRay(location, new Vector(0, -1, 0), { maxDistance: yRange, includeLiquidBlocks: true, includePassableBlocks: true });
		location = { x: cx, y: blockFloor.location.y + 1, z: cz };
		const out = { location, blockFloor, blockAbove: dimension.getBlock(offsetVector3(blockFloor.location, { x: 0, y: 1, z: 0 })) };
		content.warn({ tpTest: time.end('tpTest') });
		return out;
	}
	/**
	 * 
	 * @param {Dimension} dimension 
	 * @param {{x: number, y: number, z: number}} location
	 * @param {Number} yMax 
	 * @param {Number} yMin 
	 * @param {Number} minRadius 
	 * @param {Number} maxRadius 
	 * @param {Boolean} nonRecursive 
	 * @returns {location: import('@minecraft/server').Vector3}}
	 */
	getRandomSafeCoords(dimension, location, yMax, yMin, minRadius, maxRadius) {
		while (true) {
			const { location: newLocation, blockFloor, blockAbove } = this.getRandomCoords(dimension, location, yMax, yMin, minRadius, maxRadius);
			content.warn({ floorId: blockFloor.typeId, aboveId: blockAbove.typeId });
			if (!unsafeBlocks.includes(blockFloor.typeId) && blockAbove.typeId === MinecraftBlockTypes.air.id) return newLocation;
		}
	}
	/**
	 * @typedef {Object} RelitiveOffset 
	 * @property {import('@minecraft/server').Vector3} location
	 * @property {import('@minecraft/server').Vector3} offset
	 */
	/**
	 * @typedef {Object} TeleportObjectOnce
	 * @property {import('@minecraft/server').Vector3 | RelitiveOffset} location
	 * @property {import('@minecraft/server').XYRotation | import('@minecraft/server').Vector3 | RelitiveOffset} face
	 * @property {Dimension} dimension
	 */
	/**
	 * @param {Player} player 
	 * @param {TeleportObjectOnce} teleportObject 
	 */
	teleportOnce(player, teleportObject) {
		content.warn({ wdljikhwdkwdwdwdwdiwdiozz: '4485789653897867865378653786786879' });
		const { rotation: rotationPlayer } = player;
		// if (teleportObject instanceof Array) value = teleportObject[Math.floor(Math.random() * this[key].length)];
		let { location, face, dimension } = teleportObject;
		if (!isVector3(location) && location instanceof Object) {
			let { offset, location: relitiveLocation } = location;
			content.warn({ offset: objectVector3(offset), relitiveLocation: objectVector3(relitiveLocation) });
			const { x, y, z } = relitiveLocation;
			const { x: ox, y: oy, z: oz } = offset;
			location = { x: x + ox, y: y + oy, z: z + oz };
		}

		if (face && !isVector2(face) && face instanceof Object) {
			let { offset, location: relitiveLocation } = face;
			const { x, y, z } = relitiveLocation;
			const { x: ox, y: oy, z: oz } = offset;
			face = { x: x + ox, y: y + oy, z: z + oz };
		}
		let rotation = (isVector3(face)) ? undefined : face;
		let facing = (rotation) ? undefined : face;
		content.warn({ facing: objectVector3(facing), location: objectVector3(location) });
		if (facing && !rotation) return player.teleportFacing(location, dimension, facing);
		if (!isVector2(rotation)) { rotation = rotationPlayer; }
		const { x: rx, y: ry } = rotation;
		player.teleport(
			location,
			dimension,
			rx,
			ry
		);

	};
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
			player.teleport(location, dimension, rx, ry);
		}
	};
}

const teleportBuilder = new TeleportBuilder();
export default teleportBuilder;