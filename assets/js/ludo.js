/* ============================================================
 * 情侣飞行棋 (Couple Ludo) - 完整功能复刻引擎
 * 包含：响应式棋盘自适应、顺时针行进箭头、近道飞行、
 * 沉浸式事件大弹窗与智能倒计时器(Timer)、未起飞前戏互动(Pre-start Actions)、
 * 8大主题事件库一键切换、格子悬停Tooltip、AI事件Prompt生成器、
 * JSON导入导出、规则自定义(背景图/撞子/刚好进入/起飞点数)
 * ============================================================ */
(function () {
  "use strict";

  const LG = window.LG;
  const M = window.MESSAGES;
  const L = (k, p) => window.t ? window.t("games.ludo." + k, p) : k;
  const sleep = LG.sleep;
  const sound = LG.sound;
  const esc = LG.escapeHtml;

  const root = document.getElementById("ludo-root");
  const modalRoot = document.getElementById("ludo-modal-root") || document.body;

  /* ================= 棋盘几何与轨道定义 (13x13) ================= */
  const N = 13;
  const DIRS = ["north", "east", "south", "west"];
  const rot = (p) => ({ row: p.col, col: N - 1 - p.row });
  const rotN = (p, n) => {
    let r = { row: p.row, col: p.col };
    for (let i = 0; i < n; i++) r = rot(r);
    return r;
  };
  const PAIR = (a) => a.map(([row, col]) => ({ row, col }));

  // 北方外圈与跑道基准点
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

  const PATHS = {};
  const HOMES = {};
  DIRS.forEach((d, i) => {
    PATHS[d] = BASE.map((p) => rotN(p, i));
    HOMES[d] = BASE_HOME.map((p) => rotN(p, i));
  });

  const key = (p) => `${p.row}-${p.col}`;
  const ENTRY = { north: "0-6", east: "6-12", south: "12-6", west: "6-0" };
  const WAIT = {
    north: { row: 1, col: 1 },
    east: { row: 1, col: 11 },
    south: { row: 11, col: 11 },
    west: { row: 11, col: 1 }
  };

  const HOME_KEYS = new Set(DIRS.flatMap((d) => HOMES[d].map(key)));
  const OUTER = PATHS.north.filter((p) => {
    const k = key(p);
    return !HOME_KEYS.has(k) && k !== "6-6";
  });
  const OUTER_IDX = new Map();
  OUTER.forEach((p, i) => OUTER_IDX.set(key(p), i));

  // 顺时针行进箭头：根据当前外环格子与下一个外环格子的相对向量计算
  const ARROWS = {};
  OUTER.forEach((p, i) => {
    const nextP = OUTER[(i + 1) % OUTER.length];
    const dr = nextP.row - p.row;
    const dc = nextP.col - p.col;
    let arrow = "→";
    if (dr > 0) arrow = "↓";
    else if (dr < 0) arrow = "↑";
    else if (dc > 0) arrow = "→";
    else if (dc < 0) arrow = "←";
    ARROWS[key(p)] = arrow;
  });
  // 回家路径箭头
  DIRS.forEach((d) => {
    HOMES[d].forEach((p, i) => {
      if (i < HOMES[d].length - 1) {
        const nextP = HOMES[d][i + 1];
        const dr = nextP.row - p.row;
        const dc = nextP.col - p.col;
        let arrow = "→";
        if (dr > 0) arrow = "↓";
        else if (dr < 0) arrow = "↑";
        else if (dc > 0) arrow = "→";
        else if (dc < 0) arrow = "←";
        ARROWS[key(p)] = arrow;
      }
    });
  });

  const DCFG = {};
  DIRS.forEach((d) => {
    DCFG[d] = {
      home: HOMES[d],
      homeKeys: new Set(HOMES[d].map(key)),
      entryKey: ENTRY[d],
      entryIndex: OUTER_IDX.get(ENTRY[d]) ?? 0,
      wait: WAIT[d],
      startIndex: OUTER_IDX.get(key(PATHS[d][0])) ?? 0,
    };
  });

  /* ================= 玩家与视觉配置 ================= */
  const P2D = { male: "north", female: "south", red: "north", yellow: "south", blue: "west", green: "east" };
  const MODE_DIR = { two: ["north", "south"], three: ["north", "south", "west"], four: DIRS };
  const MODE_P = { two: ["male", "female"], three: ["red", "blue", "yellow"], four: ["red", "yellow", "blue", "green"] };

  const P_COL = {
    male: {
      grad: "bg-gradient-to-br from-violet-500 to-indigo-700 text-white",
      ring: "ring-violet-400 shadow-[0_0_14px_rgba(139,92,246,0.6)]",
      sym: "♂",
      txt: "text-violet-300",
      dot: "bg-violet-400",
      pill: "border-violet-400/70 bg-violet-500/20 text-violet-100 shadow-[0_0_12px_rgba(139,92,246,0.4)]"
    },
    female: {
      grad: "bg-gradient-to-br from-rose-500 to-pink-700 text-white",
      ring: "ring-rose-400 shadow-[0_0_14px_rgba(244,63,94,0.6)]",
      sym: "♀",
      txt: "text-rose-300",
      dot: "bg-rose-400",
      pill: "border-rose-400/70 bg-rose-500/20 text-rose-100 shadow-[0_0_12px_rgba(244,63,94,0.4)]"
    },
    red: {
      grad: "bg-gradient-to-br from-red-500 to-rose-700 text-white",
      ring: "ring-red-400 shadow-[0_0_14px_rgba(239,68,68,0.6)]",
      sym: "R",
      txt: "text-red-300",
      dot: "bg-red-400",
      pill: "border-red-400/70 bg-red-500/20 text-red-100"
    },
    yellow: {
      grad: "bg-gradient-to-br from-amber-400 to-amber-600 text-white",
      ring: "ring-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.6)]",
      sym: "Y",
      txt: "text-amber-300",
      dot: "bg-amber-400",
      pill: "border-amber-400/70 bg-amber-400/20 text-amber-100"
    },
    blue: {
      grad: "bg-gradient-to-br from-sky-500 to-blue-700 text-white",
      ring: "ring-sky-400 shadow-[0_0_14px_rgba(14,165,233,0.6)]",
      sym: "B",
      txt: "text-sky-300",
      dot: "bg-sky-400",
      pill: "border-sky-400/70 bg-sky-500/20 text-sky-100"
    },
    green: {
      grad: "bg-gradient-to-br from-emerald-500 to-teal-700 text-white",
      ring: "ring-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.6)]",
      sym: "G",
      txt: "text-emerald-300",
      dot: "bg-emerald-400",
      pill: "border-emerald-400/70 bg-emerald-500/20 text-emerald-100"
    },
  };

  const D_CELL2 = {
    north: "bg-gradient-to-br from-violet-500/20 to-indigo-900/40 border-violet-400/40 text-violet-200 hover:border-violet-300",
    south: "bg-gradient-to-br from-rose-500/20 to-pink-900/40 border-rose-400/40 text-rose-200 hover:border-rose-300",
    east: "bg-gradient-to-br from-emerald-500/20 to-teal-900/40 border-emerald-400/40 text-emerald-200 hover:border-emerald-300",
    west: "bg-gradient-to-br from-sky-500/20 to-blue-900/40 border-sky-400/40 text-sky-200 hover:border-sky-300",
  };
  const D_CELL4 = {
    north: "bg-gradient-to-br from-red-500/20 to-rose-900/40 border-red-400/40 text-red-200",
    south: "bg-gradient-to-br from-amber-500/20 to-amber-900/40 border-amber-400/40 text-amber-200",
    east: "bg-gradient-to-br from-emerald-500/20 to-teal-900/40 border-emerald-400/40 text-emerald-200",
    west: "bg-gradient-to-br from-sky-500/20 to-blue-900/40 border-sky-400/40 text-sky-200",
  };

  /* ================= 捷径航线 (近道) ================= */
  const FLIGHTS = [
    { launch: "9-9", target: "3-9", dir: "north", label: "飞行航线 (北向)" },
    { launch: "3-9", target: "3-3", dir: "west", label: "飞行航线 (西向)" },
    { launch: "3-3", target: "9-3", dir: "south", label: "飞行航线 (南向)" },
    { launch: "9-3", target: "9-9", dir: "east", label: "飞行航线 (东向)" },
  ];
  const FLIGHT_MAP = {};
  FLIGHTS.forEach((f) => { FLIGHT_MAP[f.launch] = f; });

  /* ================= 内置 8 大主题事件库 ================= */
  const LD = M ? M.games.ludo : {};
  function defaultEvents(mode) {
    if (mode === "three" && LD.eventsThree) return LD.eventsThree;
    if (mode === "four" && LD.eventsFour) return LD.eventsFour;
    return LD.events || {};
  }

  const BUILTIN_LIBS = {
    __private: { nameKey: "library.privateName", defaultName: "私密事件库", fn: () => LD.privateEvents || {} },
    __funny: { nameKey: "library.funnyName", defaultName: "搞笑版", fn: () => LD.funnyEvents || {} },
    __long: { nameKey: "library.longDistanceName", defaultName: "异地恋版", fn: () => LD.longDistanceEvents || {} },
    __drunk: { nameKey: "library.drunkName", defaultName: "酒后乱性", fn: () => LD.drunkEvents || {} },
    __intense: { nameKey: "library.intenseName", defaultName: "重度调教", fn: () => LD.intenseEvents || {} },
    __fitness: { nameKey: "library.fitnessName", defaultName: "双人健身", fn: () => LD.fitnessEvents || {} },
    __fourPrivate: { nameKey: "library.fourPrivateName", defaultName: "四人私密库", fn: () => LD.fourPrivateEvents || {} },
  };

  let customEvents = LG.loadJSON("lovegame-ludo-custom-events", { two: {}, three: {}, four: {} });
  ["two", "three", "four"].forEach((m) => { customEvents[m] = customEvents[m] || {}; });
  let activeLibrary = LG.loadJSON("lovegame-ludo-active-library", null);
  let userLibraries = LG.loadJSON("lovegame-ludo-libraries", {});

  function baseEventTable() {
    if (activeLibrary && BUILTIN_LIBS[activeLibrary]) return BUILTIN_LIBS[activeLibrary].fn();
    if (activeLibrary && userLibraries[activeLibrary]) return userLibraries[activeLibrary].events || {};
    return defaultEvents(settings.playerMode);
  }

  let eventTable = {};
  function rebuildEventTable() {
    const base = baseEventTable();
    eventTable = {};
    Object.keys(base).forEach((k) => {
      eventTable[k] = { name: base[k].name, description: base[k].description || "" };
    });
    const ce = customEvents[settings.playerMode] || {};
    Object.keys(ce).forEach((k) => {
      eventTable[k] = { name: ce[k].name, description: ce[k].description || "" };
    });
  }
  function getEvent(r, c) { return eventTable[`${r}-${c}`] || null; }

  /* ================= 特殊效果 (前进/后退/休息) ================= */
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
          attempt.push(k);
          if (attempt.length === count) break;
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
    const counts = { forward2: 3, backward2: 5, rest: 6 };
    ["forward2", "backward2", "rest"].forEach((eff) => {
      pickSpread(candidates, counts[eff], used).forEach((k) => {
        tileEffects[k] = eff;
        used.add(k);
      });
    });
  }
  function getEffect(r, c) { return tileEffects[`${r}-${c}`] || null; }

  /* ================= 游戏设置与持久化 ================= */
  let settings = Object.assign(
    {
      playerMode: "two",
      pieceCount: 1,
      requireExactHomeEntry: false,
      enableBump: false,
      easyStart: false, // 是否掷出 5 或 6 均可起飞
      boardBg: "", // 棋盘自定义背景
    },
    LG.loadJSON("lovegame-ludo-settings", {})
  );
  settings.pieceCount = Math.max(1, Math.min(4, settings.pieceCount || 1));

  let players = MODE_P[settings.playerMode];
  let ps = {};
  let currentPlayer = players[0];
  let winner = null;
  let rolling = false;
  let preStartRolls = 0;
  let rollCounts = {};
  let hasSix = {};
  let history = [];
  let diceVal = null;
  let selectState = null;
  let ui = { msg: "", needAck: false, ackAction: null };

  function freshToken(pid, i) {
    return {
      id: `${pid}-token-${i}`,
      started: false,
      outerIndex: -1,
      inHome: false,
      homeIndex: -1,
      resting: false,
      finished: false
    };
  }
  function freshPlayerState(pid, n) {
    return {
      tokens: Array.from({ length: n }, (_, i) => freshToken(pid, i)),
      homeCount: n,
      finishedCount: 0
    };
  }

  function resetGameState() {
    ps = {};
    players.forEach((p) => { ps[p] = freshPlayerState(p, settings.pieceCount); });
    currentPlayer = players[0];
    winner = null;
    rolling = false;
    preStartRolls = 0;
    rollCounts = {};
    hasSix = {};
    history = [];
    diceVal = null;
    selectState = null;
    ui = { msg: "", needAck: false, ackAction: null };
    assignTileEffects();
    rebuildEventTable();
  }

  /* 等待区基地槽位 */
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

  /* ================= 移动能力判定 ================= */
  function canStartDice(dice) {
    return settings.easyStart ? (dice === 5 || dice === 6) : dice === 6;
  }
  function outerDist(from, to) {
    if (from < 0) return -1;
    const L2 = OUTER.length;
    const f = ((from % L2) + L2) % L2, t2 = ((to % L2) + L2) % L2;
    return f === t2 ? 0 : (t2 - f + L2) % L2;
  }
  function tokenAbility(t, dice, pid) {
    const cfg = DCFG[P2D[pid]], home = cfg.home;
    if (!t.started) return { canStart: canStartDice(dice), canMove: false };
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

  /* ================= 移动序列与动画 ================= */
  function outerSeq(cur, steps, dir) {
    const o = [];
    if (steps <= 0) return { seq: o, final: cur };
    const L2 = OUTER.length;
    let s = ((cur % L2) + L2) % L2;
    for (let i = 0; i < steps; i++) {
      s = (s + dir + L2) % L2;
      o.push(s);
    }
    return { seq: o, final: s };
  }
  function homeSeq(pid, cur, steps, dir) {
    const o = [];
    if (steps <= 0) return { seq: o, final: cur };
    const hp = DCFG[P2D[pid]].home;
    const s2 = hp.length - 1;
    let n = Math.min(cur, s2);
    if (n < -1) n = -1;
    let a = dir;
    for (let i = 0; i < steps; i++) {
      let e = n + a;
      if (e > s2) {
        const t = e - s2; a = -1; e = s2 - t; if (e < 0) e = 0;
      } else if (e < 0) {
        a = 1; e = -e; if (e > s2) e = s2;
      }
      o.push(e);
      n = e;
    }
    return { seq: o, final: n };
  }
  async function animateToken(pid, tokenId, kind, seq, speed) {
    const state2 = ps[pid];
    const ci = state2.tokens.findIndex((t) => t.id === tokenId);
    for (const idx of seq) {
      if (kind === "outer") state2.tokens[ci].outerIndex = idx;
      else state2.tokens[ci].homeIndex = idx;
      renderPieces();
      sound.play("move");
      await sleep(speed || 240);
    }
  }

  /* ================= 辅助函数与国际化 ================= */
  function playerName(pid) {
    return (LD.players && LD.players[pid] && LD.players[pid].short) || pid;
  }
  function playerBadge(pid) {
    return (LD.players && LD.players[pid] && LD.players[pid].badge) || playerName(pid);
  }

  /* ================= 布局模式与动态尺寸计算 ================= */
  // 布局模式支持 'auto' (自动适配) | 'desktop' (电脑布局) | 'tablet' (平板双栏) | 'mobile' (手机紧凑)
  let userLayoutMode = LG.loadJSON("lovegame-ludo-layout-mode", "auto");

  function getEffectiveLayoutMode() {
    if (userLayoutMode === "desktop") return "desktop";
    if (userLayoutMode === "tablet") return "tablet";
    if (userLayoutMode === "mobile") return "mobile";
    // 自动适配检测：
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isLandscape = w > h;
    // 宽屏桌面端大屏
    if (w >= 1024) {
      return "desktop";
    }
    // 平板设备 (包括 iPad 768px~834px、华为平板 800px、以及各类平板横屏)
    if (w >= 700 || (isLandscape && w >= 600 && h >= 460)) {
      return "tablet";
    }
    return "mobile";
  }

  function getDeviceHintText() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isLandscape = w > h;
    const eff = getEffectiveLayoutMode();

    let dev = "手机端";
    if (w >= 1024) dev = "电脑 / 大屏";
    else if (w >= 700 || (isLandscape && w >= 600)) dev = "平板 / 横屏";
    else dev = "手机端";

    const layoutName = eff === "desktop" ? "电脑全屏" : eff === "tablet" ? "平板双栏" : "紧凑竖屏";
    return `${dev} · ${layoutName}`;
  }

  let CELL = 46;
  let currentSidebarW = 280;

  function updateCellSize() {
    const eff = getEffectiveLayoutMode();
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    let targetBoardSize;
    if (eff === "desktop" || eff === "tablet") {
      // 电脑与平板布局：【#board】在左边，设置和骰子在右边，页面内最大化棋盘尺寸
      // 允许改变【#control-card】与【#settings-card】的尺寸：根据屏幕可用空间动态计算侧边栏宽度
      if (winW >= 1500) {
        currentSidebarW = 320;
      } else if (winW >= 1200) {
        currentSidebarW = 280;
      } else if (winW >= 960) {
        currentSidebarW = 260;
      } else if (winW >= 768) {
        currentSidebarW = 240;
      } else {
        currentSidebarW = 210;
      }

      // 可用水平宽度：总宽减去右侧侧边栏、间隙 (12~16px) 与页面左右内边距 (16~32px)
      const gapAndPad = winW >= 1200 ? 52 : winW >= 768 ? 36 : 24;
      const availW = Math.max(240, winW - currentSidebarW - gapAndPad);

      // 可用垂直高度：视口高度减去顶部紧凑栏与安全边距
      const topOffset = winH >= 800 ? 80 : 70;
      const availH = Math.max(240, winH - topOffset);

      // 棋盘为正方形，尺寸严格取水平与垂直可用空间的较小值，以保证一屏内最大化展现且无纵向滚动
      targetBoardSize = Math.min(availW, availH);

      // 棋盘总宽 = 13 * CELL + 12 * 2px(gap) + 8px(padding) = 13 * CELL + 32px
      const sz = Math.floor((targetBoardSize - 32) / N);

      // 突破限制：允许 CELL 最大扩展至 84px（电脑大屏）/ 64px（平板），最小为 20px
      if (eff === "desktop") {
        CELL = Math.max(20, Math.min(84, sz));
      } else {
        CELL = Math.max(20, Math.min(64, sz));
      }
    } else {
      currentSidebarW = 0;
      const availW = Math.min(winW - 16, 520);
      const availH = winH > 520 ? winH - 250 : winH - 90;
      targetBoardSize = Math.max(250, Math.min(availW, availH, 500));
      const sz = Math.floor((targetBoardSize - 32) / N);
      CELL = Math.max(20, Math.min(38, sz));
    }
  }

  /* ================= 布局模式切换条 ================= */
  function layoutSwitchBar() {
    const mode = userLayoutMode;
    const eff = getEffectiveLayoutMode();

    const btn = (val, icon, label) => {
      const active = mode === val;
      return `
        <button data-layout-mode="${val}" class="relative px-2 sm:px-2.5 py-1 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1 whitespace-nowrap ${
          active
            ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-[0_4px_16px_rgba(244,63,94,0.4)] scale-100 ring-1 ring-white/30"
            : "text-white/60 hover:text-white hover:bg-white/10"
        }">
          <span>${icon}</span>
          <span>${label}</span>
          ${val === "auto" ? `<span class="hidden sm:inline-block text-[10px] opacity-75 font-normal">(${eff === "desktop" ? "电脑" : eff === "tablet" ? "平板" : "手机"})</span>` : ""}
        </button>`;
    };

    return `
    <div id="layout-switch-bar" class="flex flex-wrap items-center justify-center gap-1 px-2 py-1 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md shadow-lg select-none">
      <div class="hidden xl:flex items-center gap-1.5 text-xs text-white/70 mr-1">
        <span class="text-sm">📐</span>
        <span class="text-[11px] font-mono text-pink-300 bg-pink-500/10 border border-pink-500/25 px-2 py-0.5 rounded-full">${getDeviceHintText()}</span>
      </div>
      <div class="inline-flex flex-wrap justify-center p-0.5 rounded-xl bg-white/5 border border-white/10 gap-0.5 select-none">
        ${btn("auto", "🔄", "自动适配")}
        ${btn("desktop", "💻", "电脑布局")}
        ${btn("tablet", "📟", "平板双栏")}
        ${btn("mobile", "📱", "手机紧凑")}
      </div>
    </div>`;
  }

  /* ================= 主体框架渲染 ================= */
  function shell() {
    boardBound = false;
    const eff = getEffectiveLayoutMode();
    const isSideBySide = eff === "desktop" || eff === "tablet";

    if (isSideBySide) {
      root.innerHTML = `
        <!-- 电脑/平板顶部紧凑栏：标题与切换按钮并列，最大限度留出垂直空间给棋盘 -->
        <header id="ludo-top-bar" class="w-full flex flex-col sm:flex-row items-center justify-between gap-2 px-1 py-0.5 select-none">
          <div class="flex items-center gap-2.5">
            <h1 class="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-pink-300 via-rose-200 to-fuchsia-300 bg-clip-text text-transparent drop-shadow-md">${esc(L("title"))}</h1>
            <span class="text-[11px] text-white/50 hidden md:inline-block">${esc(L("tagline"))}</span>
          </div>
          ${layoutSwitchBar()}
        </header>

        <!-- 主游戏区域：【#board】在左边，设置和骰子在右边 -->
        <div id="game-main-area" class="ludo-side-by-side w-full flex flex-row items-start justify-center gap-3 sm:gap-4 lg:gap-5 mt-1" style="--ludo-sidebar-w: ${currentSidebarW}px;">
          
          <!-- 左侧：棋盘主体区域 (尺寸最大化) -->
          <div id="board-column" class="flex flex-col items-center justify-center shrink-0">
            <div id="board-container" class="relative flex justify-center items-center">
              <div id="board-wrap" class="relative rounded-2xl overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.6)] border border-white/15 bg-black/60 backdrop-blur-xl">
                ${settings.boardBg ? `<div class="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none" style="background-image:url('${esc(settings.boardBg)}')"></div>` : ""}
                <div id="board" class="relative z-10 grid gap-0.5 p-1 select-none"></div>
                <div id="piece-layer" class="absolute inset-0 pointer-events-none z-20"></div>
              </div>
            </div>
          </div>

          <!-- 右侧：控制卡片与设置卡片 (尺寸随屏幕自适应缩放) -->
          <div id="control-column" class="flex flex-col gap-2 shrink-0 select-none" style="width: ${currentSidebarW}px; min-width: ${currentSidebarW}px; max-width: ${currentSidebarW}px;">
            <!-- 玩家指示胶囊 -->
            <div id="player-capsules" class="flex flex-wrap items-center justify-start gap-1.5 select-none"></div>
            
            <!-- 骰子与行动卡片 -->
            ${controlCard()}
            
            <!-- 设置与工具卡片 -->
            ${sidebarSettingsCard()}
            
            <!-- 贴心小提示 -->
            ${tabletTipsCard()}
          </div>
        </div>

        <!-- 悬停与触摸点击 Tooltip 浮窗 -->
        <div id="cell-tooltip" class="fixed z-50 hidden max-w-xs rounded-2xl border border-white/20 bg-black/95 p-3.5 text-white shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-md transition-opacity duration-150">
          <div class="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5 mb-1.5">
            <div class="flex items-center gap-1.5">
              <span id="tt-coord" class="text-[10px] uppercase tracking-wider text-pink-300 font-mono font-bold"></span>
              <span id="tt-type" class="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/70">格讯</span>
            </div>
            <button id="tt-close-btn" class="text-white/40 hover:text-white text-xs px-1">✕</button>
          </div>
          <div id="tt-title" class="text-sm font-bold text-white mt-0.5"></div>
          <div id="tt-desc" class="text-xs text-white/75 mt-1 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto"></div>
          <div id="tt-eff" class="mt-2 inline-block rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-amber-200"></div>
        </div>
      `;
    } else {
      // 手机竖屏紧凑单栏布局
      root.innerHTML = `
        <header class="w-full text-center space-y-1.5 select-none">
          <h1 class="text-2xl font-black tracking-tight bg-gradient-to-r from-pink-300 via-rose-200 to-fuchsia-300 bg-clip-text text-transparent drop-shadow-md">${esc(L("title"))}</h1>
          <p class="text-xs text-white/70 max-w-xl mx-auto leading-relaxed">${esc(L("tagline"))}</p>
        </header>

        ${layoutSwitchBar()}

        <div id="game-main-area" class="w-full max-w-md flex flex-col items-center gap-3.5">
          <div id="player-capsules" class="flex flex-wrap items-center justify-center gap-2 select-none"></div>
          
          <div id="board-container" class="relative w-full flex justify-center">
            <div id="board-wrap" class="relative rounded-2xl overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.6)] border border-white/15 bg-black/60 backdrop-blur-xl">
              ${settings.boardBg ? `<div class="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none" style="background-image:url('${esc(settings.boardBg)}')"></div>` : ""}
              <div id="board" class="relative z-10 grid gap-0.5 p-1 select-none"></div>
              <div id="piece-layer" class="absolute inset-0 pointer-events-none z-20"></div>
            </div>
          </div>

          <div id="control-column" class="w-full flex flex-col items-center gap-2.5">
            ${controlCard()}
            ${sidebarSettingsCard()}
          </div>
        </div>

        <div id="cell-tooltip" class="fixed z-50 hidden max-w-xs rounded-2xl border border-white/20 bg-black/95 p-3.5 text-white shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-md transition-opacity duration-150">
          <div class="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5 mb-1.5">
            <div class="flex items-center gap-1.5">
              <span id="tt-coord" class="text-[10px] uppercase tracking-wider text-pink-300 font-mono font-bold"></span>
              <span id="tt-type" class="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/70">格讯</span>
            </div>
            <button id="tt-close-btn" class="text-white/40 hover:text-white text-xs px-1">✕</button>
          </div>
          <div id="tt-title" class="text-sm font-bold text-white mt-0.5"></div>
          <div id="tt-desc" class="text-xs text-white/75 mt-1 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto"></div>
          <div id="tt-eff" class="mt-2 inline-block rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-amber-200"></div>
        </div>
      `;
    }
  }

  function tabletTipsCard() {
    return `
      <div class="hidden xl:block rounded-xl border border-white/10 bg-white/5 p-2 text-xs text-white/70 space-y-0.5 backdrop-blur shadow-md select-none">
        <div class="flex items-center gap-1.5 font-bold text-pink-300 text-[11px]">
          <span>💡</span><span>快捷提示</span>
        </div>
        <p class="leading-relaxed text-[10px] text-white/60">• 棋盘已自适应最大化展现，轻触任意格子可随时查看事件详情。</p>
        <p class="leading-relaxed text-[10px] text-white/60">• 右侧一站式集中控制掷骰与规则设置。</p>
      </div>`;
  }

  function sidebarSettingsCard() {
    const btn = (id, icon, txt, highlight) =>
      `<button id="${id}" class="inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-xl border ${
        highlight 
          ? "border-amber-400/40 bg-amber-500/20 text-amber-200" 
          : "border-white/10 bg-white/5 text-white/80"
      } px-2 sm:px-2.5 py-1.5 text-xs font-semibold hover:bg-white/15 transition active:scale-95 shadow-sm">
        <span class="text-xs sm:text-sm">${icon}</span><span class="truncate">${esc(txt)}</span>
      </button>`;

    return `
    <div id="settings-card" class="w-full rounded-2xl border border-white/10 bg-black/40 p-2.5 sm:p-3 backdrop-blur-md shadow-lg space-y-1.5 sm:space-y-2">
      <div class="flex items-center justify-between px-1 text-xs font-bold text-white/70">
        <span class="flex items-center gap-1.5"><span class="text-xs sm:text-sm">⚙️</span><span>游戏设置与工具</span></span>
        <span class="text-[10px] text-pink-300 font-mono">自定义选项</span>
      </div>
      <div class="grid grid-cols-2 gap-1.5">
        ${btn("btn-rules", "⚙️", L("options.title"))}
        ${btn("btn-library", "📚", L("buttons.openLibrary"))}
        ${btn("btn-ai-prompt", "🤖", L("buttons.aiGenerateEvents") || "AI生成", true)}
        ${btn("btn-edit", "✏️", L("buttons.enterEdit"))}
        ${btn("btn-history", "🕘", L("history.title"))}
        ${btn("btn-json", "🔧", L("buttons.openJson"))}
      </div>
      <div class="pt-0.5">
        <button id="btn-reset" class="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-500/20 transition active:scale-95 shadow-sm">
          <span>🔄</span><span>${esc(L("buttons.reset"))}</span>
        </button>
      </div>
    </div>`;
  }

  function controlCard() {
    return `
    <div id="control-card" class="w-full rounded-2xl border border-white/15 bg-gradient-to-b from-[#190a24]/95 to-[#0e0417]/95 p-3 sm:p-3.5 text-center shadow-[0_16px_50px_rgba(244,114,182,0.22)] backdrop-blur">
      <div id="turn-label" class="text-xs sm:text-sm font-bold tracking-wide text-white/90"></div>
      <div id="dice-area" class="my-2 flex items-center justify-center min-h-[58px]"></div>
      <div id="roll-btn-wrap" class="min-h-[38px] flex items-center justify-center"></div>
      <div id="event-msg" class="mt-1.5 text-xs text-pink-200/90 whitespace-pre-line leading-relaxed min-h-[1.25rem] max-h-24 overflow-y-auto"></div>
      <div id="ack-btn-wrap" class="mt-1.5"></div>
    </div>`;
  }

  /* ================= 棋盘渲染 ================= */
  function renderBoard() {
    updateCellSize();
    const board = document.getElementById("board");
    if (!board) return;
    board.style.gridTemplateColumns = `repeat(${N}, ${CELL}px)`;

    const gameArea = document.getElementById("game-main-area");
    if (gameArea) {
      gameArea.style.setProperty("--ludo-sidebar-w", `${currentSidebarW}px`);
    }
    const ctrlCol = document.getElementById("control-column");
    const eff = getEffectiveLayoutMode();
    if (ctrlCol && (eff === "desktop" || eff === "tablet")) {
      ctrlCol.style.width = `${currentSidebarW}px`;
      ctrlCol.style.minWidth = `${currentSidebarW}px`;
      ctrlCol.style.maxWidth = `${currentSidebarW}px`;
    }

    const activeDirs = new Set(MODE_DIR[settings.playerMode]);
    const dCell = settings.playerMode === "two" ? D_CELL2 : D_CELL4;

    let html = "";
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const k = `${r}-${c}`;
        const ori = DIRS.filter((d) => {
          return PATHS[d].some((p) => key(p) === k) && activeDirs.has(d);
        });

        const isOuter = OUTER_IDX.has(k);
        const homeOri = ori.filter((d) => DCFG[d].homeKeys.has(k));
        const pathOri = ori.filter((d) => !DCFG[d].homeKeys.has(k));
        const isCenter = r === 6 && c === 6;

        let cls = `relative flex flex-col items-center justify-center rounded-lg border transition-all duration-150 select-none overflow-hidden `;
        cls += `w-[${CELL}px] h-[${CELL}px] `;

        // 角落与基地识别
        let isWaitSlot = false;
        DIRS.forEach((d) => {
          if (activeDirs.has(d)) {
            const w = DCFG[d].wait;
            if (Math.abs(r - w.row) <= 1 && Math.abs(c - w.col) <= 1) isWaitSlot = true;
          }
        });

        if (isCenter) {
          cls += "bg-gradient-to-br from-amber-400 via-rose-500 to-fuchsia-600 border-amber-300 text-white shadow-[0_0_20px_rgba(245,158,11,0.7)] font-black ";
        } else if (pathOri.length > 1 || (pathOri.length && homeOri.length)) {
          cls += "bg-gradient-to-br from-fuchsia-500/40 to-rose-600/40 border-rose-400/70 text-white shadow-[0_0_10px_rgba(244,63,94,0.4)] ";
        } else if (ori.length === 1) {
          cls += dCell[ori[0]] + " ";
        } else if (isWaitSlot) {
          cls += "bg-white/5 border-dashed border-white/20 text-white/30 ";
        } else {
          cls += "bg-black/20 border-white/5 text-white/20 ";
        }

        // 捷径发射点特色微光
        if (FLIGHT_MAP[k]) {
          cls += " ring-1 ring-pink-400/60 shadow-[0_0_12px_rgba(236,72,153,0.5)] ";
        }

        // 内部元素：方向箭头、特殊效果、事件缩略名、飞机
        let inner = "";
        const arrow = ARROWS[k];
        const eff = getEffect(r, c);
        const ev = getEvent(r, c);

        // 动态根据当前 CELL 规格自适应文字与图标字号 (支持小屏 21px 至超大屏 78px)
        const fontCenter = CELL >= 52 ? "text-xl sm:text-2xl" : CELL >= 36 ? "text-sm sm:text-base" : (CELL >= 28 ? "text-xs" : "text-[10px]");
        const fontFlight = CELL >= 52 ? "text-base sm:text-lg" : CELL >= 36 ? "text-xs sm:text-sm" : (CELL >= 28 ? "text-[10px]" : "text-[9px]");
        const fontEff = CELL >= 52 ? "text-xs sm:text-sm" : CELL >= 36 ? "text-[10px] sm:text-[11px]" : (CELL >= 28 ? "text-[8.5px]" : "text-[7.5px]");
        const fontEv = CELL >= 56 ? "text-[12px] leading-tight" : CELL >= 44 ? "text-[10.5px] leading-tight" : (CELL >= 34 ? "text-[9px] leading-[1.15]" : "text-[7.5px] leading-none");
        const fontArrow = CELL >= 52 ? "text-[10px] sm:text-xs" : CELL >= 36 ? "text-[8px] sm:text-[9px]" : (CELL >= 28 ? "text-[7px]" : "text-[6px]");

        if (isCenter) {
          inner = `<span class="${fontCenter} leading-none">🏆</span>`;
        } else if (FLIGHT_MAP[k]) {
          inner = `<span class="${fontFlight} animate-pulse">✈️</span>`;
        } else if (eff) {
          const effShort = eff === "forward2" ? "⬆️+2" : eff === "backward2" ? "⬇️-2" : "⏸️休";
          const effColor = eff === "forward2" ? "text-emerald-300" : eff === "backward2" ? "text-amber-300" : "text-violet-300";
          inner = `<span class="${fontEff} font-black ${effColor} leading-none tracking-tighter">${effShort}</span>`;
        } else if (ev && ev.name) {
          inner = `<span class="${fontEv} text-center font-bold px-0.5 line-clamp-2 break-all opacity-95">${esc(ev.name)}</span>`;
        }

        // 顺时针方向指示箭头 (位于格子右下角或背景微显)
        const arrowTag = (arrow && !isCenter)
          ? `<span class="absolute bottom-0 right-0 ${fontArrow} text-white/30 font-bold pointer-events-none p-0.5 leading-none select-none">${arrow}</span>`
          : "";

        html += `<div data-cell="${k}" class="${cls}" style="width:${CELL}px;height:${CELL}px">${arrowTag}${inner}</div>`;
      }
    }
    board.innerHTML = html;
    bindCellHover();
  }

  /* ================= 棋子层渲染 ================= */
  function renderPieces() {
    const layer = document.getElementById("piece-layer");
    if (!layer) return;

    const all = [];
    players.forEach((pid) => {
      ps[pid].tokens.forEach((t, i) => {
        all.push({ pid: pid, t: t, i: i, pt: tokenPoint(pid, t, i) });
      });
    });

    const posCount = {};
    all.forEach((p) => {
      const k = key(p.pt);
      posCount[k] = (posCount[k] || 0) + 1;
    });

    const posSeen = {};
    let html = "";
    all.forEach((p) => {
      const col = P_COL[p.pid];
      const k = key(p.pt);
      const same = posCount[k];
      const seen = posSeen[k] || 0;
      posSeen[k] = seen + 1;

      let size = Math.max(16, CELL - 6);
      let ox = 0, oy = 0;
      if (same > 1) {
        size = Math.max(12, CELL - 14);
        ox = (seen % 2 ? -1 : 1) * Math.floor(CELL * 0.12);
        oy = (seen < 2 ? -1 : 1) * Math.floor(CELL * 0.12);
      }

      const x = p.pt.col * (CELL + 2) + 4 + (CELL - size) / 2 + ox;
      const y = p.pt.row * (CELL + 2) + 4 + (CELL - size) / 2 + oy;
      const isCur = p.pid === currentPlayer && !winner;
      const movable = selectState && selectState.pid === p.pid && selectState.ids.includes(p.t.id);

      let cls = `absolute flex items-center justify-center rounded-full ${col.grad} transition-all duration-300 `;
      if (movable) {
        cls += ` ${col.ring} ring-2 scale-110 z-40 pointer-events-auto animate-bounce cursor-pointer`;
      } else if (isCur) {
        cls += ` ${col.ring} ring-2 z-30`;
      } else {
        cls += " z-20 opacity-90";
      }

      html += `<div data-piece="${p.t.id}" class="${cls}" style="left:${x}px;top:${y}px;width:${size}px;height:${size}px;font-size:${Math.floor(size * 0.5)}px;box-shadow:0 3px 12px rgba(0,0,0,0.6)">${col.sym}</div>`;
    });

    layer.innerHTML = html;

    if (selectState) {
      layer.querySelectorAll("[data-piece]").forEach((d) => {
        const tid = d.getAttribute("data-piece");
        if (selectState.ids.includes(tid)) {
          d.onclick = () => moveToken(selectState.pid, tid, selectState.dice);
        }
      });
    }
  }

  /* ================= 玩家状态指示胶囊 ================= */
  function renderCapsules() {
    const el = document.getElementById("player-capsules");
    if (!el) return;
    el.innerHTML = players.map((pid) => {
      const col = P_COL[pid];
      const active = pid === currentPlayer && !winner;
      const state = ps[pid];
      const homeC = state ? state.tokens.filter(t => !t.started).length : 0;
      const finishC = state ? state.tokens.filter(t => t.finished).length : 0;

      return `
        <div class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all ${active ? col.pill + " ring-1 " + col.ring : "border-white/10 bg-white/5 text-white/50"}">
          <span class="h-2 w-2 rounded-full ${col.dot}"></span>
          <span>${esc(playerBadge(pid))}</span>
          ${settings.pieceCount > 1 ? `<span class="text-[10px] opacity-75 font-mono">(${finishC}/${settings.pieceCount}🏁)</span>` : ""}
        </div>`;
    }).join("");
  }

  /* ================= 骰子面视觉 ================= */
  function diceFace(v) {
    if (!v) {
      return `<div class="flex items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-2xl font-bold text-white/40 shadow-inner w-16 h-16 sm:w-18 sm:h-18">?</div>`;
    }
    const dots = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8]
    };
    let cells = "";
    for (let i = 0; i < 9; i++) {
      const isDot = dots[v] && dots[v].includes(i);
      cells += `<div class="flex items-center justify-center"><div class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${isDot ? (v === 1 || v === 4 ? "bg-rose-500" : "bg-zinc-800") : "bg-transparent"} transition-all"></div></div>`;
    }
    return `<div class="grid grid-cols-3 gap-1 rounded-2xl bg-gradient-to-b from-white to-zinc-200 p-2 sm:p-2.5 shadow-[0_8px_25px_rgba(0,0,0,0.5)] border border-white w-16 h-16 sm:w-18 sm:h-18 transition-transform">${cells}</div>`;
  }

  /* ================= 控制区渲染 ================= */
  function renderControl() {
    const tl = document.getElementById("turn-label");
    if (!tl) return;

    if (winner) {
      tl.innerHTML = `<span class="text-amber-300 font-bold text-base">🏆 ${esc(playerBadge(winner))} 夺冠胜利！</span>`;
    } else if (selectState) {
      tl.innerHTML = `<span class="text-rose-300 font-bold animate-pulse">👆 ${esc(playerBadge(currentPlayer))} 请点击棋盘上高亮的棋子进行移动</span>`;
    } else {
      tl.innerHTML = `${esc(playerBadge(currentPlayer))} · <span class="text-white/60">${L("labels.currentPlayer")}</span>`;
    }

    renderDiceArea();

    const rbw = document.getElementById("roll-btn-wrap");
    if (!winner && !ui.needAck && !selectState) {
      rbw.innerHTML = `
        <button id="btn-roll" ${rolling ? "disabled" : ""} class="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 via-rose-500 to-amber-500 px-6 py-2 sm:px-7 sm:py-2.5 text-sm sm:text-base font-extrabold text-white shadow-[0_6px_20px_rgba(244,63,94,0.45)] transition hover:scale-105 active:scale-95 disabled:opacity-50">
          <span class="text-base sm:text-lg">🎲</span><span>${esc(L("buttons.roll"))}</span>
        </button>`;
      const b = document.getElementById("btn-roll");
      if (b) b.onclick = () => doRoll();
    } else {
      rbw.innerHTML = "";
    }

    document.getElementById("event-msg").textContent = ui.msg || "";

    const aw = document.getElementById("ack-btn-wrap");
    if (ui.needAck) {
      aw.innerHTML = `
        <button id="btn-ack" class="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/60 bg-emerald-500/25 px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-emerald-100 hover:bg-emerald-500/35 transition active:scale-95 shadow-md shadow-emerald-500/20">
          <span>✅</span><span>${esc(L("messages.acknowledge"))}</span>
        </button>`;
      const b = document.getElementById("btn-ack");
      if (b) {
        b.onclick = () => {
          const act = ui.ackAction;
          ui.needAck = false;
          ui.msg = "";
          renderControl();
          if (act) act();
        };
      }
    } else {
      aw.innerHTML = "";
    }
  }

  let dice3dInstance = null;
  function renderDiceArea() {
    const area = document.getElementById("dice-area");
    if (!area) return;
    if (window.Dice3D) {
      if (!dice3dInstance || !area.contains(dice3dInstance.sceneEl)) {
        area.innerHTML = "";
        dice3dInstance = window.Dice3D.create(area, { initialValue: diceVal || 1 });
        area.style.cursor = "pointer";
        area.title = "点击直接掷骰";
        area.onclick = () => {
          if (!rolling && !winner && !ui.needAck && !selectState) doRoll();
        };
      } else if (diceVal) {
        dice3dInstance.setValue(diceVal);
      }
    } else {
      area.innerHTML = diceFace(diceVal);
    }
  }

  function render() {
    renderBoard();
    renderPieces();
    renderCapsules();
    renderControl();
  }

  /* ================= 掷骰与流程逻辑 ================= */
  async function doRoll(forced, silent) {
    if (rolling || winner || selectState) return;
    if (!silent) LG.recordDetailStat("ludoMoves");

    rolling = true;
    const pid = currentPlayer;
    const allNotStarted = players.every((p) => ps[p].tokens.every((t) => !t.started));
    const dice = forced || LG.dice1_6();
    rollCounts[pid] = (rollCounts[pid] || 0) + 1;
    if (dice === 6) {
      LG.recordDetailStat("ludoSixes");
      hasSix[pid] = true;
    }

    // 掷骰动画 (优先使用 Dice3D 真实物理翻滚)
    if (!silent) {
      if (window.Dice3D && dice3dInstance) {
        await dice3dInstance.roll(dice, 900);
        diceVal = dice;
      } else {
        const iv = setInterval(() => {
          diceVal = LG.dice1_6();
          document.getElementById("dice-area").innerHTML = diceFace(diceVal);
          sound.play("roll");
        }, 100);
        renderControl();
        await sleep(750);
        clearInterval(iv);
        diceVal = dice;
        document.getElementById("dice-area").innerHTML = diceFace(diceVal);
        sound.play("stop");
        await sleep(250);
      }
    } else {
      diceVal = dice;
      if (dice3dInstance) dice3dInstance.setValue(dice);
    }

    const movable = ps[pid].tokens
      .map((t) => ({ t: t, ab: tokenAbility(t, dice, pid) }))
      .filter((x) => x.ab.canMove || x.ab.canStart);

    rolling = false;

    // 无法移动的分支：未起飞处理
    if (movable.length === 0) {
      ps[pid].tokens.forEach((t) => { if (t.resting) t.resting = false; });
      const allWait = ps[pid].tokens.every((t) => !t.started);

      if (allWait && !canStartDice(dice)) {
        // 触发未起飞前戏互动 (Pre-start Action)
        await triggerPreStartAction(pid, dice, allNotStarted);
        return;
      }

      let msg = L("messages.noMovableTokens", { player: playerName(pid) });
      history.unshift({ id: LG.uuid(), player: pid, dice: dice, text: msg, at: Date.now() });
      ui.msg = msg;
      renderControl();
      await sleep(1000);
      nextPlayer();
      return;
    }

    // 唯一步伐直接走
    if (movable.length === 1) {
      await moveToken(pid, movable[0].t.id, dice, silent);
      return;
    }

    // 若均在等待起飞，起飞第一颗
    if (movable.every((x) => x.ab.canStart && !x.t.started)) {
      await moveToken(pid, movable[0].t.id, dice, silent);
      return;
    }

    // 多个棋子可走，进入选子模式
    selectState = { pid: pid, dice: dice, ids: movable.map((x) => x.t.id) };
    diceVal = dice;
    renderPieces();
    renderControl();
  }

  /* ================= 未起飞前戏互动卡片 ================= */
  async function triggerPreStartAction(pid, dice, allNotStarted) {
    preStartRolls = allNotStarted ? Math.min(preStartRolls + 1, 5) : 0;

    // 随机抽取前戏互动
    const actionsPool = [
      { key: "kiss", label: L("preStartActions.kiss") || "亲吻对方一口", keepTurn: false, emoji: "💋" },
      { key: "sip", label: L("preStartActions.sip") || "喝一口酒/饮品", keepTurn: false, emoji: "🍷" },
      { key: "fitnessWarmup", label: L("preStartActions.fitnessWarmup") || "原地亲密高抬腿/深蹲10次", keepTurn: false, emoji: "🏃" },
      { key: "fitnessHydrate", label: L("preStartActions.fitnessHydrate") || "喝一口温水润润喉", keepTurn: false, emoji: "💧" },
      { key: "reroll", label: L("preStartActions.reroll") || "手气爆棚：再掷一次！", keepTurn: true, emoji: "🎲" },
    ];
    const picked = LG.pick(actionsPool);
    const startMsg = settings.easyStart ? "掷出 5 或 6 点才能起飞" : (L("messages.rollSixToStart") || "掷出 6 点才能起飞");

    // 弹出未起飞互动卡片
    openEventModal({
      playerBadge: playerBadge(pid),
      title: `${startMsg} · 前戏惩罚`,
      description: `${picked.emoji} 【前戏互动】${picked.label}`,
      isPreStart: true,
      onAcknowledge: () => {
        history.unshift({
          id: LG.uuid(),
          player: pid,
          dice: dice,
          text: `${startMsg} -> ${picked.label}`,
          at: Date.now()
        });
        if (picked.keepTurn) {
          keepTurn(pid);
        } else {
          nextPlayer();
        }
      }
    });
  }

  /* ================= 移动棋子与事件触发 ================= */
  async function moveToken(pid, tokenId, dice, silent) {
    const state = ps[pid];
    const ci = state.tokens.findIndex((t) => t.id === tokenId);
    if (ci < 0) return;

    let token = state.tokens[ci];
    const ab = tokenAbility(token, dice, pid);
    const cfg = DCFG[P2D[pid]];
    selectState = null;

    let triggeredEvent = null;
    let winPid = null;
    let lines = [];

    if (ab.canStart && !token.started) {
      // 起飞
      token.started = true;
      token.outerIndex = -1;
      token.inHome = false;
      token.homeIndex = -1;
      token.resting = false;
      state.homeCount = Math.max(0, state.homeCount - 1);
      sound.play("start");

      const wev = getEvent(cfg.wait.row, cfg.wait.col);
      const title = L("messages.playerStarted", { player: playerName(pid) }) || `${playerName(pid)} 战机成功起飞！`;
      const desc = wev ? (wev.description || wev.name || "") : "展翼启航，向心动终点出发！";

      lines.push(title);
      triggeredEvent = { title, description: desc };
    } else if (ab.canMove) {
      // 沿轨道正常行进
      let m = token.outerIndex, inHome = token.inHome, f = token.homeIndex;

      if (inHome) {
        const r = homeSeq(pid, f, dice, 1);
        if (r.seq.length) await animateToken(pid, tokenId, "home", r.seq, 220);
        f = r.seq.length ? r.final : f;
      } else {
        const seq = [];
        if (m < 0 && dice > 0) {
          m = cfg.startIndex;
          seq.push(m);
        }
        const remain = dice - seq.length;
        const d = outerDist(m, cfg.entryIndex);

        if (remain >= d && d >= 0) {
          if (d > 0) {
            const r = outerSeq(m, d, 1);
            seq.push(...r.seq);
            m = r.final;
          }
          const left = dice - seq.length;
          if (left > 0) {
            inHome = true;
            const r = homeSeq(pid, -1, left, 1);
            state.tokens[ci].inHome = true;
            state.tokens[ci].outerIndex = -1;
            if (seq.length) await animateToken(pid, tokenId, "outer", seq, 220);
            await animateToken(pid, tokenId, "home", r.seq, 220);
            f = r.final;
          } else {
            if (seq.length) await animateToken(pid, tokenId, "outer", seq, 220);
          }
        } else {
          const r = outerSeq(m, remain, 1);
          seq.push(...r.seq);
          if (seq.length) await animateToken(pid, tokenId, "outer", seq, 220);
          m = r.final;
        }
      }

      token.outerIndex = inHome ? -1 : m;
      token.inHome = inHome;
      token.homeIndex = f;
      renderPieces();

      // 特殊效果格判定 (+2 / -2 / 休息)
      let pt = inHome ? (f < 0 ? OUTER[cfg.entryIndex] : cfg.home[f]) : OUTER[m];
      let eff = getEffect(pt.row, pt.col);

      if (!inHome && eff === "forward2") {
        lines.push(L("effects.forward2.label") || "⬆️ 前进两格");
        const r = outerSeq(m, 2, 1);
        if (r.seq.length) {
          await animateToken(pid, tokenId, "outer", r.seq, 200);
          token.outerIndex = r.final;
          renderPieces();
        }
      } else if (!inHome && eff === "backward2") {
        lines.push(L("effects.backward2.label") || "⬇️ 后退两格");
        const r = outerSeq(m, 2, -1);
        if (r.seq.length) {
          await animateToken(pid, tokenId, "outer", r.seq, 200);
          token.outerIndex = r.final;
          renderPieces();
        }
      } else if (eff === "rest") {
        token.resting = true;
        lines.push(L("effects.rest.label") || "⏸️ 休息一回合");
      }

      // 近道捷径判定 (Flights)
      pt = inHome ? (f < 0 ? OUTER[cfg.entryIndex] : cfg.home[f]) : OUTER[token.outerIndex];
      const fk = key(pt);
      if (!inHome && FLIGHT_MAP[fk]) {
        const fl = FLIGHT_MAP[fk];
        sound.play("fly");
        token.outerIndex = OUTER_IDX.get(fl.target);
        renderPieces();
        lines.push(`✈️ 触发近道飞跃！直通对角！`);
        await sleep(350);
      }

      // 撞子判定 (Bump)
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
                sound.play("eat");
                lines.push(L("messages.bumpSuccess", { player: playerName(pid), opponent: playerName(o) }) || `💥 撞飞对手！将其送回基地！`);
              }
            }
          });
        });
      }

      // 终点获胜判定
      token.finished = token.inHome && f >= cfg.home.length - 1;
      state.finishedCount = state.tokens.filter((t) => t.finished).length;
      renderPieces();

      if (state.tokens.every((t) => t.finished)) {
        winPid = pid;
      } else {
        const finalPt = token.inHome ? cfg.home[cfg.home.length - 1] : OUTER[token.outerIndex];
        const landed = getEvent(finalPt.row, finalPt.col);
        if (landed && (landed.description || landed.name) && !FLIGHT_MAP[key(finalPt)]) {
          triggeredEvent = {
            title: landed.name || "心动事件",
            description: landed.description || ""
          };
          lines.push(landed.name);
        }
      }
      if (!silent) LG.recordDetailStat("ludoEvents");
    }

    history.unshift({
      id: LG.uuid(),
      player: pid,
      dice: dice,
      text: lines.filter(Boolean).join("\n") || (triggeredEvent ? triggeredEvent.title : "前进一步"),
      at: Date.now()
    });

    if (winPid) {
      finishWin(winPid);
      return;
    }

    const extraTurn = (dice === 6 || (settings.easyStart && dice === 5)) && !token.resting;

    // 若触发了事件，弹出全屏沉浸式大弹窗 + 倒计时
    if (triggeredEvent) {
      openEventModal({
        playerBadge: playerBadge(pid),
        title: triggeredEvent.title,
        description: triggeredEvent.description,
        onAcknowledge: () => {
          if (extraTurn) keepTurn(pid);
          else nextPlayer();
        }
      });
    } else {
      ui.msg = lines.join("\n");
      renderControl();
      await sleep(800);
      if (extraTurn) keepTurn(pid);
      else nextPlayer();
    }
  }

  function keepTurn(pid) {
    currentPlayer = pid;
    ui.msg = L("messages.rollAgain") || "🎉 掷出最大点数！额外再掷一次！";
    diceVal = null;
    renderPieces();
    renderCapsules();
    renderControl();
  }

  function nextPlayer() {
    const i = players.indexOf(currentPlayer);
    currentPlayer = players[(i + 1) % players.length];
    ui.msg = "";
    diceVal = null;
    renderPieces();
    renderCapsules();
    renderControl();
  }

  /* ================= 沉浸式全屏事件大弹窗与智能倒计时 ================= */
  function parseCountdownSeconds(text) {
    if (!text) return 0;
    const cnNums = { "一": 1, "二": 2, "两": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9, "十": 10, "半": 0.5 };
    const parseNum = (str) => {
      if (!str) return 0;
      const n = Number(str);
      if (!isNaN(n)) return n;
      return cnNums[str] || 0;
    };
    const minMatch = text.match(/(\d+|[一二两三四五六七八九十半]+)\s*(?:分|分钟|minutes?|mins?)/i);
    if (minMatch) return Math.round(parseNum(minMatch[1]) * 60);
    const secMatch = text.match(/(\d+|[一二两三四五六七八九十]+)\s*(?:秒|秒钟|seconds?|secs?)/i);
    if (secMatch) return Math.round(parseNum(secMatch[1]));
    return 0;
  }

  function playAlertSound() {
    try {
      const audio = new Audio("../assets/media/bonus.mp3");
      audio.play().catch(() => sound.play("fanfare"));
    } catch (e) {
      sound.play("fanfare");
    }
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  }

  function openEventModal({ playerBadge, title, description, isPreStart, onAcknowledge }) {
    const fullText = (title || "") + " " + (description || "");
    const initialSec = parseCountdownSeconds(fullText);

    let timerSec = initialSec;
    let timerRunning = false;
    let timerHandle = null;

    const timerHtml = initialSec > 0 ? `
      <div id="modal-timer-box" class="my-4 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <div class="text-xs uppercase tracking-widest text-pink-300 font-semibold mb-1">⏱️ 互动限时倒计时</div>
        <div id="modal-timer-num" class="text-5xl font-black font-mono text-transparent bg-gradient-to-r from-amber-300 via-rose-300 to-pink-400 bg-clip-text drop-shadow">${timerSec}s</div>
        <div class="mt-3 flex gap-2">
          <button id="btn-timer-toggle" class="rounded-full bg-white/10 px-5 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition active:scale-95">▶ 开始计时</button>
          <button id="btn-timer-reset" class="rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10 transition">重置</button>
        </div>
      </div>` : "";

    const m = LG.openModal(`
      <div class="flex flex-col items-center text-center space-y-4 py-2">
        <span class="rounded-full border border-pink-400/40 bg-pink-500/20 px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-pink-200 shadow-[0_0_12px_rgba(244,63,94,0.4)]">
          ${esc(playerBadge)}
        </span>
        <h3 class="text-2xl sm:text-3xl font-black text-white drop-shadow-md leading-tight">
          ${esc(title)}
        </h3>
        ${description ? `<p class="text-base sm:text-lg text-rose-100/90 leading-relaxed max-w-md mx-auto whitespace-pre-line drop-shadow-sm font-medium">${esc(description)}</p>` : ""}
        ${timerHtml}
        <button id="btn-modal-ack" class="mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 via-rose-500 to-amber-500 px-9 py-3.5 text-base font-extrabold text-white shadow-[0_10px_30px_rgba(244,63,94,0.45)] hover:scale-105 active:scale-95 transition-transform duration-200">
          <span>✅</span><span>${esc(L("messages.acknowledge"))}</span>
        </button>
      </div>`, { maxW: "max-w-lg" });

    // 倒计时器逻辑
    if (initialSec > 0) {
      const numEl = m.el.querySelector("#modal-timer-num");
      const togBtn = m.el.querySelector("#btn-timer-toggle");
      const rstBtn = m.el.querySelector("#btn-timer-reset");

      const updateView = () => {
        numEl.textContent = `${timerSec}s`;
        if (timerSec <= 3 && timerSec > 0) {
          sound.play("tick");
        }
      };

      const stopTimer = () => {
        if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
        timerRunning = false;
        togBtn.textContent = "▶ 开始计时";
      };

      const startTimer = () => {
        if (timerSec <= 0) timerSec = initialSec;
        timerRunning = true;
        togBtn.textContent = "⏸ 暂停";
        timerHandle = setInterval(() => {
          timerSec--;
          updateView();
          if (timerSec <= 0) {
            stopTimer();
            numEl.textContent = "时间到！🎉";
            playAlertSound();
          }
        }, 1000);
      };

      togBtn.onclick = () => {
        if (timerRunning) stopTimer();
        else startTimer();
      };
      rstBtn.onclick = () => {
        stopTimer();
        timerSec = initialSec;
        updateView();
      };
    }

    m.el.querySelector("#btn-modal-ack").onclick = () => {
      m.close();
      if (onAcknowledge) onAcknowledge();
    };
  }

  /* ================= 胜利结算 ================= */
  function finishWin(pid) {
    LG.recordDetailStat("ludoWinner");
    LG.incrementGameSession("ludo", 15);
    winner = pid;
    sound.play("win");
    renderPieces();
    renderCapsules();

    const cfg = DCFG[P2D[pid]];
    const endEvent = getEvent(cfg.home[cfg.home.length - 1].row, cfg.home[cfg.home.length - 1].col);

    LG.openModal(`
      <div class="text-center py-4 space-y-4">
        <div class="text-6xl animate-bounce">🏆</div>
        <h3 class="text-3xl font-black bg-gradient-to-r from-amber-200 via-rose-300 to-fuchsia-300 bg-clip-text text-transparent">${esc(L("messages.celebrationTitle"))}</h3>
        <p class="text-base text-white/90 max-w-sm mx-auto leading-relaxed">${esc(L("messages.winnerReached", { player: playerBadge(pid), description: endEvent ? endEvent.description : "亲密爱侣大获全胜！" }))}</p>
        <div class="pt-2">
          <button id="win-restart" class="rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-fuchsia-500 px-8 py-3 text-base font-extrabold text-white shadow-xl hover:scale-105 active:scale-95 transition">🔄 ${esc(L("reset"))}</button>
        </div>
      </div>`);

    document.getElementById("win-restart").onclick = () => {
      modalRoot.innerHTML = "";
      resetGameState();
      render();
    };
    renderControl();
  }

  /* ================= 规则设置面板 ================= */
  function toggleHtml(tg, on) {
    return `
      <button data-tg="${tg}" class="relative inline-flex h-7 w-12 items-center rounded-full transition ${on ? "bg-emerald-500" : "bg-white/15"}">
        <span class="inline-block h-5 w-5 transform rounded-full bg-white transition ${on ? "translate-x-6" : "translate-x-1"}"></span>
      </button>`;
  }

  function openSettings() {
    const m = LG.openModal(`
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold flex items-center gap-2">⚙️ ${esc(L("options.title"))}</h3>
        <button id="set-close-top" class="rounded-full bg-white/10 h-7 w-7 text-sm hover:bg-white/20">✕</button>
      </div>
      <div class="space-y-5 max-h-[70vh] overflow-y-auto pr-1 text-left">
        <div>
          <p class="text-xs uppercase tracking-widest text-white/60 mb-2 font-semibold">${esc(L("options.playerMode.label"))}</p>
          <div class="grid grid-cols-3 gap-2">
            ${["two", "three", "four"].map((mo) => `
              <button data-mo="${mo}" class="rounded-xl border px-3 py-2 text-sm font-semibold transition ${settings.playerMode === mo ? "border-amber-400/80 bg-amber-400/20 text-amber-100 shadow-[0_0_10px_rgba(245,158,11,0.3)]" : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"}">${esc(L("options.playerMode." + mo))}</button>`).join("")}
          </div>
        </div>

        <div>
          <p class="text-xs uppercase tracking-widest text-white/60 mb-2 font-semibold">${esc(L("options.pieceCount.label"))}</p>
          <div class="grid grid-cols-4 gap-2">
            ${[1, 2, 3, 4].map((n) => `
              <button data-pc="${n}" class="rounded-xl border px-3 py-2 text-sm font-semibold transition ${settings.pieceCount === n ? "border-amber-400/80 bg-amber-400/20 text-amber-100 shadow-[0_0_10px_rgba(245,158,11,0.3)]" : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"}">${n} 颗</button>`).join("")}
          </div>
        </div>

        <div class="rounded-2xl border border-white/10 bg-white/5 p-3 space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-white/90">降低起飞门槛</p>
              <p class="text-[11px] text-white/50">掷出 5 或 6 点均可起飞 (默认仅6点)</p>
            </div>
            ${toggleHtml("easyStart", settings.easyStart)}
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-white/80 pr-2">${esc(L("options.requireExactHomeEntry.label"))}</span>
            ${toggleHtml("exact", settings.requireExactHomeEntry)}
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-white/80 pr-2">${esc(L("options.enableBump.label"))}</span>
            ${toggleHtml("bump", settings.enableBump)}
          </div>
        </div>

        <div>
          <p class="text-xs uppercase tracking-widest text-white/60 mb-1.5 font-semibold">棋盘自定义背景图</p>
          <div class="flex gap-2">
            <input id="set-bg-inp" class="flex-1 rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs focus:outline-none focus:border-pink-400/60" placeholder="输入背景图片 URL..." value="${esc(settings.boardBg || "")}">
            <button id="set-bg-apply" class="rounded-xl bg-white/15 px-3 py-2 text-xs font-semibold hover:bg-white/25">应用</button>
          </div>
          <div class="mt-2 flex flex-wrap gap-2 text-[11px]">
            <button data-quickbg="" class="rounded-lg bg-white/5 px-2.5 py-1 text-white/60 hover:bg-white/10">无背景</button>
            <button data-quickbg="../assets/img/bg.png" class="rounded-lg bg-white/5 px-2.5 py-1 text-white/60 hover:bg-white/10">浪漫星空</button>
            <button data-quickbg="../assets/img/bg2.png" class="rounded-lg bg-white/5 px-2.5 py-1 text-white/60 hover:bg-white/10">幻紫霓虹</button>
          </div>
        </div>
      </div>
      <div class="mt-5 text-right">
        <button id="set-close" class="rounded-full bg-white/10 px-6 py-2 text-sm font-semibold hover:bg-white/20 transition">${esc(L("library.close"))}</button>
      </div>`, { maxW: "max-w-md" });

    const el = m.el;
    el.querySelectorAll("[data-mo]").forEach((b) => {
      b.onclick = () => {
        const mo = b.getAttribute("data-mo");
        if (mo === settings.playerMode) return;
        settings.playerMode = mo;
        LG.saveJSON("lovegame-ludo-settings", settings);
        players = MODE_P[mo];
        resetGameState();
        render();
        m.close();
      };
    });
    el.querySelectorAll("[data-pc]").forEach((b) => {
      b.onclick = () => {
        settings.pieceCount = Number(b.getAttribute("data-pc"));
        LG.saveJSON("lovegame-ludo-settings", settings);
        resetGameState();
        render();
        m.close();
      };
    });
    el.querySelectorAll("[data-tg]").forEach((b) => {
      b.onclick = () => {
        const k = b.getAttribute("data-tg");
        if (k === "exact") settings.requireExactHomeEntry = !settings.requireExactHomeEntry;
        else if (k === "bump") settings.enableBump = !settings.enableBump;
        else if (k === "easyStart") settings.easyStart = !settings.easyStart;
        LG.saveJSON("lovegame-ludo-settings", settings);
        m.close();
        openSettings();
      };
    });

    const applyBg = (url) => {
      settings.boardBg = url.trim();
      LG.saveJSON("lovegame-ludo-settings", settings);
      rebuildShell();
      LG.toast("棋盘背景已更新");
    };
    el.querySelector("#set-bg-apply").onclick = () => applyBg(el.querySelector("#set-bg-inp").value);
    el.querySelectorAll("[data-quickbg]").forEach((b) => {
      b.onclick = () => {
        const u = b.getAttribute("data-quickbg");
        el.querySelector("#set-bg-inp").value = u;
        applyBg(u);
      };
    });

    el.querySelector("#set-close").onclick = () => m.close();
    el.querySelector("#set-close-top").onclick = () => m.close();
  }

  /* ================= 8 大事件库管理面板 ================= */
  function currentEventSnapshot() {
    const o = {};
    Object.keys(eventTable).forEach((k) => {
      o[k] = { name: eventTable[k].name, description: eventTable[k].description };
    });
    return o;
  }

  function openLibrary() {
    const renderList = () => {
      const card = (title, count, isActive, useId, extra) => `
        <div class="rounded-2xl border ${isActive ? "border-amber-400/80 bg-amber-400/10 shadow-[0_0_12px_rgba(245,158,11,0.2)]" : "border-white/10 bg-white/5"} p-3">
          <div class="flex items-center justify-between gap-2">
            <div>
              <p class="text-sm font-bold text-white">${title}</p>
              <p class="text-[11px] text-white/50">${esc(L("library.stats", { count: count }))}</p>
            </div>
            <div class="flex items-center gap-1.5">
              ${isActive ? `<span class="rounded-full bg-amber-400/25 border border-amber-400/50 px-3 py-1 text-[11px] font-bold text-amber-200">${esc(L("library.activeBadge"))}</span>`
                : `<button data-use="${useId}" class="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/20 transition active:scale-95">${esc(L("library.use"))}</button>`}
              ${extra || ""}
            </div>
          </div>
        </div>`;

      let h = card(esc(L("library.defaultName")), Object.keys(defaultEvents(settings.playerMode)).length, activeLibrary === null, "__default");

      Object.keys(BUILTIN_LIBS).forEach((id) => {
        const b = BUILTIN_LIBS[id];
        const libEvents = b.fn();
        h += card(esc(L(b.nameKey) || b.defaultName), Object.keys(libEvents).length, activeLibrary === id, id);
      });

      Object.keys(userLibraries).forEach((id) => {
        const lib = userLibraries[id];
        const extra = `
          <button data-rn="${id}" class="rounded-full bg-white/10 px-2 py-1 text-xs hover:bg-white/20" title="${esc(L("library.rename"))}">✏️</button>
          <button data-ov="${id}" class="rounded-full bg-white/10 px-2 py-1 text-xs hover:bg-white/20" title="${esc(L("library.overwrite"))}">⤴️</button>
          <button data-dl="${id}" class="rounded-full bg-white/10 px-2 py-1 text-xs hover:bg-rose-500/40 text-rose-200" title="${esc(L("library.delete"))}">🗑</button>`;
        h += card(esc(lib.name), Object.keys(lib.events || {}).length, activeLibrary === id, id, extra);
      });
      return h;
    };

    const m = LG.openModal(`
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-xl font-bold flex items-center gap-2">📚 ${esc(L("library.title"))}</h3>
        <button id="lib-close" class="rounded-full bg-white/10 h-7 w-7 text-sm hover:bg-white/20">✕</button>
      </div>
      <p class="text-xs text-white/60 mb-3">${esc(L("library.subtitle"))}</p>
      <div id="lib-list" class="space-y-2 max-h-[50vh] overflow-y-auto pr-1 text-left">${renderList()}</div>

      <div class="mt-4 rounded-2xl border border-dashed border-white/20 p-3 text-left">
        <p class="text-xs font-semibold text-white/80 mb-1.5">${esc(L("library.newLabel"))}</p>
        <div class="flex gap-2">
          <input id="lib-new-name" class="flex-1 rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs focus:outline-none focus:border-amber-400/60" placeholder="${esc(L("library.namePlaceholder"))}">
          <button id="lib-save-new" class="rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 px-4 py-2 text-xs font-bold whitespace-nowrap shadow-md hover:scale-105 transition">💾 ${esc(L("library.saveNew"))}</button>
        </div>
      </div>`, { maxW: "max-w-lg" });

    function refresh() {
      m.el.querySelector("#lib-list").innerHTML = renderList();
      bind();
    }
    function bind() {
      m.el.querySelectorAll("[data-use]").forEach((b) => {
        b.onclick = () => {
          const id = b.getAttribute("data-use");
          activeLibrary = id === "__default" ? null : id;
          LG.saveJSON("lovegame-ludo-active-library", activeLibrary);
          rebuildEventTable();
          render();
          LG.toast(L("library.switchSuccess", { name: b.parentElement.parentElement.querySelector("p").textContent }));
          refresh();
        };
      });
      m.el.querySelectorAll("[data-dl]").forEach((b) => {
        b.onclick = () => {
          const id = b.getAttribute("data-dl");
          const name = userLibraries[id].name;
          delete userLibraries[id];
          if (activeLibrary === id) {
            activeLibrary = null;
            LG.saveJSON("lovegame-ludo-active-library", null);
          }
          LG.saveJSON("lovegame-ludo-libraries", userLibraries);
          LG.toast(L("library.deleteSuccess", { name: name }));
          refresh();
        };
      });
      m.el.querySelectorAll("[data-rn]").forEach((b) => {
        b.onclick = () => {
          const id = b.getAttribute("data-rn");
          const lib = userLibraries[id];
          const nn = prompt(L("library.rename") || "重命名事件库", lib.name);
          if (nn && nn.trim()) {
            lib.name = nn.trim();
            lib.updatedAt = Date.now();
            LG.saveJSON("lovegame-ludo-libraries", userLibraries);
            refresh();
          }
        };
      });
      m.el.querySelectorAll("[data-ov]").forEach((b) => {
        b.onclick = () => {
          const id = b.getAttribute("data-ov");
          userLibraries[id].events = currentEventSnapshot();
          userLibraries[id].updatedAt = Date.now();
          LG.saveJSON("lovegame-ludo-libraries", userLibraries);
          LG.toast(L("library.overwriteSuccess", { name: userLibraries[id].name }));
          refresh();
        };
      });
    }
    bind();

    m.el.querySelector("#lib-close").onclick = () => m.close();
    m.el.querySelector("#lib-save-new").onclick = () => {
      const inp = m.el.querySelector("#lib-new-name");
      const name = inp.value.trim();
      if (!name) return LG.toast(L("library.nameRequired"));
      if (Object.values(userLibraries).some((l) => l.name === name)) return LG.toast(L("library.nameExists"));
      const id = LG.uuid();
      userLibraries[id] = {
        id: id,
        name: name,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        events: currentEventSnapshot()
      };
      LG.saveJSON("lovegame-ludo-libraries", userLibraries);
      activeLibrary = id;
      LG.saveJSON("lovegame-ludo-active-library", id);
      rebuildEventTable();
      render();
      LG.toast(L("library.saveSuccess", { name: name }));
      m.close();
    };
  }

  /* ================= AI 生成事件 Prompt 向导 ================= */
  function openAiPromptGenerator() {
    const currentJson = JSON.stringify(currentEventSnapshot(), null, 2);
    const promptTemplate = L("buttons.generatePromptTemplate") ||
      `请修改这个情侣飞行棋事件库，替换为全新、充满惊喜与互动的事件。
要求：
1. 专为亲密关系的伴侣设计，浪漫、激情、情趣兼备；
2. 事件包含具体的身体互动、亲昵接触、真心话或限时挑战；
3. 包含时间动作时请明确写出秒数或分钟（如“深情对视30秒”、“抚摸锁骨1分钟”），系统将自动启动倒计时；
4. 严格保持原有的坐标 Key 值结构完全不变：
\`\`\`json
{json}
\`\`\``;

    const fullPrompt = promptTemplate.replace("{json}", currentJson);

    const m = LG.openModal(`
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-xl font-bold flex items-center gap-2">🤖 ${esc(L("buttons.aiGenerateEvents") || "AI生成事件库")}</h3>
        <button id="ai-close" class="rounded-full bg-white/10 h-7 w-7 text-sm hover:bg-white/20">✕</button>
      </div>
      <p class="text-xs text-white/60 mb-3">${esc(L("buttons.generatePromptTitle") || "将复制后的文字粘贴到任意 AI 聊天助手中，即可获得全新的专属事件库")}</p>
      <textarea id="ai-prompt-area" rows="12" class="w-full rounded-xl border border-white/15 bg-black/60 p-3 font-mono text-[11px] leading-5 text-zinc-200 focus:outline-none focus:border-amber-400/60" readonly>${esc(fullPrompt)}</textarea>
      <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p class="text-[11px] text-pink-300">💡 提示：AI 回复生成后，直接进入【🔧 JSON面板】粘贴导入即可！</p>
        <button id="btn-copy-ai" class="rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-fuchsia-500 px-6 py-2.5 text-xs font-extrabold text-white shadow-lg hover:scale-105 active:scale-95 transition">
          📋 复制全部提示词
        </button>
      </div>`, { maxW: "max-w-2xl" });

    m.el.querySelector("#ai-close").onclick = () => m.close();
    m.el.querySelector("#btn-copy-ai").onclick = async () => {
      try {
        await navigator.clipboard.writeText(fullPrompt);
        LG.toast(L("buttons.promptCopied") || "提示词已复制到剪贴板！快去问 AI 吧！");
      } catch (err) {
        const ta = m.el.querySelector("#ai-prompt-area");
        ta.select();
        document.execCommand("copy");
        LG.toast(L("buttons.promptCopied") || "已复制！");
      }
    };
  }

  /* ================= 格子 Hover 与触摸 Tooltip ================= */
  let tooltipEl = null;
  let activeTouchCell = null;
  function bindCellHover() {
    tooltipEl = document.getElementById("cell-tooltip");
    const board = document.getElementById("board");
    if (!board || !tooltipEl) return;

    const closeBtn = document.getElementById("tt-close-btn");
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.stopPropagation();
        tooltipEl.classList.add("hidden");
        activeTouchCell = null;
      };
    }

    const showTooltipFor = (cell, clientX, clientY) => {
      const [r, c] = cell.getAttribute("data-cell").split("-").map(Number);
      const ev = getEvent(r, c);
      const eff = getEffect(r, c);
      const isFlight = FLIGHT_MAP[`${r}-${c}`];

      if (!ev && !eff && !isFlight) {
        tooltipEl.classList.add("hidden");
        return;
      }

      const coordEl = document.getElementById("tt-coord");
      const typeEl = document.getElementById("tt-type");
      const titleEl = document.getElementById("tt-title");
      const descEl = document.getElementById("tt-desc");
      const effEl = document.getElementById("tt-eff");

      if (coordEl) coordEl.textContent = `坐标 [${r + 1}, ${c + 1}]`;
      if (typeEl) typeEl.textContent = isFlight ? "航线" : eff ? "特殊" : "事件";
      if (titleEl) titleEl.textContent = ev ? (ev.name || "未命名格子") : (isFlight ? "近道航线" : "特殊格");
      if (descEl) descEl.textContent = ev ? (ev.description || "无详细描述") : "";

      if (effEl) {
        if (eff) {
          effEl.classList.remove("hidden");
          effEl.textContent = eff === "forward2" ? "⬆️ 奖励：前进 2 格" : eff === "backward2" ? "⬇️ 惩罚：后退 2 格" : "⏸️ 休息：暂停 1 回合";
        } else if (isFlight) {
          effEl.classList.remove("hidden");
          effEl.textContent = "✈️ 专属近道：直达对角目标格";
        } else {
          effEl.classList.add("hidden");
        }
      }

      const rect = cell.getBoundingClientRect();
      const posX = clientX || (rect.left + rect.width / 2);
      const posY = clientY || rect.top;

      let x = Math.min(window.innerWidth - 270, Math.max(16, posX + 12));
      let y = posY + 16;
      if (y + 190 > window.innerHeight) {
        y = Math.max(16, posY - 190);
      }

      tooltipEl.style.left = `${x}px`;
      tooltipEl.style.top = `${y}px`;
      tooltipEl.classList.remove("hidden");
    };

    board.onmouseover = (e) => {
      if (editMode) return;
      const cell = e.target.closest("[data-cell]");
      if (!cell) return;
      showTooltipFor(cell, e.clientX, e.clientY);
    };

    board.onmousemove = (e) => {
      if (!tooltipEl || tooltipEl.classList.contains("hidden")) return;
      if (activeTouchCell) return;
      const x = Math.min(window.innerWidth - 270, Math.max(16, e.clientX + 14));
      const y = Math.min(window.innerHeight - 170, Math.max(16, e.clientY + 14));
      tooltipEl.style.left = `${x}px`;
      tooltipEl.style.top = `${y}px`;
    };

    board.onmouseleave = () => {
      if (tooltipEl && !activeTouchCell) tooltipEl.classList.add("hidden");
    };

    // 移动端与平板触屏轻触格子检视事件
    board.onclick = (e) => {
      if (editMode) return;
      if (e.target.closest("[data-piece]")) return;
      const cell = e.target.closest("[data-cell]");
      if (!cell) return;
      activeTouchCell = cell;
      showTooltipFor(cell, e.clientX, e.clientY);
    };

    document.onclick = (e) => {
      if (!tooltipEl || tooltipEl.classList.contains("hidden")) return;
      if (!e.target.closest("#board") && !e.target.closest("#cell-tooltip")) {
        tooltipEl.classList.add("hidden");
        activeTouchCell = null;
      }
    };
  }

  /* ================= 单格事件编辑器 ================= */
  let editMode = false;
  let boardBound = false;
  function openEditor() {
    editMode = !editMode;
    if (!boardBound) {
      document.getElementById("board").addEventListener("click", (e) => {
        if (!editMode) return;
        const cell = e.target.closest("[data-cell]");
        if (!cell) return;
        const [r, c] = cell.getAttribute("data-cell").split("-").map(Number);
        openEditCell(r, c);
      });
      boardBound = true;
    }
    const b = document.getElementById("btn-edit");
    if (b) {
      b.classList.toggle("bg-amber-400/25", editMode);
      b.classList.toggle("border-amber-400/80", editMode);
    }
    if (editMode) {
      LG.toast(L("editor.notice") || "编辑模式已开启：点击任意格子即可修改事件", 3500);
    } else {
      LG.toast("已退出编辑模式");
    }
  }

  function openEditCell(r, c) {
    const k = `${r}-${c}`;
    const cur = getEvent(r, c) || { name: "", description: "" };

    const m = LG.openModal(`
      <div class="flex items-center justify-between mb-3 text-left">
        <h3 class="text-xl font-bold">${esc(L("editor.title"))}</h3>
        <span class="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-0.5 text-xs text-amber-200 font-mono">
          ${esc(L("editor.position", { coordinates: `${r + 1}, ${c + 1}` }))}
        </span>
      </div>
      <div class="space-y-4 text-left">
        <div>
          <label class="text-xs uppercase tracking-widest text-white/50">${esc(L("editor.nameLabel"))}</label>
          <input id="ed-name" class="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm focus:border-amber-400/60 focus:outline-none" placeholder="${esc(L("editor.namePlaceholder"))}" value="${esc(cur.name || "")}">
        </div>
        <div>
          <label class="text-xs uppercase tracking-widest text-white/50">${esc(L("editor.descriptionLabel"))}</label>
          <textarea id="ed-desc" rows="4" class="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm focus:border-amber-400/60 focus:outline-none" placeholder="${esc(L("editor.descriptionPlaceholder"))}">${esc(cur.description || "")}</textarea>
        </div>
      </div>
      <div class="mt-6 flex justify-end gap-2">
        <button id="ed-cancel" class="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold hover:bg-white/20">${esc(L("editor.cancel"))}</button>
        <button id="ed-save" class="rounded-full bg-gradient-to-r from-amber-400 to-rose-500 px-6 py-2 text-sm font-bold shadow-md hover:scale-105 transition">💾 ${esc(L("editor.save"))}</button>
      </div>`);

    m.el.querySelector("#ed-cancel").onclick = () => m.close();
    m.el.querySelector("#ed-save").onclick = () => {
      const name = m.el.querySelector("#ed-name").value.trim();
      const desc = m.el.querySelector("#ed-desc").value.trim();
      const ce = customEvents[settings.playerMode];
      if (!name && !desc) delete ce[k];
      else ce[k] = { name: name, description: desc };
      LG.saveJSON("lovegame-ludo-custom-events", customEvents);
      rebuildEventTable();
      renderBoard();
      renderPieces();
      m.close();
      LG.toast(L("editor.messages.saved"));
    };
  }

  /* ================= 历史记录面板 ================= */
  function openHistory() {
    let items = history.map((h) => {
      const col = P_COL[h.player] || { txt: "text-white", dot: "bg-white" };
      const d = new Date(h.at);
      const tm = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      return `
      <div class="rounded-xl border border-white/10 bg-white/5 p-3 text-left">
        <div class="flex items-center justify-between text-[11px] text-white/50 mb-1">
          <span class="inline-flex items-center gap-1.5 font-bold ${col.txt}">
            <span class="h-2 w-2 rounded-full ${col.dot}"></span>
            ${esc(playerBadge(h.player))} · 🎲 ${h.dice} 点
          </span>
          <span class="font-mono">${tm}</span>
        </div>
        <p class="whitespace-pre-line text-xs leading-relaxed text-white/85 font-medium">${esc(h.text || "")}</p>
      </div>`;
    }).join("");

    if (!items) {
      items = `
        <div class="text-center py-10">
          <p class="text-5xl mb-3">🎲</p>
          <p class="text-sm font-bold text-white/80">${esc(L("history.emptyTitle"))}</p>
          <p class="text-xs text-white/50 mt-1">${esc(L("history.emptySubtitle"))}</p>
        </div>`;
    }

    const m = LG.openModal(`
      <div class="flex items-center justify-between mb-3 text-left">
        <h3 class="text-xl font-bold flex items-center gap-2">🕘 ${esc(L("history.title"))}</h3>
        <button id="h-close" class="rounded-full bg-white/10 h-7 w-7 text-sm hover:bg-white/20">✕</button>
      </div>
      <p class="text-xs text-white/50 mb-3 text-left">${esc(L("history.subtitle"))}</p>
      <div class="space-y-2 max-h-[60vh] overflow-y-auto pr-1">${items}</div>`, { maxW: "max-w-md" });

    m.el.querySelector("#h-close").onclick = () => m.close();
  }

  /* ================= JSON / TXT 导入导出面板 ================= */
  function openJson() {
    const snapshot = JSON.stringify(
      {
        settings: {
          pieceCount: settings.pieceCount,
          playerMode: settings.playerMode,
          requireExactHomeEntry: settings.requireExactHomeEntry,
          enableBump: settings.enableBump,
          easyStart: settings.easyStart
        },
        events: currentEventSnapshot()
      },
      null,
      2
    );

    const m = LG.openModal(`
      <div class="flex items-center justify-between mb-2 text-left">
        <h3 class="text-xl font-bold flex items-center gap-2">🔧 ${esc(L("json.title"))}</h3>
        <button id="j-close" class="rounded-full bg-white/10 h-7 w-7 text-sm hover:bg-white/20">✕</button>
      </div>
      <p class="text-xs text-white/50 mb-3 text-left">${esc(L("json.subtitle"))}</p>
      <textarea id="j-ta" rows="12" class="w-full rounded-xl border border-white/15 bg-black/60 p-3 font-mono text-[11px] leading-5 text-zinc-200 focus:border-amber-400/50 focus:outline-none" placeholder="${esc(L("json.placeholder"))}">${esc(snapshot)}</textarea>
      <div class="mt-4 flex flex-wrap gap-2 justify-end">
        <label class="cursor-pointer rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold hover:bg-white/10 transition">
          📥 ${esc(L("json.importFileButton"))}
          <input id="j-file" type="file" accept=".txt,.json,.dat" class="hidden">
        </label>
        <button id="j-apply" class="rounded-xl border border-emerald-400/40 bg-emerald-500/15 px-4 py-2 text-xs font-semibold text-emerald-100 hover:bg-emerald-500/25 transition">
          ✅ ${esc(L("json.import"))}
        </button>
        <button id="j-export" class="rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 px-4 py-2 text-xs font-bold shadow-md hover:scale-105 transition">
          📤 ${esc(L("json.exportFileButton"))}
        </button>
      </div>`, { maxW: "max-w-xl" });

    const ta = m.el.querySelector("#j-ta");
    m.el.querySelector("#j-close").onclick = () => m.close();

    m.el.querySelector("#j-export").onclick = () => {
      const blob = new Blob([ta.value], { type: "text/plain;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "lovegame-ludo.txt";
      a.click();
      URL.revokeObjectURL(a.href);
      LG.toast(L("editor.messages.exportSuccess"));
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
          Object.keys(data.events).forEach((k) => {
            const e = data.events[k];
            customEvents[settings.playerMode][k] = { name: e.name || "", description: e.description || "" };
          });
          LG.saveJSON("lovegame-ludo-custom-events", customEvents);
        }
        resetGameState();
        render();
        m.close();
        LG.toast(L("editor.messages.importSuccess"));
      } catch (err) {
        LG.toast(L("editor.errors.invalidFormat"));
      }
    }

    m.el.querySelector("#j-apply").onclick = () => applyJson(ta.value);
    m.el.querySelector("#j-file").addEventListener("change", (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        ta.value = r.result;
        applyJson(r.result);
      };
      r.readAsText(f);
    });
  }

  /* ================= 布局切换与屏幕方向监听 ================= */
  function bindLayoutSwitcher() {
    const bar = document.getElementById("layout-switch-bar");
    if (!bar) return;
    bar.querySelectorAll("[data-layout-mode]").forEach((btn) => {
      btn.onclick = () => {
        const mode = btn.getAttribute("data-layout-mode");
        if (userLayoutMode === mode) return;
        userLayoutMode = mode;
        LG.saveJSON("lovegame-ludo-layout-mode", userLayoutMode);
        rebuildShell();
        const modeNames = {
          desktop: "电脑布局",
          tablet: "平板双栏模式",
          mobile: "手机紧凑模式",
          auto: "自动适配模式"
        };
        LG.toast(`已切换为：${modeNames[mode] || mode}`);
      };
    });
  }

  function rebuildShell() {
    shell();
    render();
    bindToolbar();
    bindLayoutSwitcher();
  }

  let resizeTimer = null;
  let lastEffMode = getEffectiveLayoutMode();
  function handleResizeOrOrientation() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const curEff = getEffectiveLayoutMode();
      if (userLayoutMode === "auto" && curEff !== lastEffMode) {
        lastEffMode = curEff;
        rebuildShell();
      } else {
        renderBoard();
        renderPieces();
      }
    }, 120);
  }
  window.addEventListener("resize", handleResizeOrOrientation);
  window.addEventListener("orientationchange", handleResizeOrOrientation);

  // 绑定工具栏按钮
  function bindToolbar() {
    const editBtn = document.getElementById("btn-edit");
    if (editBtn) editBtn.onclick = openEditor;

    const libBtn = document.getElementById("btn-library");
    if (libBtn) libBtn.onclick = openLibrary;

    const rulesBtn = document.getElementById("btn-rules");
    if (rulesBtn) rulesBtn.onclick = openSettings;

    const aiBtn = document.getElementById("btn-ai-prompt");
    if (aiBtn) aiBtn.onclick = openAiPromptGenerator;

    const histBtn = document.getElementById("btn-history");
    if (histBtn) histBtn.onclick = openHistory;

    const jsonBtn = document.getElementById("btn-json");
    if (jsonBtn) jsonBtn.onclick = openJson;

    const rstBtn = document.getElementById("btn-reset");
    if (rstBtn) {
      rstBtn.onclick = () => {
        if (confirm("确定要重新开始本局游戏吗？")) {
          resetGameState();
          render();
          LG.toast("游戏已重置");
        }
      };
    }
  }

  // 启动运行
  resetGameState();
  rebuildShell();

})();
