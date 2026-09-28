/* 专属亲密报告 statistics —— 纯静态复刻（纯 SVG/CSS 图表） */
(function () {
  const LG = window.LG, M = window.MESSAGES;
  const ST = M.statistics;
  const esc = LG.escapeHtml;
  const root = document.getElementById("statistics-root");

  const data = LG.getStatistics();
  const PALETTE = ["#ec4899", "#8b5cf6", "#3b82f6", "#f59e0b", "#10b981"];

  /* ---------- 派生数据 ---------- */
  const radarData = [
    { subject: ST.charts.romance, A: data.attributeScores.romance, fullMark: 500 },
    { subject: ST.charts.daring, A: data.attributeScores.daring, fullMark: 500 },
    { subject: ST.charts.intimacy, A: data.attributeScores.intimacy, fullMark: 500 },
    { subject: ST.charts.fun, A: data.attributeScores.fun, fullMark: 500 },
    { subject: ST.charts.passion, A: data.attributeScores.passion, fullMark: 500 },
  ];
  const pieData = Object.entries(data.gameDistribution)
    .map(([g, v]) => ({ name: ST.charts[g] || g, value: v }))
    .filter((d) => d.value > 0);
  const isPieEmpty = pieData.length === 0;
  const pieShown = isPieEmpty ? [{ name: "None", value: 1 }] : pieData;
  const trendData = data.recentActivity.map((v, i) => ({ name: "D" + (i + 1), value: v }));
  const todData = [
    { name: ST.times.morning, value: data.timeOfDay.morning },
    { name: ST.times.afternoon, value: data.timeOfDay.afternoon },
    { name: ST.times.evening, value: data.timeOfDay.evening },
    { name: ST.times.night, value: data.timeOfDay.night },
  ];
  const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const weekData = data.dayOfWeek.map((v, i) => ({ name: ST.days[dayKeys[i]], value: v }));

  const intimacyPct = Math.round(
    (["romance", "daring", "intimacy", "fun", "passion"].reduce((s, k) => s + data.attributeScores[k], 0) / 2500) * 100);
  const xpLow = 500 * Math.pow(data.level - 1, 2);
  const xpHigh = 500 * Math.pow(data.level, 2);
  const xpPct = Math.min(100, Math.max(0, ((data.xp - xpLow) / (xpHigh - xpLow)) * 100));
  const lv = data.level;
  const titleKey = lv >= 50 ? "eternalDevotion" : lv >= 40 ? "starseaVow" : lv >= 30 ? "trueLoveNavigator"
    : lv >= 20 ? "heartbeatSentinel" : lv >= 15 ? "sweetOdyssey" : lv >= 10 ? "nocturneHeartseeker"
      : lv >= 7 ? "crimsonGuardian" : lv >= 5 ? "emberLover" : lv >= 3 ? "neonWhispers" : "glimmeringFirstLove";
  const levelTitle = ST.levelTitles[titleKey];
  const lvStyle = lv >= 50
    ? { c: "border-pink-300/60 bg-pink-500/15 shadow-[0_0_25px_rgba(236,72,153,0.45)]", t: "text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-fuchsia-300 to-purple-200" }
    : lv >= 30 ? { c: "border-pink-400/40 bg-white/10 shadow-[0_0_15px_rgba(236,72,153,0.25)]", t: "text-pink-100/90" }
      : lv >= 10 ? { c: "border-white/15 bg-white/5", t: "text-pink-200/80" }
        : { c: "border-white/10 bg-white/5", t: "text-white/70" };

  /* ================= 图表：雷达 ================= */
  function radarHTML(d) {
    const n = d.length, ang = (2 * Math.PI) / n;
    const P = (t, a) => {
      const s = a * ang - Math.PI / 2;
      const r = (t / (d[0].fullMark || 100)) * 100;
      return { x: 140 + r * Math.cos(s), y: 140 + r * Math.sin(s) };
    };
    const poly = d.map((e, i) => { const p = P(e.A, i); return `${p.x},${p.y}`; }).join(" ");
    let rings = "";
    [0.2, 0.4, 0.6, 0.8, 1].forEach((e, i) => {
      rings += `<circle cx="140" cy="140" r="${100 * e}" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1" stroke-dasharray="4 4"/>`;
    });
    let axes = d.map((e, i) => { const p = P(100, i); return `<line x1="140" y1="140" x2="${p.x}" y2="${p.y}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`; }).join("");
    let labels = d.map((e, i) => {
      const p = P(1.12 * (d[0].fullMark || 100), i);
      return `<text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="middle" fill="rgba(255,255,255,0.6)" font-size="11" font-weight="500">${esc(e.subject)}</text>`;
    }).join("");
    let dots = d.map((e, i) => {
      const p = P(e.A, i);
      return `<g class="radar-dot" style="cursor:pointer">
        <circle cx="${p.x}" cy="${p.y}" r="7" fill="transparent"></circle>
        <circle cx="${p.x}" cy="${p.y}" r="4" fill="#fff" stroke="#ec4899" stroke-width="2" class="transition-all duration-200"></circle>
        <g class="radar-tip" opacity="0">
          <rect x="${p.x - 20}" y="${p.y - 30}" width="40" height="20" rx="4" fill="#111" stroke="#ec4899" stroke-width="1"/>
          <text x="${p.x}" y="${p.y - 20}" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="10" font-weight="bold">${Math.round(e.A)}</text>
        </g></g>`;
    }).join("");
    return `<svg width="100%" height="100%" viewBox="0 0 280 280" class="overflow-visible">
      <defs>
        <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stop-color="#ec4899" stop-opacity="0.6"/><stop offset="100%" stop-color="#ec4899" stop-opacity="0.1"/>
        </radialGradient>
        <filter id="radarGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      ${rings}${axes}
      <polygon points="${poly}" fill="url(#radarGradient)" stroke="#ec4899" stroke-width="2" filter="url(#radarGlow)" class="transition-all duration-500 ease-out"/>
      ${labels}${dots}
    </svg>`;
  }

  /* ================= 图表：柱状 ================= */
  function barHTML(d, color) {
    const max = Math.max(...d.map((e) => e.value), 1);
    let grid = [0, 0.25, 0.5, 0.75, 1].map((e, i) =>
      `<div class="w-full h-px bg-white/5 relative">${i % 2 === 0 ? `<span class="absolute -left-6 -top-2 text-[9px] text-white/20">${Math.round(max * (1 - e))}</span>` : ""}</div>`).join("");
    let bars = d.map((e, i) => {
      const h = (e.value / max) * 100;
      const c = color || PALETTE[i % PALETTE.length];
      return `<div class="relative flex flex-col items-center flex-1 h-full justify-end z-10 group">
        <div class="w-full max-w-[40px] min-h-[6px] rounded-t-lg transition-all duration-500 ease-out relative group-hover:brightness-125 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]" style="height:${h}%;background-color:${c};background-image:linear-gradient(to bottom,rgba(255,255,255,0.2),rgba(0,0,0,0.1))">
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/90 border border-white/20 rounded-lg text-xs font-bold text-white whitespace-nowrap opacity-0 translate-y-2 scale-95 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 z-20">${e.value}</div>
        </div>
        <div class="mt-3 text-[10px] font-medium text-center truncate w-full text-white/40 group-hover:text-white transition-colors">${esc(e.name)}</div>
      </div>`;
    }).join("");
    return `<div class="flex items-end justify-between h-full gap-3 w-full px-4 pb-6 relative">
      <div class="absolute inset-0 flex flex-col justify-between pointer-events-none px-4 pb-12">${grid}</div>
      ${bars}
    </div>`;
  }

  /* ================= 图表：饼图 ================= */
  function pieHTML(d, empty) {
    const total = d.reduce((s, e) => s + e.value, 0);
    const segs = d.map((e, i) => {
      const start = d.slice(0, i).reduce((s, x) => s + x.value, 0);
      return { ...e, start: (start / total) * 100, end: ((start + e.value) / total) * 100, color: PALETTE[i % PALETTE.length], index: i };
    });
    const grad = empty ? ["#333 0% 100%"] : segs.map((e) => `${e.color} ${e.start}% ${e.end}%`);
    let legend = segs.map((e) => `
      <div data-pie="${e.index}" class="pie-legend flex items-center justify-between p-3 rounded-xl border transition-all duration-200 cursor-pointer bg-white/5 border-transparent hover:bg-white/10">
        <div class="flex items-center gap-3">
          <div class="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" style="background-color:${empty ? "#333" : e.color};color:${empty ? "#333" : e.color}"></div>
          <span class="text-sm font-medium text-white/70">${esc(e.name)}</span>
        </div>
        <span class="text-sm font-bold text-white/40">${empty ? "0%" : (Math.round((e.value / total) * 100) || 0) + "%"}</span>
      </div>`).join("");
    return `<div class="flex flex-col md:flex-row items-center justify-evenly gap-8 w-full max-w-4xl mx-auto">
      <div class="relative h-[260px] w-[260px] shrink-0 group">
        <div id="pie-blur" class="absolute inset-0 rounded-full blur-2xl opacity-20 transition-colors duration-500" style="background:#fff"></div>
        <div class="rounded-full relative z-10 shadow-2xl" style="width:100%;height:100%;background:conic-gradient(${grad.join(",")})"></div>
        <div class="absolute inset-[40px] bg-[#131313] rounded-full flex flex-col items-center justify-center z-20 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
          <div id="pie-cname" class="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Total</div>
          <div id="pie-cval" class="text-4xl font-black text-white drop-shadow-lg">${empty ? 0 : total}</div>
          <div id="pie-csub" class="text-xs text-white/60 mt-1"></div>
        </div>
      </div>
      <div class="flex flex-col gap-3 w-full max-w-[240px]">${legend}</div>
    </div>`;
  }

  /* ================= 成就卡 ================= */
  function achievementHTML(id) {
    const unlocked = data.achievements.includes(id);
    const progress = LG.getAchievementProgress(id, data);
    const col = unlocked
      ? { p: "#ff69b4", s: "#ff1493", glow: "rgba(255,105,180,0.6)" }
      : progress >= 75 ? { p: "#ff6bcb", s: "#e879f9", glow: "rgba(255,107,203,0.5)" }
        : progress >= 50 ? { p: "#60a5fa", s: "#3b82f6", glow: "rgba(96,165,250,0.4)" }
          : { p: "#6b7280", s: "#4b5563", glow: "rgba(107,114,128,0.2)" };
    const C = 80 * Math.PI;
    const offset = C - (progress / 100) * C;
    const cardCls = unlocked
      ? "bg-gradient-to-br from-pink-500/12 to-fuchsia-500/12 border-pink-400/30 shadow-[0_0_15px_rgba(255,105,180,0.2)] hover:shadow-[0_0_35px_rgba(255,105,180,0.5)]"
      : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10";
    return `<div class="group relative p-5 rounded-2xl border transition-all duration-500 hover:-translate-y-1 ${cardCls}">
      <div class="relative w-20 h-20 mx-auto mb-3">
        <svg viewBox="0 0 84 84" class="absolute inset-0 w-full h-full -rotate-90">
          <defs>
            <linearGradient id="ag-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${col.p}"/><stop offset="100%" stop-color="${col.s}"/>
            </linearGradient>
          </defs>
          <circle cx="42" cy="42" r="40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="4"/>
          ${progress > 0 ? `<circle cx="42" cy="42" r="40" fill="none" stroke="url(#ag-${id})" stroke-width="4" stroke-dasharray="${C} ${C}" stroke-dashoffset="${offset}" stroke-linecap="round" class="transition-all duration-1000 ease-out"/>` : ""}
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <div class="text-3xl ${unlocked ? "group-hover:scale-150 group-hover:animate-bounce transition-transform duration-700" : progress > 0 ? "scale-90" : "scale-75 grayscale opacity-40"}"
            style="${unlocked ? "filter:drop-shadow(0 0 10px rgba(255,105,180,0.9))" : ""}">${unlocked ? "🏆" : "🔒"}</div>
          ${!unlocked && progress > 0 ? `<div class="text-[10px] font-bold mt-0.5" style="color:${col.p}">${Math.round(progress)}%</div>` : ""}
        </div>
      </div>
      <div class="text-center font-medium text-sm mb-1 ${unlocked ? "text-white" : progress > 0 ? "text-white/70" : "text-white/40"}">${esc(ST.achievements[id])}</div>
      <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 max-w-[48vw] p-3 bg-gradient-to-br from-gray-900 to-black border border-white/30 rounded-xl text-xs font-medium text-white text-center opacity-0 scale-90 pointer-events-none transition-all duration-300 z-50 shadow-2xl origin-bottom group-hover:opacity-100 group-hover:scale-100">
        <div class="font-bold mb-1 ${unlocked ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-pink-500" : "text-pink-300"}">${esc(ST.achievements[id])}</div>
        ${unlocked ? `<div class="text-white/80">${esc(ST.achievementsDesc[id])}</div>` : progress > 0 ? `
        <div class="mt-2 pt-2 border-t border-white/20">
          <div class="flex justify-between items-center text-[10px]"><span class="text-white/60">${esc(ST.progress)}</span><span class="font-bold" style="color:${col.p}">${Math.round(progress)}%</span></div>
          <div class="mt-1 h-1 bg-white/10 rounded-full overflow-hidden"><div class="h-full rounded-full" style="width:${progress}%;background:linear-gradient(90deg,${col.p},${col.s})"></div></div>
        </div>` : ""}
        <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black border-b border-r border-white/30 rotate-45"></div>
      </div>
    </div>`;
  }

  /* ================= 卡片 ================= */
  function bigCard(title, value, icon, grad, delay) {
    return `<div class="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 animate-pop-in" style="animation-delay:${delay}s">
      <div class="flex items-start justify-between">
        <div><p class="text-sm font-medium text-white/50">${esc(title)}</p>
          <div class="mt-2 text-4xl font-bold tracking-tight text-white drop-shadow-lg">${value}</div></div>
        <div class="text-3xl transition-all group-hover:scale-110">${icon}</div>
      </div>
    </div>`;
  }
  function smallCard(title, value, delay) {
    return `<div class="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center backdrop-blur-md transition-colors hover:bg-white/10 animate-pop-in" style="animation-delay:${delay}s">
      <span class="text-2xl font-bold text-white">${value}</span>
      <span class="text-xs font-medium text-white/50 uppercase tracking-wider mt-1">${esc(title)}</span>
    </div>`;
  }

  const detailItems = [
    ["truths", data.detailStats.truthsChosen], ["dares", data.detailStats.daresChosen],
    ["moves", data.detailStats.ludoMoves], ["rolls", data.detailStats.diceRolls],
    ["dicePenalties", data.detailStats.dicePenalties || 0], ["diceWins", data.detailStats.diceWins || 0],
    ["slotsWins", data.detailStats.slotsWins || 0], ["ludoSixes", data.detailStats.ludoSixes],
    ["ludoWinner", data.detailStats.ludoWinner], ["ludoEvents", data.detailStats.ludoEvents],
    ["slotsSpins", data.detailStats.slotsSpins], ["totalWeekendSessions", data.detailStats.totalWeekendSessions],
  ];

  /* ================= 渲染 ================= */
  root.innerHTML = `
  <div class="mb-12 w-full max-w-2xl mx-auto animate-pop-in">
    <div class="flex justify-between items-end mb-2 flex-wrap gap-2">
      <span class="text-2xl font-bold text-pink-400">${esc(ST.level)} ${data.level}</span>
      <div class="flex items-center gap-3">
        <span class="text-sm text-white/60">${esc(ST.xp)}: ${Math.floor(data.xp)} / ${xpHigh}</span>
        <button id="btn-share" class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 transition hover:border-pink-400/40 hover:text-white hover:bg-pink-500/10">
          <svg class="h-3.5 w-3.5 text-pink-300" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a3.27 3.27 0 0 0 0-1.39l7.05-4.11A2.99 2.99 0 1 0 15 5a2.9 2.9 0 0 0 .04.49L8 9.6a3 3 0 1 0 0 4.8l7.04 4.11c-.03.16-.04.32-.04.49a3 3 0 1 0 3-3.92z"/></svg>
          ${esc(ST.shareButton)}
        </button>
      </div>
    </div>
    <div class="h-4 w-full bg-white/10 rounded-full overflow-hidden">
      <div class="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-1000 ease-out" style="width:${xpPct}%"></div>
    </div>
    <div class="mt-3 flex items-center justify-center">
      <span class="rounded-full border px-4 py-1 text-xs font-semibold tracking-[0.12em] ${lvStyle.c} ${lvStyle.t}">${esc(levelTitle)}</span>
    </div>
  </div>

  <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
    ${bigCard(ST.intimacyScore, intimacyPct + "%", "❤️", "", 0.1)}
    ${bigCard(ST.activePlayers, data.totalSessions, "🎮", "", 0.2)}
    ${bigCard(ST.streak, data.streak.current, "🔥", "", 0.3)}
    ${bigCard(ST.totalKisses, data.totalInteractions, "💋", "", 0.4)}
  </div>

  <div class="mb-12 grid gap-4 grid-cols-2 sm:grid-cols-4">
    ${detailItems.map((d, i) => smallCard(ST.details[d[0]], d[1], 0.5 + i * 0.05)).join("")}
  </div>

  <div class="grid gap-8 lg:grid-cols-2 mb-12">
    <div class="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl hover:bg-white/10 animate-pop-in" style="animation-delay:0.5s">
      <div class="mb-6"><h3 class="text-xl font-semibold text-white">${esc(ST.attributeAnalysis)}</h3></div>
      <div class="h-[350px] w-full flex items-center justify-center">${radarHTML(radarData)}</div>
    </div>
    <div class="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl hover:bg-white/10 animate-pop-in" style="animation-delay:0.6s">
      <div class="mb-6"><h3 class="text-xl font-semibold text-white">${esc(ST.activityTrends)}</h3></div>
      <div class="h-[350px] w-full">${barHTML(trendData)}</div>
    </div>
    <div class="lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl hover:bg-white/10 animate-pop-in" style="animation-delay:0.7s">
      <div class="mb-6"><h3 class="text-xl font-semibold text-white">${esc(ST.gamePopularity)}</h3></div>
      <div class="flex justify-center w-full py-4" id="pie-wrap">${pieHTML(pieShown, isPieEmpty)}</div>
    </div>
    <div class="lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl hover:bg-white/10 animate-pop-in" style="animation-delay:0.8s">
      <div class="mb-6"><h3 class="text-xl font-semibold text-white">${esc(ST.timeOfDay)}</h3></div>
      <div class="h-[300px] w-full">${barHTML(todData, "#3b82f6")}</div>
    </div>
    <div class="lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl hover:bg-white/10 animate-pop-in" style="animation-delay:0.9s">
      <div class="mb-6"><h3 class="text-xl font-semibold text-white">${esc(ST.weeklyRhythm)}</h3></div>
      <div class="h-[300px] w-full">${barHTML(weekData, "#10b981")}</div>
    </div>
  </div>

  <div class="mb-12 animate-pop-in" style="animation-delay:1s">
    <h3 class="text-2xl font-bold mb-6 text-center">${esc(ST.achievementsTitle)}</h3>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      ${Object.keys(ST.achievements).filter((k) => k !== "unlocked").map(achievementHTML).join("")}
    </div>
  </div>`;

  /* ---------- 雷达 tooltip（CSS 兜底，JS 增强） ---------- */
  root.querySelectorAll(".radar-dot").forEach((g) => {
    const tip = g.querySelector(".radar-tip");
    g.addEventListener("mouseenter", () => { tip.setAttribute("opacity", "1"); });
    g.addEventListener("mouseleave", () => { tip.setAttribute("opacity", "0"); });
  });

  /* ---------- 饼图交互 ---------- */
  const total = pieShown.reduce((s, e) => s + e.value, 0);
  const cname = document.getElementById("pie-cname");
  const cval = document.getElementById("pie-cval");
  const csub = document.getElementById("pie-csub");
  const blur = document.getElementById("pie-blur");
  root.querySelectorAll(".pie-legend").forEach((el) => {
    const idx = Number(el.getAttribute("data-pie"));
    const seg = pieShown[idx];
    el.addEventListener("mouseenter", () => {
      if (isPieEmpty) return;
      cname.textContent = seg.name;
      cval.textContent = Math.round((seg.value / total) * 100) + "%";
      csub.textContent = seg.value + " Plays";
      cval.style.color = PALETTE[idx % PALETTE.length];
      blur.style.background = PALETTE[idx % PALETTE.length];
    });
    el.addEventListener("mouseleave", () => {
      cname.textContent = "Total";
      cval.textContent = total; cval.style.color = "white";
      csub.textContent = ""; blur.style.background = "#fff";
    });
  });

  /* ---------- 分享：生成分享图 ---------- */
  document.getElementById("btn-share").onclick = async () => {
    try {
      const blob = await buildShareImage();
      const file = new File([blob], "lovegame-achievements.jpg", { type: "image/jpeg" });
      const shareData = { title: ST.shareImage.title, text: ST.shareImage.subtitle, files: [file] };
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        const u = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = u; a.download = "lovegame-achievements.jpg"; a.click();
        URL.revokeObjectURL(u);
      }
    } catch (e) { if (String(e).indexOf("AbortError") < 0) LG.toast("分享失败"); }
  };

  async function buildShareImage() {
    const W2 = 1080, H2 = 1440;
    const cv = document.createElement("canvas"); cv.width = W2; cv.height = H2;
    const ctx = cv.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, W2, H2);
    g.addColorStop(0, "#120b1f"); g.addColorStop(0.4, "#2a1436"); g.addColorStop(1, "#3a1641");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W2, H2);
    // 标题
    ctx.fillStyle = "#FDF2F8";
    ctx.font = '700 66px "Poppins","Segoe UI",Arial,sans-serif';
    ctx.fillText(ST.shareImage.title, 80, 160);
    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.font = '400 36px "Poppins","Segoe UI",Arial,sans-serif';
    ctx.fillText(ST.shareImage.subtitle, 80, 220);
    // 二维码（qrcodejs 生成到临时元素的 canvas）
    const qrUrl = window.location.origin + window.location.pathname.replace("statistics.html", "index.html");
    let qrCanvas = null;
    if (window.QRCode) {
      const tmp = document.createElement("div");
      new QRCode(tmp, { text: qrUrl, width: 520, height: 520, correctLevel: QRCode.CorrectLevel.M });
      qrCanvas = tmp.querySelector("canvas");
    }
    // 白色卡片
    ctx.fillStyle = "rgba(255,255,255,0.09)";
    ctx.strokeStyle = "rgba(255,255,255,0.22)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(140, 380, 800, 820, 36); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath(); ctx.roundRect(262, 472, 556, 556, 22); ctx.fill();
    if (qrCanvas) ctx.drawImage(qrCanvas, 262, 472, 556, 556);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = '500 34px "Poppins","Segoe UI",Arial,sans-serif'; ctx.textAlign = "center";
    ctx.fillText(ST.shareImage.cta, 540, 1120);
    ctx.textAlign = "start";
    return new Promise((res, rej) => cv.toBlob((b) => b ? res(b) : rej(Error("toBlob")), "image/jpeg", 0.86));
  }
})();
