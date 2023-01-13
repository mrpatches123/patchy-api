import { Player } from "../player/class.js";
import { Entity, DefinitionModifier, Dimension, BlockLocation, ItemStack, Direction, Block, BlockPistonComponent, BlockPermutation, Effect, EntityDamageCause, Vector, Location, PropertyRegistry, world, EntityQueryOptions, EntityEventOptions } from '@minecraft/server';
import { CustomEvent } from '../custom_event/class.js';

export class BeforeChatEvent {
	cancel: boolean;
	message: string;
	sender: Player;
	sendToTargets: boolean;
	targets: Player[];
}
export class BeforeDataDrivenEntityTriggerEvent {
	cancel: boolean;
	readonly entity: Entity;
	readonly id: string;
	modifiers: DefinitionModifier[];
}
export class BeforeExplosionEvent {
	cancel: boolean;
	readonly dimension: Dimension;
	impactedBlocks: BlockLocation[];
	readonly source: Entity;
}
export class BeforeItemDefinitionTriggeredEvent {
	cancel: boolean;
	readonly eventName: string;
	item: ItemStack;
	readonly source: Entity;
}
export class BeforeItemUseEvent {
	cancel: boolean;
	item: ItemStack;
	readonly source: Entity;
}
export class BeforeItemUseOnEvent {
	readonly blockFace: Direction;
	readonly blockLocation: BlockLocation;
	cancel: boolean;
	readonly faceLocationX: number;
	readonly faceLocationY: number;
	item: ItemStack;
	readonly source: Entity;
}
export class BeforePistonActivateEvent {
	readonly block: Block;
	cancel: boolean;
	readonly dimension: Dimension;
	readonly isExpanding: boolean;
	readonly piston: BlockPistonComponent;
}
export class BlockBreakEvent {
	readonly block: Block;
	readonly brokenBlockPermutation: BlockPermutation;
	readonly dimension: Dimension;
	readonly player: Player;
}
export class BlockExplodeEvent {
	readonly block: Block;
	readonly dimension: Dimension;
	readonly source: Entity;
}
export class BlockPlaceEvent {
	readonly block: Block;
	readonly dimension: Dimension;
	readonly player: Player;
}
export class ButtonPushEvent {
	readonly block: Block;
	readonly dimension: Dimension;
	readonly source: Entity;
}
export class ChatEvent {
	cancel: boolean;
	message: string;
	sender: Player;
	sendToTargets: boolean;
	targets: Player[];
}
export class DataDrivenEntityTriggerEvent {
	cancel: boolean;
	readonly entity: Entity;
	readonly id: string;
	modifiers: DefinitionModifier[];
}
export class EffectAddEvent {
	effect: Effect;
	effectState: number;
	entity: Entity;
}
export class EntityCreateEvent {
	entity: Entity;
}
export class EntityHitEvent {
	readonly entity: Entity;
	readonly hitEntity: Entity | Player;
	readonly hitBlock: Block;
}
export class EntityHurtEvent {
	readonly cause: EntityDamageCause;
	readonly damage: number;
	readonly damagingEntity: Entity;
	readonly hurtEntity: Entity;
	readonly projectile: Entity;
}
export class ExplosionEvent {
	cancel: boolean;
	readonly dimension: Dimension;
	impactedBlocks: BlockLocation[];
	readonly source: Entity;
}
export class ItemCompleteChargeEvent {
	readonly itemStack: ItemStack;
	readonly source: Entity;
	readonly useDuration: number;
}
export class ItemDefinitionTriggeredEvent {
	cancel: boolean;
	readonly eventName: string;
	item: ItemStack;
	readonly source: Entity;
}
export class ItemReleaseChargeEvent {
	readonly itemStack: ItemStack;
	readonly source: Entity;
	readonly useDuration: number;
}
export class ItemStartChargeEvent {
	readonly itemStack: ItemStack;
	readonly source: Entity;
	readonly useDuration: number;
}
export class ItemStartUseOnEvent {
	readonly blockFace: Direction;
	readonly blockLocation: BlockLocation;
	readonly buildBlockLocation: BlockLocation;
	item: ItemStack;
	readonly source: Entity;
}
export class ItemStopChargeEvent {
	readonly itemStack: ItemStack;
	readonly source: Entity;
	readonly useDuration: number;
}
export class ItemStopUseOnEvent {
	readonly blockLocation: BlockLocation;
	item: ItemStack;
	readonly source: Entity;
}
export class ItemUseEvent {
	cancel: boolean;
	item: ItemStack;
	readonly source: Entity;
}
export class ItemUseOnEvent {
	readonly blockFace: Direction;
	readonly blockLocation: BlockLocation;
	cancel: boolean;
	readonly faceLocationX: number;
	readonly faceLocationY: number;
	item: ItemStack;
	readonly source: Entity;
}
export class LeverActionEvent {
	readonly block: Block;
	readonly dimension: Dimension;
	readonly isPowered: boolean;
	readonly player: Player;
}
export class PistonActivateEvent {
	readonly block: Block;
	cancel: boolean;
	readonly dimension: Dimension;
	readonly isExpanding: boolean;
	readonly piston: BlockPistonComponent;
}
export class PlayerJoinEvent {
	player: Player;
}
export class PlayerLeaveEvent {
	readonly playerName: string;
}
export class ProjectileHitEvent {
	readonly dimension: Dimension;
	readonly hitVector: Vector;
	readonly location: Location;
	readonly projectile: Entity;
	readonly source: Entity;
}
export class TickEvent {
	readonly currentTick: number;
	readonly deltaTime: number;
}
export class WeatherChangeEvent {
	readonly dimension: string;
	readonly lightning: boolean;
	readonly raining: boolean;
}
export class WorldInitializeEvent {
	readonly propertyRegistry: PropertyRegistry;
}
export class PlayerHurtEvent {
	readonly cause: EntityDamageCause;
	readonly damage: number;
	readonly damagingEntity: Entity | Player;
	readonly player: Player;
	readonly projectile: Entity;
}
export class PlayerDeathEvent {
	readonly killer: Entity | Player;
	readonly player: Player;
	readonly damage: Number;
	readonly cause: EntityDamageCause;
	readonly projectile: Entity;
}
export class PlayerHitEvent {
	readonly player: Player;
	readonly hitEntity: Entity | Player;
	readonly hitBlock: Block;
}
export class RequestAddedEvent {
	readonly id: string;
	readonly key: string;
	readonly target: string;
	readonly type: string;
	readonly value: any;
}
export class StepOnBlockEvent {
	readonly block: Block;
	readonly player: Player;
}
export class PlayerSpawnedEvent {
	readonly player: Player;
}
export class PlayerLeft {
	playerId: string;
	playerName: string;
}
export interface EventKeyTypes {
	beforeChat: BeforeChatEvent;
	beforeDataDrivenEntityTriggerEvent: BeforeDataDrivenEntityTriggerEvent;
	beforeExplosion: BeforeExplosionEvent;
	beforeItemDefinitionEvent: BeforeItemDefinitionTriggeredEvent;
	beforeItemUse: BeforeItemUseEvent;
	beforeItemUseOn: BeforeItemUseOnEvent;
	beforePistonActivate: BeforePistonActivateEvent;
	blockBreak: BlockBreakEvent;
	blockExplode: BlockExplodeEvent;
	blockPlace: BlockPlaceEvent;
	buttonPush: ButtonPushEvent;
	chat: ChatEvent;
	dataDrivenEntityTriggerEvent: DataDrivenEntityTriggerEvent;
	effectAdd: EffectAddEvent;
	entityCreate: EntityCreateEvent;
	entityHit: EntityHitEvent;
	entityHurt: EntityHurtEvent;
	explosion: ExplosionEvent;
	itemCompleteCharge: ItemCompleteChargeEvent;
	itemDefinitionEvent: ItemDefinitionTriggeredEvent;
	itemReleaseCharge: ItemReleaseChargeEvent;
	itemStartCharge: ItemStartChargeEvent;
	itemStartUseOn: ItemStartUseOnEvent;
	itemStopCharge: ItemStopChargeEvent;
	itemStopUseOn: ItemStopUseOnEvent;
	itemUse: ItemUseEvent;
	itemUseOn: ItemUseOnEvent;
	leverActivate: LeverActionEvent;
	pistonActivate: PistonActivateEvent;
	playerJoin: PlayerJoinEvent;
	playerLeave: PlayerLeaveEvent;
	projectileHit: ProjectileHitEvent;
	tick: TickEvent;
	weatherChange: WeatherChangeEvent;
	worldInitialize: WorldInitializeEvent;
	tickAfterLoad: TickEvent;
	playerJoined: PlayerJoinEvent;
	playerHit: PlayerHitEvent;
	playerHurt: PlayerHurtEvent;
	playerDeath: PlayerDeathEvent;
	requestAdded: RequestAddedEvent;
	stepOnBlock: StepOnBlockEvent;
	playerSpawned: PlayerSpawnedEvent;
	worldLoad: undefined;
};

