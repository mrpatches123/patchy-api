;


import config from '../config.js';
import { positionBuilder, commandBuilder } from "../../patchy_api/modules.js";
const { commandPrefix: prefix } = config;
commandBuilder.register('position', {
	description: "Used to print positionBuilder",
	usages: [
		`${prefix}positionBuilder`,
	],
	prefix,
	requires: {
		score: {
			staff: 1
		}
	},
	aliases: ['pos'],
	callback: (sender, args) => {
		sender.sendMessage(JSON.stringify(positionBuilder, (key, value) => (value instanceof Function) ? '<f>' : value, 4));

	}
});