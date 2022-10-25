import { overworld, andArray, toProperCase, native } from "../../../../patchy_api/libraries/utilities.js";
import databases from '../../../../patchy_api/libraries/classes/database.js';
import global from '../../../../patchy_api/libraries/classes/global.js';
import { content, staff } from '../../../../patchy_api/libraries/utilities.js';
import eventBuilder from '../../../../patchy_api/libraries/classes/events.js';
import { bannedItems } from './banned_items.js';
import { Items, ItemStack, world, EntityQueryOptions } from "@minecraft/server";
import discipline from "../../../libraries/discipline.js";
const air = new ItemStack(Items.get('air'), 0, 0);
eventBuilder.subscribe('give', {
    tickAfterLoad: () => {
        const { playerMap, toggles, scoreObject, lastItemEntityArray } = global;
        // const itemEntites = [...overworld.getEntities(Object.assign(new EntityQueryOptions, { type: 'minecraft:item' }))].filter(entity => {
        //     if (entity) { return entity; }
        // }).map(entity => entity.getComponent('item'));
        // content.warn(native.stringify(itemEntites));
        global.nonStaffPlayers.forEach((id, player) => {
            let anticheat = databases.get('anticheat') ?? databases.add('anticheat');
            const name = player.getName();
            const { items, inventory: playerInventory, itemsChangeArray } = playerMap[name];
            const { playerId } = scoreObject[name] ?? {};
            let notificationArray = Array.from(Array(4), () => []);
            items.forEach((item, i) => {
                if (!item) { return; }
                const index = bannedItems.findIndex(({ id, data, nameTag }) => (!id || item.id.includes(id)) && (!data || data === item.data) && (!nameTag || item.nameTag.toString().includes(nameTag)));
                // content.warn(index);
                if (index > -1) {
                    const response = bannedItems[index].response;
                    if (response) {
                        playerInventory.setItem(i, air);
                        if (response > 1) {
                            notificationArray[response - 2].push(`a ${toProperCase(item.id.replace('minecraft:', '').replace('_', ' '))}`);
                            // content.warn({ notificationArray });
                        }
                    }
                }
                notificationArray.forEach((array, i) => {
                    if (array.length) {
                        discipline.check(player, `§4had §1${andArray(notificationArray[i])}`, 'give', i + 2);
                    }
                });

            });
        });
        // global.lastItemEntityArray = itemEntites;
    }
});
// let crap = itemsOutArray.map(out => ({slot:out.slot,id:out.id,amount: ))
