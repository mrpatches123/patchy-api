
import commandBuilder from "../libraries/classes/commands.js";
import leaderboardBuilder from '../libraries/classes/leaderboard.js';
import config from '../config.js';
import { world } from "@minecraft/server";
import { content } from "../modules.js";

const { commandPrefix: prefix } = config;
function relativeParse(player, input, direction) {
	if (input.includes('~')) {
		if (input.endsWith('*')) {
			return ((player.location[direction] + Number(input.replace(/[*~]/g, ''))) | 0) + 0.5;
		} else {
			return player.location[direction] + Number(input.replace('~', ''));
		}
	} else {
		return Number(input);
	}
}
commandBuilder.register('leaderboard', {
	description: "Used update, delete and add a ",
	usages: [
		`${prefix}leaderboard create <offline || online> <x: number> <y: number> <z: number> <objective: string> <maxLength: number - default?=10> <title: string - default?=""> <format: string - default?="\${#} \${name} - \${score}">`,
		`${prefix}leaderboard update <offline || online> <x: number> <y: number> <z: number> <objective: string> <maxLength: number - default?=10> <title: string - default?=""> <format: string - default?="\${#} \${name} - \${score}">`,
		`${prefix}leaderboard delete <x: number> <y: number> <z: number>`,

	],
	prefix,
	requires: {
		score: {
			staff: 1
		}
	},
	aliases: ['lb'],
	callback: (sender, args) => {
		const params = args.slice(1);


		switch (args[0]) {
			case 'print': {
				world.say(JSON.stringify(leaderboardBuilder, null, 4));
				break;
			}
			case 'create': {

				let [onlineOffine, x, y, z, objective, maxLength, title, format] = params;

				x = relativeParse(sender, x, 'x');
				y = relativeParse(sender, y, 'y');
				z = relativeParse(sender, z, 'z');
				maxLength = (maxLength) ? Number(maxLength) | 0 : undefined;
				if (onlineOffine !== 'online' && onlineOffine !== 'offline') sender.tell(`§cparam[0], ${args[1]}, is not offline or online!`);
				if (typeof y !== 'number') return sender.tell(`§cparam[1], ${args[2]}, is not a number that represents the y coordinate!`);
				if (typeof z !== 'number') return sender.tell(`§cparam[2], ${args[3]}, is not a number that represents the z coordinate!`);
				if (typeof x !== 'number') return sender.tell(`§cparam[3], ${args[4]}, is not a number that represents the x coordinate!`);
				if (!world.scoreboard.getObjective(objective)) return sender.tell(`§cparam[4], ${args[5]}, is an scoreboard objective which does not exist!`);
				if (maxLength && typeof maxLength !== 'number' && maxLength > 0) return sender.tell(`§cparam[5], ${args[6]}, is defined and is not a whole number that represents the max length!`);
				if (format && !format.includes('${score}') && !format.includes('${score*f}')) return sender.tell(`§cparam[7], ${args[8]}, is defined and does not have \${score} or \${score*f}, so the system doesn't know where to put the player's score!`);
				if (format && !format.includes('${name}')) return sender.tell(`§cparam[7], ${args[8]}, is defined and does not have \${name}, so the system doesn't know where to put the player's name!`);

				switch (onlineOffine) {
					case 'online': {
						leaderboardBuilder.createOnline({ x, y, z }, objective, maxLength, title, format);
						break;
					} case 'offline': {
						leaderboardBuilder.createOffine({ x, y, z }, objective, maxLength, title, format);
						break;
					}
				}
				// content.warn({ onlineOffine, x, y, z, objective, maxLength, title, format });

				break;
			} case 'delete': {
				let [x, y, z] = params;
				x = relativeParse(sender, x, 'x');
				y = relativeParse(sender, y, 'y');
				z = relativeParse(sender, z, 'z');
				if (typeof y !== 'number') return sender.tell(`§cparam[1], ${args[2]}, is not a number that represents the y coordinate!`);
				if (typeof z !== 'number') return sender.tell(`§cparam[2], ${args[3]}, is not a number that represents the z coordinate!`);
				if (typeof x !== 'number') return sender.tell(`§cparam[3], ${args[4]}, is not a number that represents the x coordinate!`);
				leaderboardBuilder.delete({ x, y, z });
				break;
			} case 'update': {
				let [onlineOffine, x, y, z, objective, maxLength, title, format] = params;

				x = relativeParse(sender, x, 'x');
				y = relativeParse(sender, y, 'y');
				z = relativeParse(sender, z, 'z');
				maxLength = (maxLength) ? Number(maxLength) | 0 : undefined;
				if (onlineOffine !== 'online' && onlineOffine !== 'offline') sender.tell(`§cparam[0], ${args[1]}, is not offline or online!`);
				if (typeof y !== 'number') return sender.tell(`§cparam[1], ${args[2]}, is not a number that represents the y coordinate!`);
				if (typeof z !== 'number') return sender.tell(`§cparam[2], ${args[3]}, is not a number that represents the z coordinate!`);
				if (typeof x !== 'number') return sender.tell(`§cparam[3], ${args[4]}, is not a number that represents the x coordinate!`);
				if (!world.scoreboard.getObjective(objective)) return sender.tell(`§cparam[4], ${args[5]}, is an scoreboard objective which does not exist!`);
				if (maxLength && typeof maxLength !== 'number' && maxLength > 0) return sender.tell(`§cparam[5], ${args[6]}, is defined and is not a whole number that represents the max length!`);
				if (format && !format.includes('${score}') && !format.includes('${score*f}')) return sender.tell(`§cparam[7], ${args[8]}, is defined and does not have \${score} or \${score*f}, so the system doesn't know where to put the player's score!`);
				if (format && !format.includes('${name}')) return sender.tell(`§cparam[7], ${args[8]}, is defined and does not have \${name}, so the system doesn't know where to put the player's name!`);
				switch (onlineOffine) {
					case 'online': {
						onlineOffine = true;
						break;
					} case 'offline': {
						onlineOffine = false;
						break;
					}
				}
				leaderboardBuilder.update(onlineOffine, { x, y, z }, objective, maxLength, title, format);
				break;
			}
		}
	}
});