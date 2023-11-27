import { world, Player as PlayerType } from '@minecraft/server';
import { ActionFormData as action, ModalFormData as modal, MessageFormData as message, FormResponse, FormCancelationReason, MessageFormResponse, ActionFormResponse, ModalFormResponse } from '@minecraft/server-ui';
import schema, { ActionData, ArrayType, Form, MessageData, ModalData, ChestData, RecordType } from './schema.js';
import errorLogger from '../error.js';
import { Player } from '../player/class.js';
import { ChestFormData as chest } from '../chest_ui/class.js';
/**
 * @type {{[typeKey: String]: {[elementKey: String]: Boolean}}}
 */
const elementKeysWithCallbacksForType = {} as { [typeKey: string]: { [elementKey: string]: Boolean; }; };
Object.entries(schema).forEach(([type, { schema }]) => {
	elementKeysWithCallbacksForType[type] ??= {};
	Object.entries(schema).forEach(([elementKey, { hasCallback = false }]) => {
		elementKeysWithCallbacksForType[type]![elementKey] = hasCallback;
	});
});

const elementKeysWithReopen = [] as string[];
Object.entries(schema).forEach(([type, { schema }]) => {
	elementKeysWithCallbacksForType[type] ??= {};
	Object.entries(schema).forEach(([elementKey, { schema = {} }]) => {
		if (schema.hasOwnProperty('reopen')) elementKeysWithReopen.push(elementKey);
	});
});
const forms = { action, modal, message, chest };
function typeOf(value: any) {
	if (typeof value === 'function') {
		try {
			return (new value()).constructor?.name;
		} catch {
			return 'Function';
		}
	}
	return value?.constructor?.name;
}

