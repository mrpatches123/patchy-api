
import { eventBuilder, parseCommand, Player } from "patchy_api/modules";

eventBuilder.subscribe('scriptEvent', {
	scriptEventReceive: (event) => {
		const { sourceEntity, message, id } = event;
		if (!(sourceEntity instanceof Player)) return;
		const args = parseCommand(message, '');
		switch (id) {
			case 'patches:staff': {
				const [value] = args;
				const scoreValue = Number(value);
				sourceEntity.scores.scoreValue = scoreValue;
				sourceEntity.sendMessage(`§aSet your staff score to ${scoreValue}`);
				break;
			}
		}
	}
});