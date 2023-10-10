export declare class Database {
    __db_properties: any;
    [key: string | number]: any;
    constructor(json?: Record<string | number, any>);
    /**
     * @method set set a keys for its value in the Database
     * @param {String} key key for value.
     * @param {any} value value for key.
     * @returns {Database} this
     */
    set(key: string | number, value: any): this;
    get(key: string | number): any;
    delete(key: string | number): this;
    clear(): this;
    has(key: string | number): boolean;
}
export declare class Databases {
    __queuedSaves: string[];
    data: Record<string, Database>;
    /**
     * @method initialize starts the database
     * @returns {void}
     */
    initialize(): void;
    _getRandCoords(): {
        x: Number;
        z: Number;
    };
    getPropertiesObject(): {
        coords: {
            x: Number;
            z: Number;
        };
    };
    add(name: string): Database;
    /**
         * @method getFromMemory gets a database on Databases from memory
         * @param {String} name Database name
         * @returns {Database} this[name]
         */
    getFromMemory(name: string): Database | undefined;
    get(name: string): Database | undefined;
    getFromEntity(name: string): string | undefined;
    delete(name: string, removeEntity?: boolean): void;
    deleteAll(): void;
    /**
     * @method save saves the database to a structure file
     * @param {String} name Database name
     */
    save(name: string): void;
    /**
     * @method saveAll savees all databases to respective structures
     */
    saveAll(): void;
    /**
     * @method queueSave saves the database in a queue for better performace in ticked saves
     * @param {String} name Database name
     */
    queueSave(name: string): void;
    /**
     * @method queueSave saves all databases in a queue for better performace in ticked saves
     */
    queueSaveAll(): void;
}
declare const databases: Databases;
export default databases;
