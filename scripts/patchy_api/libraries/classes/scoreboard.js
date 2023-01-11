

import { Player, PlayerJoinEvent, world } from "@minecraft/server";
import { content, native, parseList, server } from '../utilities.js';
// import time from "./time.js";
import eventBuilder from "./events/export_instance.js";


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


		eventBuilder.subscribe("0init_scoreboard*IE", {
			worldInitialize: () => {
				server.objectiveRemove('identities');
				server.objectiveAdd('identities');
				server.objectiveAdd('playerId');
			},
			tick: () => {
				if (!this.autoUpdate) { return; }
				if (this.updatedThisTick) { return; }
				this.updateScores();
			},
			playerJoined: ({ player }) => {
				this.updatedThisTick = false; //resets updatedThisTick
				// time.start('scoreboardTest');
				const { scoreboard, name } = player;
				if (!scoreboard) { content.warn({ score: player.scoreAdd('identities'), name }); return true; }
				const { id } = scoreboard;
				this.scores[id] = {};
				this.ids[name] = id;
				player.scoreSet('playerId', id);
				this.scoreboardIdentities[id] = scoreboard;
			}
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
let playerScoreboard = new PlayersScoreboard();
export default playerScoreboard;

