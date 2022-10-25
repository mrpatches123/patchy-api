
import commandBuilder from "../libraries/classes/commands.js";
import errorLogger from "../libraries/classes/error.js";
import propertyBuilder from "../libraries/classes/property.js";
import tagDatabases from "../libraries/classes/tag_database.js";
import { overworld, content, assignToPath } from "../libraries/utilities.js";
import config from '../config.js';
const { commandPrefix: prefix } = config;
commandBuilder.register('tagdatabases', {
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
        sender.tell(JSON.stringify(tagDatabases));
    }
});