import { ActionFormData, MessageFormData, ModalFormData, ModalFormResponse } from "@minecraft/server-ui";
import { FormBuilder } from "./class.js";
import { Player } from "../player/class.js";
import { ItemStack } from "@minecraft/server";
import { MinecraftEnchantmentTypes } from "patchy_api/vanilla-data.js";
import { ChestFormData, sizesUnion } from "../chest_ui/class.js";
export type EnchantmentData = Record<MinecraftEnchantmentTypes, number>;
export type ItemData = {
    nameTag?: string;
    lore?: string[];
    enchantments?: EnchantmentData;
    typeId: string;
    amount?: number;
};
export type Form = {
    action?: ActionData[] | ((receiver: Player, ...extraArguments: any[]) => ActionData[]);
    modal?: ModalData[] | ((receiver: Player, ...extraArguments: any[]) => ModalData[]);
    message?: MessageData[] | ((receiver: Player, ...extraArguments: any[]) => MessageData[]);
    chest?: ChestData[] | ((receiver: Player, ...extraArguments: any[]) => ChestData[]);
};
export type ActionData = {
    title?: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
    body?: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
    button?: ActionButton | ((receiver: Player, i: number, ...extraArguments: any[]) => ActionButton);
    back?: ActionButton | ((receiver: Player, i: number, ...extraArguments: any[]) => ActionBack);
    refresh?: ActionButton | ((receiver: Player, i: number, ...extraArguments: any[]) => ActionRefresh);
    toggle?: ActionToggle | ((receiver: Player, i: number, ...extraArguments: any[]) => ActionButton);
    returnOnPress?: boolean | ((receiver: Player, i: number, ...extraArguments: any[]) => boolean);
    returnOnClose?: boolean | ((receiver: Player, i: number, ...extraArguments: any[]) => boolean);
    closeCallback?: (receiver: Player, i: number, ...extraArguments: any[]) => any;
    pressCallback?: (receiver: Player, i: number, ...extraArguments: any[]) => any;
    callback?: (receiver: Player, i: number, ...extraArguments: any[]) => any;
} | ((receiver: Player, ...extraArguments: any[]) => (ActionData[] | ActionData)) | ActionData[] | undefined;
type ActionButton = string | {
    text: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
    iconPath?: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
    reopen?: boolean | ((receiver: Player, i: number, ...extraArguments: any[]) => boolean);
};
type ActionToggleOptions = {
    text: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
    iconPath?: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
    callback: (receiver: Player, i: number, ...extraArguments: any[]) => any;
    reopen?: boolean | ((receiver: Player, i: number, ...extraArguments: any[]) => boolean);
};
type ActionToggle = {
    options: ActionToggleOptions[] | ((receiver: Player, i: number, ...extraArguments: any[]) => ActionToggleOptions[]);
    cycleCallback: (receiver: Player, i: number, ...extraArguments: any[]) => number;
    initialisationFunction: (receiver: Player, i: number, ...extraArguments: any[]) => number;
};
type ActionButtonNoReopen = {
    text: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
    iconPath?: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
};
type ActionRefresh = ActionButtonNoReopen;
type ActionBack = ActionButtonNoReopen;
export type ModalData = {
    title?: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
    dropdown?: ModalDropDown | ((receiver: Player, i: number, ...extraArguments: any[]) => ModalDropDown);
    slider?: ModalSlider | ((receiver: Player, i: number, ...extraArguments: any[]) => ModalSlider);
    textField?: ModalTextField | ((receiver: Player, i: number, ...extraArguments: any[]) => ModalTextField);
    toggle?: ModalToggle | ((receiver: Player, i: number, ...extraArguments: any[]) => ModalToggle);
    closeCallback?: (receiver: Player, formResponse: ModalFormResponse, ...extraArguments: any[]) => any;
    submitcallback?: (receiver: Player, formResponse: ModalFormResponse, ...extraArguments: any[]) => any;
    callback?: (receiver: Player, i: number, ...extraArguments: any[]) => any;
    returnOnSubmit?: boolean | ((receiver: Player, i: number, ...extraArguments: any[]) => boolean);
    returnOnClose?: boolean | ((receiver: Player, i: number, ...extraArguments: any[]) => boolean);
} | ((receiver: Player, ...extraArguments: any[]) => (ModalData[] | ModalData)) | undefined;
type ModalDropDown = {
    defaultValueIndex?: number | ((receiver: Player, i: number, ...extraArguments: any[]) => number);
    label?: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
    options: ModalDropdownOptions[] | ((receiver: Player, i: number, ...extraArguments: any[]) => ModalDropdownOptions[]);
};
type ModalDropdownOptions = {
    text: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
    callback?: (receiver: Player, selection: number, ...extraArguments: any[]) => any;
};
type ModalSlider = {
    label: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
    minimumValue: number | ((receiver: Player, i: number, ...extraArguments: any[]) => number);
    maximumValue: number | ((receiver: Player, i: number, ...extraArguments: any[]) => number);
    valueStep: number | ((receiver: Player, i: number, ...extraArguments: any[]) => number);
    defaultValue?: number | ((receiver: Player, i: number, ...extraArguments: any[]) => number);
};
type ModalTextField = {
    label: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
    placeholderText: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
    defaultValue?: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
};
type ModalToggle = {
    label: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
    defaultValue?: boolean | ((receiver: Player, i: number, ...extraArguments: any[]) => boolean);
};
export type MessageData = {
    title?: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
    body?: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
    button1?: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
    button2?: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
    reopen?: boolean | ((receiver: Player, i: number, ...extraArguments: any[]) => boolean);
    returnOnPress?: boolean | ((receiver: Player, i: number, ...extraArguments: any[]) => boolean);
    returnOnClose?: boolean | ((receiver: Player, i: number, ...extraArguments: any[]) => boolean);
    callback?: (receiver: Player, i: number, ...extraArguments: any[]) => any;
    closeCallback?: (receiver: Player, i: number, ...extraArguments: any[]) => any;
    pressCallback?: (receiver: Player, i: number, ...extraArguments: any[]) => any;
} | ((receiver: Player, ...extraArguments: any[]) => (MessageData[] | MessageData)) | undefined;
type ChestToggleOptions = {
    itemStack: ItemStack | ItemData | ((receiver: Player, i: number, ...extraArguments: any[]) => ItemStack | ItemData);
    callback: (receiver: Player, i: number, ...extraArguments: any[]) => any;
    reopen?: boolean | ((receiver: Player, i: number, ...extraArguments: any[]) => boolean);
};
type ChestButton = {
    itemStack: ItemStack | ItemData | ((receiver: Player, i: number, ...extraArguments: any[]) => ItemStack | ItemData);
    reopen?: boolean | ((receiver: Player, i: number, ...extraArguments: any[]) => boolean);
    slot?: number;
};
type ChestBack = {
    itemStack: ItemStack | ItemData | ((receiver: Player, i: number, ...extraArguments: any[]) => ItemStack | ItemData);
    slot?: number;
};
type ChestToggle = {
    options: ChestToggleOptions[] | ((receiver: Player, i: number, ...extraArguments: any[]) => ChestToggleOptions[]);
    cycleCallback: (receiver: Player, i: number, ...extraArguments: any[]) => number;
    initialisationFunction: (receiver: Player, i: number, ...extraArguments: any[]) => number;
    slot?: number;
};
export type ChestData = {
    title?: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
    button?: ChestButton | ((receiver: Player, i: number, ...extraArguments: any[]) => ChestButton);
    back?: ChestBack | ((receiver: Player, i: number, ...extraArguments: any[]) => ChestBack);
    refresh?: ChestBack | ((receiver: Player, i: number, ...extraArguments: any[]) => ChestBack);
    toggle?: ChestToggle | ((receiver: Player, i: number, ...extraArguments: any[]) => ChestToggle);
    returnOnPress?: boolean | ((receiver: Player, i: number, ...extraArguments: any[]) => boolean);
    returnOnClose?: boolean | ((receiver: Player, i: number, ...extraArguments: any[]) => boolean);
    closeCallback?: (receiver: Player, i: number, ...extraArguments: any[]) => any;
    pressCallback?: (receiver: Player, i: number, ...extraArguments: any[]) => any;
    callback?: (receiver: Player, i: number, ...extraArguments: any[]) => any;
    size: sizesUnion;
    slot?: number;
};
export declare class ArrayType<T> {
    type: T;
    constructor(type: T);
}
export declare class RecordType<V> {
    type: V;
    constructor(type: V);
}
declare const formSchemaObject: {
    action: {
        schema: {
            global: {
                title: {
                    schema: (StringConstructor | undefined)[];
                    formMethod: boolean;
                };
                body: {
                    schema: (StringConstructor | undefined)[];
                    formMethod: boolean;
                };
                pressCallback: {
                    schema: (FunctionConstructor | undefined)[];
                };
                closeCallback: {
                    schema: (FunctionConstructor | undefined)[];
                };
                callback: {
                    schema: (FunctionConstructor | undefined)[];
                };
                returnOnPress: {
                    schema: (BooleanConstructor | undefined)[];
                };
                returnOnClose: {
                    schema: (BooleanConstructor | undefined)[];
                };
            };
            button: {
                schema: {
                    text: StringConstructor;
                    iconPath: (StringConstructor | undefined)[];
                    reopen: (BooleanConstructor | undefined)[];
                };
                customProperties: string[];
                hasCallback: boolean;
            };
            back: {
                root: string;
                schema: {
                    text: StringConstructor;
                    iconPath: (StringConstructor | undefined)[];
                };
                setupFunction: (receiver: Player, formClass: FormBuilder, form: ActionFormData, key: string, elementValue: any, elementIndex: number, callbackArray: any[], objectClone: Object, ...extraArgs: any[]) => () => void;
                hasCallback: boolean;
            };
            refresh: {
                root: string;
                schema: {
                    text: StringConstructor;
                    iconPath: (StringConstructor | undefined)[];
                };
                setupFunction: (receiver: Player, formClass: FormBuilder, form: ActionFormData, key: string, elementValue: any, elementIndex: number, callbackArray: any[], objectClone: Object, ...extraArgs: any[]) => () => void;
                hasCallback: boolean;
            };
            toggle: {
                custom: boolean;
                schema: {
                    options: ArrayType<{
                        text: StringConstructor;
                        iconPath: (StringConstructor | undefined)[];
                        callback: (FunctionConstructor | undefined)[];
                    }>;
                    cycleCallback: FunctionConstructor;
                    initialisationFunction: FunctionConstructor;
                    reopen: (BooleanConstructor | undefined)[];
                };
                setupFunction: (receiver: Player, formClass: FormBuilder, form: ActionFormData, key: string, elementValue: {
                    initialisationFunction: Function;
                    cycleCallback: Function;
                    options: {
                        text: string;
                        iconPath?: string;
                        callback: Function;
                    }[];
                }, elementIndex: number, callbackArray: any[], objectClone: Object, ...extraArgs: any[]) => () => void;
                hasCallback: boolean;
            };
        };
        type: typeof ActionFormData;
    };
    chest: {
        schema: {
            global: {
                title: {
                    schema: (StringConstructor | undefined)[];
                    formMethod: boolean;
                };
                pressCallback: {
                    schema: (FunctionConstructor | undefined)[];
                };
                closeCallback: {
                    schema: (FunctionConstructor | undefined)[];
                };
                callback: {
                    schema: (FunctionConstructor | undefined)[];
                };
                returnOnPress: {
                    schema: (BooleanConstructor | undefined)[];
                };
                returnOnClose: {
                    schema: (BooleanConstructor | undefined)[];
                };
                size: {
                    schema: (string | undefined)[];
                };
            };
            button: {
                schema: {
                    itemStack: (typeof ItemStack | {
                        typeId: StringConstructor;
                        lore: (ArrayType<StringConstructor> | undefined)[];
                        enchantments: (RecordType<NumberConstructor> | undefined)[];
                        nameTag: (StringConstructor | undefined)[];
                    })[];
                    reopen: (BooleanConstructor | undefined)[];
                    slot: (NumberConstructor | undefined)[];
                };
                customProperties: string[];
                hasCallback: boolean;
                setupFunction: (receiver: Player, formClass: FormBuilder, form: ChestFormData, key: string, elementValue: ChestButton, elementIndex: number, callbackArray: any[], objectClone: Object, ...extraArgs: any[]) => void;
            };
            back: {
                root: string;
                schema: {
                    itemStack: (typeof ItemStack | {
                        typeId: StringConstructor;
                        lore: (ArrayType<StringConstructor> | undefined)[];
                        enchantments: (RecordType<NumberConstructor> | undefined)[];
                        nameTag: (StringConstructor | undefined)[];
                    })[];
                };
                setupFunction: (receiver: Player, formClass: FormBuilder, form: ChestFormData, key: string, elementValue: any, elementIndex: number, callbackArray: any[], objectClone: Object, ...extraArgs: any[]) => () => void;
                hasCallback: boolean;
            };
            refresh: {
                root: string;
                schema: {
                    itemStack: (typeof ItemStack | {
                        typeId: StringConstructor;
                        lore: (ArrayType<StringConstructor> | undefined)[];
                        enchantments: (RecordType<NumberConstructor> | undefined)[];
                        nameTag: (StringConstructor | undefined)[];
                    })[];
                };
                setupFunction: (receiver: Player, formClass: FormBuilder, form: ActionFormData, key: string, elementValue: any, elementIndex: number, callbackArray: any[], objectClone: Object, ...extraArgs: any[]) => () => void;
                hasCallback: boolean;
            };
            toggle: {
                custom: boolean;
                schema: {
                    options: ArrayType<{
                        itemStack: (typeof ItemStack | {
                            typeId: StringConstructor;
                            lore: (ArrayType<StringConstructor> | undefined)[];
                            enchantments: (RecordType<NumberConstructor> | undefined)[];
                            nameTag: (StringConstructor | undefined)[];
                        })[];
                        slot: (NumberConstructor | undefined)[];
                        callback: (FunctionConstructor | undefined)[];
                    }>;
                    cycleCallback: FunctionConstructor;
                    initialisationFunction: FunctionConstructor;
                    reopen: (BooleanConstructor | undefined)[];
                };
                setupFunction: (receiver: Player, formClass: FormBuilder, form: ChestFormData, key: string, elementValue: ChestToggle, elementIndex: number, callbackArray: any[], objectClone: ChestData, formArray: Form['chest'], ...extraArgs: any[]) => (() => void) | undefined;
                hasCallback: boolean;
            };
        };
        type: typeof ChestFormData;
    };
    modal: {
        schema: {
            global: {
                title: {
                    schema: (StringConstructor | undefined)[];
                    formMethod: boolean;
                };
                submitCallback: {
                    schema: (FunctionConstructor | undefined)[];
                };
                closeCallBack: {
                    schema: (FunctionConstructor | undefined)[];
                };
                callback: {
                    schema: (FunctionConstructor | undefined)[];
                };
                returnOnSubmit: {
                    schema: (BooleanConstructor | undefined)[];
                };
                returnOnClose: {
                    schema: (BooleanConstructor | undefined)[];
                };
            };
            dropdown: {
                custom: boolean;
                schema: {
                    label: (StringConstructor | undefined)[];
                    defaultValueIndex: (NumberConstructor | undefined)[];
                    options: ArrayType<{
                        text: StringConstructor;
                        callback: (FunctionConstructor | undefined)[];
                    }>;
                };
                setupFunction: (receiver: Player, formClass: FormBuilder, form: ModalFormData, key: string, elementValue: {
                    label?: string;
                    defaultValueIndex?: number;
                    options: {
                        callback: Function;
                        text: string;
                    }[];
                }, elementIndex: number, callbackArray: any[], objectClone: Object, ...extraArgs: any[]) => Function[];
                hasCallback: boolean;
            };
            slider: {
                schema: {
                    label: StringConstructor;
                    minimumValue: NumberConstructor;
                    maximumValue: NumberConstructor;
                    valueStep: NumberConstructor;
                    defaultValue: (NumberConstructor | undefined)[];
                };
                hasCallback: boolean;
            };
            textField: {
                schema: {
                    label: StringConstructor;
                    placeholderText: StringConstructor;
                    defaultValue: (StringConstructor | undefined)[];
                };
                hasCallback: boolean;
            };
            toggle: {
                schema: {
                    label: StringConstructor;
                    defaultValue: (BooleanConstructor | undefined)[];
                };
                hasCallback: boolean;
            };
        };
        type: typeof ModalFormData;
    };
    message: {
        schema: {
            global: {
                title: {
                    schema: (StringConstructor | undefined)[];
                    formMethod: boolean;
                };
                body: {
                    schema: (StringConstructor | undefined)[];
                    formMethod: boolean;
                };
                pressCallback: {
                    schema: (FunctionConstructor | undefined)[];
                };
                closeCallBack: {
                    schema: (FunctionConstructor | undefined)[];
                };
                callback: {
                    schema: (FunctionConstructor | undefined)[];
                };
                returnOnPress: {
                    schema: (BooleanConstructor | undefined)[];
                };
                returnOnClose: {
                    schema: (BooleanConstructor | undefined)[];
                };
                callbacks: ArrayType<(FunctionConstructor | undefined)[]>;
            };
            button1: {
                schema: StringConstructor;
                hasCallback: boolean;
                setupFunction: (receiver: Player, formClass: FormBuilder, form: MessageFormData, key: string, elementValue: string, elementIndex: number, callbackArray: any[], objectClone: {
                    button1?: string;
                    button2?: string;
                    callback?: Function;
                }, ...extraArgs: any[]) => void;
            };
            button2: {
                schema: StringConstructor;
                hasCallback: boolean;
                setupFunction: (receiver: Player, formClass: FormBuilder, form: MessageFormData, key: string, elementValue: string, elementIndex: number, callbackArray: any[], objectClone: {
                    button1?: string;
                    button2?: string;
                    callback?: Function;
                }, ...extraArgs: any[]) => void;
            };
        };
        type: typeof ModalFormData;
    };
};
export default formSchemaObject;
