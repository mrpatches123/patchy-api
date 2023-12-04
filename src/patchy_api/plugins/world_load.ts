import { world } from '@minecraft/server';
import { eventBuilder, global, content, overworld, databases, scoreboardBuilder } from '../../patchy_api/modules.js';
global.players = {};
eventBuilder.subscribe('init_world_load*API', {
	worldLoad: () => {
		scoreboardBuilder.add('error');
		scoreboardBuilder.add('staff');
	}
});