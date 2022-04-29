import { content, combine, overworld, server } from "../../../patchy_api/libraries/utilities.js";
import databases from '../../../patchy_api/libraries/classes/database.js';
import global from '../../../patchy_api/libraries/classes/global.js';
import eventBuilder from '../../../patchy_api/libraries/classes/events.js';



function initializeServer() {
    //when world loads
    server.objectiveAdd('test');
}
function initializePlayer(scoreboards, player) {
    //player joins
    const name = player.getName();
    if (!global.playerMap[name]) {
        global.playerMap[name] = {};
    }
    if (!global.playerMap[name].kicks) {
        global.playerMap[name].test = [];
    }
    let { initialized/*might change the name a bit if more than one package*/ = 0, playerId = 0 } = scoreboards ?? {};

    if (!initialized) {
        if (!playerId) {//playerId
            let server = databases.get('server') ?? databases.add('server');
            let lastPlayerId = server.get('lastPlayerId') ?? 2147483647;
            playerId = player.scoreSet('playerId', --lastPlayerId);
            server.set('lastPlayerId', lastPlayerId);
            databases.save('server');
            console.warn(initialized, playerId, lastPlayerId);
        }
        player.scoreSet('initialized', 1);
    }


}

eventBuilder.subscribe('initialize'/*eventkey*/, {
    tick: () => {
        if (!global.initialize/*might change the name a bit if more than one package*/) {
            initializeServer();
            global.initialize/*might change the name a bit if more than one package*/ = true;
        }
        global.players.forEach(player => {
            const name = player.getName();
            const scoreboards = global.scoreObject[name];
            initializePlayer(scoreboards, player);
        });
    }
});
