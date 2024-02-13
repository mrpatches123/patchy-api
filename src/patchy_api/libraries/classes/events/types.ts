import { Player } from "../player/class.js";
import { Entity, Entity as EntityType, Player as PlayerType, BlockHitInformation, DefinitionModifier, Dimension, ItemStack, Direction, Block, EntityDamageCause, EntityDamageSource as EntityDamageSourceType, EntityEventOptions, Vector3, ChatSendAfterEvent, DataDrivenEntityTriggerBeforeEvent, ExplosionBeforeEvent, ItemDefinitionTriggeredBeforeEvent, ItemUseBeforeEvent, ItemUseOnBeforeEvent, PistonActivateAfterEvent, WorldAfterEvents, ChatSendBeforeEvent, PlayerBreakBlockAfterEvent, world, PlayerInteractWithBlockBeforeEvent, PlayerInteractWithEntityBeforeEvent, PlayerBreakBlockBeforeEvent, PlayerPlaceBlockBeforeEvent, PlayerLeaveBeforeEvent, EntityRemoveBeforeEvent, EffectAddBeforeEvent, SystemAfterEvents, system, WatchdogTerminateBeforeEvent, World, DataDrivenEntityTriggerAfterEvent } from '@minecraft/server';
import { CustomEvent } from '../custom_event/class.js';
import { content } from '../../utilities.js';

export interface EntityDamageSource {
	cause: EntityDamageCause;
	damagingEntity?: Entity | Player;
	damagingProjectile?: Entity;
}
export interface EntityDeathSource {
	cause: EntityDamageCause;
	damagingEntity?: Entity | Player;
	projectile?: Entity;
}

export interface BeforeDataDrivenPlayerTriggerEvent {
	cancel: boolean;
	readonly player: Player;
	readonly id: string;
	getModifiers(): DefinitionModifier[];
	setModifiers(modifiers: DefinitionModifier[]): void;
}

export interface DataDrivenPlayerTriggerEvent {
	readonly player: Player;
	readonly id: string;
	getModifiers(): DefinitionModifier[];
}
export interface ItemPickupEvent {
	readonly item: ItemStack;
	readonly player: Player;
}
export interface PlayerJoinedEvent {
	/**
	 * the player that joined the game and can have command ran on them.
	 */
	readonly player: Player;
}
export interface TickEvent {
	readonly currentTick: number;
	readonly deltaTime: number;
}
export interface PlayerHurtEvent {
	readonly damage: number;
	readonly damageSource: EntityDamageSource;
	readonly player: Player;
}

