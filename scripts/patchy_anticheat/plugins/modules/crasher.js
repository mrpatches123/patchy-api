import { world, Location } from '@minecraft/server';
import { players, eventBuilder } from '../../../patchy_api/modules.js';

eventBuilder.subscribe('crasher', {
    tickAfterLoad: () => {
        players.get().iterate(player => {
            const { location, dimension, memory } = player;
            const { x, y, z } = location;
            if (Math.abs(x) > 30000000 || Math.abs(y) > 30000000 || Math.abs(z) > 30000000) { // thanks MrDiamond64
                const { lastLocation = { x: 0, y: 100, z: 0 } } = memory;
                player.teleport(lastLocation, dimension, ...player.rot(true));
                discipline.check(player, '§4failed §1Crasher', 'crasher');
            }
            memory.lastLocation = location;
        });

    }
});