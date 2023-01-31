import { overworld, nether, end } from '../utilities.js';
import { World } from '@minecraft/server';

const worldFunctions = {
	/**
	 * @method getEntities
	 * @param {import("@minecraft/server").EntityQueryOptions} entityQueryOptions 
	 * @returns {Array<Entity>}
	 */
	getEntities(entityQueryOptions) {
		return [...overworld.getEntities(entityQueryOptions), ...nether.getEntities(entityQueryOptions), , ...end.getEntities(entityQueryOptions)];
	}
};
Object.assign(World.prototype, worldFunctions);