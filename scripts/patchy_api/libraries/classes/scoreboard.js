import { server } from "../utilities.js";
import { Player } from "@minecraft/server";
const chunk = 2147483646;
class ScoreboardBuilder {
	constructor() {
		/**
		 * @type {{[id: string]: {[objective: string]: {gotten: boolean, value: number}}}}
		 */
		this.players = {};
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
		if (!objective.startsWith('big_')) { server.scoreSet(objective, player, value); return value; };
		const quotient = Math.floor(value / chunk);
		const remainder = value % chunk;
		server.scoreSet(`${objective}*q`, player, quotient);
		server.scoreSet(`${objective}*r`, player, remainder);
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
		const score = quotient * chunk + remainder;
		this.players[id][objective].value = score;
		this.players[id][objective].gotten = true;
		return score;
	};
};
const scoreboardBuilder = new ScoreboardBuilder();
export default scoreboardBuilder;