import { system, world } from '@minecraft/server';
import { native, content } from './patchy_api/libraries/utilities.js';

// import requests from './patchy_api/libraries/classes/events.js';
content.warn(native.stringify(system));

system.events.beforeWatchdogTerminate.subscribe(data => {
	// content.warn({ t: 'beforeWatchdogTerminate', data: native.stringify(data) });
	data.cancel = true;
});
import './patchy_api/api_imports.js';

import './example_package/import.js';

