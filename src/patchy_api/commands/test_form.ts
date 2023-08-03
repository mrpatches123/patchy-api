import config from '../config.js';
import { commandBuilder, formBuilder } from '../modules.js';
const { commandPrefix: prefix } = config;
commandBuilder.register('main', {
	prefix,
	callback: (sender) => {
		formBuilder.showAwait(sender, 'testMain');
	}
});