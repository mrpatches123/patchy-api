import { content, native, overworld } from "./utilities.js";
import time from './classes/time.js';
import global from './classes/global.js';
import { world } from "mojang-minecraft";
export function getScoreObjectsFromOnlinePlayers(players) {
    try {
        const playersToRegex = new RegExp((players ?? [...world.getPlayers()]).map(player => player.getName()).map(name => name.replace(/([()])/g, '\\$1')).join('|'));
        return Object.fromEntries(overworld.runCommand('scoreboard players list @a').statusMessage.match(/§a(.*?)(\d+)(.*?)\s(.*?)\n(-\s\w+:\s-?\d+\s\(\w+\)\n?)+|(\w+ )+\w+\n?/g)
            .map(scores => [scores.match(playersToRegex).toString(), Object.fromEntries(scores.match(/^.+$/mg).splice(1)
                .map(score => [score.match(/(?<=-\s).*?(?=:)/).toString(), Number(score.match(/(?<=:\s).*?(?=\s\()/))]))]));
    } catch {
        return Object.fromEntries((players ?? [...world.getPlayers()]).map(player => player.getName()).map(name => [name, {}]));
    }

}

// export function scoreboardTest() {
//     time.start('scoreTest');
//     const { scoreboard } = world;
//     const objectives = scoreboard.getObjectives();
//     const object = {};
//     const playerNames = global.playerNames;
//     playerNames.forEach(name => {
//         if (!object[name]) {
//             object[name] = {};
//         }
//     });
//     objectives.forEach(objective => {
//         const { id } = objective;
//         const scoreInfos = objective.getScores();
//         scoreInfos.forEach(scoreInfo => {
//             const { participant, score } = scoreInfo;
//             const { type, displayName } = participant;
//             if (type === 1 && playerNames.includes(displayName)) {

//                 object[displayName][id] = score;
//             }
//         });
//     });
//     content.warn({ object, time: time.end('scoreTest') });
// }