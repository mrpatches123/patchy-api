import config from '../config.js';
import { Database, commandBuilder, databases, global, overworld } from '../modules.js';
global.deltaTimes = [];
const { commandPrefix: prefix, tpsPrecision } = config;
commandBuilder.register('transfer', {
    description: "Used to Transfer DataBases To Property Database",
    usages: [
        `${prefix}transfer`,
    ],
    callback: (sender, args) => {
        const databasesEntityObject = {};
        const entityArray = [];
        const entities = [...overworld.getEntities({ type: 'patches:database' })];
        // content.warn({ entities: entities.length });
        entities.forEach(entity => {
            let { location } = entity;
            const { x, z } = location;
            const index = entityArray.findIndex(([fx, fz]) => fx === x && fz === z);
            if (index !== -1) {
                entityArray[index] ??= [x, z, entity];
                entityArray[index].push(entity);
            }
            else {
                entityArray.push([x, z, entity]);
            }
        });
        entityArray.forEach(entitiesBS => {
            const entities = entitiesBS.splice(2).filter(entity => entity);
            const json = [];
            if (entities) {
                const name = entities[0].getTags().find(tag => tag.includes('dbName:')).replace('dbName:', '');
                // content.warn({ dbNmae: name });
                entities.forEach(entity => {
                    const order = entities[0].getTags().find(tag => tag.includes('dbOrder:')).replace('dbName:', '');
                    json.push([Number(order), entity.nameTag]);
                });
                if (name) {
                    databasesEntityObject[name] = new Database(JSON.parse(json.sort((a, b) => a[0] - b[0]).map(([a, b]) => b).join('')));
                    // content.warn({ [name]: this[name] });
                }
                // content.warn({ name, gettime: time.end('databaseInitTest'), length: JSON.stringify(this[name]).length });
            }
            Object.entries(databasesEntityObject).forEach(([name, database]) => {
                const databaseProperties = databases.get(name) ?? databases.add(name);
                Object.entries(database).forEach(([key, value]) => {
                    if (key === '__db_properties')
                        return;
                    databaseProperties.set(key, value);
                });
                databases.save(name);
            });
        });
    }
});
//# sourceMappingURL=transfer.js.map