import { readFileSync, writeFileSync } from 'fs';
import { Events } from './minecraft.js';
const eventKeys = Object.keys(Events);

const eventTypeProperties = {
	beforeChat: {
		cancellable: true,
		playerKey: 'sender',
		playerOnly: true
	},
	beforeDataDrivenEntityTriggerEvent: {
		entityEvent: true,
		cancellable: true,
		playerKey: 'entity',
		playerOnly: false
	},
	beforeExplosion: {
		cancellable: true,
		playerKey: 'source',
		playerOnly: false
	},
	beforeItemDefinitionEvent: {
		cancellable: true,
		playerKey: 'source',
		playerOnly: false
	},
	beforeItemUse: {
		cancellable: true,
		playerKey: 'source',
		playerOnly: false
	},
	beforeItemUseOn: {
		cancellable: true,
		playerKey: 'source',
		playerOnly: false
	},
	beforePistonActivate: {
		cancellable: true
	},
	beforeWatchdogTerminate: {
		cancellable: true
	},
	blockBreak: {
		playerKey: 'player',
		playerOnly: true
	},
	blockExplode: {
		playerKey: 'source',
		playerOnly: false
	},
	blockPlace: {
		playerKey: 'player',
		playerOnly: true
	},
	buttonPush: {
		playerKey: 'source',
		playerOnly: false
	},
	chat: {
		playerKey: 'sender',
		playerOnly: true
	},
	dataDrivenEntityTriggerEvent: {
		entityEvent: true,
		playerKey: 'source',
		playerOnly: false
	},
	effectAdd: {
		entityEvent: true,
		playerKey: 'source',
		playerOnly: false
	},
	entityCreate: {
		entityEvent: true,
		playerKey: 'source',
		playerOnly: false
	},
	entityHit: {
		entityEvent: true,
		playerKey: 'source',
		playerOnly: false
	},
	entityHurt: {
		entityEvent: true,
		playerKey: 'source',
		playerOnly: false
	},
	explosion: {
		entityEvent: true,
		playerKey: 'source',
		playerOnly: false
	},
	itemCompleteCharge: {
		playerKey: 'source',
		playerOnly: false
	},
	itemDefinitionEvent: {
		playerKey: 'source',
		playerOnly: false
	},
	itemReleaseCharge: {
		playerKey: 'source',
		playerOnly: false
	},
	itemStartCharge: {
		playerKey: 'source',
		playerOnly: false
	},
	itemStartUseOn: {
		playerKey: 'source',
		playerOnly: false
	},
	itemStopCharge: {
		playerKey: 'source',
		playerOnly: false
	},
	itemStopUseOn: {
		playerKey: 'source',
		playerOnly: false
	},
	itemUse: {
		playerKey: 'source',
		playerOnly: false
	},
	itemUseOn: {
		playerKey: 'source',
		playerOnly: false
	},
	leverActivate: {
		playerKey: 'player',
		playerOnly: true
	},
	pistonActivate: {

	},
	playerJoin: {
		playerKey: 'player',
		playerOnly: true
	},
	playerLeave: {
		playerKey: 'player',
		playerOnly: true
	},
	projectileHit: {
		entityEvent: true
	},
	tick: {

	},
	weatherChange: {

	},
	worldInitialize: {

	},
	tickAfterLoad: {
		custom: true
	},
	playerJoined: {
		custom: true,
		playerKey: 'player',
		playerOnly: true
	},
	playerHit: {
		custom: true,
		playerKey: 'player',
		playerOnly: true
	},
	playerHurt: {
		custom: true,
		playerKeys: 'player',
		playerOnly: true
	},
	playerDeath: {
		custom: true,
		playerKeys: 'player',
		playerOnly: true
	},
	playerSpawned: {
		custom: true,
		playerKeys: 'player',
		playerOnly: true
	},
	playerLeft: {
		custom: true,
		playerKeys: 'player',
		playerOnly: true
	},
	requestAdded: {
		custom: true
	},
	worldLoad: {
		custom: true
	}
};
const imports = new Set();
const typings = readFileSync('C:/Users/mrpat/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_behavior_packs/patchy-api/node_modules/@minecraft/server/index.d.ts');
const getEventExp = (key) => new RegExp(`(?:${key}) (?:\\{ || extends \\w+)(?:[^\\}]+\\n)+\\}`);
const classProperties = {};
const jsTypes = ['string', 'number', 'boolean', 'Player'];
eventKeys.forEach((eventKey) => {
	const eventMatch = typings.toString().match(getEventExp(Events[eventKey]));
	const properties = eventMatch.toString().match(/(?:readonly )?\w+: .*(?=;)/g);
	classProperties[eventKey] = properties.map((value) => {
		const type = value.match(/(?<=: )\w+/);
		imports.add(type[0]);
		return value;
	});
});
writeFileSync('C:\\Users\\mrpat\\AppData\\Local\\Packages\\Microsoft.MinecraftUWP_8wekyb3d8bbwe\\LocalState\\games\\com.mojang\\development_behavior_packs\\patchy-api\\scripts\\patchy_api\\libraries\\classes\\types\\eventsTypes.d.ts',
	`import { ${[...imports].filter(value => !jsTypes.includes(value)).join(', ')} } from '@minecraft/server';
${eventKeys.map(eventKey => `export class ${Events[eventKey]} {\n${classProperties[eventKey].map((value) => `	${value};`).join('\n')}\n}`).join('\n')}
`);

// import { ${Object.values(Events).join(', ')} } from '@minecraft/server';
// const EventTypes = {
// 	${eventKeys.map(eventKey => `	${eventKey}: ${Events[eventKey]}`).join(',\n')}
// 	}
// 	interface EventKeyTypes {
// 		${eventKeys.map(eventKey => `	${eventKey}: ${Events[eventKey]};`).join('\n')}
// 	}
// /**
//  * @typedef {Object} ObjectEventSubscribe
// ${eventKeys.map(eventKey => ` * @property {(arg: ${Events[eventKey]}) => {}} ${eventKey}`).join('\n')}
//  * @property {(arg: TickEvent) => {}} tickAfterLoad
//  * @property {(arg: PlayerJoinEvent) => {}} playerJoined
//  * @property {(arg: EntityHitEvent) => {}} playerHit
//  * @property {(arg: EntityHurtEvent) => {}} playerHurt
//  * @property {() => {}} worldLoad