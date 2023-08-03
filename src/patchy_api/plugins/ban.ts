import { eventBuilder, players, global } from "../modules.js";
global.unbanWindows = [];
eventBuilder.subscribe('ban*api', {
	tickAfterLoad: () => {
		players.get({ tags: ['ban'] }).iterate(player => {
			const { name } = player;
			if (global.unbanWindows.includes(name)) return global.unbanWindows = global.unbanWindows.filter(name => name !== playerName), player.removeTag('ban');
			player.runCommandAsync(`kick "${player.name}" You are banned!`).catch(error => console.warn(error, error.stack));
		});
	}
});