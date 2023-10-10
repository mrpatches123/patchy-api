import { commandBuilder, native } from '../modules.js';
import loads from '../libraries/classes/load.js';
import config from '../config.js';
const { commandPrefix: prefix } = config;
commandBuilder.register('loads', {
    description: "Used to get the Stringified value of loads",
    usages: [
        `${prefix}loads`,
    ],
    requires: {
        score: {
            staff: 1
        }
    },
    prefix,
    aliases: ['cmds'],
    callback: (sender, args) => {
        /*@ts-ignore*/
        sender.sendMessage(native.stringify(loads, (key, value) => (value instanceof Function) ? '<f>' : value, 4));
        // sender.sendMessage(JSON.stringify(eventBuilder));
    }
});

