import { BlockLocation, system, Vector3, Dimension } from '@minecraft/server';
import { isVector3, orArray, sort3DVectors, content, native } from "../../utilities";

const saveModes = ['memory', 'disk'];
const rotations = ['0_degrees', '90_degrees', '180_degrees', '270_degrees'];
const mirrors = ['none', 'x', 'xz', 'z'];
const animationModes = ['block_by_block', 'layer_by_layer'];

/**
 * @typedef {{name: string, dimension: Dimension, location1: Vector3, location2: Vector3, saveMode?: 'memory' | 'disk', includesEntites?: boolean, includesBlocks?: boolean}} SaveOptions
 */
/**
 * @typedef {Iterator< undefined, [BlockLocation, BlockLocation]>} SaveIterator
 */
/**
 * @typedef {{dimension: Dimension, location: Vector3, name: string, rotation?: '0_degrees' | '90_degrees' | '180_degrees' | '270_degrees', mirror?: 'none' | 'x' | 'xz' | 'z', animationMode?: 'block_by_block' | 'layer_by_layer', animationSeconds?: number, includesEntites?: boolean, includesBlocks?: boolean, waterlogged: boolean, integrity: Number, seed: string}} LoadOptions
 */
export class StructureBuilder {
	constructor() {
		/**
		 * @type {[string, Dimension, SaveIterator, SaveOptions][]}
		 */
		this.saveQueue = [];
		/**
		 * @type {[LoadOptions][]}
		 */
		this.loadQueue = [];
		this.subscribedLoadQueue = false;
		this.subscribedSaveQueue = false;
		this.vars = {};
	}
	/**
	 * @param {SaveOptions} options 
	 */
	save(options) {

		const { name, dimension, location1, location2, saveMode, includesEntites, includesBlocks } = options;
		if (!(dimension instanceof Dimension)) throw new Error('dimension in saveOptions at params[0] is not of type: Dimension!');
		if (!isVector3(location1)) throw new Error('location1 in saveOptions at params[0] is not of type: Vector3!');
		if (!isVector3(location2)) throw new Error('location2 in saveOptions at params[0] is not of type: Vector3!');
		if (saveMode && !saveModes.includes(saveMode)) throw new Error(`saveMode in saveOptions at params[0] is defined and not one of the following: ${orArray(saveModes)}!`);
		if (includesEntites && typeof includesEntites !== 'boolean') throw new Error(`includesEntites in saveOptions at params[0] is defined and not of type: Boolean!`);
		if (includesBlocks && typeof includesBlocks !== 'boolean') throw new Error(`includesBlocks in saveOptions at params[0] is defined and not of type: Boolean!`);
		const iterator = this.getSaveIterator(...sort3DVectors(location1, location2));

		this.queueSave(name, dimension, iterator, options);
	}
	subscribeSaveQueue() {
		const thisStructure = this;
		if (this.subscribedSaveQueue) return;
		this.subscribedSaveQueue = true;
		function tick() {
			const systemIdNumber = system.run(async () => {
				try {
					const currentSave = thisStructure.saveQueue[0];
					if (!currentSave) return (system.clearRun(systemIdNumber), thisStructure.subscribedSaveQueue = false);
					const [name, dimension, iterator, { location1, location2, saveMode, includesEntites, includesBlocks }] = currentSave;
					const { value, done } = iterator.next();

					if (done) return (tick(), thisStructure.saveQueue.shift(), dimension.runCommandAsync(`tickingarea remove StructureSaveAPI`).catch(error => console.warn(error, error.stack)));
					const [{ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }, column, row] = value;
					// content.warn({ command: `tickingarea add ${x1} ${y1} ${z1} ${x2} ${y2} ${z2} StructureSaveAPI true`, location1: { x: x1, y: y1, z: z1 }, location2: { x: x2, y: y2, z: z2 }, column, row });
					await dimension.runCommandAsync(`tickingarea remove StructureSaveAPI`).catch(error => console.warn(error, error.stack));
					await dimension.runCommandAsync(`tickingarea add ${x1} ${y1} ${z1} ${x2} ${y2} ${z2} StructureSaveAPI true`).catch(error => console.warn(error, error.stack));
					await dimension.runCommandAsync(`structure save ${name}_${column}_${row} ${x1} ${y1} ${z1} ${x2} ${y2} ${z2}`).catch(error => console.warn(error, error.stack));
					tick();
				} catch (error) {
					console.warn(error, error.stack);
				}
			});
		}
		tick();
	}
	/**
	 * @param {string} name
	 * @param {Dimension} dimension 
	 * @param {Iterator<[BlockLocation, BlockLocation, number, number]>} iterator 
	 * @param {SaveOptions} options 
	 */
	queueSave(name, dimension, iterator, options) {
		this.saveQueue.push([name, dimension, iterator, options]);
		this.subscribeSaveQueue();
	};
	/**
	 * @private
	 */
	getSaveIterator(location1, location2) {
		const { x: x1, y: y1, z: z1 } = location1;
		const { x: x2, y: y2, z: z2 } = location2;
		const length = x2 - x1 + 1;
		const width = z2 - z1 + 1;
		const length64 = Math.ceil(length / 64);
		const width64 = Math.ceil(width / 64);
		const iterations = length64 * width64;
		return (function* () {
			for (let i = 0, x = 0, z = 0, c = 0, r = 0; i < iterations; i++, x += 64, c++) {

				if (x >= length) x = 0, c = 0, z += 64, r++;
				// content.warn({ length, x, z, c, r });
				yield [new BlockLocation(x1 + x, y1, z1 + z), new BlockLocation(x1 + x + 63, y2, z1 + z + 63), c, r];
			}
		})();

	}
	subscribeLoadQueue() {
		const thisStructure = this;
		if (this.subscribedLoadQueue) return;
		this.subscribedLoadQueue = true;
		function tick() {
			const systemIdNumber = system.run(async () => {
				try {

					const currentLoad = thisStructure.loadQueue[0];
					if (!currentLoad) return (system.clearRun(systemIdNumber), thisStructure.subscribedLoadQueue = false);
					if (!thisStructure.vars.hasOwnProperty('init')) {
						thisStructure.vars.x = 0;
						thisStructure.vars.z = 0;
						thisStructure.vars.c = 0;
						thisStructure.vars.r = 0;
						thisStructure.vars.newRow = false;
					}
					thisStructure.vars.init = true;
					const { x, z, c, r, newRow } = thisStructure.vars;
					const [{ name, dimension, location: { x: x1, y, z: z1 } }] = currentLoad;
					content.warn({ name, dimension: dimension.id, x, z, c, r });
					await dimension.runCommandAsync(`tickingarea remove StructureSaveAPI`).catch(error => console.warn(error, error.stack));
					await dimension.runCommandAsync(`tickingarea add ${x + x1} ${y} ${z + z1} ${x + x1 + 63} ${y} ${z + z1 + 63} StructureSaveAPI true`).catch(error => console.warn(error, error.stack));
					await dimension.runCommandAsync(`structure load ${name}_${c}_${r} ${x + x1} ${y} ${z + z1}`).catch(error => {
						tick(); console.warn(error, error.stack);
						if (newRow || (!x && !z)) {
							thisStructure.loadQueue.shift();
							thisStructure.vars = {};
							dimension.runCommandAsync(`tickingarea remove StructureSaveAPI`).catch(error => console.warn(error, error.stack));
							return;
						} else {
							thisStructure.vars.z += 64;
							thisStructure.vars.r++;
							thisStructure.vars.c = 0;
							thisStructure.vars.x = 0;
							thisStructure.vars.newRow = true;
						}
					});
					thisStructure.vars.newRow = false;
					thisStructure.vars.x += 64, thisStructure.vars.c++;
					tick();
				} catch (error) {
					console.warn(error, error.stack);
				}
			});
		}
		tick();
	}
	/**
	 * @param {string} name
	 * @param {Dimension} dimension 
	 * @param {Iterator<[BlockLocation, BlockLocation, number, number]>} iterator 
	 * @param {SaveOptions} options 
	 */
	queueLoad(options) {

		this.loadQueue.push([options]);
		this.subscribeLoadQueue();
	};
	/**
	 * @param {LoadOptions} options 
	 */
	load(options) {
		const { name, dimension, location, rotation = '0_degrees', mirror = 'none', animationMode = 'layer_by_layer', animationSeconds = 0, includesEntites = false, includesBlocks = false, waterlogged, seed } = options;
		if (typeof name !== 'string') throw new Error(`name in loadOptions at params[0] is defined and not of type: String!`);
		if (!(dimension instanceof Dimension)) throw new Error('dimension in loadOptions at params[0] is not of type: Dimension!');
		if (!isVector3(location)) throw new Error('location in loadOptions at params[0] is not of type: Vector3!');
		if (rotation && !rotations.includes(rotation)) throw new Error(`rotation in loadOptions at params[0] is defined and not one of the following: ${orArray(rotations)}!`);
		if (mirror && !mirrors.includes(mirror)) throw new Error(`mirror in loadOptions at params[0] is defined and not one of the following: ${orArray(mirrors)}!`);
		if (animationMode && !animationModes.includes(animationMode)) throw new Error(`animationMode in loadOptions at params[0] is defined and not one of the following: ${orArray(animationModes)}!`);
		if (animationSeconds && typeof animationSeconds !== 'number') throw new Error(`animationSeconds in loadOptions at params[0] is defined and not of type: Number!`);
		if (includesEntites && typeof includesEntites !== 'boolean') throw new Error(`includesEntites in loadOptions at params[0] is defined and not of type: Boolean!`);
		if (includesBlocks && typeof includesBlocks !== 'boolean') throw new Error(`includesBlocks in loadOptions at params[0] is defined and not of type: Boolean!`);
		if (waterlogged && typeof waterlogged !== 'boolean') throw new Error(`waterlogged in loadOptions at params[0] is defined and not of type: Boolean!`);
		if (seed && typeof seed !== 'string') throw new Error(`seed in loadOptions at params[0] is defined and not of type: String!`);
		this.queueLoad(options);
	}
}