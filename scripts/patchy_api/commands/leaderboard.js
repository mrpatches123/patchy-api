import config from '../config.js';
import { world } from "@minecraft/server";
import { content, relativeParse, leaderboardBuilder, commandBuilder } from "../modules.js";

const { commandPrefix: prefix } = config;
//!lb create offline ~* ~* ~* prestige 10 "§dAll Time Presteige Leaderboard§r" "§9#${#} §7${name} - §1${score*f}§r"
//!lb update offline ~* ~* ~* prestige 10 "§dAll Time Presteige Leaderboard§r" "§9#${#} §7${name} - §1${score*f}§r"

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
		content.warn(args);
		const [subCommand] = args;
		if (!subCommand) return sender.sendMessage(`§csubCommand, ${subCommand}, is not defined`);
		const params = args.slice(1);


		switch (subCommand) {
			case 'print': {
				world.sendMessage(JSON.stringify(leaderboardBuilder, null, 4));
				break;
			}
			// case 'create': {

			// 	let [onlineOffine, x, y, z, objective, maxLength, title, ...format] = params;
			// 	format = format.join('');
			// 	x = relativeParse(sender, x, 'x');
			// 	y = relativeParse(sender, y, 'y');
			// 	z = relativeParse(sender, z, 'z');
			// 	maxLength = (maxLength) ? Number(maxLength) | 0 : undefined;
			// 	if (onlineOffine !== 'online' && onlineOffine !== 'offline') sender.sendMessage(`§cparam[0], ${args[1]}, is not offline or online!`);
			// 	if (typeof y !== 'number') return sender.sendMessage(`cparam[1], ${args[2]}, is not a number that represents the y coordinate!`);
			// 	if (typeof z !== 'number') return sender.sendMessage(`§cparam[2], ${args[3]}, is not a number that represents the z coordinate!`);
			// 	if (typeof x !== 'number') return sender.sendMessage(`§cparam[3], ${args[4]}, is not a number that represents the x coordinate!`);
			// 	if (!world.scoreboard.getObjective(objective)) return sender.sendMessage(`§cparam[4], ${args[5]}, is an scoreboard objective which does not exist!`);
			// 	if (maxLength && typeof maxLength !== 'number' && maxLength > 0) return sender.sendMessage(`§cparam[5], ${args[6]}, is defined and is not a whole number that represents the max length!`);
			// 	if (format && !format.includes('${score}') && !format.includes('${score*f}')) return sender.sendMessage(`§cparam[7], ${args[8]}, is defined and does not have \${score} or \${score*f}, so the system doesn't know where to put the player's score!`);
			// 	if (format && !format.includes('${name}')) return sender.sendMessage(`§cparam[7], ${args[8]}, is defined and does not have \${name}, so the system doesn't know where to put the player's name!`);

			// 	switch (onlineOffine) {
			// 		case 'online': {
			// 			leaderboardBuilder.createOnline({ x, y, z }, objective, maxLength, title, format);
			// 			break;
			// 		} case 'offline': {
			// 			leaderboardBuilder.createOffine({ x, y, z }, objective, maxLength, title, format);
			// 			break;
			// 		}
			// 	}
			// 	// content.warn({ onlineOffine, x, y, z, objective, maxLength, title, format });

			// 	break;
			// } case 'delete': {
			// 	let [x, y, z] = params;
			// 	x = relativeParse(sender, x, 'x');
			// 	y = relativeParse(sender, y, 'y');
			// 	z = relativeParse(sender, z, 'z');
			// 	if (typeof y !== 'number') return sender.sendMessage(`§cparam[1], ${args[2]}, is not a number that represents the y coordinate!`);
			// 	if (typeof z !== 'number') return sender.sendMessage(`§cparam[2], ${args[3]}, is not a number that represents the z coordinate!`);
			// 	if (typeof x !== 'number') return sender.sendMessage(`§cparam[3], ${args[4]}, is not a number that represents the x coordinate!`);
			// 	leaderboardBuilder.delete({ x, y, z });
			// 	break;
			// } case 'update': {
			// 	let [onlineOffine, x, y, z, objective, maxLength, title, format] = params;

			// 	x = relativeParse(sender, x, 'x');
			// 	y = relativeParse(sender, y, 'y');
			// 	z = relativeParse(sender, z, 'z');
			// 	maxLength = (maxLength) ? Number(maxLength) | 0 : undefined;
			// 	if (onlineOffine !== 'online' && onlineOffine !== 'offline') sender.sendMessage(`§cparam[0], ${args[1]}, is not offline or online!`);
			// 	if (typeof y !== 'number') return sender.sendMessage(`§cparam[1], ${args[2]}, is not a number that represents the y coordinate!`);
			// 	if (typeof z !== 'number') return sender.sendMessage(`§cparam[2], ${args[3]}, is not a number that represents the z coordinate!`);
			// 	if (typeof x !== 'number') return sender.sendMessage(`§cparam[3], ${args[4]}, is not a number that represents the x coordinate!`);
			// 	if (!world.scoreboard.getObjective(objective)) return sender.sendMessage(`§cparam[4], ${args[5]}, is an scoreboard objective which does not exist!`);
			// 	if (maxLength && typeof maxLength !== 'number' && maxLength > 0) return sender.sendMessage(`§cparam[5], ${args[6]}, is defined and is not a whole number that represents the max length!`);
			// 	if (format && !format.includes('${score}') && !format.includes('${score*f}')) return sender.sendMessage(`§cparam[7], ${args[8]}, is defined and does not have \${score} or \${score*f}, so the system doesn't know where to put the player's score!`);
			// 	if (format && !format.includes('${name}')) return sender.sendMessage(`§cparam[7], ${args[8]}, is defined and does not have \${name}, so the system doesn't know where to put the player's name!`);
			// 	switch (onlineOffine) {
			// 		case 'online': {
			// 			onlineOffine = true;
			// 			break;
			// 		} case 'offline': {
			// 			onlineOffine = false;
			// 			break;
			// 		}
			// 	}
			// 	leaderboardBuilder.update(onlineOffine, { x, y, z }, objective, maxLength, title, format);
			// 	break;
			// }
		}
	}
});