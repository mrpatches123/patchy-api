import loads from "../load.js";

import { EntityComponentTypeMap, Player as PlayerType, Container, system, Vector, EquipmentSlot, world, ItemStack, ContainerSlot, EntityType, Camera, EntityEquippableComponent, MusicOptions, EntityQueryOptions, DimensionLocation, EntityComponent, MolangVariableMap, Vector3 } from "@minecraft/server";
import players from "../players/export_instance.js";
import errorLogger from "../error.js";
import { content, native } from "../../utilities.js";
import scoreboardBuilder from "../scoreboard.js";
import gamemode, { gamemodeIndexMap, gamemodeMap } from "../gamemode.js";
import propertyBuilder from "../property.js";
const player = world.getAllPlayers()[0];
const armorSlots = [
	EquipmentSlot.Feet,
	EquipmentSlot.Legs,
	EquipmentSlot.Chest,
	EquipmentSlot.Head
];



export class Player implements PlayerType {
	public root: PlayerType;
	constructor(player: PlayerType) {
		/**
		 * @type {PlayerType}
		 */
		this.root = player;
	}
	spawnParticle(...args: Parameters<PlayerType['spawnParticle']>): void {
		this.root.spawnParticle(...args);
	}
	eatItem(...args: Parameters<PlayerType['eatItem']>): void {
		this.root.eatItem(...args);
	}
	kick(message?: string) {
		this.root.runCommand((message) ? `kick "${this.root.name}" ${message}` : `kick "${this.root.name}"`);
	}
	matches(...args: Parameters<PlayerType['matches']>) {
		return this.root.matches(...args);
	}
	getDynamicPropertyTotalByteCount() {
		return this.root.getDynamicPropertyTotalByteCount();
	}
	getDynamicPropertyIds() {
		return this.root.getDynamicPropertyIds();
	}
	clearDynamicProperties() {
		this.root.clearDynamicProperties();
	}
	stopMusic() {
		this.root.stopMusic();
	}
	queueMusic(...args: Parameters<PlayerType['queueMusic']>): void {
		this.root.queueMusic(...args);
	}
	playMusic(...args: Parameters<PlayerType['playMusic']>): void {
		this.root.playMusic(...args);
	}
	resetProperty(...args: Parameters<PlayerType['resetProperty']>) {
		return this.root.resetProperty(...args);
	}
	setProperty(...args: Parameters<PlayerType['setProperty']>) {
		return this.root.setProperty(...args);
	}
	remove(): void {
		throw new Error("remove doesn't exist on Players");
	}
	getProperty(...args: Parameters<PlayerType['getProperty']>) {
		return this.root.getProperty(...args);
	}
	get isSleeping() {
		return this.root.isSleeping;
	}
	get isEmoting() {
		return this.root.isEmoting;
	}
	get camera() {
		return this.root.camera;
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
		const equipmentInventory = this.getComponent('equippable')!;

		return equipmentInventory.getEquipmentSlot(EquipmentSlot.Offhand);
	}
	get mainHand(): ContainerSlot {
		const { selectedSlot } = this.root;
		const container = this.getComponent('minecraft:inventory')!.container!;
		return container.getSlot(selectedSlot);
	}

	set mainHand(value: ItemStack | ContainerSlot | undefined) {
		const { selectedSlot } = this.root;

		const container = this.getComponent('inventory')!.container!;
		container.setItem(selectedSlot, (value instanceof ContainerSlot) ? value.getItem() : value);
	}
	get container() {
		return this.getComponent('inventory')!.container;
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
		return propertyBuilder.get(this);
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
	getComponent<T extends keyof EntityComponentTypeMap>(componentId: T): EntityComponentTypeMap[T] {
		return this.root.getComponent(componentId)!;
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
	getSpawnPoint(): DimensionLocation | undefined {
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
	removeDynamicProperty(identifer: string) {
		return this.root.setDynamicProperty(identifer);
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

