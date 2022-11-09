import { world, Items, BlockLocation, Player, Entity } from '@minecraft/server';
import errorLogger from './classes/error.js';
import { hasKey } from './prototypes/object.js';
export function typeOf(value) {
    if (typeof value === 'function') {
        try {
            return (new value()).constructor?.name;
        } catch {
            return 'Function';
        }
    }
    return value?.constructor?.name;
}

export function hypot3(n1, n2, n3) {
    return Math.sqrt(n1 ** 2 + n2 ** 2 + n3 ** 2);
}
export function hypot2(n1, n2) {
    return Math.sqrt(n1 ** 2 + n2 ** 2);
}

export function guessTheNumber(condition, maxAmount) {
    const dividend = maxAmount / 2;
    let currentNumber = dividend;
    let lastCondition;
    let iterations = Math.ceil(Math.log2(maxAmount) + maxAmount / 22000);
    for (let i = 0; i < iterations; i++) {
        const divsor = 2 ** i;
        const guess = (lastCondition === undefined) ? currentNumber : (lastCondition) ? currentNumber - dividend / divsor : currentNumber + dividend / divsor;
        lastCondition = Boolean(condition(guess));
        console.log(i, guess, lastCondition);
        currentNumber = guess;
    }
    return currentNumber;
}
export async function testXpLevel(player, testLevel) {
    const bool = false;
    try { await player.runCommandAsync(`tesfor @s[lm=${testLevel}]`); bool = true; } catch { }
    return bool;
}

export const xp = guessTheNumber(async (guess) => {
    return await testXpLevel(player, Math.round(guess));
}, 24000);
/**
 * @function parseList spreads all arrays in an array into one single array
 * @param {Array} list 
 * @returns Array
 */
