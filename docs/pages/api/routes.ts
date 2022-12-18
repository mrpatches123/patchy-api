import { NextApiRequest, NextApiResponse } from 'next';
import * as fsStarter from 'fs';
const { promises: fs } = fsStarter;
import path from 'path';

function snakeToPascal(string: string) {
	return string.replace(/(_\w)/g, (m) => m[1].toUpperCase()).replace(/^\w/, (m) => m.toUpperCase());
}

export default async function routeHandler(request: NextApiRequest, response: NextApiResponse) {
	const directoryRelativeToPagesFolder = 'doc_pages';
	const directory = path.resolve('./pages', directoryRelativeToPagesFolder);
	const filenames = await fs.readdir(directory);

	const paths = filenames.map(name => {
		name = name.replace('.tsx', '');
		return ({ path: path.join('/', directoryRelativeToPagesFolder, name).replaceAll('\\', '/'), text: snakeToPascal(name) });
	});
	response.status(200).json(paths);
};