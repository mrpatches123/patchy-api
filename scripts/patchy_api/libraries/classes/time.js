class Time {
  constructor() {

  }
  start(key) {
    this[key] = this.now();
  }
  end(key) {
    const time = this.get(key);
    delete this[key];
    return time;
  }
  get(key) {
    return this.now() - this[key];
  }
  now() {
    return (new Date()).getTime();
  }
}

const time = new Time();
export default time;