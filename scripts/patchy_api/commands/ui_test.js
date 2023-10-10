import config from '../config.js';
const { commandPrefix: prefix } = config;
import { commandBuilder, formBuilder } from '../modules.js';
commandBuilder.register('uitest', {
    description: "uitest",
    usages: [
        `${prefix}uitest`,
    ],
    prefix,
    requires: {
        score: {
            staff: 1
        }
    },
    callback: (sender, args) => {
        formBuilder.showAwait(sender, 'test');
    }
});
//# sourceMappingURL=ui_test.js.map