import { Location, BlockLocation } from '@minecraft/server';
class TeleportBuilder {
	constructor() {

	}
	/**
	 * @method add 
	 * @param {Object} teleportObject 
	 */
	add(teleportObject) {
		teleportObject.forEach((key, value) => {
			let { location, dimension, face, keepVelocity = false } = value;
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
				keepVelocity
			};
		});

	}
	remove(key) {
		delete this[key];
	};
	teleport(player, key) {
		const { rotation: rotationPlayer } = player;
		if (!this.hasOwnProperty(key)) { return new Error(`teleport: ${key}, does not exist`); }
		let { location, rotation, keepVelocity, dimension } = this[key];
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