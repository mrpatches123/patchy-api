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
	stepOnBlock: {
		subscription: {
			tickAfterLoad: {
				function: () => {
					players.get().iterate((player) => {
						try {
							const { location: { x, y, z }, memory, dimension } = player;
							// content.warn(y);
							let block = dimension.getBlockFromRay({ x: x, y: y, z: z }, new Vector(0, -1, 0), { maxDistance: 1, includeLiquidBlocks: true, includePassableBlocks: true });
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
	},
	playerDeath: {
		subscription: {
			entityDie: {
				function: ({ damageSource: { damagingEntity, damagingProjectile, cause }, deadEntity: player }) => {
					eventBuilder.getEvent('playerDeath').iterate({ damageSource: { killer: setProptotype(damagingEntity), projectile: damagingProjectile, cause }, player });
				},
				entityOptions: { entityTypes: ["minecraft:player"] }
			}
		}
	},
	entityDeath: {
		subscription: {
			entityDie: {
				function: ({ damageSource: { damagingEntity, damagingProjectile, cause }, deadEntity: entity }) => {
					eventBuilder.getEvent('entityDeath').iterate({ damageSource: { killer: setProptotype(damagingEntity), projectile: damagingProjectile, cause }, entity });
				}
			}
		}
	},
	playerJoinAwaitMove: {
		subscription: {
			playerSpawn: {
				function: ({ player, initialSpawn }) => {
					if (!initialSpawn) return;
					content.warn({ playerJoinAwaitMove: player.name });
					const systemRunId = system.runSchedule(() => {
						const { rotation, memory } = player;
						const { lastRotation = rotation } = memory;
						const { x: rx, y: ry } = rotation;
						const { x: lrx, y: lry } = lastRotation;
						memory.lastRotation = rotation;
						content.warn({ rx, ry, lrx, lry });
						if (rx === lrx && ry === lry) return;
						eventBuilder.getEvent('playerJoinAwaitMove').iterate({ player });
						system.clearRunSchedule(systemRunId);
					}, 0);
				}
			}
		}
	},
	itemPickup: {
		subscription: {
			tickAfterLoad: {
				function: () => {

					const dne = Object.assign({}, items);
					[...overworld.getEntities({ type: 'minecraft:item' })].forEach(entity => {
						const { id, location } = entity;
						/**
						 * @type {EntityItemComponent}
						 */
						const { itemStack } = entity.getComponent('minecraft:item');

						if (!items.hasOwnProperty(id)) items[id] = { location, itemStack };
						delete dne[id];
					});
					Object.entries(dne).forEach(([id, { location, itemStack }]) => {
						content.warn({ location });
						const player = setProptotype([...overworld.getPlayers({ location, closest: 1 })][0]);
						eventBuilder.getEvent('itemPickup').iterate({ player, item: itemStack });
						delete items[id];
					});
				}
			}
		}
	},
	beforePlayerScaffoldPlace: {
		subscription: {
			beforeItemUseOn: {
				function: (event) => {
					const eventBlockLocation = event.getBlockLocation();
					const { source, } = event;

					const player = setProptotype(source);
					if (!(player instanceof Player)) return;
					if (eventBlockLocation) return;
					const blockLocation = player.getBlockFromViewDirection();
					if (blockLocation) return;
					const { rotation } = player;
					const direction = yawToCardnalDirectionVector(rotation.y);
					const blockGround = player.dimension.getBlockFromRay(player.location, { x: 0, y: -1, z: 0 });
					if (!blockGround) return;
					const newLocation = vectorToVector3(Vector.add(blockGround.location, direction));
					eventBuilder.getEvent('beforePlayerScaffoldPlace').iterate({ player, blockLocation: newLocation, cancel: false }, (key, eventResponse, callbackForKey) => {
						callbackForKey(eventResponse);
						content.warn({ key, eventResponse, callbackForKey });
						if (eventResponse.cancel) event.cancel = true;

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
function fpart(number) {
	return number - Math.floor(number);
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

// world.say(`${JSON.stringify(eventBuilder, null, 4)}`);


