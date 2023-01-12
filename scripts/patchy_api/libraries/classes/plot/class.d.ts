import { BlockAreaSize, Vector, Direction } from '@minecraft/server';
import { Player } from '../player/class.js';
export class PlotsVector3 extends Vector {
	constructor(x: number, y: number, z: number);
}
export class BlockVector3 extends Vector {
	constructor(x: number, y: number, z: number);
}
interface PlotRuleSet {
	count?: number;
	size?: BlockAreaSize;
	start: { x: number, y: number, z: number; } | PlotsVector3;
	offset?: { x: number, y: number, z: number; };
	direction: 'x' | '-x' | 'z' | '-z';
}
interface PlotRules<key extends string> {
	size?: BlockAreaSize;
	start: { x: number, y: number, z: number; };
	ruleSets?: PlotRuleSet[];
	property: boolean;
	plotNumberIdentifier?: key;
}
export class PlotBuilder {
	constructor();
	query(player: Player, key: string): number;
	create<key extends string>(key: string, rules: PlotRules<key>): void;
	add(player: Player, key: string): void;
	remove(player: Player, key: string): void;
	set(player: Player, key: string, plotNumber: number): void;
	list(key: string): number[];
	reset(key: string): void;
}