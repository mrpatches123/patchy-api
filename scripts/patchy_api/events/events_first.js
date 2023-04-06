import eventBuilder from "../libraries/classes/events/export_instance.js";
import global from '../libraries/classes/global.js';
import { world, EntityHurtEvent, system } from '@minecraft/server';
import { content, native } from '../libraries/utilities.js';
import errorLogger from "../libraries/classes/error.js";
import time from '../libraries/classes/time.js';
import { setProptotype } from "../libraries/classes/player/class.js";
global.playerJoined = {};
global.tickAfterLoadI = 0;
let a = 0;
let test = false;
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
						if (!loaded) return;
						if (!global.hasOwnProperty('loading')) global.loading = true;
						if (!global.loaded) return;
						if (global.playerJoined.hasOwnProperty(id)) return;
						content.warn({ t: 'iterate:"playerJoined"', name });
						eventBuilder.getEvent('playerJoined').iterate({ player: setProptotype(player) });
						global.playerJoined[id] = 1;

						if (players.length === i + 1 && !global.hasOwnProperty('loadedPlayers')) return;
						global.loadedPlayers = true;
						// content.warn({ t: 'playerJoined', loaded: global.loaded, loadedPlayers: global.loadedPlayers });

					});


				}
			},
			playerLeave: {
				function: ({ playerId, playerName }) => {
					content.warn(`deleted ${playerName}`);
					delete global.playerJoined[playerId];
				}
			}
		}
	},
	playerHit: {
		subscription: {
			entityHit: {
				function: event => {
					const { entity, hitBlock, hitEntity } = event;
					eventBuilder.getEvent('playerHit').iterate({ player: entity, hitBlock, hitEntity });
				},
				options: { entityTypes: ["minecraft:player"] }
			}
		}
	},
	playerHurt: {
		subscription: {
			entityHurt: {
				function: event => {
					const { hurtEntity, damagingEntity, cause, damage, projectile } = event;
					eventBuilder.getEvent('playerHurt').iterate({ player: hurtEntity, damagingEntity, cause, damage, projectile });
				},
				options: { entityTypes: ["minecraft:player"] }
			}
		}
	},
	playerSpawned: {
		subscription: {
			playerSpawn: {
				function: ({ player, initialSpawn }) => {
					if (initialSpawn) return;
					eventBuilder.getEvent('playerSpawned').iterate({ player });
				}
			}

		}
	},
	dataDrivenPlayerTriggerEvent: {
		subscription: {
			dataDrivenEntityTriggerEvent: {
				function: ({ entity, modifiers, id }) => {
					eventBuilder.getEvent('dataDrivenPlayerTriggerEvent').iterate({ player: entity, modifiers, id });
				},
				entityOptions: { entityTypes: ["minecraft:player"] }
			}
		}
	},
	beforeDataDrivenPlayerTriggerEvent: {
		subscription: {
			beforeDataDrivenEntityTriggerEvent: {
				function: ({ entity, modifiers, id, cancel }) => {
					eventBuilder.getEvent('beforeDataDrivenPlayerTriggerEvent').iterate({ cancel, player: entity, modifiers, id });
				},
				entityOptions: { entityTypes: ["minecraft:player"] }
			}
		}
	},
	scoreboardChange: {
		subscription: {}
	}
});
// world.sendMessage(`123 - ${JSON.stringify(eventBuilder, null, 4)}`);


