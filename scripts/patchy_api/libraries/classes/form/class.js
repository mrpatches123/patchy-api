import { world } from '@minecraft/server';
import { ActionFormData as action, ModalFormData as modal, MessageFormData as message, FormCancelationReason } from '@minecraft/server-ui';
import schema, { ArrayType } from './schema.js';
import errorLogger from '../error.js';
import { Player } from '../player/class.js';
/**
 * @type {{[typeKey: String]: {[elementKey: String]: Boolean}}}
 */
const elementKeysWithCallbacksForType = {};
Object.entries(schema).forEach(([type, { schema }]) => {
    elementKeysWithCallbacksForType[type] ??= {};
    Object.entries(schema).forEach(([elementKey, { hasCallback = false }]) => {
        elementKeysWithCallbacksForType[type][elementKey] = hasCallback;
    });
});
const elementKeysWithReopen = [];
Object.entries(schema).forEach(([type, { schema }]) => {
    elementKeysWithCallbacksForType[type] ??= {};
    Object.entries(schema).forEach(([elementKey, { schema = {} }]) => {
        if (schema.hasOwnProperty('reopen'))
            elementKeysWithReopen.push(elementKey);
    });
});
const forms = { action, modal, message };
function typeOf(value) {
    if (typeof value === 'function') {
        try {
            return (new value()).constructor?.name;
        }
        catch {
            return 'Function';
        }
    }
    return value?.constructor?.name;
}
const content = {
    warn(...messages) {
        console.warn(messages.map(message => JSON.stringify(message, (key, value) => (value instanceof Function) ? '<f>' : value)).join(' '));
    },
    warnType(...messages) {
        console.warn(messages.map(message => JSON.stringify(message, (key, value) => {
            const valueType = typeOf(value);
            return (valueType === 'Array' || valueType === 'Object') ? value : valueType;
        })).join(' '));
    }
};
const responses = {
    action: 'selection',
    modal: 'formValues',
    message: 'selection',
    chest: 'selection'
};
function isDefined(input) {
    return (input !== null && input !== undefined && !Number.isNaN(input));
}
function typeEquals(value, target) {
    return typeOf(value) === typeOf(target);
}
function orArray(array = []) {
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
const List = {
    delete(array, index) {
        return array.filter((item, i) => i !== index);
    },
    merge(array, index, target, postfix = false) {
        if (!(array instanceof Array))
            throw new Error(`array at params[0] is not of type: Array`);
        if (!(target instanceof Array))
            throw new Error(`target at params[2] is not of type: Array`);
        const arrayPre = array.filter((item, i) => (postfix) ? i <= index : i < index);
        const arrayPost = array.filter((item, i) => (postfix) ? i > index : i >= index);
        return [
            ...arrayPre,
            ...target,
            ...arrayPost
        ];
    }
};
class RemovableTree {
    constructor(array = []) {
        this.array = array;
    }
    next(key) {
        const index = this.array.indexOf(key);
        if (index === -1) {
            this.array.push(key);
            return this;
        }
        else {
            if (this.array.length <= 1)
                return;
            this.array.splice(index + 1);
            return this;
        }
    }
    last() {
        return this.array[this.array.length - 1];
    }
    beforeLast(lastIndex = 0) {
        const value = this.array[this.array.length - lastIndex - 2];
        if (!value)
            return;
        this.next(value);
        return value;
    }
}
;
export class FormBuilder {
    constructor() {
        this.forms = {};
        /**
         * @type {}
         */
        this.playerData = {};
        world.afterEvents.playerLeave.subscribe(({ playerId }) => {
            if (this.playerData.hasOwnProperty(playerId))
                delete this.playerData[playerId];
        });
    }
    create(key, data) {
        this.forms[key] = data;
    }
    async showConformation(receiver, body, callbackIfYes, callbackIfNo) {
        try {
            const form = new message();
            if (body)
                form.body(body);
            form.button2('Yes');
            form.button1('No');
            const { selection, canceled, cancelationReason } = await form.show(receiver.player);
            if (canceled)
                return cancelationReason;
            if (selection) {
                if (callbackIfYes instanceof Function)
                    callbackIfYes(receiver);
            }
            else {
                if (callbackIfNo instanceof Function)
                    callbackIfNo(receiver);
            }
        }
        catch (error) {
            errorLogger.log(error, error.stack, { key: 'showConformation', event: 'formShow' });
        }
    }
    ;
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
            if (body)
                form.body(body);
            form.button2('Yes');
            form.button1('No');
            let response;
            while (true) {
                response = await form.show(receiver);
                // content.warn({ response: native.stringify(response) });
                const { cancelationReason } = response;
                if (cancelationReason !== 'UserBusy')
                    break;
            }
            const { selection } = response;
            if (selection) {
                if (callbackIfYes instanceof Function)
                    callbackIfYes(receiver);
            }
            else {
                if (callbackIfNo instanceof Function)
                    callbackIfNo(receiver);
            }
        }
        catch (error) {
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
        this.playerData[id] ??= {};
        this.playerData[id].awaiting ??= {};
        const { awaiting } = this.playerData[id] ?? {};
        if (awaiting.hasOwnProperty(key))
            return receiver.sendMessage('§cyou are already awaiting the same form!');
        this.playerData[id].awaiting[key] = true;
        receiver.sendMessage('§l§eClose chat to open the Menu!');
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
     * @param {Player} receiver
     * @param {String} key
     * @param  {...any} extraArguments
     * @returns {GeneratedForm}
     * @private
     */
    generateForm(receiver, key, ...extraArguments) {
        // content.warn(this.forms);
        if (!((receiver?.player ?? receiver) instanceof Player))
            throw new Error(`receiver at params[0] is not of type: Player!`);
        if (typeof key !== 'string')
            throw new Error(`key at params[1] is not of type: String!`);
        if (!this.forms.hasOwnProperty(key))
            throw new Error(`key: ${key}, at params[1] has not been created!`);
        const type = Object.keys(this.forms[key] ?? {})[0];
        const form = new forms[type]();
        let globalSettings = {};
        const formSchema = schema[type].schema;
        let formData = this.forms[key][type];
        let formArray;
        if (formData instanceof Function) {
            formArray = formData(receiver, ...extraArguments);
            if (!(formArray instanceof Array))
                throw new Error(`typeKey: ${type}, in formData for key: ${key}, has value of a function that does not return type: Array!`);
        }
        else if (!(formData instanceof Array))
            throw new Error(`typeKey: ${type}, in formData for key: ${key}, has a value that is not of type: Array!`);
        else
            formArray = formData;
        formArray = [...formArray];
        let callbackArray = [];
        for (let i = 0; i < formArray.length; i++) {
            const object = formArray[i];
            // content.warn({ formArray, i, type: typeof object, array: isArray(object), extraArguments });
            let objectClone;
            if (object instanceof Array) {
                formArray = [...List.merge(List.delete(formArray, i), i--, object)];
            }
            else if (object instanceof Function) {
                let objectGenerated = object(receiver, i, ...extraArguments);
                if (objectGenerated instanceof Object) {
                    if (objectGenerated instanceof Array) {
                        formArray = [...List.merge(List.delete(formArray, i), i--, objectGenerated)];
                        // content.warn({ test: formArray });
                        continue;
                    }
                    else if (objectGenerated) {
                        objectClone = objectGenerated;
                        // content.warn({ testTwo: formArray });
                    }
                }
            }
            else if (object) {
                objectClone = { ...object };
            }
            if (!objectClone) {
                continue;
            }
            Object.entries(objectClone).forEach(([elementKey, value]) => {
                let global = false;
                if (formSchema.global.hasOwnProperty(elementKey))
                    global = true;
                let elementSchemaObject = formSchema?.[elementKey] ?? formSchema?.global?.[elementKey];
                let { schema: elementSchema, setupFunction, custom, hasCallback, root, formMethod, customProperties = [] } = elementSchemaObject ?? {};
                if (!elementSchema && root) {
                    elementSchema = formSchema?.[root]?.schema ?? formSchema?.global?.[root]?.schema;
                    if (!elementSchema)
                        throw new Error(`root: ${root}, at index: ${i}, in ${type} in formData for ${key} does not exist per schema!`);
                }
                if (!elementSchema)
                    throw new Error(`elementKey: ${elementKey}, at index: ${i}, in ${type} in formData for ${key} does not exist per schema!`);
                if (global) {
                    custom = (formMethod) ? false : true;
                    globalSettings[elementKey] = value;
                    // content.warn({ globalSettings });
                }
                if (setupFunction && !(setupFunction instanceof Function))
                    throw new Error(`setupFunction in ${elementKey}, in ${type} schema in ${type} in schema in schema.js is not of type: Function!`);
                if (hasCallback && typeof hasCallback !== 'boolean')
                    throw new Error(`hasCallback in ${elementKey}, in ${type} schema in ${type} in schema in schema.js is not of type: Function!`);
                if (value instanceof Function && !((typeOf(elementSchema) === 'Function') || (typeOf(elementSchema) === 'Array' && elementSchema.some(innerSchema => typeOf(innerSchema) === 'Function')))) {
                    value = value(receiver, i, ...extraArguments);
                }
                if (setupFunction instanceof Function) {
                    const extraElementFunction = setupFunction(receiver, this, form, key, value, i, callbackArray, objectClone, formArray, ...extraArguments);
                    if (extraElementFunction instanceof Function || (extraElementFunction instanceof Array && extraElementFunction.every(func => func && func instanceof Function)))
                        objectClone.extraElementFunction = extraElementFunction;
                }
                function setup(type) {
                    if (typeOf(type) === 'Object') {
                        Object.entries(type).forEach(([typeKey, typeValue]) => {
                            let innerValue = value?.[typeKey];
                            // content.warnType({ typeKey, typeValue });
                            if (innerValue instanceof Function && !((typeOf(typeValue) === 'Function') || (typeOf(typeValue) === 'Array' && typeValue.some(innerSchema => typeOf(innerSchema) === 'Function')))) {
                                innerValue = value(receiver, i, ...extraArguments);
                            }
                            if (typeValue instanceof Array) {
                                // content.warnType({ type, typeValue, innerValue });
                                if (!typeValue.some(innerType => {
                                    if (typeEquals(innerType, innerValue))
                                        return true;
                                }))
                                    throw new Error(`key: ${typeKey}, in elementKey: ${elementKey}, at index: ${i} in formData for ${key} per schema is not of type: ${orArray(typeValue.map(innerType => typeOf(innerType)))}!`);
                            }
                            else if (typeValue instanceof ArrayType) {
                                if (!(innerValue instanceof Array))
                                    throw new Error(`key: ${key}, in elementKey, at index: ${i}, in ${type} in formData for ${key} per schema is not of type: Array!`);
                                innerValue.forEach((bottemValue, a) => {
                                    Object.entries(typeValue.type).forEach(([innerKey, bottomType]) => {
                                        if (!typeEquals(bottomType, bottemValue))
                                            throw new Error(`innerKey: ${innerKey}, index: ${a}, key: ${key}, in elementKey: ${elementKey}, at index: ${i} in formData for ${key} per schema is not of type: ${typeOf(bottomType)}!`);
                                    });
                                });
                            }
                            else {
                                if (!typeEquals(typeValue, innerValue))
                                    throw new Error(`key: ${typeKey}, in elementKey: ${elementKey}, at index: ${i} in formData for ${key} per schema is not of type: ${typeOf(innerValue)}!`);
                            }
                            delete objectClone[elementKey][typeKey];
                            if (isDefined(innerValue))
                                objectClone[elementKey][typeKey] = innerValue;
                            if (typeKey === 'reopen' && isDefined(innerValue))
                                content.warn({ reopenTest: objectClone[elementKey] });
                        });
                        // content.warn({ elementKey, custom, global, formMethod, root, args: Object.values(objectClone[elementKey]), bool: custom || (global && !formMethod) });
                        if (custom || (global && !formMethod))
                            return;
                        const args = Object.entries(objectClone[elementKey]).filter(([propertyKey]) => !customProperties.includes(propertyKey)).map(([propertyKey, value]) => value);
                        form[(root ?? elementKey)](...args);
                    }
                    else {
                        // content.warnType({ type, value });
                        if (!typeEquals(type, value))
                            return true;
                        if (custom || (global && !formMethod))
                            return;
                        if (!isDefined(value))
                            return;
                        form[elementKey](value);
                    }
                }
                if (elementSchema instanceof Array) {
                    if (elementSchema.every(type => { setup(type); }))
                        throw new Error(`elementKey: ${elementKey}, at index: ${i}, in ${type} in formData for ${key} per schema is not of type: ${orArray(elementSchema.map(value => typeOf(value) ?? 'undefined'))}!`);
                    ;
                }
                else {
                    const shouldErrorFromShallowType = setup(elementSchema);
                    if (shouldErrorFromShallowType)
                        throw new Error(`elementKey: ${elementKey}, at index: ${i}in formData for ${key} per schema is not of type: ${typeOf(elementSchema)}!`);
                }
            });
            formArray[i] = objectClone;
            // content.warn({ formArray });
        }
        return { type, formArray, globalSettings, form, callbackArray };
    }
    /**
     * @param {Player} receiver
     * @param {String} key
     * @param {GeneratedForm} generatedForm return from formBuilder.generateForm
     * @param {Boolean} awaitShow
     * @param  {...any} extraArguments
     * @private
     */
    async showForm(receiver, key, generatedForm, awaitShow, ...extraArguments) {
        try {
            const { id } = receiver;
            this.playerData[id] ??= {};
            this.playerData[id].lastFormsShown ??= {};
            this.playerData[id].formTree ??= new RemovableTree();
            this.playerData[id].lastFormsShown[key] = extraArguments ?? [];
            this.playerData[id].formTree.next(key);
            let { form, formArray, type, globalSettings, callbackArray } = generatedForm;
            const elementsWithCallbacks = elementKeysWithCallbacksForType[type];
            content.warn({ t: '1', formArray });
            formArray = formArray.filter((slot) => (slot instanceof Object) ? Object.keys(slot).some(elementKey => elementsWithCallbacks[elementKey]) : false);
            // content.warn({ t: '2', formArray });
            // const response = await form.show(receiver);
            // const { canceled, cancelationReason } = response;
            /**
             * @type {FormResponse}
             */
            let response;
            while (true) {
                response = await form.show(receiver?.player ?? receiver);
                const { cancelationReason } = response;
                // content.warn({ awaitShow, cancelationReason, key });
                if (!awaitShow || cancelationReason !== FormCancelationReason.UserBusy) {
                    if (awaitShow && this.playerData[id]?.awaiting?.[key])
                        delete this.playerData[id].awaiting[key];
                    break;
                }
                ;
            }
            const { returnOnClose, returnOnPress, closeCallback, pressCallback, submitCallback } = globalSettings;
            const { canceled } = response;
            if (canceled) {
                if (closeCallback instanceof Function) {
                    closeCallback(receiver, response, ...extraArguments);
                }
                if (returnOnClose) {
                    const backKey = this.playerData[id].formTree.beforeLast();
                    ;
                    const backExtraArgs = this.playerData[id].lastFormsShown[backKey] ?? [];
                    this.show(receiver, backKey, ...backExtraArgs);
                }
                return;
            }
            const valuesKey = responses[type];
            switch (valuesKey) {
                case 'selection': {
                    const { selection } = response;
                    if (!selection)
                        return;
                    const element = formArray?.[selection ?? -1];
                    content.warn({ callbackArray, selection });
                    let { extraElementFunction, callback, reopen } = element;
                    let callbackArrayFunction;
                    if (extraElementFunction instanceof Array)
                        extraElementFunction = extraElementFunction[selection];
                    if (callbackArray instanceof Array)
                        callbackArrayFunction = callbackArray[selection];
                    if (callbackArrayFunction instanceof Function)
                        callbackArrayFunction(receiver, selection, ...extraArguments);
                    if (extraElementFunction instanceof Function)
                        extraElementFunction(receiver, selection, ...extraArguments);
                    if (callback instanceof Function)
                        callback(receiver, selection, ...extraArguments);
                    if (pressCallback instanceof Function)
                        pressCallback(receiver, response, ...extraArguments);
                    if (returnOnPress) {
                        const backKey = this.playerData[id].formTree.beforeLast();
                        ;
                        const backExtraArgs = this.playerData[id].lastFormsShown[backKey] ?? [];
                        this.show(receiver, backKey, ...backExtraArgs);
                    }
                    if (elementKeysWithReopen.some(elementKey => element?.[elementKey]?.reopen))
                        this.show(receiver, key, ...extraArguments);
                    break;
                }
                case 'formValues': {
                    const { formValues } = response;
                    // content.warn(formArray);
                    formArray.forEach((element, i) => {
                        let { extraElementFunction, callback } = element;
                        // content.warn({ extraElementFunction, formValues });
                        if (extraElementFunction instanceof Array)
                            extraElementFunction = extraElementFunction[formValues?.[i]];
                        if (extraElementFunction instanceof Function)
                            extraElementFunction(receiver, i, ...extraArguments);
                        if (callback instanceof Function)
                            callback(receiver, formValues?.[i], i, ...extraArguments);
                    });
                    if (submitCallback instanceof Function)
                        submitCallback(receiver, response, ...extraArguments);
                    if (returnOnPress) {
                        const backKey = this.playerData[id].formTree.beforeLast();
                        ;
                        const backExtraArgs = this.playerData[id].lastFormsShown[backKey] ?? [];
                        this.show(receiver, backKey, ...backExtraArgs);
                    }
                    break;
                }
            }
        }
        catch (error) {
            console.warn('at formBuilder.show', `key ${key}`, error, error.stack);
        }
    }
}
//# sourceMappingURL=class.js.map