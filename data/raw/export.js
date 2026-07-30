const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.png')).sort();
const subset = files.slice(180, 195);
console.log(JSON.stringify(subset, null, 2));
