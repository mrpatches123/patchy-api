export declare function chunkString(str: string, length: number): string[];
export declare class Database {
    [key: string]: any;
    constructor(json?: {});
    has(key: string): boolean;
    set(key: string, value: any): this;
    /**
     * @method get gets the value for the key from the Database
     * @param {String} key key for value.
     * @returns {any} value for key
     */
    get(key: string): any;
    /**
     * @method delete deletes a keys and its value from the Database
     * @param {String} name Database name
     */
    delete(key: string): void;
    /**
     * @method clear remove all entires on the Database
     * @param {String} key Command Data.
     */
    clear(): void;
}
declare class Databases {
    memory: Record<string, Database>;
    saveQueue: string[];
    subscribedSaveQueue: boolean;
    /**
     * @method get
     * @param {String}databaseName
     */
    get(databaseName: string): Database | undefined;
    /**
     * @method add
     * @param {String}databaseName
     */
    add(databaseName: string): Database | undefined;
    /**
     * @method save
     * @param {String} databaseName
     */
    save(databaseName: string): void;
    /**
     * @method subscribeSaveQueue
     * @private
     */
    subscribeSaveQueue(): void;
    /**
     * @method runSaveQueue
     * @private
     */
    runSaveQueue(): Promise<void>;
    /**
    * @method savePromise
    * @param {string} databaseName
    */
    savePromise(databaseName: string): Promise<void>;
    /**
     * @method queueSave
     * @param {string} databaseName
     * @returns {boolean}
     */
    queueSave(databaseName: string): boolean;
    /**
     * @method forget
     * @param {string}databaseName
     */
    forget(databaseName: string): void;
    /**
     * @method remove
     * @param {String}databaseName
     */
    remove(databaseName: string): void;
}
declare const databases: Databases;
export default databases;
