import { eventBuilder, players } from '../../../patchy_api/modules.js';

eventBuilder.subscribe('itemChangeLog', {
    tickAfterLoad: () => {
        players.get({ scoreOptions: [{ exclude: true, maxScore: 1, minScore: 1, objective: 'staff' }] }).iterate(player => {
            const { memory, inventory } = player;
            if (!memory.hasOwnProperty('itemsChangeArray')) memory.itemsChangeArray = [];
            let itemArray = [];
            inventory.iterate((item, i) => {
                if (!item) { return; }
                let itemS = { slot: i, id: item.id, amount: item.amount, data: item.data };
                itemArray.push(itemS);
            });
            const { oldItemArray = itemArray } = memory;
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
                try { overworld.runCommandAsync(`tellraw @a[scores={Notifications=1,InvNotifications=1}] {"rawtext":[{"text":"§l§f[§9PAC§f] §7${name} §f${itemChangeMessage}"}]}`); } catch { }
            }
            if (memory.itemsChangeArray.length > 2) {
                memory.itemsChangeArray.pop();
            }
            memory.itemsChangeArray.unshift({ itemsOutArrayFiltered, itemsInArrayFiltered });
            // content.warn(native.stringify(memory.itemsChangeArray));
            memory.oldItemArray = itemArray;
        });
    }
});