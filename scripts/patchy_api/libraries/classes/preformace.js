import { world } from "@minecraft/server";
const content = {
	warn(...messages) {
		console.warn(messages.map(message => JSON.stringify(message, (key, value) => (value instanceof Function) ? '<f>' : value)).join(' '));
	}
};
import time from "./time.js";
class Preformance {
	constructor() {
		this.timeId = 0;
		this.times = {};
	}
	/**
	 * @method test
	 * @param {{[key: String]: (params: any) => {}}} preformanceTests
	 * @param {Number} testNumber
	 */
	test(preformanceTests, testNumber, ...argumentsToPass) {
		const id = this.timeId++;
		const timeId = `Preformance*${id}`;

		this.times[id] = {};
		this.times[id].times = {};
		this.times[id].testNumber = testNumber;
		Object.entries(preformanceTests).forEach(([key, testFunction]) => {
			this.times[id].times[key] = {};

			time.start(`${timeId}*${key}`);
			for (let i = 0; i < testNumber; i++) {
				testFunction;
			}
			this.times[id].times[key].base = time.end(`${timeId}*${key}`);
			time.start(`${timeId}*${key}`);
			for (let i = 0; i < testNumber; i++) {
				testFunction(...argumentsToPass);
			}
			this.times[id].times[key].total = time.end(`${timeId}*${key}`);
			time.end(`${timeId}*${key}`);
		});
		return id;
	};
	/**
	 * @method print
	 * @param {Number} id 
	 * @param {String} title 
	 * @param {Boolean} shouldContentLog 
	 */
	print(id, title = 'test', shouldContentLog = false) {
		const { testNumber } = this.times[id];
		if (shouldContentLog) return content.warn(this.times[id]);
		const string = [`${id} - ${title}\n  interationsPerTest: ${testNumber}`, ...Object.entries(this.times[id].times).map(([key, { base, total }]) => `  ${key}:\n    total: ${total} ms\n    true: ${total - base} ms\n    perIteration: ${(((total - base) / testNumber)).toFixed(4)} ms`)].join('\n');
		world.say(string);
	};
}
const preformance = new Preformance();
export default preformance;