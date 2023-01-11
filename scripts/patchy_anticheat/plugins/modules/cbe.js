// import { world, MinecraftBlockTypes } from '@minecraft/server';
// import { overworld, content, staff } from "../../../patchy_api/libraries/utilities.js";
// import databases from '../../../patchy_api/libraries/classes/database.js';
// import global from '../../../patchy_api/libraries/classes/global.js';
// import eventBuilder from '../../../patchy_api/libraries/classes/events/export_instance.js';
// import { bannedItems } from './give/banned_items.js';
// import discipline from '../../libraries/discipline.js';
// eventBuilder.subscribe('cbe', {
//     tickAfterLoad: () => {
//         let anticheat = databases.get('anticheat') ?? databases.add('anticheat');
//         const { toggles } = global;
//         global.nonStaffPlayers.forEach((id, player) => {
//             const name = player.getName();
//             const { usingCBE = false, usedCBE = false, placedCBE = false } = global.playerMap[name] ?? {};
//             if (usingCBE && !usedCBE) {
//                 const { playerId } = global.scoreObject[name];
//                 discipline.check(player, `§4failed §1CBE by §4Placeing ${placedCBE}`, 'cbe');
//                 global.playerMap[name].usedCBE = true;
//             } else {
//                 global.playerMap[name].usedCBE = false;
//             }
//             global.playerMap[name].usingCBE = false;
//         });

//     },
//     beforeItemUseOn: ({ source, item, blockLocation }) => {
//         const name = source.getName();
//         if (!global.scoreObject[name].staff) {
//             if (bannedItems.some(({ id, response }) => id === item.id && response > 2) || item.id.includes('tile.')) {
//                 const name = source.getName();
//                 global.playerMap[name].usingCBE = true;
//                 global.playerMap[name].placedCBE = item.id;
//                 return true;
//             }
//         }

//     },
//     blockPlace: ({ player, block: { location, type }, dimension }) => {
//         const name = player.getName();
//         if (!global.scoreObject[name].staff) {
//             if (bannedItems.some(({ id, response }) => id === type.id && response > 2) || type.id.includes('tile.')) {
//                 const name = player.getName();
//                 dimension.getBlock(location).setType(MinecraftBlockTypes.get('air'));
//                 global.playerMap[name].placedCBE = type.id;
//             }
//         }
//     }
// });
