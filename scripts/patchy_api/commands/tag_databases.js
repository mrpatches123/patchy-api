import commandBuilder from "../libraries/classes/commands.js";
import tagDatabases from "../libraries/classes/tag_database.js";
import { content } from "../libraries/utilities.js";
import config from '../config.js';
import { players } from "../modules.js";
const { commandPrefix: prefix } = config;
commandBuilder.register('tagdatabases', {
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
    aliases: ['tdbs'],
    callback: (sender, args) => {
        const [subCommand, type, name] = args;
        const player = players.get({ name }).array()[0];
        content.warn({ tdbs: player.name });
        switch (subCommand) {
            case 'print': {
                switch (type) {
                    case 'memory': {
                        sender.sendMessage(JSON.stringify(tagDatabases, (key, value) => (value instanceof Function) ? '<f>' : value));
                    }
                    case 'tag': {
                        sender.sendMessage(JSON.stringify(tagDatabases.getTestRaw(player ?? sender), (key, value) => (value instanceof Function) ? '<f>' : value));
                    }
                }
                break;
            }
            case 'length': {
                switch (type) {
                    case 'memory': {
                        sender.sendMessage(JSON.stringify({ length: JSON.stringify(tagDatabases).length }));
                    }
                    case 'tag': {
                        sender.sendMessage(JSON.stringify({ length: JSON.stringify(tagDatabases.getTestRaw(player ?? sender)).length }));
                    }
                }
                break;
            }
        }
    }
});
//# sourceMappingURL=tag_databases.js.map