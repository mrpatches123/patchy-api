import { BlockAreaSize, Vector, Vector3, Dimension, Vector2 } from '@minecraft/server';
import { Player } from '../player/class.js';
import { StructureLoadOptions } from '../structure/class';
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
	blockPlaceMargin: { x: number, y: number, z: number; };
}
interface Teleport {
	location: Vector3;
	face?: Vector2 | Vector3;
	dimension: Dimension;
}
interface PlotRules<key extends string> {
	size?: BlockAreaSize;
	start: { x: number, y: number, z: number; };
	ruleSets?: PlotRuleSet[];
	property: boolean;
	plotNumberIdentifier?: key;
	defaultPermision?: 'read' | 'write' | 'break' | 'place' | 'open' | 'open-break';
	defaultGamemode?: 0 | 1 | 2;
	/**
	 * default?= false
	 */
	loop?: boolean;
	loopDirection?: 'x' | '-x' | 'z' | '-z';
	teleport?: Teleport;
	structure?: StructureLoadOptions;
}
export class PlotBuilder {
	constructor();
	setOveride(player: Player, type: 'plotNumberOveride' | 'currentPlot' | 'gamemodeOveride' | 'permisionOveride' | 'blockPlaceMarginOverideX' | 'blockPlaceMarginOverideY' | 'blockPlaceMarginOverideZ', value: string | number): void;
	setCurrent(player: Player, key: string): void;
	query(player: Player, key: string): number;
	create<key extends string>(key: string, rules: PlotRules<key>): void;
	add(player: Player, key: string, plotNumber: number | undefined): { wasAdded: boolean, plotNumber: number | undefined, full: boolean; };
	remove(player: Player, key: string): void;
	list(key: string): { currentIndex: number, availablePlots: number[]; };
	reset(key: string): void;
}