import { Vector3, Dimension } from "@minecraft/server";

export interface StructureSaveOptions {
	name: string,
	dimension: Dimension;
	location1: Vector3;
	location2: Vector3;
	/**
	 * default?= 'memory'
	 */
	saveMode: 'memory' | 'disk';
	/**
	 * default?= true
	 */
	includesEntites?: boolean;
	/**
	 * default?= true
	 */
	includesBlocks?: boolean;
}
export interface StructureLoadOptions {
	dimension: Dimension;
	/**
	 * most negtive x, y, and z postion of the load (maby the save) will be here
	 */
	location: Vector3;
	name: string,
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
interface StructureStatus {
	started: boolean;
	done: boolean;
}
export class StructureBuilder {

	getLoadStatus(id: number): StructureStatus;
	load(loadOptions: StructureLoadOptions): number;

	getSaveStatus(id: number): StructureStatus;
	save(saveOptions: StructureSaveOptions): number;
}