

import { world } from '@minecraft/server';
import { content, time, tagDatabases, eventBuilder, formBuilder, global, requestBuilder, players } from '../../patchy_api/modules.js';
import config from '../config.js';
const { profilePictures, online, offine } = config;
formBuilder.create('friendsTest', {
	action: (receiver) => {
		const { id: idReceiver, nameReceiver } = receiver;
		const playerStorage = tagDatabases.get(receiver, 'playerStorage');
		const friends = playerStorage.get('friends');
		const { mutal = {} } = friends ?? {};
		const elementArray = [];
		const onlineIds = players.get().ids();
		const teleportRequests = requestBuilder.getMemoryTarget('friends', idReceiver, Object.keys(mutal), 'tpa');
		world.sendMessage(JSON.stringify(teleportRequests));
		mutal.forEach((id, { name, profilePictureId = 0 }) => elementArray.push({
			button: {
				text: `${(onlineIds.includes(id)) ? online : offine} ${name} ${(teleportRequests.hasOwnProperty(id)) ? `§b(1)` : ''}`,
				iconPath: profilePictures[profilePictureId]
			},
			callback: (receiver) => {
				formBuilder.show(receiver, 'manageFreind', id, name, profilePictureId);
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
			back: {
				text: 'Back'
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
					button: {
						text: 'Incomming Requests',
						reopen: true
					}
				}, ...incoming.forEach((id, { name, profilePictureId = 0 }) => {
					return ({
						button: {
							text: name,
							iconPath: profilePictures[profilePictureId]
						},
						callback: () => {
							formBuilder.show(receiver, 'friendsRequestsManage', 'incomming', id, name, profilePictureId);
						}
					});
				}, []));
			}
			if (outgoingBool) {

				returnArray.push({
					button: {
						text: 'Outgoing Requests',
						reopen: true
					}
				}, ...outgoing.forEach((id, { name, profilePictureId = 0 }) => {
					return ({
						button: {
							text: name,
							iconPath: profilePictures[profilePictureId]
						},
						callback: () => {
							formBuilder.show(receiver, 'friendsRequestsManage', 'outgoing', id, name, profilePictureId);
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
			back: {
				text: 'Back'
			}
		}
	]
});
formBuilder.create('friendsRequestsManage', {
	action: (receiver, type, id, name, profilePictureId) => {
		content.warn({ t: 'friendsRequestsManage', receiverName: receiver.name, type, name, id, });
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
							const { id: idReceiver, name: nameReceiver, properties: { profilePictureId = 0 } } = receiver;
							// const profilePictureIconPath = profilePictures[profilePictureId];
							const playerStorage = tagDatabases.get(receiver, 'playerStorage');
							const friends = playerStorage.get('friends') ?? {};
							const { requests: { incoming = {}, outgoing = {} } = {}, mutal = {} } = friends;
							requestBuilder.add('friends', idReceiver, id, 'remove', { date: time.now() });
							if (friends.hasOwnProperty('requests')) {
								if (friends.requests.hasOwnProperty('incoming') && friends.requests.incoming.hasOwnProperty(id)) delete friends.requests.incoming[id];
								if (friends.requests.hasOwnProperty('outgoing') && friends.requests.outgoing.hasOwnProperty(id)) delete friends.requests.outgoing[id];
							}
							if (friends.hasOwnProperty('mutal')) delete friends.mutal[id];

							friends.mutal[id] = { profilePictureId, name };
							playerStorage.set('friends', friends);
							tagDatabases.queueSave(receiver, 'playerStorage');
							receiver.tell(`You send a request to be ${name}'s friend!`);

						}
					},
					{
						back: {
							text: 'Back'
						}
					}
				]);
			case "incomming":
				return ([
					{
						body: `What would you like to do with ${name}'s friend request to you?`
					},
					{
						button: {
							text: "Accept"
						},
						callback: (receiver) => {
							const { id: idReceiver, name: nameReceiver, properties: { profilePictureId: profilePictureIdReceiver = profilePictures[0] } } = receiver;
							const playerStorage = tagDatabases.get(receiver, 'playerStorage');
							const friends = playerStorage.get('friends') ?? {};
							const { requests: { incoming = {}, outgoing = {} } = {}, mutal = {} } = friends;
							requestBuilder.add('friends', idReceiver, id, 'add', { name: nameReceiver, profilePictureId: profilePictureIdReceiver, date: time.now() });
							if (friends.hasOwnProperty('requests')) {
								if (friends.requests.hasOwnProperty('incoming') && friends.requests.incoming.hasOwnProperty(id)) delete friends.requests.incoming[id];
								if (friends.requests.hasOwnProperty('outgoing') && friends.requests.outgoing.hasOwnProperty(id)) delete friends.requests.outgoing[id];
							}
							if (!friends.hasOwnProperty('mutal')) friends.mutal = {};
							friends.mutal[id] = { name, profilePictureId };
							content.warn({ t: 'incommingwknjndwuiwdhu', idReceiver, id, friends });
							playerStorage.set('friends', friends);
							tagDatabases.queueSave(receiver, 'playerStorage');
							receiver.tell(`You accepted a request to be ${name}'s friend request and are now friends!`);

						}
					},
					{
						button: {
							text: "Deny"
						},
						callback: (receiver) => {

							const { id: idReceiver, name: nameReceiver } = receiver;
							const playerStorage = tagDatabases.get(receiver, 'playerStorage');
							const friends = playerStorage.get('friends') ?? {};
							const { requests: { incoming = {}, outgoing = {} } = {}, mutal = {} } = friends;

							requestBuilder.add('friends', idReceiver, id, 'remove', { date: time.now() });
							if (friends.hasOwnProperty('requests')) {
								if (friends.requests.hasOwnProperty('incoming') && friends.requests.incoming.hasOwnProperty(id)) delete friends.requests.incoming[id];
								if (friends.requests.hasOwnProperty('outgoing') && friends.requests.outgoing.hasOwnProperty(id)) delete friends.requests.outgoing[id];
							}
							if (friends.hasOwnProperty('mutal')) delete friends.mutal[id];
							playerStorage.set('friends', friends);
							tagDatabases.queueSave(receiver, 'playerStorage');
							receiver.tell(`You send a request to be ${name}'s friend!`);
							player.tell(`${nameReceiver} sent a request to be your friend!`);

						}
					},
					{
						back: {
							text: 'Back'
						}
					}
				]);
		}
	}
});
formBuilder.create('friendsAdd', {
	action: (receiver) => {
		const { id: idReceiver, name: nameReceiver, properties: { profilePictureId: profilePictureIdReceiver = 0 } } = receiver;
		const playerStorage = tagDatabases.get(receiver, 'playerStorage');
		const friends = playerStorage.get('friends') ?? {};
		const { requests: { incoming = {}, outgoing = {} } = {}, mutal = {} } = friends;
		content.warn({ nameReceiver, friends });
		const elementArray = [];
		const incomingLength = incoming.length();
		const playersA = players.get().array();
		playersA.filter(({ id }) => !outgoing.hasOwnProperty(id) && !incoming.hasOwnProperty(id) && !mutal.hasOwnProperty(id) && id !== idReceiver.toString())
			.forEach((player) => {

				const { name, properties: { profilePictureId = 0 }, id } = player;
				elementArray.push({
					button: {
						text: name,
						iconPath: profilePictures[profilePictureId]
					},
					callback: () => {
						requestBuilder.add('friends', idReceiver, id, 'add', { name: nameReceiver, profilePictureId: profilePictureIdReceiver, date: time.now() });
						if (!friends.hasOwnProperty('requests')) friends.requests = {};
						if (!friends.requests.hasOwnProperty('outgoing')) friends.requests.outgoing = {};
						friends.requests.outgoing[id] = { name, profilePictureId };
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
			back: {
				text: 'Back'
			}
		}];
	}
});
formBuilder.create('manageFreind', {
	action: (receiver, id, name, profilePictureId) => {
		const { id: idReceiver, name: nameReceiver } = receiver;
		const playerStorage = tagDatabases.get(receiver, 'playerStorage');
		const friends = playerStorage.get('friends') ?? {};
		const { mutal = {} } = friends ?? {};
		const teleportRequest = requestBuilder.getMemoryTarget('friends', idReceiver, Object.keys(mutal), 'tpa')[id];
		content.warn({ id, name, profilePictureId });
		const online = Object.keys(global.players).includes(id);
		const player = players.get().object[id];
		content.warn({ id, name });
		return ([
			{
				title: 'Manage, Friend ',
				body: `How would you like to manage ${name}`,
				button: {
					text: 'Profile Picture',
					iconPath: profilePictures[profilePictureId],
					reopen: true
				}
			},
			() => {
				if (!online) return;
				if (teleportRequest) {
					return ({
						button: {
							text: 'Manage Teleport Request'
						},
						callback: () => {
							formBuilder.show(receiver, 'manageTpa', id, name, profilePictureId);
						}
					});
				} else {
					return ({
						button: {
							text: 'Request Teleport'
						},
						callback: () => {
							requestBuilder.addMemory('friends', idReceiver, id, 'tpa', { date: time.now() });
							player.tell(`§b${nameReceiver} sent you a request to teleport to you.`);
						}
					});
				}

			},
			{
				button: {
					text: 'Remove'
				},
				callback: () => {
					formBuilder.showConformation(receiver, `Are you sure you want to remove ${name} as a friend?`, () => {
						requestBuilder.add('friends', idReceiver, id, 'remove', { date: time.now() });
					});
				}
			},
			{
				refresh: {
					text: 'Refresh'
				}
			},
			{
				back: {
					text: 'Back'
				}
			}
		]);
	}
});

formBuilder.create('tpaRequests', {
	action: [
		{
			title: 'Teleport Requests'
		},
		(receiver) => {
			const { id: idReceiver } = receiver;
			const playerStorage = tagDatabases.get(receiver, 'playerStorage');
			const friends = playerStorage.get('friends') ?? {};
			const { mutal = {} } = friends;
			return ([...requestBuilder.getMemoryTarget('friends', idReceiver, Object.keys(mutal), true).forEach((id, { tpa: { name, profilePictureId } }) => ({
				button: {
					text: name,
					iconPath: profilePictures[profilePictureId]
				},
				callback: () => {
					formBuilder.show(receiver, 'manageTpa', id, name, profilePictureId);
				}
			}), [])]);
		},
		{
			refresh: {
				text: 'Refresh'
			}
		},
		{
			back: {
				text: 'Back'
			}
		}

	]
});
formBuilder.create('manageTpa', {
	action: [
		{
			title: 'Mangage Teleport Request'
		},
		(receiver, i, id, name, profilePictureId) => {
			const { id: idReceiver, name: nameReceiver } = receiver;
			const requestee = players.get().object()[id];;
			const { id: idRequestee } = requestee;
			return ([
				{
					body: `What would you like to do with ${name}'s Teleport Request`
				},
				{
					button: {
						text: 'Accept'
					},
					callback: () => {
						if (!requestBuilder?.friends?.[id]?.[idReceiver]?.tpa) return receiver.tell(`${name} canceled their tpa request to you`);
						requestee.tell(`§3Close chat to open Teleport Conformation!`);
						formBuilder.showConformationAwait(requestee, `Do you still want to teleport to ${nameReceiver}?`, () => {
							const { location, dimension, rotation: { x: rx, y: ry } } = receiver;
							if (!requestBuilder?.friends?.[idRequestee]?.[idReceiver]?.tpa) return receiver.tell(`You could not be teleported since ${name} canceled their tpa request to you or left.`);
							requestee.teleport(location, dimension, rx, ry);

							requestBuilder.removeMemory('friends', idRequestee, idReceiver, 'tpa');
						}, () => {
							requestBuilder.removeMemory('friends', idRequestee, idReceiver, 'tpa');
						});
					}
				},
				{
					button: {
						text: 'Deny'
					},
					callback: () => {
						const { id: idRequestee } = requestee;
						requestBuilder.removeMemory('friends', idRequestee, idReceiver, 'tpa');
						receiver.tell(`§c${nameReceiver} has Denied your teleport Request!`);
					}
				}
			]);
		},
		{
			back: {
				text: 'Back'
			}
		}
	]
});


