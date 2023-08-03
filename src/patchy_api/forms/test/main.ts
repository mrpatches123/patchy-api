import { content, formBuilder } from '../../modules.js';
formBuilder.create('testMain', {
	action: [
		{
			button: {
				iconPath: 'textures/blocks/dirt',
				text: 'message Hard'

			},
			callback: (receiver) => {
				formBuilder.show(receiver, 'messageHard');
			},
		},
		{
			button: {
				iconPath: 'textures/items/apple',
				text: 'text'

			},
			callback: (receiver) => {
				content.warn({ t: 'apple', receiver: receiver.name });
			},
			closeCallback: (receiver) => {
				content.warn({ t: 'close', receiver: receiver.name });
			}
		},
		{
			button: {
				text: 'staticModal'
			},
			callback: (receiver) => {
				formBuilder.show(receiver, 'modalHard');
			}
		},
		[
			{
				button: {
					text: 'hello',
					iconPath: 'textures/items/emerald',
				}
			},
			{
				button: {
					text: 'hi',
					iconPath: 'textures/items/emerald',
				}
			},
			{
				button: {
					text: 'bye',
					iconPath: 'textures/items/diamond',
				}
			},
		],
		{
			button: {
				text: 'actionSoft'
			},
			callback: (receiver) => {
				formBuilder.show(receiver, 'actionSoft');
			}
		},
	]
});