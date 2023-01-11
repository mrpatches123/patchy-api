
import { eventBuilder, global, players, preformance, time } from '../../../patchy_api/modules.js';
import discipline from '../../libraries/discipline.js';

const mapToObj = inputMap => {
	let obj = {};
	for (const [key, value] of inputMap) {
		obj[key] = value;
	} return obj;
};

const { assign } = Object;

const gamemodes = [0, 1, 2];
const gamemodeNames = ['§aSurvival', '§6Creative', '§bAdventure'];
const gamemodeName = (previousGamemode, gamemode) => {
	return (previousGamemode !== gamemode) ? `${gamemodeNames[previousGamemode]} §7to ${gamemodeNames[gamemode]}` : gamemodeNames[gamemode];
};

eventBuilder.subscribe('gamemode', {
	tickAfterLoad: () => {
		const { toggles = {} } = global;
		const restrictArray = [
			!toggles.survival,
			!toggles.creative,
			!toggles.adventur
		];
		let playercount = 0;
		//  players.get({ gameMode: 0, scoreOptions: [{ exclude: true, maxScore: 1, minScore: 1, objective: 'staff' }] }, false).count
		// }, 100));
		let nonStaffPlayerCount = players.get({ scoreOptions: [{ exclude: true, maxScore: 1, minScore: 1, objective: 'staff' }] }).count;
		gamemodes.forEach(gamemode => {
			if (nonStaffPlayerCount <= playercount) return;
			players.get({ gameMode: gamemode, scoreOptions: [{ exclude: true, maxScore: 1, minScore: 1, objective: 'staff' }] }, false).iterate(player => {
				playercount++;
				const { memory, name, scores } = player;
				let { previousGamemode = gamemode } = memory;

				if (restrictArray[gamemode]) {
					const { gamemodeother } = scores;
					discipline.check(player, `§4failed ${gamemodeName(previousGamemode, gamemode)}`, 'gamemode');
					if (!gamemodeother) {
						player.runCommandAsync(`gamemode ${restrictArray.indexsOf(false)[0]}`);
					} else {
						player.runCommandAsync(`gamemode ${restrictArray.indexsOf(false)[1]}`);
					}
				}
				memory.previousGamemode = gamemode;
			});
		});
	}
});
