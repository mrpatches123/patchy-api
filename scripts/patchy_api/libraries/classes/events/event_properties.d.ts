export default eventTypeProperties;
declare namespace eventTypeProperties {
    namespace scriptEventReceive {
        let playerKey: string;
        let playerOnly: boolean;
    }
    namespace beforeChatSend {
        export let modifiables: string[];
        let playerKey_1: string;
        export { playerKey_1 as playerKey };
        let playerOnly_1: boolean;
        export { playerOnly_1 as playerOnly };
    }
    namespace beforeDataDrivenEntityTriggerEvent {
        let modifiables_1: string[];
        export { modifiables_1 as modifiables };
        export let entityEvent: boolean;
        let playerKey_2: string;
        export { playerKey_2 as playerKey };
        let playerOnly_2: boolean;
        export { playerOnly_2 as playerOnly };
    }
    namespace beforeDataDrivenPlayerTriggerEvent {
        let modifiables_2: string[];
        export { modifiables_2 as modifiables };
        let entityEvent_1: boolean;
        export { entityEvent_1 as entityEvent };
        let playerKey_3: string;
        export { playerKey_3 as playerKey };
        let playerOnly_3: boolean;
        export { playerOnly_3 as playerOnly };
    }
    namespace beforeExplosion {
        let modifiables_3: string[];
        export { modifiables_3 as modifiables };
        let playerKey_4: string;
        export { playerKey_4 as playerKey };
        let playerOnly_4: boolean;
        export { playerOnly_4 as playerOnly };
    }
    namespace beforeItemDefinitionEvent {
        let modifiables_4: string[];
        export { modifiables_4 as modifiables };
        let playerKey_5: string;
        export { playerKey_5 as playerKey };
        let playerOnly_5: boolean;
        export { playerOnly_5 as playerOnly };
    }
    namespace beforeItemUse {
        let modifiables_5: string[];
        export { modifiables_5 as modifiables };
        let playerKey_6: string;
        export { playerKey_6 as playerKey };
        let playerOnly_6: boolean;
        export { playerOnly_6 as playerOnly };
    }
    namespace beforeItemUseOn {
        let modifiables_6: string[];
        export { modifiables_6 as modifiables };
        let playerKey_7: string;
        export { playerKey_7 as playerKey };
        let playerOnly_7: boolean;
        export { playerOnly_7 as playerOnly };
    }
    namespace beforePistonActivate {
        let modifiables_7: string[];
        export { modifiables_7 as modifiables };
    }
    namespace beforePlayerScaffoldPlace {
        let custom: boolean;
    }
    namespace beforeWatchdogTerminate {
        let modifiables_8: string[];
        export { modifiables_8 as modifiables };
    }
    namespace blockBreak {
        let playerKey_8: string;
        export { playerKey_8 as playerKey };
        let playerOnly_8: boolean;
        export { playerOnly_8 as playerOnly };
    }
    namespace blockExplode {
        let playerKey_9: string;
        export { playerKey_9 as playerKey };
        let playerOnly_9: boolean;
        export { playerOnly_9 as playerOnly };
    }
    namespace blockPlace {
        let playerKey_10: string;
        export { playerKey_10 as playerKey };
        let playerOnly_10: boolean;
        export { playerOnly_10 as playerOnly };
    }
    namespace buttonPush {
        let playerKey_11: string;
        export { playerKey_11 as playerKey };
        let playerOnly_11: boolean;
        export { playerOnly_11 as playerOnly };
    }
    namespace chatSend {
        let playerKey_12: string;
        export { playerKey_12 as playerKey };
        let playerOnly_12: boolean;
        export { playerOnly_12 as playerOnly };
    }
    namespace dataDrivenEntityTriggerEvent {
        let entityEvent_2: boolean;
        export { entityEvent_2 as entityEvent };
        let playerKey_13: string;
        export { playerKey_13 as playerKey };
        let playerOnly_13: boolean;
        export { playerOnly_13 as playerOnly };
    }
    namespace dataDrivenPlayerTriggerEvent {
        let entityEvent_3: boolean;
        export { entityEvent_3 as entityEvent };
        let playerKey_14: string;
        export { playerKey_14 as playerKey };
        let playerOnly_14: boolean;
        export { playerOnly_14 as playerOnly };
    }
    namespace effectAdd {
        let entityEvent_4: boolean;
        export { entityEvent_4 as entityEvent };
        let playerKey_15: string;
        export { playerKey_15 as playerKey };
        let playerOnly_15: boolean;
        export { playerOnly_15 as playerOnly };
    }
    namespace entityCreate {
        let entityEvent_5: boolean;
        export { entityEvent_5 as entityEvent };
        let playerKey_16: string;
        export { playerKey_16 as playerKey };
        let playerOnly_16: boolean;
        export { playerOnly_16 as playerOnly };
    }
    namespace entityDie {
        let entityEvent_6: boolean;
        export { entityEvent_6 as entityEvent };
        let playerKey_17: (string | {
            damageSource: string[];
        })[];
        export { playerKey_17 as playerKey };
        let playerOnly_17: boolean;
        export { playerOnly_17 as playerOnly };
    }
    namespace entityDeath {
        let entityEvent_7: boolean;
        export { entityEvent_7 as entityEvent };
        let playerKey_18: string;
        export { playerKey_18 as playerKey };
        let playerOnly_18: boolean;
        export { playerOnly_18 as playerOnly };
    }
    namespace entityHealthChanged {
        let playerKey_19: string;
        export { playerKey_19 as playerKey };
        let entityEvent_8: boolean;
        export { entityEvent_8 as entityEvent };
        let playerOnly_19: boolean;
        export { playerOnly_19 as playerOnly };
    }
    namespace entityHitBlock {
        let entityEvent_9: boolean;
        export { entityEvent_9 as entityEvent };
        let playerKey_20: string;
        export { playerKey_20 as playerKey };
        let playerOnly_20: boolean;
        export { playerOnly_20 as playerOnly };
    }
    namespace entityHitEntity {
        let entityEvent_10: boolean;
        export { entityEvent_10 as entityEvent };
        let playerKey_21: string[];
        export { playerKey_21 as playerKey };
        let playerOnly_21: boolean;
        export { playerOnly_21 as playerOnly };
    }
    namespace entityHurt {
        let entityEvent_11: boolean;
        export { entityEvent_11 as entityEvent };
        let playerKey_22: (string | {
            damageSource: string[];
        })[];
        export { playerKey_22 as playerKey };
        let playerOnly_22: boolean;
        export { playerOnly_22 as playerOnly };
    }
    namespace explosion {
        let entityEvent_12: boolean;
        export { entityEvent_12 as entityEvent };
        let playerKey_23: string;
        export { playerKey_23 as playerKey };
        let playerOnly_23: boolean;
        export { playerOnly_23 as playerOnly };
    }
    namespace itemCompleteCharge {
        let playerKey_24: string;
        export { playerKey_24 as playerKey };
        let playerOnly_24: boolean;
        export { playerOnly_24 as playerOnly };
    }
    namespace itemDefinitionEvent {
        let playerKey_25: string;
        export { playerKey_25 as playerKey };
        let playerOnly_25: boolean;
        export { playerOnly_25 as playerOnly };
    }
    namespace itemReleaseCharge {
        let playerKey_26: string;
        export { playerKey_26 as playerKey };
        let playerOnly_26: boolean;
        export { playerOnly_26 as playerOnly };
    }
    namespace itemStartCharge {
        let playerKey_27: string;
        export { playerKey_27 as playerKey };
        let playerOnly_27: boolean;
        export { playerOnly_27 as playerOnly };
    }
    namespace itemStartUseOn {
        let playerKey_28: string;
        export { playerKey_28 as playerKey };
        let playerOnly_28: boolean;
        export { playerOnly_28 as playerOnly };
    }
    namespace itemStopCharge {
        let playerKey_29: string;
        export { playerKey_29 as playerKey };
        let playerOnly_29: boolean;
        export { playerOnly_29 as playerOnly };
    }
    namespace itemStopUseOn {
        let playerKey_30: string;
        export { playerKey_30 as playerKey };
        let playerOnly_30: boolean;
        export { playerOnly_30 as playerOnly };
    }
    namespace itemUse {
        let playerKey_31: string;
        export { playerKey_31 as playerKey };
        let playerOnly_31: boolean;
        export { playerOnly_31 as playerOnly };
    }
    namespace itemUseOn {
        let playerKey_32: string;
        export { playerKey_32 as playerKey };
        let playerOnly_32: boolean;
        export { playerOnly_32 as playerOnly };
    }
    namespace itemPickup {
        let playerKey_33: string;
        export { playerKey_33 as playerKey };
        let playerOnly_33: boolean;
        export { playerOnly_33 as playerOnly };
    }
    namespace leverAction {
        let playerKey_34: string;
        export { playerKey_34 as playerKey };
        let playerOnly_34: boolean;
        export { playerOnly_34 as playerOnly };
    }
    let pistonActivate: {};
    namespace pressurePlatePush {
        let playerKey_35: string;
        export { playerKey_35 as playerKey };
        let playerOnly_35: boolean;
        export { playerOnly_35 as playerOnly };
    }
    namespace targetBlockHit {
        let playerKey_36: string;
        export { playerKey_36 as playerKey };
        let playerOnly_36: boolean;
        export { playerOnly_36 as playerOnly };
    }
    namespace tripWireTrip {
        let playerKey_37: string;
        export { playerKey_37 as playerKey };
        let playerOnly_37: boolean;
        export { playerOnly_37 as playerOnly };
    }
    namespace playerJoin {
        let playerKey_38: string;
        export { playerKey_38 as playerKey };
        let playerOnly_38: boolean;
        export { playerOnly_38 as playerOnly };
    }
    namespace playerLeave {
        let playerKey_39: string;
        export { playerKey_39 as playerKey };
        let playerOnly_39: boolean;
        export { playerOnly_39 as playerOnly };
    }
    namespace projectileHit {
        let entityEvent_13: boolean;
        export { entityEvent_13 as entityEvent };
    }
    namespace entitySpawn {
        let playerKey_40: string;
        export { playerKey_40 as playerKey };
        let playerOnly_40: boolean;
        export { playerOnly_40 as playerOnly };
    }
    namespace playerSpawn {
        let playerKey_41: string;
        export { playerKey_41 as playerKey };
        let playerOnly_41: boolean;
        export { playerOnly_41 as playerOnly };
    }
    namespace tick {
        let custom_1: boolean;
        export { custom_1 as custom };
    }
    let weatherChange: {};
    let worldInitialize: {};
    namespace tickAfterLoad {
        let custom_2: boolean;
        export { custom_2 as custom };
    }
    namespace playerJoined {
        let custom_3: boolean;
        export { custom_3 as custom };
        let playerKey_42: string;
        export { playerKey_42 as playerKey };
        let playerOnly_42: boolean;
        export { playerOnly_42 as playerOnly };
    }
    namespace playerJoinAwaitMove {
        let custom_4: boolean;
        export { custom_4 as custom };
    }
    namespace playerHit {
        let custom_5: boolean;
        export { custom_5 as custom };
        let playerKey_43: string;
        export { playerKey_43 as playerKey };
        let playerOnly_43: boolean;
        export { playerOnly_43 as playerOnly };
    }
    namespace playerHurt {
        let custom_6: boolean;
        export { custom_6 as custom };
        let playerKey_44: string;
        export { playerKey_44 as playerKey };
        let playerOnly_44: boolean;
        export { playerOnly_44 as playerOnly };
    }
    namespace playerDeath {
        let custom_7: boolean;
        export { custom_7 as custom };
        let playerKey_45: string;
        export { playerKey_45 as playerKey };
        let playerOnly_45: boolean;
        export { playerOnly_45 as playerOnly };
    }
    namespace playerSpawned {
        let custom_8: boolean;
        export { custom_8 as custom };
        let playerKey_46: string;
        export { playerKey_46 as playerKey };
        let playerOnly_46: boolean;
        export { playerOnly_46 as playerOnly };
    }
    namespace playerLeft {
        let custom_9: boolean;
        export { custom_9 as custom };
        let playerKey_47: string;
        export { playerKey_47 as playerKey };
        let playerOnly_47: boolean;
        export { playerOnly_47 as playerOnly };
    }
    namespace requestAdded {
        let custom_10: boolean;
        export { custom_10 as custom };
    }
    namespace worldLoad {
        let custom_11: boolean;
        export { custom_11 as custom };
    }
    namespace beforeChat {
        let custom_12: boolean;
        export { custom_12 as custom };
    }
    namespace chat {
        let custom_13: boolean;
        export { custom_13 as custom };
    }
    namespace scoreboardChange {
        let custom_14: boolean;
        export { custom_14 as custom };
        let playerKey_48: string;
        export { playerKey_48 as playerKey };
        let playerOnly_48: boolean;
        export { playerOnly_48 as playerOnly };
    }
    namespace beforeItemUseOnStart {
        let custom_15: boolean;
        export { custom_15 as custom };
    }
}
