
import { world, EntityQueryOptions, MinecraftBlockTypes } from '@minecraft/server';
import global from '../../../patchy_api/libraries/classes/global.js';
import discipline from '../../libraries/discipline.js';
import { databases, eventBuilder, players, overworld, content, staff, native } from '../../../patchy_api/modules.js';
eventBuilder.subscribe('nuker', {
    tickAfterLoad: ({ deltaTime }) => {
        const allowedBlockBreaks = (deltaTime / 0.05).ceil() + 2;
        players.get(/*{ scoreOptions: [{ exclude: true, maxScore: 1, minScore: 1, objective: 'staff' }] }*/).iterate(player => {
            const { memory } = player;
            const { blockBreaks = [] } = memory;
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
            memory.blockBreaks = [];
        });
    },
    blockBreak: ({ block, brokenBlockPermutation, dimension, player }) => {
        const { name, memory, scores } = player;
        const { staff } = scores;
        if (!staff) {
            memory.blockBreaks.push({ block, brokenBlockPermutation, dimension, player });
        }
    }
});


