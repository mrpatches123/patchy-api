import { world, MinecraftItemTypes, ItemStack, ItemTypes } from '@minecraft/server';
import { unstackableItems, stackable16Items } from './unstackable_items.js';
import { players, eventBuilder, overworld, andArray } from '../../../../patchy_api/modules.js';
eventBuilder.subscribe('unstackables', {
    tickAfterLoad: () => {
        players.get({ scoreOptions: [{ exclude: true, maxScore: 1, minScore: 1, objective: 'staff' }] }).iterate(player => {
            const inventory = players.getInventory(player);
            const { inventory: container } = inventory;
            let stackArray = [];
            inventory.iterate((item, i) => {
                if (!item) { return; }
                if (unstackableItems.includes(item.id) && item.amount > 1) {
                    stackArray.unshift(`${item.id} ${item.amount}>1`);
                    container.setItem(i, Object.assign(item, { amount: 1 }));
                } else if (stackable16Items.includes(item.id) && item.amount > 16) {
                    stackArray.unshift(`${item.id} ${item.amount}>16`);
                    container.setItem(i, Object.assign(item, { amount: 16 }));
                } else if (item.amount > 64) {
                    stackArray.unshift(`${item.id} ${item.amount}>64`);
                    container.setItem(i, Object.assign(item, { amount: 64 }));
                }
            });
            if (stackArray.length) {
                discipline.check(player, `§4stacked §1${andArray(stackArray)}`, 'stack');
            }
        });

    }
});
