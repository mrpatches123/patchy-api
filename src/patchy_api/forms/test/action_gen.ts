import { Form } from "../../libraries/classes/form/schema.js";
import { content, formBuilder, scoreboardBuilder } from "../../modules.js";
const test = ['hello', 'hi', 'youcoowd', 'wdwdwdwd'];

scoreboardBuilder.add('testabc');
formBuilder.create('actionSoft', {

	action: (receiver) => {
		const buttons: Form['action'] = [
			...[
				{
					button: {
						text: 'back'
					},
					callback: (receiver) => {
						content.warn({ receiver: receiver.name, text: 'back'; });
					}
				}
			],
			{
				title: receiver.name
			}, ...test.map(text => ({
				button: {
					text
				},
				callback: (receiver) => {
					content.warn({ receiver: receiver.name, text });
				}
			}),
			),
			{
				button: {
					text: 'back'
				},
				callback: (receiver) => {
					content.warn({ receiver: receiver.name, text: 'back' });
				}
			}

		];
		type Buttons = typeof buttons;
		return buttons;
	}
});

// {
// 	toggle: {
// 		reopen: true,
// 			cycleCallback: (receiver) => {
// 				const { scores } = receiver;
// 				(scores.testabc! >= 2) ? scores.testabc = 0 : scores.testabc!++;
// 				content.warn({ t: 'cycle', testabc: scores.testabc });
// 				return scores.testabc;
// 			},
// 				initialisationFunction: (receiver) => {
// 					const { scores } = receiver;
// 					scores.testabc ??= 0;
// 					content.warn({ t: 'init', testabc: scores.testabc });
// 					return scores.testabc;
// 				},
// 					options: [
// 						{
// 							text: '0',
// 							iconPath: 'textures/blocks/stone',
// 							callback: (receiver) => {
// 								content.warn({ receiver: receiver.name, t: '0' });
// 							}
// 						},
// 						{
// 							text: '1',
// 							iconPath: 'textures/blocks/stonebrick',
// 							callback: (receiver) => {
// 								content.warn({ receiver: receiver.name, t: '1' });
// 							}
// 						},
// 						{
// 							text: '2',
// 							iconPath: 'textures/blocks/dirt',
// 							callback: (receiver) => {
// 								content.warn({ receiver: receiver.name, t: '2' });
// 							}
// 						}
// 					],
// 				},

// },
// () => [
// 	{
// 		back: {
// 			text: 'bk'
// 		}
// 	},
// 	{
// 		button: {
// 			reopen: true,
// 			text: 'rh'
// 		}
// 	}
// ];