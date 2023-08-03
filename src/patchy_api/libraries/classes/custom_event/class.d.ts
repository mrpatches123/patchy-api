import { EventKeyTypes } from '../events/class';

class CustomEvent<eventKey extends string> {
	eventKey: string;
	subscriptions: { [eventKey: string]: { time: number, keys: { [key: string]: { time: number; suppessed: boolean, callback: Function; }; }; }; };

	constructor(eventKey: string);
	iterate(eventResponse: EventKeyTypes[eventKey] | Object, callback: (key: string, eventResponse: EventKeyTypes[eventKey] | Object, callbackForKey: () => {}, i: Number) => {}): void;
}