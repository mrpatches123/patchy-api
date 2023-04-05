import { ItemStack, Player as PlayerType } from '@minecraft/server';
import { PlayAnimationOptions, EntityDamageSource, Vector3, PlayerInventoryComponentContainer, Entity, Block, Dimension, SoundOptions, Location, ScreenDisplay, XYRotation, ScoreboardIdentity, Vector, EffectType, BlockRaycastOptions, CommandResult, Effect, IEntityComponent, IRawMessage, EntityRaycastOptions } from '@minecraft/server';
import { EntityOnFireComponent, EntityAddRiderComponent, EntityAgeableComponent, EntityBreathableComponent, EntityCanClimbComponent, EntityCanFlyComponent, EntityCanPowerJumpComponent, EntityColorComponent, EntityFireImmuneComponent, EntityFloatsInLiquidComponent, EntityFlyingSpeedComponent, EntityFrictionModifierComponent, EntityGroundOffsetComponent, EntityHealableComponent, EntityHealthComponent, EntityInventoryComponent, EntityIsBabyComponent, EntityIsChargedComponent, EntityIsChestedComponent, EntityIsDyableComponent, EntityIsHiddenWhenInvisibleComponent, EntityIsIgnitedComponent, EntityIsIllagerCaptainComponent, EntityIsSaddledComponent, EntityIsShakingComponent, EntityIsShearedComponent, EntityIsStackableComponent, EntityIsStunnedComponent, EntityIsTamedComponent, EntityItemComponent, EntityLavaMovementComponent, EntityLeashableComponent, EntityMarkVariantComponent, EntityMountTamingComponent, EntityMovementAmphibiousComponent, EntityMovementBasicComponent, EntityMovementComponent, EntityMovementFlyComponent, EntityMovementGenericComponent, EntityMovementGlideComponent, EntityMovementHoverComponent, EntityMovementJumpComponent, EntityMovementSkipComponent, EntityMovementSwayComponent, EntityNavigationClimbComponent, EntityNavigationFloatComponent, EntityNavigationFlyComponent, EntityNavigationGenericComponent, EntityNavigationHoverComponent, EntityNavigationWalkComponent, EntityPushThroughComponent, EntityRideableComponent, EntityScaleComponent, EntitySkinIdComponent, EntityStrengthComponent, EntityTameableComponent, EntityUnderwaterMovementComponent, EntityVariantComponent, EntityWantsJockeyComponent } from '@minecraft/server';
import { Inventory } from "../players/export_instance.js";
interface PlayerEntity {
	Player: PlayerType;
	Entity: Entity;
}
function setProptotype(entity: Entity): Entity;
function setProptotype(entity: PlayerType): Player;
interface EntityComponents {
	'minecraft:onfire': EntityOnFireComponent;
	'onfire': EntityOnFireComponent;
	'minecraft:addrider': EntityAddRiderComponent;
	'addrider': EntityAddRiderComponent;
	'minecraft:ageable': EntityAgeableComponent;
	'ageable': EntityAgeableComponent;
	'minecraft:breathable': EntityBreathableComponent;
	'breathable': EntityBreathableComponent;
	'minecraft:can_climb': EntityCanClimbComponent;
	'can_climb': EntityCanClimbComponent;
	'minecraft:can_fly': EntityCanFlyComponent;
	'can_fly': EntityCanFlyComponent;
	'minecraft:can_power_jump': EntityCanPowerJumpComponent;
	'can_power_jump': EntityCanPowerJumpComponent;
	'minecraft:color': EntityColorComponent;
	'color': EntityColorComponent;
	'minecraft:fire_immune': EntityFireImmuneComponent;
	'fire_immune': EntityFireImmuneComponent;
	'minecraft:floats_in_liquid': EntityFloatsInLiquidComponent;
	'floats_in_liquid': EntityFloatsInLiquidComponent;
	'minecraft:flying_speed': EntityFlyingSpeedComponent;
	'flying_speed': EntityFlyingSpeedComponent;
	'minecraft:friction_modifier': EntityFrictionModifierComponent;
	'friction_modifier': EntityFrictionModifierComponent;
	'minecraft:ground_offset': EntityGroundOffsetComponent;
	'ground_offset': EntityGroundOffsetComponent;
	'minecraft:healable': EntityHealableComponent;
	'healable': EntityHealableComponent;
	'minecraft:health': EntityHealthComponent;
	'health': EntityHealthComponent;
	'minecraft:inventory': EntityInventoryComponent;
	'inventory': EntityInventoryComponent;
	'minecraft:is_baby': EntityIsBabyComponent;
	'is_baby': EntityIsBabyComponent;
	'minecraft:is_charged': EntityIsChargedComponent;
	'is_charged': EntityIsChargedComponent;
	'minecraft:is_chested': EntityIsChestedComponent;
	'is_chested': EntityIsChestedComponent;
	'minecraft:is_dyeable': EntityIsDyableComponent;
	'is_dyeable': EntityIsDyableComponent;
	'minecraft:is_hidden_when_invisible': EntityIsHiddenWhenInvisibleComponent;
	'is_hidden_when_invisible': EntityIsHiddenWhenInvisibleComponent;
	'minecraft:is_ignited': EntityIsIgnitedComponent;
	'is_ignited': EntityIsIgnitedComponent;
	'minecraft:is_illager_captain': EntityIsIllagerCaptainComponent;
	'is_illager_captain': EntityIsIllagerCaptainComponent;
	'minecraft:is_saddled': EntityIsSaddledComponent;
	'is_saddled': EntityIsSaddledComponent;
	'minecraft:is_shaking': EntityIsShakingComponent;
	'is_shaking': EntityIsShakingComponent;
	'minecraft:is_sheared': EntityIsShearedComponent;
	'is_sheared': EntityIsShearedComponent;
	'minecraft:is_stackable': EntityIsStackableComponent;
	'is_stackable': EntityIsStackableComponent;
	'minecraft:is_stunned': EntityIsStunnedComponent;
	'is_stunned': EntityIsStunnedComponent;
	'minecraft:is_tamed': EntityIsTamedComponent;
	'is_tamed': EntityIsTamedComponent;
	'minecraft:item': EntityItemComponent;
	'item': EntityItemComponent;
	'minecraft:lava_movement': EntityLavaMovementComponent;
	'lava_movement': EntityLavaMovementComponent;
	'minecraft:leashable': EntityLeashableComponent;
	'leashable': EntityLeashableComponent;
	'minecraft:mark_variant': EntityMarkVariantComponent;
	'mark_variant': EntityMarkVariantComponent;
	'minecraft:tamemount': EntityMountTamingComponent;
	'tamemount': EntityMountTamingComponent;
	'minecraft:movement.amphibious': EntityMovementAmphibiousComponent;
	'movement.amphibious': EntityMovementAmphibiousComponent;
	'minecraft:movement.basic': EntityMovementBasicComponent;
	'movement.basic': EntityMovementBasicComponent;
	'minecraft:movement': EntityMovementComponent;
	'movement': EntityMovementComponent;
	'minecraft:movement.fly': EntityMovementFlyComponent;
	'movement.fly': EntityMovementFlyComponent;
	'minecraft:movement.generic': EntityMovementGenericComponent;
	'movement.generic': EntityMovementGenericComponent;
	'minecraft:movement.glide': EntityMovementGlideComponent;
	'movement.glide': EntityMovementGlideComponent;
	'minecraft:movement.hover': EntityMovementHoverComponent;
	'movement.hover': EntityMovementHoverComponent;
	'minecraft:movement.jump': EntityMovementJumpComponent;
	'movement.jump': EntityMovementJumpComponent;
	'minecraft:movement.skip': EntityMovementSkipComponent;
	'movement.skip': EntityMovementSkipComponent;
	'minecraft:movement.sway': EntityMovementSwayComponent;
	'movement.sway': EntityMovementSwayComponent;
	'minecraft:navigation.climb': EntityNavigationClimbComponent;
	'navigation.climb': EntityNavigationClimbComponent;
	'minecraft:navigation.float': EntityNavigationFloatComponent;
	'navigation.float': EntityNavigationFloatComponent;
	'minecraft:navigation.fly': EntityNavigationFlyComponent;
	'navigation.fly': EntityNavigationFlyComponent;
	'minecraft:navigation.generic': EntityNavigationGenericComponent;
	'navigation.generic': EntityNavigationGenericComponent;
	'minecraft:navigation.hover': EntityNavigationHoverComponent;
	'navigation.hover': EntityNavigationHoverComponent;
	'minecraft:navigation.walk': EntityNavigationWalkComponent;
	'navigation.walk': EntityNavigationWalkComponent;
	'minecraft:push_through': EntityPushThroughComponent;
	'push_through': EntityPushThroughComponent;
	'minecraft:rideable': EntityRideableComponent;
	'rideable': EntityRideableComponent;
	'minecraft:scale': EntityScaleComponent;
	'scale': EntityScaleComponent;
	'minecraft:skin_id': EntitySkinIdComponent;
	'skin_id': EntitySkinIdComponent;
	'minecraft:strength': EntityStrengthComponent;
	'strength': EntityStrengthComponent;
	'minecraft:tameable': EntityTameableComponent;
	'tameable': EntityTameableComponent;
	'minecraft:underwater_movement': EntityUnderwaterMovementComponent;
	'underwater_movement': EntityUnderwaterMovementComponent;
	'minecraft:variant': EntityVariantComponent;
	'variant': EntityVariantComponent;
	'minecraft:wants_jockey': EntityWantsJockeyComponent;
	'wants_jockey': EntityWantsJockeyComponent;
}
export declare class Player extends Entity {
	gamemode: number;
	constructor(player: PlayerType);
	/**
	 * if the player can have commands ran on them
	 * @throws This property can throw when used.
	 */
	readonly loaded: boolean;
	/**
	 * scores that are defined can be get and set within this property
	 * @throws This property can throw when used.
	 */
	readonly scores: { [objective: string]: number; };
	/**
	 * dynamic properties that are defined can be get and set within this property
	 * @throws This property can throw when used.
	 */
	readonly properties: { [identifier: string]: number | boolean | string; };
	/**
	 * a object that saves until worldload and is stored in Players
	 * @throws This property can throw when used.
	 */
	readonly memory: { [key: string]: any; };
	/**
	 * proxy with get and set on the main hand of the player even the item properties have a get and set
	 * @throws This property can throw when used.
	 */
	readonly container: PlayerInventoryComponentContainer;
	/**
	 * proxy with get and set on the main hand of the player even the item properties have a get and set
	 * @throws This property can throw when used.
	 */
	mainHand: ItemStack;
	/**
	 * returns and array of itemstacks with chaching so the inventory is only gotten once per tick
	 * @throws This property can throw when used.
	 */
	inventory: Inventory;
	/**
	 * Dimension that the entity is currently within.
	 * @throws This property can throw when used.
	 */
	readonly dimension: Dimension;
	/**
	 * Location of the center of the head component of the player.
	 * @throws This property can throw when used.
	 */
	readonly headLocation: Location;
	/**
	 * Unique identifier of the player. This identifier is intended
	 * to be consistent across loads of a world instance. No
	 * meaning should be inferred from the value and structure of
	 * this unique identifier - do not parse or interpret it.
	 * @throws This property can throw when used.
	 */
	readonly id: string;
	/**
	 * True if the player is currently using a sneaking movement.
	 */
	isSneaking: boolean;
	/**
	 * Current location of the player.
	 * @throws This property can throw when used.
	 */
	readonly location: { x: number, y: number, z: number; };
	/**
	 * Name of the player.
	 * @throws This property can throw when used.
	 */
	readonly name: string;
	/**
	 * Optional name tag of the player.
	 */
	nameTag: string;
	/**
	 * Contains methods for manipulating the on-screen display of a
	 * Player.
	 */
	readonly onScreenDisplay: ScreenDisplay;
	/**
	 * Main rotation of the entity.
	 * @throws This property can throw when used.
	 */
	readonly rotation: XYRotation;
	/**
	 * Returns a scoreboard identity that represents this entity.
	 * @throws This property can throw when used.
	 */
	readonly scoreboard: ScoreboardIdentity;
	readonly spawnDimension?: Dimension;
	/**
	 * Manages the selected slot in the player's hotbar.
	 */
	selectedSlot: number;
	/**
	 * Retrieves or sets an entity that is used as the target of
	 * AI-related behaviors, like attacking. For players, which
	 * don't use any AI semantics, this property does not do
	 * anything.
	 * @throws This property can throw when used.
	 */
	readonly target: Entity;
	readonly totalXpNeededForNextLevel: number;
	readonly xpEarnedAtCurrentLevel: number;
	/**
	 * Unique identifier of the type of the entity - for example,
	 * 'minecraft:player'.
	 * @throws This property can throw when used.
	 */
	readonly typeId: string;
	/**
	 * Current speed of the player across X, Y, and Z dimensions.
	 * @throws This property can throw when used.
	 */
	readonly velocity: Vector;
	/**
	 * Vector of the current view of the player.
	 * @throws This property can throw when used.
	 */
	readonly viewVector: Vector;
	/**
	 * Vector3 of the current view direction of the player.
	 * @throws This property can throw when used.
	 */
	readonly viewDirection: Vector3;
	/**
	 * @remarks
	 * Adds an effect, like poison, to the entity.
	 * @param effectType
	 * Type of effect to add to the entity.
	 * @param duration
	 * Amount of time, in ticks, for the effect to apply.
	 * @param amplifier
	 * Optional amplification of the effect to apply.
	 * @param showParticles
	 * @throws This function can throw errors.
	 */
	applyDamage(amount: number, source?: EntityDamageSource): boolean;
	addEffect(effectType: EffectType, duration: number, amplifier?: number, showParticles?: boolean): void;
	/**
	* @beta
	* @remarks
	* Adds/removes experience to/from the Player and returns the
	* current experience of the Player.
	* @param amount
	* Amount of experience to add. Note that this can be negative.
	* @returns
	* Returns the current experience of the Player.
	* @throws This function can throw errors.
	*/
	addExperience(amount: number): number;
	/**
	 * @beta
	 * @remarks
	 *  Adds/removes level to/from the Player and returns the
	 * current level of the Player.
	 * @param amount
	 * Amount to add to the player.
	 * @returns
	 * Returns the current level of the Player.
	 * @throws This function can throw errors.
	 */
	addLevels(amount: number): number;
	resetLevel(): void;
	/**
	 * @remarks
	 * Adds a specified tag to an entity.
	 * @param tag
	 * Content of the tag to add.
	 * @throws This function can throw errors.
	 */
	addTag(tag: string): boolean;
	applyImpulse(vector: Vector3): void;
	applyKnockback(directionX: number, directionZ: number, horizontalStrength: number, verticalStrength: number): void;
	clearSpawn(): void;
	clearVelocity(): void;
	/**
	 * @beta
	 * @remarks
	 * Extinguishes the fire if the player is on fire. Note that
	 * you can call getComponent('minecraft:onfire') and, if
	 * present, the player is on fire."
	 * @param useEffects
	 * Whether to show any visual effects connected to the
	 * extinguishing.
	 * @throws This function can throw errors.
	 */
	extinguishFire(useEffects?: boolean): boolean;

