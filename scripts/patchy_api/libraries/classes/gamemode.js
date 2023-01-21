import { system, world, Player } from "@minecraft/server";
const gamemodes = [0, 1, 2];
class Gamemode {
	constructor() {
		this.players = {};
		this.refreshed = false;
	}
	/**
	 * @param {Player} player 
	 */
	get(player) {
		if (!this.refreshed) this.refreshAll(), this.refreshed = true;
		const { id } = player;
		return this.players[id];
	}
	/**
	 * @private 
	 */
	refreshAll() {
		let currentLength = 0;
		const playerLength = world.getAllPlayers().length;
		this.players = {};
		gamemodes.forEach(gamemode => {
			if (currentLength === playerLength) return;
			world.getPlayers({ gameMode: gamemode }).forEach(({ id }) => this.players[id] = gamemode);
			currentLength += ids.length;
		});
		const thisGamemode = this;
		system.run(() => thisGamemode.refreshed = false);
	}


}
const gamemode = new Gamemode;
export default gamemode;