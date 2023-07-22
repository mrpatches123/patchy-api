import { isVector3 } from "../../utilities";

export class Vector {
	/**
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} z 
	 */
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.back = new this(0, 0, -1);
	};
	get back() {
		return new this(0, 0, -1);
	};

	get down() {
		return new this(0, -1, 0);
	};
	get forward() {
		return new this(0, 0, 1);
	};
	get left() {
		return new this(-1, 0, 0);
	};
	get right() {
		return new this(1, 0, 0);
	};
	get one() {
		return new this(1, 1, 1);
	};
	get up() {
		return new this(0, 1, 0);
	};
	get zero() {
		return new this(0, 0, 0);
	};
	/**
	 * 
	 * @param {this} other 
	 * @returns 
	 */
	equals(other) {
		if (!isVector3(other)) throw new Error('other at params[0] is not of type: Vector3 or Vector!');
		return this.x === other.x && this.y === other.y && this.z === other.z;
	}
	/**
	 * @returns {number}
	 */
	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	};
	/**
	 * @returns {number}
	 */
	lengthSquared() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}
	/**
	 * @param {number} factor
	 * @returns {this}
	 */
	normalized(factor = 1) {
		const length = this.length();
		return new this((this.x / length) * factor, (this.y / length) * factor, (this.z / length) * factor);
	};
	/**
	 * 
	 * @param {this} a 
	 * @param {this | number} b 
	 * @returns {this}
	 */
	static add(a, b) {
		if (!isVector3(a)) throw new Error('a at params[0] is not of type: Vector3 or Vector!');
		if (!isVector3(b) && typeof b !== number) throw new Error('b at params[2] is not of type: number, Vector3 or Vector!');
		return { x: a.x + (b.x ?? b), y: a.y + (b.y ?? b), z: a.z + (b.z ?? b) };
	};
	/**
	 * 
	 * @param {this} a 
	 * @param {this} b 
	 * @returns {this}
	 */
	static cross(a, b) {
		if (!isVector3(a)) throw new Error('a at params[0] is not of type: Vector3 or Vector!');
		if (!isVector3(b)) throw new Error('b at params[1] is not of type: Vector3 or Vector!');
		return new this(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
	};
	/**
	 * @param {this} a 
	 * @param {this} b 
	 * @returns {number}
	 */
	static dot(a, b) {
		if (!isVector3(a)) throw new Error('a at params[0] is not of type: Vector3 or Vector!');
		if (!isVector3(b)) throw new Error('b at params[1] is not of type: Vector3 or Vector!');
		return a.x * b.x + a.y * b.y + a.z * b.z;
	};
	/**
	 * 
	 * @param {this} a 
	 * @param {this} b 
	 * @returns {this}
	 */
	static distance(a, b) {
		if (!isVector3(a)) throw new Error('a at params[0] is not of type: Vector3 or Vector!');
		if (!isVector3(b)) throw new Error('b at params[1] is not of type: Vector3 or Vector!');
		return Math.abs(Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) + (a.z - b.z) * (a.z - b.z)));
	};
	/**
	 * 
	 * @param {this} a 
	 * @param {this | number} b 
	 * @returns {this}
	 */
	static divide(a, b) {
		if (!isVector3(a)) throw new Error('a at params[0] is not of type: Vector3 or Vector!');
		if (!isVector3(b) && typeof b !== number) throw new Error('b at params[1] is not of type: number, Vector3 or Vector!');
		return new this(a.x / (b.x ?? b), a.y / (b.y ?? b), a.z / (b.z ?? b));
	};
	/**
	 * 
	 * @param {this} a 
	 * @param {this} b 
	 * @param {number} t
	 * @returns {this}
	 */
	static lerp(a, b, t) {
		if (!isVector3(a)) throw new Error('a at params[0] is not of type: Vector3 or Vector!');
		if (!isVector3(b)) throw new Error('b at params[1] is not of type: Vector3 or Vector!');
		if (typeof t !== 'number') throw new Error('t at params[2] is not of type: number!');
		return new this(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t);
	};
	/**
	 * 
	 * @param {this} a 
	 * @param {this} b
	 * @returns {this}
	 */
	static max(a, b) {
		if (!isVector3(a)) throw new Error('a at params[0] is not of type: Vector3 or Vector!');
		if (!isVector3(b)) throw new Error('b at params[1] is not of type: Vector3 or Vector!');
		return new this(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
	};
	/**
	 * 
	 * @param {this} a 
	 * @param {this} b
	 * @returns {this}
	 */
	static min(a, b) {
		if (!isVector3(a)) throw new Error('a at params[0] is not of type: Vector3 or Vector!');
		if (!isVector3(b)) throw new Error('b at params[1] is not of type: Vector3 or Vector!');
		return new this(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
	};
	/**
	 * 
	 * @param {this} a 
	 * @param {this | number} b 
	 * @returns {this}
	 */
	static multiply(a, b) {
		if (!isVector3(a)) throw new Error('a at params[0] is not of type: Vector3 or Vector!');
		if (!isVector3(b) && typeof b !== number) throw new Error('b at params[1] is not of type: number, Vector3 or Vector!');
		return new this(a.x * (b.x ?? b), a.y * (b.y ?? b), a.z * (b.z ?? b));

	};;
	/**
	 * 
	 * @param {this} a 
	 * @param {this} b 
	 * @param {number} s
	 * @returns {this}
	 */
	static slerp(a, b, s) {
		if (!isVector3(a)) throw new Error('a at params[0] is not of type: Vector3 or Vector!');
		if (!isVector3(b)) throw new Error('b at params[1] is not of type: Vector3 or Vector!');
		if (typeof s !== 'number') throw new Error('s at params[2] is not of type: number!');

		const θ = Math.acos(this.dot(a, b));
		const factor1 = Math.sin(θ * (1 - s)) / Math.sin(θ);
		const factor2 = Math.sin(θ * s) / Math.sin(θ);
		return new this(
			a.x * factor1 + b.x * factor2,
			a.y * factor1 + b.y * factor2,
			a.z * factor1 + b.z * factor2
		);
	};
	/**
	 * 
	 * @param {this} a 
	 * @param {this | number} b
	 * @returns {this}
	 */
	static subtract(a, b) {
		if (!isVector3(a)) throw new Error('a at params[0] is not of type: Vector3 or Vector!');
		if (!isVector3(b) && typeof b !== number) throw new Error('b at params[1] is not of type: number, Vector3 or Vector!');
		return new this(a.x - (b.x ?? b), a.y - (b.y ?? b), a.z - (b.z ?? b));
	};

}