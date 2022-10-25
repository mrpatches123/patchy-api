import { world, EntityQueryOptions, EntityQueryScoreOptions } from '@minecraft/server';
import { content, overworld } from "../../../patchy_api/libraries/utilities.js";
import databases from '../../../patchy_api/libraries/classes/database.js';
import global from '../../../patchy_api/libraries/classes/global.js';
import eventBuilder from '../../../patchy_api/libraries/classes/events.js';
import { bannedItems } from './give/banned_items.js';
eventBuilder.subscribe('kill', {
    tickAfterLoad: () => {
        global.players.forEach((id, player) => {
            const name = player.getName();
            let { RandKillId, dead } = global.scoreObject[name];
            if (dead) {
                if (RandKillId !== 2147483646) {
                    content.warn(RandKillId);
                    let killer = [...world.getPlayers(
                        Object.assign(new EntityQueryOptions(), {
                            scoreOptions: [
                                Object.assign(new EntityQueryScoreOptions(), {
                                    objective: 'RandKillId',
                                    minScore: RandKillId,
                                    maxScore: RandKillId,
                                    exclude: false
                                }),
                                Object.assign(new EntityQueryScoreOptions(), {
                                    objective: 'dead',
                                    minScore: 1,
                                    maxScore: 1,
                                    exclude: true
                                })
                            ]
                        })
                    )][0];
                    if (killer) {
                        killer.scoreAdd('KillsS', 1);
                        killer.scoreAdd('KillsT', 1);
                        killer.scoreAdd('experience', 250);
                        killer.scoreSet('RandKillId', 2147483646);
                    }

                    player.scoreSet('RandKillId', 2147483646);
                    player.scoreSet('dead', 0);
                }

            }

        });
    }
});
