

import { Player, world } from "mojang-minecraft";
import { content, native } from "../utilities";
// import { content, native } from '../utilities.js';
// import time from "./time.js";


/**
 * @function parseList spreads all arrays in an array into one single array
 * @param {Array} list 
 * @returns Array
 */
function parseList(list) {
	if (!Array.isArray(list)) { return; }
	for (let i = 0; i < list.length; i++) {
		const item = list[i];
		if (Array.isArray(item)) {
			list = [...list.slice(undefined, i), ...item, ...list.slice(i + 1)];
			i--;
		} else {
			list[i] = list[i];
		}

	}
	return list;
}

const overworld = world.getDimension('overworld');
/**
 * @function objectiveAdd creates a scoreboard Objective
 * @param {String} objectiveId 
 * @param {String} display Optional? displayName for the Objective
 * @returns
 */
export function objectiveAdd(objectiveId, display = '') {
	try {
		overworld.runCommand(`scoreboard objectives add ${objectiveId} dummy ${display}`);
	} catch (error) { console.warn(error, error.stack); }
}
/**
 * @function objectiveAdd removes a scoreboard Objective
 * @param {String} objectiveId 
 * @returns
 */
export function objectiveRemove(objectiveId) {
	try {
		overworld.runCommand(`scoreboard objectives remove ${objectiveId}`);
	} catch (error) { console.warn(error, error.stack); }
}
/**
 * @function scoreAdd adds to a players scoreboard value and returns the resulting value
 * @param {Player} player 
 * @param {String} objectiveId 
 * @param {Number} value Optional? default = 0
 * @returns Number
 */
export function scoreAdd(player, objectiveId, value = 0) {
	try {
		return Number(player.runCommand(`scoreboard players add @s ${objectiveId} ${value}`).statusMessage.match(/-?\d+(?=[^-\d]$)/));
	} catch { }
}
/**
 * @function Set sets a player's scoreboard value and returns the resulting value
 * @param {Player} player 
 * @param {String} objectiveId 
 * @param {Number} value Optional? default = 0
 * @returns Number
 */
function scoreSet(player, objectiveId, value = 0) {
	try {
		return Number(player.runCommand(`scoreboard players set @s ${objectiveId} ${value}`).statusMessage.match(/-?\d+(?=$)/));
	} catch { }
}
class PlayersScoreboard {
	constructor() {
		this.updatedThisTick = false; //system to prevent excess scorebaord gets
		this.loaded = false; //checks if server loaded and commands can be ran
		this.joiningPlayers = {}; //players that are loading in
		this.scores = {}; //all player's scores
		this.ids = {}; //the scoreboard ids of all players
		this.scoreboardIdentities = {}; /*the scoreboardIdentities of all players. 
		so you dont have to loop over all of them to get one score*/
		this.autoUpdate = true; // if you want it to auto update this.scores every tick

		//allow system to wait until player loads in
		world.events.playerJoin.subscribe(({ player }) => {
			const { name } = player;
			this.joiningPlayers[name] = player;
		});

		world.events.tick.subscribe(() => {
			try {
				this.updatedThisTick = false; //resets updatedThisTick
				// time.start('scoreboardTest');


				const joiningPlayersArray = Object.values(this.joiningPlayers);
				if (joiningPlayersArray.length) {
					//runs setup when player joins to reduce resouces
					joiningPlayersArray.forEach(player => {
						const { name } = player;
						try {
							try {


								player.runCommand('testfor @s');
							} catch { }
							delete this.joiningPlayers[name];
							if (!this.loaded) {
								objectiveRemove('scoreIdentities');
								objectiveAdd('scoreIdentities');
								objectiveAdd('playerId');
								this.loaded = true;
							}

							scoreAdd(player, 'scoreIdentities');
							const { scoreboard } = world;
							const scoreboardIdentity = player.scoreboard;
							const { id } = scoreboardIdentity;
							this.scores[id] = {};
							this.ids[name] = id;
							scoreSet(player, 'playerId', id);
							this.scoreboardIdentities[id] = scoreboardIdentity;
						} catch (error) { console.warn(error, error.stack); }
					});
				}
				if (!this.loaded) { return; }
				if (!this.autoUpdate) { return; }
				if (this.updatedThisTick) { return; }
				this.updateScores();
				// content.warn({ time: time.end('scoreboardTest'), scores: this.scores });

			} catch (error) { console.warn(error, error.stack); }
		});
		//removes player from system when they leave
		world.events.playerLeave.subscribe(({ playerName }) => {

			const id = this.ids[playerName];
			delete this.scores[id];
			delete this.scoreboardIdentities[id];
		});
	}
	/**
	 * @method getId gets A players scoreboard Id
	 * @param {player} boolean 
	 * @returns Number
	 */

	getId({ name }) {
		return this.ids[name];
	}
	/**
	 * @method getScore gets a players score from objective
	 * @param {Player} player 
	 * @param {string} objectiveId 
	 * @returns Number
	 */
	getScore({ name, scoreboard: scoreboardIdentity }, objectiveId) {
		let objective;
		try {
			objective = world.scoreboard.getObjective(objectiveId);
		} catch { }
		if (!objective) { return false; }
		let score;
		try {
			score = objective.getScore(scoreboardIdentity);
		} catch { }
		if (score === undefined) { return; }
		return score;
	};
	/**
	 * @method getScoresListed gets a players scores from a list or an array of objectiveIds
	 * @param {Player} player 
	 * @param {Array<String>} objectives or argument Strings 
	 * @returns Object
	 */
	getScoresListed(player, ...objectives) {
		const scoreObject = {};
		if (!objectives.length) { return; }
		objectives = parseList(objectives);
		for (let i = 0; i < objectives.length; i++) {
			const objectiveId = objectives[i];
			const score = this.getScore(player, objectiveId);
			if (!score) { continue; }
			scoreObject[objectiveId] = score;
		}
		return;
	};
	/**
	 * @method getScores gets a players scores or all players' scores
	 * @param {Player} player Optional?
	 * @returns Object
	 */
	getScores(player) {
		// if (this.updatedThisTick) { return; }
		// this.updatedThisTick = true;
		if (player) {
			const { name } = player;
			// const id = this.ids[name];
			return this.scores[name];
		} else {
			return this.scores;
		}
	}


	/**
	 * @method updateScores updates the scores in this.scores
	 * @param {Boolean} force if true, forces the update meaning it will happen even if it already has that tick 
	 * @returns 
	 */
	updateScores(force = false) {
		if (!force && this.updatedThisTick) { return; }
		this.updatedThisTick = true;
		const { scoreboard } = world;
		const objectives = scoreboard.getObjectives();

		const scoreboardIdentitiesArray = Object.values(this.scoreboardIdentities);
		for (let i = 0; i < objectives.length; i++) {
			const objective = objectives[i];
			const { id: objectiveId } = objective;
			for (let a = 0; a < scoreboardIdentitiesArray.length; a++) {
				const scoreboardIdentity = scoreboardIdentitiesArray[a];
				const { id } = scoreboardIdentity;
				let score;
				try {
					score = objective.getScore(scoreboardIdentity);
				} catch {
					delete this.scores[id][objectiveId];
				}
				if (score === undefined) { continue; }
				this.scores[id][objectiveId] = score;
			}
		}
	}
}
const playerScoreboard = new PlayersScoreboard();
export default playerScoreboard;