type EventObject = { [key in keyof EventKeyTypes]: (arg: EventKeyTypes[key]) => {}; };
type EventRegisterObject = { [key: string]: { subscription: { [key in keyof EventKeyTypes]: { function: (arg: EventKeyTypes[key]) => {}, options?: EntityEventOptions; } }; }; };

export class EventBuilder {

	constructor();
	/** 
	 * subscribes event functions to a certian key;
	 */
	subscribe(key: string, eventObject: EventObject): void;
	/**
	 * like old system.run
	 */
	queueNextTick(callback: () => {}, ticksToSkip = 0): void;
	/**
	 * used to register custom event typings
	 */
	/**
	 * used to register custom events
	 */
	register(eventRegisterObject: EventRegisterObject): void;;
	/**
	 * unsubscribes event functions(s) from certian key
	 */
	unsubscribe(key: string, events?: string | string[]): void;
	/**
	 * turns off an event functions(s) without deleting it.
	 */
	suppress(key: string, events?: string | string[]): void;
	/**
	 * turns on an event functions(s) without deleting it.
	 */
	unsuppress(key: string, events?: string | string[]): void;
	/**
	 * Used to get a custom event and loop over keys subcribed to it
	 */
	getEvent<eventKey extends string>(eventKey: eventKey): CustomEvent<eventKey>;
}

