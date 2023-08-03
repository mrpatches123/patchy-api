// import { Block, Container, BlockLocation, world } from '@minecraft/server';
// import { eventBuilder, global, content, native, overworld } from '../../patchy_api/modules.js';
// const content = {
// 	warn(...messages) {
// 		console.warn(messages.map(message => JSON.stringify(message, (key, value) => (value instanceof Function) ? '<f>' : value)).join(' '));
// 	}
// };
// async function guessTheNumber(condition, maxAmount) {
// 	try {
// 		const dividend = maxAmount / 2;
// 		let currentNumber = dividend;
// 		let lastCondition;
// 		let iterations = Math.ceil(Math.log2(maxAmount) + maxAmount / 22000);
// 		for (let i = 0; i < iterations; i++) {
// 			const divsor = 2 ** i;
// 			const guess = (lastCondition === undefined) ? currentNumber : (lastCondition) ? currentNumber - dividend / divsor : currentNumber + dividend / divsor;
// 			lastCondition = Boolean(await condition(guess));
// 			content.warn({ i, guess, lastCondition });
// 			currentNumber = guess;
// 		}
// 		return currentNumber;
// 	} catch (error) {
// 		console.warn('guessTheNumber', error, error.stack);
// 	}
// }
// /**
//  *
//  * @param {Player} player
//  * @param {Number} testLevel
//  * @returns
//  */
// async function testXpLevel(player, testLevel) {
// 	try {


// 		let bool = false;
// 		await player.runCommandAsync(`testfor @s[lm=${testLevel}]`).catch(() => { bool = true; });
// 		content.warn({ testLevel, bool });
// 		return bool;
// 	} catch (error) {
// 		console.warn('testXpLevel', error, error.stack);
// 	}
// }

// (function () {
// 	try {
// 		let players;
// 		players = [...world.getPlayers({ minLevel: 3000 })];
// 		world.sendMessage('minLevel: 3000\n' + JSON.stringify({ map: players.map(({ name }) => name) }));
// 		players = [...world.getPlayers({ minLevel: 5750 })];
// 		world.sendMessage('minLevel: 5750\n' + JSON.stringify({ map: players.map(({ name }) => name) }));
// 		// const player = world.getAllPlayers()[0];

// 		// const test = await guessTheNumber(async (guess) => {
// 		// 	return await guess >= 2037 + 1;
// 		// }, 24000);
// 		// const xp = await guessTheNumber(async (guess) => {
// 		// 	return await testXpLevel(player, Math.floor(await guess + 1));
// 		// }, 24000);
// 		// content.warn({ test: test | 0, level: Math.round(xp) });
// 	} catch (error) {
// 		console.warn('func', error, error.stack);
// 	}
// })();
// eventBuilder.subscribe('update_test', {
// 	playerJoined: ({ player }) => {
// 		/**
// 		 * @type {Block}
// 		 */
// 		const block = overworld.getBlock({x: 209, y:  104 z:  287));
// 		/**
// 		 * @type {Container}
// 		 */
// 		const container = block.getComponent('minecraft:inventory').container;
// 		content.warn({ size: container.size });
// 	}
// });