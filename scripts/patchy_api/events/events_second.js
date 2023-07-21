import eventBuilder from '../libraries/classes/events/export_instance.js';
import { EntityItemComponent, Vector, world } from '@minecraft/server';
import players from '../libraries/classes/players/export_instance.js';
import time from '../libraries/classes/time.js';
import global from '../libraries/classes/global.js';
import errorLogger from '../libraries/classes/error.js';
import { content, hypot2, overworld, getXZVectorRY } from '../modules.js';
import { Player, setProptotype } from '../libraries/classes/player/class.js';
global.requestAddEvent = [];
const items = {};
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
	},
	playerDeath: {
		subscription: {
			tickAfterLoad: {
				function: () => {
					players.get().iterate(player => {
						if (player.getComponent('health').currentValue > 0) return;
						eventBuilder.getEvent('playerDeath').iterate({ player });
					});
				}
			}
		}
	}
});
function vectorToVector3(vector) {
	const { x, y, z } = vector;
	return { x, y, z };
}
function getSign(number) {
	const sign = Number(number) / Math.abs(Number(number));
	return (!sign) ? 0 : sign;
}
function yawToCardnalDirectionVector(ry) {
	let { x, z } = getXZVectorRY(ry);
	const xDist = Math.abs(x - 0);
	const zDist = Math.abs(z - 0);

	return { x: (xDist > zDist) ? getSign(x) : 0, y: 0, z: (zDist > xDist) ? -getSign(z) : 0 };
}

// world.sendMessage(`${JSON.stringify(eventBuilder, null, 4)}`);


