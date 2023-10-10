import { content, formBuilder } from "../../modules.js";
formBuilder.create('modalHard', {
    modal: [
        {
            dropdown: {
                label: 'hello',
                options: [
                    {
                        text: '0',
                        callback: (receiver, i) => {
                            content.warn({ receiver: receiver.name, i });
                        }
                    },
                    {
                        text: '1',
                        callback: (receiver, i) => {
                            content.warn({ receiver: receiver.name, i });
                        }
                    },
                    {
                        text: '2',
                        callback: (receiver, i) => {
                            content.warn({ receiver: receiver.name, i });
                        }
                    },
                    {
                        text: '3',
                        callback: (receiver, i) => {
                            content.warn({ receiver: receiver.name, i });
                        }
                    }
                ]
            }
        }
    ]
});
//# sourceMappingURL=static_modal.js.map