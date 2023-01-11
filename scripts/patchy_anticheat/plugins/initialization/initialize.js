import { databases, global, eventBuilder, propertyBuilder, overworld, server, content } from '../../../patchy_api/modules.js';
export const scoreboardsNames = {
    give: 'giveFlags',
    stack: 'stackFlags',
    cbe: 'cbeFlags',
    gamemode: 'gamemodeFlags',
    crasher: 'crasherFlags',
    nameSpoof: 'nameSpoofFlags',
    use32k: 'use32kFlags',
    nbt: 'nbtFlags',
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
    server.objectiveAdd('Toggles');
    server.objectiveAdd('initializedpac');
    server.objectiveAdd('staff');
    server.objectiveAdd('gmother');
    server.objectiveAdd('ALLNotifications');
    server.objectiveAdd('Notifications');
    server.objectiveAdd('InvNotifications');
    server.objectiveAdd('boots_prot');
    server.objectiveAdd('leggings_prot');
    server.objectiveAdd('chestplate_prot');
    server.objectiveAdd('helmet_prot');
    server.objectiveAdd('RandKillId');
    server.objectiveAdd('dead');
    server.objectiveAdd('Killed');
    server.objectiveAdd('kills');
    server.objectiveAdd('killStreak');
    server.objectiveAdd('deaths');
    server.objectiveAdd('used32k');
    scoreboardsNames.forEach((key, objective) => {
        try { server.objectiveAdd('objective'); } catch { }
    });
    databases.get('anticheat') ?? databases.add('anticheat');
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
                nbt: true,
                // use32k: true,
                crasher: true,
                // nameSpoof: true,
            },
            flagsKick: {
                nameSpoof: 0,
                give: 3,
                stack: 3,
                nbt: 3,
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
function initializePlayer(player) {
    const { memory, id, scores } = player;
    memory.kicks = [];
    let { initializedpac = 0 } = scores;
    // content.warn({name,scoreboards})

    if (!initializedpac) {
        scoreboardsNames.forEach((key, objective) => {
            content.warn(objective);
            scores[objective] = 0;
        });
        scores.staff = 0;
        scores.gmother = 0;
        scores.ALLNotifications = 0;
        scores.Notifications = 0;
        scores.InvNotifications = 0;
        scores.RandKillId = 0;
        scores.dead = 0;
        scores.Killed = 0;
        scores.kills = 0;
        scores.killStreak = 0;
        scores.deaths = 0;
        scores.used32k = 0;
        scores.initializedpac = 1;
    }
}

eventBuilder.subscribe('initializeAC', {
    worldLoad: () => {
        initializeServer();
    },
    playerJoined: ({ player }) => {
        initializePlayer(player);
    }
});
