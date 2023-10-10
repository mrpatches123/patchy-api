import { commandBuilder, content, overworld, relativeParse } from "../modules.js";
import config from '../config.js';
const { commandPrefix: prefix } = config;
commandBuilder.register('text', {
	description: "Used to teleport and print",
	usages: [
		`${prefix}text create ~ ~ ~ text`,
		`${prefix}text create ~2 ~1 ~-1 text 233 dwdw`,
		`${prefix}text create ~* ~* ~* "textedwdw "`,
		`${prefix}text create ~223* ~2* ~1* text \\n`,
		`${prefix}text create 1 2 3 text`,
		`${prefix}text delete ~ ~ ~ text`,
		`${prefix}text delete ~2 ~1 ~-1 text 233 dwdw`,
		`${prefix}text delete ~* ~* ~* "textedwdw "`,
		`${prefix}text delete ~223* ~2* ~1* \\n`,
		`${prefix}text delete 1 2 3`,
	],
	prefix,
	requires: {
		score: {
			staff: 1
		}
	},
	aliases: ['t'],
	callback: (sender, args) => {
		const { dimension } = sender;
		let [subCommand, x, y, z, ...name] = args;
		if (!subCommand) return sender.sendMessage(`subCommand: ${subCommand}, at args[0] is not defined `);
		if (!x) return sender.sendMessage(`text: ${x}, at args[1] is not defined `);
		if (!y) return sender.sendMessage(`text: ${y}, at args[2] is not defined `);
		if (!z) return sender.sendMessage(`text: ${z}, at args[3] is not defined `);
		if (!name) return sender.sendMessage(`text: ${name}, at args[4...] is not defined `);
		const text = name.join(' ').replaceAll('\\n', '\n');
		const location = {
			x: relativeParse(sender, x, 'x'),
			y: relativeParse(sender, y, 'y'),
			z: relativeParse(sender, z, 'z')
		};
		content.warn({ location });
		switch (subCommand) {
			case 'c':
			case 'create': {
				const entity = dimension.spawnEntity('patches:floating_text', location);
				content.warn({ text });
				entity.nameTag = text;
				content.warn({ text, nameTag: entity.nameTag });
				break;
			}
			case 'd':
			case 'delete': {
				const entity = [...dimension.getEntities({ type: 'patches:floating_text', closest: 1, maxDistance: 2, location })][0];
				if (!entity) return sender.sendMessage(`No text entity found at ${x} ${y} ${z}!`);
				entity.triggerEvent('kill_text');
				break;
			}
		};
	}
});