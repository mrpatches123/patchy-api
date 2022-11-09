import { system } from '@minecraft/server';

function startwodjopwpwdjwwpodjdwo() {
	console.warn(`-----------------------------------------------------------------------------------------------------------------------------------------------\n Start at ${(new Date().toString())}`);
}
startwodjopwpwdjwwpodjdwo();



system.events.beforeWatchdogTerminate.subscribe(data => {
	data.cancel = true;
});