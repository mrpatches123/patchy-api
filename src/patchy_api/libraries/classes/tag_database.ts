// import { eventBuilder, obfuscate255, deobfuscate255, Database, global, content } from "../../modules.js";
import { content, obfuscate255, deobfuscate255, chunkString, chunkStringBytes } from '../utilities.js';
import { Database } from './database.js';
import global from './global.js';
import eventBuilder from './events/export_instance.js';
import { Player, world } from '@minecraft/server';
import time from './time.js';
import players from './players/export_instance.js';
const tagLength = 'tagDB:'.length;
function byteCount(string: string) {
	let bytes = 0;
	for (let i = 0; i < string.length; i++) {
		const char = string[i]!;
		if (char.charCodeAt(0) > 127) bytes += 2;
		else ++bytes;
	}
	return bytes;
}
class TagDatabases {
	__queuedSaves: { subscribed: false; saves: Record<string, { [key: string]: Player; }>; } | { subscribed: true; saves: { [key: string]: { [key: string]: Player; }; }; };
	initalized: Record<string, boolean>;
	databases: Record<string, Record<string, Database>> = {};
	constructor() {
		this.__queuedSaves = {
			subscribed: false,
			saves: {}
		};
		this.initalized = {};
		const thisTag = this;
		eventBuilder.subscribe('init_TagDatabase*API', {
			worldLoad: () => {
				players.get().iterate(player => {
					thisTag.initalize(player);
				});
			},
			playerJoined: ({ player }) => {
				thisTag.initalize(player);
			},
			playerLeave: ({ playerId }) => {
				delete thisTag.initalized[playerId];
			}
		});
	}
	initalize(player: Player) {
		if (this.initalized[player.id]) return;
		this.initalized[player.id] = true;
		time.start('TagDatabases');
		const { id } = player;
		const tags = player.getTags();
		// content.warn("hello", tags);
		// return;
		const obfuscatedDatabases = tags.filter(tag => tag.startsWith('tagDB:')).map(tag => tag.slice(tagLength));
		// content.warn({ obfuscatedDatabases });
		if (!obfuscatedDatabases.length) return;
		const rawDatabases = obfuscatedDatabases.map(text => deobfuscate255(text).match(/(.*):(\d+):(.*)/)!.splice(1))! as unknown as [string, string, string][];
		// content.warn({ rawDatabases, tags });
		const objectDatabase: Record<string, [string, string][]> = {};
		rawDatabases.forEach(([databaseId, order, value]) => {
			objectDatabase[databaseId] ??= [];
			objectDatabase[databaseId]!.push([order, value]);
		});
		Object.entries(objectDatabase).forEach(([databaseId, valueArray]) => {
			const test = valueArray.sort(([a], [b]) => Number(a) - Number(b));
			// content.warn({ test });
			const fullrawDatabase = test.map(([order, text]) => text).join('');
			// content.warn({ fullrawDatabase });
			this.databases[databaseId] ??= {};
			this.databases[databaseId]![id] ??= new Database(JSON.parse(fullrawDatabase));
			// content.warn({ this: this[databaseId][id] });
		});
		// content.warn({ TagDatabases: time.end('TagDatabases') });
	}
	initalizeAll() {
		this.clear();
		this.__queuedSaves ??= {
			subscribed: false,
			saves: {}
		};
		this.initalized ??= {};
		global.players.forEach((id, player) => {
			this.initalize(player);
		});

	}
	getTestRaw(player, databaseId) {
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
		if (databaseId) return objectDatabase[databaseId];
		return objectDatabase;
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
		const sliceLength = byteCount(obfuscate255(databaseId + 'tagDB:') + '99999:');
		players.forEach(player => {
			const { id } = player;
			if (!this?.[databaseId]?.[id]) return;
			const tags = player.getTags();
			let rawTexts;
			if (tags.length) rawTexts = tags.filter(text => text.startsWith('tagDB:') && deobfuscate255(text.slice('tagDB:'.length)).match(/(.*):(\d+):/).splice(1)[0] === databaseId);
			if (!this.hasOwnProperty(databaseId)) this[databaseId] = {};
			if (!this[databaseId].hasOwnProperty(id)) this[databaseId][id] = new Database(JSON.stringify(value));

			if (rawTexts && rawTexts.length) rawTexts.forEach(tag => player.removeTag(tag));
			const chunkSize = 255 - sliceLength;
			// content.warn({ t: 'saveTag', dtata: this[databaseId] });
			const stringifiedDatabase = JSON.stringify(this[databaseId][id]);
			// const stringifiedDBLength = stringifiedDatabase.length;
			const databaseChunks = chunkStringBytes(obfuscate255(stringifiedDatabase), chunkSize);
			//  Array.from(Array(Math.ceil(stringifiedDBLength / chunkSize)), (item, i) => stringifiedDatabase.substr(i * chunkSize, chunkSize));
			content.warn({ databaseChunks });
			databaseChunks.forEach((databaseChunk, i) => {
				const tag = obfuscate255(`${databaseId}:${i}:`) + databaseChunk;
				content.warn({ databaseChunk: databaseChunk.length, tag: ('tagDB:' + tag).length });
				player.addTag('tagDB:' + tag);
			});
		});
	}
}

const tagDatabases = new TagDatabases();
export default tagDatabases;

