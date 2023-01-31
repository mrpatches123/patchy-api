import { bannedItems } from './banned_items.js';
import { Items, ItemStack, world } from "@minecraft/server";
import discipline from "../../../libraries/discipline.js";
import { players, eventBuilder, andArray, toProperCase } from "../../../../patchy_api/modules.js";
eventBuilder.subscribe('give', {
    tickAfterLoad: () => {
        // const itemEntites = [...overworld.getEntities(Object.assign(new EntityQueryOptions, { type: 'minecraft:item' }))].filter(entity => {
        //     if (entity) { return entity; }
        // }).map(entity => entity.getComponent('item'));
        // content.warn(native.stringify(itemEntites));
        players.get({ scoreOptions: [{ exclude: true, maxScore: 1, minScore: 1, objective: 'staff' }] }).iterate(player => {


            let notificationArray = Array.from(Array(4), () => []);
            const { inventory } = player;
            inventory.iterate((item, i) => {
                if (!item) { return; }
                const { typeId } = item;
                if (!bannedItems.hasOwnProperty(typeId)) return;
                // content.warn(index);
                const { response } = bannedItems[typeId];
                if (response) {
                    if (response > 1) {
                        notificationArray[response - 2].push(`a ${toProperCase(item.id.replace('minecraft:', '').replace('_', ' '))}`);
                    }
                    return Object.assign(item, { amount: 0 });
                }


            });
            notificationArray.forEach((array, i) => {
                if (array.length) {
                    discipline.check(player, `§4had §1${andArray(notificationArray[i])}`, 'give', i + 2);
                }
            });
        });
        // global.lastItemEntityArray = itemEntites;
    }
});
// let crap = itemsOutArray.map(out => ({slot:out.slot,id:out.id,amount: ))
