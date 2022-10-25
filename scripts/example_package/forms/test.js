import { global, formBuilder, content, server } from '../../patchy_api/modules.js';
server.objectiveAdd('testone');

formBuilder.create('test', {
    action: [
        {
            body: "100%"
        },
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
                    const { testone = 2 } = player.scores;
                    content.warn({ testone });
                    return Array.from(Array(testone), (value, i) => ({ text: `${i}` }));
                }
            }
        },
        {
            button: {
                text: '%accessibility.button.exit'
            }
        },
        {
            button: {
                text: 'Friendsa%%a'
            },
            callback: (player) => {
                formBuilder.show(player, 'friendsTest');
            }
        },
        {
            button: {
                text: 'question test'
            },
            callback: (player) => {
                formBuilder.showConformation(player, 'Is js Cool?', (player) => player.tell('You are Cool!'), (player) => player.tell('You are lame!'));
            }
        }
    ]
});
