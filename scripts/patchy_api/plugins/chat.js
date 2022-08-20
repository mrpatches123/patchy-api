import eventBuilder from "../libraries/classes/events.js";
import promptBuilder from "../libraries/classes/prompt.js";
import commandBuilder from '../libraries/classes/commands.js';
import { overworld, content } from "../libraries/utilities.js";
// import { getChatNameTag } from '../../factions/plugins/player/name_tag.js';

const tellrawServer = (message) => {
    overworld.runCommand(`tellraw @a {"rawtext":[{"text":"${message.replaceAll('"', "'")}"}]}`);
};
eventBuilder.subscribe('commands', {
    beforeChat: ({ message, sender }) => {
        const name = sender.getName();
        content.warn(Object.keys(commandBuilder));
        const prefix = commandBuilder.getPrefix(message);
        console.warn(prefix);
        if (prefix) {
            commandBuilder.check(message, sender, prefix);
            return true;
        } else {
            if (!promptBuilder.check(sender, message)) {
                // const nameTag = getChatNameTag(sender);
                tellrawServer(`${name}: ${message}`);
                return true;
            } else {
                return true;
            }

        }
    }
});
// } catch (error) {
//     console.warn(error, error.stack);
// }

// return = promptBuilder.check(sender, message) ?? false;
