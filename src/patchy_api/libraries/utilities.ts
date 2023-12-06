import { world, ItemTypes, Player, Entity, BlockPermutation, ScoreboardObjective, Direction, Vector2, Vector3, DisplaySlotId, Dimension, system, ItemType, Block } from '@minecraft/server';
import errorLogger from './classes/error.js';
export function getXZVectorRY(ry: number) {
    const rads = (ry + 180) * Math.PI / 180;
    return { x: Math.sin(rads), y: 0, z: Math.cos(rads) };
}
export const content = {
    warn(...messages: any[]) {
        console.warn(messages.map(message => JSON.stringify(message, (key, value) => (value instanceof Function) ? '<f>' : value)).join(' '));
    },
    chatFormat(...messages: any[]) {
        chunkString(messages.map(message => JSON.stringify(message, (key, value) => (value instanceof Function) ? '<f>' : value, 4)).join(' '), 500).forEach(message => world.sendMessage(message));
    }
};
export function vector3Equals(vector1: Vector3, vector2: Vector3) {
    return vector1.x === vector2.x && vector1.y === vector2.y && vector1.z === vector2.z;
}
export function isVector3(target: any): target is Vector3 {
    // content.warn(typeof target === 'object', !(target instanceof Array), 'x' in target, 'y' in target, 'z' in target);
    return typeof target === 'object' && !(target instanceof Array) && 'x' in target && 'y' in target && 'z' in target;
}
export function isVector2(target: any): target is Vector2 {
    // content.warn(typeof target === 'object', !(target instanceof Array), 'x' in target, 'y' in target, 'z' in target);
    return typeof target === 'object' && !(target instanceof Array) && 'x' in target && 'y' in target && !('z' in target);
}
export function isVector2Or3(target: any): target is Vector2 | Vector3 {
    // content.warn(typeof target === 'object', !(target instanceof Array), 'x' in target, 'y' in target, 'z' in target);
    return typeof target === 'object' && !(target instanceof Array) && 'x' in target && 'y' in target;
}

export async function getBlockAsync(dimension: Dimension, blockLocation: Vector3): Promise<Block> {
    let block = dimension.getBlock(blockLocation);
    block = ((block && block.isValid()) ? block : await new Promise((resolve) => {
        const runId = system.runInterval(() => {
            try {
                block = dimension.getBlock(blockLocation);
                if (!block) return;
                if (!block.isValid()) return;
                system.clearRun(runId);
                resolve(block);
            } catch (error: any) {
                console.warn('ingore', error, error.stack);
            }
        });
    }))!;
    return block;
}
export function rotationToDirection(rotation: Vector2) {
    let { x, y } = rotation;

    x = (x / 45 + 2) | 0;
    y = ((y + 45) / 90 + 2) | 0;
    if (x < 1) return 'Up';
    else if ((x > 2)) return 'Down';
    switch (y) {
        case 2:
            return 'South';
        case 4:
        case 0:
            return 'North';
        case 1:
            return 'East';
        case 3:
            return 'West';
    }
};
export const reverseDirection = {
    "Down": "Up",
    "East": "West",
    "North": "South",
    "South": "North",
    "Up": "Down",
    "West": "East"
};
export function rotationToHorizontalDirection(rotation: Vector2) {
    let { x, y } = rotation;
    y = ((y + 45) / 90 + 2) | 0;
    switch (y) {
        case 2:
            return 'South';
        case 4:
        case 0:
            return 'North';
        case 1:
            return 'East';
        case 3:
            return 'West';
    }
};
export function isDefined<T>(input: T | undefined | null): input is T {
    return (input !== null && input !== undefined && !Number.isNaN(input));
}
export function permutationClone(permutation: BlockPermutation) {
    const permutationProperties: any = {};
    /**
     * @type {BlockPermutation}
     */
    const blockPermutation = permutation;
    Object.keys(blockPermutation.getAllStates()).forEach((value) => {
        permutationProperties[value] = blockPermutation.getState(value);
    });
    return permutationProperties;
}
export function weightsRandom(...weights: number[]) {
    const sum = weights.reduce((s, c) => s + c);
    let valueSUm = 0;
    const sortedWeights = [...weights].sort((a, b) => b - a);
    const sortedTestWeights = sortedWeights.slice(0, -1).map(value => { valueSUm += value; return valueSUm; });
    const random = (Math.random() * sum) | 0;
    const test = [...sortedTestWeights, random].sort((a, b) => a - b);
    return weights.indexOf(sortedWeights[test.indexOf(random)]!);
}
export class RemovableTree {
    array: string[];
    constructor(array = []) {
        this.array = array;
    }
    next(key: string) {
        const index = this.array.indexOf(key);
        if (index === -1) {
            this.array.push(key);
            return this;
        } else {
            if (this.array.length <= 1) return;
            this.array.splice(index + 1);
            return this;
        }
    }
    last() {
        return this.array[this.array.length - 1];
    }
    beforeLast(lastIndex = 0) {
        const value = this.array[this.array.length - lastIndex - 2];
        if (!value) return;
        this.next(value);
        return value;

    }
}
export function typeOf(value: any) {
    if (typeof value === 'function') {
        try {
            return (new value()).constructor?.name;
        } catch {
            return 'Function';
        }
    }
    return value?.constructor?.name;
}

