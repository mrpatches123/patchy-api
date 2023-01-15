import { Player } from "@minecraft/server";
import { ModalFormData, ModalFormResponse } from "@minecraft/server-ui";


function isNumberDefined(input) {
	return (input !== false && input !== null && input !== undefined && input !== NaN && input !== Infinity);
}
interface DropdownOptions {
	option: string;
	callback: (player: Player) => {};
}
export class ActionForm {
	constructor();
	title(titleText: string): ActionForm;
	body(bodyText: string): ActionForm;
	button(text: string, iconPath: string | null, callback: (player: Player, i: number) => {}): ActionForm;
}
export class MessageForm {
	constructor();
	title(titleText: string): ActionForm;
	body(bodyText: string): ActionForm;
	button1(text: string, callback: (player: Player) => {}): ActionForm;
	button2(text: string, callback: (player: Player) => {}): ActionForm;
}
export class ModalForm {
	constructor();
	title(titleText: string): ModalForm;
	toggle(label: string, defaultValue: boolean, callback: (player: Player, state: Boolean, i: number) => {}): ModalForm;
	dropdown(label: string, options: DropdownOptions[], defaultValueIndex = 0, callback: (player: Player, selection: Number, i: number) => {}): ModalForm;
	slider(label: string, minimumValue: number, maximumValue: number, valueStep: number, defaultValue: string | null, callback: (player: Player, selection: Number, i: number) => {}): ModalForm;
	textField(label: string, placeholderText: string, defaultValue: string | null, callback: (player: Player, outputText: string, i: number) => {}): ModalForm; s;
	async show(player: Player, awaitNotBusy = false): ModalFormResponse;
}
const test = [
	{
		item: "minecraft:apple",
		amount: 32
	},
	{
		item: "minecraft:diamond_sword",
		amount: 1
	}
];