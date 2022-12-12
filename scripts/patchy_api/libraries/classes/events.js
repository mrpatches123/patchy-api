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
import { content, native } from '../utilities.js';
import formBuilder from './form.js';
import time from './time.js';
import errorLogger from './error.js';
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
 * @typedef {Object} ObjectEventSubscribe
 * @property {(arg: CallbackAddtions extends BeforeChatEvent) => {}} beforeChat
 * @property {(arg: BeforeDataDrivenEntityTriggerEvent) => {}} beforeDataDrivenEntityTriggerEvent
 * @property {(arg: BeforeExplosionEvent) => {}} beforeExplosion
 * @property {(arg: BeforeItemDefinitionTriggeredEvent) => {}} beforeItemDefinitionEvent
 * @property {(arg: BeforeItemUseEvent) => {}} beforeItemUse
 * @property {(arg: BeforeItemUseOnEvent) => {}} beforeItemUseOn
 * @property {(arg: BeforePistonActivateEvent) => {}} beforePistonActivate
 * @property {(arg: BeforeWatchdogTerminateEvent) => {}} beforeWatchdogTerminate
 * @property {(arg: BlockBreakEvent) => {}} blockBreak
 * @property {(arg: BlockExplodeEvent) => {}} blockExplode
 * @property {(arg: BlockPlaceEvent) => {}} blockPlace
 * @property {(arg: ButtonPushEvent) => {}} buttonPush
 * @property {(arg: ChatEvent) => {}} chat
 * @property {(arg: DataDrivenEntityTriggerEvent) => {}} dataDrivenEntityTriggerEvent
 * @property {(arg: EffectAddEvent) => {}} effectAdd
 * @property {(arg: EntityCreateEvent) => {}} entityCreate
 * @property {(arg: EntityHitEvent) => {}} entityHit
 * @property {(arg: EntityHurtEvent) => {}} entityHurt
 * @property {(arg: ExplosionEvent) => {}} explosion
 * @property {(arg: ItemCompleteChargeEvent) => {}} itemCompleteCharge
 * @property {(arg: ItemDefinitionTriggeredEvent) => {}} itemDefinitionEvent
 * @property {(arg: ItemReleaseChargeEvent) => {}} itemReleaseCharge
 * @property {(arg: ItemStartChargeEvent) => {}} itemStartCharge
 * @property {(arg: ItemStartUseOnEvent) => {}} itemStartUseOn
 * @property {(arg: ItemStopChargeEvent) => {}} itemStopCharge
 * @property {(arg: ItemStopUseOnEvent) => {}} itemStopUseOn
 * @property {(arg: ItemUseEvent) => {}} itemUse
 * @property {(arg: ItemUseOnEvent) => {}} itemUseOn
 * @property {(arg: LeverActionEvent) => {}} leverActivate
 * @property {(arg: PistonActivateEvent) => {}} pistonActivate
 * @property {(arg: PlayerJoinEvent) => {}} playerJoin
 * @property {(arg: PlayerLeaveEvent) => {}} playerLeave
 * @property {(arg: ProjectileHitEvent) => {}} projectileHit
 * @property {(arg: TickEvent) => {}} tick
 * @property {(arg: WeatherChangeEvent) => {}} weatherChange
 * @property {(arg: WorldInitializeEvent) => {}} worldInitialize
 * @property {(arg: TickEvent) => {}} tickAfterLoad
 * @property {(arg: PlayerJoinEvent) => {}} playerJoined
 * @property {(arg: EntityHitEvent) => {}} playerHit
 * @property {(arg: EntityHurtEvent) => {}} playerHurt
 * @property {(arg: { killer: Entity, player: Player, damage: Number, cause:  EntityDamageCause, projectile: Entity }) => {}} playerDeath
 * @property {(arg: {playerId: String, playerName: String}) => {}} playerLeft
 * @property {(arg: {block: Block, player: Player}) => {}} stepOnBlock
 * @property {(arg: { player: Player }) => { }} playerSpawned
 * @property {(arg: { id: String, key: String, target: String, type: String, value: any }) => {}} requestAdded
 * @property {() => {}} worldLoad
*/
;


