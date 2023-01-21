import { world, Items, BlockLocation, Player, Entity, XYRotation, } from '@minecraft/server';
import errorLogger from './classes/error.js';
export function isVector3(target) {
    // content.warn(typeof target === 'object', !(target instanceof Array), 'x' in target, 'y' in target, 'z' in target);
    return typeof target === 'object' && !(target instanceof Array) && 'x' in target && 'y' in target && 'z' in target;
}
export function isVector2(target) {
    // content.warn(typeof target === 'object', !(target instanceof Array), 'x' in target, 'y' in target, 'z' in target);
    return typeof target === 'object' && !(target instanceof Array) && 'x' in target && 'y' in target;
}
export function isDefined(input) {
    return (input !== null && input !== undefined && !Number.isNaN(input));
}
export function permutationClone(permutation) {
    const permutationProperties = [];
    /**
     * @type {BlockPermutation}
     */
    const blockPermutation = permutation;
    blockPermutation.getAllProperties().forEach(({ name, validValues, value }) => {
        permutationProperties.push({ name, validValues, value });
    });
    return permutationProperties;
}
/**
 * @function weightsRandom returns the index of the weight that was selected
 * @param  {...Number} weights 
 * @returns {number}
 * @example weightsRandom(1,4,5,7) //returns 0, 1, 2, or 3
 */
