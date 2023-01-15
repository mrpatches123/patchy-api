import { global, formBuilder, content, server } from '../../patchy_api/modules.js';
server.objectiveAdd('testone');

formBuilder.create('testBack1', {
	action: [
		{
			button: {
				text: 'page2'
			},
			callback: (receiver) => {
				formBuilder.show(receiver, 'testBack2');
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
			callback: (receiver) => {
				formBuilder.show(receiver, 'testBack3');
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
			}
		},
		{
			back: {
				text: 'Back'
			}
		}
	]
});


