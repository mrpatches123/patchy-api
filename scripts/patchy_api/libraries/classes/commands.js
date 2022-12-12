import { Player } from "@minecraft/server";
import config from "../../config.js";
import { content, parseCommand } from "../utilities.js";
import errorLogger from "./error.js";
import global from "./global.js";
const { commandPrefix } = config;
const { isArray } = Array;
const { isInteger } = Number;
class CommandBuilder {
    constructor() {
        this.__aliasesObject = {};
    };

    /**
     * @method invalid Sends invalid syntax message to the command invoker.
     * @param {String} cmdName Command name.
     * @param {Player} sender Command invoker username.
     * @param {Array<String>} error invalid syntaxes.
     * @returns {void}
     */
    invalidSyntax(command, sender, prefix, error) {
        sender.playSound('note.bass');
        sender.tell({ "rawtext": [{ "text": "§c" }, { "translate": "commands.generic.syntax", "with": [`${prefix}${command} `, `${error[0]}`, `${error.filter((item, i) => { if (i !== 0) return item; }).join(" ")}`] }] });
    }
    getPrefixs() {
        return Object.keys(this).filter(key => !key.startsWith('__')) ?? [];
    }
    getPrefix(message) {
        // content.warn(Object.keys(this))
        for (const prefix of this.getPrefixs()) {
            if (message.startsWith(prefix)) {
                return prefix;
            }
        };
    }
    /**
     * @method check Checks if command exists if it does runs the command. Returns error message to the command executor.
     * @param {String} command Command name.
     * @param {Player} sender player Class.
     * @param {Array<String>} args Array of strings.
     */
    check(message, sender, prefix) {

        const args = parseCommand(message, prefix);
        let command = args.shift();
        const argsLength = arguments.length;
        if (argsLength !== 3) {
            throw new Error(`check got ${argsLength} arguments, but expected 3 arguments: command: {String}, sender: {player}, args: {Array<String>}`);
        }
        if (!this[prefix][command]) {
            if (this.__aliasesObject[prefix][command]) {
                command = this.__aliasesObject[prefix][command];
            } else {
                sender.playSound('note.bass');
                sender.tell({ "rawtext": [{ "text": "§c" }, { "translate": "commands.generic.unknown", "with": [`§f${command}§c`] }] });
                return true;
            }
        }
        const { requires, callback } = this[prefix][command];
        const { score, tag } = requires ?? {};
        const name = sender.getName();
        content.warn(this[prefix][command]);
        if (requires) {
            let notPermissions;
            if (score) {
                score.forEach((objective, value) => {
                    content.warn({ value, objective, score: sender.scores[objective] ?? 'undifened' });
                    if (sender.scores[objective] !== value) { notPermissions = true; }
                });
            }
            if (tag) {
                const tags = sender.getTags();
                tag.forEach((tag) => { if (tags.includes(tag)) { notPermissions = true; } });
            }
            if (notPermissions) {
                sender.tellraw(`§cyou do not have permission to use this command!`);
                return true;
            }
        }
        // console.warn(typeof callback);

        try {
            callback(sender, args, command, prefix);
        } catch (error) {
            errorLogger.log(error, error.stack, { event: 'command', key: `${prefix}${command}` });
            return true;
        }
        return true;
    }

    /**
     * @method getList Returns a string with all the available commands with their descriptions.
     * @param {String} name Username
     * @returns {Array<object>}
     */
    // getList(name) {
    //     let returnArray = [];
    //     this.forEach((command,data) => {
    //         let notPermissions;
    //         if (requires) {
    //             const { requires, callback, usages, description } = this[prefix];
    //             const { score, tag } = requires;
    //             const name = sender.getName();
    //             if (score) {
    //                 const scores = global.scoreObject[name];
    //                 score.forEach((objective, value) => { if (global.scoreObject[name][objective] !== value) { notPermissions = true; } });
    //             }
    //             if (tag) {
    //                 const tags = sender.getTags();
    //                 tag.forEach((objective, value) => { if (global.scoreObject[name][objective] !== value) { notPermissions = true; } });
    //             }
    //             if (notPermissions) {
    //                 sender.tellraw(`§cyou do not have permission to use view this command!`);
    //             }
    //         }
    //         if (!notPermissions) {

    //         }
    //     });
    //     return returnArray;
    // }

