

import { BlockLocation, MinecraftBlockTypes } from '@minecraft/server';
import config from '../config.js';

import { commandBuilder, fill } from '../modules.js';

const { commandPrefix: prefix } = config;

commandBuilder.register('fill', {
	description: "fill",
	usages: [
		`${prefix}fill`,
	],
	requires: {
		score: {
			staff: 1
		}
	},
	prefix,
	aliases: ['k'],
	callback: (sender, args) => {
		fill.box({
			location1: new BlockLocation(31, -63, 31),
			location2: new BlockLocation(-32, 100, -32),
			blocks: MinecraftBlockTypes.air
		});
	}
});