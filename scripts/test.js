/**
 * @function parseCommand
 * @param {String} message 
 * @param {String} prefix 
 * @returns {String[]}
 * @example parseCommand('!give @"bat is bob" iron_sword {"data":6, "enchantments": {"sharpness":3}}', '!'); //returns ['give','bat is bob','iron_sword','{"data":6,"enchantments":{"sharpness":3}}']
 */
export function parseCommand(message, prefix) {
	const messageLength = message.length;
	let finding = false;
	let braceCount = [0, 0], bracketCount = [0, 0], quoteCount = 0, spaceCount = 0;
	let started = false;
	let o = 0;
	const output = [];
	for (let i = prefix.length; i < messageLength; i++) {
		const char = message[i];
		switch (char) {
			case '{':
				switch (finding) {
					case 'string':
						break;
					case 'json':
						braceCount[0]++;
						break;
					default:
						braceCount = [0, 0], bracketCount = [0, 0], quoteCount = 0, spaceCount = 0, finding = false;
						output.push('');
						o++;
						finding = 'json';
						braceCount[0]++;
						break;

				}
				output[o] += char;

				break;
			case '}':
				switch (finding) {
					case 'json':
						if (braceCount[0] !== ++braceCount[1] || bracketCount[0] !== bracketCount[1] || (quoteCount && quoteCount & 1)) break;
						braceCount = [0, 0], bracketCount = [0, 0], quoteCount = 0, spaceCount = 0, finding = false;
						break;
				}
				output[o] += char;
				break;
			case ']':
				switch (finding) {
					case 'json':
						if (bracketCount[0] !== ++bracketCount[1] || braceCount[0] !== braceCount[1] || (quoteCount && quoteCount & 1)) break;
						braceCount = [0, 0], bracketCount = [0, 0], quoteCount = 0, spaceCount = 0, finding = false;
						break;
				}
				output[o] += char;
				break;
			case '"':
				switch (finding) {
					case 'json':
						output[o] += char;
						break;
					default:
						braceCount = [0, 0], bracketCount = [0, 0], quoteCount = 0, spaceCount = 0, finding = false;
						finding = 'string';
					case 'string':
						if (!(++quoteCount & 1)) { finding = false; break; };
						if (!output[o].length) break;
						output.push('');
						o++;
						break;
				}
				break;
			case '[':
				switch (finding) {
					case 'string':
						break;
					case 'json':
						bracketCount[0]++;
						break;
					default:
						output.push('');
						o++;
						finding = 'json';
						break;

				}
				output[o] += char;

				break;
			case ' ':
				switch (finding) {
					case 'string':
					case 'json':
						if (!(quoteCount & 1)) break;
						output[o] += char;
						break;
					default:
						const nextChar = message?.[i + 1];
						switch (nextChar) {
							case ' ':
							case '[':
							case '{':
							case '"':
								break;
							default:
								output.push('');
								o++;
								finding = 'word';
								break;
						}
						break;
				}
				break;
			default:
				if (!started) {
					started = true;
					finding = 'word';
					output.push('');
					spaceCount = 1;
				}
				switch (char) {
					case '@':
						const nextChar = message?.[i + 1];
						switch (nextChar) {
							case '"':
								break;
							default:
								const afterNextChar = message?.[i + 2];
								switch (afterNextChar) {
									case '[':
										finding = 'json';
										output[o] += char;
										break;
								}
								break;
						}
						break;
					default:
						output[o] += char;
						break;
				}

				break;
		}
	}
	return output;
}

console.log(parseCommand('!test {"hello": 32314} "${hello} why does this work or not ${.}"', '!'));