import { MinecraftEntityTypes, EntityTypes, world, DynamicPropertiesDefinition, Entity, EntityType, World } from "@minecraft/server";
import { content, isDefined } from "../../utilities.js";
import { Player } from "../player/class.js";
const types = ['string', 'number', 'boolean'];
const overworld = world.getDimension('overworld');
type EntityKeys = keyof typeof MinecraftEntityTypes;
type EntityWorldKeys = EntityKeys | 'world';
export class PropertyBuilder {
	registry: { [key in EntityWorldKeys]?: Record<string, { type?: 'string' | 'number' | 'boolean', maxLength?: number; }> } = {};
	properties: { [key in EntityWorldKeys]?: Record<string, { value?: number | string | boolean, values?: Record<string, number | string | boolean>, type?: 'string' | 'number' | 'boolean', maxLength?: number; }>; } = {};
	subscribedRegistration: boolean = false;
	registeredProperties: boolean = false;
	/**
	 * @param {} data 
	 */
	register(data: { [key in EntityWorldKeys]: { [property: string]: { maxLength?: number, type: 'string' | 'number' | 'boolean'; }; }; }) {
		if (!(data instanceof Object)) throw new Error(`data at params[0] is not of type: Object!`);
		Object.entries(data).forEach(([typeId, properties]) => {
			if (!(properties instanceof Object)) throw new Error(`properties: ${properties}, in ${typeId} at params[0] is not of type: Object!`);
			const entityType = (MinecraftEntityTypes.hasOwnProperty(typeId)) ? MinecraftEntityTypes[typeId as keyof typeof MinecraftEntityTypes] as EntityType : EntityTypes.get(typeId);
			const currentTypeId = (typeId === 'world') ? 'world' : entityType?.id as keyof typeof MinecraftEntityTypes;
			if (!currentTypeId) throw new Error(`typeId: ${typeId}, in data at parms[0] is not associated with a entity, player, or is 'world'!`);
			this.registry[currentTypeId] ??= {};
			Object.entries(properties).forEach(([identifier, { type, maxLength }]) => {
				if (!type) throw new Error(`type: ${type}, in ${typeId} in data at params[0] is not defined in ${identifier}!`);
				if (type !== 'string' && maxLength) throw new Error(`maxLength: ${maxLength}, in ${identifier} in ${typeId} in data at params[0] is defined and type is not 'string'!`);
				// content.warn({ t: 'registerwwfomwpfjhweobi', type, registry: this.registry[currentTypeId] });

				this.registry[currentTypeId]![identifier] = {};
				this.registry[currentTypeId]![identifier]!.type = type;
				// content.warn({ typeId, identifier, type, registry: this.registry[currentTypeId] });
				if (type !== 'string') return;
				this.registry[currentTypeId]![identifier]!.maxLength = maxLength;
			});

			this.subscribeRegistration();
		});
	}
	subscribeInitializeValues() {
		const propertyThis = this;
		overworld.getEntities().forEach(entity => {
			propertyThis.initialize(entity);
		});
		world.getAllPlayers().forEach(player => {
			propertyThis.initialize(player);
		});
		world.afterEvents.entitySpawn.subscribe(({ entity }) => {
			propertyThis.initialize(entity);
		});
		world.afterEvents.playerSpawn.subscribe(({ player }) => {
			propertyThis.initialize(player);
		});

		Object.entries(this.registry.world ?? {}).forEach(([identifier]) => {
			this.properties.world ??= {};
			const value = world.getDynamicProperty(identifier);
			if (!isDefined(value)) return;
			this.properties.world![identifier] ??= {};
			this.properties.world![identifier]!.value = value;
		});
	};
	/**
	 * @param {Entity} entity 
	 */
	initialize(entity: Entity | Player) {
		const { typeId, id } = entity;
		Object.entries(this.properties?.[typeId as keyof typeof MinecraftEntityTypes] ?? {}).forEach(([identifier, { type, maxLength }]) => {
			const value = entity.getDynamicProperty(identifier);
			if (!value) return;
			(this.properties[typeId as keyof typeof MinecraftEntityTypes] as any)[identifier].values[id] = value;
		});

	}
	subscribeRegistration() {
		if (this.subscribedRegistration) return;
		this.subscribedRegistration = true;
		const propertyThis = this;
		world.afterEvents.worldInitialize.subscribe(event => {
			// content.warn({ registry: propertyThis.registry });
			Object.entries(propertyThis.registry).forEach(([typeId, properties]) => {
				const dynamicPropertiesDefinition = new DynamicPropertiesDefinition();
				propertyThis.properties[typeId as keyof typeof MinecraftEntityTypes | 'world'] ??= {};
				Object.entries(properties).forEach(([identifier, { type, maxLength }]) => {
					// content.warn({ typeId, identifier, type });

					propertyThis.properties[typeId as EntityWorldKeys] ??= {};
					propertyThis.properties[typeId as EntityWorldKeys]![identifier] = {};
					propertyThis.properties[typeId as EntityWorldKeys]![identifier]!.type = type;
					if (typeId !== 'world') propertyThis.properties[typeId as EntityWorldKeys]![identifier]!.values = {};
					switch (type) {
						case 'string': {
							dynamicPropertiesDefinition.defineString(identifier, maxLength as number);
							propertyThis.properties[typeId as EntityWorldKeys]![identifier]!.maxLength = maxLength;
							break;
						}
						case 'number': {
							dynamicPropertiesDefinition.defineNumber(identifier);
							break;
						}
						case 'boolean': {
							dynamicPropertiesDefinition.defineBoolean(identifier);
							break;
						}
					}
				});
				if (typeId === 'world') return event.propertyRegistry.registerWorldDynamicProperties(dynamicPropertiesDefinition);
				event.propertyRegistry.registerEntityTypeDynamicProperties(dynamicPropertiesDefinition, EntityTypes.get(typeId));
			});
			propertyThis.registeredProperties = true;
			propertyThis.subscribeInitializeValues();
		});

	}
	get(entity?: Player | Entity | World): Record<string, string | number | boolean> {

		if (entity === undefined) entity = world;
		let { typeId, id } = (entity instanceof World) ? { typeId: 'world', id: null } : entity;
		const thisProperty = this;
		if (!thisProperty.properties.hasOwnProperty(typeId)) throw new Error(`${typeId.replace(/\w:/, '')} has no properties registered`);
		return new Proxy({}, {
			get(target, key) {
				if (!thisProperty.properties[typeId as EntityWorldKeys]!.hasOwnProperty(key)) throw new Error(`dynamic property, ${key as string} does not exist on ${typeId.replace(/\w:/, '')}`);
				return (typeId === 'world') ? thisProperty.properties?.[typeId as EntityWorldKeys]?.[key as string]?.value : (thisProperty.properties?.[typeId as keyof typeof MinecraftEntityTypes] as any)?.[key]?.values[id as string];
			},
			has(target, key) {
				if (!thisProperty.properties[typeId as EntityWorldKeys]!.hasOwnProperty(key)) throw new Error(`dynamic property, ${key as string} does not exist on ${typeId.replace(/\w:/, '')}`);
				return (thisProperty.properties?.[typeId as EntityWorldKeys] as any)?.[key]?.values.hasOwnProperty(id);
			},
			set(target, key, value, reciveir) {
				if (!thisProperty.properties[typeId as EntityWorldKeys]!.hasOwnProperty(key)) throw new Error(`dynamic property, ${key as string} does not exist on ${typeId.replace(/\w:/, '')}`);
				const { type } = thisProperty.properties[typeId as EntityWorldKeys]![key as string] ?? {};
				if (isDefined(value) && typeof value !== type) throw new Error(`value for dynamic property: ${key as string} is not of type: ${type}`);
				if (typeId === 'world') thisProperty.properties[typeId]![key as string]!.value = value;
				else (thisProperty.properties[typeId as EntityKeys] as any)[key].values[id as string] = value;
				if (!isDefined(value)) { (entity as Player | Entity | World).removeDynamicProperty(key as string); return Reflect.set(target, key, value, reciveir); };
				(entity as Player | Entity | World).setDynamicProperty(key as string, value);
				return Reflect.set(target, key, value, reciveir);
			}
		});
	};
}



class Test<T extends (number | string)[] = []> {
	public result: T = [] as unknown as T;

	test(): Test<[...T, string]> {
		return this as any; // Type assertion needed for inference
	}

	test2(): Test<[...T, number]> {
		return this as any; // Type assertion needed for inference
	}

	show(): T {
		return this.result;
	}
}
const result = new Test().test().test2().test2().test().test().show();
const [a1, a2, a3, a4] = result;
