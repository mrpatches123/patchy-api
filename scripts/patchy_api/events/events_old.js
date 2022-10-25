import eventBuilder from "../libraries/classes/events.js";
import global from '../libraries/classes/global.js';
import { EntityEventOptions, Player, world } from '@minecraft/server';
import { content, native } from '../libraries/utilities.js';
import errorBuider from "../libraries/classes/error.js";
global.joiningPlayers = [];
global.tickAfterLoadI = 0;
/**
 * @function isPlayerLoaded
 * @param {Player} player 
 * @returns {Boolean}
 */
async function isPlayerLoaded(player) {
	try {

		await player.runCommand('testfor @a');
		// content.warn({ t: "3i33389", test: test });

		return true;
	} catch (error) {
		console.warn(error);
		console.warn('not loafed');
		return false;
	}
}

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
				function: () => {
					global.joiningPlayers.forEach(join => {
						// content.warn(join.name);
						try {
							let playerLoaded = isPlayerLoaded(join);

							if (!playerLoaded) { content.warn({ playerLoaded }); return; }
							content.warn({ playerLoaded });
							global.loading = true;
							if (!playerLoaded && !global.loaded) { return; }
							let cancel = false;
							const Keys = [];
							// content.warn({t:'players', jp: global.joiningPlayers.map(player => native.toObject(player))})

							// content.warn({t:'players', jp: global.joiningPlayers.map(player => native.toObject(player))})
							eventBuilder.events.playerJoined.keysObject.forEach((key, { callback, suppressed }) => {
								try {
									Keys.push(key);
									if (!suppressed) {
										if (cancel) { return; }
										const shouldReturn = callback({ player: join });
										if (shouldReturn) { cancel = true; }
									}
								} catch (error) {
									errorBuider.log(error, error.stack, { event: 'playerJoin', key });
								}
							});
							// content.warn({ Keys });
							if (!cancel) { global.joiningPlayers = global.joiningPlayers.filter(player => !global.joiningPlayers.some(join => player.id === join.id)); }
						} catch (error) { /*console.warn(error, error.stack);*/ }
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
			},
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
				options: Object.assign(new EntityEventOptions(), { entityTypes: ["minecraft:player"] })
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
				options: Object.assign(new EntityEventOptions(), { entityTypes: ["minecraft:player"] })
			}
		}
	},
	beforeBlockBreak: {
		subscription: {

			// blockBreak:(event) => {
			//	 const { dimension, brokenBlockPermutation, block: {location: blockLocation } } = event


			// });
			// entityCreate:({entity}) => {
			//	 if (entity.id === 'minecraft:item') {

			//	 }
			// });
		}
	}

});