/**
 * @typedef {Object} ObjectEventAddSubscription
 * @property {{function:(arg: BeforeChatEvent) => {}, forceNative: Boolean}} beforeChat
 * @property {{function:(arg: BeforeDataDrivenEntityTriggerEvent) => {}, entityOptions: Boolean, forceNative: Boolean}} beforeDataDrivenEntityTriggerEvent
 * @property {{function: (arg: BeforeExplosionEvent) => {}, forceNative: Boolean}} beforeExplosion
 * @property {{function: (arg: BeforeWatchdogTerminateEvent) => {}, forceNative: Boolean}} beforeWatchdogTerminate
 * @property {{function: (arg: BeforeItemDefinitionTriggeredEvent) => {}, forceNative: Boolean}} beforeItemDefinitionEvent
 * @property {{function: (arg: BeforeItemUseEvent) => {}, forceNative: Boolean}} beforeItemUse
 * @property {{function: (arg: BeforeItemUseOnEvent) => {}, forceNative: Boolean}} beforeItemUseOn
 * @property {{function: (arg: BeforePistonActivateEvent) => {}, forceNative: Boolean}} beforePistonActivate
 * @property {{function: (arg: BlockBreakEvent) => {}, forceNative: Boolean}} blockBreak
 * @property {{function: (arg: BlockExplodeEvent) => {}, forceNative: Boolean}} blockExplode
 * @property {{function: (arg: BlockPlaceEvent) => {}, forceNative: Boolean}} blockPlace
 * @property {{function: (arg: ButtonPushEvent) => {}, forceNative: Boolean}} buttonPush
 * @property {{function: (arg: ChatEvent) => {}, forceNative: Boolean}} chat
 * @property {{function: (arg: DataDrivenEntityTriggerEvent) => {}, entityOptions: Boolean, forceNative: Boolean}} dataDrivenEntityTriggerEvent
 * @property {{function: (arg: EffectAddEvent) => {}, entityOptions: Boolean, forceNative: Boolean}} effectAdd
 * @property {{function: (arg: EntityCreateEvent) => {}, entityOptions: Boolean, forceNative: Boolean}} entityCreate
 * @property {{function: (arg: EntityHitEvent) => {}, entityOptions: Boolean, forceNative: Boolean}} entityHit
 * @property {{function: (arg: EntityHurtEvent) => {}, entityOptions: Boolean, forceNative: Boolean}} entityHurt
 * @property {{function: (arg: ExplosionEvent) => {}, forceNative: Boolean}} explosion
 * @property {{function: (arg: ItemCompleteChargeEvent) => {}, forceNative: Boolean}} itemCompleteCharge
 * @property {{function: (arg: ItemDefinitionTriggeredEvent) => {}, forceNative: Boolean}} itemDefinitionEvent
 * @property {{function: (arg: ItemReleaseChargeEvent) => {}, forceNative: Boolean}} itemReleaseCharge
 * @property {{function: (arg: ItemStartChargeEvent) => {}, forceNative: Boolean}} itemStartCharge
 * @property {{function: (arg: ItemStartUseOnEvent) => {}, forceNative: Boolean}} itemStartUseOn
 * @property {{function: (arg: ItemStopChargeEvent) => {}, forceNative: Boolean}} itemStopCharge
 * @property {{function: (arg: ItemStopUseOnEvent) => {}, forceNative: Boolean}} itemStopUseOn
 * @property {{function: (arg: ItemUseEvent) => {}, forceNative: Boolean}} itemUse
 * @property {{function: (arg: ItemUseOnEvent) => {}, forceNative: Boolean}} itemUseOn
 * @property {{function: (arg: LeverActionEvent) => {}, forceNative: Boolean}} leverActivate
 * @property {{function: (arg: PistonActivateEvent) => {}, forceNative: Boolean}} pistonActivate
 * @property {{function: (arg: PlayerJoinEvent) => {}, forceNative: Boolean}} playerJoin
 * @property {{function: (arg: PlayerLeaveEvent) => {}, forceNative: Boolean}} playerLeave
 * @property {{function: (arg: ProjectileHitEvent) => {}, entityOptions: Boolean,  forceNative: Boolean}} projectileHit
 * @property {{function: (arg: TickEvent) => {}, forceNative: Boolean}} tick
 * @property {{function: (arg: WeatherChangeEvent) => {}, forceNative: Boolean}} weatherChange
 * @property {{function: (arg: WorldInitializeEvent) => {}, forceNative: Boolean}} worldInitialize
 * @property {{function: (arg: TickEvent) => {}, forceNative: Boolean}} tickAfterLoad
 * @property {{function: (arg: PlayerJoinEvent) => {}, forceNative: Boolean}} playerJoined
 * @property {{function: (arg: EntityHitEvent) => {}, forceNative: Boolean}} playerHit
 * @property {{function: (arg: EntityHurtEvent) => {}, forceNative: Boolean}} playerHurt
 * @property {{function: (arg: { killer: Entity, player: Player, damage: Number, cause:  EntityDamageCause, projectile: Entity }) => {}, forceNative: Boolean}} playerDeath
 * @property {{function: (arg: {playerId: String, playerName: String}) => {}, forceNative: Boolean}} playerLeft
 * @property {{function: (arg: { id: String, key: String, target: String, type: String, value: any }) => {}, forceNative: Boolean}} requestAdded
 * @property {{function: (arg: {block: Block, player: Player}) => {}, forceNative: Boolean}} stepOnBlock
 * @property {{function: (arg: {player: Player}) => {}, forceNative: Boolean}} playerSpawned
 * @property {{function: () => {}, forceNative: Boolean}} worldLoad
*/


