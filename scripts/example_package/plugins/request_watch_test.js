import { content, global, requestBuilder, tagDatabases, time } from "../../patchy_api/modules.js";

import config from '../config.js';
const { maxTime } = config;
requestBuilder.watch('friends', (requesteeId, id, value) => {

	const { action, date, name } = value;
	// content.warn({ id, action, online: global.players.hasOwnProperty(id), time: time.now() - date > maxTime });
	if (time.now() - date > maxTime) {
		return true;
		// return requestBuilder.remove('friends', requesteeId);
	}
	if (global.players.hasOwnProperty(id)) {
		const player = global.players[id];
		console.warn(player.name);
		const playerStorage = tagDatabases.get(player, 'playerStorage');
		content.warn({ playerStorage });
		const friends = playerStorage.get('friends') ?? {};
		switch (action) {
			case 'remove':
				delete friends.mutal[requesteeId];
				delete friends.incoming[requesteeId];
				delete friends.outgoing[requesteeId];
				friends.set('friends', friends);
				tagDatabases.queueSave(player, 'playerStorage');
				return true;
			case 'add':
				const { requests: { incoming, outgoing } = {} } = friends;
				if ((incoming && incoming.hasOwnProperty(id)) || (outgoing && outgoing.hasOwnProperty(id))) {
					if (friends.hasOwnProperty('mutal')) friends.mutal = {};
					delete friends.requests.incoming[requesteeId];
					delete friends.requests.outgoing[requesteeId];
					friends.mutal[requesteeId] = name;
					playerStorage.set('friends', friends);
					content.warn(player.name);
					tagDatabases.queueSave(player, 'playerStorage');
					return true;
				}
				if (!friends.hasOwnProperty('requests')) friends.requests = {};
				if (!friends.requests.hasOwnProperty('incoming')) friends.requests.incoming = {};
				friends.requests.incoming[requesteeId] = name;
				playerStorage.set('friends', friends);
				tagDatabases.queueSave(player, 'playerStorage');
				content.warn({ tagDatabases });
				return true;
		}
	};
});

