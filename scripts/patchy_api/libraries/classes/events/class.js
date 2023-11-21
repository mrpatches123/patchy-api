import { world, system, Player as PlayerType } from '@minecraft/server';
import { content } from '../../utilities';
import time from '../time';
import { setProptotype } from '../player/class';
import { CustomEvent } from '../custom_event/class';
import errorLogger from '../error';
import { eventKeys } from './types';
let keystest = [];
let clearedKeyTest = false;
/**
 * @param {String} lower
 * @returns {String}
 */
function firstLower(lower) {
    return lower && lower[0].toLowerCase() + lower.slice(1) || lower;
}
function objectEquals(source, object) {
    //// console.log(keys(this).equals(keys(object)))
    if (!(source instanceof Object))
        return false;
    const sourceArray = Object.entries(source);
    const objectArray = Object.entries(object);
    if (source) {
        if (sourceArray.length === objectArray.length) {
            return sourceArray.every(([thiskKey, ThisValue]) => objectArray.some(([key, value]) => (key === thiskKey && value === ThisValue) || ((ThisValue instanceof Object && value instanceof Object) ? objectEquals(value, ThisValue) : ((ThisValue instanceof Array && value instanceof Array)) ? arrayEquals(value, ThisValue) : false)));
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}
function arrayEquals(source, array) {
    if (!(source instanceof Array))
        return false;
    if (source) {
        if (source.length === array.length) {
            return source.every(([thiskKey, ThisValue]) => array.some(([key, value]) => (key === thiskKey && value === ThisValue) || ((ThisValue instanceof Object && value instanceof Object) ? objectEquals(value, ThisValue) : ((ThisValue instanceof Array && value instanceof Array)) ? arrayEquals(value, ThisValue) : false)));
        }
        else {
            return false;
        }
    }
    else {
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
const worldSystemEvents = {
    afterEvents: world.afterEvents,
    beforeEvents: world.beforeEvents,
    systemAfterEvents: system.afterEvents,
    systemBeforeEvents: system.beforeEvents
};
;
function sortKeysObject(objectToSort, callback) {
    const array = Object.entries(objectToSort);
    let sortedArray;
    if (callback) {
        sortedArray = array.sort(callback);
    }
    else {
        sortedArray = array.sort(([keyP], [keyC]) => {
            const initC = keyC.includes('init');
            const initP = keyP.includes('init');
            const endC = keyC.includes('end');
            const endP = keyP.includes('end');
            if (initC || endP) {
                if (initC && initP) {
                    return keyP.localeCompare(keyC);
                }
                else {
                    return 1;
                }
            }
            else if (endC || initP) {
                if (endC && endP) {
                    return keyP.localeCompare(keyC);
                }
                else {
                    return -1;
                }
            }
            else if (callback === true) {
                return keyP.localeCompare(keyC);
            }
            else {
                return 0;
            }
        });
    }
    const object = {};
    sortedArray.forEach(([key, value]) => object[key] = value);
    return object;
}
export class EventBuilder {
    constructor() {
        this.subscriptions = {};
        this.registry = {};
        this.classId = Math.random();
        content.warn(`eventBuilder - ${this.classId}`);
    }
    queueNextTick(callback, ticksToSkip = 0) {
        const queueCallback = () => {
            if (ticksToSkip-- <= 0)
                return callback();
            system.run(queueCallback);
        };
        system.run(queueCallback);
    }
    ;
    register(eventAddObject) {
        const eventEntries = Object.entries(eventAddObject);
        eventEntries.forEach(([newEventKey, properties]) => {
            if (!(properties instanceof Object))
                throw new Error(`key: ${newEventKey}, does have a value with the type: Object!`);
            const { subscription } = properties;
            if (!properties.hasOwnProperty('subscription'))
                throw new Error(`key: ${newEventKey}, does have a the key: subscription!`);
            if (!(subscription instanceof Object))
                throw new Error(`subscription in ${newEventKey} does have a value with the type: Object!`);
            Object.entries(subscription).forEach(([eventKey, eventProperties]) => {
                if (!this.registry.hasOwnProperty(newEventKey))
                    this.registry[newEventKey] = {};
                if (!(eventProperties instanceof Object))
                    throw new Error(`key: ${eventKey}, in subscription in ${newEventKey} does have a value of type: Object!`);
                const { function: subscriptionFunction, options: entityOptions, forceNative } = eventProperties;
                if (!(subscriptionFunction instanceof Function))
                    throw new Error(`key: function, in ${eventKey} in subscription in ${newEventKey} does have a value of type: Function!`);
                const fixedEventKey = this.removeBeforeInKey(eventKey);
                if (eventKey !== 'custom' && forceNative !== undefined && ((eventKey.includes('before') && fixedEventKey in world.beforeEvents) || (eventKey in world.afterEvents) || (eventKey in system.afterEvents) || (eventKey in system.beforeEvents)))
                    throw new Error(`key: forceNative, in ${eventKey} in subscription in ${newEventKey} is defined and eventkey: ${newEventKey}, is not in world.afterEvents, world.beforeEvents, system.afterEvents, or system.beforeEvents or is "custom"!`);
                if (!(eventKeys.includes(eventKey)))
                    throw new Error(`key: forceNative, in ${eventKey} in subscription in ${newEventKey} is defined and eventkey: ${newEventKey}, is not in world.afterEvents, world.beforeEvents, system.afterEvents, or system.beforeEvents or is "custom"!`);
                if (forceNative !== undefined && typeof forceNative !== 'boolean')
                    throw new Error(`key: forceNative, in ${eventKey} in subscription in ${newEventKey} is defined and does have a value of type: Boolean!`);
                if (entityOptions !== undefined && !eventKey.toLowerCase().includes('entity'))
                    throw new Error(`key: entityOptions, in ${eventKey} in subscription in ${newEventKey} should not be defined since that event is not an entity event!`);
                if (entityOptions !== undefined && !(entityOptions instanceof Object))
                    throw new Error(`key: entityOptions, in ${eventKey} in subscription in ${newEventKey} is defined and value is not of type: interface(EntityEventOptions)!`);
                if (entityOptions) {
                    const { entityTypes = [], entities = [] } = entityOptions;
                    // content.warn({ entityTypes, entities });
                    properties.subscription[eventKey] = `${eventKey}*${[
                        ...arrayClone(entityTypes),
                        ...arrayClone(entities).map(({ id }) => id)
                    ].join('*')}`;
                }
            });
            this.registry[newEventKey] = properties;
        });
    }
    /**
     * @param {String} eventKey
     * @returns {String}
     */
    removeBeforeInKey(eventKey = "") {
        return firstLower(eventKey.replace('before', ''));
        ;
    }
    /**
     * @param {String} eventKey
     * @returns {'beforeEvents' | 'afterEvents' | 'systemEvents'}
     */
    getNativeEventSignalKey(eventKey = "") {
        const fixedEventKey = this.removeBeforeInKey(eventKey);
        return (eventKey.includes('before') && fixedEventKey in world.beforeEvents) ? 'beforeEvents' : (eventKey in world.afterEvents) ? 'afterEvents' : (eventKey in system.afterEvents) ? 'systemAfterEvents' : (eventKey in system.beforeEvents) ? 'systemBeforeEvents' : 'afterEvents';
    }
    subscribe(key, subscribeObject) {
        if (typeof key !== "string")
            throw new Error(`key: ${key}, at params[0] is not of type: String!`);
        if (!(subscribeObject instanceof Object))
            throw new Error(`subscribeObject at params[0] is not of type: Object!`);
        //Object.entries(subscribeObject).forEach(([eventKey, callback])
        // content.warn({ ObjectQ: subscribeObject instanceof Object, proto: Object.getPrototypeOf(subscribeObject) });
        Object.entries(subscribeObject).forEach((a) => {
            const eventKey = a[0];
            const callback = a[1];
            // content.warn({ key, eventKey, call: callback instanceof Function });
            if (typeof eventKey !== "string")
                throw new Error(`key: ${eventKey}, in params[1] is not of type: String!`);
            if (!(callback instanceof Function))
                throw new Error(`key: ${eventKey}, in params[1] does not have value of type: Function!`);
            const fixedEventKey = this.removeBeforeInKey(eventKey);
            if (!this.registry.hasOwnProperty(eventKey) && !(eventKey.includes('before') && fixedEventKey in world.beforeEvents) && !(eventKey in world.afterEvents) && !(eventKey in system.beforeEvents) && !(eventKey in system.afterEvents))
                throw new Error(`eventKey: ${eventKey}, in subscribeObject at params[1] is not a custom, system, or world event!`);
            if (!this.subscriptions.hasOwnProperty(eventKey)) {
                const worldSystem = this.getNativeEventSignalKey(eventKey);
                if (worldSystem) {
                    this.worldSubscribe(key, eventKey, undefined, worldSystem, undefined, callback);
                }
                else {
                    this.initSubscribe(eventKey);
                    const { subscription = {} } = this.registry[eventKey] ?? {};
                    const nativeSubscribeObject = {};
                    //Object.entries(subscription).forEach(([oldEventKey, { function: subscriptionFunction, entityOptions, forceNative, entityOptionsKey }]) => {
                    const subscriptionEntries = Object.entries(subscription);
                    subscriptionEntries.forEach(([oldEventKey, eventProperties]) => {
                        const { function: subscriptionFunction, options, forceNative, entityOptionsKey } = eventProperties;
                        content.warn({ key, oldEventKey, eventKey, fixedEventKey });
                        if (oldEventKey === 'custom')
                            subscriptionFunction(undefined);
                        else {
                            const worldSystem = this.getNativeEventSignalKey(eventKey);
                            if (worldSystem) {
                                this.worldSubscribe(eventKey, oldEventKey, entityOptionsKey, worldSystem, options, subscriptionFunction);
                            }
                            else {
                                nativeSubscribeObject[oldEventKey] = subscriptionFunction;
                            }
                        }
                    });
                    this.subscribe(eventKey, nativeSubscribeObject);
                }
            }
            this.subscriptions[eventKey].subscriptions++;
            this.subscriptions[eventKey].keys[key] = { suppressed: false, callback, time: undefined };
            this.subscriptions[eventKey].keys = sortKeysObject(this.subscriptions[eventKey].keys);
        });
    }
    ;
    suppress(key, eventKeys) {
        let string = false;
        if (typeof key !== 'string')
            throw new Error(`key: ${key}, in params[0] is not of type: String!`);
        const eventKeysDefined = Boolean(eventKeys);
        if (!eventKeys)
            eventKeys = Object.keys(this.subscriptions);
        if (typeof eventKeys !== 'string' && !(eventKeys instanceof Array) && eventKeys)
            throw new Error(`eventKeys: in params[1] is not of type: String or Array!`);
        if (!(eventKeys instanceof Array))
            eventKeys = [eventKeys], string = true;
        eventKeys.forEach((eventKey, i) => {
            if (typeof eventKey !== 'string')
                throw new Error(`eventKey: ${eventKey}, ${(string) ? `` : `in index[${i}] `}in params[1] is not of type: String!`);
            if (!this.subscriptions.hasOwnProperty(eventKey))
                throw new Error(`eventKey: ${eventKey}, ${(string) ? `` : `in index[${i}] `}in params[1] has no keys subscribed`);
            if (!this.subscriptions[eventKey].hasOwnProperty(key)) {
                if (eventKeysDefined)
                    throw new Error(`key: ${eventKey}, in params[0] has not been subscribed`);
                else
                    return;
            }
            this.subscriptions[eventKey].keys[key].suppressed = true;
        });
    }
    unsuppress(key, eventKeys) {
        let string = false;
        if (typeof key !== 'string')
            throw new Error(`key: ${key}, in params[0] is not of type: String!`);
        const eventKeysDefined = Boolean(eventKeys);
        if (!eventKeys)
            eventKeys = Object.keys(this.subscriptions);
        if (typeof eventKeys !== 'string' && !(eventKeys instanceof Array) && eventKeys)
            throw new Error(`eventKeys: in params[1] is not of type: String or Array!`);
        if (!(eventKeys instanceof Array))
            eventKeys = [eventKeys], string = true;
        eventKeys.forEach((eventKey, i) => {
            if (typeof eventKey !== 'string')
                throw new Error(`eventKey: ${eventKey}, ${(string) ? `` : `in index[${i}] `}in params[1] is not of type: String!`);
            if (!this.subscriptions.hasOwnProperty(eventKey))
                throw new Error(`eventKey: ${eventKey}, ${(string) ? `` : `in index[${i}] `}in params[1] has no keys subscribed`);
            if (!this.subscriptions[eventKey].hasOwnProperty(key)) {
                if (eventKeysDefined)
                    throw new Error(`key: ${eventKey}, in params[0] has not been subscribed`);
                else
                    return;
            }
            this.subscriptions[eventKey].keys[key].suppressed = false;
        });
    }
    unsubscribe(key, eventKeys) {
        let string = false;
        const all = !eventKeys;
        if (typeof key !== 'string')
            throw new Error(`key: ${key}, in params[0] is not of type: String!`);
        if (!eventKeys)
            eventKeys = Object.keys(this.subscriptions);
        if (typeof eventKeys !== 'string' && !(eventKeys instanceof Array))
            throw new Error(`eventKeys: in params[1] is not of type: String or Array!`);
        if (!(eventKeys instanceof Array))
            eventKeys = [eventKeys], string = true;
        // content.warn({ key, eventKeys });
        eventKeys.forEach((eventKey, i) => {
            if (typeof eventKey !== 'string')
                throw new Error(`eventKey: ${eventKey}, ${(string) ? `` : `in index[${i}] `}in params[1] is not of type: String!`);
            if (!this.subscriptions.hasOwnProperty(eventKey))
                throw new Error(`eventKey: ${eventKey}, ${(string) ? `` : `in index[${i}] `}in params[1] has no keys subscribed`);
            // content.warn({ key, eventKey });
            if (!this.subscriptions[eventKey].keys.hasOwnProperty(key)) {
                if (!all)
                    throw new Error(`key: ${key}, in params[0] has not been subscribed`);
                else
                    return;
            }
            delete this.subscriptions[eventKey].keys[key];
            if (!(--this.subscriptions[eventKey].subscriptions)) {
                const { worldSubscribed, function: subscriptionFunction, oldEventKey } = this.subscriptions[eventKey] ?? {};
                const { subscription = {}, unsubscription } = this.registry[eventKey] ?? {};
                if (unsubscription instanceof Function)
                    unsubscription();
                if (worldSubscribed) {
                    const worldSystem = this.getNativeEventSignalKey(oldEventKey);
                    if (!worldSystemEvents[worldSystem])
                        return;
                    worldSystemEvents[worldSystem][oldEventKey].unsubscribe(subscriptionFunction);
                }
                else {
                    const eventkeys = [];
                    Object.entries(subscription).forEach(([oldEventKey, subscriptionValue]) => {
                        eventkeys.push(subscriptionValue?.entityOptionsKey ?? oldEventKey);
                    });
                    this.unsubscribe(eventKey, eventkeys);
                }
            }
        });
    }
    ;
    initSubscribe(eventKey) {
        if (!this.subscriptions.hasOwnProperty(eventKey))
            this.subscriptions[eventKey] = {};
        if (!this.subscriptions[eventKey].hasOwnProperty('keys'))
            this.subscriptions[eventKey].keys = {};
        if (!this.subscriptions[eventKey].hasOwnProperty('subscriptions'))
            this.subscriptions[eventKey].subscriptions = 0;
        if (!this.subscriptions[eventKey].hasOwnProperty('keyList'))
            this.subscriptions[eventKey].keyList = [];
        this.subscriptions[eventKey].worldSubscribed = true;
    }
    ;
    getEventProperties(eventInstance) {
        const properties = Object.getOwnPropertyDescriptors(eventInstance?.prototype);
        let playerKey, modifiables;
        for (const key in properties) {
            if (key === 'constructor')
                continue;
            const { set, get, value, configurable, enumerable } = properties[key];
            if (configurable) {
                modifiables ??= [];
                modifiables.push(key);
            }
            if (value instanceof PlayerType) {
                playerKey ??= [];
                playerKey.push(key);
            }
        }
        return { playerKey, modifiables };
    }
    worldSubscribe(key, oldEventKey, entityOptionsKey, worldSystem, entityOptions, callback) {
        // content.warn(entityOptionsKey);
        if (this.subscriptions?.[entityOptionsKey ?? oldEventKey]?.worldSubscribed ?? false)
            return (Object.assign(this.subscriptions[entityOptionsKey ?? oldEventKey] ?? {}, { oldEventKey, worldSubscribed: true }), this.subscriptions[entityOptionsKey ?? oldEventKey].keys[key] = { suppressed: false, callback, time: undefined });
        // content.warn({ oldEventKey });
        this.initSubscribe(entityOptionsKey ?? oldEventKey);
        Object.assign(this.subscriptions[entityOptionsKey ?? oldEventKey], { oldEventKey, worldSubscribed: true });
        this.subscriptions[entityOptionsKey ?? oldEventKey].keys[key] = { suppressed: false, callback, time: undefined };
        this.subscriptions[entityOptionsKey ?? oldEventKey].subscriptions++;
        let subscribedEventFunction;
        // content.warn({ oldEventKey });
        subscribedEventFunction = (event) => {
            const { playerKey, modifiables } = this.getEventProperties(event);
            time.start(`Events*API*${entityOptionsKey ?? oldEventKey}`);
            // if (!oldEventKey.includes('start')) content.warn({ oldEventKey, playerKey, modifiables });
            let eventClone = (playerKey) ? {} : event;
            if (playerKey) {
                const prototype = Object.getPrototypeOf({});
                for (const key in event) {
                    if (prototype.hasOwnProperty(key))
                        continue;
                    if (playerKey instanceof Array) {
                        playerKey.forEach(playerKey => {
                            if (playerKey instanceof Object) {
                                Object.entries(playerKey).forEach(([outerKey, innerKeys]) => {
                                    if (key === outerKey) {
                                        let innerClone = {};
                                        for (const innerKey in event[key]) {
                                            if (prototype.hasOwnProperty(key))
                                                continue;
                                            if (innerKeys.includes(innerKey))
                                                innerClone[innerKey] = setProptotype(event[key][innerKey]);
                                            else
                                                innerClone = event[key][innerKey];
                                        }
                                        eventClone[key] = innerClone;
                                    }
                                });
                            }
                            else {
                                if (playerKey.includes(key))
                                    eventClone[key] = setProptotype(event[key]);
                            }
                        });
                    }
                    else if (key === playerKey) {
                        eventClone[key] = setProptotype(event[playerKey]);
                        // content.warn({ playerTest: eventClone[key] instanceof Player });
                        continue;
                    }
                    if (event[key] instanceof Function) {
                        eventClone[key] = (...args) => { return event[key](...args); };
                        continue;
                    }
                    eventClone[key] = event[key];
                }
            }
            Object.entries(this.subscriptions[entityOptionsKey ?? oldEventKey].keys).forEach(([key, { suppressed, callback }]) => {
                if (!suppressed) {
                    try {
                        time.start(`Events*API*${entityOptionsKey ?? oldEventKey}*${key}`);
                        callback(eventClone);
                        if (eventClone.cancel)
                            content.warn({ cancel: eventClone.cancel, oldEventKey, key });
                        this.subscriptions[entityOptionsKey ?? oldEventKey].keys[key].time = time.end(`Events*API*${entityOptionsKey ?? oldEventKey}*${key}`);
                    }
                    catch (error) {
                        errorLogger.log(error, error.stack, { key: key, event: oldEventKey });
                    }
                }
            });
            this.subscriptions[oldEventKey].time = time.end(`Events*API*${entityOptionsKey ?? oldEventKey}`);
            // content.warn({ eventClone });
            if (modifiables)
                modifiables.forEach(key => event[key] = eventClone[key]);
            // content.warn({ cancel: event.cancel, oldEventKey });
        };
        this.subscriptions[entityOptionsKey ?? oldEventKey].function = subscribedEventFunction;
        // content.warn({ key, oldEventKey, fix: this.removeBeforeInKey(oldEventKey), worldSystemHas: Boolean(world?.[worldSystem]?.[this.removeBeforeInKey(oldEventKey)]), isFunc: subscribedEventFunction instanceof Function });
        if (!(this.removeBeforeInKey(oldEventKey) in worldSystemEvents[worldSystem]))
            throw new Error(`${oldEventKey} is broke`);
        if (entityOptions)
            worldSystemEvents[worldSystem][this.removeBeforeInKey(oldEventKey)].subscribe(subscribedEventFunction, entityOptions);
        else
            worldSystemEvents[worldSystem][this.removeBeforeInKey(oldEventKey)].subscribe(subscribedEventFunction);
    }
    getEvent(eventKey) {
        if (!this.registry.hasOwnProperty(eventKey))
            throw new Error(`eventKey: ${eventKey}, in params[0] is not a custom, system, or world event!`);
        return new CustomEvent(eventKey);
    }
}
// world.events.beforeChat.subscribe(() => {
// 	world.sendMessage(JSON.stringify(eventBuilder, (key, value) => (value instanceof Function) ? '() => {}' : value, 4));
// });
//# sourceMappingURL=class.js.map