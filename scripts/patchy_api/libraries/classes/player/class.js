import loads from "../load.js";
import { Player as PlayerType, Container, system, Vector, world } from "@minecraft/server";
import players from "../players/export_instance.js";
import errorLogger from "../error.js";
import { content, native } from "../../utilities.js";
import gamemode, { gamemodeIndexMap, gamemodeMap } from "../gamemode.js";
const player = world.getAllPlayers()[0];

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


	get container() {
		return this.player.getComponent('inventory').container;
	}
	get inventory() {
		return players.getInventory(this.player);
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
	get velocity() {
		return this.player.getVelocity();
	}
	get id() {
		return this.player.id;
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
	get totalXpNeededForNextLevel() {
		return this.player.totalXpNeededForNextLevel;
	}
	get typeId() {
		return this.player.typeId;
	}
	get viewDirection() {
		return this.player.getViewDirection();
	}
	get viewVector() {
		return this.player.getViewDirection();
	}
	applyDamage(...args) {
		return this.player.applyDamage(...args);
	}
	applyKnockback(...args) {
		return this.player.applyKnockback(...args);
	}
	addEffect(...args) {
		return this.player.addEffect(...args);
	}
	clearVelocity() {
		return this.player.clearVelocity();
	}
	addTag(...args) {
		return this.player.addTag(...args);
	}
	getComponent(...args) {
		return this.player.getComponent(...args);
	}
	getComponents(...args) {
		return this.player.getComponents(...args);
	}
	getEffect(...args) {
		return this.player.getEffect(...args);
	}
	getHeadLocation(...args) {
		return this.player.getHeadLocation(...args);
	}
	getVelocity(...args) {
		return this.player.getVelocity(...args);
	}
	getTags(...args) {
		return this.player.getTags(...args);
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
	removeEffect(...args) {
		return this.player.removeEffect(...args);
	}
	removeAllEffects() {
		return this.player.getEffects().forEach(({ typeId }) => this.player.removeEffect(typeId));
	}
	removeTag(...args) {
		return this.player.removeTag(...args);
	}
	runCommandAsync(...args) {
		return this.player.runCommandAsync(...args);
	}
	runCommand(...args) {
		return this.player.runCommand(...args);
	}
	teleport(...args) {
		return this.player.teleport(...args);
	}
	tryTeleport(...args) {
		return this.player.tryTeleport(...args);
	}
	sendMessage(...args) {
		return this.player.sendMessage(...args);
	}
	tell(...args) {
		return this.player.sendMessage(...args);
	}
	triggerEvent(event) {
		return this.player.runCommand(`event entity @s ${event}`);
	}
}

export function setProptotype(entity) {
	if (!(entity instanceof PlayerType)) return entity;
	return new Player(entity);
}

