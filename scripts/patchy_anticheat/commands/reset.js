

import config from '../config.js';
import global from '../../patchy_api/libraries/classes/global.js';
import commandBuilder from "../../patchy_api/libraries/classes/commands.js";
import databases from '../../patchy_api/libraries/classes/database.js';

import { Player } from '@minecraft/server';
import { content, overworld, andArray, staff } from '../../patchy_api/libraries/utilities.js';
import { scoreboardsNames } from '../plugins/initialization/initialize.js';
import discipline from '../libraries/discipline.js';
const { isInteger } = Number;



const { commandPrefix: prefix } = config;

commandBuilder.register('reset', {
	prefix,
	description: "resets player flags and kicks",
	usages: [
		`${prefix}resetflags <playerName>`,
	],
	requires: {
		score: {
			staff: 1
		}
	},
	callback: (sender, args) => {

		const playerFound = global.players.find(({ name }) => name === args[0]);
		if (playerFound) {

			scoreboardsNames.forEach((key, objective) => {
				playerFound.scoreSet(objective);
			});
			playerFound.scoreSet('kicks');
			discipline.notify(sender, `reset ${args[0]}'s flags and kicks`);
		} else {
			sender.tellraw(`Player: ${args[0]} not found!`);
		}
	}
});
