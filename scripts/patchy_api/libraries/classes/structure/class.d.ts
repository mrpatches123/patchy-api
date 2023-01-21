import { Vector3, Dimension } from "@minecraft/server";

interface StructureSaveOptions {
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
interface StructureLoadOptions {
	dimension: Dimension;
	/**
	 * most negtive x, y, and z postion of the load (maby the save) will be here
	 */
	location: Vector3;
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
export class StructureBuilder {
	load(loadOptions: StructureLoadOptions): void;
	save(saveOptions: StructureSaveOptions): void;
}