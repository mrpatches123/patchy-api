import eventBuilder from "../libraries/classes/events/export_instance.js";
import global from '../libraries/classes/global.js';
import { world, system, DefinitionModifier } from '@minecraft/server';
import { content, native } from '../libraries/utilities.js';
import errorLogger from "../libraries/classes/error.js";
import time from '../libraries/classes/time.js';
import { Player, setProptotype } from "../libraries/classes/player/class.js";
import loads from "../libraries/classes/load.js";
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
						eventBuilder.getEvent('worldLoad').iterate({});
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

						const { id, name } = player;
						const loaded = loads.loads.hasOwnProperty(id);
						if (!loaded) return;
						if (!global.hasOwnProperty('loading')) global.loading = true;
						// if (!global.finishedInitialPlotCreate) return;
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
	playerHitEntity: {
		subscription: {
			entityHitEntity: {
				function: event => {
					const { damagingEntity, hitEntity } = event;
					if (!(damagingEntity instanceof Player)) return;
					eventBuilder.getEvent('playerHit').iterate({ player: damagingEntity, hitEntity });
				},
				options: { entityTypes: ["minecraft:player"] }
			}
		}
	},
	playerHitBlock: {
		subscription: {
			entityHitBlock: {
				function: event => {
					const { damagingEntity, hitBlock } = event;
					if (!(damagingEntity instanceof Player)) return;
					eventBuilder.getEvent('playerHit').iterate({ player: damagingEntity, hitBlock });
				},
				options: { entityTypes: ["minecraft:player"] }
			}
		}
	},
	playerHurt: {
		subscription: {
			entityHurt: {
				function: event => {
					const { hurtEntity, damageSource, damage } = event;
					if (!(hurtEntity instanceof Player)) return;
					const { damagingEntity, damagingProjectile, cause } = damageSource;
					eventBuilder.getEvent('playerHurt').iterate({ player: hurtEntity, damagingEntity, cause, damage, projectile: damagingProjectile });
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
			dataDrivenEntityTrigger: {
				function: (event) => {
					const { entity, eventId: id } = event;
					const modifiers = event.getModifiers();
					eventBuilder.getEvent('dataDrivenPlayerTriggerEvent').iterate({ player: entity, modifiers, id });
				},
				options: { entityTypes: ["minecraft:player"] }
			}
		}
	},
	beforeDataDrivenPlayerTriggerEvent: {
		subscription: {
			beforeDataDrivenEntityTriggerEvent: {
				function: (event) => {
					const { entity, id, cancel } = event;


					eventBuilder.getEvent('beforeDataDrivenPlayerTriggerEvent').iterate({ cancel, player: entity, getModifiers() { return event.getModifiers(); }, setModifiers(modifiers: DefinitionModifier[]) { event.setModifiers(modifiers); }, get modifiers() { return event.getModifiers(); }, set modifiers(modifiers) { event.setModifiers(modifiers); }, id });
				},
				options: { entityTypes: ["minecraft:player"] }
			}
		}
	},

	scoreboardChange: {
		subscription: {}
	},
	numberPropertyChange: {
		subscription: {}
	},
	stringPropertyChange: {
		subscription: {}
	},
	booleanPropertyChange: {
		subscription: {}
	},
	vector3PropertyChange: {
		subscription: {}
	}
});
// world.sendMessage(`123 - ${JSON.stringify(eventBuilder, null, 4)}`);


