import { stringFunctions } from "./string_number.js";
const { isArray } = Array;
const { assign } = Object;
// import { content } from "../utilities.js";
const arrayObjectFunctions = {
	/**
	 * @method keys does Object.keys() on any Object
	 * @param {Boolean} ignoreFunctions 
	 * @returns {Array<String>}
	 */
	keys(ignoreFunctions) {
		let keysArray = [];
		for (let key in this) {
			if (hasKey(key)) { continue; }
			if (ignoreFunctions && typeof this[key] === 'function') { continue; }
			keysArray.push(key);
		}
		return keysArray;
	},
	/**
	 * @method clear deletes all values of const, let, var Object
	 * @param {Function} callback 
	 * @returns
	 */
	clear(callback) {
		// if (this.length) {
		for (const key in this) {
			if (typeof this[key] === 'function') { continue; }
			if (typeof callback === "function") {
				if (callback()) {
					delete this[key];
				}
			} else {
				delete this[key];
			}
		}
	},
	/**
	 * @method forEach interates over the object and can accumulate the return of each call into an object or Array depending on the initialValue
	 * @param {Function} callback(key, value, index, initialValue)
	 * @param {any} initialValue undefined, Object or Array if you want to
	 * @param {Boolean} 
	 * @param {Boolean} ignore ignores if current call is false
	 * @returns Any or Undefine
	 */
	forEach(callback, initialValue, ignorefunctions = false, ignore = false) {
		if (typeof callback == "function") {
			if (this.keys().length) {
				let i = 0;
				for (const key in this) {
					// console.warn(key, hasKey(key));
					if (hasKey(key) || (typeof this[key] === 'function' && ignorefunctions)) { continue; }
					const call = callback(key, this[key], i++, initialValue);
					if (initialValue && ((call === undefined || call === false || call === null) || !ignore) && typeof initialValue == 'object' && !isArray(initialValue)) {
						assign(initialValue, call);
					} else if (initialValue && (call || ignore) && typeof initialValue == 'object' && isArray(initialValue)) {
						initialValue.push(call);
					}
				}
				if (initialValue) { return initialValue; }
			}

		}
	},
	entries(ignorefunctions) {
		return this.keys(ignorefunctions).map(key => ([key, this[key]]));
	},
	/**
	 * @method every iterates over the object and if every call is true, it returns true
	 * @param {Function} callback 
	 * @param {Boolean} ignorefunctions ignores if value is a function
	 * @returns Boolean
	 */
	every(callback, ignorefunctions) {
		if (typeof callback == "function") {
			if (this.keys().length) {
				const calls = [];
				let i = 0;
				for (const key in this) {

					if (hasKey(key) || (typeof this[key] === 'function' && ignorefunctions)) { continue; }
					calls.push(callback(key, this[key], i++));
				}
				return calls.every(call => call);

			}
		}
	},
	/**
	 * @method some iterates over the object and if one call is true, it returns true
	 * @param {Function} callback 
	 * @param {Boolean} ignorefunctions ignores if value is a function
	 * @returns Boolean
	 */
	some(callback, ignorefunctions) {
		if (typeof callback == "function") {
			if (this.keys().length) {
				const calls = [];
				let i = 0;
				for (const key in this) {
					if (hasKey(key) || (typeof this[key] === 'function' && ignorefunctions)) { continue; }
					calls.push(callback(key, this[key], i++));
				}
				return calls.some(call => call);

			}

		}
	},
	/**
	 * @method map maps the return of each iteration to that calls respeactive key
	 * @param {Function} callback 
	 * @returns Object
	 */
	map(callback) {
		if (typeof callback == "function") {
			if (this.keys().length) {
				let object = {};
				this.entries().forEach(([key, value], i) => {
					object[key] = callback(key, value, i);
				});
				return object;
			}
		}
	},
	/**
	 * @method filter Iterates over the Object and if a iteration returns false that key is not included in the final object
	 * @param {Function} callback 
	 * @returns Object
	 */
	filter(callback) {
		if (typeof callback == "function") {
			if (this.keys().length) {
				let object = {};
				this.entries().forEach(([key, value], i) => {
					if (callback(key, value, i)) { object[key] = this[key]; };
				});
				return object;
			} else {
				return this;
			}
		}
	},
	/**
	 * @method join Joins the values of the object into one string
	 * @param {String} string the value that is inserted between each value
	 * @returns String
	 */
	join(string = '') {
		if (this.keys(this).length) {
			let joinedObject = [];
			this.entries().forEach(([key, value], i) => {
				joinedObject.push(this[key]);
			});
			return joinedObject.join(string);
		}
	},
	/**
	 * @method length Gets the length of the Object or te number of keys
	 * @param {Boolean} ignorefunctions ignores if value is a function 
	 * @returns Number
	 */
	length(ignoreFunctions) {
		return this.keys(ignoreFunctions).length;
	},
	/**
	 * @method equals Tests if main object is equal the Object Provided
	 * @param {any} object Object or any to check if equal
	 * @returns Boolean
	 */
	equals(object) {
		//console.log(keys(this).equals(keys(object)))
		if (typeof object === "object" && !isArray(object)) {
			if (this.length() && this.length() === object.length()) {
				return this.every((thiskKey, ThisValue) =>
					object.some((key, value) => (key === thiskKey && value === ThisValue) || ((typeof ThisValue === 'object' && typeof value === 'object') ? value.equals(ThisValue) : false))
				);

			} else {
				return false;
			}

		} else {
			return false;
		}

	},
	/**
	 * @method find returns an key value pair that if one has a true iteration 
	 * @param {Function} callback(key, value, index)
	 * @param {Boolean} ignorefunctions ignores if value is a function
	 * @returns Object
	 */
	find(callback, ignorefunctions = false) {
		if (typeof callback == "function") {
			if (this.keys().length) {
				let i = 0;
				for (const key in this) {
					if (hasKey(key) || (typeof this[key] === 'function' && ignorefunctions)) { continue; }
					const call = callback(key, this[key], i++);
					// content.warn({ call, i });
					if (!(call === undefined || call === false || call === null)) {
						return { [key]: this[key] };
					}
				}
			}

		}
	}

};
/**
	 * @method hasKey Checks if a key is in arrayObjectFunctions or stringFunctions
	 * @param {String} key
	 * @returns Boolean
	 */
function hasKey(key) {
	if (arrayObjectFunctions.hasOwnProperty(key) || stringFunctions.hasOwnProperty(key)) {
		return true;
	}
}

Object.assign(Object.prototype, arrayObjectFunctions);