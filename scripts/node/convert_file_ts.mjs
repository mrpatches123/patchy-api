import fs from 'fs';
import * as pather from 'path';
const path = 'C:/Users/mrpat/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_behavior_packs/patchy-api/src';
const nodePath = 'C:/Users/mrpat/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_behavior_packs/patchy-api/src/node';
const tsRecursiveSync = function (src) {
    if (src === nodePath)
        return;
    if (src.includes('.js') || src.includes('.ts') || src.includes('.mjs') || src.includes('.mts') || src.includes('.txt'))
        return fs.renameSync(src, src.replace('.js', '.ts'));
    fs.readdirSync(src)
        .map((name) => name)
        .forEach((dir) => {
        tsRecursiveSync(pather.join(src, dir));
        // console.log(path.join(src, dir), path.join(dest, dir));
    });
};
tsRecursiveSync(path);
//# sourceMappingURL=convert_file_ts.mjs.map