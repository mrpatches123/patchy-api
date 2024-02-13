import { Block, Dimension, BlockTypes, Vector, Vector2, Vector3 } from '@minecraft/server';
import { content, isVector2, isVector3, native, offsetVector3, randomCoordsOutsideCircle } from '../utilities.js';
import { Player } from './player/class.js';
import time from './time.js';
import { MinecraftBlockTypes, MinecraftEntityTypes } from '../../vanilla-data.js';
const unsafeBlocks: string[] = [
	MinecraftBlockTypes.Lava,
	MinecraftBlockTypes.FlowingLava,
	MinecraftBlockTypes.Magma,
	MinecraftBlockTypes.WitherRose,
	MinecraftBlockTypes.SweetBerryBush,
	MinecraftBlockTypes.Fire,
	MinecraftBlockTypes.Cactus,
	MinecraftBlockTypes.Cactus,
	MinecraftBlockTypes.SoulCampfire,
	MinecraftBlockTypes.SoulFire,
	MinecraftBlockTypes.Water,
	MinecraftBlockTypes.FlowingWater,
	MinecraftBlockTypes.SoulSand,
	MinecraftBlockTypes.SoulSoil,
	MinecraftBlockTypes.Cactus
];
function objectVector3(vector3: any) {
	const { x, y, z } = vector3;
	return ({ x, y, z });

}
interface RandomOptions {
	minRadius: number;
	maxRadius: number;
	type: 'circle';
	randomRotation?: boolean;
	yMax: number;
	yMin: number;
}
interface TeleportOptions {
	location: { x: number; y: number; z: number; };
	dimension: Dimension;
	facing?: { x: number; y: number; z: number; };
	rotation?: { x: number; y: number; };
	face?: { x: number; y: number; z: number; };
	keepVelocity?: boolean;
	random?: RandomOptions;
}
interface RelitiveOffset {
	location: Vector3;
	offset: Vector3;
};
export interface TeleportObjectOnce {
	location: Vector3 | RelitiveOffset;
	face: { x: number; y: number; } | Vector3 | RelitiveOffset;
	dimension: Dimension;
}
content.warn({ unsafeBlocks });


class TeleportBuilder {
	teleports: { [key: string]: TeleportOptions[]; } = {};

