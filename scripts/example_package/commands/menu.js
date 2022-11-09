import config from '../config.js';
import { formBuilder, commandBuilder, content } from '../../patchy_api/modules.js';
const { prefix } = config;

commandBuilder.register('menu', {
    description: "Show menu",
    prefix,
    usages: [
        `${prefix}menu`
    ],
    aliases: ['m'],
    callback: (sender, args) => {
        content.warn('test', sender.name);
        formBuilder.showAwait(sender, 'test', sender.id);
    }
});



