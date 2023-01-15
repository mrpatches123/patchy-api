import { world, Location, Vector } from '@minecraft/server';
import { Player } from './player/class.js';
import { ActionFormData as action, ModalFormData as modal, MessageFormData as message } from '@minecraft/server-ui';
import { content, native, RemovableTree, server, typeOf } from '../utilities.js';
import wait from './wait.js';
import eventBuilder from './events/export_instance.js';
import global from './global.js';
import time from './time.js';
import errorLogger from './error.js';
const forms = { action, modal, message };
server.objectiveAdd('world');
const { isArray } = Array;
const responses = {
    action: 'selection',
    modal: 'formValues',
    message: 'selection'
};

/**
 * @typedef {Object} ObjectForm
 * @property {Array<ModalTypes | ((receiver: Player, i: Number, ...extraArguments: Array<any>) => {})>} modal
 * @property {Array<ActionTypes | ((receiver: Player, i: Number, ...extraArguments: Array<any>) => {})>} action
 * @property {Array<MessageTypes | ((receiver: Player, i: Number, ...extraArguments: Array<any>) => {})>} message
 */

/**
 * @typedef {(receiver: Player, i: Number, ...extraArguments: Array<any>) => {}} generationCallback
 */

/**
 * @typedef {Object} ModalTypes
 * @property {ModalDropdown | generationCallback} dropdown
 * @property {String | generationCallback} title
 * @property {ModalSlider | generationCallback} slider
 * @property {ModalTextField | generationCallback} textField
 * @property {Modaltoggle | generationCallback} toggle
 * @property {(receiver: Player, selection: Number | String, ...extraArguments: Array<any>) => {}} callback
 */

/**
 * @typedef {Object} ModalDropdown
 * @property {String | generationCallback} label
 * @property {Array<String> | generationCallback} options
 * @property {Number | generationCallback} defaultValueIndex
 */

/**
 * @typedef {Object} ModalSlider
 * @property {String | generationCallback} label
 * @property {Number | generationCallback} minimumValue
 * @property {Number | generationCallback} maximumValue
 * @property {Number | generationCallback} valueStep
 * @property {Number | generationCallback} defaultValue
 */

/**
 * @typedef {Object} ModalTextField
 * @property {String | generationCallback} label
 * @property {String | generationCallback} placeholderText
 * @property {String | generationCallback} maximumValue
 * @property {Number | generationCallback} defaultValue
 */

/**
 * @typedef {Object} Modaltoggle
 * @property {String | generationCallback} label
 * @property {String | generationCallback} defaultValue
 */

/**
 * @typedef {Object} ActionTypes
 * @property {String | generationCallback} body
 * @property {String | generationCallback} title
 * @property {ActionBution | generationCallback} button
 * @property {ActionBack | generationCallback} back
 * @property {ActionRefresh | generationCallback} refresh
 * @property {ActionToggle | generationCallback} toggle
 * @property {(receiver: Player, selection: Number | String, ...extraArguments: Array<any>) => {}} callback
 */

/**
 * @typedef {Object} ActionBution
 * @property {String | generationCallback} text
 * @property {String | generationCallback} iconPath
 * @property {Boolean | generationCallback} reopen
 */
/**
 * @typedef {Object} ActionBack
 * @property {String | generationCallback} text
 * @property {String | generationCallback} iconPath
 * @property {Boolean | generationCallback} reopen
 */

/**
 * @typedef {Object} ActionRefresh
 * @property {String | generationCallback} text
 * @property {String | generationCallback} iconPath
 * @property {Boolean | generationCallback} reopen
 */

/**
 * @typedef {Object} ActionToggle
 * @property {Array<ActionToggleOptions>} options
 * @property {'receiver' | 'world' | generationCallback} dependency
 * @property {Boolean | generationCallback} postfix
 * @property {Boolean | generationCallback} prefix
 * @property {Boolean | generationCallback} reopen
 */

/**
 * @typedef {Object} ActionToggleOptions
 * @property {String | generationCallback} prependText
 * @property {String | generationCallback} text
 * @property {Boolean | generationCallback} apendText
 * @property {Boolean | generationCallback} iconPath
 * 
 */

/**
 * @typedef {Object} MessageTypes
 * @property {String | generationCallback} title
 * @property {String | generationCallback} body
 * @property {MessageButton1 | generationCallback} button1
 * @property {MessageButton2 | generationCallback} button2
 * @property {(receiver: Player, selection: Number | String, ...extraArguments: Array<any>) => {}} callback
 */
