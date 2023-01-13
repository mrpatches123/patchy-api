import { world } from '@minecraft/server';

import config from '../config.js';
import global from '../../patchy_api/libraries/classes/global.js';
import commandBuilder from "../../patchy_api/libraries/classes/commands.js";
import databases from '../../patchy_api/libraries/classes/database.js';

import { andArray, staff } from '../../patchy_api/libraries/utilities.js';
const { commandPrefix: prefix } = config;
commandBuilder.register('toggles', {
    description: "used to set or remove a toggle",
    prefix,
    usages: {
        'reset|r': {
            subDescription: 'reset or deletes a toggle',
            examples: [
                `${prefix}toggles reset <toggle: string>`
            ]
        },
        'set|s': {
            subDescription: 'set a toggle',
            examples: [
                `${prefix}toggles set <toggle: string> <value: any>`
            ]
        }

    },
    requires: {
        score: {
            staff: 1
        }
    },
    aliases: ['t'],
    callback: (sender, args) => {
        const name = sender.getName();
        let anticheat = databases.get('anticheat');
        let toggles = anticheat.get('toggles');
        switch (args[0]) {
            case 'reset':
            case 'r':
                if (args[1] === undefined) {
                    sender.tell('§l§f[§9PAC§f] §cYou must input a toggle at §1Args[1]§c!');
                } else if (toggles[args[1]] !== undefined) {
                    delete toggles[args[1]];
                    global.toggles = toggles;
                    anticheat.set('toggles', toggles);
                    databases.queueSave('anticheat');
                    sender.tell(`§l§f[§9PAC§f] §7You §4removed §7${args[1]} §ffrom §1Toggles§7!`);
                    staff.tellraw(`§l§f[§9PAC§f] §7${name} §4removed §7${args[1]} §ffrom §1Toggles§7!`, sender);
                } else {
                    sender.tell(`§l§f[§9PAC§f] §fThe §1toggle: §7${args[1]}, §cdoes not exist`);
                }

                break;
            case 'set':
            case 's':
                if (typeof args[1] !== 'string') {
                    sender.tell(`\u00A7cexpected a string at argument 1 but instead got ${args[1]}`);
                } else if (!Number.isInteger(Number(args[2])) && typeof args[2] !== 'string') {
                    sender.tell(`\u00A7cexpected a integer at argument 2 but instead got ${args[3]}`);
                } else if (args.length < 3 && args.length > 4) {
                    sender.tell(`\u00A7cexpected 3 or 4 arguments but instead got ${args.length}`);
                } else {
                    if (args.length === 4) {
                        if (toggles[args[1]][args[2]] !== undefined) {
                            toggles[args[1]][args[2]] = Number(args[3]);
                            global.toggles = toggles;
                            anticheat.set('toggles', toggles);
                            databases.queueSave('anticheat');
                            sender.tell(`§l§f[§9PAC§f] §7You §4Set §7${args[2]} §fin the §1Toggle: §7${args[1]}, to ${args[3]} §ffrom §1Toggles§7!`);
                            staff.tellraw(`§l§f[§9PAC§f] §7${name} §4Set §7${args[2]} §fin the §1Toggle: §7${args[1]}, to ${args[3]} §ffrom §1Toggles§7!`, sender);
                        } else {
                            sender.tell(`§l§f[§9PAC§f] §fThe §1Object, §7${args[2]} §ffor §1Toggle: §7${args[1]}, §cdoes not exist`);
                        }
                    } else {
                        if (toggles[args[1]] !== undefined) {
                            toggles[args[1]] = Number(args[2]);
                            global.toggles = toggles;
                            anticheat.set('toggles', toggles);
                            databases.queueSave('anticheat');
                            sender.tell(`§l§f[§9PAC§f] §7You §4Set §1Toggle: §7${args[1]}, to ${args[2]} §ffrom §1Toggles§7!`);
                            staff.tellraw(`§l§f[§9PAC§f] §7${name} §4Set the §1Toggle: §7${args[1]}, to ${args[2]} §ffrom §1Toggles§7!`, sender);
                        } else {
                            sender.tell(`§l§f[§9PAC§f] §fThe §1Toggle: §7${args[1]}, §cdoes not exist`);
                        }
                    }

                }
                break;
            default:
                sender.tell(`§l§f[§9PAC§f] §cexpected reset, r, set, or s at argument 0`);
                break;
        }
    }

});
