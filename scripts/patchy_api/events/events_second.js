import eventBuilder from '../libraries/classes/events.js';
import { BlockLocation, Location, Vector, world } from '@minecraft/server';
import players from '../libraries/classes/players.js';
import time from '../libraries/classes/time.js';
import global from '../libraries/classes/global.js';
import errorLogger from '../libraries/classes/error.js';
import { content } from '../modules.js';
global.requestAddEvent = [];
eventBuilder.register({
	stepOnBlock: {
		subscription: {
			tickAfterLoad: {
				function: () => {
					players.get().iterate((player) => {
						try {
							const { location: { x, y, z }, memory, dimension } = player;
							// content.warn(y);
							let block = dimension.getBlockFromRay(new Location(x, y, z), new Vector(0, -1, 0), { maxDistance: 1, includeLiquidBlocks: true, includePassableBlocks: true });
							const { LastBlockStepedOn } = memory;
							memory.LastBlockStepedOn = block;
							// content.warn({ LastBlockStepedOn: LastBlockStepedOn?.typeId ?? 'null', currentId: block?.typeId ?? 'null' });

							if (!block || (LastBlockStepedOn && block.location.equals(LastBlockStepedOn.location))) return;
							eventBuilder.getEvent('stepOnBlock').iterate({ block, player });
						} catch (error) {
							console.warn(error, error.stack);
						}
					});
				}
			}
		}
	},
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


