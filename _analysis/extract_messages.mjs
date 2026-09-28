// Extract and decode compressed i18n messages from Next.js RSC flight data
// Pipeline: RSC raw string (T<len>,...) -> Base2048 decode -> zlib inflate -> JSON
import fs from "node:fs";
import zlib from "node:zlib";

// ---- Base2048 codec: load range table directly from the original chunk ----
const codecChunk =
  process.argv[4] ||
  "C:\\Users\\yyyyy\\Desktop\\couple\\情侣互动小游戏合集 _ 约会之夜前戏必备_files\\670dd2e99d881907.js.下载";
const codecSrc = fs.readFileSync(codecChunk, "utf8");
const rangeArrMatch = codecSrc.match(/\[("(?:[^"\\]|\\.){200,}")\s*,\s*"07"\s*\]\s*\.forEach/);
if (!rangeArrMatch) throw new Error("Could not locate Base2048 range table in codec chunk");
const primaryRanges = JSON.parse(rangeArrMatch[1]);
const tables = {};
const charIndex = {};
[primaryRanges, "07"].forEach((rangeStr, r) => {
  const chars = [];
  rangeStr.match(/../gu).forEach((pair) => {
    const lo = pair.codePointAt(0);
    const hi = pair.codePointAt(1);
    for (let cp = lo; cp <= hi; cp++) chars.push(String.fromCodePoint(cp));
  });
  const bits = 11 - 8 * r;
  tables[bits] = chars;
  chars.forEach((ch, idx) => {
    charIndex[ch] = [bits, idx];
  });
});

function base2048Decode(str) {
  const n = str.length;
  const out = new Uint8Array(Math.floor((11 * n) / 8));
  let acc = 0,
    bytePos = 0,
    bitCount = 0;
  for (let i = 0; i < n; i++) {
    const ch = str.charAt(i);
    if (!(ch in charIndex)) {
      // report offending code point
      throw new Error(`Unrecognised Base2048 char at ${i}: U+${str.codePointAt(i).toString(16)}`);
    }
    let [bits, val] = charIndex[ch];
    if (bits !== 11 && i !== n - 1) throw new Error("Secondary char before end at " + i);
    for (let b = bits - 1; b >= 0; b--) {
      acc = (acc << 1) + ((val >> b) & 1);
      if (++bitCount === 8) {
        out[bytePos++] = acc;
        acc = 0;
        bitCount = 0;
      }
    }
  }
  return out.slice(0, bytePos);
}

// ---- RSC extraction ----
function getRsc(html) {
  const re = /self\.__next_f\.push\(\[(\d+),("[\s\S]*?")\]\)<\/script>/g;
  let m,
    parts = [];
  while ((m = re.exec(html)) !== null) parts.push(JSON.parse(m[2]));
  return parts.join("");
}

const file = process.argv[2];
const outFile = process.argv[3];
const html = fs.readFileSync(file, "utf8");
const rsc = getRsc(html);

const refMatch = rsc.match(/compressedMessages":"\$([0-9a-f]+)"/);
const label = refMatch[1];
console.log("compressedMessages label:", label);

const marker = new RegExp(`(?:^|\\n)${label}:T(\\d+),`);
const mm = rsc.match(marker);
if (!mm) {
  console.error("Could not find raw string marker. T-patterns found:", rsc.match(/[0-9a-f]+:T\d+,/g));
  process.exit(1);
}
const len = Number(mm[1]);
const dataStart = mm.index + mm[0].length;
const raw = rsc.substr(dataStart, len);
console.log("raw base2048 length:", raw.length);

const bytes = base2048Decode(raw);
console.log("decoded bytes:", bytes.length);
const inflated = zlib.inflateSync(bytes);
console.log("inflated bytes:", inflated.length);
const json = JSON.parse(inflated.toString("utf8"));
fs.writeFileSync(outFile, JSON.stringify(json, null, 2), "utf8");
console.log("top-level keys:", Object.keys(json).join(", "));
console.log("Saved ->", outFile);
