interface watchOptions {
    removeKey: boolean;
    eventKeys: Array<string>;
}
declare class RequestBuilder {
    memory: Record<string, Record<string, Record<string, Record<string, any>>>>;
    constructor();
    addMemory(id: string, key: string, target: string, type: string, value: any): void;
    /**
     *
     * @param {string} target
     * @param {Array<string>} keys
     * @param {boolean} isArray
     */
    getMemoryTarget<T>(id: string, target: string, keys: string[], type: string, isArray?: boolean): Record<string, Record<string, Record<string, T>>> | undefined;
    removeMemory(id: string, key: string, target: string, type: string): void;
    /**
     * @method add addes a request to a Centralised Entity Database
     * @param {String | Number} id
     * @param {String | Number} key
     * @param {String | Number} target
     * @param {String | Number} type
     * @param {any} value
     */
    add(id: string | number, key: string | number, target: string | number, type: string | number, value: any): void;
    /**
     * @method watch watches callbacks for a true return
     * @param {String} id
     * @param {(key: String, target: String, type: String, value: any) => {}} testCallback
     * @param {(key: String, target: String, type: String, value: any) => {}} findCallback
     * @param {watchOptions} options
     */
    watch(id: string, testCallback?: (key: string, target: string, type: string, value: any) => boolean | void, findCallback?: (key: string, target: string, type: string, value: any) => boolean | void, options?: watchOptions): void;
    /**
     * @method terminate removes watch for a request id
     * @param {String} id
     */
    terminate(id: string): void;
    /**
     *
     * @param {String | Number} id
     * @param {String | Number} key
     * @param {String | Number} target
     * @param {String | Number} type
     */
    remove(id: string | number, key: string | number, target: string | number, type: string | number): void;
}
declare const requestBuilder: RequestBuilder;
export default requestBuilder;
