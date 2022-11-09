import { world, Player, Entity, ItemStack, Items, Location, MolangVariableMap, Vector } from '@minecraft/server';
import errorLogger from '../classes/error.js';

const { isInteger } = Number;
// import playerScoreboard from '../classes/scoreboard.js';
import { content, native, server } from '../utilities.js';
const { sin, cos } = Math;
const betaPlayerFunctions = {
	/**
	 * @method runCommands
	 * @param  {...String || Array<String>} commands
	 * @returns Array CommandRepsone
	 */
	runCommands(...commands) {
		let returnArray = [];
		commands.forEach(command => returnArray.push(this.runCommand(command)));
		return returnArray;
	},
	/**
	 * @method getName gets player name property
	 * @returns String
	 */
	getName() {
		return this.name;
	},
	/**
	 * @method getNameTag gets player nameTag propertygets player nameTag property
	 * @returns String 
	 */
	getNameTag() {
		if (/"|\\/.test(this.name)) {
			this.nameTag = this.nameTag.replace(/"|\\/g, '');
		} return this.nameTag;
	}, //not beta but fixes nameSpoof command tartgeting issues
	/**
	 * @method rot gets player roation property 
	 * @param  {Boolean} isArray if true returns an array else object
	 * @returns Array || Object 
	 */
	rot(isArray = true) {
		const { x, y } = this.rotation;
		if (isArray) {
			return [x, y];
		} else {
			return { x, y };
		}
	},
	/**
	 * @method scoreTest gets a player's Scoreboard Objective  
	 * @param  {Boolean} objective Scoreboard Objective Id
	 * @param  {Boolean} min (Optional) if mix and max are defined and the score is between them it will return true
	 * @param  {Boolean} max (Optional) 
	 * @returns Number || Boolean 
	 */
	scoreTest(objective) {
		const score = server.scoreTest(objective, this);
		// if (score === undefined) {
		// 	throw new Error(`scoreboard objective: ${objective}, is undefined for ${this.name}`);
		// }
		return score;
	},
	// /**
	//  * @method — getScoresListed gets a players scores from a list or an array of objectiveIds
	//  * @param player
	//  * @param objectives — or argument Strings
	//  * @returns — Object 
	//  */
	// getScoresListed(...objectives) {
	// 	return playerScoreboard.getScoresListed(this, objectives);
	// },
	// scores: new Proxy({}, {
	// 	get(target, prop) {

	// 	}
	// }),
	/**
	 * @method scoreTest adds to a player's Scoreboard Objective 
	 * @param  {Boolean} objective Scoreboard Objective Id
	 * @param  {Boolean} amount (Optional: 0)  amount to add to the scoreboard
	 * @returns Number current 
	 */
	scoreAdd(objective, amount = 0) {
		try {
			return Number(this.runCommand(`scoreboard players add @s ${objective} ${amount}`).statusMessage.match(/-?\d+(?=[^-\d]$)/));
		} catch (error) {
			console.warn(error, error.stack);
			return;
		}
	},
	scoreSet(objective, amount = 0) {
		try {
			return Number(this.runCommand(`scoreboard players set @s ${objective} ${amount}`).statusMessage.match(/-?\d+(?=$)/));
		} catch (error) {
			console.warn(error, error.stack);
			return;
		}
	},
	gamemode(index, selector = '') {
		try {
			content.warn({ test: this.runCommand(`testfor ${selector}`).statusMessage, selector });
			this.runCommand(`gamemode ${index} ${selector}`);
		} catch { }
	},
	getPropertiesList() {
		return andArray(this.keys());
	},
	tellraw(message) {
		return this.runCommand(`tellraw @s {"rawtext":[{"text":"${message.replaceAll('"', '\\"')}"}]}`);
	},
	clear(id) {
		let inventory = this.getComponent('minecraft:inventory').container;
		for (let i = 0; i < inventory.size; i++) {
			const item = inventory.getItem(i);
			if (!item) { continue; }
			if (item.id === id || !id) {
				inventory.setItem(i, new ItemStack(Items.get('minecraft:air'), 0, 0));
			}
		}
	},
	getItemAmount(id) {
		let inventory = this.getComponent('minecraft:inventory').container;
		let amount = 0;
		for (let i = 0; i < inventory.size; i++) {
			const item = inventory.getItem(i);
			if (!item) { continue; }
			if (item.id === id) {
				amount += item.amount;
			}
		}
		return amount;
	},
	clearCrossHare(id) {
		try {
			this.runCommand(`clear @s ${id} ${crossHareDataKey}`);
		} catch { }

	},
	queryTopSolid(ceiling = 319) {
		const { location: { x, z } } = this;
		const locations = new BlockLocation(x.floor(), ceiling, z.floor())
			.blocksBetween(new BlockLocation(x.floor(), -64, z.floor())).reverse();
		content.warn(native.stringify(locations[0]));
		for (const location of locations) {
			content.warn({ id: this.dimension.getBlock(location).type.id });
			if (!this.dimension.getBlock(location).isEmpty) {
				console.warn(x, location.y, z);
				return location.y;
			}
		}
		console.warn('hewidjdwwdnnwdkkj');
	},
	ability(ability, bool = '', selector = '') {
		let abilityCurrent;
		try {
			abilityCurrent = JSON.parse(this.runCommand(`ability @s${selector} ${ability}`).displayString.match(/\w+$/)[0]?.toLowerCase());
		} catch { }
		// content.warn(abilityCurrent);
		if (abilityCurrent !== undefined && abilityCurrent !== bool) {
			this.runCommand(`ability @s ${ability} ${bool}`);
			return !abilityCurrent;
		} else {
			return abilityCurrent;
		}

	},
	removeAllTags() {
		this.getTags().forEach(tag => this.removeTag(tag));
	},
	kick(reason) {
		try {
			this.runCommand(`kick "${this.name}" ${reason}`);
		} catch (error) {
			const { statusCode } = JSON.parse(error);
			if (statusCode === -2147483648) {
				this.disconnect();
			}
		}


	},
	disconnect() {
		this.triggerEvent('patches:disconnect');
	}
	// spawnProjectile(entityId, velocity, offset = { x: 10, y: 0, z: 0 }, addPlayerVelocity) {
	// 	let { x, y, z } = offset;

	// 	const { headLocation: { x: hx, y: hy, z: hz }, viewVector, dimension } = this;
	// 	let { rotation: { x: rx, y: ry } } = this;
	// 	rx = rx * Math.PI / 180;
	// 	ry = ry * Math.PI / 180;
	// 	content.warn({ rx, ry });
	// 	//around x
	// 	// y = y * cos(rx) - z * sin(rx);
	// 	// z = y * sin(rx) + z * cos(rx);
	// 	//around y
	// 	z = z * cos(rx) - x * sin(rx);
	// 	x = x * cos(rx) + z * sin(rx);
	// 	// //around z
	// 	x = x * cos(ry) - y * sin(ry);
	// 	y = x * sin(ry) + y * cos(ry);
	// 	const newLocation = new Location(hx + x, hy + y, hz + z);
	// 	dimension.spawnParticle('minecraft:endrod', newLocation, new MolangVariableMap());
	// 	// const projectile = dimension.spawnEntity(entityId, newLocation);
	// 	// projectile.setRotation(x, y);
	// 	// const arrowVelocity = veiwVector.scale(velocity.magnitude() + 1.6);
	// 	// content.warn(arrowVelocity.magnitude());
	// 	// arrow.setVelocity(arrowVelocity);
	// 	// const markVariant = source.getComponent('minecraft:mark_variant');
	// 	// markVariant.value = 0;
	// }
};

Object.assign(Player.prototype, betaPlayerFunctions);
Object.assign(Entity.prototype, betaPlayerFunctions);


import players from '../classes/players.js';

const playerProperties = {
	/**
	 * @property scores any property gotten with return the score from the player's scoreboard 
	 * any property set will set the score
	 * @returns {{[objectiveId: String]: Number}}
	 */
	scores: {
		get() {
			const player = this;
			return new Proxy({}, {
				get(target, objectiveId, value) {
					return player.scoreTest(objectiveId);
				},
				set(target, objectiveId, value) {
					player.scoreSet(objectiveId, value);
				}
			});
		},
	},
	/**
	 * @property properties returns dynmic properties stored on the player
	 * @returns {{[identifier: String]: Number | Boolean | String}}
	 */
	properties: {
		get() {

			const player = this;
			return new Proxy({}, {
				get(target, identifier) {
					return players.getProperty(player, identifier);
				},
				set(target, identifier, value) {
					try {
						content.warn(identifier, value);
						players.setProperty(player, identifier, value);
						return Reflect.set(...arguments);
					} catch (error) {
						errorLogger.log(error, error.stack, { key: 'PlayerDynamicProperties', event: 'N/A' });
					}
				}

			});

		},
	}
};

Object.defineProperties(Player.prototype, playerProperties);
Object.defineProperties(Entity.prototype, playerProperties);