export function hypot3(n1: number, n2: number, n3: number) {
    return Math.sqrt(n1 ** 2 + n2 ** 2 + n3 ** 2);
}
export function hypot2(n1: number, n2: number) {
    return Math.sqrt(n1 ** 2 + n2 ** 2);
}

// export function guessTheNumber(condition: (number: number) => boolean, maxAmount: number) {
//     const dividend = maxAmount / 2;
//     let currentNumber = dividend;
//     let lastCondition;
//     let iterations = Math.ceil(Math.log2(maxAmount) + maxAmount / 22000);
//     for (let i = 0; i < iterations; i++) {
//         const divsor = 2 ** i;
//         const guess: number = (lastCondition === undefined) ? currentNumber : (lastCondition) ? currentNumber - dividend / divsor : currentNumber + dividend / divsor;
//         lastCondition = Boolean(condition(guess));
//         // console.log(i, guess, lastCondition);
//         currentNumber = guess;
//     }
//     return currentNumber;
// }
// export async function testXpLevel(player: Player, testLevel: number) {
//     const bool = false;
//     try { await player.runCommandAsync(`tesfor @s[lm=${testLevel}]`); bool = true; } catch { }
//     return bool;
// }

// export const xp = guessTheNumber(async (guess) => {
//     return await testXpLevel(player, Math.round(guess));
// }, 24000);
/**
 * @function parseList spreads all arrays in an array into one single array
 * @param {Array} list 
 * @returns Array
 */
export function parseList(list: any[]) {
    if (!Array.isArray(list)) { return; }
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (Array.isArray(item)) {
            list = [...list.slice(undefined, i), ...item, ...list.slice(i + 1)];
            i--;
        } else {
            list[i] = list[i];
        }

    }
    return list;
}
export const lockedItemKey = '§1§a§s§w§A';
export const crossHareDataKey = 87;
const { isInteger } = Number;
const { isArray } = Array;
const { log10, random, hypot, sqrt, PI } = Math;
const { entries, keys, values, assign } = Object;
export function randomCoordsOutsideCircle(minRadius: number, maxRadius: number) {
    const angle = random() * PI * 2;
    const randR = () => minRadius + (maxRadius - minRadius) * sqrt(random());
    const x = Math.cos(angle) * randR();
    const z = Math.sin(angle) * randR();
    const r = hypot(x, z);
    return { x, z, r };
}
/**
 * 
 * @param {[{x: number, y: number,z: number},{x: number, y: number,z: number}]} bounds 
 * @returns {{x: number, y: number,z: number}}
 */
export function randomCoordsInsideRectangle(bounds: [Vector3, Vector3]): Vector3 {
    const [{ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }] = sort3DVectors(...bounds);
    const xSize = x2 - x1 + 1;
    const zSize = z2 - z1 + 1;
    return { x: Math.floor(Math.random() * xSize) + x1, y: y2, z: Math.floor(Math.random() * zSize) + z1 };
}
// function randomCoordsOutsideCircle(minRadius, maxRadius) {
//     const angle = random() * PI * 2;
//     const radius = minRadius + (maxRadius - minRadius);
//     const randR = () => radius * sqrt(random());;
//     const x = Math.cos(angle) * randR();
//     const z = Math.sin(angle) * randR();
//     const r = hypot(x, z);
//     return { x, z, r, edge: { x: Math.cos(angle) * radius, z: Math.sin(angle) * radius } };
// }
export function sortRange(array: [[number, number], [number, number]]) {
    const x1 = (array[0][0] < array[1][0]) ? array[0][0] : array[1][0];
    const z1 = (array[0][1] < array[1][1]) ? array[0][1] : array[1][1];
    const x2 = (array[0][0] < array[1][0]) ? array[1][0] : array[0][0];
    const z2 = (array[0][1] < array[1][1]) ? array[1][1] : array[0][1];
    return [[x1, z1], [x2, z2]];
}
export function sort3DRange(array: [[number, number, number], [number, number, number]]) {
    const x1 = (array[0][0] < array[1][0]) ? array[0][0] : array[1][0];
    const y1 = (array[0][1] < array[1][1]) ? array[0][1] : array[1][1];
    const z1 = (array[0][2] < array[1][2]) ? array[0][2] : array[1][2];
    const x2 = (array[0][0] < array[1][0]) ? array[1][0] : array[0][0];
    const y2 = (array[0][1] < array[1][1]) ? array[1][1] : array[0][1];
    const z2 = (array[0][2] < array[1][2]) ? array[1][2] : array[0][2];
    return [[x1, y1, z1], [x2, y2, z2]];
}
const { floor } = Math;

export function sort3DVectors(vector1: Vector3, vector2: Vector3): [{ x: number, y: number, z: number; }, { x: number, y: number, z: number; }] {
    const { x: x1, y: y1, z: z1 } = vector1;
    const { x: x2, y: y2, z: z2 } = vector2;
    const ox1 = (x1 < x2) ? x1 : x2;
    const oy1 = (y1 < y2) ? y1 : y2;
    const oz1 = (z1 < z2) ? z1 : z2;
    const ox2 = (x1 < x2) ? x2 : x1;
    const oy2 = (y1 < y2) ? y2 : y1;
    const oz2 = (z1 < z2) ? z2 : z1;
    return [{ x: ox1, y: oy1, z: oz1 }, { x: ox2, y: oy2, z: oz2 }];
}

