;
export const eventKeys = ['beforeChat', 'beforeChatSend', 'beforeDataDrivenEntityTriggerEvent', 'beforeDataDrivenPlayerTriggerEvent', 'beforeExplosion', 'beforeItemDefinitionEvent', 'beforeItemUse', 'beforeItemUseOn', 'beforeItemUseOnStart', 'beforePistonActivate', 'blockBreak', 'blockExplode', 'blockPlace', 'buttonPush', 'chat', 'chatSend', 'dataDrivenEntityTriggerEvent', 'dataDrivenPlayerTriggerEvent', 'effectAdd', 'entityDie', 'entitySpawn', 'entityHealthChanged', 'entityHitBlock', 'entityHitEntity', 'entityHurt', 'explosion', 'itemStopUse', 'itemDefinitionEvent', 'itemReleaseCharge', 'itemStartCharge', 'itemStartUseOn', 'itemStopUseOn', 'itemUse', 'itemUseOn', 'itemPickup', 'leverAction', 'pistonActivate', 'pressurePlatePush', 'targetBlockHit', 'tripWireTrip', 'playerJoin', 'playerLeave', 'projectileHit', 'tick', 'weatherChange', 'worldInitialize', 'tickAfterLoad', 'playerJoined', 'playerHit', 'playerHurt', 'playerDeath', 'requestAdded', 'stepOnBlock', 'playerSpawn', 'playerSpawned', 'playerJoinAwaitMove', 'scriptEventReceive', 'worldLoad', 'scoreboardChange', 'beforePlayerScaffoldPlace', 'custom',];
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