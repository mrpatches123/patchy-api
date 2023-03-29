
import { world, Entity, system } from '@minecraft/server';
import { content, native } from '../../utilities.js';
import time from '../time.js';
import { setProptotype } from '../player/class.js';
import { CustomEvent } from '../custom_event/class.js';
import eventTypeProperties from './event_properties.js';
import errorLogger from '../error.js';
let keystest = [];
let clearedKeyTest = false;
function objectEquals(source, object) {
	//// console.log(keys(this).equals(keys(object)))
	if (!(source instanceof Object)) return false;
	const sourceArray = Object.entries(source);
	const objectArray = Object.entries(object);
	if (source) {
		if (sourceArray.length === objectArray.length) {
			return sourceArray.every(([thiskKey, ThisValue]) =>
				objectArray.some(([key, value]) => (key === thiskKey && value === ThisValue) || ((ThisValue instanceof Object && value instanceof Object) ? objectEquals(value, ThisValue) : ((ThisValue instanceof Array && value instanceof Array)) ? arrayEquals(value, ThisValue) : false))
			);

		} else {
			return false;
		}

	} else {
		return false;
	}

}
function arrayEquals(source, array) {
	if (!(source instanceof Array)) return false;
	if (source) {
		if (source.length === array.length) {
			return source.every(([thiskKey, ThisValue]) =>
				array.some(([key, value]) => (key === thiskKey && value === ThisValue) || ((ThisValue instanceof Object && value instanceof Object) ? objectEquals(value, ThisValue) : ((ThisValue instanceof Array && value instanceof Array)) ? arrayEquals(value, ThisValue) : false))
			);

		} else {
			return false;
		}

	} else {
		return false;
	}
}
function arrayClone(array) {
	const newArray = Array(array.length);
	for (let i = 0; i < array.length; i++) {
		newArray[i] = array[i];
	}
	return newArray;
}

/**
 * @type {{[key: string]: {cancellable?: boolean,entityEvent?: boolean, playerKey?: 'sender' | 'source' | 'player' | 'entity', playerOnly?: boolean, custom?: boolean}}}
 */

const worldSystemEvents = {
	world,
	system
};

