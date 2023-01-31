
import { world, Player } from "@minecraft/server";
import { eventBuilder, players, preformance, server } from "../../patchy_api/modules";
server.objectiveAdd('testScore');
players.registerProperty('testProp', {
	type: 'number'
});
eventBuilder.subscribe('scoreboardProperty', {
	worldLoad: () => {
		preformance.print(preformance.test(

			{
				scoreboard:
					/**
					 * @type {(player: Player, value: number) => {}}
					 */
					(player, value) => {

						player.setDynamicProperty('testProp', value);
					},
				properties:
					/**
					 * @type {(player: Player, value: number) => {}}
					 */
					(player, value) => {
						player.scoreboard.setScore(world.scoreboard.getObjective('testScore'), value);
					}
			}, 100, world.getAllPlayers()[0], Math.floor(Math.random() * 100)));
	}
});