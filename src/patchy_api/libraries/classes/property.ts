import { Entity, Player, Vector3, World, world } from "@minecraft/server";

export function isDefined(input: any) {
	return (input !== null && input !== undefined && !Number.isNaN(input));
}
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
export function isVector3<T>(target: T) {
	// content.warn(typeof target === 'object', !(target instanceof Array), 'x' in target, 'y' in target, 'z' in target);
	return target instanceof Object && 'x' in target && 'y' in target && 'z' in target;
}
class PropertyManager {
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
	public get(instance?: Player | Entity | World): DynamicPropertiesForInstance {
		this.subscribeEvents();
		const id = (!instance || instance instanceof World) ? 'world' : instance.id;
		this.storage[id] ??= new DynamicPropertiesForInstance(instance);
		this.storage[id]!.cache ??= {};
		return this.storage[id]!;
	}
}
const propertyManager = new PropertyManager();
export default propertyManager;
export interface PropertiesCache {
	json?: Record<string, any>;
	string?: Record<string, string | undefined>;
	number?: Record<string, number | undefined>;
	boolean?: Record<string, boolean | undefined>;
	vector3?: Record<string, Vector3 | undefined>;
}
export class DynamicPropertiesForInstance {
	instance: Player | Entity | World;
	id: string;
	cache?: PropertiesCache;
	constructor(instance: Player | Entity | World = world) {
		this.instance = instance;
		this.id = (instance instanceof World) ? 'world' : instance.id;
	}
	/**
	 * cannot SetJSON is for old things
	 */
	setAny<T>(identifer: string, value: T) {
		if (typeof value === 'string') return this.setString(identifer, value);
		if (typeof value === 'number') return this.setNumber(identifer, value);
		if (typeof value === 'boolean') return this.setBoolean(identifer, value);
		if (isVector3(value)) return this.setVector3(identifer, value as Vector3);
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
	setJSON(identifer: string, value?: any): this {
		if (!isDefined(value)) {
			this.cache!.json ??= {};
			this.cache!.json[identifer] = value;
			for (let i = 0, property = this.getString(`${identifer}_0`); ; i++, property = this.getString(`${identifer}_${i}`)) {
				if (property) this.setString(`${identifer}_${i}`);
				break;
			}
			return this;

		}
		const rawJSONChunks = chunkStringBytes(JSON.stringify(value), 32767);
		let i = 0;
		for (; i < rawJSONChunks.length; i++) {
			this.setString(`${identifer}_${i}`, rawJSONChunks[i]);
		}
		for (let property = this.getString(`${identifer}_0`); ; i++, property = this.getString(`${identifer}_${i}`)) {
			if (property) this.setString(`${identifer}_${i}`);
			break;
		}
		return this;
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
	get strings() {
		this.cache!.string ??= {};
		const thisProperty = this;
		return new Proxy(this.cache!.string!, {
			get(target, identifer) {
				if (typeof identifer !== 'string') return;
				return thisProperty.getString(identifer);
			}
		});
	}
	getNumber(identifer: string): number | undefined {
		this.cache!.number ??= {};
		if (identifer in this.cache?.number!) return this.cache?.number[identifer];
		const value = this.instance.getDynamicProperty(identifer);
		if (typeof value !== 'number') return;
		this.cache!.number![identifer] ??= value;
		return value;
	}
	setNumber(identifer: string, value?: number): this {
		this.instance.setDynamicProperty(identifer, value);
		this.cache!.number ??= {};
		this.cache!.number[identifer] = value;
		return this;
	}
	get numbers() {
		this.cache!.number ??= {};
		const thisProperty = this;
		return new Proxy(this.cache!.number!, {
			get(target, identifer) {
				if (typeof identifer !== 'string') return;
				return thisProperty.getNumber(identifer);
			}
		});
	}

	getBoolean(identifer: string): boolean | undefined {
		this.cache!.boolean ??= {};
		if (identifer in this.cache?.boolean!) return this.cache?.boolean[identifer];
		const value = this.instance.getDynamicProperty(identifer);
		if (typeof value !== 'boolean') return;
		this.cache!.boolean![identifer] ??= value;
		return value;
	}
	setBoolean(identifer: string, value?: boolean): this {
		this.instance.setDynamicProperty(identifer, value);
		this.cache!.boolean ??= {};
		this.cache!.boolean[identifer] = value;
		return this;
	}
	get booleans() {
		this.cache!.boolean ??= {};
		const thisProperty = this;
		return new Proxy(this.cache!.boolean!, {
			get(target, identifer) {
				if (typeof identifer !== 'string') return;
				return thisProperty.getBoolean(identifer);
			}
		});
	}
	getVector3(identifer: string): Vector3 | undefined {
		this.cache!.vector3 ??= {};
		if (identifer in this.cache?.vector3!) return this.cache?.vector3[identifer];
		const value = this.instance.getDynamicProperty(identifer);
		if (!isVector3(value)) return;
		this.cache!.vector3![identifer] ??= value as Vector3;
		return value as Vector3;
	}
	setVector3(identifer: string, value?: Vector3): this {
		this.instance.setDynamicProperty(identifer, value);
		this.cache!.vector3 ??= {};
		this.cache!.vector3[identifer] = value;
		return this;
	}
	get vector3s() {
		this.cache!.vector3 ??= {};
		const thisProperty = this;
		return new Proxy(this.cache!.vector3!, {
			get(target, identifer) {
				if (typeof identifer !== 'string') return;
				return thisProperty.getVector3(identifer);
			}
		});
	}

}