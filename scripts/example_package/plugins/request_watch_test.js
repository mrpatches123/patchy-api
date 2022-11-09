import { content, global, players, requestBuilder, tagDatabases, time } from "../../patchy_api/modules.js";
import { Player } from "@minecraft/server";
import config from '../config.js';
const { maxTime } = config;
requestBuilder.watch('friends', (requesteeId, id, type, value) => {
	content.warn({ t: 'requestBuilder.watch', requesteeId, id, type, value });
	const { date, name, profilePictureId } = value;
	// content.warn({ id, action, online: global.players.hasOwnProperty(id), time: time.now() - date > maxTime });
	if (time.now() - date > maxTime) {
		return true;
		// return requestBuilder.remove('friends', requesteeId);
	}
	const playersOnline = players.get();
	if (playersOnline.hasOwnProperty(id)) {
		const player = playersOnline[id];

		// console.warn(player.name);
		const playerStorage = tagDatabases.get(player, 'playerStorage');
		content.warn({ name: player.name, playerStorage });
		const friends = playerStorage.get('friends') ?? {};
		const { mutal = {}, requests: { incoming = {}, outgoing = {} } = {} } = friends;
		switch (type) {
			case 'nameChange': {
				const { name } = value;
				if (mutal.hasOwnProperty(requesteeId)) friends.mutal[requesteeId].name = name;
				if (incoming.hasOwnProperty(requesteeId)) friends.requests.incoming[requesteeId].name = name;
				if (outgoing.hasOwnProperty(requesteeId)) friends.requests.outgoing[requesteeId].name = name;
				playerStorage.set('friends', friends);
				tagDatabases.queueSave(player, 'playerStorage');
				return true;
			}
			case 'profilePictureChange': {
				const { profilePictureId } = value;
				if (mutal.hasOwnProperty(requesteeId)) friends.mutal[requesteeId].profilePictureId = profilePictureId;
				if (incoming.hasOwnProperty(requesteeId)) friends.requests.incoming[requesteeId].profilePictureId = profilePictureId;
				if (outgoing.hasOwnProperty(requesteeId)) friends.requests.outgoing[requesteeId].profilePictureId = profilePictureId;
				playerStorage.set('friends', friends);
				content.warn({ Tname: player.name, Rname: name, playerStorage });
				tagDatabases.queueSave(player, 'playerStorage');
				return true;
			}
			case 'remove': {
				delete friends.mutal[requesteeId];
				delete friends.incoming[requesteeId];
				delete friends.outgoing[requesteeId];
				friends.set('friends', friends);
				tagDatabases.queueSave(player, 'playerStorage');
				return true;
			}
			case 'add': {
				const { requests: { incoming, outgoing } = {} } = friends;
				content.warn(friends, { bool: (incoming && incoming.hasOwnProperty(requesteeId)) || (outgoing && outgoing.hasOwnProperty(requesteeId)) });
				if ((incoming && incoming.hasOwnProperty(requesteeId)) || (outgoing && outgoing.hasOwnProperty(requesteeId))) {

					if (incoming) delete friends.requests.incoming[requesteeId];
					if (outgoing) delete friends.requests.outgoing[requesteeId];
					if (!friends.hasOwnProperty('mutal')) friends.mutal = {};
					friends.mutal[requesteeId] = { name, profilePictureId };
					content.warn(player.name, friends);
					playerStorage.set('friends', friends);

					tagDatabases.queueSave(player, 'playerStorage');
					return true;
				}
				if (!friends.hasOwnProperty('requests')) friends.requests = {};
				if (!friends.requests.hasOwnProperty('incoming')) friends.requests.incoming = {};
				friends.requests.incoming[requesteeId] = { name, profilePictureId };
				playerStorage.set('friends', friends);
				tagDatabases.queueSave(player, 'playerStorage');
				// content.warn({ tagDatabases });
				return true;
			}
		}
	};
});


