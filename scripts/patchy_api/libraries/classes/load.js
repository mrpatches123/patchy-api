import { world } from "@minecraft/server";

const content = {
	warn(...messages) {
		console.warn(messages.map(message => JSON.stringify(message, (key, value) => (value instanceof Function) ? '<f>' : value)).join(' '));
	}
};

class Loads {
	constructor() {
		this.loads = {};
		world.events.playerJoin.subscribe(({ player, playerId }) => {
			if (!player) player = world.getAllPlayers().find(({ id }) => id === playerId);

			this.awaitLoad(player);
		});
		world.events.worldInitialize.subscribe(() => {
			this.loads = {};
			world.getAllPlayers().forEach(player => {
				content.warn('Loads', player.name);
				this.awaitLoad(player);
			});
		});
		world.events.playerLeave.subscribe(() => {
			const oldIds = Object.keys(this.loads);
			const currentIds = world.getAllPlayers().map(({ id }) => id);
			const leftIds = oldIds.filter(oldId => !currentIds.some((currentId) => currentId === oldId));
			leftIds.forEach(id => delete this.loads[id]);
		});
	}
	async awaitLoad(player) {
		try {


			const { id, name } = player;
			const date = (new Date()).getTime();

			while (true) {
				let bool = true;
				await player.runCommandAsync("testfor @s").catch(() => bool = false);
				content.warn({ name, bool, sec: ((new Date()).getTime() - date) / 1000 });
				if (bool) break;
			}
			this.loads[id] = player;
		} catch (error) {
			console.warn(error, error.stack);
		}
	}
	get players() {
		return this.loads;
	}
}
const loads = new Loads();
export default loads;