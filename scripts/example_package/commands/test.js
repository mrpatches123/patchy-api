import config from '../config.js';
import global from '../../patchy_api/libraries/classes/global.js';
import commandBuilder from "../../patchy_api/libraries/classes/commands.js";
import { content, native } from "../../patchy_api/libraries/utilities.js";
import { compress, decompress } from '../../patchy_api/libraries/zip.js';
const { prefix } = config;





commandBuilder.register('test', {
    description: "Used to enchant the item in hand.",
    usages: [
        `${prefix}test`,
    ],
    prefix,
    callback: (sender, args) => {
        const object = {
            help: 'kjwdkjwdjkwdjkwdkj',
            hello: {
                help: 'w,wddwwdklwdkwdk',
                jwkjwdjkwdjkdwj: 'wkllkwdklwdk',
                helo: ['wklwklw', 'wdklwdkwd', 'wlwldklwd']
            }
        };
        for (let i = 0; i < 300; i++) {
            object[i] = {
                help: {
                    rand: Math.random()
                },
                hi: 828828
            };
        }
        const string = JSON.stringify(object);
        content.warn({ string });
        const compression = compress(string);
        content.warn({ compression });
        const decompression = decompress(compression);
        content.warn({ decompression });
    }
});


// not required
// just change the "sender.message" to something else

// command stuff

