import { rainbowWeight } from "../utilities.js";
import databases from "./database.js";
import global from "./global.js";
import { getChatNameTag } from '../../../factions/plugins/player/name_tag.js';
const ranks = ['§7Low§f', '§6High§f', '§3Master§f'];
class PromptBuilder {
    constructor() {

    }
    /**
     * @method add Add command.
     * @param {Player} sender
     * @param {String} message
     * @param {{<anwser>String:<callback>(sender: <sender>)}} anwsers 
     * @returns {void}
     */
    add(sender, message, anwsers) {
        // console.warn('add', JSON.stringify(arguments));
        if (!sender) {
            throw new Error(`sender, args 0, is required`);
        } else if (!message) {
            throw new Error(`message, args 1, is required`);
        } else if (!anwsers) {
            throw new Error(`anwsers, args 2, is required`);
        } else if (typeof sender !== 'object') {
            throw new Error(`sender, args 0, must be a player`);
        } else if (typeof message !== 'string') {
            throw new Error(`${message}, args 1, must be a string`);
        } else if (typeof anwsers !== 'object') {
            throw new Error(`anwsers, args 2, must be a object`);
        } else {
            anwsers.forEach((key, value) => { if (typeof value !== 'function') throw new Error(`the callback for ${key} must be a function`); });
            this[sender.getName()] = { message, anwsers };
            console.warn(message);
            // console.warn('add', message, JSON.stringify({ message, anwsers }));
        }
    } /**
    * @method remove Add command.
    * @param {Player} sender
    * @returns {void}
    */
    remove(sender) {
        delete this[sender.getName()];
    }
    /**
    * @method check Add command.
    * @param {Player} sender
    * @param {String} message
    * @returns {void}
    */
    check(sender, message) {
        if (this[sender.getName()]) {
            const name = sender.getName()
            const { anwsers } = this[name];
            if (anwsers) {
                let bool = false;
                anwsers.forEach((key, value) => {
                    if (key.toLowerCase() === message.toLowerCase() || key.toLowerCase() === '%any%') {
                        const nameTag = getChatNameTag(sender);
                        sender.tellraw(`${nameTag}: ${message}`);
                        value(sender, message);
                        bool = true;
                    }
                });
                return bool;

            }

        }

    }
    /**
    * @method ask Add command.
    * @param {Player} sender
    * @returns {void}
    */
    ask(sender) {
        const { message } = this[sender.getName()];
        sender.runCommand(`tellraw @s {"rawtext":[{"text":"${message.replace('"', '\\"')}"}]}`);
    }
    /**
    * @method ask Alll command.
    * @param {Player} sender
    * @returns {void}
    */
    askAll() {
        [...world.getsenders()].filter(sender =>
            Object.keys(this).some(name => name === sender.getName())).forEach(sender => this.ask(sender));
    }
}

let promptBuilder = new PromptBuilder();

export default promptBuilder;