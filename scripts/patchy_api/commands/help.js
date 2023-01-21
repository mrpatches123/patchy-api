import config from '../config.js';

import { commandBuilder } from '../modules.js';
const { commandPrefix: prefix } = config;
commandBuilder.register('help', {
    description: "Used to get all available commands or infomation about a specific command.",
    usages: [
        `help`,
        `help <command>`,
        `help faction`,
        `help <command> <subCommand>`,
        `help faction create`
    ],
    prefix,
    callback: (sender, args) => {
        switch (args.length) {
            case 0:
                sender.tell(commandBuilder.listCommands(prefix, sender));
                sender.playSound('note.hat');
                break;
            case 1:
            case 2:
                commandBuilder.getInfo(sender, prefix, ...args);
                break;
            default:
                break;
        }
    }
});
