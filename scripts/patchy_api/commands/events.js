import commandBuilder from "../libraries/classes/commands.js";
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
        sender.sendMessage(JSON.stringify(eventBuilder, (key, value) => (value instanceof Function) ? '<f>' : value, 4));
        // sender.sendMessage(JSON.stringify(eventBuilder));
    }
});
//# sourceMappingURL=events.js.map