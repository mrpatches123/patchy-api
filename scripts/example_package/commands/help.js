import config from '../config.js';
import global from '../../patchy_api/libraries/classes/global.js';
import commandBuilder from "../../patchy_api/libraries/classes/commands.js";


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
    callback: (sender, args, command, prefix) => {
            console.warn('args', args.length, sender.getName());
            switch (args.length) {
                case 0:
                    sender.runCommands([
                        `playsound note.hat @s`,
                        `tellraw @s {"rawtext":[{"text":"§l§e---------------\n§r§eCommands List:${commandBuilder[prefix].map((command, { description }) => `\n §r§f- §a§l${prefix}§r§a${command} | ${description}`).join('')} \n§l§e---------------"}]}`
                    ]);
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
