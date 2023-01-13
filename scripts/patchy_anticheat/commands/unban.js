import config from '../config.js';
import global from '../../patchy_api/libraries/classes/global.js';
import commandBuilder from "../../patchy_api/libraries/classes/commands.js";
import databases from '../../patchy_api/libraries/classes/database.js';

import { Player } from '@minecraft/server';
import { content, overworld, andArray, staff, typeOf } from '../../patchy_api/libraries/utilities.js';
import { scoreboardsNames } from '../plugins/initialization/initialize.js';
const { isInteger } = Number;



const { commandPrefix: prefix } = config;

commandBuilder.register('unban', {
    prefix,
    description: "Used to get all available commands or infomation about a specific command.",
    usages: [
        `${prefix}unban`,
        `${prefix}unban <playerName> <?resetFlags: true>`,
        `${prefix}unban <"player Name">`,
        `${prefix}unban %all%`,
        `${prefix}unban <playerId: 2147483646>`,
        `${prefix}unban "The Cool Man" false`,
        `${prefix}unban 2147483646`,
        `${prefix}unban mrpatch1837 true`
    ],
    requires: {
        score: {
            staff: 1
        }
    },
    callback: (sender, args) => {
        const name = sender.getName();
        // const nameTag = sender.getNameTag();
        console.warn('args', args.length, sender.getName());
        let anticheat = databases.getFromEntity('anticheat');
        content.warn({ type: typeOf(anticheat), anticheat });
        if (anticheat === undefined) {
            sender.tell('§l§f[§9PAC§f] §cNo §7players §chave been banned!');
        } else {
            console.warn(args[0]);
            switch (args[0]) {
                case '%all%':
                    let names = [];
                    anticheat.filter(id => isInteger(Number(id))).forEach((id, value) => {
                        if (Boolean(args[1])) {
                            scoreboardsNames.forEach(objective => {
                                overworld.runCommandAsync(`scoreboard players set "${value.nameTag}" ${objective} 0`);
                            });
                        }
                        names.push(anticheat.get(id).name ?? 'undefined');
                        anticheat.delete(id);
                        databases.queueSave('anticheat');
                    });
                    sender.tell(`§l§f[§9PAC§f] §7You §aUnbanned §cAll §fof the following §7players: §7${andArray(names)}§f!`);
                    staff.tellraw(`§l§f[§9PAC§f] §7${name} §aUnbanned §cAll §fof the following §7players: §7${andArray(names)}§f!`, sender);
                    break;
                case undefined:
                    sender.tell(`§l§f[§9PAC§f] §cYou must input a playername, "player Name".  or %all%!`);
                    break;
                default:
                    const playerId = anticheat.find((id, value) => value.name === args[0]);
                    content.warn({ anticheat, playerId });

                    if (playerId) {
                        const playerAC = anticheat.get(playerId);
                        sender.tell(`§l§f[§9PAC§f] §7You §aUnbanned §7${playerAC.name ?? 'undefined'}!`);
                        staff.tellraw(`§l§f[§9PAC§f] §7${name} §aUnbanned §7${playerAC.name ?? 'undefined'}§f!`, sender);
                        anticheat.delete(playerId);
                        databases.queueSave('anticheat');
                        content.warn({ anticheat });
                    } else {
                        sender.tell(`§l§f[§9PAC§f] §7${args[0]} §cis not §1Banned §cor does not §4Exist§f!`);
                    }
                    break;
            }
        }
    }
});
