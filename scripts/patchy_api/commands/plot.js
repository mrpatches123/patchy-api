import { players, commandBuilder, native, content, plotBuilder, andArray, isDefined } from "../modules.js";

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
		let [plotKey, subCommand, playerName, plotNumberToSet] = args;
		if (!plotKey) return sender.tell(JSON.stringify(plotBuilder, (key, value) => (value instanceof Function) ? '<f>' : value, 4));
		if (!plotBuilder.plots.hasOwnProperty(plotKey)) return sender.tell(`plotKey: ${plotKey}, does not exist`);
		const player = players.get({ name: playerName }).array()[0];
		if (!player) return sender.tell(`player: ${playerName}, does not exist`);
		switch (subCommand) {
			case 'add': {
				const { wasAdded, plotNumber, full } = plotBuilder.add(player, plotKey);
				if (full) return sender.tell(`${plotKey} is full`);
				if (wasAdded) return sender.tell(`${playerName} was added to ${plotKey} at ${plotNumber}`);
				return sender.tell(`${playerName} aready has plot Number: ${plotNumber}`);
			} case 'remove': {
				const bool = plotBuilder.remove(player, plotKey);
				if (!bool) return sender.tell(`${playerName} is not on ${plotKey}`);
				return sender.tell(`${playerName} was removed from ${plotKey}`);
			} case 'query': {
				return sender.tell(`${playerName} on ${plotKey} has a plotNumber of ${plotBuilder.query(player, plotKey)} and currentPlot: ${player.properties.currentPlot}`);
			} case 'set': {
				plotNumberToSet = Number(plotNumberToSet);
				if (Number.isNaN(plotNumberToSet)) return sender.tell(`plotNumber: ${plotNumberToSet}, is not of type: Number!`);

				const { wasAdded, full, plotNumber } = plotBuilder.add(player, plotKey, plotNumberToSet);
				if (full) return sender.tell(`${plotKey} is full`);
				if (!wasAdded && plotNumber !== plotNumberToSet) return sender.tell(`${playerName} on ${plotKey} already has plot Number ${plotNumber}`);
				if (!wasAdded) return sender.tell(`${playerName} on ${plotKey} could not be set to a plotNumber of ${plotNumber} as it is taken.`);

				return sender.tell(`${playerName} on ${plotKey} now has a plotNumber of ${plotNumber}`);
			} case 'list': {
				const { currentIndex, availablePlots } = plotBuilder.list(plotKey);
				return sender.tell(`${plotKey} at currentIndex: ${currentIndex}, has the following available plotNumbers: ${andArray(availablePlots)}`);
			} case 'reset': {
				plotBuilder.reset(plotKey);
				return sender.tell(`${plotKey} has been reet and now has the following available plotNumbers: ${andArray(plotBuilder.list(plotKey))}`);
			}
		}

	}
});