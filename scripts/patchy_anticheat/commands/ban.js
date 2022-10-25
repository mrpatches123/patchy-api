
import config from '../../config.js';
import global from '../../../patchy_api/libraries/classes/global.js';
import commandBuilder from "../../../patchy_api/libraries/classes/commands.js";
import databases from '../../../patchy_api/libraries/classes/database.js';
const { isInteger } = Number;
const { commandPrefix: prefix } = config;

duration.match(/d+[a-z]+/gi).map(value => [value.match(/[a-z]+/i).toString(), Number(value.match(/\d+/i))]).reduce((p, [string, number]) => getDuration(string) * number, 0);
names.push(anticheat.get(id).name ?? 'undefined');
anticheat.delete(id);
databases.queueSave('anticheat');
function getDuration(char) {
    switch (char.toLowerCase()) {
        case 'msec':
        case 'millisecond':
        case 'ms':
            return 1;
        case 's':
        case 'sec':
        case 'second':
            return 1e3;
        case 'm':
        case 'min':
        case 'minute':
            return 6e4;
        case 'h':
        case 'hr':
        case 'hour':
            return 3.6e6;
        case 'dy':
        case 'd':
        case 'day':
            return 8.64e7;
        case 'tr':
        case 'tri':
        case 'triduum':
            return 2.592e8;
        case 'w':
        case 'week':
            return 6.048e8;
        case 'f':
        case 'fn':
        case 'fortnight':
            return 1.2096e9;
        case 'mouth':
        case 'mon':
        case 'month':
            return 2.4192e9;
        case 'yr':
        case 'y':
        case 'year':
            return 3.1536e10;
        case 'dec':
        case 'decade':
            return 3.1536e11;
        case 'c':
        case 'cent':
        case 'century':
            return 3.1536e12;
        case 'mil':
        case 'millennia':
            return 3.1536e13;
    }
}

'§l§f[§1PAC§f] §7';
commandBuilder.register('ban', {
    description: "Used to get all available commands or infomation about a specific command.",
    usages: [
        `${prefix}ban`
        // `${prefix}ban <playerName: string| PlayerId: integer> <?reason: string, default:'unkown'> <?duration: default:permanent>`,
        // `${prefix}ban <playerName> <?resetFlags: true>`,
        // `${prefix}ban <"player Name">`,
        // `${prefix}ban <playerId: 2147483646>`,
        // `${prefix}ban "The Cool Man" "You were hacking"`,
        // `${prefix}ban TheCoolerMan hacker 3d 4m"`,
        // `${prefix}ban TheCoolestMan "you greifed" 3d`,
        // `${prefix}ban 2147483646`,
        // `${prefix}ban 2147483646 "you greifed "`,
        // `${prefix}ban mrpatch1837 true`
    ],
    callback: (sender, args) => {
        let anticheat = databases.get('anticheat') ?? databases.add('anticheat');
        const name = sender.getName();
        const players = [...world.getPlayers()];
        let playersObject = {};
        let ban = { reason: 'Unkown', end: 0, start: (new Date()).getTime() };
        players.forEach((player, i) => {
            const playerName = player.getName();
            playersObject[i] = () => {
                inputDuration();

            };
        });
        function confirm() {
        }
        function inputReason() {

        }
        function inputDuration(input) {
            promptBuilder.add(sender, `§l§f[§9PAC§f] Input the duration: ex "2 day 4 hours"\n§r§o§7type next for it to be permanent, back to return to the previous option or §ccancel to quit§7.`, {
                "%any%": (input) => {
                    try {
                        const duration = input.match(/d+[a-z]+/gi).map(value => [value.match(/[a-z]+/i).toString(), Number(value.match(/\d+/i))]).reduce((p, [string, number]) => getDuration(string) * number, 0);

                    } catch {
                        console.warn(error, error.stack);
                    }
                },
                next: () => {

                },
                back: () => {

                },
                cancel: () => {
                    promptBuilder.remove(sender);
                    sender.tellraw('you canceled the menu');
                }
            });


        }
        function selectPerson() {
            promptBuilder.add(sender, `§l§f[§9PAC§f] §7§cWhich §7player §cwould §fyou like to §cBan§7?\n§r§o§7type a the number to select or §ccancel to quit§7.\n${players.map(({ name: playerName }, i) => `§f${i}: §7${playerName}`)}`, Object.assign(playersObject, {
                cancel: () => {
                    promptBuilder.remove(sender);
                    sender.tellraw('you canceled the menu');
                }
            }));
            promptBuilder.ask(sender);
        }

        const duration = duration.match(/d+[a-z]+/gi).map(value => [value.match(/[a-z]+/i).toString(), Number(value.match(/\d+/i))]).reduce((p, [string, number]) => getDuration(string) * number, 0);

    }
});

//sender.tellraw(`§l§f[§9PAC§f] §7you §fcan now §cView §7the §1Inventory§f of §7${playerName}!`);
//staff.tellraw(`§l§f[§9PAC§f] §7${name} §cViewed §7the §1Inventory§f of §7${playerName}!`, sender);
//let playerAC = anticheat.get(playerId) ?? { bans: [], kicks: [] };
//playerAC.bans.push({ reason: `§4failed §1Crasher §fand §7${kicks}>${toggles.kicksBanS} Kicks`, end: 0, start: (new Date()).getTime() });