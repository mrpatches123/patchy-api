import eventBuilder from "../libraries/classes/events.js";
import global from '../libraries/classes/global.js';
import { EntityEventOptions, Player, world, EntityHurtEvent, system } from '@minecraft/server';
import { content, native } from '../libraries/utilities.js';
import errorLogger from "../libraries/classes/error.js";
import time from '../libraries/classes/time.js';
global.playerJoined = {};
global.tickAfterLoadI = 0;
let a = 0;
eventBuilder.register({
	worldLoad: {
		subscription: {
			tick: {
				function: () => {
					const { loaded, loading } = global;
					if (loading && !loaded) {
						eventBuilder.getEvent('worldLoad').iterate();
						global.loadedPlayers = false;
						global.loaded = true;
					}
				}
			}
		}
	},
	tickAfterLoad: {
		subscription: {
			tick: {
				function: (event) => {
					const { loaded, loadedPlayers } = global;
					// content.warn({ bool: loaded && loadedPlayers });
					if (loaded && loadedPlayers) {
						eventBuilder.getEvent('tickAfterLoad').iterate(event);
					}
					// else if ((loading && (!loaded && !loadedPlayers)) || global.tickAfterLoadI++ > 100) {
					// 	global.loaded = true;
					// 	global.loadedPlayers = true;
					// }
				}
			}
		}
	},
	playerJoined: {
		subscription: {
			tick: {
				function: ({ currentTick }) => {
					const players = world.getAllPlayers();
					players.forEach((player, i) => {
						const { loaded, id, name } = player;
						// content.warn(28928282, name);

						if (!loaded) return;
						if (!global.hasOwnProperty('loading')) global.loading = true;
						if (!global.loaded) return;
						if (global.playerJoined.hasOwnProperty(id)) return;
						eventBuilder.getEvent('playerJoined').iterate({ player }, (key, callback) => {
							callback({ player });
						});
						global.playerJoined[id] = 1;

						if (players.length === i + 1 && !global.hasOwnProperty('loadedPlayers')) return;
						global.loadedPlayers = true;


					});


				}
			}
		}
	},
	// beforeExplosion: {
	// 	subscription: {
	// 		beforeExplosion: event => {
	// 			let { impactedBlocks, dimension } = event;
	// 			const cancels = [];
	// 			const eventKey = 'beforeExplosion';
	// 			time.start(`${eventKey}*Events*API`);

	// 			this.beforeExplosion.events.keysObject.forEach((key, { callback, suppressed }) => {
	// 				try {
	// 					time.start(`${eventKey}*${key}*Events*API`);
	// 					if (!suppressed) {
	// 						const { cancel, impactedBlocks: callImpactedBlocks } = callback(event) ?? {};
	// 						if (callImpactedBlocks) {
	// 							impactedBlocks = impactedBlocks.filter(blockLocation => callImpactedBlocks
	// 								.some(blockLocation1 => blockLocation1 === blockLocation))
	// 								.map(({ x, y, z }) => new BlockLocation(x, y, z));;
	// 						}
	// 						cancels.push(cancel);
	// 					}
	// 					global.tickTime[eventKey].keys[key] = time.end(`${eventKey}*${key}*Events*API`);
	// 				} catch (error) {
	// 					errorLogger.log(error, error.stack, { event: 'beforeExplosion', key });
	// 				}
	// 			});
	// 			if (cancels.some(bool => bool)) { event.cancel = true; }

	// 			event.impactedBlocks = impactedBlocks;
	// 			global.tickTime.beforeExplosion = time.end('beforeExplosion');
	// 			global.tickTime[eventKey].total = time.end(`${eventKey}*Events*API`);
	// 		}
	// 	}
	// },
	playerHit: {
		subscription: {
			entityHit: {
				function: event => {
					eventBuilder.getEvent('playerHit').iterate(event);
				},
				options: { entityTypes: ["minecraft:player"] }
			}
		}
	},
	playerHurt: {
		subscription: {
			entityHurt: {
				function: event => {
					eventBuilder.getEvent('playerHurt').iterate(event);
				},
				options: { entityTypes: ["minecraft:player"] }
			}
		}
	},
	playerDeath: {
		subscription: {

			entityHurt: {
				function: ({ damagingEntity: killer, hurtEntity: player, damage, cause, projectile }) => {
					// content.warn(player.name, player.getComponent('health').current);
					if (player.getComponent('health').current > 0) return;
					eventBuilder.getEvent('playerDeath').iterate({ killer, player, damage, cause, projectile });
				},
				entityOptions: { entityTypes: ["minecraft:player"] }
			}
		}
	},
	playerSpawned: {
		subscription: {
			entityHurt: {
				function: ({ hurtEntity: player }) => {
					if (player.getComponent('health').current > 0) return;
					const tick = () => {
						if (player.getComponent('health').current <= 0) return system.run(tick);
						eventBuilder.getEvent('playerSpawned').iterate({ player });
					}; tick();

				},
				entityOptions: { entityTypes: ["minecraft:player"] }
			}

		}
	}
});

// world.say(`123 - ${JSON.stringify(eventBuilder, null, 4)}`);