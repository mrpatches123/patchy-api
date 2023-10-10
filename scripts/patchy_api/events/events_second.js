import eventBuilder from '../libraries/classes/events/export_instance.js';
import { Vector, system } from '@minecraft/server';
import players from '../libraries/classes/players/export_instance.js';
import global from '../libraries/classes/global.js';
import { content, overworld, getXZVectorRY } from '../modules.js';
import { Player, setProptotype } from '../libraries/classes/player/class.js';
global.requestAddEvent = [];
const numberOfStepOns = 3;
const items = {};
/**
 * @param {{x: number, y: number,z: number}} vector1
 * @param {{x: number, y: number,z: number}} vector2
 * @returns {boolean}
 */
function vector3Equals(vector1, vector2) {
    return vector1.x === vector2.x && vector1.y === vector2.y && vector1.z === vector2.z;
}
;
eventBuilder.register({
    stepOnBlock: {
        subscription: {
            tickAfterLoad: {
                function: () => {
                    players.get().iterate((player) => {
                        try {
                            const { location: { x, y, z }, memory, dimension } = player;
                            // content.warn(y);
                            let rayCastHit = dimension.getBlockFromRay({ x: x, y: y, z: z }, new Vector(0, -1, 0), { maxDistance: 1, includeLiquidBlocks: true, includePassableBlocks: true });
                            const { block } = rayCastHit ?? {};
                            if (!block)
                                return;
                            if (!player.isOnGround)
                                return;
                            if (!player.isInWater && player.isFalling)
                                return;
                            memory.lastBlocksStepedOn ??= [];
                            const lastBlocksStepedOn = memory.lastBlocksStepedOn;
                            if (memory.lastBlocksStepedOn.length > numberOfStepOns)
                                memory.lastBlocksStepedOn.shift();
                            memory.lastBlocksStepedOn.push(block);
                            // content.warn({ LastBlockStepedOn: LastBlockStepedOn?.typeId ?? 'null', currentId: block?.typeId ?? 'null' });
                            const slice = lastBlocksStepedOn.slice(1);
                            if (lastBlocksStepedOn.length === numberOfStepOns && (slice.some(lastBlock => vector3Equals(lastBlocksStepedOn[0].location, lastBlock) || slice.some(block => slice.some(block1 => !vector3Equals(block1.location, block.location))))))
                                return;
                            eventBuilder.getEvent('stepOnBlock').iterate({ block, player });
                        }
                        catch (error) {
                            console.warn(error, error.stack);
                        }
                    });
                }
            }
        }
    },
    // playerLeft: {
    // 	subscription: {
    // 		playerLeave: {
    // 			function: () => {
    // 				const currentPlayers = [...world.getPlayers()].map(({ id }) => id);
    // 				Object.entries(loads.loads).forEach(([loadedId, player]) => {
    // 					if (currentPlayers.hasOwnProperty(loadedId)) return;
    // 					const { name: playerName } = player;
    // 					const playerId = loadedId;
    // 					eventBuilder.getEvent('playerLeft').iterate({ playerId, playerName });
    // 					delete loads.loads[loadedId];
    // 				});
    // 			}
    // 		}
    // 	}
    // },
    requestAdded: {
        subscription: {
            tickAfterLoad: {
                function: () => {
                    if (!global.requestAddEvent?.length)
                        return;
                    global.requestAddEvent.forEach((event) => {
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
                    if (!(player instanceof Player))
                        return;
                    eventBuilder.getEvent('playerDeath').iterate({ damageSource: { killer: damagingEntity, projectile: damagingProjectile, cause }, player });
                }
            }
        }
    },
    playerJoinAwaitMove: {
        subscription: {
            playerSpawn: {
                function: ({ player, initialSpawn }) => {
                    if (!initialSpawn)
                        return;
                    content.warn({ playerJoinAwaitMove: player.name });
                    const systemRunId = system.runInterval(() => {
                        const { rotation, memory } = player;
                        const { lastRotation = rotation } = memory;
                        const { x: rx, y: ry } = rotation;
                        const { x: lrx, y: lry } = lastRotation;
                        memory.lastRotation = rotation;
                        content.warn({ rx, ry, lrx, lry });
                        if (rx === lrx && ry === lry)
                            return;
                        eventBuilder.getEvent('playerJoinAwaitMove').iterate({ player });
                        system.clearRun(systemRunId);
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
                        const { itemStack } = entity.getComponent('minecraft:item');
                        if (!items.hasOwnProperty(id))
                            items[id] = { location, itemStack };
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
                    const { source, block: { location: eventBlockLocation } } = event;
                    if (!(source instanceof Player))
                        return;
                    if (eventBlockLocation)
                        return;
                    const blockLocation = source.getBlockFromViewDirection();
                    if (blockLocation)
                        return;
                    const { rotation } = source;
                    const direction = yawToCardnalDirectionVector(rotation.y);
                    const { block: blockGround } = source.dimension.getBlockFromRay(source.location, { x: 0, y: -1, z: 0 }) ?? {};
                    if (!blockGround)
                        return;
                    const newLocation = vectorToVector3(Vector.add(blockGround.location, direction));
                    eventBuilder.getEvent('beforePlayerScaffoldPlace').iterate({ player: source, blockLocation: newLocation, cancel: false }, (key, eventResponse, callbackForKey) => {
                        callbackForKey(eventResponse);
                        if (eventResponse.cancel)
                            event.cancel = true;
                    });
                }
            }
        }
    },
    beforeItemUseOnStart: {
        subscription: {
            beforeItemUseOn: {
                function: (event) => {
                    const { source } = event;
                    if (!(source instanceof Player))
                        return;
                    const { memory } = source;
                    const { usedOn } = memory;
                    if (!usedOn) {
                        eventBuilder.getEvent('beforeItemUseOnStart').iterate(event);
                        memory.usedOn = true;
                    }
                    memory.usingOn = true;
                }
            },
            tickAfterLoad: {
                function: () => {
                    players.get().iterate((player) => {
                        const { memory } = player;
                        const { usingOn } = memory;
                        if (!usingOn) {
                            memory.usedOn = false;
                        }
                        memory.usingOn = false;
                    });
                }
            }
        }
    },
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
//# sourceMappingURL=events_second.js.map