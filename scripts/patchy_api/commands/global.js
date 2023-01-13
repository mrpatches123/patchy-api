import config from '../config.js';
import global from '../../patchy_api/libraries/classes/global.js';
import commandBuilder from "../../patchy_api/libraries/classes/commands.js";
import { native } from '../modules.js';

const { commandPrefix: prefix } = config;
commandBuilder.register('global', {
    description: "Used to get the Stringified value of a key in global",
    usages: [
        `${prefix}global <key>`,
    ],
    // requires: {
    //     score: {
    //         staff: 1
    //     }
    // },
    callback: (sender, args) => {

        if (!args.length) {
            sender.tell(JSON.stringify(global));
        } else {
            if (global[args[0]]) {
                sender.tell(JSON.stringify(global[args[0]], null, 4));
            } else {
                sender.tell(`key: ${args[0]}, doesn't exist`);
            }
        };
    }
});
