import config from '../config.js';
import { formBuilder, commandBuilder, content, players } from '../modules.js';
const { commandPrefix: prefix } = config;

commandBuilder.register('tags', {
    description: "tags",
    prefix,
    usages: [
        `${prefix}tags`
    ],
    requires: {
        score: {
            staff: 1
        }
    },
    callback: (sender, args) => {
        // if (!args[0]) {
        //     sender.getTags().forEach(tag => {
        //         sender.removeTag(tag);
        //     });
        //     tagDatabases.initalizeAll();
        // } else if (args[0] === '%all%') {
        //     players.get().iterate((player) => {
        //         player.getTags().forEach(tag => {
        //             player.removeTag(tag);
        //         });
        //     });
        //     tagDatabases.initalizeAll();
        // } else {
        //     const player = Object.values(players.get({ name: args[0] }).object())[0];
        //     if (!player) return sender.sendMessage(`Player, ${args[0]}, does not exist`);
        //     player.getTags().forEach(tag => {
        //         player.removeTag(tag);
        //     });
        //     tagDatabases.initalizeAll();
        // }
    }
});


