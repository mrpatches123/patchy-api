

import { MinecraftBlockTypes } from '@minecraft/server';
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
	callback: (sender, args) => {
		fill.box({
			location1: { x: 31, y: -63, z: 31 },
			location2: { x: -32, y: 100, z: -32 },
			blocks: MinecraftBlockTypes.air
		});
	}
});