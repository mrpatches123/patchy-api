import { Dimension, Vector3, world } from "@minecraft/server";
import { chunkStringBytes, content, isDefined, isVector3, metricNumbers, overworld, typeOf } from "../../utilities.js";
import eventBuilder from "../events/export_instance.js";
import players from "../players/export_instance.js";

const types = ['online', 'offline'] as const;
interface LeaderboardData {
	type?: typeof types[number],
	reversed?: boolean,
	modification?: (current: number) => number,
	location: Vector3,
	objective: string,
	maxLength?: number,
	title?: string,
	formating?: string | string[];
	dimension: Dimension;
}
interface LeaderboardDataAfter {
	type: typeof types[number],
	reversed: boolean,
	modification?: (current: number) => number,
	location: Vector3,
	objective: string,
	maxLength: number,
	title: string,
	formating: string | string[];
	dimension: Dimension;
}
export class LeaderboardBuilder {
	createQueue: LeaderboardDataAfter[];
	entities: Record<string, { savedScores: Record<string, { value: number, name: string; }>, type: 'offline' | 'online', reversed: boolean, modification?: (value: number) => number, dimension: Dimension, location: Vector3, objective: string, maxLength: number, title: string, formating: string | string[]; }>;
	loadCreated: boolean;
	subscribed: boolean;
	constructor() {
		this.createQueue = [];
		this.entities = {};
		this.subscribed = false;
		this.loadCreated = false;
	}
	initialize() {
		// content.warn('leaderboardBuilder2384975u3io9we8rhugybedinwoj');
		// content.warn({ createQueueLB: this.createQueue });
		this.createQueue.forEach(({ reversed, modification, type, location, objective, maxLength, title, formating, dimension }) => {
			let entity = [...overworld.getEntities({ type: 'patches:leaderboard', location, maxDistance: 2, closest: 1, tags: [objective] })][0];
			// content.warn({ objective, entityTags: entity.getTags() });
			if (!entity) entity = overworld.spawnEntity('patches:leaderboard', location);
			if (!entity.hasTag(objective)) entity.addTag(objective);
			const { id } = entity;
			this.entities[id] = { savedScores: {}, reversed, modification, location, objective, maxLength, title, formating, type, dimension };
			this.entities[id]!.savedScores = {};
			if (this.entities[id]!.type === 'offline') {
				const tags = entity.getTags();
				const scoresStrings = tags.filter(tag => tag.startsWith('scores:')) ?? [];
				if (!scoresStrings.length) return;
				const rawDatas = scoresStrings.map(string => {
					const number = Number(string.match(/\d+/) ?? '0');
					return [number, string.replace(/scores:\d+:/, '').replace('scores:', '')];
				}).sort(([a], [b]) => Number(a) - Number(b)).map(([i, rawData]) => rawData);
				// content.warn({ objective, data: rawDatas.join('') });
				this.entities[id]!.savedScores = JSON.parse(rawDatas.join(''));
			}
		});
		this.createQueue = [];
		this.update();
	}
	subscribe() {
		if (this.subscribed) return;
		const thisLB = this;
		eventBuilder.subscribe('LeaderboardBuilder*API', {
			worldLoad: () => {
				thisLB.initialize();
				thisLB.loadCreated = true;
			},
			scoreboardChange: ({ objective }) => {
				if (!objective) return;
				thisLB.update(objective);
			},
			playerJoined: () => {
				thisLB.update();
			},
			playerLeave: () => {
				thisLB.update();
			}
		});
		this.subscribed = true;
	}
	/**
	 * @param {string | undefined} objectiveToUpdate 
	 */
	update(objectiveToUpdate?: string) {
		const playersOnline = players.get();
		const entities = [...((objectiveToUpdate) ? overworld.getEntities({ type: 'patches:leaderboard', tags: [objectiveToUpdate] }) : overworld.getEntities({ type: 'patches:leaderboard' }))];
		if (!entities.length) return;
		const thisLB = this;
		// content.warn({ len: entities.length, mpa: entities.map(({ typeId }) => typeId) });
		entities.forEach((entity) => {
			const { id } = entity;
			if (!this.entities.hasOwnProperty(id)) {
				this.entities[id] = {} as typeof this.entities[typeof id];
				const tags = entity.getTags();
				if (!tags) return entity.triggerEvent('kill_lb');
				this.entities[id]!.savedScores = {};
				if (this.entities[id]!.type === 'offline') {
					const scoresStrings = tags.filter(tag => tag.startsWith('scores:')) ?? [];
					if (!scoresStrings.length) return;
					const rawDatas = scoresStrings.map(string => {
						const number = Number(string.match(/\d+/) ?? '0');
						return [number, string.replace(/scores:\d+:/, '').replace('scores:', '')];
					}).sort(([a], [b]) => Number(a) - Number(b)).map(([i, rawData]) => rawData);;
					this.entities[id]!.savedScores = JSON.parse(rawDatas.join(''));
				}
				// content.warn({ data: this.entities[id] });
			}


			const entityStorage = this.entities[id];
			let { modification, reversed, savedScores = {}, type, objective, maxLength, formating, title } = entityStorage ?? {};
			if (!objective) return;
			let leaderboardPlayers: Record<string, { value: number, name: string; }> = {};
			let save = false;
			this.entities[id]!.savedScores ??= {};
			playersOnline.iterate(player => {
				const { id: playerId, name, scores } = player;

				const score = scores[objective!];

				if (!isDefined(score)) return;

				leaderboardPlayers[playerId] = { name, value: score! };
				if (type === 'online') return;
				if (savedScores?.[playerId]?.value === score) return;
				thisLB.entities[id]!.savedScores[playerId] ??= {} as typeof thisLB.entities[typeof id]['savedScores'][typeof playerId];
				this.entities[id]!.savedScores[playerId]!.value! = score!;
				save = true;
			});

			if (type === 'offline') {
				Object.assign(savedScores, leaderboardPlayers);
				leaderboardPlayers = savedScores;
			}
			// content.warn({ leaderboardPlayers, scores });
			let leaderboard = Object.entries(leaderboardPlayers).map(([playerId, { value, name }]) => ({ id: playerId, value, name })).sort(({ value: aValue }, { value: bValue }) => bValue - aValue);
			leaderboard = (reversed) ? leaderboard.reverse().slice(0, maxLength) : leaderboard.slice(0, maxLength);
			entity.nameTag = [title, ...leaderboard.map(({ value, name }, i) => ((formating instanceof Array) ? formating[i] ?? formating[formating.length - 1] : formating)!.replace('${#}', (i + 1).toString()).replace('${name}', name).replace('${score}', (modification instanceof Function) ? modification(value).toString() : value.toString()).replace('${score*f}', metricNumbers(value, 1) as string))].join('\n');
			// content.warn({ tag: entity.nameTag });
			if (!save) return;
			const tags = entity.getTags();
			const leaderboardObject: Record<string, { value: number, name: string; }> = {};
			leaderboard.forEach(({ id, value, name }) => {
				leaderboardObject[id] = { value, name };
			});
			const scoresStrings = tags.filter(tag => tag.startsWith('scores:'));
			if (scoresStrings.length) scoresStrings.forEach(scoresString => entity.removeTag(scoresString));
			const stringifiedScores = JSON.stringify(leaderboardObject);
			const chunks = chunkStringBytes(stringifiedScores, 240);
			chunks.forEach((chunk, i) => {
				const string = `scores:${i}:${chunk}`;
				content.warn({ objective, i, len: string.length });
				entity.addTag(string);
			});
		});
	}
	create(data: LeaderboardData): void {
		const { type = 'online', reversed = false, modification, location, objective, maxLength = 5, title = objective, formating = '${#} ${name} ${score*f}', dimension } = data;


		// if (!(dimension instanceof Dimension)) throw new Error('dimension at params[0] is not of type: Dimension!');
		if (!isVector3(location)) throw new Error('postion in params[] is not of type: Vector3!');

		if (typeof objective !== 'string') throw new Error('objective in params[0] is not of type: String!');
		if (!world.scoreboard.getObjective(objective)) throw new Error(`objective: ${objective}, in params[0] does not exist!`);
		// content.warn({ maxLength });wq
		if (typeof maxLength !== 'number') throw new Error('maxLength in params[2] is not of type: Whole Number!');
		if (maxLength < 1) throw new Error('maxLength in params[2] is not of type: Whole Number!');
		if (modification && !(modification instanceof Function)) throw new Error('modification in params[2] is not of type: Function!');
		if (typeof title !== 'string') throw new Error('title in params[0] is defined and not of type: String!');
		if (typeof formating !== 'string' && !(formating instanceof Array)) throw new Error('formating in params[0] is defined and not of type: String or Array!');
		if (typeof reversed !== 'boolean') throw new Error('reversed in params[0] is defined and not of type: Boolean!');
		if (!(dimension instanceof Dimension)) throw new Error('dimension in params[0] is defined and not of type: Dimension!');

		this.createQueue.push({ modification, reversed, type, location, objective, maxLength, title, formating, dimension });
		this.subscribe();
		// content.warn(this.loadCreated);
		if (this.loadCreated) this.initialize();
	}
	/**
	 * @param {{x: number,y: number,z: number}} location 
	 * @param {string} objective 
	 * @returns {number}
	 */
	delete(location: Vector3, objective: string) {
		const entities = [...overworld.getEntities({ type: 'patches:leaderboard', location, maxDistance: 2, tags: [objective] })];
		let removed = 0;
		entities.forEach(entity => {
			const { id } = entity;
			delete this.entities[id];
			entity.triggerEvent('kill_lb');
			removed++;
		});
		return removed;
	}

}