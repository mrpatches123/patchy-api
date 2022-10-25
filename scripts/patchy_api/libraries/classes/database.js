import { BlockAreaSize, BlockLocation, world } from "@minecraft/server";
import { overworld, nether, end, content, native } from '../utilities.js';
// const overworld = world.getDimension('overworld');
const chunkSize = 32763;
// import { compress, decompress } from '../zip_255cs.js';


export class Database {
    constructor(json = {}) {
        Object.assign(this, json);
        this.__db_properties = json.__db_properties ?? {};
    }
    /**
     * @method set set a keys for its value in the Database
     * @param {String} key key for value.
     * @param {any} value value for key.
     * @returns {Databases} this
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
        const entities = [...overworld.getEntities({ type: 'patches:database' })];
        content.warn({ entities: entities.length });
        entities.forEach(entity => {
            let { location } = entity;
            location = location.toBlockLocation();
            const { x, z } = location;
            const index = entityArray.findIndex(([fx, fz]) => fx === x && fz === z);
            if (index !== -1) {
                entityArray[index].push(entity);
            } else {
                entityArray.push([x, z, entity]);
            }

        });
        entityArray.forEach(entities => {

            entities = entities.splice(2).filter(entity => entity);
            const json = [];
            if (entities) {
                const name = entities[0].getTags().find(tag => tag.includes('dbName:')).replace('dbName:', '');
                entities.forEach(entity => {
                    const order = entity.getTags().find(tag => tag.includes('dbOrder:')).replace('dbOrder:', '');
                    json.push([order, entity.nameTag]);
                });
                if (name) {
                    this[name] = new Database(JSON.parse(json.sort((a, b) => a[0] - b[0]).map(([a, b]) => b).join('')));
                }
            }
        });
        // content.warn({ this: this });
    }
    /**
     * @method getRandCoord get a random coordinates from 0,0 to 15,15
     * @returns {{x:Number,z:Number}}
     */
    _getRandCoords() {
        return Array.from(Array(256), (item, i) => ({ x: i % 16, z: Math.floor(i / 16) % 16 }))
            .filter(({ x, z }) => !(this ?? {}).some((key, { __db_properties: { coords: { x: ex, z: ez } = {} } = {} }) => x === ex && z === ez)).random();
    }
    getPropertiesObject() {
        return { coords: this._getRandCoords()/*, saveTicks: (Object.keys(this).length + 1) * 2 */ };
    }
    /**
     * @method add adds a database on Databases
     * @param {String} name Database name
     * @returns {Databases} this
     */
    add(name) {
        if (!name) {
            throw new Error('must input Database name');
        } else if (this[name]) {
            throw new Error(`Database: ${name}, exists`);
        } else {
            const propertiesObject = this.getPropertiesObject();
            overworld.runCommand(`say 'prop', ${JSON.stringify(propertiesObject)}`);
            this[name] = new Database();
            Object.assign(this[name].__db_properties, propertiesObject);
            // overworld.runCommand(`say db ${JSON.stringify(this[name])}`);
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
            const propertiesObject = (this[name] ?? {}).__db_properties;
            const { coords = undefined } = propertiesObject ?? {};

            if (!coords) { return; }
            let entities = overworld.getEntitiesAtBlockLocation(new BlockLocation(coords.x, -64, coords.z));
            if (entities.length) {
                entities = entities.filter(({ id }) => id === 'patches:database');
                const name = entities[0].getTags().find(tag => tag.includes('dbName:')).replace('dbName:', '');
                const json = [];
                entities.forEach(entity => {
                    const order = entity.getTags().find(tag => tag.includes('dbOrder:')).replace('dbOrder:', '');
                    json.push([order, entity.nameTag]);
                });
                return (json.sort((a, b) => a[0] - b[0]).map(([a, b]) => b).join(''));
            } else {
                return undefined;
            }
        }
    }
    /**
     * @method delete delete a database from Databases
     * @param {String} name Database name
     */
    delete(name) {
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
            //console.warn(x, z);
            const stringifiedDatabase = (JSON.stringify(this[name]));
            //console.warn(stringifiedDatabase.length);
            //console.warn(stringifiedDatabase);
            const stringifiedDBLength = stringifiedDatabase.length;
            const database = Array.from(Array(Math.ceil(stringifiedDBLength / chunkSize)), (item, i) => stringifiedDatabase.substr(i * chunkSize, chunkSize));
            const databaseLength = database.length;
            let entities = overworld.getEntitiesAtBlockLocation(new BlockLocation(x, -64, z));
            const entitiesLength = (entities ?? []).length;
            const difference = databaseLength - entitiesLength;
            for (let i = 0; i < difference.abs(); i++) {
                if (difference.getSign() === 1) {
                    overworld.spawnEntity('patches:database', new BlockLocation(x, -64, z));
                } else { entities[0].triggerEvent('patches:kill'); }
            }
            entities = overworld.getEntitiesAtBlockLocation(new BlockLocation(x, -64, z));
            if (entities.length) {
                // databaseSplit.forEach((item) => console.warn(stringifiedDBLength, stringifiedDBLength / stringLength, stringLength, item.length));
                entities.forEach((entity, i) => {
                    entity.nameTag = database[i];
                    entity.removeAllTags();
                    entity.addTag(`dbOrder:${i}`);
                    entity.addTag(`dbName:${name}`);
                });
            } else {
                throw new Error(`Database: ${name}, does not exist`);
            }
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
let databases = new Databases();
export default databases;