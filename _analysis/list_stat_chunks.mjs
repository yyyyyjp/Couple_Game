import fs from 'fs';
const h = fs.readFileSync('statistics.latest.html', 'utf8');
const scripts = [...h.matchAll(/src="(\/_next\/static\/chunks\/[^"]+\.js)"/g)].map(m => m[1]);
console.log([...new Set(scripts)].join('\n'));
