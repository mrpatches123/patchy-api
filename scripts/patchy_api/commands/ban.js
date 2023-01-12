
import { commandBuilder, players } from '../modules.js';
import config from '../config.js';
const { commandPrefix: prefix } = config;
commandBuilder.register('ban', {
	description: "Used to ban a player",
	usages: [
		`${prefix}ban playerName`,
	],
	prefix,
	requires: {
		score: {
			staff: 1
		}
	},
	callback: (sender, args) => {
		const [playerName] = args;
		const player = [...world.getPlayers({ name: playerName })][0];
		if (!player) return sender.tell(`player: ${playerName}, does not exist!`);
		sender.tell(`You banned ${player.name}`);
		player.addTag('ban');
	}
});