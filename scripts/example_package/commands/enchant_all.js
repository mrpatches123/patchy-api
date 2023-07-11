import config from '../config.js';

const { prefix } = config;

import { world, Player, Container, EnchantmentList, Enchantment, MinecraftEnchantmentTypes, EnchantmentType, ItemStack, MinecraftItemTypes } from '@minecraft/server';
import { commandBuilder, content, native } from '../../patchy_api/modules.js';
/**
 * @type Array<Enchantment>
 */
const Enchantments = Object.values(MinecraftEnchantmentTypes).map(enchantmentType => new Enchantment(enchantmentType, enchantmentType.maxLevel));
commandBuilder.register('enchantall', {
    description: "Used to enchantall the item in hand.",
    usages: [
        `${prefix}enchantall`,
    ],
    requires: {
        score: {
            staff: 1
        }
    },
    prefix,
    callback: (sender, args) => {
        const { name, selectedSlot } = sender;

        /**
         * @type InInventoryComponentContainerventory
         */
        let inventory = sender.getComponent('minecraft:inventory').container;
        for (let i = 0; i < inventory.size; i++) {

            let item = new ItemStack(MinecraftItemTypes.diamondSword);
            let changed;
            /**
             * @type EnchantmentList
             */
            const enchantmentList = item.getComponent('minecraft:enchantments').enchantments;
            Enchantments.forEach((enchantment) => {
                if (enchantmentList.canAddEnchantment(enchantment)) {
                    changed = true;
                    enchantmentList.addEnchantment(enchantment);
                };
            });
            if (changed) {
                let enchantmentListNew = item.getComponent('minecraft:enchantments');
                enchantmentListNew.enchantments = enchantmentList;
                inventory.setItem(i, item);
            }
        }


    }
});


// not required
// just change the "sender.message" to something else


// command stuff
