import { world } from "@minecraft/server";
import { content, native, parseList } from "../utilities.js";
import global from "./global.js";
import time from './time.js';
import errorBuider from './error.js';
global.tickTime = {};
global.help = [];
// content.warn(native.stringify({hasOwnProperty: world.events.hasProperty('beforeChat')}))
import { BeforeChatEvent, BeforeDataDrivenEntityTriggerEvent, BeforeExplosionEvent, BeforeItemDefinitionTriggeredEvent, BeforeItemUseEvent, BeforeItemUseOnEvent, BeforePistonActivateEvent, BlockBreakEvent, BlockExplodeEvent, BlockPlaceEvent, ButtonPushEvent, ChatEvent, DataDrivenEntityTriggerEvent, EffectAddEvent, EntityCreateEvent, EntityHitEvent, EntityHurtEvent, ExplosionEvent, ItemCompleteChargeEvent, ItemDefinitionTriggeredEvent, ItemReleaseChargeEvent, ItemStartChargeEvent, ItemStartUseOnEvent, ItemStopChargeEvent, ItemStopUseOnEvent, ItemUseEvent, ItemUseOnEvent, LeverActionEvent, PistonActivateEvent, PlayerJoinEvent, PlayerLeaveEvent, ProjectileHitEvent, TickEvent, WeatherChangeEvent, WorldInitializeEvent } from '@minecraft/server';
/**
 * @typedef {Object} ObjectEventSubscribe
 * @property {(arg: BeforeChatEvent) => {}} beforeChat
 * @property {(arg: BeforeDataDrivenEntityTriggerEvent) => {}} beforeDataDrivenEntityTriggerEvent
 * @property {(arg: BeforeExplosionEvent) => {}} beforeExplosion
 * @property {(arg: BeforeItemDefinitionTriggeredEvent) => {}} beforeItemDefinitionEvent
 * @property {(arg: BeforeItemUseEvent) => {}} beforeItemUse
 * @property {(arg: BeforeItemUseOnEvent) => {}} beforeItemUseOn
 * @property {(arg: BeforePistonActivateEvent) => {}} beforePistonActivate
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
 * @property {(arg: {playerId: String, playerName: String}) => {}} playerLeft
 * @property {(arg: { id: String, key: String, target: String, type: String, value: any }) => {}} requestAdded
 * @property {() => {}} worldLoad
*/
// world.events.worldInitialize.subscribe(() => {
//     content.warn('klwdkldwkjwdjkwd');
// });
class EventBuilder {
    constructor() {
        this.suppresses = {};
        this.subscriptions = {};
        this.events = {};
        this.classId = Math.random();
        content.warn({ classId: this.classId });
    }
    queueNextTick(callback, ticksToSkip = 0) {
        const queueCallback = (event) => {
            if (ticksToSkip-- <= 0) {
                callback(event);
                world.events.tick.unsubscribe(queueCallback);
            }
        };
        world.events.tick.subscribe(queueCallback);
    }
    add(eventObject) {
        eventObject.forEach((eventKey, { subscription }) => {

            // if (eventKey === 'playerJoin') {
            //     content.warn('playerJoinADD')
            // } 
            if (!this.events.hasOwnProperty(eventKey)) {
                this.events[eventKey] = {};
                this.events[eventKey].keysObject = {};
                this.events[eventKey].subscribed = 0;
            }
            this.events[eventKey].subscription = subscription;
        });
    }
    remove(...keysObject) {
        keys = parseList(keys);
        // keys.forEach(key)
    }
    /**
     * @method subscribe 
     * @param {String} key
     * @param {ObjectEventSubscribe} eventObject
     */
    subscribe(key, eventObject) {
        // content.warn({ key, eventObject: native.stringify(eventObject) });
        try {


            eventObject.forEach((eventKey, callback) => {
                if (!global.tickTime.hasOwnProperty(eventKey)) global.tickTime[eventKey] = {};
                if (!global.tickTime[eventKey].hasOwnProperty('keys')) global.tickTime[eventKey].keys = {};
                if (!world.events.hasProperty(eventKey) && !this.events.hasOwnProperty(eventKey)) {
                    world.say(`${key} - ${eventKey} - ${JSON.stringify(this, null, 4)}`);
                    throw new Error(`Bool: ${this.events.hasOwnProperty(eventKey)}, Event: ${eventKey} does not exist`);
                }
                // content.warn({[key]: eventKey})
                // if (eventKey === 'playerJoin') {
                //     content.warn('playerJoinSubscribe')
                // } 
                if (!this.events.hasOwnProperty(eventKey)) {
                    this.events[eventKey] = {};
                    this.events[eventKey].keysObject = {};
                    this.events[eventKey].subscribed = 0;
                    if (world.events.hasProperty(eventKey)) { this.events[eventKey].subscription = true; }
                }

                // content.warn({key,eventKey,hasEventKey:this.events.hasOwnProperty(eventKey),subscribed: this.events[eventKey].subscribed})
                if (!this.events[eventKey].subscribed) {

                    if (this.events[eventKey].subscription instanceof Function || this.events[eventKey].subscription instanceof Object) {
                        // global.help.push({ eventKey, subscribed: this.events[eventKey].subscribed });
                        this.subscriptions[eventKey] = this.events[eventKey].subscription;
                        const subscribeObjectInternal = {};

                        this.events[eventKey].subscription.forEach((key, value) => {
                            content.warn(value);
                            if (!world.events.hasProperty(key) && !this.events.hasOwnProperty(key)) {
                                return new Error(`Event: ${key}, does not of class world.events or EventBuilder`);
                            } else if (value instanceof Object) {
                                content.warn({ t: 'vALEUJKWDW', value });
                                if (value.options || value.useWorldEvents || (world.events.hasProperty(key) && this.events.hasOwnProperty(key))) {
                                    if (!world.events.hasProperty(key)) { return new Error(`key: ${key}, does not exist on world.events class instance.`); }
                                    if (value.options) {
                                        world.events[key].subscribe(value.function, value.options);
                                    } else {
                                        world.events[key].subscribe(value.function);
                                    }

                                } else if (this.events.hasOwnProperty(key) || world.events.hasProperty(key)) {
                                    subscribeObjectInternal[key] = value.function;
                                } else {
                                    new Error(`key: ${key}, does not exist on world.events or Eventbuilder class.`);
                                }
                            } else if (value instanceof Function) {
                                if ((world.events.hasProperty(key) && this.events.hasOwnProperty(key))) {
                                    world.events[key].subscribe(value);
                                } else {
                                    subscribeObjectInternal[key] = value;
                                }

                            } else {
                                new Error(`subscription Object: ${eventKey}, eventKey should be an Object with a function and/or options or just a function`);
                            }
                        });
                        if (subscribeObjectInternal.length()) {
                            content.warn(native.stringify(subscribeObjectInternal));
                            this.subscribe(`${eventKey}*IE`, subscribeObjectInternal);
                        }
                    } else if (this.events[eventKey].subscription === true) {
                        if (eventKey.includes('before')) {


                            this.subscriptions[eventKey] = (event) => {
                                time.start(`${eventKey}*Events*API`);
                                const cancels = [];
                                this.events[eventKey].keysObject.forEach((key, { callback, suppressed }) => {
                                    try {

                                        time.start(`${eventKey}*${key}*Events*API`);
                                        if (!suppressed) {
                                            cancels.push(callback(event));
                                        }
                                        global.tickTime[eventKey].keys[key] = time.end(`${eventKey}*${key}*Events*API`);
                                    } catch (error) {
                                        errorBuider.log(error, error.stack, { event: eventKey, key });
                                    }
                                });
                                if (cancels.some(bool => bool)) { event.cancel = true; }
                                global.tickTime[eventKey].total = time.end(`${eventKey}*Events*API`);
                            };
                        } else {

                            this.subscriptions[eventKey] = (event) => {

                                time.start(`${eventKey}*Events*API`);
                                this.events[eventKey].keysObject.forEach((key, { callback, suppressed }) => {
                                    try {

                                        time.start(`${eventKey}*${key}*Events*API`);
                                        if (!suppressed) {
                                            callback(event);
                                        }
                                        global.tickTime[eventKey].keys[key] = time.end(`${eventKey}*${key}*Events*API`);

                                    } catch (error) {
                                        content.warn({ key, eventKey, keysObject: this.events[eventKey].keysObject },);
                                        errorBuider.log(error, error.stack, { event: eventKey, key });
                                    }
                                });
                                global.tickTime[eventKey].total = time.end(`${eventKey}*Events*API`);
                                // content.warn({ t: 'tiemekle', time: global.tickTime[eventKey], time2: global.tickTime[eventKey].keys['playerJoined*IE'] });
                            };

                        }
                        world.events[eventKey].subscribe(this.subscriptions[eventKey]);

                    }
                }

                if (!this.events[eventKey].keysObject.hasOwnProperty(key)) {
                    this.events[eventKey].subscribed++;
                    global.help.push({ eventKey, key, bool: this.events[eventKey].keysObject.hasOwnProperty(key), subscribed: this.events[eventKey].subscribed });
                }
                this.events[eventKey].keysObject[key] = {};
                this.events[eventKey].keysObject[key].callback = callback;
                this.events[eventKey].keysObject[key].suppressed = false;
                this.events[eventKey].keysObject = this.events[eventKey].keysObject.sortKeys();


            });
        } catch (error) {
            console.warn('eventsubscribe', error, error.stack);
        }

    }
    //eventKey =  the key for the event listed under this.events
    //event = the key in keysObject for the object assigned to eventKey
    unsubscribeEvent(eventKey, event) {
        // content.warn({ eventKey, event });
        let { subscribed } = this.events[eventKey];
        subscribed = this.events[eventKey].subscribed -= (subscribed) ? 1 : 0;
        if (!subscribed) {
            if (native.typeOf(this.subscriptions[event] === 'object')) {
                let unsubscribeBuilder = false;
                this.events[eventKey].subscription.forEach((key, value) => {
                    if (!world.events.hasProperty(key) && !this.events.hasOwnProperty(key)) {
                        return new Error(`Event: ${key}, does not of class world.events or EventBuilder`);
                    } else if (native.typeOf(value) === 'object') {
                        if (value.options || value.useWorldEvents) {
                            if (!world.events.hasProperty(key)) { return new Error(`key: ${key}, does not exsit on world.events class instance.`); }
                            world.events[key].unsubscribe(value.function);
                        } else if (this.events.hasOwnProperty(key) || world.events.hasProperty(key)) {
                            unsubscribeBuilder = true;
                        } else {
                            new Error(`key: ${key}, does not exsit on world.events or Eventbuilder class.`);
                        }
                    } else if (typeof value === 'function') {
                        unsubscribeBuilder = true;
                    } else {
                        new Error(`subscription Object: ${eventKey}, eventKey should be an Object with a function and/or options or just a function`);
                    }
                });
                if (unsubscribeBuilder) {
                    this.unsubscribeAll(`${key}*IE`);
                }
            } else {
                world.events[eventKey].unsubscribe(this.subscriptions[eventKey]);
            }


        }
        if (!this.events.hasOwnProperty(eventKey)) {
            throw new Error(`Event: ${eventKey}, with the key: ${event}, does not exist`);
        } else {
            delete this.events[eventKey].keysObject[event];
        }
    }
    unsubscribe(key, events) {

        if (Array.isArray(events)) {
            events.forEach(event => {
                this.unsubscribeEvent(key, event);
            });

        } else {
            if (!this.events[events]) {
                throw new Error(`${events} not exist on class world or your not in beta`);
            } else {
                this.unsubscribeEvent(key, events);
            }
        }
    }
    unsubscribeAll(key) {
        if (!key) {
            eventBuilder = new EventBuilder();
        } else {
            // content.warn({this: this})
            this.events.forEach((event) => {
                if (!this.events[event].keysObject) {
                    // content.warn(this.events[event])
                }
                if (this.events[event].keysObject.hasOwnProperty(key)) {
                    this.unsubscribeEvent(event, key);
                }
            });
        }
    }
    //0 = none running
    //1 = ll running
    //2 = unkown running
    suppress(key, events) {
        if (Array.isArray(events)) {
            events.forEach(event => {
                if (!this.events[events]) {
                    throw new Error(`${events} not exist on class world or your not in beta`);
                } else {
                    this.events[event].keysObject[key].suppressed = true;
                }

            });
        } else {
            if (!this.events[events]) {
                throw new Error(`${events} not exist on class world or your not in beta`);
            } else {
                if (this.events[events].hasOwnProperty(key)) {
                    this.events[events][key].suppressed = true;
                }
            }
        }
        this.suppresses[key] = 2;
    }
    suppressAll(key) {
        if (this.suppresses[key] !== 0) {
            if (!key) {
                this.events.forEach((event, callbacks) => callbacks.forEach(eventKey => {
                    if (this.events[eventKey].keysObject.hasOwnProperty(key)) {
                        this.events[event].keysObject[eventKey].suppressed = true;
                    }
                }));
            } else {
                this.events.forEach((event, callbacks) => callbacks.forEach(eventKey => {
                    if (this.events[event].keysObject.hasOwnProperty(key)) {
                        this.events[event].keysObject[key].suppressed = true;
                    }

                }));
            }
            this.suppresses[key] = 0;
        }
    }
    unsuppress(key, events) {
        if (Array.isArray(events)) {
            events.forEach(event => {
                if (!this.events[events]) {
                    throw new Error(`${events} not exist on class world or your not in beta`);
                } else {
                    if (this.events[event].keysObject.hasOwnProperty(key)) {
                        this.events[event].keysObject[key].suppressed = false;
                    }
                }

            });
        } else {
            if (!this.events[events]) {
                throw new Error(`${events} not exist on class world or your not in beta`);
            } else {
                if (this.events[events].keysObject.hasOwnProperty(key)) {
                    this.events[events].keysObject[key].suppressed = false;
                }
            }
        }
        this.suppresses[key] = 2;
    }
    unsuppressAll(key) {
        if (this.suppresses[key] !== 1) {


            if (!key) {
                this.forEach((event, eventKeys) => eventKeys.forEach(eventKey => {
                    if (this.events[eventKey].keysObject[key]) {
                        this.events[event].keysObject[eventKey].suppressed = false;
                    }
                }));
            } else {

                this.forEach((event, eventKeys) => eventKeys.forEach(eventKey => {
                    if (this.events[event].keysObject[key]) {
                        this.events[event].keysObject[key].suppressed = false;
                    }
                }));
            }
            this.suppresses[key] = 1;
        }
    }
}
const eventBuilder = new EventBuilder();
export default eventBuilder;

