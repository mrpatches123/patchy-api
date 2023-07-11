import { system, world, Player } from "@minecraft/server";
export const gamemodeMap = {
	survival: 0,
	creative: 1,
	adventure: 2,
	spectator: 5
};
export const gamemodeIndexMap = {
	0: 'survival',
	1: 'creative',
	2: 'adventure',
	5: 'spectator'
};
const gamemodes = Object.keys(gamemodeMap);

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
			const players = [...world.getPlayers({ gameMode: gamemode })];
			players.forEach(({ id }) => this.players[id] = gamemodeMap[gamemode]);
			currentLength += players.length;
		});
		const thisGamemode = this;
		system.run(() => thisGamemode.refreshed = false);
	}


}
const gamemode = new Gamemode;
export default gamemode;

