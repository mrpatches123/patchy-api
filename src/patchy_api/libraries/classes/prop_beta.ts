import { Entity, Player, Vector3, World } from "@minecraft/server";

interface PropertiesCache {
	json: Record<string, any>;
	string: Record<string, string>;
	number: Record<string, number>;
	boolean: Record<string, boolean>;
	vector3: Record<string, Vector3>;
}
class DynamicProperties {
	storage: Record<string, PropertiesCache> = {};
	get(instance: Player | Entity | World) {
		return;
	}
}
class DynamicPropertiesForInstance {

}