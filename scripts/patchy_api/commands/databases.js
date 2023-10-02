import commandBuilder from "../libraries/classes/commands.js";
import databases from "../libraries/classes/database.js";
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
        switch (subcommand) {
            case 'print': {
                if (key)
                    return (sender.sendMessage(databases.getFromEntity(args[0])));
                sender.sendMessage(JSON.stringify(databases, (key, value) => (value instanceof Function) ? '<f>' : value));
                break;
            }
            case 'delete': {
                if (!key)
                    return (sender.sendMessage(`key at params[1] is undefined`));
                if (!databases.hasOwnProperty(key))
                    return (sender.sendMessage(`key at params[1] does not exist`));
                databases.delete(key, true);
            }
        }
    }
});
//# sourceMappingURL=databases.js.map