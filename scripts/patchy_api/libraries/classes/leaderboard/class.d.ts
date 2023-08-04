import { Dimension, Vector3 } from "@minecraft/server";

class LeaderboardBuilder {
	constructor(): this;
	/**
	 * formating can be every place or per place *f for scores denotes that the number should be formated
	 * @example
	 * '§a(#${#}) §b${name} - §9${score*f}§r'
	 * @example {
	 * formating: [
			'§a(#${#}) §b${name} - §9${score*f}§r',
			'§e(#${#}) §b${name} - §9${score*f}§r',
			'§e(#${#}) §b${name} - §9${score*f}§r',
			'§6(#${#}) §b${name} - §9${score*f}§r',
			'§c(#${#}) §b${name} - §9${score*f}§r'
		]
	}
	 */
	create(data: { type: 'offline' | 'online', reversed: boolean, modification: (value: number) => number, dimension: Dimension, location: Vector3, objective: string, maxLength: number, title: string, formating: string | string[]; }): void;
	delete(location: vector3, objective: string): number;
}
