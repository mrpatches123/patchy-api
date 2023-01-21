import config from '../config.js';



import { commandBuilder } from '../../patchy_api/modules.js';
import { showTestFuncAction } from '../forms/test_func.js';
import { world } from '@minecraft/server';
const { prefix } = config;
commandBuilder.register('formfunc', {
    description: "formawait",
    usages: [
        `${prefix}formawait`,
    ],
    prefix,
    callback: (sender, args) => {
        sender.tell('close chat to open form!');
        showTestFuncAction(sender, true);
    }
});


// not required
// just change the "sender.message" to something else

// command stuff

