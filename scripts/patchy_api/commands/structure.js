
import { commandBuilder, structureBuilder } from '../modules.js';
import config from '../config.js';
import { BlockLocation } from '@minecraft/server';
const { commandPrefix: prefix } = config;
function relativeParse(player, input, direction) {
	if (input.includes('~')) {
		if (input.endsWith('*')) {
			return ((player.location[direction] + Number(input.replace(/[*~]/g, ''))) | 0) + 0.5;
		} else {
			return player.location[direction] + Number(input.replace('~', ''));
		}
	} else {
		return Number(input);
	}
}
commandBuilder.register('structure', {
	description: "Used to get the Stringified value of something stored in requests",
	usages: [
		`${prefix}requests <key>`,
	],
	prefix,
	requires: {
		score: {
			staff: 1
		}
	},
	aliases: ['struct'],
	callback: (sender, args) => {
		let [action, name, x1, y1, z1, x2, y2, z2] = args;
		const { dimension } = sender;
		x1 = Math.floor(relativeParse(sender, x1, 'x'));
		y1 = Math.floor(relativeParse(sender, y1, 'y'));
		z1 = Math.floor(relativeParse(sender, z1, 'z'));
		const location1 = new BlockLocation(x1, y1, z1);

		switch (action) {
			case 'save': {
				x2 = Math.floor(relativeParse(sender, x2, 'x'));
				y2 = Math.floor(relativeParse(sender, y2, 'y'));
				z2 = Math.floor(relativeParse(sender, z2, 'z'));
				const location2 = new BlockLocation(x2, y2, z2);
				structureBuilder.save({
					name,
					location1,
					location2,
					dimension,
					saveMode: 'disk'
				});
				break;
			} case 'load': {
				structureBuilder.load({
					dimension,
					name,
					location: location1
				});
				break;
			}
		}
	}
});

//!struct save test ~* ~-40* ~* ~150* ~80* ~150*