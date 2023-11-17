import { Entity, Player } from "@minecraft/server";
export declare function isDefined<T>(input: T): boolean;
export declare function chunkString(str: string, length: number): string[];
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
export declare class ProperyDatabases {
    databases: Record<string | number, Database>;
    queueSaves: [string | number, Entity | undefined][];
    forgetScheduled: Record<string | number, [number, boolean]>;
    subscribedQueueSave: boolean;
    private subsribeQueueSave;
    getFor(key: string | number, entity?: Player | Entity, duration?: number): Database | undefined;
    forget(key: string | number, entity?: Player | Entity): void;
    /**
     * @method getUnCached get a Database without caching it you cannot create a new Database with this method
     */
    getUnCached(key: string | number, entity?: Player | Entity): Database | undefined;
    get(key: string | number, entity?: Player | Entity): Database | undefined;
    add(key: string | number, entity?: Player | Entity): Database;
    save(key: string | number, entity?: Player | Entity): void;
    delete(key: string | number, entity?: Player | Entity): void;
    queueSave(key: string | number, entity?: Player | Entity): void;
}
declare const databases: ProperyDatabases;
export default databases;
