import { world } from "@minecraft/server";
import { overworld, positionBuilder, teleportBuilder } from "../../patchy_api/modules.js";


positionBuilder.add({
	stone: {
		location1: { x: 195, y: 104, z: 208 },
		location2: { x: 197, y: 106, z: 208 },
		callback: (player) => {
			teleportBuilder.teleport(player, 'toRedstone');
		}

	},
	redstone: {
		location1: { x: 197, y: 104, z: 232 },
		location2: { x: 200, y: 108, z: 232 },
		callback: (player) => {
			teleportBuilder.teleport(player, 'toStone');
		}
	},
	barrel: {
		location1: { x: 195, y: 104, z: 220 },
		location2: { x: 195, y: 106, z: 222 },
		callback: (player) => {
			teleportBuilder.teleport(player, 'random');
		}
	}
});

teleportBuilder.add({
	toRedstone: {
		dimension: overworld,
		location: { x: 199, y: 104, z: 231.5 },
		face: { x: 199.5, y: 104, z: 230.5 }
	},
	toStone: {
		dimension: overworld,
		location: { x: 196.5, y: 104, z: 209.5 },
		face: { x: 196.5, y: 104, z: 210.5 },
	},
	random: {
		dimension: overworld,
		location: { x: 208.5, y: 105, z: 220.5 },
		random: {
			maxRadius: 6,
			yMax: 109,
			yMin: 103
		}
	}

});