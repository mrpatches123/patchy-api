import { world } from "@minecraft/server";
import { content, native } from "../utilities.js";
import eventBuilder from "./events/export_instance.js";

class Wait {
	constructor() {
		this.subscriptions = {};
	}
	add(key, checkCallback, thenCallback, { start = false, once = false, afterLoad = true, remove = false }) {
		this.subscriptions[key] = {
			checkCallback,
			thenCallback,
			once,
			afterLoad,
			remove
		};

		if (start) {
			this.start(key);
		}
	}
	start(key) {
		if (!this.subscriptions.hasOwnProperty(key)) { return new Error(`Key: ${key}, for wait does not exist`); }
		const { afterLoad } = this.subscriptions[key];
		eventBuilder.subscribe(`${key}*wait*APi`, {
			[(afterLoad) ? 'tickAfterLoad' : 'tick']: () => {
				if (!this.subscriptions[key]) return; //content.warn(`error 'Wait' at key: ${key}, why am I still running`, { this: this });
				const { checkCallback, thenCallback, once, remove } = this.subscriptions[key];

				const test = checkCallback();
				// world.say(checkCallback.toString());
				// content.warn({ key, test: (!test) ? 'false' : test });
				if (test) {
					thenCallback();
					if (remove) {
						this.remove(key);
					} else if (once) {
						this.end(key);
					}
				}

			}
		});
		this.subscriptions[key].active = true;
	}
	end(key) {
		if (!this.subscriptions.hasOwnProperty(key)) { return new Error(`Key: ${key}, for wait does not exist`); }
		// content.warn({ test: Boolean(eventBuilder.events.tickAfterLoad.keysObject.hasOwnProperty(`${key}*wait*APi`) || eventBuilder.events.tick.keysObject.hasOwnProperty(`${key}*wait*APi`)) });
		if (eventBuilder.subscriptions.tickAfterLoad.keys.hasOwnProperty(`${key}*wait*APi`) || eventBuilder.events.tick.keysObject.hasOwnProperty(`${key}*wait*APi`)) {
			eventBuilder.unsubscribe(`${key}*wait*APi`);
		}
		this.subscriptions[key].active = false;
	}
	remove(key) {
		if (!this.subscriptions.hasOwnProperty(key)) { return new Error(`Key: ${key}, for wait does not exist`); }
		if (this.subscriptions[key].active) { this.end(key); }
		delete this.subscriptions[key];
	}
}

const wait = new Wait();
export default wait;