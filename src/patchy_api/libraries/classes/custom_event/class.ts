import eventBuilder from "../events/export_instance.js";
import time from "../time.js";
import errorLogger from "../error.js";
import { content } from "../../utilities.js";
export class CustomEvent {
	eventKey: string;
	public subscriptions: typeof eventBuilder.subscriptions[string];
	constructor(eventKey: string) {
		this.eventKey = eventKey;
		eventBuilder.subscriptions[eventKey] ??= {} as typeof eventBuilder.subscriptions[typeof eventKey];
		eventBuilder.subscriptions[eventKey]!.keys ??= {} as typeof eventBuilder.subscriptions[typeof eventKey]['keys'];
		this.subscriptions = eventBuilder.subscriptions[eventKey]!;
	};
	// [Symbol.iterator]() {
	// 	let index = 0;
	// 	const subscriptionKeys = Object.keys(this.subscriptions);
	// 	time.start(`Events*API*${this.eventKey}`);
	// 	const data = this.playerArray;
	// 	return {
	// 		next: () => {
	// 			const key = subscriptionKeys[index];
	// 			const { suppressed, callback: callbackForKey } = this.subscriptions[key];

	// 			try {
	// 				if (suppressed) return;
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
	iterate(eventResponse: Object, callback?: Function) {
		time.start(`Events*API*${this.eventKey}`);
		// if (this.eventKey === 'tickAfterLoad') content.chatFormat(this.subscriptions);
		Object.entries(this.subscriptions.keys).forEach(([key, { suppressed, callback: callbackForKey }], i) => {
			try {
				if (suppressed) return;
				time.start(`Events*API*${this.eventKey}*${key}`);
				// if (this.eventKey === 'tickAfterLoad' && key === 'position*API') content.warn({ key, bool2: callback instanceof Function, bool: callbackForKey instanceof Function });
				if (callback instanceof Function) callback(key, eventResponse, callbackForKey, i);
				else callbackForKey(eventResponse);
				// content.warn(this.eventKey, eventBuilder.subscriptions[this.eventKey].keys);
				const endTime = time.end(`Events*API*${this.eventKey}*${key}`);
				if (!eventBuilder.subscriptions.hasOwnProperty(this.eventKey)) return;
				if (!eventBuilder.subscriptions[this.eventKey]!.keys.hasOwnProperty(key)) return;
				eventBuilder.subscriptions[this.eventKey]!.keys[key]!.time = endTime;
			} catch (error: any) {
				errorLogger.log(error, error.stack, { event: this.eventKey, key });
			}
		});
		this.subscriptions.time = time.end(`Events*API*${this.eventKey}`);
	};

}