"use strict";
// import { world } from "@minecraft/server";
// export function isDefined<T>(input: T) {
// 	return (input !== null && input !== undefined && !Number.isNaN(input));
// }
// export function chunkString(str: string, length: number): string[] {
// 	let size = (str.length / length) | 0;
// 	const array = Array(++size);
// 	for (let i = 0, offset = 0; i < size; i++, offset += length) {
// 		array[i] = str.substr(offset, length);
// 	}
// 	return array;
// }
// const chunkLength = 32760;
// export class Database {
// 	__db_properties: any;
// 	[key: string | number]: any;
// 	constructor(json: Record<string | number, any> = {}) {
// 		Object.assign(this, json);
// 		this.__db_properties = json.__db_properties ?? {};
// 		// content.warn({ json, __db_properties: this.__db_properties });
// 	}
// 	/**
// 	 * @method set set a keys for its value in the Database
// 	 * @param {String} key key for value.
// 	 * @param {any} value value for key.
// 	 * @returns {Database} this
// 	 */
// 	set(key: string | number, value: any): this {
// 		if (typeof key !== 'number' && typeof key !== 'string') throw new Error('argument zero must be a key');
// 		if (!isDefined(value)) throw new Error('Argument one must have a value for the key');
// 		if (key === '__db_properties') throw new Error('Key must not be "__db_properties"');
// 		this[key] = value;
// 		// content.warn({ t: 'DatabaseSet', [key]: value, databases });
// 		return this;
// 	}
// 	get(key: string | number): any {
// 		if (typeof key !== 'number' && typeof key !== 'string') throw new Error('argument zero must be a key');
// 		if (key === '__db_properties') throw new Error('Key must not be "__db_properties"');
// 		if (this[key]) return this[key];
// 	}
// 	delete(key: string | number) {
// 		if (typeof key !== 'number' && typeof key !== 'string') throw new Error('argument zero must be a key');
// 		if (key === '__db_properties') throw new Error('Key must not be "__db_properties"');
// 		delete this[key];
// 		return this;
// 	}
// 	clear() {
// 		Object.keys(this).filter(key => key !== '__db_properties').forEach(key => delete this[key]);
// 		return this;
// 	}
// 	has(key: string | number) {
// 		if (typeof key !== 'number' && typeof key !== 'string') throw new Error('argument zero must be a key');
// 		return key in this;
// 	}
// }
// export class ProperyDatabases {
// 	databases: Record<string | number, Database> = {};
// 	get(key: string | number): Database | undefined {
// 		if (typeof key !== 'number' && typeof key !== 'string') throw new Error('argument zero must be a key');
// 		if (this.databases[key]) return this.databases[key]!;
// 		const usedProperties = world.getDynamicProperty(`PDB:S:${key}`) as number;
// 		if (!usedProperties) return;
// 		this.databases[key] = new Database(JSON.parse(Array.from(new Array(usedProperties), (_, i) => world.getDynamicProperty(`PDB:${i}:${key}`)).join()));
// 		return this.databases[key]!;
// 	}
// 	add(key: string | number): Database {
// 		if (typeof key !== 'number' && typeof key !== 'string') throw new Error('argument zero must be a key');
// 		this.databases[key] = new Database();
// 		return this.databases[key]!;
// 	}
// 	save(key: string | number) {
// 		if (typeof key !== 'number' && typeof key !== 'string') throw new Error('argument zero must be a key');
// 		const chunks = chunkString(JSON.stringify(this.databases[key]!), chunkLength);
// 		const usedProperties = world.getDynamicProperty(`PDB:S:${key}`) as number;
// 		if (usedProperties > chunks.length) for (let i = chunks.length; i < usedProperties; i++) {
// 			world.setDynamicProperty(`PDB:${i}:${key}`, undefined);
// 		}
// 		chunks.forEach((chunk, i) => world.setDynamicProperty(`PDB:${i}:${key}`, chunk));
// 		world.setDynamicProperty(`PDB:S:${key}`, chunks.length);
// 	}
// }
//# sourceMappingURL=property_database.js.map