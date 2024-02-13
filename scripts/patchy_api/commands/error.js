"use strict";
// import commandBuilder from "../../patchy_api/libraries/classes/commands.js";
// import errorLogger from "../../patchy_api/libraries/classes/error.js";
// import { overworld, content } from "../../patchy_api/libraries/utilities.js";
// import config from '../config.js';
// const { commandPrefix: prefix } = config;
// commandBuilder.register('error', {
//     description: "Used to get the Stringified value of a key in global",
//     usages: [
//         `${prefix}error <key>`,
//     ],
//     prefix,
//     requires: {
//         score: {
//             staff: 1
//         }
//     },
//     callback: (sender, args) => {
//         switch (args[0]) {
//             case 'keys':
//                 let object = {};
//                 errorLogger.forEach((key, value) => {
//                     object[key] = value.length;
//                 });
//                 sender.sendMessage(JSON.stringify(object));
//                 break;
//             case 'events':
//                 let eventKeys = {};
//                 errorLogger.forEach((key, value) => {
//                     value.forEach(({ event }) => {
//                         if (!eventKeys[event]) {
//                             eventKeys[event] = {};
//                         }
//                         if (!eventKeys[event][key]) {
//                             eventKeys[event][key] = 0;
//                         }
//                         eventKeys[event][key]++;
//                     });
//                 });
//                 sender.sendMessage(eventKeys);
//                 break;
//             case 'bykey':
//                 if (errorLogger[args[0]]) {
//                     sender.sendMessage(JSON.stringify(errorLogger[args[1]]));
//                 } else {
//                     sender.sendMessage(`key: ${args[1]}, doesn't exist`);
//                 }
//                 break;
//             case 'byevent':
//                 let eventObject = {};
//                 const event = args[1];
//                 errorLogger.forEach((key, value) => {
//                     const eventValues = value.filter(value => value.event === event);
//                     if (!eventObject[key]) {
//                         eventObject[key] = [];
//                     }
//                     if (eventValues.length) {
//                         eventObject[key].push(eventValues);
//                     }
//                 });
//                 sender.sendMessage(JSON.stringify({ [event]: eventObject }));
//                 break;
//             case undefined:
//                 sender.sendMessage(JSON.stringify(errorLogger));
//                 break;
//         }
//     }
// });
//# sourceMappingURL=error.js.map