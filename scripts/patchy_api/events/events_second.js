import eventBuilder from '../libraries/classes/events.js';
import { world } from '@minecraft/server';
import players from '../libraries/classes/players.js';
import time from '../libraries/classes/time.js';
import global from '../libraries/classes/global.js';
import errorLogger from '../libraries/classes/error.js';
import { content } from '../modules.js';
global.requestAddEvent = [];
eventBuilder.add({
	playerLeft: {
		subscription: {
			playerLeave: {
				useWorldEvents: true,
				function: () => {
					const currentPlayers = [...world.getPlayers()].map(({ id }) => id);
					players.loaded.forEach((loadedId, player) => {
						if (currentPlayers.hasOwnProperty(loadedId)) return;
						time.start('playerLeft');
						const { name: playerName } = player;
						const playerId = loadedId;
						eventBuilder.events.playerLeft.keysObject.forEach((key, { callback, suppressed }) => {
							try {
								if (!suppressed) {
									callback({ playerId, playerName });
								}
							} catch (error) {
								errorBuider.log(error, error.stack, { event: 'playerLeft', key });
							}
						});
						delete players.loaded[loadedId];
						global.tickTime.playerLeft = time.end('playerLeft');
					});

				}
			}
		}
	},
	requestAdded: {
		subscription: {
			tickAfterLoad: () => {
				if (!global.requestAddEvent.length) return;

				global.requestAddEvent.forEach(event => {
					time.start('requestAdded');
					eventBuilder.events.requestAdded.keysObject.forEach((key, { callback, suppressed }) => {
						try {
							if (!suppressed) {
								callback(event);
							}
						} catch (error) {
							errorLogger.log(error, error.stack, { event: 'requestAdded', key });
						}
					});
					global.tickTime.requestAdded = time.end('requestAdded');
				});
				global.requestAddEvent = [];
			}
		}
	}
});
// world.say(`${JSON.stringify(eventBuilder, null, 4)}`);