/**
 * 
 * @param {{x: number, y: number, z: number}} target 
 * @param {{x: number, y: number, z: number}} vector1 
 * @param {{x: number, y: number, z: number}} vector2 
 * @returns 
 */
export function betweenVector3(target: Vector3, vector1: Vector3, vector2: Vector3) {
    const { x: x1, y: y1, z: z1 } = vector1;
    const { x: x2, y: y2, z: z2 } = vector2;
    const ox1 = (x1 < x2) ? x1 : x2;
    const oy1 = (y1 < y2) ? y1 : y2;
    const oz1 = (z1 < z2) ? z1 : z2;
    const ox2 = (x1 < x2) ? x2 : x1;
    const oy2 = (y1 < y2) ? y2 : y1;
    const oz2 = (z1 < z2) ? z2 : z1;
    let { x, y, z } = target;
    return x >= ox1 && x <= ox2 && y >= oy1 && y <= oy2 && z >= oz1 && z <= oz2;
}
export function betweenBlockVector3(target: Vector3, vector1: Vector3, vector2: Vector3) {
    const { x: x1, y: y1, z: z1 } = vector1;
    const { x: x2, y: y2, z: z2 } = vector2;
    const ox1 = Math.floor((x1 < x2) ? x1 : x2);
    const oy1 = Math.floor((y1 < y2) ? y1 : y2);
    const oz1 = Math.floor((z1 < z2) ? z1 : z2);
    const ox2 = Math.floor((x1 < x2) ? x2 : x1);
    const oy2 = Math.floor((y1 < y2) ? y2 : y1);
    const oz2 = Math.floor((z1 < z2) ? z2 : z1);
    let { x, y, z } = target;
    x = Math.floor(x) + 0.5;
    y = Math.floor(y) + 0.5;
    z = Math.floor(z) + 0.5;
    return x >= ox1 && x <= ox2 && y >= oy1 && y <= oy2 && z >= oz1 && z <= oz2;
}
export function andArray(array: any[] = []) {
    const copy = [...array];
    switch (array.length) {
        case 0:
            return '';
        case 1:
            return array[0].toString();
        case 2:
            copy.splice(array.length - 1, 0, 'and');
            return copy.join(' ');
        default:
            copy.splice(array.length - 1, 1, 'and');
            return `${copy.join(', ')} ${array[array.length - 1]}`;
    }
}
export function orArray(array: any[] = []) {
    const copy = [...array];
    switch (array.length) {
        case 0:
            return '';
        case 1:
            return array[0].toString();
        case 2:
            copy.splice(array.length - 1, 0, 'or');
            return copy.join(' ');
        default:
            copy.splice(array.length - 1, 1, 'or');
            return `${copy.join(', ')} ${array[array.length - 1]}`;
    }
}
export const blockFaceToNumber = {
    "Down": 0,
    "East": 5,
    "North": 2,
    "South": 3,
    "Up": 1,
    "West": 4,
};
export const clickableBlocks = [
    "minecraft:acacia_door",
    "minecraft:acacia_trapdoor",
    "minecraft:acacia_button",
    "minecraft:birch_door",
    "minecraft:birch_trapdoor",
    "minecraft:birch_button",
    "minecraft:crimson_door",
    "minecraft:crimson_trapdoor",
    "minecraft:crimson_button",
    "minecraft:dark_oak_door",
    "minecraft:dark_oak_trapdoor",
    "minecraft:dark_oak_button",
    "minecraft:jungle_door",
    "minecraft:jungle_trapdoor",
    "minecraft:jungle_button",
    "minecraft:mangrove_door",
    "minecraft:mangrove_trapdoor",
    "minecraft:mangrove_button",
    "minecraft:spruce_door",
    "minecraft:spruce_trapdoor",
    "minecraft:spruce_button",
    "minecraft:warped_door",
    "minecraft:warped_trapdoor",
    "minecraft:warped_button",
    "minecraft:wooden_door",
    "minecraft:wooden_button",
    "minecraft:trapdoor",
    "minecraft:iron_door",
    "minecraft:iron_trapdoor",
    "minecraft:polished_blackstone_button",
    "minecraft:lever",
    "minecraft:chest",
    "minecraft:ender_chest",
    "minecraft:barrel",
    "minecraft:trapped_chest",
    "minecraft:dispenser",
    "minecraft:dropper",
    "minecraft:furnace",
    "minecraft:blast_furnace",
    "minecraft:lit_furnace",
    "minecraft:lit_blast_furnace",
    "minecraft:hopper",
    "minecraft:shulker_box",
    "minecraft:undyed_shulker_box",
    "minecraft:lit_smoker",
    "minecraft:smoker"
];
export function randomIntegerBetween(min: number, max: number) {
    return Math.floor(min + Math.random() * (max - min));
};
export function relativeParse(player: Player, input: string, direction: keyof Vector3) {
    if (input.includes('~')) {
        if (input.endsWith('*')) {
            return Math.floor((player.location[direction] + Number(input.replace(/[*~]/g, ''))) | 0) + 0.5;
        } else {
            return player.location[direction] + Number(input.replace('~', ''));
        }
    } else {
        return Number(input);
    }
}
export function blockFaceToCoords(blockFaceDir: Direction, { x, y, z }: Vector3) {
    if (!isDefined(blockFaceDir)) throw new Error('blockFaceDir at params[0] is not defined');
    const blockFace = blockFaceToNumber[blockFaceDir];
    // content.warn({ blockFace });

    let location = [x, y, z];
    [
        [0, -1, 0],
        [0, 1, 0],
        [0, 0, -1],
        [0, 0, 1],
        [-1, 0, 0],
        [1, 0, 0]
    ][blockFace]!.forEach((coord, i) => location[i] += coord);
    [x, y, z] = location as [number, number, number];
    return { x, y, z };
}
export function offsetVector3(Vector3: Vector3, offsetVector3: Vector3): Vector3 {
    return { x: Vector3.x + offsetVector3.x, y: Vector3.y + offsetVector3.y, z: Vector3.z + offsetVector3.z };
};


