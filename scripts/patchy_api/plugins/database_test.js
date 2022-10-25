// import { content, eventBuilder, databases, global, native } from '../modules.js';
// async function isPlayerLoaded(player) {
// 	try {

// 		const test = await player.runCommandAsync('scoreboard players test @s staff *');
// 		content.warn({ t: "3i33389", test: native.stringify(test) });

// 		return true;
// 	} catch (error) {
// 		console.warn(error);
// 		console.warn('not loafed');
// 		return false;
// 	}
// }
// eventBuilder.subscribe('databaseTest*API', {
// 	tickAfterLoad: ({ currentTick }) => {
// 		global.players.forEach((id, player) => {
// 			isPlayerLoaded(player);
// 		});
// 	}
// });