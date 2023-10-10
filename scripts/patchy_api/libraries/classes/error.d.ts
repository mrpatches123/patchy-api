declare class ErrorLogger {
    [key: string]: any;
    constructor();
    log(error: any, stack: string, infoObject: {
        event?: string;
        key?: string;
    }, save?: boolean): void;
    logChat(error: any, stack: string, { event, key }?: {
        event?: string | undefined;
        key?: string | undefined;
    }, save?: boolean): void;
    logConsole(error: any, stack: string, { event, key }: {
        event?: string | undefined;
        key?: string | undefined;
    } | undefined, save: boolean): void;
}
declare const errorLogger: ErrorLogger;
export default errorLogger;
