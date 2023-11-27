
import { ActionFormData, MessageFormData, ModalFormData, ModalFormResponse, ActionFormResponse, MessageFormResponse } from "@minecraft/server-ui";
import { content, romanize, toProperCase } from "../../utilities.js";
import { FormBuilder } from "./class.js";
import { Player } from "../player/class.js";
import { ItemStack } from "@minecraft/server";
import { MinecraftEnchantmentTypes } from "patchy_api/vanilla-data.js";
import { ChestFormData, sizesUnion } from "../chest_ui/class.js";
function itemStackToItemData(itemStack: ItemStack) {
	const { typeId, nameTag, amount } = itemStack;
	let itemData: ItemData = { typeId };
	const lore = itemStack.getLore();
	let enchantmentList = itemStack.getComponent('enchantments')?.enchantments;
	let enchantments: Record<MinecraftEnchantmentTypes, number> = {} as Record<MinecraftEnchantmentTypes, number>;
	[...(enchantmentList ?? [])].forEach(({ level, type: { id } }) => {
		enchantments[id as MinecraftEnchantmentTypes] = level;
	});

	if (lore) itemData.lore = lore;
	if (amount) itemData.amount = amount;
	if (enchantmentList) itemData.enchantments = enchantments;
	if (nameTag) itemData.nameTag = nameTag;
	return itemData;
}
export type EnchantmentData = Record<MinecraftEnchantmentTypes, number>;
export type ItemData = {
	nameTag?: string,
	lore?: string[],
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
	callback?: (receiver: Player, i: number, ...extraArguments: any[]) => any;
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
	size?: sizesUnion;
	slot?: number;
};
export class ArrayType<T> {
	type: T;
	constructor(type: T) {
		this.type = type;
	}
}
export class RecordType<V> {
	type: V;
	constructor(type: V) {
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
				setupFunction: (receiver: Player, formClass: FormBuilder, form: ChestFormData, key: string, elementValue: ChestButton, elementIndex: number, callbackArray: any[], objectClone: any, ...extraArgs: any[]) => {
					let { slot, itemStack } = elementValue;
					if (itemStack instanceof Function) return;
					if (itemStack instanceof ItemStack) {
						itemStack = itemStackToItemData(itemStack);
					}
					objectClone.itemStack = itemStack;
					const { typeId, nameTag, lore, enchantments, amount } = itemStack;
					const description: string[] = [];
					if (enchantments) description.push(...Object.entries(enchantments).map(([id, level]) => `${toProperCase(id.replace(/\w+:/, ''))} ${romanize(level)}`));
					if (lore) description.push(...lore);
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
				setupFunction: (receiver: Player, formClass: FormBuilder, form: ChestFormData, key: string, elementValue: any, elementIndex: number, callbackArray: any[], objectClone: Object, ...extraArgs: any[]) => {
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
					itemStack: [ItemStack, {
						typeId: String,
						lore: [new ArrayType(String), undefined],
						enchantments: [new RecordType(Number), undefined],
						nameTag: [String, undefined]
					}],
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
				setupFunction: (receiver: Player, formClass: FormBuilder, form: ChestFormData, key: string, elementValue: ChestToggle, elementIndex: number, callbackArray: any[], objectClone: ChestData, formArray: Form['chest'], ...extraArgs: any[]) => {
					if (elementValue instanceof Function) return;
					let { initialisationFunction, cycleCallback, options, slot } = elementValue;
					const index = initialisationFunction(receiver, elementIndex, ...extraArgs);
					if (options instanceof Function) options = options(receiver, index, ...extraArgs);


					if (!isDefined(index) || index > options.length - 1 || index < 0) throw new Error(`index: ${index ?? 'undefined'} returned from initialisationFunction is not defined, less than 0, or greater than ${options.length - 1}`);
					let option = options?.[index];
					if (option instanceof Function) option = option(receiver, index, ...extraArgs);
					if (!option) throw new Error(`Function at ${elementIndex} in options at ${index} returned undefined`);
					let { itemStack, callback } = option;
					if (itemStack instanceof Function) return;
					if (itemStack instanceof ItemStack) {
						itemStack = itemStackToItemData(itemStack);
					}
					const { typeId, nameTag, lore, enchantments, amount } = itemStack;
					const description: string[] = [];
					if (enchantments) description.push(...Object.entries(enchantments).map(([id, level]) => `${toProperCase(id.replace(/\w+:/, ''))} ${romanize(level)}`));
					if (lore) description.push(...lore);
					form.button(slot, nameTag, (lore || enchantments) ? description : undefined, typeId, amount, Boolean(enchantments));

					return (() => {
						const newIndex = cycleCallback(receiver, elementIndex, ...extraArgs);
						if (options instanceof Function) throw new Error('!!!!!!!!!options instanceof Function fix this!!!!!!!!');
						if (!isDefined(newIndex) || index > options.length - 1 || index < 0) throw new Error(`index: ${newIndex ?? 'undefined'} returned from initialisationFunction is not defined, less than 0, or greater than ${options.length - 1}`);
						const { callback } = options[newIndex] ?? {};
						if (callback instanceof Function) callback(receiver, elementIndex, ...extraArgs);
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