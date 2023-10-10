import { commandBuilder } from '../modules.js';
import config from '../config.js';
import { world } from '@minecraft/server';
const { commandPrefix: prefix } = config;
commandBuilder.register('ban', {
    description: "Used to ban a player",
    usages: [
        `${prefix}ban playerName`,
    ],
    prefix,
    requires: {
        score: {
            staff: 1
        }
    },
    callback: (sender, args) => {
        const [playerName] = args;
        const player = [...world.getPlayers({ name: playerName })][0];
        if (!player)
            return sender.sendMessage(`player: ${playerName}, does not exist!`);
        sender.sendMessage(`You banned ${player.name}`);
        player.addTag('ban');
    }
});
//# sourceMappingURL=ban.js.map