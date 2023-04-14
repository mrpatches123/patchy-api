import { Dimension, world } from "@minecraft/server";
import { content, isDefined, isVector3, metricNumbers, overworld, typeOf } from "../../utilities.js";
import eventBuilder from "../events/export_instance.js";
import players from "../players/export_instance.js";

const type = ['online', 'offline'];

export class LeaderboardBuilder {
	constructor() {
		this.createQueue = [];
		/**
		 * @type {{[entityId: string]: {savedScores: {[playerId: string]: {value: number, name:string}} type: 'offline' | 'online', reversed: boolean, modification: (value: number) => number, dimension: Dimension, location: Vector3, objective: string, maxLength: number, title: string, formating: string | string[] }}}
		 */
		this.entities = {};
		this.subscribed = false;
		this.loadCreated = false;
	}
	initialize() {
		content.warn({ createQueueLB: this.createQueue });
		this.createQueue.forEach(({ reversed, modification, type, location, objective, maxLength, title, formating }) => {
			let entity = [...overworld.getEntitiesAtBlockLocation(location)].filter(({ typeId }) => typeId === 'patches:leaderboard').sort(({ location: { x: aex, y: aey, z: aez } }, { location: { x: bex, y: bey, z: bez } }) => Math.hypot(bex - x, bey - y, bez - z) - Math.hypot(aex - x, aey - y, aez - z))[0];
			if (!entity) entity = overworld.spawnEntity('patches:leaderboard', location);
			if (!entity.hasTag(objective)) entity.addTag(objective);
			const { id } = entity;
			this.entities[id] = { reversed, modification, location, objective, maxLength, title, formating, type };
			this.entities[id].savedScores = {};
			if (type === 'offline') {
				const tags = entity.getTags();
				const scoresString = tags.find(tag => tag.startsWith('scores:'));
				if (scoresString) {
					this.entities[id].savedScores = JSON.parse(scoresString.substring('scores:'.length));
				}
				content.warn({ data: this.entities[id] });
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
	update(objectiveToUpdate) {
		const playersOnline = players.get();
		const entities = [...((objectiveToUpdate) ? overworld.getEntities({ type: 'patches:leaderboard', tags: [objectiveToUpdate] }) : overworld.getEntities({ type: 'patches:leaderboard' }))];
		if (!entities.length) return;
		// content.warn({ len: entities.length, mpa: entities.map(({ typeId }) => typeId) });
		entities.forEach((entity) => {
			const { id } = entity;
			if (!this.entities.hasOwnProperty(id)) {
				this.entities[id] = {};
				const tags = entity.getTags();
				if (!tags) return entity.triggerEvent('kill_lb');
				this.entities[id].savedScores = {};
				if (this.entities[id].type === 'offline') {
					const scoresString = tags.find(tag => tag.startsWith('scores:'));
					if (scoresString) {
						this.entities[id].savedScores = JSON.parse(scoresString.substring('scores:'.length));
					}
					content.warn({ data: this.entities[id] });
				}
			}

			const entityStorage = this.entities[id];
			let { modification, reversed, savedScores = {}, type, objective, maxLength, formating, title } = entityStorage;
			if (!objective) return;
			let leaderboardPlayers = {};
			let save = false;
			if (!this.entities[id].hasOwnProperty('savedScores')) this.entities[id].savedScores = {};
			playersOnline.iterate(player => {
				const { id: playerId, name, scores } = player;

				const score = scores[objective];

				if (!isDefined(score)) return;

				leaderboardPlayers[playerId] = { name, value: score };
				if (type === 'online') return;
				if (savedScores?.[playerId]?.value === score) return;
				if (!this.entities[id].savedScores.hasOwnProperty(playerId)) this.entities[id].savedScores[playerId] = {};
				this.entities[id].savedScores[playerId].value = score;
				save = true;
			});

			if (type === 'offline') {
				Object.assign(savedScores, leaderboardPlayers);
				leaderboardPlayers = savedScores;
			}
			// content.warn({ leaderboardPlayers, scores });
			let leaderboard = Object.entries(leaderboardPlayers).map(([playerId, { value, name }]) => ({ id: playerId, value, name })).sort(({ value: aValue }, { value: bValue }) => bValue - aValue);
			leaderboard = (reversed) ? leaderboard.reverse().slice(0, maxLength) : leaderboard.slice(0, maxLength);
			entity.nameTag = [title, ...leaderboard.map(({ value, name }, i) => ((formating instanceof Array) ? formating[i] ?? formating[formating.length - 1] : formating).replace('${#}', i + 1).replace('${name}', name).replace('${score}', (modification instanceof Function) ? modification(value) : value).replace('${score*f}', metricNumbers(value, 1)))].join('\n');
			// content.warn({ tag: entity.nameTag });
			if (!save) return;
			const tags = entity.getTags();
			const leaderboardObject = {};
			leaderboard.forEach(({ id, value, name }) => {
				leaderboardObject[id] = { value, name };
			});
			const scoresString = tags.find(tag => tag.startsWith('scores:'));
			if (scoresString) entity.removeTag(scoresString);
			entity.addTag('scores:' + JSON.stringify(leaderboardObject));
		});
	}
	create({ type = 'online', reversed = false, modification, location, objective, maxLength, title = objective, formating = '${#} ${name} ${score*f}' }) {



		// if (!(dimension instanceof Dimension)) throw new Error('dimension at params[0] is not of type: Dimension!');
		if (!isVector3(location)) throw new Error('postion in params[] is not of type: Vector3!');

		if (typeof objective !== 'string') throw new Error('objective in params[0] is not of type: String!');
		if (!world.scoreboard.getObjective(objective)) throw new Error('objective in params[0] does not exist!');
		// content.warn({ maxLength });
		if (typeof maxLength !== 'number') throw new Error('maxLength in params[2] is not of type: Whole Number!');
		if (maxLength < 1) throw new Error('maxLength in params[2] is not of type: Whole Number!');
		if (modification && !(modification instanceof Function)) throw new Error('modification in params[2] is not of type: Function!');
		if (typeof title !== 'string') throw new Error('title in params[0] is defined and not of type: String!');
		if (typeof formating !== 'string' && !(formating instanceof Array)) throw new Error('formating in params[0] is defined and not of type: String or Array!');
		if (typeof reversed !== 'boolean') throw new Error('reversed in params[0] is defined and not of type: Boolean!');
		this.createQueue.push({ modification, reversed, type, location, objective, maxLength, title, formating });
		this.subscribe();
		content.warn(this.loadCreated);
		if (this.loadCreated) this.initialize();
	}
	/**
	 * @param {{x: number,y: number,z: number}} location 
	 * @param {string} objective 
	 * @returns {number}
	 */
	delete(location, objective) {
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