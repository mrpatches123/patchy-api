import config from "../../config.js";
import { content, parseCommand } from "../utilities.js";
import errorLogger from "./error.js";
import { Player } from "./player/class.js";
const { commandPrefix } = config;
const { isArray } = Array;
const { isInteger } = Number;
class CommandBuilder {
    private __aliasesObject: Record<string, Record<string, string>> = {};
    private commandsObject: { [prefix: string]: Record<string, { description: string; requires: { score: { [objective: string]: number; }; tag: { [tag: string]: boolean; }; }; usages: { [subCommand: string]: { examples: Array<string>; subDescription: string; }; }; aliases: Array<string>; callback: (sender: import('./player/class.js').Player, args: Array<string>, command: string, prefix: string) => {}; }>; } = {};


    invalidSyntax(command: string, sender: import('./player/class.js').Player, prefix: string, error: Array<string>): void {
        sender.playSound('note.bass');
        sender.sendMessage({ "rawtext": [{ "text": "§c" }, { "translate": "commands.generic.syntax", "with": [`${prefix}${command} `, `${error[0]}`, `${error.filter((item, i) => { if (i !== 0) return item; }).join(" ")}`] }] });
    }
    getPrefixs() {
        return Object.keys(this.commandsObject).filter(key => !key.startsWith('__')) ?? [];
    }
    getPrefix(message: string) {
        // content.warn(Object.keys(this))
        for (const prefix of this.getPrefixs()) {
            if (message.startsWith(prefix)) {
                return prefix;
            }
        };
    }
    /**
     * 
     * @param {string} prefix
     * @param {import('./player/class.js').Player} sender 
     * @returns { string }
     */
    listCommands(prefix: string, sender: import('./player/class.js').Player): string {
        // content.warn({ t: 'listCommands', prefix });
        const commandList = Object.entries(this.commandsObject[prefix]!).filter(([command, { requires, callback }]) => {
            const { score, tag } = requires ?? {};
            if (requires) {
                let notPermissions;
                if (score) {
                    Object.entries(score).forEach(([objective, value]) => {
                        // content.warn({ value, objective, score: sender.scores[objective] ?? 'undefined' });
                        if (sender.scores[objective] !== value) { notPermissions = true; }
                    });
                }
                if (tag) {
                    const tags = sender.getTags();
                    Object.entries(tag).forEach(([tag]) => { if (tags.includes(tag)) { notPermissions = true; } });
                }
                if (notPermissions) {
                    sender.sendMessage(`§cyou do not have permission to use this command!`);
                    return false;
                }
            }
            return true;
        }).map(([command, { description }]) => `\n §r§f- §a§l${prefix}§r§a${command} | ${description}`).join('');
        return `§l§e---------------\n§r§eCommands List:${commandList} \n§l§e---------------`;
    }
    check(message: string, sender: import('./player/class.js').Player, prefix: string) {

        const args = parseCommand(message, prefix);
        let command = args.shift()!;
        const argsLength = arguments.length;
        if (argsLength !== 3) {
            throw new Error(`check got ${argsLength} arguments, but expected 3 arguments: command: {string}, sender: {player}, args: {Array<string>}`);
        }
        if (!this.commandsObject[prefix]![command]) {
            if (this.__aliasesObject[prefix]![command]) {
                command = this.__aliasesObject[prefix]![command]!;
            } else {
                sender.playSound('note.bass');
                sender.sendMessage({ "rawtext": [{ "text": "§c" }, { "translate": "commands.generic.unknown", "with": [`§f${command}§c`] }] });
                return true;
            }
        }
        const { requires, callback } = this.commandsObject[prefix]![command]!;
        const { score, tag } = requires ?? {};
        // content.warn(this[prefix][command]);
        if (requires) {
            let notPermissions;
            if (score) {
                Object.entries(score).forEach(([objective, value]) => {
                    // content.warn({ value, objective, score: sender.scores[objective] ?? 'undifened' });
                    if (sender.scores[objective] !== value) { notPermissions = true; }
                });
            }
            if (tag) {
                const tags = sender.getTags();
                Object.entries(tag).forEach(([tag]) => { if (tags.includes(tag)) { notPermissions = true; } });
            }
            if (notPermissions) {
                sender.sendMessage(`§cyou do not have permission to use this command!`);
                return true;
            }
        }
        // console.warn(typeof callback);

        try {
            callback(sender, args, command, prefix);
        } catch (error: any) {
            errorLogger.log(error, error.stack, { event: 'command', key: `${prefix}${command}` });
            return true;
        }
        return true;
    }
    register(command: string, { description = '', aliases = [], usages = {}, requires = false, prefix = config.commandPrefix, callback }: {
        description?: string;
        aliases?: Array<string>;
        usages?: Array<string> | { [subCommand: string]: Array<string>; };
        requires?: {
            score?: { [objective: string]: number; };
            tag?: { [tag: string]: boolean; };
        } | false;
        prefix?: string;
        callback: (sender: import('./player/class.js').Player, args: Array<string>) => any;
    }): void {
        const argsLength = arguments.length;

        if (argsLength !== 2) {
            throw new Error(`register got ${argsLength} arguments, but expected 2 arguments: command: {string}, data: {Object}`);
        }
        // console.warn(command, typeof usages, usages);
        if (typeof description !== 'string') throw new Error('Description must to be a string.');
        else if (requires !== false && typeof requires !== 'object' && !isArray(requires)) throw new Error('Requires must to be false or a object.');
        else if (typeof usages !== 'object') throw new Error('usages must to be a object or an array');
        else if (typeof callback !== 'function') throw new Error('Callback must to be a Function.');
        else if (!isArray(aliases) || !aliases.every(value => typeof value === 'string')) {
            throw new Error('Aliases must to be an Array of Strings');
        } else if (typeof requires === 'object' && !isArray(requires)) {
            Object.entries(requires).forEach(([key, value]) => {
                if (key !== 'tag' && key !== 'score') {
                    throw new Error(`The key: ${key}, in requires is must be tag or score`);
                } else if (typeof value !== 'object') {
                    throw new Error(`The value for the key: ${key}, must of type: Object`);
                } else {
                    if (key === 'score') {
                        Object.entries(value).forEach(([key, value]) => {
                            if (!isInteger(value)) {
                                throw new Error(`The value for the score: ${key}, must be of type: integer!`);
                            }
                        });
                    } else {
                        Object.entries(value).forEach(([key, value]) => {
                            if (typeof value !== 'boolean') {
                                throw new Error(`The value to the tag: ${key} must of type: Boolean!`);
                            }
                        });
                    }
                }
            });
        }
        if (typeof usages === 'object' && !isArray(usages)) {
            Object.entries(usages).forEach(([subcommand, value]) => {
                if (typeof value === 'object') {
                    value.forEach((key, value) => {
                        if (key !== 'subDescription' && key !== 'examples') {
                            throw new Error(`The keys in the value for ${subcommand} in usages in usages must be not subDescription or examples`);
                        } else if (key === 'examples' && !isArray(value)) {
                            throw new Error(`The value for {usuages: {${subcommand}: examples}}, must be of type: Array!`);
                        } else if (key === 'subDescription' && typeof value !== 'string') {
                            throw new Error(`The value for {usuages: {${subcommand}: subDescription}}, must be of type: string!`);
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
            this.__aliasesObject[prefix]![aliase] = command;
        });
        if (!this.commandsObject[prefix]) {
            this.commandsObject[prefix] = {};
        }
        this.commandsObject[prefix]![command] = {
            description,
            requires: requires as typeof this.commandsObject[string][string]['requires'],
            usages: usages as unknown as typeof this.commandsObject[string][string]['usages'],
            aliases,
            callback,
        };
    }

    getInfo(sender: Player, prefix: string, command: string, subCommand?: string, permissions = true): void {
        const argsLength = arguments.length;
        if (argsLength > 3 || argsLength > 5) {
            throw new Error(`getInfo got ${argsLength} arguments, but expected 3-5 arguments: sender: {Player}, command: {string}, permissions?:true: {Boolean}`);
        }
        if (this.commandsObject[prefix]) {
            const { requires, description, usages } = this.commandsObject[prefix]![command]!;
            const { score, tag } = requires;
            // content.warn(this[prefix][command]);
            if (requires) {
                let notPermissions;
                if (score) {
                    Object.entries(score).forEach(([objective, value]) => {
                        // content.warn({ [objective]: sender.scores[objective] });
                        if (sender.scores[objective] !== value) { notPermissions = true; }
                    });
                }
                if (tag) {
                    const tags = sender.getTags();
                    Object.entries(tag).forEach(([tag]) => { if (tags.includes(tag)) { notPermissions = true; } });
                }
                if (notPermissions && permissions) {
                    sender.sendMessage(`§cyou do not have permission to use view this command!`);
                    return;
                }
            }
            if (subCommand && typeof usages === 'object' && !isArray(usages)) {
                const { examples, subDescription } = this.commandsObject[prefix]![command]!.usages[subCommand]!;
                sender.playSound('note.bass');
                sender.sendMessage(`§e${command}:\n${description}\n§fUsage:${Object.entries(usages).map(([item], i) => `\n - ${prefix}${command} ${usages[i]}`).join("")}`);



            } else {
                if (!isArray(usages)) {
                    let usagesArray: string[] = [];
                    Object.entries(usages).forEach(([subCommand, { examples, subDescription }]) => usagesArray.push(`\n - ${prefix}${command} ${subCommand}\n    - description: ${subDescription}\n    - examples: \n${examples.map(example => `      - ${prefix}${example}\n`).join('')}`));
                    console.warn(JSON.stringify(usagesArray));

                    sender.runCommandAsync('playsound note.hat @s');
                    sender.sendMessage(`§e${command}:\n${description}\n§fUsage:${usagesArray.join('')}`);
                } else {
                    sender.sendMessage(`§e${command}:\n${description}\n§fUsage:${usages.map((item, i) => `\n - ${prefix}${command} ${usages[i]}`).join("")}`);
                    sender.runCommandAsync('playsound note.hat @s');

                }



            }


        } else {
            if (!command) return this.invalidSyntax(`help`, sender, command, ['']);
        }
    };
    getCommandFromAliases(prefix: string, aliase: string) {
        if (!this.commandsObject[prefix]) return;
        Object.entries(this.commandsObject[prefix]!).forEach(([command, { aliases }]) => {
            if (aliases.includes(aliase)) {
                return command;
            }
        });
    }
    /**
     * @method run Run command callback.
     * @param {string} cmdName Command name.
     * @param {string} sender Command invoker sender class.
     * @param {Array<string>} args Args.
     */
}

let commandBuilder = new CommandBuilder();

export default commandBuilder;

