import { BlockAreaSize, world, Entity } from "@minecraft/server";
import { overworld, nether, end, content, native } from '../utilities.js';
import time from "./time.js";
// const overworld = world.getDimension('overworld');
const chunkSize = 32763;
// import { compress, decompress } from '../zip_255cs.js';


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
        if (!key) {
            throw new Error('argument zero must be a key');
        } else if (!value) {
            throw new Error('Argument one must have a value for the key');
        } else if (key === '__db_properties') {
            throw new Error('Key must not be "__db_properties"');
        } else {

            this[key] = value;
            // content.warn({ t: 'DatabaseSet', [key]: value, databases });
            return this;
        }

    }
    /**
     * @method get gets the value for the key from the Database
     * @param {String} key key for value.
     * @returns {any} value for key
     */
    get(key) {
        if (typeof key !== 'number' && typeof key !== 'string') {
            throw new Error('argument zero must be a key');
        } else if (key === '__db_properties') {
            throw new Error('Key must not be "__db_properties"');
        } else {
            if (this[key]) {
                return this[key];
            } else {
                return undefined;
            }
        }
    }
    /**
     * @method delete deletes a keys and its value from the Database
     * @param {String} name Database name
     */

    delete(key) {
        if (!key) {
            throw new Error('argument zero must be a key');
        } else if (key === '__db_properties') {
            throw new Error('Key must not be "__db_properties"');
        } else {
            delete this[key];
        }
    }
    /**
     * @method clear remove all entires on the Database
     * @param {String} key Command Data.
     */
    clear() {
        Object.keys(this).filter(key => key !== '__db_properties').forEach(key => delete this[key]);
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
Array.prototype.random = function () {
    return this[~~(Math.random() * this.length)];
};
// getNewRange(0, 0, 15, 15);
// function getRandCoord() {
//     return Array(256).fill('')
//         .map((item, i) => ({ x: i % 16, z: Math.floor(i / 16) % 16 }))
//         .filter(item => !existingCoords.some(coord => coord.x === item.x && coord.z === item.z)).random();
// }
//
const coords256 = Array.from(Array(256), (item, i) => ({ x: i % 16, z: Math.floor(i / 16) % 16 }));

const databasesArea = new BlockAreaSize(16, 1, 16);
export class Databases {
    constructor() {
        this.__queuedSaves = [];
    }
    /**
     * @method initialize starts the database
     * @returns {void}
     */
    initialize() {

        const entityArray = [];
        /**
         * @type Array<Entity>
         */
        const entities = [...overworld.getEntities({ type: 'patches:database' })];
        // content.warn({ entities: entities.length });
        entities.forEach(entity => {
            let { location } = entity;
            const { x, z } = location;
            const index = entityArray.findIndex(([fx, fz]) => fx === x && fz === z);
            if (index !== -1) {
                entityArray[index].push(entity);
            } else {
                entityArray.push([x, z, entity]);
            }

        });
        entityArray.forEach(entities => {
            time.start('databaseInitTest');
            entities = entities.splice(2).filter(entity => entity);
            const json = [];
            if (entities) {
                const name = entities[0].getTags().find(tag => tag.includes('dbName:')).replace('dbName:', '');
                // content.warn({ dbNmae: name });
                entities.forEach(entity => {
                    const order = entity.getTags().find(tag => tag.includes('dbOrder:')).replace('dbOrder:', '');
                    json.push([order, entity.nameTag]);
                });
                if (name) {
                    this[name] = new Database(JSON.parse(json.sort((a, b) => a[0] - b[0]).map(([a, b]) => b).join('')));
                    // content.warn({ [name]: this[name] });
                }
                // content.warn({ name, gettime: time.end('databaseInitTest'), length: JSON.stringify(this[name]).length });
            }

        });
        // content.warn({ this: this });
        // content.warn(this.get('requestsAPI'));
    }
    /**
     * @method getRandCoord get a random coordinates from 0,0 to 15,15
     * @returns {{x:Number,z:Number}}
     */
    _getRandCoords() {
        return coords256.filter(({ x, z }) => !(this ?? {}).some((key, { __db_properties: { coords: { x: ex, z: ez } = {} } = {} }) => x === ex && z === ez)).random();
    }
    getPropertiesObject() {
        return { coords: this._getRandCoords()/*, saveTicks: (Object.keys(this).length + 1) * 2 */ };
    }
    /**
     * @method add adds a database on Databases
     * @param {String} name Database name
     * @returns {Database} this
     */
    add(name) {
        if (!name) {
            throw new Error('must input Database name');
        } else if (this[name]) {
            throw new Error(`Database: ${name}, exists`);
        } else {
            const propertiesObject = this.getPropertiesObject();
            // content.chatFormat('prop', propertiesObject);
            this[name] = new Database({ __db_properties: propertiesObject });

            // overworld.runCommandAsync(`say db ${JSON.stringify(this[name])}`);
            return this[name];
        }
    }

    /**
         * @method getFromMemory gets a database on Databases from memory
         * @param {String} name Database name
         * @returns {Database} this[name]
         */
    getFromMemory(name) {
        if (!name) {
            throw new Error('must input Database name');
        } else if (this[name]) {
            return this[name];
        } else {
            return undefined;
        }
    }
    /**
    * @method get gets a database on Databases
      * @param {String} name Database name
      * @returns {Database} this[name]
      */
    get(name) {
        if (!name) {
            throw new Error('must input Database name');
        } else if (this[name]) {
            return this[name];
        } else {
            return undefined;
        }
    }

    /**
    * @method getFromEntity gets a database directly from the entity
      * @param {String} name Database name
      * @returns {Database} this[name]
      */
    getFromEntity(name) {
        if (!name) {
            throw new Error('must input Database name');
        } else {
            const { __db_properties: propertiesObject = {} } = this[name] ?? {};
            const { coords } = propertiesObject;
            // content.warn({ propertiesObject });
            if (!coords) { return; }
            let entities = overworld.getEntitiesAtBlockLocation({ x: coords.x, y: -64, z: coords.z });
            // content.warn({ entities: entities.map(({ nameTag }) => nameTag) });
            if (entities.length) {
                entities = entities.filter(({ typeId }) => typeId === 'patches:database');
                const name = entities[0].getTags().find(tag => tag.includes('dbName:')).replace('dbName:', '');
                const json = [];
                entities.forEach(entity => {
                    const order = entity.getTags().find(tag => tag.includes('dbOrder:')).replace('dbOrder:', '');
                    json.push([order, entity.nameTag]);
                });
                const string = (json.sort((a, b) => a[0] - b[0]).map(([a, b]) => b).join(''));
                // content.warn({ string });
                return string;
            } else {
                return undefined;
            }
        }
    }
    /**
     * @method delete delete a database from Databases
     * @param {String} name Database name
     */
    delete(name, removeEntity = false) {
        if (removeEntity) {
            const { __db_properties: propertiesObject = {} } = this[name] ?? {};
            const { coords } = propertiesObject;
            // content.warn({ propertiesObject });
            if (!coords) { return; }
            const entities = overworld.getEntitiesAtBlockLocation({ x: coords.x, y: -64, z: coords.z });
            entities.forEach(entity => (entity.triggerEvent('patches:kill')));
        }
        delete this[name];
    }
    /**
     * @method deleteAll deletes all databases from Databases
     * @param {String} name Database name
     */
    deleteAll() {
        this.forEach((name) => {
            this.delete(name);
        });
    }
    /**
     * @method save saves the database to a structure file
     * @param {String} name Database name
     */
    save(name) {
        //console.warn(name);
        const { x, z } = this[name].__db_properties['coords'];
        if (x && z && this[name]) {
            console.warn(x, z);
            time.start('test37763');
            const stringifiedDatabase = (JSON.stringify(this[name]));
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
            for (let i = 0; i < difference.abs(); i++) {
                if (difference.getSign() === 1) {
                    overworld.spawnEntity('patches:database', { x, y: -64, z });
                } else { entities[0].triggerEvent('patches:kill'); }
            }
            const entityCorrect = time.end('test37763');
            let entitySet;
            time.start('test37763');
            entities = overworld.getEntitiesAtBlockLocation({ x, y: -64, z });
            if (entities.length) {
                entities.forEach((entity, i) => {
                    entity.nameTag = database[i];
                    entity.removeAllTags();
                    entity.addTag(`dbOrder:${i}`);
                    entity.addTag(`dbName:${name}`);
                });
                entitySet = time.end('test37763');
            } else {
                throw new Error(`Database: ${name}, does not exist`);
            }
            // content.warn({ t: 'databaseSAavebej', stringify, chunk, entityCorrect, entitySet });
        }
    }
    /**
     * @method saveAll savees all databases to respective structures
     */
    saveAll() {
        this.forEach((name) => {
            this.save(name);
        });
    }
    /**
     * @method queueSave saves the database in a queue for better performace in ticked saves
     * @param {String} name Database name
     */
    queueSave(name) {
        if (this[name]) {
            if (!this.__queuedSaves.some(item => item === name)) {
                this.__queuedSaves.push(name);
            }
        } else {
            throw new Error(`Database: ${name}, does not exist`);
        }

    }
    /**
     * @method queueSave saves all databases in a queue for better performace in ticked saves
     */
    queueSaveAll() {
        this.__queuedSaves.push(Object.keys(this).filter(databaseName => !this.__queuedSaves.some(saveName => saveName === databaseName)));
    }


}
const databases = new Databases();
export default databases;


