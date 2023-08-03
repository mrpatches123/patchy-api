import { content, native, overworld } from "./utilities.js";
import time from './classes/time.js';
import global from './classes/global.js';
import { world } from "@minecraft/server";
export function getScoreObjectsFromOnlinePlayers(players) {
    try {
        const playersToRegex = new RegExp((players ?? [...world.getPlayers()]).map(player => player.getName()).map(name => name.replace(/([()])/g, '\\$1')).join('|'));
        return Object.fromEntries(overworld.runCommandAsync('scoreboard players list @a').statusMessage.match(/§a(.*?)(\d+)(.*?)\s(.*?)\n(-\s\w+:\s-?\d+\s\(\w+\)\n?)+|(\w+ )+\w+\n?/g)
            .map(scores => [scores.match(playersToRegex).toString(), Object.fromEntries(scores.match(/^.+$/mg).splice(1)
                .map(score => [score.match(/(?<=-\s).*?(?=:)/).toString(), Number(score.match(/(?<=:\s).*?(?=\s\()/))]))]));
    } catch {
        return Object.fromEntries((players ?? [...world.getPlayers()]).map(player => player.getName()).map(name => [name, {}]));
    }
}