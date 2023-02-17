import { Player, DynamicPropertiesDefinition, world, MinecraftEntityTypes, ItemStack, PlayerInventoryComponentContainer, system } from "@minecraft/server";
import { content, native } from "../../utilities.js";
import global from "../global.js";
import loads from "../load.js";
const typeDefinitionFunctions = { number: 'defineNumber', string: 'defineString', boolean: 'defineBoolean' };
const types = Object.keys(typeDefinitionFunctions);
function isDefined(input) {
	return (input !== null && input !== undefined && !Number.isNaN(input));
}
export class Inventory {
	constructor(array, inventory) {
		this.array = array;
		this.container = inventory;
	}
	iterate(callback) {
		if (!(callback instanceof Function)) throw new Error('Not a function at args[0]');
		this.array.forEach((item, i) => {
			const newItem = callback(item, i);
			if (!(newItem instanceof ItemStack)) return;
			this.array[i] = newItem;
			this.container.setItem(i, newItem);
		});
	};
}
class PlayerIterator {
	constructor(players) {
		this.players = players;
		this.playerArray = Object.values(players);
		this.playerLength = this.playerArray.length;
	}
	get count() {
		return this.playerLength;
	}
	iterate(callback) {
		this.playerArray.forEach((player, i) => {
			callback(player, i);
		});
	}
	array() {
		return this.playerArray;
	}
	object() {
		return this.players;
	}
	ids() {
		return this.playerArray.map(({ id }) => id);
	}
	names() {
		return this.playerArray.map(({ name }) => name);
	}
	[Symbol.iterator]() {
		let index = 0;
		const data = this.playerArray;
		return {
			next: () => ({ value: data[index++], done: !(index in data) })
		};
	};

}
export class Players {
	constructor() {
		this.propertyStorage = {};
		this.properties = {};
		this.memory = {};
		const playersObject = this;
		this.ranGarbage = false;
		this.basePlayerIterator;
		this.playerQueryIterators = {};

		content.warn('wdlkwdwkdkwdkl', Math.random());
		/**
		 * @type {({[key: String]: Player})}
		 */
		this.inventorys = {};
		this.registered = false;
		this.ran = false;
		world.events.worldInitialize.subscribe((event) => {
			const dynamicPropertiesDefinition = new DynamicPropertiesDefinition();
			playersObject.propertyStorage.forEach((identifier, { type, maxLength }) => {
				switch (type) {
					case 'number':
						dynamicPropertiesDefinition.defineNumber(identifier);
						break;
					case 'string':
						dynamicPropertiesDefinition.defineString(identifier, maxLength);
						break;
					case 'boolean':
						dynamicPropertiesDefinition.defineBoolean(identifier);
						break;
				}
			});
			event.propertyRegistry.registerEntityTypeDynamicProperties(dynamicPropertiesDefinition, MinecraftEntityTypes.player);
			playersObject.registered = true;
		});
		world.events.tick.subscribe(() => {
			if (!global.refreshBasePlayerIterator) return;
			// content.chatFormat({ test: global.refreshBasePlayerIterator });
			playersObject.refreshBasePlayerIterator();
			global.refreshBasePlayerIterator = false;
		});
		world.events.playerLeave.subscribe(() => {
			playersObject.refreshBasePlayerIterator();
		});
	}
	refreshBasePlayerIterator() {
		this.basePlayerIterator = new PlayerIterator(loads.players);
		this.playerQueryIterators = {};
		// content.chatFormat({ t: 8938923832, basePlayerIterator: this.basePlayerIterator });
	}/**
	 * @param {import('@minecraft/server').EntityQueryOptions} entityQueryOptions 
	 * @param {boolean} cache 
	 * @returns {Player}
	 */
	find(entityQueryOptions, cache) {
		return this.get(entityQueryOptions, cache).array()[0];
	}
	/**
	 * @param {import('@minecraft/server').EntityQueryOptions} entityQueryOptions 
	 * @param {boolean} cache 
	 * @returns {PlayerIterator}
	 */
	get(entityQueryOptions, cache = true) {
		let worldPlayers;
		if (!entityQueryOptions) return this.basePlayerIterator;//this.basePlayerIterator;
		if (!cache) {
			worldPlayers = [...world.getPlayers(entityQueryOptions)].map((({ id }) => id));
			return new PlayerIterator(loads.players.filter((id) => worldPlayers.includes(id)));
		}
		const key = JSON.stringify(entityQueryOptions);
		if (this.playerQueryIterators.hasOwnProperty(key)) return this.playerQueryIterators[key];
		worldPlayers = [...world.getPlayers(entityQueryOptions)].map((({ id }) => id));
		const playerIterator = new PlayerIterator(loads.players.filter((id) => worldPlayers.includes(id)));
		this.playerQueryIterators[key] = playerIterator;
		const playerObject = this;
		if (!this.ranGarbage) this.ranGarbage = true, system.run(() => (playerObject.ranGarbage = false, playerObject.playerQueryIterators = {}));
		return playerIterator;
	}
	getInventory(player) {
		const { id } = player;
		if (this.inventorys.hasOwnProperty(id)) return this.inventorys[id].container;;
		this.inventorys[id] = {};
		const inventory = player.getComponent('inventory').container;
		const container = [];
		const { size } = inventory;
		for (let i = 0; i < size; i++) {
			const item = inventory.getItem(i);
			container.push(item);
		}
		this.inventorys[id].container = new Inventory(container, inventory);
		const playersObject = this;
		if (!this.ran) this.ran = true, system.run(() => (playersObject.inventorys = {}, playersObject.ran = false));
		return this.inventorys[id].container;
	};
	getRandomPlayer(entityQueryOptions) {
		const foundPlayers = this.get(entityQueryOptions);
		if (!foundPlayers) return;
		const ids = Object.keys(foundPlayers);
		const id = ids[Math.floor(Math.random() * ids.length)];
		return ({ id: foundPlayers[id] });
	}
	getProperty(player, identifier, forceDisk = false) {
		const { id } = player;
		if (!(player instanceof Player)) throw new Error(`player at params[0] is not a Player! `);
		if (!this.propertyStorage.hasOwnProperty(identifier)) throw new Error(`DynamicProperty: ${identifier}, does not exist! `);
		if (!this.properties.hasOwnProperty(id)) this.properties[id] = {};
		if (!this.properties[id].hasOwnProperty(identifier)) this.properties[id][identifier] = {};
		let { value, gotten } = this.properties[id][identifier];
		if (forceDisk || !gotten) {
			value = player.getDynamicProperty(identifier);
			this.properties[id][identifier].value = value;
			this.properties[id][identifier].gotten = true;
		}
		return value;
	};
	setProperty(player, identifier, value) {
		const { id } = player;
		content.warn({ constructor: player.constructor.name, bool: player instanceof Player });
		if (!(player instanceof Player)) throw new Error(`player at params[0] is not a Player! `);
		if (!this.propertyStorage.hasOwnProperty(identifier)) throw new Error(`DynamicProperty: ${identifier}, does not exist! `);
		const { type } = this.propertyStorage[identifier];
		if (isDefined(value) && type !== typeof value) throw new Error(`value at params[2] is not of type: ${type}!`);
		if (!this.properties.hasOwnProperty(id)) this.properties[id] = {};
		if (!this.properties[id].hasOwnProperty(identifier)) this.properties[id][identifier] = {};
		player.setDynamicProperty(identifier, value);
		// content.warn(1, { now: Date.now() - value, value, mem: this.properties[id][identifier].value, disk: player.getDynamicProperty(identifier) });
		this.properties[id][identifier].value = value;
		// content.warn(2, { now: Date.now() - value, value, mem: this.properties[id][identifier].value, disk: player.getDynamicProperty(identifier) });
		// system.run(() => content.warn(3, { now: Date.now() - value, value, mem: this.properties[id][identifier].value, disk: player.getDynamicProperty(identifier) }));
		this.properties[id][identifier].gotten = true;
	};
	resetProperty(player, identifier) {
		content.warn(player.name, identifier);
		const { id } = player;
		if (!(player instanceof Player)) throw new Error(`player at params[0] is not a Player! `);
		if (!this.propertyStorage.hasOwnProperty(identifier)) throw new Error(`DynamicProperty: ${identifier}, does not exist! `);
		if (!this.properties.hasOwnProperty(id)) this.properties[id] = {};
		if (!this.properties[id].hasOwnProperty(identifier)) this.properties[id][identifier] = {};
		player.removeDynamicProperty(identifier);
		// content.warn(1, { now: Date.now() - value, value, mem: this.properties[id][identifier].value, disk: player.getDynamicProperty(identifier) });
		this.properties[id][identifier].value = undefined;
		// content.warn(2, { now: Date.now() - value, value, mem: this.properties[id][identifier].value, disk: player.getDynamicProperty(identifier) });
		// system.run(() => content.warn(3, { now: Date.now() - value, value, mem: this.properties[id][identifier].value, disk: player.getDynamicProperty(identifier) }));
		this.properties[id][identifier].gotten = true;
	}
	registerProperty(identifier, options) {
		if (this.registered) throw new Error(`Register Property: ${identifier} in before all scripts load`);
		if (typeof identifier !== 'string') throw new Error(`identifier, ${identifier}, at param[0] is not a string!`);
		if (!(options instanceof Object)) throw new Error(`options at param[1] is not a object!`);
		const { type, maxLength } = options;
		if (!types.includes(type)) throw new Error(`type, ${type}, in options at param[1] is not 'string', 'number', or 'boolean'!`);
		// content.warn({ type, maxLength, });
		if (type === 'string' && !isDefined(maxLength)) throw new Error(`maxLength, in options at param[1] should not be defined since type is not 'string'!`);
		if (type === 'string' && !Number.isInteger(maxLength) || maxLength <= 0) throw new Error(`maxLength, in options at param[1] is not a integer greater than 0!`);
		this.propertyStorage[identifier] = options;
	};
}

