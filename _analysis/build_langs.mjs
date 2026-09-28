// 批量生成其它语言页面：复制 cn/*.html 到 <lang>/，替换 i18n 引用与语言切换器选中态
import fs from "node:fs";
import path from "node:path";

const CN_DIR = path.resolve("../cn");
const pages = fs.readdirSync(CN_DIR).filter((f) => f.endsWith(".html"));
const langs = ["en", "tw", "ja", "ko"];
const langLabel = { en: "En", tw: "正體", ja: "日本語", ko: "한국인", cn: "简体" };

function transform(html, lang, file) {
  // 1) i18n 引用
  html = html.replace(
    /<script src="\.\.\/assets\/js\/i18n\.js"><\/script>/,
    `<script src="../assets/js/i18n.${lang}.js"></script>`,
  );
  // 2) html lang 属性
  const htmlLang = { en: "en", tw: "zh-TW", ja: "ja", ko: "ko" }[lang];
  html = html.replace(/<html lang="zh-CN">/, `<html lang="${htmlLang}">`);

  // 3) 桌面语言切换 nav：重写每个语言链接
  html = html.replace(
    /<a class="flex items-center rounded-full px-3 py-1 text-sm( bg-white text-gray-900| transition text-white\/70 hover:text-white)" href="([^"]*)">([^<]*)<\/a>/g,
    (m, cls, href, label) => {
      let l = null;
      if (href.startsWith("../")) l = href.split("/")[1];
      else l = "cn";
      const active = l === lang;
      const newCls = active
        ? " bg-white text-gray-900"
        : " transition text-white/70 hover:text-white";
      const newHref = active ? file : l === "cn" ? `../cn/${file}` : `../${l}/${file}`;
      return `<a class="flex items-center rounded-full px-3 py-1 text-sm${newCls}" href="${newHref}">${label}</a>`;
    },
  );

  // 4) 移动端 select：选中目标语言
  html = html.replace(
    /<option value="([a-z]+)" class="bg-gray-900 text-white"( selected)?>([^<]*)<\/option>/g,
    (m, val, sel, label) =>
      `<option value="${val}" class="bg-gray-900 text-white"${val === lang ? " selected" : ""}>${label}</option>`,
  );
  return html;
}

for (const lang of langs) {
  const dir = path.resolve(`../${lang}`);
  fs.mkdirSync(dir, { recursive: true });
  for (const file of pages) {
    const src = fs.readFileSync(path.join(CN_DIR, file), "utf8");
    const out = transform(src, lang, file);
    fs.writeFileSync(path.join(dir, file), out);
  }
  console.log(`${lang}: ${pages.length} pages`);
}
