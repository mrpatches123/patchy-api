import { ModalForm } from "../../patchy_api/modules.js";

export function showTestFunc(player, awaitNotUserBusy = false) {
	const modaltest = new ModalForm()
		.title("modalFuncTest")
		.dropdown("dropdown", [
			{
				option: "hello",
				callback: (player) => {
					console.warn(player.name, '0dropdown1');
				}
			},
			{
				option: "help",
				callback: (player) => {
					console.warn(player.name, '0dropdown2');
				}
			},
			{
				option: "why",
				callback: (player) => {
					console.warn(player.name, '0dropdown3');
				}
			}
		], 0).slider("slider", 1, 20, 1, 10, (player, selection) => {
			console.warn(player.name, '0slider1', selection);
		}).textField("textField", "test", "Nothing", (player, outputText) => {
			console.warn(player.name, '0textField1', outputText);
		}).toggle("toggle", false, (player, stat))
		.show(player, awaitNotUserBusy);
}
