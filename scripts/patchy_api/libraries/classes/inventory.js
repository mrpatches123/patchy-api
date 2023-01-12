import { world, ItemStack, , Items } from "@minecraft/server";
import { content, native, toProperCase, lockedItemKey } from "../utilities.js";
import eventBuilder from "./events/export_instance.js";
import global from './global.js';
const air = new ItemStack(Items.get('air'), 0, 0);
const itemTest = new ItemStack(Items.get('apple'), 5, 0);
const defaultObject = {
    item: air,
    restock: true
};

let j = 0;
class InventoryBuilder {
    constructor() {
        eventBuilder.subscribe(`inventoryDelete`, {
            tick: () => {
                const { players, playerMap, playerIds } = global;
                players.forEach(player => {
                    const { name } = player;
                    const { items, inventory: playerInventory } = playerMap[name];
                    items.forEach((item, i) => {
                        if (!item) { return; }
                        const { nameTag } = item;
                        if (nameTag && nameTag.includes('§1§a§s§w§A')) {
                            playerInventory.setItem(i, air);
                        }
                    });
                });
                const enttites = world.getEntities(Object.assign(new EntityQueryOptions(), { type: 'patches:inventory_class' }));
                enttites.forEach(entity => {
                    if (entity) {
                        // content.warn({ tags: entity.getTags() });
                        const playerId = Number(entity.getTags().find(tag => Object.keys(playerIds).includes(tag)));
                        // content.warn({playerId,pIDS: Object.keys(playerIds), lats: playerMap[playerIds[playerId]].lastInventory});
                        if (!playerMap[playerIds[playerId]]?.lastInventory) {
                            entity.triggerEvent('patches:kill_inv_class');
                            console.warn('killed');
                        }
                    }

                });
            },
            entityCreate: ({ entity }) => {
                if (entity?.id === 'minecraft:item') {
                    const { nameTag } = entity.getComponent('item');
                    if (nameTag && nameTag.includes('§1§a§s§w§A')) {
                        entity.kill();
                    }
                }
            }
        });
    }
    getItems(inventory) {
        // content.warn(crap.map(object => native.stringify(object)));
        return Array.from(Array(inventory.size), (item, i) => inventory.getItem(i));
    }
    show(player, key, nameTag, ...extraArgs) {
        // content.warn({ extraArgs });
        const { headLocation, dimension, name } = player;
        const { scoreObject, playerMap } = global;
        const { playerId } = scoreObject[name];
        eventBuilder.unsubscribeAll(`${playerId}Inventory`);
        content.warn(eventBuilder.tick[`${playerId}Inventory`]);
        let { lastInventory } = playerMap[name];
        global.playerMap[name].lastInventory = key;

        if (lastInventory !== key) {
            let entity = this.teleport(player, nameTag);
            let inventory = entity.getComponent('minecraft:inventory').container;
            content.warn({ inventory: native.stringify(inventory.getArray()) });
            const object = this[key]['manual'];
            const objectGenerated = this.generate(object, player, ...extraArgs);
            for (let i = 0; i < inventory.size; i++) {
                inventory.setItem(i, air);
                const slotObject = objectGenerated[i] ?? objectGenerated['empty'] ?? defaultObject;
                const { item: slotItem } = slotObject;
                inventory.setItem(i, slotItem);
                // content.warn({ i, item: native.stringify(inventory.getItem(i)) });
            }
            // content.warn({ item: native.stringify(inventory.getArray()) });
            eventBuilder.subscribe(`${playerId}Inventory`, {
                tick: () => {
                    const objectGenerated = this.generate(object, player, ...extraArgs);
                    let entity = this.teleport(player, nameTag);
                    let inventory = entity.getComponent('minecraft:inventory').container;


                    const { lastObjectGenerated = objectGenerated } = global.playerMap[name];
                    // content.warn({ i, item: native.stringify(inventory.getArray()) });

                    // content.warn({ objectGenerated: typeof object, prototyep: objectGenerated[13].item instanceof ItemStack, item: objectGenerated[13].item.nameTag, lastItem: lastObjectGenerated[13].item.nameTag, /*bool: objectGenerated[13].equalsItemStack(lastObjectGenerated[13], false*/ });
                    for (let i = 0; i < inventory.size; i++) {
                        const item = inventory.getItem(i);
                        let slotObject = objectGenerated[i];
                        if (!slotObject && objectGenerated['other']) {
                            const { callback, slotItem, restock } = objectGenerated['other'];
                            if (!slotItem) {
                                if (item) {
                                    if (callback) {
                                        callback(player, inventory, i, item, ...extraArgs);
                                    }
                                    if (restock) {
                                        inventory.setItem(i, air);
                                    }
                                }
                            } else {
                                if (!item || !item.equalsItemStack(slotItem, false)) {
                                    if (callback) {
                                        callback(player, inventory, i, item, ...extraArgs);
                                    }
                                    if (restock) {
                                        inventory.setItem(i, slotItem);
                                    }
                                }
                            }

                            continue;
                        } else if (!slotObject) {
                            slotObject = objectGenerated['empty'] ?? defaultObject;
                        }

                        const { callback, restock = false, locked = false, lockedCallback = false, item: slotItem } = slotObject;
                        if ((objectGenerated[i] ?? objectGenerated['empty']) && !slotItem.equalsItemStack(lastObjectGenerated[i]?.item, false)) {
                            // content.warn({ i, help: 'hwdhdwwjkwdjk' });
                            inventory.setItem(i, slotItem);
                            continue;
                        }
                        if (locked || lockedCallback) {
                            if (!slotItem.nameTag || !slotItem.nameTag.includes(lockedItemKey)) {
                                if (!slotItem.nameTag) {
                                    slotItem.nameTag = toProperCase(slotItem.id.replace(/\w+:|_/g, ''));
                                }
                                slotItem.nameTag += lockedItemKey;
                                inventory.setItem(i, slotItem);
                            }
                            if (!lockedCallback) {
                                inventory.setItem(i, slotItem);
                                continue;
                            }
                        }

                        if (!item || !item.equalsItemStack(slotItem, false)) {
                            if (typeof callback === 'function') {
                                callback(player, i, ...extraArgs);
                                if (item) {
                                    content.warn({ slot: i, und: !item, notE: !item.equalsItemStack(slotObject.item) });
                                } else {
                                    content.warn({ slot: i, und: !item, notE: 'nope' });
                                }
                            }
                            if (restock || lockedCallback) {
                                inventory.setItem(i, slotItem);
                            }
                            if (lockedCallback) {
                                player.clearCrossHare(slotItem.id);
                            }
                        }

                    }
                    global.playerMap[name].lastObjectGenerated = objectGenerated;


                }
            });
            global.playerMap[name].lastObjectGenerated = objectGenerated;

        }
    }
    create(key, object) {
        this[key] = object;
    }
    teleport(player, nameTag = 'Inventory Entity') {
        let entity;
        const { headLocation, name, dimension } = player;
        const { playerId } = global.scoreObject[name];
        const entites = world.getEntities(Object.assign(new EntityQueryOptions(), { type: 'patches:inventory_class', tags: [playerId.toString()] }));

        entites.forEach((entity, i) => {
            // if (entity && i) {
            //     content.warn('kilelkdkjwjqjk')
            //     entity.triggerEvent('patches:kill_inv_class');
            // }

        });
        ;
        entity = entites[0];
        // content.warn({ bool: !entity, i: j, L: native.toObject(entity?.location) });
        if (!entity) {
            entity = dimension.spawnEntity('patches:inventory_class', headLocation);
            entity.addTag(playerId.toString());
            entity.nameTag = nameTag.toString();
        } else {
            // content.warn({ a: 'jejeje', i: j, L: native.toObject(entity.location) });

            entity.teleport(headLocation, dimension, ...player.rot(true));
        }
        // content.warn({ i: j, L: native.toObject(entity.location) });
        return entity;
    }
    generate(object, player, ...extraArgs) {
        if (typeof object === 'function') {
            return object(player, ...extraArgs);
        } else {
            return object;
        }
    }
    close(player) {
        const { name, headLocation } = player;
        if (global.playerMap[name]?.lastInventory) {
            const { playerId } = global.scoreObject[name];
            const enttites = world.getEntities(Object.assign(new EntityQueryOptions(), { type: 'patches:inventory_class', tags: [playerId.toString()] }));
            enttites.forEach(entity => {
                if (entity) {
                    entity.triggerEvent('patches:kill_inv_class');
                }
            });

            eventBuilder.unsubscribeAll(`${playerId}Inventory`);
            global.playerMap[name].lastInventory = undefined;
        }
    }
}

const inventoryBuilder = new InventoryBuilder();
export default inventoryBuilder;


// const array1 = ['A', 'B', 'C', 'D', 'E', 'F'];


// function radial({ items = 1, size: { x = 9, y = 3 } = {} } = {}) {
//   const slots = [];
//   const slotsTop = [];
//   const slotsBottom = [];
//   const center = { x: Math.ceil(x / 2), y: Math.ceil(y / 2) };
//   // console.log(center);
//   slots.push(Math.floor(y / 2) * x + center.x - 1);
//   for (let i = 1, m = 0, a = 1; i < items; i++, m++) {
//     if (m === 0) {
//       slots.push((slots[slots.length - 2] ?? slots[0]) + 1);
//     } else if (m === 1) {
//       slots.push(slots[slots.length - 2] - 1);
//     } else if (m === 2) {
//       slotsBottom.push(slots[slots.length - 3] - 9);
//     } else {
//       slotsTop.push(slots[slots.length - 3] + 9);
//       m = -1;
//     }

//   }
//   return { slotsBottom, slots, slotsTop };
// }
// // console.log(radial({ items: 23 }));
