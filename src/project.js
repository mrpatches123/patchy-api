import { readFileSync, readdirSync, lstatSync, existsSync } from 'fs';
import callerCallsite from 'caller-callsite';
function pathIsObject(pathArray, object) {
	return new Function('object', `return typeof object?.${pathArray.join('?.')} === 'object' && !Array.isArray(object?.${pathArray.join('?.')})`)(object);
}
function pathIsSettable(pathArray, object) {
	const call = pathArray.slice(0, -1).every((key, i) => pathIsObject(pathArray.slice(0, -(i + 1)), object));
	if (pathArray.slice(0, -1).length) {
		return call;
	} else {
		return true;
	}
}
function assignToPath(pathArray, object, value) {
	const mappedPathArray = pathArray.map(value => `['${value}']`);
	//   	console.log(mappedPathArray)
	//   console.log(pathIsSettable(mappedPathArray, object))
	if (pathIsSettable(mappedPathArray, object)) {
		// console.log({ pathIsSettable: `object${mappedPathArray.join('')} = value; return object` });
		return new Function('object', 'value', `object${mappedPathArray.join('')} = value; return object`)(object, value);
	} else {
		let stop = false;
		pathArray.forEach((path, i) => {
			const newPathArray = mappedPathArray.slice(0, i + 1);
			// console.log(newPathArray);
			if (!stop && !pathIsObject(newPathArray, object)) {
				// console.log(`object${newPathArray.join('')} = {}; return object`);
				object = new Function('object', `object${newPathArray.join('')} = {}; return object`)(object);
			} else if (!stop && pathIsSettable(newPathArray, object)) {
				return;
			} else {
				stop = true;
			}
			// console.log('obj', object);
		});
		if (!stop) {
			return assignToPath(pathArray, object, value);
		}

	}
}



function isFolder(path) {
	// console.log(path);
	return lstatSync(path).isDirectory();
}
let i = 0;
const path = {
	/**
	 * @method resolveRelativeFromAbsolute resolves a relative path from an absolute path
	 * @param {String} relitivePath relative path
	 * @param {String} absolutePath absolute path
	 * @param {String} split default?= '/', the path of the filePath to be split wth 
	 * @param {RegExp} replace default?= /[\/|\\]/g, the regex or string to replace the filePath's splits with 
	 * @returns {String} resolved absolutePath 
	 */
	resolveRelativeFromAbsolute(relitivePath, absolutePath, split = '/', replace = /[\/|\\]/g) {
		relitivePath = relitivePath.replaceAll(replace, split).split(split);
		absolutePath = absolutePath.replaceAll(replace, split).split(split);
		const numberOfBacks = relitivePath.filter(file => file === '..').length;
		return [...absolutePath.slice(0, -(numberOfBacks + 1)), ...relitivePath.filter(file => file !== '..' && file !== '.')].join(split);
	}
};
export function parseRelitiveFromFunction(relitivePath) {

	const absolutePath = callerCallsite({ depth: 2 }).getFileName().replaceAll('\\', '/').replaceAll('file:///', '');
	return path.resolveRelativeFromAbsolute(relitivePath, absolutePath);
}
export function getProject(path, fileReplace) {
	path = parseRelitiveFromFunction(path);
	let entireDirectory = {};
	let files = {};
	if (!existsSync(path)) { new Error(`Path: ${path}, does not exist`); }
	const directoryPath = path.split('/').slice(0, -1).join('/');
	console.log(3, directoryPath);
	path = path.split('/').slice(-1).join('');
	console.log(4, path);
	getFolder(undefined, path.split('/').slice(-1).join('/'));
	function getFolder(name, currentPath) {
		let NewPath;
		if (name === undefined) {
			NewPath = `${directoryPath}/${currentPath}`;
		} else {
			NewPath = `${directoryPath}/${currentPath}/${name}`;
			currentPath = `${currentPath}/${name}`;
		}
		// console.log(i++, currentPath);
		const isDir = isFolder(NewPath);
		if (isDir) {
			// entireDirectory = assignToPath(currentPath.split('/'), entireDirectory, {});
			readdirSync(NewPath).forEach(filename => {
				const isDir1 = isFolder(`${NewPath}/${filename}`);
				if (isDir1) {
					getFolder(filename, currentPath);
				} else {
					// console.log(readFileSync(`${NewPath}/${filename}`));
					const file = readFileSync(`${NewPath}/${filename}`);
					files[`${currentPath}/${filename}`] = (fileReplace) ? fileReplace : file;
					entireDirectory = assignToPath((`${currentPath}/${filename}`).split('/'), entireDirectory, 'file'/*readFileSync(`${NewPath}/${filename}`)*/);
				}
			});
		} else {
			const file = readFileSync(NewPath);
			files[`${currentPath}/${filename}`] = (fileReplace) ? fileReplace : file;
			entireDirectory = assignToPath((currentPath).split('/'), entireDirectory, file);
		}
		// console.log(entireDirectory);
	}
	return { entireDirectory, files };
}

