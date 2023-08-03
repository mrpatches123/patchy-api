import { Vector } from "@minecraft/server";

const vectorFunctions = {
	magnitude() {
		const { x, y, z } = this;
		return Math.hypot(x, y, z);
	},
	scale(newLength) {
		return this.normalized().multiply(newLength);
	}

};
Object.assign(Vector.prototype, vectorFunctions);