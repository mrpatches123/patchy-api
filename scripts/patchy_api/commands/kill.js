

import config from '../config.js';

import { commandBuilder, formBuilder } from '../modules.js';

const { commandPrefix: prefix } = config;

commandBuilder.register('kill', {
	description: "kill",
	usages: [
		`${prefix}kill`,
	],
	requires: {
		score: {
			staff: 1
		}
	},
	prefix,
	aliases: ['k'],
	callback: (sender, args) => {
		sender.kill();
	}
});