import { world, Player as PlayerType } from "@minecraft/server";
import { Player } from './player/class.js';
import global from "./global.js";
const content = {
	warn(...messages: any[]) {
		console.warn(messages.map(message => JSON.stringify(message, (key, value) => (value instanceof Function) ? '<f>' : value)).join(' '));
	}
};

class Loads {
	public loads: { [playerId: string]: Player; };
	loaded: boolean;
	constructor() {
		this.loads = {} as typeof this.loads;
		this.loaded = false;
		world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
			if (!initialSpawn) return;
			this.awaitLoad(player);
		});
		world.afterEvents.worldInitialize.subscribe(() => {
			this.loads = {};
			world.getAllPlayers().forEach(player => {
				content.warn('Loads', player.name);
				this.awaitLoad(player);
			});
		});
		world.afterEvents.playerLeave.subscribe(() => {
			const oldIds = Object.keys(this.loads);
			const currentIds = world.getAllPlayers().map(({ id }) => id);
			const leftIds = oldIds.filter(oldId => !currentIds.some((currentId) => currentId === oldId));
			leftIds.forEach(id => delete this.loads[id]);
		});
	}
	async awaitLoad(player: PlayerType) {
		try {


			const { id, name } = player;
			const date = (new Date()).getTime();

			while (true) {
				let bool = true;
				await player.runCommandAsync("testfor @s").catch(() => bool = false);
				if (bool) break;
			}
			this.loaded = true;
			global.refreshBasePlayerIterator = true;
			this.loads[id] = new Player(player);
		} catch (error: any) {
			console.warn(error, error.stack);
		}
	}
	get players() {
		return this.loads;
	}
}
const loads = new Loads();
export default loads;