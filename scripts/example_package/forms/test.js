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
            callback: () => {
                formBuilder.show(player, 'testBAck1');
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
                        callback: (player) => {
                            content.warn({ Toggle: player.id });
                        }
                    },
                    {

                        text: 'Toggle: OFF',
                        postfix: true,
                        callback: (player) => {
                            content.warn({ Toggle: player.id });
                        }
                    }
                ]
            }
        },
        {
            button: {
                text: 'Profile'
            },
            callback: (player) => {
                formBuilder.show(player, 'playerProfile');
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
        },
        (player) => {
            const { testForm } = player.scores;
            if (testForm) {
                return {
                    button: {
                        text: "hi"
                    }
                };
            }
        }

    ]
});
