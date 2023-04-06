import { world, Player } from '@minecraft/server';
import { content, time, databases, eventBuilder, global } from '../../patchy_api/modules.js';
const array = Array.from(Array(5000), (value, i) => i);



// class PlayerPlus extends Player {
// 	constructor(player) {
// 		this.player = player;
// 	}
// 	hi() {
// 		world.sendMessage(`[${this.name}] hi`);
// 	}
// }

// PlayerPlus.name;
// function makePlayerPlus(player) {
// 	return new Proxy(player, {
// 		get(target, key, receiver) {
// 			if (key in player) {
// 				return player;
// 			} else {
// 				return new PlayerPlus(player);
// 			}
// 		},
// 		set(target, key, value) {
// 			if (key in player) {
// 				player;
// 			} else {
// 				return new PlayerPlus(player);
// 			}
// 		}
// 	});
// }
// eventBuilder.subscribe('playerTest', {
// 	tickAfterLoad: () => {
// 		[...world.getPlayers()].forEach(player => {
// 			const newPlayer = new PlayerPlus(player);
// 			newPlayer.hi();
// 		});
// 	}
// });


// eventBuilder.subscribe('testDatabase', {
// 	tickAfterLoad: () => {
// 		global.players.forEach(player => {
// 			world.scoreboard.getObjective('testoffine').getParticipants().forEach(participant => {
// 				const { displayName, id } = participant;
// 				content.warn({ displayName, id });
// 				const entity = participant.getEntity();
// 				content.warn({ t: 'eTag', name: entity.name });
// 			});
// 		});
// 	}
// });

// 		content.warn('db');
		// 		time.start('testDatabase');
		// 		let testDatabase = databases.getFromEntity('testDatabase');
		// 		content.warn({ GET: time.end('testDatabase') });
		// 		if (!testDatabase) {
		// 			testDatabase = databases.add('testDatabase');
		// 			for (let i = 0; i < 4000; i++) {
		// 				testDatabase.set(`abc${i}`, Math.random());
		// 			}
		// 			time.start('testDatabase');
		// 			databases.save('testDatabase');
		// 			content.warn({ SAVE: time.end('testDatabase') });
		// 			const fullLength = JSON.stringify(testDatabase).length;
		// 			content.warn({ fullLength });
		// 		}

		// 		// // content.warn(fullText);
		// 		// time.start('test');
		// 		// for (const value of array) {
		// 		// 	value;
		// 		// }
		// 		// content.warn({ for_of: time.end('test'), length: array.length });
		// 		// time.start('test');
		// 		// array.forEach(value => value);
		// 		// content.warn({ forEach: time.end('test'), length: array.length });
//https://github.com/polygonplanet/lzbase62/blob/master/src/compressor.js
