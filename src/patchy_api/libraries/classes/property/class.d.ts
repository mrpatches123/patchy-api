import { MinecraftEntityTypes, Entity } from "@minecraft/server";
import { Player } from "../player/class";
export class PropertyBuilder {
	register(properties: { [typeId in keyof typeof MinecraftEntityTypes | 'world']: { [property: string]: { maxLength?: number, type: 'string' | 'number' | 'boolean'; }; }; }): void;
	get(entity: Entity): { [propertyIdentifier: string]: string | number | boolean; };
}