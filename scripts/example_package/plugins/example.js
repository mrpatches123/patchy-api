import { world } from '@minecraft/server';
import { content, time, databases, eventBuilder, global } from '../../patchy_api/modules.js';
const array = Array.from(Array(5000), (value, i) => i);

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
