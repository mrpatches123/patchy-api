import {
    world,
    World,
    Items,
    ItemStack,
    Player,
    Dimension,
    Entity,
    InventoryComponentContainer,
    BlockLocation,
    Location,
    Block,
    EnchantmentList,
    MinecraftEnchantmentTypes,
    EnchantmentType,
    PlayerInventoryComponentContainer,
    BlockInventoryComponentContainer,
    EntityQueryOptions
} from 'mojang-minecraft';
import errorLogger from './classes/error.js';
const locationTypes = {
    Location,
    BlockLocation
};
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
export function pathIsObject(pathArray, object) {
    return new Function('object', `return typeof object.${pathArray.join('?.')} === 'object' && !Array.isArray(object)`)(object);
}
export function pathIsUndefined(pathArray, object) {
    return new Function('object', `return object.${pathArray.join('?.')} === undefined`)(object);
}
export function pathIsSettable(pathArray, object) {
    const call = pathArray.slice(0, -1).every((key, i) => pathIsObject(pathArray.slice(0, -(i + 1)), object));
    if (pathArray.slice(0, -1).length) {
        return call;
    } else {
        return true;
    }
}
export function assignToPath(pathArray, object, value) {
    if (pathIsSettable(pathArray, object)) {
        return new Function('object', 'value', `object.${pathArray.join('.')} = value; return object`)(object, value);
    } else {
        let stop = false;
        pathArray.forEach((path, i) => {
            const newPathArray = pathArray.slice(0, i + 1);
            // console.log(newPathArray);

            if (!stop && pathIsUndefined(newPathArray, object)) {
                object = new Function('object', 'value', `object.${newPathArray.join('.')} = {}; return object`)(object, value);
            } else if (!stop && pathIsSettable(newPathArray, object)) {
                return;
            } else {
                stop = true;
            }
        });
        if (!stop) {
            return assignToPath(pathArray, object, value);
        }

    }
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
export function blockFaceToCoords(blockFace, { x, y, z }) {
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
export const native = {

    toObject(objectFrom, value = '<Function>', ignoreFunctions = true, ignoreObjectFunctions = true) {
        let clone;
        if (typeof objectFrom === 'object') {
            if (Array.isArray(objectFrom)) {
                clone = [];
            } else {
                clone = {};
            }
        } else {
            return objectFrom;
        }
        inF(objectFrom, value, 'objectFrom');

        function inF(ThisObject, Setvalue, logPath) {
            console.log(logPath);
            if (typeof ThisObject === 'object' && !Array.isArray(ThisObject)) {
                clone = new Function('object', 'value', `{ object${logPath.replaceAll('objectFrom', '')} = value; return object}`)(clone, {});
                for (const key in ThisObject) {
                    inF(ThisObject[key], Setvalue, logPath + "['" + key + "']");
                }

            } else if (typeof ThisObject === 'object' && Array.isArray(ThisObject)) {
                clone = new Function('object', 'value', `{ object${logPath.replaceAll('objectFrom', '')} = value; return object}`)(clone, []);
                ThisObject.forEach((value, i) => {
                    inF(value, Setvalue, logPath + "[" + i + "]");
                });
            } else {
                let valueMain;
                if (typeof ThisObject === 'function') {
                    if (ignoreFunctions) {
                        return;
                    } //else if (ignoreObjectFunctions && hasKey(key)) {
                    //return;
                    //} else {
                    //  valueMain = value;
                    //}
                } else {
                    valueMain = ThisObject;
                }

                clone = new Function('object', 'value', `{ object${logPath.replaceAll('objectFrom', '')} = value; return object}`)(clone, valueMain);
            }

        }
        return clone;
    },
    stringify(objectFrom, value, ignoreFunctions, ignoreObjectFunctions) {
        return JSON.stringify(this.toObject(objectFrom, value, ignoreFunctions, ignoreObjectFunctions));
    },
    stringifyEx(startObject, printF = false, space = undefined) {
        let unsafeProperty = 'unsafeproperty.fixed';
        function getString(ThisObject, before, isSpace) {
            switch (typeof ThisObject) {
                case 'function':
                    return (`function ${ThisObject.name ?? ''}(${ThisObject.length} args)`);
                case 'object':
                    if (ThisObject == null) {
                        return 'null';
                    }
                    if (!Object.entries(ThisObject).length) {
                        return '{}';
                    }
                    if (!ThisObject[unsafeProperty]) {
                        try {
                            let isArray = Array.isArray(ThisObject);
                            let ReturnString = isArray ? '[' : '{';
                            let First = false;
                            let nextS = before + '' + (space ?? '');
                            ThisObject[unsafeProperty] = true;
                            for (const key in ThisObject) {
                                if (key == unsafeProperty) { continue; }
                                if (typeof ThisObject[key] === 'function' & (!printF)) { continue; };
                                try {
                                    ReturnString += (First ? ',' : '') + '' + (isSpace ? '\n' : '') + nextS + (isArray ? '' : `"${key}":${(isSpace ? ' ' : '')}`) + getString(ThisObject[key], nextS, isSpace);
                                } catch (error) {

                                }
                                First = true;
                            }
                        } catch (error) {
                            ThisObject[unsafeProperty] = undefined;
                            console.warn(error, error.stack);
                        }
                        delete ThisObject[unsafeProperty];
                        return ReturnString + '' + ((space ?? false) ? "\n" + before : '') + (isArray ? ']' : '}');
                    } else {
                        return '{...}';
                    }
                default:
                    return JSON.stringify(ThisObject);
            }
        }
        return getString(startObject, '', (space ?? '' != ''));
    }
};
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
    scoreTest(objective, name) {
        try {
            return Number(overworld.runCommand(`scoreboard players test ${name} ${objective} *`).statusMessage.match(/-?\d+/));
        } catch (error) {
            console.warn(error, error.stack);
            return;
        }
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
    warn(message) {
        if (typeof message === 'object') {
            content.warn(JSON.stringify(message));
            // console.warn(native.stringifyEx(message));
        } else {
            console.warn(message);
            // server.tellraw(message);
        }

    }
};



const betaDimensionFunctions = {
    /**
     * @method runCommands
     * @param  {...String || Array<String>} commands
     * @returns {Array<CommandRepsone>}
     */
    runCommands(...commands) {
        commands = (typeof commands[0] === 'array') ? arguments[0] : [...commands];
        let returnArray = [];
        for (const command of commands) {
            returnArray.push(this.runCommand(command));
        } return returnArray;

    },
};
Object.assign(Dimension.prototype, betaDimensionFunctions);

const worldFunctions = {
    /**
     * @method getEntities
     * @param {EntityQueryOptions} EntityQueryOptions 
     * @returns {Array<Entity>}
     */
    getEntities(EntityQueryOptions) {
        return [...overworld.getEntities(EntityQueryOptions), ...nether.getEntities(EntityQueryOptions), , ...end.getEntities(EntityQueryOptions)];
    }
};
Object.assign(World.prototype, worldFunctions);
// const prototypes = {
//     toBinary() {
//         return this.replace(/[\s\S]/g, (str) => str.charCodeAt().toString(2));
//     },
//     toText() {
//         return this.replace(/\d{5}]/g, (match) => console.log(Number(match).toString()));
//     },
// };

// Object.assign(String.prototype, prototypes);


const arrayObjectFunctions = {
    /**
     * @method keys does Object.keys() on any Object
     * @param {Boolean} ignoreFunctions 
     * @returns {Array<String>}
     */
    keys(ignoreFunctions) {
        let keysArray = [];
        for (let key in this) {
            if (hasKey(key)) { continue; }
            if (ignoreFunctions && typeof this[key] === 'function') { continue; }
            keysArray.push(key);
        }
        return keysArray;
    },
    /**
     * @method clear deletes all values of const, let, var Object
     * @param {Function} callback 
     * @returns
     */
    clear(callback) {
        // if (this.length) {
        for (const key in this) {
            if (typeof this[key] === 'function') { continue; }
            if (typeof callback === "function") {
                if (callback()) {
                    delete this[key];
                }
            } else {
                delete this[key];
            }
        }
    },
    /**
     * @method forEach interates over the object and can accumulate the return of each call into an object or Array depending on the initialValue
     * @param {Function} callback(key, value, index, initialValue)
     * @param {any} initialValue undefined, Object or Array if you want to
     * @param {Boolean} 
     * @param {Boolean} ignore ignores if current call is false
     * @returns Any or Undefine
     */
    forEach(callback, initialValue, ignorefunctions = false, ignore = false) {
        if (typeof callback == "function") {
            if (this.keys().length) {
                let i = 0;
                for (const key in this) {
                    // console.warn(key, hasKey(key));
                    if (hasKey(key) || (typeof this[key] === 'function' && ignorefunctions)) { continue; }
                    const call = callback(key, this[key], i++, initialValue);
                    if (initialValue && ((call === undefined || call === false || call === null) || !ignore) && typeof initialValue == 'object' && !isArray(initialValue)) {
                        assign(initialValue, call);
                    } else if (initialValue && (call || ignore) && typeof initialValue == 'object' && isArray(initialValue)) {
                        initialValue.push(call);
                    }
                }
                if (initialValue) { return initialValue; }
            }

        }
    },
    /**
     * @method every iterates over the object and if every call is true, it returns true
     * @param {Function} callback 
     * @param {Boolean} ignorefunctions ignores if value is a function
     * @returns Boolean
     */
    every(callback, ignorefunctions) {
        if (typeof callback == "function") {
            if (this.keys().length) {
                const calls = [];
                let i = 0;
                for (const key in this) {

                    if (hasKey(key) || (typeof this[key] === 'function' && ignorefunctions)) { continue; }
                    calls.push(callback(key, this[key], i++));
                }
                return calls.every(call => call);

            }
        }
    },
    /**
     * @method some iterates over the object and if one call is true, it returns true
     * @param {Function} callback 
     * @param {Boolean} ignorefunctions ignores if value is a function
     * @returns Boolean
     */
    some(callback, ignorefunctions) {
        if (typeof callback == "function") {
            if (this.keys().length) {
                const calls = [];
                let i = 0;
                for (const key in this) {
                    if (hasKey(key) || (typeof this[key] === 'function' && ignorefunctions)) { continue; }
                    calls.push(callback(key, this[key], i++));
                }
                return calls.some(call => call);

            }

        }
    },
    /**
     * @method map maps the return of each iteration to that calls respeactive key
     * @param {Function} callback 
     * @returns Object
     */
    map(callback) {
        if (typeof callback == "function") {
            if (entries(this).length) {
                let object = {};
                entries(this).forEach(([key, value], i) => {
                    object[key] = callback(key, value, i);
                });
                return object;
            }
        }
    },
    /**
     * @method filter Iterates over the Object and if a iteration returns false that key is not included in the final object
     * @param {Function} callback 
     * @returns Object
     */
    filter(callback) {
        if (typeof callback == "function") {
            if (entries(this).length) {
                let object = {};
                entries(this).forEach(([key, value], i) => {
                    if (callback(key, value, i)) { object[key] = this[key]; };
                });
                return object;
            } else {
                return this;
            }
        }
    },
    /**
     * @method join Joins the values of the object into one string
     * @param {String} string the value that is inserted between each value
     * @returns String
     */
    join(string = '') {
        if (entries(this).length) {
            let joinedObject = [];
            entries(this).forEach(([key, value], i) => {
                joinedObject.push(this[key]);
            });
            return joinedObject.join(string);
        }
    },
    /**
     * @method length Gets the length of the Object or te number of keys
     * @param {Boolean} ignorefunctions ignores if value is a function 
     * @returns Number
     */
    length(ignoreFunctions) {
        return this.keys(ignoreFunctions).length;
    },
    /**
     * @method equals Tests if main object is equal the Object Provided
     * @param {any} object Object or any to check if equal
     * @returns Boolean
     */
    equals(object) {
        //console.log(keys(this).equals(keys(object)))
        if (typeof object === "object" && !isArray(object)) {
            if (this.length() && this.length() === object.length()) {
                return this.every((thiskKey, ThisValue) =>
                    object.some((key, value) => (key === thiskKey && value === ThisValue) || ((typeof ThisValue === 'object' && typeof value === 'object') ? value.equals(ThisValue) : false))
                );

            } else {
                return false;
            }

        } else {
            return false;
        }

    },
    /**
     * @method find returns an key value pair that if one has a true iteration 
     * @param {Function} callback(key, value, index)
     * @param {Boolean} ignorefunctions ignores if value is a function
     * @returns Object
     */
    find(callback, ignorefunctions = false) {
        if (typeof callback == "function") {
            if (this.keys().length) {
                let i = 0;
                for (const key in this) {
                    if (hasKey(key) || (typeof this[key] === 'function' && ignorefunctions)) { continue; }
                    const call = callback(key, this[key], i++);
                    content.warn({ call, i });
                    if (!(call === undefined || call === false || call === null)) {
                        return { [key]: this[key] };
                    }
                }
            }

        }
    }

};
/**
     * @method hasKey Checks if a key is in arrayObjectFunctions or stringFunctions
     * @param {String} key
     * @returns Boolean
     */
function hasKey(key) {
    if (arrayObjectFunctions.hasOwnProperty(key) || stringFunctions.hasOwnProperty(key)) {
        return true;
    }
}

Object.assign(Object.prototype, arrayObjectFunctions);

const stringFunctions = {
    toHHMMSS() {
        return new Date(Number(this) * 1000).toTimeString().split(' ')[0];
    },
    toNumber() {
        return Number(this);
    },
    round(place = 0) {
        return Math.round(Number(this) * 10 ** place) / 10 ** place;
    },
    floor(place = 0) {
        return Math.floor(Number(this) * 10 ** place) / 10 ** place;
    },
    ceil(place = 0) {
        return Math.ceil(Number(this) * 10 ** place) / 10 ** place;
    },
    trunc() {
        return Math.trunc(Number(this));
    },
    dec() {
        return Number(this) % 1;
    },
    abs() {
        return Math.abs(Number(this));
    },
    getSign() {
        const sign = Number(this) / Number(this).abs();
        return (!sign) ? 0 : sign;
    },
    toTimeTill(date = new Date(this), time = Number(this), test = false) {
        return [~~(time / 8.64e7), ~~(time / 8.64e7 % 1 * 24), ~~(date.getMinutes()), ~~(date.getSeconds())]
            .filter(value => {
                if (value && !test) {
                    test = true;
                    return true;
                } else if (test) {
                    return test;
                }
            });
    },
    isInteger() {
        return isInteger(Number(this));
    }
};
const types = ['', 'k', 'M', 'G', 'T'];
const numberFunctions = {
    unitFormat(place = 1) {
        return (this / 10 ** (~~(log10(this) / 3) * 3)).toFixed(place) + types[~~(log10(this) / 3)];
    }
};
Object.assign(Number.prototype, stringFunctions);
Object.assign(Number.prototype, numberFunctions);
Object.assign(String.prototype, stringFunctions);
Object.assign(Array.prototype, stringFunctions);

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
const arrayFunctions = {
    delete(index) {
        return this.filter((item, i) => i !== index);
    },
    random() {
        return this[~~(Math.random() * this.length)];
    },
    equals(array) {
        return this.every((value, i) => value === array[i]);
    },
    reverseCopy() {
        let array = [];
        for (let i = this.length - 1, a = 0; i >= 0 && a < this.length; i--, a++) {
            array[a] = this[i];
        }
        return array;
    },
    accumulate(callback, initialValue, ignorefunctions = false, ignore = false) {
        if (typeof callback == "function") {
            if (this.length) {
                let i = 0;
                for (const value of this) {
                    if (typeof value === 'function' && ignorefunctions) { continue; }
                    const call = callback(value, i++, initialValue);
                    if (initialValue && (call || ignore) && typeof initialValue == 'object' && isArray(initialValue)) {
                        initialValue.push(call);
                    }
                }
                if (initialValue) { return initialValue; }
            }
        }
    },
    getRange() {
        if (this.every(item => item instanceof BlockLocation || item instanceof Location)) {

            const x = this.map(({ x }) => x).sort((a, b) => a - b);
            const y = this.map(({ y }) => y).sort((a, b) => a - b);
            const z = this.map(({ z }) => z).sort((a, b) => a - b);
            return [
                { x: x[0], y: y[0], z: z[0] },
                { x: x[x.length - 1], y: y[y.length - 1], z: z[z.length - 1] }
            ];
        } else {
            throw new Error('getRange(): not an array of BlockLocations or Locations');
        }
    },
    merge(index, array, postfix = false) {
        const arrayPre = this.filter((item, i) => (postfix) ? i <= index : i < index);
        const arrayPost = this.filter((item, i) => (postfix) ? i > index : i >= index);
        return [...arrayPre, ...array, ...arrayPost];
    },

};
Object.assign(Array.prototype, arrayFunctions);

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
const locationFunctions = {
    distanceBetween({ x: x1, y: y1, z: z1 }) {
        const { x, y, z } = this;
        return hypot(x1 - x, y1 - y, z1 - z);
    },
    horizontalDistanceBetween({ x: x1, z: z1 }) {
        const { x, z } = this;
        return hypot(x1 - x, z1 - z);
    },
    verticalDistanceBetween({ y: y1 }) {
        const { y } = this;
        return hypot(y1 - y);
    },
    queryTopSolid(dimension = overworld, ceiling = 319) {
        const { x, z } = this;
        const locations = new BlockLocation(x.floor(), ceiling, z.floor())
            .blocksBetween(new BlockLocation(x.floor(), -64, z.floor())).reverse();
        for (const location of locations) {
            // content.warn({ location: native.stringify(location), block: native.stringify(dimension.getBlock(location)) });
            if (!dimension.getBlock(location).isEmpty) {
                return location.y;
            }
        }
        // console.warn('jdjhwjwjwj');
    },
    toOverworld({ id } = {}) {
        const { x, y, z } = this;
        if (id === 'minecraft:nether') {
            return new locationTypes[this.constructor.name](x * 8, y * 8, z * 8);
        } else {
            return this;
        }
    },
    toBlockLocation() {
        const { x, y, z } = this;
        return new BlockLocation(x.floor(), y.floor(), z.floor());
    },
    toLocation() {
        const { x, y, z } = this;
        return new Location(x, y, z);
    }
};
Object.assign(Location.prototype, locationFunctions);
Object.assign(BlockLocation.prototype, locationFunctions);
const betaPlayerFunctions = {
    runCommands(commands) {
        ((isArray(arguments[0])) ? arguments[0] : [...arguments]).forEach(command => this.runCommand(command));
    },
    getName() {
        return this.name;
    },
    getNameTag() {
        if (/"|\\/.test(this.name)) {
            this.nameTag = this.nameTag.replace(/"|\\/g, '');
        } return this.nameTag;
    }, //not beta but fixes nameSpoof command tartgeting issues
    rot(isArray = true) {
        const { x, y } = this.rotation;
        if (isArray) {
            return [x, y];
        } else {
            return { x, y };
        }
    },
    scoreTest(objective, min, max) {
        if (isInteger(min) && isInteger(max)) {
            try {
                const score = Number(this.runCommand(`scoreboard players test @s ${objective} *`).statusMessage.match(/-?\d+/));
                if (score >= min && score <= max) {
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                return;
            }
        } else {
            try {
                return Number(this.runCommand(`scoreboard players test @s ${objective} *`).statusMessage.match(/-?\d+/));
            } catch (error) {
                return;
            }
        }
    },
    scoreAdd(objective, amount = 0) {
        try {
            return Number(this.runCommand(`scoreboard players add @s ${objective} ${amount}`).statusMessage.match(/-?\d+(?=[^-\d]$)/));
        } catch (error) {
            console.warn(error, error.stack);
            return;
        }
    },
    scoreSet(objective, amount = 0) {
        try {
            return Number(this.runCommand(`scoreboard players set @s ${objective} ${amount}`).statusMessage.match(/-?\d+(?=$)/));
        } catch (error) {
            console.warn(error, error.stack);
            return;
        }
    },
    gamemode(index, selector = '') {
        try {
            content.warn({ test: this.runCommand(`testfor ${selector}`).statusMessage, selector });
            this.runCommand(`gamemode ${index} ${selector}`);
        } catch { }
    },
    getPropertiesList() {
        const properties = [];
        for (const key in this) {
            properties.push(key);
        } return andArray(properties);
    },
    tellraw(message) {
        return this.runCommand(`tellraw @s {"rawtext":[{"text":"${message.replaceAll('"', '\\"')}"}]}`);
    },
    tellrawStringify(message) {
        return this.runCommand(`tellraw @s {"rawtext":[{"text":"${JSON.stringify(message).replaceAll('"', '\\"')}"}]}`);
    },
    tellrawJSON(json) {
        return this.runCommand(`tellraw @s {"rawtext":[${json}]}`);

    },
    titleraw(message, location = 'actionbar') {
        return this.runCommand(`titleraw @s ${location} {"rawtext":[{"text":"${message.replaceAll('"', '\\"')}"}]}`);
    },
    titlerawStringify(message, location = 'actionbar') {
        return this.runCommand(`titleraw @s ${location} {"rawtext":[{"text":"${JSON.stringify(message).replaceAll('"', '\\"')}"}]}`);
    },
    titlerawJSON(json, location = 'actionbar') {
        return this.runCommand(`titleraw @s ${location} {"rawtext":[${json}]}`);
    },
    clear(id) {
        let inventory = this.getComponent('minecraft:inventory').container;
        for (let i = 0; i < inventory.size; i++) {
            const item = inventory.getItem(i);
            if (!item) { continue; }
            if (item.id === id || !id) {
                inventory.setItem(i, new ItemStack(Items.get('minecraft:air'), 0, 0));
            }
        }
    },
    getItemAmount(id) {
        let inventory = this.getComponent('minecraft:inventory').container;
        let amount = 0;
        for (let i = 0; i < inventory.size; i++) {
            const item = inventory.getItem(i);
            if (!item) { continue; }
            if (item.id === id) {
                amount += item.amount;
            }
        }
        return amount;

    },
    tellrawRawObject(obj) {
        return this.runCommand(`tellraw @s ` + JSON.stringify(obj));
    },
    titleraw(message, location = 'actionbar') {
        return this.runCommand(`titleraw @s ${location} {"rawtext":[{"text":"${message.replaceAll('"', '\\"')}"}]}`);
    },
    titlerawStringify(message, location = 'actionbar') {
        return this.runCommand(`titleraw @s ${location} {"rawtext":[{"text":"${JSON.stringify(message).replaceAll('"', '\\"')}"}]}`);
    },
    titlerawJSON(json, location = 'actionbar') {
        return this.runCommand(`titleraw @s ${location} {"rawtext":[${json}]}`);
    },
    titlerawRawObject(obj, location = 'actionbar') {
        return this.runCommand(`titleraw @s ${location} ` + JSON.stringify(obj));
    },
    clearCrossHare(id) {
        try {
            this.runCommand(`clear @s ${id} ${crossHareDataKey}`);
        } catch { }

    },
    queryTopSolid(ceiling = 319) {
        const { location: { x, z } } = this;
        const locations = new BlockLocation(x.floor(), ceiling, z.floor())
            .blocksBetween(new BlockLocation(x.floor(), -64, z.floor())).reverse();
        content.warn(native.stringify(locations[0]));
        for (const location of locations) {
            content.warn({ id: this.dimension.getBlock(location).type.id });
            if (!this.dimension.getBlock(location).isEmpty) {
                console.warn(x, location.y, z);
                return location.y;
            }
        }
        console.warn('hewidjdwwdnnwdkkj');
    },
    ability(ability, bool = '', selector = '') {
        let abilityCurrent;
        try {
            abilityCurrent = JSON.parse(this.runCommand(`ability @s${selector} ${ability}`).displayString.match(/\w+$/)[0]?.toLowerCase());
        } catch { }
        // content.warn(abilityCurrent);
        if (abilityCurrent !== undefined && abilityCurrent !== bool) {
            this.runCommand(`ability @s ${ability} ${bool}`);
            return !abilityCurrent;
        } else {
            return abilityCurrent;
        }

    },
    removeAllTags() {
        this.getTags().forEach(tag => this.removeTag(tag));
    },
    kick(reason) {
        try {
            this.runCommand(`kick "${this.name}" ${reason}`);
        } catch (error) {
            const { statusCode } = JSON.parse(error);
            if (statusCode === -2147483648) {
                this.disconnect();
            }
        }


    },
    disconnect() {
        this.triggerEvent('patches:disconnect');
    }
    // setTag(tag) {
    //     try {
    //         tthis.runCommand(`tag @s add ${tag}`)
    //         return true
    //     } catch {
    //         return false;
    //     }
    // }
};

Object.assign(Player.prototype, betaPlayerFunctions);
Object.assign(Entity.prototype, betaPlayerFunctions);
const inventoryContainerFunctions = {
    removeItem(ItemStack) {
        for (let i = this.size - 1; i >= 0; i--) {
            const item = this.getItem(i) ?? {};
            // overworld.runCommand(`say 'ItemStack', ${ItemStack.amount}, ${item.amount}`);
            if (item.id === ItemStack.id && item.data === ItemStack.data) {
                const amount = item.amount - ItemStack.amount;
                // overworld.runCommand(`say 'amount', ${amount}`);
                this.setItem(i, Object.assign(ItemStack, { amount: (amount < 0) ? 0 : amount }));
                break;
            }

        }
    },
    transferAllIf(callback, container, ignoreEmpty = true) {
        for (let i = 0; i < this.size; i++) {
            const item = this.getItem(i);
            if (ignoreEmpty && !item) { continue; }
            if (callback(item, i, this, container)) {
                this.setItem(i, new ItemStack(Items.get('minecraft:air'), 0, 0));
                container.addItem(item);
            }
        }
    },
    openSlotsForItem(id, data, ignoreEmpty = false) {
        id = (!/\w+:/.test(id)) ? `minecraft:${id}` : id;
        let amount = 0;
        for (let i = 0; i < this.size; i++) {
            const item = this.getItem(i);
            if (ignoreEmpty && !item) { continue; }
            if (!item) {
                amount += 64;
            } else if (item.id === id && (item.data === data || !data)) {
                amount += 64 - item.amount;
            }
        }
        return amount;
    },
    numberOf(id, data) {
        id = (!/\w+:/.test(id)) ? `minecraft:${id}` : id;
        content.warn({ text: 'hwwj', id, data });
        let amount = 0;
        for (let i = 0; i < this.size; i++) {
            const item = this.getItem(i);
            if (!item) { continue; }
            content.warn(native.stringify(item));
            if (item.id === id && (item.data === data || !data)) {
                amount += item.amount;
            }
        }
        return amount;
    },
    getArray() {
        return Array.from(Array(this.size), (item, i) => this.getItem(i));
    }
};
Object.assign(InventoryComponentContainer.prototype, inventoryContainerFunctions);
Object.assign(PlayerInventoryComponentContainer.prototype, inventoryContainerFunctions);
Object.assign(BlockInventoryComponentContainer.prototype, inventoryContainerFunctions);

const ItemStackFunctions = {
    equalsItemStack(itemStack, ingoreNameTag = true) {
        if (this === itemStack) {
            return true;
        } else if ((this === undefined) || (itemStack === undefined)) {
            return false;
        }
        if (ingoreNameTag) {
            return this.id === itemStack.id && this.data === itemStack.data && this.amount === itemStack.amount;
        } else {
            // content.warn({ this: native.stringify(this), itemStack: native.stringify(itemStack) });
            let nameTagThis = this.nameTag;
            if (nameTagThis) {
                nameTagThis = nameTagThis.replaceAll(lockedItemKey, '');
            }
            let nameTagItemStack = itemStack.nameTag;
            if (nameTagItemStack) {
                nameTagItemStack = nameTagItemStack.replaceAll(lockedItemKey, '');
            }
            return this.id === itemStack.id && this.data === itemStack.data && this.amount === itemStack.amount && nameTagThis === nameTagItemStack;
        }
    }
};
Object.assign(ItemStack.prototype, ItemStackFunctions);
const EnchantmentTypes = Object.values(MinecraftEnchantmentTypes);
const EnchantmentListFunctions = {
    getArray() {
        const enchantmentArray = [];
        EnchantmentTypes.forEach(enchantmentType => {
            if (this.hasEnchantment(enchantmentType)) {
                enchantmentArray.push(this.getEnchantment(enchantmentType));
            }
        });
        return enchantmentArray;
    }
};
Object.assign(EnchantmentList.prototype, EnchantmentListFunctions);

export const overworld = world.getDimension('overworld'), nether = world.getDimension('nether'), end = world.getDimension('the end');
