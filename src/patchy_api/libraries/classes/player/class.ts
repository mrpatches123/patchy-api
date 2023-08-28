import loads from "../load.js";
import { Player as PlayerType, Container, system, Vector, EntityEquipmentInventoryComponent, EquipmentSlot, world, ItemStack, ContainerSlot, EntityType } from "@minecraft/server";
import players from "../players/export_instance.js";
import errorLogger from "../error.js";
import { content, native } from "../../utilities.js";
import scoreboardBuilder from "../scoreboard.js";
import gamemode, { gamemodeIndexMap, gamemodeMap } from "../gamemode.js";
import propertyBuilder from "../property/export_instance.js";
const player = world.getAllPlayers()[0];
const armorSlots = [
	EquipmentSlot.feet,
	EquipmentSlot.legs,
	EquipmentSlot.chest,
	EquipmentSlot.head
];
import { EntityOnFireComponent, EntityAddRiderComponent, EntityAgeableComponent, EntityBreathableComponent, EntityCanClimbComponent, EntityCanFlyComponent, EntityCanPowerJumpComponent, EntityColorComponent, EntityFireImmuneComponent, EntityFloatsInLiquidComponent, EntityFlyingSpeedComponent, EntityFrictionModifierComponent, EntityGroundOffsetComponent, EntityHealableComponent, EntityHealthComponent, EntityInventoryComponent, EntityIsBabyComponent, EntityIsChargedComponent, EntityIsChestedComponent, EntityIsDyeableComponent, EntityIsHiddenWhenInvisibleComponent, EntityIsIgnitedComponent, EntityIsIllagerCaptainComponent, EntityIsSaddledComponent, EntityIsShakingComponent, EntityIsShearedComponent, EntityIsStackableComponent, EntityIsStunnedComponent, EntityIsTamedComponent, EntityItemComponent, EntityLavaMovementComponent, EntityLeashableComponent, EntityMarkVariantComponent, EntityMountTamingComponent, EntityMovementAmphibiousComponent, EntityMovementBasicComponent, EntityMovementComponent, EntityMovementFlyComponent, EntityMovementGenericComponent, EntityMovementGlideComponent, EntityMovementHoverComponent, EntityMovementJumpComponent, EntityMovementSkipComponent, EntityMovementSwayComponent, EntityNavigationClimbComponent, EntityNavigationFloatComponent, EntityNavigationFlyComponent, EntityNavigationGenericComponent, EntityNavigationHoverComponent, EntityNavigationWalkComponent, EntityPushThroughComponent, EntityRideableComponent, EntityScaleComponent, EntitySkinIdComponent, EntityStrengthComponent, EntityTameableComponent, EntityUnderwaterMovementComponent, EntityVariantComponent, EntityWantsJockeyComponent } from '@minecraft/server';

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
	'minecraft:equipment_inventory': EntityEquipmentInventoryComponent;
	'equipment_inventory': EntityEquipmentInventoryComponent;
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
	'minecraft:is_dyeable': EntityIsDyeableComponent;
	'is_dyeable': EntityIsDyeableComponent;
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

export class Player implements PlayerType {
	root: PlayerType;
	constructor(player: PlayerType) {
		/**
		 * @type {PlayerType}
		 */
		this.root = player;
	}
	addExperience(...args: Parameters<PlayerType['addExperience']>) {
		return this.root.addExperience(...args);
	}
	get gamemode(): keyof typeof gamemodeIndexMap {
		return gamemode.get(this);
	}
	set gamemode(value: keyof typeof gamemodeIndexMap) {
		this.root.runCommandAsync(`gamemode ${gamemodeIndexMap[value]}`);
	}
	get loaded() {
		const { id } = this.root;
		return loads.loads.hasOwnProperty(id);
	}
	get offhand() {

		const { selectedSlot } = this.root;
		const equipmentInventory = this.getComponent('equipment_inventory');

		return equipmentInventory.getEquipmentSlot(EquipmentSlot.offhand);
	}
	get mainHand(): ContainerSlot {
		const { selectedSlot } = this.root;
		const container = this.getComponent('minecraft:inventory').container;
		return container.getSlot(selectedSlot);
	}

