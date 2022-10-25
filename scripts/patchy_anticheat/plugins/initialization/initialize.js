import { databases, global, eventBuilder, propertyBuilder, overworld } from '../../../patchy_api/modules.js';
export const scoreboardsNames = {
    give: 'giveFlags',
    stack: 'stackFlags',
    cbe: 'cbeFlags',
    gamemode: 'gamemodeFlags',
    crasher: 'crasherFlags',
    nameSpoof: 'nameSpoofFlags',
    use32k: 'use32kFlags',
    kicks: 'kicks'
    //     GiveFlagsS: 0,
    // StackFlagsS: 0,
    // GamemodeFlagsS: 0,
    // NukerFlagsS: 0,
    // CBEFlagsS: 0,
    // CrasherFlagsS: 0,
    // NameSpoofFlagsS: 0,
    // use32kFlags: 0,

};

function initializeServer() {
    try { overworld.runCommand('scoreboard objectives add Toggles dummy'); } catch { }
    try { overworld.runCommand('scoreboard objectives add initializedpac dummy'); } catch { }
    try { overworld.runCommand('scoreboard objectives add playerId dummy'); } catch { }
    try { overworld.runCommand('scoreboard objectives add staff dummy'); } catch { }
    try { overworld.runCommand('scoreboard objectives add gmother dummy'); } catch { }
    try { overworld.runCommand('scoreboard objectives add ALLNotifications dummy'); } catch { }
    try { overworld.runCommand('scoreboard objectives add Notifications dummy'); } catch { }
    try { overworld.runCommand('scoreboard objectives add InvNotifications dummy'); } catch { }
    try { overworld.runCommand('scoreboard objectives add boots_prot dummy'); } catch { }
    try { overworld.runCommand('scoreboard objectives add leggings_prot dummy'); } catch { }
    try { overworld.runCommand('scoreboard objectives add chestplate_prot dummy'); } catch { }
    try { overworld.runCommand('scoreboard objectives add helmet_prot dummy'); } catch { }
    try { overworld.runCommand('scoreboard objectives add RandKillId dummy'); } catch { }
    try { overworld.runCommand('scoreboard objectives add dead dummy'); } catch { }
    try { overworld.runCommand('scoreboard objectives add Killed dummy'); } catch { }
    try { overworld.runCommand('scoreboard objectives add KillsS dummy'); } catch { }
    try { overworld.runCommand('scoreboard objectives add KillsT dummy'); } catch { }
    try { overworld.runCommand('scoreboard objectives add DeathsS dummy'); } catch { }
    try { overworld.runCommand('scoreboard objectives add used32k dummy'); } catch { }
    scoreboardsNames.forEach((key, objective) => {
        try { overworld.runCommand(`scoreboard objectives add ${objective} dummy`); } catch { }
    });
    if (!global.playerMap) {
        global.playerMap = {};
    }
    let anticheat = databases.get('anticheat') ?? databases.add('anticheat');
    propertyBuilder.setInitialValues({
        anticheat: {
            modules: {
                kick: true,
                give: true,
                gamemode: true,
                nuker: true,
                cbe: true,
                stacker: true,
                itemChangeLog: true,
                // use32k: true,
                crasher: true,
                // nameSpoof: true,
            },
            flagsKick: {
                nameSpoof: 0,
                give: 3,
                stack: 3,
                gamemode: 3,
                nuker: 0,
                cbe: 0,
                crasher: 0
            },
            survival: true,
            creative: false,
            adventure: true,
            kicksBanS: 3,
        }
    });
    // content.warn(propertyBuilder.getObjectFromKey(anticheat));
}
function initializePlayer(scoreboards, player) {
    const name = player.getName();
    if (!global.playerMap[name]) {
        global.playerMap[name] = {};
    }
    if (!global.playerMap[name].kicks) {
        global.playerMap[name].kicks = [];
    }
    let { initializedpac = 0, playerId = 0 } = scoreboards ?? {};
    // content.warn({name,scoreboards})

    if (!initializedpac) {
        scoreboardsNames.forEach((key, objective) => {
            player.scoreAdd(objective);
        });
        player.scoreAdd('staff');
        player.scoreAdd('gmother');
        player.scoreAdd('ALLNotifications');
        player.scoreAdd('Notifications');
        player.scoreAdd('InvNotifications');
        player.scoreAdd('RandKillId');
        player.scoreAdd('dead');
        player.scoreAdd('Killed');
        player.scoreAdd('KillsS');
        player.scoreAdd('KillsT');
        player.scoreAdd('DeathsS');
        player.scoreAdd('used32k');
        if (!playerId) {
            let server = databases.get('server') ?? databases.add('server');
            let lastPlayerId = server.get('lastPlayerId') ?? 2147483647;
            playerId = player.scoreSet('playerId', --lastPlayerId);
            server.set('lastPlayerId', lastPlayerId);
            databases.save('server');
            console.warn(initialized, playerId, lastPlayerId);
        }
        player.scoreSet('initializedpac', 1);
    }


}

eventBuilder.subscribe('initializeAC', {
    tickAfterLoad: () => {
        if (!global.initializeAC) {
            initializeServer();
            global.initializeAC = true;
        }
        global.players.forEach((id, player) => {
            const name = player.getName();
            const scoreboards = global.scoreObject[name];
            initializePlayer(scoreboards, player);
        });
    }
});
