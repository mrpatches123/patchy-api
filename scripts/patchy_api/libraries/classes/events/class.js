/**
 * add
	* scriptions
		* function
		* forceNative
		* EntityEventOptions
		* type

 * remove
 * subscribe
	* timer
	* callback	 
 * unsubscribe 
 * suppress
 * unsuppress
 */

//(\(arg: )(\w+)(\) => \{\})(?=\} )
//$1$2$3 || {function: $1$2$3, forceNative: Boolean
/**
 * if key in world.events then 
 */
import { world, Entity, system, EntityEventOptions, BeforeChatEvent, BeforeDataDrivenEntityTriggerEvent, BeforeExplosionEvent, BeforeItemDefinitionTriggeredEvent, BeforeItemUseEvent, BeforeItemUseOnEvent, BeforePistonActivateEvent, BlockBreakEvent, BlockExplodeEvent, BlockPlaceEvent, ButtonPushEvent, ChatEvent, DataDrivenEntityTriggerEvent, EffectAddEvent, EntityCreateEvent, EntityHitEvent, EntityHurtEvent, ExplosionEvent, ItemCompleteChargeEvent, ItemDefinitionTriggeredEvent, ItemReleaseChargeEvent, ItemStartChargeEvent, ItemStartUseOnEvent, ItemStopChargeEvent, ItemStopUseOnEvent, ItemUseEvent, ItemUseOnEvent, LeverActionEvent, PistonActivateEvent, PlayerJoinEvent, PlayerLeaveEvent, ProjectileHitEvent, TickEvent, WeatherChangeEvent, WorldInitializeEvent, BeforeWatchdogTerminateEvent, EntityDamageCause, Block } from '@minecraft/server';
import { content, native } from '../../utilities.js';
import time from '../time.js';
import { setProptotype } from '../player/class.js';
import { CustomEvent } from '../custom_event/class.js';
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
const eventTypeProperties = {
	beforeChat: {
		cancellable: true,
		playerKey: 'sender',
		playerOnly: true
	},
	beforeDataDrivenEntityTriggerEvent: {
		entityEvent: true,
		cancellable: true,
		playerKey: 'entity',
		playerOnly: false
	},
	beforeExplosion: {
		cancellable: true,
		playerKey: 'source',
		playerOnly: false
	},
	beforeItemDefinitionEvent: {
		cancellable: true,
		playerKey: 'source',
		playerOnly: false
	},
	beforeItemUse: {
		cancellable: true,
		playerKey: 'source',
		playerOnly: false
	},
	beforeItemUseOn: {
		cancellable: true,
		playerKey: 'source',
		playerOnly: false
	},
	beforePistonActivate: {
		cancellable: true
	},
	beforeWatchdogTerminate: {
		cancellable: true
	},
	blockBreak: {
		playerKey: 'player',
		playerOnly: true
	},
	blockExplode: {
		playerKey: 'source',
		playerOnly: false
	},
	blockPlace: {
		playerKey: 'player',
		playerOnly: true
	},
	buttonPush: {
		playerKey: 'source',
		playerOnly: false
	},
	chat: {
		playerKey: 'sender',
		playerOnly: true
	},
	dataDrivenEntityTriggerEvent: {
		entityEvent: true,
		playerKey: 'source',
		playerOnly: false
	},
	effectAdd: {
		entityEvent: true,
		playerKey: 'source',
		playerOnly: false
	},
	entityCreate: {
		entityEvent: true,
		playerKey: 'source',
		playerOnly: false
	},
	entityHit: {
		entityEvent: true,
		playerKey: 'source',
		playerOnly: false
	},
	entityHurt: {
		entityEvent: true,
		playerKey: 'source',
		playerOnly: false
	},
	explosion: {
		entityEvent: true,
		playerKey: 'source',
		playerOnly: false
	},
	itemCompleteCharge: {
		playerKey: 'source',
		playerOnly: false
	},
	itemDefinitionEvent: {
		playerKey: 'source',
		playerOnly: false
	},
	itemReleaseCharge: {
		playerKey: 'source',
		playerOnly: false
	},
	itemStartCharge: {
		playerKey: 'source',
		playerOnly: false
	},
	itemStartUseOn: {
		playerKey: 'source',
		playerOnly: false
	},
	itemStopCharge: {
		playerKey: 'source',
		playerOnly: false
	},
	itemStopUseOn: {
		playerKey: 'source',
		playerOnly: false
	},
	itemUse: {
		playerKey: 'source',
		playerOnly: false
	},
	itemUseOn: {
		playerKey: 'source',
		playerOnly: false
	},
	leverActivate: {
		playerKey: 'player',
		playerOnly: true
	},
	pistonActivate: {

	},
	playerJoin: {
		playerKey: 'player',
		playerOnly: true
	},
	playerLeave: {
		playerKey: 'player',
		playerOnly: true
	},
	projectileHit: {
		entityEvent: true
	},
	tick: {

	},
	weatherChange: {

	},
	worldInitialize: {

	},
	tickAfterLoad: {
		custom: true
	},
	playerJoined: {
		custom: true,
		playerKey: 'player',
		playerOnly: true
	},
	playerHit: {
		custom: true,
		playerKey: 'player',
		playerOnly: true
	},
	playerHurt: {
		custom: true,
		playerKey: 'player',
		playerOnly: true
	},
	playerDeath: {
		custom: true,
		playerKey: 'player',
		playerOnly: true
	},
	playerSpawned: {
		custom: true,
		playerKey: 'player',
		playerOnly: true
	},
	playerLeft: {
		custom: true,
		playerKey: 'player',
		playerOnly: true
	},
	requestAdded: {
		custom: true
	},
	worldLoad: {
		custom: true
	}

};
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
				if (forceNative !== undefined && ((eventKey in world.events) || (eventKey in system.events))) throw new Error(`key: forceNative, in ${eventKey} in subscription in ${newEventKey} is defined and eventkey: ${newEventKey}, is not in world.events or system.events!`);
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
				this.initSubscribe(eventKey);
				const worldSystem = (eventKey in world.events) ? 'world' : (eventKey in system.events) ? 'system' : false;
				if (worldSystem) {
					this.worldSubscribe(key, eventKey, null, worldSystem, null, callback);
				} else {
					const { subscription } = this.registry[eventKey];
					const nativeSubscribeObject = {};
					//Object.entries(subscription).forEach(([oldEventKey, { function: subscriptionFunction, entityOptions, forceNative, entityOptionsKey }]) => {

					subscription.forEach((oldEventKey, { function: subscriptionFunction, entityOptions, forceNative, entityOptionsKey }) => {
						const worldSystem = (oldEventKey in world.events) ? 'world' : (oldEventKey in system.events) ? 'system' : false;

						if (worldSystem) {
							this.worldSubscribe(eventKey, oldEventKey, entityOptionsKey, worldSystem, entityOptions, subscriptionFunction);
						} else {
							nativeSubscribeObject[oldEventKey] = subscriptionFunction;
						}
					});
					this.subscribe(eventKey, nativeSubscribeObject);
				}
			}
			this.subscriptions[eventKey].subscriptions++;
			this.subscriptions[eventKey].keys[key] = { suppessed: false, callback };
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
		eventKeys.forEach((eventKey, i) => {
			if (typeof eventKey !== 'string') throw new Error(`eventKey: ${eventKey}, ${(string) ? `` : `in index[${i}] `}in params[1] is not of type: String!`);
			if (!this.subscriptions.hasOwnProperty(eventKey)) throw new Error(`eventKey: ${eventKey}, ${(string) ? `` : `in index[${i}] `}in params[1] has no keys subscribed`);
			content.warn({ key, eventKey });
			if (!this.subscriptions[eventKey].keys.hasOwnProperty(key)) { if (!all) throw new Error(`key: ${key}, in params[0] has not been subscribed`); else return; }
			delete this.subscriptions[eventKey][key];
			if (!(--this.subscriptions[eventKey].subscriptions)) {
				const { native, function: subscriptionFunction, oldEventKey } = this.subscriptions[eventKey];
				const { subscription } = this.registry[eventKey];
				if (native) {
					const worldSystem = (eventKey in world.events) ? 'world' : (eventKey in system.events) ? 'system' : false;
					worldSystemEvents[worldSystem].events[oldEventKey].unsubscribe(subscriptionFunction);
				} else {
					const eventkeys = [];
					Object.entries(subscription).forEach(([oldEventKey, { function: subscriptionFunction, entityOptions, forceNative, entityOptionsKey }]) => {
						eventkeys.push(oldEventKey ?? entityOptionsKey);
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

	};
	/**
	 * @private
	 */
	worldSubscribe(key, oldEventKey, entityOptionsKey, worldSystem, entityOptions, callback) {
		this.initSubscribe(entityOptionsKey ?? oldEventKey);
		this.subscriptions[entityOptionsKey ?? oldEventKey].keys[key] = { suppessed: false, callback, native: true, oldEventKey };
		this.subscriptions[entityOptionsKey ?? oldEventKey].subscriptions++;
		let subscribedEventFunction;

		if (eventTypeProperties[oldEventKey].cancellable) {
			subscribedEventFunction = (event) => {
				if (oldEventKey === 'beforeItemUseOn') content.warn({ key });
				let isCanceled = false;
				time.start(`Events*API*${entityOptionsKey ?? oldEventKey}`);
				const { playerKey, playerOnly } = eventTypeProperties[oldEventKey];
				let eventClone = {};
				if (playerKey) {
					const player = event[playerKey];
					const prototype = Object.getPrototypeOf({});
					for (const key in event) {
						if (prototype.hasOwnProperty(key)) continue;
						if (key === playerKey) { eventClone[key] = setProptotype(player); continue; }
						eventClone[key] = event[key];
					}
				}
				Object.entries(this.subscriptions[entityOptionsKey ?? oldEventKey].keys).forEach(([key, { suppessed, callback }]) => {
					if (!suppessed) {
						time.start(`Events*API*${entityOptionsKey ?? oldEventKey}*${key}`);
						callback(eventClone);
						if (eventClone.cancel) {
							eventClone.cancel = false;
							isCanceled = true;
						}
						this.subscriptions[entityOptionsKey ?? oldEventKey].keys[key].time = time.end(`Events*API*${entityOptionsKey ?? oldEventKey}*${key}`);
					}
				});
				this.subscriptions[oldEventKey].time = time.end(`Events*API*${entityOptionsKey ?? oldEventKey}`);
				content.warn({ isCanceled });
				if (isCanceled) event.cancel = true;
			};
		} else {
			subscribedEventFunction = (event) => {
				if (oldEventKey === 'beforeItemUseOn') content.warn('ehy');
				time.start(`Events*API*${entityOptionsKey ?? oldEventKey}`);
				const { playerKey, playerOnly } = eventTypeProperties[oldEventKey];
				let eventClone = {};
				if (playerKey) {
					const player = event[playerKey];
					const prototype = Object.getPrototypeOf({});
					for (const key in event) {
						if (prototype.hasOwnProperty(key)) continue;
						if (key === playerKey) { eventClone[key] = setProptotype(player); continue; }
						eventClone[key] = event[key];
					}
				};

				Object.entries(this.subscriptions[entityOptionsKey ?? oldEventKey].keys).forEach(([key, { suppessed, callback }]) => {
					if (!suppessed) {
						time.start(`Events*API*${entityOptionsKey ?? oldEventKey}*${key}`);
						// if (!(callback instanceof Function)) content.warn(oldEventKey, key);
						callback(eventClone);
						this.subscriptions[entityOptionsKey ?? oldEventKey].keys[key].time = time.end(`Events*API*${entityOptionsKey ?? oldEventKey}*${key}`);
					}
				});
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


