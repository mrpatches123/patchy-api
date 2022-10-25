import { writeFileSync } from 'fs';

import { Events } from './minecraft.js';
const eventKeys = Object.keys(Events);

writeFileSync('C:\\Users\\mrpat\\AppData\\Local\\Packages\\Microsoft.MinecraftUWP_8wekyb3d8bbwe\\LocalState\\games\\com.mojang\\development_behavior_packs\\patchy-api\\scripts\\patchy_api\\libraries\\classes\\types\\events.d.ts',
	`import {${Object.values(Events).join(',')}} from '@minecraft/server';\ninterface ObjectEvents {\n	${eventKeys.map(eventKey => `${eventKey}: (arg: ${Events[eventKey]}) => {},`).join('\n	')}
	tickAfterLoad: (arg: TickEvent) => {},
	playerJoined: (arg: PlayerJoinEvent) => {},
	worldLoad: () => {},
	playerHit: (arg: EntityHitEvent) => {},
	playerHurt: (arg: EntityHurtEvent) => {},
}`
);
