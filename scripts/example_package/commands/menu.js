import config from '../config.js';
import commandBuilder from "../../patchy_api/libraries/classes/commands.js";


import formBuilder from '../../patchy_api/libraries/classes/form.js';
import toDo from '../../patchy_api/libraries/classes/toDo.js';
const { prefix } = config;

commandBuilder.register('menu', {
    description: "Show menu",
    prefix,
    usages: [
        `${prefix}menu`
    ],
    aliases: ['m'],
    callback: (sender, args) => {
        sender.tellraw(`§l§f[§9PAC§f] §aMove your camera and close chat to open the Menu!`);
        let VVector = sender.viewVector;
        toDo.waitFor((e) => {
            formBuilder.show(sender, 'test');

        }, (e) => {
            return !e.sender.viewVector.equals(e.viewVector);
        }, { sender: sender, viewVector: VVector });
    }
});


