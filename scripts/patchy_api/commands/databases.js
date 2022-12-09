
import commandBuilder from "../libraries/classes/commands.js";
import errorLogger from "../libraries/classes/error.js";
import propertyBuilder from "../libraries/classes/property.js";
import databases from "../libraries/classes/database.js";
import { overworld, content, assignToPath } from "../libraries/utilities.js";
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
        if (args[0]) {
            if (!databases.hasOwnProperty(args[0])) sender.tell(`database: ${args[0]}, does not exist!`);
            sender.tell(databases.getFromEntity(args[0]));
        } else {
            sender.tell(JSON.stringify(databases, (key, value) => (value instanceof Function) ? '<f>' : value));
        }
    }
});