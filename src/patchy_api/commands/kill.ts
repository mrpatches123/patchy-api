

import config from '../config.js';

import { commandBuilder, formBuilder, players } from '../modules.js';

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
		const [name] = args;
		const player = players.get({ name }).array()[0];
		if (!name) return sender.kill();
		player!.tell(`you were killed by ${sender.name}`);
		player!.kill();

	}
});