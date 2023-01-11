
import commandBuilder from "../libraries/classes/commands.js";
import errorLogger from "../libraries/classes/error.js";
import propertyBuilder from "../libraries/classes/property.js";
import databases from "../libraries/classes/database.js";
import { overworld, content, assignToPath, native } from "../libraries/utilities.js";
import config from '../config.js';
import eventBuilder from "../libraries/classes/events/export_instance.js";
const { commandPrefix: prefix } = config;
commandBuilder.register('events', {
    description: "Used to get the Stringified value of events",
    usages: [
        `${prefix}events`,
    ],
    prefix,
    callback: (sender, args) => {
        sender.tellraw(JSON.stringify(eventBuilder, (key, value) => (value instanceof Function) ? '<f>' : value, 4));
        // sender.tellraw(JSON.stringify(eventBuilder));
    }
});