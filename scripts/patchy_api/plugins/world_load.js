import { eventBuilder, global, overworld, databases } from '../../patchy_api/modules.js';
global.players = {};
eventBuilder.subscribe('init_world_load*API', {
    worldLoad: () => {
        try {
            overworld.runCommandAsync(`tickingarea add 0 0 0 0 0 0 PatchyDataBaseTick true`);
        }
        catch { }
        databases.initialize();
    }
});
//# sourceMappingURL=world_load.js.map