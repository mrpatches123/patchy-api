import { ItemStack, Container, Dimension, ContainerSlot, EntityQueryOptions } from "@minecraft/server";
import { Player } from "../player/class.js";
import { Iterate } from "../iterate.js";
export declare class Inventory {
    array: (ContainerSlot | undefined)[];
    container: Container;
    constructor(array: (ContainerSlot | undefined)[], inventory: Container);
    iterate(callback: (item: ContainerSlot, i: number) => (ItemStack | void | null)): void;
}
declare class PlayerIterator {
    players: {
        [playerId: string]: Player;
    };
    playerArray: Player[];
    playerLength: number;
    constructor(players: {
        [playerId: string]: Player;
    });
    get count(): number;
    iterate(callback: (player: Player, i: number) => any): void;
    array(): Player[];
    object(): {
        [playerId: string]: Player;
    };
    ids(): string[];
    names(): string[];
    [Symbol.iterator](): {
        next: () => {
            value: Player | undefined;
            done: boolean;
        };
    };
}
export declare class Players {
    objectProperties: Record<string, any>;
    inventorys: Record<string, {
        container: Inventory;
    }>;
    ran: boolean;
    memory: Record<string, any>;
    basePlayerIterator: PlayerIterator;
    ranGarbage: boolean;
    playerQueryIterators: Record<string, PlayerIterator>;
    baseIterate: Iterate<Player>;
    constructor();
    next(): Player;
    getIterator(entityQueryOptions?: EntityQueryOptions, cache?: boolean, dimension?: Dimension): Iterate<Player>;
    refreshBasePlayerIterator(): void; /**
     * @param {import('@minecraft/server').EntityQueryOptions} entityQueryOptions
     * @param {boolean} cache
     * @returns {Player}
     */
    find(entityQueryOptions?: EntityQueryOptions, cache?: boolean): Player | undefined;
    getById(id: string): Player | undefined;
    get(entityQueryOptions?: EntityQueryOptions, cache?: boolean, dimension?: Dimension): PlayerIterator;
    getInventory(player: Player): Inventory;
    getRandomPlayer(entityQueryOptions: EntityQueryOptions): {
        id: Player | undefined;
    } | undefined;
}
export {};