// const array1 = {
// 	help: []
// };

// // console.log(assignToPath(['help', 0], array1, 2), true);



export function pathIsObject(pathArray: string[], object: any, allowArrays?: boolean) {
    if (!allowArrays) {
        // console.log(`return typeof object?.${pathArray.join('?.')} === 'object' && !Array.isArray(object?.${pathArray.join('?.')})`);
        return new Function('object', `return typeof object?.${pathArray.join('?.')} === 'object' && !Array.isArray(object?.${pathArray.join('?.')})`)(object);
    } else {
        return new Function('object', `return typeof object?.${pathArray.join('?.')} === 'object'`)(object);
    }
}
export function pathIsSettable(pathArray: string[], object: any, allowArrays?: boolean) {
    const call = pathArray.slice(0, -1).every((key, i) => pathIsObject(pathArray.slice(0, -(i + 1)), object, allowArrays));
    if (pathArray.slice(0, -1).length) {
        return call;
    } else {
        return true;
    }
}
export function assignToPath(pathArray: string[], object: any, value: any, allowArrays?: boolean) {
    const mappedPathArray = pathArray.map(value => `[${(typeof value === 'number') ? value : `'${value}'`}]`);
    //   	// console.log(mappedPathArray)
    //   // console.log(pathIsSettable(mappedPathArray, object))
    if (pathIsSettable(mappedPathArray, object, allowArrays)) {
        // console.log({ pathIsSettable: `object${mappedPathArray.join('')} = value; return object` });
        return new Function('object', 'value', `object${mappedPathArray.join('')} = value; return object`)(object, value);
    } else {
        let stop = false;
        pathArray.forEach((path, i) => {
            const newPathArray = mappedPathArray.slice(0, i + 1);
            // // console.log(newPathArray);
            if (!stop && !pathIsObject(newPathArray, object, allowArrays)) {
                // // console.log(`object${newPathArray.join('')} = {}; return object`);
                object = new Function('object', `object${newPathArray.join('')} = {}; return object`)(object);
            } else if (!stop && pathIsSettable(newPathArray, object, allowArrays)) {
                return;
            } else {
                stop = true;
            }
            // // console.log('obj', object);
        });
        if (!stop) {
            return assignToPath(pathArray, object, value, allowArrays);
        }

    }
}
const native = {
    typeOf(input: any) {
        switch (typeof input) {
            case 'object': {
                return (Array.isArray(input)) ? 'array' : 'object';
            }
            default: {
                return typeof input;
            }
        }
    },
    toConstructed(type: any): {} | [] | false {
        switch (type) {
            case "object": {
                return {};
            } case "array": {
                return [];
            } default: {
                return false;
            }

        }
    },
    toObject<t>(input: t): t {
        let output = this.toConstructed(this.typeOf(input)) as t;
        if (!output) { return input; }
        call(input, [] as t);
        function call(input1: any, path: any) {
            // console.log(path);
            switch (native.typeOf(input1)) {
                case "object": {
                    const prototype = Object.getPrototypeOf({});
                    for (const key in input1) {
                        if (prototype.hasOwnProperty(key)) { continue; }
                        call(input1[key], [...path, key]);
                    }
                    break;
                } case "array": {
                    output = assignToPath(path, output, [], true);
                    (input1 as any[]).forEach((item, i) => {
                        call(item, [...path, i]);
                    });
                    break;
                } case "function": {
                    output = assignToPath(path, output, `function() { }`, true);
                    break;
                } default: {
                    output = assignToPath(path, output, input1, true);
                    break;
                }
            }
        };


        return output;
    },
    stringify(...[input, replacer, spacing]: Parameters<JSON['stringify']>) {
        return JSON.stringify(this.toObject(input), replacer, spacing);
    }
};
export { native };

export function toProperCase(string: string) {
    return string.replace(/_/g, ' ').replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}
