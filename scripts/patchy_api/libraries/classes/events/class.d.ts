import { Player } from "../player/class.js";
import { Entity, MessageSourceType, BlockHitInformation, DefinitionModifier, Dimension, ItemStack, Direction, Block, BlockPistonComponent, BlockPermutation, Effect, EntityDamageCause, Vector, PropertyRegistry, world, EntityQueryOptions, EntityEventOptions, EntityHitInformation, Vector3, Vector2, ScriptEventSource } from '@minecraft/server';
import { CustomEvent } from '../custom_event/class.js';
export class ScriptEventCommandMessageEvent {
	readonly id: string;
	readonly initiator: Entity | Player;
	readonly message: string;
	readonly sourceBlock: Block;
	readonly sourceEntity: Entity | Player;
	readonly sourceType: ScriptEventSource;
}
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
export class BeforeChatEvent {
	cancel: boolean;
	message: string;
	sender: Player;
	sendToTargets: boolean;
	getTargets(): Player[];
	setTargets(players: Player[]): void;
}
export class BeforeChatSendEvent {
	cancel: boolean;
	message: string;
	sender: Player;
	sendToTargets: boolean;
	getTargets(): Player[];
	setTargets(players: Player[]): void;
}
export class BeforeDataDrivenEntityTriggerEvent {
	cancel: boolean;
	readonly entity: Entity;
	readonly id: string;
	getModifiers(): DefinitionModifier[];
	setModifiers(modifiers: DefinitionModifier[]): void;
}
export class EntityDieEvent {
	readonly damageSource: EntityDamageSource;
	readonly deadEntity: Entity;
}
export class BeforeDataDrivenPlayerTriggerEvent {
	cancel: boolean;
	readonly player: Player;
	readonly id: string;
	getModifiers(): DefinitionModifier[];
	setModifiers(modifiers: DefinitionModifier[]): void;
}
export class BeforeExplosionEvent {
	cancel: boolean;
	readonly dimension: Dimension;
	getImpactedBlocks(): Vector3[];
	setImpactedBlocks(blocks: Vector3[]): void;
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
	itemStack: ItemStack;
	readonly source: Entity;
}
export class BeforeItemUseOnEvent {
	readonly blockFace: Direction;
	block: Block;
	cancel: boolean;
	readonly faceLocation: Vector3;
	itemStack: ItemStack;
	readonly source: Entity;
}
export class BeforePistonActivateEvent {
	readonly block: Block;
	cancel: boolean;
	readonly dimension: Dimension;
	readonly isExpanding: boolean;
	readonly piston: BlockPistonComponent;
}
export class beforePlayerScaffoldPlace {
	cancel: boolean;
	player: Player;
	blockLocation: Vector3;
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
	message: string;
	sender: Player;
	sendToTargets: boolean;
	getTargets(): Player[];
}
export class ChatSendEvent {
	message: string;
	sender: Player;
	sendToTargets: boolean;
	getTargets(): Player[];
}
export class DataDrivenEntityTriggerEvent {
	readonly entity: Entity;
	readonly id: string;
	getModifiers(): DefinitionModifier[];
}
export class DataDrivenPlayerTriggerEvent {
	readonly player: Player;
	readonly id: string;
	getModifiers(): DefinitionModifier[];
}
export class EffectAddEvent {
	effect: Effect;
	effectState: number;
	entity: Entity;
}
export class EntitySpawnEvent {
	/**
	 * Entity that was spawned.
	 */
	entity: Entity;
}
export class EntityHitEntityEvent {
	/**
	 * @remarks
	 * Entity that made a hit/melee attack.
	 *
	 */
	readonly damagingEntity: Entity;
	/**
	 * @remarks
	 * Entity that was hit by the attack.
	 *
	 */
	readonly hitEntity: Entity;
}
export class EntityHitBlockEvent {
	readonly blockFace: Direction;
	/**
	 * @remarks
	 * Entity that made the attack.
	 *
	 */
	readonly damagingEntity: Entity;
	/**
	 * @remarks
	 * Block that was hit by the attack.
	 *
	 */
	readonly hitBlock: Block;
}
export class EntityHurtEvent {
	/**
	 * Describes the amount of damage caused.
	 */
	readonly damage: number;
	readonly damageSource: EntityDamageSource;
	/**
	 * Entity that was hurt.
	 */
	readonly hurtEntity: Entity;
}
export class ExplosionEvent {
	cancel: boolean;
	readonly dimension: Dimension;
	getImpactedBlocks(): Vector3[];
	readonly source: Entity;
}
export class ItemCompleteChargeEvent {
	readonly itemStack: ItemStack;
	readonly source: Entity;
	readonly useDuration: number;
}
export class ItemDefinitionTriggeredEvent {
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
	/**
	 * @remarks
	 * The block that the item is used on.
	 *
	 */
	readonly block: Block;
	/**
	 * @remarks
	 * The face of the block that an item is being used on.
	 *
	 */
	readonly blockFace: Direction;
	/**
	 * @remarks
	 * The impacted item stack that is starting to be used.
	 *
	 */
	readonly itemStack: ItemStack;
	/**
	 * @remarks
	 * Returns the source entity that triggered this item event.
	 *
	 */
	readonly source: Entity;
}
export class ItemStopChargeEvent {
	readonly itemStack: ItemStack;
	readonly source: Entity;
	readonly useDuration: number;
}
export class ItemStopUseOnEvent {
	getBlockLocation(): Vector3;
	item: ItemStack;
	readonly source: Entity;
}
export class ItemUseEvent {
	cancel: boolean;
	itemStack: ItemStack;
	readonly source: Entity;
}
export class ItemUseOnEvent {
	readonly blockFace: Direction;
	block: Block;
	readonly faceLocation: Vector3;
	itemStack: ItemStack;
	readonly source: Entity;
}
export class ItemPickupEvent {
	readonly item: ItemStack;
	readonly player: Player;
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
	/**
	 * Opaque string identifier of the player that joined the game.
	 */
	readonly playerId: string;
	/**
	 * Name of the player that has joined.
	 */
	readonly playerName: string;
}
export class PlayerJoinedEvent {
	/**
	 * the player that joined the game and can have command ran on them.
	 */
	readonly player: Player;
}
export class PlayerLeaveEvent {
	readonly playerName: string;
	readonly playerId: string;
}
export class ProjectileHitEvent {
	readonly dimension: Dimension;
	readonly hitVector: Vector;
	readonly location: Vector3;
	readonly projectile: Entity;
	readonly source: Entity;
	getBlockHit(): BlockHitInformation | undefined;
	getEntityHit(): EntityHitInformation | undefined;
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
	readonly damage: number;
	readonly damageSource: EntityDamageSource;
	readonly player: Player;
}

