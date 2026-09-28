/* ============================================================
 * LoveGame 复刻版 - 共享核心
 * 工具函数 / 音效合成(Web Audio) / 统计系统 / 通用UI
 * ============================================================ */
(function (global) {
  "use strict";

  /* ---------------- 工具函数 ---------------- */
  function uuid() {
    if (global.crypto && crypto.randomUUID) return crypto.randomUUID();
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function randInt(n) { return Math.floor(Math.random() * n); }
  function dice1_6() { return Math.floor(6 * Math.random()) + 1; }
  function pick(arr) { return arr[randInt(arr.length)]; }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = randInt(i + 1);
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function loadJSON(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function saveJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  /* ---------------- 音效系统 (Web Audio 合成) ---------------- */
  var Sound = (function () {
    var ctx = null;
    function ensure() {
      if (!ctx) {
        var AC = global.AudioContext || global.webkitAudioContext;
        if (AC) ctx = new AC();
      }
      if (ctx && ctx.state === "suspended") ctx.resume();
      return ctx;
    }
    function tone(type, freq, dur, when, vol) {
      var c = ensure(); if (!c) return;
      vol = vol == null ? 0.1 : vol;
      var osc = c.createOscillator(), g = c.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, when);
      g.gain.setValueAtTime(vol, when);
      g.gain.exponentialRampToValueAtTime(0.01, when + dur);
      osc.connect(g); g.connect(c.destination);
      osc.start(when); osc.stop(when + dur);
    }
    var heartbeatTimer = null;
    function heartbeat() {
      var c = ensure(); if (!c) return;
      var t = c.currentTime;
      tone("sine", 60, 0.15, t, 0.3);
      tone("triangle", 40, 0.1, t, 0.1);
      tone("sine", 70, 0.1, t + 0.3, 0.25);
      tone("triangle", 50, 0.1, t + 0.3, 0.1);
      heartbeatTimer = setTimeout(heartbeat, 1200);
    }
    function play(name) {
      var c = ensure(); if (!c) return;
      var e = c.currentTime, i, n;
      switch (name) {
        case "flip":
          tone("sine", 800, 0.1, e, 0.1);
          tone("triangle", 1200, 0.05, e, 0.05);
          break;
        case "eat":
          tone("square", 150, 0.2, e, 0.15);
          tone("sawtooth", 100, 0.3, e, 0.15);
          tone("sine", 50, 0.4, e, 0.3);
          break;
        case "start":
          [220, 277, 330, 440].forEach(function (f, idx) {
            var osc = c.createOscillator(), g = c.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(f, e);
            osc.frequency.linearRampToValueAtTime(1.02 * f, e + 1.5);
            g.gain.setValueAtTime(0, e);
            g.gain.linearRampToValueAtTime(0.1, e + 0.1 + 0.05 * idx);
            g.gain.linearRampToValueAtTime(0, e + 2);
            osc.connect(g); g.connect(c.destination);
            osc.start(e); osc.stop(e + 2);
          });
          break;
        case "win":
          [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98].forEach(function (f, idx) {
            tone("triangle", f, 0.6, e + 0.08 * idx, 0.1);
            tone("sine", 2 * f, 0.8, e + 0.08 * idx, 0.05);
          });
          break;
        case "tick":
          tone("square", 800, 0.03, e, 0.05);
          tone("triangle", 2000, 0.03, e, 0.02);
          break;
        case "select":
          tone("sine", 440, 0.15, e, 0.1);
          tone("sine", 587.33, 0.2, e + 0.1, 0.1);
          break;
        case "fanfare":
          [523.25, 659.25, 783.99, 1046.5].forEach(function (f) {
            tone("sawtooth", f, 0.4, e, 0.08);
            tone("triangle", f, 0.4, e, 0.08);
          });
          break;
        case "roll":
          for (i = 0; i < 5; i++) {
            var when = e + (i / 5) * 0.35 + 0.04 * Math.random();
            var len = Math.floor(0.04 * c.sampleRate);
            var buf = c.createBuffer(1, len, c.sampleRate);
            var data = buf.getChannelData(0);
            for (n = 0; n < len; n++) data[n] = 2 * Math.random() - 1;
            var src = c.createBufferSource(); src.buffer = buf;
            var flt = c.createBiquadFilter();
            flt.type = "lowpass"; flt.frequency.value = 1500 + 500 * Math.random();
            var g = c.createGain();
            g.gain.setValueAtTime(0.12, when);
            g.gain.exponentialRampToValueAtTime(0.001, when + 0.03);
            src.connect(flt); flt.connect(g); g.connect(c.destination); src.start(when);
            var osc = c.createOscillator(), og = c.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(300 + 150 * Math.random(), when);
            og.gain.setValueAtTime(0.15, when);
            og.gain.exponentialRampToValueAtTime(0.001, when + 0.04);
            osc.connect(og); og.connect(c.destination);
            osc.start(when); osc.stop(when + 0.04);
          }
          break;
        case "success":
          tone("sine", 659.25, 0.3, e, 0.1);
          tone("sine", 880, 0.4, e + 0.1, 0.1);
          break;
        case "fail":
          tone("sawtooth", 440, 0.4, e, 0.1);
          tone("sawtooth", 311.13, 0.4, e + 0.1, 0.1);
          (function () {
            var osc = c.createOscillator(), g = c.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(200, e);
            osc.frequency.linearRampToValueAtTime(100, e + 0.4);
            g.gain.setValueAtTime(0.1, e);
            g.gain.linearRampToValueAtTime(0, e + 0.4);
            osc.connect(g); g.connect(c.destination);
            osc.start(e); osc.stop(e + 0.4);
          })();
          break;
        case "levelUp":
          [523.25, 659.25, 783.99, 1046.5].forEach(function (f, idx) {
            tone("square", f, 0.1, e + 0.05 * idx, 0.05);
          });
          break;
        case "spin":
          for (i = 0; i < 15; i++) {
            var w = e + 0.06 * i, f = 500 + 200 * Math.random();
            tone("triangle", f, 0.04, w, 0.06);
            tone("sine", 2 * f, 0.032, w, 0.03);
            tone("square", 4 * f, 0.016, w, 0.012);
          }
          break;
        case "stop":
          tone("sine", 523.25, 0.18, e, 0.12);
          tone("sine", 659.25, 0.22, e + 0.05, 0.08);
          break;
        case "jackpot":
          [1, 1.25, 1.5, 2, 1.5, 1.25, 1, 0.75, 1].forEach(function (mul, idx) {
            var w = e + 0.15 * idx;
            tone("square", 523.25 * mul, 0.2, w, 0.1);
            tone("sine", 523.25 * mul * 2, 0.3, w, 0.05);
            if (idx % 2 === 0) tone("sine", 2000 + 500 * Math.random(), 0.05, w, 0.05);
          });
          break;
        case "move":
          tone("sine", 300, 0.05, e, 0.2);
          tone("square", 150, 0.02, e, 0.1);
          break;
        case "fly":
          (function () {
            var len = Math.floor(0.5 * c.sampleRate);
            var buf = c.createBuffer(1, len, c.sampleRate);
            var data = buf.getChannelData(0);
            for (var k = 0; k < len; k++) data[k] = 2 * Math.random() - 1;
            var src = c.createBufferSource(); src.buffer = buf;
            var flt = c.createBiquadFilter();
            flt.type = "lowpass";
            flt.frequency.setValueAtTime(200, e);
            flt.frequency.linearRampToValueAtTime(2000, e + 0.4);
            var g = c.createGain();
            g.gain.setValueAtTime(0.1, e);
            g.gain.linearRampToValueAtTime(0, e + 0.5);
            src.connect(flt); flt.connect(g); g.connect(c.destination); src.start(e);
          })();
          break;
        case "land":
          tone("sine", 100, 0.15, e, 0.3);
          tone("triangle", 60, 0.2, e, 0.2);
          (function () {
            var len = Math.floor(0.1 * c.sampleRate);
            var buf = c.createBuffer(1, len, c.sampleRate);
            var data = buf.getChannelData(0);
            for (var k = 0; k < len; k++) data[k] = 2 * Math.random() - 1;
            var src = c.createBufferSource(); src.buffer = buf;
            var g = c.createGain();
            g.gain.setValueAtTime(0.1, e);
            g.gain.exponentialRampToValueAtTime(0.01, e + 0.1);
            src.connect(g); g.connect(c.destination); src.start(e);
          })();
          break;
      }
    }
    return {
      play: play,
      startHeartbeat: function () { if (!heartbeatTimer) heartbeat(); },
      stopHeartbeat: function () { if (heartbeatTimer) { clearTimeout(heartbeatTimer); heartbeatTimer = null; } }
    };
  })();

  /* ---------------- 统计系统 ---------------- */
  var STAT_KEY = "lovegame_statistics_v3";
  var DEFAULT_STATS = {
    totalSessions: 0, totalDurationMinutes: 0, totalInteractions: 0,
    xp: 0, level: 1,
    gameDistribution: { ludo: 0, truthOrDare: 0, monopoly: 0, dice: 0, slots: 0 },
    attributeScores: { romance: 250, daring: 150, intimacy: 200, fun: 250, passion: 100 },
    recentActivity: [0, 0, 0, 0, 0, 0, 0],
    timeOfDay: { morning: 0, afternoon: 0, evening: 0, night: 0 },
    streak: { current: 0, max: 0, lastLogDate: null },
    dayOfWeek: [0, 0, 0, 0, 0, 0, 0],
    detailStats: {
      truthsChosen: 0, daresChosen: 0, diceRolls: 0, ludoMoves: 0, ludoSixes: 0,
      ludoWinner: 0, dicePenalties: 0, diceWins: 0, slotsWins: 0, ludoEvents: 0,
      slotsSpins: 0, totalWeekendSessions: 0, slotsStraightFlush: 0, slotsFlush: 0, slotsInm: 0
    },
    achievements: [], lastUpdated: Date.now()
  };
  function getStatistics() {
    try {
      var raw = localStorage.getItem(STAT_KEY);
      if (!raw) {
        var v2 = localStorage.getItem("lovegame_statistics_v2");
        if (v2) {
          var old = JSON.parse(v2);
          var merged = Object.assign({}, DEFAULT_STATS, old);
          merged.dayOfWeek = DEFAULT_STATS.dayOfWeek.slice();
          merged.detailStats = Object.assign({}, DEFAULT_STATS.detailStats, old.detailStats);
          merged.xp = 0; merged.level = 1; merged.achievements = [];
          saveStatistics(merged);
          return merged;
        }
        saveStatistics(DEFAULT_STATS);
        return JSON.parse(JSON.stringify(DEFAULT_STATS));
      }
      return JSON.parse(raw);
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULT_STATS));
    }
  }
  function saveStatistics(s) {
    try { localStorage.setItem(STAT_KEY, JSON.stringify(s)); } catch (e) {}
  }
  function getAchievementProgress(id, s) {
    s = s || getStatistics();
    var last = s.recentActivity.length ? s.recentActivity[s.recentActivity.length - 1] : 0;
    var map = {
      novice_explorer: (s.totalSessions / 1) * 100,
      party_starter: (s.totalSessions / 50) * 100,
      game_master: (s.totalSessions / 200) * 100,
      weekend_warrior: (s.streak.max / 5) * 100,
      dedicated_lover: (s.streak.max / 14) * 100,
      risk_taker: (s.detailStats.daresChosen / 50) * 100,
      open_book: (s.detailStats.truthsChosen / 50) * 100,
      night_owl: (s.timeOfDay.night / 20) * 100,
      early_bird: (s.timeOfDay.morning / 20) * 100,
      soulmates: (s.attributeScores.intimacy / 395) * 100,
      on_fire: (s.attributeScores.passion / 395) * 100,
      marathon_runner: (s.totalDurationMinutes / 600) * 100,
      quickie: (last / 10) * 100,
      variety_pack: (Object.values(s.gameDistribution).filter(function (x) { return x > 0; }).length / 5) * 100,
      truth_seeker: (s.detailStats.truthsChosen / 200) * 100,
      daredevil: (s.detailStats.daresChosen / 200) * 100,
      high_roller: (s.detailStats.ludoSixes / 200) * 100,
      slot_wizard: (s.detailStats.slotsSpins / 500) * 100,
      dice_champion: (s.detailStats.diceWins / 50) * 100,
      ludo_legend: (s.detailStats.ludoWinner / 50) * 100,
      jackpot_hunter: (s.detailStats.slotsWins / 100) * 100,
      perfect_match: (s.detailStats.slotsStraightFlush / 3) * 100,
      flush_master: (s.detailStats.slotsFlush / 50) * 100,
      inm_master: (s.detailStats.slotsInm / 5) * 100
    };
    return clamp(map[id] || 0, 0, 100);
  }
  var ATTR_GAIN = {
    ludo: { romance: 5, daring: 1, intimacy: 4, fun: 2, passion: 3 },
    truthOrDare: { romance: 2, daring: 6, intimacy: 3, fun: 5, passion: 2 },
    monopoly: { romance: 1, daring: 3, intimacy: 2, fun: 4, passion: 1 },
    dice: { romance: 0, daring: 2, intimacy: 1, fun: 6, passion: 0 },
    slots: { romance: 1, daring: 4, intimacy: 2, fun: 3, passion: 5 }
  };
  function evaluateAchievements(s) {
    function unlock(id) {
      if (s.achievements.indexOf(id) === -1) {
        s.achievements.push(id);
        window.dispatchEvent(new CustomEvent("achievement-unlocked", { detail: id }));
      }
    }
    if (s.totalSessions >= 1) unlock("novice_explorer");
    if (s.totalSessions >= 50) unlock("party_starter");
    if (s.totalSessions >= 200) unlock("game_master");
    if (s.streak.max >= 5) unlock("weekend_warrior");
    if (s.streak.max >= 14) unlock("dedicated_lover");
    if (s.detailStats.daresChosen >= 50) unlock("risk_taker");
    if (s.detailStats.truthsChosen >= 50) unlock("open_book");
    if (s.timeOfDay.night >= 20) unlock("night_owl");
    if (s.timeOfDay.morning >= 20) unlock("early_bird");
    if (s.attributeScores.intimacy >= 395) unlock("soulmates");
    if (s.attributeScores.passion >= 395) unlock("on_fire");
    if (s.totalDurationMinutes >= 600) unlock("marathon_runner");
    if (s.recentActivity[s.recentActivity.length - 1] >= 10) unlock("quickie");
    if (Object.values(s.gameDistribution).every(function (x) { return x > 0; })) unlock("variety_pack");
    if (s.detailStats.truthsChosen >= 200) unlock("truth_seeker");
    if (s.detailStats.daresChosen >= 200) unlock("daredevil");
    if (s.detailStats.ludoSixes >= 200) unlock("high_roller");
    if (s.detailStats.slotsSpins >= 500) unlock("slot_wizard");
    if (s.detailStats.diceWins >= 50) unlock("dice_champion");
    if (s.detailStats.ludoWinner >= 50) unlock("ludo_legend");
    if (s.detailStats.slotsWins >= 100) unlock("jackpot_hunter");
    if (s.detailStats.slotsStraightFlush >= 3) unlock("perfect_match");
    if (s.detailStats.slotsFlush >= 50) unlock("flush_master");
    if (s.detailStats.slotsInm >= 5) unlock("inm_master");
  }
  function incrementGameSession(game, durationMin) {
    durationMin = durationMin == null ? 5 : durationMin;
    var s = getStatistics(), now = new Date();
    s.totalSessions += 1;
    s.totalDurationMinutes += durationMin;
    s.gameDistribution[game] = (s.gameDistribution[game] || 0) + 1;
    s.xp += 100 + 5 * durationMin;
    var lvl = Math.floor(1 + Math.sqrt(s.xp / 500));
    if (lvl > s.level) s.level = lvl;
    var dow = now.getDay();
    s.dayOfWeek[dow] = (s.dayOfWeek[dow] || 0) + 1;
    if (dow === 0 || dow === 5 || dow === 6)
      s.detailStats.totalWeekendSessions = (s.detailStats.totalWeekendSessions || 0) + 1;
    var h = now.getHours();
    if (h >= 5 && h < 12) s.timeOfDay.morning++;
    else if (h >= 12 && h < 18) s.timeOfDay.afternoon++;
    else if (h >= 18 && h < 23) s.timeOfDay.evening++;
    else s.timeOfDay.night++;
    var today = now.toISOString().split("T")[0];
    if (s.streak.lastLogDate !== today) {
      var yest = new Date(now); yest.setDate(yest.getDate() - 1);
      var yk = yest.toISOString().split("T")[0];
      if (s.streak.lastLogDate === yk) s.streak.current++;
      else s.streak.current = 1;
      if (s.streak.current > s.streak.max) s.streak.max = s.streak.current;
      s.streak.lastLogDate = today;
    }
    var gain = ATTR_GAIN[game] || { romance: 0, daring: 0, intimacy: 0, fun: 0, passion: 0 };
    ["romance", "daring", "intimacy", "fun", "passion"].forEach(function (k) {
      s.attributeScores[k] = clamp(s.attributeScores[k] + (gain[k] || 0), 0, 500);
    });
    var prev = new Date(s.lastUpdated);
    if (now.getDate() !== prev.getDate()) {
      s.recentActivity.shift(); s.recentActivity.push(1);
    } else {
      s.recentActivity[s.recentActivity.length - 1] += 1;
    }
    s.lastUpdated = Date.now();
    evaluateAchievements(s);
    saveStatistics(s);
    return s;
  }
  function recordDetailStat(key, delta) {
    delta = delta == null ? 1 : delta;
    var s = getStatistics();
    if (typeof s.detailStats[key] === "number") {
      s.detailStats[key] += delta;
      evaluateAchievements(s);
      saveStatistics(s);
    }
  }

  /* ---------------- 通用 UI : Toast ---------------- */
  var toastTimer = null;
  function toast(msg, ms) {
    var el = document.getElementById("lg-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "lg-toast";
      el.className = "fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-black/80 border border-white/20 shadow-xl backdrop-blur transition-all duration-300";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = "1"; el.style.pointerEvents = "auto";
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.style.opacity = "0"; el.style.pointerEvents = "none";
    }, ms || 2200);
  }

  /* ---------------- 通用 UI : 模态框 ---------------- */
  function openModal(innerHtml, opts) {
    opts = opts || {};
    var wrap = document.createElement("div");
    wrap.className = "fixed inset-0 z-50 flex items-center justify-center px-4";
    wrap.innerHTML =
      '<div class="absolute inset-0 bg-black/70" data-close></div>' +
      '<div class="relative z-10 w-full ' + (opts.maxW || "max-w-lg") +
      ' rounded-3xl border border-white/20 bg-[#12071c]/95 p-6 text-white shadow-[0_28px_80px_rgba(122,24,125,0.45)] backdrop-blur" role="dialog">' +
      innerHtml + "</div>";
    function close() { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }
    wrap.addEventListener("click", function (ev) {
      if (ev.target.hasAttribute("data-close")) { if (opts.dismissable === false) return; close(); }
    });
    document.body.appendChild(wrap);
    return { el: wrap, close: close };
  }

  /* ---------------- 导出 ---------------- */
  global.LG = {
    uuid: uuid, sleep: sleep, randInt: randInt, dice1_6: dice1_6, pick: pick,
    shuffle: shuffle, escapeHtml: escapeHtml, clamp: clamp,
    loadJSON: loadJSON, saveJSON: saveJSON,
    sound: Sound,
    getStatistics: getStatistics, saveStatistics: saveStatistics,
    getAchievementProgress: getAchievementProgress,
    incrementGameSession: incrementGameSession, recordDetailStat: recordDetailStat,
    toast: toast, openModal: openModal
  };

  /* ---------------- 移动端语言切换器统一绑定 ---------------- */
  function initLangSelects() {
    var selects = document.querySelectorAll("select[aria-label='语言']");
    selects.forEach(function (sel) {
      sel.addEventListener("change", function () {
        var targetLang = sel.value;
        if (!targetLang) return;
        var pathname = window.location.pathname;
        var parts = pathname.split("/").filter(Boolean);
        var currentFile = parts.length > 0 ? parts[parts.length - 1] : "index.html";
        var langDirs = ["cn", "en", "ja", "ko", "tw"];
        if (langDirs.indexOf(currentFile) !== -1 || !currentFile.endsWith(".html")) {
          currentFile = "index.html";
        }
        window.location.href = "../" + targetLang + "/" + currentFile;
      });
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLangSelects);
  } else {
    initLangSelects();
  }
})(window);
