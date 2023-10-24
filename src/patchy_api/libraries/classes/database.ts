import { Entity, Player, system, world } from "@minecraft/server";
import propertyManager from "./property";
export function isDefined<T>(input: T) {
	return (input !== null && input !== undefined && !Number.isNaN(input));
}
export function chunkString(str: string, length: number): string[] {
	let size = (str.length / length) | 0;
	const array = Array(++size);
	for (let i = 0, offset = 0; i < size; i++, offset += length) {
		array[i] = str.substr(offset, length);
	}
	return array;
}

const chunkLength = 32760;
export class Database {
	__db_properties: any;
	[key: string | number]: any;
	constructor(json: Record<string | number, any> = {}) {

		Object.assign(this, json);
		this.__db_properties = json.__db_properties ?? {};
		// content.warn({ json, __db_properties: this.__db_properties });
	}
	/**
	 * @method set set a keys for its value in the Database
	 * @param {String} key key for value.
	 * @param {any} value value for key.
	 * @returns {Database} this
	 */
	set(key: string | number, value: any): this {
		if (typeof key !== 'number' && typeof key !== 'string') throw new Error('argument zero must be a key');
		if (!isDefined(value)) throw new Error('Argument one must have a value for the key');
		if (key === '__db_properties') throw new Error('Key must not be "__db_properties"');
		this[key] = value;
		// content.warn({ t: 'DatabaseSet', [key]: value, databases });
		return this;


	}
	get(key: string | number): any {
		if (typeof key !== 'number' && typeof key !== 'string') throw new Error('argument zero must be a key');
		if (key === '__db_properties') throw new Error('Key must not be "__db_properties"');
		if (this[key]) return this[key];


	}

	delete(key: string | number) {
		if (typeof key !== 'number' && typeof key !== 'string') throw new Error('argument zero must be a key');
		if (key === '__db_properties') throw new Error('Key must not be "__db_properties"');
		delete this[key];
		return this;
	}
	clear() {
		Object.keys(this).filter(key => key !== '__db_properties').forEach(key => delete this[key]);
		return this;
	}
	has(key: string | number) {
		if (typeof key !== 'number' && typeof key !== 'string') throw new Error('argument zero must be a key');
		return key in this;
	}
}

export class ProperyDatabases {
	databases: Record<string | number, Database> = {};
	queueSaves: [string | number, Entity | undefined][] = [];
	forgetScheduled: Record<string | number, [number, boolean]> = {};
	subscribedQueueSave: boolean = false;
	private subsribeQueueSave() {
		if (this.subscribedQueueSave) return;
		this.subscribedQueueSave = true;
		const runId = system.runInterval(() => {
			if (!this.queueSaves.length) return (system.clearRun(runId), this.subscribedQueueSave = true);
			const [key, entity] = this.queueSaves.shift()!;
			this.save(key, entity);
		});
	}

	getFor(key: string | number, entity?: Player | Entity, duration: number = 1000): Database | undefined {
		const cacheKey = key + (entity ? `:${entity.id}` : '');
		const runId = system.runTimeout(() => {
			this.forget(key, entity);
			delete this.forgetScheduled[cacheKey];
		}, duration);
		if (cacheKey in this.forgetScheduled) system.clearRun(this.forgetScheduled[cacheKey]![0]);
		this.forgetScheduled[cacheKey] = [runId, true];
		return this.get(key, entity);
	}
	forget(key: string | number, entity?: Player | Entity) {
		const cacheKey = key + (entity ? `:${entity.id}` : '');
		delete this.databases[cacheKey];
	}
	/**
	 * @method getUnCached get a Database without caching it you cannot create a new Database with this method
	 */
	getUnCached(key: string | number, entity?: Player | Entity): Database | undefined {
		const usedProperties = propertyManager.get(entity).getJSON<Record<string | number, any>>(`PDB:${key}`);
		if (!usedProperties) return;
		return new Database(usedProperties);
	}
	get(key: string | number, entity?: Player | Entity): Database | undefined {
		if (typeof key !== 'number' && typeof key !== 'string') throw new Error('argument zero must be a key');
		const cacheKey = key + (entity ? `:${entity.id}` : '');
		if (this.databases[cacheKey]) return this.databases[cacheKey]!;
		const usedProperties = propertyManager.get(entity).getJSON<Record<string | number, any>>(`PDB:${key}`);
		if (!usedProperties) return;
		this.databases[cacheKey] = new Database(usedProperties);
		return this.databases[cacheKey];
	}
	add(key: string | number, entity?: Player | Entity): Database {
		if (typeof key !== 'number' && typeof key !== 'string') throw new Error('argument zero must be a key');
		const cacheKey = key + (entity ? `:${entity.id}` : '');
		this.databases[cacheKey] = new Database();
		return this.databases[cacheKey]!;
	}
	save(key: string | number, entity?: Player | Entity) {
		if (typeof key !== 'number' && typeof key !== 'string') throw new Error('argument zero must be a key');
		const cacheKey = key + (entity ? `:${entity.id}` : '');
		const database = this.databases[cacheKey];
		propertyManager.get(entity).setJSON(`PDB:${key}`, database);
	}
	delete(key: string | number, entity?: Player | Entity) {
		propertyManager.get(entity).setJSON(`PDB:${key}`);
	}
	queueSave(key: string | number, entity?: Player | Entity) {
		if (typeof key !== 'number' && typeof key !== 'string') throw new Error('argument zero must be a key');
		if (this.queueSaves.findIndex(([k, e]) => k === key && (entity && e?.id === entity.id)) !== -1) return;
		this.subsribeQueueSave();
		this.queueSaves.push([key, entity!]);
	}
}
const databases = new ProperyDatabases();
export default databases;