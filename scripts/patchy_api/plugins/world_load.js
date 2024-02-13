import { eventBuilder, global, scoreboardBuilder } from '../../patchy_api/modules.js';
global.players = {};
eventBuilder.subscribe('init_world_load*API', {
    worldLoad: () => {
        scoreboardBuilder.add('error');
        scoreboardBuilder.add('staff');
    }
});
//# sourceMappingURL=world_load.js.map