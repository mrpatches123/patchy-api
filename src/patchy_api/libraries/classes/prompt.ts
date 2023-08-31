import { rainbowWeight } from "../utilities.js";
import databases from "./database.js";
import global from "./global.js";
import players from "./players/export_instance.js";
import { Player } from "./player/class.js";
import { Vector } from "@minecraft/server";
// import { getChatNameTag } from '../../../factions/plugins/player/name_tag.js';
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
            this[id] = { message, anwsers };
            console.warn(message);
            // console.warn('add', message, JSON.stringify({ message, anwsers }));
        }
    } /**
    * @method remove Add command.
    * @param {Player} sender
    * @returns {void}
    */
    remove(sender) {
        delete this[id];
    }
    /**
    * @method check Add command.
    * @param {Player} sender
    * @param {String} message
    * @returns {void}
    */
    check(sender, message) {
        const { name, id } = sender;
        if (this[id]) {
            const { anwsers } = this[id];
            if (anwsers) {
                let bool = false;
                anwsers.forEach((key, value) => {
                    if (key.toLowerCase() === message.toLowerCase() || key.toLowerCase() === '%any%') {
                        // const nameTag = getChatNameTag(sender);
                        sender.sendMessage(`${name}: ${message}`);
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
        const { message } = this[id];
        sender.sendMessage(message);
    }
    /**
    * @method ask Alll command.
    * @param {Player} sender
    * @returns {void}
    */
    askAll() {
        players.get().iterate(sender => this.ask(sender));
    }
}

let promptBuilder = new PromptBuilder();

export default promptBuilder;