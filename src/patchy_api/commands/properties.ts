import { Player, commandBuilder, content, formBuilder, isVector3, players, propertyManager } from '../modules.js';
import config from '../config.js';
import { Vector, Vector3 } from '@minecraft/server';
const { commandPrefix: prefix } = config;
function parsePropertyValue(string: string | undefined): string | number | boolean | Vector3 | Number['constructor'] | Boolean['constructor'] | String['constructor'] | Vector['constructor'] | undefined {
    const number = Number(string);
    if (!Number.isNaN(number)) return number;
    const booleanString = string?.toLowerCase?.()?.trim?.();
    if (booleanString === 'Number') return Number;
    if (booleanString === 'String') return String;
    if (booleanString === 'Boolean') return Boolean;
    if (booleanString === 'Vector') return Vector;
    if (booleanString === 'true') return true;
    if (booleanString === 'false') return false;
    try {
        const vector3 = JSON.parse(string ?? "");
        if (isVector3(vector3)) return vector3;
    } catch { }
    return string;
}
function parsePlayer(sender: Player, playerName?: string): false | Player | undefined {
    let player: Player | undefined;
    if (playerName === 's') {
        player = sender;
    } else if (playerName && playerName !== '%world%') {
        player = players.find({ name: playerName });
        if (!player) { sender.sendMessage(`player: ${playerName}, at params[2] does not exist!`); return false; }
    }
    return player;
}
const identifierless = ['print', 'clearAll', 'wipe'];
commandBuilder.register('properties', {
    description: "Used to get the Stringified value of properties",
    usages: [
        `${prefix}properties`,
    ],
    requires: {
        score: {
            staff: 1
        }
    },
    prefix,
    aliases: ['props', 'property', 'prop'],
    callback: (sender, args) => {
        const subcommand = args.shift();
        if (!subcommand) return sender.sendMessage(`subcommand at params[1] is not defined`);


        switch (subcommand) {
            case 'print': {
                sender.sendMessage(JSON.stringify(propertyManager, (key, value) => (value instanceof Function) ? '<f>' : value, 4));
                break;
            } case 'set': {
                const [identifier, playerName, value] = args;
                const player = parsePlayer(sender, playerName);
                if (player === false) return;
                const playerProperties = propertyManager.get(player);
                const setValue = parsePropertyValue(value);
                sender.sendMessage(`you set ${(player) ? player?.name : 'world'}'s value for identifier: ${identifier}, to value: ${JSON.stringify(setValue)}!`);
                playerProperties.setAny(identifier!, setValue);
                break;
            } case 'reset': {
                const [identifier, playerName, value] = args;

                const player = parsePlayer(sender, playerName);
                if (player === false) return;
                const playerProperties = propertyManager.get(player);
                playerProperties.setAny(identifier!, undefined);
                break;
            } case 'get':
            case 'test': {
                const [identifier, playerName, value] = args;

                const player = parsePlayer(sender, playerName);
                if (player === false) return;
                const playerProperties = propertyManager.get(player);
                sender.sendMessage(`player: ${player!.name}, has value: ${playerProperties.getAny(identifier!)}, for property identifier: ${identifier}!`);
                break;
            }
            case "clearAll":
            case 'wipe': {
                const [playerName] = args;

                const player = parsePlayer(sender, playerName);
                if (player === false) return;
                const playerProperties = propertyManager.get(player);
                formBuilder.showConformationAwait(sender, `Are you sure you want to wipe all properties for ${(player) ? player.name : " the world (not all players or entities)"}? §cThis cannot be undone! 1/3 Conformations`, () => {
                    formBuilder.showConformationAwait(sender, `Are you sure you 100% you want to wipe all properties for ${(player) ? player.name : " the world(not all players or entities)"}? §cThis cannot be undone! 2/3 Conformations`, () => {
                        formBuilder.showConformationAwait(sender, `Are you 1000% sure you want to wipe all properties for ${(player) ? player.name : " the world(not all players or entities)"}? §cThis cannot be undone! 3/3 Final Conformation`, () => { }, () => {
                            playerProperties.clearAll();
                        });
                    });
                });
                break;
            }
        }

        // sender.sendMessage(JSON.stringify(eventBuilder));
    }
});