	/**
	 * @beta
	 * @remarks
	 * Sets a player on fire (if it is not in water or rain). Note
	 * that you can call getComponent('minecraft:onfire') and, if
	 * present, the player is on fire.
	 * @param seconds
	 * Length of time to set the player on fire.
	 * @param useEffects
	 * @throws This function can throw errors.
	 */

	getBlockFromViewDirection(options?: BlockRaycastOptions): Block;
	/**
	 * @remarks
	 * Gets a component (that represents additional capabilities)
	 * for an entity.
	 * @param componentId
	 * The identifier of the component (e.g., 'minecraft:rideable')
	 * to retrieve. If no namespace prefix is specified,
	 * 'minecraft:' is assumed. If the component is not present on
	 * the entity, undefined is returned.
	 */
	getComponent<componentKey extends keyof EntityComponents>(componentId: componentKey): EntityComponents[componentKey];
	/**
	 * @remarks
	 * Returns all components that are both present on this entity
	 * and supported by the API.
	 */
	getComponents(): IEntityComponent[];
	/**
	 * @remarks
	 * Returns a property value.
	 * @param identifier
	 * @returns
	 * Returns the value for the property, or undefined if the
	 * property has not been set.
	 * @throws This function can throw errors.
	 */
	getDynamicProperty(identifier: string): boolean | number | string;
	/**
	 * @remarks
	 * Returns the effect for the specified EffectType on the
	 * entity, or undefined if the effect is not present.
	 * @param effectType
	 * @returns
	 * Effect object for the specified effect, or undefined if the
	 * effect is not present.
	 * @throws This function can throw errors.
	 */
	getEffect(effectType: EffectType): Effect;
	/**
	 * @remarks
	 * Gets the first entity that intersects with the vector of the
	 * view of this entity.
	 * @param options
	 * Additional options for processing this raycast query.
	 * @throws This function can throw errors.
	 */
	getEntitiesFromViewDirection(options?: EntityRaycastOptions): Entity[];
	/**
	 * @remarks
	 * Gets the current item cooldown time for a particular
	 * cooldown category.
	 * @param itemCategory
	 * Specifies the cooldown category to retrieve the current
	 * cooldown for.
	 * @throws This function can throw errors.
	 */
	getItemCooldown(itemCategory: string): number;
	getRotation(): XYRotation;
	getSpawnPosition(): Vector3 | undefined;
	getTotalXp(): number;
	getVelocity(): Vector3;
	getViewDirection(): Vector3;
	/**
	 * @remarks
	 * Returns all tags associated with an entity.
	 * @throws This function can throw errors.
	 */
	getTags(): string[];
	/**
	 * @remarks
	 * Returns true if the specified component is present on this
	 * entity.
	 * @param componentId
	 * The identifier of the component (e.g., 'minecraft:rideable')
	 * to retrieve. If no namespace prefix is specified,
	 * 'minecraft:' is assumed.
	 */
	hasComponent(componentId: string): boolean;
	/**
	 * @remarks
	 * Tests whether an entity has a particular tag.
	 * @param tag
	 * Identifier of the tag to test for.
	 * @throws This function can throw errors.
	 */
	hasTag(tag: string): boolean;

