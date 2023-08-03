import { Player } from "../player/class.js";
type status = 'failed' | 'completed' | 'requested';

export class FriendSystem {
	accept(receiver: Player, targetId: string, payload: string): void;
	remove(receiver: Player, targetId: string): void;
	removeWithRequest(receiver: Player, targetId: string): void;
	denyAddRequest(receiver: Player, targetId: string): void;
	requestAdd(receiver: Player, target: Player): void;
	add(receiver: Player, targetId: string, payload: Object): void;
	update(receiver: Player, property: string): void;
	updateSingle(receiver: Player, target: string, property: string): void;
	updateFromFriendObject(receiver: Player, target: { [id: string]: {}; }, property: string): void;
	getFriendData(receiver: Player): { saves?: { [property: string]: any; }, requests: { incoming: { [id: string]: {}; }, outgoing: { [id: string]: {}; }; }, mutal: { [id: string]: {}; }; };
	setFriendData(receiver: Player, data: { saves?: { [property: string]: any; }, requests: { incoming: { [id: string]: {}; }, outgoing: { [id: string]: {}; }; }, mutal: { [id: string]: {}; }; }): void;
	getProperties(receiver: Player): { [property: string]: any; };
}
export class FriendSystemBuilder {
	create(systemKey: string, data: {
		type: 'remote' | 'central';
		properties: {
			[key: string]: {
				get: (player: Player) => any,
				set: (player: Player, requesteeId: string, value: any) => any,
				init: (player: Player) => any;
			};
		};
	}): void;
	get(systemKey: string): FriendSystem;
}