export function parseList(list) {
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
export function randomCoordsOutsideCircle(minRadius, maxRadius) {
    const angle = random() * PI * 2;
    const randR = () => minRadius + (maxRadius - minRadius) * sqrt(random());
    const x = Math.cos(angle) * randR();
    const z = Math.sin(angle) * randR();
    const r = hypot(x, z,);
    return { x, z, r };
}
export function sortRange(array) {
    const x1 = (array[0][0] < array[1][0]) ? array[0][0] : array[1][0];
    const z1 = (array[0][1] < array[1][1]) ? array[0][1] : array[1][1];
    const x2 = (array[0][0] < array[1][0]) ? array[1][0] : array[0][0];
    const z2 = (array[0][1] < array[1][1]) ? array[1][1] : array[0][1];
    return [[x1, z1], [x2, z2]];
}
export function sort3DRange(array) {
    const x1 = (array[0][0] < array[1][0]) ? array[0][0] : array[1][0];
    const y1 = (array[0][1] < array[1][1]) ? array[0][1] : array[1][1];
    const z1 = (array[0][2] < array[1][2]) ? array[0][2] : array[1][2];
    const x2 = (array[0][0] < array[1][0]) ? array[1][0] : array[0][0];
    const y2 = (array[0][1] < array[1][1]) ? array[1][1] : array[0][1];
    const z2 = (array[0][2] < array[1][2]) ? array[1][2] : array[0][2];
    return [[x1, y1, z1], [x2, y2, z2]];
}
export function andArray(array = []) {
    let ReturnArray = [...array];
    if (ReturnArray.length > 1) ReturnArray.splice(ReturnArray.length - 1, 0, 'and');
    if (ReturnArray.length > 3) { return ReturnArray.join(', ').replace(/(?<=and),/, ''); }
    else if (ReturnArray.length === 2) { return ReturnArray.join(', ').replace(/,(?=\sand)|(?<=and),/g, ''); }
    return ReturnArray;
}
const blockFaceToNumber = {
    "down": 0,
    "east": 5,
    "north": 2,
    "south": 3,
    "up": 1,
    "west": 4,
};


export function blockFaceToCoords(blockFace, { x, y, z }) {
    blockFace = blockFaceToNumber[blockFace];
    content.warn({ blockFace });

    let location = [x, y, z];
    [
        [0, -1, 0],
        [0, 1, 0],
        [0, 0, -1],
        [0, 0, 1],
        [-1, 0, 0],
        [1, 0, 0]
    ][blockFace].forEach((coord, i) => location[i] += coord);
    [x, y, z] = location;
    return new BlockLocation(x, y, z);
    //return new Location(x,y,z);
}
Math.randomBetween = function (n1, n2) {
    return n1 + Math.random() * Math.abs(n2 - n1);
};



// const array1 = {
// 	help: []
// };

// console.log(assignToPath(['help', 0], array1, 2), true);



export function pathIsObject(pathArray, object, allowArrays) {
    if (!allowArrays) {
        console.log(`return typeof object?.${pathArray.join('?.')} === 'object' && !Array.isArray(object?.${pathArray.join('?.')})`);
        return new Function('object', `return typeof object?.${pathArray.join('?.')} === 'object' && !Array.isArray(object?.${pathArray.join('?.')})`)(object);
    } else {
        return new Function('object', `return typeof object?.${pathArray.join('?.')} === 'object'`)(object);
    }
}
export function pathIsSettable(pathArray, object, allowArrays) {
    const call = pathArray.slice(0, -1).every((key, i) => pathIsObject(pathArray.slice(0, -(i + 1)), object, allowArrays));
    if (pathArray.slice(0, -1).length) {
        return call;
    } else {
        return true;
    }
}
export function assignToPath(pathArray, object, value, allowArrays = false) {
    const mappedPathArray = pathArray.map(value => `[${(typeof value === 'number') ? value : `'${value}'`}]`);
    //   	console.log(mappedPathArray)
    //   console.log(pathIsSettable(mappedPathArray, object))
    if (pathIsSettable(mappedPathArray, object, allowArrays)) {
        console.log({ pathIsSettable: `object${mappedPathArray.join('')} = value; return object` });
        return new Function('object', 'value', `object${mappedPathArray.join('')} = value; return object`)(object, value);
    } else {
        let stop = false;
        pathArray.forEach((path, i) => {
            const newPathArray = mappedPathArray.slice(0, i + 1);
            // console.log(newPathArray);
            if (!stop && !pathIsObject(newPathArray, object, allowArrays)) {
                // console.log(`object${newPathArray.join('')} = {}; return object`);
                object = new Function('object', `object${newPathArray.join('')} = {}; return object`)(object);
            } else if (!stop && pathIsSettable(newPathArray, object, allowArrays)) {
                return;
            } else {
                stop = true;
            }
            // console.log('obj', object);
        });
        if (!stop) {
            return assignToPath(pathArray, object, value, allowArrays);
        }

    }
}
const native = {
    typeOf(input) {
        switch (typeof input) {
            case 'object': {
                return (Array.isArray(input)) ? 'array' : 'object';
            }
            default: {
                return typeof input;
            }
        }
    },
    toConstructed(type) {
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
    toObject(input) {
        let output = this.toConstructed(this.typeOf(input));
        if (!output) { return input; }
        call(input, []);
        function call(input1, path) {
            console.log(path);
            switch (native.typeOf(input1)) {
                case "object": {
                    for (const key in input1) {
                        if (hasKey(key)) { return; }
                        call(input1[key], [...path, key]);
                    }
                    break;
                } case "array": {
                    output = assignToPath(path, output, [], true);
                    input1.forEach((item, i) => {
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
    stringify(input, replacer, spacing) {
        return JSON.stringify(this.toObject(input), replacer, spacing);
    }
};
export { native };

export function toProperCase(string) {
    return string.replace(/_/g, ' ').replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}
export const staff = {
    tellraw(message, exludePlayer) {
        try {
            overworld.runCommand(`tellraw @a[scores={Notifications=1}${(exludePlayer) ? `,name=!${exludePlayer.name}` : ''}] {"rawtext":[{"text":"${message.replaceAll('"', '\\"')}"}]}`);
            return true;
        } catch (error) {
            content.warn(error);
            return undefined;
        }
    }
};
export const server = {
    tellraw(message) {
        try {
            overworld.runCommand(`tellraw @a {"rawtext":[{"text":"${message.replaceAll('"', '\\"')}"}]}`);
            return true;
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
    scoreTest(objective, target, findParticipant = false) {
        if (findParticipant && (target instanceof Player || target instanceof Entity)) target = target?.name;
        if (!target) throw new Error('target must be defined');
        let scoreboardObjective;
        let score;
        let scoreboardIdentity;
        try { scoreboardObjective = world.scoreboard.getObjective(objective); } catch (error) { console.warn(error, error.stack); }
        if ((target instanceof Player || target instanceof Entity) && !findParticipant) {

            scoreboardIdentity = target.scoreboard;
            if (!target['scoreboard']) return;
            // content.warn({ score });
        } else {

            try { scoreboardIdentity = scoreboardObjective.getParticipants().find(({ displayName } === target)); } catch { }
        }
        if (scoreboardObjective) {
            try {
                score = scoreboardObjective.getScore(scoreboardIdentity);
            } catch {
                // console.warn(error, error.stack);
            }
        }
        return score;
    },
    objectiveAdd(objective, display = '') {
        try {
            overworld.runCommand(`scoreboard objectives add ${objective} dummy ${display}`);
            return true;
        } catch (error) {
            console.warn(error, error.stack);
            return;
        }
    },
    objectiveRemove(objective) {
        try {
            overworld.runCommand(`scoreboard objectives remove ${objective}`);
            return true;
        } catch (error) {
            console.warn(error, error.stack);
            return;
        }
    },
    scoreAdd(objective, name, amount = 0) {
        try {
            return Number(overworld.runCommand(`scoreboard players add ${name} ${objective} ${amount}`).statusMessage.match(/-?\d+(?=[^-\d]$)/));
        } catch (error) {
            // console.warn(error, error.stack);
            return;
        }
    },
    scoreSet(objective, name, amount = 0) {
        try {
            return Number(overworld.runCommand(`scoreboard players set ${name} ${objective} ${amount}`).statusMessage.match(/-?\d+(?=$)/));
        } catch (error) {
            console.warn(error, error.stack);
            return;
        }
    },
};

export const content = {
    warn(...messages) {
        console.warn(messages.map(message => JSON.stringify(message)).join(' '));
    }
};






// const prototypes = {
//     toBinary() {
//         return this.replace(/[\s\S]/g, (str) => str.charCodeAt().toString(2));
//     },
//     toText() {
//         return this.replace(/\d{5}]/g, (match) => console.log(Number(match).toString()));
//     },
// };

// Object.assign(String.prototype, prototypes);






/**
 * @param {Array<String>} commandArray Commands.
 * @param {String} dimension The dimension command should be run in. If left blank it will run in the: Overworld.
 * @returns {Array<String>} Returns the following array for each object in the array.
 */

export function combine(target, source) {
    target.forEach((key, value) => {
        if (source[key] && typeof target[key] === 'object' && typeof source[key] === 'object') {
            source[key] = { ...target[key], ...source[key] };
        }
    });
    return { ...target, ...source };
}


export function ItemsGet(id, log = false) {
    const item = Items.get(id);
    if (!item) {
        let stack;
        try {
            help;
        } catch (error) {
            stack = error.stack;
        }
        if (log) {
            errorLogger.log({ message: `Item: ${id}, does not exist!` }, stack, { key: 'chests', event: 'tick' });
        }
        return Items.get('air');
    } else {
        return item;
    }
}

export const colors = ['4', 'c', '6', 'g', 'e', 'a', '2', '3', '9', '1', 'd', '5'];
export function rainbowWeight(value, reversed) {
    const colorsA = (reversed) ? colors.reverseCopy() : colors;
    // content.warn({color: ~~(((value > 1) ? 1 : value) * (colors2.length - 1)), colors})
    return colorsA[~~(((value > 1) ? 1 : value) * (colorsA.length - 1))];
}
export function rainbow() {
    return colors.random();
}
export function getNames() {
    const names = [...world.getPlayers()].forEach(name => {
        return name;
    });
    return names;
}

function createArrayBetween(min, max) {
    return Array.from(Array(max - min + 1), () => min++);
}
const charArray = [...createArrayBetween(33, 126), ...createArrayBetween(161, 321)].map(value => String.fromCharCode(value));
const charObject = {};
charArray.forEach((char, i) => charObject[char] = i);
const valueUndefined = charArray[0];

export function obfuscate255(string) {
    return [...string].map(value => charArray[value.charCodeAt()] ?? valueUndefined).join('');
}

export function deobfuscate255(string) {
    return [...string].map(value => String.fromCharCode(charObject[value])).join('');
}


export const overworld = world.getDimension('overworld'), nether = world.getDimension('nether'), end = world.getDimension('the end');



