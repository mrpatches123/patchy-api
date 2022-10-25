import config from '../config.js';
import { formBuilder, commandBuilder, content, tagDatabases } from '../../patchy_api/modules.js';
const { prefix } = config;

commandBuilder.register('tags', {
    description: "Show menu",
    prefix,
    usages: [
        `${prefix}tags`
    ],
    requires: {
        score: {
            staff: 1
        }
    },
    callback: (sender, args) => {
        sender.getTags().forEach(tag => {
            sender.removeTag(tag);
        });
        tagDatabases.initalizeAll();

    }
});


