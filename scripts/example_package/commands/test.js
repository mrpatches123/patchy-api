import config from '../config.js';



import { commandBuilder, content, formBuilder, native } from '../../patchy_api/modules.js';
import { ActionFormData } from '@minecraft/server-ui';
import { world } from '@minecraft/server';


const { prefix } = config;
const form = new ActionFormData();
form.button('help');
form.button('help1');
form.button('help2');
form.button('help3');
form.show;
let fI = 0;
let ticks = 0;
let stop = false;
async function test(player) {
    console.warn('formRecurive, ', fI++);
    const response = await form.show(player);
    if (response.cancelationReason === "userBusy") test(player);
    else stop = true;

}
commandBuilder.register('formawait', {
    description: "formawait",
    usages: [
        `${prefix}formawait`,
    ],
    prefix,
    callback: (sender, args) => {
        const call = () => {
            console.warn('world.events.tick, ', ticks++);
            if (stop) {
                world.events.tick.unsubscribe(call);
            }
        };
        world.events.tick.subscribe(call);
        test(sender);
    }
});


// not required
// just change the "sender.message" to something else

// command stuff

