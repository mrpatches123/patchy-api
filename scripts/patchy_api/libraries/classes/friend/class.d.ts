import { Player } from '../player/class.js';
type FriendSystemData = {
    type: 'central' | 'remote';
    properties: Record<string, {
        get?: (player: Player) => any;
        set?: (player: Player, requesteeId: string, value: any) => any;
        init?: (player: Player) => any;
    }>;
};
export declare class FriendSystem {
    systemKey: string;
    data: FriendSystemData;
    watchSubscribed: boolean;
    constructor(systemKey: string, data: FriendSystemData);
    addRequest(reqestee: Player, targetId: string, type: 'add' | 'remove' | string, payload: any): Player | true;
    getFriendData<T>(receiver: Player): {
        saves?: {
            [property: string]: any;
        };
        requests: {
            incoming: {
                [id: string]: T;
            };
            outgoing: {
                [id: string]: T;
            };
        };
        mutal: {
            [id: string]: T;
        };
    };
    getProperties(receiver: Player): {
        [key: string]: any;
    };
    setFriendData(receiver: Player, data: {
        requests: {
            incoming: {
                [id: string]: any;
            };
            outgoing: {
                [id: string]: any;
            };
        };
        mutal: {
            [id: string]: any;
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
        [id: string]: any;
    }, property: string): void;
    subscribeWatch(): void;
}
export declare class FriendSystemBuilder {
    friends: {
        [systemKey: string]: {
            system: FriendSystem;
            data: FriendSystemData;
        };
    };
    constructor();
    create(systemKey: string, data: FriendSystemData): void;
    get(systemKey: string): FriendSystem;
}
export {};
