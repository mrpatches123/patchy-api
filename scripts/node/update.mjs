const { randomUUID } = require('crypto');
const fs = require('fs');
let jsonData = fs.readFileSync(`${process.cwd()}/manifest.json`, { encoding: 'utf8' });
jsonData = JSON.parse(jsonData);
let numbers = jsonData.header.version;
if (numbers[2] == 9) {
    numbers[2] = 0;
    numbers[1] += 1;
}
else if (numbers[1] == 9) {
    numbers[1] = 0;
    numbers[0] += 1;
}
else {
    numbers[2] += 1;
}
jsonData.header.version = numbers;
fs.writeFileSync(`${process.cwd()}/manifest.json`, JSON.stringify(jsonData), { encoding: 'utf8' });
fs.writeFileSync(`${process.cwd()}/texts/en_GB.lang`, `pack.name=Factions - Gametest Systems
pack.description=version ${numbers.join('.')}`, { encoding: 'utf8' });
fs.writeFileSync(`${process.cwd()}/texts/en_US.lang`, `pack.name=Factions - Gametest Systems
pack.description=version ${numbers.join('.')}`, { encoding: 'utf8' });
export {};
//# sourceMappingURL=update.mjs.map