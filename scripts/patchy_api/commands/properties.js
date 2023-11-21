import { commandBuilder, propertyManager } from '../modules.js';
import config from '../config.js';
const { commandPrefix: prefix } = config;
commandBuilder.register('properties', {
    description: "Used to get the Stringified value of properties",
    usages: [
        `${prefix}properties`,
    ],
    requires: {
        score: {
            staff: 1
        }
    },
    prefix,
    aliases: ['props'],
    callback: (sender, args) => {
        sender.sendMessage(JSON.stringify(propertyManager, (key, value) => (value instanceof Function) ? '<f>' : value, 4));
        // sender.sendMessage(JSON.stringify(eventBuilder));
    }
});
//# sourceMappingURL=properties.js.map