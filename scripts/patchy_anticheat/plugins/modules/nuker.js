
import { world, EntityQueryOptions, MinecraftBlockTypes } from '@minecraft/server';
import { overworld, content, staff, native } from "../../../patchy_api/libraries/utilities.js";
import databases from '../../../patchy_api/libraries/classes/database.js';
import global from '../../../patchy_api/libraries/classes/global.js';
import eventBuilder from '../../../patchy_api/libraries/classes/events.js';
import discipline from '../../libraries/discipline.js';

eventBuilder.subscribe('nuker', {
    tickAfterLoad: ({ deltaTime }) => {
        let anticheat = databases.get('anticheat') ?? databases.add('anticheat');
        const { toggles } = global;
        const allowedBlockBreaks = (deltaTime / 0.05).ceil() + 2;
        global.nonStaffPlayers.forEach((id, player) => {
            const name = player.getName();
            const { blockBreaks = [] } = global.playerMap[name] ?? {};
            // content.warn({ blockBreaks: blockBreaks.length, allowedBlockBreaks });
            const { playerId } = global.scoreObject[name] ?? {};
            if (blockBreaks.length > allowedBlockBreaks) {
                // content.warn({ breaks: blockBreaks.map(({ block: { location } }) => native.stringify(location)), Range: blockBreaks.map(({ block: { location } }) => location).getRange() });
                let [{ x: nx, z: nz }, { x: px, z: pz }] = blockBreaks.map(({ block: { location } }) => location).getRange();
                nx--, nz--, px++, pz++;
                [...player.dimension.getEntities()].filter((entity) => entity?.id === 'minecraft:item').forEach(entity => {
                    const { x, z } = entity.location;
                    if (x >= nx && x <= px && z >= nz && z <= pz) {
                        entity.kill();
                    } else {
                        // content.warn({ L: native.stringify(entity.location), nx, px, nz, pz });
                    }
                });


                blockBreaks.forEach(({ block: { location }, brokenBlockPermutation, dimension }) => {
                    dimension.getBlock(location).setPermutation(brokenBlockPermutation);
                });
                discipline.check(player, `§4failed §1Nuker §fwith §1${blockBreaks.length} §4blocks broke §fin a tickAfterLoad`, 'nuker');
            };
            global.playerMap[name].blockBreaks = [];
        });
    },
    blockBreak: ({ block, brokenBlockPermutation, dimension, player }) => {
        const { name } = player;
        if (!global.scoreObject[name].staff) {
            global.playerMap[name].blockBreaks.push({ block, brokenBlockPermutation, dimension, player });
        }
    }
});


