
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
		switch (args[0]) {
			case 'print':
				sender.tell(JSON.stringify(teleportBuilder, (key, value) => (value instanceof Function) ? '<f>' : value, 4));
				break;
			default:
				if (!(teleportBuilder.hasOwnProperty(args[0]))) return sender.tell(`teleport key: ${args[0]} at params[0] does not exist.`);
				teleportBuilder.teleport(sender, args[0]);
				break;
		}
	}
});