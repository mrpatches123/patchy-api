
import commandBuilder from "../libraries/classes/commands.js";
import errorLogger from "../libraries/classes/error.js";
import databases from "../libraries/classes/database.js";
import { overworld, content, assignToPath } from "../libraries/utilities.js";
import config from '../config.js';
import { Entity } from "@minecraft/server";
import { Player, players } from "patchy_api/modules.js";
const { commandPrefix: prefix } = config;
commandBuilder.register('databases', {
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
    aliases: ['dbs'],
    callback: (sender, args) => {
        const [subcommand, key, playerName] = args;
        switch (subcommand) {
            case 'get': {
                if (!key) return sender.sendMessage('You must specify a key');
                let player: Player | undefined;;
                if (playerName) {
                    player = players.get({ name: playerName }).array()[0];
                }
                sender.sendMessage(JSON.stringify(databases.get(key, player), (key, value) => (value instanceof Function) ? '<f>' : value, 4));
                break;
            } case 'print': {
                sender.sendMessage(JSON.stringify(databases, (key, value) => (value instanceof Function) ? '<f>' : value, 4));
                break;
            } case 'list': {
                sender.sendMessage(JSON.stringify(Object.keys(databases.databases), (key, value) => (value instanceof Function) ? '<f>' : value, 4));
                break;
            }

        }

    }
});