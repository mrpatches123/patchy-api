import { eventBuilder, requestBuilder, tagDatabases, time } from "../../patchy_api/modules.js";

eventBuilder.subscribe('playerChange', {
	playerJoined: ({ player }) => {
		const { name, id } = player;
		if (name.length > 32) player.kick('Name too long! turn off name spoof!');
		const playerStorage = tagDatabases.get(player, 'playerStorage');
		const savedName = playerStorage.get('savedName');
		const friends = playerStorage.get('friends');
		const { requests: { incoming = {}, outgoing = {} } = {}, mutal = {} } = friends ?? {};
		if (savedName === name) return;
		playerStorage.set('savedName', name);
		mutal.forEach(idTarget => {
			requestBuilder.add('friends', id, idTarget, 'nameChange', { name, date: time.now() });
		});
		incoming.forEach(idTarget => {
			requestBuilder.add('friends', id, idTarget, 'nameChange', { name, date: time.now() });
		});
		outgoing.forEach(idTarget => {
			requestBuilder.add('friends', id, idTarget, 'nameChange', { name, date: time.now() });
		});
	}
});