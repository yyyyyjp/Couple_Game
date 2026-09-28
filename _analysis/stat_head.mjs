import fs from 'fs';
const h = fs.readFileSync('statistics.latest.html', 'utf8');
const title = h.match(/<title>([^<]*)<\/title>/)?.[1];
const desc = h.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1];
console.log('TITLE:', title);
console.log('DESC:', desc);
// body 背景 class
const body = h.match(/<body[^>]*class="([^"]*)"/)?.[1];
console.log('BODY:', body);