export function toCamelCase(str: string) {
    return str.replace(/(?:^\w|[A-Z]|(\b|_)\w)/g, (word, index) => word.toUpperCase()).replace(/[\s_]+/g, '').replace(/\w/, (world) => world.toLowerCase());
}
export const staff = {
    sendMessage(message: any, exludePlayer: string) {
        [...world.getPlayers({ scoreOptions: [{ exclude: true, maxScore: 1, minScore: 1, objective: 'staff' }] })]
            .filter(player => player.id !== exludePlayer)
            .forEach(player => {
                player.sendMessage(message.toString());
            });
    }
};
try {
    world.scoreboard.addObjective('scoreIdentityInit', 'scoreIdentityInit');
} catch (error) {

}
export const server = {
    /**
     * 
     * @param {String} objective 
     * @param {Player} player 
     * @param {value} value 
     * @param {'List' | 'Sidebar' | 'BelowName' } updateId 
     */
    async setPlayerScoreboard(objective: string, player: Player, value: number, updateId?: DisplaySlotId) {
        try {
            await player.runCommandAsync('scoreboard players set @s scoreIdentityInit 0');
            world.scoreboard.getObjective(objective)?.setScore(player, value);
            if (!updateId) return;
            const scoreboardObjectiveDisplayOptions = world.scoreboard.getObjectiveAtDisplaySlot(updateId);
            if (scoreboardObjectiveDisplayOptions?.objective?.id !== objective) return;
            world.scoreboard.clearObjectiveAtDisplaySlot(updateId);
            world.scoreboard.setObjectiveAtDisplaySlot(updateId, scoreboardObjectiveDisplayOptions);
        } catch (error: any) {
            console.warn('server.setPlayerScoreboard()', error, error.stack);
        }
    },
    tellraw(message: any) {
        try {
            world.sendMessage(message.toString());
        } catch (error) {
            console.warn('server.tellraw', error);
        }
    },
    /**
     * @method scoreTest
     * @param {String} objective 
     * @param {Player} target Also be Entity or String
     * @param {Player} findParticipant 
     * @returns 
     */
    scoreTest(objective: string, target: Player | Entity | string) {
        if (!objective) throw new Error('objective must be defined');
        if (!target) throw new Error('target must be defined');
        const scoreboardObjective = world.scoreboard.getObjective(objective);
        if (!scoreboardObjective) throw new Error(`scoreboardObjective: ${objective} must exist`);

        try {
            return scoreboardObjective.getScore((target as any)?.root ?? target);
        } catch (error) {

        }

    },
    objectiveAdd(objective: string, displayName = objective) {
        try {
            world.scoreboard.addObjective(objective, displayName);
            return true;
        } catch (error) {
            // console.warn(error, error.stack);
            return;
        }
    },
    objectiveRemove(objective: string) {
        try {
            world.scoreboard.removeObjective(objective);
            return true;
        } catch (error: any) {
            console.warn(error, error.stack);
            return;
        }
    },
    /**
     * @param {String} objective 
     * @param {import('@minecraft/server').Player} player 
     * @param {Number} value
     * @param {'list' | 'sidebar' | 'belowName' } updateId 
     */
    scoreResetPlayer(objective: string, target: Player | Entity | string) {
        try {
            world.scoreboard.getObjective(objective)
                ?.removeParticipant((target as any)?.root ?? target);
            return true;
        } catch (error: any) {
            console.warn(error, error.stack);
            return false;
        }
    },
    scoreSetPlayer(objective: string, target: Player | Entity | string, value = 0, updateId?: DisplaySlotId) {
        // content.warn({ objective: objective.constructor.name, player: player.constructor.name, value: value });
        world.scoreboard.getObjective(objective)?.setScore(((target as any)?.root ?? target), value);
        if (!updateId) return value;
        const scoreboardObjectiveDisplayOptions = world.scoreboard.getObjectiveAtDisplaySlot(updateId);
        if (scoreboardObjectiveDisplayOptions?.objective.id !== objective) return;
        world.scoreboard.clearObjectiveAtDisplaySlot(updateId);
        world.scoreboard.setObjectiveAtDisplaySlot(updateId, scoreboardObjectiveDisplayOptions);
        return value;
    }
};

/**
 * @param {number} seconds 
 * @returns {string}
 */
export function formatSeconds(seconds: number) {
    const minutes = Math.floor((seconds % 3600) / 60);
    const hours = Math.floor(seconds / 3600);
    return `${(hours) ? `${hours}:` : ''}${(minutes) ? `${minutes}:` : ''}${(seconds % 60).toString().padStart(2, '0')}`;
}
/**
 * @param {{x: number, y: number, z: number}} vector 
 * @returns {{x: number, y: number}}
 */
export function vector3ToRotation(vector: Vector3) {
    return { x: Math.asin(-vector.y) * 180 / Math.PI, y: -Math.atan2(vector.x, vector.z) * 180 / Math.PI };
}
/**
 * @param {{x: number, y: number}} rotation 
 * @returns {{x: number, y: number, z: number}}
 */
// export function rotationToVector3(rotation) {
//     const { x: rx, y: ry } = rotation;
//     let cosRX = Math.cos(rx);
//     return { x: -Math.sin(rx) * cosRX, y: -Math.sin(ry), z: Math.cos(rx) * cosRX };
// }







