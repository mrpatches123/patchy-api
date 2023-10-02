import { commandBuilder } from '../modules.js';
import config from '../config.js';
const { commandPrefix: prefix } = config;
commandBuilder.register('commands', {
    description: "Used to get the Stringified value of commands",
    usages: [
        `${prefix}commands`,
    ],
    requires: {
        score: {
            staff: 1
        }
    },
    prefix,
    aliases: ['cmds'],
    callback: (sender, args) => {
        sender.sendMessage(JSON.stringify(commandBuilder, (key, value) => (value instanceof Function) ? '<f>' : value, 4));
        // sender.sendMessage(JSON.stringify(eventBuilder));
    }
});
//# sourceMappingURL=commands.js.map