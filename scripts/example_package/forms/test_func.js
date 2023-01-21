import { ActionForm, content, errorLogger, ModalForm, native, MessageForm } from "../../patchy_api/modules.js";


/**
 * 
 * @param {Player} player 
 * @param {Boolean} awaitNotUserBusy 
 */
export function showTestFuncAction(player, awaitNotUserBusy) {
	try {
		new ActionForm()
			.title('actionTest')
			.body('this is the text of the body \nwhich however is in the lody')
			.button('button1', 'textures/ui/sidebar_icons/bookmark', (player, i) => {
				console.warn(player.name, '0button1', i);
			}).button('button2', 'textures/ui/sidebar_icons/blueheart', (player, i) => {
				console.warn(player.name, '0button2', i);
			}).button('button3', 'textures/ui/sidebar_icons/my_content', (player, i) => {
				console.warn(player.name, '0button3', i);
			}).button('button4', 'textures/ui/sidebar_icons/dressing_room_capes', (player, i) => {
				console.warn(player.name, '0button4', i);
			}).button('button5', 'textures/ui/sidebar_icons/emotes', (player, i) => {
				console.warn(player.name, '0button5', i);
			}).button('modal', 'textures/ui/sidebar_icons/button_panel', (player, i) => {
				console.warn(player.name, '0button5', i);
				showTestFuncModal(player);
			}).button('message', 'textures/ui/sidebar_icons/classic_skins', (player, i) => {
				console.warn(player.name, '0button5', i);
				showTestFuncMessage(player);
			})
			.show(player, awaitNotUserBusy, (player, response) => {
				const { selection } = response;
				console.warn(JSON.stringify({ t: 'total', selection }));
			}).catch(error => {
				console.warn(error, error.stack);
			});
	} catch (error) {
		console.warn(error, error.stack);
	}
}
/**
 * 
 * @param {Player} player 
 * @param {Boolean} awaitNotUserBusy 
 */
export function showTestFuncMessage(player, awaitNotUserBusy) {
	try {


		new MessageForm()
			.title('messageTest')
			.body('this is the text of the body \nwhich however is in the lody')
			.button1('button1', (player, i) => {
				console.warn(player.name, '0button1', i);
			}).button2('button2', (player, i) => {
				console.warn(player.name, '0button2', i);
			}).show(player, awaitNotUserBusy, (player, response) => {
				const { selection } = response;
				console.warn(JSON.stringify({ t: 'total', selection }));
			}).catch(error => {
				console.warn(error, error.stack);
			});
	} catch (error) {
		console.warn(error, error.stack);
	}
}
/**
 * 
 * @param {Player} player 
 * @param {Boolean} awaitNotUserBusy 
 */
export async function showTestFuncModal(player, awaitNotUserBusy) {
	try {
		new ModalForm()
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
			}).toggle("toggle", false, (player, boolean) => {
				console.warn(player.name, '0toggle1', boolean);
			})
			.show(player, awaitNotUserBusy, (player, response) => {
				const { formValues } = response;
				console.warn(JSON.stringify({ t: 'total', array: formValues }));
			}).catch(error => {
				console.warn(error, error.stack);
			});
	} catch (error) {
		console.warn(error, error.stack);
	}

}
