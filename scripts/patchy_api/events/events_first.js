import eventBuilder from "../libraries/classes/events.js";
import global from '../libraries/classes/global.js';
import { EntityEventOptions, Player, world } from '@minecraft/server';
import { content, native } from '../libraries/utilities.js';
import errorBuider from "../libraries/classes/error.js";
import { EntityHurtEvent } from '@minecraft/server';
global.joiningPlayers = [];
global.tickAfterLoadI = 0;

eventBuilder.add({
	worldLoad: {
		subscription: {
			tick: () => {
				const { loading, loaded } = global;
				if (loading && !loaded) {
					eventBuilder.events.worldLoad.keysObject.forEach((key, { callback, suppressed }) => {
						try {
							if (!suppressed) {
								callback();
							}
						} catch (error) {
							errorBuider.log(error, error.stack, { event: 'worldLoad', key });
						}
					});
					global.loadedPlayers = false;
					global.loaded = true;
				}
			}
		}
	},
	tickAfterLoad: {
		subscription: {
			tick: (event) => {
				const { loading, loaded, loadedPlayers } = global;
				if (loaded && loadedPlayers) {
					eventBuilder.events.tickAfterLoad.keysObject.forEach((key, { callback, suppressed }) => {
						try {
							if (key.includes('formAwait')) {
								content.warn({ key, t: 'wiohdqwqwioqjwq0uje0q3iwoeht4wj[eu09hri930jqfeh8ubf9' });
							}
							if (!suppressed) {
								callback(event);
							}
						} catch (error) {
							errorBuider.log(error, error.stack, { event: 'tickAfterLoad', key });
						}
					});
				} else if (loading && (!loaded || !loadedPlayers) && global.tickAfterLoadI++ > 20) {
					global.loaded = true;
					global.loadedPlayers = true;
				}
			}
		}
	},
	playerJoined: {
		subscription: {
			playerJoin: {
				useWorldEvents: true,
				function: ({ player }) => {
					global.joiningPlayers.push(player);
					content.warn(global.joiningPlayers.map(({ name }) => name));
				}
			},
			worldInitialize: () => {
				global.joiningPlayers = [...world.getPlayers()];
				content.warn('dlkkwklwdklwlkwklkwldwfkqnfnweoifhnipowewe', global.joiningPlayers.map(({ name }) => name));
			},
			tick: {
				useWorldEvents: true,
				function: ({ currentTick }) => {
					// if (global.joiningPlayers) content.warn(native.stringify(global.joiningPlayers));
					global.joiningPlayers.forEach(async (join) => {

						try {
							let playerLoaded = Boolean(await join.runCommandAsync('testfor @s').catch(error => error));
							content.warn({ playerLoaded });
							if (!playerLoaded) return;
							global.loading = true;
							if (!playerLoaded && !global.loaded) { return; }
							let cancel = false;
							const Keys = [];
							// content.warn({t:'players', jp: global.joiningPlayers.map(player => native.toObject(player))})

							// content.warn({t:'players', jp: global.joiningPlayers.map(player => native.toObject(player))})
							eventBuilder.events.playerJoined.keysObject.forEach((key, { callback, suppressed }) => {
								try {
									content.warn({ player: join.name, key });
									Keys.push(key);
									if (!suppressed) {
										if (cancel) { return; }
										const shouldReturn = callback({ player: join });
										if (shouldReturn) { cancel = true; }

									}
								} catch (error) {
									errorBuider.log(error, error.stack, { event: 'playerJoined', key });
								}
							});
							// content.warn({ Keys });
							if (!cancel) { global.joiningPlayers = global.joiningPlayers.filter(player => !global.joiningPlayers.some(join => player.id === join.id)); }
						} catch (error) { console.warn(error, error.stack); }
					});
					global.loadedPlayers = true;

				}

			}
		}
	},
	beforeExplosion: {
		subscription: {
			beforeExplosion: event => {
				time.start('beforeExplosion');
				let { impactedBlocks, dimension } = event;
				const cancels = [];
				this.beforeExplosion.events.keysObject.forEach((key, { callback, suppressed }) => {
					try {
						if (!suppressed) {
							const { cancel, impactedBlocks: callImpactedBlocks } = callback(event) ?? {};
							if (callImpactedBlocks) {
								impactedBlocks = impactedBlocks.filter(blockLocation => callImpactedBlocks
									.some(blockLocation1 => blockLocation1 === blockLocation))
									.map(({ x, y, z }) => new BlockLocation(x, y, z));;
							}
							cancels.push(cancel);
						}

					} catch (error) {
						errorBuider.log(error, error.stack, { event: 'beforeExplosion', key });
					}
				});
				if (cancels.some(bool => bool)) { event.cancel = true; }

				event.impactedBlocks = impactedBlocks;
				global.tickTime.beforeExplosion = time.end('beforeExplosion');
			}
		}
	},
	playerHit: {
		subscription: {
			entityHit: {
				function: event => {
					time.start('playerHit');
					this.playerHit.events.keysObject.forEach((key, { callback, suppressed }) => {
						try {
							if (!suppressed) {
								callback(event);
							}
						} catch (error) {
							errorBuider.log(error, error.stack, { event: 'playerHit', key });
						}
					});
					global.tickTime.playerHit = time.end('playerHit');
				},
				options: { entityTypes: ["minecraft:player"] }
			}
		}
	},
	playerHurt: {
		subscription: {
			entityHurt: {
				function: event => {
					time.start('playerHurt');
					this.playerHurt.events.keysObject.forEach((key, { callback, suppressed }) => {
						try {
							if (!suppressed) {
								callback(event);
							}
						} catch (error) {
							errorBuider.log(error, error.stack, { event: 'playerHurt', key });
						}
					});
					global.tickTime.playerHurt = time.end('playerHurt');
				},
				options: { entityTypes: ["minecraft:player"] }
			}
		}
	},
	playerDeath: {
		subscription: {

			entityHurt: {
				/**
				 * @param {EntityHurtEvent} event
				 */
				function: event => {
					const { hurtEntity, damagingEntity, projectile, cause, damage } = event;
					time.start('playerDeath');
					this.playerDeath.events.keysObject.forEach((key, { callback, suppressed }) => {
						try {
							if (!suppressed) {
								callback({ playerDied: hurtEntity, killer: damagingEntity, projectile, cause, damage });
							}
						} catch (error) {
							errorBuider.log(error, error.stack, { event: 'playerDeath', key });
						}
					});
					global.tickTime.playerDeath = time.end('playerDeath');
				},
				options: { entityTypes: ["minecraft:player"] }
			}
		}
	},
});

// world.say(`123 - ${JSON.stringify(eventBuilder, null, 4)}`);