export function weightsRandom(...weights) {
    const sum = weights.reduce((s, c) => s + c);
    let valueSUm = 0;
    const sortedWeights = [...weights].sort((a, b) => b - a);
    const sortedTestWeights = sortedWeights.slice(0, -1).map(value => { valueSUm += value; return valueSUm; });
    const random = (Math.random() * sum) | 0;
    const test = [...sortedTestWeights, random].sort((a, b) => a - b);
    return weights.indexOf(sortedWeights[test.indexOf(random)]);
}
export class RemovableTree {
    constructor(array = []) {
        this.array = array;
    }
    next(key) {
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
        // console.log(i, guess, lastCondition);
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
// function randomCoordsOutsideCircle(minRadius, maxRadius) {
//     const angle = random() * PI * 2;
//     const radius = minRadius + (maxRadius - minRadius);
//     const randR = () => radius * sqrt(random());;
//     const x = Math.cos(angle) * randR();
//     const z = Math.sin(angle) * randR();
//     const r = hypot(x, z);
//     return { x, z, r, edge: { x: Math.cos(angle) * radius, z: Math.sin(angle) * radius } };
// }
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
const { floor } = Math;
/**
 * @function sort3DVectors
 * @param {{x: number, y: number, z: number}} vector1 
 * @param {{x: number, y: number, z: number}} vector2 
 * @returns {[{x: number, y: number, z: number}, {x: number, y: number, z: number}]}
 */
export function sort3DVectors(vector1, vector2) {
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
export function betweenVector3(target, vector1, vector2) {
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
export function betweenBlockVector3(target, vector1, vector2) {
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
export function andArray(array = []) {
    const copy = [...array];
    switch (array.length) {
        case 0:
            return '';
        case 1:
            return array[0].toString();
        case 2:
            copy.splice(array.length - 1, null, 'and');
            return copy.join(' ');
        default:
            copy.splice(array.length - 1, 1, 'and');
            return `${copy.join(', ')} ${array[array.length - 1]}`;
    }
}
export function orArray(array = []) {
    const copy = [...array];
    switch (array.length) {
        case 0:
            return '';
        case 1:
            return array[0].toString();
        case 2:
            copy.splice(array.length - 1, null, 'or');
            return copy.join(' ');
        default:
            copy.splice(array.length - 1, 1, 'or');
            return `${copy.join(', ')} ${array[array.length - 1]}`;
    }
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

// // console.log(assignToPath(['help', 0], array1, 2), true);



export function pathIsObject(pathArray, object, allowArrays) {
    if (!allowArrays) {
        // console.log(`return typeof object?.${pathArray.join('?.')} === 'object' && !Array.isArray(object?.${pathArray.join('?.')})`);
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
            // console.log(path);
            switch (native.typeOf(input1)) {
                case "object": {
                    const prototype = Object.getPrototypeOf({});
                    for (const key in input1) {
                        if (prototype.hasOwnProperty(key)) { return; }
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
            overworld.runCommandAsync(`tellraw @a[scores={Notifications=1}${(exludePlayer) ? `,name=!${exludePlayer.name}` : ''}] {"rawtext":[{"text":"${message.replaceAll('"', '\\"')}"}]}`);
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
            world.say(message);
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
    objectiveAdd(objective, displayName = objective) {
        try {
            world.scoreboard.addObjective(objective, displayName);
            return true;
        } catch (error) {
            console.warn(error, error.stack);
            return;
        }
    },
    objectiveRemove(objective) {
        try {
            world.scoreboard.removeObjective(objective);
            return true;
        } catch (error) {
            console.warn(error, error.stack);
            return;
        }
    },
    scoreAdd(objective, name, amount = 0) {
        try {
            overworld.runCommandAsync(`scoreboard players add ${name} ${objective} ${amount}`);
        } catch (error) {
            // console.warn(error, error.stack);
            return;
        }
    },
    scoreSet(objective, name, amount = 0) {
        try {
            overworld.runCommandAsync(`scoreboard players set ${name} ${objective} ${amount}`);
        } catch (error) {
            console.warn(error, error.stack);
            return;
        }
    },
};

export const content = {
    warn(...messages) {
        console.warn(messages.map(message => JSON.stringify(message, (key, value) => (value instanceof Function) ? '<f>' : value)).join(' '));
    },
    chatFormat(...messages) {
        world.say(messages.map(message => JSON.stringify(message, (key, value) => (value instanceof Function) ? '<f>' : value, 4)).join(' '));
    }
};

/**
 * 
 * @param {{x: number, y: number, z: number}} vector 
 * @returns {XYRotation}
 */
export function vector3ToRotation(vector) {
    return { x: Math.asin(-vector.y) * 180 / Math.PI, y: -Math.atan2(vector.x, vector.z) * 180 / Math.PI };
}
/**
 * @param {XYRotation} rotation 
 * @returns {{x: number, y: number, z: number}}
 */
export function rotationToVector3(rotation) {
    const { x: rx, y: ry } = rotation;
    let cosRX = Math.cos(rx);
    return { x: -Math.sin(rx) * cosRX, y: -Math.sin(ry), z: Math.cos(rx) * cosRX };
}







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

export function createArrayBetween(min, max) {
    const array = new Array(max - min + 1);
    for (let i = 0; min <= max; i++) {
        array[i] = min++;
    }
    return array;
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

export function chunkStringRegex(str, length) {
    return str.match(new RegExp(".{1," + length + "}", "g"));
}
export function chunkString(str, length) {
    let size = (str.length / length) | 0;
    const array = Array(++size);
    for (let i = 0, offset = 0; i < size; i++, offset += length) {
        array[i] = str.substr(offset, length);
    }
    return array;
}
export function generateRandomString(length) {
    return Array.from(Array(length), () => String.fromCharCode((Math.random() * 86 | 0) + 33)).join('');
};
/**
 * @function parseCommand
 * @param {String} message 
 * @param {String} prefix 
 * @returns {String[]}
 * @example parseCommand('!give @"bat is bob" iron_sword {"data":6, "enchantments": {"sharpness":3}}', '!'); //returns ['give','bat is bob','iron_sword','{"data":6,"enchantments":{"sharpness":3}}']
 */
export function parseCommand(message, prefix) {
    const messageLength = message.length;
    let finding = false;
    let braceCount = [0, 0], bracketCount = [0, 0], quoteCount = 0, spaceCount = 0;
    let started = false;
    let o = 0;
    const output = [];
    for (let i = prefix.length; i < messageLength; i++) {
        const char = message[i];
        switch (char) {
            case '{':
                switch (finding) {
                    case 'json':
                        break;
                    default:
                        braceCount = [0, 0], bracketCount = [0, 0], quoteCount = 0, spaceCount = 0, finding = false;
                        output.push('');
                        o++;
                        finding = 'json';
                        break;

                }
                output[o] += char;
                braceCount[0]++;
                break;
            case '}':
                output[o] += char;
                if (braceCount[0] !== ++braceCount[1] || bracketCount[0] !== bracketCount[1] || (quoteCount && quoteCount & 1)) break;
                braceCount = [0, 0], bracketCount = [0, 0], quoteCount = 0, spaceCount = 0, finding = false;
                break;
            case ']':
                output[o] += char;
                if (bracketCount[0] !== ++bracketCount[1] || braceCount[0] !== braceCount[1] || (quoteCount && quoteCount & 1)) break;
                braceCount = [0, 0], bracketCount = [0, 0], quoteCount = 0, spaceCount = 0, finding = false;
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
                        if (!output[o].length) break;
                        output.push('');
                        o++;
                        break;
                }
                break;
            case '[':
                switch (finding) {
                    case 'json':
                        break;
                    default:
                        output.push('');
                        o++;
                        finding = 'json';
                        break;

                }
                output[o] += char;
                bracketCount[0]++;
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
export function metricNumbers(value, place = 2) {
    return (value / 10 ** (~~(log10(value) / 3) * 3)).toFixed(place) + types[~~(log10(value) / 3)];
}
