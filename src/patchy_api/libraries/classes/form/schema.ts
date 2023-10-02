
import { ActionFormData, MessageFormData, ModalFormData, ModalFormResponse, ActionFormResponse, MessageFormResponse } from "@minecraft/server-ui";
import { content } from "../../utilities.js";
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


export class ArrayType {
	type: Object;
	constructor(type: Object) {
		this.type = type;
	}
}
/**
 * @type {}
 */
function isDefined(input: any) {
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
				setupFunction: (receiver: Player, formClass: FormBuilder, form: ActionFormData, key: string, elementValue: any, elementIndex: number, callbackArray: any[], objectClone: Object, ...extraArgs: any[]) => {
					return (() => {
						const { id } = receiver;
						formClass.playerData[id] ??= {};
						const memory = formClass.playerData[id];
						const backKey = memory!.formTree!.beforeLast();
						const backExtraArgs = memory!.lastFormsShown![backKey] ?? [];
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
				setupFunction: (receiver: Player, formClass: FormBuilder, form: ActionFormData, key: string, elementValue: any, elementIndex: number, callbackArray: any[], objectClone: Object, ...extraArgs: any[]) => {
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
				setupFunction: (receiver: Player, formClass: FormBuilder, form: ActionFormData, key: string, elementValue: { initialisationFunction: Function, cycleCallback: Function, options: { text: string, iconPath?: string, callback: Function; }[]; }, elementIndex: number, callbackArray: any[], objectClone: Object, ...extraArgs: any[]) => {
					const { initialisationFunction, cycleCallback, options } = elementValue;
					const index = initialisationFunction(receiver, elementIndex, ...extraArgs);

					if (!isDefined(index) || index > options.length - 1 || index < 0) throw new Error(`index: ${index ?? 'undefined'} returned from initialisationFunction is not defined, less than 0, or greater than ${options.length - 1}`);
					const { text = ' ', iconPath } = elementValue?.options?.[index] ?? {};
					(iconPath) ? form.button(text, iconPath) : form.button(text);
					return (() => {
						const newIndex = cycleCallback(receiver, elementIndex, ...extraArgs);
						if (!isDefined(newIndex) || index > options.length - 1 || index < 0) throw new Error(`index: ${newIndex ?? 'undefined'} returned from initialisationFunction is not defined, less than 0, or greater than ${options.length - 1}`);
						const { callback } = options[newIndex] ?? {};
						if (callback instanceof Function) callback(receiver, elementIndex, ...extraArgs);
					});
				},
				hasCallback: true
			}
		},
		type: ActionFormData
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
				setupFunction: (receiver: Player, formClass: FormBuilder, form: ModalFormData, key: string, elementValue: { label?: string, defaultValueIndex?: number, options: { callback: Function, text: string; }[]; }, elementIndex: number, callbackArray: any[], objectClone: Object, ...extraArgs: any[]) => {
					const { label = '', options, defaultValueIndex } = elementValue;
					const texts = options.map(({ text }) => text);
					if (isDefined(defaultValueIndex)) form.dropdown(label, texts, defaultValueIndex);
					else form.dropdown(label, texts);
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
				setupFunction: (receiver: Player, formClass: FormBuilder, form: MessageFormData, key: string, elementValue: string, elementIndex: number, callbackArray: any[], objectClone: { button1?: string, button2?: string, callback?: Function; }, ...extraArgs: any[]) => {
					const { button1 = '', callback } = objectClone;
					form.button1(button1);
					if (!callbackArray.length) callbackArray.push(false, false);
					if (!(callback instanceof Function)) return;
					callbackArray[0] = callback;
					delete objectClone.callback;
					content.warn({ t: 3, key, callbackArray, objectClone });
				}
			},
			button2: {
				schema: String,
				hasCallback: true,
				setupFunction: (receiver: Player, formClass: FormBuilder, form: MessageFormData, key: string, elementValue: string, elementIndex: number, callbackArray: any[], objectClone: { button1?: string, button2?: string, callback?: Function; }, ...extraArgs: any[]) => {
					const { button2 = '', callback } = objectClone;
					form.button2(button2);
					if (!callbackArray.length) callbackArray.push(false, false);
					if (!(callback instanceof Function)) return;
					callbackArray[1] = callback;
					delete objectClone.callback;
				}
			}
		},
		type: ModalFormData
	}

};
export default formSchemaObject;