const content = {
	warn(...messages: any[]) {
		console.warn(messages.map(message => JSON.stringify(message, (key, value) => (value instanceof Function) ? '<f>' : value)).join(' '));
	},
	warnType(...messages: any[]) {
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
function isDefined(input: any) {
	return (input !== null && input !== undefined && !Number.isNaN(input));
}

function typeEquals(value: any, target: any) {
	return typeOf(value) === typeOf(target);
}
function orArray(array: any[] = []) {
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
	delete(array: any[], index: number): any[] {
		return array.filter((item, i) => i !== index);
	},
	merge(array: any[], index: number, target: any[], postfix = false): any[] {
		if (!(array instanceof Array)) throw new Error(`array at params[0] is not of type: Array`);
		if (!(target instanceof Array)) throw new Error(`target at params[2] is not of type: Array`);
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
	array: any[];
	constructor(array = []) {
		this.array = array;
	}
	public next(key: string) {
		const index = this.array.indexOf(key);
		if (index === -1) {
			this.array.push(key);
			return this;
		} else {
			if (this.array.length <= 1) return;
			this.array.splice(index + 1);
			return this;
		}
	}
	public last() {
		return this.array[this.array.length - 1];
	}
	public beforeLast(lastIndex = 0) {
		const value = this.array[this.array.length - lastIndex - 2];
		if (!value) return;
		this.next(value);
		return value;

	}
}
type DeepPartial<T> = {
	[K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
};
interface FormPerTypes {
	modal: modal;
	action: action;
	message: message;
	chest: chest;
};

interface GeneratedForm {
	type: keyof FormPerTypes;
	form: FormPerTypes[GeneratedForm['type']];
	formArray: ModalData[] | ActionData[] | MessageData[];
	globalSettings: { [key: string]: any; };
	callbackArray: (Function | boolean)[];
}

export class FormBuilder {
	playerData: { [id: string]: { awaiting?: { [key: string]: boolean; }, formTree?: RemovableTree, lastFormsShown?: { [formKey: string]: any[]; }; }; };
	forms: { [key: string]: Form; };
	constructor() {
		this.forms = {};
		/**
		 * @type {}
		 */
		this.playerData = {};
		world.afterEvents.playerLeave.subscribe(({ playerId }) => {
			if (this.playerData.hasOwnProperty(playerId)) delete this.playerData[playerId];
		});
	}
	create(key: string, data: Form) {
		this.forms[key] = data;
	}
	async showConformation(receiver: Player, body?: string, callbackIfYes?: (receiver: Player) => void, callbackIfNo?: (receiver: Player) => void) {
		try {
			const form = new message();
			if (body) form.body(body);
			form.button2('Yes');
			form.button1('No');
			const { selection, canceled, cancelationReason } = await form.show((receiver as any)?.root ?? receiver);
			if (canceled) return cancelationReason;
			if (selection) {
				if (callbackIfYes instanceof Function) callbackIfYes(receiver);
			} else {
				if (callbackIfNo instanceof Function) callbackIfNo(receiver);
			}
		} catch (error: any) {
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
	async showConformationAwait(receiver: Player, body?: string, callbackIfYes?: (receiver: Player) => void, callbackIfNo?: (receiver: Player) => void) {
		try {

			const form = new message();
			if (body) form.body(body);
			form.button2('Yes');
			form.button1('No');
			let response;
			while (true) {
				response = await form.show((receiver as any)?.root ?? receiver);
				// content.warn({ response: native.stringify(response) });
				const { cancelationReason } = response;
				if (cancelationReason !== 'UserBusy') break;
			}
			const { selection } = response;
			if (selection) {
				if (callbackIfYes instanceof Function) callbackIfYes(receiver);
			} else {
				if (callbackIfNo instanceof Function) callbackIfNo(receiver);
			}
		} catch (error: any) {
			errorLogger.log(error, error.stack, { key: 'showConformation', event: 'formShow' });
		}
	}
	/**
	 * @method showAwait
	 * @param {Player} receiver 
	 * @param {String} key 
	 * @param  {...any} extraArguments
	 */
	showAwait(receiver: Player, key: string, ...extraArguments: any[]) {
		const { id } = receiver;
		this.playerData[id] ??= {};
		this.playerData[id]!.awaiting ??= {};
		const { awaiting } = this.playerData[id] ?? {};
		if (awaiting!.hasOwnProperty(key)) return receiver.sendMessage('§cyou are already awaiting the same form!');
		this.playerData[id]!.awaiting![key] = true;
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
	show(receiver: Player, key: string, ...extraArguments: any[]) {
		const generatedForm = this.generateForm(receiver, key, ...extraArguments);
		this.showForm(receiver, key, generatedForm, false, ...extraArguments)
			.catch(error => console.warn(generatedForm.type, key, 'callback', error, error.stack));
	}
	// checkSchema(schema: any, target: any, root: boolean, stack: string) {
	// 	Object.entries(schema).forEach(([elementKey, value]) => {
	// 		if (root && elementKey === 'global') this.checkSchema(value, target, root, stack);
	// 		else if (elementKey === 'schema') this.checkSchema(value, target[elementKey], root, stack);

	// 	});
	// };
	/**
	 * @param {Player} receiver 
	 * @param {String} key 
	 * @param  {...any} extraArguments 
	 * @returns {GeneratedForm}
	 * @private
	 */
	generateForm(receiver: Player, key: string, ...extraArguments: any[]): GeneratedForm {
		// content.warn(this.forms);
		if (!(((receiver as any)?.root ?? receiver) instanceof PlayerType)) throw new Error(`receiver at params[0] is not of type: Player!`);
		if (typeof key !== 'string') throw new Error(`key at params[1] is not of type: String!`);
		if (!this.forms.hasOwnProperty(key)) throw new Error(`key: ${key}, at params[1] has not been created!`);
		const type = Object.keys(this.forms[key] ?? {})[0] as keyof typeof forms;
		const form = new forms[type]();
		let globalSettings = {};
		const formSchema = schema[type].schema;
		let formData = this.forms[key]![type];
		let formArray: ModalData[] | ActionData[] | MessageData[] | ChestData[];
		if (formData instanceof Function) {
			formArray = formData(receiver, ...(extraArguments as [1]));
			if (!(formArray instanceof Array)) throw new Error(`typeKey: ${type}, in formData for key: ${key}, has value of a function that does not return type: Array!`);
		} else if (!(formData instanceof Array)) throw new Error(`typeKey: ${type}, in formData for key: ${key}, has a value that is not of type: Array!`);
		else formArray = formData;
		formArray = [...formArray] as unknown as typeof formArray;
		let callbackArray: any[] = [];
		for (let i = 0; i < formArray.length; i++) {
			const object = formArray[i];
			// content.warn({ formArray, i, type: typeof object, array: isArray(object), extraArguments });
			let objectClone: any;
			if (object instanceof Array) {
				formArray = [...List.merge(List.delete(formArray, i), i--, object)];
			} else if (object instanceof Function) {
				let objectGenerated: any = object(receiver, i, ...extraArguments);
				if (objectGenerated instanceof Object) {
					if (objectGenerated instanceof Array) {
						formArray = [...List.merge(List.delete(formArray, i), i--, objectGenerated)];
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
			Object.entries(objectClone).forEach(([elementKey, value]) => {
				let global = false;
				if (formSchema.global.hasOwnProperty(elementKey)) global = true;
				let elementSchemaObject = (formSchema as any)?.[elementKey] ?? (formSchema as any)?.global?.[elementKey];
				let { schema: elementSchema, setupFunction, custom, hasCallback, root, formMethod, customProperties = [] } = elementSchemaObject ?? {};
				if (!elementSchema && root) {
					elementSchema = (formSchema as any)?.[root]?.schema ?? (formSchema as any)?.global?.[root]?.schema;
					if (!elementSchema) throw new Error(`root: ${root}, at index: ${i}, in ${type} in formData for ${key} does not exist per schema!`);
				}
				if (!elementSchema) throw new Error(`elementKey: ${elementKey}, at index: ${i}, in ${type} in formData for ${key} does not exist per schema!`);
				if (global) {

					custom = (formMethod) ? false : true;
					(globalSettings as any)[elementKey] = value;
					// content.warn({ globalSettings });
				}
				if (setupFunction && !(setupFunction instanceof Function)) throw new Error(`setupFunction in ${elementKey}, in ${type} schema in ${type} in schema in schema.js is not of type: Function!`);
				if (hasCallback && typeof hasCallback !== 'boolean') throw new Error(`hasCallback in ${elementKey}, in ${type} schema in ${type} in schema in schema.js is not of type: Function!`);
				if (value instanceof Function && !((typeOf(elementSchema) === 'Function') || (typeOf(elementSchema) === 'Array' && (elementSchema as any[]).some(innerSchema => typeOf(innerSchema) === 'Function')))) {
					value = value(receiver, i, ...extraArguments);
				}
				if (setupFunction instanceof Function) {
					const extraElementFunction = setupFunction(receiver, this, form, key, value, i, callbackArray, objectClone, formArray, ...extraArguments);
					if (extraElementFunction instanceof Function || (extraElementFunction instanceof Array && extraElementFunction.every(func => func && func instanceof Function))) objectClone.extraElementFunction = extraElementFunction;
				}
				function setup(type: any) {
					if (typeOf(type) === 'Object') {
						Object.entries(type).forEach(([typeKey, typeValue]) => {
							let innerValue = (value as any)?.[typeKey];
							// content.warnType({ typeKey, typeValue });
							if (innerValue instanceof Function && !((typeOf(typeValue) === 'Function') || (typeOf(typeValue) === 'Array' && (typeValue as any[]).some(innerSchema => typeOf(innerSchema) === 'Function')))) {
								innerValue = (value as Function)(receiver, i, ...extraArguments);
							}
							if (typeValue instanceof Array) {
								// content.warnType({ type, typeValue, innerValue });
								if (!typeValue.some(innerType => {
									if (typeEquals(innerType, innerValue)) return true;
								})) throw new Error(`key: ${typeKey}, in elementKey: ${elementKey}, at index: ${i} in formData for ${key} per schema is not of type: ${orArray(typeValue.map(innerType => typeOf(innerType)))}!`);

							} else if (typeValue instanceof ArrayType) {
								if (!(innerValue instanceof Array)) throw new Error(`key: ${key}, in elementKey, at index: ${i}, in ${type} in formData for ${key} per schema is not of type: Array!`);
								innerValue.forEach((bottemValue, a) => {
									Object.entries(typeValue.type).forEach(([innerKey, bottomType]) => {
										if (bottomType instanceof Array) {
											if (!bottomType.some(innerType => {
												if (typeEquals(innerType, bottemValue[innerKey]))
													return true;
											})) throw new Error(`innerKey: ${innerKey}, index: ${a}, key: ${key}, in elementKey: ${elementKey}, at index: ${i} in formData for ${key} per schema is not of type: ${orArray(bottomType.map(innerType => typeOf(innerType)))}!`);
										} else if (!typeEquals(bottomType, bottemValue[innerKey])) throw new Error(`innerKey: ${innerKey}, index: ${a}, key: ${key}, in elementKey: ${elementKey}, at index: ${i} in formData for ${key} per schema is not of type: ${typeOf(bottomType)}!`);
									});
								});
							} else if (typeValue instanceof RecordType) {
								if (!(innerValue instanceof Object)) throw new Error(`key: ${key}, in elementKey: ${elementKey}, at index: ${i}, in ${type} in formData for ${key} per schema is not of type: Object!`);
								Object.entries(innerValue).forEach(([innerKey, bottomValue]) => {
									if (!typeEquals(typeValue.type, bottomValue)) throw new Error(`innerKey: ${innerKey}, key: ${key}, in elementKey: ${elementKey}, at index: ${i} in formData for ${key} per schema is not of type: ${typeOf(typeValue.type)}!`);
								});
							} else {
								if (!typeEquals(typeValue, innerValue)) throw new Error(`key: ${typeKey}, in elementKey: ${elementKey}, at index: ${i} in formData for ${key} per schema is not of type: ${typeOf(innerValue)}!`);
							}
							delete objectClone[elementKey][typeKey];
							if (isDefined(innerValue)) objectClone[elementKey][typeKey] = innerValue;
							if (typeKey === 'reopen' && isDefined(innerValue)) content.warn({ reopenTest: objectClone[elementKey] });
						});
						// content.warn({ elementKey, custom, global, formMethod, root, args: Object.values(objectClone[elementKey]), bool: custom || (global && !formMethod) });
						if (custom || (global && !formMethod)) return;
						const args = Object.entries(objectClone[elementKey]).filter(([propertyKey]) => !customProperties.includes(propertyKey)).map(([propertyKey, value]) => value);
						(form[((root as keyof typeof form) ?? (elementKey as keyof typeof form))] as any)(...(args as any[]));
					} else {
						// content.warnType({ type, value });
						if (!typeEquals(type, value)) return true;
						if (custom || (global && !formMethod)) return;
						if (!isDefined(value)) return;
						(form as any)[elementKey](value);
					}
				}
				if (elementSchema instanceof Array) {
					if (elementSchema.every(type => { setup(type); })) throw new Error(`elementKey: ${elementKey}, at index: ${i}, in ${type} in formData for ${key} per schema is not of type: ${orArray(elementSchema.map(value => typeOf(value) ?? 'undefined'))}!`);;
				} else {
					const shouldErrorFromShallowType = setup(elementSchema);
					if (shouldErrorFromShallowType) throw new Error(`elementKey: ${elementKey}, at index: ${i}in formData for ${key} per schema is not of type: ${typeOf(elementSchema)}!`);
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
	async showForm(receiver: Player, key: string, generatedForm: GeneratedForm, awaitShow: boolean, ...extraArguments: any[]) {
		try {


			const { id } = receiver;
			this.playerData[id] ??= {} as typeof this.playerData[typeof id];
			this.playerData[id]!.lastFormsShown ??= {};
			this.playerData[id]!.formTree ??= new RemovableTree();
			this.playerData[id]!.lastFormsShown![key] = extraArguments ?? [];
			this.playerData[id]!.formTree!.next(key);
			let { form, formArray, type, globalSettings, callbackArray } = generatedForm;
			const elementsWithCallbacks = elementKeysWithCallbacksForType[type];
			content.warn({ t: '1', formArray });
			formArray = (formArray as any[]).filter((slot) => (slot instanceof Object) ? Object.keys(slot).some(elementKey => elementsWithCallbacks![elementKey]) : false);
			// content.warn({ t: '2', formArray });
			// const response = await form.show(receiver);
			// const { canceled, cancelationReason } = response;
			/**
			 * @type {FormResponse}
			 */
			let response: FormResponse;
			while (true) {
				response = await form.show((receiver as any)?.root ?? receiver);
				const { cancelationReason } = response;
				// content.warn({ awaitShow, cancelationReason, key });
				if (!awaitShow || cancelationReason !== FormCancelationReason.UserBusy) {
					if (awaitShow && this.playerData[id]?.awaiting?.[key]) delete this.playerData[id]!.awaiting![key];
					break;
				};
			}
			const { returnOnClose, returnOnPress, closeCallback, pressCallback, submitCallback } = globalSettings;
			const { canceled } = response;
			if (canceled) {
				if (closeCallback instanceof Function) {
					closeCallback(receiver, response, ...extraArguments);
				}
				if (returnOnClose) {
					const backKey = this.playerData[id]!.formTree!.beforeLast();;
					const backExtraArgs = this.playerData[id]!.lastFormsShown![backKey] ?? [];
					this.show(receiver, backKey, ...backExtraArgs);
				}
				return;
			}
			const valuesKey = responses[type];
			switch (valuesKey) {
				case 'selection': {
					const { selection } = response as MessageFormResponse | ActionFormResponse;
					if (!isDefined(selection)) return;
					const element = (formArray as ActionData[] | MessageData[])?.[selection ?? -1] as unknown as { extraElementFunction: Function, callback: Function, reopen: boolean; };

					content.warn({ callbackArray, selection });

					let { extraElementFunction, callback, reopen } = element;
					let callbackArrayFunction;
					if (extraElementFunction instanceof Array) extraElementFunction = extraElementFunction[selection!];
					if (callbackArray instanceof Array) callbackArrayFunction = callbackArray[selection!];
					if (callbackArrayFunction instanceof Function) callbackArrayFunction(receiver, selection, ...extraArguments);
					if (extraElementFunction instanceof Function) extraElementFunction(receiver, selection, ...extraArguments);
					if (callback instanceof Function) callback(receiver, selection, ...extraArguments);
					if (pressCallback instanceof Function) pressCallback(receiver, response, ...extraArguments);
					if (returnOnPress) {
						const backKey = this.playerData[id]!.formTree!.beforeLast();;
						const backExtraArgs = this.playerData[id]!.lastFormsShown![backKey] ?? [];
						this.show(receiver, backKey, ...backExtraArgs);
					}
					if (elementKeysWithReopen.some(elementKey => (element as any)?.[elementKey]?.reopen)) this.show(receiver, key, ...extraArguments);
					break;
				}
				case 'formValues': {
					const { formValues } = response as ModalFormResponse;
					// content.warn(formArray);
					formArray.forEach((element, i) => {
						let { extraElementFunction, callback } = element as unknown as { extraElementFunction: Function, callback: Function; };
						// content.warn({ extraElementFunction, formValues });
						if (extraElementFunction instanceof Array) extraElementFunction = extraElementFunction[formValues?.[i] as number];
						if (extraElementFunction instanceof Function) extraElementFunction(receiver, i, ...extraArguments);
						if (callback instanceof Function) callback(receiver, formValues?.[i], i, ...extraArguments);
					});
					if (submitCallback instanceof Function) submitCallback(receiver, response, ...extraArguments);
					if (returnOnPress) {
						const backKey = this.playerData[id]!.formTree!.beforeLast();;
						const backExtraArgs = this.playerData[id]!.lastFormsShown![backKey] ?? [];
						this.show(receiver, backKey, ...backExtraArgs);
					}
					break;
				}

			}
		} catch (error: any) {
			console.warn('at formBuilder.show', `key ${key}`, error, error.stack);
		}
	}
}

