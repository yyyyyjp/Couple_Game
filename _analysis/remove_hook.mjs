import fs from "fs";
const p = "E:/Couple_Game/assets/js/dark-beast.js";
let t = fs.readFileSync(p, "utf8");
const before = t.length;
const re = /  \/\* ==== TEMP TEST HOOK[\s\S]*?\};\n\n  init\(\);/;
t = t.replace(re, "  init();");
fs.writeFileSync(p, t);
console.log("removed bytes:", before - t.length, "| has hook:", t.includes("__dbTest"));
