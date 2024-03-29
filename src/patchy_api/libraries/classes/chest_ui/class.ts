import { ActionFormData } from '@minecraft/server-ui';
import { typeIdToID } from "./type_ids.js";
import { Player } from '../player/class.js';
//thanks to Herobrine643928,LeGend07, and Aexx66
const number_of_1_16_100_items = 365;
export type sizesUnion = 'single' | 'double' | 'small' | 'large';
const sizes = new Map([
	['single', [`§c§h§e§s§t§s§m§a§l§l§r`, 27]], ['double', [`§c§h§e§s§t§l§a§r§g§e§r`, 54]],
	['small', [`§c§h§e§s§t§s§m§a§l§l§r`, 27]], ['large', [`§c§h§e§s§t§l§a§r§g§e§r`, 54]]
]);
class ChestFormData {
	private titleText: string;
	private buttonArray: [string, string | number | undefined][];
	private availableButtons: number[];
	constructor(size = 'small') {
		const sizing = (sizes.get(size) ?? [`§c§h§e§s§t§s§m§a§l§l§r`, 27]) as [string, number];
		this.titleText = sizing[0];
		this.buttonArray = [];
		this.availableButtons = Array.from(Array(sizing[1]), (a, i) => i);
		for (let i = 0; i < sizing[1]; i++)
			this.buttonArray.push(['', undefined]);
	}
	title(text: string): this {
		this.titleText += text;
		return this;
	}
	button(slot?: number, itemName?: string, itemDesc?: string[], iconPath: string = "", stackSize = 1, enchanted = false) {
		slot ??= this.availableButtons[0];
		if (slot === undefined) throw new Error('Chest Form Data Full');
		this.availableButtons = this.availableButtons.filter((s) => s !== slot);
		const ID = typeIdToID.get(iconPath.includes(':') ? iconPath : 'minecraft:' + iconPath) ?? -1;
		this.buttonArray.splice(slot, 1, [`stack#${Math.min(Math.max(stackSize, 1) || 1, 99).toString().padStart(2, '0')}§r${itemName ?? ''}§r${itemDesc?.length ? `\n§r${itemDesc.join('\n§r')}` : ''}`, (((ID + (ID < 256 ? 0 : number_of_1_16_100_items)) * 65536) + (((!!enchanted) ? 1 : 0) * 32768)) || iconPath]);
		return this;
	}
	pattern(from: [number, number], pattern: string[], key: { [key: string]: { data: { itemName?: string, itemDesc?: string[], stackSize?: number, enchanted?: boolean; }, iconPath: string; }; }): this {
		for (let i = 0; i < pattern.length; i++) {
			const row = pattern[i]!;
			for (let j = 0; j < row.length; j++) {
				const letter = row.charAt(j);
				if (key[letter]) {
					const slot = from[1] + j + (from[0] + i) * 9; // Calculate slot index
					const data = key[letter]!.data;
					const icon = key[letter]!.iconPath;
					const ID = typeIdToID.get(icon.includes(':') ? icon : 'minecraft:' + icon) ?? -1;
					this.buttonArray.splice(slot, 1, [`stack#${Math.min(Math.max(data?.stackSize ?? 1, 1) || 1, 99).toString().padStart(2, '0')}§r${data?.itemName ?? ''}§r${data?.itemDesc?.length ? `\n§r${data?.itemDesc.join('\n§r')}` : ''}`,
					(((ID + (ID < 256 ? 0 : number_of_1_16_100_items)) * 65536) + (((!!data?.enchanted) ? 1 : 0) * 32768)) || icon
					]);
				}
			}
		}
		return this;
	}
	show(player: Player) {
		const form = new ActionFormData()
			.title(this.titleText);
		this.buttonArray.forEach(button => {
			form.button(button[0] as string, button[1]?.toString());
		});
		return form.show((player as any)?.player ?? player);
	}
}

export { ChestFormData };