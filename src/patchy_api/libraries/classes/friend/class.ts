import { content, isDefined, native, orArray } from '../../utilities.js';
import databases from '../database.js';
import tagDatabases from '../tag_database.js';
import requestBuilder from '../request.js';
import { Player } from '../player/class.js';
import eventBuilder from '../events/export_instance.js';
import time from '../time.js';
import players from '../players/export_instance.js';
import { Scoreboard, world } from '@minecraft/server';
import errorLogger from '../error.js';
const types = ['central', 'remote'];
const maxTime = 1.728e8;
type FriendSystemData = { type: 'central' | 'remote', properties: { [key: string]: { get: (player: Player) => any, set: (player: Player, requesteeId: string, value: any) => any, init: (player: Player) => any; }; }; };
export class FriendSystem {
	systemKey: string;
	data: FriendSystemData;
	watchSubscribed: boolean;
	constructor(systemKey: string, data: FriendSystemData) {
		/**
		 * @type {string} 
		 */
		this.systemKey = systemKey;
		/**
		 * @type {{ type: 'central' | 'remote', properties: {[key: string]: {	get: (player: Player) => any, set: (player: Player) => any, init: (player: Player) => any}}}}
		 */
		this.data = data;
		this.watchSubscribed = false;
		this.subscribeWatch();
	}
	addRequest(reqestee: Player, targetId: string, type: 'add' | 'remove' | string, payload: any): Player | true {
		const { id: reqesteeId } = reqestee;
		const player = players.getById(targetId);
		if (!player) { requestBuilder.add(`friends*${this.systemKey}`, reqesteeId, targetId, type, payload); return true; };
		return player;
	}
	/**
	 * @param {Player} receiver 
	 * @param {Player} target 
	 * @returns { }
	 */
	getFriendData(receiver: Player): { saves?: { [property: string]: any; }, requests: { incoming: { [id: string]: {}; }, outgoing: { [id: string]: {}; }; }, mutal: { [id: string]: {}; }; } {
		const { type } = this.data;
		const playerStorage = (type === 'remote') ? tagDatabases.get(receiver, 'playerStorage') : databases.get(this.systemKey) ?? databases.add(this.systemKey);
		const friends = playerStorage.get((type === 'remote') ? this.systemKey : receiver.id) ?? {};
		return friends;
	}
	getProperties(receiver: Player): { [key: string]: any; } {
		const { data: { properties } } = this;
		const friends = this.getFriendData(receiver);
		let set = false;
		const currentProperties = {} as { [key: string]: any; };
		Object.entries(properties).forEach(([property, { get }]) => {
			const currentValue = get(receiver);
			if (!isDefined(currentValue)) {
				if (isDefined(friends.saves?.[property])) {
					delete (friends.saves as any)[property];
					set = true;
				}
				return;
			}
			currentProperties[property] = currentValue;
			if (!friends.hasOwnProperty('saves')) friends.saves = {};
			content.warn({ property, has: friends.saves?.[property] === currentValue });
			if (friends.saves?.[property] === currentValue) return;
			friends.saves ??= {};
			friends.saves[property] = currentValue;
			this.update(receiver, property);
			set = true;
		});
		if (set) this.setFriendData(receiver, friends);
		return currentProperties;
	}
	setFriendData(receiver: Player, data: { requests: { incoming: { [id: string]: {}; }, outgoing: { [id: string]: {}; }; }, mutal: { [id: string]: {}; }; }) {
		const { type } = this.data;
		if (type === 'remote') {
			const playerStorage = tagDatabases.get(receiver, 'playerStorage');
			playerStorage.set(this.systemKey, data);
			tagDatabases.queueSave(receiver, 'playerStorage');
		} else {
			const playerStorage = databases.get(this.systemKey) ?? databases.add(this.systemKey);
			playerStorage.set(receiver.id, data);
			databases.queueSave(this.systemKey);
		}
		// const playerStorage = (type === 'remote') ? tagDatabases.get(receiver, 'playerStorage') : databases.get(this.systemKey) ?? databases.add(this.systemKey);
		// playerStorage.set((type === 'remote') ? this.systemKey : receiver.id, data);
		// (type === 'remote') ? tagDatabases.save('playerStorage', receiver) : databases.save(this.systemKey);
	}
	add(receiver: Player, targetId: string, payload: any) {
		const { data: { properties }, systemKey } = this;
		const receiverId = receiver.id;
		const friendData = this.getFriendData(receiver);
		const { requests: { incoming = {}, outgoing = {} } = {}, mutal = {} } = friendData;
		if (!friendData.hasOwnProperty('mutal')) friendData.mutal = {};
		friendData.mutal[targetId] = payload;
		if (incoming.hasOwnProperty(targetId)) delete friendData.requests.incoming[targetId];
		if (outgoing.hasOwnProperty(targetId)) delete friendData.requests.outgoing[targetId];
		if (outgoing.hasOwnProperty(targetId)) delete friendData.mutal[targetId];
		this.setFriendData(receiver, friendData);
	}
	accept(receiver: Player, targetId: string, payload: any) {
		const { data: { properties }, systemKey } = this;
		const receiverId = receiver.id;
		const friendData = this.getFriendData(receiver);
		const { requests: { incoming = {}, outgoing = {} } = {}, mutal = {} } = friendData;
		const request = this.getProperties(receiver);
		request.date = Date.now();
		if (!friendData.hasOwnProperty('mutal')) friendData.mutal = {};
		friendData.mutal[targetId] = payload;
		if (incoming.hasOwnProperty(targetId)) delete friendData.requests.incoming[targetId];
		if (outgoing.hasOwnProperty(targetId)) delete friendData.requests.outgoing[targetId];
		this.setFriendData(receiver, friendData);
		const sent = this.addRequest(receiver, targetId, 'add', request);
		if (sent === true) return;
		delete request.date;
		this.add(sent, receiver.id, request);
	};
	removeWithRequest(receiver: Player, targetId: string): void {
		const { systemKey } = this;
		const receiverId = receiver.id;
		this.remove(receiver, targetId);
		const sent = this.addRequest(receiver, targetId, 'remove', { date: Date.now() });
		if (sent === true) return;
		this.remove(sent, receiver.id);

	};
	remove(receiver: Player, targetId: string): void {
		content.warn({ receiver: receiver.name, receiverId: receiver.id, targetId });
		const friendData = this.getFriendData(receiver);
		const { requests: { incoming = {}, outgoing = {} } = {}, mutal = {} } = friendData;
		if (incoming.hasOwnProperty(targetId)) delete friendData.requests.incoming[targetId];
		if (outgoing.hasOwnProperty(targetId)) delete friendData.requests.outgoing[targetId];
		if (mutal.hasOwnProperty(targetId)) delete friendData.mutal[targetId];
		this.setFriendData(receiver, friendData);
	};
	denyAddRequest(receiver: Player, targetId: string) {
		this.removeWithRequest(receiver, targetId);
	};
	requestAdd(receiver: Player, target: Player) {
		const { data: { properties }, systemKey } = this;
		const receiverId = receiver.id;
		const targetId = target.id;
		const friendData = this.getFriendData(receiver);
		const friendDataTarget = this.getFriendData(target);
		if (!friendData.hasOwnProperty('requests')) friendData.requests = {} as typeof friendData.requests;
		if (!friendData.requests.hasOwnProperty('outgoing')) friendData.requests.outgoing = {};
		friendData.requests.outgoing[targetId] = this.getProperties(target);
		if (!friendDataTarget.hasOwnProperty('requests')) friendDataTarget.requests = {} as typeof friendDataTarget.requests;
		if (!friendDataTarget.requests.hasOwnProperty('incoming')) friendDataTarget.requests.incoming = {};
		friendDataTarget.requests.incoming[receiverId] = this.getProperties(receiver);
		this.setFriendData(receiver, friendData);
		this.setFriendData(target, friendDataTarget);
	};
	update(receiver: Player, property: string) {
		const { data: { properties } } = this;
		if (!properties.hasOwnProperty(property)) throw new Error(`property: ${property}, is not one of the following: ${orArray(Object.keys(properties))}`);
		const { requests: { incoming = {}, outgoing = {} } = {}, mutal = {} } = this.getFriendData(receiver);
		this.updateFromFriendObject(receiver, incoming, property);
		this.updateFromFriendObject(receiver, outgoing, property);
		this.updateFromFriendObject(receiver, mutal, property);
	};
	/**
	 * @param {Player} receiver 
	 * @param {String} targetId
	 */
	updateSingle(receiver: Player, targetId: string, property: string) {
		const { systemKey, data: { properties } } = this;
		if (!properties.hasOwnProperty(property)) throw new Error(`property: ${property}, is not one of the following: ${orArray(Object.keys(properties))}`);
		const { id: receiverId } = receiver;
		const { get } = properties[property] ?? {};
		requestBuilder.add(`friends*${this.systemKey}`, receiverId, targetId, `${property}Change`, { [property]: (get instanceof Function && get(receiver)), date: Date.now() });
	};
	/**
	 * @param {Player} receiver 
	 * @param {{[id: string]: {}}} object 
	 * @param {String} property 
	 */
	updateFromFriendObject(receiver: Player, object: { [id: string]: {}; }, property: string) {
		const { data: { properties } } = this;
		// content.warn({ properties });
		if (!properties.hasOwnProperty(property)) throw new Error(`property: ${property}, is not one of the following: ${orArray(Object.keys(properties))}`);
		const array = Object.keys(object);
		if (!array.length) return;
		array.forEach(targetId => {
			this.updateSingle(receiver, targetId, property);
		});
	}
	subscribeWatch() {
		const { data: { properties }, watchSubscribed } = this;
		// content.warn({ t: 'hjsdknqbjw jklwnkj d', properties });
		if (watchSubscribed) return;
		this.watchSubscribed = true;
		const friendThis = this;
		eventBuilder.subscribe(`friends*${this.systemKey}`, {
			playerJoined: ({ player }) => {
				// content.warn({ player: player.name });
				const friends = friendThis.getFriendData(player);
				if (!friends.hasOwnProperty('saves')) friends.saves = {};
				let changed = false;
				Object.entries(properties).forEach(([key, { get }]) => {
					const currentValue = get(player);
					content.warn({ currentValue, key, saves: friends.saves });
					if (!isDefined(currentValue)) {
						if (isDefined(friends.saves?.[key])) {
							delete (friends.saves as any)[key];
							changed = true;
						}
						return;
					}
					// content.warn({ key, currentValue, saves: friends.saves });
					if (!isDefined(currentValue)) return;
					if (friends.saves?.[key] === currentValue) return;
					friends.saves ??= {};
					friends.saves[key] = currentValue;
					friendThis.update(player, key);
					changed = true;
				});
				const { requests: { incoming = {}, outgoing = {} } = {}, mutal = {} } = friends;
				players.get().iterate(target => {
					const { id: targetId } = target;
					if (targetId === player.id) return;
					const object = (mutal.hasOwnProperty(targetId)) ? mutal : (incoming.hasOwnProperty(targetId)) ? incoming : (outgoing.hasOwnProperty(targetId)) ? outgoing : false;
					if (!object) return;
					const type = (mutal.hasOwnProperty(targetId)) ? 'mutal' : (incoming.hasOwnProperty(targetId)) ? 'incoming' : (outgoing.hasOwnProperty(targetId)) ? 'outgoing' : false;
					const isRequest = (type === 'incoming' || type === 'outgoing');

					const data = object[targetId];
					Object.entries(properties).forEach(([key, { get }]) => {
						const currentValue = get(target);
						// content.warn({ key, currentValue, saves: friends.saves });
						if (!isDefined(currentValue)) {
							if (isDefined((data as any)[key])) {
								if (isRequest) delete (friends.requests[type] as any)[targetId][key];
								else if (type) delete (friends[type] as any)[targetId][key];
								changed = true;
							}
							return;
						}
						if ((data as any)[key] === currentValue) return;
						if (isRequest) (friends.requests[type] as any)[targetId][key] = currentValue;
						else if (type) (friends[type] as any)[targetId][key] = currentValue;
						changed = true;
					});
				});
				content.warn({ changed });
				if (changed) friendThis.setFriendData(player, friends);
				const receiverId = player.id;
				Object.entries(properties).forEach(([key, { get }]) => {
					const currentValue = get(player);
					players.get().iterate(target => {
						const targetId = target.id;
						if (targetId === receiverId) return;
						let changed = false;
						const friendsTarget = this.getFriendData(target);
						const { requests: { incoming: incomingTarget = {}, outgoing: outgoingTarget = {} } = {}, mutal: mutalTarget = {} } = friendsTarget;

						if ((incomingTarget.hasOwnProperty(receiverId) && incoming.hasOwnProperty(targetId))
							|| (mutalTarget.hasOwnProperty(receiverId) && incoming.hasOwnProperty(targetId))
							|| (mutalTarget.hasOwnProperty(receiverId) && (incoming.hasOwnProperty(targetId) || outgoing.hasOwnProperty(targetId)))
							|| (mutal.hasOwnProperty(receiverId) && (incomingTarget.hasOwnProperty(targetId) || outgoingTarget.hasOwnProperty(targetId)))) {
							this.add(target, receiverId, this.getProperties(target));
							this.add(player, targetId, this.getProperties(player));
							content.warn({ t: 'friendsFixerThingthing', state: 0 });
						} else if (incomingTarget.hasOwnProperty(receiverId) && !outgoing.hasOwnProperty(targetId)) {
							this.requestAdd(target, player);
							content.warn({ t: 'friendsFixerThingthing', state: 1 });
						} else if (incoming.hasOwnProperty(targetId) && !outgoingTarget.hasOwnProperty(receiverId)) {
							this.requestAdd(player, target);
							content.warn({ t: 'friendsFixerThingthing', state: 2 });
						} else if (mutal.hasOwnProperty(targetId) && !mutalTarget.hasOwnProperty(receiverId)) {
							content.warn({ t: 'friendsFixerThingthing', state: 3, [receiverId]: mutal, [targetId]: mutalTarget, 1: mutal.hasOwnProperty(targetId), 2: !mutalTarget.hasOwnProperty(receiverId) });
							this.remove(player, targetId);
						} else if (mutalTarget.hasOwnProperty(receiverId) && !mutal.hasOwnProperty(targetId)) {
							this.remove(target, receiverId);
							content.warn({ t: 'friendsFixerThingthing', state: 4 });
						}
						const object = (mutal.hasOwnProperty(receiverId)) ? mutal : (incoming.hasOwnProperty(receiverId)) ? incoming : (outgoing.hasOwnProperty(receiverId)) ? outgoing : false;
						if (!object) return;
						const type = (mutal.hasOwnProperty(receiverId)) ? 'mutal' : (incoming.hasOwnProperty(receiverId)) ? 'incoming' : (outgoing.hasOwnProperty(receiverId)) ? 'outgoing' : false;
						const isRequest = (key === 'incoming' || key === 'outgoing');
						const data = object[receiverId];
						if (!isDefined(currentValue)) {
							if (isDefined((data as any)[key])) {
								if (isRequest) delete (friendsTarget.requests[type as unknown as ('incoming' | 'outgoing')] as any)[receiverId][key];
								else if (type) delete (friendsTarget[type as 'mutal'] as any)[receiverId][key];
								changed = true;
							}
							return;
						}
						if ((data as any)[key] === currentValue) return;
						if (isRequest) (friendsTarget.requests as any)[receiverId][key] = currentValue;
						else (friendsTarget as any)[receiverId][key] = currentValue;
						if (changed) friendThis.setFriendData(player, friendsTarget);
					});

				});

			}
		});
		requestBuilder.watch(`friends*${this.systemKey}`, (requesteeId, id, type, value) => {
			content.warn({ t: 'requestBuilder.watch', requesteeId, id, type, value });
			const { date } = value;
			// content.warn({ id, action, online: global.players.hasOwnProperty(id), time: time.now() - date > maxTime });
			if (time.now() - date > maxTime) {
				content.warn('delete requestkwwdkjwdqjfiwue');
				return true;
				// return requestBuilder.remove('friends', requesteeId);
			}
			const player = players.getById(id);
			if (!player) return;


			console.warn(player.name);
			time.start('watchtest');
			// content.warn({ watchejhetme: time.end('watchtest') });
			const friends = friendThis.getFriendData(player);
			const { mutal = {}, requests: { incoming = {}, outgoing = {} } = {} } = friends;
			switch (type) {
				case 'remove': {
					friendThis.remove(player, requesteeId);
					return true;
				}
				case 'add': {
					content.warn({ t: 'friendsWatchAdd1111111111111111111111111111111', requesteeId, id, type, value });
					if ((incoming && incoming.hasOwnProperty(requesteeId)) || (outgoing && outgoing.hasOwnProperty(requesteeId))) {
						delete value.date;
						friendThis.add(player, requesteeId, value);
						return true;
					}
					if (!friends.hasOwnProperty('requests')) friends.requests = {} as typeof friends.requests;
					if (!friends.requests.hasOwnProperty('incoming')) friends.requests.incoming = {};
					delete value.date;
					friends.requests.incoming[requesteeId] = value;
					this.setFriendData(player, friends);
					// content.warn({ tagDatabases });
					return true;
				}
				default: {
					const property = type.replace('Change', '');
					content.warn({ property });
					const { set } = properties[property] ?? {};
					if (!properties.hasOwnProperty(property)) {
						try {
							throw new Error(`property: ${property}, is not one of the following: ${Object.keys(properties)}!`);
						} catch (error: any) {
							errorLogger.log(error, error.stack, { key: `${this.systemKey}`, event: 'FriendsWatchChange' });
						}
						return true;


					}
					if (set instanceof Function) set(player, requesteeId, value[property]);
					else content.warn({ hi: '38938929823382773' });
					if (mutal.hasOwnProperty(requesteeId)) (friends.mutal[requesteeId] as any)[property] = value[property];
					else if (incoming.hasOwnProperty(requesteeId)) (friends.requests.incoming[requesteeId] as any)[property] = value[property];
					else if (outgoing.hasOwnProperty(requesteeId)) (friends.requests.outgoing[requesteeId] as any)[property] = value[property];
					friendThis.setFriendData(player, friends);
					return true;
				}
			};
		});
	}
}
export class FriendSystemBuilder {
	friends: { [systemKey: string]: { system: FriendSystem, data: { type: 'central' | 'remote', properties: { [key: string]: { get: (player: Player) => any, set: (player: Player) => any, init: (player: Player) => any; }; }; }; }; };
	constructor() {
		/**
		 * @type {}
		 */
		this.friends = {};
	}
	/**
	 * @param {string} systemKey 
	 * @param {} data 
	 */
	create(systemKey: string, data: { type: 'central' | 'remote', properties: { [key: string]: { get: (player: Player) => any, set: (player: Player) => any, init: (player: Player) => any; }; }; }) {
		if (typeof systemKey !== 'string') throw new Error(`systemKey: ${systemKey}, at params[0] is not of type: String!`);
		if (!(data instanceof Object)) throw new Error(`data, at params[1] is not of type: Object!`);
		const { type = 'central', properties } = data;
		if (!types.includes(type)) throw new Error(`type: ${type}, in data at params[1] is not one of the following: ${orArray(types)}!`);
		Object.entries(properties).forEach(([key, { init, set, get }]) => {
			if (init && !(init instanceof Function)) throw new Error(`init in ${key} in properties in data at params[1] is Defined and not of type: Function!`);
			if (set && !(set instanceof Function)) throw new Error(`init in ${key} in properties in data at params[1] is Defined and not of type: Function!`);
			if (get && !(get instanceof Function)) throw new Error(`init in ${key} in properties in data at params[1] is Defined and not of type: Function!`);
		});
		this.friends[systemKey] = {} as typeof this.friends[typeof systemKey];
		this.friends[systemKey]!.data = data;
		this.friends[systemKey]!.system = new FriendSystem(systemKey, data);;
	}

	get(systemKey: string): FriendSystem {
		if (typeof systemKey !== 'string') throw new Error(`systemKey: ${systemKey}, at params[0] is not of type: String!`);
		if (!this.friends.hasOwnProperty(systemKey)) throw new Error(`systemKey: ${systemKey}, at params[0] is not one of the following: ${orArray(Object.keys(this.friends))}!`);
		return this.friends[systemKey]!.system;
	}
}