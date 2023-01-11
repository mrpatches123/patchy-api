import { players, commandBuilder, native, content, plotBuilder, andArray } from "../modules.js";

import config from '../config.js';
const { commandPrefix: prefix } = config;
commandBuilder.register('plot', {
	description: "Used to add and remove plots",
	usages: [
		`${prefix}plot`,
		`${prefix}plot plotKey add playerName`,
		`${prefix}plot plotKey remove playerName`,
		`${prefix}plot plotKey set playerName plotNumber`,
		`${prefix}plot plotKey query playerName`,
		`${prefix}plot plotKey list`,
	],
	prefix,
	requires: {
		score: {
			staff: 1
		}
	},
	callback: (sender, args) => {
		content.warn({ args });
		const [plotKey, subCommand, playerName, plotNumber] = args;
		if (!plotKey) return sender.tell(JSON.stringify(plotBuilder, (key, value) => (value instanceof Function) ? '<f>' : value, 4));
		if (!plotBuilder.plots.hasOwnProperty(plotKey)) return sender.tell(`plotKey: ${plotKey}, does not exist`);
		const player = players.get({ name: playerName }).array()[0];
		if (!player) return sender.tell(`player: ${playerName}, does not exist`);
		switch (subCommand) {
			case 'add': {
				plotBuilder.add(player, plotKey);
				return sender.tell(`${playerName} was added to ${plotKey}`);
			} case 'remove': {
				const bool = plotBuilder.remove(player, plotKey);
				if (!bool) return sender.tell(`${playerName} is not on ${plotKey}`);
				return sender.tell(`${playerName} was removed from ${plotKey}`);
			} case 'query': {
				return sender.tell(`${playerName} on ${plotKey} has a plotNumber of ${plotBuilder.query(player, plotKey)}`);
			} case 'set': {
				const set = plotBuilder.set(player, key, plotNumber);
				if (!set) return sender.tell(`${playerName} on ${plotKey} could not be set to a plotNumber of ${plotNumber} as it is taken.`);
				return sender.tell(`${playerName} on ${plotKey} now has a plotNumber of ${plotNumber}`);
			} case 'list': {
				return sender.tell(`${plotKey} has the following available plotNumbers: ${andArray(plotBuilder.list(plotKey))}`);
			} case 'reset': {
				plotBuilder.reset(plotKey);
				return sender.tell(`${plotKey} has been reet and now has the following available plotNumbers: ${andArray(plotBuilder.list(plotKey))}`);
			}
		}

	}
});;;;;;