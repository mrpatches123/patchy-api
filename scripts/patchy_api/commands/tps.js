import { world } from '@minecraft/server';
import config from '../config.js';
import { commandBuilder, eventBuilder, global } from '../modules.js';
global.deltaTimes = [];
const { commandPrefix: prefix, tpsPrecision } = config;
commandBuilder.register('tps', {
    description: "Used to get the Stringified value of a key in global",
    usages: [
        `${prefix}tps <precision: int > 0>`,
    ],
    callback: (sender, args) => {
        if (args[0] === 'print') {
            global.printTps = Number(args[1]);
        }
        else {
            const { deltaTimes } = global;
            const tps = Math.round(1 / (deltaTimes.reduce((s, c) => s + c) / deltaTimes.length) * 100) / 100;
            sender.sendMessage((tps < 20) ? tps.toString() : '19.99');
        }
    }
});
eventBuilder.subscribe('tps', {
    tickAfterLoad: ({ deltaTime }) => {
        global.deltaTimes.push(deltaTime);
        if (global.deltaTimes.length > tpsPrecision)
            global.deltaTimes.shift();
        if (!global.printTps)
            return;
        const { deltaTimes } = global;
        const tps = Math.round(1 / (deltaTimes.reduce((s, c) => s + c) / deltaTimes.length) * 100) / 100;
        world.sendMessage((tps < 20) ? tps.toString() : '19.99');
    }
});
//# sourceMappingURL=tps.js.map