/* ============================================================
 * 浮动分享按钮（ShareButton）
 * 心形按钮 fixed 右上角；首页实心+脉冲，其他页半透明。
 * 菜单：安装 APP / 系统分享 / 复制链接 / 二维码
 * ============================================================ */
(function () {
  "use strict";
  var S = (window.MESSAGES && window.MESSAGES.share) || {};
  function txt(k) { return S[k] || k; }

  // 是否首页（语言根）
  var path = window.location.pathname;
  var lastSeg = decodeURIComponent(path.split("/").pop() || "");
  var isHome = lastSeg === "" || lastSeg === "index.html";

  /* 图标 */
  var ICONS = {
    heart: '<svg class="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
    install: '<svg class="w-5 h-5 text-pink-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path></svg>',
    share: '<svg class="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>',
    copy: '<svg class="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>',
    check: '<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
    qr: '<svg class="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>',
    back: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>'
  };

  var canSystemShare = !!navigator.share;
  var installable = false, deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); deferredPrompt = e; installable = true; renderMenu();
  });

  /* 容器 */
  var root = document.createElement("div");
  root.className = "fixed top-6 right-6 z-[9999]";
  root.innerHTML =
    '<button id="lg-share-btn" aria-label="' + txt("button") + '" class="' +
      (isHome
        ? "group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/50 transition-all duration-300 hover:scale-110 hover:shadow-pink-500/70 cursor-pointer"
        : "group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-pink-500/40 to-pink-600/40 text-white/50 shadow-lg shadow-pink-500/20 transition-all duration-300 hover:from-pink-500 hover:to-pink-600 hover:text-white hover:scale-110 hover:shadow-pink-500/70 cursor-pointer") +
      '">' + ICONS.heart +
      '<span class="' + (isHome
        ? "absolute inset-0 rounded-full bg-pink-400 animate-ping opacity-20"
        : "absolute inset-0 rounded-full bg-pink-400 opacity-0 group-hover:animate-ping group-hover:opacity-20") + '"></span>' +
    '</button>';

  var open = false, qrView = false, copied = false;

  function itemBtn(id, icon, label) {
    return '<button data-act="' + id + '" class="group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-white transition-all duration-200 hover:bg-pink-500/20 hover:shadow-lg hover:shadow-pink-500/20 cursor-pointer">' +
      '<div class="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/20 to-pink-600/20 group-hover:from-pink-500/30 group-hover:to-pink-600/30 transition-all">' + icon + '</div>' +
      '<span class="text-sm font-medium">' + label + '</span></button>';
  }

  function renderMenu() {
    // 移除旧面板
    var old = root.querySelector("#lg-share-panel");
    if (old) old.remove();
    if (!open) return;

    var panel = document.createElement("div");
    panel.id = "lg-share-panel";

    if (qrView) {
      panel.className = "absolute top-16 right-0 w-64 rounded-2xl border border-white/10 bg-gray-900/95 backdrop-blur-lg shadow-2xl shadow-black/50 overflow-hidden fade-in";
      panel.innerHTML =
        '<div class="p-6">' +
          '<button data-act="back" class="mb-4 flex items-center gap-2 text-sm text-pink-300 hover:text-pink-200 transition-colors cursor-pointer">' + ICONS.back + txt("back") + '</button>' +
          '<div class="flex flex-col items-center gap-4">' +
            '<div id="lg-qr-box" class="p-3 rounded-xl bg-white"></div>' +
            '<p class="text-xs text-center text-white/70">' + txt("scanQRCode") + '</p>' +
          '</div>' +
        '</div>';
    } else {
      panel.className = "absolute top-16 right-0 w-64 rounded-2xl border border-white/10 bg-gray-900/95 backdrop-blur-lg shadow-2xl shadow-black/50 overflow-hidden fade-in";
      var inner = "";
      if (installable) inner += itemBtn("install", ICONS.install, txt("installApp"));
      if (canSystemShare) inner += itemBtn("share", ICONS.share, txt("systemShare"));
      inner += itemBtn("copy", copied ? ICONS.check : ICONS.copy, copied ? txt("copied") : txt("copyLink"));
      inner += itemBtn("qr", ICONS.qr, txt("qrCode"));
      panel.innerHTML = '<div class="p-2">' + inner + '</div>';
    }
    root.appendChild(panel);

    if (qrView) {
      var box = panel.querySelector("#lg-qr-box");
      if (box && window.QRCode) {
        box.innerHTML = "";
        new QRCode(box, {
          text: window.location.href, width: 200, height: 200,
          colorDark: "#000000", colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.M
        });
      }
    }
  }

  /* 遮罩 */
  var overlay = document.createElement("div");
  overlay.className = "fixed inset-0 -z-10";
  function showOverlay() {
    if (!root.contains(overlay)) root.appendChild(overlay);
  }
  function hideOverlay() { if (root.contains(overlay)) root.removeChild(overlay); }

  root.addEventListener("click", function (e) {
    var actEl = e.target.closest("[data-act]");
    if (actEl) {
      var act = actEl.getAttribute("data-act");
      if (act === "back") { qrView = false; renderMenu(); return; }
      if (act === "install") {
        if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt.userChoice.finally(function(){ installable=false; deferredPrompt=null; open=false; renderMenu(); }); }
        return;
      }
      if (act === "share") {
        if (navigator.share) navigator.share({ title: document.title, url: window.location.href }).catch(function(){});
        return;
      }
      if (act === "copy") {
        var done = function () {
          copied = true; renderMenu();
          setTimeout(function () { copied = false; open = false; renderMenu(); hideOverlay(); }, 1500);
        };
        if (navigator.clipboard && navigator.clipboard.writeText)
          navigator.clipboard.writeText(window.location.href).then(done).catch(done);
        else done();
        return;
      }
      if (act === "qr") { qrView = true; renderMenu(); return; }
    }
    if (e.target.closest("#lg-share-btn")) {
      open = !open; qrView = false;
      if (open) { showOverlay(); renderMenu(); } else { hideOverlay(); renderMenu(); }
    }
  });
  overlay.addEventListener("click", function () { open = false; qrView = false; hideOverlay(); renderMenu(); });

  function mount() { if (!document.body.contains(root)) document.body.appendChild(root); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
