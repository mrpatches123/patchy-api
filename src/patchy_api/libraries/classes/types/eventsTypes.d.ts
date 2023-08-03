import { Entity, DefinitionModifier, Dimension, BlockLocation, ItemStack, Direction, Block, BlockPistonComponent, BlockPermutation, Effect, EntityDamageCause, Vector, Location, PropertyRegistry } from '@minecraft/server';
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