export interface PlayerDeathEvent {
	readonly damageSource: EntityDeathSource;
	readonly player: Player;
	readonly cause: EntityDamageCause;
	readonly projectile: Entity;
}
export interface PlayerHitEvent {
	readonly player: Player;
	readonly hitEntity: Entity | Player;
	readonly hitBlock: Block;
}
export interface RequestAddedEvent {
	readonly id: string;
	readonly key: string;
	readonly target: string;
	readonly type: string;
	readonly value: any;
}
export interface StepOnBlockEvent {
	readonly block: Block;
	readonly player: Player;
}
export interface PlayerJoinAwaitMoveEvent {
	readonly player: Player;
}
export interface ScoreboardChangeEvent {
	player: Player;
	objective: string;
	value: number;
}
export interface BeforePlayerScaffoldPlaceEvent {
	cancel: boolean;
	player: Player;
	blockLocation: Vector3;
}
type Mutable<T> = {
	-readonly [K in keyof T]: T[K];
};
type AfterEventTypes = Mutable<{
	[K in keyof WorldAfterEvents]: Parameters<Parameters<WorldAfterEvents[K]["subscribe"]>[0]>[0]
}> & Mutable<{
	[K in keyof SystemAfterEvents]: Parameters<Parameters<SystemAfterEvents[K]["subscribe"]>[0]>[0]
}>;
export interface CustomEventKeyTypes {
	beforeChat: ChatSendBeforeEvent;
	beforeChatSend: ChatSendBeforeEvent;
	beforeDataDrivenEntityTriggerEvent: DataDrivenEntityTriggerBeforeEvent;
	dataDrivenEntityTriggerEvent: DataDrivenEntityTriggerAfterEvent;
	beforeDataDrivenPlayerTriggerEvent: BeforeDataDrivenPlayerTriggerEvent;
	beforeDataDrivenEntityTrigger: DataDrivenEntityTriggerBeforeEvent;
	beforeExplosion: ExplosionBeforeEvent;
	beforeItemDefinitionEvent: ItemDefinitionTriggeredBeforeEvent;
	beforeItemUse: ItemUseBeforeEvent;
	beforeItemUseOn: ItemUseOnBeforeEvent;
	beforeItemUseOnStart: ItemUseOnBeforeEvent;
	beforePlayerInteractWithBlock: PlayerInteractWithBlockBeforeEvent;
	beforePlayerInteractWithEntity: PlayerInteractWithEntityBeforeEvent;
	beforePlayerBreakBlock: PlayerBreakBlockBeforeEvent;
	beforePlayerPlaceBlock: PlayerPlaceBlockBeforeEvent;
	beforePlayerLeave: PlayerLeaveBeforeEvent;
	beforeEntityRemove: EntityRemoveBeforeEvent;
	beforeEffectAdd: EffectAddBeforeEvent;
	beforeWatchdogTerminate: WatchdogTerminateBeforeEvent;
	chat: ChatSendAfterEvent;
	dataDrivenPlayerTriggerEvent: DataDrivenPlayerTriggerEvent;
	tick: TickEvent;
	tickAfterLoad: TickEvent;
	playerJoined: PlayerJoinedEvent;
	playerHit: PlayerHitEvent;
	playerHurt: PlayerHurtEvent;
	playerDeath: PlayerDeathEvent;
	requestAdded: RequestAddedEvent;
	stepOnBlock: StepOnBlockEvent;
	playerSpawned: PlayerJoinedEvent;
	playerJoinAwaitMove: PlayerJoinAwaitMoveEvent;
	worldLoad: undefined;
	scoreboardChange: ScoreboardChangeEvent;
	beforePlayerScaffoldPlace: BeforePlayerScaffoldPlaceEvent;
	blockBreak: PlayerBreakBlockAfterEvent;
	custom: undefined;
};
type EventKeyTypes = AfterEventTypes & CustomEventKeyTypes;

type ToCustom<T extends any> = {
	[K in keyof T]: T[K] extends Player ? Player : T[K] extends PlayerType ? Player : T[K] extends EntityType ? Entity | Player : T[K] extends EntityDamageSourceType ? EntityDamageSource : T[K]
};

export type EventTypes = {
	[K in keyof EventKeyTypes]: ToCustom<EventKeyTypes[K]>
};
// type Equals<T, U> = (<G>() => G extends T ? 1 : 2) extends (<G>() => G extends U ? 1 : 2) ? true : false;
// type Identity<T> = { [P in keyof T]: T[P] };
// type EventPlayer = Identity<Replace<EventKeyTypes, PlayerType, Player>>;
// type EventEntity = Identity<Replace<EventPlayer, EntityType, Entity | Player>>;
// type EventEntity = Identity<Replace<EventPlayer, EntityType, Entity | Player>>;
// type test = EventObject['beforeChat']['sender'];

// type test1 = Equals<EventTypes['beforeChat']['sender'], Player>; // true
// type test2 = Equals<ReplacedEventKeyTypes['entitySpawn']['entity'], Entity | Player>; // true
// type test3 = Equals<ReplacedEventKeyTypes['entityDie']['damageSource'], EntityDamageSource>; // true
// type test4 = Equals<ReplacedEventKeyTypes['entityDie']['damageSource'], EntityDamageSourceType>; // false

export type EventObject = { [key in keyof EventKeyTypes]?: (arg: EventTypes[key]) => void };

export type EventRegisterObject = {
	[key: string]: {
		subscription: { [key in keyof EventKeyTypes]?: { function: (arg: EventTypes[key]) => void; options?: EntityEventOptions; forceNative?: boolean; entityOptionsKey?: string; } };
		unsubscription?: Function;
	};
};
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
const eventKeys: (keyof EventRegisterObject)[] = customKeys;
for (const key in world.afterEvents) {
	const prototype = Object.getPrototypeOf({});
	if (key in prototype) continue;
	eventKeys.push(key);
}
for (const key in system.afterEvents) {
	const prototype = Object.getPrototypeOf({});
	if (key in prototype) continue;
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

