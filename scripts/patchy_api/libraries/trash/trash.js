world.events.beforeChat.subscribe(event => {
    try {
        let { message, sender, sendToTargets } = event;
        event.cancel = promptBuilder.check(sender, message) ?? false;
        const name = sender.getName();
        // if (message.startsWith(config.commandPrefix)) {
        //     event.cancel = true;

        //     const commandMessage = message.replace(/(@)?(")?/g, "") ?? message;
        //     let command = commandMessage.slice(config.commandPrefix.length).trim().split(/ +/)[0] ?? null;
        //     let args = commandMessage.slice(config.commandPrefix.length).replace(command, "").trim().split(/ +/) ?? null;
        //     commandBuilder.check(command, sender, args);

        // } 
        // else 
        if (message === 'dbs_reset') {
            try { overworld.runCommand('event entity @e patches:kill'); } catch { }
            databases = new Databases();

        } else if (message === 'db_print') {
            sender.runCommand(`tellraw @s {"rawtext":[{"text":"${JSON.stringify(databases).replaceAll('"', '\\"')}"}]}`);

        } else if (message === 'db_tick') {
            tick = 0;
        } else if (message === 'prompt_test') {
            event.cancel = true;
            promptBuilder.add(sender, 'do you like pickles?', {
                yes: (sender) => {
                    sender.runCommand(`tellraw @s {"rawtext":[{"text":"you are dumb"}]}`);
                    promptBuilder.remove(sender);
                },
                no: (sender) => {
                    sender.runCommand(`tellraw @s {"rawtext":[{"text":"you are cool"}]}`);
                    promptBuilder.remove(sender);
                }
            });
            promptBuilder.ask(sender);

        } else if (message === 'prompt_factions') {
            factionMangager(sender);
        } else if (message.startsWith('!')) {
            const args = message.substring(1).split(' ');
            const command = args.shift();
            if (command === 'faction') {
                if (args[0] = 'create') {

                }
            }


        }

        console.warn(event.cancel);
    } catch (error) {
        overworld.runCommand(`say ${error},${error.stack}`);
    }
});


const containers = ['minecraft:chest', 'minecraft:barrel', 'minecraft:trapped_chest', 'minecraft:furnace', 'minecraft:dispenser', 'minecraft:dropper'];
let joiningPlayers = [];

world.events.playerJoin.subscribe(({ player }) => {

});
world.events.playerLeave.subscribe(({ playerName }) => {
    playerMap.delete(playerName);
});
// world.events.entityCreate.subscribe(({ entity }) => {
//     try {
//         entity.kill()
//     } catch (error) {
//         console.warn(`say ${error},${error.stack}`);
//         // }
//     }
// });
let { faceLocationX, faceLocationY, cancel, source, item, blockLocation } = event;
if (blockLocation) {
    const name = source.getName();
    let object = global.playerMap.get(name) ?? {};
    let usingItemOn = object.usingItemOn ?? {};
    usingItemOn.blockLocation = blockLocation;
    usingItemOn.item = item;
    usingItemOn.using = true;
    usingItemOn.event = event;
    object.usingItemOn = usingItemOn;
    global.playerMap.set(name, object);
}

function beforeOnUseOne(object, player) {
    const name = player.getName();
    let usingItemOn = object.usingItemOn ?? {};
    const { event } = usingItemOn ?? {};
    if (using) {
        eventBuilder.beforeItemOnUseOn.forEach((key, callback) => {
            callback(event);;
        });
    } else {
        usingItemOn.used = false;
    }
    usingItemOn.using = false;
    object.usingItemOn = usingItemOn;
    global.playerMap.set(name, object);
}