
import { formBuilder, global, content, staff } from '../../patchy_api/modules.js';

formBuilder.create('showInv', {
    action: () => {
        let array = [];
        global.players.forEach(playerSelected => {
            array.push({
                button: {
                    text: playerSelected.name,

                },
                callback: (sender) => {
                    const { name } = sender;
                    const playerName = playerSelected.name;
                    console.warn(playerName);
                    sender.tell(`§l§f[§9PAC§f] §7you §fcan now §cView §7the §1Inventory§f of §7${playerName}!`);
                    staff.tellraw(`§l§f[§9PAC§f] §7${name} §cViewed §7the §1Inventory§f of §7${playerName}!`, sender);

                    if (playerSelected) {
                        const entity = sender.dimension.spawnEntity('patches:inventory', sender.headLocation);
                        entity.nameTag = `Someone's Inventory_36`;
                        entity.addTag('player');
                        const playerInventory = playerSelected.getComponent('minecraft:inventory').container;
                        const entityInventory = entity.getComponent('minecraft:inventory').container;
                        for (let i = 0; i < playerInventory.size; i++) {
                            const item = playerInventory.getItem(i);
                            if (!item) { continue; }
                            if (i >= 9) {
                                entityInventory.setItem(i - 9, item);
                            } else {
                                entityInventory.setItem(i + 27, item);
                            }
                        }
                    }
                }
            });
        });
        content.warn({ array });
        return array;
    }
});