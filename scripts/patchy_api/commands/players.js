import { players, commandBuilder, native, content } from "../modules.js";

import config from '../config.js';
const { commandPrefix: prefix } = config;
commandBuilder.register('players', {
    description: "Used to get the Stringified value of events",
    usages: [
        `${prefix}events`,
    ],
    prefix,
    requires: {
        score: {
            staff: 1
        }
    },
    callback: (sender, args) => {
        content.warn({ sub: args[0] });
        switch (args[0]) {
            case 'all': {
                const crap = native.stringify(players.get(), null, 4);
                sender.tell(crap);
                console.warn(crap);
                break;
            }
            default: {
                const crap = native.stringify(players, null, 4);
                sender.tell(crap);
                console.warn(crap);
                break;
            }
        }
        // sender.tell(JSON.stringify(eventBuilder));
    }
});