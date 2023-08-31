// import { databases, eventBuilder } from "../../../patchy_api/modules.js";

import { content, native } from '../utilities.js';
import global from './global.js';
import databases from './database.js';
import eventBuilder from './events/export_instance.js';
function lengthObject(object: any) {
	return Object.keys(object).length;
}
interface watchOptions {
	removeKey: boolean;
	eventKeys: Array<string>;
}

type Memory = {
	[id in ID]?: {
		[key in Key]?: {
			[target: number]: {
				[type in Type]?: Value;
			};
		};
	};
};
// Record<ID, Record<string, Record<string, Record<string, any>>>>

type ID = "friends";

type Key = "friends" | `friends*${string}`;

type Type = "tpa";

type Value = {
	date: ReturnType<typeof Date.now>;
};

class RequestBuilder {
	memory: Memory = {};

	addMemory(id: ID, key: Key, target: number, type: Type, value: Value): void {
		if (typeof id !== 'string' && typeof id !== 'number') throw new Error(`id: ${id}, at params[0] is not a String or Number!`);
		if (typeof key !== 'string' && typeof key !== 'number') throw new Error(`key: ${key}, at params[1] is not a String or Number!`);
		if (typeof target !== 'string' && typeof target !== 'number') throw new Error(`target: ${target}, at params[2] is not a String or Number!`);
		if (typeof type !== 'string' && typeof type !== 'number') throw new Error(`type: ${type}, at params[3] is not a String or Number!`);
		if (value === undefined) throw new Error(`value at params[4] is not defined`);

		if (!this.memory.hasOwnProperty(id)) this.memory[id] = {};
		if (!this.memory[id]!.hasOwnProperty(key)) this.memory[id]![key] = {};
		if (!this.memory[id]![key]!.hasOwnProperty(target)) this.memory[id]![key]![target] = {};
		// @ts-expect-error - looks like this is an extra step in assigning the value, since it gets applied in the call down below in the end.
		if (!this.memory[id]![key]![target]!.hasOwnProperty(type)) this.memory[id]![key]![target]![type] = {};
		this.memory[id]![key]![target]![type] = value;
	}
	/**
	 * 
	 * @param {string} target 
	 * @param {Array<string>} keys 
	 * @param {boolean} isArray 
	 */
	getMemoryTarget(id: string, target: string, keys: string[], type: string, isArray: boolean = false) {
		// content.warn({ RequestBuilder: this });
		const returnType = (isArray) ? [] : {};

		if (typeof target !== 'string' && typeof target !== 'number') throw new Error(`target: ${target}, at params[0] is not a String or Number!`);

		if (keys) {

			if (!(keys instanceof Array)) throw new Error(`keys, at params[1] is not an Array!`);
			keys.forEach((key, i) => {
				if (typeof key !== 'string' && typeof key !== 'number') throw new Error(`keys: ${key}, at params[1] at index[${i}] is not a String or Number!`);
			});
		}
		if (!keys) {
			const output = {} as Record<string, Record<string, Record<string, any>>>;
			Object.entries(this.memory[id] ?? {}).forEach(([key, targets]) => {

				const target = targets[key];
				if (!target) return;
				if (type && target.hasOwnProperty(type)) output[key] = target[type];
				else output[key] = target;

			});
			return output;
		} else {
			const output = {} as Record<string, any>;
			keys.forEach(key => {
				if (!this.memory?.[id]?.[key]?.[target]) return;

				if (type && this.memory[id]![key]![target]!.hasOwnProperty(type)) return output[key] = this.memory[id]![key]![target]!;
				else output[key] = this.memory[id]![key]![target];
			});
		}
	}
	removeMemory(id: string, key: string, target: string, type: string) {
		if (typeof id !== 'string' && typeof id !== 'number') throw new Error(`id: ${id}, at params[0] is not a String or Number!`);
		if (typeof key !== 'string' && typeof key !== 'number') throw new Error(`key: ${key}, at params[1] is not a String or Number!`);
		if (target && typeof target !== 'string' && typeof target !== 'number') throw new Error(`target: ${target}, at params[2] is not a String or Number!`);
		if (type && typeof type !== 'string' && typeof type !== 'number') throw new Error(`type: ${type}, at params[3] is not a String or Number!`);
		if (target) {
			if (type) {
				delete this.memory[id]![key]![target]![type];
				const targetLength = lengthObject(this.memory[id]![key]![target]);
				if (!targetLength) {
					delete this.memory[id]![key]![target];
				}
			}
			const keyLength = lengthObject(this.memory[id]![key]);
			if (!keyLength) {
				delete this.memory[id]![key];
			}
		} else {
			delete this.memory[id]![key];
		}
		const requestsLength = lengthObject(this.memory[id]);
		if (!requestsLength) {
			delete this.memory[id];
		}
	}
	/**
	 * @method add addes a request to a Centralised Entity Database
	 * @param {String | Number} id 
	 * @param {String | Number} key 
	 * @param {String | Number} target 
	 * @param {String | Number} type 
	 * @param {any} value 
	 */
	add(id: string | number, key: string | number, target: string | number, type: string | number, value: any) {
		if (typeof id !== 'string' && typeof id !== 'number') throw new Error(`id: ${id}, at params[0] is not a String or Number!`);
		if (typeof key !== 'string' && typeof key !== 'number') throw new Error(`key: ${key}, at params[1] is not a String or Number!`);
		if (typeof target !== 'string' && typeof target !== 'number') throw new Error(`target: ${target}, at params[2] is not a String or Number!`);
		if (typeof type !== 'string' && typeof type !== 'number') throw new Error(`type: ${type}, at params[3] is not a String or Number!`);
		if (value === undefined) throw new Error(`value at params[4] is not defined`);

		const database = databases.get("requestsAPI") ?? databases.add("requestsAPI");
		const requests = database.get(id) ?? {};
		if (!requests.hasOwnProperty(key)) requests[key] = {};
		if (!requests[key].hasOwnProperty(target)) requests[key][target] = {};
		if (!requests[key][target].hasOwnProperty(type)) requests[key][target][type] = {};
		requests[key][target][type] = value;
		database.set(id, requests);
		databases.queueSave("requestsAPI");
		global.requestAddEvent.push({ id, key, target, type, value });
		// content.warn({ requests });
	}

