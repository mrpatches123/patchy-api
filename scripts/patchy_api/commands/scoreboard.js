import config from '../config.js';

const { commandPrefix: prefix } = config;



import { commandBuilder, content, native, players, scoreboardBuilder } from '../../patchy_api/modules.js';
import { world } from '@minecraft/server';

commandBuilder.register('scoreboard', {
	description: "Used to modify scoreboards",
	usages: [
		`${prefix}scoreboard`,
		`${prefix}scoreboard add objectve player? value?`,
		`${prefix}scoreboard set objectve player? value?`,
		`${prefix}scoreboard reset objectve player?`,
		`${prefix}scoreboard add objectve player? value?`,
	],
	requires: {
		score: {
			staff: 1
		}
	},
	prefix,
	aliases: ['sb'],
	callback: (sender, args) => {
		const [subcommand, objective, playerName, value = 0] = args;
		const number = Number(value);
		content.warn({ subcommand, objective, playerName, number, value });
		if (!subcommand) return sender.tell(`subcommand at params[1] is not defined`);
		if (!objective && subcommand !== 'print') return sender.tell(`objective at params[1] is not defined`);
		let player;
		if (playerName) {
			player = players.find({ name: playerName });
			if (!player) return sender.tell(`player: ${playerName}, at params[2] does not exist!`);
			if (!Number.isInteger(number)) return sender.tell(`value: ${playerName}, at params[3] id not defined!`);
		}
		switch (subcommand) {
			case 'print': {
				sender.tell(JSON.stringify(scoreboardBuilder, (key, value) => (value instanceof Function) ? '<f>' : value, 4));
				break;
			} case 'add': {
				if (!playerName) return (scoreboardBuilder.add(objective), sender.tell(`you added the scoreboard objective: ${objective}`));
				const score = scoreboardBuilder.get(player, objective);
				scoreboardBuilder.set(player, objective, score + number);
				break;
			} case 'set': {
				sender.tell(`you set ${player.name}'s score for objective: ${objective}, to score: ${number}!`);
				scoreboardBuilder.set(player, objective, number);
				break;
			} case 'reset': {
				scoreboardBuilder.set(player, objective, undefined);
				break;
			} case 'remove': {
				// if (!playerName) return (scoreboardBuilder.remove(objective), sender.tell(`you removed the scoreboard objective: ${objective}`));
				// scoreboardBuilder.set(player, objective, undefined);
				break;
			} case 'testraw': {
				sender.tell(`player: ${player.name}, has score: ${scoreboardBuilder.get(player, objective, true)}, for objective: ${objective}!`);
				break;
			}

		}
	}
});


// not required
// just change the "sender.message" to something else


// command stuff
