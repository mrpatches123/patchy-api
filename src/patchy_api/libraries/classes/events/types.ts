import { Player } from "../player/class.js";
import { Entity, Entity as EntityType, Player as PlayerType, BlockHitInformation, DefinitionModifier, Dimension, ItemStack, Direction, Block, BlockPistonComponent, BlockPermutation, Effect, EntityDamageCause, EntityDamageSource as EntityDamageSourceType, Vector, PropertyRegistry, world, EntityQueryOptions, EntityEventOptions, EntityHitInformation, Vector3, Vector2, ScriptEventSource, BlockBreakAfterEvent, BlockPlaceAfterEvent, ButtonPushAfterEvent, ChatSendAfterEvent, BlockExplodeAfterEvent, DataDrivenEntityTriggerBeforeEvent, ExplosionBeforeEvent, ItemDefinitionTriggeredBeforeEvent, ItemUseBeforeEvent, ItemUseOnBeforeEvent, PistonActivateAfterEvent, DataDrivenEntityTriggerAfterEvent, EffectAddAfterEvent, EntityDieAfterEvent, EntitySpawnAfterEvent, EntityHealthChangedAfterEvent, EntityHitBlockAfterEvent, EntityHitEntityAfterEvent, EntityHurtAfterEvent, ExplosionAfterEvent, ItemStopUseAfterEvent, ItemDefinitionTriggeredAfterEvent, ItemReleaseUseAfterEvent, ItemStartUseAfterEvent, ItemStartUseOnAfterEvent, ItemStopUseOnAfterEvent, ItemUseAfterEvent, ItemUseOnAfterEvent, LeverActionAfterEvent, PressurePlatePushAfterEvent, TargetBlockHitAfterEvent, TripWireTripAfterEvent, PlayerJoinAfterEvent, PlayerLeaveAfterEvent, ProjectileHitAfterEvent, WeatherChangeAfterEvent, WorldInitializeAfterEvent, PlayerSpawnAfterEvent, ScriptEventCommandMessageAfterEvent } from '@minecraft/server';
import { CustomEvent } from '../custom_event/class.js';


export interface EntityDamageSource {
	cause: EntityDamageCause;
	damagingEntity?: Entity | Player;
	damagingProjectile?: Entity;
}
export interface EntityDeathSource {
	cause: EntityDamageCause;
	killer?: Entity | Player;
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
export interface EventKeyTypes {
	beforeChat: ChatSendAfterEvent;
	beforeChatSend: ChatSendAfterEvent;
	beforeDataDrivenEntityTriggerEvent: DataDrivenEntityTriggerBeforeEvent;
	beforeDataDrivenPlayerTriggerEvent: BeforeDataDrivenPlayerTriggerEvent;
	beforeExplosion: ExplosionBeforeEvent;
	beforeItemDefinitionEvent: ItemDefinitionTriggeredBeforeEvent;
	beforeItemUse: ItemUseBeforeEvent;
	beforeItemUseOn: ItemUseOnBeforeEvent;
	beforeItemUseOnStart: ItemUseBeforeEvent;
	beforePistonActivate: PistonActivateAfterEvent;
	blockBreak: BlockBreakAfterEvent;
	blockExplode: BlockExplodeAfterEvent;
	blockPlace: BlockPlaceAfterEvent;
	buttonPush: ButtonPushAfterEvent;
	chat: ChatSendAfterEvent;
	chatSend: ChatSendAfterEvent;
	dataDrivenEntityTriggerEvent: DataDrivenEntityTriggerAfterEvent;
	dataDrivenPlayerTriggerEvent: DataDrivenPlayerTriggerEvent;
	effectAdd: EffectAddAfterEvent;
	entityDie: EntityDieAfterEvent;
	entitySpawn: EntitySpawnAfterEvent;
	entityHealthChanged: EntityHealthChangedAfterEvent;
	entityHitBlock: EntityHitBlockAfterEvent;
	entityHitEntity: EntityHitEntityAfterEvent;
	entityHurt: EntityHurtAfterEvent;
	explosion: ExplosionAfterEvent;
	itemStopUse: ItemStopUseAfterEvent;
	itemDefinitionEvent: ItemDefinitionTriggeredAfterEvent;
	itemReleaseCharge: ItemReleaseUseAfterEvent;
	itemStartCharge: ItemStartUseAfterEvent;
	itemStartUseOn: ItemStartUseOnAfterEvent;
	itemStopUseOn: ItemStopUseOnAfterEvent;
	itemUse: ItemUseAfterEvent;
	itemUseOn: ItemUseOnAfterEvent;
	itemPickup: ItemPickupEvent;
	leverAction: LeverActionAfterEvent;
	pistonActivate: PistonActivateAfterEvent;
	pressurePlatePush: PressurePlatePushAfterEvent;
	targetBlockHit: TargetBlockHitAfterEvent;
	tripWireTrip: TripWireTripAfterEvent;
	playerJoin: PlayerJoinAfterEvent;
	playerLeave: PlayerLeaveAfterEvent;
	projectileHit: ProjectileHitAfterEvent;
	tick: TickEvent;
	weatherChange: WeatherChangeAfterEvent;
	worldInitialize: WorldInitializeAfterEvent;
	tickAfterLoad: TickEvent;
	playerJoined: PlayerJoinedEvent;
	playerHit: PlayerHitEvent;
	playerHurt: PlayerHurtEvent;
	playerDeath: PlayerDeathEvent;
	requestAdded: RequestAddedEvent;
	stepOnBlock: StepOnBlockEvent;
	playerSpawn: PlayerSpawnAfterEvent;
	playerSpawned: PlayerJoinedEvent;
	playerJoinAwaitMove: PlayerJoinAwaitMoveEvent;
	scriptEventReceive: ScriptEventCommandMessageAfterEvent;
	worldLoad: undefined;
	scoreboardChange: ScoreboardChangeEvent;
	beforePlayerScaffoldPlace: BeforePlayerScaffoldPlaceEvent;
	custom: any;
};

export type ReplaceTypes<T> = T extends EntityType ? Entity | Player : T extends PlayerType ? Player : T extends EntityDamageSourceType ? EntityDamageSource : T;

export type EventObject = { [key in keyof EventKeyTypes]: (arg: ReplaceTypes<EventKeyTypes[key]>) => void };
export type EventRegisterObject = { [key: string]: { subscription: { [key in keyof EventKeyTypes]: { function: (arg: ReplaceTypes<EventKeyTypes[key]>) => void; options?: EntityEventOptions; forceNative?: boolean; } }; }; };

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

