import { Entity } from "@minecraft/server";
import { eventBuilder } from "../../patchy_api/modules.js";

eventBuilder.subscribe('indicators', {
	entityHurt: ({ hurtEntity }) => {

	}
});