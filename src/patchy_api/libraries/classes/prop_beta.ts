import { Entity, Player, Vector3, World, world } from "@minecraft/server";
import { workerData } from "worker_threads";
import { isDefined } from "../utilities";

/**
 * @param {string} str 
 * @param {number} length 
 * @returns {string[]}
 */
function chunkStringBytes(str: string, length: number) {
	const chunks = [];
	let chunk = '';
	let byteCount = 0;

	for (let i = 0; i < str.length; i++) {
		const char = str[i]!;
		const charCode = char.charCodeAt(0);
		const bytesChar = (charCode < 128) ? 1 : (charCode < 1024) ? 2 : (charCode < 65536) ? 3 : 4;
		if (byteCount + bytesChar > length) {
			chunks.push(chunk);
			chunk = '';
			byteCount = 0;
		}
		byteCount += bytesChar;
		chunk += char;

	}

	if (chunk.length > 0) {
		chunks.push(chunk);
	}

	return chunks;
}
class DynamicProperties {
	public storage: Record<string, DynamicPropertiesForInstance> = {};
	private subscribedEvents: boolean = false;
	private subscribeEvents() {
		if (this.subscribedEvents) return;
		this.subscribedEvents = true;
		world.afterEvents.entityDie.subscribe((event) => {
			const { deadEntity } = event;
			if (deadEntity instanceof Player) return;

			if (world.getEntity(deadEntity.id)) return;
			delete this.storage[deadEntity.id];
		});
		world.afterEvents.entityRemove.subscribe((event) => {
			const { removedEntityId } = event;
			if (world.getEntity(removedEntityId)) return;
			delete this.storage[removedEntityId];
		});
		world.afterEvents.playerLeave.subscribe((event) => {
			const { playerId } = event;
			delete this.storage[playerId];
		});

	}
	public get(instance?: Player | Entity | World) {
		this.subscribeEvents();
		const id = (!instance || instance instanceof World) ? 'world' : instance.id;
		this.storage[id] ??= new DynamicPropertiesForInstance(instance);
		this.storage[id]!.cache ??= {};
		return this.storage[id];
	}
}
export const dynamicProperties = new DynamicProperties();
interface PropertiesCache {
	json?: Record<string, any>;
	string?: Record<string, string | undefined>;
	number?: Record<string, number | undefined>;
	boolean?: Record<string, boolean | undefined>;
	vector3?: Record<string, Vector3 | undefined>;
}
class DynamicPropertiesForInstance {
	instance: Player | Entity | World;
	id: string;
	cache?: PropertiesCache;
	constructor(instance: Player | Entity | World = world) {
		this.instance = instance;
		this.id = (instance instanceof World) ? 'world' : instance.id;
	}
	get jsons() {
		this.cache!.json ??= {};
		const thisProperty = this;
		return new Proxy(this.cache!.json!, {
			get(target, identifer) {
				if (typeof identifer !== 'string') return;
				return thisProperty.getJSON(identifer);
			}
		});
	}
	getJSON<T>(identifer: string): T | undefined {
		if (this.cache?.json?.[identifer]) return this.cache?.json[identifer];
		const joins = [];
		for (let i = 0, property = this.getString(`${identifer}_0`), valid = true; ; i++, property = this.getString(`${identifer}_${i}`)) {
			if (property) joins.push(property);
			break;
		}
		if (!joins.length) return;
		let ouput: T | undefined;
		try {
			ouput = JSON.parse(joins.join(''));
		} catch { }
		return ouput;
	}
	getString(identifer: string): string | undefined {
		this.cache!.string ??= {};
		if (identifer in this.cache?.string!) return this.cache?.string[identifer];


		const value = this.instance.getDynamicProperty(identifer);
		if (typeof value !== 'string') return;
		this.cache!.string![identifer] ??= value;
		return value;
	}
	setString(identifer: string, value?: string): this {
		this.instance.setDynamicProperty(identifer, value);
		this.cache!.string ??= {};
		this.cache!.string[identifer] = value;
		return this;
	}
	setJSON(identifer: string, value?: any): this {
		if (!isDefined(value)) {
			this.cache!.json ??= {};
			this.cache!.json[identifer] = value;
			return this;
		}
		const rawJSON = JSON.stringify(value);
		
		return this;
	}
}