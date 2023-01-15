import { global, formBuilder, content, server } from '../../patchy_api/modules.js';
server.objectiveAdd('testone');

formBuilder.create('test', {
    action: [
        {
            body: "100%"
        },
        {
            button: {
                text: 'testback',
                iconPath: 'textures/forms/Main/Test',
                reopen: true
            },
            callback: (receiver) => {
                formBuilder.show(receiver, 'testBack1');
            }
        },
        {
            toggle: {
                reopen: true,
                dependency: 'player',
                scoreboardName: 'toggletest',
                options: [
                    {
                        text: 'Toggle: ON',
                        postfix: true,
                        callback: (receiver) => {
                            content.warn({ Toggle: receiver.id });
                        }
                    },
                    {

                        text: 'Toggle: OFF',
                        postfix: true,
                        callback: (receiver) => {
                            content.warn({ Toggle: receiver.id });
                        }
                    }
                ]
            }
        },
        {
            button: {
                text: 'Profile'
            },
            callback: (receiver) => {
                formBuilder.show(receiver, 'playerProfile');
            }
        },
        {
            button: {
                text: 'Friendsa%%a'
            },
            callback: (receiver) => {
                formBuilder.show(receiver, 'friendsTest');
            }
        },
        {
            button: {
                text: 'question test'
            },
            callback: (receiver) => {
                formBuilder.showConformation(receiver, 'Is js Cool?', (receiver) => receiver.tell('You are Cool!'), (player) => receiver.tell('You are lame!'));
            }
        }
    ]
});

