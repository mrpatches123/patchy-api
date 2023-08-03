
import config from '../config.js';
import commandBuilder from "../libraries/classes/commands.js";
import { MinecraftItemTypes } from '@minecraft/server';
import { content } from '../libraries/utilities.js';
import time from '../libraries/classes/time.js';
const ItemIds = Object.values(MinecraftItemTypes).map(({ id }) => id);
const { commandPrefix: prefix } = config;
commandBuilder.register('echest', {
	description: "Used to get the contents of a players chests",
	usages: [
		`${prefix}echest`,
	],
	prefix,
	requires: {
		score: {
			staff: 1
		}
	},
	callback: (sender, args) => {
		time.start('echestTest');
		const items = Array.from(Array(27), (a, i) => {
			const foundId = ItemIds.find(itemId => {
				try {
					sender.runCommandAsync(`testfor @s[hasitem=[{slot=${i},location=slot.enderchest,item=${itemId}}]]`);
					return itemId;
				} catch (error) {
					// console.warn('foundId', itemId, error, error.stack);
				}
			});
			if (!foundId) return false;
			let current = 32;
			for (let b = 0; b < 6; b++) {
				try {
					sender.runCommandAsync(`testfor @s[hasitem=[{slot=${i},quantity=${current + 1}..,location=slot.enderchest,item=${foundId}}]]`);
					current = current + 32 / 2 ** (b + 1);
				} catch (error) {
					// console.warn(error)
					current = current - 32 / 2 ** (b + 1);
				}
			}
			const amount = Math.round(current);
			let data;
			for (let d = 0; d < 100; d++) { //data in hasitem is broke
				try {
					sender.runCommandAsync(`testfor @s[hasitem=[{slot=${i},location=slot.enderchest,item=${foundId},data=${d}}]]`);
					data = d;
					break;
				} catch (error) {
					//console.warn('',error, error.stack);
				}
			}
			return { id: foundId, amount, data, slot: i };
		});

		sender.sendMessage(JSON.stringify(items.filter(item => item), null, 4));
		sender.sendMessage(JSON.stringify({ time: time.end('echestTest') }));
	}
});


// function ln(n) {
// 	return Math.log1p(n - 1);
// }
// function guessTheNumber(num, max = 64) {
// 	const half = max / 2;
// 	let current = half;
// 	const iterations = ln(half) / ln(2) + 1;
// 	for (let i = 0; i < iterations; i++) {
// 		const mid = current;

// 		if (num >= mid) {
// 			current = current + half / 2 ** (i + 1);

// 		} else {
// 			current = current - half / 2 ** (i + 1);
// 		}
// 		//// console.log(num < mid, num, mid,current)
// 	}
// 	return Math.round(current);
// }
// // console.log(guessTheNumber(6723, 10000));