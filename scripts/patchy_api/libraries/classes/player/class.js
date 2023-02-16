import loads from "../load.js";
import { Player as PlayerType, PlayerInventoryComponentContainer, system, Vector } from "@minecraft/server";
import players from "../players/export_instance.js";
import errorLogger from "../error.js";
import { content } from "../../utilities.js";
import scoreboardBuilder from "../scoreboard.js";
import gamemode from "../gamemode.js";
export class Player {
	/**
	 * 
	 * @param {PlayerType} player 
	 */
	constructor(player) {
		/**
		 * @type {PlayerType}
		 */
		this.player = player;
	}
	get gamemode() {
		return gamemode.get(this);
	}
	set gamemode(value) {
		this.player.runCommandAsync(`gamemode ${value}`);
	}
	get loaded() {
		const { id } = this.player;
		return loads.loads.hasOwnProperty(id);
	}
	get mainHand() {
		const { selectedSlot } = this.player;
		/**
		 * @type {PlayerInventoryComponentContainer}
		 */
		const container = this.player.getComponent('inventory').container;
		return new Proxy({}, {
			set(object, key, value) {
				const item = container.getItem(selectedSlot);
				if (!item) return Reflect.set(...arguments);
				container.setItem(selectedSlot, Object.assign(item, { [key]: value }));
				return Reflect.set(...arguments);
			},
			get(target, key, receiver) {
				return container.getItem(selectedSlot)?.[key];
			}
		});
	}
	set mainHand(value) {
		const { selectedSlot } = this.player;
		/**
		 * @type {PlayerInventoryComponentContainer}
		 */
		const container = this.player.getComponent('inventory').container;
		system.run(() => container.setItem(selectedSlot, value));;
	}
	get container() {
		return this.player.getComponent('inventory').container;
	}
	get inventory() {
		return players.getInventory(this.player);
	}
	get scores() {
		const player = this.player;
		return new Proxy({}, {
			get(target, objectiveId, value) {
				return scoreboardBuilder.get(player, objectiveId);
			},
			set(target, objectiveId, value) {
				scoreboardBuilder.set(player, objectiveId, value);
				return Reflect.set(...arguments);
			}
		});
	}
	get properties() {
		const player = this.player;
		return new Proxy({}, {
			get(target, identifier) {
				// console.warn('38943783487847387', identifier);
				return players.getProperty(player, identifier);
			},
			set(target, identifier, value) {
				try {
					// console.warn('38943783487847387', identifier, value, value === undefined || value === null || Number.isNaN(value));
					if (value === undefined || value === null || Number.isNaN(value)) players.resetProperty(player, identifier);
					else players.setProperty(player, identifier, value);
					return Reflect.set(...arguments);
				} catch (error) {
					errorLogger.log(error, error.stack, { key: 'PlayerDynamicProperties', event: 'N/A' });
				}
			}

		});
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
		return this.player.headLocation;
	}
	get id() {
		return this.player.id;
	}
	get isSneaking() {
		return this.player.isSneaking;
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
		return this.player.onScreenDisplay;
	}
	get rotation() {
		return this.player.rotation;
	}
	get scoreboard() {
		return this.player.scoreboard;
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
		return this.player.velocity;
	}
	get viewVector() {
		const { x, y, z } = this.player.viewDirection;
		return new Vector(x, y, z);
	}
	get viewDirection() {
		return this.player.viewDirection;
	}
	applyDamage(...args) {
		return this.player.applyDamage(...args);
	}
	addEffect(...args) {
		return this.player.addEffect(...args);
	}
	addTag(...args) {
		return this.player.addTag(...args);
	}
	getBlockFromViewVector(...args) {
		return this.player.getBlockFromViewVector(...args);
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
		return this.player.getEntitiesFromViewVector(...args);
	}
	getItemCooldown(...args) {
		return this.player.getItemCooldown(...args);
	}
	getTags(...args) {
		return this.player.getTags(...args);
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
	playSound(...args) {
		return this.player.playSound(...args);
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
	runCommandAsync(...args) {
		return this.player.runCommandAsync(...args);
	}
	setDynamicProperty(...args) {
		return this.player.setDynamicProperty(...args);
	}
	setOp(...args) {
		return this.player.setOp(...args);
	}
	setRotation(...args) {
		return this.player.setRotation(...args);
	}
	setVelocity(...args) {
		return this.player.setVelocity(...args);
	}
	startItemCooldown(...args) {
		return this.player.startItemCooldown(...args);
	}
	teleport(...args) {
		return this.player.teleport(...args);
	}
	teleportFacing(...args) {
		return this.player.teleportFacing(...args);
	}
	tell(...args) {
		return this.player.tell(...args);
	}
	triggerEvent(...args) {
		return this.player.triggerEvent(...args);
	}
}

export function setProptotype(entity) {
	if (!(entity instanceof PlayerType)) return entity;
	return new Player(entity);
}

