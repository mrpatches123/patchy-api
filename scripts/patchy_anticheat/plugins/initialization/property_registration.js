import { propertyBuilder, content } from '../../../patchy_api/modules.js';

propertyBuilder.register({
	anticheat: {
		modules: {
			kick: 'boolean',
			give: 'boolean',
			gamemode: 'boolean',
			nuker: 'boolean',
			cbe: 'boolean',
			stacker: 'boolean',
			itemChangeLog: 'boolean',
			// use32k: 'boolean',
			crasher: 'boolean',
			nbt: 'boolean',
			// nameSpoof: 'boolean',
		},
		flagsKick: {
			nameSpoof: 'number',
			give: 'number',
			stack: 'number',
			gamemode: 'number',
			nuker: 'number',
			cbe: 'number',
			crasher: 'number',
			nbt: 'number',
		},
		survival: 'boolean',
		creative: 'boolean',
		adventure: 'boolean',
		kicksBanS: 'number',
		// crap: ['string', 7]//string
	}
});
content.warn({ t: "test1", propertyBuilder });