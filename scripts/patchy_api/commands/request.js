
import { requestBuilder, content, commandBuilder } from '../modules.js';
import config from '../config.js';
const { commandPrefix: prefix } = config;
commandBuilder.register('requests', {
    description: "Used to get the Stringified value of something stored in requests",
    usages: [
        `${prefix}requests <key>`,
    ],
    prefix,
    requires: {
        score: {
            staff: 1
        }
    },
    aliases: ['prop'],
    callback: (sender, args) => {
        sender.tell(JSON.stringify({ requestBuilder }));
    }
});