	set mainHand(value: ItemStack | ContainerSlot) {
		const { selectedSlot } = this.root;

		const container = this.getComponent('inventory').container;
		container.setItem(selectedSlot, (value instanceof ContainerSlot) ? value.getItem() : value);
	}
	get container() {
		return this.getComponent('inventory').container;
	}
	get inventory() {
		return players.getInventory(this);
	}
	get scores(): Record<string, number | undefined> {
		const player = this;
		return new Proxy({}, {
			get(target, objectiveId) {

				const value = scoreboardBuilder.get(player, objectiveId as string);
				// if (objectiveId === 'skycoins') content.warn({ t: 'get', objectiveId, value });
				return value;
			},
			set(target, objectiveId, value, receiver) {
				scoreboardBuilder.set(player, objectiveId as string, value);
				// content.warn({ t: 'set', objectiveId, value });
				return Reflect.set(target, objectiveId, value, receiver);
			}
		});
	}
	get properties() {
		return propertyBuilder.get(this.root);
	}
	get memory() {
		const player = this.root;
		const { id } = player;
		if (!players.memory.hasOwnProperty(id)) players.memory[id] = {};
		return new Proxy(players.memory[id], {
			get(target, identifier) {
				return players.memory?.[id]?.[identifier];
			},
			set(target, identifier, value, receiver) {
				players.memory[id][identifier] = value;
				return Reflect.set(target, identifier, value, receiver);

			},
			has(target, key) {
				return key in players.memory[id];
			}

		});
	}
	get dimension() {
		return this.root.dimension;
	}
	get headLocation() {
		return this.root.getHeadLocation();
	}
	get id() {
		return this.root.id;
	}
	get isSneaking() {
		return this.root.isSneaking;
	}
	get isGliding() {
		return this.root.isGliding;
	}
	get isJumping() {
		return this.root.isJumping;
	}
	get fallDistance() {
		return this.root.fallDistance;
	}
	get isClimbing() {
		return this.root.isClimbing;
	}
	get isFlying() {
		return this.root.isFlying;
	}
	get isInWater() {
		return this.root.isInWater;
	}
	get isOnGround() {
		return this.root.isOnGround;
	}
	get isSprinting() {
		return this.root.isSprinting;
	}
	get isFalling() {
		return this.root.isSprinting;
	}
	get isSwimming() {
		return this.root.isSwimming;
	}
	get lifetimeState() {
		return this.root.lifetimeState;
	}
	isValid() {
		return this.root.isValid();
	}
	get level() {
		return this.root.level;
	}
	get location() {
		return this.root.location;
	}
	get name() {
		return this.root.name;
	}
	get nameTag() {
		return this.root.nameTag;
	}
	set nameTag(value) {
		this.root.nameTag = value;
	}
	get onScreenDisplay() {
		return this.root.onScreenDisplay;
	}
	get rotation() {
		return this.root.getRotation();
	}
	get scoreboard() {
		return this.root.scoreboardIdentity;
	}
	get scoreboardIdentity() {
		return this.root.scoreboardIdentity;
	}
	get selectedSlot() {
		return this.root.selectedSlot;
	}
	set selectedSlot(value) {
		this.root.selectedSlot = value;
	}
	get totalXpNeededForNextLevel() {
		return this.root.totalXpNeededForNextLevel;
	}
	get xpEarnedAtCurrentLevel() {
		return this.root.xpEarnedAtCurrentLevel;
	}
	get target() {
		return this.root.target;
	}
	get typeId() {
		return this.root.typeId;
	}
	get velocity() {
		return this.root.getVelocity();
	}
	get viewVector() {
		const { x, y, z } = this.root.getViewDirection();
		return new Vector(x, y, z);
	}
	get viewDirection() {
		return this.root.getViewDirection();
	}
	applyDamage(...args: Parameters<PlayerType['applyDamage']>) {
		return this.root.applyDamage(...args);
	}
	applyImpulse(...args: Parameters<PlayerType['applyImpulse']>) {
		return this.root.applyImpulse(...args);
	}
	applyKnockback(...args: Parameters<PlayerType['applyKnockback']>) {
		return this.root.applyKnockback(...args);
	}
	addEffect(...args: Parameters<PlayerType['addEffect']>) {
		return this.root.addEffect(...args);
	}
	addLevels(...args: Parameters<PlayerType['addLevels']>) {
		return this.root.addLevels(...args);
	}
	clearSpawn() {
		return this.root.setSpawnPoint();
	}
	clearVelocity() {
		return this.root.clearVelocity();
	}
	addTag(...args: Parameters<PlayerType['addTag']>) {
		return this.root.addTag(...args);
	}
	extinguishFire(...args: Parameters<PlayerType['extinguishFire']>) {
		return this.root.extinguishFire(...args);
	}
	getBlockFromViewVector(...args: Parameters<PlayerType['getBlockFromViewDirection']>) {
		return this.root.getBlockFromViewDirection(...args);
	}
	getBlockFromViewDirection(...args: Parameters<PlayerType['getBlockFromViewDirection']>) {
		return this.root.getBlockFromViewDirection(...args);
	}
	getComponent<componentKey extends keyof EntityComponents>(componentId: componentKey): EntityComponents[componentKey] {
		return this.root.getComponent(componentId) as EntityComponents[componentKey];
	}
	getComponents(...args: Parameters<PlayerType['getComponents']>) {
		return this.root.getComponents(...args);
	}
	getDynamicProperty(...args: Parameters<PlayerType['getDynamicProperty']>) {
		return this.root.getDynamicProperty(...args);
	}
	getEffect(...args: Parameters<PlayerType['getEffect']>) {
		return this.root.getEffect(...args);
	}
	getEffects(...args: Parameters<PlayerType['getEffects']>) {
		return this.root.getEffects(...args);
	}
	getEntitiesFromViewVector(...args: Parameters<PlayerType['getEntitiesFromViewDirection']>) {
		return this.root.getEntitiesFromViewDirection(...args);
	}
	getEntitiesFromViewDirection(...args: Parameters<PlayerType['getEntitiesFromViewDirection']>) {
		return this.root.getEntitiesFromViewDirection(...args);
	}
	getHeadLocation(...args: Parameters<PlayerType['getHeadLocation']>) {
		return this.root.getHeadLocation(...args);
	}
	getItemCooldown(...args: Parameters<PlayerType['getItemCooldown']>) {
		return this.root.getItemCooldown(...args);
	}
	getRotation() {
		return this.root.getRotation();
	}
	getSpawnPoint() {
		return this.root.getSpawnPoint();
	}
	getSpawnPosition() {
		return this.root.getSpawnPoint();
	}
	getTags(...args: Parameters<PlayerType['getTags']>) {
		return this.root.getTags(...args);
	}
	getTotalXp() {
		return this.root.getTotalXp();
	}
	getVelocity() {
		return this.root.getVelocity();
	}
	getViewDirection() {
		return this.root.getViewDirection();
	}
	hasComponent(...args: Parameters<PlayerType['hasComponent']>) {
		return this.root.hasComponent(...args);
	}
	hasTag(...args: Parameters<PlayerType['hasTag']>) {
		return this.root.hasTag(...args);
	}
	isOp(...args: Parameters<PlayerType['isOp']>) {
		return this.root.isOp(...args);
	}
	kill(...args: Parameters<PlayerType['kill']>) {
		return this.root.kill(...args);
	}
	playAnimation(...args: Parameters<PlayerType['playAnimation']>) {
		return this.root.playAnimation(...args);
	}
	playSound(...args: Parameters<PlayerType['playSound']>) {
		return this.root.playSound(...args);

	}
	postClientMessage(...args: Parameters<PlayerType['postClientMessage']>) {
		return this.root.postClientMessage(...args);
	}
	removeEffect(...args: Parameters<PlayerType['removeEffect']>) {
		return this.root.removeEffect(...args);
	}
	removeAllEffects() {
		return this.root.getEffects().forEach(({ typeId }) => this.root.removeEffect(typeId));
	}
	removeDynamicProperty(...args: Parameters<PlayerType['removeDynamicProperty']>) {
		return this.root.removeDynamicProperty(...args);
	}
	removeTag(...args: Parameters<PlayerType['removeTag']>) {
		return this.root.removeTag(...args);
	}
	resetLevel(...args: Parameters<PlayerType['resetLevel']>) {
		return this.root.resetLevel(...args);
	}
	runCommandAsync(...args: Parameters<PlayerType['runCommandAsync']>) {
		return this.root.runCommandAsync(...args);
	}
	runCommand(...args: Parameters<PlayerType['runCommand']>) {
		return this.root.runCommand(...args);
	}
	setDynamicProperty(...args: Parameters<PlayerType['setDynamicProperty']>) {
		return this.root.setDynamicProperty(...args);
	}
	setOnFire(...args: Parameters<PlayerType['setOnFire']>) {
		return this.root.setOnFire(...args);
	}
	setOp(...args: Parameters<PlayerType['setOp']>) {
		return this.root.setOp(...args);
	}
	setRotation(...args: Parameters<PlayerType['setRotation']>) {
		return this.root.setRotation(...args);
	}
	setSpawn(...args: Parameters<PlayerType['setSpawnPoint']>) {
		return this.root.setSpawnPoint(...args);
	}
	setSpawnPoint(...args: Parameters<PlayerType['setSpawnPoint']>) {
		return this.root.setSpawnPoint(...args);
	}
	startItemCooldown(...args: Parameters<PlayerType['startItemCooldown']>) {
		return this.root.startItemCooldown(...args);
	}
	teleport(...args: Parameters<PlayerType['teleport']>) {
		return this.root.teleport(...args);
	}
	tryTeleport(...args: Parameters<PlayerType['tryTeleport']>) {
		return this.root.tryTeleport(...args);
	}
	sendMessage(...args: Parameters<PlayerType['sendMessage']>) {
		return this.root.sendMessage(...args);
	}
	tell(...args: Parameters<PlayerType['sendMessage']>) {
		return this.root.sendMessage(...args);
	}
	triggerEvent(...args: Parameters<PlayerType['triggerEvent']>) {
		return this.root.triggerEvent(...args);
	}
}

export function setProptotype(entity: PlayerType | EntityType) {
	if (!(entity instanceof PlayerType)) return entity;
	return new Player(entity);
}