	isOp(): boolean;
	/**
	 * @remarks
	 * Kills this entity. The entity will drop loot as normal.
	 * @throws This function can throw errors.
	 */
	kill(): void;
	/**
	 * @remarks
	 * Plays a sound that only this particular player can hear.
	 * @param soundID
	 * Identifier of the sound to play.
	 * @param soundOptions
	 * Additional optional options for the sound.
	 * @throws This function can throw errors.
	 */
	playSound(soundID: string, soundOptions?: SoundOptions): void;
	playAnimation(animationName: string, options?: PlayAnimationOptions): void;
	postClientMessage(id: string, value: string): void;
	/**
	 * @remarks
	 * Removes a specified property.
	 * @param identifier
	 * @throws This function can throw errors.
	 */
	removeDynamicProperty(identifier: string): boolean;
	/**
	 * @remarks
	 * Removes a specified tag from an entity.
	 * @param tag
	 * Content of the tag to remove.
	 * @throws This function can throw errors.
	 */
	removeTag(tag: string): boolean;
	/**
	 * @remarks
	 * Runs a particular command asynchronously from the context of
	 * this entity.  Note that there is a maximum queue of 128
	 * asynchronous commands that can be run in a given tick.
	 * @param commandString
	 * Command to run. Note that command strings should not start
	 * with slash.
	 * @returns
	 * For commands that return data, returns a JSON structure with
	 * command response values.
	 * @throws This function can throw errors.
	 */
	runCommandAsync(commandString: string): Promise<CommandResult>;
	/**
	 * @remarks
	 * Sets a specified property to a value.
	 * @param identifier
	 * @param value
	 * Data value of the property to set.
	 * @throws This function can throw errors.
	 */
	setDynamicProperty(identifier: string, value: boolean | number | string): void;
	/**
	 * @beta
	 * @remarks
	 * Will change the specified players permissions, and whether
	 * they are operator or not.
	 * @param isOp
	 * @throws This function can throw errors.
	 */
	setOnFire(seconds: number, useEffects?: boolean): boolean;
	/**
	 * @remarks
	 * Gets the first block that intersects with the vector of the
	 * view of this entity.
	 * @param options
	 * Additional options for processing this raycast query.
	 * @throws This function can throw errors.
	 */
	setOp(isOp: boolean): void;
	/**
	 * @remarks
	 * Sets the main rotation of the entity.
	 * @param degreesX
	 * @param degreesY
	 * @throws This function can throw errors.
	 */
	setRotation(degreesX: number, degreesY: number): void;
	setSpawn(spawnPosition: Vector3, spawnDimension: Dimension): void;

