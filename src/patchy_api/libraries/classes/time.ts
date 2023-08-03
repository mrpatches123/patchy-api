class Time {
  constructor() {

  }
  /**
   * @method start begin counting on the stored key
   * @param {String} key 
   */
  start(key) {
    this[key] = this.now();
  }
  /**
   * @method end end the counting on the stored key and returns the final value
   * @param {String} key 
   * @returns {Number}
   */
  end(key) {
    const time = this.get(key);
    delete this[key];
    return time;
  }
  /**
   * @method get returns the current value stored on the counting key
   * @param {String} key 
   * @returns {Number}
   */
  get(key) {
    return Number(this.now() - this[key]);
  }
  /**
   * @method now Data.now() fix worthless
   * @param {String} key 
   * @returns {Number}
   */
  now() {
    return (new Date()).getTime();
  }
}

const time = new Time();
export default time;