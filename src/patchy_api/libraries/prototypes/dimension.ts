import { Dimension } from '@minecraft/server';
const dimensionFunctions = {
	/**
	 * @method runCommands
	 * @param  {...String || Array<String>} commands
	 * @returns {Array<CommandRepsone>}
	 */
	runCommands(...commands) {
		commands = (typeof commands[0] === 'array') ? arguments[0] : [...commands];
		let returnArray = [];
		for (const command of commands) {
			returnArray.push(this.runCommandAsync(command));
		} return returnArray;

	},
};
Object.assign(Dimension.prototype, dimensionFunctions);