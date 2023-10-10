import config from '../config.js';
import { commandBuilder, isDefined, players } from '../modules.js';
const { commandPrefix: prefix } = config;
// @ts-nocheck
commandBuilder.register('key', {
    description: "key",
    usages: [
        `${prefix}key`,
    ],
    requires: {
        score: {
            staff: 1
        }
    },
    prefix,
    callback: (sender, args) => {
        const [key, name] = args;
        if (!name) {
            /*@ts-ignore*/
            if (!isDefined(sender[key]))
                return sender.tell(`key: ${key}, does not exist on you!`);
            /*@ts-ignore*/
            return sender.tell(JSON.stringify({ [key]: sender[key] }));
        }
        const player = players.get({ name }).array()[0];
        /*@ts-ignore*/
        if (!isDefined(player[key]))
            return sender.tell(`key: ${key}, does not exist on ${player.name}!`);
        /*@ts-ignore*/
        return sender.tell(JSON.stringify({ [key]: player[key] }));
    }
});
//# sourceMappingURL=key.js.map