import { commandBuilder, content } from '../modules.js';
import config from '../config.js';
import { world } from '@minecraft/server';
const { commandPrefix: prefix } = config;
commandBuilder.register('playsound', {
    description: "Used playsound",
    usages: [
        `${prefix}ban playerName`,
    ],
    prefix,
    requires: {
        score: {
            staff: 1
        }
    },
    callback: (sender, args) => {
        let [subCommand, id, pitch, volume] = args;
        /*@ts-ignore*/
        pitch = Number(pitch);
        content.warn(subCommand, id, pitch, volume);
        /*@ts-ignore*/
        volume = Number(volume ?? 100);
        switch (subCommand) {
            case 'w':
            case 'world':
                /*@ts-ignore*/
                world.playSound(id, { pitch, volume });
                break;
            case 's':
            case 'self':
                /*@ts-ignore*/
                sender.playSound(id, { pitch, volume });
                break;
        }
    }
});
//# sourceMappingURL=playsound.js.map