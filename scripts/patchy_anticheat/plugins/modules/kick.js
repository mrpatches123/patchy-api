import { content, overworld, andArray } from '../../../patchy_api/libraries/utilities.js';
import databases from '../../../patchy_api/libraries/classes/database.js';
import global from '../../../patchy_api/libraries/classes/global.js';
import eventBuilder from '../../../patchy_api/libraries/classes/events.js';

eventBuilder.subscribe('kick', {
    tickAfterLoad: () => {
        try {
            let anticheat = databases.get('anticheat') ?? databases.add('anticheat');
            global.players.forEach((id, player) => {
                const name = player.getName();
                const nameTag = player.getNameTag();
                const { playerId } = global.scoreObject[name] ?? {};
                const { kicks = [] } = global.playerMap[name] ?? {};
                let playerAC = anticheat.get(playerId) ?? {};
                const { bans = [], name: nameAC, nameTag: nameTagAC } = playerAC;
                if (!kicks.length && !bans.length) return;

                const ReasonsArray = [];
                if (nameAC !== name) {
                    playerAC.name = name;
                    anticheat.set(playerId, playerAC);
                    databases.queueSave('anticheat');
                }

                if (nameTagAC !== nameTag) {
                    playerAC.nameTag = nameTag;
                    anticheat.set(playerId, playerAC);
                    databases.queueSave('anticheat');
                }
                //content.warn(bans);
                let setBan = false;
                const bansNew = bans.filter(ban => { const rban = ban.end > (new Date()).getTime() || !ban.end; if (!rban) { setBan = true; } return rban; });

                if (setBan) {
                    playerAC.bans = bansNew;
                    anticheat.set(playerId, playerAC);
                    databases.queueSave('anticheat');
                }
                if (kicks.length || bans.length) {
                    //console.warn('Kicks 0:' + JSON.stringify(kicks));
                    const kickReasons = andArray(kicks);
                    //console.warn('Kicks 1:' + JSON.stringify(kicks));
                    const banReasons = andArray(bans.map(ban => ban.reason));
                    //content.warn({name,kicks,bans,bansNew,ReasonsArray})

                    if ((bans ?? [])[0]?.end === 0) {
                        ReasonsArray.push(`you, ${name}, were permanently banned because ${banReasons}`);
                    } else if ((bans ?? [])[0]?.end > (new Date()).getTime()) {
                        const banTime = formatTime(bans[0].end - bans[0].start, 2);
                        const time = formatTime(bans[0].end - (new Date().getTime()), 2);

                        ReasonsArray.push(`you, ${name}, were banned for ${banTime} and will be realeased in ${time} because ${banReasons} `);
                    }
                    if (kicks.length) {
                        ReasonsArray.push(`you, ${name}, were kicked because ${kickReasons}`);
                    }
                    if (ReasonsArray.length) {
                        //console.warn(`kick "${player.getNameTag()}" "§l§f[§9PAC§f] §7${andArray(ReasonsArray)}"`);
                        try {
                            player.kick(`§l§f[§9PAC§f] §7${andArray(ReasonsArray)}`);
                        } catch (error) {
                            // console.warn(error,error.stack);
                        }
                    }
                    // overworld.runCommandAsync(`say ${ReasonsArray}`);
                }
            });
        } catch (error) {
            console.warn(error, error.stack);
        }

        // overworld.runCommandAsync(`say BD:${BanDateS} - BRD:${BanReleaseDateS} - BRL:${banReasons.length}`);


    }
});





//kick reason tags
//kick and ban tag
//ban date
//ban release date
//ban
//unban
//kicktag
//kicksReason

//[PAC] you were banned 
