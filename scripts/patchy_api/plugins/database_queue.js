import databases from '../libraries/classes/database.js';
import eventBuilder from '../libraries/classes/events.js';

eventBuilder.subscribe('end_databaseSaveQueue', {
	tick: () => {
		if (databases.__queuedSaves.length) {
			databases.save(databases.__queuedSaves[0]);
			databases.__queuedSaves.splice(0, 1);
		}

	}
});