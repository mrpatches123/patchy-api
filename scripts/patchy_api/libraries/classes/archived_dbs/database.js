import { BlockAreaSize } from "@minecraft/server";
import { overworld, content, isDefined } from '../../utilities.js';
import time from "../time.js";
// const overworld = world.getDimension('overworld');
const chunkSize = 32763;
// import { compress, decompress } from '../zip_255cs.js';
/**
 * @param {Entity} entity
 */
function removeAllTags(entity) {
    entity.getTags().forEach(tag => entity.removeTag(tag));
}
export class Database {
    constructor(json = {}) {
        Object.assign(this, json);
        this.__db_properties = json.__db_properties ?? {};
        // content.warn({ json, __db_properties: this.__db_properties });
    }
    /**
     * @method set set a keys for its value in the Database
     * @param {String} key key for value.
     * @param {any} value value for key.
     * @returns {Database} this
     */
    set(key, value) {
        if (typeof key !== 'number' && typeof key !== 'string')
            throw new Error('argument zero must be a key');
        if (!isDefined(value))
            throw new Error('Argument one must have a value for the key');
        if (key === '__db_properties')
            throw new Error('Key must not be "__db_properties"');
        this[key] = value;
        // content.warn({ t: 'DatabaseSet', [key]: value, databases });
        return this;
    }
    get(key) {
        if (typeof key !== 'number' && typeof key !== 'string')
            throw new Error('argument zero must be a key');
        if (key === '__db_properties')
            throw new Error('Key must not be "__db_properties"');
        if (this[key])
            return this[key];
    }
    delete(key) {
        if (typeof key !== 'number' && typeof key !== 'string')
            throw new Error('argument zero must be a key');
        if (key === '__db_properties')
            throw new Error('Key must not be "__db_properties"');
        delete this[key];
        return this;
    }
    clear() {
        Object.keys(this).filter(key => key !== '__db_properties').forEach(key => delete this[key]);
        return this;
    }
    has(key) {
        if (typeof key !== 'number' && typeof key !== 'string')
            throw new Error('argument zero must be a key');
        return key in this;
    }
}
const existingCoords = [];
/*function getNewRange() { //Returns random range between z0,x0 and z15, x15.
    let cords = [];
    for (let i=0;i=<15; ++i) {
        for (let j=0;i=<15; ++j) {
            cords.push({x:i,z:j});
        }
    }
    return cords.filter(object=>existingCoords.includes(object))[Math.floor(Math.random()*cords.length-1)];
};*/
// getNewRange(0, 0, 15, 15);
// function getRandCoord() {
//     return Array(256).fill('')
//         .map((item, i) => ({ x: i % 16, z: Math.floor(i / 16) % 16 }))
//         .filter(item => !existingCoords.some(coord => coord.x === item.x && coord.z === item.z)).random();
// }
//
const coords256 = Array.from(Array(256), (item, i) => ({ x: i % 16, z: Math.floor(i / 16) % 16 }));
function getSign(number) {
    const sign = Number(number) / Math.abs(Number(number));
    return (!sign) ? 0 : sign;
}
const databasesArea = new BlockAreaSize(16, 1, 16);
export class Databases {
    constructor() {
        this.__queuedSaves = [];
        this.data = {};
    }
    /**
     * @method initialize starts the database
     * @returns {void}
     */
    initialize() {
        const entityArray = [];
        const entities = [...overworld.getEntities({ type: 'patches:database' })];
        // content.warn({ entities: entities.length });
        entities.forEach(entity => {
            let { location } = entity;
            const { x, z } = location;
            const index = entityArray.findIndex(([fx, fz]) => fx === x && fz === z);
            if (index !== -1) {
                entityArray[index] ??= [x, z, entity];
                entityArray[index].push(entity);
            }
            else {
                entityArray.push([x, z, entity]);
            }
        });
        entityArray.forEach(entitiesBS => {
            time.start('databaseInitTest');
            const entities = entitiesBS.splice(2).filter(entity => entity);
            const json = [];
            if (entities) {
                const name = entities[0].getTags().find(tag => tag.includes('dbName:')).replace('dbName:', '');
                // content.warn({ dbNmae: name });
                entities.forEach(entity => {
                    const order = entities[0].getTags().find(tag => tag.includes('dbOrder:')).replace('dbName:', '');
                    json.push([Number(order), entity.nameTag]);
                });
                if (name) {
                    this.data[name] = new Database(JSON.parse(json.sort((a, b) => a[0] - b[0]).map(([a, b]) => b).join('')));
                    // content.warn({ [name]: this[name] });
                }
                // content.warn({ name, gettime: time.end('databaseInitTest'), length: JSON.stringify(this[name]).length });
            }
        });
        // content.warn({ this: this });
        // content.warn(this.get('requestsAPI'));
    }
    _getRandCoords() {
        // @ts-ignore comment
        return coords256.filter(({ x, z }) => !(this ?? {})).some((key, { __db_properties: { coords: { x: ex, z: ez } = {} } = {} }) => x === ex && z === ez).random();
    }
    getPropertiesObject() {
        return { coords: this._getRandCoords() /*, saveTicks: (Object.keys(this).length + 1) * 2 */ };
    }
    add(name) {
        if (!name)
            throw new Error('must input Database name');
        if (this.data[name])
            throw new Error(`Database: ${name}, exists`);
        const propertiesObject = this.getPropertiesObject();
        // content.chatFormat('prop', propertiesObject);
        this.data[name] = new Database({ __db_properties: propertiesObject });
        // overworld.runCommandAsync(`say db ${JSON.stringify(this[name])}`);
        return this.data[name];
    }
    /**
         * @method getFromMemory gets a database on Databases from memory
         * @param {String} name Database name
         * @returns {Database} this[name]
         */
    getFromMemory(name) {
        if (!name)
            throw new Error('must input Database name');
        if (this.data[name])
            return this.data[name];
    }
    get(name) {
        return this.getFromMemory(name);
    }
    getFromEntity(name) {
        if (!name)
            throw new Error('must input Database name');
        const { __db_properties: propertiesObject = {} } = this.data[name] ?? {};
        const { coords } = propertiesObject;
        // content.warn({ propertiesObject });
        if (!coords) {
            return;
        }
        let entities = overworld.getEntitiesAtBlockLocation({ x: coords.x, y: -64, z: coords.z });
        // content.warn({ entities: entities.map(({ nameTag }) => nameTag) });
        if (entities.length) {
            entities = entities.filter(({ typeId }) => typeId === 'patches:database');
            const name = entities[0].getTags().find(tag => tag.includes('dbName:')).replace('dbName:', '');
            const json = [];
            entities.forEach(entity => {
                const order = entities[0].getTags().find(tag => tag.includes('dbOrder:')).replace('dbName:', '');
                json.push([Number(order), entity.nameTag]);
            });
            const string = (json.sort((a, b) => a[0] - b[0]).map(([a, b]) => b).join(''));
            // content.warn({ string });
            return string;
        }
    }
    delete(name, removeEntity = false) {
        if (removeEntity) {
            const { __db_properties: propertiesObject = {} } = this.data[name] ?? {};
            const { coords } = propertiesObject;
            // content.warn({ propertiesObject });
            if (!coords) {
                return;
            }
            const entities = overworld.getEntitiesAtBlockLocation({ x: coords.x, y: -64, z: coords.z });
            entities.forEach(entity => (entity.triggerEvent('patches:kill')));
        }
        delete this.data[name];
    }
    deleteAll() {
        Object.keys(this.data).forEach((name) => {
            delete this.data[name];
        });
    }
    /**
     * @method save saves the database to a structure file
     * @param {String} name Database name
     */
    save(name) {
        //console.warn(name);
        const { x, z } = this.data[name].__db_properties['coords'];
        if (x && z && this.data[name]) {
            console.warn(x, z);
            time.start('test37763');
            const stringifiedDatabase = (JSON.stringify(this.data[name]));
            const stringify = time.end('test37763');
            content.warn({ name, length: stringifiedDatabase.length, stringifiedDatabase });
            let size = (stringifiedDatabase.length / chunkSize) | 0;
            const database = Array(++size);
            time.start('test37763');
            for (let i = 0, offset = 0; i < size; i++, offset += chunkSize) {
                database[i] = stringifiedDatabase.substr(offset, chunkSize);
            }
            const chunk = time.end('test37763');
            time.start('test37763');
            const databaseLength = database.length;
            let entities = overworld.getEntitiesAtBlockLocation({ x, y: -64, z });
            const entitiesLength = (entities ?? []).length;
            const difference = databaseLength - entitiesLength;
            // content.warn({ difference });
            for (let i = 0; i < Math.abs(difference); i++) {
                if (getSign(difference) === 1) {
                    overworld.spawnEntity('patches:database', { x, y: -64, z });
                }
                else {
                    entities[0].triggerEvent('patches:kill');
                }
            }
            const entityCorrect = time.end('test37763');
            let entitySet;
            time.start('test37763');
            entities = overworld.getEntitiesAtBlockLocation({ x, y: -64, z });
            if (entities.length) {
                entities.forEach((entity, i) => {
                    entity.nameTag = database[i];
                    removeAllTags(entity);
                    entity.addTag(`dbOrder:${i}`);
                    entity.addTag(`dbName:${name}`);
                });
                entitySet = time.end('test37763');
            }
            else {
                throw new Error(`Database: ${name}, does not exist`);
            }
            // content.warn({ t: 'databaseSAavebej', stringify, chunk, entityCorrect, entitySet });
        }
    }
    /**
     * @method saveAll savees all databases to respective structures
     */
    saveAll() {
        Object.keys(this.data).forEach((name) => {
            this.save(name);
        });
    }
    /**
     * @method queueSave saves the database in a queue for better performace in ticked saves
     * @param {String} name Database name
     */
    queueSave(name) {
        if (this.data[name]) {
            if (!this.__queuedSaves.some(item => item === name)) {
                this.__queuedSaves.push(name);
            }
        }
        else {
            throw new Error(`Database: ${name}, does not exist`);
        }
    }
    /**
     * @method queueSave saves all databases in a queue for better performace in ticked saves
     */
    queueSaveAll() {
        this.__queuedSaves.push(...Object.keys(this.data).filter(databaseName => !this.__queuedSaves.some(saveName => saveName === databaseName)));
    }
}
const databases = new Databases();
export default databases;
//# sourceMappingURL=database.js.map