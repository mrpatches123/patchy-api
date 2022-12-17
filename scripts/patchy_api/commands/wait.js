
import config from '../config.js';
import { wait, commandBuilder } from "../../patchy_api/modules.js";
const { commandPrefix: prefix } = config;
commandBuilder.register('wait', {
	description: "Used to teleport and print",
	usages: [
		`${prefix}wait`,
	],
	prefix,
	requires: {
		score: {
			staff: 1
		}
	},
	callback: (sender, args) => {
		sender.tell(JSON.stringify(wait, (key, value) => (value instanceof Function) ? '<f>' : value, 4));

	}
});