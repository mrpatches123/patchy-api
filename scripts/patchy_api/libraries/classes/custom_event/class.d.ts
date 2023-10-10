import eventBuilder from "../events/export_instance.js";
export declare class CustomEvent {
    eventKey: string;
    subscriptions: typeof eventBuilder.subscriptions[string];
    constructor(eventKey: string);
    iterate(eventResponse: Object, callback?: Function): void;
}
