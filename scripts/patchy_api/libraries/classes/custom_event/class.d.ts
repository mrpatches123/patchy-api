import { EventKeyTypes } from '../events/class';

class CustomEvent<eventKey extends string> {
	constructor(eventKey: string);
	iterate(eventResponse: EventKeyTypes[eventKey] | Object, callback: (key: string, eventResponse: EventKeyTypes[eventKey] | Object, callbackForKey: () => {}, i: Number) => {}): void;
}