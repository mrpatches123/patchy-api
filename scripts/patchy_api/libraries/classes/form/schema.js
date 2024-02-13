import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { content, romanize, toProperCase } from "../../utilities.js";
import { ItemStack } from "@minecraft/server";
import { ChestFormData } from "../chest_ui/class.js";
function itemStackToItemData(itemStack) {
    const { typeId, nameTag, amount } = itemStack;
    let itemData = { typeId };
    const lore = itemStack.getLore();
    let enchantmentList = itemStack.getComponent('enchantments')?.enchantments;
    let enchantments = {};
    [...(enchantmentList ?? [])].forEach(({ level, type: { id } }) => {
        enchantments[id] = level;
    });
    if (lore)
        itemData.lore = lore;
    if (amount)
        itemData.amount = amount;
    if (enchantmentList)
        itemData.enchantments = enchantments;
    if (nameTag)
        itemData.nameTag = nameTag;
    return itemData;
}
export class ArrayType {
    constructor(type) {
        this.type = type;
    }
}
export class RecordType {
    constructor(type) {
        this.type = type;
    }
}
/**
 * @type {}
 */
function isDefined(input) {
    return (input !== null && input !== undefined && !Number.isNaN(input));
}
const formSchemaObject = {
    action: {
        schema: {
            global: {
                title: {
                    schema: [String, undefined],
                    formMethod: true,
                },
                body: {
                    schema: [String, undefined],
                    formMethod: true,
                },
                pressCallback: {
                    schema: [Function, undefined],
                },
                closeCallback: {
                    schema: [Function, undefined],
                },
                callback: {
                    schema: [Function, undefined],
                },
                returnOnPress: {
                    schema: [Boolean, undefined]
                },
                returnOnClose: {
                    schema: [Boolean, undefined]
                }
            },
            button: {
                schema: {
                    text: String,
                    iconPath: [String, undefined],
                    reopen: [Boolean, undefined]
                },
                customProperties: ['reopen'],
                hasCallback: true
            },
            back: {
                root: 'button',
                schema: {
                    text: String,
                    iconPath: [String, undefined],
                },
                setupFunction: (receiver, formClass, form, key, elementValue, elementIndex, callbackArray, objectClone, ...extraArgs) => {
                    return (() => {
                        const { id } = receiver;
                        formClass.playerData[id] ??= {};
                        const memory = formClass.playerData[id];
                        const backKey = memory.formTree.beforeLast();
                        const backExtraArgs = memory.lastFormsShown[backKey] ?? [];
                        formClass.show(receiver, backKey, ...backExtraArgs);
                    });
                },
                hasCallback: true
            },
            refresh: {
                root: 'button',
                schema: {
                    text: String,
                    iconPath: [String, undefined],
                },
                setupFunction: (receiver, formClass, form, key, elementValue, elementIndex, callbackArray, objectClone, ...extraArgs) => {
                    return (() => formClass.show(receiver, key, ...extraArgs));
                },
                hasCallback: true
            },
            toggle: {
                custom: true,
                schema: {
                    options: new ArrayType({
                        text: String,
                        iconPath: [String, undefined],
                        callback: [Function, undefined],
                    }),
                    cycleCallback: Function,
                    initialisationFunction: Function,
                    reopen: [Boolean, undefined]
                },
                setupFunction: (receiver, formClass, form, key, elementValue, elementIndex, callbackArray, objectClone, ...extraArgs) => {
                    const { initialisationFunction, cycleCallback, options } = elementValue;
                    const index = initialisationFunction(receiver, elementIndex, ...extraArgs);
                    if (!isDefined(index) || index > options.length - 1 || index < 0)
                        throw new Error(`index: ${index ?? 'undefined'} returned from initialisationFunction is not defined, less than 0, or greater than ${options.length - 1}`);
                    const { text = ' ', iconPath } = elementValue?.options?.[index] ?? {};
                    (iconPath) ? form.button(text, iconPath) : form.button(text);
                    return (() => {
                        const newIndex = cycleCallback(receiver, elementIndex, ...extraArgs);
                        if (!isDefined(newIndex) || index > options.length - 1 || index < 0)
                            throw new Error(`index: ${newIndex ?? 'undefined'} returned from initialisationFunction is not defined, less than 0, or greater than ${options.length - 1}`);
                        const { callback } = options[newIndex] ?? {};
                        if (callback instanceof Function)
                            callback(receiver, elementIndex, ...extraArgs);
                    });
                },
                hasCallback: true
            }
        },
        type: ActionFormData
    },
    chest: {
        schema: {
            global: {
                title: {
                    schema: [String, undefined],
                    formMethod: true,
                },
                pressCallback: {
                    schema: [Function, undefined],
                },
                closeCallback: {
                    schema: [Function, undefined],
                },
                callback: {
                    schema: [Function, undefined],
                },
                returnOnPress: {
                    schema: [Boolean, undefined]
                },
                returnOnClose: {
                    schema: [Boolean, undefined]
                },
                size: {
                    schema: ['single', 'double', 'small', 'large', undefined],
                }
            },
            button: {
                schema: {
                    itemStack: [ItemStack, {
                            typeId: String,
                            lore: [new ArrayType(String), undefined],
                            enchantments: [new RecordType(Number), undefined],
                            nameTag: [String, undefined]
                        }],
                    reopen: [Boolean, undefined],
                    slot: [Number, undefined]
                },
                customProperties: ['reopen', 'itemStack'],
                hasCallback: true,
                setupFunction: (receiver, formClass, form, key, elementValue, elementIndex, callbackArray, objectClone, ...extraArgs) => {
                    let { slot, itemStack } = elementValue;
                    if (itemStack instanceof Function)
                        return;
                    if (itemStack instanceof ItemStack) {
                        itemStack = itemStackToItemData(itemStack);
                    }
                    objectClone.itemStack = itemStack;
                    const { typeId, nameTag, lore, enchantments, amount } = itemStack;
                    const description = [];
                    if (enchantments)
                        description.push(...Object.entries(enchantments).map(([id, level]) => `${toProperCase(id.replace(/\w+:/, ''))} ${romanize(level)}`));
                    if (lore)
                        description.push(...lore);
                    form.button(slot, nameTag, (lore || enchantments) ? description : undefined, typeId, amount, Boolean(enchantments));
                },
            },
            back: {
                root: 'button',
                schema: {
                    itemStack: [ItemStack, {
                            typeId: String,
                            lore: [new ArrayType(String), undefined],
                            enchantments: [new RecordType(Number), undefined],
                            nameTag: [String, undefined]
                        }],
                },
                setupFunction: (receiver, formClass, form, key, elementValue, elementIndex, callbackArray, objectClone, ...extraArgs) => {
                    return (() => {
                        const { id } = receiver;
                        formClass.playerData[id] ??= {};
                        const memory = formClass.playerData[id];
                        const backKey = memory.formTree.beforeLast();
                        const backExtraArgs = memory.lastFormsShown[backKey] ?? [];
                        formClass.show(receiver, backKey, ...backExtraArgs);
                    });
                },
                hasCallback: true
            },
            refresh: {
                root: 'button',
                schema: {
                    itemStack: [ItemStack, {
                            typeId: String,
                            lore: [new ArrayType(String), undefined],
                            enchantments: [new RecordType(Number), undefined],
                            nameTag: [String, undefined]
                        }],
                },
                setupFunction: (receiver, formClass, form, key, elementValue, elementIndex, callbackArray, objectClone, ...extraArgs) => {
                    return (() => formClass.show(receiver, key, ...extraArgs));
                },
                hasCallback: true
            },
            toggle: {
                custom: true,
                schema: {
                    options: new ArrayType({
                        itemStack: [ItemStack, {
                                typeId: String,
                                lore: [new ArrayType(String), undefined],
                                enchantments: [new RecordType(Number), undefined],
                                nameTag: [String, undefined]
                            }],
                        slot: [Number, undefined],
                        callback: [Function, undefined],
                    }),
                    cycleCallback: Function,
                    initialisationFunction: Function,
                    reopen: [Boolean, undefined]
                },
                setupFunction: (receiver, formClass, form, key, elementValue, elementIndex, callbackArray, objectClone, formArray, ...extraArgs) => {
                    if (elementValue instanceof Function)
                        return;
                    let { initialisationFunction, cycleCallback, options, slot } = elementValue;
                    const index = initialisationFunction(receiver, elementIndex, ...extraArgs);
                    if (options instanceof Function)
                        options = options(receiver, index, ...extraArgs);
                    if (!isDefined(index) || index > options.length - 1 || index < 0)
                        throw new Error(`index: ${index ?? 'undefined'} returned from initialisationFunction is not defined, less than 0, or greater than ${options.length - 1}`);
                    let option = options?.[index];
                    if (option instanceof Function)
                        option = option(receiver, index, ...extraArgs);
                    if (!option)
                        throw new Error(`Function at ${elementIndex} in options at ${index} returned undefined`);
                    let { itemStack, callback } = option;
                    if (itemStack instanceof Function)
                        return;
                    if (itemStack instanceof ItemStack) {
                        itemStack = itemStackToItemData(itemStack);
                    }
                    const { typeId, nameTag, lore, enchantments, amount } = itemStack;
                    const description = [];
                    if (enchantments)
                        description.push(...Object.entries(enchantments).map(([id, level]) => `${toProperCase(id.replace(/\w+:/, ''))} ${romanize(level)}`));
                    if (lore)
                        description.push(...lore);
                    form.button(slot, nameTag, (lore || enchantments) ? description : undefined, typeId, amount, Boolean(enchantments));
                    return (() => {
                        const newIndex = cycleCallback(receiver, elementIndex, ...extraArgs);
                        if (options instanceof Function)
                            throw new Error('!!!!!!!!!options instanceof Function fix this!!!!!!!!');
                        if (!isDefined(newIndex) || index > options.length - 1 || index < 0)
                            throw new Error(`index: ${newIndex ?? 'undefined'} returned from initialisationFunction is not defined, less than 0, or greater than ${options.length - 1}`);
                        const { callback } = options[newIndex] ?? {};
                        if (callback instanceof Function)
                            callback(receiver, elementIndex, ...extraArgs);
                    });
                },
                hasCallback: true
            }
        },
        type: ChestFormData
    },
    modal: {
        schema: {
            global: {
                title: {
                    schema: [String, undefined],
                    formMethod: true,
                },
                submitCallback: {
                    schema: [Function, undefined]
                },
                closeCallBack: {
                    schema: [Function, undefined]
                },
                callback: {
                    schema: [Function, undefined]
                },
                returnOnSubmit: {
                    schema: [Boolean, undefined]
                },
                returnOnClose: {
                    schema: [Boolean, undefined]
                }
            },
            dropdown: {
                custom: true,
                schema: {
                    label: [String, undefined],
                    defaultValueIndex: [Number, undefined],
                    options: new ArrayType({
                        text: String,
                        callback: [Function, undefined],
                    })
                },
                setupFunction: (receiver, formClass, form, key, elementValue, elementIndex, callbackArray, objectClone, ...extraArgs) => {
                    const { label = '', options, defaultValueIndex } = elementValue;
                    const texts = options.map(({ text }) => text);
                    if (isDefined(defaultValueIndex))
                        form.dropdown(label, texts, defaultValueIndex);
                    else
                        form.dropdown(label, texts);
                    return options.map(({ callback }) => callback);
                },
                hasCallback: true
            },
            slider: {
                schema: {
                    label: String,
                    minimumValue: Number,
                    maximumValue: Number,
                    valueStep: Number,
                    defaultValue: [Number, undefined]
                },
                hasCallback: true
            },
            textField: {
                schema: {
                    label: String,
                    placeholderText: String,
                    defaultValue: [String, undefined],
                },
                hasCallback: true
            },
            toggle: {
                schema: {
                    label: String,
                    defaultValue: [Boolean, undefined],
                },
                hasCallback: true
            }
        },
        type: ModalFormData
    },
    message: {
        schema: {
            global: {
                title: {
                    schema: [String, undefined],
                    formMethod: true,
                },
                body: {
                    schema: [String, undefined],
                    formMethod: true,
                },
                pressCallback: {
                    schema: [Function, undefined],
                },
                closeCallBack: {
                    schema: [Function, undefined],
                },
                callback: {
                    schema: [Function, undefined],
                },
                returnOnPress: {
                    schema: [Boolean, undefined]
                },
                returnOnClose: {
                    schema: [Boolean, undefined]
                },
                callbacks: new ArrayType([Function, undefined])
            },
            button1: {
                schema: String,
                hasCallback: true,
                setupFunction: (receiver, formClass, form, key, elementValue, elementIndex, callbackArray, objectClone, ...extraArgs) => {
                    const { button1 = '', callback } = objectClone;
                    form.button1(button1);
                    if (!callbackArray.length)
                        callbackArray.push(false, false);
                    if (!(callback instanceof Function))
                        return;
                    callbackArray[0] = callback;
                    delete objectClone.callback;
                    content.warn({ t: 3, key, callbackArray, objectClone });
                }
            },
            button2: {
                schema: String,
                hasCallback: true,
                setupFunction: (receiver, formClass, form, key, elementValue, elementIndex, callbackArray, objectClone, ...extraArgs) => {
                    const { button2 = '', callback } = objectClone;
                    form.button2(button2);
                    if (!callbackArray.length)
                        callbackArray.push(false, false);
                    if (!(callback instanceof Function))
                        return;
                    callbackArray[1] = callback;
                    delete objectClone.callback;
                }
            }
        },
        type: ModalFormData
    }
};
export default formSchemaObject;
//# sourceMappingURL=schema.js.map