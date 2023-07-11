import { ItemStack, Container, EntityQueryOptions } from "@minecraft/server";
import { Player } from "../player/class.js";
class Inventory {
	constructor(array: ItemStack[], inventory: Container);
	iterate(callback: (item: ItemStack, i: number) => {}): void;
}
class PlayerIterator {
	constructor(players: { [id: string]: Player; });
	readonly count: number;
	iterate(callback: (player: Player, i: number) => {}): void;
	array(): Player[];
	object(): { [id: String]: Player; };
	ids(): String[];
	names(): String[];
	[Symbol.iterator](): Iterator<ItemStack, ItemStack, ItemStack>;

}
interface propertyOptionsString {
	maxLength: Number;
	type: 'string';
}
interface propertyOptionsNumberBoolean {
	type: 'boolean' | 'number';
}
export class Players {
	constructor();
	getById(id: string): Player;
	/**
	 * finds the first player accorinf to the option or just the first player
	 */
	find(entityQueryOptions: EntityQueryOptions, cache = true): Player;
	/**
	 * gets players that are loaded meaning they can have commands ran them and caches entity querys by default per tick for perfornace
	 */
	get(entityQueryOptions: EntityQueryOptions, cache = true): PlayerIterator;
	/**
	 * gets the inventory of the player
	 */
	getInventory(player: Player): Inventory;
	/**
	 * gets a random player that is loaded meaning they can have commands ran them and and caches entity querys by default per tick for perfornace
	 */
	getRandomPlayer(entityQueryOptions: EntityQueryOptions): Player;
	/**
	 * gets a dynamic property which caching so make sure to only set it with in the class
	 */
	getProperty(player: Player, identifier: string, forceDisk = false): string | number | boolean | undefined;
	/**
	 * gets a dynamic property which caching so make sure to only set it with in the class
	 */
	setProperty(player: Player, identifier: string, value: string | number | boolean): void;
	resetProperty(player: Player, identifier: string, value: string | number | boolean): void;
	registerProperty(identifier: string, options: propertyOptionsString | propertyOptionsNumberBoolean): void;
}
export class Inventory {
	constructor(array: ItemStack[], inventory: Container);
	iterate(callback: (item: ItemStack, i: Number) => {}): void;
}