    /**
     * @method register Add command.
     * @param {String} command
     * @param {{description: String, aliases: Array<String>, usages: Array<String>||{subCommand: Array<String>},requires:{score?:{objective: Number},tag?:{tag:boolean}},callback: (sender: Player, args: Array<String>) => {}}} data Command Data.
    
     * @returns {void}
     */
    register(command, { description = '', aliases = [], usages = {}, requires = false, prefix = config.commandPrefix, callback }) {
        const argsLength = arguments.length;

        if (argsLength !== 2) {
            throw new Error(`register got ${argsLength} arguments, but expected 2 arguments: command: {String}, data: {Object}`);
        }
        // console.warn(command, typeof usages, usages);
        if (typeof description !== 'string') throw new Error('Description must to be a string.');
        else if (requires !== false && typeof requires !== 'object' && !isArray(requires)) throw new Error('Requires must to be false or a object.');
        else if (typeof usages !== 'object') throw new Error('usages must to be a object or an array');
        else if (typeof callback !== 'function') throw new Error('Callback must to be a Function.');
        else if (!isArray(aliases) || !aliases.every(value => typeof value === 'string')) {
            throw new Error('Aliases must to be an Array of Strings');
        } else if (typeof requires === 'object' && !isArray(requires)) {
            requires.forEach((key, value) => {
                if (key !== 'tag' && key !== 'score') {
                    throw new Error(`The key: ${key}, in requires is must be tag or score`);
                } else if (typeof value !== 'object') {
                    throw new Error(`The value for the key: ${key}, must of type: Object`);
                } else {
                    if (key === 'score') {
                        value.forEach((key, value) => {
                            if (!isInteger(value)) {
                                throw new Error(`The value for the score: ${key}, must be of type: integer!`);
                            }
                        });
                    } else {
                        value.forEach((key, value) => {
                            if (typeof value !== 'boolean') {
                                throw new Error(`The value to the tag: ${key} must of type: Boolean!`);
                            }
                        });
                    }
                }
            });
        }
        if (typeof usages === 'object' && !isArray(usages)) {
            usages.forEach((subcommand, value) => {
                if (typeof value === 'object') {
                    value.forEach((key, value) => {
                        if (key !== 'subDescription' && key !== 'examples') {
                            throw new Error(`The keys in the value for ${subcommand} in usages in usages must be not subDescription or examples`);
                        } else if (key === 'examples' && !isArray(value)) {
                            throw new Error(`The value for {usuages: {${subcommand}: examples}}, must be of type: Array!`);
                        } else if (key === 'subDescription' && typeof value !== 'string') {
                            throw new Error(`The value for {usuages: {${subcommand}: subDescription}}, must be of type: String!`);
                        }
                    });
                } else {
                    throw new Error(`The value ${subcommand} must be of type: Object`);
                }
            });
        }
        if (!this.__aliasesObject[prefix]) {
            this.__aliasesObject[prefix] = {};
        }
        aliases.forEach(aliase => {
            this.__aliasesObject[prefix][aliase] = command;
        });
        if (!this[prefix]) {
            this[prefix] = {};
        }
        this[prefix][command] = {
            description,
            requires,
            usages,
            aliases,
            callback,
        };
    }

    /**
     * @method getInfo Sends information about the command to the invoker.
     * @param {String} name Command invoker username. 
     * @param {String} cmdName Command Name.
     * @returns {void}
     */
    getInfo(sender, prefix, command, subCommand = false, permissions = true) {
        const argsLength = arguments.length;
        if (argsLength > 3 || argsLength > 5) {
            throw new Error(`getInfo got ${argsLength} arguments, but expected 3-5 arguments: sender: {Player}, command: {String}, permissions?:true: {Boolean}`);
        }
        if (this[prefix]) {
            const { requires, description, usages } = this[prefix][command];
            const { score, tag } = requires;
            // content.warn(this[prefix][command]);
            if (requires) {
                let notPermissions;
                if (score) {
                    score.forEach((objective, value) => {
                        // content.warn({ [objective]: sender.scores[objective] });
                        if (sender.scores[objective] !== value) { notPermissions = true; }
                    });
                }
                if (tag) {
                    const tags = sender.getTags();
                    tag.forEach((tag) => { if (tags.includes(tag)) { notPermissions = true; } });
                }
                if (notPermissions && permissions) {
                    sender.tellraw(`§cyou do not have permission to use view this command!`);
                    return;
                }
            }
            if (subCommand && typeof usages === 'object' && !isArray(usages)) {
                const { examples, subDescription } = this[prefix][command].usages[subCommand];
                sender.runCommands(
                    'playsound note.hat @s',
                    `tellraw @s {"rawtext":[{"text":"§e${command}:\n${description}\n§fUsage:${usages.map((item, i) => `\n - ${prefix}${command} ${usages[i]}`).join("")}"}]}`
                );

            } else {
                if (!isArray(usages)) {
                    let usagesArray = [];
                    usages.forEach((subCommand, { examples, subDescription }) => usagesArray.push(`\n - ${prefix}${command} ${subCommand}\n    - description: ${subDescription}\n    - examples: \n${examples.map(example => `      - ${prefix}${example}\n`).join('')}`));
                    console.warn(JSON.stringify(usagesArray));

                    sender.runCommandAsync('playsound note.hat @s');
                    sender.tellraw(`§e${command}:\n${description}\n§fUsage:${usagesArray.join('')}`);
                } else {
                    sender.runCommands(
                        'playsound note.hat @s',
                        `tellraw @s {"rawtext":[{"text":"§e${command}:\n${description}\n§fUsage:${usages.map((item, i) => `\n - ${prefix}${command} ${usages[i]}`).join("")}"}]}`
                    );

                }



            }


        } else {
            if (!command) return this.invalidSyntax(`help`, sender, [command]);
        }
    };
    getCommandFromAliases(aliase) {
        this.forEach((command, { aliases }) => {
            if (aliases.includes(aliase)) {
                return command;
            }
        });
    }
    /**
     * @method run Run command callback.
     * @param {String} cmdName Command name.
     * @param {String} sender Command invoker sender class.
     * @param {Array<String>} args Args.
     */
}

let commandBuilder = new CommandBuilder();

export default commandBuilder;

