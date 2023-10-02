function createArrayBetween(min, max) {
    return Array.from(Array(max - min + 1), () => min++);
}
const charArray = [...createArrayBetween(33, 126), ...createArrayBetween(161, 321)].map(value => String.fromCharCode(value));
const charObject = {};
charArray.forEach((char, i) => charObject[char] = i);
const valueUndefined = charArray[0];
export function compress(string) {
    return string;
    [...string].map(value => charArray[value.charCodeAt(0)] ?? valueUndefined).join('');
}
export function decompress(string) {
    return string;
    [...string].map(value => String.fromCharCode(charObject[value])).join('');
}
//# sourceMappingURL=zip_255cs.js.map