// import { databases, eventBuilder } from "../../../patchy_api/modules.js";

import { content, native } from '../utilities.js';
import global from './global.js';
import databases from './database.js';
import eventBuilder from './events/export_instance.js';

class RequestBuilder {
	constructor() {

	}
	addMemory(id, key, target, type, value) {
		if (typeof id !== 'string' && typeof id !== 'number') throw new Error(`id: ${id}, at params[0] is not a String or Number!`);
		if (typeof key !== 'string' && typeof key !== 'number') throw new Error(`key: ${key}, at params[1] is not a String or Number!`);
		if (typeof target !== 'string' && typeof target !== 'number') throw new Error(`target: ${target}, at params[2] is not a String or Number!`);
		if (typeof type !== 'string' && typeof type !== 'number') throw new Error(`type: ${type}, at params[3] is not a String or Number!`);
		if (value === undefined) throw new Error(`value at params[4] is not defined`);
		if (!this.hasOwnProperty(id)) this[id] = {};
		if (!this[id].hasOwnProperty(key)) this[id][key] = {};
		if (!this[id][key].hasOwnProperty(target)) this[id][key][target] = {};
		if (!this[id][key][target].hasOwnProperty(type)) this[id][key][target][type] = {};
		this[id][key][target][type] = value;
	}
	/**
	 * 
	 * @param {String} target 
	 * @param {Array<String>} keys 
	 * @param {boolean} isArray 
	 */
	getMemoryTarget(id, target, keys, type, isArray = false) {
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
			return this[id].forEach((key, targets) => {

				const target = targets[targets];
				if (!target) return;
				if (type && target.hasOwnProperty(type)) return { [key]: target[type] };
				else return { [key]: target };

			}, returnType);
		} else {
			return keys.accumulate(key => {
				if (!this?.[id]?.[key]?.[target]) return;

				if (type && this[id][key][target].hasOwnProperty(type)) return { [key]: this[id][key][target] };
				else return { [key]: this[id][key][target] };
			}, returnType);
		}
	}
	removeMemory(id, key, target, type) {
		if (typeof id !== 'string' && typeof id !== 'number') throw new Error(`id: ${id}, at params[0] is not a String or Number!`);
		if (typeof key !== 'string' && typeof key !== 'number') throw new Error(`key: ${key}, at params[1] is not a String or Number!`);
		if (target && typeof target !== 'string' && typeof target !== 'number') throw new Error(`target: ${target}, at params[2] is not a String or Number!`);
		if (type && typeof type !== 'string' && typeof type !== 'number') throw new Error(`type: ${type}, at params[3] is not a String or Number!`);
		if (target) {
			if (type) {
				delete this[id][key][target][type];
				const targetLength = this[id][key][target].length();
				if (!targetLength) {
					delete this[id][key][target];
				}
			}
			const keyLength = this[id][key].length();
			if (!keyLength) {
				delete this[id][key];
			}
		} else {
			delete this[id][key];
		}
		const requestsLength = this[id].length();
		if (!requestsLength) {
			delete this[id];
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
	add(id, key, target, type, value) {
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
	 * @typedef {Object} watchOptions
	 * @property {Boolean} removeKey when return is true for a iteration of the rquest the value is automatically removed
	 * @property {Array<String>} eventKeys
	 
	*/
	/**
	 * @method watch watches callbacks for a true return
	 * @param {String} id 
	 * @param {(key: String, target: String, type: String, value: any) => {}} testCallback 
	 * @param {(key: String, target: String, type: String, value: any) => {}} findCallback 
	 * @param {watchOptions} options 
	 */
	watch(id, testCallback, findCallback = null, options = {}) {



		content.warn({ t: 'RequestBuilderwatch', id });
		if (id instanceof String) throw new Error(`findCallback for id: ${id}, is not a String`);
		if (!(testCallback instanceof Function)) throw new Error(`testCallback for id: ${id}, is not a Function.`);
		if (findCallback && !(findCallback instanceof Function)) throw new Error(`findCallback for id: ${id}, is defined and not a Function`);
		if (options && !(options instanceof Object)) throw new Error(`findCallback for id: ${id}, is defined and not an Object`);
		// if (key && this.hasOwnProperty(key)) return new Error(`key: ${key}, for options for id: ${id}, is defined and does not exist on requestBuilder`);
		const { /*key, keys,*/eventKeys = ['playerJoined', 'requestAdded'], removeKey = true } = options;
		if (removeKey !== null && removeKey !== undefined && !(typeof removeKey === 'boolean')) throw new Error(`removeKey for options for id: ${id}, is not undefined, null or a boolean`);
		if (!(eventKeys instanceof Array)) throw new Error(`removeKey for options for id: ${id}, is not undefined, null or a boolean`);

		content.warn(11111, 'RequestBuilderwatch');
		const call = () => {
			// content.warn('help');
			let database = databases.get("requestsAPI") ?? databases.add("requestsAPI");
			const requests = database.get(id) ?? {};
			content.warn({ id, requests });
			if (!requests) return;
			requests.forEach((key, targets) => {
				targets.forEach((target, types) => {
					types.forEach((type, value) => {
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

		};
		eventBuilder.subscribe(`requestsAPI*${id}`, {
			...eventKeys.accumulate((eventkey, i) => ({ [eventkey]: call }), {})
		});
	}
	/**
	 * @method terminate removes watch for a request id
	 * @param {String} id 
	 */
	terminate(id) {
		eventBuilder.unsubscribeEvent(`requestsAPI*${id}`, 'tickAfterLoad');
	}
	/**
	 * 
	 * @param {String | Number} id 
	 * @param {String | Number} key 
	 * @param {String | Number} target 
	 * @param {String | Number} type
	 */
	remove(id, key, target, type) {
		if (typeof id !== 'string' && typeof id !== 'number') throw new Error(`id: ${id}, at params[0] is not a String or Number!`);
		if (typeof key !== 'string' && typeof key !== 'number') throw new Error(`key: ${key}, at params[1] is not a String or Number!`);
		if (target && typeof target !== 'string' && typeof target !== 'number') throw new Error(`target: ${target}, at params[2] is not a String or Number!`);
		if (type && typeof type !== 'string' && typeof type !== 'number') throw new Error(`type: ${type}, at params[3] is not a String or Number!`);
		let database = databases.get("requestsAPI"); //?? databases.add("requestsAPI");
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
