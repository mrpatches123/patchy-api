import { world } from '@minecraft/server';
export function chunkString(str, length) {
    let size = (str.length / length) | 0;
    const array = Array(++size);
    for (let i = 0, offset = 0; i < size; i++, offset += length) {
        array[i] = str.substr(offset, length);
    }
    return array;
}
export class Database {
    constructor(json = {}) {
        Object.assign(this, json);
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
const chunkLength = 32760
class Databases {
	constructor () {
		this.memory = {};
	}
	/**
     * @method get
     * @param {String}databaseName
     */
	get(databaseName) {
		const objective = world.scoreboard.getObjective('sbDB:' + databaseName);
		if (!objective) return;
		if (this.memory[databaseName]) return this.memory[databaseName];
		const participants = objective.getParticipants();
		const rawData = participants.map(({displayName}) => [Number(displayName.match(/\d+/)[0]), displayName.replace(/\d+:/, '')]).sort(([a],[b]) => b - a).map(([,data]) => data).join('');
		console.warn(rawData);
		const database = JSON.parse(rawData)
		this.memory[databaseName] = new Database(database);
		return this.memory[databaseName];
	}
	/**
     * @method add
     * @param {String}databaseName
     */
	add(databaseName) {
		console.warn(databaseName);
		const objective = world.scoreboard.getObjective('sbDB:' + databaseName);
		if (!objective) world.scoreboard.addObjective('sbDB:' + databaseName, 'sbDB:' + databaseName);
		if (this.memory[databaseName]) return this.memory[databaseName];
		this.memory[databaseName] = new Database();
		return this.memory[databaseName];
	}
	/**
     * @method save
     * @param {String}databaseName
     */
	save(databaseName) {
		const objective = world.scoreboard.getObjective('sbDB:' + databaseName);
		if (!this.memory[databaseName]) throw new Error(`databaseName: }
		${databaseName}, at params[0], does not exist!`);
		const rawData = JSON.stringify(this.memory[databaseName]);
		objective.getParticipants().forEach(participant => objective.removeParticipant(participant))
		chunkString(rawData,chunkLength).map((chunk, i) => i + ':' + chunk).forEach(chunk => objective.setScore(chunk,0));
	}
	/**
     * @method forget
     * @param {String}databaseName
     */
	forget(databaseName) {
	if (this.memory[databaseName]) delete this.memory[databaseName];
	}
	/**
     * @method remove
     * @param {String}databaseName
     */
	remove(databaseName) {
	if (this.memory[databaseName]) delete this.memory[databaseName];
	world.scoreboard.removeObjective('sbDB:' + databaseName);
	}
}

const databases = new Databases();
export default databases;
