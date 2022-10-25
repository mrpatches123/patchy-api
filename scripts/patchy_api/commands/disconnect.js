
import commandBuilder from "../libraries/classes/commands.js";
import errorLogger from "../libraries/classes/error.js";
import propertyBuilder from "../libraries/classes/property.js";
import databases from "../libraries/classes/database.js";
import { overworld, content, assignToPath } from "../libraries/utilities.js";
import config from '../config.js';
const { commandPrefix: prefix } = config;
commandBuilder.register('disconnect', {
    description: "Disconnects You",
    usages: [
        `${prefix}disconnect`,
    ],
    prefix,
    requires: {
        score: {
            staff: 1
        }
    },
    aliases: ['dbs'],
    callback: (sender, args) => {
        sender.disconnect();
    }

});