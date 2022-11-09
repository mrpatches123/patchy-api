import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";


function isNumberDefined(input) {
	return (input !== false && input !== null && input !== undefined && input !== NaN && input !== Infinity);
}

export class ModalForm {
	constructor() {
		this.form = new ModalFormData();
		this.callbacks = [];
	}
	/**
	 * @method title
	 * @param {String} titleText 
	 * @returns {ModalForm}
	 */
	title(titleText) {
		if (typeof titleText !== 'string') throw new Error(`titleText: ${titleText}, at params[0] is not a String!`);
		this.form.title(titleText);
		return this;
	}
	/**
	 * @method toggle
	 * @param {String} label 
	 * @param {Boolean} defaultValue? 
	 * @param {(player: Player, state: Boolean) => {}} callback?
	 */
	toggle(label, defaultValue, callback) {
		if (typeof label !== 'string') throw new Error(`label: ${label}, at params[0] is not a String!`);
		if (defaultValue && typeof defaultValue !== 'string') throw new Error(`defaultValue: ${defaultValue}, at params[1] is defined and is not a String!`);
		if (!callback && !(callback instanceof Function)) throw new Error(`callback at params[2] is defined and is not a Function!`);
		this.callbacks.push(callback);
		this.form.slider(label, placeholderText, defaultValue);
		return this;
	}
	/**
	 * @typedef {Array<optionObject>} dropdownOptions
	 */

	/**
	 * @typedef {object} optionObject
	 * @property {string} option
	 * @property {(player: Player) => { }} callback 
	 */

	/**
	 * @method dropdown
	 * @param {String} label 
	 * @param {dropdownOptions} options 
	 * @param {Number} defaultValueIndex?
	 * @param {(player: Player, selection: Number) => {}} callback?
	 */
	dropdown(label, options, defaultValueIndex = 0, callback) {
		if (typeof label !== 'string') throw new Error(`label: ${label}, at params[0] is not a String!`);
		if (!(options instanceof Array)) throw new Error(`params[1] is not an Array!`);
		options.forEach((object, i) => { if (!(object instanceof Object)) throw new Error(`index: ${i}, in params[1] is not an Object!`); });
		const optionStrings = options.map(({ option }, i) => { if (typeof option !== 'string') throw new Error(`property option: ${option}, at index: ${i}, in params[1] is not a String!`); return option; });
		const optionCallbacks = options.map(({ callback }) => { if (callback && !(callback instanceof Function)) throw new Error(`property callback at index: ${i}, in params[1] is not a Function!`); else if (callback) return callback; });
		if (!isNumberDefined(defaultValueIndex) && !Number.isInteger(defaultValueIndex)) throw new Error(`defaultValueIndex: ${defaultValueIndex}, at params[2] is defined and is not an Integer!`);
		if (!callback && !(callback instanceof Function)) throw new Error(`callback at params[3] is defined and is not a Function!`);
		this.callbacks.push([optionCallbacks, callback]);
		this.form.dropdown(label, optionStrings, defaultValueIndex);
		return this;
	}
	/**
	 * @method slider
	 * @param {String} label 
	 * @param {Number} minimumValue 
	 * @param {Number} maximumValue 
	 * @param {Number} valueStep 
	 * @param {Number} defaultValue?
	 * @param {(player: Player, selection: Number) => {}} callback?
	 */
	slider(label, minimumValue, maximumValue, valueStep, defaultValue = null, callback) {
		if (typeof label !== 'string') throw new Error(`label: ${label}, at params[0] is not a String!`);
		if (typeof minimumValue !== 'number') throw new Error(`minimumValue: ${minimumValue}, at params[1] is not a Number!`);
		if (typeof maximumValue !== 'number') throw new Error(`maximumValue: ${maximumValue}, at params[2] is not a Number!`);
		if (typeof valueStep !== 'number') throw new Error(`valueStep: ${valueStep}, at params[3] is not a Number!`);
		if (!isNumberDefined(defaultValue) && typeof defaultValue !== 'number') throw new Error(`defaultValue: ${defaultValue}, at params[4] is defined and is not a Number!`);
		if (!callback && !(callback instanceof Function)) throw new Error(`callback at params[5] is defined and is not a Function!`);
		this.callbacks.push(callback);
		this.form.slider(label, minimumValue, maximumValue, valueStep, defaultValue);
		return this;
	}
	/**
	 * @method textField
	 * @param {String} label 
	 * @param {String} placeholderText 
	 * @param {String} defaultValue 
	 * @param {(player: Player, outputText: STring) => {}} callback?
	 * @returns {ModalForm}
	 */
	textField(label, placeholderText, defaultValue = null, callback) {
		if (typeof label !== 'string') throw new Error(`label: ${label}, at params[0] is not a String!`);
		if (typeof placeholderText !== 'string') throw new Error(`placeholderText: ${placeholderText}, at params[1] is not a String!`);
		if (defaultValue && typeof defaultValue !== 'string') throw new Error(`defaultValue: ${defaultValue}, at params[2] is defined and is not a String!`);
		if (!callback && !(callback instanceof Function)) throw new Error(`callback at params[3] is defined and is not a Function!`);
		this.callbacks.push(callback);
		this.form.slider(label, placeholderText, defaultValue);
		return this;
	};

	/**
	 * @method show
	 * @param {Player} player 
	 * @param {Boolean} awaitNotBusy?
	 */
	async show(player, awaitNotBusy = false) {
		const response = await this.form.show(player);
		const { formValues, cancelationReason } = response;
		if (awaitNotBusy && cancelationReason === 'userBusy') this.show(player, awaitNotBusy);
		formValues.forEach((value, i) => {
			if (callback instanceof Array) {
				const callback = this.callbacks[i][0][value];
				const callbackAll = this.callbacks[i][1][value];
				if (callback instanceof Function) callback(player);
				if (callbackAll instanceof Function) callbackAll(player, value);
			} else {
				const callback = this.callbacks[i];
				if (callback instanceof Function) callback(player, value);
			}
		});
		return response;
	}
}