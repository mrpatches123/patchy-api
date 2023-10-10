import { Player as PlayerType } from "@minecraft/server";
import { Player } from './player/class.js';
declare class Loads {
    loads: {
        [playerId: string]: Player;
    };
    loaded: boolean;
    constructor();
    awaitLoad(player: PlayerType): Promise<void>;
    get players(): {
        [playerId: string]: Player;
    };
}
declare const loads: Loads;
export default loads;
