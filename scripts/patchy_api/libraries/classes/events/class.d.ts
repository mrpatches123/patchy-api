import { CustomEvent } from '../custom_event/class';
import { EventObject, EventRegisterObject, EventTypes as EventKeyTypes } from './types';
export declare class EventBuilder {
    subscriptions: {
        [eventKey: string]: {
            time: number | undefined;
            worldSubscribed: boolean;
            function: Function;
            oldEventKey: string;
            keyList: string[];
            subscriptions: number;
            keys: {
                [key: string]: {
                    suppressed: boolean;
                    callback: Function;
                    time: number | undefined;
                };
            };
        };
    };
    private registry;
    private classId;
    constructor();
    queueNextTick(callback: () => any, ticksToSkip?: number): void;
    register(eventAddObject: EventRegisterObject): void;
    /**
     * @param {String} eventKey
     * @returns {String}
     */
    private removeBeforeInKey;
    /**
     * @param {String} eventKey
     * @returns {'beforeEvents' | 'afterEvents' | 'systemEvents'}
     */
    private getNativeEventSignalKey;
    subscribe(key: string, subscribeObject: EventObject): void;
    suppress(key: string, eventKeys: (keyof EventKeyTypes)[] | (keyof EventKeyTypes)): void;
    unsuppress(key: string, eventKeys: string[] | string): void;
    unsubscribe(key: string, eventKeys?: string[] | string): void;
    private initSubscribe;
    private getEventProperties;
    private worldSubscribe;
    getEvent(eventKey: string): CustomEvent;
}
