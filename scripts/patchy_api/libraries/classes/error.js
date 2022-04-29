import { content, server, native } from '../utilities.js';

class ErrorLogger {
    constructor() {

    }
    save(error, stack, event, key) {
        error = error.message;
        content.warn('save');
        if (!this[key]) {
            this[key] = [];
        }
        const index = this[key].findIndex(({ error: errorC, stack: stackC, event: eventC }) => errorC === error && stackC === stack && eventC === event);
        if (index > -1) {
            this[key][index].count++;
        } else {
            this[key].push({ error: error, stack, event, count: 1 });
        }
    }
    log(error, stack, infoObject, save = Boolean(server.scoreTest('error', 'save'))) {
        if (server.scoreTest('error', 'log') ?? 1) {
            this.logConsole(error, stack, infoObject, save);
        } else {
            this.logChat(error, stack, infoObject, save);
        }
    }
    logChat(error, stack, { event = 'unkown', key = 'unkown' } = {}, save) {
        if (save) {
            this.save(error, stack, event, key);
        }
        server.tellraw(`Error in event: ${event} with Key: ${key}: ${error.message} - ${stack}`);
    }
    logConsole(error, stack, { event = 'unkown', key = 'unkown' } = {}, save) {
        if (save) {
            this.save(error, stack, event, key);
        }
        console.warn(`Error in event: ${event} with Key: ${key}: ${error.message} - ${stack}`);

    }
}
const errorLogger = new ErrorLogger();
export default errorLogger;


