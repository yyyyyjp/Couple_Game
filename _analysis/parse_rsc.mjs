// Parse Next.js RSC flight data from a saved/downloaded HTML file
import fs from 'node:fs';

const file = process.argv[2];
const html = fs.readFileSync(file, 'utf8');

// Extract all self.__next_f.push([<digit>,"<string>"]) payloads
const re = /self\.__next_f\.push\(\[(\d+),("[\s\S]*?")\]\)<\/script>/g;
let m;
let chunks = [];
while ((m = re.exec(html)) !== null) {
  try {
    const str = JSON.parse(m[2]); // unescape
    chunks.push({ type: Number(m[1]), text: str });
  } catch (e) {
    chunks.push({ type: Number(m[1]), text: '__PARSE_ERROR__', raw: m[2].slice(0, 200) });
  }
}
console.log('Number of __next_f chunks:', chunks.length);
const full = chunks.map((c) => c.text).join('');
fs.writeFileSync(new URL('./rsc_full.txt', import.meta.url), full);
console.log('Full RSC length:', full.length);

// Find compressedMessages reference and surrounding context
const idx = full.indexOf('compressedMessages');
console.log('\n=== compressedMessages context ===');
console.log(full.substring(idx - 20, idx + 200));

// Look for any very long quoted strings
const strRe = /"((?:[^"\\]|\\.){200,})"/g;
let sm;
let found = [];
while ((sm = strRe.exec(full)) !== null) {
  found.push({ index: sm.index, length: sm[1].length, head: sm[1].slice(0, 80) });
}
console.log('\n=== Long quoted strings:', found.length, '===');
found.forEach((f, i) => {
  console.log(`[${i}] len=${f.length} at ${f.index} head=${f.head}`);
});
