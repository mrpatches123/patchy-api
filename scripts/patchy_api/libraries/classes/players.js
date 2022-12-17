import { Player, EntityQueryOptions, DynamicPropertiesDefinition, world, MinecraftEntityTypes, ItemStack, PlayerInventoryComponentContainer } from "@minecraft/server";
import { content, native } from "../utilities.js";
import global from "./global.js";
import eventBuilder from "./events.js";
import loads from "./load.js";
const typeDefinitionFunctions = { number: 'defineNumber', string: 'defineString', boolean: 'defineBoolean' };
const types = Object.keys(typeDefinitionFunctions);
function isDefined(input) {
	return (input !== null && input !== undefined);
}
class Inventory {
	/**
	 * 
	 * @param {Array<ItemStack>} array 
	 * @param {PlayerInventoryComponentContainer} inventory 
	 */
	constructor(array, inventory) {
		this.array = array;
		this.inventory = inventory;
	}
	/**
	 * @param {(item: ItemStack, i) => {}} callback return changes the item
	 */
	loop(callback) {
		if (!(callback instanceof Function)) throw new Error('Not a function at args[0]');
		this.array.forEach((item, i) => {
			const newItem = callback(item);
			if (!(newItem instanceof ItemStack)) return;
			this.array[i] = newItem;
			this.inventory.setItem(i, newItem);
		});
	};
}
class PlayerIterator {
	constructor(players) {
		this.players = players;
		this.playerArray = Object.values(players);
	}
	/**
	 * @method iterate
	 * @param {(player: Player, i) => {}} callback 
	 */
	iterate(callback) {
		this.playerArray.forEach((player, i) => {
			callback(player, i);
		});
	}
	/**
	 * @method array
	 * @returns {Player[]}
	 */
	array() {
		return this.playerArray;
	}
	/**
	 * @method object
	 * @returns {{[key: String]: Player}}
	 */
	object() {
		return this.players;
	}
	/**
	 * @method ids
	 * @returns {String[]}
	 */
	ids() {
		return this.playerArray.map(({ id }) => id);
	}
	/**
	 * @method namess
	 * @returns {String[]}
	 */
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
class Players {
	constructor() {
		this.propertyStorage = {};
		this.properties = {};
		this.memory = {};
		const playersObject = this;
		content.warn('wdlkwdwkdkwdkl', Math.random());
		/**
		 * @type {({[key: String]: Player})}
		 */
		this.inventorys = {};
		this.registered = false;

		eventBuilder.subscribe('end_players*API', {
			worldInitialize(event) {

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
			}
		});

	}
	/**
	 * @method getLoadedPlayers
	 * @param {EntityQueryOptions} EntityQueryOptions?
	 * @returns {PlayerIterator}
	 */
	get(EntityQueryOptions) {
		let worldPlayers;
		if (EntityQueryOptions) worldPlayers = [...world.getPlayers(EntityQueryOptions)].map((({ id }) => id));
		else worldPlayers = [...world.getPlayers()].map(({ id }) => id);
		return new PlayerIterator(loads.players.filter((id) => worldPlayers.includes(id)));
	}
	getInventory(player) {
		const { id } = player;
		if (!(id in this.inventorys)) {
			const inventory = player.getComponent('inventory').container;
			const container = [];
			const { size } = inventory;
			for (let i = 0; i < size; i++) {
				const item = inventory.getItem();
				container.push(item);
			}
			this[id].container = new Inventory(container, inventory);
		}
		return this[id].container;
	};
	/**
	 * @method getRandomPlayer
	 * @param {EntityQueryOptions} EntityQueryOptions?
	 */
	getRandomPlayer(EntityQueryOptions) {
		const foundPlayers = this.get(EntityQueryOptions);
		if (!foundPlayers) return;
		const ids = Object.keys(foundPlayers);
		const id = ids[Math.floor(Math.random() * ids.length)];
		return ({ id: foundPlayers[id] });
	}
	/**
	 * 
	 * @param {Player} player 
	 * @param {String} identifier 
	 */
	getProperty(player, identifier, forceDisk = false) {
		const { id } = player;
		if (!(player instanceof Player)) throw new Error(`player at params[0] is not a Player! `);
		if (!this.propertyStorage.hasOwnProperty(identifier)) throw new Error(`DynamicProperty: ${identifier}, does not exist! `);
		if (!this.properties.hasOwnProperty(id)) this.properties[id] = {};
		if (!this.properties[id].hasOwnProperty(identifier)) this.properties[id][identifier] = {};
		let { value, gotten } = this.properties[id];
		if (forceDisk || !gotten) {
			value = player.getDynamicProperty(identifier);
			this.properties[id][identifier].value = value;
			this.properties[id][identifier].gotten = true;
		}
		return value;
	};
	/**
	 * 
	 * @param {Player} player 
	 * @param {String} identifier 
	 * @param {String | Number | Boolean | undefined | null } value
	 */
	setProperty(player, identifier, value) {
		const { id } = player;
		if (!(player instanceof Player)) throw new Error(`player at params[0] is not a Player! `);
		if (!this.propertyStorage.hasOwnProperty(identifier)) throw new Error(`DynamicProperty: ${identifier}, does not exist! `);
		const { type } = this.propertyStorage[identifier];
		if (isDefined(value) && type !== typeof value) throw new Error(`value at params[2] is not of type: ${type}!`);
		if (!this.properties.hasOwnProperty(id)) this.properties[id] = {};
		if (!this.properties[id].hasOwnProperty(identifier)) this.properties[id][identifier] = {};
		player.setDynamicProperty(identifier, value);
		this.properties[id][identifier].value = value;
		this.properties[id][identifier].gotten = true;
	};
	/**
	 * @typedef {Object} propertyOptionsString
	 * @property {Number} maxLength
	 * @property {'string'} type
	 */
	/**
	 * @typedef {Object} propertyOptionsNumberBoolean
	 * @property {'boolean' | 'number'} type
	 */
	/**
	 * 
	 * @param {String} identifier 
	 * @param {propertyOptionsString | propertyOptionsNumberBoolean} options 
	 */
	registerProperty(identifier, options) {
		if (this.registered) throw new Error(`Register Property: ${identifier} in before all scripts load`);
		if (typeof identifier !== 'string') throw new Error(`identifier, ${identifier}, at param[0] is not a string!`);
		if (!(options instanceof Object)) throw new Error(`options at param[1] is not a object!`);
		const { type, maxLength } = options;
		if (!types.includes(type)) throw new Error(`type, ${type}, in options at param[1] is not 'string', 'number', or 'boolean'!`);
		content.warn({ type, maxLength, });
		if (type === 'string' && !isDefined(maxLength)) throw new Error(`maxLength, in options at param[1] should not be defined since type is not 'string'!`);
		if (type === 'string' && !Number.isInteger(maxLength) || maxLength <= 0) throw new Error(`maxLength, in options at param[1] is not a integer greater than 0!`);
		this.propertyStorage[identifier] = options;
	};
}
const players = new Players;
export default players;

