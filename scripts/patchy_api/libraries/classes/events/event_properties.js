const eventTypeProperties = {
    scriptEventReceive: {
        playerKey: 'sourceEntity',
        playerOnly: false
    },
    beforeChatSend: {
        modifiables: [
            'cancel',
            'message',
            'sendToTargets',
            'targets'
        ],
        playerKey: 'sender',
        playerOnly: true
    },
    beforeDataDrivenEntityTriggerEvent: {
        modifiables: [
            'cancel',
            'modifiers'
        ],
        entityEvent: true,
        playerKey: 'entity',
        playerOnly: false
    },
    beforeDataDrivenPlayerTriggerEvent: {
        modifiables: [
            'cancel',
            'modifiers'
        ],
        entityEvent: true,
        playerKey: 'player',
        playerOnly: true
    },
    beforeExplosion: {
        modifiables: [
            'cancel',
            'impactedBlocks'
        ],
        playerKey: 'source',
        playerOnly: false
    },
    beforeItemDefinitionEvent: {
        modifiables: [
            'cancel'
        ],
        playerKey: 'source',
        playerOnly: false
    },
    beforeItemUse: {
        modifiables: [
            'cancel'
        ],
        playerKey: 'source',
        playerOnly: false
    },
    beforeItemUseOn: {
        modifiables: [
            'cancel'
        ],
        playerKey: 'source',
        playerOnly: false
    },
    beforePistonActivate: {
        modifiables: [
            'cancel'
        ]
    },
    beforePlayerScaffoldPlace: {
        custom: true
    },
    beforeWatchdogTerminate: {
        modifiables: [
            'cancel'
        ]
    },
    blockBreak: {
        playerKey: 'player',
        playerOnly: true
    },
    blockExplode: {
        playerKey: 'source',
        playerOnly: false
    },
    blockPlace: {
        playerKey: 'player',
        playerOnly: true
    },
    buttonPush: {
        playerKey: 'source',
        playerOnly: false
    },
    chatSend: {
        playerKey: 'sender',
        playerOnly: true
    },
    dataDrivenEntityTriggerEvent: {
        entityEvent: true,
        playerKey: 'entity',
        playerOnly: false
    },
    dataDrivenPlayerTriggerEvent: {
        entityEvent: true,
        playerKey: 'player',
        playerOnly: true
    },
    effectAdd: {
        entityEvent: true,
        playerKey: 'source',
        playerOnly: false
    },
    entityCreate: {
        entityEvent: true,
        playerKey: 'source',
        playerOnly: false
    },
    entityDie: {
        entityEvent: true,
        playerKey: ['deadEntity', { damageSource: ['damagingEntity'] }],
        playerOnly: false
    },
    entityDeath: {
        entityEvent: true,
        playerKey: 'entity',
        playerOnly: false
    },
    entityHealthChanged: {
        playerKey: 'entity',
        entityEvent: true,
        playerKey: 'entity',
        playerOnly: false
    },
    entityHitBlock: {
        entityEvent: true,
        playerKey: 'damagingEntity',
        playerOnly: false
    },
    entityHitEntity: {
        entityEvent: true,
        playerKey: ['hitEntity', 'damagingEntity'],
        playerOnly: false
    },
    entityHurt: {
        entityEvent: true,
        playerKey: ['hurtEntity', { damageSource: ['damagingEntity'] }],
        playerOnly: false
    },
    explosion: {
        entityEvent: true,
        playerKey: 'source',
        playerOnly: false
    },
    itemCompleteCharge: {
        playerKey: 'source',
        playerOnly: false
    },
    itemDefinitionEvent: {
        playerKey: 'source',
        playerOnly: false,
    },
    itemReleaseCharge: {
        playerKey: 'source',
        playerOnly: false,
    },
    itemStartCharge: {
        playerKey: 'source',
        playerOnly: false,
    },
    itemStartUseOn: {
        playerKey: 'source',
        playerOnly: false,
    },
    itemStopCharge: {
        playerKey: 'source',
        playerOnly: false,
    },
    itemStopUseOn: {
        playerKey: 'source',
        playerOnly: false,
    },
    itemUse: {
        playerKey: 'source',
        playerOnly: false,
    },
    itemUseOn: {
        playerKey: 'source',
        playerOnly: false,
    },
    itemPickup: {
        playerKey: 'player',
        playerOnly: true,
    },
    leverAction: {
        playerKey: 'player',
        playerOnly: true
    },
    pistonActivate: {},
    pressurePlatePush: {
        playerKey: 'source',
        playerOnly: false
    },
    targetBlockHit: {
        playerKey: 'source',
        playerOnly: false
    },
    tripWireTrip: {
        playerKey: 'source',
        playerOnly: false
    },
    playerJoin: {
        playerKey: 'player',
        playerOnly: true
    },
    playerLeave: {
        playerKey: 'player',
        playerOnly: true
    },
    projectileHit: {
        entityEvent: true
    },
    entitySpawn: {
        playerKey: 'sourceEntity',
        playerOnly: false
    },
    playerSpawn: {
        playerKey: 'player',
        playerOnly: true
    },
    tick: {
        custom: true
    },
    weatherChange: {},
    worldInitialize: {},
    tickAfterLoad: {
        custom: true
    },
    playerJoined: {
        custom: true,
        playerKey: 'player',
        playerOnly: true
    },
    playerJoinAwaitMove: {
        custom: true,
    },
    playerHit: {
        custom: true,
        playerKey: 'player',
        playerOnly: true
    },
    playerHurt: {
        custom: true,
        playerKey: 'player',
        playerOnly: true
    },
    playerDeath: {
        custom: true,
        playerKey: 'player',
        playerOnly: true
    },
    playerSpawned: {
        custom: true,
        playerKey: 'player',
        playerOnly: true
    },
    playerLeft: {
        custom: true,
        playerKey: 'player',
        playerOnly: true
    },
    requestAdded: {
        custom: true
    },
    worldLoad: {
        custom: true
    },
    beforeChat: {
        custom: true
    },
    chat: {
        custom: true
    },
    scoreboardChange: {
        custom: true,
        playerKey: 'player',
        playerOnly: true
    },
    beforeItemUseOnStart: {
        custom: true
    },
};
export default eventTypeProperties;
//# sourceMappingURL=event_properties.js.map