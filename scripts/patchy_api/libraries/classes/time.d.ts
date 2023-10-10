declare class Time {
    [key: string]: number | Function;
    start(key: string): void;
    /**
     * @method end end the counting on the stored key and returns the final value
     * @param {String} key
     * @returns {Number}
     */
    end(key: string): number;
    /**
     * @method get returns the current value stored on the counting key
     * @param {String} key
     * @returns {Number}
     */
    get(key: string): number;
    /**
     * @method now Data.now() fix worthless
     * @param {String} key
     * @returns {Number}
     */
    now(): number;
}
declare const time: Time;
export default time;
