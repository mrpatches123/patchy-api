
import { commandBuilder, players } from '../modules.js';
import config from '../config.js';
const { commandPrefix: prefix } = config;
commandBuilder.register('unban', {
	description: "Used to unban a player",
	usages: [
		`${prefix}unban add playerName`,
		`${prefix}unban remove playerName`
	],
	prefix,
	requires: {
		score: {
			staff: 1
		}
	},
	callback: (sender, args) => {
		const [subcommand, playerName] = args;
		switch (subcommand) {
			case 'add': {
				if (unbannWindows.includes(playerName)) return sender.sendMessage(`You already opened an unban window for $playerName}!`);
				global.unbanWindows.push(playerName);
				return sender.sendMessage(`You opened an unban window for ${playerName}!`);
			} case 'remove': {
				if (!global.unbanWindows.includes(playerName)) return sender.sendMessage(`You have not opened an unban window for $playerName}!`);
				global.unbanWindows = global.unbanWindows.filter(name => name !== playerName);
				return sender.sendMessage(`You removed an unban window for ${playerName}!`);
			}
		}
	}
});