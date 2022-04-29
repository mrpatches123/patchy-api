import {
    world,
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
    BlockInventoryComponentContainer
} from 'mojang-minecraft';


const { isInteger } = Number;
const { isArray } = Array;
const { log10 } = Math;
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
export const native = {

    toObject(objectFrom, value = '<Function>', ignoreFunctions = true, ignoreObjectFunctions = true) {
        let clone = {};
        inF(objectFrom, value, 'objectFrom');

        function inF(ThisObject, Setvalue, logPath) {
            for (const key in ThisObject) {
                if (typeof ThisObject[key] === 'object' && !Array.isArray(ThisObject[key])) {
                    clone = new Function('object', 'value', `{ object${logPath.replaceAll('objectFrom', '') + `['${key}']`} = {}; return object}`)(clone);
                    inF(ThisObject[key], Setvalue, logPath + "['" + key + "']");

                } else {
                    // log ? console.warn(logPath + `['${key}'] = ${Setvalue};`) : null;
                    let valueMain;
                    if (typeof ThisObject[key] === 'function') {
                        if (ignoreFunctions) {
                            continue;
                        } else if (ignoreObjectFunctions && hasKey(key)) {
                            continue;
                        } else {
                            valueMain = value;
                        }

                    } else {
                        valueMain = ThisObject[key];
                    }

                    clone = new Function('object', 'value', `{ object${logPath.replaceAll('objectFrom', '') + `['${key}']`} = value; return object}`)(clone, valueMain);
                }
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
    tellraw: function (message, exludePlayer) {
        try {
            overworld.runCommand(`tellraw @a[scores={Notifications=1}${(exludePlayer) ? `, ${exludePlayer.getNametag()}` : ''}] {"rawtext":[{"text":"${message.replaceAll('"', '\\"')}"}]}`);
            return true;
        } catch {
            return undefined;
        }
    }
};
export const server = {
    tellraw: function (message) {
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
    scoreAdd: function (objective, name, amount = 0) {
        try {
            return Number(overworld.runCommand(`scoreboard players add ${name} ${objective} ${amount}`).statusMessage.match(/-?\d+(?=[^-\d]$)/));
        } catch (error) {
            console.warn(error, error.stack);
            return;
        }
    },
    scoreSet: function (objective, name, amount = 0) {
        try {
            return Number(overworld.runCommand(`scoreboard players set ${name} ${objective} ${amount}`).statusMessage.match(/-?\d+(?=$)/));
        } catch (error) {
            console.warn(error, error.stack);
            return;
        }
    },
};

export const content = {
    warn: function (message) {
        if (typeof message === 'object') {
            content.warn(JSON.stringify(message));
            // console.warn(native.stringifyEx(message));
        } else {
            console.warn(message);
        }

    }
};



const betaDimensionFunctions = {
    runCommands: function () {
        const commands = (typeof arguments[0] === 'array') ? arguments[0] : [...arguments];
        let returnArray = [];
        for (const command of commands) {
            returnArray.push(this.runCommand(command));
        } return returnArray;

    },
    getId: function () {
        const dimensions = ['overworld', 'nether', 'end'];
        return dimensions.find(dimension => world.getDimension(dimension) === this);
    }
};
Object.assign(Dimension.prototype, betaDimensionFunctions);



// const prototypes = {
//     toBinary: function () {
//         return this.replace(/[\s\S]/g, (str) => str.charCodeAt().toString(2));
//     },
//     toText: function () {
//         return this.replace(/\d{5}]/g, (match) => console.log(Number(match).toString()));
//     },
// };

// Object.assign(String.prototype, prototypes);
const { entries, keys, values, assign } = Object;

const arrayObjectFunctions = {
    keys(ignoreFunctions) {
        let keysArray = [];
        for (let key in this) {
            if (hasKey(key)) { continue; }
            if (ignoreFunctions && typeof this[key] === 'function') { continue; }
            keysArray.push(key);
        }
        return keysArray;
    },
    forEach(callback, initialValue, ignorefunctions = false, ignore = false) {
        if (typeof callback == "function") {
            if (this.keys().length) {
                let i = 0;
                for (const key in this) {
                    // console.warn(key, hasKey(key));
                    if (hasKey(key) || (typeof this[key] === 'function' && ignorefunctions)) { continue; }
                    const call = callback(key, this[key], i++, initialValue);
                    if (initialValue && ((call === undefined || call === false || call === null) || ignore) && typeof initialValue == 'object' && !isArray(initialValue)) {
                        assign(initialValue, call);
                    } else if (initialValue && (call || ignore) && typeof initialValue == 'object' && isArray(initialValue)) {
                        initialValue.push(call);
                    }
                }
                if (initialValue) { return initialValue; }
            }

        }
    },
    every(callback) {
        if (typeof callback == "function") {
            if (entries(this).length) {
                let test = [];
                entries(this).forEach(([key, value], i) => {
                    test.push(callback(key, value, i));
                });
                return test.every(bool => bool);
            }
        }
    },
    some(callback) {
        if (typeof callback == "function") {
            if (entries(this).length) {
                let test = [];
                entries(this).forEach(([key, value], i) => {
                    test.push(callback(key, value, i));
                });
                return test.some(bool => bool);
            }
        }
    },
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
    join(string = '') {
        if (entries(this).length) {
            let joinedObject = [];
            entries(this).forEach(([key, value], i) => {
                joinedObject.push(this[key]);
            });
            return joinedObject.join(string);
        }
    },
    length() {
        return entries(this).length;
    },
    equals: function (object) {
        //console.log(keys(this).equals(keys(object)))
        return (keys(this).equals(keys(object)) && this.every((key, value) => value === object[key]));
    },
    find: function (callback, ignorefunctions = false) {
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
function hasKey(key) {
    if (arrayObjectFunctions.hasOwnProperty(key) || stringFunctions.hasOwnProperty(key)) {
        return true;
    }
}

Object.assign(Object.prototype, arrayObjectFunctions);

const stringFunctions = {
    toHHMMSS: function () {
        return new Date(Number(this) * 1000).toTimeString().split(' ')[0];
    },
    toNumber: function () {
        return Number(this);
    },
    round: function (place = 0) {
        return Math.round(Number(this) * 10 ** place) / 10 ** place;
    },
    floor: function (place = 0) {
        return Math.floor(Number(this) * 10 ** place) / 10 ** place;
    },
    ceil: function (place = 0) {
        return Math.ceil(Number(this) * 10 ** place) / 10 ** place;
    },
    trunc: function () {
        return Math.trunc(Number(this));
    },
    dec: function () {
        return Number(this) % 1;
    },
    abs: function () {
        return Math.abs(Number(this));
    },
    getSign: function () {
        const sign = Number(this) / Number(this).abs();
        return (!sign) ? 0 : sign;
    },
    toTimeTill: function (date = new Date(this), time = Number(this), test = false) {
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
    isInteger: function () {
        return isInteger(Number(this));
    }
};
const types = ['', 'k', 'M', 'G', 'T'];
const numberFunctions = {
    unitFormat: function (place = 1) {
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
    delete: function (index) {
        return this.filter((item, i) => i !== index);
    },
    random: function () {
        return this[~~(Math.random() * this.length)];
    },
    equals: function (array) {
        return this.every((value, i) => value === array[i]);
    },
    reverseCopy: function () {
        let array = [];
        for (let i = this.length - 1, a = 0; i >= 0 && a < this.length; i--, a++) {
            array[a] = this[i];
        }
        return array;
    },
    accumulate: function (callback, initialValue, ignorefunctions = false, ignore = false) {
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

            const x = this.sort((a, b) => a.x - b.x);
            const y = this.sort((a, b) => a.y - b.y);
            const z = this.sort((a, b) => a.z - b.z);
            return [
                { x: x[0].x, y: y[0].y, z: z[0].z },
                { x: x[x.length - 1].x, y: y[y.length - 1].y, z: z[z.length - 1].z }
            ];
        } else {
            throw new Error('getRange(): not an array of BlockLocations or Locations');
        }
    }, 
    merge(index, array, postfix = false) {
        const arrayPre = this.filter((item, i) => (postfix) ? i <= index : i < index);
        const arrayPost = this.filter((item, i) => (postfix) ? i > index : i >= index);
        return [...arrayPre, ...array, ...arrayPost]
    }
};
Object.assign(Array.prototype, arrayFunctions);

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
const { hypot } = Math;
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
    }
};
Object.assign(Location.prototype, locationFunctions);
Object.assign(BlockLocation.prototype, locationFunctions);
const betaPlayerFunctions = {
    runCommands: function (commands) {
        ((isArray(arguments[0])) ? arguments[0] : [...arguments]).forEach(command => this.runCommand(command));
    },
    getName: function () {
        return this.name;
    },
    getNameTag: function () {
        if (/"|\\/.test(this.name)) {
            this.nameTag = this.nameTag.replace(/"|\\/g, '');
        } return this.nameTag;
    }, //not beta but fixes nameSpoof command tartgeting issues
    rotation: function (isArray = true) {
        if (isArray) {
            return [Math.asin(-this.viewVector.y) * 180 / Math.PI, -Math.atan2(this.viewVector.x, this.viewVector.z) * 180 / Math.PI];
        } else {
            return { x: Math.asin(-this.viewVector.y) * 180 / Math.PI, y: -Math.atan2(this.viewVector.x, this.viewVector.z) * 180 / Math.PI };
        }
    },
    scoreTest: function (objective, min, max) {
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
    scoreAdd: function (objective, amount = 0) {
        try {
            return Number(this.runCommand(`scoreboard players add @s ${objective} ${amount}`).statusMessage.match(/-?\d+(?=[^-\d]$)/));
        } catch (error) {
            console.warn(error, error.stack);
            return;
        }
    },
    scoreSet: function (objective, amount = 0) {
        try {
            return Number(this.runCommand(`scoreboard players set @s ${objective} ${amount}`).statusMessage.match(/-?\d+(?=$)/));
        } catch (error) {
            console.warn(error, error.stack);
            return;
        }
    },
    gamemode: function (index, selector = '') {
        try {
            this.runCommand(`gamemode ${index} ${selector}`);
        } catch { }
    },
    getPropertiesList: function () {
        const properties = [];
        for (const key in this) {
            properties.push(key);
        } return andArray(properties);
    },
    tellraw: function (message) {
        return this.runCommand(`tellraw @s {"rawtext":[{"text":"${message.replaceAll('"', '\\"')}"}]}`);
    },
    tellrawStringify: function (message) {
        return this.runCommand(`tellraw @s {"rawtext":[{"text":"${JSON.stringify(message).replaceAll('"', '\\"')}"}]}`);
    },
    tellrawJSON: function (json) {
        return this.runCommand(`tellraw @s {"rawtext":[${json}]}`);

    },
    titleraw: function (message, location = 'actionbar') {
        return this.runCommand(`titleraw @s ${location} {"rawtext":[{"text":"${message.replaceAll('"', '\\"')}"}]}`);
    },
    titlerawStringify: function (message, location = 'actionbar') {
        return this.runCommand(`titleraw @s ${location} {"rawtext":[{"text":"${JSON.stringify(message).replaceAll('"', '\\"')}"}]}`);
    },
    titlerawJSON: function (json, location = 'actionbar') {
        return this.runCommand(`titleraw @s ${location} {"rawtext":[${json}]}`);
    },
    clear: function (id) {
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
    tellrawRawObject: function (obj) {
        return this.runCommand(`tellraw @s ` + JSON.stringify(obj));
    },
    titleraw: function (message, location = 'actionbar') {
        return this.runCommand(`titleraw @s ${location} {"rawtext":[{"text":"${message.replaceAll('"', '\\"')}"}]}`);
    },
    titlerawStringify: function (message, location = 'actionbar') {
        return this.runCommand(`titleraw @s ${location} {"rawtext":[{"text":"${JSON.stringify(message).replaceAll('"', '\\"')}"}]}`);
    },
    titlerawJSON: function (json, location = 'actionbar') {
        return this.runCommand(`titleraw @s ${location} {"rawtext":[${json}]}`);
    },
    titlerawRawObject: function (obj, location = 'actionbar') {
        return this.runCommand(`titleraw @s ${location} ` + JSON.stringify(obj));
    },
    clear: function (id) {
        let inventory = this.getComponent('minecraft:inventory').container;
        for (let i = 0; i < inventory.size; i++) {
            const item = inventory.getItem(i);
            if (!item) { continue; }
            if (item.id === id || !id) {
                inventory.setItem(i, new ItemStack(Items.get('minecraft:air'), 0, 0));
            }
        }
    }
    // getTags: function (name = `"${this.getName()}"`) {
    //     return this.runCommand(`tag ${name} list`).statusMessage.replace(new RegExp(`${name.replace(/([\\(\\)])/g, '\\$1')}.*:\\s§a|§r$`, 'g'), '').split('§r, §a');
    // },
    // setTag: function (tag) {
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
    removeItem: function (ItemStack) {
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
    }
};
Object.assign(InventoryComponentContainer.prototype, inventoryContainerFunctions);
Object.assign(PlayerInventoryComponentContainer.prototype, inventoryContainerFunctions);
Object.assign(BlockInventoryComponentContainer.prototype, inventoryContainerFunctions);


const EnchantmentTypes = Object.values(MinecraftEnchantmentTypes);
const EnchantmentListFunctions = {
    getArray: function () {
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
