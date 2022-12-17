import { world, InventoryComponentContainer, Enchantment } from "@minecraft/server";
import { content, eventBuilder, players, preformance } from "../../patchy_api/modules.js";


// eventBuilder.subscribe('preformanceTest', {
// 	playerJoined: ({ player }) => {
// 		const { name,  } = player;
// 		/**
// 		 * @type {InventoryComponentContainer}
// 		 */
// 		const container = player.getComponent('inventory').container;

// 		preformance.print(preformance.test({
// 			getItem: () => {
// 				const { emptySlotsCount } = container;
// 				if (emptySlotsCount === container.size) return;
// 				for (let i = 0; i < container.size; i++) {
// 					const item = container.getItem(i);
// 					if (!item) return;
// 					item;
// 				}
// 			}
// 		}, 100));
// 	}
// });
// < container.size; i++) {
// 	const element = array[i];

// }

// content.warn({ typeId: item.typeId });
preformance.print(preformance.test({
	map: (key1, value1, key2, value2, key3, value3) => {
		const storage = new Map();
		storage.set(key1, value1);
		storage.set(key2, value2);
		storage.set(key3, value3);
		storage.delete(key3);
		const value = storage.get(key1) / 2;
		storage.set(key3, value);
		storage.delete(key2);
		storage.delete(key1);
		storage.delete(key3);
	},
	object: (key1, value1, key2, value2, key3, value3) => {
		const storage = {};
		storage[key1] = value1;
		storage[key2] = value2;
		storage[key3] = value3;
		delete storage[key3];
		const value = storage[key1] / 2;
		storage[key3] = value;
		delete storage[key2];
		delete storage[key1];
		delete storage[key3];
	}
}, 10000, 'key1', 8938723732783873, 'key2', 'wdkjkjwdjwkjwdjk', 'key3', [27272, 33877823, 893893], 'key4', 28383872387, 'key5', 'iuhjkloijklqoiujkmdl;k', 'key6', '2398382389832989'));
// });

// eventBuilder.subscribe('preformanceTest', {
// 	worldLoad: () => {
// 		preformance.print(preformance.test({
// 			map: (key1, value1, key2, value2, key3, value3, key4, value4, key5, value5, key6, value6) => {
// 				const storage = new Map();
// 				storage.set(key1, value1);
// 				storage.set(key2, value2);
// 				storage.set(key3, value3);
// 				storage.set(key4, value4);
// 				storage.set(key5, value5);
// 				storage.set(key6, value6);
// 				storage.delete(key1);
// 				storage.delete(key2);
// 				storage.delete(key3);
// 				storage.delete(key4);
// 				storage.delete(key5);
// 				storage.delete(key6);
// 			},
// 			object: (key1, value1, key2, value2, key3, value3, key4, value4, key5, value5, key6, value6) => {
// 				const storage = {};
// 				storage[key1] = value1;
// 				storage[key2] = value2;
// 				storage[key3] = value3;
// 				storage[key4] = value4;
// 				storage[key5] = value5;
// 				storage[key6] = value6;
// 				delete storage[key1];
// 				delete storage[key2];
// 				delete storage[key3];
// 				delete storage[key4];
// 				delete storage[key5];
// 				delete storage[key6];
// 			}
// 		}, 10000, 'key1', 8938723732783873, 'key2', 'wdkjkjwdjwkjwdjk', 'key3', [27272, 33877823, 893893], 'key4', 28383872387, 'key5', 'iuhjkloijklqoiujkmdl;k', 'key6', '2398382389832989'));
// 	}
// });

// eventBuilder.subscribe('preformanceTest', {
// 	worldLoad: () => {
// 		preformance.print(preformance.test({
// 			arrayPush: (value1, value2, value3, value4, value5, value6) => {
// 				const list = [];
// 				list.push(value2);
// 				list.push(value3);
// 				list.push(value6);
// 				list.push(value4);
// 				list.push(value1);
// 				list.push(value5);
// 				list.forEach((value) => {
// 					'wdklwd: ' + value;
// 				});
// 			},
// 			arrayKey: (value1, value2, value3, value4, value5, value6) => {
// 				const list = Array(6);
// 				list[0] = value2;
// 				list[1] = value3;
// 				list[2] = value6;
// 				list[3] = value4;
// 				list[4] = value1;
// 				list[5] = value5;
// 				list.forEach((value) => {
// 					'wdklwd: ' + value;
// 				});

// 			},
// 			set: (value1, value2, value3, value4, value5, value6) => {
// 				const list = new Set();
// 				list.add(value2);
// 				list.add(value3);
// 				list.add(value6);
// 				list.add(value4);
// 				list.add(value1);
// 				list.add(value5);
// 				list.forEach((value) => {
// 					'wdklwd: ' + value;
// 				});
// 			}
// 		}, 10000, 8938723732783873, 'wdkjkjwdjwkjwdjk', [27272, 33877823, 893893], 28383872387, 'iuhjkloijklqoiujkmdl;k', '2398382389832989'));
// 	}
// });
// import { http, HttpRequest, HttpRequestMethod, HttpResponse } from "@minecraft/server-net";
// /**
//  * @typedef {Object} FetchOptions
//  * @property {string} body
//  * @property {HttpRequestMethod} method
//  * @property {Record<string, string>} headers
//  * @property {number} timeout
//  */
// /**
//  * @function fetch
//  * @param {String} url
//  * @param {FetchOptions} fetchOptions
//  * @returns {Promise<HttpResponse>}
//  */
// function fetch(url, { body = "", method = HttpRequestMethod.GET, headers = {}, timeout = 5000 }) {
// 	const request = new HttpRequest(url);
// 	request.method = method;
// 	request.setBody(body);
// 	request.setTimeout(timeout);
// 	for (const key in headers) {
// 		request.addHeader(key, headers[key]);
// 	}
// 	return http.request(request);
// }
