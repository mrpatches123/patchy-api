import { content, isDefined, orArray, server } from "../utilities.js";
import { world, Player as PlayerType, ObjectiveSortOrder, DisplaySlotId } from "@minecraft/server";
import { Player } from './player/class.js';
import eventBuilder from "./events/export_instance.js";
const chunk = 2147483646;
const displaySlotIds = [DisplaySlotId.List, DisplaySlotId.Sidebar, DisplaySlotId.BelowName];
const sortOrders = [ObjectiveSortOrder.Ascending, ObjectiveSortOrder.Descending];
class ScoreboardBuilder {
    constructor() {
        /**
         * @type {}
         */
        this.players = {};
        this.objectives = {};
    }
    /**
     * @param {string} objective
     * @param {'List' | 'Sidebar' | 'BelowName'} displaySlotId
     */
    setObjectiveDisplaySlot(objective, displaySlotId, sortOrder = ObjectiveSortOrder.Ascending) {
        if (typeof objective !== 'string')
            throw new Error(`objective: ${objective}, at params[0] is of type: String!`);
        if (objective.startsWith('big_'))
            throw new Error(`objective: ${objective}, at params[0] starts with 'big_' so it cannot be displayed in a scoreboardDisplay!`);
        if (!displaySlotIds.includes(displaySlotId))
            throw new Error(`displaySlotId: ${displaySlotId}, at params[1] is not one of the following: ${orArray(displaySlotIds)}!`);
        if (sortOrder && !sortOrders.includes(sortOrder))
            throw new Error(`sortOrder: ${sortOrder}, at params[2] is not one of the following: ${orArray([ObjectiveSortOrder.Ascending, ObjectiveSortOrder.Descending])}!`);
        const scoreboardObjective = world.scoreboard.getObjective(objective);
        if (!scoreboardObjective)
            throw new Error(`objective: ${objective}, at params[0] does not exist!`);
        content.warn({ scoreboardObjective: scoreboardObjective.id, displaySlotId });
        world.scoreboard.setObjectiveAtDisplaySlot(displaySlotId, { objective: scoreboardObjective });
        if (!this.objectives.hasOwnProperty(objective))
            this.objectives[objective] = {};
        this.objectives[objective].displaySlot = displaySlotId;
    }
    /**
     * @param {string} objective
     * @returns {string}
     */
    clearObjectiveFromDisplaySlot(objective) {
        if (typeof objective !== 'string')
            throw new Error(`objective: ${objective}, at params[0] is of type: String!`);
        if (objective.startsWith('big_'))
            throw new Error(`objective: ${objective}, at params[0] starts with 'big_' so it cannot be displayed in a scoreboardDisplay!`);
        for (const displaySlotId of displaySlotIds) {
            const { objective: { id } } = world.scoreboard.getObjectiveAtDisplaySlot(displaySlotId);
            if (id !== objective)
                break;
            world.scoreboard.clearObjectiveAtDisplaySlot(displaySlotId);
            if (this.objectives.hasOwnProperty(objective))
                delete this.objectives[objective].displaySlot;
            return true;
        }
        return false;
    }
    /**
     * tag big_ at the beginning the objective to make it have up to 4.611686e+18 else its 2147483646
     * if big stored on `${objective}*r` (remainder or the leftover) and `${objective}*q` (quotient or count of 2147483646s)
     * else just stored on the objective
     * @param {String} objective
     */
    add(objective) {
        if (typeof objective !== 'string')
            throw new Error(`objective at params[0] is not of type: string`);
        if (!objective.startsWith('big_'))
            return server.objectiveAdd(objective);
        server.objectiveAdd(`${objective}*r`);
        server.objectiveAdd(`${objective}*q`);
    }
    /**
     * @param {Player} player
     * @param {String} objective
     * @param {Number} value
     */
    set(player, objective, value) {
        if (player instanceof PlayerType)
            throw new Error(`Player, at params[0] is of type: PlayerType(world player)!`);
        if (!(player instanceof Player))
            throw new Error(`Player, at params[0] is not of type: Player(not world player)!`);
        if (!world.scoreboard.getObjective(objective))
            throw new Error(`objective, ${objective} at params[1] does not Exist!`);
        if (isDefined(value) && typeof value !== 'number')
            throw new Error(`value, ${value} at params[2] is not of type: Number!`);
        const { id } = player;
        if (!this.players.hasOwnProperty(id))
            this.players[id] = {};
        this.players[id][objective] ??= {};
        this.players[id][objective].value = value, this.players[id][objective].gotten = true;
        // if (objective === 'skycoins') content.warn({ objective, value, player: player.name, objective: this.players[id][objective] });
        // content.warn({ objective, value, this: this });
        if (!objective.startsWith('big_')) {
            if (!isDefined(value)) {
                const bool = server.scoreResetPlayer(objective, player);
                eventBuilder.getEvent('scoreboardChange').iterate({ player, objective, value });
                return bool;
            }
            ;
            server.scoreSetPlayer(objective, player, value, this.objectives?.[objective]?.displaySlot);
            eventBuilder.getEvent('scoreboardChange').iterate({ player, objective, value });
            return value;
        }
        ;
        if (!isDefined(value)) {
            const bool = server.scoreResetPlayer(`${objective}*q`, player) && server.scoreResetPlayer(`${objective}*r`, player);
            eventBuilder.getEvent('scoreboardChange').iterate({ player, objective, value });
            return bool;
        }
        const quotient = Math.floor(value / chunk);
        const remainder = value % chunk;
        server.scoreSetPlayer(`${objective}*q`, player, quotient);
        server.scoreSetPlayer(`${objective}*r`, player, remainder);
        eventBuilder.getEvent('scoreboardChange').iterate({ player, objective, value });
    }
    /**
     * @param {Player} player
     * @param {String} objective
     * @param {boolean} forceDisk?=false
     */
    get(player, objective, forceDisk) {
        if (!(player instanceof Player))
            throw new Error(`Player, at params[1] is not the correct type of player!`);
        if (!world.scoreboard.getObjective(objective))
            throw new Error(`objective, ${objective} at params[1] does not Exist!`);
        const { id } = player;
        // if (player.hasOwnProperty('player')) player = player.player;
        if (!this.players.hasOwnProperty(id))
            this.players[id] = {};
        this.players[id][objective] ??= {};
        const { value, gotten } = this.players[id][objective];
        if (!forceDisk && gotten)
            return value;
        if (!objective.startsWith('big_')) {
            const score = server.scoreTest(objective, player);
            this.players[id][objective].value = score;
            this.players[id][objective].gotten = true;
            return score;
        }
        ;
        const quotient = server.scoreTest(`${objective}*q`, player) ?? 0;
        const remainder = server.scoreTest(`${objective}*r`, player) ?? 0;
        // content.warn({ quotient, remainder });
        const score = (isDefined(quotient) && isDefined(remainder)) ? quotient * chunk + remainder : undefined;
        this.players[id][objective].value = score;
        this.players[id][objective].gotten = true;
        return score;
    }
    ;
}
;
const scoreboardBuilder = new ScoreboardBuilder();
export default scoreboardBuilder;
//# sourceMappingURL=scoreboard.js.map