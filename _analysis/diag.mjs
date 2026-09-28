import fs from "node:fs";
import zlib from "node:zlib";

const codecChunk = "C:\\Users\\yyyyy\\Desktop\\couple\\情侣互动小游戏合集 _ 约会之夜前戏必备_files\\670dd2e99d881907.js.下载";
const codecSrc = fs.readFileSync(codecChunk, "utf8");
const primaryRanges = JSON.parse(codecSrc.match(/\[("(?:[^"\\]|\\.){200,}")\s*,\s*"07"\s*\]\s*\.forEach/)[1]);
const charIndex = {};
[primaryRanges, "07"].forEach((rangeStr, r) => {
  const chars = [];
  rangeStr.match(/../gu).forEach((p) => {
    const lo = p.codePointAt(0), hi = p.codePointAt(1);
    for (let cp = lo; cp <= hi; cp++) chars.push(String.fromCodePoint(cp));
  });
  const bits = 11 - 8 * r;
  chars.forEach((ch, idx) => (charIndex[ch] = [bits, idx]));
});
function dec(str) {
  const out = new Uint8Array(Math.floor((11 * str.length) / 8));
  let acc = 0, bp = 0, bc = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charAt(i);
    let [bits, val] = charIndex[ch];
    for (let b = bits - 1; b >= 0; b--) {
      acc = (acc << 1) + ((val >> b) & 1);
      if (++bc === 8) { out[bp++] = acc; acc = 0; bc = 0; }
    }
  }
  return out.slice(0, bp);
}
const html = fs.readFileSync(process.argv[2], "utf8");
const parts = [];
const re = /self\.__next_f\.push\(\[(\d+),("[\s\S]*?")\]\)<\/script>/g;
let m;
while ((m = re.exec(html)) !== null) parts.push(JSON.parse(m[2]));
const rsc = parts.join("");
const label = rsc.match(/compressedMessages":"\$([0-9a-f]+)"/)[1];
const mm = rsc.match(new RegExp(`(?:^|\\n)${label}:T(\\d+),`));
const len = Number(mm[1]);
const start = mm.index + mm[0].length;
const raw = rsc.substr(start, len);

console.log("declared len:", len, "raw len:", raw.length);
console.log("char after raw (next 80):", JSON.stringify(rsc.substr(start + len, 80)));
const bytes = dec(raw);
console.log("decoded bytes:", bytes.length);
console.log("first 8 bytes:", [...bytes.slice(0, 8)].map((b) => b.toString(16)).join(" "));
console.log("last 8 bytes:", [...bytes.slice(-8)].map((b) => b.toString(16)).join(" "));

// Try all inflate variants
for (const [name, fn] of [["inflate", zlib.inflateSync], ["inflateRaw", zlib.inflateRawSync], ["gunzip", zlib.gunzipSync]]) {
  try {
    const out = fn(bytes);
    console.log(`SUCCESS ${name}: ${out.length} bytes`);
  } catch (e) {
    console.log(`FAIL ${name}: ${e.message}`);
  }
}
// Maybe truncated: inflate as much as possible with partial flush
try {
  const ds = zlib.createInflate();
  let out = Buffer.alloc(0);
  ds.on("data", (d) => (out = Buffer.concat([out, d])));
  ds.write(bytes);
  // do not call end
  console.log("partial inflate (no end) bytes:", out.length, "->", out.toString("utf8").slice(0, 100));
} catch (e) {
  console.log("partial fail:", e.message);
}
