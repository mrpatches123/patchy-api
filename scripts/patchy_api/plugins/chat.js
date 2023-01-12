import eventBuilder from "../libraries/classes/events/export_instance.js";
import promptBuilder from "../libraries/classes/prompt.js";
import commandBuilder from '../libraries/classes/commands.js';
import { overworld, content } from "../libraries/utilities.js";
import { world } from "@minecraft/server";
import formBuilder from '../libraries/classes/form.js';
// import { getChatNameTag } from '../../factions/plugins/player/name_tag.js';
formBuilder.create('testtogglesystem', {
    action: [
        {
            toggle: {
                options: [
                    {
                        text: 'option1: §aON'
                    },
                    {
                        text: 'option1: §aOFF'
                    }
                ],
                dependancy: 'world'
            }
        },
        {
            toggle: {
                options: [
                    {
                        text: 'option2: §aON'
                    },
                    {
                        text: 'option2: §aOFF'
                    }
                ],
                dependancy: 'world'
            }
        }
    ]
});

eventBuilder.subscribe('commands*API', {
    beforeChat: (event) => {
        const { message, sender } = event;
        const { name } = sender;
        const prefix = commandBuilder.getPrefix(message);
        // content.warn({ prefix });
        event.sendToTargets = true;
        event.targets = [];
        if (prefix) {
            commandBuilder.check(message, sender, prefix);

        } else {
            if (!promptBuilder.check(sender, message)) {
                // const nameTag = getChatNameTag(sender);
                world.say(`[§e${name}§r]: ${message}`);

            }

        }
    }
});
// } catch (error) {
//     console.warn(error, error.stack);
// }

// return = promptBuilder.check(sender, message) ?? false;
