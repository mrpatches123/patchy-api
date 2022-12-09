
import { overworld, andArray, toProperCase } from "../../../../patchy_api/libraries/utilities.js";
import databases from '../../../../patchy_api/libraries/classes/database.js';
import global from '../../../../patchy_api/libraries/classes/global.js';
import { content, native } from '../../../../patchy_api/libraries/utilities.js';
import eventBuilder from '../../../../patchy_api/libraries/classes/events.js';
import { exemptedItems, maxEnchantmentsPerItems } from './exempted_items.js';
import { MinecraftEnchantmentTypes, EnchantmentList } from '@minecraft/server';
eventBuilder.subscribe('use32k', {
    tickAfterLoad: () => {
        const { toggles: { modules: { use32k } = {} } = {}, playerMap, scoreObject } = global;

        if (use32k) {
            global.players.forEach((id, player) => {
                const { selectedSlot, name } = player;
                const { boots_prot = 0, leggings_prot = 0, chestplate_prot = 0, helmet_prot = 0, used32k = 0 } = scoreObject[name];
                const defensePoints = boots_prot + leggings_prot + chestplate_prot + helmet_prot;
                // console.warn(defensePoints)
                if (defensePoints) {
                    player.addTag('thorns');
                } else {
                    player.removeTag('thorns');
                }
                const { current } = player.getComponent('minecraft:health');
                if (current >= 20) {
                    player.addTag('FullHP');
                } else {
                    player.removeTag('FullHP');
                }

                const { items, inventory } = playerMap[name];
                const { playerId } = scoreObject[name] ?? {};
                items.forEach((item, i) => {
                    if (!item) { return; }
                    const { id } = item;
                    const enchantments = item.getComponent('minecraft:enchantments');
                    if (!enchantments) { return; }
                    const enchantmentList = enchantments.enchantments;
                    const enchantArray = enchantmentList.getArray();
                    enchantArray.forEach(({ level, type: { id: enchantId, maxLevel } }) => {
                        if (level > maxEnchantmentsPerItems.find(object => object.items.includes(id))?.enchants[enchantId] ?? maxLevel) {
                            player.runCommandAsync('say found32k');
                        }
                    });
                });
                let item = items[selectedSlot];
                if (item && Object.keys(exemptedItems).includes(item.id)) {
                    player.addTag('CanOneHit');
                } else {
                    player.removeTag('CanOneHit');
                }
                if (used32k) {

                    inventory.setItem(selectedSlot, Object.assign(item, { amount: 0 }));
                    player.runCommandAsync('say 32ker');
                    player.scoreSet('used32k');
                }
                player.removeTag('32KOFF');


            });

        } else {
            global.players.forEach((id, player) => {
                player.addTag('32KOFF');
            });
        }

    }
});



