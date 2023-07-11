import loads from "../load.js";
import { Player as PlayerType, Container, system, Vector, EntityEquipmentInventoryComponent, EquipmentSlot, world } from "@minecraft/server";
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
class OnScreenDisplay {
	/**
	 * @param {Player} player 
	 */
	constructor(player) {
		this.player = player;
	}
	/**
	 * @param {String} text 
	 * @param {import("@minecraft/server").TitleDisplayOptions} options 
	 */
	setTitle(text, options = {}) {
		if (!text) throw new Error(`text at params[0] is not defined`);
		const { subtitle, fadeInSeconds, fadeOutSeconds, staySeconds } = options;
		this.player.runCommand(`titleraw @s title {"rawtext":[{"text":"${text}"}]}`);
		if (subtitle) this.player.runCommand(`titleraw @s subtitle {"rawtext":[{"text":"${subtitle}"}]}`);
		if (fadeInSeconds || fadeOutSeconds || staySeconds) this.player.runCommand(`titleraw @s times ${fadeInSeconds ?? 0} ${staySeconds ?? 999999999} ${fadeOutSeconds ?? 0}`);
	}
	/**
	 * @param {String} text
	 */
	updateSubtitle(text) {
		if (!text) throw new Error(`text at params[0] is not defined`);
		this.player.runCommand(`titleraw @s subtitle {"rawtext":[{"text":"${text}"}]}`);
	}
	/**
	 * @param {String} text
	 */
	setActionBar(text) {
		if (!text) throw new Error(`text at params[0] is not defined`);
		this.player.runCommand(`titleraw @s actionbar {"rawtext":[{"text":"${text}"}]}`);
	}
	/**
	 * @param {String} text
	 */
	clearTitle() {
		this.player.clear(`titleraw @s clear`);
	}
}

export class Player {
	/**@
	 * 
	 * @param {PlayerType} player 
	 */
	constructor(player) {
		/**
		 * @type {PlayerType}
		 */
		this.player = player;
	}
	get isSwimming() {
		return players.objectProperties[this.player.id]?.isSwimming ?? false;
	}
	get gamemode() {
		return gamemode.get(this);
	}
	set gamemode(value) {
		this.player.runCommandAsync(`gamemode ${gamemodeIndexMap[value]}`);
	}
	get loaded() {
		const { id } = this.player;
		return loads.loads.hasOwnProperty(id);
	}
	get armor() {

	}
	get offhand() {

		const { selectedSlot } = this.player;
		/**
		 * @type {EntityEquipmentInventoryComponent}
		 */
		const equipmentInventory = this.player.getComponent('equipment_inventory');

		const offhandSlot = equipmentInventory.getEquipmentSlot(EquipmentSlot.offhand);

		return new Proxy({}, {
			set(object, key, value) {
				const item = offhandSlot.getItem();
				if (!item) return Reflect.set(...arguments);
				if (key === 'amount' && value <= 0) { offhandSlot.setItem(undefined); return Reflect.set(...arguments); }
				offhandSlot.setItem(Object.assign(item, { [key]: value }));
				return Reflect.set(...arguments);
			},
			get(target, key, receiver) {
				return offhandSlot.getItem()?.[key];
			}
		});
	}
	get mainHand() {
		const { selectedSlot } = this.player;
		/**
		 * @type {Container}
		 */
		const container = this.player.getComponent('minecraft:inventory').container;
		return new Proxy({}, {
			set(object, key, value) {
				content.warn({ t: 'mainHandSet', key, value });
				const item = container.getItem(selectedSlot);
				if (!item) return Reflect.set(...arguments);
				if (key === 'amount' && value <= 0) { container.setItem(selectedSlot, undefined); return Reflect.set(...arguments); }
				container.setItem(selectedSlot, Object.assign(item, { [key]: value }));
				return Reflect.set(...arguments);
			},
			get(target, key, receiver) {
				const item = container.getItem(selectedSlot);
				const value = item?.[key];
				content.warn({ type: value instanceof Function });
				return (value instanceof Function) ? (...args) => { content.warn({ key, args, value: item[key](...args)?.getDamageChance(0) }); return item[key](...args); } : item?.[key];
			}
		});
	}

