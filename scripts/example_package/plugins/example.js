import eventBuilder from '../../patchy_api/libraries/classes/events.js';
import databases from '../../patchy_api/libraries/classes/database.js';
import time from '../../patchy_api/libraries/classes/time.js';
import { content } from '../../patchy_api/libraries/utilities.js';
import { compress } from '../../patchy_api/libraries/zip_iz77.js';
eventBuilder.subscribe('testDatabase', {
	worldLoad: () => {
		content.warn('db');
		time.start('testDatabase');
		let testDatabase = databases.getFromEntity('testDatabase');
		content.warn({ GET: time.end('testDatabase') });
		if (!testDatabase) {
			testDatabase = databases.add('testDatabase');
			for (let i = 0; i < 2000; i++) {
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
		content.warn({ compress: time.end('testDatabase'), fulllength, compressLength, precentage: Math.round((compressLength / fulllength - 1) * 100), bytesLost: fulllength - compressLength });
		content.warn(fullText);
	}
});
//https://github.com/polygonplanet/lzbase62/blob/master/src/compressor.js
