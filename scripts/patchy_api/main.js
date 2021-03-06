import { world, BlockLocation, EntityQueryOptions, EntityQueryScoreOptions, EntityEventOptions } from "mojang-minecraft";
// world.getDimension('overworld').runCommand('script debugger connect localhost 19144')
import "./libraries/utilities.js";
import global from './libraries/classes/global.js';

import time from "./libraries/classes/time.js";
import { getScoreObjectsFromOnlinePlayers } from './libraries/scoreboard.js';
import databases from "./libraries/classes/database.js";
//import {overworld} from "./libraries/utilities.js"
import errorBuider from "./libraries/classes/error.js";
import { native, overworld, server } from "./libraries/utilities.js";
import eventBuilder from "./libraries/classes/events.js";
import './plugins/api_imports.js';
import './plugins/module_import.js';
global.tickTime = {};
let oldDate;
global.loaded = false;
global.deltaTimeArray = [];
//Array(256).fill('').map((item, i) => ({ x: i % 16, z: Math.floor(i / 16) % 16 })).filter(coord => Boolean(overworld.getEntitiesAtBlockLocation(new BlockLocation(coord.x, -65, coord.z))));

global.playerMap = new Map();
let joiningPlayers = [];
global.joiningPlayers = joiningPlayers;

const { random, floor } = Math;
// let loaded = false;


function set(objectLone) {
    new Function(`{ return object${key} }`);
}

const { entries, getOwnPropertyNames } = Object;
const { stringify } = JSON;
const { warn } = console;
import { content } from './libraries/utilities.js';
//`const {${[...document.querySelectorAll("strong")].map(node => node.innerHTML).join(', ')}} = event;`



let object = {
    help: 7,
    ImCool: 9,
    yousuck: {
        suckin: {
            help: 7
        },
        help: 7,
        push: {
            pushme: 'me',
            help: 9
        }
    }
};
// world.events.beforeDataDrivenEntityTriggerEvent.subscribe(event => {
//     const cancel = [];
//     eventBuilder.beforeDataDriven.forEach((key, callback) => {
//         cancel.push(callback(event,getScoreObjectsFromOnlinePlayers(players)));
//     });
//     if (cancel.some(bool => bool)) { event.cancel = true; }
// });
let deltaTimeArray = [];
let speedRatio = 1;
let ignoreSpeedRatio = true;
world.events.tick.subscribe(event => {
    time.start('tick');
    if (!ignoreSpeedRatio && event.currentTick % speedRatio) {
        return;
    }
    // overworld.runCommand(`event entity @e patches:kill`)

    // const { deltaTime, currentTick } = event;
    // if (!(currentTick % 10)) {
    //     overworld.runCommand(`say ${1 / deltaTime}`);
    // }

    // console.warn(JSON.stringify(global))
    joiningPlayers.forEach(player => {
        try {
            player.runCommand('testfor @s');
            joiningPlayers = joiningPlayers.filter(player => !joiningPlayers.some(join => player.getName() === join.getName()));
            console.warn('players', JSON.stringify(joiningPlayers));
            eventBuilder.playerJoin.forEach((key, callback) => {
                try {
                    callback(event);
                } catch (error) {
                    errorBuider.log(error, error.stack, { event: 'playerJoin', key: 'N/A' });
                }
            });
            if (!global.loaded) {
                try {
                    try { overworld.runCommand(`tickingarea add 0 0 0 0 0 0 PatchyDataBaseTick`); } catch { }
                    databases.initialize();
                    server.objectiveAdd('error');

                    server.scoreAdd('error', 'log');
                    console.warn(server.scoreAdd('error', 'save'), server.scoreAdd('error', 'log'));
                    global.loaded = true;
                } catch (error) { errorBuider.log(error, error.stack, { event: 'worldLoad', key: 'N/A' }); }
            }
        } catch { /*console.warn(error, error.stack);*/ }

    });
    try {
        if (global.loaded) {
            const { deltaTime } = event;
            deltaTimeArray.unshift(deltaTime);
            if (deltaTimeArray.length > 250) { deltaTimeArray.pop(); }
            global.tps = (1 / (deltaTimeArray.reduce((a, b) => a + b, 0) / deltaTimeArray.length));

            global.players = [...world.getPlayers()].filter(player => !joiningPlayers.some(join => player.getName() === join.getName()));
            global.nonStaffPlayers = [...world.getPlayers(Object.assign(new EntityQueryOptions(), { scoreOptions: [Object.assign(new EntityQueryScoreOptions(), { exclude: true, maxScore: 1, minScore: 1, objective: 'staff' })] }))].filter(player => !joiningPlayers.some(join => player.getName() === join.getName()));
            global.scoreObject = getScoreObjectsFromOnlinePlayers(global.players);
            let dimensions = [];
            global.players.forEach(player => {
                const { name } = player;
                let playerMap = global.playerMap[name];
                if (dimensions.every(value => value !== player.dimension)) {
                    dimensions.push(player.dimension);
                }
                const inventory = player.getComponent('minecraft:inventory').container;
                let items = [];
                for (let i = 0; i < inventory.size; i++) {
                    const item = inventory.getItem(i);
                    items.push(item);
                    // content.warn(native.stringify(item));
                }
                if (!playerMap) {
                    playerMap = {};
                }
                Object.assign(playerMap, {
                    inventory,
                    items
                });
                // content.warn(items.map(item => native.stringify(item)))
            });
            global.dimensions = dimensions;
            global.playerIds = global.scoreObject.forEach((key, value) => (value.playerId) ? ({ [value.playerId]: key }) : false, {});
            let keys = [];

            eventBuilder.tick.filter(key => key.startsWith('init')).forEach((key, callback) => {
                keys.push(key);
                try {
                    callback(event);
                } catch (error) {
                    errorBuider.log(error, error.stack, { event: 'tick', key });
                }
            });
            eventBuilder.tick.filter(key => !key.startsWith('init') && !key.startsWith('end')).forEach((key, callback) => {
                keys.push(key);
                try {
                    callback(event);
                } catch (error) {
                    errorBuider.log(error, error.stack, { event: 'tick', key });
                }
            });
            eventBuilder.tick.filter(key => key.startsWith('end')).forEach((key, callback) => {
                keys.push(key);
                try {
                    callback(event);
                } catch (error) {
                    errorBuider.log(error, error.stack, { event: 'tick', key });
                }
            });
            // content.warn({ keys });
            global.tickTime.tick = time.end('tick');
            // content.warn(global.tickTime);
        }
    } catch (error) { console.warn(error, error.stack); }
});