	set mainHand(value) {
		const { selectedSlot } = this.player;
		/**
		 * @type {Container}
		 */
		const container = this.player.getComponent('inventory').container;
		container.setItem(selectedSlot, value);
	}
	get container() {
		return this.player.getComponent('inventory').container;
	}
	get inventory() {
		return players.getInventory(this.player);
	}
	get scores() {
		const player = this;
		return new Proxy({}, {
			get(target, objectiveId) {

				const value = scoreboardBuilder.get(player, objectiveId);
				// if (objectiveId === 'skycoins') content.warn({ t: 'get', objectiveId, value });
				return value;
			},
			set(target, objectiveId, value) {
				scoreboardBuilder.set(player, objectiveId, value);
				// content.warn({ t: 'set', objectiveId, value });
				return Reflect.set(...arguments);
			}
		});
	}
	get properties() {
		return propertyBuilder.get(this.player);
	}
	get memory() {
		const player = this.player;
		const { id } = player;
		if (!players.memory.hasOwnProperty(id)) players.memory[id] = {};
		return new Proxy(players.memory[id], {
			get(target, identifier) {
				return players.memory?.[id]?.[identifier];
			},
			set(target, identifier, value) {
				try {
					players.memory[id][identifier] = value;
					return Reflect.set(...arguments);
				} catch (error) {
					errorLogger.log(error, error.stack, { key: 'PlayerDynamicProperties', event: 'N/A' });
				}
			},
			has(target, key) {
				return key in players.memory[id];
			}

		});
	}
	get dimension() {
		return this.player.dimension;
	}
	get headLocation() {
		return this.player.getHeadLocation();
	}
	get id() {
		return this.player.id;
	}
	get isSneaking() {
		return this.player.isSneaking;
	}
	get level() {
		return this.player.level;
	}
	get location() {
		return this.player.location;
	}
	get name() {
		return this.player.name;
	}
	get nameTag() {
		return this.player.nameTag;
	}
	set nameTag(value) {
		this.player.nameTag = value;
	}
	get onScreenDisplay() {
		return new OnScreenDisplay(this.player);
	}
	get rotation() {
		return this.player.getRotation();
	}
	get scoreboard() {
		return this.player.scoreboardIdentity;
	}
	get scoreboardIdentity() {
		return this.player.scoreboardIdentity;
	}
	get selectedSlot() {
		return this.player.selectedSlot;
	}
	set selectedSlot(value) {
		this.player.selectedSlot = value;
	}
	get target() {
		return this.player.target;
	}
	get typeId() {
		return this.player.typeId;
	}
	get velocity() {
		return this.player.getVelocity();
	}
	get viewVector() {
		const { x, y, z } = this.player.getViewDirection();
		return new Vector(x, y, z);
	}
	get viewDirection() {
		return this.player.getViewDirection();
	}
	applyDamage(...args) {
		return this.player.applyDamage(...args);
	}
	applyImpulse(...args) {
		return this.player.applyImpulse(...args);
	}
	applyKnockback(...args) {
		return this.player.applyKnockback(...args);
	}
	addEffect(...args) {
		return this.player.addEffect(...args);
	}
	clearSpawn() {
		return this.player.clearSpawn();
	}
	clearVelocity() {
		return this.player.clearVelocity();
	}
	addTag(...args) {
		return this.player.addTag(...args);
	}
	extinguishFire(...args) {
		return this.player.extinguishFire(...args);
	}
	getBlockFromViewVector(...args) {
		return this.player.getBlockFromViewDirection(...args);
	}
	getBlockFromViewDirection(...args) {
		return this.player.getBlockFromViewDirection(...args);
	}
	getComponent(...args) {
		return this.player.getComponent(...args);
	}
	getComponents(...args) {
		return this.player.getComponents(...args);
	}
	getDynamicProperty(...args) {
		return this.player.getDynamicProperty(...args);
	}
	getEffect(...args) {
		return this.player.getEffect(...args);
	}
	getEntitiesFromViewVector(...args) {
		return this.player.getBlockFromViewDirection(...args);
	}
	getEntitiesFromViewVector(...args) {
		return this.player.getBlockFromViewDirection(...args);
	}
	getHeadLocation(...args) {
		return this.player.getHeadLocation(...args);
	}
	getItemCooldown(...args) {
		return this.player.getItemCooldown(...args);
	}
	getRotation() {
		return this.player.getRotation();
	}
	getSpawnPosition() {
		return this.player.getSpawnPosition();
	}
	getTags(...args) {
		return this.player.getTags(...args);
	}
	getTotalXp() {
		return this.player.getTotalXp();
	}
	getVelocity() {
		return this.player.getVelocity();
	}
	getViewDirection() {
		return this.player.getViewDirection();
	}
	hasComponent(...args) {
		return this.player.hasComponent(...args);
	}
	hasTag(...args) {
		return this.player.hasTag(...args);
	}
	isOp(...args) {
		return this.player.isOp(...args);
	}
	kill(...args) {
		return this.player.kill(...args);
	}
	playAnimation(...args) {
		return this.player.playAnimation(...args);
	}
	playSound(...args) {
		try {
			return this.player.playSound(...args);
		} catch (error) {
			if (error.message.includes('have required privileges')) return system.runTimeout(() => this.player.playSound(...args), 0);
			new Error(error.message);
		}
	}
	postClientMessage(...args) {
		return this.player.postClientMessage(...args);
	}
	removeDynamicProperty(...args) {
		return this.player.removeDynamicProperty(...args);
	}
	removeTag(...args) {
		return this.player.removeTag(...args);
	}
	resetLevel(...args) {
		return this.player.resetLevel(...args);
	}
	runCommandAsync(...args) {
		return this.player.runCommandAsync(...args);
	}
	runCommand(...args) {
		return this.player.runCommand(...args);
	}
	setDynamicProperty(...args) {
		return this.player.setDynamicProperty(...args);
	}
	setOnFire(...args) {
		return this.player.setOnFire(...args);
	}
	setOp(...args) {
		return this.player.setOp(...args);
	}
	setRotation(...args) {
		return this.player.setRotation(...args);
	}
	setSpawn(...args) {
		return this.player.setSpawn(...args);
	}
	startItemCooldown(...args) {
		return this.player.startItemCooldown(...args);
	}
	teleport(...args) {
		return this.player.teleport(...args);
	}
	sendMessage(...args) {
		return this.player.sendMessage(...args);
	}
	tell(...args) {
		return this.player.sendMessage(...args);
	}
	triggerEvent(...args) {
		return this.player.triggerEvent(...args);
	}
}

export function setProptotype(entity) {
	if (!(entity instanceof PlayerType)) return entity;
	return new Player(entity);
}

