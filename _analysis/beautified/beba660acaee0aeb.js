(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  69093,
  (e, t, a) => {
    "use strict";
    (Object.defineProperty(a, "__esModule", { value: !0 }),
      Object.defineProperty(a, "default", {
        enumerable: !0,
        get: function () {
          return d;
        },
      }));
    let s = e.r(43476),
      r = e.r(71645),
      i = e.r(67585),
      l = e.r(52157);
    function n(e) {
      return { default: e && "default" in e ? e.default : e };
    }
    let o = { loader: () => Promise.resolve(n(() => null)), loading: null, ssr: !0 },
      d = function (e) {
        let t = { ...o, ...e },
          a = (0, r.lazy)(() => t.loader().then(n)),
          d = t.loading;
        function c(e) {
          let n = d ? (0, s.jsx)(d, { isLoading: !0, pastDelay: !0, error: null }) : null,
            o = !t.ssr || !!t.loading,
            c = o ? r.Suspense : r.Fragment,
            m = t.ssr
              ? (0, s.jsxs)(s.Fragment, { children: ["undefined" == typeof window ? (0, s.jsx)(l.PreloadChunks, { moduleIds: t.modules }) : null, (0, s.jsx)(a, { ...e })] })
              : (0, s.jsx)(i.BailoutToCSR, { reason: "next/dynamic", children: (0, s.jsx)(a, { ...e }) });
          return (0, s.jsx)(c, { ...(o ? { fallback: n } : {}), children: m });
        }
        return ((c.displayName = "LoadableComponent"), c);
      };
  },
  70703,
  (e, t, a) => {
    "use strict";
    (Object.defineProperty(a, "__esModule", { value: !0 }),
      Object.defineProperty(a, "default", {
        enumerable: !0,
        get: function () {
          return r;
        },
      }));
    let s = e.r(63141)._(e.r(69093));
    function r(e, t) {
      let a = {};
      "function" == typeof e && (a.loader = e);
      let r = { ...a, ...t };
      return (0, s.default)({ ...r, modules: r.loadableGenerated?.modules });
    }
    ("function" == typeof a.default || ("object" == typeof a.default && null !== a.default)) &&
      void 0 === a.default.__esModule &&
      (Object.defineProperty(a.default, "__esModule", { value: !0 }), Object.assign(a.default, a), (t.exports = a.default));
  },
  67585,
  (e, t, a) => {
    "use strict";
    (Object.defineProperty(a, "__esModule", { value: !0 }),
      Object.defineProperty(a, "BailoutToCSR", {
        enumerable: !0,
        get: function () {
          return r;
        },
      }));
    let s = e.r(32061);
    function r({ reason: e, children: t }) {
      if ("undefined" == typeof window) throw Object.defineProperty(new s.BailoutToCSRError(e), "__NEXT_ERROR_CODE", { value: "E394", enumerable: !1, configurable: !0 });
      return t;
    }
  },
  9885,
  (e, t, a) => {
    "use strict";
    function s(e) {
      return e
        .split("/")
        .map((e) => encodeURIComponent(e))
        .join("/");
    }
    (Object.defineProperty(a, "__esModule", { value: !0 }),
      Object.defineProperty(a, "encodeURIPath", {
        enumerable: !0,
        get: function () {
          return s;
        },
      }));
  },
  52157,
  (e, t, a) => {
    "use strict";
    (Object.defineProperty(a, "__esModule", { value: !0 }),
      Object.defineProperty(a, "PreloadChunks", {
        enumerable: !0,
        get: function () {
          return n;
        },
      }));
    let s = e.r(43476),
      r = e.r(74080),
      i = e.r(63599),
      l = e.r(9885);
    function n({ moduleIds: e }) {
      if ("undefined" != typeof window) return null;
      let t = i.workAsyncStorage.getStore();
      if (void 0 === t) return null;
      let a = [];
      if (t.reactLoadableManifest && e) {
        let s = t.reactLoadableManifest;
        for (let t of e) {
          if (!s[t]) continue;
          let e = s[t].files;
          a.push(...e);
        }
      }
      return 0 === a.length
        ? null
        : (0, s.jsx)(s.Fragment, {
            children: a.map((e) => {
              let a = `${t.assetPrefix}/_next/${(0, l.encodeURIPath)(e)}`;
              return e.endsWith(".css")
                ? (0, s.jsx)("link", { precedence: "dynamic", href: a, rel: "stylesheet", as: "style", nonce: t.nonce }, e)
                : ((0, r.preload)(a, { as: "script", fetchPriority: "low", nonce: t.nonce }), null);
            }),
          });
    }
  },
  13642,
  (e) => {
    "use strict";
    var t = e.i(43476),
      a = e.i(48148);
    function s() {
      let e = (0, a.useTranslations)("footer");
      return (0, t.jsxs)("footer", {
        className: "mt-auto rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/70 backdrop-blur",
        children: [
          (0, t.jsx)("p", { children: e("disclaimer") }),
          (0, t.jsxs)("div", {
            className: "flex justify-center items-center gap-4 mt-2",
            children: [
              "© 2024 ~ ",
              new Date().getFullYear(),
              (0, t.jsxs)("a", {
                href: "https://www.hoothin.com",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "relative group text-white/70 hover:text-white",
                children: [
                  (0, t.jsx)("span", { className: "relative z-10", children: "www.hoothin.com" }),
                  (0, t.jsx)("span", { className: "absolute inset-x-0 bottom-0 h-px bg-white transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" }),
                ],
              }),
              (0, t.jsx)("a", {
                href: "https://x.com/HoothinDev",
                target: "_blank",
                rel: "noopener noreferrer",
                "aria-label": "Visit my Twitter profile",
                className: "flex items-center justify-center h-8 w-8 rounded-full text-white/70 transition-colors hover:bg-gray-700 hover:text-white",
                children: (0, t.jsxs)("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: "h-4 w-4",
                  children: [(0, t.jsx)("path", { d: "M4 4l11.733 16h4.267l-11.733 -16z" }), (0, t.jsx)("path", { d: "M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" })],
                }),
              }),
              (0, t.jsx)("a", {
                href: "https://github.com/hoothin/qinglv",
                target: "_blank",
                rel: "noopener noreferrer",
                "aria-label": "Visit the GitHub repository",
                className: "flex items-center justify-center h-8 w-8 rounded-full text-white/70 transition-colors hover:bg-gray-700 hover:text-white",
                children: (0, t.jsx)("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 24 24",
                  fill: "currentColor",
                  className: "h-4 w-4",
                  children: (0, t.jsx)("path", {
                    d: "M12 .5C5.648.5.5 5.648.5 12a11.5 11.5 0 0 0 7.86 10.923c.575.107.785-.25.785-.556 0-.274-.01-1-.016-1.963-3.197.695-3.872-1.54-3.872-1.54-.523-1.328-1.277-1.682-1.277-1.682-1.044-.714.08-.7.08-.7 1.154.08 1.76 1.185 1.76 1.185 1.026 1.758 2.692 1.25 3.348.955.104-.743.402-1.25.73-1.538-2.552-.29-5.236-1.276-5.236-5.682 0-1.255.448-2.282 1.183-3.087-.119-.29-.513-1.458.112-3.04 0 0 .964-.309 3.16 1.18A10.97 10.97 0 0 1 12 6.04c.976.005 1.959.132 2.878.387 2.194-1.49 3.156-1.18 3.156-1.18.627 1.582.233 2.75.114 3.04.737.805 1.18 1.832 1.18 3.087 0 4.417-2.688 5.389-5.248 5.674.414.356.783 1.06.783 2.136 0 1.542-.013 2.786-.013 3.164 0 .309.207.668.79.555A11.503 11.503 0 0 0 23.5 12C23.5 5.648 18.352.5 12 .5Z",
                  }),
                }),
              }),
            ],
          }),
        ],
      });
    }
    e.s(["Footer", () => s]);
  },
  99522,
  (e) => {
    "use strict";
    var t = e.i(43476),
      a = e.i(22016),
      s = e.i(61745),
      r = e.i(48148),
      i = e.i(18566);
    let l = ["en", "cn", "tw", "ja", "ko"],
      n = (e) => {
        switch (e) {
          case "en":
            return "En";
          case "cn":
            return "简体";
          case "tw":
            return "正體";
          case "ja":
            return "日本語";
          case "ko":
            return "한국인";
          default:
            return e;
        }
      };
    function o() {
      let e = (0, s.useLocale)(),
        o = (0, r.useTranslations)("navigation"),
        d = (0, i.usePathname)() ?? "/",
        c = (0, i.useRouter)();
      return (0, t.jsxs)(t.Fragment, {
        children: [
          (0, t.jsxs)("div", {
            className: "relative md:hidden",
            children: [
              (0, t.jsx)("select", {
                value: e,
                onChange: (e) => {
                  let t = e.target.value,
                    a = d.replace(RegExp(`^/(?:${l.join("|")})(?=/|$)`), ""),
                    s = `/${t}${a}`.replace(/\/+/g, "/");
                  c.push(s);
                },
                className: "h-9 appearance-none rounded-full bg-white/10 py-2.5 pl-4 pr-8 text-xs text-white backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/10",
                "aria-label": o("language"),
                children: l.map((e) => (0, t.jsx)("option", { value: e, className: "bg-gray-900 text-white", children: n(e) }, e)),
              }),
              (0, t.jsx)("div", {
                className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/70",
                children: (0, t.jsx)("svg", {
                  className: "h-4 w-4 fill-current",
                  viewBox: "0 0 20 20",
                  children: (0, t.jsx)("path", { d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" }),
                }),
              }),
            ],
          }),
          (0, t.jsx)("nav", {
            "aria-label": o("language"),
            className: "h-9 hidden md:flex items-center gap-2 rounded-full bg-white/10 px-2 py-1 backdrop-blur border border-white/10",
            children: l.map((s) => {
              let r = s === e,
                i = d.replace(RegExp(`^/(?:${l.join("|")})(?=/|$)`), ""),
                o = `/${s}${i}`.replace(/\/+/g, "/");
              return (0, t.jsx)(
                a.default,
                {
                  href: "" === o ? "/" : o,
                  prefetch: !1,
                  className: `flex items-center rounded-full px-3 py-1 text-sm transition ${r ? "bg-white text-gray-900" : "text-white/70 hover:text-white"}`,
                  children: n(s),
                },
                s,
              );
            }),
          }),
        ],
      });
    }
    e.s(["LocaleSwitcher", () => o], 99522);
  },
  37636,
  (e) => {
    "use strict";
    (e.i(99522), e.s([]));
  },
  8598,
  (e) => {
    "use strict";
    let t = "lovegame_statistics_v3",
      a = {
        totalSessions: 0,
        totalDurationMinutes: 0,
        totalInteractions: 0,
        xp: 0,
        level: 1,
        gameDistribution: { ludo: 0, truthOrDare: 0, monopoly: 0, dice: 0, slots: 0 },
        attributeScores: { romance: 250, daring: 150, intimacy: 200, fun: 250, passion: 100 },
        recentActivity: [0, 0, 0, 0, 0, 0, 0],
        timeOfDay: { morning: 0, afternoon: 0, evening: 0, night: 0 },
        streak: { current: 0, max: 0, lastLogDate: null },
        dayOfWeek: [0, 0, 0, 0, 0, 0, 0],
        detailStats: {
          truthsChosen: 0,
          daresChosen: 0,
          diceRolls: 0,
          ludoMoves: 0,
          ludoSixes: 0,
          ludoWinner: 0,
          dicePenalties: 0,
          diceWins: 0,
          slotsWins: 0,
          ludoEvents: 0,
          slotsSpins: 0,
          totalWeekendSessions: 0,
          slotsStraightFlush: 0,
          slotsFlush: 0,
          slotsInm: 0,
        },
        achievements: [],
        lastUpdated: Date.now(),
      };
    function s() {
      try {
        let e = localStorage.getItem(t);
        if (!e) {
          let e = localStorage.getItem("lovegame_statistics_v2");
          if (e) {
            let t = JSON.parse(e),
              s = { ...a, ...t, dayOfWeek: a.dayOfWeek, detailStats: { ...a.detailStats, ...t.detailStats }, xp: 0, level: 1, achievements: [] };
            return (r(s), s);
          }
          return (r(a), a);
        }
        return JSON.parse(e);
      } catch (e) {
        return (console.error("Failed to load statistics", e), a);
      }
    }
    function r(e) {
      try {
        localStorage.setItem(t, JSON.stringify(e));
      } catch (e) {
        console.error("Failed to save statistics", e);
      }
    }
    function i(e, t) {
      let a = t.recentActivity.length > 0 ? t.recentActivity[t.recentActivity.length - 1] : 0;
      return (
        {
          novice_explorer: Math.min(100, (t.totalSessions / 1) * 100),
          party_starter: Math.min(100, (t.totalSessions / 50) * 100),
          game_master: Math.min(100, (t.totalSessions / 200) * 100),
          weekend_warrior: Math.min(100, (t.streak.max / 5) * 100),
          dedicated_lover: Math.min(100, (t.streak.max / 14) * 100),
          risk_taker: Math.min(100, (t.detailStats.daresChosen / 50) * 100),
          open_book: Math.min(100, (t.detailStats.truthsChosen / 50) * 100),
          night_owl: Math.min(100, (t.timeOfDay.night / 20) * 100),
          early_bird: Math.min(100, (t.timeOfDay.morning / 20) * 100),
          soulmates: Math.min(100, (t.attributeScores.intimacy / 395) * 100),
          on_fire: Math.min(100, (t.attributeScores.passion / 395) * 100),
          marathon_runner: Math.min(100, (t.totalDurationMinutes / 600) * 100),
          quickie: Math.min(100, (a / 10) * 100),
          variety_pack: Math.min(100, (Object.values(t.gameDistribution).filter((e) => e > 0).length / 5) * 100),
          truth_seeker: Math.min(100, (t.detailStats.truthsChosen / 200) * 100),
          daredevil: Math.min(100, (t.detailStats.daresChosen / 200) * 100),
          high_roller: Math.min(100, (t.detailStats.ludoSixes / 200) * 100),
          slot_wizard: Math.min(100, (t.detailStats.slotsSpins / 500) * 100),
          dice_champion: Math.min(100, (t.detailStats.diceWins / 50) * 100),
          ludo_legend: Math.min(100, (t.detailStats.ludoWinner / 50) * 100),
          jackpot_hunter: Math.min(100, (t.detailStats.slotsWins / 100) * 100),
          perfect_match: Math.min(100, (t.detailStats.slotsStraightFlush / 3) * 100),
          flush_master: Math.min(100, (t.detailStats.slotsFlush / 50) * 100),
          inm_master: Math.min(100, (t.detailStats.slotsInm / 5) * 100),
        }[e] || 0
      );
    }
    function l(e, t = 5) {
      var a, i;
      let n,
        d = s(),
        c = new Date();
      ((d.totalSessions += 1), (d.totalDurationMinutes += t), (d.gameDistribution[e] = (d.gameDistribution[e] || 0) + 1));
      ((a = d), (i = 100 + 5 * t), (a.xp += i), (n = Math.floor(1 + Math.sqrt(a.xp / 500))) > a.level && (a.level = n));
      let m = c.getDay();
      ((d.dayOfWeek[m] = (d.dayOfWeek[m] || 0) + 1), (0 === m || 5 === m || 6 === m) && (d.detailStats.totalWeekendSessions = (d.detailStats.totalWeekendSessions || 0) + 1));
      let x = c.getHours();
      x >= 5 && x < 12 ? d.timeOfDay.morning++ : x >= 12 && x < 18 ? d.timeOfDay.afternoon++ : x >= 18 && x < 23 ? d.timeOfDay.evening++ : d.timeOfDay.night++;
      let h = c.toISOString().split("T")[0];
      if (d.streak.lastLogDate !== h) {
        let e = new Date(c);
        e.setDate(e.getDate() - 1);
        let t = e.toISOString().split("T")[0];
        (d.streak.lastLogDate === t ? d.streak.current++ : (d.streak.current = 1), d.streak.current > d.streak.max && (d.streak.max = d.streak.current), (d.streak.lastLogDate = h));
      }
      let u = (function (e) {
        switch (e) {
          case "ludo":
            return { romance: 5, daring: 1, intimacy: 4, fun: 2, passion: 3 };
          case "truthOrDare":
            return { romance: 2, daring: 6, intimacy: 3, fun: 5, passion: 2 };
          case "monopoly":
            return { romance: 1, daring: 3, intimacy: 2, fun: 4, passion: 1 };
          case "dice":
            return { romance: 0, daring: 2, intimacy: 1, fun: 6, passion: 0 };
          case "slots":
            return { romance: 1, daring: 4, intimacy: 2, fun: 3, passion: 5 };
          default:
            return { romance: 0, daring: 0, intimacy: 0, fun: 0, passion: 0 };
        }
      })(e);
      ((d.attributeScores.romance = Math.min(500, d.attributeScores.romance + u.romance)),
        (d.attributeScores.daring = Math.min(500, d.attributeScores.daring + u.daring)),
        (d.attributeScores.intimacy = Math.min(500, d.attributeScores.intimacy + u.intimacy)),
        (d.attributeScores.fun = Math.min(500, d.attributeScores.fun + u.fun)),
        (d.attributeScores.passion = Math.min(500, d.attributeScores.passion + u.passion)));
      let p = new Date(d.lastUpdated);
      (c.getDate() !== p.getDate() ? (d.recentActivity.shift(), d.recentActivity.push(1)) : (d.recentActivity[d.recentActivity.length - 1] += 1), o(d), (d.lastUpdated = Date.now()), r(d));
    }
    function n(e, t = 1) {
      let a = s();
      "number" == typeof a.detailStats[e] && ((a.detailStats[e] += t), o(a), r(a));
    }
    function o(e) {
      let t = (t) => {
        e.achievements.includes(t) || (e.achievements.push(t), window.dispatchEvent(new CustomEvent("achievement-unlocked", { detail: t })));
      };
      (e.totalSessions >= 1 && t("novice_explorer"),
        e.totalSessions >= 50 && t("party_starter"),
        e.totalSessions >= 200 && t("game_master"),
        e.streak.max >= 5 && t("weekend_warrior"),
        e.streak.max >= 14 && t("dedicated_lover"),
        e.detailStats.daresChosen >= 50 && t("risk_taker"),
        e.detailStats.truthsChosen >= 50 && t("open_book"),
        e.timeOfDay.night >= 20 && t("night_owl"),
        e.timeOfDay.morning >= 20 && t("early_bird"),
        e.attributeScores.intimacy >= 395 && t("soulmates"),
        e.attributeScores.passion >= 395 && t("on_fire"),
        e.totalDurationMinutes >= 600 && t("marathon_runner"),
        e.recentActivity[e.recentActivity.length - 1] >= 10 && t("quickie"),
        Object.values(e.gameDistribution).every((e) => e > 0) && t("variety_pack"),
        e.detailStats.truthsChosen >= 200 && t("truth_seeker"),
        e.detailStats.daresChosen >= 200 && t("daredevil"),
        e.detailStats.ludoSixes >= 200 && t("high_roller"),
        e.detailStats.slotsSpins >= 500 && t("slot_wizard"),
        e.detailStats.diceWins >= 50 && t("dice_champion"),
        e.detailStats.ludoWinner >= 50 && t("ludo_legend"),
        e.detailStats.slotsWins >= 100 && t("jackpot_hunter"),
        e.detailStats.slotsStraightFlush >= 3 && t("perfect_match"),
        e.detailStats.slotsFlush >= 50 && t("flush_master"),
        e.detailStats.slotsInm >= 5 && t("inm_master"));
    }
    e.s(["getAchievementProgress", () => i, "getStatistics", () => s, "incrementGameSession", () => l, "recordDetailStat", () => n]);
  },
  16653,
  (e) => {
    "use strict";
    var t = e.i(29969);
    function a(e) {
      return (0, t.zlibSync)(e, { level: 9 });
    }
    function s(e) {
      return (0, t.unzlibSync)(e);
    }
    e.s(["compress", () => a, "decompress", () => s]);
  },
  56923,
  (e) => {
    "use strict";
    var t = e.i(43476),
      a = e.i(57688);
    function s({ locale: e, variant: s = "home", className: r = "", trackingContent: i = "home_banner" }) {
      let l;
      if ("cn" !== e) return null;
      let n = "compact" === s,
        o =
          ((l = new URL("https://housetime.zgame.fun/")).searchParams.set("utm_source", "lovegame"),
          l.searchParams.set("utm_medium", "site_ad"),
          l.searchParams.set("utm_campaign", "housetime"),
          l.searchParams.set("utm_content", i),
          l.toString());
      return (0, t.jsxs)("section", {
        "aria-label": "宅时光推广",
        className: `group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-white shadow-2xl shadow-black/30 backdrop-blur-xl transition hover:border-pink-300/60 hover:bg-white/10 ${r}`,
        children: [
          (0, t.jsx)("div", { className: "absolute -left-16 top-8 h-44 w-44 rounded-full bg-pink-500/20 blur-3xl" }),
          (0, t.jsx)("div", { className: "absolute -right-16 bottom-0 h-52 w-52 rounded-full bg-sky-400/20 blur-3xl" }),
          (0, t.jsxs)("div", {
            className: `relative grid items-center gap-6 ${n ? "p-5 sm:grid-cols-[1fr_13rem] sm:p-6" : "p-6 md:grid-cols-[1.1fr_0.9fr] lg:p-8"}`,
            children: [
              (0, t.jsxs)("div", {
                className: "space-y-5",
                children: [
                  (0, t.jsxs)("div", {
                    className: "flex flex-wrap items-center gap-3",
                    children: [
                      (0, t.jsx)("span", { className: "rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-pink-200", children: "像素社区手游" }),
                      (0, t.jsx)("span", { className: "rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white/60", children: "玩家口碑" }),
                    ],
                  }),
                  (0, t.jsxs)("div", {
                    className: "space-y-3",
                    children: [
                      (0, t.jsx)(a.default, {
                        src: "/housetime-logo.png",
                        alt: "宅时光",
                        width: 220,
                        height: 103,
                        className: `${n ? "w-32" : "w-40 sm:w-52"} h-auto drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]`,
                      }),
                      (0, t.jsx)("h2", {
                        className: `${n ? "text-2xl" : "text-3xl sm:text-4xl"} font-semibold leading-tight`,
                        children: n ? "大富翁还在建设中？先去宅时光逛一圈" : "听说这是妹子比例最高的像素社区游戏？",
                      }),
                      (0, t.jsx)("p", {
                        className: `${n ? "text-sm" : "text-base sm:text-lg"} max-w-2xl leading-relaxed text-white/75`,
                        children: n ? "妹子多、房间多、还能聊天找 CP。像素社区里先把小家支起来。" : "Q版像素画风，换装、建房、串门、聊天、找 CP。玩完情侣小游戏，去宅时光认识更多会玩的朋友。",
                      }),
                    ],
                  }),
                  (0, t.jsx)("div", {
                    className: "flex flex-wrap items-center gap-3",
                    children: (0, t.jsxs)("a", {
                      href: o,
                      target: "_blank",
                      rel: "sponsored noopener noreferrer",
                      className:
                        "inline-flex items-center gap-2 rounded-full bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:bg-pink-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-200",
                      children: ["去宅时光看看", (0, t.jsx)("span", { "aria-hidden": !0, children: "→" })],
                    }),
                  }),
                ],
              }),
              (0, t.jsxs)("a", {
                href: o,
                target: "_blank",
                rel: "sponsored noopener noreferrer",
                className: `relative block overflow-hidden rounded-3xl border border-white/10 bg-black/30 transition group-hover:scale-[1.01] ${n ? "hidden aspect-[16/10] sm:block" : "aspect-[16/9]"}`,
                "aria-label": "查看宅时光官网",
                children: [
                  (0, t.jsx)(a.default, {
                    src: "/housetime-promo.png",
                    alt: "宅时光像素社区游戏截图",
                    fill: !0,
                    sizes: n ? "13rem" : "(max-width: 768px) 100vw, 42vw",
                    className: "object-cover object-left-top",
                  }),
                  (0, t.jsx)("div", {
                    className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4",
                    children: (0, t.jsx)("p", { className: "text-sm font-semibold text-white", children: "换装 · 建房 · 串门 · 找 CP" }),
                  }),
                ],
              }),
            ],
          }),
        ],
      });
    }
    e.s(["HousetimeAd", () => s]);
  },
  88362,
  (e) => {
    "use strict";
    var t = e.i(43476),
      a = e.i(22016),
      s = e.i(48148),
      r = e.i(70703),
      i = e.i(13642);
    e.i(37636);
    var l = e.i(99522);
    let n = (0, r.default)(() => e.A(95329).then((e) => ({ default: e.DiceGame })), { loadableGenerated: { modules: [49834] } });
    function o({ locale: e }) {
      let r = (0, s.useTranslations)(),
        o = `/${e}`;
      return (0, t.jsxs)("main", {
        className: "relative min-h-screen overflow-hidden bg-[#0a0a0a]",
        children: [
          (0, t.jsxs)("div", {
            className: "pointer-events-none absolute inset-0 -z-10",
            children: [
              (0, t.jsx)("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[500px] bg-purple-900/30 blur-[120px] rounded-full mix-blend-screen animate-spin-slow" }),
              (0, t.jsx)("div", { className: "absolute bottom-0 right-0 h-[500px] w-[500px] bg-rose-900/20 blur-[120px] rounded-full mix-blend-screen animate-spin-slow animation-delay-2000" }),
            ],
          }),
          (0, t.jsxs)("div", {
            className: "mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8",
            children: [
              (0, t.jsxs)("nav", {
                className: "p-3 sm:p-0 sm:mb-8 flex flex-wrap flex-row sm:items-center sm:justify-between gap-4",
                children: [
                  (0, t.jsxs)(a.default, {
                    href: o,
                    prefetch: !1,
                    className:
                      "group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-2.5 text-xs font-bold uppercase tracking-wide text-white/70 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white hover:border-white/20 sm:px-5 sm:py-2.5",
                    children: [
                      (0, t.jsx)("span", { className: "transition-transform group-hover:-translate-x-1", "aria-hidden": !0, children: "←" }),
                      (0, t.jsx)("span", { className: "inline", children: r("routes.common.back") }),
                    ],
                  }),
                  (0, t.jsx)(l.LocaleSwitcher, {}),
                ],
              }),
              (0, t.jsx)("div", { className: "flex justify-center", children: (0, t.jsx)(n, {}) }),
              (0, t.jsx)("div", { className: "mt-12", children: (0, t.jsx)(i.Footer, {}) }),
            ],
          }),
        ],
      });
    }
    e.s(["DicePageClient", () => o]);
  },
  74197,
  (e) => {
    "use strict";
    var t = e.i(43476),
      a = e.i(22016),
      s = e.i(48148),
      r = e.i(13642),
      i = e.i(56923);
    e.i(37636);
    var l = e.i(99522);
    function n({ locale: e }) {
      let n = (0, s.useTranslations)(),
        o = `/${e}`;
      return (0, t.jsxs)("main", {
        className: "relative min-h-screen",
        children: [
          (0, t.jsx)("div", {
            className:
              "pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.25),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(79,70,229,0.2),_transparent_60%)]",
          }),
          (0, t.jsxs)("div", {
            className: "mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-6 py-12 lg:px-10",
            children: [
              (0, t.jsxs)("header", {
                className: "flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur",
                children: [
                  (0, t.jsxs)("div", {
                    className: "flex flex-wrap items-center justify-between gap-4",
                    children: [
                      (0, t.jsxs)(a.default, {
                        href: o,
                        prefetch: !1,
                        className:
                          "inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70 transition hover:border-pink-200 hover:text-white",
                        children: [(0, t.jsx)("span", { "aria-hidden": !0, children: "←" }), n("routes.common.back")],
                      }),
                      (0, t.jsx)(l.LocaleSwitcher, {}),
                    ],
                  }),
                  (0, t.jsxs)("div", {
                    className: "space-y-3 text-white",
                    children: [
                      (0, t.jsx)("h1", { className: "text-3xl font-semibold sm:text-4xl", children: n("routes.monopoly.heading") }),
                      (0, t.jsx)("p", { className: "text-white/70", children: n("routes.monopoly.intro") }),
                    ],
                  }),
                ],
              }),
              (0, t.jsx)(i.HousetimeAd, { locale: e, variant: "compact", trackingContent: "monopoly_wip" }),
              (0, t.jsxs)("section", {
                className: "flex flex-1 flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white backdrop-blur",
                children: [
                  (0, t.jsx)("p", { className: "text-xl font-semibold", children: n("routes.monopoly.wipTitle") }),
                  (0, t.jsx)(a.default, {
                    href: "https://discord.com/invite/keqypXC6wD",
                    className: "mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2 text-sm font-medium text-white/80 transition hover:border-pink-200 hover:text-white",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    children: n("routes.monopoly.wipCta"),
                  }),
                ],
              }),
              (0, t.jsx)(r.Footer, {}),
            ],
          }),
        ],
      });
    }
    e.s(["MonopolyPageClient", () => n]);
  },
  8468,
  (e) => {
    "use strict";
    var t = e.i(43476),
      a = e.i(22016),
      s = e.i(48148),
      r = e.i(70703),
      i = e.i(13642);
    e.i(37636);
    var l = e.i(99522);
    let n = (0, r.default)(() => e.A(32303).then((e) => ({ default: e.TruthOrDareWheel })), { loadableGenerated: { modules: [64787] } });
    function o({ locale: e }) {
      let r = (0, s.useTranslations)(),
        o = `/${e}`;
      return (0, t.jsxs)("main", {
        className: "relative min-h-screen overflow-clip bg-[#0a0a0a]",
        children: [
          (0, t.jsxs)("div", {
            className: "pointer-events-none absolute inset-0 -z-10",
            children: [
              (0, t.jsx)("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[500px] bg-rose-900/30 blur-[120px] rounded-full mix-blend-screen animate-spin-slow" }),
              (0, t.jsx)("div", { className: "absolute bottom-0 right-0 h-[500px] w-[500px] bg-violet-900/20 blur-[120px] rounded-full mix-blend-screen animate-spin-slow animation-delay-2000" }),
            ],
          }),
          (0, t.jsxs)("div", {
            className: "mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8",
            children: [
              (0, t.jsxs)("nav", {
                className: "p-3 sm:p-0 sm:mb-8 flex flex-wrap flex-row sm:items-center sm:justify-between gap-4",
                children: [
                  (0, t.jsxs)(a.default, {
                    href: o,
                    prefetch: !1,
                    className:
                      "group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-2.5 text-xs font-bold uppercase tracking-wide text-white/70 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white hover:border-white/20 sm:px-5 sm:py-2.5",
                    children: [
                      (0, t.jsx)("span", { className: "transition-transform group-hover:-translate-x-1", "aria-hidden": !0, children: "←" }),
                      (0, t.jsx)("span", { className: "inline", children: r("routes.common.back") }),
                    ],
                  }),
                  (0, t.jsx)(l.LocaleSwitcher, {}),
                ],
              }),
              (0, t.jsx)(n, {}),
              (0, t.jsx)("div", { className: "mt-12", children: (0, t.jsx)(i.Footer, {}) }),
            ],
          }),
        ],
      });
    }
    e.s(["TruthOrDarePageClient", () => o]);
  },
  93540,
  (e) => {
    "use strict";
    var t = e.i(43476),
      a = e.i(22016),
      s = e.i(48148),
      r = e.i(70703),
      i = e.i(13642);
    e.i(37636);
    var l = e.i(99522);
    let n = (0, r.default)(() => e.A(65246).then((e) => ({ default: e.SlotsGame })), { loadableGenerated: { modules: [56471] } });
    function o({ locale: e }) {
      let r = (0, s.useTranslations)(),
        o = `/${e}`;
      return (0, t.jsxs)("main", {
        className: "relative min-h-screen overflow-hidden bg-[#0a0a0a]",
        children: [
          (0, t.jsxs)("div", {
            className: "pointer-events-none absolute inset-0 -z-10",
            children: [
              (0, t.jsx)("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[500px] bg-fuchsia-900/30 blur-[120px] rounded-full mix-blend-screen animate-spin-slow" }),
              (0, t.jsx)("div", { className: "absolute bottom-0 right-0 h-[500px] w-[500px] bg-cyan-900/20 blur-[120px] rounded-full mix-blend-screen animate-spin-slow animation-delay-2000" }),
            ],
          }),
          (0, t.jsxs)("div", {
            className: "mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8",
            children: [
              (0, t.jsxs)("nav", {
                className: "p-3 sm:p-0 sm:mb-8 flex flex-wrap flex-row sm:items-center sm:justify-between gap-4",
                children: [
                  (0, t.jsxs)(a.default, {
                    href: o,
                    prefetch: !1,
                    className:
                      "group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-2.5 text-xs font-bold uppercase tracking-wide text-white/70 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white hover:border-white/20 sm:px-5 sm:py-2.5",
                    children: [
                      (0, t.jsx)("span", { className: "transition-transform group-hover:-translate-x-1", "aria-hidden": !0, children: "←" }),
                      (0, t.jsx)("span", { className: "inline", children: r("routes.common.back") }),
                    ],
                  }),
                  (0, t.jsx)(l.LocaleSwitcher, {}),
                ],
              }),
              (0, t.jsx)("div", { className: "flex justify-center", children: (0, t.jsx)(n, {}) }),
              (0, t.jsx)("div", { className: "mt-12", children: (0, t.jsx)(i.Footer, {}) }),
            ],
          }),
        ],
      });
    }
    e.s(["SlotsPageClient", () => o]);
  },
  20337,
  (e) => {
    "use strict";
    var t = e.i(43476),
      a = e.i(22016),
      s = e.i(48148),
      r = e.i(70703),
      i = e.i(13642);
    e.i(37636);
    var l = e.i(99522);
    let n = (0, r.default)(() => e.A(9381).then((e) => ({ default: e.DarkBeastGame })), { loadableGenerated: { modules: [14470] } });
    function o({ locale: e }) {
      let r = (0, s.useTranslations)(),
        o = `/${e}`;
      return (0, t.jsxs)("main", {
        className: "relative min-h-screen overflow-hidden bg-[#0a0a0a]",
        children: [
          (0, t.jsxs)("div", {
            className: "pointer-events-none absolute inset-0 -z-10",
            children: [
              (0, t.jsx)("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[500px] bg-pink-900/30 blur-[120px] rounded-full mix-blend-screen animate-spin-slow" }),
              (0, t.jsx)("div", { className: "absolute bottom-0 right-0 h-[500px] w-[500px] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen animate-spin-slow animation-delay-2000" }),
            ],
          }),
          (0, t.jsxs)("div", {
            className: "mx-auto flex min-h-screen w-full max-w-7xl flex-col px-1 py-8 sm:px-6 lg:px-8",
            children: [
              (0, t.jsxs)("nav", {
                className: "p-3 sm:p-0 sm:mb-8 flex flex-wrap flex-row sm:items-center sm:justify-between gap-4",
                children: [
                  (0, t.jsxs)(a.default, {
                    href: o,
                    prefetch: !1,
                    className:
                      "group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-2.5 text-xs font-bold uppercase tracking-wide text-white/70 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white hover:border-white/20 sm:px-5 sm:py-2.5",
                    children: [
                      (0, t.jsx)("span", { className: "transition-transform group-hover:-translate-x-1", "aria-hidden": !0, children: "←" }),
                      (0, t.jsx)("span", { className: "inline", children: r("routes.common.back") }),
                    ],
                  }),
                  (0, t.jsx)(l.LocaleSwitcher, {}),
                ],
              }),
              (0, t.jsx)("div", { className: "flex justify-center min-h-[600px]", children: (0, t.jsx)(n, {}) }),
              (0, t.jsxs)("div", {
                id: "instructions",
                className: "mt-20 max-w-7xl mx-auto px-4 text-white/80 space-y-16 mb-20",
                children: [
                  (0, t.jsxs)("section", {
                    children: [
                      (0, t.jsx)("h2", {
                        className: "text-2xl font-bold mb-6 text-rose-400 bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-purple-400",
                        children: r("games.darkBeast.seo.about.title"),
                      }),
                      (0, t.jsx)("p", { className: "leading-loose text-lg text-white/90", children: r("games.darkBeast.seo.about.content") }),
                    ],
                  }),
                  (0, t.jsxs)("section", {
                    children: [
                      (0, t.jsx)("h2", {
                        className: "text-2xl font-bold mb-6 text-rose-400 bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-purple-400",
                        children: r("games.darkBeast.seo.rules.title"),
                      }),
                      (0, t.jsx)("ul", {
                        className: "space-y-3 text-base text-white/80",
                        children: r
                          .raw("games.darkBeast.seo.rules.list")
                          .map((e, a) =>
                            (0, t.jsxs)(
                              "li",
                              {
                                className: "flex items-start gap-3",
                                children: [(0, t.jsx)("span", { className: "mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose-500" }), (0, t.jsx)("span", { children: e })],
                              },
                              a,
                            ),
                          ),
                      }),
                    ],
                  }),
                  (0, t.jsxs)("section", {
                    children: [
                      (0, t.jsx)("h2", {
                        className: "text-2xl font-bold mb-6 text-rose-400 bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-purple-400",
                        children: r("games.darkBeast.seo.faq.title"),
                      }),
                      (0, t.jsx)("div", {
                        className: "grid gap-6 md:grid-cols-2",
                        children: r
                          .raw("games.darkBeast.seo.faq.items")
                          .map((e, a) =>
                            (0, t.jsxs)(
                              "div",
                              {
                                className: "bg-white/5 rounded-3xl p-6 backdrop-blur-sm border border-white/10 hover:border-rose-500/30 transition-colors",
                                children: [
                                  (0, t.jsx)("h3", { className: "font-bold text-lg text-white mb-3", children: e.q }),
                                  (0, t.jsx)("p", { className: "text-white/70 leading-relaxed text-sm", children: e.a }),
                                ],
                              },
                              a,
                            ),
                          ),
                      }),
                    ],
                  }),
                ],
              }),
              (0, t.jsx)("div", { className: "mt-12", children: (0, t.jsx)(i.Footer, {}) }),
            ],
          }),
        ],
      });
    }
    e.s(["DarkBeastPageClient", () => o]);
  },
  65375,
  (e) => {
    "use strict";
    var t = e.i(43476),
      a = e.i(22016),
      s = e.i(48148),
      r = e.i(70703),
      i = e.i(13642),
      l = e.i(56923);
    e.i(37636);
    var n = e.i(99522);
    let o = (0, r.default)(() => e.A(60013).then((e) => ({ default: e.LudoGame })), { loadableGenerated: { modules: [76759] } });
    function d({ locale: e }) {
      let r = (0, s.useTranslations)(),
        d = `/${e}`;
      return (0, t.jsxs)("main", {
        className: "relative min-h-screen overflow-hidden bg-[#0a0a0a]",
        children: [
          (0, t.jsxs)("div", {
            className: "pointer-events-none absolute inset-0 -z-10",
            children: [
              (0, t.jsx)("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[500px] bg-indigo-900/30 blur-[120px] rounded-full mix-blend-screen animate-spin-slow" }),
              (0, t.jsx)("div", { className: "absolute bottom-0 right-0 h-[500px] w-[500px] bg-emerald-900/20 blur-[120px] rounded-full mix-blend-screen animate-spin-slow animation-delay-2000" }),
            ],
          }),
          (0, t.jsxs)("div", {
            className: "mx-auto flex min-h-screen w-full max-w-7xl flex-col px-1 py-8 sm:px-6 lg:px-8",
            children: [
              (0, t.jsxs)("nav", {
                className: "p-3 sm:p-0 sm:mb-8 flex flex-wrap flex-row sm:items-center sm:justify-between gap-4",
                children: [
                  (0, t.jsxs)(a.default, {
                    href: d,
                    prefetch: !1,
                    className:
                      "group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-2.5 text-xs font-bold uppercase tracking-wide text-white/70 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white hover:border-white/20 sm:px-5 sm:py-2.5",
                    children: [
                      (0, t.jsx)("span", { className: "transition-transform group-hover:-translate-x-1", "aria-hidden": !0, children: "←" }),
                      (0, t.jsx)("span", { className: "inline", children: r("routes.common.back") }),
                    ],
                  }),
                  (0, t.jsx)(n.LocaleSwitcher, {}),
                ],
              }),
              (0, t.jsx)("div", { className: "flex justify-center", children: (0, t.jsx)(o, {}) }),
              (0, t.jsxs)("div", {
                className: "mt-20 max-w-7xl mx-auto px-4 text-white/80 space-y-16 mb-20",
                children: [
                  (0, t.jsxs)("section", {
                    children: [
                      (0, t.jsx)("h2", {
                        className: "text-2xl font-bold mb-6 text-pink-400 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400",
                        children: r("games.ludo.seo.about.title"),
                      }),
                      (0, t.jsx)("p", { className: "leading-loose text-lg text-white/90", children: r("games.ludo.seo.about.content") }),
                    ],
                  }),
                  (0, t.jsxs)("section", {
                    children: [
                      (0, t.jsx)("h2", {
                        className: "text-2xl font-bold mb-6 text-pink-400 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400",
                        children: r("games.ludo.seo.rules.title"),
                      }),
                      (0, t.jsx)("ul", {
                        className: "space-y-3 text-base text-white/80",
                        children: r
                          .raw("games.ludo.seo.rules.list")
                          .map((e, a) =>
                            (0, t.jsxs)(
                              "li",
                              {
                                className: "flex items-start gap-3",
                                children: [(0, t.jsx)("span", { className: "mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-pink-500" }), (0, t.jsx)("span", { children: e })],
                              },
                              a,
                            ),
                          ),
                      }),
                    ],
                  }),
                  (0, t.jsxs)("section", {
                    children: [
                      (0, t.jsx)("h2", {
                        className: "text-2xl font-bold mb-6 text-pink-400 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400",
                        children: r("games.ludo.seo.faq.title"),
                      }),
                      (0, t.jsx)("div", {
                        className: "grid gap-6 md:grid-cols-2",
                        children: r
                          .raw("games.ludo.seo.faq.items")
                          .map((e, a) =>
                            (0, t.jsxs)(
                              "div",
                              {
                                className: "bg-white/5 rounded-3xl p-6 backdrop-blur-sm border border-white/10 hover:border-pink-500/30 transition-colors",
                                children: [
                                  (0, t.jsx)("h3", { className: "font-bold text-lg text-white mb-3", children: e.q }),
                                  (0, t.jsx)("p", { className: "text-white/70 leading-relaxed text-sm", children: e.a }),
                                ],
                              },
                              a,
                            ),
                          ),
                      }),
                    ],
                  }),
                ],
              }),
              (0, t.jsx)("div", { className: "mt-12 px-3 sm:px-0", children: (0, t.jsx)(l.HousetimeAd, { locale: e, trackingContent: "ludo_page" }) }),
              (0, t.jsx)("div", { className: "mt-12", children: (0, t.jsx)(i.Footer, {}) }),
            ],
          }),
        ],
      });
    }
    e.s(["LudoPageClient", () => d]);
  },
  99462,
  (e) => {
    "use strict";
    var t = e.i(43476),
      a = e.i(71645),
      s = e.i(22016),
      r = e.i(48148),
      i = e.i(18566);
    e.i(37636);
    var l = e.i(99522),
      n = e.i(8598),
      o = e.i(73134),
      d = e.i(16653);
    let c = ["#ec4899", "#8b5cf6", "#3b82f6", "#f59e0b", "#10b981"];
    async function m({ title: e, subtitle: t, cta: a, url: s }) {
      let r = document.createElement("canvas");
      ((r.width = 1080), (r.height = 1440));
      let i = r.getContext("2d");
      if (!i) throw Error("Failed to create canvas context");
      let l = (e, t, a, s, r = 1, l = 1) => {
          (i.save(),
            i.translate(e, t),
            i.scale(a * r, a * l),
            i.beginPath(),
            i.moveTo(0, 0.3),
            i.bezierCurveTo(0, -0.2, -0.45, -0.2, -0.45, 0.2),
            i.bezierCurveTo(-0.45, 0.55, 0, 0.8, 0, 1),
            i.bezierCurveTo(0, 0.8, 0.45, 0.55, 0.45, 0.2),
            i.bezierCurveTo(0.45, -0.2, 0, -0.2, 0, 0.3),
            i.closePath(),
            (i.fillStyle = s),
            i.fill(),
            i.restore());
        },
        n = i.createLinearGradient(0, 0, 1080, 1440);
      (n.addColorStop(0, "#120b1f"), n.addColorStop(0.4, "#2a1436"), n.addColorStop(1, "#3a1641"), (i.fillStyle = n), i.fillRect(0, 0, 1080, 1440));
      let d = i.createRadialGradient(980, 150, 14, 980, 150, 220);
      (d.addColorStop(0, "rgba(255, 220, 235, 0.7)"),
        d.addColorStop(0.6, "rgba(255, 170, 215, 0.35)"),
        d.addColorStop(1, "rgba(255, 170, 215, 0.05)"),
        l(980, 150, 160, "rgba(255, 180, 215, 0.1)", 1.25, 0.95),
        l(980, 150, 160, d, 1.25, 0.95),
        (i.strokeStyle = "rgba(255, 255, 255, 0.1)"),
        (i.lineWidth = 2),
        i.beginPath(),
        i.moveTo(0, 260),
        i.bezierCurveTo(260, 180, 520, 360, 1080, 260),
        i.stroke(),
        i.beginPath(),
        i.moveTo(0, 320),
        i.bezierCurveTo(280, 420, 600, 220, 1080, 330),
        i.stroke(),
        (i.fillStyle = "#FDF2F8"),
        (i.font = '700 66px "Poppins", "Segoe UI", Arial, sans-serif'),
        i.fillText(e, 80, 160),
        (i.fillStyle = "rgba(255, 255, 255, 0.72)"),
        (i.font = '400 36px "Poppins", "Segoe UI", Arial, sans-serif'),
        i.fillText(t, 80, 220));
      let c = await o.default.toDataURL(s, { width: 480, margin: 0, color: { dark: "#1a1026", light: "#FFFFFF" } }),
        m = await new Promise((e, t) => {
          let a = new Image();
          ((a.onload = () => e(a)), (a.onerror = () => t(Error("Failed to load image"))), (a.src = c));
        });
      ((i.fillStyle = "rgba(255, 255, 255, 0.09)"), (i.strokeStyle = "rgba(255, 255, 255, 0.22)"), (i.lineWidth = 2), i.beginPath(), i.roundRect(140, 380, 800, 820, 36), i.fill(), i.stroke());
      let x = i.createLinearGradient(140, 380, 940, 1200);
      return (
        x.addColorStop(0, "rgba(255, 255, 255, 0)"),
        x.addColorStop(0.45, "rgba(255, 170, 204, 0.12)"),
        x.addColorStop(1, "rgba(255, 255, 255, 0)"),
        (i.fillStyle = x),
        i.beginPath(),
        i.roundRect(158, 398, 764, 784, 28),
        i.fill(),
        (i.fillStyle = "#FFFFFF"),
        i.beginPath(),
        i.roundRect(262, 472, 556, 556, 22),
        i.fill(),
        i.drawImage(m, 280, 490, 520, 520),
        (i.fillStyle = "rgba(255, 255, 255, 0.26)"),
        (i.font = '600 26px "Poppins", "Segoe UI", Arial, sans-serif'),
        i.fillText("LoveGame", 340, 598),
        (i.fillStyle = "rgba(255, 255, 255, 0.7)"),
        (i.font = '500 30px "Poppins", "Segoe UI", Arial, sans-serif'),
        (i.textAlign = "center"),
        i.fillText(a, 540, 1060),
        (i.textAlign = "start"),
        new Promise((e, t) => {
          r.toBlob(
            (a) => {
              a ? e(a) : t(Error("Failed to export image"));
            },
            "image/jpeg",
            0.86,
          );
        })
      );
    }
    function x({ locale: e }) {
      var o, c;
      let x = (0, r.useTranslations)("statistics"),
        v = (function () {
          let [e] = (0, a.useState)(() => (0, n.getStatistics)());
          return e;
        })(),
        [w] = (0, a.useState)(!0),
        [j, y] = (0, a.useState)(!1),
        [N, k] = (0, a.useState)(null),
        S = (0, i.useSearchParams)(),
        _ =
          (0, a.useMemo)(() => {
            let e = S?.get("shared");
            return e
              ? ((e) => {
                  try {
                    let t = ((e) => {
                        let t = atob(
                            e
                              .replace(/-/g, "+")
                              .replace(/_/g, "/")
                              .padEnd(4 * Math.ceil(e.length / 4), "="),
                          ),
                          a = new Uint8Array(t.length);
                        for (let e = 0; e < t.length; e += 1) a[e] = t.charCodeAt(e);
                        return a;
                      })(e),
                      a = (0, d.decompress)(t),
                      s = new TextDecoder().decode(a),
                      r = JSON.parse(s);
                    return ((e) => {
                      if (!e || "object" != typeof e) return !1;
                      let t = (t) => "number" == typeof e[t],
                        a = (t) => !!e[t] && "object" == typeof e[t];
                      return (
                        t("totalSessions") &&
                        t("totalDurationMinutes") &&
                        t("totalInteractions") &&
                        t("xp") &&
                        t("level") &&
                        t("lastUpdated") &&
                        Array.isArray(e.achievements) &&
                        Array.isArray(e.recentActivity) &&
                        Array.isArray(e.dayOfWeek) &&
                        a("attributeScores") &&
                        a("timeOfDay") &&
                        a("streak") &&
                        a("detailStats") &&
                        a("gameDistribution")
                      );
                    })(r)
                      ? r
                      : null;
                  } catch {
                    return null;
                  }
                })(e)
              : null;
          }, [S]) ?? v;
      if (!w || !_) return (0, t.jsx)("div", { className: "min-h-screen w-full bg-transparent" });
      let M = [
          { subject: x("charts.romance"), A: _.attributeScores.romance, fullMark: 500 },
          { subject: x("charts.daring"), A: _.attributeScores.daring, fullMark: 500 },
          { subject: x("charts.intimacy"), A: _.attributeScores.intimacy, fullMark: 500 },
          { subject: x("charts.fun"), A: _.attributeScores.fun, fullMark: 500 },
          { subject: x("charts.passion"), A: _.attributeScores.passion, fullMark: 500 },
        ],
        C = Object.entries(_.gameDistribution)
          .map(([e, t]) => ({ name: x(`charts.${e}`), value: t }))
          .filter((e) => e.value > 0),
        D = C.length > 0 ? C : [{ name: "None", value: 1 }],
        $ = 0 === C.length,
        P = _.recentActivity.map((e, t) => ({ day: `Day ${t + 1}`, value: e })),
        O = [
          { name: x("times.morning"), value: _.timeOfDay.morning },
          { name: x("times.afternoon"), value: _.timeOfDay.afternoon },
          { name: x("times.evening"), value: _.timeOfDay.evening },
          { name: x("times.night"), value: _.timeOfDay.night },
        ],
        A = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
        T = _.dayOfWeek.map((e, t) => ({ name: x(`days.${A[t]}`), value: e })),
        F = Math.round(((_.attributeScores.romance + _.attributeScores.daring + _.attributeScores.intimacy + _.attributeScores.fun + _.attributeScores.passion) / 2500) * 100),
        L = 500 * Math.pow(_.level - 1, 2),
        W = 500 * Math.pow(_.level, 2),
        I = Math.min(100, Math.max(0, ((_.xp - L) / (W - L)) * 100)),
        z = x(
          `levelTitles.${(o = _.level) >= 50 ? "eternalDevotion" : o >= 40 ? "starseaVow" : o >= 30 ? "trueLoveNavigator" : o >= 20 ? "heartbeatSentinel" : o >= 15 ? "sweetOdyssey" : o >= 10 ? "nocturneHeartseeker" : o >= 7 ? "crimsonGuardian" : o >= 5 ? "emberLover" : o >= 3 ? "neonWhispers" : "glimmeringFirstLove"}`,
        ),
        B =
          (c = _.level) >= 50
            ? {
                containerClass: "border-pink-300/60 bg-pink-500/15 shadow-[0_0_25px_rgba(236,72,153,0.45)]",
                textClass: "text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-fuchsia-300 to-purple-200",
              }
            : c >= 30
              ? { containerClass: "border-pink-400/40 bg-white/10 shadow-[0_0_15px_rgba(236,72,153,0.25)]", textClass: "text-pink-100/90" }
              : c >= 10
                ? { containerClass: "border-white/15 bg-white/5", textClass: "text-pink-200/80" }
                : { containerClass: "border-white/10 bg-white/5", textClass: "text-white/70" },
        R = async () => {
          y(!0);
          try {
            let e = new URL(window.location.pathname, window.location.origin),
              t = ((e) => {
                let t = new TextEncoder().encode(JSON.stringify(e));
                var a = (0, d.compress)(t);
                let s = "";
                for (let e = 0; e < a.length; e += 1) s += String.fromCharCode(a[e]);
                return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
              })(_);
            e.searchParams.set("shared", t);
            let a = await m({ title: x("shareImage.title"), subtitle: x("shareImage.subtitle"), cta: x("shareImage.cta"), url: e.toString() }),
              s = new File([a], "lovegame-achievements.jpg", { type: "image/jpeg" }),
              r = { title: x("shareImage.title"), text: x("shareImage.subtitle"), files: [s] };
            if (navigator.share && navigator.canShare?.(r)) await navigator.share(r);
            else {
              let e = URL.createObjectURL(a),
                t = document.createElement("a");
              ((t.href = e), (t.download = "lovegame-achievements.jpg"), t.click(), URL.revokeObjectURL(e));
            }
          } catch (e) {
            console.error("Share failed:", e);
          } finally {
            y(!1);
          }
        };
      return (0, t.jsxs)("main", {
        className: "relative min-h-screen overflow-hidden pb-20 text-white",
        children: [
          (0, t.jsxs)("div", {
            className: "fixed inset-0 -z-10 bg-black",
            children: [
              (0, t.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.15),_transparent_50%)]" }),
              (0, t.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.15),_transparent_50%)]" }),
              (0, t.jsx)("div", { className: "absolute inset-0 bg-[url('/bg.png')] opacity-10 bg-cover bg-center mix-blend-overlay" }),
            ],
          }),
          (0, t.jsxs)("div", {
            className: "mx-auto max-w-6xl px-6 py-12",
            children: [
              (0, t.jsxs)("nav", {
                className: "p-3 sm:p-0 sm:mb-8 flex flex-wrap flex-row sm:items-center sm:justify-between gap-4",
                children: [
                  (0, t.jsxs)(s.default, {
                    href: `/${e}`,
                    prefetch: !1,
                    className:
                      "group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-2.5 text-xs font-bold uppercase tracking-wide text-white/70 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white hover:border-white/20 sm:px-5 sm:py-2.5",
                    children: [
                      (0, t.jsx)("span", { className: "transition-transform group-hover:-translate-x-1", "aria-hidden": !0, children: "←" }),
                      (0, t.jsx)("span", { className: "inline", children: x("backToHome") }),
                    ],
                  }),
                  (0, t.jsx)(l.LocaleSwitcher, {}),
                ],
              }),
              (0, t.jsxs)("header", {
                className: "mb-12 text-center space-y-4 animate-pop-in",
                children: [
                  (0, t.jsx)("div", {
                    className: "inline-block rounded-full bg-pink-500/20 px-4 py-1 text-sm font-medium text-pink-200 border border-pink-500/30 backdrop-blur-sm",
                    children: x("title"),
                  }),
                  (0, t.jsx)("h1", {
                    className: "text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent",
                    children: x("subtitle"),
                  }),
                ],
              }),
              (0, t.jsxs)("div", {
                className: "mb-12 w-full max-w-2xl mx-auto animate-pop-in [animation-delay:100ms]",
                children: [
                  (0, t.jsxs)("div", {
                    className: "flex justify-between items-end mb-2",
                    children: [
                      (0, t.jsxs)("span", { className: "text-2xl font-bold text-pink-400", children: [x("level"), " ", _.level] }),
                      (0, t.jsxs)("div", {
                        className: "flex items-center gap-3",
                        children: [
                          (0, t.jsxs)("span", { className: "text-sm text-white/60", children: [x("xp"), ": ", Math.floor(_.xp), " / ", W] }),
                          (0, t.jsxs)("button", {
                            type: "button",
                            onClick: R,
                            disabled: j,
                            className:
                              "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 transition-all duration-200 hover:border-pink-400/40 hover:text-white hover:bg-pink-500/10 disabled:cursor-not-allowed disabled:opacity-60",
                            "aria-label": x("shareButton"),
                            children: [
                              (0, t.jsx)("svg", {
                                className: "h-3.5 w-3.5 text-pink-300",
                                viewBox: "0 0 24 24",
                                fill: "currentColor",
                                "aria-hidden": "true",
                                children: (0, t.jsx)("path", {
                                  d: "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a3.27 3.27 0 0 0 0-1.39l7.05-4.11A2.99 2.99 0 1 0 15 5a2.9 2.9 0 0 0 .04.49L8 9.6a3 3 0 1 0 0 4.8l7.04 4.11c-.03.16-.04.32-.04.49a3 3 0 1 0 3-3.92z",
                                }),
                              }),
                              j ? x("sharing") : x("shareButton"),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, t.jsx)("div", {
                    className: "h-4 w-full bg-white/10 rounded-full overflow-hidden",
                    children: (0, t.jsx)("div", { className: "h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-1000 ease-out", style: { width: `${I}%` } }),
                  }),
                  (0, t.jsx)("div", {
                    className: "mt-3 flex items-center justify-center",
                    children: (0, t.jsx)("span", { className: `rounded-full border px-4 py-1 text-xs font-semibold tracking-[0.12em] ${B.containerClass} ${B.textClass}`, children: z }),
                  }),
                ],
              }),
              (0, t.jsxs)("div", {
                className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8",
                children: [
                  (0, t.jsx)(u, { title: x("intimacyScore"), value: `${F}%`, icon: "❤️", color: "text-pink-400", delay: 0.1 }),
                  (0, t.jsx)(u, { title: x("activePlayers"), value: _.totalSessions, icon: "🎮", color: "text-purple-400", delay: 0.2 }),
                  (0, t.jsx)(u, { title: x("streak"), value: _.streak.current, icon: "🔥", color: "text-orange-400", delay: 0.3 }),
                  (0, t.jsx)(u, { title: x("totalKisses"), value: _.totalInteractions, icon: "💋", color: "text-red-400", delay: 0.4 }),
                ],
              }),
              (0, t.jsxs)("div", {
                className: "mb-12 grid gap-4 grid-cols-2 sm:grid-cols-4",
                children: [
                  (0, t.jsx)(p, { title: x("details.truths"), value: _.detailStats.truthsChosen, delay: 0.5 }),
                  (0, t.jsx)(p, { title: x("details.dares"), value: _.detailStats.daresChosen, delay: 0.55 }),
                  (0, t.jsx)(p, { title: x("details.moves"), value: _.detailStats.ludoMoves, delay: 0.6 }),
                  (0, t.jsx)(p, { title: x("details.rolls"), value: _.detailStats.diceRolls, delay: 0.65 }),
                  (0, t.jsx)(p, { title: x("details.dicePenalties"), value: _.detailStats.dicePenalties || 0, delay: 0.7 }),
                  (0, t.jsx)(p, { title: x("details.diceWins"), value: _.detailStats.diceWins || 0, delay: 0.75 }),
                  (0, t.jsx)(p, { title: x("details.slotsWins"), value: _.detailStats.slotsWins || 0, delay: 0.8 }),
                  (0, t.jsx)(p, { title: x("details.ludoSixes"), value: _.detailStats.ludoSixes || 0, delay: 0.85 }),
                  (0, t.jsx)(p, { title: x("details.ludoWinner"), value: _.detailStats.ludoWinner || 0, delay: 0.9 }),
                  (0, t.jsx)(p, { title: x("details.ludoEvents"), value: _.detailStats.ludoEvents || 0, delay: 0.95 }),
                  (0, t.jsx)(p, { title: x("details.slotsSpins"), value: _.detailStats.slotsSpins || 0, delay: 1 }),
                  (0, t.jsx)(p, { title: x("details.totalWeekendSessions"), value: _.detailStats.totalWeekendSessions || 0, delay: 1.05 }),
                ],
              }),
              (0, t.jsxs)("div", {
                className: "grid gap-8 lg:grid-cols-2 mb-12",
                children: [
                  (0, t.jsxs)("div", {
                    className: "relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:bg-white/10 animate-pop-in [animation-delay:500ms]",
                    children: [
                      (0, t.jsx)("div", { className: "mb-6", children: (0, t.jsx)("h3", { className: "text-xl font-semibold text-white", children: x("attributeAnalysis") }) }),
                      (0, t.jsx)("div", { className: "h-[350px] w-full flex items-center justify-center", children: (0, t.jsx)(b, { data: M }) }),
                    ],
                  }),
                  (0, t.jsxs)("div", {
                    className: "relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:bg-white/10 animate-pop-in [animation-delay:600ms]",
                    children: [
                      (0, t.jsx)("div", { className: "mb-6", children: (0, t.jsx)("h3", { className: "text-xl font-semibold text-white", children: x("activityTrends") }) }),
                      (0, t.jsx)("div", { className: "h-[350px] w-full", children: (0, t.jsx)(f, { data: P }) }),
                    ],
                  }),
                  (0, t.jsxs)("div", {
                    className:
                      "lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:bg-white/10 animate-pop-in [animation-delay:700ms]",
                    children: [
                      (0, t.jsx)("div", {
                        className: "mb-6 flex items-center justify-between",
                        children: (0, t.jsx)("h3", { className: "text-xl font-semibold text-white", children: x("gamePopularity") }),
                      }),
                      (0, t.jsx)("div", { className: "flex justify-center w-full py-4", children: (0, t.jsx)(g, { data: D, isEmpty: $ }) }),
                    ],
                  }),
                  (0, t.jsxs)("div", {
                    className:
                      "lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:bg-white/10 animate-pop-in [animation-delay:800ms]",
                    children: [
                      (0, t.jsx)("div", { className: "mb-6", children: (0, t.jsx)("h3", { className: "text-xl font-semibold text-white", children: x("timeOfDay") }) }),
                      (0, t.jsx)("div", { className: "h-[300px] w-full", children: (0, t.jsx)(f, { data: O, color: "#3b82f6" }) }),
                    ],
                  }),
                  (0, t.jsxs)("div", {
                    className:
                      "lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:bg-white/10 animate-pop-in [animation-delay:900ms]",
                    children: [
                      (0, t.jsx)("div", { className: "mb-6", children: (0, t.jsx)("h3", { className: "text-xl font-semibold text-white", children: x("weeklyRhythm") }) }),
                      (0, t.jsx)("div", { className: "h-[300px] w-full", children: (0, t.jsx)(f, { data: T, color: "#10b981" }) }),
                    ],
                  }),
                ],
              }),
              (0, t.jsxs)("div", {
                className: "mb-12 animate-pop-in [animation-delay:1000ms]",
                children: [
                  (0, t.jsx)("h3", { className: "text-2xl font-bold mb-6 text-center", children: x("achievementsTitle") }),
                  (0, t.jsx)("div", {
                    className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6",
                    children: Object.keys(x.raw("achievements"))
                      .filter((e) => "unlocked" !== e)
                      .map((e) => {
                        let a = _.achievements.includes(e),
                          s = (0, n.getAchievementProgress)(e, _);
                        return (0, t.jsx)(
                          h,
                          {
                            achievementId: e,
                            isUnlocked: a,
                            progress: s,
                            title: x(`achievements.${e}`),
                            description: x(`achievementsDesc.${e}`),
                            t: x,
                            activeTooltipId: N,
                            onToggleTooltip: (e) => k((t) => (t === e ? null : e)),
                          },
                          e,
                        );
                      }),
                  }),
                ],
              }),
            ],
          }),
        ],
      });
    }
    let h = ({ achievementId: e, isUnlocked: s, progress: r, title: i, description: l, t: n, activeTooltipId: o, onToggleTooltip: d }) => {
        let [c, m] = (0, a.useState)(!1),
          x = o === e,
          h = s
            ? { primary: "#ff69b4", secondary: "#ff1493", tertiary: "#ff6bcb", glow: "rgba(255, 105, 180, 0.6)" }
            : r >= 75
              ? { primary: "#ff6bcb", secondary: "#e879f9", tertiary: "#d946ef", glow: "rgba(255, 107, 203, 0.5)" }
              : r >= 50
                ? { primary: "#60a5fa", secondary: "#3b82f6", tertiary: "#2563eb", glow: "rgba(96, 165, 250, 0.4)" }
                : { primary: "#6b7280", secondary: "#4b5563", tertiary: "#9ca3af", glow: "rgba(107, 114, 128, 0.2)" },
          u = !s && r >= 90,
          p = 80 * Math.PI;
        return (0, t.jsxs)("div", {
          className: `group relative p-5 rounded-2xl border transition-all duration-500 overflow-visible ${s ? "bg-gradient-to-br from-pink-500/12 to-fuchsia-500/12 border-pink-400/30 shadow-[0_0_15px_rgba(255,105,180,0.2)] hover:shadow-[0_0_35px_rgba(255,105,180,0.5)] scale-100" : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"} hover:-translate-y-1 ${u ? "animate-pulse-slow" : ""}`,
          onMouseEnter: () => m(!0),
          onMouseLeave: () => m(!1),
          onClick: () => d(e),
          role: "button",
          tabIndex: 0,
          onKeyDown: (t) => {
            ("Enter" === t.key || " " === t.key) && (t.preventDefault(), d(e));
          },
          children: [
            (0, t.jsxs)("div", {
              className: "relative w-20 h-20 mx-auto mb-3 overflow-visible",
              children: [
                !s &&
                  r > 0 &&
                  (0, t.jsx)("div", {
                    className: "absolute inset-0 rounded-full blur-xl opacity-60 transition-opacity duration-500",
                    style: { background: h.glow, transform: c ? "scale(1.2)" : "scale(1)" },
                  }),
                !s &&
                  (0, t.jsxs)("svg", {
                    viewBox: "0 0 84 84",
                    className: "absolute inset-0 w-full h-full -rotate-90 transition-transform duration-500 overflow-visible",
                    style: { transform: c ? "rotate(-90deg) scale(1.05)" : "rotate(-90deg)", overflow: "visible" },
                    children: [
                      (0, t.jsxs)("defs", {
                        children: [
                          (0, t.jsxs)("linearGradient", {
                            id: `gradient-${e}`,
                            x1: "0%",
                            y1: "0%",
                            x2: "100%",
                            y2: "100%",
                            children: [(0, t.jsx)("stop", { offset: "0%", stopColor: h.primary }), (0, t.jsx)("stop", { offset: "100%", stopColor: h.secondary })],
                          }),
                          (0, t.jsxs)("filter", {
                            id: `glow-${e}`,
                            children: [
                              (0, t.jsx)("feGaussianBlur", { stdDeviation: "2", result: "coloredBlur" }),
                              (0, t.jsxs)("feMerge", { children: [(0, t.jsx)("feMergeNode", { in: "coloredBlur" }), (0, t.jsx)("feMergeNode", { in: "SourceGraphic" })] }),
                            ],
                          }),
                          u && (0, t.jsx)("animate", { attributeName: "opacity", values: "0.6;1;0.6", dur: "2s", repeatCount: "indefinite" }),
                        ],
                      }),
                      (0, t.jsx)("circle", { cx: 42, cy: 42, r: 40, fill: "none", stroke: "rgba(255, 255, 255, 0.1)", strokeWidth: 4 }),
                      r > 0 &&
                        (0, t.jsx)("circle", {
                          cx: 42,
                          cy: 42,
                          r: 40,
                          fill: "none",
                          stroke: `url(#gradient-${e})`,
                          strokeWidth: 4,
                          strokeDasharray: `${p} ${p}`,
                          strokeDashoffset: p - (r / 100) * p,
                          strokeLinecap: "round",
                          filter: `url(#glow-${e})`,
                          className: "transition-all duration-1000 ease-out",
                        }),
                      u &&
                        (0, t.jsxs)(t.Fragment, {
                          children: [
                            (0, t.jsx)("circle", {
                              cx: 42,
                              cy: 4,
                              r: "1.5",
                              fill: h.primary,
                              opacity: "0.8",
                              children: (0, t.jsx)("animate", { attributeName: "opacity", values: "0;1;0", dur: "1.5s", repeatCount: "indefinite" }),
                            }),
                            (0, t.jsx)("circle", {
                              cx: 72,
                              cy: 12,
                              r: "1",
                              fill: h.secondary,
                              opacity: "0.6",
                              children: (0, t.jsx)("animate", { attributeName: "opacity", values: "0;1;0", dur: "2s", begin: "0.5s", repeatCount: "indefinite" }),
                            }),
                            (0, t.jsx)("circle", {
                              cx: 12,
                              cy: 12,
                              r: "1",
                              fill: h.primary,
                              opacity: "0.6",
                              children: (0, t.jsx)("animate", { attributeName: "opacity", values: "0;1;0", dur: "2s", begin: "1s", repeatCount: "indefinite" }),
                            }),
                          ],
                        }),
                    ],
                  }),
                (0, t.jsxs)("div", {
                  className: "absolute inset-0 flex flex-col items-center justify-center",
                  children: [
                    (0, t.jsxs)("div", {
                      className: "relative",
                      children: [
                        s &&
                          (0, t.jsxs)(t.Fragment, {
                            children: [
                              (0, t.jsx)("span", {
                                className: "pointer-events-none absolute inset-0 rounded-full border border-pink-400/20 opacity-0 group-hover:opacity-60 group-hover:animate-ping",
                                style: { animationDuration: "2.4s" },
                              }),
                              (0, t.jsx)("span", {
                                className: "pointer-events-none absolute inset-0 rounded-full border border-pink-300/15 opacity-0 group-hover:opacity-50 group-hover:animate-ping",
                                style: { animationDuration: "3s", animationDelay: "0.6s" },
                              }),
                            ],
                          }),
                        (0, t.jsx)("div", {
                          className: `text-3xl transition-all duration-300 ${s ? "transition-transform duration-700 ease-out group-hover:scale-[1.5]" : ""} ${s ? "scale-100 grayscale-0 group-hover:animate-bounce" : r > 0 ? "scale-90 grayscale-0" : "scale-75 grayscale opacity-40"}`,
                          style: s
                            ? { filter: c ? "drop-shadow(0 0 10px rgba(255, 105, 180, 0.9)) drop-shadow(0 0 15px rgba(255, 20, 147, 0.5))" : "drop-shadow(0 0 5px rgba(255, 105, 180, 0.5))" }
                            : void 0,
                          children: s ? "🏆" : "🔒",
                        }),
                      ],
                    }),
                    !s && r > 0 && (0, t.jsxs)("div", { className: "text-[10px] font-bold mt-0.5 transition-all duration-300", style: { color: h.primary }, children: [Math.round(r), "%"] }),
                  ],
                }),
              ],
            }),
            (0, t.jsx)("div", { className: `text-center font-medium text-sm mb-1 transition-colors duration-300 ${s ? "text-white" : r > 0 ? "text-white/70" : "text-white/40"}`, children: i }),
            (0, t.jsxs)("div", {
              className: `absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 max-w-[48vw] p-3 bg-gradient-to-br from-gray-900 to-black border border-white/30 rounded-xl text-xs font-medium text-white text-center transition-all duration-300 z-50 shadow-2xl backdrop-blur-xl origin-bottom ${x ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none group-hover:opacity-100 group-hover:scale-100"}`,
              onClick: (e) => e.stopPropagation(),
              children: [
                (0, t.jsx)("div", { className: `font-bold mb-1 ${s ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-pink-500" : "text-pink-300"}`, children: i }),
                (s || !1) && (0, t.jsx)("div", { className: "text-white/80", children: l }),
                !s &&
                  r > 0 &&
                  (0, t.jsxs)("div", {
                    className: "mt-2 pt-2 border-t border-white/20",
                    children: [
                      (0, t.jsxs)("div", {
                        className: "flex justify-between items-center text-[10px]",
                        children: [
                          (0, t.jsx)("span", { className: "text-white/60", children: n("progress") }),
                          (0, t.jsxs)("span", { className: "font-bold", style: { color: h.primary }, children: [Math.round(r), "%"] }),
                        ],
                      }),
                      (0, t.jsx)("div", {
                        className: "mt-1 h-1 bg-white/10 rounded-full overflow-hidden",
                        children: (0, t.jsx)("div", {
                          className: "h-full rounded-full transition-all duration-500",
                          style: { width: `${r}%`, background: `linear-gradient(90deg, ${h.primary}, ${h.secondary})` },
                        }),
                      }),
                    ],
                  }),
                (0, t.jsx)("div", { className: "absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black border-b border-r border-white/30 rotate-45" }),
              ],
            }),
            s &&
              (0, t.jsx)("div", {
                className:
                  "absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-pink-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
              }),
          ],
        });
      },
      u = ({ title: e, value: a, icon: s, color: r, delay: i }) =>
        (0, t.jsxs)("div", {
          className:
            "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl hover:shadow-pink-500/10 animate-pop-in",
          style: { animationDelay: `${i}s` },
          children: [
            (0, t.jsxs)("div", {
              className: "flex items-start justify-between",
              children: [
                (0, t.jsxs)("div", {
                  children: [
                    (0, t.jsx)("p", { className: "text-sm font-medium text-white/50", children: e }),
                    (0, t.jsx)("div", { className: `mt-2 text-4xl font-bold tracking-tight ${r} drop-shadow-lg`, children: a }),
                  ],
                }),
                (0, t.jsx)("div", { className: "text-3xl opacity-50 grayscale transition-all group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100", children: s }),
              ],
            }),
            (0, t.jsx)("div", { className: `pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-current opacity-[0.05] blur-3xl transition-opacity group-hover:opacity-10 ${r}` }),
          ],
        }),
      p = ({ title: e, value: a, delay: s }) =>
        (0, t.jsxs)("div", {
          className: "flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center backdrop-blur-md transition-colors hover:bg-white/10 animate-pop-in",
          style: { animationDelay: `${s}s` },
          children: [
            (0, t.jsx)("span", { className: "text-2xl font-bold text-white", children: a }),
            (0, t.jsx)("span", { className: "text-xs font-medium text-white/50 uppercase tracking-wider mt-1", children: e }),
          ],
        }),
      b = ({ data: e }) => {
        let [s, r] = (0, a.useState)(null),
          i = (2 * Math.PI) / e.length,
          l = (t, a) => {
            let s = a * i - Math.PI / 2,
              r = (t / (e[0]?.fullMark || 100)) * 100;
            return { x: 140 + r * Math.cos(s), y: 140 + r * Math.sin(s) };
          },
          n = e
            .map((e, t) => {
              let a = l(e.A, t);
              return `${a.x},${a.y}`;
            })
            .join(" ");
        return (0, t.jsx)("div", {
          className: "relative flex items-center justify-center w-full h-full",
          children: (0, t.jsxs)("svg", {
            width: "100%",
            height: "100%",
            viewBox: "0 0 280 280",
            className: "overflow-visible",
            children: [
              (0, t.jsxs)("defs", {
                children: [
                  (0, t.jsxs)("radialGradient", {
                    id: "radarGradient",
                    cx: "50%",
                    cy: "50%",
                    r: "50%",
                    fx: "50%",
                    fy: "50%",
                    children: [(0, t.jsx)("stop", { offset: "0%", stopColor: "#ec4899", stopOpacity: "0.6" }), (0, t.jsx)("stop", { offset: "100%", stopColor: "#ec4899", stopOpacity: "0.1" })],
                  }),
                  (0, t.jsxs)("filter", {
                    id: "glow",
                    x: "-50%",
                    y: "-50%",
                    width: "200%",
                    height: "200%",
                    children: [
                      (0, t.jsx)("feGaussianBlur", { stdDeviation: "4", result: "coloredBlur" }),
                      (0, t.jsxs)("feMerge", { children: [(0, t.jsx)("feMergeNode", { in: "coloredBlur" }), (0, t.jsx)("feMergeNode", { in: "SourceGraphic" })] }),
                    ],
                  }),
                ],
              }),
              [0.2, 0.4, 0.6, 0.8, 1].map((e, a) =>
                (0, t.jsx)("circle", { cx: 140, cy: 140, r: 100 * e, fill: "none", stroke: "rgba(255,255,255,0.05)", strokeWidth: "1", strokeDasharray: "4 4" }, a),
              ),
              e.map((e, a) => {
                let s = l(100, a);
                return (0, t.jsx)("line", { x1: 140, y1: 140, x2: s.x, y2: s.y, stroke: "rgba(255,255,255,0.1)", strokeWidth: "1" }, a);
              }),
              (0, t.jsx)("polygon", { points: n, fill: "url(#radarGradient)", stroke: "#ec4899", strokeWidth: "2", filter: "url(#glow)", className: "transition-all duration-500 ease-out" }),
              e.map((a, s) => {
                let r = l(1.1 * (e[0]?.fullMark || 100), s);
                return (0, t.jsx)(
                  "text",
                  {
                    x: r.x,
                    y: r.y,
                    textAnchor: "middle",
                    dominantBaseline: "middle",
                    fill: "rgba(255,255,255,0.6)",
                    fontSize: "11",
                    fontWeight: "500",
                    className: "uppercase tracking-wide",
                    children: a.subject,
                  },
                  s,
                );
              }),
              e.map((e, a) => {
                let i = l(e.A, a),
                  n = s === a;
                return (0, t.jsxs)(
                  "g",
                  {
                    onMouseEnter: () => r(a),
                    onMouseLeave: () => r(null),
                    style: { cursor: "pointer" },
                    children: [
                      (0, t.jsx)("circle", { cx: i.x, cy: i.y, r: n ? 6 : 4, fill: "#fff", stroke: "#ec4899", strokeWidth: 2, className: "transition-all duration-200" }),
                      n &&
                        (0, t.jsxs)("g", {
                          children: [
                            (0, t.jsx)("rect", { x: i.x - 20, y: i.y - 30, width: "40", height: "20", rx: "4", fill: "#111", stroke: "#ec4899", strokeWidth: "1" }),
                            (0, t.jsx)("text", { x: i.x, y: i.y - 20, textAnchor: "middle", dominantBaseline: "middle", fill: "#fff", fontSize: "10", fontWeight: "bold", children: Math.round(e.A) }),
                          ],
                        }),
                    ],
                  },
                  a,
                );
              }),
            ],
          }),
        });
      },
      f = ({ data: e, color: s }) => {
        let r = Math.max(...e.map((e) => e.value), 1),
          [i, l] = (0, a.useState)(null);
        return (0, t.jsxs)("div", {
          className: "flex items-end justify-between h-full gap-3 w-full px-4 pb-6 relative",
          children: [
            (0, t.jsx)("div", {
              className: "absolute inset-0 flex flex-col justify-between pointer-events-none px-4 pb-12",
              children: [0, 0.25, 0.5, 0.75, 1].map((e, a) =>
                (0, t.jsx)(
                  "div",
                  {
                    className: "w-full h-px bg-white/5 relative",
                    children: a % 2 == 0 && (0, t.jsx)("span", { className: "absolute -left-6 -top-2 text-[9px] text-white/20", children: Math.round(r * (1 - e)) }),
                  },
                  a,
                ),
              ),
            }),
            e.map((e, a) => {
              let n = (e.value / r) * 100,
                o = i === a,
                d = s || c[a % c.length];
              return (0, t.jsxs)(
                "div",
                {
                  className: "relative flex flex-col items-center flex-1 h-full justify-end z-10",
                  onMouseEnter: () => l(a),
                  onMouseLeave: () => l(null),
                  children: [
                    (0, t.jsxs)("div", {
                      className: `w-full max-w-[40px] min-h-[6px] rounded-t-lg transition-all duration-500 ease-out relative ${o ? "brightness-125 shadow-[0_0_15px_rgba(255,255,255,0.3)]" : ""}`,
                      style: { height: `${n}%`, backgroundColor: d, backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(0,0,0,0.1))" },
                      children: [
                        (0, t.jsx)("div", {
                          className: `absolute inset-0 bg-gradient-to-t from-transparent to-white/30 transition-opacity duration-300 overflow-hidden rounded-t-lg ${o ? "opacity-100" : "opacity-0"}`,
                        }),
                        (0, t.jsxs)("div", {
                          className: `absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/90 border border-white/20 rounded-lg text-xs font-bold text-white whitespace-nowrap transition-all duration-200 z-20 ${o ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95 pointer-events-none"}`,
                          children: [e.value, (0, t.jsx)("div", { className: "absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-b border-r border-white/20 rotate-45" })],
                        }),
                      ],
                    }),
                    (0, t.jsx)("div", { className: `mt-3 text-[10px] font-medium text-center truncate w-full transition-colors ${o ? "text-white" : "text-white/40"}`, children: e.name || e.day }),
                  ],
                },
                a,
              );
            }),
          ],
        });
      },
      g = ({ data: e, isEmpty: s }) => {
        let r = e.reduce((e, t) => e + t.value, 0),
          [i, l] = (0, a.useState)(null),
          n = e.map((t, a) => {
            let s = e.slice(0, a).reduce((e, t) => e + t.value, 0),
              i = (s / r) * 100,
              l = ((s + t.value) / r) * 100;
            return { ...t, start: i, end: l, color: c[a % c.length], index: a };
          }),
          o = s ? ["#333 0% 100%"] : n.map((e) => `${e.color} ${e.start}% ${e.end}%`),
          d = `conic-gradient(${o.join(", ")})`,
          m = null === i || s ? null : n[i];
        return (0, t.jsxs)("div", {
          className: "flex flex-col md:flex-row items-center justify-evenly gap-8 w-full max-w-4xl mx-auto",
          children: [
            (0, t.jsxs)("div", {
              className: "relative h-[260px] w-[260px] shrink-0 group",
              children: [
                (0, t.jsx)("div", { className: "absolute inset-0 rounded-full blur-2xl opacity-20 transition-colors duration-500", style: { background: m ? m.color : "#fff" } }),
                (0, t.jsx)("div", {
                  className: "rounded-full relative z-10 shadow-2xl",
                  style: { width: "100%", height: "100%", background: d, transform: m ? "scale(1.02)" : "scale(1)", transition: "transform 0.3s ease" },
                }),
                (0, t.jsx)("div", {
                  className: "absolute inset-[40px] bg-[#131313] rounded-full flex flex-col items-center justify-center z-20 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]",
                  children: (0, t.jsxs)("div", {
                    className: "text-center transition-all duration-200",
                    children: [
                      (0, t.jsx)("div", { className: "text-xs font-bold uppercase tracking-widest text-white/40 mb-1", children: m ? m.name : "Total" }),
                      (0, t.jsx)("div", {
                        className: "text-4xl font-black text-white drop-shadow-lg",
                        style: { color: m ? m.color : "white" },
                        children: m ? Math.round((m.value / r) * 100) + "%" : s ? 0 : r,
                      }),
                      m && (0, t.jsxs)("div", { className: "text-xs text-white/60 mt-1", children: [m.value, " Plays"] }),
                    ],
                  }),
                }),
              ],
            }),
            (0, t.jsx)("div", {
              className: "flex flex-col gap-3 w-full max-w-[240px]",
              children: n.map((e, a) =>
                (0, t.jsxs)(
                  "div",
                  {
                    onMouseEnter: () => l(a),
                    onMouseLeave: () => l(null),
                    className: `flex items-center justify-between p-3 rounded-xl border transition-all duration-200 cursor-pointer ${i === a ? "bg-white/10 border-white/20 scale-105 shadow-lg" : "bg-white/5 border-transparent hover:bg-white/10"}`,
                    children: [
                      (0, t.jsxs)("div", {
                        className: "flex items-center gap-3",
                        children: [
                          (0, t.jsx)("div", {
                            className: `w-3 h-3 rounded-full shadow-[0_0_8px_currentColor] transition-transform ${i === a ? "scale-125" : ""}`,
                            style: { backgroundColor: s ? "#333" : e.color, color: s ? "#333" : e.color },
                          }),
                          (0, t.jsx)("span", { className: `text-sm font-medium ${i === a ? "text-white" : "text-white/70"}`, children: e.name }),
                        ],
                      }),
                      (0, t.jsx)("span", { className: `text-sm font-bold ${i === a ? "text-white" : "text-white/40"}`, children: s ? "0%" : `${Math.round((e.value / r) * 100) || 0}%` }),
                    ],
                  },
                  a,
                ),
              ),
            }),
          ],
        });
      };
    e.s(["StatisticsPageClient", () => x]);
  },
  9381,
  (e) => {
    e.v((t) => Promise.all(["static/chunks/eb08cdc987709c7e.js", "static/chunks/0adfabb2aa6f2cee.js"].map((t) => e.l(t))).then(() => t(14470)));
  },
  95329,
  (e) => {
    e.v((t) => Promise.all(["static/chunks/e2574eb79e2b1876.js", "static/chunks/906642ef0484d8c0.js"].map((t) => e.l(t))).then(() => t(49834)));
  },
  60013,
  (e) => {
    e.v((t) => Promise.all(["static/chunks/4f6922162dd3cb58.js", "static/chunks/943b33a65a061cc9.js", "static/chunks/e2574eb79e2b1876.js"].map((t) => e.l(t))).then(() => t(76759)));
  },
  65246,
  (e) => {
    e.v((t) => Promise.all(["static/chunks/e322577d00ff9492.js", "static/chunks/8de29f5cf572c896.js"].map((t) => e.l(t))).then(() => t(56471)));
  },
  32303,
  (e) => {
    e.v((t) => Promise.all(["static/chunks/e2574eb79e2b1876.js", "static/chunks/525578c9092c6aa1.js"].map((t) => e.l(t))).then(() => t(64787)));
  },
]);
