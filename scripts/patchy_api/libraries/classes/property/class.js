import { MinecraftEntityTypes, EntityTypes, world, DynamicPropertiesDefinition, World } from "@minecraft/server";
import { isDefined } from "../../utilities.js";
const types = ['string', 'number', 'boolean'];
const overworld = world.getDimension('overworld');
export class PropertyBuilder {
    constructor() {
        this.registry = {};
        this.properties = {};
        this.subscribedRegistration = false;
        this.registeredProperties = false;
    }
    /**
     * @param {} data
     */
    register(data) {
        if (!(data instanceof Object))
            throw new Error(`data at params[0] is not of type: Object!`);
        Object.entries(data).forEach(([typeId, properties]) => {
            if (!(properties instanceof Object))
                throw new Error(`properties: ${properties}, in ${typeId} at params[0] is not of type: Object!`);
            const entityType = (MinecraftEntityTypes.hasOwnProperty(typeId)) ? MinecraftEntityTypes[typeId] : EntityTypes.get(typeId);
            const currentTypeId = (typeId === 'world') ? 'world' : entityType?.id;
            if (!currentTypeId)
                throw new Error(`typeId: ${typeId}, in data at parms[0] is not associated with a entity, player, or is 'world'!`);
            this.registry[currentTypeId] ??= {};
            Object.entries(properties).forEach(([identifier, { type, maxLength }]) => {
                if (!type)
                    throw new Error(`type: ${type}, in ${typeId} in data at params[0] is not defined in ${identifier}!`);
                if (type !== 'string' && maxLength)
                    throw new Error(`maxLength: ${maxLength}, in ${identifier} in ${typeId} in data at params[0] is defined and type is not 'string'!`);
                // content.warn({ t: 'registerwwfomwpfjhweobi', type, registry: this.registry[currentTypeId] });
                this.registry[currentTypeId][identifier] = {};
                this.registry[currentTypeId][identifier].type = type;
                // content.warn({ typeId, identifier, type, registry: this.registry[currentTypeId] });
                if (type !== 'string')
                    return;
                this.registry[currentTypeId][identifier].maxLength = maxLength;
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
            if (!isDefined(value))
                return;
            this.properties.world[identifier] ??= {};
            this.properties.world[identifier].value = value;
        });
    }
    ;
    /**
     * @param {Entity} entity
     */
    initialize(entity) {
        const { typeId, id } = entity;
        Object.entries(this.properties?.[typeId] ?? {}).forEach(([identifier, { type, maxLength }]) => {
            const value = entity.getDynamicProperty(identifier);
            if (!value)
                return;
            this.properties[typeId][identifier].values[id] = value;
        });
    }
    subscribeRegistration() {
        if (this.subscribedRegistration)
            return;
        this.subscribedRegistration = true;
        const propertyThis = this;
        world.afterEvents.worldInitialize.subscribe(event => {
            // content.warn({ registry: propertyThis.registry });
            Object.entries(propertyThis.registry).forEach(([typeId, properties]) => {
                const dynamicPropertiesDefinition = new DynamicPropertiesDefinition();
                propertyThis.properties[typeId] ??= {};
                Object.entries(properties).forEach(([identifier, { type, maxLength }]) => {
                    // content.warn({ typeId, identifier, type });
                    propertyThis.properties[typeId] ??= {};
                    propertyThis.properties[typeId][identifier] = {};
                    propertyThis.properties[typeId][identifier].type = type;
                    if (typeId !== 'world')
                        propertyThis.properties[typeId][identifier].values = {};
                    switch (type) {
                        case 'string': {
                            dynamicPropertiesDefinition.defineString(identifier, maxLength);
                            propertyThis.properties[typeId][identifier].maxLength = maxLength;
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
                if (typeId === 'world')
                    return event.propertyRegistry.registerWorldDynamicProperties(dynamicPropertiesDefinition);
                event.propertyRegistry.registerEntityTypeDynamicProperties(dynamicPropertiesDefinition, EntityTypes.get(typeId));
            });
            propertyThis.registeredProperties = true;
            propertyThis.subscribeInitializeValues();
        });
    }
    get(entity) {
        if (entity === undefined)
            entity = world;
        let { typeId, id } = (entity instanceof World) ? { typeId: 'world', id: null } : entity;
        const thisProperty = this;
        if (!thisProperty.properties.hasOwnProperty(typeId))
            throw new Error(`${typeId.replace(/\w:/, '')} has no properties registered`);
        return new Proxy({}, {
            get(target, key) {
                if (!thisProperty.properties[typeId].hasOwnProperty(key))
                    throw new Error(`dynamic property, ${key} does not exist on ${typeId.replace(/\w:/, '')}`);
                return (typeId === 'world') ? thisProperty.properties?.[typeId]?.[key]?.value : thisProperty.properties?.[typeId]?.[key]?.values[id];
            },
            has(target, key) {
                if (!thisProperty.properties[typeId].hasOwnProperty(key))
                    throw new Error(`dynamic property, ${key} does not exist on ${typeId.replace(/\w:/, '')}`);
                return thisProperty.properties?.[typeId]?.[key]?.values.hasOwnProperty(id);
            },
            set(target, key, value, reciveir) {
                if (!thisProperty.properties[typeId].hasOwnProperty(key))
                    throw new Error(`dynamic property, ${key} does not exist on ${typeId.replace(/\w:/, '')}`);
                const { type } = thisProperty.properties[typeId][key] ?? {};
                if (isDefined(value) && typeof value !== type)
                    throw new Error(`value for dynamic property: ${key} is not of type: ${type}`);
                if (typeId === 'world')
                    thisProperty.properties[typeId][key].value = value;
                else
                    thisProperty.properties[typeId][key].values[id] = value;
                if (!isDefined(value)) {
                    entity.removeDynamicProperty(key);
                    return Reflect.set(target, key, value, reciveir);
                }
                ;
                entity.setDynamicProperty(key, value);
                return Reflect.set(target, key, value, reciveir);
            }
        });
    }
    ;
}
class Test {
    constructor() {
        this.result = [];
    }
    test() {
        return this; // Type assertion needed for inference
    }
    test2() {
        return this; // Type assertion needed for inference
    }
    show() {
        return this.result;
    }
}
const result = new Test().test().test2().test2().test().test().show();
const [a1, a2, a3, a4] = result;
//# sourceMappingURL=class.js.map