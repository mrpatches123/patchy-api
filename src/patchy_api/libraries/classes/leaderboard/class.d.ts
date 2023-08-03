import { Dimension, Vector3 } from "@minecraft/server";

class LeaderboardBuilder {
	constructor(): this;
	create(data: { type: 'offline' | 'online', reversed: boolean, modification: (value: number) => number, dimension: Dimension, location: Vector3, objective: string, maxLength: number, title: string, formating: string | string[]; }): void;
	delete(location: vector3, objective: string): number;
}