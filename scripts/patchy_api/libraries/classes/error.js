import { content, server } from '../utilities.js';
class ErrorLogger {
    constructor() {
        this.errors = {};
    }
    save(error, stack, event = 'unkown', key = 'unkown') {
        error = error.message;
        const errorKey = `${error} - ${stack}`;
        content.warn('save');
        this.errors[event] ??= {};
        this.errors[event][key] ??= {};
        this.errors[event][key][errorKey] ??= 0;
        this.errors[event][key][errorKey]++;
    }
    log(error, stack, infoObject, save = Boolean(server.scoreTest('error', 'save'))) {
        if (server.scoreTest('error', 'log')) {
            this.logConsole(error, stack, infoObject, save);
        }
        else {
            this.logChat(error, stack, infoObject, save);
        }
    }
    logChat(error, stack, { event = 'unkown', key = 'unkown' } = {}, save) {
        if (save) {
            this.save(error, stack, event, key);
        }
        server.tellraw(`Error in event: ${event} with Key: ${key}: ${error.message ?? error} - ${stack}`);
    }
    logConsole(error, stack, { event = 'unkown', key = 'unkown' } = {}, save) {
        if (save) {
            this.save(error, stack, event, key);
        }
        console.warn(`Error in event: ${event} with Key: ${key}: ${error.message ?? error} - ${stack}`);
    }
}
const errorLogger = new ErrorLogger();
export default errorLogger;
//# sourceMappingURL=error.js.map