const eventTypeProperties = {
	beforeChat: {
		cancellable: true
	},
	beforeDataDrivenEntityTriggerEvent: {
		entityEvent: true,
		cancellable: true
	},
	beforeExplosion: {
		cancellable: true
	},
	beforeItemDefinitionEvent: {
		cancellable: true
	},
	beforeItemUse: {
		cancellable: true
	},
	beforeItemUseOn: {
		cancellable: true
	},
	beforePistonActivate: {
		cancellable: true
	},
	beforeWatchdogTerminate: {
		cancellable: true
	},
	blockBreak: {

	},
	blockExplode: {

	},
	blockPlace: {

	},
	buttonPush: {

	},
	chat: {

	},
	dataDrivenEntityTriggerEvent: {
		entityEvent: true
	},
	effectAdd: {
		entityEvent: true
	},
	entityCreate: {
		entityEvent: true
	},
	entityHit: {
		entityEvent: true
	},
	entityHurt: {
		entityEvent: true
	},
	explosion: {
		entityEvent: true
	},
	itemCompleteCharge: {

	},
	itemDefinitionEvent: {

	},
	itemReleaseCharge: {

	},
	itemStartCharge: {

	},
	itemStartUseOn: {

	},
	itemStopCharge: {

	},
	itemStopUseOn: {

	},
	itemUse: {

	},
	itemUseOn: {

	},
	leverActivate: {

	},
	pistonActivate: {

	},
	playerJoin: {

	},
	playerLeave: {

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
		custom: true
	},
	playerHit: {
		custom: true
	},
	playerHurt: {
		custom: true
	},
	playerDeath: {
		custom: true
	},
	playerSpawned: {
		custom: true
	},
	playerLeft: {
		custom: true
	},
	requestAdded: {
		custom: true
	},
	worldLoad: {
		custom: true
	},

};
const worldSystemEvents = {
	world,
	system
};

class EventBuilder {
	constructor() {
		this.subscriptions = {};
		this.registry = {};
		this.classId = Math.random();
		content.warn(`eventBuilder - ${this.classId}`);
	}
	queueNextTick(callback, ticksToSkip = 0) {
		const queueCallback = (event) => {
			if (ticksToSkip-- <= 0) return callback(event);
			system.run(queueCallback);
		};
		system.run(queueCallback);
	};

