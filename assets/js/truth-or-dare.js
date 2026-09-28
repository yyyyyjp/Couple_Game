/* ============================================================
 * 真心话大冒险（TruthOrDare）
 * 双转盘：先抽玩家，再抽真心话/大冒险；8 个内置题库
 * ============================================================ */
(function () {
  "use strict";
  var M = MESSAGES.games.truthOrDare;
  var e = scoped("games.truthOrDare");
  var PLACEHOLDER = "_PLAYER_";
  var PLACEHOLDER_RE = /_PLAYER_/g;

  var K = {
    players: "truthOrDare.players",
    libs: "truthOrDare.questionLibraries",
    sequential: "truthOrDare.sequentialMode",
    visited: "truthOrDare.libraryVisited",
    working: "truthOrDare.working"
  };

  var WHEEL_COLORS = ["#ec4899", "#a855f7", "#38bdf8", "#22d3ee", "#f97316", "#facc15", "#34d399", "#fb7185"];
  var PLAYER_COLORS = ["#f472b6", "#60a5fa", "#34d399", "#fbbf24", "#c084fc", "#f97316", "#38bdf8", "#f87171"];

  /* 内置题库配置 */
  var BUILTIN = [
    { id: "default", name: "library.defaultName", count: 25, t: "truths", d: "dares" },
    { id: "private", name: "library.privateName", count: 20, t: "privateTruths", d: "privateDares" },
    { id: "icebreaker", name: "library.icebreakerName", count: 12, t: "icebreakerTruths", d: "icebreakerDares" },
    { id: "friends", name: "library.friendsName", count: 12, t: "friendsTruths", d: "friendsDares" },
    { id: "dorm", name: "library.dormName", count: 12, t: "dormTruths", d: "dormDares" },
    { id: "birthday", name: "library.birthdayName", count: 12, t: "birthdayTruths", d: "birthdayDares" },
    { id: "team", name: "library.teamName", count: 12, t: "teamTruths", d: "teamDares" },
    { id: "schoolTrip", name: "library.schoolTripName", count: 12, t: "schoolTripTruths", d: "schoolTripDares" }
  ];

  function uid() { return LG.uuid(); }
  function shuffleArr(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function mod360(x) { return ((x % 360) + 360) % 360; }

  function buildBuiltinLibraries() {
    var out = {};
    BUILTIN.forEach(function (b, idx) {
      var libId = b.id + "-question-library";
      var truths = [], dares = [];
      for (var i = 0; i < b.count; i++) {
        truths.push(M[b.t][i]);
        dares.push(M[b.d][i]);
      }
      out[libId] = { id: libId, name: e(b.name), truths: truths, dares: dares, isDefault: true, isComplete: true, createdAt: idx };
    });
    return out;
  }

  /* ---------- 状态 ---------- */
  var S = {
    players: [],
    libraries: {},
    activeId: "default-question-library",
    workingTruths: [],
    workingDares: [],
    currentPlayer: null,
    phase: "idle",
    wheelItems: [],
    rotation: 0,
    spinning: false,
    notice: null,
    resultType: null,
    resultText: null,
    showResult: false,
    showModeChoice: false,
    sequential: false,
    noRepeat: false,
    drawn: [],
    turnCount: 0,
    modal: null,
    editorType: null,
    libError: null,
    newLibName: "",
    renameId: null,
    renameValue: "",
    editorError: null,
    playersOpen: true
  };

  function load() {
    // 玩家
    var players = null;
    try { var p = localStorage.getItem(K.players); if (p) players = JSON.parse(p); } catch (e) {}
    if (Array.isArray(players) && players.length) {
      S.players = players.map(function (r, l) {
        var o = r && typeof r === "object" ? r : {};
        return {
          id: typeof o.id === "string" ? o.id : uid(),
          name: typeof o.name === "string" && o.name.trim() ? o.name : e("defaultNamePrefix") + " " + (l + 1),
          color: typeof o.color === "string" ? o.color : PLAYER_COLORS[l % PLAYER_COLORS.length]
        };
      });
    } else {
      S.players = [];
      for (var i = 0; i < 3; i++) S.players.push({ id: uid(), name: e("defaultNamePrefix") + " " + (i + 1), color: PLAYER_COLORS[i] });
    }

    // 库
    var libs = buildBuiltinLibraries();
    var activeId = "default-question-library";
    try {
      var saved = localStorage.getItem(K.libs);
      if (saved) {
        var parsed = JSON.parse(saved);
        if (parsed && parsed.libraries) {
          Object.values(parsed.libraries).forEach(function (lib) {
            if (lib && typeof lib === "object" && typeof lib.id === "string" && typeof lib.name === "string"
              && lib.truths && lib.dares && !lib.isDefault) {
              libs[lib.id] = {
                id: lib.id, name: lib.name,
                truths: Object.values(lib.truths), dares: Object.values(lib.dares),
                isComplete: true, createdAt: lib.createdAt || Date.now()
              };
            }
          });
          if (typeof parsed.activeId === "string" && libs[parsed.activeId]) activeId = parsed.activeId;
        }
      }
    } catch (e) {}
    S.libraries = libs; S.activeId = activeId;

    // working 副本
    var loaded = false;
    try {
      var w = localStorage.getItem(K.working);
      if (w) {
        var wo = JSON.parse(w);
        if (wo && wo.id === activeId && Array.isArray(wo.truths) && Array.isArray(wo.dares)) {
          S.workingTruths = wo.truths; S.workingDares = wo.dares; loaded = true;
        }
      }
    } catch (e) {}
    if (!loaded) {
      S.workingTruths = libs[activeId].truths.slice();
      S.workingDares = libs[activeId].dares.slice();
    }

    // 顺序模式
    try { if (localStorage.getItem(K.sequential) === "true") S.sequential = true; } catch (e) {}
    // 题库访问标记（控制高亮）
    try { S.libHighlight = localStorage.getItem(K.visited) !== "true"; } catch (e) { S.libHighlight = true; }
  }

  function savePlayers() { try { localStorage.setItem(K.players, JSON.stringify(S.players.map(function (p) { return { id: p.id, name: p.name }; }))); } catch (e) {} }
  function saveLibs() {
    try {
      var custom = {};
      Object.values(S.libraries).forEach(function (l) { if (!l.isDefault) custom[l.id] = l; });
      localStorage.setItem(K.libs, JSON.stringify({ libraries: custom, activeId: S.activeId }));
    } catch (e) {}
  }
  function saveWorking() {
    try { localStorage.setItem(K.working, JSON.stringify({ id: S.activeId, truths: S.workingTruths, dares: S.workingDares })); } catch (e) {}
  }

  /* ---------- 占位替换 ---------- */
  function fillPlaceholders(text, cur) {
    if (!PLACEHOLDER_RE.test(text)) return text;
    PLACEHOLDER_RE.lastIndex = 0;
    var others = S.players.filter(function (p) { return p.id !== (cur || {}).id && p.name.trim(); });
    if (!others.length) return text.replace(PLACEHOLDER_RE, e("genericPlayer"));
    var order = shuffleArr(others), i = 0;
    return text.replace(PLACEHOLDER_RE, function () { var p = order[i % order.length]; i++; return p.name; });
  }

  /* ---------- 转盘数据构建 ---------- */
  function buildWheelSegments(items) {
    items = items || [];
    var seg;
    if (items.length) {
      seg = items.map(function (it, i) {
        var c = WHEEL_COLORS[i % WHEEL_COLORS.length];
        var s = (i / items.length) * 360, a = ((i + 1) / items.length) * 360;
        return c + " " + s + "deg " + a + "deg";
      }).join(", ");
    } else seg = "rgba(255,255,255,0.05) 0deg 360deg";
    var bg = "conic-gradient(from -90deg, " + seg + ")";

    var maxLen = items.length > 16 ? 5 : (items.length > 8 ? 8 : 12);
    var fontClass = items.length > 16 ? "text-[10px]" : (items.length > 8 ? "text-xs" : "text-sm sm:text-base");

    var labels = items.length ? items.map(function (it, i) {
      var ang = (i + 0.5) * (360 / items.length) - 90;
      var shown = it.length > maxLen ? it.slice(0, maxLen - 1) + "…" : it;
      return '<div class="absolute inset-0 pointer-events-none" style="transform:rotate(' + ang + 'deg)">' +
        '<span class="absolute left-1/2 top-[4%] -translate-x-1/2 text-center ' + fontClass + ' font-bold uppercase tracking-wide text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] select-none" style="writing-mode:vertical-lr;text-orientation:mixed">' + LG.escapeHtml(shown) + "</span></div>";
    }).join("") : "";

    return { bg: bg, labels: labels };
  }

  /* ---------- 转盘渲染 ---------- */
  function renderWheel(items, rotation, spinning, label, spinLabel) {
    items = items || [];
    var segs = buildWheelSegments(items);

    return '<div class="relative flex w-full flex-col items-center gap-6 py-4">' +
      '<div class="relative mx-auto flex w-full items-center justify-center">' +
        '<div class="absolute inset-0 scale-110 animate-pulse rounded-full bg-purple-500/20 blur-3xl"></div>' +
        '<div class="relative w-full max-w-[24rem] rounded-full bg-gradient-to-b from-gray-800 to-black p-3 shadow-2xl ring-1 ring-white/10 lg:max-w-[32rem]" style="aspect-ratio:1 / 1">' +
          '<div id="wheel-disc" class="absolute inset-3 rounded-full shadow-inner will-change-transform" style="background:' + segs.bg + ";transform:rotate(" + rotation + "deg);box-shadow:inset 0 0 24px rgba(0,0,0,0.6)\">" +
            '<div class="absolute inset-0 rounded-full bg-gradient-to-tr from-white/15 to-transparent opacity-60 pointer-events-none"></div>' + segs.labels +
          "</div>" +
          /* 顶部固定指示指针（无机械弹跳） */
          '<div id="wheel-pointer" class="pointer-events-none absolute -top-[28px] left-1/2 -translate-x-1/2 z-30 drop-shadow-[0_4px_12px_rgba(244,63,94,0.6)]">' +
            '<svg width="42" height="56" viewBox="0 0 42 56" fill="none">' +
              '<path d="M21 0L2 48L21 42V0Z" fill="#f43f5e"/>' +
              '<path d="M21 0L40 48L21 42V0Z" fill="#be123c"/>' +
              '<path d="M21 0V42" stroke="#fda4af" stroke-width="0.8"/>' +
              '<circle cx="21" cy="42" r="3.5" fill="#fbbf24" stroke="#ffffff" stroke-width="1.2"/>' +
            '</svg>' +
          "</div>" +
          /* 中心按钮 */
          '<button type="button" data-wheel-center ' + (spinning ? "disabled" : "") + ' aria-label="' + label + '" class="cursor-pointer group absolute inset-0 z-20 flex items-center justify-center disabled:cursor-not-allowed">' +
            '<div class="relative flex aspect-square items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95" style="width:clamp(3.5rem,28%,5rem)">' +
              '<div class="relative z-10 flex h-full w-full items-center justify-center rounded-full border-4 border-gray-800 bg-gradient-to-br from-gray-900 to-black shadow-xl ring-2 ring-white/10">' +
                '<span id="wheel-center-text" class="text-xs font-black uppercase tracking-widest text-white/90">' + (spinning ? "..." : spinLabel) + "</span>" +
              "</div>" +
            "</div>" +
          "</button>" +
        "</div>" +
      "</div>" +
      '<div class="flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/80 backdrop-blur border border-white/10">' +
        '<span class="inline-block size-2 animate-pulse rounded-full bg-emerald-400"></span>' +
        '<span id="wheel-status-badge">' + label + "</span></div>" +
      '<ul id="wheel-items-list" class="custom-scrollbar mt-1 grid max-h-[150px] w-full gap-2 overflow-y-auto rounded-xl border border-white/5 bg-black/20 p-3 text-xs text-white/80 sm:grid-cols-2">' +
        (items.length ? items.map(function (it, i) {
          return '<li class="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 px-3 py-2"><span class="size-2 shrink-0 rounded-full" style="background:' + WHEEL_COLORS[i % WHEEL_COLORS.length] + '"></span><span class="flex-1 truncate">' + LG.escapeHtml(it) + "</span></li>";
        }).join("") : "") + "</ul>" +
    "</div>";
  }

  /* ---------- 物理转盘音效与动效引擎 ---------- */
  var spinTimeout = null, tickTimers = [];
  function clearSpinTimers() {
    if (spinTimeout) { clearTimeout(spinTimeout); spinTimeout = null; }
    tickTimers.forEach(clearTimeout); tickTimers = [];
  }

  function startTicks(duration) {
    duration = duration || 5200;
    var tickCount = 26, r = [];
    for (var i = 0; i < tickCount; i++) {
      var l = i / (tickCount - 1);
      r.push(35 + Math.pow(l, 2.4) * 480);
    }
    var total = r.reduce(function (a, b) { return a + b; }, 0);
    var scale = duration / total;

    function playTick(i) {
      if (i >= tickCount || !S.spinning) return;
      LG.sound.play("tick");
      tickTimers.push(setTimeout(function () { playTick(i + 1); }, r[i] * scale));
    }
    playTick(0);
  }

  function updateControlButtons(spinning) {
    var spinPlayerBtn = document.querySelector('[data-act="spin-player"]');
    var truthBtn = document.querySelector('[data-act="choose-truth"]');
    var dareBtn = document.querySelector('[data-act="choose-dare"]');
    var centerBtn = document.querySelector('[data-wheel-center]');
    var centerText = document.getElementById("wheel-center-text");
    var badge = document.getElementById("wheel-status-badge");

    if (spinPlayerBtn) spinPlayerBtn.disabled = spinning;
    if (truthBtn) truthBtn.disabled = spinning;
    if (dareBtn) dareBtn.disabled = spinning;
    if (centerBtn) centerBtn.disabled = spinning;
    if (centerText) centerText.textContent = spinning ? "..." : e("spin");
    if (badge) {
      var wheelLabel = S.phase === "truth" ? e("chooseTruth") : S.phase === "dare" ? e("chooseDare") : e("spinPlayer");
      badge.textContent = wheelLabel + (spinning ? " (" + e("spin") + "...)" : "");
    }
  }

  function updateWheelListAndBadge(items, purpose, spinning) {
    var badge = document.getElementById("wheel-status-badge");
    if (badge) {
      var wheelLabel = purpose === "truth" ? e("chooseTruth") : purpose === "dare" ? e("chooseDare") : e("spinPlayer");
      badge.textContent = wheelLabel + (spinning ? " (" + e("spin") + "...)" : "");
    }
    var list = document.getElementById("wheel-items-list");
    if (list && items && items.length) {
      list.innerHTML = items.map(function (it, i) {
        return '<li class="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 px-3 py-2">' +
          '<span class="size-2 shrink-0 rounded-full" style="background:' + WHEEL_COLORS[i % WHEEL_COLORS.length] + '"></span>' +
          '<span class="flex-1 truncate">' + LG.escapeHtml(it) + "</span></li>";
      }).join("");
    }
  }

  function updateCurrentPlayerBadge() {
    var el = document.getElementById("current-player-name");
    if (el) {
      el.textContent = S.currentPlayer ? S.currentPlayer.name : e("noPlayers");
    }
  }

  function ensureCurrentPlayer() {
    if (!S.currentPlayer) {
      var valid = S.players.filter(function (p) { return p.name.trim(); });
      if (valid.length) {
        S.currentPlayer = valid[0];
        updateCurrentPlayerBadge();
      }
    }
    return S.currentPlayer;
  }

  function spinWheel(entries, purpose, onEmpty, onComplete) {
    if (S.spinning) return;
    var a = entries.map(function (x) { return x.trim(); }).filter(Boolean);
    if (!a.length) { onEmpty(); S.phase = "idle"; S.wheelItems = []; render(); return; }

    S.phase = purpose;
    var generic = e("genericPlayer");
    var display = a;
    if (purpose === "truth" || purpose === "dare") {
      display = a.map(function (x) { return x.replace(PLACEHOLDER_RE, generic); });
    }
    S.wheelItems = display;

    var n = 360 / a.length;
    var o = LG.randInt(a.length);
    var spins = 5 + Math.floor(Math.random() * 2); // 5~6 圈平滑飞旋
    var u = 0.32 * n * (2 * Math.random() - 1);
    var p = mod360(-(-90 + o * n + n / 2 + u));
    var delta = mod360(p - mod360(S.rotation));
    var targetRotation = S.rotation + 360 * spins + delta;
    var startRotation = S.rotation;
    S.rotation = targetRotation;
    S.spinning = true;

    // 确保转盘在 DOM 中
    var disc = document.getElementById("wheel-disc");
    if (!disc) {
      render();
      disc = document.getElementById("wheel-disc");
    }

    // 1. 如果转盘内容变化，平滑切换扇区并定格在 startRotation
    var segs = buildWheelSegments(display);
    if (disc) {
      disc.style.background = segs.bg;
      disc.innerHTML = '<div class="absolute inset-0 rounded-full bg-gradient-to-tr from-white/15 to-transparent opacity-60 pointer-events-none"></div>' + segs.labels;
      disc.style.transition = "none";
      disc.style.transform = "rotate(" + startRotation + "deg)";
      void disc.offsetWidth; // 关键：强制重绘，确保起点确立！
    }

    // 2. 禁用操作按钮
    updateControlButtons(true);

    // 3. 更新下方列表与状态提示
    updateWheelListAndBadge(display, purpose, true);

    // 4. 启动高帧率减速贝塞尔飞旋 (5.2 秒)
    var spinDuration = 5200;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (!disc || !S.spinning) return;
        disc.style.transition = "transform " + spinDuration + "ms cubic-bezier(0.12, 0.85, 0.2, 1)";
        disc.style.transform = "rotate(" + targetRotation + "deg)";
      });
    });

    // 5. Web Audio 渐缓 Tick 音效（指针固定，无弹跳）
    startTicks(spinDuration);

    spinTimeout = setTimeout(function () {
      clearSpinTimers();
      S.spinning = false;
      updateControlButtons(false);
      updateWheelListAndBadge(display, purpose, false);
      onComplete(o, a[o]);
    }, spinDuration + 100);
  }

  /* ---------- 选玩家 ---------- */
  function pickPlayer() {
    if (S.spinning) return;
    var valid = S.players.filter(function (p) { return p.name.trim(); });
    if (!valid.length) {
      S.notice = e("noPlayers");
      LG.toast(e("noPlayers"));
      S.phase = "idle";
      S.wheelItems = [];
      render();
      return;
    }
    if (S.sequential) {
      var idx = 0;
      if (S.currentPlayer) {
        var fi = valid.findIndex(function (p) { return p.id === S.currentPlayer.id; });
        if (fi >= 0) idx = (fi + 1) % valid.length;
      }
      S.currentPlayer = valid[idx];
      S.notice = null;
      updateCurrentPlayerBadge();
      afterPlayerPicked();
      LG.sound.play("select");
      renderModal();
      return;
    }
    spinWheel(valid.map(function (p) { return p.name; }), "player",
      function () { S.notice = e("noPlayers"); render(); },
      function (i) {
        S.currentPlayer = valid[i];
        S.notice = null;
        updateCurrentPlayerBadge();
        afterPlayerPicked();
        renderModal();
      });
  }
  function afterPlayerPicked() { S.showModeChoice = true; }

  /* ---------- 选题 ---------- */
  function choosePrompt(type) {
    if (S.spinning) return;
    S.showModeChoice = false;
    renderModal(); // 立即关闭模式选择弹窗，露出现场大转盘

    var valid = S.players.filter(function (p) { return p.name.trim(); });
    if (!valid.length) {
      S.notice = e("noPlayers");
      LG.toast(e("noPlayers"));
      S.phase = "idle";
      render();
      return;
    }
    if (!S.currentPlayer) {
      S.currentPlayer = valid[0];
      updateCurrentPlayerBadge();
    }

    var src = type === "truth" ? S.workingTruths : S.workingDares;
    var others = S.players.filter(function (p) { return p.id !== S.currentPlayer.id && p.name.trim(); }).length;
    var pool = src.map(function (x) { return x.trim(); }).filter(function (x) { return (x.match(PLACEHOLDER_RE) || []).length <= others; });
    if (type === "truth") LG.recordDetailStat("truthsChosen"); else LG.recordDetailStat("daresChosen");
    S.notice = null;
    var entries;
    if (S.noRepeat) entries = [...new Set(pool)].filter(function (x) { return S.drawn.indexOf(x) < 0; });
    else entries = pool;

    spinWheel(entries, type,
      function () {
        S.notice = e(S.noRepeat && pool.length > 0 ? "noRepeatExhausted" : "noPrompts");
        LG.toast(S.notice);
        render();
      },
      function (i, text) {
        if (S.noRepeat) S.drawn.push(text);
        S.resultType = type;
        S.resultText = fillPlaceholders(text, S.currentPlayer);
        S.showResult = true;
        LG.sound.play("fanfare");
        S.turnCount++;
        if (S.turnCount >= S.players.length && S.players.length) {
          LG.incrementGameSession("truthOrDare", 10);
          S.turnCount = 0;
        }
        saveWorking();
        renderModal();
      });
  }
  function confirmResult() { S.showResult = false; S.phase = "idle"; S.wheelItems = []; render(); }

  /* ---------- 主界面 ---------- */
  function render() {
    var cp = S.currentPlayer;
    var idleItems = S.phase === "idle" ? S.players.map(function (p) { return p.name.trim(); }).filter(Boolean) : S.wheelItems;
    var wheelLabel = S.phase === "truth" ? e("chooseTruth") : S.phase === "dare" ? e("chooseDare") : e("spinPlayer");
    var spinLabel = e("spin");

    var html =
      '<section class="glass-effect relative overflow-clip rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-4 sm:p-8 shadow-2xl">' +
        '<div class="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-purple-600/20 blur-[100px]"></div>' +
        '<div class="pointer-events-none absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-blue-600/20 blur-[100px]"></div>' +
        '<header class="relative z-10 flex flex-col items-center text-center">' +
          '<h1 class="bg-gradient-to-b from-white via-purple-100 to-white/60 bg-clip-text text-3xl font-black uppercase tracking-tighter text-transparent sm:text-5xl">' + e("title") + "</h1>" +
          '<div class="mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>' +
          '<p class="mt-4 max-w-3xl px-4 text-sm leading-relaxed text-white/65">' + e("tagline") + "</p>" +
        "</header>" +
        '<div class="relative mt-4 z-10 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">' +
          /* 左主卡 */
          '<div class="flex min-w-0 flex-col">' +
            '<div class="relative flex flex-col items-center overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 px-2 py-8 sm:p-8 shadow-2xl">' +
              '<div class="absolute inset-0 opacity-20" style="background-image:radial-gradient(#fff 1px,transparent 1px);background-size:30px 30px"></div>' +
              '<div class="relative z-10 mb-6 flex items-center justify-center">' +
                '<div class="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-2 shadow-lg backdrop-blur-md">' +
                  '<span class="text-xs font-bold uppercase tracking-widest text-white/50">' + e("currentTurn") + "</span>" +
                  '<div class="h-4 w-px bg-white/20"></div>' +
                  '<span id="current-player-name" class="text-sm font-bold text-white">' + (cp ? LG.escapeHtml(cp.name) : e("noPlayers")) + "</span>" +
                "</div></div>" +
              '<div class="relative z-10 mb-6 flex flex-wrap items-center justify-center gap-3">' +
                '<button data-act="spin-player" ' + (S.spinning ? "disabled" : "") + ' class="cursor-pointer group relative overflow-hidden rounded-full bg-white px-7 py-3 text-sm font-bold uppercase tracking-wider text-black shadow transition hover:scale-105 disabled:opacity-50 disabled:hover:scale-100">' +
                  (S.sequential ? e("nextPlayer") : e("spinPlayer")) + "</button>" +
                '<button data-act="choose-truth" ' + (S.spinning ? "disabled" : "") + ' class="cursor-pointer rounded-full border border-purple-400/50 bg-purple-500/10 px-5 py-3 text-xs font-bold uppercase tracking-wider text-purple-200 transition hover:bg-purple-500/20 disabled:opacity-50">' + e("chooseTruth") + "</button>" +
                '<button data-act="choose-dare" ' + (S.spinning ? "disabled" : "") + ' class="cursor-pointer rounded-full border border-rose-400/50 bg-rose-500/10 px-5 py-3 text-xs font-bold uppercase tracking-wider text-rose-200 transition hover:bg-rose-500/20 disabled:opacity-50">' + e("chooseDare") + "</button>" +
              "</div>" +
              (S.notice && S.phase === "idle" ? '<p class="relative z-10 mb-4 max-w-md px-4 text-center text-sm text-amber-200">' + S.notice + "</p>" : "") +
              renderWheel(idleItems, S.rotation, S.spinning, wheelLabel, spinLabel) +
            "</div></div>" +
          /* 右栏 */
          '<div class="space-y-5 px-2 sm:px-0">' +
            /* 玩家折叠 */
            '<div class="overflow-hidden rounded-3xl border border-white/10 bg-black/20 shadow-inner">' +
              '<button data-act="toggle-players" class="cursor-pointer flex w-full items-center justify-between bg-white/5 px-5 py-4 text-left hover:bg-white/10">' +
                '<span class="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-white/90">' +
                  '<span class="flex size-6 items-center justify-center rounded-full bg-purple-500/20 text-purple-300">👥</span>' +
                  e("playerCountLabel") + ' <span class="text-white/50">(' + S.players.length + ")</span></span>" +
                '<span class="inline-flex size-6 items-center justify-center rounded-full border border-white/10 text-xs text-white/50 ' + (S.playersOpen ? "rotate-180" : "") + '">▼</span>' +
              "</button>" +
              (S.playersOpen ? '<div class="fade-in space-y-3 p-5 pt-3">' +
                '<button data-act="add-player" class="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-4 py-3 text-sm font-bold uppercase tracking-wider text-white">+ ' + e("addPlayer") + "</button>" +
                '<div class="custom-scrollbar max-h-[280px] space-y-2 overflow-y-auto pr-2">' +
                  S.players.map(function (r) {
                    return '<div class="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-2 pl-3">' +
                      '<input type="color" value="' + r.color + '" data-player-color="' + r.id + '" class="size-6 rounded-full cursor-pointer shrink-0" />' +
                      '<input value="' + LG.escapeHtml(r.name) + '" data-player-name="' + r.id + '" placeholder="' + e("playerNamePlaceholder") + '" class="flex-1 min-w-0 bg-transparent text-sm font-medium text-white focus:outline-none" />' +
                      '<button data-player-del="' + r.id + '" class="shrink-0 flex size-7 items-center justify-center rounded-lg text-white/20 hover:bg-rose-500/20 hover:text-rose-400 cursor-pointer">✕</button></div>';
                  }).join("") +
                "</div></div>" : "") +
            "</div>" +
            /* 顺序模式 */
            '<div class="cursor-pointer flex items-center justify-between rounded-3xl border border-white/10 bg-black/20 p-5" data-act="toggle-sequential">' +
              '<span class="text-sm font-bold uppercase tracking-wider text-white/90">' + e("sequentialMode") + "</span>" +
              '<div class="relative h-6 w-10 rounded-full ' + (S.sequential ? "bg-purple-500" : "bg-white/20") + '"><div class="absolute top-1 left-1 size-4 rounded-full bg-white transition-transform ' + (S.sequential ? "translate-x-4" : "") + '"></div></div>' +
            "</div>" +
            /* 不重复 */
            '<div class="rounded-3xl border border-white/10 bg-black/20 p-5">' +
              '<div class="flex items-center gap-3">' +
                '<button data-act="toggle-norepeat" ' + (S.spinning ? "disabled" : "") + ' class="flex flex-1 cursor-pointer items-center justify-between gap-3 text-left disabled:opacity-50">' +
                  '<span class="text-sm font-bold text-white/90">' + e("noRepeat") + "</span>" +
                  '<span class="relative h-6 w-10 shrink-0 rounded-full ' + (S.noRepeat ? "bg-purple-500" : "bg-white/20") + '"><span class="absolute top-1 left-1 size-4 rounded-full bg-white ' + (S.noRepeat ? "translate-x-4" : "") + '"></span></span>' +
                "</button>" +
                '<button data-act="reset-draw" ' + (!S.drawn.length || S.spinning ? "disabled" : "") + ' class="shrink-0 cursor-pointer rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/80 disabled:opacity-40">' + e("resetPrompt") + "</button>" +
              "</div>" +
              (S.noRepeat ? '<p class="mt-2 text-xs text-purple-200">' + e("drawnPromptCount", { count: S.drawn.length }) + "</p>" : "") +
            "</div>" +
            /* 题库控制 */
            '<div class="rounded-3xl border border-white/10 bg-black/20 p-5">' +
              '<div class="flex items-center justify-between gap-3 mb-2">' +
                '<h3 class="text-xs font-bold uppercase tracking-widest text-white/40">' + e("promptControlsLabel") + "</h3>" +
                '<button data-act="open-libs" class="cursor-pointer inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/20 px-3 py-1.5 text-xs font-bold text-purple-200 hover:bg-purple-500/30">📚 ' + e("library.buttonLabel") + "</button>" +
              "</div>" +
              '<p class="mb-2 text-xs text-purple-200">' + e("library.current", { name: S.libraries[S.activeId].name }) + "</p>" +
              '<p class="mb-4 text-xs text-white/60 leading-relaxed">' + e("promptControlsDescription") + "</p>" +
              '<div class="grid grid-cols-2 gap-3">' +
                '<button data-act="edit-truths" class="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs font-bold uppercase tracking-wide text-purple-200 hover:bg-white/10">' + e("editBuiltInTruths") + "</button>" +
                '<button data-act="edit-dares" class="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs font-bold uppercase tracking-wide text-rose-200 hover:bg-white/10">' + e("editBuiltInDares") + "</button>" +
              "</div>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</section>";
    document.getElementById("tod-root").innerHTML = html;
    renderModal();
  }

  /* ---------- 弹窗 ---------- */
  function overlay(inner, maxW) {
    return '<div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md fade-in">' +
      '<div class="modal-pop w-full ' + (maxW || "max-w-md") + ' rounded-[2rem] border border-white/10 bg-[#1a1a1a] shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">' +
      inner + "</div></div>";
  }

  /* 选择 truth/dare（玩家抽中后） */
  function modeChoiceModal() {
    var cp = S.currentPlayer;
    var inner =
      '<div class="p-8 text-center overflow-y-auto">' +
        '<h3 class="text-2xl font-black italic text-white"><span class="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">' + e("itsYourTurn") + "</span><br>" + LG.escapeHtml(cp.name) + "</h3>" +
        '<p class="mt-4 text-sm font-medium text-white/50">' + e("modeChoiceSubtitle") + "</p>" +
        '<div class="mt-8 grid grid-cols-2 gap-4">' +
          '<button data-modal-act="pick-truth" class="cursor-pointer group flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border border-purple-500/30 bg-purple-500/10 hover:-translate-y-1 hover:border-purple-500 hover:bg-purple-500/20">' +
            '<span class="text-6xl">?</span><span class="text-sm font-bold uppercase tracking-widest text-purple-300">' + e("chooseTruth") + "</span></button>" +
          '<button data-modal-act="pick-dare" class="cursor-pointer group flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 hover:-translate-y-1 hover:border-rose-500 hover:bg-rose-500/20">' +
            '<span class="text-6xl">!</span><span class="text-sm font-bold uppercase tracking-widest text-rose-300">' + e("chooseDare") + "</span></button>" +
        "</div>" +
      "</div>";
    return overlay(inner);
  }

  /* 结果弹窗 */
  function resultModal() {
    var isTruth = S.resultType === "truth";
    var inner =
      '<div class="relative h-28 w-full shrink-0 overflow-hidden ' + (isTruth ? "bg-gradient-to-br from-purple-600 to-indigo-900" : "bg-gradient-to-br from-rose-600 to-orange-900") + '">' +
        '<div class="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-[#1a1a1a] to-transparent"></div>' +
        '<button data-modal-act="close-result" class="cursor-pointer absolute right-5 top-5 flex size-8 items-center justify-center rounded-full bg-black/20 text-white/70 hover:bg-white hover:text-black">✕</button>' +
      "</div>" +
      '<div class="relative px-8 pb-8 -mt-10 overflow-y-auto">' +
        '<div class="flex justify-center"><div class="flex size-20 items-center justify-center rounded-full border-4 border-[#1a1a1a] bg-[#2a2a2a] shadow-xl text-5xl font-black text-white">' + (isTruth ? "?" : "!") + "</div></div>" +
        '<div class="mt-5 text-center">' +
          '<div class="inline-block rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest ' + (isTruth ? "bg-purple-500/20 text-purple-300" : "bg-rose-500/20 text-rose-300") + '">' + (isTruth ? e("chooseTruth") : e("chooseDare")) + "</div>" +
          '<h3 class="mt-3 text-xl font-bold text-white">' + LG.escapeHtml(S.currentPlayer.name) + "</h3>" +
          '<div class="mt-5 rounded-2xl border border-white/5 bg-white/5 p-5"><p class="text-lg font-medium leading-relaxed text-white/90">' + LG.escapeHtml(S.resultText) + "</p></div>" +
        "</div>" +
        '<button data-modal-act="close-result" class="cursor-pointer mt-7 w-full rounded-xl bg-white py-4 text-sm font-bold uppercase tracking-widest text-black hover:bg-gray-200">' + e("confirm") + "</button>" +
      "</div>";
    return overlay(inner, "max-w-lg");
  }

  /* 库管理弹窗 */
  function libsModal() {
    var list = Object.values(S.libraries).sort(function (a, b) {
      var ad = a.isDefault ? a.createdAt : a.createdAt;
      return b.createdAt - a.createdAt;
    });
    var inner =
      '<div class="flex items-center justify-between p-5 pb-4 shrink-0">' +
        "<div><h3 class='text-lg font-bold text-white flex items-center gap-2'>📚 " + e("library.title") + "</h3>" +
        '<p class="text-sm text-white/60 mt-1">' + e("library.subtitle") + "</p></div>" +
        '<button data-modal-act="close-libs" class="cursor-pointer shrink-0 rounded-full bg-white/5 size-10 flex items-center justify-center text-white/60 hover:bg-white/10">✕</button>' +
      "</div>" +
      (S.libError ? '<div class="mx-5 mb-3 rounded-xl bg-rose-500/20 border border-rose-500/30 p-3 text-sm text-rose-200">' + S.libError + "</div>" : "") +
      '<div class="mx-5 mb-4 rounded-xl border border-white/10 bg-white/5 p-4 shrink-0">' +
        '<label class="text-sm font-semibold text-white/80 mb-2 block">' + e("library.newLabel") + "</label>" +
        '<div class="flex gap-2"><input data-lib-input value="' + LG.escapeHtml(S.newLibName) + '" placeholder="' + e("library.namePlaceholder") + '" class="flex-1 min-w-0 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-white focus:outline-none focus:border-purple-500" />' +
        '<button data-modal-act="save-lib" class="cursor-pointer rounded-xl bg-purple-600 px-5 py-2 font-bold text-white hover:bg-purple-500 whitespace-nowrap">' + e("library.saveNew") + "</button></div>" +
      "</div>" +
      '<div class="flex-1 overflow-y-auto custom-scrollbar px-5 space-y-3">' +
        list.map(function (lib) {
          var active = S.activeId === lib.id;
          var nameHtml;
          if (S.renameId === lib.id) {
            nameHtml = '<input data-rename-input value="' + LG.escapeHtml(S.renameValue) + '" class="rounded border border-white/20 bg-black/50 px-2 py-0.5 text-sm font-bold text-white focus:border-purple-500 focus:outline-none min-w-0" />';
          } else nameHtml = '<h4 class="font-bold text-white">' + LG.escapeHtml(lib.name) + "</h4>";
          return '<div class="relative rounded-xl border p-4 ' + (active ? "border-purple-500/50 bg-purple-500/10" : "border-white/10 bg-white/5") + '">' +
            '<div class="relative flex flex-wrap items-center gap-2 mb-1">' + nameHtml +
              (active ? '<span class="rounded-full border border-purple-500/30 bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-300">' + e("library.activeBadge") + "</span>" : "") +
              (lib.isDefault ? '<span class="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/50">' + e("library.defaultBadge") + "</span>" : "") +
            "</div>" +
            '<p class="text-xs text-white/60 mb-2">' + e("library.promptCounts", { truths: lib.truths.length, dares: lib.dares.length }) + "</p>" +
            '<div class="flex flex-wrap items-center gap-2 text-[11px]">' +
              '<button data-lib-use="' + lib.id + '" class="cursor-pointer rounded-full border border-sky-400/60 px-3 py-1 font-semibold text-sky-100">' + (active ? e("library.reload") : e("library.use")) + "</button>" +
              (!lib.isDefault ?
                '<button data-lib-rename="' + lib.id + '" class="cursor-pointer rounded-full border border-white/30 px-3 py-1 font-semibold text-white/80">' + e("library.rename") + "</button>" +
                '<button data-lib-overwrite="' + lib.id + '" class="cursor-pointer rounded-full border border-amber-400/60 px-3 py-1 font-semibold text-amber-100">' + e("library.overwrite") + "</button>" +
                '<button data-lib-delete="' + lib.id + '" class="cursor-pointer rounded-full border border-rose-400/60 px-3 py-1 font-semibold text-rose-100">' + e("library.delete") + "</button>"
                : "") +
            "</div></div>";
        }).join("") +
      "</div>" +
      '<div class="p-5 pt-4 shrink-0"><button data-modal-act="close-libs" class="cursor-pointer w-full rounded-xl bg-white py-3 text-sm font-bold text-black hover:bg-gray-200">' + e("library.close") + "</button></div>";
    return overlay(inner, "max-w-2xl");
  }

  /* 题目编辑弹窗 */
  function editorModal() {
    var isTruth = S.editorType === "truth";
    var arr = isTruth ? S.workingTruths : S.workingDares;
    var title = isTruth ? e("truthManagerTitle") : e("dareManagerTitle");
    var inner =
      '<div class="flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-4 shrink-0">' +
        "<div><h3 class='text-lg font-bold text-white'>" + title + "</h3>" +
        '<p class="text-[10px] text-white/50 uppercase tracking-wider mt-1">' + e("promptManagerDescription") + "</p></div>" +
        '<button data-modal-act="close-editor" class="cursor-pointer rounded-full bg-white/10 size-8 flex items-center justify-center text-white/70">✕</button>' +
      "</div>" +
      (S.editorError ? '<div class="mx-6 mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs text-red-200">' + errText(S.editorError) + "</div>" : "") +
      '<div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-6 space-y-3">' +
        arr.map(function (val, i) {
          return '<div class="group relative rounded-xl border border-white/10 bg-black/20">' +
            '<div class="absolute left-3 top-2 text-[10px] font-bold uppercase text-white/30">#' + (i + 1) + "</div>" +
            '<textarea data-edit="' + i + '" rows="1" class="w-full bg-transparent px-4 pt-6 pb-2 text-sm text-white focus:outline-none resize-none min-h-[2.6em]">' + LG.escapeHtml(val) + "</textarea>" +
            '<button data-edit-del="' + i + '" ' + (arr.length <= 1 ? "disabled" : "") + ' class="absolute right-2 top-2 size-6 flex items-center justify-center rounded text-white/20 hover:text-rose-400 cursor-pointer">✕</button></div>';
        }).join("") +
      "</div>" +
      '<div class="border-t border-white/10 bg-white/5 px-6 py-4 shrink-0">' +
        '<div class="flex gap-2 mb-3 justify-end">' +
          '<label class="cursor-pointer rounded-lg px-3 py-2 text-xs font-bold uppercase text-white/60 hover:bg-white/10">' + e("importPromptsButton") + '<input type="file" accept=".txt,.json,text/plain" data-import class="hidden" /></label>' +
          '<button data-modal-act="export" class="cursor-pointer rounded-lg px-3 py-2 text-xs font-bold uppercase text-white/60 hover:bg-white/10">' + e("exportPromptsButton") + "</button>" +
        "</div>" +
        '<div class="flex gap-3">' +
          '<button data-modal-act="add-prompt" class="cursor-pointer rounded-xl border border-white/20 px-5 py-2.5 text-xs font-bold uppercase text-white hover:bg-white/10 flex-1">+ ' + e("addPrompt") + "</button>" +
          '<button data-modal-act="close-editor" class="cursor-pointer rounded-xl bg-white px-6 py-2.5 text-xs font-bold uppercase text-black hover:bg-gray-200 flex-1">' + e("confirm") + "</button>" +
        "</div>" +
      "</div>";
    return overlay(inner, "max-w-3xl");
  }
  function errText(code) {
    var map = {
      IMPORT_EMPTY: e("transferErrors.importEmpty"), INVALID_JSON: e("transferErrors.invalidJson"),
      FILE_READ_FAILED: e("transferErrors.fileReadFailed"), INVALID_BASE64: e("transferErrors.invalidBase64"),
      BASE64_UNAVAILABLE: e("transferErrors.unavailable")
    };
    return map[code] || e("transferErrors.generic");
  }

  function renderModal() {
    var html = "";
    if (S.showResult) html = resultModal();
    else if (S.showModeChoice) html = modeChoiceModal();
    else if (S.modal === "libs") html = libsModal();
    else if (S.modal === "editor") html = editorModal();
    document.getElementById("tod-modal-root").innerHTML = html;
  }

  /* Base64 */
  function b64enc(s) { return btoa(unescape(encodeURIComponent(s))); }
  function b64dec(s) { return decodeURIComponent(escape(atob(s.trim()))); }

  /* ---------- 主界面事件 ---------- */
  document.getElementById("tod-root").addEventListener("click", function (ev) {
    if (S.spinning) return;
    var el = ev.target.closest("[data-act]");
    if (!el) {
      // 中心按钮
      var c = ev.target.closest("[data-wheel-center]");
      if (c && !S.spinning) {
        if (S.phase === "truth" || S.phase === "dare") choosePrompt(S.phase);
        else {
          ensureCurrentPlayer();
          if (S.currentPlayer && S.phase === "idle") {
            afterPlayerPicked();
            renderModal();
          } else {
            pickPlayer();
          }
        }
      }
      return;
    }
    var a = el.getAttribute("data-act");
    if (a === "spin-player") pickPlayer();
    else if (a === "choose-truth") choosePrompt("truth");
    else if (a === "choose-dare") choosePrompt("dare");
    else if (a === "toggle-players") S.playersOpen = !S.playersOpen;
    else if (a === "add-player") S.players.push({ id: uid(), name: e("defaultNamePrefix") + " " + (S.players.length + 1), color: PLAYER_COLORS[S.players.length % PLAYER_COLORS.length] });
    else if (a === "toggle-sequential") { S.sequential = !S.sequential; try { localStorage.setItem(K.sequential, S.sequential ? "true" : "false"); } catch (e) {} }
    else if (a === "toggle-norepeat") S.noRepeat = !S.noRepeat;
    else if (a === "reset-draw") { S.drawn = []; }
    else if (a === "open-libs") { S.modal = "libs"; S.libError = null; try { localStorage.setItem(K.visited, "true"); } catch (e) {} }
    else if (a === "edit-truths") { S.modal = "editor"; S.editorType = "truth"; S.editorError = null; }
    else if (a === "edit-dares") { S.modal = "editor"; S.editorType = "dare"; S.editorError = null; }
    savePlayers(); saveWorking();
    if (!S.spinning) render();
  });

  /* 玩家 input */
  document.getElementById("tod-root").addEventListener("input", function (ev) {
    var t = ev.target;
    if (t.hasAttribute("data-player-name")) {
      var id = t.getAttribute("data-player-name");
      S.players.forEach(function (p) { if (p.id === id) p.name = t.value; });
      savePlayers();
    } else if (t.hasAttribute("data-player-color")) {
      var idc = t.getAttribute("data-player-color");
      S.players.forEach(function (p) { if (p.id === idc) p.color = t.value; });
    }
  });
  document.getElementById("tod-root").addEventListener("click", function (ev) {
    var d = ev.target.closest("[data-player-del]");
    if (d) {
      var id = d.getAttribute("data-player-del");
      S.players = S.players.filter(function (p) { return p.id !== id; });
      savePlayers(); render();
    }
  });

  /* ---------- 弹窗事件 ---------- */
  var modalRoot = document.getElementById("tod-modal-root");
  modalRoot.addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-modal-act]");
    if (el) {
      var a = el.getAttribute("data-modal-act");
      if (a === "close-result") { confirmResult(); return; }
      if (a === "pick-truth") { choosePrompt("truth"); return; }
      if (a === "pick-dare") { choosePrompt("dare"); return; }
      if (a === "close-libs") { S.modal = null; }
      else if (a === "save-lib") saveNewLibrary();
      else if (a === "close-editor") { S.modal = null; S.editorType = null; saveWorking(); }
      else if (a === "add-prompt") {
        if (S.editorType === "truth") S.workingTruths.push(""); else S.workingDares.push("");
      }
      else if (a === "export") exportPrompts(ev);
      render();
      return;
    }
    var u = ev.target.closest("[data-lib-use]");
    if (u) { switchLibrary(u.getAttribute("data-lib-use")); return; }
    var rn = ev.target.closest("[data-lib-rename]");
    if (rn) { S.renameId = rn.getAttribute("data-lib-rename"); S.renameValue = S.libraries[S.renameId].name; render(); return; }
    var ow = ev.target.closest("[data-lib-overwrite]");
    if (ow) { overwriteLibrary(ow.getAttribute("data-lib-overwrite")); return; }
    var dl = ev.target.closest("[data-lib-delete]");
    if (dl) { deleteLibrary(dl.getAttribute("data-lib-delete")); return; }
    var ed = ev.target.closest("[data-edit-del]");
    if (ed) {
      var i = parseInt(ed.getAttribute("data-edit-del"), 10);
      if (S.editorType === "truth") { if (S.workingTruths.length > 1) S.workingTruths.splice(i, 1); }
      else { if (S.workingDares.length > 1) S.workingDares.splice(i, 1); }
      saveWorking(); render();
    }
  });

  modalRoot.addEventListener("input", function (ev) {
    var t = ev.target;
    if (t.hasAttribute("data-edit")) {
      var i = parseInt(t.getAttribute("data-edit"), 10);
      if (S.editorType === "truth") S.workingTruths[i] = t.value; else S.workingDares[i] = t.value;
      saveWorking();
    } else if (t.hasAttribute("data-lib-input")) S.newLibName = t.value;
    else if (t.hasAttribute("data-rename-input")) S.renameValue = t.value;
  });

  modalRoot.addEventListener("change", function (ev) {
    var inp = ev.target.closest("[data-import]");
    if (!inp || !inp.files || !inp.files[0]) return;
    var type = S.editorType, file = inp.files[0];
    var reader = new FileReader();
    reader.onload = function () {
      var raw = reader.result; if (typeof raw !== "string") return;
      var t = raw.trim();
      if (!t) { S.editorError = "IMPORT_EMPTY"; render(); return; }
      var parsed = null;
      try { parsed = JSON.parse(t); } catch (e) {
        if (t[0] === "{" || t[0] === "[") { S.editorError = "INVALID_JSON"; render(); return; }
        try { parsed = JSON.parse(b64dec(t)); } catch (e2) { S.editorError = "INVALID_BASE64"; render(); return; }
      }
      if (Array.isArray(parsed)) {
        var strs = parsed.map(function (x) { return typeof x === "string" ? x : ""; });
        if (type === "truth") S.workingTruths = strs; else S.workingDares = strs;
        S.editorError = null; saveWorking(); render();
      } else { S.editorError = "INVALID_JSON"; render(); }
    };
    reader.readAsText(file);
  });

  modalRoot.addEventListener("keydown", function (ev) {
    if (ev.key === "Enter" && ev.target.hasAttribute("data-rename-input")) {
      renameLibrary(S.renameId, S.renameValue);
    } else if (ev.key === "Escape" && S.renameId) { S.renameId = null; render(); }
  });

  /* ---------- 库动作 ---------- */
  function switchLibrary(id) {
    var lib = S.libraries[id]; if (!lib) return;
    clearSpinTimers();
    S.workingTruths = lib.truths.slice(); S.workingDares = lib.dares.slice();
    S.activeId = id; S.modal = null; resetRound();
    saveLibs(); saveWorking(); render();
  }
  function resetRound() {
    S.spinning = false; S.phase = "idle"; S.wheelItems = []; S.notice = null;
    S.resultType = null; S.showResult = false; S.showModeChoice = false; S.turnCount = 0;
  }
  function saveNewLibrary() {
    var name = S.newLibName.trim();
    if (!name) { S.libError = e("library.nameRequired"); render(); return; }
    if (Object.values(S.libraries).some(function (l) { return l.name.toLowerCase() === name.toLowerCase(); })) { S.libError = e("library.nameExists"); render(); return; }
    var id = uid();
    S.libraries[id] = { id: id, name: name, truths: S.workingTruths.slice(), dares: S.workingDares.slice(), isComplete: true, createdAt: Date.now() };
    S.activeId = id; S.newLibName = ""; S.modal = null;
    saveLibs(); saveWorking(); LG.toast(e("library.saveSuccess", { name: name })); render();
  }
  function overwriteLibrary(id) {
    var lib = S.libraries[id];
    if (lib.isDefault) { S.libError = e("library.overwriteDefault"); render(); return; }
    S.libraries[id] = { id: id, name: lib.name, truths: S.workingTruths.slice(), dares: S.workingDares.slice(), isComplete: true, createdAt: Date.now() };
    S.libError = null; saveLibs(); LG.toast(e("library.overwriteSuccess", { name: lib.name })); render();
  }
  function deleteLibrary(id) {
    var lib = S.libraries[id];
    if (lib.isDefault) { S.libError = e("library.deleteDefault"); render(); return; }
    delete S.libraries[id];
    if (S.activeId === id) {
      S.activeId = "default-question-library";
      var d = S.libraries["default-question-library"];
      S.workingTruths = d.truths.slice(); S.workingDares = d.dares.slice();
    }
    S.libError = null; saveLibs(); saveWorking(); render();
  }
  function renameLibrary(id, name) {
    name = (name || "").trim();
    if (!name) { S.renameId = null; render(); return; }
    if (Object.values(S.libraries).some(function (l) { return l.id !== id && l.name.toLowerCase() === name.toLowerCase(); })) {
      S.libError = e("library.nameExists"); S.renameId = null; render(); return;
    }
    S.libraries[id].name = name; S.renameId = null; saveLibs(); render();
  }

  function exportPrompts(ev) {
    var isTruth = S.editorType === "truth";
    var arr = isTruth ? S.workingTruths : S.workingDares;
    var json = JSON.stringify(arr);
    var data = ev.ctrlKey ? json : b64enc(json);
    try {
      var blob = new Blob([data + "\n"], { type: "text/plain;charset=utf-8" });
      var url = URL.createObjectURL(blob), a = document.createElement("a");
      a.href = url; a.download = isTruth ? "truth-prompts.txt" : "dare-prompts.txt";
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    } catch (e2) { S.editorError = "EXPORT_FAILED"; render(); }
  }

  /* ---------- 启动 ---------- */
  load();
  render();
})();
