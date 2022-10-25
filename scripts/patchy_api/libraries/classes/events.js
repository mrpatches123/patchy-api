import { world, EntityEventOptions } from "@minecraft/server";
import { content, native, parseList } from "../utilities.js";
import global from "./global.js";
import time from './time.js';
import errorBuider from './error.js';
// content.warn(native.stringify({hasOwnProperty: world.events.hasProperty('beforeChat')}))
class EventBuilder {
    constructor() {
        this.suppresses = {};
        this.subscriptions = {};
        this.events = {};
        // world.events.keysObject().forEach(key => {
        //     if (!this.events.hasOwnProperty(key)) {
        //         this[key] = {
        //             subscription: true
        //         };
        //     }
        // });
        // this.forEach((key) => {

        //     this[key].keysObject = {};
        //     this[key].subscribed = 0;
        // });
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
                this.events[eventKey].keysObject = {},
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
     * @param {ObjectEvents} eventObject
     */
    subscribe(key, eventObject) {
        try {


            eventObject.forEach((eventKey, callback) => {
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
                    if (typeof this.events[eventKey].subscription === 'function' || native.typeOf(this.events[eventKey].subscription) === 'object') {

                        this.subscriptions[eventKey] = this.events[eventKey].subscription;
                        const subscribeObjectInternal = {};
                        this.events[eventKey].subscription.forEach((key, value) => {
                            // content.warn({key})
                            if (!world.events.hasProperty(key) && !this.events.hasOwnProperty(key)) {
                                return new Error(`Event: ${key}, does not of class world.events or EventBuilder`);
                            } else if (native.typeOf(value) === 'object') {
                                if (value.options || value.useWorldEvents || (world.events.hasProperty(key) && this.events.hasOwnProperty(key))) {
                                    if (!world.events.hasProperty(key)) { return new Error(`key: ${key}, does not exsit on world.events class instance.`); }
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
                            } else if (typeof value === 'function') {
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
                            this.subscribe(`${eventKey}*IE`, subscribeObjectInternal);
                        }
                    } else if (this.events[eventKey].subscription === true) {
                        if (eventKey.includes('before')) {
                            if (!global.tickTime.hasOwnProperty(eventKey)) {
                                global.tickTime[eventKey] = {};
                            }
                            this.subscriptions[eventKey] = (event) => {
                                time.start(eventKey);
                                const cancels = [];
                                this.events[eventKey].keysObject.forEach((key, { callback, suppressed }) => {
                                    try {
                                        if (!suppressed) {
                                            cancels.push(callback(event));
                                        }
                                    } catch (error) {
                                        errorBuider.log(error, error.stack, { event: eventKey, key });
                                    }
                                });
                                if (cancels.some(bool => bool)) { event.cancel = true; }
                                global.tickTime[eventKey] = time.end(eventKey);
                            };
                        } else {
                            this.subscriptions[eventKey] = (event) => {
                                if (!global.tickTime.hasOwnProperty(eventKey)) {
                                    global.tickTime[eventKey] = {};
                                }
                                time.start(eventKey);
                                this.events[eventKey].keysObject.forEach((key, { callback, suppressed }) => {
                                    try {
                                        if (!suppressed) {
                                            callback(event);
                                        }
                                    } catch (error) {
                                        errorBuider.log(error, error.stack, { event: eventKey, key });
                                    }
                                });
                                global.tickTime[eventKey] = time.end(eventKey);
                            };

                        }
                        world.events[eventKey].subscribe(this.subscriptions[eventKey]);

                    }
                }
                if (!this.events[eventKey].keysObject.hasOwnProperty(key)) {
                    this.events[eventKey].subscribed++;
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
        content.warn({ eventKey, event });
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
let eventBuilder = new EventBuilder();
export default eventBuilder;
// try { overworld.runCommand(`tickingarea add 0 0 0 0 0 0 PatchyDataBaseTick`); } catch { }
//									 databases.initialize();
//									 server.objectiveAdd('error');

//									 server.scoreAdd('error', 'log');
//									 console.warn(server.scoreAdd('error', 'save'), server.scoreAdd('error', 'log'));


