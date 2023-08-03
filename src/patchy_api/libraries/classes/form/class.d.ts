import { ActionFormData, ModalFormData, MessageFormData, FormResponse, ModalFormResponse } from '@minecraft/server-ui';
import { Player } from '../player/class.js';

type Form = {
	action: ActionData[] | ((receiver: Player, i: number, ...extraArguments: any[]) => ActionData[]);
	modal: ModalData[] | ((receiver: Player, i: number, ...extraArguments: any[]) => ModalData[]);
	message: MessageData[] | ((receiver: Player, i: number, ...extraArguments: any[]) => MessageData[]);
};
type ActionData = {
	title?: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
	body?: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
	button?: ActionButton | ((receiver: Player, i: number, ...extraArguments: any[]) => ActionButton);
	back?: ActionButton | ((receiver: Player, i: number, ...extraArguments: any[]) => ActionBack);
	refresh?: ActionButton | ((receiver: Player, i: number, ...extraArguments: any[]) => ActionRefresh);
	toggle?: ActionToggle | ((receiver: Player, i: number, ...extraArguments: any[]) => ActionButton);
	returnOnPress?: boolean | ((receiver: Player, i: number, ...extraArguments: any[]) => boolean);
	returnOnClose?: boolean | ((receiver: Player, i: number, ...extraArguments: any[]) => boolean);
	closeCallBack?: (receiver: Player, i: number, ...extraArguments: any[]) => any;
	pressCallback?: (receiver: Player, i: number, ...extraArguments: any[]) => any;
	callback?: (receiver: Player, i: number, ...extraArguments: any[]) => any;
} | ((receiver: Player, ...extraArguments: any[]) => (ActionData[] | ActionData));
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
type ModalData = {
	title?: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
	dropdown?: ModalDropDown | ((receiver: Player, i: number, ...extraArguments: any[]) => ModalDropDown);
	slider?: ModalSlider | ((receiver: Player, i: number, ...extraArguments: any[]) => ModalSlider);
	textField?: ModalTextField | ((receiver: Player, i: number, ...extraArguments: any[]) => ModalTextField);
	toggle?: ModalToggle | ((receiver: Player, i: number, ...extraArguments: any[]) => ModalToggle);
	closeCallback?: (receiver: Player, formResponse: ModalFormResponse, ...extraArguments: any[]) => any;
	submitcallback?: (receiver: Player, formResponse: ModalFormResponse, formResponse: ModalFormResponse, ...extraArguments: any[]) => any;
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
type MessageData = {
	title?: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
	body?: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
	button1?: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
	button2?: string | ((receiver: Player, i: number, ...extraArguments: any[]) => string);
	reopen?: boolean | ((receiver: Player, i: number, ...extraArguments: any[]) => boolean);
	returnOnPress?: boolean | ((receiver: Player, i: number, ...extraArguments: any[]) => boolean);
	returnOnClose?: boolean | ((receiver: Player, i: number, ...extraArguments: any[]) => boolean);
	callback?: (receiver: Player, i: number, ...extraArguments: any[]) => any;
	closeCallBack?: (receiver: Player, i: number, ...extraArguments: any[]) => any;
	pressCallback?: (receiver: Player, i: number, ...extraArguments: any[]) => any;
} | ((receiver: Player, ...extraArguments: any[]) => (MessageData[] | MessageData));

export class FormBuilder {
	create(key: string, data: Form): void;
	generateForm(player: Player, key: string, ...extraArguments: any[]): ActionFormData | ModalFormData | MessageFormData;
	show(player: Player, key: string, ...extraArguments: any[]): void;
	showAwait(player: Player, key: string, ...extraArguments: any[]): void;
}