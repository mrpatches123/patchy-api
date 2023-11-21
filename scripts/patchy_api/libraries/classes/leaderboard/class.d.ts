import { Dimension, Vector3 } from "@minecraft/server";
declare const types: readonly ["online", "offline"];
interface LeaderboardData {
    type?: typeof types[number];
    reversed?: boolean;
    modification?: (current: number) => number;
    location: Vector3;
    objective: string;
    maxLength?: number;
    title?: string;
    formating?: string | string[];
    dimension?: Dimension;
}
interface LeaderboardDataAfter {
    type: typeof types[number];
    reversed: boolean;
    modification?: (current: number) => number;
    location: Vector3;
    objective: string;
    maxLength: number;
    title: string;
    formating: string | string[];
    dimension: Dimension;
}
export declare class LeaderboardBuilder {
    createQueue: LeaderboardDataAfter[];
    entities: Record<string, {
        savedScores: Record<string, {
            value: number;
            name: string;
        }>;
        type: 'offline' | 'online';
        reversed: boolean;
        modification?: (value: number) => number;
        dimension: Dimension;
        location: Vector3;
        objective: string;
        maxLength: number;
        title: string;
        formating: string | string[];
    }>;
    loadCreated: boolean;
    subscribed: boolean;
    constructor();
    initialize(): void;
    subscribe(): void;
    /**
     * @param {string | undefined} objectiveToUpdate
     */
    update(objectiveToUpdate?: string): void;
    create(data: LeaderboardData): void;
    /**
     * @param {{x: number,y: number,z: number}} location
     * @param {string} objective
     * @returns {number}
     */
    delete(location: Vector3, objective: string): number;
}
export {};
