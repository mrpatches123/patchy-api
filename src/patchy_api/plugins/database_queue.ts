
import { world } from '@minecraft/server';
import { databases, global, eventBuilder, content } from '../modules.js';
eventBuilder.subscribe('end_databaseSaveQueue*API', {
	tickAfterLoad: ({ currentTick }) => {
		// if (currentTick % 10) return;
		// content.warn('end_databaseSaveQueue', currentTick);
		if (databases.__queuedSaves.length) {
			content.warn(databases.__queuedSaves[0]);
			databases.save(databases.__queuedSaves[0]!);
			databases.__queuedSaves.splice(0, 1);
		}
		// [...world.getPlayers()].forEach(player => {
		// 	content.warn(JSON.stringify(player.name));
		// 	player.runCommandAsync(`tp @s "${player.name}"`);
		// });
	}
});


// eventBuilder.subscribe('messageTest', {
// 	messageReceive: 
// });