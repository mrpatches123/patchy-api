import { content } from "./utilities.js";
const numberChars = [
	'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
	'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
	'±', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '-', '=', '§', '£', '™', '¡', '¢', '∞', "'", '¶', '•', 'ª', 'º',
	'œ', '∑', '´', '®', '†', '¥', '¨', 'ˆ', 'ø', 'π', '‘', 'å', 'ß', '∂', 'ƒ', '©', '˙', '˚', '¬', '…', 'æ', '«', '`', '~', 'Ω',
	'≈', 'ç', '√', '∫', '˜', 'µ', '≤', '≥', '÷', '₩',
	'È', 'É', 'Ê', 'Ë', 'Ē', 'Ė', 'Ę', 'À', 'Á', 'Â', 'Ä', 'Æ', 'Ã', 'Ā', 'Ś', 'Š', 'Ÿ', 'Û', 'Ü', 'Ù', 'Ú', 'Ū', 'Î', 'Ï', 'Í', 'Ī', 'Į', 'Ì', 'Ô', 'Ö', 'Ò', 'Ó', 'Œ', 'Ō', 'Õ', 'Ł', 'Ž', 'Ź', 'Ż', 'Ç', 'Ć', 'Č', 'Ñ', 'Ń',
	'è', 'é', 'ê', 'ë', 'ē', 'ė', 'ę', 'à', 'á', 'â', 'ä', 'æ', 'ã', 'ā', 'ś', 'š', 'ÿ', 'û', 'ü', 'ù', 'ú', 'ū', 'î', 'ï', 'í', 'ī', 'į', 'ì', 'ô', 'ö', 'ò', 'ó', 'œ', 'ō', 'õ', 'ł', 'ž', 'ź', 'ż', 'ç', 'ć', 'č', 'ñ', 'ń',
];
const accents = [..."ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž"];
const accentsFixs = [..."AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz"];
export function fixAccents(string) {
	return string.replace(/[ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž]/g, ($1) => accentsFixs[accents.indexOf($1)]);
}
export function binaryConversion(n, base) {
	const number = [];
	for (let i = 0; n > 0; i++) {
		number[i] = n % base;
		n = Math.floor(n / base);
	}
	return number;
}
export function charCodeOf(char) {
	const test = char.charCodeAt() - 32;
	if (test >= 0 || test < numberChars.length) {
		return test;
	} else {
		const test = fixAccents(char).charCodeAt() - 32;
		if (test >= 0 || test < numberChars.length) {
			return test;
		} else {
			return 0;
		}
	}

}
export function charFromCode(number) {
	return String.fromCharCode(32 + number);
}
export function binFromString(string, base = 16, padding = 2) {
	return [...string.toString()].map(char => toBin(charCodeOf(char), base, padding)).join('');
}

export function binToString(string, base = 16, padding = 2) {
	return string.replace(new RegExp(`[\\s\\S]{${padding}}`, 'g'), (match) => charFromCode(fromBin(match, base, padding)));
}
export function toBin(n, base = 16, padding = 2) {
	return binaryConversion(n, base).map(n => numberChars[n]).reverse().join('').padStart(padding, 0);
}


export function fromBin(n, base) {
	return [...n.toString()].map(n => numberChars.indexOf(n)).reverse().reduce((p, n, i, a) => p + n * base ** (i));
}

