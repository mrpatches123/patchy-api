

import { content, time, tagDatabases, eventBuilder, formBuilder, global, requestBuilder } from '../../patchy_api/modules.js';

formBuilder.create('friendsTest', {
	action: (receiver) => {
		const playerStorage = tagDatabases.get(receiver, 'playerStorage');
		const friends = playerStorage.get('friends');
		const { mutal = {} } = friends ?? {};
		const elementArray = [];
		mutal.forEach((id, name) => elementArray.push({
			button: {
				text: name
			},
			callback: (receiver) => {
				formBuilder.show(receiver, 'manageFreind', id, name);
			}
		}));
		return [{
			title: 'Friends',
			body: (mutal.length()) ? 'Choose the friend you would like to manage' : ''
		}, ...elementArray, {
			button: {
				text: 'Add Fridend'
			},
			callback: () => {
				formBuilder.show(receiver, 'friendsAdd');
			}
		},
		{
			refresh: {
				text: 'Refresh'
			}
		},
		{
			button: {
				text: 'Back'
			},
			callback: () => {
				formBuilder.show(receiver, 'test');
			}
		}];
	}
});
formBuilder.create('friendRequests', {
	action: [
		(receiver) => {
			const returnArray = [];
			const { id: idReceiver, nameReceiver } = receiver;
			const playerStorage = tagDatabases.get(receiver, 'playerStorage');
			const friends = playerStorage.get('friends');
			const { requests: { incoming = {}, outgoing = {} } = {}, mutal = {} } = friends ?? {};
			const elementArray = [];
			const incomingBool = Boolean(incoming.length());
			const outgoingBool = Boolean(outgoing.length());
			if (incomingBool) {

				returnArray.push({
					body: 'Incomming Requests'
				}, ...incoming.forEach((id, name) => {
					return ({
						button: {
							text: name
						},
						callback: () => {
							formBuilder.show(receiver, 'friendsRequestsManage', 'incomming', id, name);
						}
					});
				}, []));
			}
			if (outgoingBool) {

				returnArray.push({
					body: 'Outgoing Requests'
				}, ...outgoing.forEach((id, name) => {
					return ({
						button: {
							text: name
						},
						callback: () => {
							formBuilder.show(receiver, 'friendsRequestsManage', 'outgoing', id, name);
						}

					});
				}, []));

			}
			if (!incomingBool && !outgoingBool) {
				returnArray.push({
					body: 'You have no incomming or outgoing Requests'
				});
			}
			content.warn({ t: 'wiudwwjkd', returnArray });
			return returnArray;
		},
		{
			refresh: {
				text: 'Refresh'
			}
		},
		{
			button: {
				text: 'Back'
			},
			callback: (receiver) => {
				formBuilder.show(receiver, 'friendsTest');
			}
		}
	]
});
formBuilder.create('friendsRequestsManage', {
	action: (receiver, type, id, name) => {
		switch (type) {
			case "outgoing":
				return ([
					{
						body: `What would you like to do with your friend request to ${name}?`
					},
					{
						button: {
							text: "Cancel"
						},
						callback: () => {
							formBuilder.showConformation(receiver, `Are you sure you want to cancel your friend request to ${name}?`, (receiver) => {
								const { id: idReceiver, name: nameReceiver } = receiver;
								const playerStorage = tagDatabases.get(receiver, 'playerStorage');
								const friends = playerStorage.get('friends') ?? {};
								const { requests: { incoming = {}, outgoing = {} } = {}, mutal = {} } = friends;
								requestBuilder.add('friends', idReceiver, id, { action: 'remove', name, date: time.now() });
								delete friends.requests.outgoing[id];
								delete friends.requests.incoming[id];
								playerStorage.set('friends', friends);
								tagDatabases.queueSave(receiver, 'playerStorage');
								receiver.tell(`You send a request to be ${name}'s friend!`);
								player.tell(`${nameReceiver} sent a request to be your friend!`);
							});
						}
					},
					{
						button: {
							text: "Back"
						},
						callback: (receiver) => {
							formBuilder.show(receiver, 'friendRequests');
						}
					}
				]);
			case "incomming":
				return ([
					{
						body: `What would you like to do with your friend request to ${name}?`
					},
					{
						button: {
							text: "Accept"
						},
						callback: (receiver) => {
							formBuilder.showConformation(receiver, `Are you sure you want to accept ${name}'s friend request?`, (receiver) => {
								const { id: idReceiver, name: nameReceiver } = receiver;
								const playerStorage = tagDatabases.get(receiver, 'playerStorage');
								const friends = playerStorage.get('friends') ?? {};
								const { requests: { incoming = {}, outgoing = {} } = {}, mutal = {} } = friends;
								requestBuilder.add('friends', idReceiver, id, { action: 'add', name, date: time.now() });
								delete friends.requests.incoming[id];
								delete friends.requests.outgoing[id];
								if (friends.hasOwnProperty('mutal')) friends.mutal = {};
								friends.mutal[id] = name;
								playerStorage.set('friends', friends);
								tagDatabases.queueSave(receiver, 'playerStorage');
								receiver.tell(`You send a request to be ${name}'s friend!`);
								player.tell(`${nameReceiver} sent a request to be your friend!`);
							});
						}
					},
					{
						button: {
							text: "Deny"
						},
						callback: (receiver) => {
							formBuilder.showConformation(receiver, `Are you sure you want to deny ${name}'s friend request?`, (receiver) => {
								const { id: idReceiver, name: nameReceiver } = receiver;
								const playerStorage = tagDatabases.get(receiver, 'playerStorage');
								const friends = playerStorage.get('friends') ?? {};
								const { requests: { incoming = {}, outgoing = {} } = {}, mutal = {} } = friends;

								requestBuilder.add('friends', idReceiver, id, { action: 'remove', name, date: time.now() });

								delete friends.requests.incoming[id];

								playerStorage.set('friends', friends);
								tagDatabases.queueSave(receiver, 'playerStorage');
								receiver.tell(`You send a request to be ${name}'s friend!`);
								player.tell(`${nameReceiver} sent a request to be your friend!`);
							});
						}
					},
					{
						button: {
							text: "Back"
						},
						callback: (receiver) => {
							formBuilder.show(receiver, 'friendRequests');
						}
					}
				]);
		}
	}
});
formBuilder.create('friendsAdd', {
	action: (receiver) => {
		const { id: idReceiver, name: nameReceiver } = receiver;
		const playerStorage = tagDatabases.get(receiver, 'playerStorage');
		const friends = playerStorage.get('friends') ?? {};
		const { requests: { incoming = {}, outgoing = {} } = {}, mutal = {} } = friends;
		const elementArray = [];
		const incomingLength = incoming.length();
		global.players.filter((id, player) => {
			console.warn({ id, name: player.name, outgoing });
			return !outgoing.hasOwnProperty(id) && !mutal.hasOwnProperty(id) && id !== idReceiver.toString();
		}).forEach((id, player) => {

			const { name } = player;
			elementArray.push({
				button: {
					text: name
				},
				callback: () => {
					requestBuilder.add('friends', idReceiver, id, { action: 'add', name, date: time.now() });
					if (!friends.hasOwnProperty('requests')) friends.requests = {};
					if (!friends.requests.hasOwnProperty('outgoing')) friends.requests.outgoing = {};
					friends.requests.outgoing[id] = name;
					playerStorage.set('friends', friends);
					tagDatabases.queueSave(receiver, 'playerStorage');
					receiver.tell(`You send a request to be ${name}'s friend!`);
					player.tell(`${nameReceiver} sent a request to be your friend!`);
				}
			});
		});
		return [{
			title: 'Add Friends',
			body: 'Which player would you would like to add as a friend'
		},
		{
			button: {
				text: `Requests ${(incomingLength) ? '§c' : ''}(${incomingLength})§r(${outgoing.length()})`
			},
			callback: () => {
				formBuilder.show(receiver, 'friendRequests');
			}
		}, ...elementArray,
		{
			refresh: {
				text: 'Refresh'
			}
		}, {
			button: {
				text: 'Back'
			},
			callback: () => {
				formBuilder.show(receiver, 'friendsTest');
			}
		}];
	}
});
formBuilder.create('manageFreind', {
	action: (receiver, i, id, name) => {
		const { id: idReceiver } = receiver;
		const online = Object.keys(global.players).includes(id);
		content.warn({ id, name });
		return ([
			{
				title: 'Friend Manager',
				body: `How would you like to manage ${name}`
			},
			() => {
				if (online) {
					return ({
						button: {
							text: 'Request Teleport'
						},
						callback: () => {

						}
					});
				}
			},
			{
				button: {
					text: 'Remove'
				},
				callback: () => {
					requestBuilder.add('friends', idReceiver, id, { action: 'remove', id });
				}
			}
		]);
	}
});
