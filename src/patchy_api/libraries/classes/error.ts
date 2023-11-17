import { world } from '@minecraft/server';
import { content, server, native } from '../utilities.js';

class ErrorLogger {
    errors: Record<string, Record<string, Record<string, number>>> = {};
    constructor() {

    }
    save(error: any, stack: string | undefined, event = 'unkown', key = 'unkown') {

        error = error.message;
        const errorKey = `${error} - ${stack}`;
        content.warn('save');
        this.errors[event] ??= {};
        this.errors[event]![key]! ??= {};
        this.errors[event]![key]![errorKey] ??= 0;
        this.errors[event]![key]![errorKey]++;
    }
    log(error: any, stack: string, infoObject: { event?: string, key?: string; }, save = Boolean(server.scoreTest('error', 'save'))) {
        if (server.scoreTest('error', 'log')) {
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


