const { randomUUID } = require('crypto');
const fs = require('fs');
let jsonData = fs.readFileSync(`${process.cwd()}/manifest.json`, { encoding: 'utf8' });
jsonData = JSON.parse(jsonData);
jsonData.header.uuid = randomUUID({ disableEntropyCache: true });
jsonData.modules[0].uuid = randomUUID({ disableEntropyCache: true });
jsonData.modules[1].uuid = randomUUID({ disableEntropyCache: true });
fs.writeFileSync(`${process.cwd()}/manifest.json`, JSON.stringify(jsonData), { encoding: 'utf8' });
export {};
//# sourceMappingURL=reUUID.mjs.map