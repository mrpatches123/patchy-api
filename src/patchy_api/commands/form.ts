
import { commandBuilder, formBuilder } from '../modules.js';
import config from '../config.js';
const { commandPrefix: prefix } = config;

commandBuilder.register('forms', {
	description: "Used to get the Stringified value of forms",
	usages: [
		`${prefix}forms`,
	],
	prefix,
	requires: {
		score: {
			staff: 1
		}
	},
	callback: (sender, args) => {
		const [subcommand, key] = args;
		if (!key) return sender.sendMessage(JSON.stringify(formBuilder, (key, value) => (value instanceof Function) ? '<f>' : value, 4));
		if (!formBuilder.hasOwnProperty(key)) return sender.sendMessage(`Key: ${key}, doesn't exsist!`);
		switch (subcommand) {
			case 'print':
				sender.sendMessage(JSON.stringify(formBuilder.generateForm(sender, key), (key, value) => (value instanceof Function) ? '<f>' : value, 4));
				break;
			case 'show':
				formBuilder.showAwait(sender, key);
				break;
		}
	}
});