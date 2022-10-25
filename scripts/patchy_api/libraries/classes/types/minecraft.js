export const Events = {
	/**
	 * This event fires before a chat message is broadcast or
	 * delivered. The event can be canceled, and the message can
	 * also be updated.
	 */
	'beforeChat': 'BeforeChatEvent',
	/**
	 * This event is fired before the triggering of an entity event
	 * that updates the component definition state of an entity.
	 * Within this event, you can cancel or shape the impacted
	 * components and event triggers.
	 */
	'beforeDataDrivenEntityTriggerEvent': 'BeforeDataDrivenEntityTriggerEvent',
	/**
	 * This event is fired before an explosion occurs.
	 */
	'beforeExplosion': 'BeforeExplosionEvent',
	/**
	 * For custom items, this event is triggered before the set of
	 * defined components for the item change in response to a
	 * triggered event. Note that this event is only fired for
	 * custom data-driven items.
	 */
	'beforeItemDefinitionEvent': 'BeforeItemDefinitionEvent',
	/**
	 * This event fires before an item is used by an entity or
	 * player.
	 */
	'beforeItemUse': 'BeforeItemUseEvent',
	/**
	 * This event fires before an item is used on a block by an
	 * entity or player.
	 */
	'beforeItemUseOn': 'BeforeItemUseOnEvent',
	/**
	 * Fires before a piston is activated.
	 */
	'beforePistonActivate': 'BeforePistonActivateEvent',
	/**
	 * This event fires for a block that is broken by a player.
	 */
	'blockBreak': 'BlockBreakEvent',
	/**
	 * This event fires for each BlockLocation destroyed by an
	 * explosion. It is fired after the blocks have already been
	 * destroyed.
	 */
	'blockExplode': 'BlockExplodeEvent',
	/**
	 * This event fires for a block that is placed by a player.
	 */
	'blockPlace': 'BlockPlaceEvent',
	/**
	 * This event fires when a button is pushed.
	 */
	'buttonPush': 'ButtonPushEvent',
	/**
	 * This event is triggered after a chat message has been
	 * broadcast or sent to players.
	 */
	'chat': 'ChatEvent',
	/**
	 * This event is fired when an entity event has been triggered
	 * that will update the component definition state of an
	 * entity.
	 */
	'dataDrivenEntityTriggerEvent': 'DataDrivenEntityTriggerEvent',
	/**
	 * This event fires when an effect, like poisoning, is added to
	 * an entity.
	 */
	'effectAdd': 'EffectAddEvent',
	/**
	 * This event fires when a new entity is created.
	 */
	'entityCreate': 'EntityCreateEvent',
	/**
	 * This event fires when an entity hits (makes a melee attack)
	 * and potentially impacts another entity or block.
	 */
	'entityHit': 'EntityHitEvent',
	/**
	 * This event fires when an entity is hurt (takes damage).
	 */
	'entityHurt': 'EntityHurtEvent',
	/**
	 * This event is fired after an explosion occurs.
	 */
	'explosion': 'ExplosionEvent',
	/**
	 * This event fires when a chargeable item completes charging.
	 */
	'itemCompleteCharge': 'ItemCompleteChargeEvent',
	/**
	 * For custom items, this event is triggered when the
	 * fundamental set of defined components for the item change.
	 * Note that this event is only fired for custom data-driven
	 * items.
	 */
	'itemDefinitionEvent': 'ItemDefinitionEvent',
	/**
	 * This event fires when a chargeable item is released from
	 * charging.
	 */
	'itemReleaseCharge': 'ItemReleaseChargeEvent',
	/**
	 * This event fires when a chargeable item starts charging.
	 */
	'itemStartCharge': 'ItemStartChargeEvent',
	/**
	 * This event fires when any particular item is starting to be
	 * used by an entity or player.
	 */
	'itemStartUseOn': 'ItemStartUseOnEvent',
	/**
	 * This event fires when a chargeable item stops charging.
	 */
	'itemStopCharge': 'ItemStopChargeEvent',
	/**
	 * This event fires when any particular item is ending being
	 * used by an entity or player.
	 */
	'itemStopUseOn': 'ItemStopUseOnEvent',
	/**
	 * This event fires when any particular item is used by an
	 * entity or player.
	 */
	'itemUse': 'ItemUseEvent',
	/**
	 * This event fires when any particular item is used on a block
	 * by an entity or player.
	 */
	'itemUseOn': 'ItemUseOnEvent',
	/**
	 * This event fires when a lever activates or is deactivated.
	 */
	'leverActivate': 'LeverActionEvent',
	/**
	 * This event fires when a piston expands or retracts.
	 */
	'pistonActivate': 'PistonActivateEvent',
	/**
	 * This event fires when a player joins a world.
	 */
	'playerJoin': 'PlayerJoinEvent',
	/**
	 * This event fires when a player leaves a world.
	 */
	'playerLeave': 'PlayerLeaveEvent',
	/**
	 * This event fires when a projectile hits an entity or block.
	 */
	'projectileHit': 'ProjectileHitEvent',
	/**
	 * This event fires every tick - which is 20 times per second.
	 */
	'tick': 'TickEvent',
	/**
	 * This event will be triggered when the weather changes within
	 * Minecraft.
	 */
	'weatherChange': 'WeatherChangeEvent',
	/**
	 * This event fires when the script environment is initialized
	 * on a World. In addition, you can register dynamic properties
	 * within the scope of a world Initialize event.
	 */
	'worldInitialize': 'WorldInitializeEvent',

};