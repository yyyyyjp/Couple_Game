/* 心动飞行棋 ludo —— 纯静态复刻（支持 2/3/4 人、1-4 棋子） */
(function () {
  const LG = window.LG, M = window.MESSAGES;
  const L = (k, p) => window.t("games.ludo." + k, p);
  const sleep = LG.sleep, sound = LG.sound, esc = LG.escapeHtml;
  const root = document.getElementById("ludo-root");
  const modalRoot = document.getElementById("ludo-modal-root");

  /* ================= 棋盘几何 ================= */
  const N = 13, DIRS = ["north", "east", "south", "west"];
  const rot = (p) => ({ row: p.col, col: N - 1 - p.row });
  const rotN = (p, n) => { let r = { row: p.row, col: p.col }; for (let i = 0; i < n; i++) r = rot(r); return r; };
  const PAIR = (a) => a.map(([row, col]) => ({ row, col }));
  const BASE = PAIR([
    [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0],
    [9, 1], [9, 2], [9, 3], [10, 3], [11, 3], [12, 3],
    [12, 4], [12, 5], [12, 6], [12, 7], [12, 8], [12, 9],
    [11, 9], [10, 9], [9, 9], [9, 10], [9, 11], [9, 12],
    [8, 12], [7, 12], [6, 12], [5, 12], [4, 12], [3, 12],
    [3, 11], [3, 10], [3, 9], [2, 9], [1, 9], [0, 9],
    [0, 8], [0, 7], [0, 6], [0, 5], [0, 4], [0, 3],
    [1, 3], [2, 3], [3, 3], [3, 2], [3, 1],
    [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6],
  ]);
  const BASE_HOME = PAIR([[1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6]]);
  const PATHS = {}, HOMES = {};
  DIRS.forEach((d, i) => { PATHS[d] = BASE.map((p) => rotN(p, i)); HOMES[d] = BASE_HOME.map((p) => rotN(p, i)); });
  const key = (p) => `${p.row}-${p.col}`;
  const ENTRY = { north: "0-6", east: "6-12", south: "12-6", west: "6-0" };
  const WAIT = { north: { row: 1, col: 1 }, east: { row: 1, col: 11 }, south: { row: 11, col: 11 }, west: { row: 11, col: 1 } };
  const HOME_KEYS = new Set(DIRS.flatMap((d) => HOMES[d].map(key)));
  const OUTER = PATHS.north.filter((p) => { const k = key(p); return !HOME_KEYS.has(k) && k !== "6-6"; });
  const OUTER_IDX = new Map(); OUTER.forEach((p, i) => OUTER_IDX.set(key(p), i));
  const DCFG = {};
  DIRS.forEach((d) => {
    DCFG[d] = {
      home: HOMES[d], homeKeys: new Set(HOMES[d].map(key)),
      entryKey: ENTRY[d], entryIndex: OUTER_IDX.get(ENTRY[d]) ?? 0,
      wait: WAIT[d], startIndex: OUTER_IDX.get(key(PATHS[d][0])) ?? 0,
    };
  });

  /* ================= 玩家 / 模式 ================= */
  const P2D = { male: "north", female: "south", red: "north", yellow: "south", blue: "west", green: "east" };
  const MODE_DIR = { two: ["north", "south"], three: ["north", "south", "west"], four: DIRS };
  const MODE_P = { two: ["male", "female"], three: ["red", "blue", "yellow"], four: ["red", "yellow", "blue", "green"] };
  const P_COL = {
    male: { grad: "bg-gradient-to-br from-violet-500 to-violet-800 text-white", ring: "ring-violet-500/80", sym: "♂", txt: "text-violet-200", dot: "bg-violet-400", pill: "border-violet-400/70 bg-violet-500/20 text-violet-100" },
    female: { grad: "bg-gradient-to-br from-rose-500 to-rose-800 text-white", ring: "ring-rose-500/80", sym: "♀", txt: "text-rose-200", dot: "bg-rose-400", pill: "border-rose-400/70 bg-rose-500/20 text-rose-100" },
    red: { grad: "bg-gradient-to-br from-red-500 to-red-800 text-white", ring: "ring-red-400/80", sym: "R", txt: "text-red-200", dot: "bg-red-400", pill: "border-red-400/70 bg-red-500/20 text-red-100" },
    yellow: { grad: "bg-gradient-to-br from-amber-400 to-amber-700 text-white", ring: "ring-amber-400/80", sym: "Y", txt: "text-amber-200", dot: "bg-amber-400", pill: "border-amber-400/70 bg-amber-400/15 text-amber-100" },
    blue: { grad: "bg-gradient-to-br from-sky-500 to-sky-800 text-white", ring: "ring-sky-400/80", sym: "B", txt: "text-sky-200", dot: "bg-sky-400", pill: "border-sky-400/70 bg-sky-500/20 text-sky-100" },
    green: { grad: "bg-gradient-to-br from-emerald-500 to-emerald-800 text-white", ring: "ring-emerald-400/80", sym: "G", txt: "text-emerald-200", dot: "bg-emerald-400", pill: "border-emerald-400/70 bg-emerald-500/20 text-emerald-100" },
  };
  const D_CELL2 = {
    north: "bg-gradient-to-br from-violet-200/70 to-violet-300/70 border-violet-300 text-violet-900/80 shadow-[0_0_15px_rgba(139,92,246,0.6)]",
    south: "bg-gradient-to-br from-rose-200/70 to-rose-300/70 border-rose-300 text-rose-900/80 shadow-[0_0_15px_rgba(244,63,94,0.6)]",
    east: "bg-gradient-to-br from-emerald-200/70 to-emerald-300/70 border-emerald-300 text-emerald-900/80 shadow-[0_0_15px_rgba(16,185,129,0.6)]",
    west: "bg-gradient-to-br from-sky-200/70 to-sky-300/70 border-sky-300 text-sky-900/80 shadow-[0_0_15px_rgba(14,165,233,0.6)]",
  };
  const D_CELL4 = {
    north: "bg-gradient-to-br from-red-200/70 to-red-300/70 border-red-300 text-red-900/80 shadow-[0_0_15px_rgba(239,68,68,0.6)]",
    south: "bg-gradient-to-br from-amber-200/70 to-amber-300/70 border-amber-300 text-amber-900/80 shadow-[0_0_15px_rgba(245,158,11,0.6)]",
    east: "bg-gradient-to-br from-emerald-200/70 to-emerald-300/70 border-emerald-300 text-emerald-900/80 shadow-[0_0_15px_rgba(16,185,129,0.6)]",
    west: "bg-gradient-to-br from-sky-200/70 to-sky-300/70 border-sky-300 text-sky-900/80 shadow-[0_0_15px_rgba(14,165,233,0.6)]",
  };

  /* ================= 近道 ================= */
  const FLIGHTS = [
    { launch: "9-9", target: "3-9", dir: "north", seg: ["8-9", "7-9", "6-9", "5-9", "4-9"] },
    { launch: "3-9", target: "3-3", dir: "west", seg: ["3-8", "3-7", "3-6", "3-5", "3-4"] },
    { launch: "3-3", target: "9-3", dir: "south", seg: ["4-3", "5-3", "6-3", "7-3", "8-3"] },
    { launch: "9-3", target: "9-9", dir: "east", seg: ["9-4", "9-5", "9-6", "9-7", "9-8"] },
  ];
  const FLIGHT_MAP = {}; FLIGHTS.forEach((f) => { FLIGHT_MAP[f.launch] = f; });

  /* ================= 事件数据 ================= */
  const LD = M.games.ludo;
  function defaultEvents(mode) {
    if (mode === "three") return LD.eventsThree;
    if (mode === "four") return LD.eventsFour;
    return LD.events;
  }
  let customEvents = LG.loadJSON("lovegame-ludo-custom-events", { two: {}, three: {}, four: {} });
  ["two", "three", "four"].forEach((m) => { customEvents[m] = customEvents[m] || {}; });
  let activeLibrary = LG.loadJSON("lovegame-ludo-active-library", null);
  let userLibraries = LG.loadJSON("lovegame-ludo-libraries", {});
  const BUILTIN_LIBS = {
    __private: { nameKey: "library.privateName", fn: () => LD.privateEvents },
    __funny: { nameKey: "library.funnyName", fn: () => LD.funnyEvents },
    __long: { nameKey: "library.longDistanceName", fn: () => LD.longDistanceEvents },
    __drunk: { nameKey: "library.drunkName", fn: () => LD.drunkEvents },
    __intense: { nameKey: "library.intenseName", fn: () => LD.intenseEvents },
    __fitness: { nameKey: "library.fitnessName", fn: () => LD.fitnessEvents },
    __fourPrivate: { nameKey: "library.fourPrivateName", fn: () => LD.fourPrivateEvents },
  };
  function baseEventTable() {
    if (activeLibrary && BUILTIN_LIBS[activeLibrary]) return BUILTIN_LIBS[activeLibrary].fn();
    if (activeLibrary && userLibraries[activeLibrary]) return userLibraries[activeLibrary].events || {};
    return defaultEvents(settings.playerMode);
  }
  let eventTable = {};
  function rebuildEventTable() {
    const base = baseEventTable(); eventTable = {};
    Object.keys(base).forEach((k) => { eventTable[k] = { name: base[k].name, description: base[k].description || "" }; });
    const ce = customEvents[settings.playerMode] || {};
    Object.keys(ce).forEach((k) => { eventTable[k] = { name: ce[k].name, description: ce[k].description || "" }; });
  }
  function getEvent(r, c) { return eventTable[`${r}-${c}`] || null; }

  /* ================= 特殊效果（每次重置随机分配） ================= */
  let tileEffects = {};
  const manhattan = (k1, k2) => {
    const [r1, c1] = k1.split("-").map(Number), [r2, c2] = k2.split("-").map(Number);
    return Math.abs(r1 - r2) + Math.abs(c1 - c2);
  };
  function pickSpread(candidates, count, used) {
    let best = [];
    for (let iter = 0; iter < 80; iter++) {
      const attempt = [];
      const pool = LG.shuffle(candidates.filter((k) => !used.has(k)));
      for (const k of pool) {
        if (Array.from(used).every((u) => manhattan(u, k) > 3) && attempt.every((a) => manhattan(a, k) > 3)) {
          attempt.push(k); if (attempt.length === count) break;
        }
      }
      if (attempt.length > best.length) best = attempt;
      if (best.length === count) break;
    }
    return best;
  }
  function assignTileEffects() {
    tileEffects = {};
    const launchSet = new Set(FLIGHTS.map((f) => f.launch));
    const candidates = OUTER.map(key).filter((k) => !launchSet.has(k));
    const used = new Set();
    const counts = { forward2: 3, backward2: 6, rest: 8 };
    ["forward2", "backward2", "rest"].forEach((eff) => {
      pickSpread(candidates, counts[eff], used).forEach((k) => { tileEffects[k] = eff; used.add(k); });
    });
  }
  function getEffect(r, c) { return tileEffects[`${r}-${c}`] || null; }

  /* ================= 游戏状态（tokens） ================= */
  let settings = Object.assign({ playerMode: "two", pieceCount: 1, requireExactHomeEntry: false, enableBump: false },
    LG.loadJSON("lovegame-ludo-settings", {}));
  settings.pieceCount = Math.max(1, Math.min(4, settings.pieceCount || 1));
  let players = MODE_P[settings.playerMode];
  let ps = {};
  let currentPlayer = players[0], winner = null, rolling = false, preStartRolls = 0;
  let rollCounts = {}, hasSix = {}, history = [];
  let diceVal = null, selectState = null;
  let ui = { msg: "", needAck: false, ackAction: null };

  function freshToken(pid, i) {
    return { id: `${pid}-token-${i}`, started: false, outerIndex: -1, inHome: false, homeIndex: -1, resting: false, finished: false };
  }
  function freshPlayerState(pid, n) {
    return { tokens: Array.from({ length: n }, (_, i) => freshToken(pid, i)), homeCount: n, finishedCount: 0 };
  }
  function resetGameState() {
    ps = {}; players.forEach((p) => { ps[p] = freshPlayerState(p, settings.pieceCount); });
    currentPlayer = players[0]; winner = null; rolling = false; preStartRolls = 0;
    rollCounts = {}; hasSix = {}; history = []; diceVal = null; selectState = null;
    ui = { msg: "", needAck: false, ackAction: null };
    assignTileEffects(); rebuildEventTable();
  }

  /* 等待区基地槽位（north，旋转生成） */
  const BASE_WAIT_SLOTS = {
    1: PAIR([[1, 1]]),
    2: PAIR([[0, 0], [2, 2]]),
    3: PAIR([[0, 0], [1, 1], [2, 2]]),
    4: PAIR([[0, 0], [0, 2], [2, 0], [2, 2]]),
  };
  function waitSlot(pid, i) {
    const d = P2D[pid], di = DIRS.indexOf(d);
    const slots = BASE_WAIT_SLOTS[settings.pieceCount];
    return rotN(slots[Math.min(i, slots.length - 1)], di);
  }
  function tokenPoint(pid, t, tokenIndex) {
    const cfg = DCFG[P2D[pid]];
    if (!t.started) return waitSlot(pid, tokenIndex);
    if (t.inHome) return t.homeIndex < 0 ? OUTER[cfg.entryIndex] : cfg.home[t.homeIndex];
    if (t.outerIndex < 0) return OUTER[cfg.startIndex];
    return OUTER[t.outerIndex];
  }

  /* ================= 能力判定 e7 ================= */
  function outerDist(from, to) {
    if (from < 0) return -1;
    const L2 = OUTER.length;
    const f = ((from % L2) + L2) % L2, t2 = ((to % L2) + L2) % L2;
    return f === t2 ? 0 : (t2 - f + L2) % L2;
  }
  function tokenAbility(t, dice, pid) {
    const cfg = DCFG[P2D[pid]], home = cfg.home;
    if (!t.started) return { canStart: dice === 6, canMove: false };
    if (t.finished) return { canStart: false, canMove: false };
    if (t.resting) return { canStart: false, canMove: false };
    if (!t.inHome) {
      if (settings.requireExactHomeEntry) {
        const d = outerDist(t.outerIndex, cfg.entryIndex);
        if (d >= 0 && dice > d && t.outerIndex !== cfg.entryIndex) return { canStart: false, canMove: false };
      }
      return { canStart: false, canMove: true };
    }
    return t.homeIndex + dice >= home.length ? { canStart: false, canMove: false } : { canStart: false, canMove: true };
  }

  /* ================= 移动序列 ================= */
  function outerSeq(cur, steps, dir) {
    const o = []; if (steps <= 0) return { seq: o, final: cur };
    const L2 = OUTER.length; let s = ((cur % L2) + L2) % L2;
    for (let i = 0; i < steps; i++) { s = (s + dir + L2) % L2; o.push(s); }
    return { seq: o, final: s };
  }
  function homeSeq(pid, cur, steps, dir) {
    const o = []; if (steps <= 0) return { seq: o, final: cur };
    const hp = DCFG[P2D[pid]].home;
    const s2 = hp.length - 1; let n = Math.min(cur, s2); if (n < -1) n = -1;
    let a = dir;
    for (let i = 0; i < steps; i++) {
      let e = n + a;
      if (e > s2) { const t = e - s2; a = -1; e = s2 - t; if (e < 0) e = 0; }
      else if (e < 0) { a = 1; e = -e; if (e > s2) e = s2; }
      o.push(e); n = e;
    }
    return { seq: o, final: n };
  }
  async function animateToken(pid, tokenId, kind, seq, speed) {
    const state2 = ps[pid];
    const ci = state2.tokens.findIndex((t) => t.id === tokenId);
    for (const idx of seq) {
      if (kind === "outer") state2.tokens[ci].outerIndex = idx;
      else state2.tokens[ci].homeIndex = idx;
      renderPieces(); sound.play("move");
      await sleep(speed || 260);
    }
  }

  /* ================= 渲染 ================= */
  function playerName(pid) { return L("players." + pid + ".short"); }
  function playerBadge(pid) { return L("players." + pid + ".badge"); }

  function shell() {
    root.innerHTML = `
      <header class="w-full text-center">
        <h1 class="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-pink-300 via-rose-200 to-fuchsia-300 bg-clip-text text-transparent drop-shadow">${esc(L("title"))}</h1>
        <p class="mt-3 text-sm sm:text-base text-white/60">${esc(L("tagline"))}</p>
      </header>
      ${toolbar()}
      <div class="w-full flex flex-col items-center gap-5">
        <div id="player-capsules" class="flex flex-wrap items-center justify-center gap-3"></div>
        <div id="board-wrap" class="relative">
          <div id="board" class="grid gap-0 rounded-2xl border border-white/10 bg-black/40 p-1 backdrop-blur"></div>
          <div id="piece-layer" class="absolute inset-0"></div>
        </div>
        ${controlCard()}
      </div>`;
  }
  function toolbar() {
    const btn = (id, icon, txt2) => `<button id="${id}" class="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10 transition">${icon} <span>${esc(txt2)}</span></button>`;
    return `
    <div class="w-full max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur flex flex-wrap items-center justify-center gap-2">
      ${btn("btn-edit", "✏️", L("buttons.enterEdit"))}
      ${btn("btn-library", "📚", L("buttons.openLibrary"))}
      ${btn("btn-rules", "⚙️", L("options.title"))}
      ${btn("btn-history", "🕘", L("history.title"))}
      ${btn("btn-json", "🔧", L("buttons.openJson"))}
      <a href="https://discord.com/invite/keqypXC6wD" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 rounded-xl border border-indigo-400/30 bg-indigo-500/15 px-3 py-2 text-xs text-indigo-100 hover:bg-indigo-500/25 transition">🎧 Discord</a>
    </div>`;
  }
  function controlCard() {
    return `
    <div id="control-card" class="w-full max-w-md rounded-3xl border border-white/10 bg-[#130718]/90 p-5 text-center shadow-[0_20px_60px_rgba(244,114,182,0.3)] backdrop-blur">
      <div id="turn-label" class="text-sm font-semibold text-white/80"></div>
      <div id="dice-area" class="my-4 flex items-center justify-center"></div>
      <div id="roll-btn-wrap"></div>
      <div id="event-msg" class="mt-3 whitespace-pre-line text-sm leading-6 text-white/90"></div>
      <div id="ack-btn-wrap" class="mt-3"></div>
    </div>`;
  }

  const CELL = 60;
  function renderBoard() {
    const board = document.getElementById("board");
    board.style.gridTemplateColumns = `repeat(${N}, ${CELL}px)`;
    const activeDirs = new Set(MODE_DIR[settings.playerMode]);
    const dCell = settings.playerMode === "two" ? D_CELL2 : D_CELL4;
    const cornerTint = settings.playerMode === "two"
      ? { north: "bg-violet-500/10", south: "bg-rose-500/10", east: "bg-emerald-500/10", west: "bg-sky-500/10" }
      : { north: "bg-red-500/10", south: "bg-amber-500/10", east: "bg-emerald-500/10", west: "bg-sky-500/10" };
    let html = "";
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const k = `${r}-${c}`;
        const ori = DIRS.filter((d) => {
          const cfg = DCFG[d];
          return PATHS[d].some((p) => key(p) === k) && activeDirs.has(d);
        });
        let cls = `border rounded-lg text-[9px] flex items-center justify-center relative p-0.5 transition-all duration-200 w-[${CELL}px] h-[${CELL}px] `;
        let isCorner = false;
        if (r <= 2 && c <= 2) { if (activeDirs.has("north")) { cls += cornerTint.north + " "; isCorner = true; } }
        else if (r <= 2 && c >= 10) { if (activeDirs.has("east")) { cls += cornerTint.east + " "; isCorner = true; } }
        else if (r >= 10 && c >= 10) { if (activeDirs.has("south")) { cls += cornerTint.south + " "; isCorner = true; } }
        else if (r >= 10 && c <= 2) { if (activeDirs.has("west")) { cls += cornerTint.west + " "; isCorner = true; } }
        const pathOri = ori.filter((d) => !DCFG[d].homeKeys.has(k));
        const homeOri = ori.filter((d) => DCFG[d].homeKeys.has(k));
        if (pathOri.length > 1 || (pathOri.length && homeOri.length)) {
          cls += "bg-gradient-to-br from-fuchsia-400/40 to-rose-500/40 border-rose-400 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)] ";
        } else if (ori.length === 1) cls += dCell[ori[0]] + " ";
        else if (isCorner) cls += "border-white/10 text-zinc-100/80 shadow-sm ";
        else cls += "bg-white/5 border-white/10 text-zinc-100/80 ";
        if (k === "9-9") cls = cls.replace(/bg-gradient-to-br from-[^\s]+ to-[^\s]+/g, "bg-gradient-to-br from-red-500/60 to-red-600/60");
        else if (k === "3-9") cls = cls.replace(/bg-gradient-to-br from-[^\s]+ to-[^\s]+/g, "bg-gradient-to-br from-blue-500/60 to-blue-600/60");
        else if (k === "3-3") cls = cls.replace(/bg-gradient-to-br from-[^\s]+ to-[^\s]+/g, "bg-gradient-to-br from-yellow-400/60 to-yellow-500/60");
        else if (k === "9-3") cls = cls.replace(/bg-gradient-to-br from-[^\s]+ to-[^\s]+/g, "bg-gradient-to-br from-green-500/60 to-green-600/60");
        let inner = "";
        const isWait = DIRS.some((d) => { const w2 = DCFG[d].wait; return w2.row === r && w2.col === c; });
        if (FLIGHT_MAP[k]) inner = `<span class="text-base">✈️</span>`;
        else {
          const eff = getEffect(r, c);
          if (eff) {
            const ek2 = eff === "forward2" ? "effects.forward2.short" : eff === "backward2" ? "effects.backward2.short" : "effects.rest.short";
            inner = `<span class="font-bold leading-none text-center">${esc(L(ek2))}</span>`;
          } else if (getEvent(r, c) && getEvent(r, c).name && !isWait)
            inner = `<span class="leading-tight text-center font-semibold">${esc(getEvent(r, c).name)}</span>`;
        }
        html += `<div data-cell="${k}" class="${cls}">${inner}</div>`;
      }
    }
    board.innerHTML = html;
  }

  function renderPieces() {
    const layer = document.getElementById("piece-layer"); if (!layer) return;
    // 收集棋子并处理同位置重叠
    const all = [];
    players.forEach((pid) => {
      ps[pid].tokens.forEach((t, i) => {
        all.push({ pid: pid, t: t, i: i, pt: tokenPoint(pid, t, i) });
      });
    });
    const posCount = {};
    all.forEach((p) => { const k = key(p.pt); posCount[k] = (posCount[k] || 0) + 1; });
    const posSeen = {};
    let html = "";
    all.forEach((p) => {
      const col = P_COL[p.pid];
      const k = key(p.pt);
      const same = posCount[k];
      const seen = posSeen[k] || 0; posSeen[k] = seen + 1;
      let size = CELL - 8, ox2 = 0, oy2 = 0;
      if (same > 1) {
        size = CELL - 18;
        ox2 = (seen % 2 ? -1 : 1) * 5;
        oy2 = (seen < 2 ? -1 : 1) * 5;
      }
      const x = p.pt.col * CELL + (CELL - size) / 2 + ox2;
      const y = p.pt.row * CELL + (CELL - size) / 2 + oy2;
      const isCur = p.pid === currentPlayer && !winner;
      const movable = selectState && selectState.pid === p.pid && selectState.ids.includes(p.t.id);
      let cls = `absolute flex items-center justify-center rounded-full ${col.grad} transition-all duration-300`;
      if (movable) cls += ` ${col.ring} ring-2 scale-115 z-30 pointer-events-auto animate-pulse cursor-pointer`;
      else if (isCur) cls += ` ${col.ring} ring-2 z-20`;
      else cls += " z-10";
      html += `<div data-piece="${p.t.id}" class="${cls}" style="left:${x}px;top:${y}px;width:${size}px;height:${size}px;font-size:${Math.floor(size * 0.45)}px;box-shadow:0 3px 10px rgba(0,0,0,.5)">${col.sym}</div>`;
    });
    layer.innerHTML = html;
    if (selectState) {
      layer.querySelectorAll("[data-piece]").forEach((d) => {
        if (selectState.ids.includes(d.getAttribute("data-piece"))) {
          d.onclick = () => moveToken(selectState.pid, d.getAttribute("data-piece"), selectState.dice);
        }
      });
    }
  }

  function renderCapsules() {
    const el = document.getElementById("player-capsules");
    el.innerHTML = players.map((pid) => {
      const col = P_COL[pid], active = pid === currentPlayer && !winner;
      return `<div class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${active ? col.pill : "border-white/10 bg-white/5 text-white/60"}">
        <span class="h-2 w-2 rounded-full ${col.dot}"></span>${esc(playerBadge(pid))}</div>`;
    }).join("");
  }

  function diceFace(v) {
    if (!v) return `<div class="flex items-center justify-center rounded-xl bg-white/10 border border-white/20 text-2xl text-white/40" style="width:64px;height:64px">?</div>`;
    const dots = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
    let cells = "";
    for (let i = 0; i < 9; i++) cells += `<div class="w-2 h-2 rounded-full ${dots[v].includes(i) ? "bg-rose-500" : ""}"></div>`;
    return `<div class="grid grid-cols-3 gap-1 rounded-xl bg-white p-2 shadow-lg" style="width:64px;height:64px">${cells}</div>`;
  }

  function renderControl() {
    const tl = document.getElementById("turn-label");
    tl.innerHTML = winner ? "🏁" : selectState ? `${esc(playerBadge(currentPlayer))} · ${L("messages.selectTokenToMove", { player: "" })}`
      : `${esc(playerBadge(currentPlayer))} · ${L("labels.currentPlayer")}`;
    document.getElementById("dice-area").innerHTML = diceFace(diceVal);
    const rbw = document.getElementById("roll-btn-wrap");
    if (!winner && !ui.needAck && !selectState) {
      rbw.innerHTML = `<button id="btn-roll" ${rolling ? "disabled" : ""} class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-rose-500 px-7 py-3 text-base font-bold text-white shadow-lg shadow-rose-500/40 transition hover:scale-105 active:scale-95 disabled:opacity-50">🎲 ${esc(L("buttons.roll"))}</button>`;
      const b = document.getElementById("btn-roll"); if (b) b.onclick = () => doRoll();
    } else rbw.innerHTML = "";
    document.getElementById("event-msg").textContent = ui.msg || "";
    const aw = document.getElementById("ack-btn-wrap");
    if (ui.needAck) {
      aw.innerHTML = `<button id="btn-ack" class="inline-flex items-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-500/20 px-6 py-2.5 text-sm font-bold text-emerald-100 hover:bg-emerald-500/30 transition">✅ ${esc(L("messages.acknowledge"))}</button>`;
      document.getElementById("btn-ack").onclick = () => {
        const act = ui.ackAction; ui.needAck = false; ui.msg = ""; renderControl(); if (act) act();
      };
    } else aw.innerHTML = "";
  }
  function render() { renderBoard(); renderPieces(); renderCapsules(); renderControl(); }

  /* ================= 掷骰入口 ================= */
  async function doRoll(forced, silent) {
    if (rolling || winner || selectState) return;
    if (!silent) LG.recordDetailStat("ludoMoves");
    rolling = true;
    const pid = currentPlayer;
    const allNotStarted = players.every((p) => ps[p].tokens.every((t) => !t.started));
    const dice = forced || LG.dice1_6();
    rollCounts[pid] = (rollCounts[pid] || 0) + 1;
    if (dice === 6) { LG.recordDetailStat("ludoSixes"); hasSix[pid] = true; }
    if (!silent) {
      const iv = setInterval(() => { diceVal = LG.dice1_6(); document.getElementById("dice-area").innerHTML = diceFace(diceVal); sound.play("roll"); }, 130);
      renderControl();
      await sleep(900); clearInterval(iv);
      diceVal = dice; document.getElementById("dice-area").innerHTML = diceFace(diceVal); sound.play("stop");
      await sleep(300);
    } else diceVal = dice;

    // 计算可动棋子
    const movable = ps[pid].tokens.map((t) => ({ t: t, ab: tokenAbility(t, dice, pid) }))
      .filter((x) => x.ab.canMove || x.ab.canStart);

    rolling = false;

    if (movable.length === 0) {
      // 无可动：清除已休息的 token，轮换
      ps[pid].tokens.forEach((t) => { if (t.resting) t.resting = false; });
      let msg;
      const allWait = ps[pid].tokens.every((t) => !t.started);
      if (allWait && dice !== 6) {
        msg = L("messages.rollSixToStart");
        preStartRolls = allNotStarted ? Math.min(preStartRolls + 1, 5) : 0;
      } else msg = L("messages.noMovableTokens", { player: playerName(pid) });
      history.unshift({ id: LG.uuid(), player: pid, dice: dice, text: msg, at: Date.now() });
      ui.msg = msg; renderControl();
      await sleep(1000); nextPlayer();
      return;
    }

    if (movable.length === 1) {
      await moveToken(pid, movable[0].t.id, dice, silent);
      return;
    }
    // 多个可动：若全是未开始（canStart），自动开始第一个
    if (movable.every((x) => x.ab.canStart && !x.t.started)) {
      await moveToken(pid, movable[0].t.id, dice, silent);
      return;
    }
    // 否则进入选择
    selectState = { pid: pid, dice: dice, ids: movable.map((x) => x.t.id) };
    diceVal = dice; renderPieces(); renderControl();
  }

  /* ================= 执行 token 移动 ================= */
  async function moveToken(pid, tokenId, dice, silent) {
    const state2 = ps[pid];
    const ci = state2.tokens.findIndex((t) => t.id === tokenId);
    if (ci < 0) return;
    let token = state2.tokens[ci];
    const ab = tokenAbility(token, dice, pid);
    const cfg = DCFG[P2D[pid]];
    selectState = null;
    let lines = [], needAck = false, winPid = null;

    if (ab.canStart && !token.started) {
      token.started = true; token.outerIndex = -1; token.inHome = false; token.homeIndex = -1; token.resting = false;
      state2.homeCount = Math.max(0, state2.homeCount - 1);
      lines.push(L("messages.playerStarted", { player: playerName(pid) }));
      const wev = getEvent(cfg.wait.row, cfg.wait.col);
      if (wev && wev.description) lines.push(wev.description);
      needAck = true;
      sound.play("start");
    } else if (ab.canMove) {
      let m = token.outerIndex, inHome = token.inHome, f = token.homeIndex;
      if (inHome) {
        const r = homeSeq(pid, f, dice, 1);
        if (r.seq.length) await animateToken(pid, tokenId, "home", r.seq, 260);
        f = r.seq.length ? r.final : f;
      } else {
        const seq = [];
        if (m < 0 && dice > 0) { m = cfg.startIndex; seq.push(m); }
        const remain = dice - seq.length;
        const d = outerDist(m, cfg.entryIndex);
        if (remain >= d && d >= 0) {
          if (d > 0) { const r = outerSeq(m, d, 1); seq.push(...r.seq); m = r.final; }
          const left = dice - seq.length;
          if (left > 0) {
            inHome = true;
            const r = homeSeq(pid, -1, left, 1);
            state2.tokens[ci].inHome = true; state2.tokens[ci].outerIndex = -1;
            if (r.seq.length) await animateToken(pid, tokenId, "outer", seq, 260);
            await animateToken(pid, tokenId, "home", r.seq, 260);
            f = r.final;
          } else { if (seq.length) await animateToken(pid, tokenId, "outer", seq, 260); }
        } else {
          const r = outerSeq(m, remain, 1); seq.push(...r.seq);
          if (seq.length) await animateToken(pid, tokenId, "outer", seq, 260);
          m = r.final;
        }
      }
      token.outerIndex = inHome ? -1 : m; token.inHome = inHome; token.homeIndex = f;
      renderPieces();

      // 落点与特殊效果
      let pt = inHome ? (f < 0 ? OUTER[cfg.entryIndex] : cfg.home[f]) : OUTER[m];
      let eff = getEffect(pt.row, pt.col);
      if (!inHome && eff === "forward2") {
        const r = outerSeq(m, 2, 1);
        if (r.seq.length) { await animateToken(pid, tokenId, "outer", r.seq, 230); m = r.final; token.outerIndex = m; renderPieces(); }
      } else if (!inHome && eff === "backward2") {
        const r = outerSeq(m, 2, -1);
        if (r.seq.length) { await animateToken(pid, tokenId, "outer", r.seq, 230); m = r.final; token.outerIndex = m; renderPieces(); }
      } else if (eff === "rest") token.resting = true;

      pt = inHome ? (f < 0 ? OUTER[cfg.entryIndex] : cfg.home[f]) : OUTER[token.outerIndex];
      // 近道
      const fk = key(pt);
      if (!inHome && FLIGHT_MAP[fk]) {
        const fl = FLIGHT_MAP[fk];
        sound.play("fly");
        token.outerIndex = OUTER_IDX.get(fl.target); renderPieces();
        await sleep(300);
        const lev = getEvent(pt.row, pt.col);
        if (lev && (lev.description || lev.name)) { lines.push(lev.name + (lev.description ? "\n" + lev.description : "")); needAck = true; }
      }
      // 撞子
      if (settings.enableBump && !token.inHome) {
        const fk2 = key(OUTER[token.outerIndex]);
        players.filter((o) => o !== pid).forEach((o) => {
          ps[o].tokens.forEach((ot) => {
            if (ot.started && !ot.inHome && !ot.finished) {
              const op = tokenPoint(o, ot);
              if (key(op) === fk2) {
                const ni2 = ps[o].tokens.indexOf(ot);
                ps[o].tokens[ni2] = freshToken(o, ni2);
                ps[o].homeCount++;
                lines.push(L("messages.bumpSuccess", { player: playerName(pid), opponent: playerName(o) }));
              }
            }
          });
        });
      }

      // 终点判定
      token.finished = token.inHome && f >= cfg.home.length - 1;
      state2.finishedCount = state2.tokens.filter((t) => t.finished).length;
      renderPieces();
      if (state2.tokens.every((t) => t.finished)) winPid = pid;
      else {
        const finalPt = token.inHome ? cfg.home[cfg.home.length - 1] : OUTER[token.outerIndex];
        const fk3 = key(finalPt);
        const landed = getEvent(finalPt.row, finalPt.col);
        if (token.finished) { /* 单棋子模式不会 */ }
        else if (landed && (landed.description || landed.name) && !FLIGHT_MAP[fk3]) {
          lines.push(landed.name + (landed.description ? "\n" + landed.description : "")); needAck = true;
        }
        if (token.resting) lines.push(playerName(pid) + " " + L("effects.rest.label"));
      }
      if (!silent) LG.recordDetailStat("ludoEvents");
    }

    history.unshift({ id: LG.uuid(), player: pid, dice: dice, text: lines.join("\n"), at: Date.now() });

    if (winPid) { finishWin(winPid); return; }

    const text = lines.filter(Boolean).join("\n");
    const extraTurn = dice === 6 && !token.resting;
    ui.msg = text;
    if (needAck) {
      ui.needAck = true;
      ui.ackAction = () => { if (extraTurn) keepTurn(pid); else nextPlayer(); };
      renderControl();
    } else {
      renderControl();
      await sleep(950);
      if (extraTurn) keepTurn(pid); else nextPlayer();
    }
  }

  function keepTurn(pid) {
    currentPlayer = pid; ui.msg = L("messages.rollAgain"); diceVal = null;
    renderPieces(); renderCapsules(); renderControl();
  }
  function nextPlayer() {
    const i = players.indexOf(currentPlayer);
    currentPlayer = players[(i + 1) % players.length];
    ui.msg = ""; diceVal = null;
    renderPieces(); renderCapsules(); renderControl();
  }

  function finishWin(pid) {
    LG.recordDetailStat("ludoWinner"); LG.incrementGameSession("ludo", 15);
    winner = pid; sound.play("win");
    renderPieces(); renderCapsules();
    const cfg = DCFG[P2D[pid]];
    const endEvent = getEvent(cfg.home[cfg.home.length - 1].row, cfg.home[cfg.home.length - 1].col);
    LG.openModal(`
      <div class="text-center">
        <div class="text-6xl mb-3">🏆</div>
        <h3 class="text-2xl font-black bg-gradient-to-r from-amber-200 to-rose-300 bg-clip-text text-transparent">${esc(L("messages.celebrationTitle"))}</h3>
        <p class="mt-2 text-white/80">${esc(L("messages.winnerReached", { player: playerBadge(pid), description: endEvent ? endEvent.description : "" }))}</p>
        <button id="win-restart" class="mt-5 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 px-7 py-3 font-bold text-white shadow-lg hover:scale-105 transition">🔄 ${esc(L("reset"))}</button>
      </div>`);
    document.getElementById("win-restart").onclick = () => {
      modalRoot.innerHTML = ""; resetGameState(); render();
    };
    renderControl();
  }

  /* ================= 设置 ================= */
  function toggleHtml(tg, on) {
    return `<button data-tg="${tg}" class="relative inline-flex h-7 w-12 items-center rounded-full transition ${on ? "bg-emerald-500" : "bg-white/15"}">
      <span class="inline-block h-5 w-5 transform rounded-full bg-white transition ${on ? "translate-x-6" : "translate-x-1"}"></span></button>`;
  }
  function openSettings() {
    const m = LG.openModal(`
      <h3 class="text-xl font-bold mb-5">⚙️ ${esc(L("options.title"))}</h3>
      <div class="space-y-6">
        <div>
          <p class="text-xs uppercase tracking-widest text-white/50 mb-2">${esc(L("options.playerMode.label"))}</p>
          <div class="grid grid-cols-3 gap-2">
            ${["two", "three", "four"].map((mo) => `
              <button data-mo="${mo}" class="rounded-xl border px-2 py-2.5 text-sm font-semibold transition ${settings.playerMode === mo ? "border-amber-400/70 bg-amber-400/15 text-amber-100" : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"}">${esc(L("options.playerMode." + mo))}</button>`).join("")}
          </div>
        </div>
        <div>
          <p class="text-xs uppercase tracking-widest text-white/50 mb-2">${esc(L("options.pieceCount.label"))}</p>
          <div class="grid grid-cols-4 gap-2">
            ${[1, 2, 3, 4].map((n) => `
              <button data-pc="${n}" class="rounded-xl border px-2 py-2.5 text-sm font-semibold transition ${settings.pieceCount === n ? "border-amber-400/70 bg-amber-400/15 text-amber-100" : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"}">${n}</button>`).join("")}
          </div>
        </div>
        <div class="flex items-center justify-between"><span class="text-sm text-white/80 pr-3">${esc(L("options.requireExactHomeEntry.label"))}</span>${toggleHtml("exact", settings.requireExactHomeEntry)}</div>
        <div class="flex items-center justify-between"><span class="text-sm text-white/80 pr-3">${esc(L("options.enableBump.label"))}</span>${toggleHtml("bump", settings.enableBump)}</div>
      </div>
      <div class="mt-7 text-right"><button id="set-close" class="rounded-full bg-white/10 px-6 py-2.5 text-sm font-semibold hover:bg-white/20 transition">${esc(L("library.close"))}</button></div>`);
    const el = m.el;
    el.querySelectorAll("[data-mo]").forEach((b) => b.onclick = () => {
      const mo = b.getAttribute("data-mo"); if (mo === settings.playerMode) return;
      settings.playerMode = mo; LG.saveJSON("lovegame-ludo-settings", settings);
      players = MODE_P[mo]; resetGameState(); render(); m.close();
    });
    el.querySelectorAll("[data-pc]").forEach((b) => b.onclick = () => {
      settings.pieceCount = Number(b.getAttribute("data-pc"));
      LG.saveJSON("lovegame-ludo-settings", settings);
      resetGameState(); render(); m.close();
    });
    el.querySelectorAll("[data-tg]").forEach((b) => b.onclick = () => {
      const k = b.getAttribute("data-tg");
      if (k === "exact") settings.requireExactHomeEntry = !settings.requireExactHomeEntry;
      else settings.enableBump = !settings.enableBump;
      LG.saveJSON("lovegame-ludo-settings", settings);
      m.close(); openSettings();
    });
    el.querySelector("#set-close").onclick = () => m.close();
  }

  /* ================= 事件编辑器 ================= */
  let editMode = false, boardBound = false;
  function openEditor() {
    editMode = !editMode;
    if (!boardBound) {
      document.getElementById("board").addEventListener("click", (e) => {
        if (!editMode) return;
        const cell = e.target.closest("[data-cell]"); if (!cell) return;
        const [r, c] = cell.getAttribute("data-cell").split("-").map(Number);
        openEditCell(r, c);
      }); boardBound = true;
    }
    if (editMode) LG.toast(L("editor.notice"), 4200);
    const b = document.getElementById("btn-edit");
    if (b) b.classList.toggle("bg-amber-400/25", editMode);
  }
  function openEditCell(r, c) {
    const k = `${r}-${c}`;
    const cur = getEvent(r, c) || { name: "", description: "" };
    const m = LG.openModal(`
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold">${esc(L("editor.title"))}</h3>
        <span class="rounded-full border border-amber-400/40 px-3 py-1 text-xs text-amber-200">${esc(L("editor.position", { coordinates: `${r + 1}, ${c + 1}` }))}</span>
      </div>
      <div class="space-y-4">
        <div><label class="text-xs uppercase tracking-widest text-white/50">${esc(L("editor.nameLabel"))}</label>
          <input id="ed-name" class="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm focus:border-amber-400/60 focus:outline-none" placeholder="${esc(L("editor.namePlaceholder"))}" value="${esc(cur.name || "")}"></div>
        <div><label class="text-xs uppercase tracking-widest text-white/50">${esc(L("editor.descriptionLabel"))}</label>
          <textarea id="ed-desc" rows="4" class="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm focus:border-amber-400/60 focus:outline-none" placeholder="${esc(L("editor.descriptionPlaceholder"))}">${esc(cur.description || "")}</textarea></div>
      </div>
      <div class="mt-6 flex justify-end gap-2">
        <button id="ed-cancel" class="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold hover:bg-white/20">${esc(L("editor.cancel"))}</button>
        <button id="ed-save" class="rounded-full bg-gradient-to-r from-amber-400 to-rose-500 px-6 py-2.5 text-sm font-bold hover:scale-105 transition">💾 ${esc(L("editor.save"))}</button>
      </div>`);
    m.el.querySelector("#ed-cancel").onclick = () => m.close();
    m.el.querySelector("#ed-save").onclick = () => {
      const name = m.el.querySelector("#ed-name").value.trim();
      const desc = m.el.querySelector("#ed-desc").value.trim();
      const ce = customEvents[settings.playerMode];
      if (!name && !desc) delete ce[k]; else ce[k] = { name: name, description: desc };
      LG.saveJSON("lovegame-ludo-custom-events", customEvents);
      rebuildEventTable(); renderBoard(); renderPieces();
      m.close(); LG.toast(L("editor.messages.saved"));
    };
  }

  /* ================= 事件库 ================= */
  function currentEventSnapshot() {
    const o = {}; Object.keys(eventTable).forEach((k) => { o[k] = { name: eventTable[k].name, description: eventTable[k].description }; });
    return o;
  }
  function openLibrary() {
    const renderList = () => {
      const card = (title, count, isActive, useId, extra) => `
        <div class="rounded-2xl border ${isActive ? "border-amber-400/60 bg-amber-400/10" : "border-white/10 bg-white/5"} p-3">
          <div class="flex items-center justify-between gap-2">
            <div><p class="text-sm font-bold">${title}</p><p class="text-[11px] text-white/50">${esc(L("library.stats", { count: count }))}</p></div>
            <div class="flex items-center gap-1.5">
              ${isActive ? `<span class="rounded-full bg-amber-400/20 px-2.5 py-1 text-[10px] font-bold text-amber-100">${esc(L("library.activeBadge"))}</span>`
                : `<button data-use="${useId}" class="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold hover:bg-white/20">${esc(L("library.use"))}</button>`}
              ${extra || ""}
            </div>
          </div>
        </div>`;
      let h = card(esc(L("library.defaultName")), Object.keys(defaultEvents(settings.playerMode)).length, activeLibrary === null, "__default");
      Object.keys(BUILTIN_LIBS).forEach((id) => {
        const b = BUILTIN_LIBS[id];
        h += card(esc(L(b.nameKey)), Object.keys(b.fn()).length, activeLibrary === id, id);
      });
      Object.keys(userLibraries).forEach((id) => {
        const lib = userLibraries[id];
        const extra = `<button data-rn="${id}" class="rounded-full bg-white/10 px-2.5 py-1.5 text-[11px] hover:bg-white/20" title="${esc(L("library.rename"))}">✏️</button>
          <button data-ov="${id}" class="rounded-full bg-white/10 px-2.5 py-1.5 text-[11px] hover:bg-white/20" title="${esc(L("library.overwrite"))}">⤴️</button>
          <button data-dl="${id}" class="rounded-full bg-white/10 px-2.5 py-1.5 text-[11px] hover:bg-rose-500/30" title="${esc(L("library.delete"))}">🗑</button>`;
        h += card(esc(lib.name), Object.keys(lib.events || {}).length, activeLibrary === id, id, extra);
      });
      return h;
    };
    const m = LG.openModal(`
      <div class="flex items-center justify-between mb-1">
        <h3 class="text-xl font-bold">📚 ${esc(L("library.title"))}</h3>
        <button id="lib-close" class="rounded-full bg-white/10 h-8 w-8 hover:bg-white/20">✕</button>
      </div>
      <p class="text-xs text-white/50 mb-4">${esc(L("library.subtitle"))} <span class="text-indigo-300">${esc(L("library.discordHint"))}</span></p>
      <div id="lib-list" class="space-y-2 max-h-[55vh] overflow-y-auto pr-1">${renderList()}</div>
      <div class="mt-4 rounded-2xl border border-dashed border-white/20 p-3">
        <p class="text-xs font-semibold text-white/70 mb-2">${esc(L("library.newLabel"))}</p>
        <div class="flex gap-2">
          <input id="lib-new-name" class="flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:border-amber-400/60" placeholder="${esc(L("library.namePlaceholder"))}">
          <button id="lib-save-new" class="rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 px-4 py-2 text-sm font-bold whitespace-nowrap">💾 ${esc(L("library.saveNew"))}</button>
        </div>
      </div>`, { maxW: "max-w-xl" });
    function refresh() { m.el.querySelector("#lib-list").innerHTML = renderList(); bind(); }
    function bind() {
      m.el.querySelectorAll("[data-use]").forEach((b) => b.onclick = () => {
        const id = b.getAttribute("data-use");
        activeLibrary = id === "__default" ? null : id;
        LG.saveJSON("lovegame-ludo-active-library", activeLibrary);
        rebuildEventTable(); render();
      });
      m.el.querySelectorAll("[data-dl]").forEach((b) => b.onclick = () => {
        const id = b.getAttribute("data-dl"); const name = userLibraries[id].name;
        delete userLibraries[id];
        if (activeLibrary === id) { activeLibrary = null; LG.saveJSON("lovegame-ludo-active-library", null); }
        LG.saveJSON("lovegame-ludo-libraries", userLibraries);
        LG.toast(L("library.deleteSuccess", { name: name })); refresh();
      });
      m.el.querySelectorAll("[data-rn]").forEach((b) => b.onclick = () => {
        const id = b.getAttribute("data-rn"); const lib = userLibraries[id];
        const nn = prompt(L("library.rename"), lib.name);
        if (nn && nn.trim()) { lib.name = nn.trim(); lib.updatedAt = Date.now(); LG.saveJSON("lovegame-ludo-libraries", userLibraries); refresh(); }
      });
      m.el.querySelectorAll("[data-ov]").forEach((b) => b.onclick = () => {
        const id = b.getAttribute("data-ov");
        userLibraries[id].events = currentEventSnapshot(); userLibraries[id].updatedAt = Date.now();
        LG.saveJSON("lovegame-ludo-libraries", userLibraries);
        LG.toast(L("library.overwriteSuccess", { name: userLibraries[id].name })); refresh();
      });
    }
    bind();
    m.el.querySelector("#lib-close").onclick = () => m.close();
    m.el.querySelector("#lib-save-new").onclick = () => {
      const inp = m.el.querySelector("#lib-new-name"); const name = inp.value.trim();
      if (!name) return LG.toast(L("library.nameRequired"));
      if (Object.values(userLibraries).some((l) => l.name === name)) return LG.toast(L("library.nameExists"));
      const id = LG.uuid();
      userLibraries[id] = { id: id, name: name, createdAt: Date.now(), updatedAt: Date.now(), events: currentEventSnapshot() };
      LG.saveJSON("lovegame-ludo-libraries", userLibraries);
      activeLibrary = id; LG.saveJSON("lovegame-ludo-active-library", id);
      rebuildEventTable(); render();
      LG.toast(L("library.saveSuccess", { name: name }));
      m.close();
    };
  }

  /* ================= 历史 ================= */
  function openHistory() {
    let items = history.map((h) => {
      const col = P_COL[h.player]; const d = new Date(h.at);
      const tm2 = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      return `
      <div class="rounded-xl border border-white/10 bg-white/5 p-3">
        <div class="flex items-center justify-between text-[11px] text-white/50 mb-1">
          <span class="inline-flex items-center gap-1.5 font-semibold ${col.txt}"><span class="h-1.5 w-1.5 rounded-full ${col.dot}"></span>${esc(playerBadge(h.player))} · 🎲${h.dice}</span><span>${tm2}</span>
        </div>
        <p class="whitespace-pre-line text-xs leading-5 text-white/80">${esc(h.text || "")}</p>
      </div>`;
    }).join("");
    if (!items) items = `<div class="text-center py-10"><p class="text-5xl mb-3">🎲</p>
      <p class="text-sm font-bold text-white/80">${esc(L("history.emptyTitle"))}</p>
      <p class="text-xs text-white/50 mt-1">${esc(L("history.emptySubtitle"))}</p></div>`;
    const m = LG.openModal(`
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold">🕘 ${esc(L("history.title"))}</h3>
        <button id="h-close" class="rounded-full bg-white/10 h-8 w-8 hover:bg-white/20">✕</button>
      </div>
      <p class="text-xs text-white/50 mb-3">${esc(L("history.subtitle"))}</p>
      <div class="space-y-2 max-h-[60vh] overflow-y-auto pr-1">${items}</div>`, { maxW: "max-w-xl" });
    m.el.querySelector("#h-close").onclick = () => m.close();
  }

  /* ================= JSON 面板 ================= */
  function openJson() {
    const snapshot = JSON.stringify({ settings: { pieceCount: settings.pieceCount, playerMode: settings.playerMode, requireExactHomeEntry: settings.requireExactHomeEntry, enableBump: settings.enableBump }, events: currentEventSnapshot() }, null, 2);
    const m = LG.openModal(`
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-xl font-bold">🔧 ${esc(L("json.title"))}</h3>
        <button id="j-close" class="rounded-full bg-white/10 h-8 w-8 hover:bg-white/20">✕</button>
      </div>
      <p class="text-xs text-white/50 mb-3">${esc(L("json.subtitle"))}</p>
      <textarea id="j-ta" rows="14" class="w-full rounded-xl border border-white/15 bg-black/50 p-3 font-mono text-[11px] leading-5 focus:border-amber-400/50 focus:outline-none" placeholder="${esc(L("json.placeholder"))}">${esc(snapshot)}</textarea>
      <div class="mt-4 flex flex-wrap gap-2 justify-end">
        <label class="cursor-pointer rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10">📥 ${esc(L("json.importFileButton"))}<input id="j-file" type="file" accept=".txt,.json" class="hidden"></label>
        <button id="j-apply" class="rounded-xl border border-emerald-400/40 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-500/25">✅ ${esc(L("json.import"))}</button>
        <button id="j-export" class="rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 px-4 py-2 text-sm font-bold">📤 ${esc(L("json.exportFileButton"))}</button>
      </div>`, { maxW: "max-w-2xl" });
    const ta = m.el.querySelector("#j-ta");
    m.el.querySelector("#j-close").onclick = () => m.close();
    m.el.querySelector("#j-export").onclick = () => {
      const blob = new Blob([ta.value], { type: "text/plain;charset=utf-8" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "lovegame.txt"; a.click();
      URL.revokeObjectURL(a.href); LG.toast(L("editor.messages.exportSuccess"));
    };
    function applyJson(text) {
      try {
        const data = JSON.parse(text);
        if (data.settings) {
          Object.assign(settings, data.settings);
          settings.pieceCount = Math.max(1, Math.min(4, settings.pieceCount || 1));
          LG.saveJSON("lovegame-ludo-settings", settings);
          players = MODE_P[settings.playerMode];
        }
        if (data.events) {
          customEvents[settings.playerMode] = {};
          Object.keys(data.events).forEach((k) => { const e = data.events[k]; customEvents[settings.playerMode][k] = { name: e.name || "", description: e.description || "" }; });
          LG.saveJSON("lovegame-ludo-custom-events", customEvents);
        }
        resetGameState(); render(); m.close(); LG.toast(L("editor.messages.importSuccess"));
      } catch (err) { LG.toast(L("editor.errors.invalidFormat")); }
    }
    m.el.querySelector("#j-apply").onclick = () => applyJson(ta.value);
    m.el.querySelector("#j-file").addEventListener("change", (e) => {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader(); r.onload = () => { ta.value = r.result; applyJson(r.result); }; r.readAsText(f);
    });
  }

  /* ================= 初始化 ================= */
  resetGameState();
  shell();
  render();
  document.getElementById("btn-edit").onclick = openEditor;
  document.getElementById("btn-library").onclick = openLibrary;
  document.getElementById("btn-rules").onclick = openSettings;
  document.getElementById("btn-history").onclick = openHistory;
  document.getElementById("btn-json").onclick = openJson;
})();
