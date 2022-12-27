import { global, formBuilder, content, server } from '../../patchy_api/modules.js';
server.objectiveAdd('testone');

formBuilder.create('testBAck1', {
	action: [
		{
			button: {
				text: 'page2'
			},
			callback: (player) => {
				formBuilder.show(player, 'testBack2');
			}
		},
		{
			back: {
				text: 'Back'
			}
		}
	]
});
formBuilder.create('testBack2', {
	action: [
		{
			button: {
				text: 'page3'
			},
			callback: (player) => {
				formBuilder.show(player, 'testBack3');
			}
		},
		{
			back: {
				text: 'Back'
			}
		}
	]
});
formBuilder.create('testBack3', {
	action: [
		{
			refresh: {
				text: 'Refresh'
			},
		},
		{
			back: {
				text: 'Back'
			}
		}
	]
});


