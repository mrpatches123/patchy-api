"use strict";
// import { BlockType, MinecraftBlockTypes } from '@minecraft/server';
// import config from '../config.js';
// import { commandBuilder, fill, relativeParse } from '../modules.js';
// const { commandPrefix: prefix } = config;
// commandBuilder.register('fill', {
// 	description: "fill",
// 	usages: [
// 		`${prefix}fill`,
// 	],
// 	requires: {
// 		score: {
// 			staff: 1
// 		}
// 	},
// 	prefix,
// 	callback: (sender, args) => {
// 		let [x1, y1, z1, x2, y2, z2, ...blocks] = args;
// 		const { dimension } = sender;
// 		x1 = Math.floor(relativeParse(sender, x1, 'x'));
// 		y1 = Math.floor(relativeParse(sender, y1, 'y'));
// 		z1 = Math.floor(relativeParse(sender, z1, 'z'));
// 		x2 = Math.floor(relativeParse(sender, x2, 'x'));
// 		y2 = Math.floor(relativeParse(sender, y2, 'y'));
// 		z2 = Math.floor(relativeParse(sender, z2, 'z'));
// 		if (!x1) return sender.sendMessage('x1, at params [0] is not defined');
// 		if (!y1) return sender.sendMessage('y1, at params [1] is not defined');
// 		if (!z1) return sender.sendMessage('z1, at params [2] is not defined');
// 		if (!x2) return sender.sendMessage('x2, at params [3] is not defined');
// 		if (!y2) return sender.sendMessage('y2, at params [4] is not defined');
// 		if (!z2) return sender.sendMessage('z2, at params [5] is not defined');
// 		if (!blocks.length) return sender.sendMessage('blocks, at params [6] is not defined');
// 		let i = 0;
// 		for (const blockKey of blocks) {
// 			i++;
// 			if (!(MinecraftBlockTypes[blockKey] instanceof BlockType)) return sender.sendMessage(`block, at params[${i}] is not in MinecraftBlockTypes`);
// 		}
// 		fill.box({
// 			dimension,
// 			location1: { x: x1, y: y1, z: z1 },
// 			location2: { x: x2, y: y2, z: z2 },
// 			blocks: blocks.map(blockId => MinecraftBlockTypes[blockId])
// 		});
// 	}
// });
//# sourceMappingURL=fill.js.map