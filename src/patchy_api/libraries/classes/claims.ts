import { BlockAreaSize, Dimension, Vector, Vector3, world } from "@minecraft/server";
import databases from "./database";
import propertyManager from "./property";
import { overworld, spawnEntityAsync } from "../utilities";

class ClaimsManagers {
	claimsManagers: Record<string, ClaimsManager> = {};
	currentId: number = 0;
	constructor() {
		const worldProperties = propertyManager.get();
		world.afterEvents.entityLoad.subscribe(async (event) => {
			const { entity } = event;
			const entityProperties = propertyManager.get(entity);
			const { claimId, claimsKey } = entityProperties.strings;
			if (claimsKey && claimId) {
				const claim = databases.get(`claims*API*${entityProperties.strings.claimsKey}*${claimId}`);
			}
		});
	}

	createClaimManger(key: string, data: { maxSize?: BlockAreaSize | Vector3; }) {
		this.claimsManagers[key] = new ClaimsManager(key, data);
		return this.claimsManagers[key];
	}
	addClaimToCheck(key: string, id: string) {

	}
}
const claimsManagers = new ClaimsManagers();
async function tickBlock(blocklocation: Vector3, dimension: Dimension = overworld, name = "tickBlock") {
	await dimension.runCommandAsync(`tickingarea add ${blocklocation.x} ${blocklocation.y} ${blocklocation.z} ${blocklocation.x} ${blocklocation.y} ${blocklocation.z} ${name}`);
}
class Claim {
	claimId: number;
	claimsKey: string;
	size: BlockAreaSize | Vector3;
	start: Vector3;
	dimension: Dimension;
	constructor(claimId: number, claimsKey: string, data: { size: BlockAreaSize | Vector3, start: Vector3; dimension: Dimension; }) {
		this.claimId = claimId;
		this.claimsKey = claimsKey;
		this.size = data.size;
		this.start = data.start;
		this.dimension = data.dimension;
	}

}
class ClaimsManager {
	key: string;
	maxSize: BlockAreaSize | Vector3 | undefined;
	subscribed: boolean = false;
	claims: Record<string, Claim> = {};
	constructor(key: string, data: { maxSize?: BlockAreaSize | Vector3; }) {
		this.maxSize = data.maxSize;
		this.key = key;
	}
	async createClaim(data: { size: BlockAreaSize | Vector3, start: Vector3; dimension?: Dimension; }) {
		const worldProperties = propertyManager.get();
		worldProperties.numbers.currentClaimId ??= 0;
		const claimId = ++worldProperties.numbers.currentClaimId;
		const { size, start, dimension = overworld } = data;

		const end = Vector.add(start, size);
		if (start.y && (start.y < dimension.heightRange.min || end.y > dimension.heightRange.max)) throw new Error("Claim is out of bounds");
		const claim = databases.get(`claims*API*${this.key}*${claimId}`) ?? databases.add(`claims*API*${this.key}*${claimId}`);
		claim.size = size;
		claim.start = start;
		claim.dimension = dimension.id;
		const firstEntityLocation = Vector.add(start, { x: (size.x % 80) / 2, y: start.y + size.y / 2, z: (size.z % 80) / 2 });
		for (let z = firstEntityLocation.z; z <= end.z; z += 80) {
			for (let x = firstEntityLocation.x; x <= end.x; x += 80) {
				const entityLocation = { x, y: firstEntityLocation.y, z };
				await tickBlock(entityLocation);
				const entity = await spawnEntityAsync(dimension, entityLocation, "patches:claim");
				const entityProperties = propertyManager.get(entity);
				entityProperties.strings.claimId = claimId.toString();
				entityProperties.strings.claimsKey = this.key;
			}
		}
		worldProperties.numbers.currentClaimId++;
	}
}

