var _ChestFormData_titleText, _ChestFormData_buttonArray;
import { ActionFormData } from '@minecraft/server-ui';
import { typeIdToID } from "./type_ids.js";
//thanks to Herobrine643928,LeGend07, and Aexx66
const number_of_1_16_100_items = 0;
const sizes = new Map([
    ['single', [`§c§h§e§s§t§s§m§a§l§l§r`, 27]], ['double', [`§c§h§e§s§t§l§a§r§g§e§r`, 54]],
    ['small', [`§c§h§e§s§t§s§m§a§l§l§r`, 27]], ['large', [`§c§h§e§s§t§l§a§r§g§e§r`, 54]]
]);
class ChestFormData {
    constructor(size = 'small') {
        _ChestFormData_titleText.set(this, void 0);
        _ChestFormData_buttonArray.set(this, void 0);
        const sizing = (sizes.get(size) ?? [`§c§h§e§s§t§s§m§a§l§l§r`, 27]);
        /** @internal */
        __classPrivateFieldSet(this, _ChestFormData_titleText, sizing[0], "f");
        /** @internal */
        __classPrivateFieldSet(this, _ChestFormData_buttonArray, [], "f");
        this.availableButtons = Array.from(Array(sizing[1]), (a, i) => i);
        for (let i = 0; i < sizing[1]; i++)
            __classPrivateFieldGet(this, _ChestFormData_buttonArray, "f").push(['', undefined]);
    }
    title(text) {
        __classPrivateFieldSet(this, _ChestFormData_titleText, __classPrivateFieldGet(this, _ChestFormData_titleText, "f") + text, "f");
        return this;
    }
    button(slot, itemName, itemDesc, iconPath = "", stackSize = 1, enchanted = false) {
        slot ??= this.availableButtons[0];
        if (!slot)
            throw new Error('Chest Form Data Full');
        this.availableButtons = this.availableButtons.filter((s) => s !== slot);
        const ID = typeIdToID.get(iconPath.includes(':') ? iconPath : 'minecraft:' + iconPath) ?? -1;
        __classPrivateFieldGet(this, _ChestFormData_buttonArray, "f").splice(slot, 1, [`stack#${Math.min(Math.max(stackSize, 1) || 1, 99).toString().padStart(2, '0')}§r${itemName ?? ''}§r${itemDesc?.length ? `\n§r${itemDesc.join('\n§r')}` : ''}`, (((ID + (ID < 256 ? 0 : number_of_1_16_100_items)) * 65536) + (((!!enchanted) ? 1 : 0) * 32768)) || iconPath]);
        return this;
    }
    pattern(from, pattern, key) {
        for (let i = 0; i < pattern.length; i++) {
            const row = pattern[i];
            for (let j = 0; j < row.length; j++) {
                const letter = row.charAt(j);
                if (key[letter]) {
                    const slot = from[1] + j + (from[0] + i) * 9; // Calculate slot index
                    const data = key[letter].data;
                    const icon = key[letter].iconPath;
                    const ID = typeIdToID.get(icon.includes(':') ? icon : 'minecraft:' + icon) ?? -1;
                    __classPrivateFieldGet(this, _ChestFormData_buttonArray, "f").splice(slot, 1, [`stack#${Math.min(Math.max(data?.stackSize ?? 1, 1) || 1, 99).toString().padStart(2, '0')}§r${data?.itemName ?? ''}§r${data?.itemDesc?.length ? `\n§r${data?.itemDesc.join('\n§r')}` : ''}`,
                        (((ID + (ID < 256 ? 0 : number_of_1_16_100_items)) * 65536) + (((!!data?.enchanted) ? 1 : 0) * 32768)) || icon
                    ]);
                }
            }
        }
        return this;
    }
    show(player) {
        const form = new ActionFormData()
            .title(__classPrivateFieldGet(this, _ChestFormData_titleText, "f"));
        __classPrivateFieldGet(this, _ChestFormData_buttonArray, "f").forEach(button => {
            form.button(button[0], button[1]?.toString());
        });
        return form.show(player?.player ?? player);
    }
}
_ChestFormData_titleText = new WeakMap(), _ChestFormData_buttonArray = new WeakMap();
export { ChestFormData };
//# sourceMappingURL=class.js.map