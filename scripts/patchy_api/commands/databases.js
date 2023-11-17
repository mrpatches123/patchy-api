import commandBuilder from "../libraries/classes/commands.js";
import config from '../config.js';
const { commandPrefix: prefix } = config;
commandBuilder.register('databases', {
    description: "Used to get the Stringified value of something stored in dynamic properties",
    usages: [
        `${prefix}property <key>`,
    ],
    prefix,
    requires: {
        score: {
            staff: 1
        }
    },
    aliases: ['dbs'],
    callback: (sender, args) => {
        const [subcommand, key] = args;
    }
});
//# sourceMappingURL=databases.js.map