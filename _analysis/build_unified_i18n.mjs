// 构建统一多语言库 assets/js/i18n.js
import fs from "node:fs";
import path from "node:path";

const langs = ["cn", "en", "tw", "ja", "ko"];
const files = {
  cn: path.resolve(import.meta.dirname, "../assets/js/i18n.cn.js"),
  en: path.resolve(import.meta.dirname, "../assets/js/i18n.en.js"),
  tw: path.resolve(import.meta.dirname, "../assets/js/i18n.tw.js"),
  ja: path.resolve(import.meta.dirname, "../assets/js/i18n.ja.js"),
  ko: path.resolve(import.meta.dirname, "../assets/js/i18n.ko.js")
};

const all = {};
for (const lang of langs) {
  const code = fs.readFileSync(files[lang], "utf8");
  const idx = code.indexOf(";(function(){");
  const jsonCode = (idx !== -1 ? code.slice(0, idx) : code).trim();
  const fn = new Function("window", jsonCode);
  const win = {};
  fn(win);
  all[lang] = win.MESSAGES;
}

const RUNTIME = `
(function (global) {
  "use strict";

  var LANGS = ["cn", "en", "tw", "ja", "ko"];
  var LANG_LABELS = {
    cn: "简体",
    tw: "正體",
    en: "En",
    ja: "日本語",
    ko: "한국인"
  };
  var HTML_LANGS = {
    cn: "zh-CN",
    tw: "zh-TW",
    en: "en",
    ja: "ja",
    ko: "ko"
  };

  // 1. 语言检测：URL 参数 > LocalStorage > 浏览器语言 > 默认简中
  function detectLang() {
    try {
      var params = new URLSearchParams(window.location.search);
      var q = params.get("lang");
      if (q && LANGS.indexOf(q) !== -1) return q;
    } catch (e) {}

    try {
      var saved = localStorage.getItem("lovegame_lang");
      if (saved && LANGS.indexOf(saved) !== -1) return saved;
    } catch (e) {}

    var nav = (navigator.language || navigator.userLanguage || "").toLowerCase();
    if (nav.indexOf("zh-tw") !== -1 || nav.indexOf("zh-hk") !== -1 || nav.indexOf("zh-mo") !== -1) return "tw";
    if (nav.indexOf("zh") !== -1) return "cn";
    if (nav.indexOf("ja") !== -1) return "ja";
    if (nav.indexOf("ko") !== -1) return "ko";
    if (nav.indexOf("en") !== -1) return "en";
    return "cn";
  }

  var currentLang = detectLang();
  global.CURRENT_LANG = currentLang;
  try { localStorage.setItem("lovegame_lang", currentLang); } catch (e) {}
  document.documentElement.lang = HTML_LANGS[currentLang] || "zh-CN";

  // 2. 挂载当前语言消息字典到 window.MESSAGES
  var dict = (global.I18N_DATA && global.I18N_DATA[currentLang]) || (global.I18N_DATA && global.I18N_DATA.cn) || {};
  global.MESSAGES = dict;

  // 3. 多语言获取辅助函数
  function getMsg(path) {
    if (path == null) return undefined;
    return path.split(".").reduce(function (o, k) { return (o == null) ? o : o[k]; }, global.MESSAGES);
  }
  function fmt(str, params) {
    if (typeof str !== "string" || !params) return str;
    return str.replace(/\\{(\\w+)\\}/g, function (m, k) {
      return (params[k] !== undefined && params[k] !== null) ? params[k] : m;
    });
  }
  function t(key, params) {
    var v = getMsg(key);
    if (v == null) return key;
    if (Array.isArray(v)) return v;
    return fmt(v, params);
  }
  function scoped(ns) {
    return function (key, params) { return t(ns ? (ns + ".") + key : key, params); };
  }

  // 4. 切换语言
  function setLanguage(lang) {
    if (LANGS.indexOf(lang) === -1) return;
    try { localStorage.setItem("lovegame_lang", lang); } catch (e) {}
    var url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.location.href = url.href;
  }

  // 5. DOM 静态元素自动翻译与语言切换器绑定
  function applyI18n() {
    document.documentElement.lang = HTML_LANGS[currentLang] || "zh-CN";

    // 翻译 title
    var titleEl = document.querySelector("title[data-i18n]");
    if (titleEl) {
      var val = t(titleEl.getAttribute("data-i18n"));
      if (val) document.title = val;
    } else if (global.MESSAGES && global.MESSAGES.meta && global.MESSAGES.meta.title) {
      var path = window.location.pathname;
      if (path.endsWith("index.html") || path.endsWith("/")) {
        document.title = global.MESSAGES.meta.title;
      }
    }

    // 翻译 meta[name="description"]
    var descEl = document.querySelector('meta[name="description"][data-i18n]');
    if (descEl) {
      var val = t(descEl.getAttribute("data-i18n"));
      if (val) descEl.setAttribute("content", val);
    } else if (global.MESSAGES && global.MESSAGES.meta && global.MESSAGES.meta.description) {
      var path = window.location.pathname;
      if (path.endsWith("index.html") || path.endsWith("/")) {
        var m = document.querySelector('meta[name="description"]');
        if (m) m.setAttribute("content", global.MESSAGES.meta.description);
      }
    }

    // data-i18n 文本
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      if (el.tagName === "TITLE" || el.tagName === "META") return;
      var k = el.getAttribute("data-i18n");
      var val = t(k);
      if (val && val !== k) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          if (el.type === "button" || el.type === "submit") el.value = val;
          else el.placeholder = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // data-i18n-html
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var k = el.getAttribute("data-i18n-html");
      var val = t(k);
      if (val && val !== k) el.innerHTML = val;
    });

    // 绑定并同步语言切换器高亮状态
    updateLanguageSwitchers(currentLang);

    // 动态渲染 SEO 规则与 FAQ (飞行棋、暗兽棋等)
    renderDynamicInstructions();
  }

  function updateLanguageSwitchers(lang) {
    // 移动端下拉 select
    document.querySelectorAll("select[data-lang-select], select[aria-label='语言'], select[aria-label='Language']").forEach(function (sel) {
      sel.value = lang;
      if (!sel.dataset.bound) {
        sel.dataset.bound = "1";
        sel.addEventListener("change", function () { setLanguage(sel.value); });
      }
    });

    // 桌面端导航按钮
    document.querySelectorAll("[data-lang-nav]").forEach(function (nav) {
      nav.querySelectorAll("[data-lang]").forEach(function (btn) {
        var bLang = btn.getAttribute("data-lang");
        if (bLang === lang) {
          btn.className = "flex items-center rounded-full px-3 py-1 text-sm bg-white text-gray-900 font-semibold cursor-pointer shadow-sm";
        } else {
          btn.className = "flex items-center rounded-full px-3 py-1 text-sm transition text-white/70 hover:text-white cursor-pointer";
        }
        if (!btn.dataset.bound) {
          btn.dataset.bound = "1";
          btn.addEventListener("click", function () { setLanguage(bLang); });
        }
      });
    });
  }

  function renderDynamicInstructions() {
    var el = document.getElementById("instructions");
    if (!el || !global.MESSAGES || !global.MESSAGES.games) return;
    var seo = null;
    var path = window.location.pathname;
    if (path.indexOf("ludo") !== -1 && global.MESSAGES.games.ludo) {
      seo = global.MESSAGES.games.ludo.seo;
    } else if (path.indexOf("dark-beast") !== -1 && global.MESSAGES.games.darkBeast) {
      seo = global.MESSAGES.games.darkBeast.seo;
    }
    if (!seo) return;

    var esc = function (s) {
      return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    };

    var html = "";
    if (seo.about) {
      html += '<div class="space-y-4"><h2 class="text-2xl font-black text-white">' + esc(seo.about.title) + '</h2><p class="leading-relaxed text-white/70">' + esc(seo.about.content) + '</p></div>';
    }
    if (seo.rules && Array.isArray(seo.rules.list)) {
      html += '<div class="space-y-4"><h2 class="text-2xl font-black text-white">' + esc(seo.rules.title) + '</h2><ul class="space-y-3 text-white/70 leading-relaxed list-none">';
      seo.rules.list.forEach(function (item) {
        var idx = item.indexOf("：");
        if (idx === -1) idx = item.indexOf(":");
        if (idx !== -1) {
          html += '<li><strong class="text-white">' + esc(item.slice(0, idx + 1)) + '</strong> ' + esc(item.slice(idx + 1).trim()) + '</li>';
        } else {
          html += '<li>' + esc(item) + '</li>';
        }
      });
      html += '</ul></div>';
    }
    if (seo.faq && Array.isArray(seo.faq.items)) {
      html += '<div class="space-y-4"><h2 class="text-2xl font-black text-white">' + esc(seo.faq.title) + '</h2>';
      seo.faq.items.forEach(function (item) {
        html += '<div class="space-y-2"><p class="font-bold text-white">' + esc(item.q) + '</p><p class="text-white/70 leading-relaxed">' + esc(item.a) + '</p></div>';
      });
      html += '</div>';
    }
    el.innerHTML = html;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyI18n);
  } else {
    applyI18n();
  }

  global.getMsg = getMsg;
  global.t = t;
  global.scoped = scoped;
  global.fmt = fmt;
  global.setLanguage = setLanguage;
  global.applyI18n = applyI18n;
  global.SUPPORTED_LANGS = LANGS;
  global.LANG_LABELS = LANG_LABELS;
})(window);
`;

const outPath = path.resolve(import.meta.dirname, "../assets/js/i18n.js");
const content = "window.I18N_DATA = " + JSON.stringify(all) + ";\n" + RUNTIME;
fs.writeFileSync(outPath, content, "utf8");
console.log("Generated unified i18n at", outPath, (content.length / 1024).toFixed(1), "KB");
