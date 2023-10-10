import { content, formBuilder } from "../../modules.js";
formBuilder.create('messageHard', {
    message: [
        {
            title: 'messageHard',
            body: 'Press a button. Close to return',
            returnOnClose: true
        },
        {
            button2: 'hello123456',
            callback: (receiver) => {
                content.warn({ receiver: receiver.name, t: 2 });
            }
        },
        {
            button1: 'hekjducwbf',
            callback: (receiver) => {
                content.warn({ receiver: receiver.name, t: 1 });
            }
        }
    ]
});
//# sourceMappingURL=message_static.js.map