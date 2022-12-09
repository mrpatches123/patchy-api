import { world, EntityQueryOptions, EntityQueryScoreOptions } from '@minecraft/server';
import { content, overworld, staff } from "../../../patchy_api/libraries/utilities.js";
import databases from '../../../patchy_api/libraries/classes/database.js';
import global from '../../../patchy_api/libraries/classes/global.js';
Array.prototype.indexsOf = function (val) {
	let indexs = [];
	for (let i = 0; i < this.length; i++) {
		if (val == this[i]) { indexs.push(i); }
	} return indexs;
};
const mapToObj = inputMap => {
	let obj = {};
	for (const [key, value] of inputMap) {
		obj[key] = value;
	} return obj;
};

const { assign } = Object;
import eventBuilder from '../../../patchy_api/libraries/classes/events.js';
import discipline from '../../libraries/discipline.js';
const gamemodes = [0, 1, 2];
const gamemodeNames = ['§aSurvival', '§6Creative', '§bAdventure'];
const gamemodeName = (previousGamemode, gamemode) => {
	return (previousGamemode !== gamemode) ? `${gamemodeNames[previousGamemode]} §7to ${gamemodeNames[gamemode]}` : gamemodeNames[gamemode];
};
eventBuilder.subscribe('gamemode', {
	tickAfterLoad: () => {
		const { joiningPlayers, toggles = {} } = global;
		const restrictArray = [
			!Boolean(toggles.survival),
			!Boolean(toggles.creative),
			!Boolean(toggles.adventure)
		];
		// content.warn({ restrictArray });
		let anticheat = databases.get('anticheat') ?? databases.add('anticheat');
		gamemodes.forEach(gamemode => {
			const players = [...world.getPlayers(Object.assign(new EntityQueryOptions(), { gameMode: gamemode, scoreOptions: [Object.assign(new EntityQueryScoreOptions(), { exclude: true, maxScore: 1, minScore: 1, objective: 'staff' })] }))]
				.filter(({ name: playerName }) => {
					return !joiningPlayers?.some(({ name: joinName }) => joinName === playerName);
				});

			// content.warn({ players: players.map(player => player.name) });
			players.forEach((id, player) => {

				const name = player.getName();
				// content.warn({ gameremode, name });
				const { playerId } = global.scoreObject[name] ?? {};
				// overworld.runCommandAsync(`say ${JSON.stringify(toggles)}`)


				let { previousGamemode = gamemode, gamemodeother = 0 } = global.playerMap[name] ?? {};
				if (restrictArray[gamemode]) {
					discipline.check(player, `§4failed ${gamemodeName(previousGamemode, gamemode)}`, 'gamemode');
					if (!gamemodeother) {
						player.runCommandAsync(`gamemode ${restrictArray.indexsOf(false)[0]}`);
					} else {
						player.runCommandAsync(`gamemode ${restrictArray.indexsOf(false)[1]}`);
					}
				}
				if (!global.playerMap[name]) {
					global.playerMap[name] = {};
				}
				global.playerMap[name].previousGamemode = gamemode;
			});
		});
	}
});
