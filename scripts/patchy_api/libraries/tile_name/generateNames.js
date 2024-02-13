import * as fs from 'fs';
let tile = {};
let text = fs.readFileSync(`${process.cwd()}/scripts/patchy_api/libraries/tile_name/tile_names.txt`, { encoding: 'utf8' });
text.match(/^.*?$/gm).forEach((match, i) => {
    try {
        if (match) {
            const name = match.match(/=.*/).toString().replace('=', '');
            const array = match.replace(/=(?:\w+ *)+/, '').split('.');
            // console.log({ name, array });
            if (array.length > 3) {
                if (!tile[array[1]]) {
                    tile[array[1]] = [];
                }
                tile[array[1]].push(name);
            }
            else {
                tile[array[1]] = name;
            }
        }
    }
    catch (error) {
        // console.log(i, match, match.match(/=/));
    }
});
fs.writeFileSync(`${process.cwd()}/scripts/patchy_api/libraries/tile_name/tile_name_object.js`, 'export const tileNameObject = ' + JSON.stringify(tile, null, 4), { encoding: 'utf8' });
//# sourceMappingURL=generateNames.js.map