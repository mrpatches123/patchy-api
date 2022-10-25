import { world, Location } from '@minecraft/server';
import { content, overworld, staff } from "../../../patchy_api/libraries/utilities.js";
import databases from '../../../patchy_api/libraries/classes/database.js';
import global from '../../../patchy_api/libraries/classes/global.js';
import eventBuilder from '../../../patchy_api/libraries/classes/events.js';
import discipline from '../../libraries/discipline.js';
eventBuilder.subscribe('crasher', {
    tickAfterLoad: () => {
        let anticheat = databases.get('anticheat') ?? databases.add('anticheat');
        const { toggles } = global;
        global.players.forEach((id, player) => {
            const name = player.name;
            const { location, dimension } = player;
            const { x, y, z } = location;


            if (x.abs() > 3e7 || y.abs() > 3e7 || z.abs() > 3e7) { // thanks MrDiamond64
                const { lastLocation = new Location(0, 100, 0) } = global.playerMap[name];
                const { playerId } = global.scoreObject[name];
                player.teleport(lastLocation, dimension, ...player.rot(true));
                discipline.check(player, '§4failed §1Crasher', 'crasher');
            }
            global.playerMap[name].lastLocation = location;
        });

    }
});