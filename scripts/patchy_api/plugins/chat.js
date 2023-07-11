import eventBuilder from "../libraries/classes/events/export_instance.js";
import commandBuilder from '../libraries/classes/commands.js';
eventBuilder.subscribe('commands*API', {
    beforeChat: (event) => {
        const { message, sender } = event;
        const { name } = sender;
        const prefix = commandBuilder.getPrefix(message);
        // content.warn({ prefix });

        if (prefix) {
            commandBuilder.check(message, sender, prefix);
            event.sendToTargets = true;
            event.setTargets([]);
        }
        //  else {
        //     if (!promptBuilder.check(sender, message)) {
        //         // const nameTag = getChatNameTag(sender);
        //         world.sendMessage(`[§e${name}§r]: ${message}`);
        //     }

        // }
    }
});
// } catch (error) {
//     console.warn(error, error.stack);
// }

// return = promptBuilder.check(sender, message) ?? false;
