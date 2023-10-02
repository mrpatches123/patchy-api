import { system, world } from '@minecraft/server';
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
    }
    has(key) {
        if (!key)
            throw new Error('argument zero must be a key');
        return key in this;
    }
    set(key, value) {
        if (!key)
            throw new Error('argument zero must be a key');
        if (!value)
            throw new Error('Argument one must have a value for the key');
        if (key === '__db_properties')
            throw new Error('Key must not be "__db_properties"');
        this[key] = value;
        return this;
    }
    /**
     * @method get gets the value for the key from the Database
     * @param {String} key key for value.
     * @returns {any} value for key
     */
    get(key) {
        if (typeof key !== 'number' && typeof key !== 'string')
            throw new Error('argument zero must be a key');
        if (key === '__db_properties')
            throw new Error('Key must not be "__db_properties"');
        if (key in this)
            return this[key];
    }
    /**
     * @method delete deletes a keys and its value from the Database
     * @param {String} name Database name
     */
    delete(key) {
        if (!key)
            throw new Error('argument zero must be a key');
        if (key === '__db_properties')
            throw new Error('Key must not be "__db_properties"');
        delete this[key];
    }
    /**
     * @method clear remove all entires on the Database
     * @param {String} key Command Data.
     */
    clear() {
        Object.keys(this).filter(key => key !== '__db_properties').forEach(key => delete this[key]);
    }
}
const chunkLength = 32760;
class Databases {
    constructor() {
        this.memory = {};
        this.saveQueue = [];
        this.subscribedSaveQueue = false;
    }
    /**
     * @method get
     * @param {String}databaseName
     */
    get(databaseName) {
        const objective = world.scoreboard.getObjective('sbDB:' + databaseName);
        if (!objective)
            return;
        if (this.memory[databaseName])
            return this.memory[databaseName];
        const participants = objective.getParticipants();
        const rawData = participants.map(({ displayName }) => [Number(displayName.match(/\d+/)[0]), displayName.replace(/\d+:/, '')]).sort(([a], [b]) => b - a).map(([, data]) => data).join('');
        console.warn(rawData);
        const database = JSON.parse(rawData);
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
        if (!objective)
            world.scoreboard.addObjective('sbDB:' + databaseName, 'sbDB:' + databaseName);
        if (this.memory[databaseName])
            return this.memory[databaseName];
        this.memory[databaseName] = new Database();
        return this.memory[databaseName];
    }
    /**
     * @method save
     * @param {String} databaseName
     */
    save(databaseName) {
        const objective = world.scoreboard.getObjective('sbDB:' + databaseName);
        if (!this.memory[databaseName])
            throw new Error(`databaseName: }
		${databaseName}, at params[0], does not exist!`);
        const rawData = JSON.stringify(this.memory[databaseName]);
        objective.getParticipants().forEach(participant => objective.removeParticipant(participant));
        chunkString(rawData, chunkLength).map((chunk, i) => i + ':' + chunk).forEach(chunk => objective.setScore(chunk, 0));
    }
    /**
     * @method subscribeSaveQueue
     * @private
     */
    subscribeSaveQueue() {
        if (this.subscribedSaveQueue)
            return;
        this.subscribedSaveQueue = true;
        this.runSaveQueue();
    }
    /**
     * @method runSaveQueue
     * @private
     */
    async runSaveQueue() {
        const rerun = await new Promise((resolve) => system.run(async () => {
            if (!this.saveQueue.length)
                return resolve(false);
            ;
            this.savePromise(this.saveQueue.shift());
            resolve(true);
        }));
        if (!rerun)
            return;
        this.runSaveQueue();
    }
    /**
    * @method savePromise
    * @param {string} databaseName
    */
    async savePromise(databaseName) {
        try {
            await new Promise((resolve) => {
                this.save(databaseName);
                resolve(void 0);
            });
        }
        catch (error) {
            console.warn(error, error.stack);
        }
    }
    /**
     * @method queueSave
     * @param {string} databaseName
     * @returns {boolean}
     */
    queueSave(databaseName) {
        if (this.saveQueue.includes(databaseName))
            return false;
        this.saveQueue.push(databaseName);
        this.subscribeSaveQueue();
        return true;
    }
    /**
     * @method forget
     * @param {string}databaseName
     */
    forget(databaseName) {
        if (this.memory[databaseName])
            delete this.memory[databaseName];
    }
    /**
     * @method remove
     * @param {String}databaseName
     */
    remove(databaseName) {
        if (this.memory[databaseName])
            delete this.memory[databaseName];
        world.scoreboard.removeObjective('sbDB:' + databaseName);
    }
}
const databases = new Databases();
export default databases;
//# sourceMappingURL=scoreboard_database.js.map