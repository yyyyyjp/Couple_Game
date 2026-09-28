// Robust extraction of compressed i18n messages from Next.js RSC flight data.
// Scan the T-string: every Base2048 char is in the table; the first char not
// in the table marks the end of the string.
import fs from "node:fs";
import zlib from "node:zlib";

function loadCodec(chunkPath) {
  const src = fs.readFileSync(chunkPath, "utf8");
  const primary = JSON.parse(src.match(/\[("(?:[^"\\]|\\.){200,}")\s*,\s*"07"\s*\]\s*\.forEach/)[1]);
  const charIndex = {};
  [primary, "07"].forEach((rangeStr, r) => {
    const chars = [];
    rangeStr.match(/../gu).forEach((p) => {
      const lo = p.codePointAt(0),
        hi = p.codePointAt(1);
      for (let cp = lo; cp <= hi; cp++) chars.push(String.fromCodePoint(cp));
    });
    const bits = 11 - 8 * r;
    chars.forEach((ch, idx) => (charIndex[ch] = [bits, idx]));
  });
  return charIndex;
}

function base2048Decode(str, charIndex) {
  const out = new Uint8Array(Math.floor((11 * str.length) / 8));
  let acc = 0,
    bp = 0,
    bc = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charAt(i);
    if (!(ch in charIndex)) throw new Error("bad char at " + i);
    const [bits, val] = charIndex[ch];
    if (bits !== 11 && i !== str.length - 1) throw new Error("secondary before end at " + i);
    for (let b = bits - 1; b >= 0; b--) {
      acc = (acc << 1) + ((val >> b) & 1);
      if (++bc === 8) {
        out[bp++] = acc;
        acc = 0;
        bc = 0;
      }
    }
  }
  return out.slice(0, bp);
}

function getRsc(html) {
  const parts = [];
  const re = /self\.__next_f\.push\(\[(\d+),("[\s\S]*?")\]\)<\/script>/g;
  let m;
  while ((m = re.exec(html)) !== null) parts.push(JSON.parse(m[2]));
  return parts.join("");
}

function extract(htmlPath, outPath, codecPath) {
  const charIndex = loadCodec(codecPath);
  const html = fs.readFileSync(htmlPath, "utf8");
  const rsc = getRsc(html);
  const label = rsc.match(/compressedMessages":"\$([0-9a-f]+)"/)[1];
  const head = rsc.match(new RegExp(`(?:^|\\n)${label}:T[0-9a-z]+,`));
  let p = head.index + head[0].length;
  while (rsc.charAt(p) in charIndex) p++;
  const raw = rsc.substring(head.index + head[0].length, p);
  const bytes = base2048Decode(raw, charIndex);
  const inflated = zlib.inflateSync(bytes);
  const json = JSON.parse(inflated.toString("utf8"));
  fs.writeFileSync(outPath, JSON.stringify(json, null, 2));
  return { rawChars: raw.length, bytes: bytes.length, inflated: inflated.length, keys: Object.keys(json) };
}

const codec =
  process.argv[4] ||
  "C:\\Users\\yyyyy\\Desktop\\couple\\情侣互动小游戏合集 _ 约会之夜前戏必备_files\\670dd2e99d881907.js.下载";
const res = extract(process.argv[2], process.argv[3], codec);
console.log(res);
