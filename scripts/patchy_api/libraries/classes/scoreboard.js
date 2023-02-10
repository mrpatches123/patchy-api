import { content, orArray, server } from "../utilities.js";
import { Player, world } from "@minecraft/server";
const chunk = 2147483646;
const displaySlotIds = ['list', 'sidebar', 'belowName'];

class ScoreboardBuilder {
	constructor() {
		/**
		 * @type {{[id: string]: {[objective: string]: {gotten: boolean, value: number}}}}
		 */
		this.players = {};
		this.objectives = {};
	}
	/**
	 * @param {string} objective 
	 * @param {'list' | 'sidebar' | 'belowName'} displaySlotId
	 */
	setObjectiveDisplaySlot(objective, displaySlotId) {
		if (typeof objective !== 'string') throw new Error(`objective: ${objective}, at params[0] is of type: String!`);
		if (objective.startsWith('big_')) throw new Error(`objective: ${objective}, at params[0] starts with 'big_' so it cannot be displayed in a scoreboardDisplay!`);
		if (!displaySlotIds.includes(displaySlotId)) throw new Error(`displaySlotId: ${displaySlotId}, at params[1] is not one of the following: ${orArray(displaySlotIds)}!`);
		const scoreboardObjective = world.scoreboard.getObjective(objective);
		if (!scoreboardObjective) throw new Error(`objective: ${objective}, at params[0] does not exist!`);
		world.scoreboard.setObjectiveAtDisplaySlot(displaySlotId, { objective: scoreboardObjective });
		if (!this.objectives.hasOwnProperty(objective)) this.objectives[objective] = {};
		this.objectives[objective].displaySlot = displaySlotId;
	}
	/**
	 * @param {string} objective 
	 * @returns {string}
	 */
	clearObjectiveFromDisplaySlot(objective) {
		if (typeof objective !== 'string') throw new Error(`objective: ${objective}, at params[0] is of type: String!`);
		if (objective.startsWith('big_')) throw new Error(`objective: ${objective}, at params[0] starts with 'big_' so it cannot be displayed in a scoreboardDisplay!`);
		for (const displaySlotId of displaySlotIds) {
			const { objective: { id } } = world.scoreboard.getObjectiveAtDisplaySlot(displaySlotId);
			if (id !== objective) break;
			world.scoreboard.clearObjectiveAtDisplaySlot(displaySlotId);
			if (this.objectives.hasOwnProperty(objective)) delete this.objectives[objective].displaySlot;
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
		if (typeof objective !== 'string') throw new Error(`objective at params[0] is not of type: string`);
		if (!objective.startsWith('big_')) return server.objectiveAdd(objective);
		server.objectiveAdd(`${objective}*r`);
		server.objectiveAdd(`${objective}*q`);
	}
	/**
	 * @param {Player} player 
	 * @param {String} objective 
	 * @param {Number} value 
	 */
	set(player, objective, value) {
		const { id } = player;
		if (!this.players.hasOwnProperty(id)) this.players[id] = {};
		if (!this.players[id].hasOwnProperty(objective)) this.players[id][objective] = {};
		this.players[id][objective].value = value, this.players[id][objective].gotten = true;
		content.warn({ objective, value, this: this });
		if (!objective.startsWith('big_')) { server.scoreSetPlayer(objective, player, value, this.objectives?.[objective]?.displaySlot); return value; };
		const quotient = Math.floor(value / chunk);
		const remainder = value % chunk;
		server.scoreSetPlayer(`${objective}*q`, player, quotient);
		server.scoreSetPlayer(`${objective}*r`, player, remainder);
	}
	/**
	 * @param {Player} player 
	 * @param {String} objective 
	 * @param {boolean} forceDisk?=false
	 */
	get(player, objective, forceDisk) {
		const { id } = player;
		if (!this.players.hasOwnProperty(id)) this.players[id] = {};
		if (!this.players[id].hasOwnProperty(objective)) this.players[id][objective] = {};
		const { value, gotten } = this.players[id][objective];
		if (!forceDisk && gotten) return value;
		if (!objective.startsWith('big_')) {
			const score = server.scoreTest(objective, player, false);
			this.players[id][objective].value = score;
			this.players[id][objective].gotten = true;
			return score;
		};
		const quotient = server.scoreTest(`${objective}*q`, player, false);
		const remainder = server.scoreTest(`${objective}*r`, player, false);
		content.warn({ quotient, remainder });
		const score = quotient * chunk + remainder;
		this.players[id][objective].value = score;
		this.players[id][objective].gotten = true;
		return score;
	};
};
const scoreboardBuilder = new ScoreboardBuilder();
export default scoreboardBuilder;