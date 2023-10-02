import config from '../config.js';
const { commandPrefix: prefix } = config;
import { commandBuilder } from '../../patchy_api/modules.js';
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
            sender.sendMessage('§cYou must input a itemName!');
        }
        else {
            let inventory = sender.getComponent('minecraft:inventory').container;
            let item = inventory.getItem(selectedSlot);
            if (!item) {
                sender.sendMessage('§cYou must hold a item to rename!');
            }
            else {
                item.nameTag = args[0].replaceAll('\\n', '\n');
                inventory.setItem(selectedSlot, item);
            }
        }
    }
});
// not required
// just change the "sender.message" to something else
// command stuff
//# sourceMappingURL=rename.js.map