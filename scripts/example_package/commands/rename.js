import config from '../config.js';
import global from '../../patchy_api/libraries/classes/global.js';
import commandBuilder from "../../patchy_api/libraries/classes/commands.js";
import { content, native } from "../../patchy_api/libraries/utilities.js";

const { prefix } = config;





commandBuilder.register('rename', {
    description: "Used to enchant the item in hand.",
    usages: [
        `${prefix}rename`,
        `${prefix}rename "ItemName: string (\\n for enter and \${item} for the existing ItemName)"`,
    ],
    requires: {
        score: {
            staff: 1
        }
    },
    prefix,
    callback: (sender, args) => {
        const { name, selectedSlot } = sender;

        if (args[0] === undefined) {
            sender.tellraw('§cYou must input a itemName!');
        } else {
            let inventory = sender.getComponent('minecraft:inventory').container;
            let item = inventory.getItem(selectedSlot);
            if (!item) {
                sender.tellraw('§cYou must hold a item to rename!');
            } else {
                item.nameTag = args[0].replaceAll('\\n', '\n');
                inventory.setItem(selectedSlot, item);
            }
        }

    }
});


// not required
// just change the "sender.message" to something else


// command stuff
