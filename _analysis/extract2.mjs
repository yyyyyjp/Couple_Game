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
    if (!(ch in charIndex)) throw new Error("bad char U+"+str.codePointAt(i).toString(16)+" at "+i);
    let [bits, val] = charIndex[ch];
    if (bits !== 11 && i !== str.length-1) throw new Error("secondary at "+i);
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
const start = mm.index + mm[0].length;
// real end = first newline
const nl = rsc.indexOf("\n", start);
const raw = rsc.substring(start, nl);
console.log("T-declared:", mm[1], "actual raw chars:", raw.length);
const bytes = dec(raw);
console.log("decoded bytes:", bytes.length, "head:", [...bytes.slice(0,4)].map(b=>b.toString(16)).join(" "));
const inflated = zlib.inflateSync(bytes);
console.log("inflated:", inflated.length, "bytes");
const json = JSON.parse(inflated.toString("utf8"));
fs.writeFileSync(process.argv[3], JSON.stringify(json,null,2));
console.log("keys:", Object.keys(json).join(", "));
