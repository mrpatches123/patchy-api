import { world, BlockLocation, Location } from "@minecraft/server";
import { overworld, positionBuilder, teleportBuilder } from "../../patchy_api/modules.js";


positionBuilder.add({
	stone: {
		location1: new BlockLocation(195, 104, 208),
		location2: new BlockLocation(197, 106, 208),
		callback: (player) => {
			teleportBuilder.teleport(player, 'toRedstone');
		}

	},
	redstone: {
		location1: new BlockLocation(197, 104, 232),
		location2: new BlockLocation(200, 108, 232),
		callback: (player) => {
			teleportBuilder.teleport(player, 'toStone');
		}
	},
	barrel: {
		location1: new BlockLocation(195, 104, 220),
		location2: new BlockLocation(195, 106, 222),
		callback: (player) => {
			teleportBuilder.teleport(player, 'random');
		}
	}
});

teleportBuilder.add({
	toRedstone: {
		dimension: overworld,
		location: new BlockLocation(199, 104, 231),
		face: new Location(199.5, 104, 230.5)
	},
	toStone: {
		dimension: overworld,
		location: new BlockLocation(196, 104, 209),
		face: new BlockLocation(196, 104, 210),
	},
	random: {
		dimension: overworld,
		location: new Location(208.0, 105, 220.0),
		random: {
			maxRadius: 6,
			yMax: 109,
			yMin: 103
		}
	}

});
;