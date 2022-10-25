import './libraries/prototypes/imports.js';
import "./libraries/utilities.js";
import global from './libraries/classes/global.js';




global.tickTime = {};
global.tickTime.tick = {};
global.deltaTimeArray = [];
global.playerMap = {};


// import { overworld } from './libraries/utilities.js';
// import { BlockLocation, world } from '@minecraft/server';
// const block0 = overworld.getBlock(new BlockLocation(166, 94, -97));
// const block1 = overworld.getBlock(new BlockLocation(165, 95, -97));
import { Player } from '@minecraft/server';
import { ModalFormData, ActionFormData, MessageFormData, ModalFormResponse, ActionFormResponse, MessageFormResponse } from '@minecraft/server-ui';
/**
 * @function forceOpen
 * @param {Player} player 
 * @param {ModalFormData | ActionFormData | MessageFormData} form 
 * @returns {Promise<ModalFormResponse | ActionFormResponse | MessageFormResponse>}
 */
async function forceOpen(player, form) {
	while (true) {
		const response = await form.show(player);
		if (response.cancelationReason !== "userBusy") return response;
	}
}