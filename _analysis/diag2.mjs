import fs from "node:fs";
const html = fs.readFileSync(process.argv[2], "utf8");
const parts = [];
const re = /self\.__next_f\.push\(\[(\d+),("[\s\S]*?")\]\)<\/script>/g;
let m;
while ((m = re.exec(html)) !== null) parts.push(JSON.parse(m[2]));
const rsc = parts.join("");
const label = rsc.match(/compressedMessages":"\$([0-9a-f]+)"/)[1];
const mm = rsc.match(new RegExp(`(?:^|\\n)${label}:T(\\d+),`));
const start = mm.index + mm[0].length;
const nl = rsc.indexOf("\n", start);
console.log("start:",start,"first nl:",nl,"T-declared:",mm[1]);
// find all T<digits>, patterns after start before nl
const seg = rsc.substring(start, nl);
const tps = [...seg.matchAll(/T(\d+),/g)];
console.log("T patterns within segment:", tps.map(t=>({at:t.index, len:t[1]})));
// context around 13613
console.log("\n--- around 13613 (chars 13600..13660) ---");
console.log(JSON.stringify(seg.substring(13600,13660)));
// context around 32272
console.log("\n--- around 32272 (32250..32320) ---");
console.log(JSON.stringify(seg.substring(32250,32320)));
// tail after 32273 to nl
console.log("\n--- 32273..end (first 200) ---");
console.log(JSON.stringify(seg.substring(32273, 32480)));
console.log("\n--- last 60 before nl ---");
console.log(JSON.stringify(seg.substring(seg.length-60)));
