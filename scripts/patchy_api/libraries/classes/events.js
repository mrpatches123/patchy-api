import { world } from "mojang-minecraft";
import global from "./global.js";
import time from './time.js'
global.joiningPlayers = {};
class EventBuilder {
    constructor() {
        this.suppresses = {};
        this.subscriptions = {}
        this.worldLoad = { subscription: false };
        this.playerJoin = {
            subscription: () => {
                world.events.playerJoin.subscribe(({ player }) => {
                    global.joiningPlayers.unshift(player);
                });
                world.events.tick.subscribe(event => {
                    global.joiningPlayers.forEach(player => {
                        try {
                            player.runCommand('testfor @s');
                            // content.warn({t:'players', jp: global.joiningPlayers.map(player => native.toObject(player))})
                            global.joiningPlayers = global.joiningPlayers.filter(player => !global.joiningPlayers.some(join => player.getName() === join.getName()));
                            // content.warn({t:'players', jp: global.joiningPlayers.map(player => native.toObject(player))})
                            eventBuilder.playerJoin.forEach((key, { callback, suppressed }) => {
                                try {
                                    if (!suppressed) {
                                        callback(event);
                                    }
                                } catch (error) {
                                    errorBuider.log(error, error.stack, { event: 'playerJoin', key });
                                }
                            });
                            if (!global.loaded) {
                                try {
                                    global.loaded = true;
                                } catch (error) { errorBuider.log(error, error.stack, { event: 'worldLoad - API', key: 'N/A' }); }
                                eventBuilder.worldLoad.forEach((key, { callback, suppressed }) => {
                                    try {
                                        if (!suppressed) {
                                            callback(event);
                                        }
                                    } catch (error) {
                                        errorBuider.log(error, error.stack, { event: 'worldLoad', key });
                                    }
                                });
                            }
                        } catch { /*console.warn(error, error.stack);*/ }
                    });
                
                })
                        }
        };
        this.beforeExplosion = {
            subscription: () => {
                world.events.beforeExplosion.subscribe(event => {
                    time.start('beforeExplosion');
                    let { impactedBlocks, dimension } = event;
                    const cancels = [];
                    this.beforeExplosion.keys.forEach((key, { callback, suppressed }) => {
                        try {
                            if (!suppressed) {
                                const { cancel, impactedBlocks: callImpactedBlocks } = callback(event) ?? {};
                                if (callImpactedBlocks) {
                                    impactedBlocks = impactedBlocks.filter(blockLocation => callImpactedBlocks
                                        .some(blockLocation1 => blockLocation1 === blockLocation))
                                        .map(({ x, y, z }) => new BlockLocation(x, y, z));;
                                }
                                cancels.push(cancel);
                            }

                        } catch (error) {
                            errorBuider.log(error, error.stack, { event: 'beforeExplosion', key });
                        }
                    });
                    if (cancels.some(bool => bool)) { event.cancel = true; }

                    event.impactedBlocks = impactedBlocks;
                    global.tickTime.beforeExplosion = time.end('beforeExplosion');
                });
            }
        };
        this.playerHit = {
            subscription: () => {
                world.events.entityHit.subscribe(event => {
                    time.start('playerHit');
                    this.playerHit.keys.forEach((key, { callback, suppressed }) => {
                        try {
                            if (!suppressed) {
                                callback(event);
                            }
                        } catch (error) {
                            errorBuider.log(error, error.stack, { event: 'playerHit', key });
                        }
                    });
                    global.tickTime.playerHit = time.end('playerHit');
                }, Object.assign(new EntityEventOptions(), { entityTypes: ["minecraft:player"] }));
            }
        };
        this.playerHurt = {
            subscription: () => {
                world.events.entityHurt.subscribe(event => {
                    time.start('playerHurt');
                    this.playerHurt.keys.forEach((key, { callback, suppressed }) => {
                        try {
                            if (!suppressed) {
                                callback(event);
                            }
                        } catch (error) {
                            errorBuider.log(error, error.stack, { event: 'playerHurt', key });
                        }
                    });
                    global.tickTime.playerHurt = time.end('playerHurt');
                }, Object.assign(new EntityEventOptions(), { entityTypes: ["minecraft:player"] }));
            }
        };
        world.events.keys().forEach(key => {
            if(!this.hasOwnProperty(key)) {
                this[key] = {
                    subscription: true
                }
            }
        });
        this.forEach((key) => {
            
            this[key].keys = {}
            this[key].subscribed = 0
        })
    }
    subscribe(key, eventObject) {
        eventObject.forEach((eventKey, callback) => {
            if (!key) {
                throw new Error(`argument 0 expected a key in the type: String`);
            } else if (!callback) {
                throw new Error(`argument 0 expected a key in the type: String`);
            } if (!this[eventKey]) {
                throw new Error(`${eventKey} not exist on class world or your not in beta`);
                // } else if (this[event][key]) {
                //     throw new Error(`the ${key} for the event: ${event} has already been subscribed. unsubscribe it with this.unsubscribe(<key>)`);
            } else if (typeof callback !== 'function') {
                throw new Error(`the callback for the event: ${eventKey} must be in the type: Function`);
            } else {
                if (!this[eventKey].subscribed) {
                    if (this[eventKey].subscription === true) {
                        if (eventKey.includes('before')) {
                            this.subscriptions[eventKey] = (event) => {
                                time.start(eventKey);
                                this[eventKey].keys.forEach((key, { callback, suppressed }) => {
                                    try {
                                        if (!suppressed) {
                                            cancel.push(callback(event));
                                        }
                                    } catch (error) {
                                        errorBuider.log(error, error.stack, { event: eventKey, key });
                                    }
                                });
                                if (cancel.some(bool => bool)) { event.cancel = true; }
                                global.tickTime[eventKey] = time.end(eventKey);
                            }
                            world.events[eventKey].subscribe()
                            
                        } else {
                            this.subscriptions[eventKey] = (event) => {
                                time.start(eventKey);
                                this[event].keys.forEach((key, { callback, suppressed }) => {
                                    try {
                                        if (!suppressed) {
                                            callback(event);
                                        }
                                    } catch (error) {
                                        errorBuider.log(error, error.stack, { event: eventKey, key });
                                    }
                                });
                                global.tickTime[eventKey] = time.end(eventKey);
                            }
                            
                        }
                        world.events[eventKey].subscribe(this.subscriptions[eventKey])
                        
                    } else if (typeof this[eventKey].subscription === 'function') {
                        this.subscriptions[eventKey] = this[eventKey].subscription 
                        world.events[eventKey].subscribe(this.subscriptions[eventKey])
                    }
                }
                
                if (!this[eventKey].keys.hasOwnProperty(key)) {
                    this[eventKey].subscribed++
                }
                this[eventKey].keys[key] = {};
                this[eventKey].keys[key].callback = callback;
                this[eventKey].keys[key].suppressed = false;
            }
        });
    }
    unsubscribe(key, events) {
        
        if (Array.isArray(events)) {
            events.forEach(event => {
                if (!--this[event].subscribed) {
                    world.events[eventKey].unsubscribe(this.subscriptions[event])
                }
                if (!this.hasOwnProperty(event)) {
                    throw new Error(`Event: ${events}, does not exist`);
                } else {
                    delete this[event].keys[key];
                }
            });
        } else {
            if (!this[events]) {
                throw new Error(`${events} not exist on class world or your not in beta`);
            } else {
                delete this[events].keys[key];
            }
        }
    }
    unsubscribeAll(key) {
        if (!key) {
            eventBuilder = new EventBuilder();
        } else {
            this.forEach((event, keys) => delete this[event].keys[key]);
        }
    }
    //0 = none running
    //1 = ll running
    //2 = unkown running
    suppress(key, events) {
        if (Array.isArray(events)) {
            events.forEach(event => {
                if (!this[events]) {
                    throw new Error(`${events} not exist on class world or your not in beta`);
                } else {
                    this[event].keys[key].suppressed = true;
                }

            });
        } else {
            if (!this[events]) {
                throw new Error(`${events} not exist on class world or your not in beta`);
            } else {
                if (this[events].hasOwnProperty(key)) {
                    this[events][key].suppressed = true;
                }
            }
        }
        this.suppresses[key] = 2;
    }
    suppressAll(key) {
        if (this.suppresses[key] !== 0) {
            if (!key) {
                this.forEach((event, callbacks) => callbacks.forEach(eventKey => {
                    if (this[eventKey].keys.hasOwnProperty(key)) {
                        this[event].keys[eventKey].suppressed = true;
                    }
                }));
            } else {
                this.forEach((event, callbacks) => callbacks.forEach(eventKey => {
                    if (this[event].keys.hasOwnProperty(key)) {
                        this[event].keys[key].suppressed = true;
                    }

                }));
            }
            this.suppresses[key] = 0;
        }
    }
    unsuppress(key, events) {
        if (Array.isArray(events)) {
            events.forEach(event => {
                if (!this[events]) {
                    throw new Error(`${events} not exist on class world or your not in beta`);
                } else {
                    if (this[event].keys.hasOwnProperty(key)) {
                        this[event].keys[key].suppressed = false;
                    }
                }

            });
        } else {
            if (!this[events]) {
                throw new Error(`${events} not exist on class world or your not in beta`);
            } else {
                if (this[events].keys.hasOwnProperty(key)) {
                    this[events].keys[key].suppressed = false;
                }
            }
        }
        this.suppresses[key] = 2;
    }
    unsuppressAll(key) {
        if (this.suppresses[key] !== 1) {


            if (!key) {
                this.forEach((event, eventKeys) => eventKeys.forEach(eventKey => {
                    if (this[eventKey].keys[key]) {
                        this[event].keys[eventKey].suppressed = false;
                    }
                }));
            } else {

                this.forEach((event, eventKeys) => eventKeys.forEach(eventKey => {
                    if (this[event].keys[key]) {
                        this[event].keys[key].suppressed = false;
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
//                                     databases.initialize();
//                                     server.objectiveAdd('error');
                
//                                     server.scoreAdd('error', 'log');
//                                     console.warn(server.scoreAdd('error', 'save'), server.scoreAdd('error', 'log'));