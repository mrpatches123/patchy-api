import { system, world } from "@minecraft/server";
const content = {
	warn(...messages: any[]) {
		console.warn(messages.map(message => JSON.stringify(message, (key, value) => (value instanceof Function) ? '<f>' : value)).join(' '));
	}
};
import time from "./time.js";
type DeepUnPartial<T> = T extends object ? {
	[P in keyof T]: DeepUnPartial<T[P]>;
} : T;
class Preformance {
	timeId: number = 0;
	times: { [id: number]: { times?: { [key: string]: { total?: number, base?: number; }; }, testNumber?: number; }; } = {};
	tickId: number = 0;
	ticks: { [id: number]: { ticks?: { [key: string]: { total?: number, base?: number; }[]; }, numberOfTicks?: number, testNumber?: number; }; } = {};
	/**
	 * @method test
	 * @param {} preformanceTests
	 * @param {Number} testNumber
	 */
	test(preformanceTests: { [key: string]: (...params: any[]) => any; }, testNumber: number, ...argumentsToPass: any[]) {
		const id = this.timeId++;
		const timeId = `Preformance*${id}`;

		this.times[id] = {};
		this.times[id]!.times = {};
		this.times[id]!.testNumber = testNumber;
		Object.entries(preformanceTests).forEach(([key, testFunction]) => {
			this.times[id]!.times![key] = {};

			time.start(`${timeId}*${key}`);
			for (let i = 0; i < testNumber; i++) {
				testFunction;
			}
			this.times[id]!.times![key]!.base = time.end(`${timeId}*${key}`);
			time.start(`${timeId}*${key}`);
			for (let i = 0; i < testNumber; i++) {
				testFunction(...argumentsToPass);
			}
			this.times[id]!.times![key]!.total = time.end(`${timeId}*${key}`);
		});
		return id;
	};
	tickTest(preformanceTests: { [key: string]: (...params: any[]) => {}; }, testNumber: number, numberOfTicks: number = 10, ...argumentsToPass: any[]) {
		let i = 0;
		const id = this.tickId++;
		this.ticks[id] = {};
		this.ticks[id]!.ticks = {};
		this.ticks[id]!.testNumber = testNumber;
		this.ticks[id]!.numberOfTicks = numberOfTicks;
		const systemRunId = system.runInterval(() => {
			if (i++ > numberOfTicks) return (system.clearRun(systemRunId), this.printTick(id));
			const testId = this.test(preformanceTests, testNumber, ...argumentsToPass);
			const { times = {} } = this.getTime(testId) ?? {};
			Object.entries(times).forEach(([key, time]) => {
				this.ticks[id]!.ticks![key] ??= [];
				this.ticks[id]!.ticks![key]!.push(time);
			});

			delete this.times[testId];
		});
	};
	printTick(id: number, title = 'test', shouldContentLog = false) {
		const { testNumber, numberOfTicks, ticks = {} } = this.ticks[id] ?? {};
		const newTicks = {} as { [key: string]: { base: number, total: number; }; };
		content.warn(ticks);
		Object.entries(ticks).forEach(([key, value]) => {
			newTicks[key] = {
				base: ticks[key]!.reduce((s, { base = 0 }) => base + s, 0) / ticks[key]!.length,
				total: ticks[key]!.reduce((s, { total = 0 }) => total + s, 0) / ticks[key]!.length
			};
		});
		if (shouldContentLog) return content.warn(newTicks);

		const string = [`${id} - ${title}\n  interationsPerTest: ${testNumber}\n  numberOfTicks: ${numberOfTicks}`, ...Object.entries(newTicks).map(([key, { base, total }]) => `  ${key}:\n    total: ${total} ms\n    true: ${total - base} ms\n    perIteration: ${(((total - base) / testNumber!)).toFixed(4)} ms`)].join('\n');
		world.sendMessage(string);
	};
	getTime(id: number): DeepUnPartial<Preformance['times'][number]> {
		return this.times[id]!;
	}
	printTime(id: number, title = 'test', shouldContentLog = false) {
		const { testNumber } = this.times[id] ?? {};
		if (shouldContentLog) return content.warn(this.times[id]);
		const string = [`${id} - ${title}\n  interationsPerTest: ${testNumber}`, ...Object.entries(this.times![id]!.times!).map(([key, { base = 0, total = 0 }]) => `  ${key}:\n    total: ${total} ms\n    true: ${total - base} ms\n    perIteration: ${(((total - base) / testNumber!)).toFixed(4)} ms`)].join('\n');
		world.sendMessage(string);
	};
}
const preformance = new Preformance();
export default preformance;