	/**
	 * @method watch watches callbacks for a true return
	 * @param {String} id 
	 * @param {(key: String, target: String, type: String, value: any) => {}} testCallback 
	 * @param {(key: String, target: String, type: String, value: any) => {}} findCallback 
	 * @param {watchOptions} options 
	 */
	watch(id: string, testCallback?: (key: string, target: string, type: string, value: any) => boolean | void, findCallback?: (key: string, target: string, type: string, value: any) => boolean | void, options?: watchOptions) {



		content.warn({ t: 'RequestBuilderwatch', id });
		if (typeof id !== 'string') throw new Error(`findCallback for id: ${id}, is not a String`);
		if (!(testCallback instanceof Function)) throw new Error(`testCallback for id: ${id}, is not a Function.`);
		if (findCallback && !(findCallback instanceof Function)) throw new Error(`findCallback for id: ${id}, is defined and not a Function`);
		if (options && !(options instanceof Object)) throw new Error(`findCallback for id: ${id}, is defined and not an Object`);
		// if (key && this.hasOwnProperty(key)) return new Error(`key: ${key}, for options for id: ${id}, is defined and does not exist on requestBuilder`);
		const { /*key, keys,*/eventKeys = ['playerJoined', 'requestAdded'], removeKey = true } = options ?? {};
		if (removeKey !== null && removeKey !== undefined && !(typeof removeKey === 'boolean')) throw new Error(`removeKey for options for id: ${id}, is not undefined, null or a boolean`);
		if (!(eventKeys instanceof Array)) throw new Error(`removeKey for options for id: ${id}, is not undefined, null or a boolean`);

		content.warn(11111, 'RequestBuilderwatch');
		const call = () => {
			// content.warn('help');
			let database = databases.get("requestsAPI") ?? databases.add("requestsAPI");
			const requests: Record<string, Record<string, Record<string, any>>> = database.get(id) ?? {} as Record<string, Record<string, Record<string, any>>>;
			content.warn({ id, requests });
			if (!requests) return;
			Object.entries(requests).forEach(([key, targets]) => {
				Object.entries(targets).forEach(([target, types]) => {
					Object.entries(types).forEach(([type, value]) => {
						const test = testCallback(key, target, type, value);
						// content.warn({ test, removeKey, target, value });
						if (test) {
							if (findCallback) findCallback(key, target, type, value);
							if (removeKey) {
								this.remove(id, key, target, type);
							}
						};
					});

				}
				);
			});

			eventBuilder.subscribe(`requestsAPI*${id}`, {
				...eventKeys.reduce((sum, eventkey, i) => { (sum as any)[eventkey] = call; return sum; }, {})
			});
		};
	}


	/**
	 * @method terminate removes watch for a request id
	 * @param {String} id 
	 */
	terminate(id: string) {
		eventBuilder.unsubscribe(`requestsAPI*${id}`, ['tickAfterLoad']);
	}
	/**
	 * 
	 * @param {String | Number} id 
	 * @param {String | Number} key 
	 * @param {String | Number} target 
	 * @param {String | Number} type
	 */
	remove(id: string | number, key: string | number, target: string | number, type: string | number) {
		if (typeof id !== 'string' && typeof id !== 'number') throw new Error(`id: ${id}, at params[0] is not a String or Number!`);
		if (typeof key !== 'string' && typeof key !== 'number') throw new Error(`key: ${key}, at params[1] is not a String or Number!`);
		if (target && typeof target !== 'string' && typeof target !== 'number') throw new Error(`target: ${target}, at params[2] is not a String or Number!`);
		if (type && typeof type !== 'string' && typeof type !== 'number') throw new Error(`type: ${type}, at params[3] is not a String or Number!`);
		let database = databases.get("requestsAPI") ?? databases.add("requestsAPI");
		const requests = database.get(id) ?? {};
		// content.warn({ id, database });
		// content.warn({ requests: requests, key });
		if (target) {
			// content.warn({ id, key, len: requests[key].length() });////len: requests[key].length()

			if (type) {
				delete requests[key][target][type];
				const targetLength = requests[key][target].length();
				if (!targetLength) {
					delete requests[key][target];
				}
			}
			const keyLength = requests[key].length();
			if (!keyLength) {
				delete requests[key];
			}
		} else {
			delete requests[key];
		}
		const requestsLength = requests.length();
		if (!requestsLength) {
			database.delete(id);
		} else {
			database.set(id, requests);
		}
		databases.queueSave("requestsAPI");
	}
}

const requestBuilder = new RequestBuilder();
export default requestBuilder;

		// if (keys) {
		// 	if (!(keys instanceof Object)) return new Error(`keys for options for id: ${id}, is defined and not an Array`);
		// 	keys.forEach(key => {
		// 		if (this.hasOwnProperty(key)) return new Error(`keys: ${key}, for options for id: ${id}, is defined and does not exist on requestBuilder`);
		// 	});
		// }
		// content.warn({ removeKey, Notbool: true instanceof Boolean, Notnull: removeKey !== null, Notundefined: removeKey !== undefined });
