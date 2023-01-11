import fs from 'fs';
const path = `C:/Users/mrpat/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_behavior_packs/patchy-api/node_modules/@minecraft/server/index.d.ts`;
const typeRegex = /Entity\w+Component/g;
const componentIdRegex = /(?<=Entity\w+Component[\S\s]+componentId = ')\w+:\w+\.?\w+/g;
const file = fs.readFileSync(path).toString();
const types = file.match(typeRegex);
const componentIds = file.match(componentIdRegex);
const playerPath = `C:/Users/mrpat/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_behavior_packs/patchy-api/scripts/patchy_api/libraries/classes/player.d.ts`;
const filePlayer = fs.readFileSync(playerPath).toString();
const properties = filePlayer.match(/\w+(?=: \w+;)/g);
const methods = filePlayer.match(/\w+(?=\(.*?\))/g);
/**
 * @typedef {Object}
 */
const string = `import { ${types.join(', ')} } from '@minecraft/server';
interface EntityComponents {
${types.map((type, i) => {
	const componentId = componentIds[i];
	return `'${componentId}': ${type};\n'${componentId.replace('minecraft:', '')}': ${type};`;
}).join('\n')
	}
}
/**
 * @typedef {Object} EntityComponents 
	${types.map((type, i) => {
		const componentId = componentIds[i];
		return ` * @property {${type}} '${componentId}'\n * @property {${type}} '${componentId.replace('minecraft:', '')}'`;
	}).join('\n')
	}
*/
class Player {
	constructor(player) {
		this.player = player
	}
	${properties.map((property) => `get ${property}() {
		return this.player.${property};
	}`).join('\n')}
	${methods.map((method) => `${method}(...args) {
		return this.player.${method}(...args);
	}`).join('\n')}
}`;
const outPath = 'C:/Users/mrpat/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_behavior_packs/patchy-api/scripts/patchy_api/libraries/classes/types/comp_out.ts';

fs.writeFileSync(outPath, string);