
import { world, Location } from '@minecraft/server';
import { content, overworld, staff } from "../../../patchy_api/libraries/utilities.js";
import databases from '../../../patchy_api/libraries/classes/database.js';
import global from '../../../patchy_api/libraries/classes/global.js';
import eventBuilder from '../../../patchy_api/libraries/classes/events.js';
import { bannedItems } from './give/banned_items.js';
import propertyBuilder from '../../../patchy_api/libraries/classes/property.js';
const toggleExemptions = [
    'use32k'
];
eventBuilder.subscribe('toggles', {
    tickAfterLoad: () => {
        if (global.loaded) {
            const toggles = propertyBuilder.getObjectFromKey('anticheat').anticheat;
            global.toggles = toggles;
            global.modulesOn = [];
            toggles.modules.forEach((key, value) => {
                if (toggleExemptions.includes(key)) { return; }
                if (value) {
                    eventBuilder.unsuppressAll(key);
                    global.modulesOn.push(key);
                } else {
                    eventBuilder.suppressAll(key);
                }
            });
        }
    }
});