export class PlayerDeathEvent {
	readonly damageSource: EntityDeathSource;
	readonly player: Player;
	readonly cause: EntityDamageCause;
	readonly projectile: Entity;
}
export class EntityDeathEvent {
	readonly damageSource: EntityDeathSource;
	readonly entity: Entity | Player;
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
export class PlayerLeftEvent {
	playerId: string;
	playerName: string;
}
export class PlayerJoinAwaitMoveEvent {
	readonly player: Player;
}
export class PlayerSpawnEvent {
	/**
	 * If true, this is the initial spawn of a player after joining
	 * the game.
	 */
	initialSpawn: boolean;
	/**
	 * Object that represents the player that joined the game.
	 */
	player: Player;
}
export class ScoreboardChangeEvent {
	player: Player;
	objective: string;
	value: number;
}
export class PressurePlatePushEvent {
	/**
	 * @remarks
	 * Block impacted by this event.
	 *
	 */
	readonly block: Block;
	/**
	 * @remarks
	 * Dimension that contains the block that is the subject of
	 * this event.
	 *
	 */
	readonly dimension: Dimension;
	/**
	 * @remarks
	 * The redstone power of the pressure plate before it was
	 * pushed.
	 *
	 */
	readonly previousRedstonePower: number;
	/**
	 * @remarks
	 * The redstone power of the pressure plate at the time of the
	 * push.
	 *
	 */
	readonly redstonePower: number;
	/**
	 * @remarks
	 * Source that triggered the pressure plate push.
	 *
	 */
	readonly source: Entity;
}
class TargetBlockHitEvent {
	/**
	 * @remarks
	 * Block impacted by this event.
	 *
	 */
	readonly block: Block;
	/**
	 * @remarks
	 * Dimension that contains the block that is the subject of
	 * this event.
	 *
	 */
	readonly dimension: Dimension;
	/**
	 * @remarks
	 * The position where the source hit the block.
	 *
	 */
	readonly hitVector: Vector3;
	/**
	 * @remarks
	 * The redstone power before the block is hit.
	 *
	 */
	readonly previousRedstonePower: number;
	/**
	 * @remarks
	 * The redstone power at the time the block is hit.
	 *
	 */
	readonly redstonePower: number;
	/**
	 * @remarks
	 * Optional source that hit the target block.
	 *
	 */
	readonly source: Entity;
}
class TripWireTripEvent {
	/**
	 * @remarks
	 * Block impacted by this event.
	 *
	 */
	readonly block: Block;
	/**
	 * @remarks
	 * Dimension that contains the block that is the subject of
	 * this event.
	 *
	 */
	readonly dimension: Dimension;
	/**
	 * @remarks
	 * Whether or not the block has redstone power.
	 *
	 */
	readonly isPowered: boolean;
	/**
	 * @remarks
	 * The sources that triggered the trip wire to trip.
	 *
	 */
	readonly sources: Entity[];
}
class EntityHealthChangedEvent {
	/**
	* @remarks
	* Entity whose health changed.
	*
	*/
	readonly entity: Entity;
	/**
	 * @remarks
	 * New health value of the entity.
	 *
	 */
	readonly newValue: number;
	/**
	 * @remarks
	 * Old health value of the entity.
	 *
	 */
	readonly oldValue: number;
}
export interface EventKeyTypes {
	beforeChat: BeforeChatEvent;
	beforeChatSend: BeforeChatEvent;
	beforeDataDrivenEntityTriggerEvent: BeforeDataDrivenEntityTriggerEvent;
	beforeDataDrivenPlayerTriggerEvent: BeforeDataDrivenPlayerTriggerEvent;
	beforeExplosion: BeforeExplosionEvent;
	beforeItemDefinitionEvent: BeforeItemDefinitionTriggeredEvent;
	beforeItemUse: BeforeItemUseEvent;
	beforeItemUseOn: BeforeItemUseOnEvent;
	beforeItemUseOnStart: BeforeItemUseOnEvent;
	beforePistonActivate: BeforePistonActivateEvent;
	blockBreak: BlockBreakEvent;
	blockExplode: BlockExplodeEvent;
	blockPlace: BlockPlaceEvent;
	buttonPush: ButtonPushEvent;
	chat: ChatEvent;
	chatSend: ChatEvent;
	dataDrivenEntityTriggerEvent: DataDrivenEntityTriggerEvent;
	dataDrivenPlayerTriggerEvent: DataDrivenPlayerTriggerEvent;
	effectAdd: EffectAddEvent;
	entityDie: EntityDieEvent;
	entityDeath: EntityDeathEvent;
	entitySpawn: EntitySpawnEvent;
	entityHealthChanged: EntityHealthChangedEvent;
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
	itemPickup: ItemPickupEvent;
	leverAction: LeverActionEvent;
	pistonActivate: PistonActivateEvent;
	pressurePlatePush: PressurePlatePushEvent;
	targetBlockHit: TargetBlockHitEvent;
	tripWireTrip: TripWireTripEvent;
	playerJoin: PlayerJoinEvent;
	playerLeave: PlayerLeaveEvent;
	projectileHit: ProjectileHitEvent;
	tick: TickEvent;
	weatherChange: WeatherChangeEvent;
	worldInitialize: WorldInitializeEvent;
	tickAfterLoad: TickEvent;
	playerJoined: PlayerJoinedEvent;
	playerHit: PlayerHitEvent;
	playerHurt: PlayerHurtEvent;
	playerDeath: PlayerDeathEvent;
	requestAdded: RequestAddedEvent;
	stepOnBlock: StepOnBlockEvent;
	playerSpawn: PlayerSpawnEvent;
	playerSpawned: PlayerSpawnedEvent;
	playerJoinAwaitMove: PlayerJoinAwaitMoveEvent;
	scriptEventReceive: ScriptEventCommandMessageEvent;
	worldLoad: undefined;
	scoreboardChange: ScoreboardChangeEvent;
	beforePlayerScaffoldPlace: beforePlayerScaffoldPlace;
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

