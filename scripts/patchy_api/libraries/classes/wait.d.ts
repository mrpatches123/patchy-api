declare class Wait {
    subscriptions: Record<string, {
        checkCallback: () => boolean | void;
        thenCallback: () => boolean | void;
        once: boolean;
        afterLoad: boolean;
        remove: boolean;
        active?: boolean;
    }>;
    constructor();
    add(key: string, checkCallback: () => boolean | void, thenCallback: () => boolean | void, { start, once, afterLoad, remove }: {
        start?: boolean | undefined;
        once?: boolean | undefined;
        afterLoad?: boolean | undefined;
        remove?: boolean | undefined;
    }): void;
    start(key: string): Error | undefined;
    end(key: string): Error | undefined;
    remove(key: string): Error | undefined;
}
declare const wait: Wait;
export default wait;
