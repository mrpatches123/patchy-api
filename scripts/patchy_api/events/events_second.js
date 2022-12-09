import eventBuilder from '../libraries/classes/events.js';
import { world } from '@minecraft/server';
import players from '../libraries/classes/players.js';
import time from '../libraries/classes/time.js';
import global from '../libraries/classes/global.js';
import errorLogger from '../libraries/classes/error.js';
import { content } from '../modules.js';
global.requestAddEvent = [];
eventBuilder.register({
	playerLeft: {
		subscription: {
			playerLeave: {
				function: () => {
					const currentPlayers = [...world.getPlayers()].map(({ id }) => id);
					players.loaded.forEach((loadedId, player) => {
						if (currentPlayers.hasOwnProperty(loadedId)) return;
						const { name: playerName } = player;
						const playerId = loadedId;
						eventBuilder.getEvent('playerLeft').iterate({ playerId, playerName });
						delete players.loaded[loadedId];
					});

				}
			}
		}
	},
	requestAdded: {
		subscription: {
			tickAfterLoad: {
				function: () => {
					if (!global.requestAddEvent.length) return;

					global.requestAddEvent.forEach(event => {
						eventBuilder.getEvent('requestAdded').iterate(event);
					});
					global.requestAddEvent = [];
				}
			}
		}
	}
});
// world.say(`${JSON.stringify(eventBuilder, null, 4)}`);


