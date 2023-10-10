import loads from "../load.js";
import { Player as PlayerType, Vector, EquipmentSlot, world, ContainerSlot } from "@minecraft/server";
import players from "../players/export_instance.js";
import scoreboardBuilder from "../scoreboard.js";
import gamemode, { gamemodeIndexMap } from "../gamemode.js";
import propertyBuilder from "../property/export_instance.js";
const player = world.getAllPlayers()[0];
const armorSlots = [
    EquipmentSlot.feet,
    EquipmentSlot.legs,
    EquipmentSlot.chest,
    EquipmentSlot.head
];
export class Player {
    constructor(player) {
        /**
         * @type {PlayerType}
         */
        this.root = player;
    }
    addExperience(...args) {
        return this.root.addExperience(...args);
    }
    get gamemode() {
        return gamemode.get(this);
    }
    set gamemode(value) {
        this.root.runCommandAsync(`gamemode ${gamemodeIndexMap[value]}`);
    }
    get loaded() {
        const { id } = this.root;
        return loads.loads.hasOwnProperty(id);
    }
    get offhand() {
        const { selectedSlot } = this.root;
        const equipmentInventory = this.getComponent('equipment_inventory');
        return equipmentInventory.getEquipmentSlot(EquipmentSlot.offhand);
    }
    get mainHand() {
        const { selectedSlot } = this.root;
        const container = this.getComponent('minecraft:inventory').container;
        return container.getSlot(selectedSlot);
    }
    set mainHand(value) {
        const { selectedSlot } = this.root;
        const container = this.getComponent('inventory').container;
        container.setItem(selectedSlot, (value instanceof ContainerSlot) ? value.getItem() : value);
    }
    get container() {
        return this.getComponent('inventory').container;
    }
    get inventory() {
        return players.getInventory(this);
    }
    get scores() {
        const player = this;
        return new Proxy({}, {
            get(target, objectiveId) {
                const value = scoreboardBuilder.get(player, objectiveId);
                // if (objectiveId === 'skycoins') content.warn({ t: 'get', objectiveId, value });
                return value;
            },
            set(target, objectiveId, value, receiver) {
                scoreboardBuilder.set(player, objectiveId, value);
                // content.warn({ t: 'set', objectiveId, value });
                return Reflect.set(target, objectiveId, value, receiver);
            }
        });
    }
    get properties() {
        return propertyBuilder.get(this.root);
    }
    get memory() {
        const player = this.root;
        const { id } = player;
        if (!players.memory.hasOwnProperty(id))
            players.memory[id] = {};
        return new Proxy(players.memory[id], {
            get(target, identifier) {
                return players.memory?.[id]?.[identifier];
            },
            set(target, identifier, value, receiver) {
                players.memory[id][identifier] = value;
                return Reflect.set(target, identifier, value, receiver);
            },
            has(target, key) {
                return key in players.memory[id];
            }
        });
    }
    get dimension() {
        return this.root.dimension;
    }
    get headLocation() {
        return this.root.getHeadLocation();
    }
    get id() {
        return this.root.id;
    }
    get isSneaking() {
        return this.root.isSneaking;
    }
    get isGliding() {
        return this.root.isGliding;
    }
    get isJumping() {
        return this.root.isJumping;
    }
    get fallDistance() {
        return this.root.fallDistance;
    }
    get isClimbing() {
        return this.root.isClimbing;
    }
    get isFlying() {
        return this.root.isFlying;
    }
    get isInWater() {
        return this.root.isInWater;
    }
    get isOnGround() {
        return this.root.isOnGround;
    }
    get isSprinting() {
        return this.root.isSprinting;
    }
    get isFalling() {
        return this.root.isSprinting;
    }
    get isSwimming() {
        return this.root.isSwimming;
    }
    get lifetimeState() {
        return this.root.lifetimeState;
    }
    isValid() {
        return this.root.isValid();
    }
    get level() {
        return this.root.level;
    }
    get location() {
        return this.root.location;
    }
    get name() {
        return this.root.name;
    }
    get nameTag() {
        return this.root.nameTag;
    }
    set nameTag(value) {
        this.root.nameTag = value;
    }
    get onScreenDisplay() {
        return this.root.onScreenDisplay;
    }
    get rotation() {
        return this.root.getRotation();
    }
    get scoreboard() {
        return this.root.scoreboardIdentity;
    }
    get scoreboardIdentity() {
        return this.root.scoreboardIdentity;
    }
    get selectedSlot() {
        return this.root.selectedSlot;
    }
    set selectedSlot(value) {
        this.root.selectedSlot = value;
    }
    get totalXpNeededForNextLevel() {
        return this.root.totalXpNeededForNextLevel;
    }
    get xpEarnedAtCurrentLevel() {
        return this.root.xpEarnedAtCurrentLevel;
    }
    get target() {
        return this.root.target;
    }
    get typeId() {
        return this.root.typeId;
    }
    get velocity() {
        return this.root.getVelocity();
    }
    get viewVector() {
        const { x, y, z } = this.root.getViewDirection();
        return new Vector(x, y, z);
    }
    get viewDirection() {
        return this.root.getViewDirection();
    }
    applyDamage(...args) {
        return this.root.applyDamage(...args);
    }
    applyImpulse(...args) {
        return this.root.applyImpulse(...args);
    }
    applyKnockback(...args) {
        return this.root.applyKnockback(...args);
    }
    addEffect(...args) {
        return this.root.addEffect(...args);
    }
    addLevels(...args) {
        return this.root.addLevels(...args);
    }
    clearSpawn() {
        return this.root.setSpawnPoint();
    }
    clearVelocity() {
        return this.root.clearVelocity();
    }
    addTag(...args) {
        return this.root.addTag(...args);
    }
    extinguishFire(...args) {
        return this.root.extinguishFire(...args);
    }
    getBlockFromViewVector(...args) {
        return this.root.getBlockFromViewDirection(...args);
    }
    getBlockFromViewDirection(...args) {
        return this.root.getBlockFromViewDirection(...args);
    }
    getComponent(componentId) {
        return this.root.getComponent(componentId);
    }
    getComponents(...args) {
        return this.root.getComponents(...args);
    }
    getDynamicProperty(...args) {
        return this.root.getDynamicProperty(...args);
    }
    getEffect(...args) {
        return this.root.getEffect(...args);
    }
    getEffects(...args) {
        return this.root.getEffects(...args);
    }
    getEntitiesFromViewVector(...args) {
        return this.root.getEntitiesFromViewDirection(...args);
    }
    getEntitiesFromViewDirection(...args) {
        return this.root.getEntitiesFromViewDirection(...args);
    }
    getHeadLocation(...args) {
        return this.root.getHeadLocation(...args);
    }
    getItemCooldown(...args) {
        return this.root.getItemCooldown(...args);
    }
    getRotation() {
        return this.root.getRotation();
    }
    getSpawnPoint() {
        return this.root.getSpawnPoint();
    }
    getSpawnPosition() {
        return this.root.getSpawnPoint();
    }
    getTags(...args) {
        return this.root.getTags(...args);
    }
    getTotalXp() {
        return this.root.getTotalXp();
    }
    getVelocity() {
        return this.root.getVelocity();
    }
    getViewDirection() {
        return this.root.getViewDirection();
    }
    hasComponent(...args) {
        return this.root.hasComponent(...args);
    }
    hasTag(...args) {
        return this.root.hasTag(...args);
    }
    isOp(...args) {
        return this.root.isOp(...args);
    }
    kill(...args) {
        return this.root.kill(...args);
    }
    playAnimation(...args) {
        return this.root.playAnimation(...args);
    }
    playSound(...args) {
        return this.root.playSound(...args);
    }
    postClientMessage(...args) {
        return this.root.postClientMessage(...args);
    }
    removeEffect(...args) {
        return this.root.removeEffect(...args);
    }
    removeAllEffects() {
        return this.root.getEffects().forEach(({ typeId }) => this.root.removeEffect(typeId));
    }
    removeDynamicProperty(...args) {
        return this.root.removeDynamicProperty(...args);
    }
    removeTag(...args) {
        return this.root.removeTag(...args);
    }
    resetLevel(...args) {
        return this.root.resetLevel(...args);
    }
    runCommandAsync(...args) {
        return this.root.runCommandAsync(...args);
    }
    runCommand(...args) {
        return this.root.runCommand(...args);
    }
    setDynamicProperty(...args) {
        return this.root.setDynamicProperty(...args);
    }
    setOnFire(...args) {
        return this.root.setOnFire(...args);
    }
    setOp(...args) {
        return this.root.setOp(...args);
    }
    setRotation(...args) {
        return this.root.setRotation(...args);
    }
    setSpawn(...args) {
        return this.root.setSpawnPoint(...args);
    }
    setSpawnPoint(...args) {
        return this.root.setSpawnPoint(...args);
    }
    startItemCooldown(...args) {
        return this.root.startItemCooldown(...args);
    }
    teleport(...args) {
        return this.root.teleport(...args);
    }
    tryTeleport(...args) {
        return this.root.tryTeleport(...args);
    }
    sendMessage(...args) {
        return this.root.sendMessage(...args);
    }
    tell(...args) {
        return this.root.sendMessage(...args);
    }
    triggerEvent(...args) {
        return this.root.triggerEvent(...args);
    }
}
export function setProptotype(entity) {
    if (!(entity instanceof PlayerType))
        return entity;
    return new Player(entity);
}
//# sourceMappingURL=class.js.map