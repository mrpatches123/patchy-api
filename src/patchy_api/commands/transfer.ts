import { Entity, world } from '@minecraft/server';
import config from '../config.js';
import { Database, commandBuilder, content, databases, eventBuilder, global, overworld } from '../modules.js';
import entityDatabases from '../libraries/classes/archived_dbs/database.js';

global.deltaTimes = [];
const { commandPrefix: prefix, tpsPrecision } = config;

commandBuilder.register('tps', {
	description: "Used to Transfer DataBases To Property Database",
	usages: [
		`${prefix}transfer`,
	],
	callback: (sender, args) => {
		const databasesEntityObject: Record<string | number, Database> = {};
		const entityArray: [number, number, Entity][] = [];
		const entities = [...overworld.getEntities({ type: 'patches:database' })];
		// content.warn({ entities: entities.length });
		entities.forEach(entity => {
			let { location } = entity;
			const { x, z } = location;
			const index = entityArray.findIndex(([fx, fz]) => fx === x && fz === z);
			if (index !== -1) {
				entityArray[index] ??= [x, z, entity];
				entityArray[index]!.push(entity);
			} else {
				entityArray.push([x, z, entity]);
			}

		});
		entityArray.forEach(entitiesBS => {
			const entities = entitiesBS.splice(2).filter(entity => entity) as Entity[];
			const json: [number, string][] = [];
			if (entities) {

				const name = (entities[0]!.getTags().find(tag => tag.includes('dbName:')) as string).replace('dbName:', '');
				// content.warn({ dbNmae: name });
				entities.forEach(entity => {
					const order = (entities[0]!.getTags().find(tag => tag.includes('dbOrder:')) as string).replace('dbName:', '');
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

				});
			});

		});
	}
});
