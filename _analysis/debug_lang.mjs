import fs from "node:fs";
function getRsc(html) {
  const parts = [];
  const re = /self\.__next_f\.push\(\[(\d+),("[\s\S]*?")\]\)<\/script>/g;
  let m;
  while ((m = re.exec(html)) !== null) parts.push(JSON.parse(m[2]));
  return parts.join("");
}
for (const lang of ["en", "tw", "ja"]) {
  const html = fs.readFileSync(`home_${lang}.html`, "utf8");
  const rsc = getRsc(html);
  const lm = rsc.match(/compressedMessages":"\$([0-9a-f]+)"/);
  console.log(`\n=== ${lang} === label:`, lm?.[1]);
  if (lm) {
    const idx = rsc.indexOf(lm[1] + ":");
    console.log("decl context:", JSON.stringify(rsc.substring(idx, idx + 30)));
  }
}
