class FactionsManagers {
	factionsManagers: Record<string, FactionsManager> = {};
	createFactionsManager(key: string, data: { maxMembers: number, maxClaims: number; }) {
		this.factionsManagers[key] = new FactionsManager();
		return this.factionsManagers[key];
	}
}
class FactionsManager {
	constructor() {

	}
}