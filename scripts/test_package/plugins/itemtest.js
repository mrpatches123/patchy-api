import { content, eventBuilder } from "../../patchy_api/modules";

eventBuilder.subscribe('itemTest', {
	itemStartUseOn: () => {
		content.warn('rannnnnnnnnnnnnnnn');
	}
});