function logStringify(...messages) {
	console.log(...messages.map(message => JSON.stringify(message)));
}
function charCodeBytesArray(string) {
	const array = new Array(string.length);
	for (let i = 0; i < string.length; i++) {
		const charCode = string.charCodeAt(i);
		array[i] = (charCode < 128) ? [[charCode, 1, 1]] : (charCode < 1024) ? [[charCode, 1, 2], [charCode, 2, 2]] : (charCode < 65536) ? [[charCode, 1, 3], [charCode, 2, 3], [charCode, 3, 3]] : [[charCode, 1, 4], [charCode, 2, 4], [charCode, 3, 4], [charCode, 4, 4]];
	}
	return array.flat(1);
}
function chunkStringBytes(string, length) {
	logStringify(string);
	const stringByteArray = charCodeBytesArray(string);
	let size = (stringByteArray.length / length) | 0;
	const array = Array(++size);
	for (let i = 0, offset = 0; i < size; i++, offset += length) {
		array[i] = stringByteArray.slice(offset, offset + length);
	}
	logStringify(stringByteArray, array);
	return array.map(byteInfo => byteInfo.reduce((sum, [char, left, max]) => sum + ((left === max) ? String.fromCharCode(char) : ""), ""));
}
logStringify(chunkStringBytes(String.fromCharCode(100, 146, 256).repeat(100), 10));
function chunkStringBytes(str, length) {
	const chunks = [];
	let chunk = '';
	let byteCount = 0;

	for (let i = 0; i < str.length; i++) {
		const char = str[i];
		const charCode = char.charCodeAt(0);
		const bytesChar = (charCode < 128) ? 1 : (charCode < 1024) ? 2 : (charCode < 65536) ? 3 : 4;
		if (byteCount + bytesChar > length) {
			chunks.push(chunk);
			chunk = '';
			byteCount = 0;
		}
		byteCount += bytesChar;
		chunk += char;

	}

	if (chunk.length > 0) {
		chunks.push(chunk);
	}

	return chunks;
}
function chunkStringBytesEcode(str, length) {
	const byteArray = new TextEncoder().encode(str);
	const chunks = [];
	let chunk = '';
	let byteCount = 0;

	for (let i = 0; i < byteArray.length; i++) {
		const charCode = byteArray[i];
		const bytesChar = (charCode < 128) ? 1 : (charCode < 1024) ? 2 : (charCode < 65536) ? 3 : 4;
		if (byteCount + bytesChar > length) {
			chunks.push(chunk);
			chunk = '';
			byteCount = 0;
		}
		byteCount += bytesChar;
		chunk += str[i];

	}

	if (chunk.length > 0) {
		chunks.push(chunk);
	}

	return chunks;
}
function charCodeBytesArray(string) {
	const array = new Array(string.length);
	for (let i = 0; i < string.length; i++) {
		const charCode = string.charCodeAt(i);
		array[i] = (charCode < 128) ? [[charCode, 1, 1]] : (charCode < 1024) ? [[charCode, 2, 2], [charCode, 1, 2]] : (charCode < 65536) ? [[charCode, 3, 3], [charCode, 2, 3], [charCode, 1, 3]] : [[charCode, 4, 4], [charCode, 3, 4], [charCode, 2, 4], [charCode, 1, 4]];
	}
	return array.flat(1);
}
function chunkStringBytesNew(string, length) {
	const stringByteArray = charCodeBytesArray(string);
	let size = stringByteArray.length / length;
	(size % 1 === 0) && size--, size |= 0;
	const array = Array(++size);
	for (let i = 0, offset = 0; i < size; i++, offset += length) {
		array[i] = stringByteArray.slice(offset, offset + length);
	}
	return array.map(byteInfo => byteInfo.reduce((sum, [char, left, max]) => sum + ((left === max) ? String.fromCharCode(char) : ""), ""));
}
return { string: 'ahjjheffjgk'.repeat(20000), chunkStringBytes, chunkStringBytesEcode, chunkStringBytesNew };
DATA.chunkStringBytes(DATA.string, 32767);
DATA.chunkStringBytesEcode(DATA.string, 32767);
DATA.chunkStringBytesNew(DATA.string, 32767);