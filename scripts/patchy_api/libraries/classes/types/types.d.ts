import { Player, BeforeChatEvent, BeforeDataDrivenEntityTriggerEvent, BeforeExplosionEvent, BeforeItemDefinitionTriggeredEvent, BeforeItemUseEvent, BeforeItemUseOnEvent, BeforePistonActivateEvent, BlockBreakEvent, BlockExplodeEvent, BlockPlaceEvent, ButtonPushEvent, ChatEvent, DataDrivenEntityTriggerEvent, EffectAddEvent, EntityCreateEvent, EntityHitEvent, EntityHurtEvent, ExplosionEvent, ItemCompleteChargeEvent, ItemDefinitionTriggeredEvent, ItemReleaseChargeEvent, ItemStartChargeEvent, ItemStartUseOnEvent, ItemStopChargeEvent, ItemStopUseOnEvent, ItemUseEvent, ItemUseOnEvent, LeverActionEvent, PistonActivateEvent, PlayerJoinEvent, PlayerLeaveEvent, ProjectileHitEvent, TickEvent, WeatherChangeEvent, WorldInitializeEvent } from '@minecraft/server';

interface ObjectForm {
	modal?: Array<ModalTypes | ((player: Player, i: Number, ...extraArguments: Array<any>) => {})>,
	action?: Array<ActionTypes | ((player: Player, i: Number, ...extraArguments: Array<any>) => {})>,
	message?: Array<MessageTypes | ((player: Player, i: Number, ...extraArguments: Array<any>) => {})>,

}
type generationCallback = ((player: Player, i: Number, ...extraArguments: Array<any>) => {});
interface ModalTypes {

	title?: String,
	dropdown?: {
		label: String | generationCallback,
		options: Array<String> | generationCallback,
		defaultValueIndex: Number | generationCallback;
	},
	slider?: {
		label?: String | generationCallback,
		minimumValue: Number | generationCallback,
		maximumValue: Number | generationCallback,
		valueStep?: Number | generationCallback,
		defaultValue?: Number | generationCallback;
	},
	textField?: {
		label: String | generationCallback,
		placeholderText: String | generationCallback,
		defaultValue: String | generationCallback;
	} | generationCallback,
	toggle?: {
		label: String | generationCallback,
		defaultValue: Boolean | generationCallback;
	} | generationCallback,
	callback?: (player: Player, selection: Number | String, ...extraArguments: Array<any>) => {},

}
interface ActionTypes {

	body?: String | generationCallback,
	title?: String | generationCallback,
	button?: {
		text: String | generationCallback,
		iconPath?: String | generationCallback,
		reopen?: Boolean | generationCallback;
	} | generationCallback,
	back?: {
		text: String | generationCallback,
		iconPath?: String;
	} | generationCallback,
	refresh?: {
		text: String | generationCallback,
		iconPath: String | generationCallback;
	} | generationCallback,
	toggle?: {
		options: Array<
			{
				prependText: String,
				text: String,
				apendText: String,
				iconPath: String,
			}
		> | generationCallback,
		scoreboardName: String | generationCallback,
		/**
		 * @property 
		 */
		dependency: 'player' | 'world',
		postfix?: Boolean | generationCallback,
		prefix?: Boolean | generationCallback,
		reopen?: Boolean | generationCallback;
	} | generationCallback,
	callback?: (player: Player, selection: Number | String, ...extraArguments: Array<any>) => {},

}
interface MessageTypes {
	title?: String | generationCallback,
	body?: String | generationCallback,
	button1?: {
		text: String | generationCallback;
	} | generationCallback,
	button2?: {
		text: String | generationCallback;
	} | generationCallback,
	callback?: (player: Player, selection: Number | String, ...extraArguments: Array<any>) => {},
}
interface ObjectEvents {
	beforeChat: (arg: BeforeChatEvent) => {},
	beforeDataDrivenEntityTriggerEvent: (arg: BeforeDataDrivenEntityTriggerEvent) => {},
	beforeExplosion: (arg: BeforeExplosionEvent) => {},
	beforeItemDefinitionEvent: (arg: BeforeItemDefinitionTriggeredEvent) => {},
	beforeItemUse: (arg: BeforeItemUseEvent) => {},
	beforeItemUseOn: (arg: BeforeItemUseOnEvent) => {},
	beforePistonActivate: (arg: BeforePistonActivateEvent) => {},
	blockBreak: (arg: BlockBreakEvent) => {},
	blockExplode: (arg: BlockExplodeEvent) => {},
	blockPlace: (arg: BlockPlaceEvent) => {},
	buttonPush: (arg: ButtonPushEvent) => {},
	chat: (arg: ChatEvent) => {},
	dataDrivenEntityTriggerEvent: (arg: DataDrivenEntityTriggerEvent) => {},
	effectAdd: (arg: EffectAddEvent) => {},
	entityCreate: (arg: EntityCreateEvent) => {},
	entityHit: (arg: EntityHitEvent) => {},
	entityHurt: (arg: EntityHurtEvent) => {},
	explosion: (arg: ExplosionEvent) => {},
	itemCompleteCharge: (arg: ItemCompleteChargeEvent) => {},
	itemDefinitionEvent: (arg: ItemDefinitionTriggeredEvent) => {},
	itemReleaseCharge: (arg: ItemReleaseChargeEvent) => {},
	itemStartCharge: (arg: ItemStartChargeEvent) => {},
	itemStartUseOn: (arg: ItemStartUseOnEvent) => {},
	itemStopCharge: (arg: ItemStopChargeEvent) => {},
	itemStopUseOn: (arg: ItemStopUseOnEvent) => {},
	itemUse: (arg: ItemUseEvent) => {},
	itemUseOn: (arg: ItemUseOnEvent) => {},
	leverActivate: (arg: LeverActionEvent) => {},
	pistonActivate: (arg: PistonActivateEvent) => {},
	playerJoin: (arg: PlayerJoinEvent) => {},
	playerLeave: (arg: PlayerLeaveEvent) => {},
	projectileHit: (arg: ProjectileHitEvent) => {},
	tick: (arg: TickEvent) => {},
	weatherChange: (arg: WeatherChangeEvent) => {},
	worldInitialize: (arg: WorldInitializeEvent) => {},
	tickAfterLoad: (arg: TickEvent) => {},
	playerJoined: (arg: PlayerJoinEvent) => {},
	worldLoad: () => {},
	playerHit: (arg: EntityHitEvent) => {},
	playerHurt: (arg: EntityHurtEvent) => {},
}