	/**
	 * @remarks
	 * Sets a velocity for the entity to move with.
	 * @param velocity
	 * X/Y/Z components of the velocity.
	 * @throws This function can throw errors.
	 */
	/**
	 * @remarks
	 * Sets the item cooldown time for a particular cooldown
	 * category.
	 * @param itemCategory
	 * Specifies the cooldown category to retrieve the current
	 * cooldown for.
	 * @param tickDuration
	 * Duration in ticks of the item cooldown.
	 * @throws This function can throw errors.
	 */
	startItemCooldown(itemCategory: string, tickDuration: number): void;
	/**
	 * @remarks
	 * Teleports the selected player to a new location
	 * @param location
	 * New location for the player.
	 * @param dimension
	 * Dimension to move the selected player to.
	 * @param xRotation
	 * X rotation of the player after teleportation.
	 * @param yRotation
	 * Y rotation of the player after teleportation.
	 * @param keepVelocity
	 * @throws This function can throw errors.
	 */
	teleport(
		location: { x: number, y: number, z: number; },
		dimension: Dimension,
		xRotation: number,
		yRotation: number,
		keepVelocity?: boolean,
	): void;
	/**
	 * @remarks
	 * Teleports the selected player to a new location, and will
	 * have the player facing a specified location.
	 * @param location
	 * New location for the player.
	 * @param dimension
	 * Dimension to move the selected player to.
	 * @param facingLocation
	 * Location that this player will be facing.
	 * @param keepVelocity
	 * @throws This function can throw errors.
	 */
	teleportFacing(location: { x: number, y: number, z: number; }, dimension: Dimension, facingLocation: { x: number, y: number, z: number; }, keepVelocity?: boolean): void;
	/**
	 * @remarks
	 * Sends a message that is displayed on the connected client
	 * for this player.
	 * @param message
	 * @throws This function can throw errors.
	 */
	sendMessage(message: IRawMessage | string): void;
	/**
	 * @remarks
	 * Sends a message that is displayed on the connected client
	 * for this player.
	 * @param message
	 * @throws This function can throw errors.
	 */
	tell(message: IRawMessage | string): void;
	/**
	 * @remarks
	 * Triggers an entity type event. For every entity, a number of
	 * events are defined in an entities' definition for key entity
	 * behaviors; for example, creepers have a
	 * minecraft:start_exploding type event.
	 * @param eventName
	 * Name of the entity type event to trigger. If a namespace is
	 * not specified, minecraft: is assumed.
	 * @throws This function can throw errors.
	 */
	triggerEvent(eventName: string): void;
}