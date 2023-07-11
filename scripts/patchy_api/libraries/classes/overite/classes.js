import * as server from '@minecraft/server';


function generateProxy(object) {
	return new Proxy({}, {
		get(target, key) {
			if (object[key] instanceof Function) return ((...args) => {
				try {
					object[key](...args);
				} catch (error) {
					system.run(() => object[key](...args));
				}
			});
			return generateProxy(object[key]);
		},
		set(target, key, value) {
			try {
				object[key] = value;
			} catch (error) {
				system.run;
			}
			return Reflect.set(...arguments);
		}
	});
}
export const world = new Proxy({}, {
	get(target, key) {
		if (server[key] instanceof Function) return ((...args) => {
			try {
				server[key](...args);
			} catch (error) {
				system.run(() => server[key](...args));
			}
		});
		return generateProxy(server[key]);
	}
});

