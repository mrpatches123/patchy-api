import { world } from "@minecraft/server";
import { Player } from "../patchy_api/libraries/classes/player.js";
const playerConstiuctye = world.getAllPlayers()[0];
const player = new Player(playerConstiuctye);
const addRider = player.getComponent('addrider');