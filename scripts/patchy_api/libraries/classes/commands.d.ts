import { Player } from "./player/class.js";
declare class CommandBuilder {
    private __aliasesObject;
    private commandsObject;
    invalidSyntax(command: string, sender: import('./player/class.js').Player, prefix: string, error: Array<string>): void;
    getPrefixs(): string[];
    getPrefix(message: string): string | undefined;
    /**
     *
     * @param {string} prefix
     * @param {import('./player/class.js').Player} sender
     * @returns { string }
     */
    listCommands(prefix: string, sender: import('./player/class.js').Player): string;
    check(message: string, sender: import('./player/class.js').Player, prefix: string): boolean;
    register(command: string, { description, aliases, usages, requires, prefix, callback }: {
        description?: string;
        aliases?: Array<string>;
        usages?: Array<string> | {
            [subCommand: string]: Array<string>;
        };
        requires?: {
            score?: {
                [objective: string]: number;
            };
            tag?: {
                [tag: string]: boolean;
            };
        } | false;
        prefix?: string;
        callback: (sender: import('./player/class.js').Player, args: Array<string>) => any;
    }): void;
    getInfo(sender: Player, prefix: string, command: string, subCommand?: string, permissions?: boolean): void;
    getCommandFromAliases(prefix: string, aliase: string): void;
}
declare let commandBuilder: CommandBuilder;
export default commandBuilder;
