import { Player, World, world } from "@minecraft/server";
import { content } from "../utilities";
import eventBuilder from "./events/export_instance";
export function isDefined(input) {
    return (input !== null && input !== undefined && !Number.isNaN(input));
}
function chunkStringBytes(str, length) {
    const chunks = [];
    let chunk = '';
    let byteCount = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
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
export function isVector3(target) {
    // content.warn(typeof target === 'object', !(target instanceof Array), 'x' in target, 'y' in target, 'z' in target);
    return target instanceof Object && 'x' in target && 'y' in target && 'z' in target;
}
class PropertyManager {
    constructor() {
        this.storage = {};
        this.subscribedEvents = false;
    }
    subscribeEvents() {
        if (this.subscribedEvents)
            return;
        this.subscribedEvents = true;
        world.afterEvents.entityDie.subscribe((event) => {
            const { deadEntity } = event;
            if (deadEntity instanceof Player)
                return;
            if (world.getEntity(deadEntity.id))
                return;
            delete this.storage[deadEntity.id];
        });
        world.afterEvents.entityRemove.subscribe((event) => {
            const { removedEntityId } = event;
            if (world.getEntity(removedEntityId))
                return;
            delete this.storage[removedEntityId];
        });
        world.afterEvents.playerLeave.subscribe((event) => {
            const { playerId } = event;
            delete this.storage[playerId];
        });
    }
    get(instance) {
        this.subscribeEvents();
        const id = (!instance || instance instanceof World) ? 'world' : instance.id;
        // if (instance instanceof Player) {
        // 	content.warn({ id: instance?.id, instance: instance?.typeId });
        // 	content.warn({ "this.storage[id]": this.storage[id] });
        // }
        this.storage[id] ??= new DynamicPropertiesForInstance(instance);
        // if (instance instanceof Player) content.warn({ "this.storage[id]": this.storage[id] });
        return this.storage[id];
    }
}
const propertyManager = new PropertyManager();
export default propertyManager;
export class DynamicPropertiesForInstance {
    constructor(instance = world) {
        this.cache = {};
        this.typeCache = {};
        this.instance = instance;
        this.id = (instance instanceof World) ? 'world' : instance.id;
    }
    checkType(identifer, value) {
        const cachedType = this.typeCache[identifer];
        if (!cachedType)
            return true;
        if (!isDefined(value))
            return true;
        if (cachedType === 'json')
            return true;
        if (cachedType === 'vector3' && isVector3(value))
            return true;
        if (typeof value === cachedType)
            return true;
        return false;
    }
    /**
     * This cannot be undone and will wipe all properties for this instance
     */
    clearAll() {
        this.cache = {};
        this.instance.clearDynamicProperties();
    }
    /**
     * cannot set json used for old things
     * use class for setting of undefined. ex String, Number, Boolean, Vector (for vector3 as Vector3 is an interface)
     */
    setAny(identifer, value) {
        const cachedType = this.typeCache[identifer];
        if (cachedType === 'json')
            throw new Error(`cannot set a json value with setAny`);
        if (isDefined(value) && value?.constructor?.name === 'Function') {
            switch (value?.name) {
                case 'String': return this.setString(identifer, undefined);
                case 'Number': return this.setNumber(identifer, undefined);
                case 'Boolean': return this.setBoolean(identifer, undefined);
                case 'Vector': return this.setVector3(identifer, undefined);
            }
        }
        if (cachedType) {
            switch (cachedType) {
                case 'string': return this.setString(identifer, value);
                case 'number': return this.setNumber(identifer, value);
                case 'boolean': return this.setBoolean(identifer, value);
                case 'vector3': return this.setVector3(identifer, value);
            }
        }
        if (typeof value === 'string')
            return this.setString(identifer, value);
        if (typeof value === 'number')
            return this.setNumber(identifer, value);
        if (typeof value === 'boolean')
            return this.setBoolean(identifer, value);
        if (isVector3(value))
            return this.setVector3(identifer, value);
        throw new Error(`value being set to a type not of undefined, string, number, boolean, or vector3`);
    }
    /**
     * cannot get JSON. It is for old things
     */
    getAny(identifer) {
        const cachedType = this.typeCache[identifer];
        if (cachedType) {
            switch (cachedType) {
                case 'string': return this.getString(identifer);
                case 'number': return this.getNumber(identifer);
                case 'boolean': return this.getBoolean(identifer);
                case 'vector3': return this.getVector3(identifer);
                case 'json': return this.getJSON(identifer);
            }
        }
    }
    getJSON(identifer) {
        if (this.cache?.json?.[identifer])
            return this.cache?.json[identifer];
        const joins = [];
        for (let i = 0, property = this.getString(`${identifer}_0`), valid = true;; i++, property = this.getString(`${identifer}_${i}`)) {
            if (property)
                joins.push(property);
            break;
        }
        if (!joins.length)
            return;
        let ouput;
        try {
            ouput = JSON.parse(joins.join(''));
        }
        catch { }
        return ouput;
    }
    setJSON(identifer, value) {
        if (!this.checkType(identifer, value))
            throw new Error(`value being set to a identifer: ${identifer}, which is of type: ${this.typeCache[identifer]} and is not of type: JSON, undefined, or null`);
        this.typeCache[identifer] ??= 'json';
        if (!isDefined(value)) {
            this.cache.json ??= {};
            this.cache.json[identifer] = value;
            for (let i = 0, property = this.getString(`${identifer}_0`);; i++, property = this.getString(`${identifer}_${i}`)) {
                if (property)
                    this.setString(`${identifer}_${i}`);
                break;
            }
            return this;
        }
        const rawJSONChunks = chunkStringBytes(JSON.stringify(value), 32767);
        let i = 0;
        for (; i < rawJSONChunks.length; i++) {
            this.setString(`${identifer}_${i}`, rawJSONChunks[i]);
        }
        for (let property = this.getString(`${identifer}_0`);; i++, property = this.getString(`${identifer}_${i}`)) {
            if (property)
                this.setString(`${identifer}_${i}`);
            break;
        }
        return this;
    }
    get jsons() {
        this.cache.json ??= {};
        const thisProperty = this;
        return new Proxy(this.cache.json, {
            get(target, identifer) {
                if (typeof identifer !== 'string')
                    throw new Error(`identifer is not a string`);
                return thisProperty.getJSON(identifer);
            },
            set(target, identifer, value) {
                if (typeof identifer !== 'string')
                    throw new Error(`identifer is not a string`);
                thisProperty.setJSON(identifer, value);
                return Reflect.set(...arguments);
            }
        });
    }
    getString(identifer) {
        const cachedType = this.typeCache[identifer];
        if (cachedType && cachedType !== 'string')
            throw new Error(`identifer: ${identifer} is of type: ${cachedType} and not of type: string`);
        this.cache.string ??= {};
        if (identifer in this.cache?.string)
            return this.cache?.string[identifer];
        const value = this.instance.getDynamicProperty(identifer);
        if (typeof value !== 'string')
            return;
        this.cache.string[identifer] ??= value;
        return value;
    }
    setString(identifer, value) {
        if (!this.checkType(identifer, value))
            throw new Error(`value being set to a identifer: ${identifer}, which is of type: ${this.typeCache[identifer]} and is not of type: string, undefined, or null`);
        const lastValue = this.getString(identifer);
        this.typeCache[identifer] ??= 'string';
        this.instance.setDynamicProperty(identifer, value);
        this.cache.string ??= {};
        this.cache.string[identifer] = value;
        eventBuilder.getEvent('stringPropertyChange').iterate({ source: this.instance, identifier: identifer, value: value, lastValue });
        return this;
    }
    get strings() {
        this.cache.string ??= {};
        const thisProperty = this;
        return new Proxy(this.cache.string, {
            get(target, identifer) {
                if (typeof identifer !== 'string')
                    return;
                return thisProperty.getString(identifer);
            },
            set(target, identifer, value) {
                if (typeof identifer !== 'string')
                    throw new Error(`identifer is not a string`);
                if (isDefined(value) && typeof value !== 'string')
                    throw new Error(`value being set to ${identifer} is not a string`);
                thisProperty.setString(identifer, value);
                return Reflect.set(...arguments);
            }
        });
    }
    getNumber(identifer) {
        const cachedType = this.typeCache[identifer];
        if (cachedType && cachedType !== 'number')
            throw new Error(`identifer: ${identifer} is of type: ${cachedType} and not of type: number`);
        this.cache.number ??= {};
        if (identifer in this.cache?.number)
            return this.cache?.number[identifer];
        const value = this.instance.getDynamicProperty(identifer);
        if (typeof value !== 'number')
            return;
        this.cache.number[identifer] ??= value;
        return value;
    }
    setNumber(identifer, value) {
        if (!this.checkType(identifer, value))
            throw new Error(`value being set to a identifer: ${identifer}, which is of type: ${this.typeCache[identifer]} and is not of type: Number, undefined, or null`);
        const lastValue = this.getNumber(identifer);
        this.typeCache[identifer] ??= 'number';
        this.instance.setDynamicProperty(identifer, value);
        this.cache.number ??= {};
        this.cache.number[identifer] = value;
        eventBuilder.getEvent('numberPropertyChange').iterate({ source: this.instance, identifier: identifer, value: value, lastValue });
        return this;
    }
    get numbers() {
        this.cache.number ??= {};
        const thisProperty = this;
        return new Proxy(this.cache.number, {
            get(target, identifer) {
                if (typeof identifer !== 'string')
                    throw new Error(`identifer is not a string`);
                return thisProperty.getNumber(identifer);
            },
            set(target, identifer, value) {
                if (typeof identifer !== 'string')
                    throw new Error(`identifer is not a string`);
                if (isDefined(value) && typeof value !== 'number')
                    throw new Error(`value being set to ${identifer} is not a number`);
                thisProperty.setNumber(identifer, value);
                return Reflect.set(...arguments);
            }
        });
    }
    getBoolean(identifer) {
        const cachedType = this.typeCache[identifer];
        if (cachedType && cachedType !== 'boolean')
            throw new Error(`identifer: ${identifer} is of type: ${cachedType} and not of type: boolean`);
        this.cache.boolean ??= {};
        if (identifer in this.cache?.boolean)
            return this.cache?.boolean[identifer];
        const value = this.instance.getDynamicProperty(identifer);
        if (typeof value !== 'boolean')
            return;
        this.cache.boolean[identifer] ??= value;
        return value;
    }
    setBoolean(identifer, value) {
        if (!this.checkType(identifer, value))
            throw new Error(`value being set to a identifer: ${identifer}, which is of type: ${this.typeCache[identifer]} and is not of type: Boolean, undefined, or null`);
        const lastValue = this.getBoolean(identifer);
        this.typeCache[identifer] ??= 'boolean';
        this.instance.setDynamicProperty(identifer, value);
        this.cache.boolean ??= {};
        this.cache.boolean[identifer] = value;
        eventBuilder.getEvent('booleanPropertyChange').iterate({ source: this.instance, identifier: identifer, value: value, lastValue });
        return this;
    }
    get booleans() {
        this.cache.boolean ??= {};
        const thisProperty = this;
        return new Proxy(this.cache.boolean, {
            get(target, identifer) {
                if (typeof identifer !== 'string')
                    throw new Error(`identifer is not a string`);
                return thisProperty.getBoolean(identifer);
            },
            set(target, identifer, value) {
                if (typeof identifer !== 'string')
                    throw new Error(`identifer is not a string`);
                if (isDefined(value) && typeof value !== 'boolean')
                    throw new Error(`value being set to ${identifer} is not a boolean`);
                thisProperty.setBoolean(identifer, value);
                return Reflect.set(...arguments);
            }
        });
    }
    getVector3(identifer) {
        const cachedType = this.typeCache[identifer];
        if (cachedType && cachedType !== 'vector3')
            throw new Error(`identifer: ${identifer} is of type: ${cachedType} and not of type: vector3`);
        this.cache.vector3 ??= {};
        if (identifer in this.cache?.vector3)
            return this.cache?.vector3[identifer];
        const value = this.instance.getDynamicProperty(identifer);
        if (!isVector3(value))
            return;
        this.cache.vector3[identifer] ??= value;
        return value;
    }
    setVector3(identifer, value) {
        if (!this.checkType(identifer, value))
            throw new Error(`value being set to a identifer: ${identifer}, which is of type: ${this.typeCache[identifer]} and is not of type: Vector3, undefined, or null`);
        const lastValue = this.getVector3(identifer);
        this.instance.setDynamicProperty(identifer, value);
        this.cache.vector3 ??= {};
        this.cache.vector3[identifer] = value;
        eventBuilder.getEvent('vector3PropertyChange').iterate({ source: this.instance, identifier: identifer, value: value, lastValue });
        return this;
    }
    get vector3s() {
        this.cache.vector3 ??= {};
        const thisProperty = this;
        return new Proxy(this.cache.vector3, {
            get(target, identifer) {
                if (typeof identifer !== 'string')
                    throw new Error(`identifer is not a string`);
                return thisProperty.getVector3(identifer);
            },
            set(target, identifer, value) {
                if (typeof identifer !== 'string')
                    throw new Error(`identifer is not a string`);
                if (isDefined(value) && !isVector3(value))
                    throw new Error(`value being set to ${identifer} is not a vector3`);
                thisProperty.setVector3(identifer, value);
                return Reflect.set(...arguments);
            }
        });
    }
}
world.afterEvents.chatSend.subscribe((event) => {
    if (event.message === 'prop')
        content.chatFormat(propertyManager);
});
//# sourceMappingURL=property.js.map