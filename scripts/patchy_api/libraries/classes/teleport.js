import { Location, BlockLocation } from 'mojang-minecraft';
class TeleportBuilder {
	constructor() {

	}
	/**
	 * @method add 
	 * @param {String} key 
	 * @param {Location} location Object, Location, BlockLocation
	 * @param {Object} rotation {x,y}, boolean (if false keeps rotation)
	 * @param {Boolean} keepVelocity default? = false
	 */
	add(key, { location, face, keepVelocity = false }) {
		if (!(location instanceof Location) && !(location instanceof BlockLocation)) {
			const { x, y, z } = location;
			location = new Location(z, y, z);
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