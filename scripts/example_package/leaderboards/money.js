import { leaderboardBuilder } from "../../patchy_api/modules.js";
leaderboardBuilder.create({
	type: 'offline',
	objective: 'money',
	formating: [
		'§5#${#} §7${name} - §1${score*f}§r',
		'§d#${#} §7${name} - §1${score*f}§r',
		'§6#${#} §7${name} - §1${score*f}§r',
	],
	title: 'Money Test LB',
	location: { x: 190.5, y: 105.5, z: 216.5 },
	maxLength: 3,
});