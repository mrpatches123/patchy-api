import { world, MinecraftItemTypes, ItemStack, Items } from '@minecraft/server';


import { overworld, andArray } from "../../../../patchy_api/libraries/utilities.js";
import databases from '../../../../patchy_api/libraries/classes/database.js';
import global from '../../../../patchy_api/libraries/classes/global.js';
import { content } from '../../../../patchy_api/libraries/utilities.js';
import eventBuilder from '../../../../patchy_api/libraries/classes/events.js';
import { unstackableItems, stackable16Items } from './unstackable_items.js';
eventBuilder.subscribe('unstackables', {
    tickAfterLoad: () => {
        global.nonStaffPlayers.forEach((id, player) => {
            let anticheat = databases.get('anticheat') ?? databases.add('anticheat');
            const name = player.getName();
            const { playerMap, toggles, scoreObject } = global;
            const { playerId } = scoreObject[name] ?? {};
            let stackArray = [];
            const { items, inventory: playerInventory } = playerMap[name];
            items.forEach((item, i) => {
                if (!item) { return; }
                if (unstackableItems.includes(item.id) && item.amount > 1) {
                    stackArray.unshift(`${item.id} ${item.amount}>1`);
                    playerInventory.setItem(i, new ItemStack(Items.get(item.id), 1, item.data));
                } else if (stackable16Items.includes(item.id) && item.amount > 16) {
                    stackArray.unshift(`${item.id} ${item.amount}>16`);
                    playerInventory.setItem(i, new ItemStack(Items.get(item.id), 16, item.data));
                } else if (item.amount > 64) {
                    stackArray.unshift(`${item.id} ${item.amount}>64`);
                    playerInventory.setItem(i, new ItemStack(Items.get(item.id), 64, item.data));
                }
            });
            if (stackArray.length) {
                discipline.check(player, `§4stacked §1${andArray(stackArray)}`, 'stack', i);
            }


        });
    }
});
