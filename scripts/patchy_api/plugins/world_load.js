import { eventBuilder, global } from '../../patchy_api/modules.js';
global.players = {};
eventBuilder.subscribe('init_world_load*API', {
    worldLoad: () => {
    }
});
//# sourceMappingURL=world_load.js.map