type DeepUnPartial<T> = T extends object ? {
    [P in keyof T]: DeepUnPartial<T[P]>;
} : T;
declare class Preformance {
    timeId: number;
    times: {
        [id: number]: {
            times?: {
                [key: string]: {
                    total?: number;
                    base?: number;
                };
            };
            testNumber?: number;
        };
    };
    tickId: number;
    ticks: {
        [id: number]: {
            ticks?: {
                [key: string]: {
                    total?: number;
                    base?: number;
                }[];
            };
            numberOfTicks?: number;
            testNumber?: number;
        };
    };
    /**
     * @method test
     * @param {} preformanceTests
     * @param {Number} testNumber
     */
    test(preformanceTests: {
        [key: string]: (...params: any[]) => any;
    }, testNumber: number, ...argumentsToPass: any[]): number;
    tickTest(preformanceTests: {
        [key: string]: (...params: any[]) => {};
    }, testNumber: number, numberOfTicks?: number, ...argumentsToPass: any[]): void;
    printTick(id: number, title?: string, shouldContentLog?: boolean): void;
    getTime(id: number): DeepUnPartial<Preformance['times'][number]>;
    printTime(id: number, title?: string, shouldContentLog?: boolean): void;
}
declare const preformance: Preformance;
export default preformance;
