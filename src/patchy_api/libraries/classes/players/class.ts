import { DynamicPropertiesDefinition, world, MinecraftEntityTypes, ItemStack, Container, system, Dimension, ContainerSlot, EntityQueryOptions } from "@minecraft/server";
import { content, native } from "../../utilities.js";
import global from "../global.js";
import loads from "../load.js";
import propertyBuilder from "../property/export_instance.js";
import { Player } from "../player/class.js";
function isDefined(input: any) {
	return (input !== null && input !== undefined && !Number.isNaN(input));
}

export class Inventory {
	array: (ContainerSlot | undefined)[];
	container: Container;
	constructor(array: (ContainerSlot | undefined)[], inventory: Container) {
		/**
		 * @type {ItemStack[]}
		 */
		this.array = array;
		/**
		 * @type {Container}
		 */
		this.container = inventory;
	}
	iterate(callback: (item: ContainerSlot | undefined, i: number) => (ContainerSlot | undefined)) {
		if (!(callback instanceof Function)) throw new Error('Not a function at args[0]');
		const thisInv = this;
		this.array.forEach((item, i) => {
			const newItem = callback((item) ? this.container.getSlot(i) : item, i);
			this.array[i] = item;
			if (newItem === undefined) return;
			this.array[i] = newItem;
			this.container.setItem(i, newItem.getItem());
		});
	};
}
class PlayerIterator {
	players: { [playerId: string]: Player; };
	playerArray: Player[];
	playerLength: number;
	constructor(players: { [playerId: string]: Player; }) {
		this.players = players;
		this.playerArray = Object.values(players);
		this.playerLength = this.playerArray.length;
	}
	get count() {
		return this.playerLength;
	}
	iterate(callback: (player: Player, i: number) => any) {
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
	objectProperties: Record<string, any>;
	inventorys: Record<string, { container: Inventory; }>;
	ran: boolean;
	memory: Record<string, any>;
	basePlayerIterator!: PlayerIterator;
	ranGarbage: boolean;
	playerQueryIterators: Record<string, PlayerIterator>;
	constructor() {
		this.objectProperties = {};
		// world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(({ entity, id }) => {
		// 	if (!(entity instanceof Player)) return;
		// 	const { id: playerId } = entity;
		// 	content.warn(id);
		// 	if (!this.objectProperties.hasOwnProperty(id)) this.objectProperties[id] = {};
		// 	switch (id) {
		// 		case 'patches:is_swimming': {
		// 			this.objectProperties[playerId].isSwimming = true;
		// 			break;
		// 		}
		// 		case 'patches:is_not_swimming': {
		// 			this.objectProperties[playerId].isSwimming = false;
		// 			break;
		// 		}
		// 	}
		// });
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
		this.ran = false;

		system.runInterval(() => {
			if (!global.refreshBasePlayerIterator) return;
			// content.chatFormat({ test: global.refreshBasePlayerIterator });
			playersObject.refreshBasePlayerIterator();
			global.refreshBasePlayerIterator = false;
		});
		world.afterEvents.playerLeave.subscribe(() => {
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
	find(entityQueryOptions?: EntityQueryOptions, cache?: boolean) {
		return this.get(entityQueryOptions, cache).array()[0];
	}
	getById(id: string) {
		return loads?.players?.[id];
	};
	get(entityQueryOptions?: EntityQueryOptions, cache: boolean = true, dimension?: Dimension): PlayerIterator {

		let worldPlayers: string[];
		if (!entityQueryOptions && !dimension) return this.basePlayerIterator!;//this.basePlayerIterator;
		if (!cache) {
			worldPlayers = ((dimension) ? dimension.getPlayers(entityQueryOptions) : world.getPlayers(entityQueryOptions)).map((({ id }) => id));

			const playerObject: Record<string, Player> = {};
			Object.entries(loads.players).filter(([id]) => worldPlayers.includes(id)).forEach(([id, player]) => {
				playerObject[id] = player;
			});
			return new PlayerIterator(playerObject);
		}
		const key = JSON.stringify(entityQueryOptions) + ((dimension) ? `:${dimension.id}` : '');
		if (this.playerQueryIterators.hasOwnProperty(key)) return this.playerQueryIterators[key]!;
		worldPlayers = ((dimension) ? dimension.getPlayers(entityQueryOptions) : world.getPlayers(entityQueryOptions)).map((({ id }) => id));
		const playerObject: Record<string, Player> = {};
		Object.entries(loads.players).filter(([id]) => worldPlayers.includes(id)).forEach(([id, player]) => {
			playerObject[id] = player;
		});
		const playerIterator = new PlayerIterator(playerObject);
		this.playerQueryIterators[key] = playerIterator;
		const playerThis = this;
		if (!this.ranGarbage) this.ranGarbage = true, system.run(() => (playerThis.ranGarbage = false, playerThis.playerQueryIterators = {}));
		return playerIterator;
	}
	getInventory(player: Player) {
		const { id } = player;
		if (this.inventorys.hasOwnProperty(id)) return this.inventorys[id]!.container;
		this.inventorys[id] = {} as typeof this.inventorys[string];
		const inventory = player.getComponent('inventory').container;
		const container = [];
		const { size } = inventory;
		for (let i = 0; i < size; i++) {
			const item = inventory.getSlot(i);
			container.push(item);
		}
		this.inventorys[id]!.container = new Inventory(container, inventory);
		const playersObject = this;
		if (!this.ran) this.ran = true, system.run(() => (playersObject.inventorys = {}, playersObject.ran = false));
		return this.inventorys[id]!.container;
	};
	getRandomPlayer(entityQueryOptions: EntityQueryOptions) {
		const foundPlayers = this.get(entityQueryOptions).object();
		if (!foundPlayers) return;
		const ids = Object.keys(foundPlayers);
		const id = ids[Math.floor(Math.random() * ids.length)]!;
		return ({ id: foundPlayers[id] });
	}
	getProperty(player: Player, identifier: string) {
		return propertyBuilder.get(player)[identifier];
	};
	setProperty(player: Player, identifier: string, value: string | number | boolean) {
		const properties = propertyBuilder.get(player);
		properties[identifier] = value;
	};
	resetProperty(player: Player, identifier: string) {
		const properties = propertyBuilder.get(player);
		properties[identifier] = undefined;
	}
	registerProperty(identifier: string, options: { type: 'string' | 'number' | 'boolean', maxLength?: number; }) {
		propertyBuilder.register({
			player: {
				[identifier]: options
			}
		});
	};
}

