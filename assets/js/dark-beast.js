/* ============================================================
 * 火辣暗兽棋（Dark Beast）
 * 4×4 棋盘，16 枚棋子背面随机暗放；翻牌 / 移动 / 吃子；
 * 大吃小、鼠吃象、同级同归于尽；被吃者接受对应惩罚；
 * 一方棋子全灭即胜负，赢家获得“胜利奖励”。
 * ============================================================ */
(function () {
  "use strict";
  var n = scoped("games.darkBeast");
  var root = document.getElementById("darkbeast-root");
  var modalRoot = document.getElementById("darkbeast-modal-root");

  /* ---------------- 常量 ---------------- */
  var BEASTS = [
    { rank: 0, icon: "🐀", color: "from-gray-400 to-gray-600" },
    { rank: 1, icon: "🐈", color: "from-amber-300 to-amber-500" },
    { rank: 2, icon: "🐕", color: "from-orange-600 to-orange-800" },
    { rank: 3, icon: "🐺", color: "from-slate-400 to-slate-600" },
    { rank: 4, icon: "🐆", color: "from-yellow-400 to-yellow-600" },
    { rank: 5, icon: "🐅", color: "from-orange-500 to-red-600" },
    { rank: 6, icon: "🦁", color: "from-yellow-500 to-amber-700" },
    { rank: 7, icon: "🐘", color: "from-blue-400 to-blue-600" }
  ];
  var K_STATE = "lovegame-darkbeast-state";
  var K_SET = "lovegame-darkbeast-settings";
  var K_PEN = "lovegame-darkbeast-penalties";
  var K_REW = "lovegame-darkbeast-rewards";

  /* ---------------- 运行时状态 ---------------- */
  var state = null;
  var penaltyQueue = [];
  var activePenalty = null;
  var settingsOpen = false;
  var penTab = "player1";
  var rules = { diagonalLeopard: false, onlyCatEatsRat: false };
  var penalties = defaultPenalties();
  var rewards = defaultRewards();
  var coinPhase = null;          // "spinning" | "landed" | null
  var coinWinner = null;
  var coinTimers = [];
  var lastFlipped = null;

  /* ---------------- 工具 ---------------- */
  function playerName(p) { return n("players." + p); }
  function beastName(rank) { return n("pieces." + rank); }
  function penaltyContent(rank, player) { return penalties[player][rank]; }
  function emptyOsc() { return { player1: {}, player2: {} }; }
  function escAttr(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }

  function defaultPenalties() {
    var p1 = {}, p2 = {};
    BEASTS.forEach(function (b) {
      p1[b.rank] = n("defaultPenaltiesP1." + b.rank);
      p2[b.rank] = n("defaultPenaltiesP2." + b.rank);
    });
    return { player1: p1, player2: p2 };
  }
  function defaultRewards() {
    return { player1: n("defaultRewardP1"), player2: n("defaultRewardP2") };
  }
  function normalize(st) {
    if (st.oscillation && st.oscillation.player1 && st.oscillation.player2) return st;
    st.oscillation = emptyOsc();
    return st;
  }
  function persist() {
    if (state) localStorage.setItem(K_STATE, JSON.stringify(state));
    localStorage.setItem(K_SET, JSON.stringify(rules));
    localStorage.setItem(K_PEN, JSON.stringify(penalties));
    localStorage.setItem(K_REW, JSON.stringify(rewards));
  }

  /* ============================================================
   * 规则
   * ============================================================ */
  // 相邻（曼哈顿 1）；开启猎豹疾驰时，豹(rank4)可斜行
  function adjacency(fr, to, rank, rls) {
    var dr = Math.abs(Math.floor(fr / 4) - Math.floor(to / 4));
    var dc = Math.abs((fr % 4) - (to % 4));
    return dr + dc === 1 || (!!rls.diagonalLeopard && rank === 4 && dr === 1 && dc === 1);
  }
  // 吃子：鼠吃象；象不吃鼠；猫鼠游戏时只有猫/鼠能吃鼠；否则大吃小
  function canEat(ar, dr, onlyCat) {
    if (ar === 0 && dr === 7) return true;
    if (ar === 7 && dr === 0) return false;
    if (onlyCat && dr === 0 && !(ar === 1 || ar === 0)) return false;
    return ar >= dr;
  }
  // 振荡记录：棋子在两格间来回达 6 次后，返回它“来的位置”
  function forcedReturn(st, from, owner) {
    if (from == null) return null;
    var pc = st.board[from];
    if (!pc || pc.owner !== owner) return null;
    var rec = st.oscillation[owner][pc.id];
    if (!rec || rec.lastTo !== from || rec.alternationCount < 6) return null;
    return rec.lastFrom;
  }
  // 是否存在“除回移外”的合法动作（吃子或移到空位）
  function hasAlternative(st, owner, rls) {
    for (var f = 0; f < st.board.length; f++) {
      var pc = st.board[f];
      if (!pc || !pc.isRevealed || pc.owner !== owner) continue;
      var force = forcedReturn(st, f, owner);
      for (var t = 0; t < st.board.length; t++) {
        if (t === f || (force !== null && t === force)) continue;
        if (!adjacency(f, t, pc.rank, rls)) continue;
        var target = st.board[t];
        if (!target) return true;
        if (target.isRevealed && target.owner !== owner &&
          canEat(pc.rank, target.rank, rls.onlyCatEatsRat)) return true;
      }
    }
    return false;
  }
  // 振荡规则是否“拦截”本次移动（true=禁止纯回移拖延）
  function oscillationBlocks(st, owner, from, to, rls) {
    var moving = st.board[from];
    if (!moving || !moving.isRevealed || moving.owner !== owner) return false;
    if (!adjacency(from, to, moving.rank, rls)) return false;
    var target = st.board[to];
    if (target) {
      if (!target.isRevealed || target.owner === owner) return false;
      if (!canEat(moving.rank, target.rank, rls.onlyCatEatsRat)) return false;
    }
    var force = forcedReturn(st, from, owner);
    if (force === null || force !== to) return false;
    var rec = st.oscillation[owner][moving.id];
    if (!rec || rec.alternationCount !== 6) return false;
    return hasAlternative(st, owner, rls);
  }
  // 更新振荡计数
  function updateOsc(st, owner, piece, from, to) {
    var own = st.oscillation[owner];
    var rec = own[piece.id];
    var pairKey = Math.min(from, to) + "-" + Math.max(from, to);
    var count = 1;
    if (rec && rec.pairKey === pairKey && rec.lastFrom === to && rec.lastTo === from) {
      count = rec.alternationCount + 1;
    }
    var nu = Object.assign({}, own);
    nu[piece.id] = { lastFrom: from, lastTo: to, pairKey: pairKey, alternationCount: count };
    var no = Object.assign({}, st.oscillation);
    no[owner] = nu;
    return no;
  }
  function removeOsc(osc, owner, pieceId) {
    var o = osc[owner];
    if (!o[pieceId]) return osc;
    var copy = Object.assign({}, o);
    delete copy[pieceId];
    var no = Object.assign({}, osc);
    no[owner] = copy;
    return no;
  }
  // 选中振荡达 6 次的棋子时，计算需要显示 🚫 的格子
  function computeForbidden() {
    if (state.selectedIndex == null) return null;
    var pc = state.board[state.selectedIndex];
    if (!pc || pc.owner !== state.currentPlayer) return null;
    var rec = state.oscillation[state.currentPlayer][pc.id];
    if (!rec || rec.lastTo !== state.selectedIndex || rec.alternationCount < 6) return null;
    var force = rec.lastFrom;
    return oscillationBlocks(state, state.currentPlayer, state.selectedIndex, force, rules) ? force : null;
  }

  /* ============================================================
   * 开局（抛硬币决定先手）
   * ============================================================ */
  function startCoinFlip() {
    coinWinner = Math.random() < 0.5 ? "player1" : "player2";
    coinPhase = "spinning";
    render();
    var t1 = setTimeout(function () { coinPhase = "landed"; render(); }, 2100);
    var t2 = setTimeout(function () { coinPhase = null; beginGame(coinWinner); }, 3500);
    coinTimers = [t1, t2];
  }
  function beginGame(first) {
    LG.sound.play("start");
    var pieces = [];
    BEASTS.forEach(function (b) {
      pieces.push({ id: "p1-" + b.rank, rank: b.rank, owner: "player1", isRevealed: false });
    });
    BEASTS.forEach(function (b) {
      pieces.push({ id: "p2-" + b.rank, rank: b.rank, owner: "player2", isRevealed: false });
    });
    for (var i = pieces.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = pieces[i]; pieces[i] = pieces[j]; pieces[j] = t;
    }
    state = {
      board: pieces,
      currentPlayer: first || "player1",
      selectedIndex: null,
      winner: null,
      player1Lost: [], player2Lost: [],
      gameLog: [n("log.start")],
      oscillation: emptyOsc()
    };
    penaltyQueue = []; activePenalty = null;
    persist(); render();
  }

  /* ============================================================
   * 点击逻辑
   * ============================================================ */
  function handleClick(index) {
    if (!state || state.winner) return;
    var owner = state.currentPlayer;
    var board = state.board, sel = state.selectedIndex;
    var pc = board[index];

    // 1) 点暗子
    if (pc && !pc.isRevealed) {
      if (sel !== null) { state.selectedIndex = null; persist(); render(); return; }
      LG.sound.play("flip");
      var nb = board.slice();
      nb[index] = Object.assign({}, pc, { isRevealed: true });
      state.board = nb;
      state.currentPlayer = owner === "player1" ? "player2" : "player1";
      state.gameLog = [
        n("log.flip", { player: playerName(owner), piece: beastName(nb[index].rank) })
      ].concat(state.gameLog).slice(0, 6);
      lastFlipped = index;
      persist(); render();
      return;
    }

    // 2) 点自己的明子 → 选中 / 取消
    if (pc && pc.isRevealed && pc.owner === owner) {
      state.selectedIndex = sel === index ? null : index;
      persist(); render();
      return;
    }

    // 3) 已选中棋子后点目标格
    if (sel !== null) {
      var moving = board[sel];

      if (oscillationBlocks(state, owner, sel, index, rules)) return;

      var dr = Math.abs(Math.floor(sel / 4) - Math.floor(index / 4));
      var dc = Math.abs((sel % 4) - (index % 4));
      var basicOK = dr + dc === 1 ||
        (rules.diagonalLeopard && moving.rank === 4 && dr === 1 && dc === 1);
      if (!basicOK) { state.selectedIndex = null; persist(); render(); return; }

      // 3a) 移到空位
      if (!pc) {
        var nb2 = board.slice();
        nb2[index] = moving; nb2[sel] = null;
        state.board = nb2;
        state.selectedIndex = null;
        state.oscillation = updateOsc(state, owner, moving, sel, index);
        state.currentPlayer = owner === "player1" ? "player2" : "player1";
        state.gameLog = [
          n("log.move", { player: playerName(owner), piece: beastName(moving.rank) })
        ].concat(state.gameLog).slice(0, 6);
        persist(); render();
        return;
      }

      // 3b) 吃敌方明子
      if (pc.isRevealed && pc.owner !== owner) {
        if (!canEat(moving.rank, pc.rank, rules.onlyCatEatsRat)) {
          state.selectedIndex = null; persist(); render(); return;
        }
        var nb3 = board.slice();
        var p1lost = state.player1Lost.slice();
        var p2lost = state.player2Lost.slice();
        var newPen = [];
        var osc2 = state.oscillation;
        var logEntry = "";
        LG.sound.play("eat");

        if (moving.rank === pc.rank) {
          // 同归于尽
          nb3[index] = null; nb3[sel] = null;
          if (moving.owner === "player1") p1lost.push(moving.rank); else p2lost.push(moving.rank);
          if (pc.owner === "player1") p1lost.push(pc.rank); else p2lost.push(pc.rank);
          newPen.push({ player: moving.owner, beastRank: moving.rank, penaltyKey: String(moving.rank) });
          newPen.push({ player: pc.owner, beastRank: pc.rank, penaltyKey: String(pc.rank) });
          logEntry = n("log.mutual", { p1: beastName(moving.rank), p2: beastName(pc.rank) });
          osc2 = removeOsc(osc2, moving.owner, moving.id);
          osc2 = removeOsc(osc2, pc.owner, pc.id);
        } else {
          nb3[index] = moving; nb3[sel] = null;
          if (pc.owner === "player1") {
            p1lost.push(pc.rank);
            newPen.push({ player: "player1", beastRank: pc.rank, penaltyKey: String(pc.rank) });
          } else {
            p2lost.push(pc.rank);
            newPen.push({ player: "player2", beastRank: pc.rank, penaltyKey: String(pc.rank) });
          }
          logEntry = n("log.eat", {
            player: playerName(owner),
            attacker: beastName(moving.rank),
            defender: beastName(pc.rank)
          });
          osc2 = updateOsc(state, owner, moving, sel, index);
          osc2 = removeOsc(osc2, pc.owner, pc.id);
        }

        var c1 = nb3.filter(function (x) { return x && x.owner === "player1"; }).length;
        var c2 = nb3.filter(function (x) { return x && x.owner === "player2"; }).length;
        var winner = null;
        if (c1 === 0 && c2 === 0) { winner = owner; LG.sound.play("win"); }
        else if (c1 === 0) { winner = "player2"; LG.sound.play("win"); }
        else if (c2 === 0) { winner = "player1"; LG.sound.play("win"); }

        state.board = nb3;
        state.selectedIndex = null;
        state.currentPlayer = owner === "player1" ? "player2" : "player1";
        state.player1Lost = p1lost;
        state.player2Lost = p2lost;
        state.winner = winner;
        state.gameLog = [logEntry].concat(state.gameLog).slice(0, 6);
        state.oscillation = osc2;

        newPen.sort(function (a, b) {
          return ["player2", "player1"].indexOf(a.player) -
                 ["player2", "player1"].indexOf(b.player);
        });
        penaltyQueue = penaltyQueue.concat(newPen);

        persist(); render();
        processPenalties();
        return;
      }
    }

    state.selectedIndex = null;
    persist(); render();
  }

  /* ---------------- 惩罚队列 ---------------- */
  function processPenalties() {
    if (!activePenalty && penaltyQueue.length > 0) {
      activePenalty = penaltyQueue.shift();
      render();
    }
  }
  function ackPenalty() {
    activePenalty = null;
    render();
    processPenalties();
  }

  /* ---------------- 重新开始 ---------------- */
  function restart() {
    coinTimers.forEach(clearTimeout);
    coinTimers = [];
    state = null;
    penaltyQueue = [];
    activePenalty = null;
    settingsOpen = false;
    localStorage.removeItem(K_STATE);
    startCoinFlip();
  }

  /* ============================================================
   * 渲染：棋子格
   * ============================================================ */
  function cellHTML(piece, index, forbiddenIndex) {
    var revealed = piece && piece.isRevealed;
    var sel = state.selectedIndex === index;

    var innerFlip = "relative h-full w-full transform-style-preserve-3d transition-transform duration-700" +
      (revealed ? " rotate-y-180" : "");

    // 暗面（?）
    var dark = "absolute inset-0 backface-hidden rounded-xl sm:rounded-2xl border border-white/10 " +
      "bg-gradient-to-br from-[#1a1a1a] to-black shadow-xl flex items-center justify-center " +
      "transition-all duration-300 group-hover:scale-105 group-hover:border-white/30 " +
      (piece && !revealed ? "opacity-100" : "opacity-0");

    // 明面
    var lit = "absolute inset-0 backface-hidden rounded-xl sm:rounded-2xl rotate-y-180 overflow-hidden " +
      "shadow-2xl transition-all duration-300 ";
    var litInner = "";
    if (piece) {
      lit += sel
        ? "ring-2 ring-yellow-400 scale-105 z-10 shadow-[0_0_30px_rgba(250,204,21,0.3)] bg-gray-900"
        : "border border-white/10 bg-gray-900";
      var ownerGrad = piece.owner === "player1"
        ? "from-rose-900/80 to-black"
        : "from-blue-900/80 to-black";
      var edge = piece.owner === "player1"
        ? "border-rose-500/50 text-rose-400"
        : "border-blue-500/50 text-blue-400";
      var bar = piece.owner === "player1"
        ? "bg-rose-500 shadow-[0_0_10px_#f43f5e]"
        : "bg-blue-500 shadow-[0_0_10px_#3b82f6]";
      litInner =
        '<div class="relative h-full w-full flex flex-col items-center justify-center bg-gradient-to-br ' + ownerGrad + '">' +
          '<div class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none"></div>' +
          '<span class="text-3xl sm:text-4xl drop-shadow-md z-10 transition-transform group-hover:scale-110">' +
            BEASTS[piece.rank].icon + '</span>' +
          '<div class="absolute top-1 right-1 size-5 sm:size-6 rounded-full flex items-center justify-center ' +
            'text-[8px] sm:text-[10px] font-bold border bg-black/60 backdrop-blur-md z-20 ' + edge + '">' + piece.rank + '</div>' +
          '<div class="absolute bottom-0 left-0 right-0 h-1 ' + bar + '"></div>' +
        '</div>';
    } else {
      lit += "bg-transparent border-none shadow-none";
    }

    var emptyHint = (!piece && sel)
      ? '<div class="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-dashed border-white/20 animate-pulse"></div>'
      : "";
    var forbid = (index === forbiddenIndex)
      ? '<div class="pointer-events-none absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl">🚫</div>'
      : "";

    return '<button data-cell="' + index + '" class="relative w-full aspect-square perspective-1000 cursor-pointer group outline-none">' +
      '<div class="' + innerFlip + '" data-flip>' +
        '<div class="' + dark + '">' +
          '<div class="absolute inset-1.5 sm:inset-2 rounded-lg sm:rounded-xl border border-white/5 opacity-50"></div>' +
          '<div class="absolute inset-0 flex items-center justify-center">' +
            '<div class="size-8 sm:size-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm">' +
              '<span class="text-white/50 text-xl font-bold">?</span>' +
            '</div>' +
          '</div>' +
          '<div class="absolute inset-0 rounded-xl sm:rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>' +
        '</div>' +
        '<div class="' + lit + '">' + litInner + '</div>' +
      '</div>' +
      emptyHint + forbid +
    '</button>';
  }

  /* ============================================================
   * 渲染：玩家面板
   * ============================================================ */
  function panelHTML(player) {
    var isP1 = player === "player1";
    var active = state.currentPlayer === player;
    var lost = isP1 ? state.player1Lost : state.player2Lost;
    var textCol = isP1 ? "text-rose-400" : "text-blue-400";
    var borderCol = isP1 ? "border-rose-500/30" : "border-blue-500/30";
    var bgTint = isP1 ? "bg-rose-900/5" : "bg-blue-900/5";

    var panel = "darkbeast-player-panel relative flex flex-row items-center p-2 sm:flex-col " +
      "sm:items-stretch sm:p-6 rounded-[2rem] border bg-black/20 transition-all duration-700 " +
      (active
        ? "border-white/20 " + bgTint + " scale-100 sm:scale-105 opacity-100"
        : "border-white/5 opacity-50 scale-95");

    var header =
      '<div class="darkbeast-player-header flex flex-col items-center mr-2 sm:mr-0 shrink-0 sm:w-full">' +
        '<div class="flex items-center justify-between w-full mb-1 sm:mb-6">' +
          '<div class="size-3 rounded-full ' +
            (active ? 'bg-green-400 shadow-[0_0_10px_#4ade80]' : 'bg-white/10') + '"></div>' +
          '<span class="hidden sm:block text-[10px] font-bold uppercase tracking-widest ' +
            (active ? "text-white" : "text-white/20") + '">' +
            (active ? n("status.active") : n("status.waiting")) + '</span>' +
        '</div>' +
        '<div class="relative flex flex-col items-center">' +
          (active
            ? '<div class="absolute -top-8 sm:-top-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">' +
                '<div class="text-2xl sm:text-4xl ' +
                  (isP1
                    ? 'text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]'
                    : 'text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]') +
                  ' animate-bounce">▼</div>' +
                '<div class="w-6 h-1.5 rounded-full blur-md -mt-1 sm:-mt-2 ' +
                  (isP1 ? "bg-rose-500" : "bg-blue-500") + ' animate-pulse"></div>' +
              '</div>'
            : "") +
          '<div class="mb-1 sm:mb-4 flex size-12 sm:size-16 items-center justify-center rounded-full border-2 ' +
            'bg-gradient-to-br from-white/5 to-white/0 text-xl sm:text-2xl shadow-2xl relative z-10 ' +
            (active ? borderCol : "border-white/5") + '">' +
            (isP1 ? "🔥" : "❄️") +
            (active
              ? '<div class="absolute -inset-2 rounded-full border ' +
                  (isP1 ? "border-rose-500/50" : "border-blue-500/50") +
                  ' animate-ping opacity-20"></div>'
              : "") +
          '</div>' +
          '<h3 class="text-xs sm:text-lg font-black uppercase tracking-widest ' + textCol + ' text-center">' +
            playerName(player) + '</h3>' +
        '</div>' +
      '</div>';

    var itemList = BEASTS.map(function (b) {
      var isLost = lost.indexOf(b.rank) >= 0;
      return '<div class="flex shrink-0 items-center gap-1 sm:gap-3 rounded-lg p-1 sm:p-2 transition-all ' +
        'border border-transparent ' +
        (isLost ? "bg-white/5 opacity-50 grayscale border-white/5" : "bg-white/10") + '">' +
          '<span class="text-base sm:text-lg">' + b.icon + '</span>' +
          '<div class="flex flex-col leading-none">' +
            '<span class="text-[8px] sm:text-[10px] font-bold uppercase tracking-wide whitespace-nowrap ' +
              (isLost ? "text-white/30 line-through" : "text-white/80") + '">' +
              escAttr(penaltyContent(b.rank, player)) + '</span>' +
          '</div>' +
          (isLost ? '<span class="ml-1 sm:ml-2 text-[8px] sm:text-xs text-rose-500 font-bold">' +
            n("lost") + '</span>' : "") +
        '</div>';
    }).join("");

    var list =
      '<div class="mt-0 w-full overflow-hidden">' +
        '<div class="flex justify-between items-end mb-1 sm:mb-3 border-b border-white/5 pb-1 sm:pb-2">' +
          '<span class="text-[8px] sm:text-[10px] font-bold uppercase text-white/30 tracking-widest whitespace-nowrap">' +
            n("penaltyHistory") + '</span>' +
          '<span class="text-base sm:text-xl font-black ' + textCol + ' ml-2">' + lost.length +
            '<span class="text-xs sm:text-sm text-white/20 font-normal">/8</span></span>' +
        '</div>' +
        '<div class="darkbeast-penalty-list flex flex-row sm:flex-col gap-1 sm:gap-2 overflow-x-auto ' +
          'sm:overflow-y-auto sm:max-h-[240px] custom-scrollbar pb-1 sm:pb-0 sm:pr-1">' + itemList + '</div>' +
      '</div>';

    return '<div class="' + panel + '">' +
      (active
        ? '<div class="absolute -inset-px rounded-[2rem] border opacity-50 animate-pulse pointer-events-none ' +
            borderCol + '"></div>'
        : "") +
      header + list +
    '</div>';
  }

  /* ============================================================
   * 渲染：游戏主体
   * ============================================================ */
  function gameHTML() {
    var cur = state.currentPlayer;
    var isP1 = cur === "player1";
    var forbiddenIndex = computeForbidden();

    var boardClass = "w-full relative grid grid-cols-4 gap-2 sm:gap-4 p-3 sm:p-5 rounded-[2rem] border " +
      "shadow-2xl backdrop-blur-xl transition-all duration-1000 animate-gradient-x " +
      (isP1
        ? "bg-gradient-to-r from-rose-900/40 via-pink-900/30 to-rose-900/40 border-rose-500/30 " +
          "shadow-[0_0_40px_rgba(244,63,94,0.15)]"
        : "bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-blue-900/40 border-blue-500/30 " +
          "shadow-[0_0_40px_rgba(59,130,246,0.15)]");

    var cells = state.board.map(function (p, i) {
      return cellHTML(p, i, forbiddenIndex);
    }).join("");

    var logLines = state.gameLog.map(function (l, i) {
      return '<div class="flex items-center gap-3 text-xs font-mono py-1 border-b border-white/5 last:border-0 ' +
        (i === 0 ? "text-white font-bold" : "text-white/40") + '">' +
        '<span class="size-1.5 rounded-full bg-current opacity-50"></span><span>' + escAttr(l) + '</span></div>';
    }).join("");

    function pill(emoji, label, act) {
      return '<button data-act="' + act + '" class="cursor-pointer group relative flex items-center gap-3 ' +
        'rounded-full bg-white/5 px-8 py-3 transition-all hover:bg-white/10 hover:scale-105 active:scale-95">' +
        '<div class="absolute inset-0 rounded-full border border-white/10 group-hover:border-white/30 transition-colors"></div>' +
        '<div class="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-rose-500/20 to-purple-500/20 blur-xl ' +
          'opacity-0 group-hover:opacity-100 transition-opacity"></div>' +
        '<span class="text-xl">' + emoji + '</span>' +
        '<span class="text-sm font-bold uppercase tracking-widest text-white/80 group-hover:text-white">' +
          label + '</span></button>';
    }

    return '<section class="glass-effect relative w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 p-4 sm:p-10">' +
      '<div class="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px] animate-pulse-slow"></div>' +
      '<div class="pointer-events-none absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-rose-600/20 blur-[120px] animate-pulse-slow" style="animation-delay:2s"></div>' +

      '<header class="relative z-10 flex flex-col items-center text-center">' +
        '<h1 class="bg-gradient-to-b from-white via-purple-100 to-white/60 bg-clip-text text-4xl font-black ' +
          'uppercase tracking-tighter text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] sm:text-5xl">' +
          n("title") + '</h1>' +
        '<div class="mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-80"></div>' +
        '<p class="mt-4 text-sm font-medium tracking-[0.2em] text-white/40">' + n("tagline") + '</p>' +
      '</header>' +

      '<div class="mt-4 relative z-10 flex flex-col gap-2 w-full darkbeast-layout">' +
        '<div class="order-3 w-full shrink darkbeast-panel-left">' + panelHTML("player1") + '</div>' +
        '<div class="order-2 flex flex-col items-center justify-center perspective-1000 flex-grow darkbeast-board">' +
          '<div class="' + boardClass + '">' +
            '<div class="absolute inset-0 pointer-events-none rounded-[2rem] border border-white/5 opacity-50"></div>' +
            '<div class="absolute inset-0 pointer-events-none rounded-[2rem] transition-all duration-1000 opacity-50 ' +
              (isP1 ? "bg-rose-500/10" : "bg-blue-500/10") + ' animate-pulse-slow"></div>' +
            cells +
          '</div>' +
        '</div>' +
        '<div class="order-1 w-full shrink darkbeast-panel-right">' + panelHTML("player2") + '</div>' +
        '<div class="order-4 w-full darkbeast-log">' +
          '<div class="mt-4 sm:mt-8 w-full max-w-md rounded-xl border border-white/10 bg-black/60 p-4 shadow-inner mx-auto">' +
            '<div class="flex flex-col-reverse h-20 overflow-y-auto custom-scrollbar space-y-1 space-y-reverse">' +
              logLines +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="mt-4 flex flex-wrap justify-center gap-4 px-4">' +
        pill("❓", n("howToPlay"), "howto") +
        pill("⚙️", n("settings"), "open-settings") +
        pill("↻", n("restart"), "restart") +
      '</div>' +
    '</section>';
  }

  /* ============================================================
   * 渲染：彩纸
   * ============================================================ */
  function confettiHTML() {
    var colors = ["#fbbf24", "#ec4899", "#8b5cf6"];
    var out = "";
    for (var i = 0; i < 30; i++) {
      var left = (100 * Math.random()).toFixed(1);
      var color = colors[Math.floor(3 * Math.random())];
      var dl = (2 * Math.random()).toFixed(2);
      var du = (3 + 2 * Math.random()).toFixed(2);
      out += '<div class="absolute h-3 w-3 animate-fall" style="left:' + left + '%;top:-10%;background:' +
        color + ';animation-delay:' + dl + 's;animation-duration:' + du + 's"></div>';
    }
    return '<div class="pointer-events-none absolute inset-0 overflow-hidden">' + out + '</div>';
  }

  /* ============================================================
   * 渲染：设置弹窗
   * ============================================================ */
  function toggleRow(label, on, act) {
    return '<div class="flex items-center justify-between rounded-xl bg-white/5 p-4">' +
      '<span class="font-bold text-white/80">' + label + '</span>' +
      '<button data-act="' + act + '" class="cursor-pointer h-6 w-11 rounded-full transition-colors ' +
        (on ? "bg-rose-500" : "bg-white/20") + '">' +
        '<div class="h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ' +
          (on ? "translate-x-6" : "translate-x-1") + '"></div>' +
      '</button>' +
    '</div>';
  }
  function settingsHTML() {
    var tabIsP1 = penTab === "player1";

    var penInputs = BEASTS.map(function (b) {
      return '<div class="flex items-center gap-3 rounded-lg bg-white/5 p-2">' +
        '<div class="flex h-8 w-8 items-center justify-center rounded bg-black/40 text-lg border border-white/10">' +
          b.icon + '</div>' +
        '<div class="flex-1">' +
          '<label class="text-[10px] font-bold uppercase text-white/30 block mb-1">' +
            beastName(b.rank) + '</label>' +
          '<input data-pen="' + b.rank + '" type="text" value="' +
            escAttr(penalties[penTab][b.rank] || "") +
            '" class="w-full bg-transparent text-sm font-bold text-white focus:outline-none border-b ' +
            'border-transparent focus:border-white/30 placeholder-white/10 transition-colors" placeholder="' +
            n("penalties.placeholder") + '">' +
        '</div>' +
      '</div>';
    }).join("");

    return '<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md fade-in">' +
      '<div class="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl flex flex-col max-h-[90vh] modal-pop">' +
        '<div class="flex items-center justify-between mb-6">' +
          '<h3 class="text-xl font-black uppercase tracking-widest text-white">' + n("settings") + '</h3>' +
          '<button data-act="close-settings" class="cursor-pointer text-white/50 hover:text-white">✕</button>' +
        '</div>' +

        '<div class="flex-1 overflow-y-auto custom-scrollbar pr-2">' +
          '<div class="space-y-3 mb-6">' +
            toggleRow(n("rules.diagonalLeopard"), rules.diagonalLeopard, "toggle-diagonal") +
            toggleRow(n("rules.onlyCatEatsRat"), rules.onlyCatEatsRat, "toggle-cat") +
          '</div>' +

          '<div class="pt-4 border-t border-white/10">' +
            '<div class="flex items-center justify-between mb-4">' +
              '<div>' +
                '<h4 class="font-bold text-white">' + n("penalties.title") + '</h4>' +
                '<p class="text-xs text-white/40">' + n("penalties.desc") + '</p>' +
              '</div>' +
              '<button data-act="reset-defaults" class="cursor-pointer text-xs text-rose-400 hover:text-rose-300 hover:underline">' +
                n("penalties.reset") + '</button>' +
            '</div>' +

            '<div class="flex mb-4 bg-white/5 rounded-lg p-1">' +
              '<button data-act="tab-p1" class="cursor-pointer flex-1 py-2 rounded-md text-sm font-bold transition-all ' +
                (tabIsP1 ? "bg-rose-500 text-white shadow-lg" : "text-white/50 hover:text-white") + '">' +
                n("penalties.player1") + '</button>' +
              '<button data-act="tab-p2" class="cursor-pointer flex-1 py-2 rounded-md text-sm font-bold transition-all ' +
                (!tabIsP1 ? "bg-blue-500 text-white shadow-lg" : "text-white/50 hover:text-white") + '">' +
                n("penalties.player2") + '</button>' +
            '</div>' +

            '<div class="mb-4 rounded-lg bg-white/5 p-3 border border-white/10">' +
              '<label class="text-xs font-bold uppercase text-white/50 block mb-1">' + n("winReward") + '</label>' +
              '<textarea data-reward="1" rows="2" class="w-full bg-black/20 rounded-lg p-2 text-sm font-bold text-white ' +
                'focus:outline-none border border-transparent focus:border-white/30 placeholder-white/10 transition-colors resize-none" ' +
                'placeholder="' + n("rewardPlaceholder") + '">' + escAttr(rewards[penTab]) + '</textarea>' +
            '</div>' +

            '<div class="grid grid-cols-1 gap-3">' + penInputs + '</div>' +
          '</div>' +
        '</div>' +

        '<div class="mt-6 flex justify-end">' +
          '<button data-act="close-settings" class="cursor-pointer rounded-lg bg-white px-6 py-2 text-sm font-bold text-black hover:bg-gray-200">' +
            n("close") + '</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ============================================================
   * 渲染：惩罚弹窗
   * ============================================================ */
  function penaltyHTML() {
    var p = activePenalty;
    var isP1 = p.player === "player1";
    var borderCol = isP1 ? "border-rose-500/30" : "border-blue-500/30";
    var bgTint = isP1 ? "bg-rose-500/10" : "bg-blue-500/10";
    var textCol = isP1 ? "text-rose-400" : "text-blue-400";
    var grad = isP1 ? "from-rose-600 to-pink-600" : "from-blue-600 to-cyan-600";
    var shadow = isP1
      ? "shadow-[0_0_60px_rgba(244,63,94,0.2)]"
      : "shadow-[0_0_60px_rgba(59,130,246,0.2)]";

    return '<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-2xl fade-in">' +
      '<div class="relative w-full max-w-md overflow-hidden rounded-[2rem] border ' + borderCol + ' ' +
        'bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-8 text-center ' + shadow + ' modal-pop">' +
        '<div class="pointer-events-none absolute inset-0 z-0">' +
          '<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 ' +
            bgTint + ' blur-[100px] rounded-full"></div>' +
        '</div>' +
        '<div class="relative z-10 flex flex-col items-center">' +
          '<div class="mb-6 flex size-20 items-center justify-center rounded-full ' + bgTint +
            ' text-4xl animate-bounce border ' + borderCol + ' shadow-lg">🚨</div>' +
          '<h2 class="text-2xl font-black uppercase tracking-tight ' + textCol + ' mb-2 drop-shadow-lg">' +
            n("penaltyTitle") + '</h2>' +
          '<p class="text-white/80 mb-2">' +
            n("penaltyMessage", { player: playerName(p.player), beast: beastName(p.beastRank) }) + '</p>' +
          '<div class="mb-6 px-6 py-3 rounded-full ' + bgTint + ' border-2 ' + borderCol + ' backdrop-blur-md">' +
            '<p class="text-2xl font-black ' + textCol + ' animate-pulse drop-shadow-lg">' +
              playerName(p.player) + '</p></div>' +
          '<div class="w-full rounded-xl bg-white/5 p-6 border border-white/10 backdrop-blur-md mb-8 transform rotate-1">' +
            '<p class="text-sm text-white/40 uppercase tracking-widest mb-2">' + n("actionRequired") + '</p>' +
            '<p class="text-xl font-bold text-white animate-pulse">' +
              n("removeAction", { penalty: penaltyContent(p.beastRank, p.player) }) + '</p>' +
          '</div>' +
          '<button data-act="ack-penalty" class="w-full rounded-xl bg-gradient-to-r ' + grad +
            ' py-4 text-sm font-black uppercase tracking-widest text-white transition shadow-lg cursor-pointer ' +
            'hover:scale-[1.02] ' +
            (isP1 ? "hover:shadow-rose-500/30" : "hover:shadow-blue-500/30") + '">' +
            n("confirmPenalty") + '</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ============================================================
   * 渲染：胜利弹窗
   * ============================================================ */
  function winHTML() {
    var w = state.winner;
    var isP1 = w === "player1";
    var nameGrad = isP1 ? "from-rose-400 to-red-600" : "from-blue-400 to-indigo-600";

    return '<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl fade-in">' +
      confettiHTML() +
      '<div class="relative w-full max-w-lg overflow-hidden rounded-[3rem] border border-white/10 bg-[#0f0f0f] ' +
        'p-10 text-center shadow-[0_0_100px_rgba(234,179,8,0.2)] modal-pop">' +
        '<div class="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-64 bg-gradient-to-b from-yellow-500/20 ' +
          'to-transparent blur-[80px] rounded-full pointer-events-none"></div>' +
        '<div class="relative z-10 flex flex-col items-center">' +
          '<div class="mb-6 flex size-28 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 ' +
            'to-orange-600 text-6xl shadow-lg animate-bounce">🏆</div>' +
          '<h2 class="text-4xl font-black uppercase tracking-tighter text-white mb-2 drop-shadow-lg">' +
            n("win", { player: "" }).replace("!", "") + '</h2>' +
          '<div class="mb-4 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ' + nameGrad + '">' +
            playerName(w) + '</div>' +
          '<div class="mb-8 w-full rounded-xl bg-white/5 p-4 border border-white/10 backdrop-blur-md transform rotate-1">' +
            '<p class="text-xs text-white/40 uppercase tracking-widest mb-2">' + n("winReward") + '</p>' +
            '<p class="text-lg font-bold text-white animate-pulse">' + escAttr(rewards[w]) + '</p>' +
          '</div>' +
          '<button data-act="restart" class="w-full rounded-xl bg-white py-4 text-sm font-black uppercase tracking-widest ' +
            'text-black transition hover:bg-gray-200 hover:scale-[1.02] shadow-lg cursor-pointer">' +
            n("restart") + '</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ============================================================
   * 渲染：抛硬币
   * ============================================================ */
  function coinHTML() {
    var cardClass = coinPhase === "spinning"
      ? "animate-spin-3d-fast"
      : "land-" + coinWinner;
    var p1label = n("players.player1").split(" ")[0];
    var p2label = n("players.player2").split(" ")[0];

    function faceBody(emoji, label) {
      return '<div class="coin-inner-border"></div>' +
        '<div class="coin-content flex flex-col items-center gap-4">' +
          '<div class="size-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border ' +
            'border-white/20 shadow-lg text-6xl">' + emoji + '</div>' +
          '<div class="flex flex-col items-center">' +
            '<span class="text-sm font-bold tracking-[0.3em] text-white/60 uppercase mb-1">' +
              n("coinFlip.firstTurn") + '</span>' +
            '<h2 class="text-4xl font-black text-white uppercase tracking-tighter drop-shadow-md">' + label + '</h2>' +
            '<div class="h-1 w-12 bg-white/50 rounded-full mt-3"></div>' +
          '</div>' +
        '</div>';
    }

    return '<div class="relative flex w-full flex-col items-center justify-center min-h-[500px]">' +
      '<div class="relative w-64 h-80 sm:w-72 sm:h-96 perspective-1000">' +
        '<div class="coin-card-container ' + cardClass + '">' +
          '<div class="coin-face bg-gradient-to-br from-[#ff4d4d] via-[#a60000] to-[#4a0000]">' +
            faceBody("🔥", p1label) + '</div>' +
          '<div class="coin-face coin-face-back bg-gradient-to-br from-[#4d79ff] via-[#0033a6] to-[#00114a]">' +
            faceBody("❄️", p2label) + '</div>' +
        '</div>' +
        '<div class="mt-16 text-center transition-opacity duration-500 ' +
          (coinPhase === "spinning" ? "opacity-100" : "opacity-0") + '">' +
          '<p class="text-white/40 font-mono text-sm animate-pulse tracking-widest">' +
            n("coinFlip.decidingFate") + '</p>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ============================================================
   * 总渲染
   * ============================================================ */
  function render() {
    if (coinPhase) {
      root.innerHTML = coinHTML();
      modalRoot.innerHTML = "";
      return;
    }
    if (state) {
      root.innerHTML = gameHTML();
      var modals = "";
      if (settingsOpen) modals += settingsHTML();
      if (activePenalty) modals += penaltyHTML();
      if (state.winner && !activePenalty) modals += winHTML();
      modalRoot.innerHTML = modals;

      // 翻牌 700ms 3D 过渡
      if (lastFlipped != null) {
        var flipEl = root.querySelector('[data-cell="' + lastFlipped + '"] [data-flip]');
        if (flipEl) {
          flipEl.classList.remove("rotate-y-180");
          void flipEl.offsetHeight;
          flipEl.classList.add("rotate-y-180");
        }
        lastFlipped = null;
      }
      return;
    }
    root.innerHTML = '<div class="flex h-96 items-center justify-center text-white/40 animate-pulse">' +
      n("loading") + '</div>';
    modalRoot.innerHTML = "";
  }

  /* ---------------- 动作分发 ---------------- */
  function doAction(act) {
    switch (act) {
      case "howto":
        document.getElementById("instructions").scrollIntoView({ behavior: "smooth" });
        break;
      case "open-settings": settingsOpen = true; render(); break;
      case "close-settings": settingsOpen = false; render(); break;
      case "toggle-diagonal":
        rules.diagonalLeopard = !rules.diagonalLeopard; persist(); render(); break;
      case "toggle-cat":
        rules.onlyCatEatsRat = !rules.onlyCatEatsRat; persist(); render(); break;
      case "tab-p1": penTab = "player1"; render(); break;
      case "tab-p2": penTab = "player2"; render(); break;
      case "reset-defaults":
        penalties = defaultPenalties(); rewards = defaultRewards(); persist(); render(); break;
      case "ack-penalty": ackPenalty(); break;
      case "restart": restart(); break;
    }
  }

  root.addEventListener("click", function (ev) {
    var cell = ev.target.closest("[data-cell]");
    if (cell) { handleClick(parseInt(cell.getAttribute("data-cell"), 10)); return; }
    var actEl = ev.target.closest("[data-act]");
    if (actEl) doAction(actEl.getAttribute("data-act"));
  });
  modalRoot.addEventListener("click", function (ev) {
    var actEl = ev.target.closest("[data-act]");
    if (actEl) doAction(actEl.getAttribute("data-act"));
  });
  modalRoot.addEventListener("input", function (ev) {
    var tgt = ev.target;
    if (!tgt.getAttribute) return;
    if (tgt.getAttribute("data-pen") != null) {
      penalties[penTab][parseInt(tgt.getAttribute("data-pen"), 10)] = tgt.value;
      persist();
    } else if (tgt.getAttribute("data-reward") != null) {
      rewards[penTab] = tgt.value;
      persist();
    }
  });

  /* ============================================================
   * 初始化
   * ============================================================ */
  function loadExtras() {
    try {
      var s = JSON.parse(localStorage.getItem(K_SET) || "null");
      if (s) {
        rules.diagonalLeopard = !!s.diagonalLeopard;
        rules.onlyCatEatsRat = !!s.onlyCatEatsRat;
      }
      var p = JSON.parse(localStorage.getItem(K_PEN) || "null");
      if (p && p.player1 && p.player2) penalties = p;
      var r = JSON.parse(localStorage.getItem(K_REW) || "null");
      if (r && r.player1 && r.player2) rewards = r;
    } catch (e) { /* 忽略，使用默认 */ }
  }

  function init() {
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(K_STATE) || "null"); } catch (e) { saved = null; }
    loadExtras();
    if (saved && saved.board) {
      state = normalize(saved);
      render();
      processPenalties();
    } else {
      startCoinFlip();
    }
  }

  init();
})();
