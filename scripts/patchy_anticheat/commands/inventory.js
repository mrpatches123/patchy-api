import config from '../config.js';
import global from '../../patchy_api/libraries/classes/global.js';
import commandBuilder from "../../patchy_api/libraries/classes/commands.js";
import promptBuilder from '../../patchy_api/libraries/classes/prompt.js';
import databases from '../../patchy_api/libraries/classes/database.js';

import { Player } from '@minecraft/server';
import { content, andArray, overworld, staff } from '../../patchy_api/libraries/utilities.js';
import { world, BlockLocation } from '@minecraft/server';
import eventBuilder from '../../patchy_api/libraries/classes/events/export_instance.js';
import formBuilder from '../../patchy_api/libraries/classes/form.js';
const { floor } = Math;
const { isInteger } = Number;
const prefix = '$';

commandBuilder.register('inventory', {
    description: "Used to get the inventory of a certian online player or your selfs",
    prefix,
    usages: [
        `${prefix}inventory`
    ],
    aliases: ['inv'],
    requires: {
        score: {
            staff: 1
        }
    },
    callback: (sender, args) => {
        formBuilder.showAwait(sender, 'showInv');
    }
});
eventBuilder.subscribe('invSeeCheck', {
    tickAfterLoad: () => {
        global.players.forEach((id, player) => {
            const { headLocation: { x: hx, y: hy, z: hz } } = player;
            let inventoryEntities = player.dimension.getEntitiesAtBlockLocation(new BlockLocation(floor(hx), floor(hy), floor(hz))).filter(({ id }) => id === 'patches:inventory');
            let entity = inventoryEntities.find(entity =>
                entity.location.equals(player.headLocation)
            );
            if (entity) { entity.addTag('player'); }
        });
        try {
            overworld.runCommandAsync('event entity @e[type=patches:inventory,tag=!player] patches:kill_inv');
        } catch { }
    }
});

/*try {
    const name = sender.getName();
    const players = [...world.getPlayers()];
    let playersObject = {};
    players.forEach((player, i) => {
        const playerName = player.getName();
        playersObject[i] = () => {
            sender.tellraw(`§l§f[§9PAC§f] §7you §fcan now §cView §7the §1Inventory§f of §7${playerName}!`);
            staff.tellraw(`§l§f[§9PAC§f] §7${name} §cViewed §7the §1Inventory§f of §7${playerName}!`, sender);
            const entity = sender.dimension.spawnEntity('patches:inventory', sender.headLocation);
            entity.nameTag = 'invsee';
            entity.addTag('player');
            console.warn(overworld.runCommandAsync('tag @e list').statusMessage);
            const playerInventory = player.getComponent('minecraft:inventory').container;
            const entityInventory = entity.getComponent('minecraft:inventory').container;
            for (let i = 0; i < playerInventory.size; i++) {
                const item = playerInventory.getItem(i);
                if (!item) { continue; }
                if (i >= 9) {
                    entityInventory.setItem(i - 9, item);
                } else {
                    entityInventory.setItem(i + 27, item);
                }

            }
            promptBuilder.remove(sender);

        };
    });

    promptBuilder.add(sender, `§l§f[§9PAC§f] §7§cWhich §7player's §1inventory §cwould §fyou like to §cview§7?\n§r§o§7type a the number to select or §ccancel to quit§7.\n${players.map(({ name: playerName }, i) => `§f${i}: §7${playerName}`)}`, Object.assign(playersObject, {
        cancel: () => {
            promptBuilder.remove(sender);
            sender.tellraw('you canceled the menu');
        }
    }));
    promptBuilder.ask(sender);

} catch (error) { console.warn(error, error.stack); };*/
