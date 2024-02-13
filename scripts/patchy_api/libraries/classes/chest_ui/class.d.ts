import { Player } from '../player/class.js';
export type sizesUnion = 'single' | 'double' | 'small' | 'large';
declare class ChestFormData {
    private titleText;
    private buttonArray;
    private availableButtons;
    constructor(size?: string);
    title(text: string): this;
    button(slot?: number, itemName?: string, itemDesc?: string[], iconPath?: string, stackSize?: number, enchanted?: boolean): this;
    pattern(from: [number, number], pattern: string[], key: {
        [key: string]: {
            data: {
                itemName?: string;
                itemDesc?: string[];
                stackSize?: number;
                enchanted?: boolean;
            };
            iconPath: string;
        };
    }): this;
    show(player: Player): Promise<import("@minecraft/server-ui").ActionFormResponse>;
}
export { ChestFormData };