world.events.beforeChat.subscribe(event => {
    try {
        time.start('beforeChat');

        // console.warn(event.message);
        let eventKey;
        eventBuilder.forEach((key, value) => { if (value.commands) { eventKey = key; } });
        // console.warn(eventKey);
        let cancel = [];
        eventBuilder.beforeChat.forEach((key, callback) => {
            try {
                cancel.push(callback(event));
            } catch (error) {
                errorBuider.log(error, error.stack, { event: 'beforeChat', key });
            }

        });
        if (cancel.some(bool => bool)) { event.cancel = true; }
        global.tickTime.beforeChat = time.end('beforeChat');
        // console.warn(cancel);
    } catch (error) {
        console.warn(error, error.stack);
    }
});
const excludedBlocks = [
    'minecraft:bedrock',
    'minecraft:barrier',
    'minecraft:structure_block',
    'minecraft:structure_void',
    'minecraft:command_block',
    'minecraft:repeating_command_block',
    'minecraft:chain_command_block',
    'minecraft:chest',
    'minecraft:trapped_chest',
    'minecraft:barrel',
    'patches:claim_core',
    'patches:furnace',
    'patches:blast_furnace',
];
world.events.beforeExplosion.subscribe(event => {
    time.start('beforeExplosion');
    let { impactedBlocks, dimension } = event;
    const cancels = [];
    eventBuilder.beforeExplosion.forEach((key, callback) => {
        try {
            const { cancel, impactedBlocks: callImpactedBlocks } = callback(event) ?? {};
            if (callImpactedBlocks) {
                impactedBlocks = impactedBlocks.filter(blockLocation => callImpactedBlocks
                    .some(blockLocation1 => blockLocation1 === blockLocation))
                    .map(({ x, y, z }) => new BlockLocation(x, y, z));;
            }
            cancels.push(cancel);

        } catch (error) {
            errorBuider.log(error, error.stack, { event: 'beforeExplosion', key });
        }
    });
    if (cancels.some(bool => bool)) { event.cancel = true; }

    event.impactedBlocks = impactedBlocks;
    global.tickTime.beforeExplosion = time.end('beforeExplosion');
});
world.events.beforeItemDefinitionEvent.subscribe(event => {
    time.start('beforeItemDefinitionEvent');
    const cancel = [];
    eventBuilder.beforeItemDefinitionEvent.forEach((key, callback) => {
        try {
            cancel.push(callback(event));
        } catch (error) {
            errorBuider.log(error, error.stack, { event: 'beforeItemDefinitionEvent', key });
        }
    });
    if (cancel.some(bool => bool)) { event.cancel = true; }
    global.tickTime.beforeItemDefinitionEvent = time.end('beforeItemDefinitionEvent');
});
world.events.beforeItemUse.subscribe(event => {
    time.start('beforeItemUse');
    const cancel = [];
    eventBuilder.beforeItemUse.forEach((key, callback) => {
        try {
            cancel.push(callback(event));
        } catch (error) {
            errorBuider.log(error, error.stack, { event: 'beforeItemUse', key });
        }
    });
    if (cancel.some(bool => bool)) { event.cancel = true; }
    global.tickTime.beforeItemUse = time.end('beforeItemUse');
});
world.events.beforeItemUseOn.subscribe(event => {
    time.start('beforeItemUseOn');
    try {
        const cancel = [];
        eventBuilder.beforeItemUseOn.forEach((key, callback) => {
            try {
                cancel.push(callback(event));
            } catch (error) {
                errorBuider.log(error, error.stack, { event: 'beforeItemUseOn', key });
            }
        });
        if (cancel.some(bool => bool)) { event.cancel = true; }

    } catch (error) {
        console.warn(error, error.stack);
    }
    global.tickTime.beforeItemUseOn = time.end('beforeItemUseOn');
});
world.events.beforePistonActivate.subscribe(event => {
    time.start('beforePistonActivate');
    const cancel = [];
    eventBuilder.beforePistonActivate.forEach((key, callback) => {
        try {
            cancel.push(callback(event));
        } catch (error) {
            errorBuider.log(error, error.stack, { event: 'beforePistonActivate', key });
        }
    });
    if (cancel.some(bool => bool)) { event.cancel = true; }
    global.tickTime.beforePistonActivate = time.end('beforePistonActivate');
});
world.events.blockBreak.subscribe(event => {
    time.start('blockBreak');
    eventBuilder.blockBreak.forEach((key, callback) => {
        try {
            callback(event);
        } catch (error) {
            errorBuider.log(error, error.stack, { event: 'blockBreak', key });
        }
    });
    global.tickTime.blockBreak = time.end('blockBreak');
});
world.events.blockExplode.subscribe(event => {
    time.start('blockExplode');
    eventBuilder.blockExplode.forEach((key, callback) => {
        try {
            callback(event);
        } catch (error) {
            errorBuider.log(error, error.stack, { event: 'blockExplode', key });
        }
    });
    global.tickTime.blockExplode = time.end('blockExplode');
});
world.events.blockPlace.subscribe(event => {
    time.start('blockPlace');
    eventBuilder.blockPlace.forEach((key, callback) => {
        try {
            callback(event);
        } catch (error) {
            errorBuider.log(error, error.stack, { event: 'blockPlace', key });
        }
    });
    global.tickTime.blockPlace = time.end('blockPlace');

});
// world.events.blockPlace.subscribe(({dimension, block: {location}, player}) => {
//     let block = dimension.getBlock(location)
//     if (block.type.id === 'minecraft:chest') {
//         let inventory = block.getComponent('inventory').container
//         if (inventory.emptySlotsCount !== inventory.size) {
//             for (let i = 0; i < inventory.size; i++) {
//                 let item = inventory.getItem(i);
//                 if (!item) { continue; }
//                 inventory.setItem(i, Object.assign(item, {amount: 0} ))
//             }
//             player.runCommand('say nbt hacker')
//         }
//     }
// });
world.events.chat.subscribe(event => {
    time.start('chat');
    eventBuilder.chat.forEach((key, callback) => {
        try {
            callback(event);
        } catch (error) {
            errorBuider.log(error, error.stack, { event: 'chat', key });
        }
    });
    global.tickTime.chat = time.end('chat');
});
// world.events.dataDrivenEntityTriggerEvent.subscribe(event => {
//     eventBuilder.dataDrivenEntityTriggerEvent.forEach((key, callback) => {
//         callback(event,getScoreObjectsFromOnlinePlayers(players));
//     });
// });
world.events.effectAdd.subscribe(event => {
    time.start('effectAdd');
    eventBuilder.effectAdd.forEach((key, callback) => {
        try {
            callback(event);
        } catch (error) {
            errorBuider.log(error, error.stack, { event: 'effectAdd', key });
        }
    });
    global.tickTime.effectAdd = time.end('effectAdd');
});
world.events.entityCreate.subscribe(event => {
    time.start('entityCreate');
    eventBuilder.entityCreate.forEach((key, callback) => {
        try {
            callback(event);
        } catch (error) {
            errorBuider.log(error, error.stack, { event: 'entityCreate', key });
        }
    });
    global.tickTime.entityCreate = time.end('entityCreate');
});
world.events.explosion.subscribe(event => {
    time.start('explosion');
    eventBuilder.explosion.forEach((key, callback) => {
        try {
            callback(event);
        } catch (error) {
            errorBuider.log(error, error.stack, { event: 'explosion', key });
        }
    });
    global.tickTime.explosion = time.end('explosion');
});
world.events.itemDefinitionEvent.subscribe(event => {
    time.start('itemDefinitionEvent');
    eventBuilder.itemDefinitionEvent.forEach((key, callback) => {
        try {
            callback(event);
        } catch (error) {
            errorBuider.log(error, error.stack, { event: 'itemDefinitionEvent', key });
        }
    });
    global.tickTime.itemDefinitionEvent = time.end('itemDefinitionEvent');
});
world.events.itemUse.subscribe(event => {
    time.start('itemUse');
    eventBuilder.itemUse.forEach((key, callback) => {
        try {
            callback(event);
        } catch (error) {
            errorBuider.log(error, error.stack, { event: 'itemUse', key });
        }
    });
    global.tickTime.itemUse = time.end('itemUse');
});
world.events.itemUseOn.subscribe(event => {
    time.start('itemUseOn');
    eventBuilder.itemUseOn.forEach((key, callback) => {
        try {
            callback(event);
        } catch (error) {
            errorBuider.log(error, error.stack, { event: 'itemUseOn', key });
        }
    });
    global.tickTime.itemUseOn = time.end('itemUseOn');
});
world.events.pistonActivate.subscribe(event => {
    time.start('pistonActivate');
    eventBuilder.pistonActivate.forEach((key, callback) => {
        try {
            callback(event);
        } catch (error) {
            errorBuider.log(error, error.stack, { event: 'pistonActivate', key });
        }
    });
    global.tickTime.pistonActivate = time.end('pistonActivate');
});
world.events.playerJoin.subscribe(({ player }) => {
    joiningPlayers.unshift(player);

});
world.events.playerLeave.subscribe(event => {
    time.start('playerLeave');
    delete global.playerMap[event.playerName];

    eventBuilder.playerLeave.forEach((key, callback) => {
        try {
            callback(event);
        } catch (error) {
            errorBuider.log(error, error.stack, { event: 'playerLeave', key });
        }
    });
    global.tickTime.playerLeave = time.end('playerLeave');
});



