import { Dimension, system, world } from '@minecraft/server';

// function getKeys(object) {
// 	const prototype = Object.getPrototypeOf({});
// 	const keys = [];
// 	for (const key in object) {
// 		if (prototype.hasOwnProperty(key)) continue;
// 		keys.push(key);
// 	}
// 	return keys;
// };
const content = {
	warn(...messages) {
		console.warn(messages.map(message => JSON.stringify(message, (key, value) => (value instanceof Function) ? '<f>' : value)).join(' '));
	}
};
const overworld = world.getDimension('overworld');
function getScore(player, objective) {
	try { return world.scoreboard.getObjective(objective).getScore(player.scoreboard); } catch { }
};
const types = ['', 'K', 'M', 'B', 'T'];
function metricNumbers(value, place = 2) {
	return (value / 10 ** (~~(Math.log10(value) / 3) * 3)).toFixed(place) + types[~~(Math.log10(value) / 3)];
}
class LeaderboardBuilder {
	constructor() {
		this.entities = {};
		system.runInterval(() => {
			const players = [...world.getPlayers()];
			const entities = [...overworld.getEntities({ type: 'patches:leaderboard' })];
			// content.warn({ len: entities.length, mpa: entities.map(({ typeId }) => typeId) });
			entities.forEach((entity) => {
				const { id } = entity;
				if (!this.entities.hasOwnProperty(id)) {
					const tags = entity.getTags();
					if (!tags) return entity.triggerEvent('kill_lb');
					const optionsString = tags.find(tag => tag.startsWith('options:'));
					if (!optionsString) return entity.triggerEvent('kill_lb');
					this.entities[id] = JSON.parse(optionsString.substring('options:'.length));
					this.entities[id].scores = {};
					if (!this.entities[id].online) {
						const scoresString = tags.find(tag => tag.startsWith('scores:'));
						if (scoresString) {
							this.entities[id].scores = JSON.parse(scoresString.substring('scores:'.length));
						}
					}
				}
				const entityStorage = this.entities[id];
				let { scores = {}, online, objective, maxLength, format, title } = entityStorage;
				let leaderboardPlayers = {};
				let save = false;
				if (!this.entities[id].hasOwnProperty('scores')) this.entities[id].scores = {};
				players.forEach(player => {
					const { id: playerId, name } = player;

					const score = getScore(player, objective);

					if (score === undefined) return;

					leaderboardPlayers[playerId] = { name, value: score };
					if (online) return;
					if (scores?.[playerId]?.value === score) return;
					if (!this.entities[id].scores.hasOwnProperty(playerId)) this.entities[id].scores[playerId] = {};
					this.entities[id].scores[playerId].value = score;
					save = true;
				});

				if (!online) {
					Object.assign(scores, leaderboardPlayers);
					leaderboardPlayers = scores;
				}
				// content.warn({ leaderboardPlayers, scores });
				const leaderboard = Object.entries(leaderboardPlayers).map(([playerId, { value, name }]) => ({ id: playerId, value, name })).sort(({ value: aValue }, { value: bValue }) => bValue - aValue).slice(0, maxLength);

				entity.nameTag = [title, ...leaderboard.map(({ value, name }, i) => format.replace('${#}', i + 1).replace('${name}', name).replace('${score}', value).replace('${score*f}', metricNumbers(value, 1)))].join('\n');
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
		});
	}
	/**
	 * @method addOffine
	 * @param {{x: number, y: number, z: number}} position
	 * @param {String} objective
	 * @param {Number} maxLength
	 * @param {String} title
	 * @param {String} format
	 * @returns
	 */
	createOffine(position, objective, maxLength = 10, title = '', format = '${#} ${name} - ${score}') {
		this.create(false, position, objective, maxLength, title, format);
	}
	/**
	 * @method addOnline
	 * @param {{x: number, y: number, z: number}} position
	 * @param {String} objective
	 * @param {Number} maxLength
	 * @param {String} title
	 * @param {String} format
	 * @returns
	 */
	createOnline(position, objective, maxLength = 10, title = '', format = '#${#} ${name} - ${score}') {
		this.create(true, position, objective, maxLength, title, format);
	}
	/**
	 * @private
	 */
	create(isOnline, position, objective, maxLength, title, format) {
		try {


			// if (!(dimension instanceof Dimension)) return new Error('dimension at params[0] is not of type: Dimension!');
			if (!(position instanceof Object)) return new Error('postion at params[1] is not of type: {x: number, y: number, z: number}!');

			if (typeof objective !== 'string') return new Error('objective at params[0] is not of type: String!');
			if (!('x' in position) && !('y' in position) && !('z' in position)) return new Error('postion at params[1] is not of type: {x: number, y: number, z: number}!');
			// content.warn({ maxLength });
			if (maxLength < 1) return new Error('maxLength at params[2] is not of type: Whole Number!');

			if (title && typeof title !== 'string') return new Error('title at params[3] is defined and not of type: String!');
			if (format && typeof format !== 'string') return new Error('format at params[4] is defined and not of type: String!');

			const { x, y, z } = position;

			let entity = [...overworld.getEntitiesAtBlockLocation({ x, y, z })].filter(({ typeId }) => typeId === 'patches:leaderboard').sort(({ location: { x: aex, y: aey, z: aez } }, { location: { x: bex, y: bey, z: bez } }) => Math.hypot(bex - x, bey - y, bez - z) - Math.hypot(aex - x, aey - y, aez - z))[0];
			if (!entity) entity = overworld.spawnEntity('patches:leaderboard', { x: x, y: y, z: z });
			const { id } = entity;
			if (!this.entities.hasOwnProperty(id)) this.entities[id] = {};
			const options = { position: { x, y, z }, objective, maxLength, title, format, online: isOnline };
			Object.assign(this.entities[id], options);
			entity.addTag('options:' + JSON.stringify(options));
		} catch (error) {
			console.warn('LeaderboardBuilder', error, error.stack);
		}
	}
	/**
	 * @method update
	 * @param {Boolean} isOnline
	 * @param {{x: number, y: number, z: number}} position
	 * @param {String} objective
	 * @param {Number} maxLength
	 * @param {String} title
	 * @param {String} format
	 * @returns
	 */
	update(isOnline, position, objective, maxLength, title, format) {
		this.create(isOnline, position, objective, maxLength, title, format);
	};
	/**
	 * @method delete
	 * @param {{x: number, y: number, z: number}} position
	 */
	delete(position) {
		const { x, y, z } = position;
		let entity = [...overworld.getEntitiesAtBlockLocation({ x, y, z })].sort(({ location: { x: aex, y: aey, z: aez } }, { location: { x: bex, y: bey, z: bez } }) => Math.hypot(bex - x, bey - y, bez - z) - Math.hypot(aex - x, aey - y, aez - z))[0];
		if (!entity) return;
		const { id } = entity;
		delete this.entities[id];
		return entity.triggerEvent('kill_lb');
	}
};

const leaderboardBuilder = new LeaderboardBuilder();
export default leaderboardBuilder;