export class EventBuilder {
	constructor() {
		this.subscriptions = {};
		this.registry = {};
		this.classId = Math.random();
		content.warn(`eventBuilder - ${this.classId}`);
	}
	queueNextTick(callback, ticksToSkip = 0) {
		const queueCallback = () => {
			if (ticksToSkip-- <= 0) return callback();
			system.run(queueCallback);
		};
		system.run(queueCallback);
	};
	register(eventAddObject) {
		Object.entries(eventAddObject).forEach(([newEventKey, properties]) => {
			if (!(properties instanceof Object)) throw new Error(`key: ${newEventKey}, does have a value with the type: Object!`);
			const { subscription } = properties;
			if (!properties.hasOwnProperty('subscription')) throw new Error(`key: ${newEventKey}, does have a the key: subscription!`);
			if (!(subscription instanceof Object)) throw new Error(`subscription in ${newEventKey} does have a value with the type: Object!`);
			Object.entries(subscription).forEach(([eventKey, eventProperties]) => {
				if (!this.registry.hasOwnProperty(this.registry[newEventKey])) this.registry[newEventKey] = {};
				if (!(eventProperties instanceof Object)) throw new Error(`key: ${eventKey}, in subscription in ${newEventKey} does have a value of type: Object!`);
				const { function: subscriptionFunction, entityOptions, forceNative } = eventProperties;
				if (!(subscriptionFunction instanceof Function)) throw new Error(`key: function, in ${eventKey} in subscription in ${newEventKey} does have a value of type: Function!`);
				if (eventKey !== 'custom' && forceNative !== undefined && ((eventKey in world.events) || (eventKey in system.events))) throw new Error(`key: forceNative, in ${eventKey} in subscription in ${newEventKey} is defined and eventkey: ${newEventKey}, is not in world.events or system.events or "custom"!`);
				if (forceNative !== undefined && typeof forceNative !== 'boolean') throw new Error(`key: forceNative, in ${eventKey} in subscription in ${newEventKey} is defined and does have a value of type: Boolean!`);
				if (entityOptions !== undefined && !eventTypeProperties[eventKey].entityEvent) throw new Error(`key: entityOptions, in ${eventKey} in subscription in ${newEventKey} should not be defined since that event is not an entity event!`);
				if (entityOptions !== undefined && !(entityOptions instanceof Object)) throw new Error(`key: entityOptions, in ${eventKey} in subscription in ${newEventKey} is defined and value is not of type: interface(EntityEventOptions)!`);
				if (entityOptions) {
					const { entityTypes = [], entities = [] } = entityOptions;
					// content.warn({ entityTypes, entities });
					properties.entityOptionsKey = `${eventKey}*${[
						...arrayClone(entityTypes),
						...arrayClone(entities).map(({ id }) => id)
					].join('*')}`;
				}
			});
			this.registry[newEventKey] = properties;
		});

	}
	subscribe(key, subscribeObject) {
		if (typeof key !== "string") throw new Error(`key: ${key}, at params[0] is not of type: String!`);
		if (!(subscribeObject instanceof Object)) throw new Error(`subscribeObject at params[0] is not of type: Object!`);
		//Object.entries(subscribeObject).forEach(([eventKey, callback])
		// content.warn({ ObjectQ: subscribeObject instanceof Object, proto: Object.getPrototypeOf(subscribeObject) });

		subscribeObject.forEach((eventKey, callback) => {
			// content.warn({ key, eventKey, call: callback instanceof Function });
			if (typeof eventKey !== "string") throw new Error(`key: ${eventKey}, in params[1] is not of type: String!`);
			if (!(callback instanceof Function)) throw new Error(`key: ${eventKey}, in params[1] does not have value of type: Function!`);
			if (!this.registry.hasOwnProperty(eventKey) && !(eventKey in world.events) && !(eventKey in system.events)) throw new Error(`eventKey: ${eventKey}, in subscribeObject at params[1] is not a custom, system, or world event!`);

			if (!this.subscriptions.hasOwnProperty(eventKey)) {
				const worldSystem = (eventKey in world.events) ? 'world' : (eventKey in system.events) ? 'system' : false;
				if (worldSystem) {
					this.worldSubscribe(key, eventKey, null, worldSystem, null, callback);
				} else {
					this.initSubscribe(eventKey);
					const { subscription, entityOptionsKey } = this.registry[eventKey];
					const nativeSubscribeObject = {};
					//Object.entries(subscription).forEach(([oldEventKey, { function: subscriptionFunction, entityOptions, forceNative, entityOptionsKey }]) => {

					subscription.forEach((oldEventKey, eventProperties) => {
						const { function: subscriptionFunction, entityOptions, forceNative } = eventProperties;
						if (oldEventKey === 'custom') subscriptionFunction();
						else {
							const worldSystem = (oldEventKey in world.events) ? 'world' : (oldEventKey in system.events) ? 'system' : false;
							if (worldSystem) {
								this.worldSubscribe(eventKey, oldEventKey, entityOptionsKey, worldSystem, entityOptions, subscriptionFunction);
							} else {
								nativeSubscribeObject[oldEventKey] = subscriptionFunction;
							}
						}


					});
					this.subscribe(eventKey, nativeSubscribeObject);
				}
			}
			this.subscriptions[eventKey].subscriptions++;
			this.subscriptions[eventKey].keys[key] = { suppessed: false, callback };
			this.subscriptions[eventKey].keys = this.subscriptions[eventKey].keys.sortKeys();
		});
	};
	suppress(key, eventKeys) {
		if (typeof key !== 'string') throw new Error(`key: ${key}, in params[0] is not of type: String!`);
		const eventKeysDefined = Boolean(eventKeys);
		if (!eventKeys) eventKeys = Object.keys(this.subscriptions);
		if (typeof eventKeys !== 'string' && !(eventKeys instanceof Array) && eventKeys) throw new Error(`eventKeys: in params[1] is not of type: String or Array!`);
		if (!(eventKeys instanceof Array)) eventKeys = [eventKeys], string = true;
		eventKeys.forEach((eventKey, i) => {
			if (typeof eventKey !== 'string') throw new Error(`eventKey: ${eventKey}, ${(string) ? `` : `in index[${i}] `}in params[1] is not of type: String!`);
			if (!this.subscriptions.hasOwnProperty(eventKey)) throw new Error(`eventKey: ${eventKey}, ${(string) ? `` : `in index[${i}] `}in params[1] has no keys subscribed`);
			if (!this.subscriptions[eventKey].hasOwnProperty(key)) { if (eventKeysDefined) throw new Error(`key: ${eventKey}, in params[0] has not been subscribed`); else return; }
			this.subscriptions[eventKey][key].suppressed = true;
		});
	}
	unsuppress(key, eventKeys) {
		if (typeof key !== 'string') throw new Error(`key: ${key}, in params[0] is not of type: String!`);
		const eventKeysDefined = Boolean(eventKeys);
		if (!eventKeys) eventKeys = Object.keys(this.subscriptions);
		if (typeof eventKeys !== 'string' && !(eventKeys instanceof Array) && eventKeys) throw new Error(`eventKeys: in params[1] is not of type: String or Array!`);
		if (!(eventKeys instanceof Array)) eventKeys = [eventKeys], string = true;
		eventKeys.forEach((eventKey, i) => {
			if (typeof eventKey !== 'string') throw new Error(`eventKey: ${eventKey}, ${(string) ? `` : `in index[${i}] `}in params[1] is not of type: String!`);
			if (!this.subscriptions.hasOwnProperty(eventKey)) throw new Error(`eventKey: ${eventKey}, ${(string) ? `` : `in index[${i}] `}in params[1] has no keys subscribed`);
			if (!this.subscriptions[eventKey].hasOwnProperty(key)) { if (eventKeysDefined) throw new Error(`key: ${eventKey}, in params[0] has not been subscribed`); else return; }
			this.subscriptions[eventKey][key].suppressed = false;
		});
	}
	unsubscribe(key, eventKeys) {
		let string = false;
		const all = !eventKeys;

		if (typeof key !== 'string') throw new Error(`key: ${key}, in params[0] is not of type: String!`);
		if (!eventKeys) eventKeys = Object.keys(this.subscriptions);
		if (typeof eventKeys !== 'string' && !(eventKeys instanceof Array)) throw new Error(`eventKeys: in params[1] is not of type: String or Array!`);
		if (!(eventKeys instanceof Array)) eventKeys = [eventKeys], string = true;
		// content.warn({ key, eventKeys });
		eventKeys.forEach((eventKey, i) => {
			if (typeof eventKey !== 'string') throw new Error(`eventKey: ${eventKey}, ${(string) ? `` : `in index[${i}] `}in params[1] is not of type: String!`);
			if (!this.subscriptions.hasOwnProperty(eventKey)) throw new Error(`eventKey: ${eventKey}, ${(string) ? `` : `in index[${i}] `}in params[1] has no keys subscribed`);
			// content.warn({ key, eventKey });
			if (!this.subscriptions[eventKey].keys.hasOwnProperty(key)) { if (!all) throw new Error(`key: ${key}, in params[0] has not been subscribed`); else return; }
			delete this.subscriptions[eventKey].keys[key];
			if (!(--this.subscriptions[eventKey].subscriptions)) {
				const { native, function: subscriptionFunction, oldEventKey } = this.subscriptions[eventKey];
				const { subscription, unsubscription } = this.registry[eventKey];
				if (unsubscription instanceof Function) unsubscription();
				if (native) {
					const worldSystem = (eventKey in world.events) ? 'world' : (eventKey in system.events) ? 'system' : false;
					worldSystemEvents[worldSystem].events[oldEventKey].unsubscribe(subscriptionFunction);
				} else {
					const eventkeys = [];
					Object.entries(subscription).forEach(([oldEventKey, { function: subscriptionFunction, entityOptions, forceNative, entityOptionsKey }]) => {
						eventkeys.push(entityOptionsKey ?? oldEventKey);
					});
					this.unsubscribe(eventKey, eventkeys);
				}

			}
		});
	};
	/**
	 * @private
	 */
	initSubscribe(eventKey) {
		if (!this.subscriptions.hasOwnProperty(eventKey)) this.subscriptions[eventKey] = {};
		if (!this.subscriptions[eventKey].hasOwnProperty('keys')) this.subscriptions[eventKey].keys = {};
		if (!this.subscriptions[eventKey].hasOwnProperty('subscriptions')) this.subscriptions[eventKey].subscriptions = 0;
		if (!this.subscriptions[eventKey].hasOwnProperty('keyList')) this.subscriptions[eventKey].keyList = [];
		this.subscriptions[eventKey].worldSubscribed = true;
	};
	/**
	 * @private
	 */
	worldSubscribe(key, oldEventKey, entityOptionsKey, worldSystem, entityOptions, callback) {
		content.warn(entityOptionsKey);
		if (this.subscriptions?.[entityOptionsKey ?? oldEventKey]?.worldSubscribed ?? false) return this.subscriptions[entityOptionsKey ?? oldEventKey].keys[key] = { suppessed: false, callback, native: true, oldEventKey };
		// content.warn({ oldEventKey });
		this.initSubscribe(entityOptionsKey ?? oldEventKey);
		this.subscriptions[entityOptionsKey ?? oldEventKey].keys[key] = { suppessed: false, callback, native: true, oldEventKey };
		this.subscriptions[entityOptionsKey ?? oldEventKey].subscriptions++;
		let subscribedEventFunction;


		if (eventTypeProperties[oldEventKey]?.modifiables?.length) {
			subscribedEventFunction = (event) => {
				time.start(`Events*API*${entityOptionsKey ?? oldEventKey}`);
				const { playerKey, playerOnly, modifiables = [] } = eventTypeProperties[oldEventKey] ?? {};
				let eventClone = (playerKey) ? {} : event;
				if (playerKey) {
					const player = event[playerKey];
					const prototype = Object.getPrototypeOf({});
					for (const key in event) {
						if (prototype.hasOwnProperty(key)) continue;
						if (key === playerKey) { eventClone[key] = setProptotype(player); continue; }
						if (event[key] instanceof Function) {
							eventClone[key] = (...args) => { return event[key](...args); };
							continue;
						}
						eventClone[key] = event[key];
					}
				}

				Object.entries(this.subscriptions[entityOptionsKey ?? oldEventKey].keys).forEach(([key, { suppessed, callback }]) => {
					if (!suppessed) {
						try {
							time.start(`Events*API*${entityOptionsKey ?? oldEventKey}*${key}`);
							callback(eventClone);
							this.subscriptions[entityOptionsKey ?? oldEventKey].keys[key].time = time.end(`Events*API*${entityOptionsKey ?? oldEventKey}*${key}`);
						} catch (error) {
							errorLogger.log(error, error.stack, { key: key, event: oldEventKey });
						}
					}
				});
				this.subscriptions[oldEventKey].time = time.end(`Events*API*${entityOptionsKey ?? oldEventKey}`);
				// content.warn({ eventClone });
				modifiables.forEach(key => event[key] = eventClone[key]);
			};
		} else {
			subscribedEventFunction = (event) => {
				time.start(`Events*API*${entityOptionsKey ?? oldEventKey}`);
				// content.warn(oldEventKey);
				const { playerKey } = eventTypeProperties?.[oldEventKey] ?? {};
				let eventClone = (playerKey) ? {} : event;
				if (playerKey) {
					const player = event[playerKey];
					const prototype = Object.getPrototypeOf({});
					for (const key in event) {
						if (prototype.hasOwnProperty(key)) continue;
						if (key === playerKey) { eventClone[key] = setProptotype(player); continue; }
						if (eventClone[key] instanceof Function) {
							eventClone[key] = (...args) => { return event[key](...args); };
							continue;
						}
						eventClone[key] = event[key];
					}
				};
				Object.entries(this.subscriptions[entityOptionsKey ?? oldEventKey].keys).forEach(([key, { suppessed, callback }]) => {
					if (!suppessed) {
						try {
							time.start(`Events*API*${entityOptionsKey ?? oldEventKey}*${key}`);
							if (oldEventKey == 'tick') keystest.push(key);
							callback(eventClone);
							this.subscriptions[entityOptionsKey ?? oldEventKey].keys[key].time = time.end(`Events*API*${entityOptionsKey ?? oldEventKey}*${key}`);
						} catch (error) {
							errorLogger.log(error, error.stack, { key: key, event: oldEventKey });
						}
					}
				});
				// if (oldEventKey === 'tick') content.warn({ keystest });
				// if (oldEventKey === 'tick' && !clearedKeyTest) clearedKeyTest = true, system.run(() => (keystest = [], clearedKeyTest = false));
				this.subscriptions[entityOptionsKey ?? oldEventKey].time = time.end(`Events*API*${entityOptionsKey ?? oldEventKey}`);
			};
		}
		this.subscriptions[entityOptionsKey ?? oldEventKey].function = subscribedEventFunction;
		// if (oldEventKey === 'entityHurt') content.warn(key, native.stringify(entityOptions));
		if (entityOptions) worldSystemEvents[worldSystem].events[oldEventKey].subscribe(subscribedEventFunction, entityOptions);
		else worldSystemEvents[worldSystem].events[oldEventKey].subscribe(subscribedEventFunction);

	}
	getEvent(eventKey) {
		if (!this.registry.hasOwnProperty(eventKey)) throw new Error(`eventKey: ${eventKey}, in params[0] is not a custom, system, or world event!`);
		return new CustomEvent(eventKey);
	}
}


// world.events.beforeChat.subscribe(() => {
// 	world.say(JSON.stringify(eventBuilder, (key, value) => (value instanceof Function) ? '() => {}' : value, 4));
// });


