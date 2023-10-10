import { commandBuilder, structureBuilder } from '../modules.js';
import config from '../config.js';
const { commandPrefix: prefix } = config;
function relativeParse(player, input, direction) {
    if (input.includes('~')) {
        if (input.endsWith('*')) {
            return ((player.location[direction] + Number(input.replace(/[*~]/g, ''))) | 0) + 0.5;
        }
        else {
            return player.location[direction] + Number(input.replace('~', ''));
        }
    }
    else {
        return Number(input);
    }
}
commandBuilder.register('structure', {
    description: "Used to get the Stringified value of something stored in requests",
    usages: [
        `${prefix}requests <key>`,
    ],
    prefix,
    requires: {
        score: {
            staff: 1
        }
    },
    aliases: ['struct'],
    callback: (sender, args) => {
        let [action, name, x1S, y1S, z1S, x2S, y2S, z2S] = args;
        const { dimension } = sender;
        const x1 = Math.floor(relativeParse(sender, x1S, 'x'));
        const y1 = Math.floor(relativeParse(sender, y1S, 'y'));
        const z1 = Math.floor(relativeParse(sender, z1S, 'z'));
        const location1 = { x: x1, y: y1, z: z1 };
        switch (action) {
            case 'save': {
                const x2 = Math.floor(relativeParse(sender, x2S, 'x'));
                const y2 = Math.floor(relativeParse(sender, y2S, 'y'));
                const z2 = Math.floor(relativeParse(sender, z2S, 'z'));
                const location2 = { x: x2, y: y2, z: z2 };
                structureBuilder.save({
                    name: name,
                    location1,
                    location2,
                    dimension,
                    saveMode: 'disk'
                });
                break;
            }
            case 'load': {
                structureBuilder.load({
                    dimension,
                    name: name,
                    location: location1
                });
                break;
            }
        }
    }
});
//!struct save test ~* ~-40* ~* ~150* ~80* ~150*
//# sourceMappingURL=structure.js.map