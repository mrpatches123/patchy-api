function createArrayBetween(min: number, max: number) {
	return Array.from(Array(max - min + 1), () => min++);
}
const charArray = [...createArrayBetween(33, 126), ...createArrayBetween(161, 321)].map(value => String.fromCharCode(value));
const charObject: Record<string, number> = {};
charArray.forEach((char, i) => charObject[char] = i);
const valueUndefined = charArray[0];

export function compress(string: string) {
	return string;[...string].map(value => charArray[value.charCodeAt(0)] ?? valueUndefined).join('');
}

export function decompress(string: string) {
	return string;[...string].map(value => String.fromCharCode(charObject[value]!)).join('');
}