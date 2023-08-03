import { EntityAddRiderComponent, EntityAgeableComponent, EntityBreathableComponent, EntityCanClimbComponent, EntityCanFlyComponent, EntityCanPowerJumpComponent, EntityColorComponent, EntityFireImmuneComponent, EntityFloatsInLiquidComponent, EntityFlyingSpeedComponent, EntityFrictionModifierComponent, EntityGroundOffsetComponent, EntityHealableComponent, EntityHealthComponent, EntityInventoryComponent, EntityIsBabyComponent, EntityIsChargedComponent, EntityIsChestedComponent, EntityIsDyableComponent, EntityIsHiddenWhenInvisibleComponent, EntityIsIgnitedComponent, EntityIsIllagerCaptainComponent, EntityIsSaddledComponent, EntityIsShakingComponent, EntityIsShearedComponent, EntityIsStackableComponent, EntityIsStunnedComponent, EntityIsTamedComponent, EntityItemComponent, EntityLavaMovementComponent, EntityLeashableComponent, EntityMarkVariantComponent, EntityMountTamingComponent, EntityMovementAmphibiousComponent, EntityMovementBasicComponent, EntityMovementComponent, EntityMovementFlyComponent, EntityMovementGenericComponent, EntityMovementGlideComponent, EntityMovementHoverComponent, EntityMovementJumpComponent, EntityMovementSkipComponent, EntityMovementSwayComponent, EntityNavigationClimbComponent, EntityNavigationFloatComponent, EntityNavigationFlyComponent, EntityNavigationGenericComponent, EntityNavigationHoverComponent, EntityNavigationWalkComponent, EntityPushThroughComponent, EntityRideableComponent, EntityScaleComponent, EntitySkinIdComponent, EntityStrengthComponent, EntityTameableComponent, EntityUnderwaterMovementComponent, EntityVariantComponent, EntityWantsJockeyComponent } from '@minecraft/server';
interface EntityComponents {
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
/**
 * @typedef {Object} EntityComponents 
	 * @property {EntityAddRiderComponent} 'minecraft:addrider'
 * @property {EntityAddRiderComponent} 'addrider'
 * @property {EntityAgeableComponent} 'minecraft:ageable'
 * @property {EntityAgeableComponent} 'ageable'
 * @property {EntityBreathableComponent} 'minecraft:breathable'
 * @property {EntityBreathableComponent} 'breathable'
 * @property {EntityCanClimbComponent} 'minecraft:can_climb'
 * @property {EntityCanClimbComponent} 'can_climb'
 * @property {EntityCanFlyComponent} 'minecraft:can_fly'
 * @property {EntityCanFlyComponent} 'can_fly'
 * @property {EntityCanPowerJumpComponent} 'minecraft:can_power_jump'
 * @property {EntityCanPowerJumpComponent} 'can_power_jump'
 * @property {EntityColorComponent} 'minecraft:color'
 * @property {EntityColorComponent} 'color'
 * @property {EntityFireImmuneComponent} 'minecraft:fire_immune'
 * @property {EntityFireImmuneComponent} 'fire_immune'
 * @property {EntityFloatsInLiquidComponent} 'minecraft:floats_in_liquid'
 * @property {EntityFloatsInLiquidComponent} 'floats_in_liquid'
 * @property {EntityFlyingSpeedComponent} 'minecraft:flying_speed'
 * @property {EntityFlyingSpeedComponent} 'flying_speed'
 * @property {EntityFrictionModifierComponent} 'minecraft:friction_modifier'
 * @property {EntityFrictionModifierComponent} 'friction_modifier'
 * @property {EntityGroundOffsetComponent} 'minecraft:ground_offset'
 * @property {EntityGroundOffsetComponent} 'ground_offset'
 * @property {EntityHealableComponent} 'minecraft:healable'
 * @property {EntityHealableComponent} 'healable'
 * @property {EntityHealthComponent} 'minecraft:health'
 * @property {EntityHealthComponent} 'health'
 * @property {EntityInventoryComponent} 'minecraft:inventory'
 * @property {EntityInventoryComponent} 'inventory'
 * @property {EntityIsBabyComponent} 'minecraft:is_baby'
 * @property {EntityIsBabyComponent} 'is_baby'
 * @property {EntityIsChargedComponent} 'minecraft:is_charged'
 * @property {EntityIsChargedComponent} 'is_charged'
 * @property {EntityIsChestedComponent} 'minecraft:is_chested'
 * @property {EntityIsChestedComponent} 'is_chested'
 * @property {EntityIsDyableComponent} 'minecraft:is_dyeable'
 * @property {EntityIsDyableComponent} 'is_dyeable'
 * @property {EntityIsHiddenWhenInvisibleComponent} 'minecraft:is_hidden_when_invisible'
 * @property {EntityIsHiddenWhenInvisibleComponent} 'is_hidden_when_invisible'
 * @property {EntityIsIgnitedComponent} 'minecraft:is_ignited'
 * @property {EntityIsIgnitedComponent} 'is_ignited'
 * @property {EntityIsIllagerCaptainComponent} 'minecraft:is_illager_captain'
 * @property {EntityIsIllagerCaptainComponent} 'is_illager_captain'
 * @property {EntityIsSaddledComponent} 'minecraft:is_saddled'
 * @property {EntityIsSaddledComponent} 'is_saddled'
 * @property {EntityIsShakingComponent} 'minecraft:is_shaking'
 * @property {EntityIsShakingComponent} 'is_shaking'
 * @property {EntityIsShearedComponent} 'minecraft:is_sheared'
 * @property {EntityIsShearedComponent} 'is_sheared'
 * @property {EntityIsStackableComponent} 'minecraft:is_stackable'
 * @property {EntityIsStackableComponent} 'is_stackable'
 * @property {EntityIsStunnedComponent} 'minecraft:is_stunned'
 * @property {EntityIsStunnedComponent} 'is_stunned'
 * @property {EntityIsTamedComponent} 'minecraft:is_tamed'
 * @property {EntityIsTamedComponent} 'is_tamed'
 * @property {EntityItemComponent} 'minecraft:item'
 * @property {EntityItemComponent} 'item'
 * @property {EntityLavaMovementComponent} 'minecraft:lava_movement'
 * @property {EntityLavaMovementComponent} 'lava_movement'
 * @property {EntityLeashableComponent} 'minecraft:leashable'
 * @property {EntityLeashableComponent} 'leashable'
 * @property {EntityMarkVariantComponent} 'minecraft:mark_variant'
 * @property {EntityMarkVariantComponent} 'mark_variant'
 * @property {EntityMountTamingComponent} 'minecraft:tamemount'
 * @property {EntityMountTamingComponent} 'tamemount'
 * @property {EntityMovementAmphibiousComponent} 'minecraft:movement.amphibious'
 * @property {EntityMovementAmphibiousComponent} 'movement.amphibious'
 * @property {EntityMovementBasicComponent} 'minecraft:movement.basic'
 * @property {EntityMovementBasicComponent} 'movement.basic'
 * @property {EntityMovementComponent} 'minecraft:movement'
 * @property {EntityMovementComponent} 'movement'
 * @property {EntityMovementFlyComponent} 'minecraft:movement.fly'
 * @property {EntityMovementFlyComponent} 'movement.fly'
 * @property {EntityMovementGenericComponent} 'minecraft:movement.generic'
 * @property {EntityMovementGenericComponent} 'movement.generic'
 * @property {EntityMovementGlideComponent} 'minecraft:movement.glide'
 * @property {EntityMovementGlideComponent} 'movement.glide'
 * @property {EntityMovementHoverComponent} 'minecraft:movement.hover'
 * @property {EntityMovementHoverComponent} 'movement.hover'
 * @property {EntityMovementJumpComponent} 'minecraft:movement.jump'
 * @property {EntityMovementJumpComponent} 'movement.jump'
 * @property {EntityMovementSkipComponent} 'minecraft:movement.skip'
 * @property {EntityMovementSkipComponent} 'movement.skip'
 * @property {EntityMovementSwayComponent} 'minecraft:movement.sway'
 * @property {EntityMovementSwayComponent} 'movement.sway'
 * @property {EntityNavigationClimbComponent} 'minecraft:navigation.climb'
 * @property {EntityNavigationClimbComponent} 'navigation.climb'
 * @property {EntityNavigationFloatComponent} 'minecraft:navigation.float'
 * @property {EntityNavigationFloatComponent} 'navigation.float'
 * @property {EntityNavigationFlyComponent} 'minecraft:navigation.fly'
 * @property {EntityNavigationFlyComponent} 'navigation.fly'
 * @property {EntityNavigationGenericComponent} 'minecraft:navigation.generic'
 * @property {EntityNavigationGenericComponent} 'navigation.generic'
 * @property {EntityNavigationHoverComponent} 'minecraft:navigation.hover'
 * @property {EntityNavigationHoverComponent} 'navigation.hover'
 * @property {EntityNavigationWalkComponent} 'minecraft:navigation.walk'
 * @property {EntityNavigationWalkComponent} 'navigation.walk'
 * @property {EntityPushThroughComponent} 'minecraft:push_through'
 * @property {EntityPushThroughComponent} 'push_through'
 * @property {EntityRideableComponent} 'minecraft:rideable'
 * @property {EntityRideableComponent} 'rideable'
 * @property {EntityScaleComponent} 'minecraft:scale'
 * @property {EntityScaleComponent} 'scale'
 * @property {EntitySkinIdComponent} 'minecraft:skin_id'
 * @property {EntitySkinIdComponent} 'skin_id'
 * @property {EntityStrengthComponent} 'minecraft:strength'
 * @property {EntityStrengthComponent} 'strength'
 * @property {EntityTameableComponent} 'minecraft:tameable'
 * @property {EntityTameableComponent} 'tameable'
 * @property {EntityUnderwaterMovementComponent} 'minecraft:underwater_movement'
 * @property {EntityUnderwaterMovementComponent} 'underwater_movement'
 * @property {EntityVariantComponent} 'minecraft:variant'
 * @property {EntityVariantComponent} 'variant'
 * @property {EntityWantsJockeyComponent} 'minecraft:wants_jockey'
 * @property {EntityWantsJockeyComponent} 'wants_jockey'
*/