	/**
	 * @method add 
	 * @param {{[key: String]: TeleportOptions | TeleportOptions[]}} teleportObject if array its random
	 */
	add(teleportObject: { [key: string]: TeleportOptions | TeleportOptions[]; }) {

		Object.entries(teleportObject).forEach(([key, value]) => {
			const isArray = value instanceof Array;
			if (!(value instanceof Array)) value = [value];

			value.forEach((teleportObject, i) => {
				let { location, dimension, face, keepVelocity = false, random } = teleportObject;
				const { minRadius = 0, maxRadius, type = 'circle', randomRotation = true, yMax, yMin = -64 } = random ?? {};
				if (!isVector3(location)) throw new Error(`location key of teleportObject Key: ${key}, should be a instance of Vector3`);
				const rotation = (isVector3(face)) ? undefined : face;
				const facing = (rotation) ? undefined : face;
				if (isArray) {
					this.teleports[key] ??= Array((value as TeleportOptions[]).length);
					this.teleports[key]![i]! = {
						location,
						dimension,
						rotation,
						facing,
						keepVelocity,
						random: (!random) ? undefined : {
							minRadius,
							maxRadius,
							type,
							randomRotation,
							yMax,
							yMin
						} as RandomOptions
					};
				} else {
					this.teleports[key] ??= Array(1);
					this.teleports[key]![0] = {
						location,
						dimension,
						rotation,
						facing,
						keepVelocity,
						random: (!random) ? undefined : {
							minRadius,
							maxRadius,
							type,
							randomRotation,
							yMax,
							yMin
						} as RandomOptions
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
	remove(key: string) {
		delete this.teleports[key];
	};
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
	getRandomCoords(dimension: Dimension, location: { x: number; y: number; z: number; }, yMax: number, yMin: number, minRadius: number, maxRadius: number) {
		time.start('tpTest');
		const yRange = yMax - yMin + 1;
		const { x, z } = location;

		let { x: cx, z: cz } = randomCoordsOutsideCircle(minRadius, maxRadius);

		cx += x, cz += z;
		cx = Math.floor(cx) + 0.5;
		cz = Math.floor(cz) + 0.5;
		location = { x: cx, y: yMax, z: cz };

		const { block: blockFloor } = dimension.getBlockFromRay(location, new Vector(0, -1, 0), { maxDistance: yRange, includeLiquidBlocks: true, includePassableBlocks: true }) ?? {};
		if (!blockFloor) return false;
		location = { x: cx, y: blockFloor.location.y + 1, z: cz };
		const out = { location, blockFloor, blockAbove: dimension.getBlock(offsetVector3(blockFloor.location, { x: 0, y: 1, z: 0 })) };
		content.warn({ tpTest: time.end('tpTest') });
		return out;
	}
	getRandomSafeCoords(dimension: Dimension, location: { x: number; y: number; z: number; }, yMax: number, yMin: number, minRadius: number, maxRadius: number) {
		while (true) {
			const { location: newLocation, blockFloor, blockAbove } = this.getRandomCoords(dimension, location, yMax, yMin, minRadius, maxRadius) || {};
			if (!unsafeBlocks.includes(blockFloor?.typeId!) && blockAbove?.typeId === MinecraftBlockTypes.Air) return newLocation;
		}
	}

	/**
	 * @param {Player} player 
	 * @param {TeleportObjectOnce} teleportObject 
	 */
	teleportOnce(player: Player, teleportObject: TeleportObjectOnce) {
		content.warn({ wdljikhwdkwdwdwdwdiwdiozz: '4485789653897867865378653786786879' });
		const { rotation: rotationPlayer } = player;
		// if (teleportObject instanceof Array) value = teleportObject[Math.floor(Math.random() * this[key].length)];
		let { location, face, dimension } = teleportObject;
		if (!isVector3(location) && location instanceof Object) {
			let { offset, location: relitiveLocation } = location as RelitiveOffset;
			content.warn({ offset: objectVector3(offset), relitiveLocation: objectVector3(relitiveLocation) });
			const { x, y, z } = relitiveLocation;
			const { x: ox = 0, y: oy = 0, z: oz = 0 } = offset ?? {};
			location = { x: x + ox, y: y + oy, z: z + oz };
		}

		if (face && !isVector2(face) && face instanceof Object) {
			let { offset, location: relitiveLocation } = face as RelitiveOffset;
			const { x, y, z } = relitiveLocation;
			const { x: ox = 0, y: oy = 0, z: oz = 0 } = offset ?? {};
			face = { x: x + ox, y: y + oy, z: z + oz };
		}
		let rotation = (isVector3(face)) ? undefined : face;
		let facing = (rotation) ? undefined : face;
		content.warn({ facing: objectVector3(facing), location: objectVector3(location) });
		if (facing && !rotation) return player.teleport(location as Vector3, { dimension, facingLocation: facing as Vector3 });
		if (!isVector2(rotation)) { rotation = rotationPlayer; }
		player.teleport(location as Vector3, { dimension, rotation: rotation as Vector2 });

	};
	/**
	 * @method remove
	 * @param {Player} player 
	 * @param {String} key 
	 */
	teleport(player: Player, key: string) {
		const { rotation: rotationPlayer } = player;
		if (!this.teleports.hasOwnProperty(key)) { return new Error(`teleport: ${key}, does not exist`); }
		let value;
		if (this.teleports[key] instanceof Array) value = this.teleports[key]![Math.floor(Math.random() * this.teleports[key]!.length)];
		else value = this.teleports[key];
		let { location, facing, rotation, keepVelocity, dimension, random } = value as TeleportOptions;
		if (keepVelocity && player instanceof Player) throw new Error(`You cannot keep velocity on players`);
		const { minRadius = 0, maxRadius, type = 'circle', randomRotation = true, yMin, yMax } = random ?? {};
		if (random instanceof Object) {
			content.warn('-----generating--------------');
			location = this.getRandomSafeCoords(dimension, location, yMax!, yMin!, minRadius, maxRadius!)!;
			if (randomRotation) {
				facing = undefined;
				rotation = {} as Vector2;
				rotation.x = 0; //Math.random() * 180 - 90;
				rotation.y = Math.random() * 360 - 180;
			}
		}
		// content.warn({ facing: { x: facing.x, y: facing.y, z: facing.z } });
		if (facing && !rotation) {
			player.teleport(location, { dimension, facingLocation: facing });
		} else {
			if (!rotation) { rotation = rotationPlayer; };
			content.warn({ location, t: 'teleportlocation' });
			player.teleport(location, { dimension, rotation });
		}
	};
}

const teleportBuilder = new TeleportBuilder();
export default teleportBuilder;