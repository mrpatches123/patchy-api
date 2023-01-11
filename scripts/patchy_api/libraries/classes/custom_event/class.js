import eventBuilder from "../events/export_instance.js";
import time from "../time.js";
import errorLogger from "../error.js";
export class CustomEvent {
	constructor(eventKey) {
		this.eventKey = eventKey;
		this.subscriptions = eventBuilder.subscriptions[eventKey];
	};
	// [Symbol.iterator]() {
	// 	let index = 0;
	// 	const subscriptionKeys = Object.keys(this.subscriptions);
	// 	time.start(`Events*API*${this.eventKey}`);
	// 	const data = this.playerArray;
	// 	return {
	// 		next: () => {
	// 			const key = subscriptionKeys[index];
	// 			const { suppessed, callback: callbackForKey } = this.subscriptions[key];

	// 			try {
	// 				if (suppessed) return;
	// 				time.start(`Events*API*${this.eventKey}*${key}`);
	// 				if (callbackForKey instanceof Function) 
	// 				(...params) => {
	// 					callbackForKey(...params);
	// 					this.subscriptions.keys[key].time = time.end(`Events*API*${this.eventKey}*${key}`);
	// 				};

	// 			} catch (error) {
	// 				errorLogger.log(error, error.stack, { event: this.eventKey, key });
	// 			}
	// 			({ value: subscriptionKeys[index], done: !(index in data) });
	// 		}
	// 	};
	// };
	iterate(eventResponse, callback) {
		time.start(`Events*API*${this.eventKey}`);
		// if (this.eventKey === 'tickAfterLoad') content.chatFormat(this.subscriptions);
		Object.entries(this.subscriptions.keys).forEach(([key, { suppessed, callback: callbackForKey }], i) => {
			try {
				if (suppessed) return;
				time.start(`Events*API*${this.eventKey}*${key}`);
				// if (this.eventKey === 'tickAfterLoad' && key === 'position*API') content.warn({ key, bool2: callback instanceof Function, bool: callbackForKey instanceof Function });
				if (callback instanceof Function) callback(key, callbackForKey, i);
				else callbackForKey(eventResponse);
				this.subscriptions.keys[key].time = time.end(`Events*API*${this.eventKey}*${key}`);
			} catch (error) {
				errorLogger.log(error, error.stack, { event: this.eventKey, key });
			}
		});
		this.subscriptions.time = time.end(`Events*API*${this.eventKey}`);
	};

}