import { Database } from './database.js';
import { Player } from '../player/class.js';
declare class TagDatabases {
    __queuedSaves: {
        subscribed: boolean;
        saves: {
            [key: string]: {
                [key: string]: Player;
            };
        };
    };
    initalized: Record<string, boolean>;
    databases: Record<string, Record<string, Database>>;
    constructor();
    initalize(player: Player): void;
    initalizeAll(): void;
    getTestRaw(player: Player, databaseId?: string): [string, string][] | Record<string, [string, string][]> | undefined;
    get(player: Player, databaseId: string): Database | undefined;
    queueSave(player: Player, databaseId: string): Error | undefined;
    save(databaseId: string, player: Player): Error | undefined;
}
declare const tagDatabases: TagDatabases;
export default tagDatabases;
