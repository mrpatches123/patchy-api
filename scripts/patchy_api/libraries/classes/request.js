// import { databases, eventBuilder } from "../../../patchy_api/modules.js";

import { content } from '../utilities.js';
import databases from './database.js';
import eventBuilder from './events.js';

class RequestBuilder {
	constructor() {

	}
	add(id, key, target, value) {
		const database = databases.get("requestsAPI") ?? databases.add("requestsAPI");
		const requests = database.get(id) ?? {};
		if (!requests.hasOwnProperty(key)) requests[key] = {};
		requests[key][target] = value;
		database.set(id, requests);
		databases.queueSave("requestsAPI");
		// content.warn({ requests });
	}
	// options = {
	// 	key: Array,
	// 	keys: Array<String>,
	// 	removeKey: Boolean
	// }
	watch(id, testCallback, findCallback = null, options = {}) {



		// content.warn('RequestBuilderwatch');
		if (id instanceof String) throw new Error(`findCallback for id: ${id}, is not a String`);
		if (!(testCallback instanceof Function)) throw new Error(`testCallback for id: ${id}, is not a Function.`);
		if (findCallback && !(findCallback instanceof Function)) throw new Error(`findCallback for id: ${id}, is defined and not a Function`);
		if (options && !(options instanceof Object)) throw new Error(`findCallback for id: ${id}, is defined and not an Object`);
		// if (key && this.hasOwnProperty(key)) return new Error(`key: ${key}, for options for id: ${id}, is defined and does not exist on requestBuilder`);
		const { /*key, keys,*/ removeKey = true } = options;
		// if (keys) {
		// 	if (!(keys instanceof Object)) return new Error(`keys for options for id: ${id}, is defined and not an Array`);
		// 	keys.forEach(key => {
		// 		if (this.hasOwnProperty(key)) return new Error(`keys: ${key}, for options for id: ${id}, is defined and does not exist on requestBuilder`);
		// 	});
		// }
		// content.warn({ removeKey, Notbool: true instanceof Boolean, Notnull: removeKey !== null, Notundefined: removeKey !== undefined });
		if (!(typeof removeKey === 'boolean') && removeKey !== null && removeKey !== undefined) throw new Error(`removeKey for options for id: ${id}, is not undefined, null or a boolean`);
		// content.warn(11111, 'RequestBuilderwatch');
		eventBuilder.subscribe(`requestsAPI*${id}`, {
			tickAfterLoad: () => {
				// content.warn('help');
				const database = databases.get("requestsAPI") ?? databases.add("requestsAPI");
				const requests = database.get(id);
				// content.warn({ id, requests });
				if (!requests) return;
				requests.forEach((id, targets) => {
					targets.forEach((target, value) => {
						const test = testCallback(id, target, value);
						// content.warn({ test, removeKey, target, value });
						if (test) {
							if (findCallback) findCallback(id, target, value);
							if (removeKey) {
								this.remove(id, id, target);
							}
						};
					}
					);
				});
			}
		});
	}
	terminate(id) {
		eventBuilder.unsubscribeEvent(`requestsAPI*${id}`, 'tickAfterLoad');
	}
	remove(id, key, target) {
		content.warn('why');
		const database = databases.get("requestsAPI") ?? databases.add("requestsAPI");
		const requests = database.get(id);
		let requestsLength;
		if (target) {
			// content.warn({ id, key, len: requests[key].length() });////len: requests[key].length()
			delete requests[key][target];
			requestsLength = requests[key].length();
			if (!requestsLength) {
				delete requests[key];
			}

		} else {
			requestsLength = false;
			delete requests[key];
		}
		if (requestsLength) {
			database.delete(id);
		}
		database.set(id, requests);
		databases.queueSave("requestsAPI");
	}
}

const requestBuilder = new RequestBuilder();
export default requestBuilder;