// const prototypes = {
//     toBinary() {
//         return this.replace(/[\s\S]/g, (str) => str.charCodeAt().toString(2));
//     },
//     toText() {
//         return this.replace(/\d{5}]/g, (match) => // console.log(Number(match).toString()));
//     },
// };

// Object.assign(String.prototype, prototypes);






/**
 * @param {Array<String>} commandArray Commands.
 * @param {String} dimension The dimension command should be run in. If left blank it will run in the: Overworld.
 * @returns {Array<String>} Returns the following array for each object in the array.
 */

export function combine(target: any, source: any) {
    Object.entries(target).forEach(([key, value]) => {
        if (source[key] && typeof target[key] === 'object' && typeof source[key] === 'object') {
            source[key] = { ...target[key], ...source[key] };
        }
    });
    return { ...target, ...source };
}
const object = {
    mining: {
        coal: 5,
        iron: 10,
        diamond: 15,
    },
    lumber: {
        oak: 5,
        birch: 10,
        spruce: 15,
    },
    farming: {
        wheat: 5,
        carrots: 10,
        potatoes: 15,
    },
};
/**
 * imnotverysure
 */
type FlattenObject<T> = {
    [K in keyof T]: T[K]
}[keyof T];
/**
 * imnotverysure
 */
type CombinedObject<O, T extends FlattenObject<O> = FlattenObject<O>> = ((T extends any ? (x: T) => void : never) extends (x: infer V) => void ? V : never) extends infer V ? {
    [K in keyof V]: V[K]
} : never;
/**
 * imnotverysure
 */
export type ShallowUnestObject<T> = CombinedObject<T>;

export function shallowUnestObject<T extends Record<string | number, Record<string | number, any>>>(object: T) {
    const shallowUnestedObject = {} as ShallowUnestObject<T>;
    Object.entries(object).forEach(([key, value]) => {
        Object.assign(shallowUnestedObject, value);
    });
    return shallowUnestedObject;
}

export type Entries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T] extends infer U ? (U extends [keyof T, infer V] ? [keyof T, V][] : never) : never;
export function ObjectEntries<T>(obj: T): Entries<T> {
    return Object.entries(obj as any) as Entries<T>;
}
export function ItemsGet(id: string, log = false): ItemType {
    const item = ItemTypes.get(id);
    if (!item) {
        let stack;
        try {
            throw new Error('');
        } catch (error: any) {
            stack = error.stack;
        }
        if (log) {
            errorLogger.log({ message: `Item: ${id}, does not exist!` }, stack, { key: 'chests', event: 'tick' });
        }
        return ItemTypes.get('air')!;
    } else {
        return item;
    }
}

export const colors = ['4', 'c', '6', 'g', 'e', 'a', '2', '3', '9', '1', 'd', '5'];
const reverseCopy = (array: any[]) => {
    return [...array].reverse();
};
/**
 * 
 * @param {Number} value 0-1
 * @param {Bool} reversed 
 * @returns {String}
 */
export function rainbowWeight(value: number, reversed = false) {
    const colorsA = (reversed) ? reverseCopy(colors) : colors;
    // content.warn({color: ~~(((value > 1) ? 1 : value) * (colors2.length - 1)), colors})
    return colorsA[~~(((value > 1) ? 1 : value) * (colorsA.length - 1))];
}
export function rainbow() {
    return colors[Math.floor(Math.random() * colors.length)];
}
export function getNames() {
    const names = [...world.getPlayers()].forEach(name => {
        return name;
    });
    return names;
}

export function createArrayBetween(min: number, max: number) {
    const array = new Array(max - min + 1);
    for (let i = 0; min <= max; i++) {
        array[i] = min++;
    }
    return array;
}
const numberCharCodes = [...createArrayBetween(33, 126), ...createArrayBetween(161, 321)];//createArrayBetween(33, 321);
const charArray = numberCharCodes.map(value => String.fromCharCode(value));
const charObject = {} as Record<string, number>;
charArray.forEach((char, i) => charObject[char] = i);
const valueUndefined = charArray[0];
// const errors = [];
// world.afterEvents.worldInitialize.subscribe(() => {
//     const player = world.getAllPlayers()[0];
//     numberCharCodes.forEach(value => {
//         try {
//             player.addTag(String.fromCharCode(value).repeat(255));
//         } catch (error) {
//             errors.push(value);
//         }
//     });
//     content.warn({ errors });
// });
export function obfuscate255(string: string) {
    return [...string].map(value => charArray[value.charCodeAt(0)] ?? valueUndefined).join('');
}

export function deobfuscate255(string: string) {
    return [...string].map(value => String.fromCharCode(charObject[value]!)).join('');
}


export const overworld = world.getDimension('overworld'), nether = world.getDimension('nether'), end = world.getDimension('the end');

export function chunkStringRegex(str: string, length: number) {
    return str.match(new RegExp(".{1," + length + "}", "g"));
}
export function chunkString(str: string, length: number) {
    let size = (str.length / length) | 0;
    const array: string[] = Array(++size);
    for (let i = 0, offset = 0; i < size; i++, offset += length) {
        array[i] = str.substr(offset, length);
    }
    return array;
}
/**
 * @param {String} str 
 * @param {Number} length 
 * @returns {Array}
 */
