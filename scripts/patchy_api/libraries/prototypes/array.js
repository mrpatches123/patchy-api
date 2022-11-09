import { content } from "../utilities";

const arrayFunctions = {
	delete(index) {
		return this.filter((item, i) => i !== index);
	},
	random() {
		return this[~~(Math.random() * this.length)];
	},
	equals(array) {
		return this.every((value, i) => value === array[i]);
	},
	reverseCopy() {
		let array = [];
		for (let i = this.length - 1, a = 0; i >= 0 && a < this.length; i--, a++) {
			array[a] = this[i];
		}
		return array;
	},
	/**
	 * @method accumulate
	 * @param {(value: any, i: Number, initialValue: any) => {}} callback 
	 * @param {any} initialValue 
	 * @param {Boolean} ignorefunctions 
	 * @param {Boolean} ignore 
	 * @returns {any}
	 */
	accumulate(callback, initialValue, ignorefunctions = false, ignore = false) {
		if (typeof callback == "function") {
			if (this.length) {
				let i = 0;
				for (const value of this) {
					if (typeof value === 'function' && ignorefunctions) { continue; }
					const call = callback(value, i++, initialValue);
					if (!initialValue || (!call && ignore)) continue;
					if (initialValue instanceof Array) {
						initialValue.push(call);
					} else if (initialValue instanceof Object) {
						initialValue = { ...initialValue, ...call };
					} else if (typeof initialValue === 'number' || typeof initialValue === 'string') {
						initialValue += call;
					}
					content.warn({ t: 'accumulatejkwwdjkwdjk', i, initialValue, call, bool: initialValue instanceof Object });
				}

				if (initialValue) { return initialValue; }
			}
		}
	},
	getRange() {
		if (this.every(item => item instanceof BlockLocation || item instanceof Location)) {

			const x = this.map(({ x }) => x).sort((a, b) => a - b);
			const y = this.map(({ y }) => y).sort((a, b) => a - b);
			const z = this.map(({ z }) => z).sort((a, b) => a - b);
			return [
				{ x: x[0], y: y[0], z: z[0] },
				{ x: x[x.length - 1], y: y[y.length - 1], z: z[z.length - 1] }
			];
		} else {
			throw new Error('getRange(): not an array of BlockLocations or Locations');
		}
	},
	merge(index, array, postfix = false) {
		const arrayPre = this.filter((item, i) => (postfix) ? i <= index : i < index);
		const arrayPost = this.filter((item, i) => (postfix) ? i > index : i >= index);
		return [...arrayPre, ...array, ...arrayPost];
	},
	toObject() {
		const object = {};
		this.forEach(([key, value]) => object[key] = value);
		return object;
	}
};
Object.assign(Array.prototype, arrayFunctions);