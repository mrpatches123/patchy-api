import { BeforeChatEvent, BeforeDataDrivenEntityTriggerEvent, BeforeExplosionEvent, BeforeItemDefinitionEvent, BeforeItemUseEvent, BeforeItemUseOnEvent, BeforePistonActivateEvent, BlockBreakEvent, BlockExplodeEvent, BlockPlaceEvent, ButtonPushEvent, ChatEvent, DataDrivenEntityTriggerEvent, EffectAddEvent, EntityCreateEvent, EntityHitEvent, EntityHurtEvent, ExplosionEvent, ItemCompleteChargeEvent, ItemDefinitionEvent, ItemReleaseChargeEvent, ItemStartChargeEvent, ItemStartUseOnEvent, ItemStopChargeEvent, ItemStopUseOnEvent, ItemUseEvent, ItemUseOnEvent, LeverActionEvent, PistonActivateEvent, PlayerJoinEvent, PlayerLeaveEvent, ProjectileHitEvent, TickEvent, WeatherChangeEvent, WorldInitializeEvent } from '@minecraft/server';
/**
 * @typedef {Object} ObjectEventSubscribe
 * @property {(arg: BeforeChatEvent) => {}} beforeChat
 * @property {(arg: BeforeDataDrivenEntityTriggerEvent) => {}} beforeDataDrivenEntityTriggerEvent
 * @property {(arg: BeforeExplosionEvent) => {}} beforeExplosion
 * @property {(arg: BeforeItemDefinitionEvent) => {}} beforeItemDefinitionEvent
 * @property {(arg: BeforeItemUseEvent) => {}} beforeItemUse
 * @property {(arg: BeforeItemUseOnEvent) => {}} beforeItemUseOn
 * @property {(arg: BeforePistonActivateEvent) => {}} beforePistonActivate
 * @property {(arg: BlockBreakEvent) => {}} blockBreak
 * @property {(arg: BlockExplodeEvent) => {}} blockExplode
 * @property {(arg: BlockPlaceEvent) => {}} blockPlace
 * @property {(arg: ButtonPushEvent) => {}} buttonPush
 * @property {(arg: ChatEvent) => {}} chat
 * @property {(arg: DataDrivenEntityTriggerEvent) => {}} dataDrivenEntityTriggerEvent
 * @property {(arg: EffectAddEvent) => {}} effectAdd
 * @property {(arg: EntityCreateEvent) => {}} entityCreate
 * @property {(arg: EntityHitEvent) => {}} entityHit
 * @property {(arg: EntityHurtEvent) => {}} entityHurt
 * @property {(arg: ExplosionEvent) => {}} explosion
 * @property {(arg: ItemCompleteChargeEvent) => {}} itemCompleteCharge
 * @property {(arg: ItemDefinitionEvent) => {}} itemDefinitionEvent
 * @property {(arg: ItemReleaseChargeEvent) => {}} itemReleaseCharge
 * @property {(arg: ItemStartChargeEvent) => {}} itemStartCharge
 * @property {(arg: ItemStartUseOnEvent) => {}} itemStartUseOn
 * @property {(arg: ItemStopChargeEvent) => {}} itemStopCharge
 * @property {(arg: ItemStopUseOnEvent) => {}} itemStopUseOn
 * @property {(arg: ItemUseEvent) => {}} itemUse
 * @property {(arg: ItemUseOnEvent) => {}} itemUseOn
 * @property {(arg: LeverActionEvent) => {}} leverActivate
 * @property {(arg: PistonActivateEvent) => {}} pistonActivate
 * @property {(arg: PlayerJoinEvent) => {}} playerJoin
 * @property {(arg: PlayerLeaveEvent) => {}} playerLeave
 * @property {(arg: ProjectileHitEvent) => {}} projectileHit
 * @property {(arg: TickEvent) => {}} tick
 * @property {(arg: WeatherChangeEvent) => {}} weatherChange
 * @property {(arg: WorldInitializeEvent) => {}} worldInitialize
 * @property {(arg: TickEvent) => {}} tickAfterLoad
 * @property {(arg: PlayerJoinEvent) => {}} playerJoined
 * @property {(arg: EntityHitEvent) => {}} playerHit
 * @property {(arg: EntityHurtEvent) => {}} playerHurt
 * @property {() => {}} worldLoad
*/