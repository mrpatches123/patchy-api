import { ActionFormData, MessageFormData, ModalFormData, ModalFormResponse } from "@minecraft/server-ui";
import { FormBuilder } from "./class.js";
import { Player } from "../player/class.js";
export type Form = {
    action?: ActionData[] | ((receiver: Player, i: number, ...extraArguments: any[]) => ActionData[]);
    modal?: ModalData[] | ((receiver: Player, i: number, ...extraArguments: any[]) => ModalData[]);
    message?: MessageData[] | ((receiver: Player, i: number, ...extraArguments: any[]) => MessageData[]);
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
} | ((receiver: Player, ...extraArguments: any[]) => (ActionData[] | ActionData)) | ActionData[];
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
} | ((receiver: Player, ...extraArguments: any[]) => (ModalData[] | ModalData));
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
} | ((receiver: Player, ...extraArguments: any[]) => (MessageData[] | MessageData));
export declare class ArrayType {
    type: Object;
    constructor(type: Object);
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
                    options: ArrayType;
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
                    options: ArrayType;
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
                callbacks: ArrayType;
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
