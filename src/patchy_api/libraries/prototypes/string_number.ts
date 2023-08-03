const { log10 } = Math;
export const stringFunctions = {
	toHHMMSS() {
		return new Date(Number(this) * 1000).toTimeString().split(' ')[0];
	},
	toNumber() {
		return Number(this);
	},
	round(place = 0) {
		return Math.round(Number(this) * 10 ** place) / 10 ** place;
	},
	floor(place = 0) {
		return Math.floor(Number(this) * 10 ** place) / 10 ** place;
	},
	ceil(place = 0) {
		return Math.ceil(Number(this) * 10 ** place) / 10 ** place;
	},
	trunc() {
		return Math.trunc(Number(this));
	},
	dec() {
		return Number(this) % 1;
	},
	abs() {
		return Math.abs(Number(this));
	},
	getSign() {
		const sign = Number(this) / Number(this).abs();
		return (!sign) ? 0 : sign;
	},
	toTimeTill(date = new Date(this), time = Number(this), test = false) {
		return [~~(time / 8.64e7), ~~(time / 8.64e7 % 1 * 24), ~~(date.getMinutes()), ~~(date.getSeconds())]
			.filter(value => {
				if (value && !test) {
					test = true;
					return true;
				} else if (test) {
					return test;
				}
			});
	},
	isInteger() {
		return isInteger(Number(this));
	}
};
Object.assign(Number.prototype, stringFunctions);
Object.assign(String.prototype, stringFunctions);
Object.assign(Array.prototype, stringFunctions);

const types = ['', 'k', 'M', 'G', 'T'];
const numberFunctions = {
	unitFormat(place = 1) {
		return (this / 10 ** (~~(log10(this) / 3) * 3)).toFixed(place) + types[~~(log10(this) / 3)];
	}
};
Object.assign(Number.prototype, numberFunctions);
