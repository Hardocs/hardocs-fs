const path = require('path');
const fs = require('fs');

console.log(path.("/"))

console.log(fs.readdirSync(path.join(process.cwd(), '/'), 'utf8'));
