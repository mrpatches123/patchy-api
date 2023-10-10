import { MinecraftEntityTypes, Entity, World } from "@minecraft/server";
import { Player } from "../player/class.js";
type EntityKeys = keyof typeof MinecraftEntityTypes;
type EntityWorldKeys = EntityKeys | 'world';
export declare class PropertyBuilder {
    registry: {
        [key in EntityWorldKeys]?: Record<string, {
            type?: 'string' | 'number' | 'boolean';
            maxLength?: number;
        }>;
    };
    properties: {
        [key in EntityWorldKeys]?: Record<string, {
            value?: number | string | boolean;
            values?: Record<string, number | string | boolean>;
            type?: 'string' | 'number' | 'boolean';
            maxLength?: number;
        }>;
    };
    subscribedRegistration: boolean;
    registeredProperties: boolean;
    /**
     * @param {} data
     */
    register(data: {
        [key in EntityWorldKeys]?: {
            [property: string]: {
                maxLength?: number;
                type: 'string' | 'number' | 'boolean';
            };
        };
    }): void;
    subscribeInitializeValues(): void;
    /**
     * @param {Entity} entity
     */
    initialize(entity: Entity | Player): void;
    subscribeRegistration(): void;
    get(entity?: Player | Entity | World): Record<string, string | number | boolean | undefined>;
}
export {};
