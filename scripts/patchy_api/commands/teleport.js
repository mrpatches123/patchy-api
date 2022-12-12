
import config from '../config.js';
import { teleportBuilder, commandBuilder } from "../../patchy_api/modules.js";
const { commandPrefix: prefix } = config;
commandBuilder.register('teleport', {
	description: "Used to teleport and print",
	usages: [
		`${prefix}teleport <key>`,
		`${prefix}teleport print`,
	],
	prefix,
	requires: {
		score: {
			staff: 1
		}
	},
	aliases: ['tp'],
	callback: (sender, args) => {
		switch (args) {
			case 'print':
				sender.tell(JSON.stringify(teleportBuilder, (key, value) => (value instanceof Function) ? '<f>' : value));
				break;
			default:
				if (!(teleportBuilder.hasOwnProperty(args[0]))) return player.tell(`teleport key: ${args[0]} at params[0] does not exist.`);
				teleportBuilder.teleport(player, args[0]);
				break;
		}
	}
});