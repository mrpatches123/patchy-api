/**
 * 
 * @param {string} str 
 * @param {number} length 
 * @returns 
 */
export function chunkStringReverse(str, length) {
	let size = Math.ceil(str.length / length);
	console.log(str);
	const array = Array(size);
	for (let i = size - 1, offset = str.length - length; i >= 0; i--, offset -= length) {
		array[i] = str.substring(offset, offset + length);
	}
	return array;
}


const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = [false, false, 'twenty', 'thirty', 'fourty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const places = ['hundred', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quattuordecillion', 'quindecillion', 'sexdecillion', 'septendecillion', 'octodecillion', 'novemdecillion'];

export function fixSciNumberString(string) {
	if (typeof string !== 'string') string = string.toString();
	let [number, power] = string.split('e');
	number = number.split('.');
	if (number.length === 1) number.push('');
	power = Number(power);
	if (!power) return (number.length > 1) ? number[0] : number.join('.');
	if (power > 0) {
		number[0] += number[1].substring(0, power).padEnd(power, '0');
		number[1] = number[1].substring(power);
	} else {
		throw new Error('power cannot be negitive');
	}
	if (number[1] === '') number.pop();
	return number.join('.');
}

function formatNumber(number) {
	if (typeof number === 'number') number = Math.floor(number);
	let negitive = false;
	if (Number(number) < 0) number = number.replaceAll('-', ''), negitive = true;
	number = fixSciNumberString(number);
	if (number === '0') return 'zero';
	const numberArray = chunkStringReverse(number.toString(), 3).reverse();
	const output = numberArray.map((number, i) => {
		number = number.padStart(3, '0');
		const place = places[i];
		const hundred = Number(number[0]);
		const ten = Number(number[1]);
		const one = Number(number[2]);
		return (!hundred && !ten && !one) ? '' : `${(hundred) ? `${ones[hundred]} ${places[0]} ` : ''}${(!ten) ? (!one) ? '' : ones[one] : (ten > 1 && tens[ten]) ? `${tens[ten]}${(one) ? `-${ones[one]}` : ''}` : teens[one]}${(i) ? ` ${place}` : ''}`;
	}).reverse().join(' ');
	console.log(output);
	return ((negitive) ? 'negtive ' : '') + output;
}
const second = 1000;
const minute = 60000;
const hour = 3600000;
const day = 86400000;
const year = 31536000000;
const decade = 315360000000;
const century = 3153600000000;
const millennium = 31536000000000;
const decimals = ['', 'an eighth', 'a quarter', 'three eighths', 'a half', 'five eighths', 'three forths', 'seven eighths'];
export function formatDecimal(number) {
	const index = Math.floor(number % 1 * 8);
	console.log(index);
	return `${(index === 0) ? '' : ` and ${decimals[index]}`}`;
}
/**
 * 
 * @param {number} ms 
 * @param {boolean} formal 
 * @returns 
 */
export function formatMS(ms, formal = false) {
	ms = Number(ms);
	if (ms < second) return `${formatNumber(ms)} millisecond${(ms === 1) ? '' : 's'}`;
	if (ms < minute) {
		const seconds = ms / second;
		return `${(!formal) ? Math.floor(seconds) : formatNumber(seconds)} second${(Math.floor(seconds) === 1) ? '' : 's'}`;
	}
	if (ms < hour) {
		const minutes = ms / minute;
		console.log(minutes);
		return `${(!formal) ? Math.floor(minutes) : `${formatNumber(minutes)}${(formatDecimal(minutes))}`} minute${(Math.floor(minutes) === 1) ? '' : 's'}`;
	}
	if (ms < day) {
		const hours = ms / hour;
		return `${(!formal) ? Math.floor(hours) : `${formatNumber(hours)}${(formatDecimal(hours))}`} hour${(Math.floor(hours) === 1) ? '' : 's'}`;
	}
	if (ms < year) {
		const days = ms / day;
		return `${(!formal) ? Math.floor(days) : `${formatNumber(days)}${(formatDecimal(days))}`} day${(Math.floor(days) === 1) ? '' : 's'}`;
	}
	if (ms < decade) {
		const years = ms / year;
		return `${(!formal) ? Math.floor(years) : `${formatNumber(years)}${(formatDecimal(years))}`} years${(Math.floor(years) === 1) ? '' : 's'}`;
	}
	if (ms < century) {
		const decades = ms / decade;
		return `${(!formal) ? Math.floor(decades) : `${formatNumber(centuries)}${(formatDecimal(centuries))}`} decade${(Math.floor(decades) === 1) ? '' : 's'}`;
	}
	if (ms < millennium) {
		const centuries = ms / century;
		return `${(!formal) ? Math.floor(centuries) : `${formatNumber(centuries)}${(formatDecimal(centuries))}`} centur${(Math.floor(centuries) === 1) ? 'y' : 'ies'}`;
	}
	const millenniums = ms / millennium;
	return `${(!formal) ? Math.floor(millenniums) : `${formatNumber(millenniums)}${(formatDecimal(millenniums))}`} millennium${(Math.floor(millenniums) === 1) ? '' : 's'}`;
}
const number = "10";
console.log(formatMS('165000', true));