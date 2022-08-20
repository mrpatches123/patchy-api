import {
    world,
    Items,
    BlockLocation
} from 'mojang-minecraft';
import errorLogger from './classes/error.js';
import '../libraries/prototypes/imports.js';
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




export const overworld = world.getDimension('overworld'), nether = world.getDimension('nether'), end = world.getDimension('the end');
