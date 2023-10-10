import { ObjectiveSortOrder, DisplaySlotId } from "@minecraft/server";
import { Player } from './player/class.js';
declare class ScoreboardBuilder {
    players: Record<string, Record<string, {
        gotten?: boolean;
        value?: number;
    }>>;
    objectives: Record<string, {
        displaySlot?: DisplaySlotId.List | DisplaySlotId.Sidebar | DisplaySlotId.BelowName;
    }>;
    constructor();
    /**
     * @param {string} objective
     * @param {'List' | 'Sidebar' | 'BelowName'} displaySlotId
     */
    setObjectiveDisplaySlot(objective: string, displaySlotId: DisplaySlotId, sortOrder?: ObjectiveSortOrder): void;
    /**
     * @param {string} objective
     * @returns {string}
     */
    clearObjectiveFromDisplaySlot(objective: string): boolean;
    /**
     * tag big_ at the beginning the objective to make it have up to 4.611686e+18 else its 2147483646
     * if big stored on `${objective}*r` (remainder or the leftover) and `${objective}*q` (quotient or count of 2147483646s)
     * else just stored on the objective
     * @param {String} objective
     */
    add(objective: string): true | undefined;
    /**
     * @param {Player} player
     * @param {String} objective
     * @param {Number} value
     */
    set(player: Player, objective: string, value?: number): number | boolean | undefined;
    /**
     * @param {Player} player
     * @param {String} objective
     * @param {boolean} forceDisk?=false
     */
    get(player: Player, objective: string, forceDisk?: boolean): number | undefined;
}
declare const scoreboardBuilder: ScoreboardBuilder;
export default scoreboardBuilder;
