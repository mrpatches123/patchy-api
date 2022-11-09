// import { content, eventBuilder, databases, global, native, time, Database } from '../modules.js';

// function* blocksBetween(pos1, pos2) {
// 	for (let x = pos1.x; x < pos2.x; x++) {
// 		for (let y = pos1.y; y < pos2.y; y++) {
// 			for (let z = pos1.z; z < pos2.z; z++) {
// 				yield ({ x, y, z });
// 			}
// 		}
// 	}
// };
// const blocks = blocksBetween({ x: 1, y: 2, z: 3 }, { x: 10, y: 5, z: 7 });

// for (const block of blocks) {
// 	content.warn(block);
// }

// eventBuilder.subscribe('databaseTest*API', {
// 	worldLoad: () => {
// 		function* blocksBetween(pos1, pos2) {
// 			for (let x = pos1.x; x < pos2.x; x++) {
// 				for (let y = pos1.y; y < pos2.y; y++) {
// 					for (let z = pos1.z; z < pos2.z; z++) {
// 						yield ({ x, y, z });
// 					}
// 				}
// 			}
// 		};
// 		const blocks = blocksBetween({ x: 1, y: 2, z: 3 }, { x: 10, y: 5, z: 7 });

// 		for (const block of blocks) {
// 			content.warn(block);
// 		}
// 		// 		try {



// 		// 			let databaseTest = databases.get('databaseTest');
// 		// 			// content.warn({ t: "jkkwbuiwqbuiegfouifwb", databaseTest });
// 		// 			if (!databaseTest) {
// 		// 				databaseTest = databases.add('databaseTest');
// 		// 				time.start('databaseTest');
// 		// 				for (let i = 0; i < 10000; i++) {
// 		// 					databaseTest.set((Math.random()).toString(), Math.random());
// 		// 				}
// 		// 				content.warn({ genTime: time.end('databaseTest') });
// 		// 				time.start('databaseTest');
// 		// 				databases.save('databaseTest');
// 		// 				const save = time.end('databaseTest');
// 		// 				const length = JSON.stringify(databases.get('databaseTest')).length;
// 		// 				const size = (length / 1000).round(2);
// 		// 				content.warn({ saveTime: `${save} ms`, size: `${size} KB`, length });
// 		// 			}

// 		// 		} catch (error) {
// 		// 			console.warn('databaseTest', error, error.stack);
// 		// 		}
// 	}
// });