/**
 * @typedef {Object} MessageButton1
 * @property {String | generationCallback} text
 */
/**
 * @typedef {Object} MessageButton2
 * @property {String | generationCallback} text
 */



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
        refresh: {
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



// dependency = d?:'receiver', 'world'
// scoreboardName = if undefined memory
class FormBuilder {
    constructor() {
        this.__awaitingPlayers = {};
        this.players = {};
        // eventBuilder.subscribe('form*API', {
        //     playerLeft: ({ playerId }) => {
        //         if (this.__awaitingPlayers.hasOwnProperty(playerId)) this.__awaitingPlayers[playerId] = false;

        //     }
        // });
    }
    /**
     * @method create
     * @param {String} key 
     * @param {ObjectForm} data 
     */
    create(key, data) {
        this[key] = data;
    }
    /**
     * @method showConformation
     * @param {Player} receiver 
     * @param {String} body 
     * @param {(receiver: Player) => {}} callbackIfYes 
     * @param {(receiver: Player) => {}} callbackIfNo 
     */
    async showConformation(receiver, body, callbackIfYes, callbackIfNo) {
        try {
            const form = new message();
            form.body(body);
            form.button1('Yes');
            form.button2('No');
            const { selection, canceled, cancelationReason } = await form.show(receiver.player);
            if (canceled) return cancelationReason;
            if (selection) {
                if (callbackIfYes instanceof Function) callbackIfYes(receiver);
            } else {
                if (callbackIfNo instanceof Function) callbackIfNo(receiver);
            }
        } catch (error) {
            errorLogger.log(error, error.stack, { key: 'showConformation', event: 'formShow' });
        }
    };
    /**
     * @method showConformationAwait
     * @param {Player} receiver 
     * @param {String} body 
     * @param {(receiver: Player) => {}} callbackIfYes 
     * @param {(receiver: Player) => {}} callbackIfNo 
     */
    async showConformationAwait(receiver, body, callbackIfYes, callbackIfNo) {
        try {

            const form = new message();
            form.body(body);
            form.button1('Yes');
            form.button2('No');
            let response;
            while (true) {
                response = await form.show(receiver);
                content.warn({ response: native.stringify(response) });
                const { cancelationReason } = response;
                if (cancelationReason !== 'userBusy') break;
            }
            const { selection } = response;
            if (selection) {
                if (callbackIfYes instanceof Function) callbackIfYes(receiver);
            } else {
                if (callbackIfNo instanceof Function) callbackIfNo(receiver);
            }
        } catch (error) {
            errorLogger.log(error, error.stack, { key: 'showConformation', event: 'formShow' });
        }
    }
    /**
     * @method showAwait
     * @param {Player} receiver 
     * @param {String} key 
     * @param  {...any} extraArguments
     */
    showAwait(receiver, key, ...extraArguments) {
        const { id } = receiver;
        if (this.__awaitingPlayers[id] === false) return delete this.__awaitingPlayers[id];
        if (this.__awaitingPlayers.hasOwnProperty(id) && this.__awaitingPlayers[id].hasOwnProperty(key)) return receiver.tell('§cyou are already awaiting the same form!');
        if (!this.__awaitingPlayers.hasOwnProperty(id)) this.__awaitingPlayers[id] = {};
        this.__awaitingPlayers[id][key] = 0;
        receiver.tell('§l§eClose chat to open the Menu!');
        const generatedForm = this.generateForm(receiver, key, ...extraArguments);
        this.showForm(receiver, key, generatedForm, true, ...extraArguments)
            .catch(error => console.warn(generatedForm.type, key, 'callback', error, error.stack));
    }
    /**
     * @method show
     * @param {Player} receiver 
     * @param {String} key 
     * @param  {...any} extraArguments
     */
    show(receiver, key, ...extraArguments) {
        const generatedForm = this.generateForm(receiver, key, ...extraArguments);
        this.showForm(receiver, key, generatedForm, false, ...extraArguments)
            .catch(error => console.warn(generatedForm.type, key, 'callback', error, error.stack));
    }
    /**
     * @method showMove
     * @param {Player} receiver 
     * @param {String} key 
     * @param  {...any} extraArguments
     */
    showMove(receiver, key, ...extraArguments) {
        const { id, location, viewVector, name } = receiver;

        receiver.tellraw(`§l§eClose chat and Move to open the Menu!, ${id}`);
        global.playerMap[id].lastLocation = location;
        global.playerMap[id].lastViewVector = viewVector;
        wait.add(`formWait${id}`, () => {


            const { location, viewVector, name } = receiver;

            const { lastLocation = location, lastViewVector = viewVector } = global.playerMap[id];
            const { x: lx, y: ly, z: lz } = lastLocation;
            const { x: vx, y: vy, z: vz } = lastViewVector;
            content.warn({ lastLocation: { lx, ly, lz }, lastViewVector: { vx, vy, vz } });
            // content.warn({ name, key, 'receiver?': receiver instanceof Player, playerMap: global.playerMap[id], lastLocation: lastLocation instanceof Location });

            content.warn({ lastLocation: native.stringify(lastLocation), boolL: lastLocation instanceof Location, lastViewVector: native.stringify(lastViewVector), boolL: lastViewVector instanceof Vector });
            if (!viewVector.equals(lastViewVector) ||
                !location.equals(lastLocation)) {
                return true;
            }
            global.playerMap[id].lastLocation = location;
            global.playerMap[id].lastViewVector = viewVector;

        }, () => { formBuilder.show(receiver, key, ...extraArguments); }, { once: true, start: true, remove: true });

    }
    /**
     * @param {Player} receiver 
     * @param {String} key 
     * @param  {...any} extraArguments 
     * @returns {GeneratedForm}
     * @private
     */
    generateForm(receiver, key, ...extraArguments) {
        const { name, id, memory, scores } = receiver;
        // if (!extraArguments.length) { extraArguments = []; }
        // content.warn({ extraArguments });
        if (!this[key]) {
            return console.error(`form: ${key}, has not been initalised or doesn't exist!`);
        }
        const type = Object.keys(this[key])[0];
        if (typeof this[key] !== 'object' && !Array.isArray(this[key])) {
            throw new Error(`expected a object at key: ${key}`);
        }
        // content.warn({ text: 'type', type, form: Array.isArray(this[key][type]) });

        const form = new forms[type]();

        let formArray;
        content.warn({ key, type: typeof this[key][type] });
        if (typeof this[key][type] === 'function') {
            formArray = [...this[key][type](receiver, ...extraArguments)];
        } else {
            formArray = [...this[key][type]];
        }
        if (!(typeof formArray === 'object' && Array.isArray(formArray))) {
            throw new Error(`expected an Array at ${type}, key: ${key}`);
        }
        for (let i = 0; i < formArray.length; i++) {
            const a = i;
            const object = formArray[i];
            // content.warn({ formArray, i, type: typeof object, array: isArray(object), extraArguments });
            let objectClone;
            if (typeof object === 'function') {
                let objectGenerated = object(receiver, i, ...extraArguments);
                if (typeof objectGenerated === 'object') {
                    if (isArray(objectGenerated)) {
                        formArray = [...formArray.delete(i).merge(--i, objectGenerated)];
                        // content.warn({ test: formArray });
                        continue;
                    } else if (objectGenerated) {
                        objectClone = objectGenerated;
                        // content.warn({ testTwo: formArray });
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

                // console.warn(key, method, i, '1');
                if (method === 'callback') { return; };
                // console.warn(key, method, i);
                let parametersClone;
                if (typeof parameters === 'function') {
                    parametersClone = parameters(receiver, i, ...extraArguments);
                } else if (typeof parameters === 'object') {
                    parametersClone = { ...parameters };
                } else {
                    parametersClone = parameters;
                    return;
                }
                parameters.forEach((key, value, i) => {
                    if (typeof value === 'function') {
                        console.warn(key);
                        parametersClone[key] = value(receiver, i, ...extraArguments);
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
                    const { options, scoreboardName, dependency = 'receiver' } = parameters;
                    let index = 0;
                    if (scoreboardName) {
                        server.objectiveAdd(scoreboardName);
                        if (dependency === 'receiver') {

                            index = scores[scoreboardName];
                        } else {
                            index = server.scoreTest(scoreboardName, 'world') ?? 0;
                        }
                    }
                    // console.warn(index);
                    if (index > options.length - 1) {
                        scores[scoreboardName] = 0;
                        index = 0;
                    }
                    // content.warn({ option: options });
                    const { prependText = '', text = '', apendText = '', iconPath } = options[index];
                    form.button(prependText + text + apendText, iconPath);
                } else if (method === 'back' && form instanceof action) {
                    const { text = '', iconPath } = parameters;
                    form.button(text, iconPath);
                } else if (method === 'refresh' && form instanceof action) {
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
        return ({ form, formArray, type });
    }
    /**
     * @typedef GeneratedForm 
     * @property  {modal | action | message} form
     * @property {ObjectForm} formArray 
     * @property {String} type
     */
    /**
     * 
     * @param {Player} receiver 
     * @param {String} key 
     * @param {GeneratedForm} generatedForm return from formBuilder.generateForm
     * @param {Boolean} awaitShow 
     * @param  {...any} extraArguments 
     * @private
     */
    async showForm(receiver, key, generatedForm, awaitShow, ...extraArguments) {

        const { name, id, memory } = receiver;
        content.warn({ t: 'showForm', bool: memory.keys() });
        if (!memory.hasOwnProperty('lastFormsShown')) memory.lastFormsShown = {};
        if (!memory.hasOwnProperty('formTree')) memory.formTree = new RemovableTree();
        memory.lastFormsShown[key] = extraArguments ?? [];
        memory.formTree.next(key);
        const { form, formArray, type } = generatedForm;
        // const response = await form.show(receiver);
        // const { canceled, cancelationReason } = response;
        let response;
        while (true) {
            response = await form.show(receiver.player);
            const { cancelationReason } = response;
            if (!awaitShow || cancelationReason !== 'userBusy') {
                if (awaitShow && this.__awaitingPlayers.hasOwnProperty(id) && this.__awaitingPlayers[id].hasOwnProperty(key)) delete this.__awaitingPlayers[id][key];
                break;
            };
        }
        // content.warn({ t: 'response', canceled, cancelationReason, timeMS: time.end('form') });
        if (this.__awaitingPlayers.hasOwnProperty(id) && this.__awaitingPlayers[id].hasOwnProperty(key)) delete this.__awaitingPlayers[id][key];
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
                const { options, scoreboardName, dependency = 'receiver', postfix = true, prefix = false, reopen = false } = object.toggle;
                let index = 0;
                // content.warn({ hwjd: 'test252', lengthOptions: options.length });
                if (scoreboardName) {
                    if (dependency === 'receiver') {
                        index = receiver.scoreTest(scoreboardName) ?? 0;
                        if (index < options.length) {
                            receiver.scoreSet(scoreboardName, ++index);
                        }
                    } else {
                        index = server.scoreTest(scoreboardName, 'world') ?? 0;
                        if (index < options.length) {
                            index = server.scoreSet(scoreboardName, ++index);
                        }
                    }
                }
                console.warn('index: ' + index);
                if (index > options.length - 1) {
                    index = 0;
                    receiver.scoreSet(scoreboardName);
                }
                console.warn('index: ' + index);
                if (prefix) {
                    if (options[index].callback) {
                        options[index].callback(receiver, i, ...extraArguments);
                    } else if (options.callback) {
                        options.callback(receiver, i, ...extraArguments);
                    }
                }

                //content.warn({ index: receiver.scoreTest(scoreboardName) ?? 0, l: options.length });
                if (reopen) {
                    this.show(receiver, key);
                }

                if (postfix) {
                    content.warn(index);
                    if (options[index].callback) {
                        options[index].callback(receiver, i, ...extraArguments);
                    } else if (options.callback) {
                        options.callback(receiver, i, ...extraArguments);
                    }
                }

            } else if (object?.back && form instanceof action) {
                const { memory } = receiver;
                const backKey = memory.formTree.beforeLast();
                const backExtraArgs = memory.lastFormsShown[backKey] ?? [];
                this.show(receiver, backKey, ...backExtraArgs);
            } else if (object?.refresh && form instanceof action) {
                this.show(receiver, key, ...extraArguments);
            } else {

                if (object?.button?.reopen) {
                    this.show(receiver, key, ...extraArguments);
                }
                if (object?.callback) {
                    object.callback(receiver, i, ...extraArguments);
                }

            }

        } else {
            // content.warn(responsibleObjects);
            responsibleObjects.forEach((object, i) => {
                content.warn({ response: native.stringify(response), type: responses[type] });

                if (object.callback) {
                    object.callback(receiver, response[responses[type]][i], ...extraArguments);
                }
            });
        }

    }
}

const formBuilder = new FormBuilder();
export default formBuilder;





// if (score >= options.length) {
//     index = receiver.scoreSet(scoreboardName);
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
