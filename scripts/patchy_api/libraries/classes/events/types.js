import { world, system } from '@minecraft/server';
import { content } from '../../utilities.js';
;
const customKeys = [
    'beforeChat',
    'beforeChatSend',
    'beforeDataDrivenEntityTriggerEvent',
    'beforeDataDrivenPlayerTriggerEvent',
    'beforeExplosion',
    'beforeItemDefinitionEvent',
    'beforeItemUse',
    'beforeItemUseOn',
    'beforeItemUseOnStart',
    'beforePistonActivate',
    'beforePlayerInteractWithBlock',
    'beforePlayerInteractWithEntity',
    'beforePlayerBreakBlock',
    'beforePlayerPlaceBlock',
    'beforeWatchdogTerminate',
    'beforePlayerLeave',
    'beforeEntityRemove',
    'beforeEffectAdd',
    'chat',
    'dataDrivenPlayerTriggerEvent',
    'tick',
    'tickAfterLoad',
    'playerJoined',
    'playerHit',
    'playerHurt',
    'playerDeath',
    'requestAdded',
    'stepOnBlock',
    'playerSpawned',
    'playerJoinAwaitMove',
    'worldLoad',
    'scoreboardChange',
    'beforePlayerScaffoldPlace',
    'blockBreak',
    'custom',
];
const eventKeys = customKeys;
for (const key in world.afterEvents) {
    const prototype = Object.getPrototypeOf({});
    if (key in prototype)
        continue;
    eventKeys.push(key);
}
for (const key in system.afterEvents) {
    const prototype = Object.getPrototypeOf({});
    if (key in prototype)
        continue;
    eventKeys.push(key);
}
// Object.keys(world.afterEvents).forEach((key) => eventKeys.push(key));
// Object.keys(system.afterEvents).forEach((key) => eventKeys.push(key));
content.warn(eventKeys);
export { eventKeys };
// export class EventBuilder {
// 	constructor();
// 	/**
// 	 * subscribes event functions to a certian key;
// 	 */
// 	subscribe(key: string, eventObject: EventObject): void;
// 	/**
// 	 * like old system.run
// 	 */
// 	queueNextTick(callback: () => {}, ticksToSkip: number): void;
// 	/**
// 	 * used to register custom event typings
// 	 */
// 	/**
// 	 * used to register custom events
// 	 */
// 	register(eventRegisterObject: EventRegisterObject): void;;
// 	/**
// 	 * unsubscribes event functions(s) from certian key
// 	 */
// 	unsubscribe(key: string, events?: string | string[]): void;
// 	/**
// 	 * turns off an event functions(s) without deleting it.
// 	 */
// 	suppress(key: string, events?: string | string[]): void;
// 	/**
// 	 * turns on an event functions(s) without deleting it.
// 	 */
// 	unsuppress(key: string, events?: string | string[]): void;
// 	/**
// 	 * Used to get a custom event and loop over keys subcribed to it
// 	 */
// 	getEvent<eventKey extends string>(eventKey: eventKey): CustomEvent<eventKey>;
// }
//# sourceMappingURL=types.js.map