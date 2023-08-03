

import { MinecraftBlockTypes } from '@minecraft/server';
import config from '../config.js';

import { commandBuilder, content, fill } from '../modules.js';

const { commandPrefix: prefix } = config;
const bounds = {};
const vector3Keys = ['x', 'y', 'z'];
function sizeTwoVector3(vector1, vector2) {
	return { x: Math.abs(vector1.x - vector2.x) + 1, y: Math.abs(vector1.y - vector2.y) + 1, z: Math.abs(vector1.z - vector2.z) + 1 };
};
commandBuilder.register('bound', {
	description: "bound",
	usages: [
		`${prefix}bound`,
		`${prefix}bound add key`,
		`${prefix}bound print key`,
		`${prefix}bound remove key`,
	],
	requires: {
		score: {
			staff: 1
		}
	},
	prefix,
	aliases: ['b'],
	callback: (sender, args) => {
		const { id, location } = sender;
		const [subCommand, key] = args;
		if (!subCommand) return sender.sendMessage('forgot subCommand');
		if (!key) return sender.sendMessage('forgot key');
		switch (subCommand) {
			case 'add': {
				if (!bounds.hasOwnProperty(id)) bounds[id] = {};
				if (!bounds[id].hasOwnProperty(key)) bounds[id][key] = [{}, {}];
				vector3Keys.forEach((xyz) => {
					const coord = Math.floor(location[xyz]);
					if (!bounds[id][key][1].hasOwnProperty(xyz) || coord > bounds[id][key][1][xyz]) {
						bounds[id][key][1][xyz] = coord;
					} else if (!bounds[id][key][0].hasOwnProperty(xyz) || coord < bounds[id][key][0][xyz]) {
						bounds[id][key][0][xyz] = coord;
					}
				});
				content.chatFormat(bounds[id][key]);
				break;
			}
			case 'print': {
				console.warn(`createPlot('${key}', ${JSON.stringify({
					start: bounds[id][key][0],
					size: sizeTwoVector3(...bounds[id][key])
				}, null, 4)});`);
				break;
			}
			case 'remove': {
				delete bounds[id][key];
				break;
			}
		}
	}
});