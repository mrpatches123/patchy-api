/**
 * 
 * @param {string} str 
 * @param {number} length 
 * @returns 
 */
export function chunkStringReverse(str, length) {
	let size = Math.ceil(str.length / length);
	const array = Array(size);
	for (let i = size - 1, offset = str.length - length; i >= 0; i--, offset -= length) {
		array[i] = str.substring(offset, offset + length);
	}
	return array;
}



const number = 345443;
console.log(formatMS(number, 3));