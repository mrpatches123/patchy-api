import { BlockAreaSize, Vector, Vector3, XYRotation, Dimension } from '@minecraft/server';
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
interface Structure {
	identifier: string,
	rotation?: '0_degrees' | '90_degrees' | '180_degrees' | '270_degrees';
	mirror?: 'none' | 'x' | 'xz' | 'z';
	animationMode?: 'block_by_block' | 'layer_by_layer';
	/**
	 * default?= 0
	 */
	animationSeconds?: number;
	/**
	 * default?= true
	 */
	includesEntites?: boolean;
	/**
	 * default?= true
	 */
	includesBlocks?: boolean;
	/**
	 * default?= false
	 */
	waterlogged: boolean;
	/**
	 * default?= 100
	 */
	integrity: Number;
	seed: string;
}
interface Teleport {
	location: Vector3;
	face?: XYRotation | Vector3;
	dimension: Dimension;
}
interface PlotRules<key extends string> {
	size?: BlockAreaSize;
	start: { x: number, y: number, z: number; };
	ruleSets?: PlotRuleSet[];
	property: boolean;
	plotNumberIdentifier?: key;
	/**
	 * default?= false
	 */
	loop?: boolean;
	teleport?: Teleport;
	structure?: Structure;
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