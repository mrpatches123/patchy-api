
import commandBuilder from "../libraries/classes/commands.js";
import errorLogger from "../libraries/classes/error.js";
import propertyBuilder from "../libraries/classes/property.js";
import { overworld, content, assignToPath } from "../libraries/utilities.js";
import config from '../config.js';
const { commandPrefix: prefix } = config;
commandBuilder.register('property', {
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
    aliases: ['prop'],
    callback: (sender, args) => {
        if (args[0].includes('.')) {
            try {
                const value = world.getDynamicProperty(args[0]);

                const object = assignToPath(args[0].split('.'), {}, value);
                sender.tellrawStringify(object);
            } catch {
                sender.tell(`property: ${args[0]}, does not exist`);
            }
        } else {
            const object = propertyBuilder.getObjectFromKey(args[0]);
            if (object) {
                sender.tellrawStringify(object);
            } else {
                sender.tell('errpr');
            }
        }
    }
});