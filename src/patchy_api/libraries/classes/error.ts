import { content, server, native } from '../utilities.js';

class ErrorLogger {
    [key: string]: any;
    constructor() {

    }
    // save(error: any, stack: string, event: string, key: string) {

    //     error = error.message;
    //     content.warn('save');
    //     if (!this[key]) {
    //         this[key] = [];
    //     }
    //     const index = this[key].findIndex(({ error: errorC, stack: stackC, event: eventC }) => errorC === error && stackC === stack && eventC === event);
    //     if (index > -1) {
    //         this[key][index].count++;
    //     } else {
    //         this[key].push({ error: error, stack, event, count: 1 });
    //     }
    // }
    log(error: any, stack: string, infoObject: { event?: string, key?: string; }, save = Boolean(server.scoreTest('error', 'save'))) {
        if (server.scoreTest('error', 'log') ?? 1) {
            this.logConsole(error, stack, infoObject, save);
        } else {
            this.logChat(error, stack, infoObject, save);
        }
    }
    logChat(error: any, stack: string, { event = 'unkown', key = 'unkown' } = {}, save?: boolean) {
        if (save) {
            this.save(error, stack, event, key);
        }
        server.tellraw(`Error in event: ${event} with Key: ${key}: ${error.message ?? error} - ${stack}`);
    }
    logConsole(error: any, stack: string, { event = 'unkown', key = 'unkown' } = {}, save: boolean) {
        if (save) {
            this.save(error, stack, event, key);
        }
        console.warn(`Error in event: ${event} with Key: ${key}: ${error.message ?? error} - ${stack}`);

    }
}
const errorLogger = new ErrorLogger();
export default errorLogger;


