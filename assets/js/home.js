/* ============================================================
 * 首页逻辑：渲染游戏卡片 / PWA 安装 / 在线人数
 * ============================================================ */
(function () {
  "use strict";
  var GAMES = [
    { id: "ludo", file: "ludo.html", emoji: "✈️" },
    { id: "truthOrDare", file: "truth-or-dare.html", emoji: "🎡" },
    { id: "dice", file: "dice.html", emoji: "🎲" },
    { id: "darkBeast", file: "dark-beast.html", emoji: "🦁" },
    { id: "slots", file: "slots.html", emoji: "🎰" },
    { id: "monopoly", file: "monopoly.html", emoji: "💎" }
  ];

  function renderCards() {
    var grid = document.getElementById("game-grid");
    if (!grid || !window.MESSAGES) return;
    grid.innerHTML = GAMES.map(function (g) {
      var node = MESSAGES.games[g.id] || {};
      var title = node.title || g.id;
      var tagline = node.tagline || "";
      var href = g.file || (g.id + ".html");
      return (
        '<a href="' + href + '" class="group relative flex min-h-[9.25rem] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3.5 text-white shadow-lg shadow-black/30 backdrop-blur-xl transition duration-300 hover:border-pink-300/60 hover:bg-black/5 sm:min-h-0 sm:rounded-3xl sm:p-6">' +
          '<div class="absolute -right-2 -top-2 text-4xl opacity-20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:opacity-60 sm:-right-4 sm:-top-4 sm:text-7xl">' + g.emoji + '</div>' +
          '<div class="space-y-2 sm:space-y-4">' +
            '<span class="relative z-10 inline-flex max-w-full items-center gap-2 rounded-full bg-transparent py-0 text-sm font-semibold leading-tight text-pink-100 sm:bg-white/10 sm:px-3 sm:py-1 sm:text-xs sm:uppercase sm:tracking-widest sm:text-pink-200">' + LG.escapeHtml(title) + '</span>' +
            '<p class="overflow-hidden text-[11px] leading-snug text-white/60 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:block sm:text-sm sm:leading-relaxed sm:text-white/70">' + LG.escapeHtml(tagline) + '</p>' +
          '</div>' +
          '<div class="relative z-10 mt-3 flex items-center gap-1.5 text-xs font-semibold text-pink-200 transition group-hover:text-pink-100 sm:mt-6 sm:gap-2 sm:text-sm">' + LG.escapeHtml((window.MESSAGES && window.MESSAGES.games && window.MESSAGES.games.viewGame) || "进入游戏") + '<span aria-hidden="true">→</span></div>' +
        '</a>'
      );
    }).join("");
  }

  /* ---------- PWA 安装 ---------- */
  var deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
    var btn = document.getElementById("pwa-btn");
    if (btn) { btn.classList.remove("hidden"); btn.classList.add("inline-flex"); }
  });
  var pwaBtn = document.getElementById("pwa-btn");
  if (pwaBtn) {
    pwaBtn.addEventListener("click", function () {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(function () {
        deferredPrompt = null;
        pwaBtn.classList.add("hidden"); pwaBtn.classList.remove("inline-flex");
      });
    });
  }

  /* ---------- 在线人数 presence ----------
   * 连接专用 presence 端点，服务器自动推送计数。
   * 断线指数退避重连（500ms × 2^n，上限 15s）。
   */
  var PRESENCE_URL = "wss://lovegame-ws.hoothin.com/presence";
  function setConnected() {
    var dot = document.getElementById("online-dot");
    if (dot) dot.className = "h-2 w-2 rounded-full bg-emerald-400";
  }
  function setOnline(count) {
    setConnected();
    var num = document.getElementById("online-num");
    var full = document.getElementById("online-full");
    if (num) num.textContent = count;
    if (full) {
      var tpl = (window.t && window.t("hero.onlineNow", { count: count })) || ("当前在线：" + count);
      full.textContent = tpl;
    }
  }
  var presenceClosed = false, presenceAttempts = 0, presenceTimer = null, presenceWs = null;
  function clearPresenceTimer() {
    if (presenceTimer !== null) { clearTimeout(presenceTimer); presenceTimer = null; }
  }
  function schedulePresence() {
    if (presenceClosed) return;
    presenceAttempts++;
    var delay = Math.min(15000, 500 * Math.pow(2, Math.min(6, presenceAttempts)));
    presenceTimer = setTimeout(connectPresence, delay);
  }
  function connectPresence() {
    clearPresenceTimer();
    if (presenceClosed) return;
    try { presenceWs = new WebSocket(PRESENCE_URL); } catch (e) { schedulePresence(); return; }
    presenceWs.onopen = function () { presenceAttempts = 0; setConnected(); };
    presenceWs.onclose = function () { if (!presenceClosed) schedulePresence(); };
    presenceWs.onmessage = function (ev) {
      var data = ev.data;
      if (typeof data !== "string") return;
      if (data === "pong") return;
      var n = Number(data);
      if (Number.isFinite(n) && n >= 0) { setOnline(n); return; }
      try {
        var o = JSON.parse(data);
        var c = (typeof o.c === "number") ? o.c
          : (o.type === "ONLINE_COUNT" && o.payload && typeof o.payload.count === "number") ? o.payload.count : null;
        if (c !== null) setOnline(c);
      } catch (e) {}
    };
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderCards();
    connectPresence();
  });
  // DOMContentLoaded 可能已触发
  if (document.readyState !== "loading") { renderCards(); connectPresence(); }
})();
