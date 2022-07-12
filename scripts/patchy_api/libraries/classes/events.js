
class EventBuilder {
    constructor() {
        this.suppresses = {};
        this.beforeChat = {};
        this.beforeDataDriven = {};
        this.beforeExplosion = {};
        this.beforeDataDrivenEntityTriggerEvent = {};
        this.beforeItemDefinitionEvent = {};
        this.beforeItemUse = {};
        this.beforeItemUseOn = {};
        this.beforePistonActivate = {};
        this.blockBreak = {};
        this.blockExplode = {};
        this.BlockExplodeEventSignal = {};
        this.blockPlace = {};
        this.chat = {};
        this.dataDrivenEntityTriggerEvent = {};
        this.effectAdd = {};
        this.entityCreate = {};
        this.entityHit = {};
        this.entityHurt = {};
        this.playerHit = {};
        this.playerHurt = {};
        this.explosion = {};
        this.itemDefinitionEvent = {};
        this.itemUse = {};
        this.itemUseOn = {};
        this.leverActivate = {};
        this.pistonActivate = {};
        this.playerJoin = {};
        this.playerLeave = {};
        this.tick = {};
        this.weatherChange = {};

    }
    subscribe(key, eventObject) {
        eventObject.forEach((event, callback) => {
            if (!key) {
                throw new Error(`argument 0 expected a key in the type: String`);
            } else if (!callback) {
                throw new Error(`argument 0 expected a key in the type: String`);
            } if (!this[event]) {
                throw new Error(`${event} not exist on class world or your not in beta`);
                // } else if (this[event][key]) {
                //     throw new Error(`the ${key} for the event: ${event} has already been subscribed. unsubscribe it with eventBuilder.unsubscribe(<key>)`);
            } else if (typeof callback !== 'function') {
                throw new Error(`the callback for the event: ${event} must be in the type: Function`);
            } else {
                this[event][key] = {};
                this[event][key].callback = callback;
                this[event][key].suppressed = false;
            }
        });
    }
    unsubscribe(key, events) {
        if (Array.isArray(events)) {
            events.forEach(event => {
                if (!this[events]) {
                    throw new Error(`${events} not exist on class world or your not in beta`);
                } else {
                    delete this[event][key];
                }

            });
        } else {
            if (!this[events]) {
                throw new Error(`${events} not exist on class world or your not in beta`);
            } else {
                delete this[events][key];
            }
        }
    }
    unsubscribeAll(key) {
        if (!key) {
            eventBuilder = new EventBuilder();
        } else {
            this.forEach((event, keys) => delete this[event][key]);
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
                    this[event][key].suppressed = true;
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
                    if (this[eventKey].hasOwnProperty(key)) {
                        this[event][eventKey].suppressed = true;
                    }
                }));
            } else {
                this.forEach((event, callbacks) => callbacks.forEach(eventKey => {
                    if (this[event].hasOwnProperty(key)) {
                        this[event][key].suppressed = true;
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
                    if (this[event].hasOwnProperty(key)) {
                        this[event][key].suppressed = false;
                    }
                }

            });
        } else {
            if (!this[events]) {
                throw new Error(`${events} not exist on class world or your not in beta`);
            } else {
                if (this[events].hasOwnProperty(key)) {
                    this[events][key].suppressed = false;
                }
            }
        }
        this.suppresses[key] = 2;
    }
    unsuppressAll(key) {
        if (this.suppresses[key] !== 1) {


            if (!key) {
                this.forEach((event, eventKeys) => eventKeys.forEach(eventKey => {
                    if (this[eventKey][key]) {
                        this[event][eventKey].suppressed = false;
                    }
                }));
            } else {

                this.forEach((event, eventKeys) => eventKeys.forEach(eventKey => {
                    if (this[event][key]) {
                        this[event][key].suppressed = false;
                    }
                }));
            }
            this.suppresses[key] = 1;
        }
    }
}
let eventBuilder = new EventBuilder();
export default eventBuilder;