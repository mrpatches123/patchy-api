import { BlockAreaSize, BlockLocation } from "@minecraft/server";
import { content, plotBuilder, PlotsVector3 } from "../../patchy_api/modules.js";
content.warn('buildBattlejkwdjwdjk', (new PlotsVector3(1, 0, 3)) instanceof PlotsVector3);
plotBuilder.create('buildBattle', {
	property: true,
	size: new BlockAreaSize(10, 100, 10),
	start: new BlockLocation(139, 96, 216),
	plotNumberIdentifier: 'plotNumber',
	ruleSets: [
		{
			count: 3,
			start: new PlotsVector3(1, 0, 2),
			direction: 'x'
		},
		{
			count: 5,
			start: new PlotsVector3(0, 0, 1),
			direction: 'x'
		},
		{
			count: 3,
			start: new PlotsVector3(1, 0, 0),
			direction: 'x'
		}
	]
});