export function chunkStringBytes(str: string, length: number) {
    const chunks: string[] = [];
    let chunk = '';
    let byteCount = 0;

    for (let i = 0; i < str.length; i++) {
        const char = str[i]!;
        const charCode = char.charCodeAt(0);

        if (byteCount + (charCode > 127 ? 2 : 1) > length) {
            chunks.push(chunk);
            chunk = '';
            byteCount = 0;
        }

        chunk += char;
        byteCount += charCode > 127 ? 2 : 1;
    }

    if (chunk.length > 0) {
        chunks.push(chunk);
    }

    return chunks;
}
/**
 * 
 * @param {string} str 
 * @param {number} length 
 * @returns 
 */
export function chunkStringReverse(str: string, length: number) {
    let size = (str.length / length) | 0;
    const array = Array(++size);
    for (let i = size - 1, offset = str.length - length; i >= 0; i--, offset -= length) {
        array[i] = str.substring(offset, offset + length);
    }
    return array;
}
export function generateRandomString(length: number) {
    return Array.from(Array(length), () => String.fromCharCode((Math.random() * 86 | 0) + 33)).join('');
};
/**
 * do not \ on the @
 * @example parseCommand('!give \@"bat is bob" iron_sword {"data":6, "enchantments": {"sharpness":3}}', '!'); //returns ['give','bat is bob','iron_sword','{"data":6,"enchantments":{"sharpness":3}}']
 */
