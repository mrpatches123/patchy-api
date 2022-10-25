import { Location } from '@minecraft/server';



import global from '../../../patchy_api/libraries/classes/global.js';
import { content } from '../../../patchy_api/libraries/utilities.js';
import eventBuilder from '../../../patchy_api/libraries/classes/events.js';
// Array.prototype.accumulate = function (callback, initialValue, ignore = true) {
//     if (typeof callback == "function") {
//         this.forEach((value, i) => {
//             const call = callback(value, i, initialValue);
//             if (initialValue && (call || ignore) && typeof initialValue == 'object' && !Array.isArray(initialValue)) {
//                 Object.assign(initialValue, call);
//             } else if (initialValue && (call || ignore) && typeof initialValue == 'object' && Array.isArray(initialValue)) {
//                 initialValue.push(call);
//             } else if (initialValue && typeof initialValue === 'string' && (call || ignore)) {
//                 initialValue += call;
//             }
//         });
//         if (initialValue) { return initialValue; }
//     }

// };
// afkArray.accumulate((location, i) => {
//     if (afkArray.filter((value, a) => a !== i).some(notlocation => notlocation.equals(location))) {
//         return location;
//     }
// }, []);
const length = 50;
eventBuilder.subscribe('afk', {
    tickAfterLoad: ({ currentTick }) => {
        if (!(currentTick % 5)) {
            global.players.forEach((id, player) => {
                const name = player.getName();
                const { location: { x, y, z } } = player;
                const rotation = player.rot(true);
                const { afkArray = [], lastRotation } = global.playerMap[name] ?? [];
                // if (afkArray.length > length / 2) {
                let repeatLocations = 0;
                afkArray.forEach(({ a, b, c }, i) => {

                    if (afkArray.filter((value, d) => d !== i).some(({ x, y, z }) => x === a && y === b && z === c)) {
                        repeatLocations++;
                    }
                });
                console.warn(repeatLocations, afkArray.length, global.tps);
                //content.warn(repeatLocations);
                // }
                if (!afkArray.length) {
                    global.playerMap[name].afkArray = [];
                }
                global.playerMap[name].afkArray.push({ x: x.round(1), y: ~~y, z: z.round(1) });
                // content.warn(x.round(1), ~~y, z.round(1));
                if ((afkArray.length > length)) { global.playerMap[name].afkArray.shift(); }
            });
        }

    }
});
