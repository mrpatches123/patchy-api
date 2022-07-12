import databases from '../libraries/classes/database.js';
import eventBuilder from '../libraries/classes/events.js';
import { content } from '../libraries/utilities.js';

eventBuilder.subscribe('databaseTest', {
	tick: () => {
		// content.warn('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
		// const database = databases.get('testData') ?? databases.add('testData');
		// database.set('test', { hi: 37887933839023, help: [389893, 390902092, 23899832] });
		// databases.queueSave('testData');
		// content.warn({ T: 'crap', databases });
	}
});