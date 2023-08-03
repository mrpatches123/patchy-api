

import config from '../config.js';

import { commandBuilder, formBuilder, isDefined, players } from '../modules.js';

const { commandPrefix: prefix } = config;

commandBuilder.register('key', {
	description: "key",
	usages: [
		`${prefix}key`,
	],
	requires: {
		score: {
			staff: 1
		}
	},
	prefix,
	callback: (sender, args) => {
		const [key, name] = args;
		if (!name) {
			if (!isDefined(sender[key])) return sender.tell(`key: ${key}, does not exist on you!`);
			return sender.tell(JSON.stringify({ [key]: sender[key] }));
		}
		const player = players.get({ name }).array()[0];
		if (!isDefined(player[key])) return sender.tell(`key: ${key}, does not exist on ${player.name}!`);
		return sender.tell(JSON.stringify({ [key]: player[key] }));

	}
});