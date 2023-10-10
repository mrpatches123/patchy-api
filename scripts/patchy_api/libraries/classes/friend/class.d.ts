import { Player } from '../player/class.js';
type FriendSystemData = {
    type: 'central' | 'remote';
    properties: {
        [key: string]: {
            get: (player: Player) => any;
            set: (player: Player, requesteeId: string, value: any) => any;
            init: (player: Player) => any;
        };
    };
};
export declare class FriendSystem {
    systemKey: string;
    data: FriendSystemData;
    watchSubscribed: boolean;
    constructor(systemKey: string, data: FriendSystemData);
    addRequest(reqestee: Player, targetId: string, type: 'add' | 'remove' | string, payload: any): Player | true;
    /**
     * @param {Player} receiver
     * @param {Player} target
     * @returns { }
     */
    getFriendData(receiver: Player): {
        saves?: {
            [property: string]: any;
        };
        requests: {
            incoming: {
                [id: string]: {};
            };
            outgoing: {
                [id: string]: {};
            };
        };
        mutal: {
            [id: string]: {};
        };
    };
    getProperties(receiver: Player): {
        [key: string]: any;
    };
    setFriendData(receiver: Player, data: {
        requests: {
            incoming: {
                [id: string]: {};
            };
            outgoing: {
                [id: string]: {};
            };
        };
        mutal: {
            [id: string]: {};
        };
    }): void;
    add(receiver: Player, targetId: string, payload: any): void;
    accept(receiver: Player, targetId: string, payload: any): void;
    removeWithRequest(receiver: Player, targetId: string): void;
    remove(receiver: Player, targetId: string): void;
    denyAddRequest(receiver: Player, targetId: string): void;
    requestAdd(receiver: Player, target: Player): void;
    update(receiver: Player, property: string): void;
    /**
     * @param {Player} receiver
     * @param {String} targetId
     */
    updateSingle(receiver: Player, targetId: string, property: string): void;
    /**
     * @param {Player} receiver
     * @param {{[id: string]: {}}} object
     * @param {String} property
     */
    updateFromFriendObject(receiver: Player, object: {
        [id: string]: {};
    }, property: string): void;
    subscribeWatch(): void;
}
export declare class FriendSystemBuilder {
    friends: {
        [systemKey: string]: {
            system: FriendSystem;
            data: {
                type: 'central' | 'remote';
                properties: {
                    [key: string]: {
                        get: (player: Player) => any;
                        set: (player: Player) => any;
                        init: (player: Player) => any;
                    };
                };
            };
        };
    };
    constructor();
    /**
     * @param {string} systemKey
     * @param {} data
     */
    create(systemKey: string, data: {
        type: 'central' | 'remote';
        properties: {
            [key: string]: {
                get: (player: Player) => any;
                set: (player: Player) => any;
                init: (player: Player) => any;
            };
        };
    }): void;
    get(systemKey: string): FriendSystem;
}
export {};
