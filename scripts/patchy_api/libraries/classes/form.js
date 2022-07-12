import { world } from 'mojang-minecraft';
import { ActionFormData as action, ModalFormData as modal, MessageFormData as message } from 'mojang-minecraft-ui';
import { content, native, server, typeOf } from '../utilities.js';
import eventBuilder from "./events.js";
import global from './global.js';
import time from './time.js';
const forms = { action, modal, message };
server.objectiveAdd('world');
const { isArray } = Array;
const responses = {
    action: 'selection',
    modal: 'formValues',
    message: 'selection'
};




const methods = {
    modal: {
        title: String,
        dropdown: {
            label: String,
            options: [
                String
            ],
            defaultValueIndex: Number
        },
        slider: {
            label: String,
            minimumValue: Number,
            maximumValue: Number,
            valueStep: Number,
            defaultValue: Number
        },
        textField: {
            label: String,
            placeholderText: String,
            defaultValue: String
        },
        toggle: {
            label: String,
            defaultValue: Boolean
        },
        callback: Function
    },
    action: {
        body: String,
        title: String,
        button: {
            text: String,
            iconPath: String,
            reopen: Boolean
        },
        back: {
            text: String,
            iconPath: String
        },
        toggle: {
            options: [
                {
                    prependText: String,
                    text: String,
                    apendText: String,
                    iconPath: String,
                }
            ],
            scoreboardName: String,
            dependency: String,
            postfix: Boolean,
            prefix: Boolean,
            reopen: Boolean
        },
        callback: Function
    },
    message: {
        title: String,
        body: String,
        button1: {
            text: String
        },
        button2: {
            text: String
        },
        callback: Function
    }

};
// dependency = d?:'player', 'world'
// scoreboardName = if undefined memory
class FormBuilder {
    constructor() {

    }
    create(key, data) {
        this[key] = data;
    }
    showAwait(player, key, ...extraArguments) {
        const { name } = player;
        const { playerId } = global.scoreObject[name];
        let i = 0;
        this.show(player, key, ...extraArguments);
        global.playerMap[name].inUI = true;
        eventBuilder.subscribe(`formAwait${playerId}`, {
            tick: ({ currentTick }) => {

                if (i++ > 4) {

                    const { inUI } = global.playerMap[name];
                    content.warn({ t: 'inUIwqdklwdlkdwklk', inUI });
                    if (!inUI) {
                        eventBuilder.unsubscribeAll(`formAwait${playerId}`);
                    }
                    global.playerMap[name].inUI = true;
                }
                if (!(i++ % 10) && global.playerMap[name].inUI) {
                    this.show(player, key, ...extraArguments);
                    console.warn('show');
                }
            }
        });
    }
    show(player, key, ...extraArguments) {
        const { name } = player;
        const { lastFormShown } = global.playerMap[name];
        global.playerMap[name].lastFormShown = { key, extraArguments };
        // if (!extraArguments.length) { extraArguments = []; }
        content.warn({ extraArguments });
        if (!this[key]) {
            return console.error(`form: ${key}, has not been initalised or doesn't exist!`);
        }
        const type = Object.keys(this[key])[0];
        if (typeof this[key] !== 'object' && !Array.isArray(this[key])) {
            throw new Error(`expected a object at key: ${key}`);
        }
        content.warn({ text: 'type', type, form: Array.isArray(this[key][type]) });

        const form = new forms[type]();

        let formArray;
        if (typeof this[key][type] === 'function') {
            formArray = [...this[key][type](player, ...extraArguments)];
        } else {
            formArray = [...this[key][type]];
        }
        if (!(typeof formArray === 'object' && Array.isArray(formArray))) {
            throw new Error(`expected an Array at ${type}, key: ${key}`);
        }
        for (let i = 0; i < formArray.length; i++) {
            const a = i;
            const object = formArray[i];
            content.warn({ formArray, i, type: typeof object, array: isArray(object), extraArguments });
            let objectClone;
            if (typeof object === 'function') {
                let objectGenerated = object(player, i, ...extraArguments);
                if (typeof objectGenerated === 'object') {
                    if (isArray(objectGenerated)) {
                        formArray = [...formArray.delete(i).merge(--i, objectGenerated)];
                        content.warn({ test: formArray });
                        continue;
                    } else if (objectGenerated) {
                        objectClone = objectGenerated;
                        content.warn({ testTwo: formArray });
                    }
                }
            } else if (object) {
                objectClone = { ...object };
            }
            if (!objectClone) { continue; }
            objectClone.forEach((method, parameters, i) => {
                if (!methods[type][method]) {
                    throw new Error(`key: ${method} does not exist in type: ${type}, index ${a}, form: ${key}`);
                }
                const methodType = methods[type][method];

                console.warn(key, method, i, '1');
                if (method === 'callback') { return; };
                console.warn(key, method, i);
                let parametersClone;
                if (typeof parameters === 'function') {
                    parametersClone = parameters(player, i, ...extraArguments);
                } else if (typeof parameters === 'object') {
                    parametersClone = { ...parameters };
                } else {
                    parametersClone = parameters;
                    return;
                }
                parameters.forEach((key, value, i) => {
                    if (typeof value === 'function') {
                        console.warn(key);
                        parametersClone[key] = value(player, i, ...extraArguments);
                    }
                });
                if (typeOf(methodType) === typeOf(parameters)) {
                    if (typeof parameters === 'object') {
                        parametersClone.forEach((parameter, value) => {
                            if (!methodType[parameter]) {
                                throw new Error(`key: ${parameter} does not exist in element ${method}, type: ${type}, index ${a}, form: ${key}`);
                            }
                            if (typeOf(methodType[parameter]) !== typeOf(value)) {
                                throw new Error(`Expected ${typeOf(methodType[parameter])}, but got ${typeOf(value)} in key: ${parameter}, element ${method}, type: ${type}, index ${a}, form: ${key}`);
                            }
                        });
                    }
                } else {
                    throw new Error(`Expected ${typeOf(methodType)}, but got ${typeOf(parameters)} in value of key: ${method}, element ${method}, type: ${type}, index ${a}, form: ${key}`);
                }
                objectClone[method] = parametersClone;
            });
            if (typeof objectClone !== 'object' && !Array.isArray(objectClone)) {
                throw new Error(`expected a object at ${i}, form: ${key}`);
            }
            formArray[i] = objectClone;
        }
        content.warn(formArray);
        formArray.forEach((object, i) => {

            object.filter(key => key !== 'callback').forEach((method, parameters, i) => {
                // try {
                if (method === 'toggle' && form instanceof action) {
                    const { options, scoreboardName, dependency = 'player' } = parameters;
                    let index = 0;
                    if (scoreboardName) {
                        if (dependency === 'player') {
                            server.objectiveAdd(scoreboardName);
                            index = player.scoreTest(scoreboardName) ?? 0;
                        } else {
                            index = player.scoreTest(scoreboardName, 'world') ?? 0;
                        }
                    }
                    // console.warn(index);
                    if (index > options.length - 1) {
                        index = player.scoreSet(scoreboardName);
                    }
                    // content.warn({ option: options });
                    const { prependText = '', text = '', apendText = '', iconPath } = options[index];
                    form.button(prependText + text + apendText, iconPath);
                } else if (method === 'back' && form instanceof action) {
                    const { text = '', iconPath } = parameters;
                    form.button(text, iconPath);
                } else {

                    if (typeof parameters === 'object') {
                        content.warn({ method, parameters });

                        form[method](...Object.values(parameters.filter(key => key !== 'reopen')));
                    } else {
                        form[method](parameters);
                    }

                }

                // } catch (error) {
                //     console.warn(type, method, error, error.stack);
                //     content.warn(parameters);

                // }
            });
        });
        time.start('form');
        form.show(player).then(response => {

            const { canceled, cancelationReason } = response;
            content.warn({ t: 'response', canceled, cancelationReason, timeMS: time.end('form') });
            if (canceled && cancelationReason === 1) {
                global.playerMap[name].inUI = true;
            } else {
                global.playerMap[name].inUI = false;
            }
            try {

                // content.warn({ text: this[key][type] });
                const responsibleObjects = formArray.filter(object => object.some((key, value) => typeof value === 'object'));
                if (responses[type] === 'selection') {
                    const i = (type === 'message') ? Number(!response[responses[type]]) : response[responses[type]];
                    content.warn({ response: response[responses[type]], i });
                    // content.warn({ text: 'whjw', responsibleObjects, test: 'wuwjw', select: response[type] });
                    // content.warn(native.stringify(response));
                    const object = responsibleObjects[i];
                    // content.warn(native.stringify(object, '<function>', false));

                    if (object?.toggle && form instanceof action) {
                        const { options, scoreboardName, dependency = 'player', postfix = true, prefix = false, reopen = false } = object.toggle;
                        let index = 0;
                        // content.warn({ hwjd: 'test252', lengthOptions: options.length });
                        if (scoreboardName) {
                            if (dependency === 'player') {
                                index = player.scoreTest(scoreboardName) ?? 0;
                                if (index < options.length) {
                                    index = player.scoreAdd(scoreboardName, 1);
                                }
                            } else {
                                index = server.scoreTest(scoreboardName, 'world') ?? 0;
                                if (index < options.length) {
                                    index = server.scoreAdd(scoreboardName, 1);
                                }
                            }
                        }
                        console.warn('index: ' + index);
                        if (index > options.length - 1) {
                            index = player.scoreSet(scoreboardName);
                        }
                        console.warn('index: ' + index);
                        if (prefix) {
                            if (options[index].callback) {
                                options[index].callback(player, i, ...extraArguments);
                            } else if (options.callback) {
                                options.callback(player, i, ...extraArguments);
                            }
                        }

                        //content.warn({ index: player.scoreTest(scoreboardName) ?? 0, l: options.length });
                        if (reopen) {
                            this.show(player, key);
                        }

                        if (postfix) {
                            if (options[index].callback) {
                                options[index].callback(player, ...extraArguments);
                            } else if (options.callback) {
                                options.callback(player, i, ...extraArguments);
                            }
                        }

                    } else if (object?.back && form instanceof action) {
                        const { key, extraArguments } = lastFormShown;
                        formBuilder.show(player, key, ...extraArguments);
                    } else {

                        if (object?.button?.reopen) {
                            this.show(player, key, ...extraArguments);
                        }
                        if (object?.callback) {
                            object.callback(player, i, ...extraArguments);
                        }

                    }

                } else {
                    // content.warn(responsibleObjects);
                    responsibleObjects.forEach((object, i) => {
                        content.warn({ response: native.stringify(response), type: responses[type] });

                        if (object.callback) {
                            object.callback(response[responses[type]][i], player, ...extraArguments);
                        }
                    });
                }
            } catch (error) {
                console.warn(type, key, 'callback', error, error.stack);
            }
        });

    }
}

