// import { eventBuilder, obfuscate255, deobfuscate255, Database, global, content } from "../../modules.js";
import { content, obfuscate255, deobfuscate255 } from '../utilities.js';
import { Database } from './database.js';
import global from './global.js';
import eventBuilder from './events.js';
import { Player, world } from '@minecraft/server';
import time from './time.js';
const tagLength = 'tagDB:'.length;
class TagDatabases {
	constructor() {
		this.__queuedSaves = {
			subscribed: false,
			saves: {}
		};
		eventBuilder.subscribe('TagDatabase*API', {
			playerJoined: ({ player }) => {
				this.initalize(player);
			}
		});
	}
	initalize(player) {
		time.start('TagDatabases');
		const { id } = player;
		const tags = player.getTags();
		// content.warn("hello", tags);
		// return;
		const obfuscatedDatabases = tags.filter(tag => tag.startsWith('tagDB:')).map(tag => tag.slice(tagLength));
		// content.warn({ obfuscatedDatabases });
		if (!obfuscatedDatabases.length) return;
		const rawDatabases = obfuscatedDatabases.map(text => deobfuscate255(text).match(/(.*):(\d+):(.*)/).splice(1));
		// content.warn({ rawDatabases, tags });
		const objectDatabase = {};
		rawDatabases.forEach(([databaseId, order, value]) => {
			if (!objectDatabase.hasOwnProperty(databaseId)) objectDatabase[databaseId] = [];
			objectDatabase[databaseId].push([order, value]);
		});
		objectDatabase.forEach((databaseId, valueArray) => {
			const test = valueArray.sort(([a], [b]) => Number(a) - Number(b));
			// content.warn({ test });
			const fullrawDatabase = test.map(([order, text]) => text).join();
			// content.warn({ fullrawDatabase });
			if (!this.hasOwnProperty(databaseId)) this[databaseId] = {};
			if (!this[databaseId].hasOwnProperty(id)) this[databaseId][id] = new Database(JSON.parse(fullrawDatabase));
			// content.warn({ this: this[databaseId][id] });
		});
		// content.warn({ TagDatabases: time.end('TagDatabases') });
	}
	initalizeAll() {
		this.clear();
		this.__queuedSaves = {
			subscribed: false,
			saves: {}
		};
		global.players.forEach((id, player) => {
			this.initalize(player);
		});

	}
	/**
	 * 
	 * @param {Player} player 
	 * @param {String} databaseId 
	 * @returns {Database}
	 */
	get(player, databaseId) {
		const { id } = player;

		if (!this.hasOwnProperty(databaseId)) this[databaseId] = {};
		if (!this[databaseId].hasOwnProperty(id)) this[databaseId][id] = new Database();

		return this[databaseId][id];

	}
	queueSave(player, databaseId) {
		// content.warn({ name: player.name, databaseId });
		const { id } = player;
		if (!this.hasOwnProperty(databaseId)) return new Error(`databaseId: ${databaseId}, does not exist on tag database`);
		if (!this.__queuedSaves.saves.hasOwnProperty(databaseId)) this.__queuedSaves.saves[databaseId] = {};
		if (this.__queuedSaves.saves[databaseId].hasOwnProperty(id)) return;
		if (!this.__queuedSaves.saves[databaseId].hasOwnProperty(id)) this.__queuedSaves.saves[databaseId][id] = player;

		if (!this.__queuedSaves.subscribed) {
			eventBuilder.subscribe('end_tagSaveQueue*API', {
				tickAfterLoad: () => {
					if (!this.__queuedSaves.saves.length()) return eventBuilder.unsubscribe('end_tagSaveQueue*API', 'tickAfterLoad');
					this.__queuedSaves.saves.forEach((key, value) => {
						value.forEach((id, player) => {
							this.save(key, player);
							delete this.__queuedSaves.saves[key];
						});
					});
				}
			});
		}
	}
	save(databaseId, player) {
		// content.warn({ t: 'tDB', databaseId });
		const { id } = player;
		if (!this.hasOwnProperty(databaseId)) return new Error(`databaseId: ${databaseId}, does not exist on tag database`);


		let players;
		if (!player) {
			players = global.players.filter(player => {
				const { playerMap } = player;
				const loaded = playerMap[id];
				if (loaded && this[databaseId].hasOwnProperty(id)) {
					return true;
				}
			});


		} else {
			players = [player];
		}
		const sliceLength = databaseId.length + 'tagDB:'.length + 8;
		players.forEach(player => {
			const { id } = player;
			if (!this?.[databaseId]?.[id]) return;
			const tags = player.getTags();
			let rawTexts;
			if (tags.length) rawTexts = tags.filter(text => text.startsWith('tagDB:') && deobfuscate255(text.slice('tagDB:'.length)).match(/(.*):(\d+):/).splice(1)[0] === databaseId);
			if (!this.hasOwnProperty(databaseId)) this[databaseId] = {};
			if (!this[databaseId].hasOwnProperty(id)) this[databaseId][id] = new Database(JSON.stringify(value));

			if (rawTexts && rawTexts.length) rawTexts.forEach(tag => player.removeTag(tag));
			const chunkSize = 32767 - (sliceLength + 8);
			// content.warn({ t: 'saveTag', dtata: this[databaseId] });
			const stringifiedDatabase = JSON.stringify(this[databaseId][id]);
			const stringifiedDBLength = stringifiedDatabase.length;
			const databaseChunks = Array.from(Array(Math.ceil(stringifiedDBLength / chunkSize)), (item, i) => stringifiedDatabase.substr(i * chunkSize, chunkSize));

			databaseChunks.forEach((databaseChunk, i) => {
				const tag = obfuscate255(`${databaseId}:${i}:${databaseChunk}`);
				player.addTag('tagDB:' + tag);
			});
		});
	}
}

const tagDatabases = new TagDatabases();
export default tagDatabases;