world.events.weatherChange.subscribe(event => {
    time.start('weatherChange');

    eventBuilder.weatherChange.forEach((key, callback) => {
        try {
            callback(event, players, getScoreObjectsFromOnlinePlayers(players));
        } catch (error) {
            errorBuider.log(error, error.stack, { event: 'weatherChange', key });
        }
    });
    global.tickTime.weatherChange = time.end('weatherChange');
});

world.events.entityHit.subscribe(event => {
    time.start('playerHit');
    eventBuilder.playerHit.forEach((key, callback) => {
        try {
            callback(event);
        } catch (error) {
            errorBuider.log(error, error.stack, { event: 'playerHit', key });
        }
    });
    global.tickTime.playerHit = time.end('playerHit');
}, Object.assign(new EntityEventOptions(), { entityTypes: ["minecraft:player"] }));
world.events.entityHit.subscribe(event => {
    time.start('entityHit');
    eventBuilder.entityHit.forEach((key, callback) => {
        try {
            callback(event);
        } catch (error) {
            errorBuider.log(error, error.stack, { event: 'entityHit', key });
        }
    });
    global.tickTime.entityHit = time.end('entityHit');
});
world.events.entityHurt.subscribe(event => {
    time.start('playerHurt');
    eventBuilder.playerHurt.forEach((key, callback) => {
        try {
            callback(event);
        } catch (error) {
            errorBuider.log(error, error.stack, { event: 'playerHurt', key });
        }
    });
    global.tickTime.playerHurt = time.end('playerHurt');
}, Object.assign(new EntityEventOptions(), { entityTypes: ["minecraft:player"] }));
world.events.entityHurt.subscribe(event => {
    time.start('entityHurt');
    eventBuilder.entityHurt.forEach((key, callback) => {
        try {
            callback(event);
        } catch (error) {
            errorBuider.log(error, error.stack, { event: 'entityHurt', key });
        }
    });
    global.tickTime.entityHurt = time.end('entityHurt');
});