export function parseCommand(message: string, prefix: string) {
    const messageLength = message.length;
    let finding: string | boolean = false;
    let braceCount = [0, 0], bracketCount = [0, 0], quoteCount = 0, spaceCount = 0;
    let started = false;
    let o = 0;
    const output: string[] = [];
    for (let i = prefix.length; i < messageLength; i++) {
        const char = message[i];
        switch (char) {
            case '{':
                switch (finding) {
                    case 'string':
                        break;
                    case 'json':
                        braceCount[0]++;
                        break;
                    default:
                        braceCount = [0, 0], bracketCount = [0, 0], quoteCount = 0, spaceCount = 0, finding = false;
                        output.push('');
                        o++;
                        finding = 'json';
                        braceCount[0]++;
                        break;

                }
                output[o] += char;

                break;
            case '}':
                switch (finding) {
                    case 'json':
                        if (braceCount[0] !== ++braceCount[1] || bracketCount[0] !== bracketCount[1] || (quoteCount && quoteCount & 1)) break;
                        braceCount = [0, 0], bracketCount = [0, 0], quoteCount = 0, spaceCount = 0, finding = false;
                        break;
                }
                output[o] += char;
                break;
            case ']':
                switch (finding) {
                    case 'json':
                        if (bracketCount[0] !== ++bracketCount[1] || braceCount[0] !== braceCount[1] || (quoteCount && quoteCount & 1)) break;
                        braceCount = [0, 0], bracketCount = [0, 0], quoteCount = 0, spaceCount = 0, finding = false;
                        break;
                }
                output[o] += char;
                break;
            case '"':
                switch (finding) {
                    case 'json':
                        output[o] += char;
                        break;
                    default:
                        braceCount = [0, 0], bracketCount = [0, 0], quoteCount = 0, spaceCount = 0, finding = false;
                        finding = 'string';
                    case 'string':
                        if (!(++quoteCount & 1)) { finding = false; break; };
                        if (!output[o]!.length) break;
                        output.push('');
                        o++;
                        break;
                }
                break;
            case '[':
                switch (finding) {
                    case 'string':
                        break;
                    case 'json':
                        bracketCount[0]++;
                        break;
                    default:
                        output.push('');
                        o++;
                        finding = 'json';
                        break;

                }
                output[o] += char;

                break;
            case ' ':
                switch (finding) {
                    case 'string':
                    case 'json':
                        if (!(quoteCount & 1)) break;
                        output[o] += char;
                        break;
                    default:
                        const nextChar = message?.[i + 1];
                        switch (nextChar) {
                            case ' ':
                            case '[':
                            case '{':
                            case '"':
                                break;
                            default:
                                output.push('');
                                o++;
                                finding = 'word';
                                break;
                        }
                        break;
                }
                break;
            default:
                if (!started) {
                    started = true;
                    finding = 'word';
                    output.push('');
                    spaceCount = 1;
                }
                switch (char) {
                    case '@':
                        const nextChar = message?.[i + 1];
                        switch (nextChar) {
                            case '"':
                                break;
                            default:
                                const afterNextChar = message?.[i + 2];
                                switch (afterNextChar) {
                                    case '[':
                                        finding = 'json';
                                        output[o] += char;
                                        break;
                                }
                                break;
                        }
                        break;
                    default:
                        output[o] += char;
                        break;
                }

                break;
        }
    }
    return output;
}
const types = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'N', 'D'];
export function metricNumbers(value: number, place = 2) {
    const digits = ~~(log10(value) / 3);
    return (!digits) ? value : (value / 10 ** (digits * 3)).toFixed(place) + types[digits];
}
const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = [false, false, 'twenty', 'thirty', 'fourty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const places = ['hundred', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'Sextillion', 'Septillion', 'Octillion', 'Nonillion', 'Decillion', 'Undecillion', 'Duodecillion', 'Tredecillion', 'Quattuordecillion', 'Quindecillion', 'Sexdecillion', 'Septendecillion', 'Octodecillion', 'Novemdecillion'];

export function fixSciNumberString(string: string | number) {
    if (typeof string !== 'string') string = string.toString();
    let [numberBS, powerBN] = string.split('e');
    let number = numberBS!.split('.');
    if (number.length === 1) number.push('');
    let power = Number(powerBN);
    if (!power) return (number.length > 1) ? number[0] : number.join('.');
    if (power > 0) {
        number[0] += number[1]!.substring(0, power).padEnd(power, '0');
        number[1] = number[1]!.substring(power);
    } else {
        throw new Error('power cannot be negitive');
    }
    if (number[1] === '') number.pop();
    return number.join('.');
}

export function formatNumber(number: number | string) {
    if (typeof number === 'number') number = Math.floor(number).toString();
    let negitive = false;
    if (Number(number) < 0) number = number.replaceAll('-', ''), negitive = true;
    number = fixSciNumberString(number)!;
    if (number === '0') return 'zero';
    const numberArray = chunkStringReverse(number.toString(), 3).reverse();
    const output = numberArray.map((number, i) => {
        number = number.padStart(3, '0');
        const place = places[i];
        const hundred = Number(number[0]);
        const ten = Number(number[1]);
        const one = Number(number[2]);
        return (!hundred && !ten && !one) ? '' : `${(hundred) ? `${ones[hundred]} ${places[0]} ` : ''}${(!ten) ? (!one) ? '' : ones[one] : (ten > 1 && tens[ten]) ? `${tens[ten]}${(one) ? `-${ones[one]}` : ''}` : teens[one]}${(i) ? ` ${place}` : ''}`;
    }).reverse().join(' ');
    console.log(output);
    return ((negitive) ? 'negtive ' : '') + output;
}
const decimals = ['', 'an eighth', 'a quarter', 'three eighths', 'a half', 'five eighths', 'three forths', 'seven eighths'];
export function formatDecimal(number: number) {
    const index = Math.floor(number % 1 * 8);
    console.log(index);
    return `${(index === decimals.length - 1) ? '' : ` and ${decimals[index]}`}`;
}
export function randomValue(array: any[]) {
    return array[Math.floor(Math.random() * array.length)];
}
export function romanize(num: number) {
    if (isNaN(num))
        return NaN;
    let digits = String(+num).split(""),
        key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
            "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
            "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop()! + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}
const second = 1000;
const minute = 60000;
const hour = 3600000;
const day = 86400000;
const year = 31536000000;
const decade = 315360000000;
const century = 3153600000000;
const millennium = 31536000000000;
export function formatMS(ms: number, formal = false) {
    ms = Number(ms);
    // content.warn(ms);
    if (ms < second) return `${formatNumber(ms)} millisecond${(ms === 1) ? '' : 's'}`;
    if (ms < minute) {
        const seconds = ms / second;
        return `${(!formal) ? Math.floor(seconds) : formatNumber(seconds)} second${(Math.floor(seconds) === 1) ? '' : 's'}`;
    }
    if (ms < hour) {
        const minutes = ms / minute;
        console.log(minutes);
        return `${(!formal) ? Math.floor(minutes) : `${formatNumber(minutes)}${(formatDecimal(minutes))}`} minute${(Math.floor(minutes) === 1) ? '' : 's'}`;
    }
    if (ms < day) {
        const hours = ms / hour;
        return `${(!formal) ? Math.floor(hours) : `${formatNumber(hours)}${(formatDecimal(hours))}`} hour${(Math.floor(hours) === 1) ? '' : 's'}`;
    }
    if (ms < year) {
        const days = ms / day;
        return `${(!formal) ? Math.floor(days) : `${formatNumber(days)}${(formatDecimal(days))}`} day${(Math.floor(days) === 1) ? '' : 's'}`;
    }
    if (ms < decade) {
        const years = ms / year;
        return `${(!formal) ? Math.floor(years) : `${formatNumber(years)}${(formatDecimal(years))}`} years${(Math.floor(years) === 1) ? '' : 's'}`;
    }
    if (ms < century) {
        const decades = ms / decade;
        return `${(!formal) ? Math.floor(decades) : `${formatNumber(decades)}${(formatDecimal(decades))}`} decade${(Math.floor(decades) === 1) ? '' : 's'}`;
    }
    if (ms < millennium) {
        const centuries = ms / century;
        return `${(!formal) ? Math.floor(centuries) : `${formatNumber(centuries)}${(formatDecimal(centuries))}`} centur${(Math.floor(centuries) === 1) ? 'y' : 'ies'}`;
    }
    const millenniums = ms / millennium;
    return `${(!formal) ? Math.floor(millenniums) : `${formatNumber(millenniums)}${(formatDecimal(millenniums))}`} millennium${(Math.floor(millenniums) === 1) ? '' : 's'}`;
}