	/**
	 * @typedef {Object} EventAddProperties
	 * @property {ObjectEventAddSubscription} subscription 
	 */
	/**
	 * @param {Object.<string, EventAddProperties>} eventAddObject
	 */
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
	/**
	 * @method subscribe
	 * @param {String} key 
	 * @param {ObjectEventSubscribe} subscribeObject 
	 */
	subscribe(key, subscribeObject) {
		if (typeof key !== "string") throw new Error(`key: ${key}, at params[0] is not of type: String!`);
		if (!(subscribeObject instanceof Object)) throw new Error(`subscribeObject at params[0] is not of type: Object!`);
		//Object.entries(subscribeObject).forEach(([eventKey, callback])
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
		if (!eventKeys) eventKeys = Object.keys(this.subscriptions);
		if (typeof eventKeys !== 'string' && !(eventKeys instanceof Array) && eventKeys) throw new Error(`eventKeys: in params[1] is not of type: String or Array!`);
		if (!(eventKeys instanceof Array)) eventKeys = [eventKeys], string = true;
		eventKeys.forEach((eventKey, i) => {
			if (typeof eventKey !== 'string') throw new Error(`eventKey: ${eventKey}, ${(string) ? `` : `in index[${i}] `}in params[1] is not of type: String!`);
			if (!this.subscriptions.hasOwnProperty(eventKey)) throw new Error(`eventKey: ${eventKey}, ${(string) ? `` : `in index[${i}] `}in params[1] has no keys subscribed`);
			if (!this.subscriptions[eventKey].hasOwnProperty(key)) { if (eventKeys) throw new Error(`key: ${eventKey}, in params[0] has not been subscribed`); else return; }
			this.subscriptions[eventKey][key].suppressed = true;
		});
	}
	unsuppress(key, eventKeys) {
		if (typeof key !== 'string') throw new Error(`key: ${key}, in params[0] is not of type: String!`);
		if (!eventKeys) eventKeys = Object.keys(this.subscriptions);
		if (typeof eventKeys !== 'string' && !(eventKeys instanceof Array) && eventKeys) throw new Error(`eventKeys: in params[1] is not of type: String or Array!`);
		if (!(eventKeys instanceof Array)) eventKeys = [eventKeys], string = true;
		eventKeys.forEach((eventKey, i) => {
			if (typeof eventKey !== 'string') throw new Error(`eventKey: ${eventKey}, ${(string) ? `` : `in index[${i}] `}in params[1] is not of type: String!`);
			if (!this.subscriptions.hasOwnProperty(eventKey)) throw new Error(`eventKey: ${eventKey}, ${(string) ? `` : `in index[${i}] `}in params[1] has no keys subscribed`);
			if (!this.subscriptions[eventKey].hasOwnProperty(key)) { if (eventKeys) throw new Error(`key: ${eventKey}, in params[0] has not been subscribed`); else return; }
			this.subscriptions[eventKey][key].suppressed = false;
		});
	}
	/**
	 * @param {String} key 
	 * @param {String[] | String} eventKeys optional?
	 */
	unsubscribe(key, eventKeys) {
		let string = false;
		if (typeof key !== 'string') throw new Error(`key: ${key}, in params[0] is not of type: String!`);
		if (!eventKeys) eventKeys = Object.keys(this.subscriptions);
		if (typeof eventKeys !== 'string' && !(eventKeys instanceof Array)) throw new Error(`eventKeys: in params[1] is not of type: String or Array!`);
		if (!(eventKeys instanceof Array)) eventKeys = [eventKeys], string = true;
		eventKeys.forEach((eventKey, i) => {
			if (typeof eventKey !== 'string') throw new Error(`eventKey: ${eventKey}, ${(string) ? `` : `in index[${i}] `}in params[1] is not of type: String!`);
			if (!this.subscriptions.hasOwnProperty(eventKey)) throw new Error(`eventKey: ${eventKey}, ${(string) ? `` : `in index[${i}] `}in params[1] has no keys subscribed`);
			if (!this.subscriptions[eventKey].keys.hasOwnProperty(key)) { if (eventKeys) throw new Error(`key: ${key}, in params[0] has not been subscribed`); else return; }
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
				if (oldEventKey === 'playerJoin') content.warn('playerJoin');
				let isCanceled = false;
				time.start(`Events*API*${entityOptionsKey ?? oldEventKey}`);
				Object.entries(this.subscriptions[entityOptionsKey ?? oldEventKey].keys).forEach(([key, { suppessed, callback }]) => {
					if (!suppessed) {
						time.start(`Events*API*${entityOptionsKey ?? oldEventKey}*${key}`);
						isCanceled = callback(event);
						this.subscriptions[entityOptionsKey ?? oldEventKey].keys[key].time = time.end(`Events*API*${entityOptionsKey ?? oldEventKey}*${key}`);
					}
				});
				this.subscriptions[oldEventKey].time = time.end(`Events*API*${entityOptionsKey ?? oldEventKey}`);
				if (isCanceled) event.cancel = true;
			};
		} else {
			subscribedEventFunction = (event) => {

				time.start(`Events*API*${entityOptionsKey ?? oldEventKey}`);
				Object.entries(this.subscriptions[entityOptionsKey ?? oldEventKey].keys).forEach(([key, { suppessed, callback }]) => {
					if (!suppessed) {
						time.start(`Events*API*${entityOptionsKey ?? oldEventKey}*${key}`);
						// if (!(callback instanceof Function)) content.warn(oldEventKey, key);
						callback(event);
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
	/**
	 * @method getEvent for adding custom events and wraps performance monitoring and event key suppression
	 * @param {String} eventKey 
	 * @returns {CustomEvent}
	 */
	getEvent(eventKey) {
		if (!this.registry.hasOwnProperty(eventKey)) throw new Error(`eventKey: ${eventKey}, in params[0] is not a custom, system, or world event!`);
		return new CustomEvent(eventKey);
	}

}
const eventBuilder = new EventBuilder();

class CustomEvent {
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
	/**
	 * @method iterate
	 * @param {any} eventResponse optional?
	 * @param {(key:string, eventResponse: any, i: Number) => {}} callback optional? 
	 */
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
// world.events.beforeChat.subscribe(() => {
// 	world.say(JSON.stringify(eventBuilder, (key, value) => (value instanceof Function) ? '() => {}' : value, 4));
// });
export default eventBuilder

