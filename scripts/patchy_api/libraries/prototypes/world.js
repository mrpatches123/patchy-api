import { overworld, nether, end } from '../utilities.js';
import { World } from 'mojang-minecraft';

const worldFunctions = {
	/**
	 * @method getEntities
	 * @param {EntityQueryOptions} EntityQueryOptions 
	 * @returns {Array<Entity>}
	 */
	getEntities(EntityQueryOptions) {
		return [...overworld.getEntities(EntityQueryOptions), ...nether.getEntities(EntityQueryOptions), , ...end.getEntities(EntityQueryOptions)];
	}
};
Object.assign(World.prototype, worldFunctions);