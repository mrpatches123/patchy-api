import { Entity, Player, Vector3, World } from "@minecraft/server";
export declare function isDefined(input: any): boolean;
export declare function isVector3<T>(target: T): boolean;
declare class PropertyManager {
    storage: Record<string, DynamicPropertiesForInstance>;
    private subscribedEvents;
    private subscribeEvents;
    get(instance?: Player | Entity | World): DynamicPropertiesForInstance;
}
declare const propertyManager: PropertyManager;
export default propertyManager;
export interface PropertiesCache {
    json?: Record<string, any>;
    string?: Record<string, string | undefined>;
    number?: Record<string, number | undefined>;
    boolean?: Record<string, boolean | undefined>;
    vector3?: Record<string, Vector3 | undefined>;
}
export declare class DynamicPropertiesForInstance {
    instance: Player | Entity | World;
    id: string;
    cache?: PropertiesCache;
    constructor(instance?: Player | Entity | World);
    /**
     * cannot set JSON. It is for old things
     */
    setAny<T>(identifer: string, value: T): this | undefined;
    /**
     * cannot get JSON. It is for old things
     */
    getAny<T extends string | number | Vector3 | boolean>(identifer: string): T | undefined;
    getJSON<T>(identifer: string): T | undefined;
    setJSON(identifer: string, value?: any): this;
    get jsons(): Record<string, any>;
    getString(identifer: string): string | undefined;
    setString(identifer: string, value?: string): this;
    get strings(): Record<string, string | undefined>;
    getNumber(identifer: string): number | undefined;
    setNumber(identifer: string, value?: number): this;
    get numbers(): Record<string, number | undefined>;
    getBoolean(identifer: string): boolean | undefined;
    setBoolean(identifer: string, value?: boolean): this;
    get booleans(): Record<string, boolean | undefined>;
    getVector3(identifer: string): Vector3 | undefined;
    setVector3(identifer: string, value?: Vector3): this;
    get vector3s(): Record<string, Vector3 | undefined>;
}
