import formBuilder from '../../patchy_api/libraries/classes/form.js';
import global from '../../patchy_api/libraries/classes/global.js';
import { content, server } from '../../patchy_api/libraries/utilities.js';

formBuilder.create('test', {
    action: [
        {
            button: {
                text: 'button',
                reopen: true
            }
        },
        {
            toggle: {
                scoreboardName: 'test',
                reopen: true,
                options: (player) => {
                    const testone = player.scoreTest('testone') ?? 2;
                    content.warn({testone});
                    return Array.from(Array(testone), (value,i) => ({text: `${i}`}));
                }
            }
        },
        {
            button: {
                text: 'button1'
            }
        }
    ]
})
