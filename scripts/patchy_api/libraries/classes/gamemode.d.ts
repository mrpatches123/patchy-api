import { Player as PlayerType } from "@minecraft/server";
import { Player } from "./player/class";
export declare const gamemodeMap: {
    survival: number;
    creative: number;
    adventure: number;
    spectator: number;
};
export declare const gamemodeIndexMap: {
    [-1]: string;
    0: string;
    1: string;
    2: string;
    5: string;
};
declare class Gamemode {
    players: Record<string, -1 | 0 | 1 | 2 | 5>;
    refreshed: boolean;
    constructor();
    /**
     * @param {Player} player
     */
    get(player: PlayerType | Player): -1 | 0 | 1 | 2 | 5;
    /**
     * @private
     */
    refreshAll(): void;
}
declare const gamemode: Gamemode;
export default gamemode;
