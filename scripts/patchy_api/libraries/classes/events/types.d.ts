import { Player } from "../player/class.js";
import { Entity, Entity as EntityType, Player as PlayerType, DefinitionModifier, ItemStack, Block, EntityDamageCause, EntityDamageSource as EntityDamageSourceType, EntityEventOptions, Vector3, ChatSendAfterEvent, DataDrivenEntityTriggerBeforeEvent, ExplosionBeforeEvent, ItemDefinitionTriggeredBeforeEvent, ItemUseBeforeEvent, ItemUseOnBeforeEvent, WorldAfterEvents, ChatSendBeforeEvent, PlayerBreakBlockAfterEvent, PistonActivateBeforeEvent, PlayerInteractWithBlockBeforeEvent, PlayerInteractWithEntityBeforeEvent, PlayerBreakBlockBeforeEvent, PlayerPlaceBlockBeforeEvent, PlayerLeaveBeforeEvent, EntityRemoveBeforeEvent, EffectAddBeforeEvent, SystemAfterEvents, WatchdogTerminateBeforeEvent, World } from '@minecraft/server';
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
export interface NumberPropertyChangeEvent {
    source: World | Player | Entity;
    identifier: string;
    value: number | undefined;
    lastValue: number | undefined;
}
export interface BooleanPropertyChangeEvent {
    source: World | Player | Entity;
    identifier: string;
    value: boolean | undefined;
    lastValue: boolean | undefined;
}
export interface StringPropertyChangeEvent {
    source: World | Player | Entity;
    identifier: string;
    value: string | undefined;
    lastValue: string | undefined;
}
export interface Vector3PropertyChangeEvent {
    source: World | Player | Entity;
    identifier: string;
    value: Vector3 | undefined;
    lastValue: Vector3 | undefined;
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
    [K in keyof WorldAfterEvents]: Parameters<Parameters<WorldAfterEvents[K]["subscribe"]>[0]>[0];
}> & Mutable<{
    [K in keyof SystemAfterEvents]: Parameters<Parameters<SystemAfterEvents[K]["subscribe"]>[0]>[0];
}>;
export interface CustomEventKeyTypes {
    beforeChat: ChatSendBeforeEvent;
    beforeChatSend: ChatSendBeforeEvent;
    beforeDataDrivenEntityTriggerEvent: DataDrivenEntityTriggerBeforeEvent;
    beforeDataDrivenPlayerTriggerEvent: BeforeDataDrivenPlayerTriggerEvent;
    beforeExplosion: ExplosionBeforeEvent;
    beforeItemDefinitionEvent: ItemDefinitionTriggeredBeforeEvent;
    beforeItemUse: ItemUseBeforeEvent;
    beforeItemUseOn: ItemUseOnBeforeEvent;
    beforeItemUseOnStart: ItemUseOnBeforeEvent;
    beforePistonActivate: PistonActivateBeforeEvent;
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
    numberPropertyChange: NumberPropertyChangeEvent;
    booleanPropertyChange: BooleanPropertyChangeEvent;
    stringPropertyChange: StringPropertyChangeEvent;
    vector3PropertyChange: Vector3PropertyChangeEvent;
    beforePlayerScaffoldPlace: BeforePlayerScaffoldPlaceEvent;
    blockBreak: PlayerBreakBlockAfterEvent;
    custom: undefined;
}
type EventKeyTypes = AfterEventTypes & CustomEventKeyTypes;
type ToCustom<T extends any> = {
    [K in keyof T]: T[K] extends PlayerType ? Player : T[K] extends EntityType ? Entity | Player : T[K] extends EntityDamageSourceType ? EntityDamageSource : T[K];
};
export type EventTypes = {
    [K in keyof EventKeyTypes]: ToCustom<EventKeyTypes[K]>;
};
export type EventObject = {
    [key in keyof EventKeyTypes]?: (arg: EventTypes[key]) => void;
};
export type EventRegisterObject = {
    [key: string]: {
        subscription: {
            [key in keyof EventKeyTypes]?: {
                function: (arg: EventTypes[key]) => void;
                options?: EntityEventOptions;
                forceNative?: boolean;
                entityOptionsKey?: string;
            };
        };
        unsubscription?: Function;
    };
};
declare const eventKeys: (keyof EventRegisterObject)[];
export { eventKeys };
