import { world, system } from "@minecraft/server";
import { content } from "../../utilities.js";
import global from "../global.js";
import loads from "../load.js";
import { Iterate } from "../iterate.js";
function isDefined(input) {
    return (input !== null && input !== undefined && !Number.isNaN(input));
}
export class Inventory {
    constructor(array, inventory) {
        /**
         * @type {ItemStack[]}
         */
        this.array = array;
        /**
         * @type {Container}
         */
        this.container = inventory;
    }
    iterate(callback) {
        if (!(callback instanceof Function))
            throw new Error('Not a function at args[0]');
        const thisInv = this;
        this.array.forEach((item, i) => {
            const newItem = callback(this.container.getSlot(i), i);
            this.array[i] = item;
            if (newItem === undefined)
                return;
            this.container.setItem(i, (newItem === null) ? undefined : newItem);
        });
    }
    ;
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
    }
    ;
}
export class Players {
    constructor() {
        this.baseIterate = new Iterate(() => this.basePlayerIterator.array());
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
            if (!global.refreshBasePlayerIterator)
                return;
            // content.chatFormat({ test: global.refreshBasePlayerIterator });
            playersObject.refreshBasePlayerIterator();
            global.refreshBasePlayerIterator = false;
        });
        world.afterEvents.playerLeave.subscribe(() => {
            playersObject.refreshBasePlayerIterator();
        });
    }
    next() {
        return this.baseIterate.next();
    }
    getIterator(entityQueryOptions, cache = true, dimension) {
        return new Iterate(() => this.get(entityQueryOptions, cache, dimension).array());
    }
    refreshBasePlayerIterator() {
        this.basePlayerIterator = new PlayerIterator(loads.players);
        this.playerQueryIterators = {};
        // content.chatFormat({ t: 8938923832, basePlayerIterator: this.basePlayerIterator });
    } /**
     * @param {import('@minecraft/server').EntityQueryOptions} entityQueryOptions
     * @param {boolean} cache
     * @returns {Player}
     */
    find(entityQueryOptions, cache) {
        return this.get(entityQueryOptions, cache).array()[0];
    }
    getById(id) {
        return loads?.players?.[id];
    }
    ;
    get(entityQueryOptions, cache = true, dimension) {
        let worldPlayers;
        if (!entityQueryOptions && !dimension)
            return this.basePlayerIterator; //this.basePlayerIterator;
        if (!cache) {
            worldPlayers = ((dimension) ? dimension.getPlayers(entityQueryOptions) : world.getPlayers(entityQueryOptions)).map((({ id }) => id));
            const playerObject = {};
            Object.entries(loads.players).filter(([id]) => worldPlayers.includes(id)).forEach(([id, player]) => {
                playerObject[id] = player;
            });
            return new PlayerIterator(playerObject);
        }
        const key = JSON.stringify(entityQueryOptions) + ((dimension) ? `:${dimension.id}` : '');
        if (this.playerQueryIterators.hasOwnProperty(key))
            return this.playerQueryIterators[key];
        worldPlayers = ((dimension) ? dimension.getPlayers(entityQueryOptions) : world.getPlayers(entityQueryOptions)).map((({ id }) => id));
        const playerObject = {};
        Object.entries(loads.players).filter(([id]) => worldPlayers.includes(id)).forEach(([id, player]) => {
            playerObject[id] = player;
        });
        const playerIterator = new PlayerIterator(playerObject);
        this.playerQueryIterators[key] = playerIterator;
        const playerThis = this;
        if (!this.ranGarbage)
            this.ranGarbage = true, system.run(() => (playerThis.ranGarbage = false, playerThis.playerQueryIterators = {}));
        return playerIterator;
    }
    getInventory(player) {
        const { id } = player;
        if (this.inventorys.hasOwnProperty(id))
            return this.inventorys[id].container;
        this.inventorys[id] = {};
        const inventory = player.getComponent('inventory').container;
        const container = [];
        const { size } = inventory;
        for (let i = 0; i < size; i++) {
            const item = inventory.getSlot(i);
            container.push(item);
        }
        this.inventorys[id].container = new Inventory(container, inventory);
        const playersObject = this;
        if (!this.ran)
            this.ran = true, system.run(() => (playersObject.inventorys = {}, playersObject.ran = false));
        return this.inventorys[id].container;
    }
    ;
    getRandomPlayer(entityQueryOptions) {
        const foundPlayers = this.get(entityQueryOptions).object();
        if (!foundPlayers)
            return;
        const ids = Object.keys(foundPlayers);
        const id = ids[Math.floor(Math.random() * ids.length)];
        return ({ id: foundPlayers[id] });
    }
}
//# sourceMappingURL=class.js.map