const formBuilder = new FormBuilder();
export default formBuilder;
// if (score >= options.length) {
//     index = player.scoreSet(scoreboardName);
// }

// formBuilder.create('key', {
//     modal: [
//         {
//             title: 'why'
//         },
//         {
//             toggle: {
//                 label: 'toggle',
//                 defaultValue: true
//             },
//             callback: (response) => {
//                 console.warn(response);
//             }
//         },
//         {
//             textField: {
//                 label: 'text',
//                 placeholderText: '[ here',
//                 defaultValue: 'help me'
//             },
//             callback: (response) => {
//                 console.warn(response);
//             }
//         },
//         {
//             slider: {
//                 label: 'test',
//                 minimumValue: 1,
//                 maximumValue: 4,
//                 valueStep: 1,
//                 defaultValue: 1
//             },
//             callback: (response) => {
//                 console.warn(response);
//             }
//         },
//         {
//             dropdown: {
//                 label: 'just why',
//                 options: [
//                     'one',
//                     'two',
//                     'three'
//                 ],
//                 defaultValueIndex: 0
//             },
//             callback: (response) => {
//                 console.warn(response);
//             }
//         },
//         {
//             icon: 'textures/items/apple'
//         }
//     ]//,
//     // action: [
//     //     {
//     //         body: 'help me',
//     //         button: {
//     //             text: 'help',
//     //             icon: 'textures/items/apple'
//     //         },
//     //         callback: () => {

//     //         }
//     //     },
//     //     {

//     //     },
//     // ],
//     // message: [

//     // ]

// });

// eventBuilder.subscribe('uitest', {
//     beforeItemUse: ({ source }) => {
//         // content.warn({ formBuilder });
//         // formBuilder.show(source, 'key');
//         const form = new modal();
//         form.title('icon test3');
//         form.textField(`\n\n\n\uE30E\n\n\n\n\n`,'');
//         form.toggle('on/off');
//         form.show(source);
//     }
// });
