import { Location, BlockLocation, Block } from '@minecraft/server';
import { content, randomCoordsOutsideCircle } from '../utilities';
class TeleportBuilder {
	constructor() {

	}
	/**
	 * @method add 
	 * @param {Object} teleportObject 
	 */
	add(teleportObject) {
		content.warn(teleportObject);
		teleportObject.forEach((key, value) => {

			let { location, dimension, face, keepVelocity = false, random: { minRadius = 0, maxRadius, type = 'circle', randomRotation = true, yMax, yMin = -64 } } = value;
			if (!(location instanceof Location) && !(location instanceof BlockLocation)) {
				return new Error(`location key of teleportObject Key: ${key}, should be a instance of Location or BlockLocation`);
			}
			const rotation = (face instanceof BlockLocation || face instanceof Location) ? undefined : face;
			const facing = (rotation) ? face : undefined;
			this[key] = {
				location,
				dimension,
				rotation,
				facing,
				keepVelocity,
				random: {
					minRadius,
					maxRadius,
					type,
					randomRotation,
					yMax,
					yMin
				}
			};
		});

	}
	remove(key) {
		delete this[key];
	};
	teleport(player, key) {
		const { rotation: rotationPlayer } = player;
		if (!this.hasOwnProperty(key)) { return new Error(`teleport: ${key}, does not exist`); }
		let { location, facing, rotation, keepVelocity, dimension, random } = this[key];
		const { minRadius = 0, maxRadius, type = 'circle', randomRotation = true } = random;
		if (random) {
			const { x: cx, c: cz } = randomCoordsOutsideCircle(minRadius, maxRadius);
			let { x, y, z } = location;
			let location = new BlockLocation(x, yMax, z);
			const yRange = yMax - yMin;
			for (let i = 0; i < yRange; i++) {
				/**
				 * @type {Block}
				 */
				const block = dimension.getBlock(location.offset(0, -i, 0));
				if (block.typeId !== 'minecraft:air') y = block.location.y + 1;
			}
			location = new Location(cx + x, y, cz + z);
			if (randomRotation) {
				facing = undefined;
				rotation.y = Math.random() * 180 - 90;
				rotation.y = Math.random() * 360 - 180;
			}
		}
		if (facing && !rotation) {
			player.teleportFacing(location, dimension, facing, keepVelocity);
		} else {
			if (!rotation) { rotation = rotationPlayer; }
			const { rx, ry } = rotation;
			player.teleport(location, dimension, rx, ry, keepVelocity);
		}

	};
}

const teleportBuilder = new TeleportBuilder();
export default teleportBuilder;