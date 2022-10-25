import { world, MinecraftItemTypes, ItemStack, Items } from '@minecraft/server';


import { overworld, content, native } from "../../../patchy_api/libraries/utilities.js";
import databases from '../../../patchy_api/libraries/classes/database.js';
import global from '../../../patchy_api/libraries/classes/global.js';
import eventBuilder from '../../../patchy_api/libraries/classes/events.js';
eventBuilder.subscribe('itemChangeLog', {
    tickAfterLoad: () => {
        const { playerMap } = global;
        global.players.forEach((id, player) => {
            const name = player.getName();
            if (!global.playerMap[name].itemsChangeArray) {
                global.playerMap[name].itemsChangeArray = [];
            }
            let itemArray = [];
            const { items } = playerMap[name];
            items.forEach((item, i) => {
                if (!item) { return; }
                let itemS = { slot: i, id: item.id, amount: item.amount, data: item.data };

                itemArray.push(itemS);
            });
            const { oldItemArray = itemArray } = playerMap[name] ?? {};
            const itemsOutArray = oldItemArray.filter(old => !itemArray.some(current => current.amount === old.amount && current.data === old.data && current.id === old.id && current.slot === old.slot));
            const itemsInArray = itemArray.filter(current => !oldItemArray.some(old => old.amount === current.amount && old.data === current.data && old.id === current.id && old.slot === current.slot));
            const itemsOutArrayFiltered = itemsOutArray.map(itemsOut => ({ slot: itemsOut.slot, id: itemsOut.id, amount: itemsOut.amount - (itemsInArray.find(itemsIn => itemsIn.data === itemsOut.data && itemsIn.id === itemsOut.id && itemsIn.slot === itemsOut.slot) ?? { amount: 0 }).amount, data: itemsOut.data })).filter(item => item.amount >= 0);
            const itemsInArrayFiltered = itemsInArray.map(itemsIn => ({ slot: itemsIn.slot, id: itemsIn.id, amount: itemsIn.amount - (itemsOutArray.find(itemsOut => itemsOut.data === itemsIn.data && itemsOut.id === itemsIn.id && itemsOut.slot === itemsIn.slot) ?? { amount: 0 }).amount, data: itemsIn.data })).filter(item => item.amount >= 0);

            let itemChangeMessage = '';
            if (itemsOutArrayFiltered.length) {
                itemChangeMessage += 'Lost: ';
                for (const item of itemsOutArrayFiltered) {
                    itemChangeMessage += `S=${item.slot},I=${item.id},A=${item.amount},D=${item.data} | `;
                }
            } if (itemsInArrayFiltered.length) {
                itemChangeMessage += `${(itemsOutArrayFiltered.length) ? ' and ' : ''} Obtained: `;
                for (const item of itemsInArrayFiltered) {
                    itemChangeMessage += `S=${item.slot},I=${item.id},A=${item.amount},D=${item.data} | `;
                }
            } if (itemsInArrayFiltered.length || itemsOutArrayFiltered.length) {
                // console.warn(JSON.stringify(oldItemArray),JSON.stringify(itemArray),JSON.stringify(itemsOutArray),JSON.stringify(itemsInArray));

                // console.warn(JSON.stringify(itemsOutArray),JSON.stringify(itemsInArray),itemChangeMessage);
                try { overworld.runCommand(`tellraw @a[scores={Notifications=1,InvNotifications=1}] {"rawtext":[{"text":"§l§f[§9PAC§f] §7${name} §f${itemChangeMessage}"}]}`); } catch { }
            }
            if (global.playerMap[name].itemsChangeArray.length > 2) {
                global.playerMap[name].itemsChangeArray.pop();
            }
            global.playerMap[name].itemsChangeArray.unshift({ itemsOutArrayFiltered, itemsInArrayFiltered });
            // content.warn(native.stringify(global.playerMap[name].itemsChangeArray));
            global.playerMap[name].oldItemArray = itemArray;
        });
    }
});