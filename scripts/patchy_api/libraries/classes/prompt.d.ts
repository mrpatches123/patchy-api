import { Player } from "./player/class.js";
declare class PromptBuilder {
    data: Record<string, {
        message?: string;
        anwsers?: Record<string, ((sender: Player, message: string) => any)>;
    }>;
    constructor();
    add(sender: Player, message: string, anwsers: Record<string, ((sender: Player, message: string) => any)>): void;
    remove(sender: Player): void;
    check(sender: Player, message: string): boolean | void;
    /**
    * @method ask Add command.
    * @param {Player} sender
    * @returns {void}
    */
    ask(sender: Player): void;
    /**
    * @method ask Alll command.
    * @param {Player} sender
    * @returns {void}
    */
    askAll(): void;
}
declare let promptBuilder: PromptBuilder;
export default promptBuilder;
