import { writeFileSync } from 'fs';

import { Events } from './minecraft.js';
const eventKeys = Object.keys(Events);

writeFileSync('C:\\Users\\mrpat\\AppData\\Local\\Packages\\Microsoft.MinecraftUWP_8wekyb3d8bbwe\\LocalState\\games\\com.mojang\\development_behavior_packs\\patchy-api\\scripts\\patchy_api\\libraries\\classes\\types\\events.d.js',
	`import {${Object.values(Events).join(',')}} from '@minecraft/server';
/**
 * @typedef {Object} ObjectEventSubscribe
${eventKeys.map(eventKey => ` * @property {(arg: ${Events[eventKey]}) => {}} ${eventKey}`).join('\n')}
 * @property {(arg: TickEvent) => {}} tickAfterLoad
 * @property {(arg: PlayerJoinEvent) => {}} playerJoined
 * @property {(arg: EntityHitEvent) => {}} playerHit
 * @property {(arg: EntityHurtEvent) => {}} playerHurt
 * @property {() => {}} worldLoad
*/`
);