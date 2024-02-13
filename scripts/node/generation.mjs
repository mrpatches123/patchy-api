// import { getProject } from './project.js';
// import '../../f-gametest-systems/scripts/patchy_api/libraries/prototypes/object.js';
export {};
// const project = getProject('../scripts/patchy_api');
// const help = JSON.stringify({ t: 8383838, project }, null, 4);
// const contents = [];
// project.files.forEach((path, buffer) => {
// 	const content = buffer.toString();
// 	const matches = content.match(/[	 ]*\/\*\*(?:[^/])*\*\//g);
// 	if (!matches) { return; }
// 	const fixedMatches = matches.map(match => {
// 		const method = match.match(/@(method).+/g);
// 		const functions = match.match(/@(function).+/g);
// 		const parameters = match.match(/@param.+/g);
// 		const returns = match.match(/@returns.+/g);
// 		const regExp = `(?<=^(?:export\\s*)?(?:class|function|const|let|var)\\s*)\\w+(?=.*?\\s+{[\\s\\S]+${((method) ? method.toString().replace(/([\(\).])/g, '\\$1') : method)})`;
// 		const parent = content.match(new RegExp(regExp));
// 		// console.log({ regExp: regExp.replaceAll('\\', '\\'), path, parent: ((parent) ? parent.slice(-1).join('') : 'null'), method, functions, parameters, returns });
// 		return `@path ${path}\n@parent ${(parent && !functions) ? parent.slice(-1).join('') : 'null'}\n${[...(method && !functions) ? method : (!method && functions) ? functions : [], ...(parameters) ? parameters : [], ...(returns) ? returns : []].join('\n')}`;
// 	});
// 	contents.push(...fixedMatches);
// 	// // console.log(path, matches);
// });
// // console.log(contents.join('\n\n'));;;;
//# sourceMappingURL=generation.mjs.map