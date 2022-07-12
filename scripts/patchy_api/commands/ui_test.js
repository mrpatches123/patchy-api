
import commandBuilder from "../libraries/classes/commands.js";
import errorLogger from "../libraries/classes/error.js";
import propertyBuilder from "../libraries/classes/property.js";
import databases from "../libraries/classes/database.js";
import { overworld, content, assignToPath } from "../libraries/utilities.js";
import config from '../config.js';
import global from "../libraries/classes/global.js";
import formBuilder from "../libraries/classes/form.js";
const { commandPrefix: prefix } = config;
commandBuilder.register('uitest', {
	description: "uitest",
	usages: [
		`${prefix}uitest`,
	],
	prefix,
	requires: {
		score: {
			staff: 1
		}
	},
	callback: (sender, args) => {
		formBuilder.showAwait(sender, 'awaitTest');
	}
});

formBuilder.create('awaitTest', {
	action: [
		{
			button: {
				text: 'hello'
			}
		}
	]
});