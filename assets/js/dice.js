/* ============================================================
 * 情趣骰子（DiceGame）
 * 状态机：idle / rolling / settling / success / fail / win / penalty
 * ============================================================ */
(function () {
  "use strict";
  var M = MESSAGES.games.dice;
  var e = scoped("games.dice");

  var K = {
    players: "diceGame.players",
    penalties: "diceGame.penalties",
    gameState: "diceGame.gameState",
    playCount: "diceGame.playCount",
    thresholds: "diceGame.stageThresholds",
    libs: "diceGame.penaltyLibraries"
  };
  var DEFAULT_LIB = "default-penalty-library";
  var PRIVATE_LIB = "private-penalty-library";
  var COLORS = ["#ec4899", "#a855f7", "#38bdf8", "#22d3ee", "#f97316", "#facc15", "#34d399", "#fb7185"];
  function uid() { return Math.random().toString(36).slice(2); }

  /* 默认惩罚 → 阶段 */
  function idxStage(i) {
    if (i <= 4 || (i >= 20 && i <= 29)) return 1;
    if (i <= 9 || (i >= 30 && i <= 39)) return 2;
    if (i <= 14 || (i >= 40 && i <= 49)) return 3;
    return 4;
  }
  function buildPenalties(srcKey) {
    var src = M[srcKey], arr = [];
    for (var i = 0; i < 70; i++) arr.push({ text: src[i], stage: idxStage(i) });
    return arr;
  }

  /* ---------- 状态 ---------- */
  var S = {
    players: [],
    penalties: [],
    libraries: {},
    activeLibId: null,
    playCount: 0,
    thresholds: { stage1: 5, stage2: 15, stage3: 30 },
    currentPlayerIndex: 0,
    diceCount: 1,
    targetNumber: 3,
    gameState: "idle",
    currentRolls: [1],
    currentPenalty: null,
    rollTick: 0,
    previewIdx: 0,
    modal: null
  };

  function load() {
    // 玩家
    try {
      var p = localStorage.getItem(K.players);
      if (p) S.players = JSON.parse(p);
    } catch (e) {}
    if (!S.players || !S.players.length) {
      S.players = [
        { id: uid(), name: e("defaultPlayerName") + " 1", color: "#ec4899" },
        { id: uid(), name: e("defaultPlayerName") + " 2", color: "#a855f7" }
      ];
    }
    // 库
    var libs = {}, activeId = null;
    try {
      var l = localStorage.getItem(K.libs);
      if (l) { var parsed = JSON.parse(l); libs = parsed.libraries || {}; activeId = parsed.activeId || null; }
    } catch (e) {}
    var defPen = buildPenalties("defaultPenalties");
    var exDef = libs[DEFAULT_LIB];
    libs[DEFAULT_LIB] = { id: DEFAULT_LIB, name: e("library.defaultName"), penalties: defPen, createdAt: exDef ? exDef.createdAt : Date.now(), isDefault: true };
    var privPen = buildPenalties("privatePenalties");
    var exPriv = libs[PRIVATE_LIB];
    libs[PRIVATE_LIB] = { id: PRIVATE_LIB, name: e("library.privateName"), penalties: privPen, createdAt: exPriv ? exPriv.createdAt : Date.now() + 1, isDefault: true };
    S.libraries = libs;
    if (!activeId) activeId = DEFAULT_LIB;
    S.activeLibId = activeId;

    // 游戏状态
    function gs(k, d) {
      try {
        var g = localStorage.getItem(K.gameState);
        if (g) { var o = JSON.parse(g); return o[k] !== undefined ? o[k] : d; }
      } catch (e) {}
      return d;
    }
    S.currentPlayerIndex = gs("currentPlayerIndex", 0);
    S.diceCount = gs("diceCount", 1);
    S.targetNumber = gs("targetNumber", 3);
    S.gameState = gs("gameState", "idle");
    S.currentRolls = gs("currentRolls", [1]);
    S.currentPenalty = gs("currentPenalty", null);

    // 当前激活库的惩罚
    if (libs[activeId] && libs[activeId].penalties) S.penalties = libs[activeId].penalties.slice();

    // playCount
    try { var pc = localStorage.getItem(K.playCount); if (pc) S.playCount = parseInt(pc, 10) || 0; } catch (e) {}
    // thresholds
    try { var th = localStorage.getItem(K.thresholds); if (th) S.thresholds = JSON.parse(th); } catch (e) {}
  }

  /* ---------- 阶段 ---------- */
  function stageOf() {
    var j = S.playCount, R = S.thresholds;
    return j < R.stage1 ? 1 : j < R.stage2 ? 2 : j < R.stage3 ? 3 : 4;
  }
  function stageColors(st) {
    switch (st) {
      case 1: return { gradient: "from-blue-500 to-cyan-500", text: "text-blue-400", bg: "bg-blue-500/20" };
      case 2: return { gradient: "from-purple-500 to-pink-500", text: "text-purple-400", bg: "bg-purple-500/20" };
      case 3: return { gradient: "from-orange-500 to-red-500", text: "text-orange-400", bg: "bg-orange-500/20" };
      default: return { gradient: "from-red-600 to-rose-700", text: "text-red-400", bg: "bg-red-600/20" };
    }
  }
  function stageProgress() {
    var t = stageOf(), R = S.thresholds, j = S.playCount, cur, tot, name;
    if (t === 1) { cur = j; tot = R.stage1; name = e("stageName1"); }
    else if (t === 2) { cur = j - R.stage1; tot = R.stage2 - R.stage1; name = e("stageName2"); }
    else if (t === 3) { cur = j - R.stage2; tot = R.stage3 - R.stage2; name = e("stageName3"); }
    else { cur = j - R.stage3; tot = 999; name = e("stageName4"); }
    var pct = t === 4 ? 100 : Math.min((cur / tot) * 100, 100);
    return { cur: cur, tot: tot, pct: pct, name: name };
  }

  /* ---------- 3D 骰子 ---------- */
  var PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
  var FACE_ROT = { 1: "rotateX(0deg)", 6: "rotateX(180deg)", 2: "rotateX(90deg)", 5: "rotateX(-90deg)", 3: "rotateY(90deg)", 4: "rotateY(-90deg)" };
  var STOP_ROT = {
    1: "rotateX(0deg) rotateY(0deg)",
    2: "rotateX(-90deg) rotateY(0deg)",
    3: "rotateY(-90deg) rotateX(0deg)",
    4: "rotateY(90deg) rotateX(0deg)",
    5: "rotateX(90deg) rotateY(0deg)",
    6: "rotateX(180deg) rotateY(0deg)"
  };
  function diceFace(val, rot) {
    var pips = PIPS[val], dots = "";
    for (var i = 0; i < 9; i++) {
      var on = pips.indexOf(i) >= 0;
      dots += '<div class="rounded-full ' + (on
        ? "bg-gradient-to-br from-rose-500 via-pink-600 to-purple-800 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_1px_3px_rgba(0,0,0,0.3)] scale-100 ring-1 ring-black/5"
        : "bg-transparent scale-0") + '"></div>';
    }
    return '<div class="absolute inset-0 backface-hidden flex items-center justify-center rounded-xl bg-[#e0e0e0] shadow-[inset_0_0_15px_rgba(0,0,0,0.2)] border border-white/50 ring-1 ring-black/10" style="transform:' + rot + ' translateZ(40px)">' +
      '<div class="absolute inset-0 rounded-xl bg-gradient-to-br from-white via-gray-200 to-gray-400"></div>' +
      '<div class="absolute inset-[2px] rounded-[10px] bg-gradient-to-br from-gray-50 via-white to-gray-200"></div>' +
      '<div class="absolute inset-0 rounded-xl shadow-[inset_2px_2px_4px_rgba(255,255,255,1),inset_-2px_-2px_4px_rgba(0,0,0,0.3)]"></div>' +
      '<div class="relative z-10 grid size-14 grid-cols-3 grid-rows-3 gap-1.5 p-1.5">' + dots + '</div>' +
    '</div>';
  }
  function renderDice(value, rolling, key) {
    if (window.Dice3D) {
      var h = window.Dice3D.buildDiceHtml(value, "dice-" + key);
      if (rolling) {
        h = h.replace('class="dice-3d-scene"', 'class="dice-3d-scene is-airborne"')
             .replace('class="dice-3d-wrapper"', 'class="dice-3d-wrapper is-rolling"');
      }
      return h;
    }
    var faces = "";
    for (var v = 1; v <= 6; v++) faces += diceFace(v, FACE_ROT[v]);
    var transform;
    if (rolling) {
      var n = S.rollTick;
      transform = "rotateX(" + (360 * (n + 1) + key * 72) + "deg) rotateY(" + (360 * (n + 1) + 137 * (key + 1)) + "deg)";
    } else transform = STOP_ROT[value];
    return '<div class="relative" style="width:80px;height:80px;perspective:500px">' +
      '<div class="relative w-full h-full transform-style-preserve-3d transition-transform duration-500 ease-out" style="transform:' + transform + '">' +
      faces + '</div></div>';
  }

  /* 彩纸 */
  function confetti() {
    var out = '<div class="pointer-events-none absolute inset-0 z-50 overflow-hidden">';
    for (var i = 0; i < 50; i++) {
      var left = (100 * Math.random()).toFixed(1);
      var bg = ["#ec4899", "#a855f7", "#fbbf24", "#34d399"][Math.floor(Math.random() * 4)];
      var dl = (2 * Math.random()).toFixed(2), du = (2 + 3 * Math.random()).toFixed(2);
      out += '<div class="absolute h-2 w-2 animate-fall opacity-0" style="left:' + left + '%;top:-10%;background:' + bg + ';animation-delay:' + dl + 's;animation-duration:' + du + 's"></div>';
    }
    return out + "</div>";
  }

  /* ---------- 主渲染 ---------- */
  function currentPlayer() { return S.players[S.currentPlayerIndex % S.players.length]; }
  function sumRolls() { return S.currentRolls.reduce(function (a, b) { return a + b; }, 0); }

  function renderMain() {
    var gs2 = S.gameState, eg = currentPlayer(), sum = sumRolls();
    var sp = stageProgress(), sc = stageColors(stageOf());
    var clickable = (gs2 === "idle" || gs2 === "success" || gs2 === "fail");

    var diceHtml = S.currentRolls.map(function (v, i) {
      return renderDice(v, gs2 === "rolling", i);
    }).join("");

    /* 结果区 */
    var resultHtml = "";
    if (gs2 !== "idle" && gs2 !== "rolling" && gs2 !== "settling") {
      var good = gs2 === "success" || gs2 === "win";
      resultHtml =
        '<div class="modal-pop flex items-center gap-6">' +
          '<div class="relative flex flex-col items-center">' +
            '<span class="absolute top-[-1.5rem] left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 whitespace-nowrap">' + e("currentSum") + '</span>' +
            '<div class="text-6xl font-black tracking-tighter ' + (good
              ? "scale-110 bg-gradient-to-b from-green-300 to-emerald-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(52,211,153,0.6)]"
              : "scale-95 bg-gradient-to-b from-rose-300 to-red-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(244,63,94,0.4)]") + '">' + sum + '</div>' +
          '</div>' +
          '<div class="text-4xl font-black text-white/20">' + (sum > S.targetNumber ? ">" : "≤") + '</div>' +
          '<div class="flex flex-col items-center ' + (good ? "opacity-40 scale-90 grayscale" : "scale-105 text-white") + '">' +
            '<div class="text-5xl font-black tracking-tighter text-white/30">' + S.targetNumber + '</div>' +
          '</div>' +
        '</div>';
    }

    /* 操作按钮 */
    var btns = "";
    if (gs2 === "idle") {
      btns = btn("roll", actRoll, "w-full bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.3)]", e("roll"));
    } else if (gs2 === "success") {
      btns = btn("pass", actPass, "w-full bg-gradient-to-r from-emerald-400 to-green-600 shadow-[0_0_25px_rgba(16,185,129,0.4)]", e("pass"));
    } else if (gs2 === "fail") {
      btns = btn("penalty", actDrawPenalty, "w-full bg-gradient-to-r from-rose-500 to-red-600 shadow-[0_0_25px_rgba(244,63,94,0.4)]", e("drawPenalty"));
    } else if (gs2 === "win") {
      btns = btn("winreset", actReset, "w-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 shadow-[0_0_30px_rgba(192,38,211,0.5)]", e("restart"));
    }
    function btn(id, fn, cls, label) {
      return '<button data-act="' + id + '" class="cursor-pointer group relative overflow-hidden rounded-2xl py-4 text-sm font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 ' + cls + '">' + label + "</button>";
    }

    var html =
      '<section class="glass-effect relative w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 p-4 sm:p-10">' +
        '<div class="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px] animate-pulse-slow"></div>' +
        '<div class="pointer-events-none absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-rose-600/20 blur-[120px] animate-pulse-slow" style="animation-delay:2s"></div>' +
        (gs2 === "win" ? confetti() : "") +
        '<header class="relative z-10 mb-8 flex flex-col items-center justify-center border-b border-white/5 pb-6 text-center">' +
          '<h1 class="bg-gradient-to-b from-white via-purple-100 to-white/60 bg-clip-text text-4xl font-black uppercase tracking-tighter text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] sm:text-5xl">' + e("title") + "</h1>" +
          '<div class="mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-80"></div>' +
          '<p class="mt-4 text-sm font-medium tracking-[0.2em] text-white/40">' + e("tagline") + "</p>" +
        "</header>" +
        '<div class="relative z-10 grid gap-8 lg:grid-cols-[1fr_320px]">' +
          /* 左：主舞台 */
          '<div class="relative flex flex-col items-center justify-between rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/5 to-white/10 p-4 min-h-[500px] shadow-inner overflow-hidden group sm:p-8 ' + (clickable ? "cursor-pointer" : "") + '" data-stage>' +
            '<div class="absolute inset-0 opacity-10" style="background-image:radial-gradient(#fff 1px,transparent 1px);background-size:24px 24px"></div>' +
            /* 顶部信息 */
            '<div class="relative z-10 w-full grid grid-cols-2 sm:grid-cols-3 gap-3 items-start mb-6">' +
              '<div class="col-span-2 sm:col-span-1 sm:col-start-2 flex justify-center mb-1">' +
                '<div class="flex items-center justify-center gap-3 rounded-full border border-white/10 bg-black/40 px-5 py-2 shadow-lg backdrop-blur-md">' +
                  '<div class="size-2.5 rounded-full animate-pulse bg-emerald-400 shadow-[0_0_8px_currentColor] shrink-0"></div>' +
                  '<div class="flex flex-col leading-none text-center">' +
                    '<span class="text-[8px] font-bold uppercase tracking-widest text-white/40">' + e("turnPrefix") + "</span>" +
                    '<span class="text-2xl font-bold drop-shadow-md truncate max-w-[120px]" style="color:' + eg.color + '">' + LG.escapeHtml(eg.name) + "</span>" +
                  "</div>" +
                "</div>" +
              "</div>" +
              '<div class="col-span-1 flex justify-center sm:justify-start">' +
                '<div class="flex flex-col items-center rounded-xl bg-black/40 border border-white/10 px-6 py-2 backdrop-blur-md w-full sm:w-auto">' +
                  '<span class="text-[10px] font-bold uppercase tracking-widest text-purple-300/70 mb-1 whitespace-nowrap">' + e("diceCount") + "</span>" +
                  '<span class="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">' + S.diceCount + "</span>" +
                "</div>" +
              "</div>" +
              '<div class="col-span-1 flex justify-center sm:justify-end">' +
                '<div class="flex flex-col items-center rounded-xl bg-black/40 border border-white/10 px-6 py-2 backdrop-blur-md w-full sm:w-auto">' +
                  '<span class="text-[10px] font-bold uppercase tracking-widest text-rose-300/70 mb-1 whitespace-nowrap">' + e("target") + "</span>" +
                  '<span class="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">' + S.targetNumber + "</span>" +
                "</div>" +
              "</div>" +
            "</div>" +
            /* 骰子 */
            '<div class="relative z-10 flex flex-wrap justify-center gap-6 p-4">' + diceHtml + "</div>" +
            /* 结果 */
            '<div class="relative z-10 mt-8 min-h-[6rem] text-center flex flex-col items-center justify-center">' + resultHtml + "</div>" +
            /* 按钮 */
            '<div class="relative z-10 mt-8 w-full max-w-xs space-y-4">' + btns + "</div>" +
          "</div>" +

          /* 右：玩家 + 惩罚 */
          '<div class="flex flex-col gap-5">' +
            /* 玩家卡 */
            '<div class="group rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/5 to-black/40 p-6">' +
              '<div class="flex items-center justify-between mb-5">' +
                '<h3 class="text-xs font-bold uppercase tracking-widest text-white/40">' + e("playersTitle") + "</h3>" +
                '<button data-act="edit-players" class="cursor-pointer rounded-full bg-white/5 p-1.5 transition-colors hover:bg-white/10" title="' + e("edit") + '">' + editIcon("text-white/40") + "</button>" +
              "</div>" +
              '<div class="flex -space-x-3 overflow-hidden py-1">' +
                S.players.map(function (p) {
                  return '<div title="' + LG.escapeHtml(p.name) + '" class="relative flex size-10 items-center justify-center rounded-full border-2 border-white/20 ring-1 ring-black/50 text-base font-extrabold text-white shadow-lg" style="background:linear-gradient(145deg,' + p.color + ',' + p.color + "CC)" + '">' +
                    '<span class="select-none relative z-10">' + LG.escapeHtml(p.name.charAt(0).toUpperCase()) + "</span></div>";
                }).join("") +
              "</div>" +
            "</div>" +
            /* 惩罚卡 */
            '<div class="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/5 to-black/40 p-6 flex-1 transition-all hover:border-rose-500/30 hover:bg-rose-900/10 cursor-pointer" data-act="edit-penalties">' +
              '<div class="relative z-10 flex flex-col h-full">' +
                '<div class="flex flex-col gap-3 mb-4">' +
                  '<div class="flex items-center justify-between">' +
                    '<div class="flex items-center gap-2">' +
                      '<h3 class="text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-rose-300">' + e("penaltiesTitle") + "</h3>" +
                      '<div class="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/20">' + S.penalties.length + "</div>" +
                    "</div>" +
                    '<div class="flex gap-2">' +
                      '<button data-act="edit-libs" class="cursor-pointer rounded-full bg-purple-500/20 p-1.5 text-purple-300 border border-purple-500/30" title="' + e("library.title") + '">' + libIcon() + "</button>" +
                      '<button data-act="edit-stages" class="cursor-pointer rounded-full bg-white/5 p-1.5 text-white/40" title="' + e("configureStages") + '">' + gearIcon() + "</button>" +
                    "</div>" +
                  "</div>" +
                "</div>" +
                '<div class="flex flex-col gap-1.5 mb-3">' +
                  '<div class="flex items-center justify-between text-[10px]">' +
                    '<span class="font-bold ' + sc.text + '">' + sp.name + "</span>" +
                    '<span class="text-white/30">' + (stageOf() === 4 ? S.playCount + "+" : sp.cur + "/" + sp.tot) + "</span>" +
                  "</div>" +
                  '<div class="h-2 w-full rounded-full bg-black/40 overflow-hidden"><div class="h-full transition-all duration-500 ease-out bg-gradient-to-r ' + sc.gradient + '" style="width:' + sp.pct + '%"></div></div>' +
                "</div>" +
                /* 预览 */
                '<div class="relative flex-1 min-h-[100px] mx-2">' +
                  '<div class="absolute inset-0 rounded-xl border border-white/10 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-4 shadow-lg flex flex-col justify-center overflow-hidden">' +
                    '<div class="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-rose-500/0 via-rose-500/50 to-rose-500/0 opacity-50"></div>' +
                    '<p class="text-sm font-medium text-white/80 line-clamp-3 leading-relaxed text-center italic opacity-80 select-none">" ' + LG.escapeHtml((S.penalties[S.previewIdx] || {}).text || "...") + ' "</p>' +
                    '<div class="absolute bottom-2 right-2 text-[10px] text-white/10 font-black">' + (S.previewIdx + 1) + "</div>" +
                  "</div>" +
                "</div>" +
                '<div class="mt-3 text-center"><span class="text-[10px] font-bold uppercase tracking-wide text-white/30 group-hover:text-white/50">' + e("clickToManage") + "</span></div>" +
              "</div>" +
            "</div>" +
            /* 重置进度 */
            '<button data-act="reset-progress" class="cursor-pointer group flex w-full items-center justify-center gap-2 rounded-[2rem] border border-white/10 bg-white/5 p-4 transition-all hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-200 text-white/40">' +
              '<span class="text-xs font-bold uppercase tracking-widest">' + e("resetProgress") + "</span></button>" +
          "</div>" +
        "</div>" +
      "</section>";

    document.getElementById("dice-root").innerHTML = html;
  }

  function editIcon(cls) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4 ' + cls + '"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z"></path><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z"></path></svg>';
  }
  function libIcon() {
    return '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path></svg>';
  }
  function gearIcon() {
    return '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-white/40 hover:text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>';
  }

  /* ---------- 持久化 ---------- */
  function save() {
    localStorage.setItem(K.players, JSON.stringify(S.players));
    localStorage.setItem(K.gameState, JSON.stringify({
      currentPlayerIndex: S.currentPlayerIndex, diceCount: S.diceCount, targetNumber: S.targetNumber,
      gameState: S.gameState, currentRolls: S.currentRolls, currentPenalty: S.currentPenalty
    }));
    localStorage.setItem(K.playCount, String(S.playCount));
    localStorage.setItem(K.thresholds, JSON.stringify(S.thresholds));
    localStorage.setItem(K.libs, JSON.stringify({ libraries: S.libraries, activeId: S.activeLibId }));
  }
  function render() { renderMain(); renderModal(); }

  /* ---------- 核心动作 ---------- */
  function actRoll() {
    if (S.gameState === "rolling" || S.gameState === "settling") return;
    LG.recordDetailStat("diceRolls");
    S.gameState = "rolling";
    LG.sound.play("roll");
    renderMain();

    setTimeout(function () {
      var final = [];
      for (var j = 0; j < S.diceCount; j++) final.push(LG.dice1_6());
      S.currentRolls = final;
      S.gameState = "settling";
      LG.sound.play("stop");
      if (navigator.vibrate) navigator.vibrate(30);
      renderMain();

      setTimeout(function () {
        var sum = sumRolls();
        if (sum > S.targetNumber) {
          if (S.diceCount >= 10) {
            S.gameState = "win"; LG.sound.play("win");
            LG.recordDetailStat("diceWins");
            LG.incrementGameSession("dice", 10);
          } else { S.gameState = "success"; LG.sound.play("success"); }
        } else { S.gameState = "fail"; LG.sound.play("fail"); }
        save(); render();
      }, 750);
    }, 850);
  }
  function actPass() {
    LG.sound.play("levelUp");
    S.targetNumber = sumRolls();
    S.diceCount++;
    S.currentPlayerIndex = (S.currentPlayerIndex + 1) % S.players.length;
    S.gameState = "idle";
    S.currentRolls = [];
    for (var i = 0; i < S.diceCount; i++) S.currentRolls.push(1);
    save(); render();
  }
  function actDrawPenalty() {
    LG.sound.play("flip");
    var st = stageOf(), pool = S.penalties.filter(function (p) { return p.stage === st; });
    if (!pool.length) {
      for (var r = st - 1; r >= 1; r--) {
        pool = S.penalties.filter(function (p) { return p.stage === r; });
        if (pool.length) break;
      }
    }
    if (!pool.length) pool = S.penalties;
    if (pool.length) S.currentPenalty = pool[Math.floor(Math.random() * pool.length)].text;
    LG.recordDetailStat("dicePenalties");
    S.gameState = "penalty";
    save(); render();
  }
  function actAcceptPenalty() {
    LG.sound.play("select");
    S.playCount++;
    S.targetNumber = 3; S.diceCount = 1;
    S.currentPlayerIndex = (S.currentPlayerIndex + 1) % S.players.length;
    S.gameState = "idle"; S.currentRolls = [1]; S.currentPenalty = null;
    save(); render();
  }
  function actReset() {
    LG.sound.play("start");
    S.targetNumber = 3; S.diceCount = 1; S.currentPlayerIndex = 0;
    S.gameState = "idle"; S.currentRolls = [1]; S.currentPenalty = null;
    save(); render();
  }

  /* ---------- 主舞台点击（idle/success/fail 整卡可点） ---------- */
  document.getElementById("dice-root").addEventListener("click", function (ev) {
    var actEl = ev.target.closest("[data-act]");
    if (actEl) {
      var a = actEl.getAttribute("data-act");
      ev.stopPropagation();
      if (a === "roll") actRoll();
      else if (a === "pass") actPass();
      else if (a === "penalty") actDrawPenalty();
      else if (a === "winreset") actReset();
      else if (a === "edit-players") S.modal = "players";
      else if (a === "edit-penalties") S.modal = "penalties";
      else if (a === "edit-libs") S.modal = "libs";
      else if (a === "edit-stages") S.modal = "stages";
      else if (a === "reset-progress") {
        S.playCount = 0; localStorage.removeItem(K.playCount); actReset();
      }
      renderModal();
      return;
    }
    var stage = ev.target.closest("[data-stage]");
    if (stage) {
      if (S.gameState === "idle") actRoll();
      else if (S.gameState === "success") actPass();
      else if (S.gameState === "fail") actDrawPenalty();
    }
  });

  /* ================= 弹窗 ================= */
  function overlayWrap(inner, title) {
    return '<div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md fade-in">' +
      '<div class="modal-pop w-full max-w-lg rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-6 shadow-2xl flex flex-col max-h-[85vh]">' +
      inner + "</div></div>";
  }

  /* 惩罚弹窗（penalty 状态） */
  function penaltyStateModal() {
    var eg = currentPlayer();
    return '<div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl fade-in">' +
      '<div class="modal-pop w-full max-w-md rounded-[2rem] border border-rose-500/30 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-8 text-center shadow-[0_0_60px_rgba(225,29,72,0.3)] max-h-[85vh] overflow-y-auto">' +
      '<div class="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-rose-500/20 text-4xl">😈</div>' +
      '<h3 class="text-sm font-bold uppercase tracking-widest text-rose-400 mb-2">' + e("penaltyTitle") + "</h3>" +
      '<div class="flex items-center justify-center gap-3 mb-2">' +
        '<div class="size-8 rounded-full border-2 border-white/20" style="background:' + eg.color + '"></div>' +
        '<span class="text-xl font-black text-white">' + LG.escapeHtml(eg.name) + "</span>" +
      "</div>" +
      '<p class="text-xs text-white/40 uppercase tracking-wide mb-6">' + e("penaltySubtitle") + "</p>" +
      '<div class="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6"><p class="text-lg font-bold leading-relaxed text-white">' + LG.escapeHtml(S.currentPenalty) + "</p></div>" +
      '<button data-modal-act="accept" class="cursor-pointer w-full rounded-xl bg-white py-4 text-sm font-bold uppercase tracking-widest text-black hover:bg-gray-200">' + e("restart") + "</button>" +
    "</div></div>";
  }

  /* win 弹窗 */
  function winModal() {
    var eg = currentPlayer();
    return '<div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl fade-in">' +
      '<div class="modal-pop w-full max-w-md rounded-[2rem] border border-yellow-500/30 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-8 text-center shadow-[0_0_60px_rgba(234,179,8,0.3)]">' +
      '<div class="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-yellow-500/20 text-4xl animate-bounce">🏆</div>' +
      '<h3 class="text-2xl font-black uppercase tracking-tight text-yellow-400 mb-4">' + e("winTitle") + "</h3>" +
      '<p class="text-white/80 mb-8">' + LG.escapeHtml(e("winMessage", { name: eg.name })) + "</p>" +
      '<button data-modal-act="winreset" class="cursor-pointer w-full rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 py-4 text-sm font-bold uppercase tracking-widest text-black hover:scale-105">' + e("restart") + "</button>" +
    "</div></div>";
  }

  /* 玩家管理 */
  function playersModal() {
    var inner =
      '<div class="flex items-center justify-between mb-4"><h3 class="text-lg font-bold text-white">' + e("playersTitle") + '</h3>' +
      '<button data-modal-act="close" class="cursor-pointer rounded-full bg-white/5 size-8 flex items-center justify-center text-white/40">✕</button></div>' +
      '<div class="space-y-3 mb-6 max-h-[50vh] overflow-y-auto pr-2">' +
      S.players.map(function (p) {
        return '<div class="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2 pr-3">' +
          '<input type="color" value="' + p.color + '" data-player-color="' + p.id + '" class="size-8 rounded-full cursor-pointer" />' +
          '<input value="' + LG.escapeHtml(p.name) + '" data-player-name="' + p.id + '" class="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />' +
          '<button data-player-del="' + p.id + '" ' + (S.players.length <= 1 ? "disabled" : "") +
            ' class="cursor-pointer p-2 ' + (S.players.length <= 1 ? "text-white/10" : "text-white/40 hover:text-rose-400") + '">✕</button></div>';
      }).join("") +
      "</div>" +
      '<div class="flex gap-3">' +
        '<button data-modal-act="add-player" class="cursor-pointer flex-1 rounded-xl bg-purple-600 py-3 text-sm font-bold text-white hover:bg-purple-500">+ ' + e("addPlayer") + "</button>" +
        '<button data-modal-act="close" class="cursor-pointer flex-1 rounded-xl bg-white py-3 text-sm font-bold text-black hover:bg-gray-200">' + e("done") + "</button>" +
      "</div>";
    return overlayWrap(inner);
  }

  /* 惩罚管理 */
  function penaltiesModal() {
    var inner =
      '<div class="flex items-center justify-between mb-6">' +
        '<h3 class="text-lg font-bold text-white">' + e("managePenalties") + "</h3>" +
        '<div class="flex gap-2 items-center">' +
          '<button data-modal-act="export" class="cursor-pointer rounded-full bg-white/10 p-2 text-white hover:bg-white/20" title="' + e("exportPenalties") + '">↑</button>' +
          '<label class="cursor-pointer rounded-full bg-white/10 p-2 text-white hover:bg-white/20" title="' + e("importPenalties") + '">↓<input type="file" accept=".json,.txt" data-import class="hidden" /></label>' +
          '<button data-modal-act="reset-defaults" class="cursor-pointer text-xs font-bold text-rose-400 uppercase tracking-wide">' + e("resetToDefaults") + "</button>" +
          '<button data-modal-act="close" class="cursor-pointer rounded-full bg-white/5 size-8 flex items-center justify-center text-white/40">✕</button>' +
        "</div></div>" +
      '<div class="mb-4 flex gap-2">' +
        '<input data-new-text placeholder="' + e("penaltyPlaceholder") + '" class="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500" />' +
        '<select data-new-stage class="rounded-xl border border-white/20 px-3 py-3 text-sm text-white bg-black">' +
          [1, 2, 3, 4].map(function (s2) { return '<option value="' + s2 + '">S' + s2 + "</option>"; }).join("") + "</select>" +
        '<button data-modal-act="add-penalty" class="cursor-pointer rounded-xl bg-purple-600 px-4 font-bold text-white hover:bg-purple-500">' + e("addPenalty") + "</button>" +
      "</div>" +
      '<div class="flex-1 space-y-2 overflow-y-auto pr-2">' +
      S.penalties.map(function (p, i) {
        var sc2 = stageColors(p.stage);
        return '<div class="group flex items-start gap-2 rounded-xl border border-white/5 p-3 ' + sc2.bg + '">' +
          '<span class="text-xs font-bold text-white/30 mt-2">#' + (i + 1) + "</span>" +
          '<textarea data-edit-text="' + i + '" rows="1" class="flex-1 bg-transparent text-sm text-white/90 focus:outline-none resize-none min-h-[2.5em] py-1">' + LG.escapeHtml(p.text) + "</textarea>" +
          '<select data-edit-stage="' + i + '" class="rounded px-2 py-1 text-[10px] text-white border border-white/20 bg-black">' +
            [1, 2, 3, 4].map(function (s3) { return '<option value="' + s3 + '"' + (s3 === p.stage ? " selected" : "") + ">S" + s3 + "</option>"; }).join("") + "</select>" +
          '<button data-edit-del="' + i + '" ' + (S.penalties.length <= 1 ? "disabled" : "") +
            ' class="p-1 ' + (S.penalties.length <= 1 ? "text-white/10" : "cursor-pointer text-white/20 hover:text-rose-400") + '">✕</button></div>';
      }).join("") +
      "</div>" +
      '<button data-modal-act="close" class="cursor-pointer mt-5 w-full rounded-xl bg-white py-3 text-sm font-bold text-black hover:bg-gray-200">' + e("done") + "</button>";
    return overlayWrap(inner);
  }

  /* 库管理 */
  function libsModal() {
    var list = Object.values(S.libraries).sort(function (a, b) { return b.createdAt - a.createdAt; });
    var inner =
      '<div class="flex items-center justify-between mb-6"><div><h3 class="text-lg font-bold text-white flex items-center gap-2">📚 ' + e("library.title") + "</h3>" +
      '<p class="text-sm text-white/60 mt-1">' + e("library.subtitle") + "</p></div>" +
      '<button data-modal-act="close" class="cursor-pointer rounded-full bg-white/5 size-8 flex items-center justify-center text-white/40">✕</button></div>' +
      '<div class="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">' +
        '<label class="text-sm font-semibold text-white/80 mb-2 block">' + e("library.newLabel") + "</label>" +
        '<div class="flex gap-2"><input data-lib-name placeholder="' + e("library.namePlaceholder") + '" class="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-white focus:outline-none focus:border-purple-500" />' +
        '<button data-modal-act="save-lib" class="cursor-pointer rounded-xl bg-purple-600 px-6 py-2 font-bold text-white hover:bg-purple-500">' + e("library.saveNew") + "</button></div>" +
      "</div>" +
      '<div class="flex-1 overflow-y-auto space-y-3 pr-2">' +
      list.map(function (lib) {
        var active = S.activeLibId === lib.id;
        return '<div class="rounded-xl border p-4 ' + (active ? "border-purple-500/50 bg-purple-500/10" : "border-white/10 bg-white/5") + '">' +
          '<div class="flex flex-wrap items-center gap-2 mb-1">' +
            '<h4 class="font-bold text-white">' + LG.escapeHtml(lib.name) + "</h4>" +
            (active ? '<span class="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/30">' + e("library.activeBadge") + "</span>" : "") +
            (lib.isDefault ? '<span class="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/50">' + e("library.defaultBadge") + "</span>" : "") +
          "</div>" +
          '<p class="text-xs text-white/60 mb-2">' + e("library.stats", { count: lib.penalties.length }) + "</p>" +
          '<div class="flex flex-wrap gap-2 text-[11px]">' +
            '<button data-lib-use="' + lib.id + '" class="cursor-pointer rounded-full border border-sky-400/60 px-3 py-1 font-semibold text-sky-100 hover:text-sky-50">' + (active ? e("library.reload") : e("library.use")) + "</button>" +
            (!lib.isDefault
              ? '<button data-lib-overwrite="' + lib.id + '" class="cursor-pointer rounded-full border border-amber-400/60 px-3 py-1 font-semibold text-amber-100">' + e("library.overwrite") + "</button>" +
                '<button data-lib-del="' + lib.id + '" class="cursor-pointer rounded-full border border-rose-400/60 px-3 py-1 font-semibold text-rose-100">' + e("library.delete") + "</button>"
              : "") +
          "</div></div>";
      }).join("") +
      "</div>" +
      '<button data-modal-act="close" class="cursor-pointer mt-5 w-full rounded-xl bg-white py-3 text-sm font-bold text-black hover:bg-gray-200">' + e("library.close") + "</button>";
    return overlayWrap(inner);
  }

  /* 阶段设置 */
  function stagesModal() {
    var R = S.thresholds;
    function row(label, desc, key, min) {
      return '<div class="flex flex-col gap-2"><label class="text-sm text-white/70 flex items-center gap-2"><span class="font-bold">' + label + '</span><span class="text-xs text-white/40">' + desc + '</span></label>' +
        '<input type="number" data-th="' + key + '" value="' + R[key] + '" min="' + min + '" class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:outline-none focus:border-purple-500" /></div>';
    }
    var inner =
      '<div class="flex items-center justify-between mb-6"><h3 class="text-lg font-bold text-white">' + e("stageConfigTitle") + "</h3>" +
      '<button data-modal-act="close" class="cursor-pointer rounded-full bg-white/5 size-8 flex items-center justify-center text-white/40">✕</button></div>' +
      '<div class="space-y-4 mb-6">' +
        row(e("stage1Label"), e("stage1Desc"), "stage1", 1) +
        row(e("stage2Label"), e("stage2Desc"), "stage2", R.stage1 + 1) +
        row(e("stage3Label"), e("stage3Desc"), "stage3", R.stage2 + 1) +
      "</div>" +
      '<div class="bg-white/5 rounded-xl p-3 mb-6 text-xs text-white/60"><div class="font-bold mb-1">' + e("currentProgress") + "</div>" +
        S.playCount + " " + e("plays") + " / " + e("currentStage") + " " + stageOf() + "</div>" +
      '<button data-modal-act="close" class="cursor-pointer w-full rounded-xl bg-white py-3 text-sm font-bold text-black hover:bg-gray-200">' + e("done") + "</button>";
    return overlayWrap(inner);
  }

  function renderModal() {
    var root2 = document.getElementById("dice-modal-root");
    var html = "";
    if (S.gameState === "penalty") html = penaltyStateModal();
    else if (S.gameState === "win") html = winModal();
    else if (S.modal === "players") html = playersModal();
    else if (S.modal === "penalties") html = penaltiesModal();
    else if (S.modal === "libs") html = libsModal();
    else if (S.modal === "stages") html = stagesModal();
    root2.innerHTML = html;
  }

  /* Base64 */
  function b64enc(str) { return btoa(unescape(encodeURIComponent(str))); }
  function b64dec(str) { return decodeURIComponent(escape(atob(str.trim()))); }

  /* 弹窗事件 */
  document.getElementById("dice-modal-root").addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-modal-act]");
    if (el) {
      var a = el.getAttribute("data-modal-act");
      if (a === "close") { S.modal = null; renderModal(); }
      else if (a === "accept") actAcceptPenalty();
      else if (a === "winreset") actReset();
      else if (a === "add-player") {
        S.players.push({ id: uid(), name: e("defaultPlayerName") + " " + (S.players.length + 1), color: COLORS[S.players.length % COLORS.length] });
        save(); renderModal();
      }
      else if (a === "add-penalty") {
        var txt2 = document.querySelector("[data-new-text]").value;
        var stg = parseInt(document.querySelector("[data-new-stage]").value, 10);
        if (txt2.trim()) { S.penalties.push({ text: txt2.trim(), stage: stg }); save(); renderModal(); }
      }
      else if (a === "save-lib") {
        var nm = document.querySelector("[data-lib-name]").value.trim();
        if (!nm) { LG.toast(e("library.nameRequired")); return; }
        if (Object.values(S.libraries).some(function (l2) { return l2.name.toLowerCase() === nm.toLowerCase(); })) { LG.toast(e("library.nameExists")); return; }
        var id = uid();
        S.libraries[id] = { id: id, name: nm, penalties: S.penalties.slice(), createdAt: Date.now() };
        S.activeLibId = id;
        save(); LG.toast(e("library.saveSuccess", { name: nm })); renderModal();
      }
      else if (a === "export") {
        try {
          var data = JSON.stringify(S.penalties);
          var enc = b64enc(data);
          var blob = new Blob([enc + "\n"], { type: "text/plain;charset=utf-8" });
          var url = URL.createObjectURL(blob), link = document.createElement("a");
          link.href = url; link.download = "dice-penalties.txt";
          document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
        } catch (e2) { console.error(e2); }
      }
      else if (a === "reset-defaults") {
        S.penalties = buildPenalties("defaultPenalties");
        save(); renderModal();
      }
      return;
    }
    var useEl = ev.target.closest("[data-lib-use]");
    if (useEl) {
      var id2 = useEl.getAttribute("data-lib-use");
      var lib = S.libraries[id2];
      if (lib) {
        S.penalties = lib.penalties.slice(); S.activeLibId = id2; S.modal = null;
        save(); render();
      }
      return;
    }
    var owEl = ev.target.closest("[data-lib-overwrite]");
    if (owEl) {
      var id3 = owEl.getAttribute("data-lib-overwrite");
      S.libraries[id3].penalties = S.penalties.slice();
      S.libraries[id3].createdAt = Date.now();
      save(); LG.toast(e("library.overwriteSuccess", { name: S.libraries[id3].name })); renderModal();
      return;
    }
    var dlEl = ev.target.closest("[data-lib-del]");
    if (dlEl) {
      var id4 = dlEl.getAttribute("data-lib-del");
      delete S.libraries[id4];
      if (S.activeLibId === id4) { S.activeLibId = DEFAULT_LIB; S.penalties = S.libraries[DEFAULT_LIB].penalties.slice(); }
      save(); renderModal();
      return;
    }
  });

  /* 玩家/惩罚 编辑 input 事件 */
  document.getElementById("dice-modal-root").addEventListener("input", function (ev) {
    var tgt = ev.target;
    if (tgt.hasAttribute("data-player-name")) {
      var id = tgt.getAttribute("data-player-name");
      S.players.forEach(function (p) { if (p.id === id) p.name = tgt.value; });
      save();
    } else if (tgt.hasAttribute("data-player-color")) {
      var idc = tgt.getAttribute("data-player-color");
      S.players.forEach(function (p) { if (p.id === idc) p.color = tgt.value; });
      save();
    } else if (tgt.hasAttribute("data-th")) {
      var key = tgt.getAttribute("data-th");
      var val = Math.max(1, parseInt(tgt.value, 10) || 1);
      S.thresholds[key] = val;
      save();
    } else if (tgt.hasAttribute("data-edit-text")) {
      var idx = parseInt(tgt.getAttribute("data-edit-text"), 10);
      S.penalties[idx].text = tgt.value;
      save();
    } else if (tgt.hasAttribute("data-edit-stage")) {
      var idx2 = parseInt(tgt.getAttribute("data-edit-stage"), 10);
      S.penalties[idx2].stage = parseInt(tgt.value, 10);
      save();
    }
  });

  /* 删除玩家/惩罚（事件委托，change/click 混合） */
  document.getElementById("dice-modal-root").addEventListener("click", function (ev) {
    var pd = ev.target.closest("[data-player-del]");
    if (pd && S.players.length > 1) {
      var id = pd.getAttribute("data-player-del");
      S.players = S.players.filter(function (p) { return p.id !== id; });
      save(); renderModal();
      return;
    }
    var ed = ev.target.closest("[data-edit-del]");
    if (ed && S.penalties.length > 1) {
      var idx = parseInt(ed.getAttribute("data-edit-del"), 10);
      S.penalties.splice(idx, 1);
      save(); renderModal();
    }
  });

  /* 文件导入 */
  document.getElementById("dice-modal-root").addEventListener("change", function (ev) {
    var inp = ev.target.closest("[data-import]");
    if (!inp || !inp.files || !inp.files[0]) return;
    var file = inp.files[0], reader = new FileReader();
    reader.onload = function (rev) {
      var raw = rev.target.result;
      if (typeof raw !== "string") return;
      var a = raw.trim();
      var parsed = null;
      try { parsed = JSON.parse(a); } catch (e) {
        if (a[0] === "{" || a[0] === "[") { LG.toast(e("importError")); return; }
        try { parsed = JSON.parse(b64dec(a)); } catch (e2) {
          var lines = a.split(/\r?\n/).filter(function (l) { return l.trim(); }).map(function (l) {
            var parts = l.split("|");
            if (parts.length === 2) {
              var s = parseInt(parts[1], 10);
              return { text: parts[0], stage: s >= 1 && s <= 4 ? s : 1 };
            }
            return { text: l, stage: 1 };
          });
          if (lines.length) { S.penalties = lines; save(); renderModal(); return; }
          LG.toast(e("importError")); return;
        }
      }
      if (Array.isArray(parsed)) {
        if (parsed.every(function (x) { return typeof x === "string"; })) {
          S.penalties = parsed.map(function (x) { return { text: x, stage: 1 }; });
        } else if (parsed.every(function (x) { return x && typeof x === "object" && "text" in x && "stage" in x; })) {
          S.penalties = parsed;
        } else { LG.toast(e("importError")); return; }
        save(); renderModal();
      } else LG.toast(e("importError"));
    };
    reader.readAsText(file);
  });

  /* ---------- 预览轮播 ---------- */
  setInterval(function () {
    if (!S.penalties.length) return;
    S.previewIdx = (S.previewIdx + 1) % S.penalties.length;
    if (!S.modal && S.gameState !== "penalty" && S.gameState !== "win") {
      var pe = document.querySelector("[data-act='edit-penalties'] p");
      if (pe) pe.innerHTML = '" ' + LG.escapeHtml((S.penalties[S.previewIdx] || {}).text || "...") + ' "';
      var num = document.querySelector("[data-act='edit-penalties'] .text-\\[10px\\]");
    }
  }, 3000);

  /* ---------- 启动 ---------- */
  load();
  save();
  render();
})();
