import eventBuilder from '../../patchy_api/libraries/classes/events.js';
import databases from '../../patchy_api/libraries/classes/database.js';
import time from '../../patchy_api/libraries/classes/time.js';
import { content } from '../../patchy_api/libraries/utilities.js';
import { compress } from '../../patchy_api/libraries/zip_255cs.js';
import { world } from 'mojang-minecraft';
const array = Array.from(Array(5000), (value, i) => i);

eventBuilder.subscribe('testDatabase', {
	worldLoad: () => {
		content.warn('db');
		time.start('testDatabase');
		let testDatabase = databases.getFromEntity('testDatabase');
		content.warn({ GET: time.end('testDatabase') });
		if (!testDatabase) {
			testDatabase = databases.add('testDatabase');
			for (let i = 0; i < 4000; i++) {
				testDatabase.set(`abc${i}`, Math.random());
			}
			time.start('testDatabase');
			databases.save('testDatabase');
			content.warn({ SAVE: time.end('testDatabase') });
		}
		const fullText = JSON.stringify(testDatabase);
		const fulllength = fullText.length;
		time.start('testDatabase');
		const compressLength = compress(JSON.stringify(testDatabase)).length;
		content.warn({ "NaN === 4": 4 === NaN });
		// content.warn({ compress: time.end('testDatabase'), fulllength, compressLength, precentage: Math.round((compressLength / fulllength - 1) * 100), bytesLost: fulllength - compressLength });
		// // content.warn(fullText);
		// time.start('test');
		// for (const value of array) {
		// 	value;
		// }
		// content.warn({ for_of: time.end('test'), length: array.length });
		// time.start('test');
		// array.forEach(value => value);
		// content.warn({ forEach: time.end('test'), length: array.length });
	}

});

//https://github.com/polygonplanet/lzbase62/blob/master/src/compressor.js
