class Time {
  [key: string]: number | Function;
  start(key: string) {
    this[key] = this.now();
  }
  /**
   * @method end end the counting on the stored key and returns the final value
   * @param {String} key 
   * @returns {Number}
   */
  end(key: string): number {
    const time = this.get(key);
    delete this[key];
    return time;
  }
  /**
   * @method get returns the current value stored on the counting key
   * @param {String} key 
   * @returns {Number}
   */
  get(key: string): number {
    return Number(this.now() - (this[key] as number));
  }
  /**
   * @method now Data.now() fix worthless
   * @param {String} key 
   * @returns {Number}
   */
  now(): number {
    return (new Date()).getTime();
  }
}

const time = new Time();
export default time;