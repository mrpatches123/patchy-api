import { BlockLocation, Commands, World, MinecraftEffectTypes } from '@minecraft/server';

import { linearRegression, round } from '../functions.js';
function isterminalVelocity(yv, a) {
    if (a === 0.0) {
        if (yv > -3.9199941169 && yv < -3.9199941150) { return true; }
        else if (yv > -0.4899992659 && yv < -0.4899992640) { return true; }
        else { return false; }
    } else {
        return false;
    }
}
function fly(player, name, dimension, playerMap, toggles, playersScoreboard, deltaTime) {
    let playerObject = playerMap.get(name) ?? {};
    let coordsObject = playerObject.coords ?? [];
    let flyObject = playerObject.fly ?? {};
    let { cooldown = 0, delay = 0, lastAcceleration } = flyObject;
    const currentVelocity = { x: player.velocity.x, y: player.velocity.y, z: player.velocity.z };
    const lastVelocity = playerObject.lastVelocity ?? currentVelocity;
    const acceleration = round.toPlace((currentVelocity.y - lastVelocity.y) / deltaTime, 13);
    const accelerationAverage = (acceleration + lastAcceleration) / 2;
    const location = { x: player.location.x, y: player.location.y, z: player.location.z };
    const groundCoords = [[1, -1, 0], [1, 0, 0], [0, -1, 1], [0, 0, 1], [-1, -1, 0], [-1, 0, 0], [0, -1, -1], [0, -0, -1]];
    const world = World.getDimension(dimension);
    const locationArray = Object.values(location);
    const aboveEmpty = World.getDimension(dimension).getBlock(new BlockLocation(...Object.values(location).map((coord, i) => (i === 1) ? Math.floor(coord) - 1 : Math.floor(coord)))).isEmpty;
    let EmptyArray = [];
    let onGround;
    if (aboveEmpty) {
        for (const coord of groundCoords) {
            EmptyArray.unshift(world.getBlock(new BlockLocation(...locationArray.map((locationCoord, i) => locationCoord + coord[i]))).isEmpty);
            if (EmptyArray.length > 2) {
                if (!EmptyArray[0] && EmptyArray[1]) {
                    onGround = true;
                    break;
                } else if (!EmptyArray[0] && !EmptyArray[1]) {
                    EmptyArray = [];
                } else {
                    onGround = false;
                }
            }
        }
    } else {
        onGround = true;
    }
    console.warn(onGround, acceleration, delay, !isterminalVelocity(currentVelocity.y, acceleration));
    if (!onGround && !player.isSneaking) {
        if (acceleration === 0.0 && delay > 15 && !isterminalVelocity(currentVelocity.y, acceleration)) {
            // Commands.run(`say ${currentVelocity.y},${acceleration}`, World.getDimension(dimension));
            // Commands.run(`execute "${name}" ~ ~ ~ function Executions/Fly/ground`, World.getDimension(dimension));
            let empty = true;
            const y = Math.floor(player.location.y);
            for (let i = y - 1; i > -64; i--) {
                empty = world.getBlock(new BlockLocation(location.x, i, location.z)).isEmpty;
                // Commands.run(`say ${empty} ${i}`, World.getDimension(dimension));
                if (!empty) {
                    Commands.run(`tp "${name}" ${[location.x, i + 1, location.z].join(' ')}`, World.getDimension(dimension));
                    break;
                }
            }
            const flyFlags = parseInt(Commands.run(`scoreboard players add "${name}" FlyFlagsS 1`, World.getDimension(dimension)).statusMessage.match(/(?<=\s)-?\d+/g)[1]);
            const s = (flyFlags !== 1) ? 's' : '';
            Commands.run(`title "${name}" title §l§9Patchy §7AntiCheat`, World.getDimension(dimension));
            Commands.run(`title "${name}" subtitle §l§fTurn §cOFF §7Your §1.fly §4Hacks`, World.getDimension(dimension));
            if (flyFlags > toggles.flyFlagsKick) {
                let kicks = parseInt(Commands.run(`scoreboard players add "${name}" Kicks 1`, World.getDimension(dimension)).statusMessage.match(/(?<=\s)-?\d+/g)[1]);
                if (kicks > toggles.kicksBanS) {
                    Commands.run(`scoreboard players add "ban#(you were flying and ${kicks}>${kicksBanS} Kicks!:${name}#0"`);
                    Commands.run(`scoreboard players set "${name}" BanReleaseDateS ${2 ** 31 - 2}`, World.getDimension(dimension));
                    try { Commands.run(`tellraw @a[scores={ALLNotifications=1,Notifications=1}] {"rawtext":[{"text":"§7${name} §fwas §1Flying §fand was §1Banned §fdue to §7${kicks}>${kicksBanS} §1kicks!"}]}`, World.getDimension(dimension)); } catch { }
                } else {
                    Commands.run(`scoreboard players add "kick#(you were flying and ${kicks}>${kicksBanS} Flags!:${name}#0"`);
                }
            } else {
                Commands.run(`tellraw @a {"rawtext":[{"text":"§l§f[§9PAC§f] §7${name} §fwas §1Flying §fand was §1Flagged §7${flyFlags} §ftime${s}!"}]}`, World.getDimension(dimension));
            }
            delay = 0;
        } else {
            delay++;
            // Commands.run(`say ${location.y},${acceleration}`, World.getDimension(dimension));
        }
    } else {
        delay = 0;
    }

    // console.warn(r2)
    // const isOnGround = Boolean(parseInt(Commands.run(`scoreboard players test "${name}" OnGround *`, World.getDimension(dimension)).statusMessage.match(/-?\d+/)));
    // const isInWater = Boolean(parseInt(Commands.run(`scoreboard players test "${name}" InWater *`, World.getDimension(dimension)).statusMessage.match(/-?\d+/)));
    // if (isOnGround === false ww && isInWater === false) {
    //     Commands.run(`say ${r2}`, World.getDimension(dimension));
    // }
    // switch (r2) {
    //     case '0.000':
    //     case 'NaN':
    //     case '1.000':
    //         //if (isOnGround === false && isInWater === false) {
    //         if (cooldown - dateNow > 3e3) {
    //             cooldown = dateNow;
    //             Commands.run(`execute "${name}" ~ ~ ~ function Executions/Fly/ground`, World.getDimension(dimension));
    //             const flyFlags = parseInt(Commands.run(`scoreboard players add "${name}" FlyFlagsS 1`, World.getDimension(dimension)).statusMessage.match(/(?<=\s)-?\d+/g)[1]);
    //             const s = (flyFlags !== 1) ? 's' : '';
    //             Commands.run(`title "${name}" title §l§9Patchy §7AntiCheat`, World.getDimension(dimension));
    //             Commands.run(`title "${name}" subtitle §l§fTurn §cOFF §7Your §1.fly §4Hacks`, World.getDimension(dimension));
    //             if (flyFlags > toggles.flyFlagsKick) {
    //                 let kicks = parseInt(Commands.run(`scoreboard players add "${name}" Kicks 1`, World.getDimension(dimension)).statusMessage.match(/(?<=\s)-?\d+/g)[1]);
    //                 if (kicks > toggles.kicksBanS) {
    //                     Commands.run(`scoreboard players add "ban#(you were flying and ${kicks}>${kicksBanS} Kicks!:${name}#0"`);
    //                     Commands.run(`scoreboard players set "${name}" BanReleaseDateS ${2**31-2}`, World.getDimension(dimension));
    //                     try { Commands.run(`tellraw @a[scores={ALLNotifications=1,Notifications=1}] {"rawtext":[{"text":"§7${name} §fwas §1Flying §fand was §1Banned §fdue to §7${kicks}>${kicksBanS} §1kicks!"}]}`, World.getDimension(dimension)); } catch { }
    //                 } else {
    //                     Commands.run(`scoreboard players add "kick#(you were flying and ${kicks}>${kicksBanS} Flags!:${name}#0"`);
    //                 }
    //             } else {
    //                 Commands.run(`tellraw @a {"rawtext":[{"text":"§l§f[§9PAC§f] §7${name} §fwas §1Flying §fand was §1Flagged §7${flyFlags} §ftime${s}!"}]}`, World.getDimension(dimension));
    //             }
    //         }
    //         break;

    //     default:
    //         break;
    // }

    // playerObject.cooldown = cooldown;
    playerObject.coords = coordsObject;
    playerObject.lastVelocity = currentVelocity;
    flyObject.delay = delay;
    flyObject.lastAcceleration = acceleration;
    playerObject.fly = flyObject;
    playerMap.set(name, playerObject);
}
export { fly };
// let date = 0
// prevdateString = ''
// while (date < 1e100) {
//   	date++
// 	let dateString = ''
// 	try {
//       dateString = new Date(date).toString()
//       prevdateString = dateString
// 	} catch {
//     	console.log(date,prevdateString)
//       	break;
//     }
// }