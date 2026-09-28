(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  35200,
  (e) => {
    "use strict";
    var t = e.i(43476),
      r = e.i(71645),
      a = e.i(74080),
      s = e.i(48148),
      l = e.i(8387),
      i = e.i(16187),
      o = e.i(8598);
    let n = "diceGame.players",
      c = "diceGame.penalties",
      d = "diceGame.gameState",
      x = "diceGame.playCount",
      p = "diceGame.stageThresholds",
      u = "diceGame.penaltyLibraries",
      h = () => Math.random().toString(36).slice(2),
      m = {
        1: "rotateX(0deg) rotateY(0deg)",
        2: "rotateX(-90deg) rotateY(0deg)",
        3: "rotateY(-90deg) rotateX(0deg)",
        4: "rotateY(90deg) rotateX(0deg)",
        5: "rotateX(90deg) rotateY(0deg)",
        6: "rotateX(180deg) rotateY(0deg)",
      };
    function g({ value: e, isRolling: a }) {
      let [s, l] = (0, r.useState)(m[e]);
      (0, r.useEffect)(() => {
        let t = setTimeout(() => {
          if (a) {
            let e = 360 * Math.floor(4 * Math.random() + 2) + 360 * Math.random(),
              t = 360 * Math.floor(4 * Math.random() + 2) + 360 * Math.random(),
              r = 360 * Math.floor(4 * Math.random()) + 360 * Math.random();
            l(`rotateX(${e}deg) rotateY(${t}deg) rotateZ(${r}deg)`);
          } else l(m[e]);
        }, 0);
        return () => clearTimeout(t);
      }, [e, a]);
      let i = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] },
        o = (e, r) =>
          (0, t.jsxs)("div", {
            className: "absolute inset-0 backface-hidden flex items-center justify-center rounded-xl bg-[#e0e0e0] shadow-[inset_0_0_15px_rgba(0,0,0,0.2)] border border-white/50 ring-1 ring-black/10",
            style: { transform: r },
            children: [
              (0, t.jsx)("div", { className: "absolute inset-0 rounded-xl bg-gradient-to-br from-white via-gray-200 to-gray-400" }),
              (0, t.jsx)("div", { className: "absolute inset-[2px] rounded-[10px] bg-gradient-to-br from-gray-50 via-white to-gray-200" }),
              (0, t.jsx)("div", { className: "absolute inset-0 rounded-xl shadow-[inset_2px_2px_4px_rgba(255,255,255,1),inset_-2px_-2px_4px_rgba(0,0,0,0.3)]" }),
              (0, t.jsx)("div", {
                className: "relative z-10 grid size-14 grid-cols-3 grid-rows-3 gap-1.5 p-1.5",
                children: (i[e] || []).map((r) =>
                  (0, t.jsx)(
                    "div",
                    {
                      className: `rounded-full transition-all duration-300 ${i[e].includes(r) ? "bg-gradient-to-br from-rose-500 via-pink-600 to-purple-800 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_1px_3px_rgba(0,0,0,0.3)] scale-100 ring-1 ring-black/5" : "bg-transparent scale-0"}`,
                    },
                    r,
                  ),
                ),
              }),
            ],
          });
      return (0, t.jsx)("div", {
        className: "relative",
        style: { width: 80, height: 80, perspective: "500px" },
        children: (0, t.jsxs)("div", {
          className: "relative w-full h-full transform-style-preserve-3d transition-transform duration-700 ease-out",
          style: { transform: s },
          children: [
            o(1, "rotateX(0deg) translateZ(40px)"),
            o(6, "rotateX(180deg) translateZ(40px)"),
            o(2, "rotateX(90deg) translateZ(40px)"),
            o(5, "rotateX(-90deg) translateZ(40px)"),
            o(3, "rotateY(90deg) translateZ(40px)"),
            o(4, "rotateY(-90deg) translateZ(40px)"),
          ],
        }),
      });
    }
    function b() {
      let [e] = (0, r.useState)(() =>
        Array.from({ length: 50 }).map((e, t) => ({
          key: t,
          left: `${100 * Math.random()}%`,
          backgroundColor: ["#ec4899", "#a855f7", "#fbbf24", "#34d399"][Math.floor(4 * Math.random())],
          animationDelay: `${2 * Math.random()}s`,
          animationDuration: `${2 + 3 * Math.random()}s`,
        })),
      );
      return (0, t.jsx)("div", {
        className: "pointer-events-none absolute inset-0 z-50 overflow-hidden",
        children: e.map((e) =>
          (0, t.jsx)(
            "div",
            {
              className: "absolute h-2 w-2 animate-fall opacity-0",
              style: { left: e.left, top: "-10%", backgroundColor: e.backgroundColor, animationDelay: e.animationDelay, animationDuration: e.animationDuration },
            },
            e.key,
          ),
        ),
      });
    }
    function f() {
      let e = (0, s.useTranslations)("games.dice"),
        { play: m } = (0, l.useGameSound)(),
        [f, v] = (0, r.useState)(() => {
          try {
            let e = window.localStorage.getItem(n);
            if (e) return JSON.parse(e);
          } catch {}
          return [
            { id: h(), name: `${e("defaultPlayerName")} 1`, color: "#ec4899" },
            { id: h(), name: `${e("defaultPlayerName")} 2`, color: "#a855f7" },
          ];
        }),
        j = ["#ec4899", "#a855f7", "#38bdf8", "#22d3ee", "#f97316", "#facc15", "#34d399", "#fb7185"],
        [y, N] = (0, r.useState)([]),
        [k, S] = (0, r.useState)(!1),
        [C, _] = (0, r.useState)({}),
        [z, M] = (0, r.useState)(null),
        [P, D] = (0, r.useState)(!1),
        [A, $] = (0, r.useState)(""),
        [I, E] = (0, r.useState)(null),
        [O, L] = (0, r.useState)(null),
        [T, B] = (0, r.useState)(""),
        [J, G] = (0, r.useState)(() => {
          {
            let e = window.localStorage.getItem(x);
            if (e) {
              let t = parseInt(e, 10);
              return (console.log("[DiceGame] Initialized play count from storage:", t), t);
            }
          }
          return (console.log("[DiceGame] No saved play count, starting at 0"), 0);
        }),
        [R, X] = (0, r.useState)({ stage1: 5, stage2: 15, stage3: 30 }),
        [H, U] = (0, r.useState)(!1),
        Y = () =>
          [
            [[0, 1, 2, 3, 4, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], 1],
            [[5, 6, 7, 8, 9, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39], 2],
            [[10, 11, 12, 13, 14, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49], 3],
            [[15, 16, 17, 18, 19, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69], 4],
          ].flatMap(([t, r]) => t.map((t) => ({ text: e(`defaultPenalties.${t}`), stage: r })));
      ((0, r.useEffect)(() => {
        {
          let t = window.localStorage.getItem(u),
            r = {},
            a = null;
          if (t)
            try {
              let e = JSON.parse(t);
              e.libraries && "object" == typeof e.libraries && ((r = e.libraries), (a = e.activeId || null));
            } catch (e) {
              console.error("Failed to parse penalty libraries", e);
            }
          let s = "default-penalty-library",
            l = Y(),
            i = Object.values(r).find((e) => e.id === s),
            o = { id: s, name: e("library.defaultName"), penalties: l, createdAt: i ? i.createdAt : Date.now(), isDefault: !0 };
          ((r[s] = o), a || (a = s));
          let n = "private-penalty-library",
            c = e("library.privateName"),
            d = [
              [[0, 1, 2, 3, 4, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], 1],
              [[5, 6, 7, 8, 9, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39], 2],
              [[10, 11, 12, 13, 14, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49], 3],
              [[15, 16, 17, 18, 19, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69], 4],
            ].flatMap(([t, r]) => t.map((t) => ({ text: e(`privatePenalties.${t}`), stage: r }))),
            x = Object.values(r).find((e) => e.id === n),
            p = { id: n, name: c, penalties: d, createdAt: x ? x.createdAt : Date.now() + 1, isDefault: !0 };
          ((r[n] = p), _(r), M(a), a === s ? (N(l), S(!0)) : a === n && (N(d), S(!0)));
        }
      }, [e]),
        (0, r.useEffect)(() => {
          window.localStorage.setItem(u, JSON.stringify({ libraries: C, activeId: z }));
        }, [C, z]),
        (0, r.useEffect)(() => {
          {
            let e = window.localStorage.getItem(p);
            e && X(JSON.parse(e));
          }
        }, []),
        (0, r.useEffect)(() => {
          (console.log("[DiceGame] Saving play count to storage:", J), window.localStorage.setItem(x, J.toString()));
        }, [J]),
        (0, r.useEffect)(() => {
          window.localStorage.setItem(p, JSON.stringify(R));
        }, [R]));
      let V = () => (J < R.stage1 ? 1 : J < R.stage2 ? 2 : J < R.stage3 ? 3 : 4),
        Z = (e) => {
          switch (e) {
            case 1:
              return { gradient: "from-blue-500 to-cyan-500", text: "text-blue-400", bg: "bg-blue-500/20" };
            case 2:
              return { gradient: "from-purple-500 to-pink-500", text: "text-purple-400", bg: "bg-purple-500/20" };
            case 3:
              return { gradient: "from-orange-500 to-red-500", text: "text-orange-400", bg: "bg-orange-500/20" };
            case 4:
              return { gradient: "from-red-600 to-rose-700", text: "text-red-400", bg: "bg-red-600/20" };
          }
        },
        F = () => {
          let t = V(),
            r = 0,
            a = 0,
            s = "";
          1 === t
            ? ((r = J), (a = R.stage1), (s = e("stageName1")))
            : 2 === t
              ? ((r = J - R.stage1), (a = R.stage2 - R.stage1), (s = e("stageName2")))
              : 3 === t
                ? ((r = J - R.stage2), (a = R.stage3 - R.stage2), (s = e("stageName3")))
                : ((r = J - R.stage3), (a = 999), (s = e("stageName4")));
          let l = 4 === t ? 100 : Math.min((r / a) * 100, 100);
          return { current: r, total: a, percentage: l, stageName: s };
        };
      ((0, r.useEffect)(() => {
        {
          let e = window.localStorage.getItem(u);
          if (e)
            try {
              let t = JSON.parse(e),
                r = t.activeId,
                a = t.libraries;
              if (r && a && a[r]) {
                (N(a[r].penalties || []), S(!0));
                return;
              }
            } catch (e) {
              console.error("Failed to parse penalty libraries for initial load", e);
            }
          let t = window.localStorage.getItem(c);
          if (t)
            try {
              let e = JSON.parse(t);
              (e.length > 0 && "string" == typeof e[0] ? N(e.map((e) => ({ text: e, stage: 1 }))) : N(e), S(!0));
            } catch (e) {
              console.error("Failed to parse penalties", e);
            }
          else (N(Y()), S(!1));
        }
      }, [e]),
        (0, r.useEffect)(() => {
          k && window.localStorage.setItem(c, JSON.stringify(y));
        }, [y, k]));
      let K = (e, t) => {
          try {
            let r = window.localStorage.getItem(d);
            if (r) {
              let a = JSON.parse(r);
              return void 0 !== a[e] ? a[e] : t;
            }
          } catch {}
          return t;
        },
        [W, q] = (0, r.useState)(() => K("currentPlayerIndex", 0)),
        [Q, ee] = (0, r.useState)(() => K("diceCount", 1)),
        [et, er] = (0, r.useState)(() => K("targetNumber", 3)),
        [ea, es] = (0, r.useState)(() => K("gameState", "idle")),
        [el, ei] = (0, r.useState)(() => K("currentRolls", [1])),
        [eo, en] = (0, r.useState)(() => K("currentPenalty", null)),
        [ec, ed] = (0, r.useState)(!1),
        [ex, ep] = (0, r.useState)(!1),
        eu = (0, r.useRef)(null),
        [eh, em] = (0, r.useState)(0);
      (0, r.useEffect)(() => {
        if (0 === y.length) return;
        let e = setInterval(() => {
          em((e) => (e + 1) % y.length);
        }, 3e3);
        return () => clearInterval(e);
      }, [y.length]);
      let eg = f[W % f.length];
      ((0, r.useEffect)(() => {
        window.localStorage.setItem(n, JSON.stringify(f));
      }, [f]),
        (0, r.useEffect)(() => {
          window.localStorage.setItem(d, JSON.stringify({ currentPlayerIndex: W, diceCount: Q, targetNumber: et, gameState: ea, currentRolls: el, currentPenalty: eo }));
        }, [W, Q, et, ea, el, eo]));
      let eb = () => {
          if ("rolling" === ea || "settling" === ea) return;
          ((0, o.recordDetailStat)("diceRolls"), es("rolling"));
          let e = 0,
            t = setInterval(() => {
              if ((ei(Array.from({ length: Q }).map(() => Math.ceil(6 * Math.random()))), m("roll"), ++e >= 8)) {
                clearInterval(t);
                let e = Array.from({ length: Q }).map(() => Math.ceil(6 * Math.random()));
                (ei(e),
                  es("settling"),
                  setTimeout(() => {
                    e.reduce((e, t) => e + t, 0) > et
                      ? Q >= 10
                        ? (es("win"), m("win"), (0, o.recordDetailStat)("diceWins"), (0, o.incrementGameSession)("dice", 10))
                        : (es("success"), m("success"))
                      : (es("fail"), m("fail"));
                  }, 1e3));
              }
            }, 200);
        },
        ef = () => {
          (m("levelUp"), er(el.reduce((e, t) => e + t, 0)), ee((e) => e + 1), q((e) => (e + 1) % f.length), es("idle"), ei(Array.from({ length: Q + 1 }, () => 1)));
        },
        ew = () => {
          m("flip");
          let e = V(),
            t = [];
          if (0 === (t = y.filter((t) => t.stage === e)).length) for (let r = e - 1; r >= 1 && !((t = y.filter((e) => e.stage === r)).length > 0); r--);
          (0 === t.length && (t = y), t.length > 0 && en(t[Math.floor(Math.random() * t.length)].text), (0, o.recordDetailStat)("dicePenalties"), es("penalty"));
        },
        ev = () => {
          (m("start"), er(3), ee(1), q(0), es("idle"), ei([1]), en(null));
        },
        [ej, ey] = (0, r.useState)(""),
        [eN, ek] = (0, r.useState)(1),
        eS = () => {
          ej.trim() && (N([...y, { text: ej, stage: eN }]), ey(""), ek(1), S(!0));
        },
        eC = (e) => {
          y.length <= 1 || (N(y.filter((t, r) => r !== e)), S(!0));
        },
        e_ = (e, t) => {
          (N(y.map((r, a) => (a === e ? { ...r, text: t } : r))), S(!0));
        },
        ez = (e, t) => {
          (N(y.map((r, a) => (a === e ? { ...r, stage: t } : r))), S(!0));
        },
        eM = () => {
          let t = A.trim();
          if (!t) return void E(e("library.nameRequired") || "Please enter a library name");
          if (Object.values(C).some((e) => e.name.toLowerCase() === t.toLowerCase())) return void E(e("library.nameExists") || "A library with this name already exists");
          let r = { id: h(), name: t, penalties: [...y], createdAt: Date.now() };
          (_((e) => ({ ...e, [r.id]: r })), M(r.id), $(""), E(null));
        },
        eP = (t) => {
          T.trim()
            ? Object.values(C).some((e) => e.id !== t && e.name.toLowerCase() === T.trim().toLowerCase())
              ? E(e("library.nameExists") || "A library with this name already exists")
              : (_((e) => ({ ...e, [t]: { ...e[t], name: T.trim() } })), L(null), E(null))
            : L(null);
        };
      return (0, t.jsxs)("div", {
        className: "relative flex w-full max-w-7xl flex-col items-center gap-8",
        children: [
          (0, t.jsxs)("section", {
            className: "glass-effect relative w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 p-4 sm:p-10",
            children: [
              (0, t.jsx)("div", { className: "pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px] animate-pulse-slow" }),
              (0, t.jsx)("div", {
                className: "pointer-events-none absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-rose-600/20 blur-[120px] animate-pulse-slow",
                style: { animationDelay: "2s" },
              }),
              "win" === ea && (0, t.jsx)(b, {}),
              (0, t.jsxs)("header", {
                className: "relative z-10 mb-8 flex flex-col items-center justify-center border-b border-white/5 pb-6 text-center",
                children: [
                  (0, t.jsx)("h1", {
                    className:
                      "bg-gradient-to-b from-white via-purple-100 to-white/60 bg-clip-text text-4xl font-black uppercase tracking-tighter text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] sm:text-5xl",
                    children: e("title"),
                  }),
                  (0, t.jsx)("div", { className: "mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-80" }),
                  (0, t.jsx)("p", { className: "mt-4 text-sm font-medium tracking-[0.2em] text-white/40", children: e("tagline") }),
                ],
              }),
              (0, t.jsxs)("div", {
                className: "relative z-10 grid gap-8 lg:grid-cols-[1fr_320px]",
                children: [
                  (0, t.jsxs)("div", {
                    className: `relative flex flex-col items-center justify-between rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/5 to-white/10 pt-8 pb-8 pl-2 pr-2 sm:p-8 min-h-[500px] shadow-inner overflow-hidden group ${"idle" === ea || "success" === ea || "fail" === ea ? "cursor-pointer" : ""}`,
                    onClick: () => {
                      "idle" === ea ? eb() : "success" === ea ? ef() : "fail" === ea && ew();
                    },
                    children: [
                      (0, t.jsx)("div", { className: "absolute inset-0 opacity-10", style: { backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" } }),
                      (0, t.jsxs)("div", {
                        className: "relative z-10 w-full grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-0 items-start mb-6",
                        children: [
                          (0, t.jsx)("div", {
                            className: "col-span-2 sm:col-span-1 sm:col-start-2 sm:row-start-1 flex justify-center mb-1 sm:mb-0",
                            children: (0, t.jsxs)("div", {
                              className: "flex items-center justify-center gap-3 rounded-full border border-white/10 bg-black/40 px-5 py-2 shadow-lg backdrop-blur-md",
                              children: [
                                (0, t.jsx)("div", { className: "size-2.5 rounded-full animate-pulse bg-emerald-400 shadow-[0_0_8px_currentColor] shrink-0" }),
                                (0, t.jsxs)("div", {
                                  className: "flex flex-col leading-none text-center",
                                  children: [
                                    (0, t.jsx)("span", { className: "text-[8px] font-bold uppercase tracking-widest text-white/40", children: e("turnPrefix") }),
                                    (0, t.jsx)("span", {
                                      className: "text-2xl font-bold text-white drop-shadow-md truncate max-w-[120px]",
                                      style: { color: eg?.color || "white" },
                                      children: eg?.name,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          }),
                          (0, t.jsx)("div", {
                            className: "col-span-1 sm:col-span-1 sm:col-start-1 sm:row-start-1 flex justify-center sm:justify-start",
                            children: (0, t.jsxs)("div", {
                              className: "flex flex-col items-center justify-center rounded-xl bg-black/40 border border-white/10 px-6 py-2 backdrop-blur-md w-full sm:w-auto",
                              children: [
                                (0, t.jsx)("span", { className: "text-[10px] font-bold uppercase tracking-widest text-purple-300/70 mb-1 whitespace-nowrap", children: e("diceCount") }),
                                (0, t.jsx)("span", { className: "text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]", children: Q }),
                              ],
                            }),
                          }),
                          (0, t.jsx)("div", {
                            className: "col-span-1 sm:col-span-1 sm:col-start-3 sm:row-start-1 flex justify-center sm:justify-end",
                            children: (0, t.jsxs)("div", {
                              className: "flex flex-col items-center justify-center rounded-xl bg-black/40 border border-white/10 px-6 py-2 backdrop-blur-md w-full sm:w-auto",
                              children: [
                                (0, t.jsx)("span", { className: "text-[10px] font-bold uppercase tracking-widest text-rose-300/70 mb-1 whitespace-nowrap", children: e("target") }),
                                (0, t.jsx)("span", { className: "text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]", children: et }),
                              ],
                            }),
                          }),
                        ],
                      }),
                      (0, t.jsx)("div", {
                        className: "relative z-10 flex flex-wrap justify-center gap-6 p-4 perspective-1000",
                        children: el.map((e, r) => (0, t.jsx)(g, { value: e, isRolling: "rolling" === ea }, r)),
                      }),
                      (0, t.jsx)("div", {
                        className: "relative z-10 mt-8 min-h-[6rem] text-center flex flex-col items-center justify-center",
                        children:
                          "idle" !== ea &&
                          "rolling" !== ea &&
                          "settling" !== ea &&
                          (0, t.jsxs)("div", {
                            className: "animate-pop-in flex items-center gap-6",
                            children: [
                              (0, t.jsxs)("div", {
                                className: "relative flex flex-col items-center",
                                children: [
                                  (0, t.jsx)("span", {
                                    className: "absolute top-[-1.5rem] left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 whitespace-nowrap",
                                    children: e("currentSum"),
                                  }),
                                  (0, t.jsx)("div", {
                                    className: `text-6xl font-black tracking-tighter transition-all duration-500 ${"success" === ea || "win" === ea ? "scale-110 bg-gradient-to-b from-green-300 to-emerald-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(52,211,153,0.6)]" : "scale-95 opacity-80 bg-gradient-to-b from-rose-300 to-red-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(244,63,94,0.4)]"}`,
                                    children: el.reduce((e, t) => e + t, 0),
                                  }),
                                ],
                              }),
                              (0, t.jsx)("div", { className: "text-4xl font-black text-white/20", children: el.reduce((e, t) => e + t, 0) > et ? ">" : "≤" }),
                              (0, t.jsx)("div", {
                                className: `flex flex-col items-center transition-all duration-500 ${"success" === ea || "win" === ea ? "opacity-40 scale-90 grayscale" : "opacity-100 scale-105 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"}`,
                                children: (0, t.jsx)("div", { className: "text-5xl font-black tracking-tighter text-white/30", children: et }),
                              }),
                            ],
                          }),
                      }),
                      (0, t.jsxs)("div", {
                        className: "relative z-10 mt-8 w-full max-w-xs space-y-4",
                        children: [
                          "idle" === ea &&
                            (0, t.jsxs)("button", {
                              onClick: (e) => {
                                (e.stopPropagation(), eb());
                              },
                              className:
                                "cursor-pointer group relative w-full overflow-hidden rounded-2xl bg-white py-4 text-sm font-black uppercase tracking-widest text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] active:scale-95",
                              children: [
                                (0, t.jsx)("span", { className: "relative z-10", children: e("roll") }),
                                (0, t.jsx)("div", {
                                  className:
                                    "absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gray-200 to-transparent transition-transform duration-700 group-hover:animate-shimmer",
                                }),
                              ],
                            }),
                          "success" === ea &&
                            (0, t.jsx)("button", {
                              onClick: (e) => {
                                (e.stopPropagation(), ef());
                              },
                              className:
                                "cursor-pointer group w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-green-600 py-4 text-sm font-black uppercase tracking-widest text-white shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] active:scale-95",
                              children: e("pass"),
                            }),
                          "fail" === ea &&
                            (0, t.jsx)("button", {
                              onClick: (e) => {
                                (e.stopPropagation(), ew());
                              },
                              className:
                                "cursor-pointer group w-full rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 py-4 text-sm font-black uppercase tracking-widest text-white shadow-[0_0_25px_rgba(244,63,94,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(244,63,94,0.6)] active:scale-95",
                              children: (0, t.jsx)("span", { className: "drop-shadow-md", children: e("drawPenalty") }),
                            }),
                          "win" === ea &&
                            (0, t.jsx)("button", {
                              onClick: (e) => {
                                (e.stopPropagation(), ev());
                              },
                              className:
                                "cursor-pointer group w-full rounded-2xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 py-4 text-sm font-black uppercase tracking-widest text-white shadow-[0_0_30px_rgba(192,38,211,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(192,38,211,0.7)] active:scale-95",
                              children: e("restart"),
                            }),
                        ],
                      }),
                    ],
                  }),
                  (0, t.jsxs)("div", {
                    className: "flex flex-col gap-5",
                    children: [
                      (0, t.jsxs)("div", {
                        className: "group rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/5 to-black/40 p-6 transition-colors hover:border-white/20 hover:bg-white/10",
                        children: [
                          (0, t.jsxs)("div", {
                            className: "flex items-center justify-between mb-5",
                            children: [
                              (0, t.jsx)("h3", { className: "text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white/70 transition-colors", children: e("playersTitle") }),
                              (0, t.jsx)("button", {
                                onClick: () => ed(!0),
                                title: e("edit"),
                                className: "cursor-pointer rounded-full bg-white/5 p-1.5 transition-colors group-hover:bg-white/10",
                                children: (0, t.jsxs)("svg", {
                                  xmlns: "http://www.w3.org/2000/svg",
                                  viewBox: "0 0 20 20",
                                  fill: "currentColor",
                                  className: "size-4.5 text-white/40 group-hover:text-white",
                                  children: [
                                    (0, t.jsx)("path", {
                                      d: "M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z",
                                    }),
                                    (0, t.jsx)("path", {
                                      d: "M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z",
                                    }),
                                  ],
                                }),
                              }),
                            ],
                          }),
                          (0, t.jsx)("div", {
                            className: "flex -space-x-3 overflow-hidden py-1",
                            children: f.map((e) =>
                              (0, t.jsxs)(
                                "div",
                                {
                                  title: e.name,
                                  className:
                                    "relative flex size-10 items-center justify-center rounded-full border-2 border-white/20 ring-1 ring-black/50 text-base font-extrabold text-white shadow-lg transition-all duration-300 ease-out first:ml-0 hover:-translate-y-1 hover:z-10",
                                  style: {
                                    backgroundColor: e.color,
                                    background: `linear-gradient(145deg, ${e.color} 0%, ${e.color}EE 70%, ${e.color}CC 100%)`,
                                    textShadow: "0 0 5px rgba(255,255,255,0.7), 0 0 10px rgba(255,255,255,0.4)",
                                  },
                                  children: [
                                    (0, t.jsx)("span", { className: "select-none relative z-10 drop-shadow-md", children: e.name.charAt(0).toUpperCase() }),
                                    (0, t.jsx)("div", { className: "absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-30 pointer-events-none" }),
                                  ],
                                },
                                e.id,
                              ),
                            ),
                          }),
                        ],
                      }),
                      (0, t.jsxs)("div", {
                        className:
                          "group relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/5 to-black/40 p-6 flex-1 transition-all hover:border-rose-500/30 hover:bg-rose-900/10 cursor-pointer",
                        onClick: () => ep(!0),
                        children: [
                          (0, t.jsx)("div", { className: "absolute inset-0 opacity-[0.03] bg-[url('/noise.png')]" }),
                          (0, t.jsxs)("div", {
                            className: "relative z-10 flex flex-col h-full",
                            children: [
                              (0, t.jsxs)("div", {
                                className: "flex flex-col gap-3 mb-4",
                                children: [
                                  (0, t.jsxs)("div", {
                                    className: "flex items-center justify-between",
                                    children: [
                                      (0, t.jsx)("div", {
                                        className: "flex flex-col gap-1",
                                        children: (0, t.jsxs)("div", {
                                          className: "flex items-center gap-2",
                                          children: [
                                            (0, t.jsx)("h3", {
                                              className: "text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-rose-300 transition-colors",
                                              children: e("penaltiesTitle"),
                                            }),
                                            (0, t.jsx)("div", {
                                              className: "rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/20",
                                              children: y.length,
                                            }),
                                          ],
                                        }),
                                      }),
                                      (0, t.jsxs)("div", {
                                        className: "flex gap-2",
                                        children: [
                                          (0, t.jsx)("button", {
                                            onClick: (e) => {
                                              (e.stopPropagation(), D(!0));
                                            },
                                            title: e("library.title") || "Penalty Libraries",
                                            className: "cursor-pointer rounded-full bg-purple-500/20 p-1.5 text-purple-300 transition-colors hover:bg-purple-500/30 border border-purple-500/30",
                                            children: (0, t.jsx)("svg", {
                                              xmlns: "http://www.w3.org/2000/svg",
                                              fill: "none",
                                              viewBox: "0 0 24 24",
                                              strokeWidth: 1.5,
                                              stroke: "currentColor",
                                              className: "size-4",
                                              children: (0, t.jsx)("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                d: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
                                              }),
                                            }),
                                          }),
                                          (0, t.jsx)("button", {
                                            onClick: (e) => {
                                              (e.stopPropagation(), U(!0));
                                            },
                                            title: e("configureStages"),
                                            className: "cursor-pointer rounded-full bg-white/5 p-1.5 transition-colors hover:bg-white/10",
                                            children: (0, t.jsxs)("svg", {
                                              xmlns: "http://www.w3.org/2000/svg",
                                              fill: "none",
                                              viewBox: "0 0 24 24",
                                              strokeWidth: 1.5,
                                              stroke: "currentColor",
                                              className: "size-4 text-white/40 hover:text-white",
                                              children: [
                                                (0, t.jsx)("path", {
                                                  strokeLinecap: "round",
                                                  strokeLinejoin: "round",
                                                  d: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z",
                                                }),
                                                (0, t.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }),
                                              ],
                                            }),
                                          }),
                                          (0, t.jsx)("div", {
                                            title: e("edit"),
                                            className: "rounded-full bg-white/5 p-1.5 transition-colors group-hover:bg-white/10",
                                            children: (0, t.jsxs)("svg", {
                                              xmlns: "http://www.w3.org/2000/svg",
                                              viewBox: "0 0 20 20",
                                              fill: "currentColor",
                                              className: "size-4 text-white/40 group-hover:text-white",
                                              children: [
                                                (0, t.jsx)("path", {
                                                  d: "M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z",
                                                }),
                                                (0, t.jsx)("path", {
                                                  d: "M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z",
                                                }),
                                              ],
                                            }),
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  (0, t.jsxs)("div", {
                                    className: "flex flex-col gap-1.5",
                                    children: [
                                      (0, t.jsxs)("div", {
                                        className: "flex items-center justify-between text-[10px]",
                                        children: [
                                          (0, t.jsx)("span", { className: `font-bold ${Z(V()).text}`, children: F().stageName }),
                                          (0, t.jsx)("span", { className: "text-white/30", children: 4 === V() ? `${J}+` : `${F().current}/${F().total}` }),
                                        ],
                                      }),
                                      (0, t.jsx)("div", {
                                        className: "h-2 w-full rounded-full bg-black/40 overflow-hidden",
                                        children: (0, t.jsx)("div", {
                                          className: `h-full transition-all duration-500 ease-out bg-gradient-to-r ${Z(V()).gradient}`,
                                          style: { width: `${F().percentage}%` },
                                        }),
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              (0, t.jsxs)("div", {
                                className: "relative flex-1 min-h-[100px] mx-2",
                                children: [
                                  (0, t.jsx)("div", {
                                    className:
                                      "absolute top-2 left-2 right-2 bottom-0 rounded-xl border border-white/5 bg-white/5 transform rotate-2 scale-95 transition-transform group-hover:rotate-3 group-hover:translate-y-1 duration-500",
                                  }),
                                  (0, t.jsx)("div", {
                                    className:
                                      "absolute top-1 left-1 right-1 bottom-1 rounded-xl border border-white/5 bg-white/5 transform -rotate-1 scale-98 transition-transform group-hover:-rotate-2 group-hover:translate-y-0.5 duration-500",
                                  }),
                                  (0, t.jsxs)("div", {
                                    className:
                                      "absolute inset-0 rounded-xl border border-white/10 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-4 shadow-lg transform transition-transform group-hover:-translate-y-1 group-hover:shadow-xl duration-300 flex flex-col justify-center overflow-hidden",
                                    children: [
                                      (0, t.jsx)("div", { className: "absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-rose-500/0 via-rose-500/50 to-rose-500/0 opacity-50" }),
                                      (0, t.jsx)("div", {
                                        className: "relative",
                                        children: (0, t.jsxs)("p", {
                                          className: "text-sm font-medium text-white/80 line-clamp-3 leading-relaxed text-center italic opacity-80 select-none",
                                          children: ['"', y[eh]?.text || "...", '"'],
                                        }),
                                      }),
                                      (0, t.jsx)("div", { className: "absolute bottom-2 right-2 text-[10px] text-white/10 font-black", children: eh + 1 }),
                                    ],
                                  }),
                                ],
                              }),
                              (0, t.jsx)("div", {
                                className: "mt-3 text-center",
                                children: (0, t.jsx)("span", {
                                  className: "text-[10px] font-bold uppercase tracking-wide text-white/30 group-hover:text-white/50 transition-colors",
                                  children: e("clickToManage"),
                                }),
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, t.jsx)("button", {
                        onClick: () => {
                          (G(0), window.localStorage.removeItem(x), ev());
                        },
                        className:
                          "cursor-pointer group flex w-full items-center justify-center gap-2 rounded-[2rem] border border-white/10 bg-white/5 p-4 transition-all hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-200 text-white/40",
                        children: (0, t.jsx)("span", { className: "text-xs font-bold uppercase tracking-widest", children: e("resetProgress") }),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          eo &&
            (0, a.createPortal)(
              (0, t.jsx)("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl animate-in fade-in duration-300",
                children: (0, t.jsxs)("div", {
                  className:
                    "relative w-full max-w-md overflow-hidden rounded-[2rem] border border-rose-500/30 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-8 text-center shadow-[0_0_60px_rgba(225,29,72,0.3)]",
                  children: [
                    (0, t.jsx)("div", { className: "absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay" }),
                    (0, t.jsxs)("div", {
                      className: "relative z-10",
                      children: [
                        (0, t.jsx)("div", { className: "mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-rose-500/20 text-4xl", children: "😈" }),
                        (0, t.jsx)("h3", { className: "text-sm font-bold uppercase tracking-widest text-rose-400 mb-2", children: e("penaltyTitle") }),
                        (0, t.jsxs)("div", {
                          className: "flex items-center justify-center gap-3 mb-2",
                          children: [
                            (0, t.jsx)("div", { className: "size-8 rounded-full border-2 border-white/20 shadow-[0_0_10px_rgba(0,0,0,0.5)]", style: { backgroundColor: eg?.color } }),
                            (0, t.jsx)("span", { className: "text-xl font-black text-white drop-shadow-md", children: eg?.name }),
                          ],
                        }),
                        (0, t.jsx)("p", { className: "text-xs text-white/40 uppercase tracking-wide mb-8", children: e("penaltySubtitle") }),
                        (0, t.jsx)("div", {
                          className: "mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6",
                          children: (0, t.jsx)("p", { className: "text-lg font-bold leading-relaxed text-white", children: eo }),
                        }),
                        (0, t.jsx)("button", {
                          onClick: () => {
                            (m("select"),
                              G((e) => {
                                let t = e + 1;
                                return (console.log("[DiceGame] Play count incremented:", e, "->", t), t);
                              }),
                              er(3),
                              ee(1),
                              q((e) => (e + 1) % f.length),
                              es("idle"),
                              ei([1]),
                              en(null));
                          },
                          className: "cursor-pointer w-full rounded-xl bg-white py-4 text-sm font-bold uppercase tracking-widest text-black transition hover:bg-gray-200",
                          children: e("restart"),
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              document.body,
            ),
          "win" === ea &&
            (0, a.createPortal)(
              (0, t.jsx)("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl animate-in fade-in duration-300",
                children: (0, t.jsx)("div", {
                  className:
                    "relative w-full max-w-md overflow-hidden rounded-[2rem] border border-yellow-500/30 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-8 text-center shadow-[0_0_60px_rgba(234,179,8,0.3)]",
                  children: (0, t.jsxs)("div", {
                    className: "relative z-10",
                    children: [
                      (0, t.jsx)("div", { className: "mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-yellow-500/20 text-4xl animate-bounce", children: "🏆" }),
                      (0, t.jsx)("h3", { className: "text-2xl font-black uppercase tracking-tight text-yellow-400 mb-4", children: e("winTitle") }),
                      (0, t.jsx)("p", { className: "text-white/80 mb-8", children: e("winMessage", { name: eg.name }) }),
                      (0, t.jsx)("button", {
                        onClick: ev,
                        className:
                          "cursor-pointer w-full rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 py-4 text-sm font-bold uppercase tracking-widest text-black transition hover:scale-105",
                        children: e("restart"),
                      }),
                    ],
                  }),
                }),
              }),
              document.body,
            ),
          ec &&
            (0, a.createPortal)(
              (0, t.jsx)("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in",
                children: (0, t.jsxs)("div", {
                  className: "w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-6 shadow-2xl",
                  children: [
                    (0, t.jsx)("h3", { className: "mb-4 text-lg font-bold text-white", children: e("playersTitle") }),
                    (0, t.jsx)("div", {
                      className: "space-y-3 mb-6 max-h-[60vh] overflow-y-auto custom-scrollbar",
                      children: f.map((e) =>
                        (0, t.jsxs)(
                          "div",
                          {
                            className: "flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2 pr-3",
                            children: [
                              (0, t.jsx)("input", {
                                type: "color",
                                value: e.color,
                                onChange: (t) => {
                                  var r, a;
                                  return ((r = e.id), (a = t.target.value), void v(f.map((e) => (e.id === r ? { ...e, color: a } : e))));
                                },
                                className: "size-8 rounded-full cursor-pointer overflow-hidden",
                                title: "Player color",
                              }),
                              (0, t.jsx)("input", {
                                value: e.name,
                                onChange: (t) => {
                                  var r, a;
                                  return ((r = e.id), (a = t.target.value), void v(f.map((e) => (e.id === r ? { ...e, name: a } : e))));
                                },
                                className: "flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white",
                              }),
                              (0, t.jsx)("button", {
                                onClick: () => {
                                  var t;
                                  return ((t = e.id), void (!(f.length <= 1) && v(f.filter((e) => e.id !== t))));
                                },
                                className: "cursor-pointer p-2 text-white/40 hover:text-rose-400",
                                children: "✕",
                              }),
                            ],
                          },
                          e.id,
                        ),
                      ),
                    }),
                    (0, t.jsxs)("div", {
                      className: "flex gap-3",
                      children: [
                        (0, t.jsxs)("button", {
                          onClick: () => {
                            v([...f, { id: h(), name: `${e("defaultPlayerName")} ${f.length + 1}`, color: j[f.length % j.length] }]);
                          },
                          className: "cursor-pointer flex-1 rounded-xl bg-purple-600 py-3 text-sm font-bold text-white hover:bg-purple-500",
                          children: ["+ ", e("addPlayer")],
                        }),
                        (0, t.jsx)("button", {
                          onClick: () => ed(!1),
                          className: "cursor-pointer flex-1 rounded-xl bg-white py-3 text-sm font-bold text-black hover:bg-gray-200",
                          children: e("done"),
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              document.body,
            ),
          ex &&
            (0, a.createPortal)(
              (0, t.jsx)("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in",
                children: (0, t.jsxs)("div", {
                  className: "w-full max-w-lg rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-6 shadow-2xl flex flex-col max-h-[80vh]",
                  children: [
                    (0, t.jsxs)("div", {
                      className: "flex items-center justify-between mb-6",
                      children: [
                        (0, t.jsx)("h3", { className: "text-lg font-bold text-white", children: e("managePenalties") }),
                        (0, t.jsxs)("div", {
                          className: "flex gap-3",
                          children: [
                            (0, t.jsx)("button", {
                              onClick: () => {
                                eu.current && ((eu.current.value = ""), eu.current.click());
                              },
                              title: e("importPenalties"),
                              className: "cursor-pointer rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20",
                              children: (0, t.jsx)("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                fill: "currentColor",
                                viewBox: "0 0 1024 1024",
                                strokeWidth: "2",
                                stroke: "currentColor",
                                className: "size-4",
                                children: (0, t.jsx)("path", {
                                  d: "M693.96 135.71h235.26v62.04H693.96v-62.04zM870.86 192.26h58.36v700.36h-58.36V192.26z m-758.73 642h758.72v58.36H112.13v-58.36z m0-291.82h58.36v291.82h-58.36V542.44zM463.53 701.41l256.05-291.99h-512.1zM365.58 410.85h234.03c-45.29-158.39-200.75-275.14-385.65-275.14-40.7 0-79.96 5.69-116.96 16.2 131.04 37.24 233.25 135.44 268.58 258.94z",
                                }),
                              }),
                            }),
                            (0, t.jsx)("button", {
                              onClick: (e) => {
                                try {
                                  let t = JSON.stringify(y),
                                    r = e.ctrlKey ? t : (0, i.encodeBase64)(t),
                                    a = new Blob(
                                      [
                                        `${r}
`,
                                      ],
                                      { type: "text/plain;charset=utf-8" },
                                    ),
                                    s = URL.createObjectURL(a),
                                    l = document.createElement("a");
                                  ((l.href = s), (l.download = "dice-penalties.txt"), document.body.appendChild(l), l.click(), document.body.removeChild(l), URL.revokeObjectURL(s));
                                } catch (e) {
                                  console.error("Export failed", e);
                                }
                              },
                              title: e("exportPenalties"),
                              className: "cursor-pointer rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20",
                              children: (0, t.jsx)("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                fill: "currentColor",
                                viewBox: "0 0 1024 1024",
                                strokeWidth: "2",
                                stroke: "currentColor",
                                className: "size-4",
                                children: (0, t.jsx)("path", {
                                  d: "M325.68 222.44H98.57v-59.89h227.11v59.89zM154.91 893.24H98.57v-676.1h56.34v676.1z m732.44 0H154.91V836.9h732.44v56.34z m0-56.34h-56.34V555.19h56.34V836.9zM927.4 382.27L645.53 135.09v494.36zM646.91 476.83V250.9C494.01 294.62 381.3 444.7 381.3 623.19c0 39.29 5.49 77.19 15.64 112.91 35.95-126.5 130.75-225.16 249.97-259.27z",
                                }),
                              }),
                            }),
                            (0, t.jsx)("button", {
                              onClick: () => {
                                (N(Y()), S(!1), window.localStorage.removeItem(c));
                              },
                              className: "cursor-pointer text-xs font-bold text-rose-400 hover:text-rose-300 uppercase tracking-wide",
                              children: e("resetToDefaults"),
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, t.jsx)("input", {
                      ref: eu,
                      type: "file",
                      accept: ".json,.txt",
                      className: "hidden",
                      onChange: (t) => {
                        let r = t.target.files?.[0];
                        if (!r) return;
                        let a = new FileReader();
                        ((a.onload = (t) => {
                          try {
                            let r = t.target?.result;
                            if ("string" == typeof r) {
                              let t,
                                a = r.trim();
                              if (!a) return void alert(e("importError"));
                              let s = a;
                              try {
                                t = JSON.parse(a);
                              } catch (r) {
                                if ("{" === a[0] || "[" === a[0]) return void alert(e("importError"));
                                try {
                                  ((s = (0, i.decodeBase64)(a)), (t = JSON.parse(s)));
                                } catch (t) {
                                  try {
                                    let e = a
                                      .split(/\r?\n/)
                                      .filter((e) => "" !== e.trim())
                                      .map((e) => {
                                        let t = e.split("|");
                                        if (2 !== t.length) return { text: e.replace(/\\n/g, "\n"), stage: 1 };
                                        {
                                          let e = t[0].replace(/\\n/g, "\n"),
                                            r = parseInt(t[1], 10);
                                          return { text: e, stage: r >= 1 && r <= 4 ? r : 1 };
                                        }
                                      });
                                    if (e.length > 0) {
                                      (N(e), S(!0));
                                      return;
                                    }
                                  } catch {}
                                  alert(e("importError"));
                                  return;
                                }
                              }
                              Array.isArray(t)
                                ? t.every((e) => "string" == typeof e)
                                  ? (N(t.map((e) => ({ text: e, stage: 1 }))), S(!0))
                                  : t.every((e) => e && "object" == typeof e && "text" in e && "stage" in e)
                                    ? (N(t), S(!0))
                                    : alert(e("importError"))
                                : alert(e("importError"));
                            }
                          } catch (t) {
                            (console.error("Import failed", t), alert(e("importError")));
                          }
                        }),
                          a.readAsText(r));
                      },
                    }),
                    (0, t.jsxs)("div", {
                      className: "mb-4 flex flex-col gap-2",
                      children: [
                        (0, t.jsxs)("div", {
                          className: "flex flex-col sm:flex-row gap-2",
                          children: [
                            (0, t.jsx)("input", {
                              value: ej,
                              onChange: (e) => ey(e.target.value),
                              placeholder: e("penaltyPlaceholder"),
                              className: "flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500",
                              onKeyDown: (e) => "Enter" === e.key && eS(),
                            }),
                            (0, t.jsxs)("div", {
                              className: "flex gap-2",
                              children: [
                                (0, t.jsxs)("select", {
                                  value: eN,
                                  onChange: (e) => ek(Number(e.target.value)),
                                  className: `flex-1 sm:flex-none rounded-xl border border-white/20 px-3 py-3 text-sm text-white focus:outline-none focus:border-white/40 ${Z(eN).bg}`,
                                  style: { colorScheme: "dark" },
                                  children: [
                                    (0, t.jsxs)("option", { value: "1", className: "bg-black text-white", children: [e("stage"), " 1"] }),
                                    (0, t.jsxs)("option", { value: "2", className: "bg-black text-white", children: [e("stage"), " 2"] }),
                                    (0, t.jsxs)("option", { value: "3", className: "bg-black text-white", children: [e("stage"), " 3"] }),
                                    (0, t.jsxs)("option", { value: "4", className: "bg-black text-white", children: [e("stage"), " 4"] }),
                                  ],
                                }),
                                (0, t.jsx)("button", {
                                  onClick: eS,
                                  className: "cursor-pointer rounded-xl bg-purple-600 px-4 font-bold text-white hover:bg-purple-500 whitespace-nowrap",
                                  title: e("addPenalty"),
                                  children: e("addPenalty") || "+",
                                }),
                              ],
                            }),
                          ],
                        }),
                        (0, t.jsxs)("div", {
                          className: "text-[10px] text-white/40 px-2",
                          children: [
                            e("stage"),
                            " 1: 0-",
                            R.stage1 - 1,
                            " ",
                            e("plays"),
                            " • ",
                            e("stage"),
                            " 2: ",
                            R.stage1,
                            "-",
                            R.stage2 - 1,
                            " • ",
                            e("stage"),
                            " 3: ",
                            R.stage2,
                            "-",
                            R.stage3 - 1,
                            " • ",
                            e("stage"),
                            " 4: ",
                            R.stage3,
                            "+",
                          ],
                        }),
                      ],
                    }),
                    (0, t.jsx)("div", {
                      className: "flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2",
                      children: y.map((e, r) => (0, t.jsx)(w, { index: r, penalty: e, totalPenalties: y.length, getStageColors: Z, updatePenalty: e_, updatePenaltyStage: ez, removePenalty: eC }, r)),
                    }),
                    (0, t.jsx)("div", {
                      className: "mt-6",
                      children: (0, t.jsx)("button", {
                        onClick: () => ep(!1),
                        className: "cursor-pointer w-full rounded-xl bg-white py-3 text-sm font-bold text-black hover:bg-gray-200",
                        children: e("done"),
                      }),
                    }),
                  ],
                }),
              }),
              document.body,
            ),
          P &&
            (0, a.createPortal)(
              (0, t.jsx)("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in",
                children: (0, t.jsxs)("div", {
                  className: "w-full max-w-2xl rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-6 shadow-2xl flex flex-col max-h-[80vh]",
                  children: [
                    (0, t.jsxs)("div", {
                      className: "flex items-center justify-between mb-6",
                      children: [
                        (0, t.jsxs)("div", {
                          children: [
                            (0, t.jsxs)("h3", {
                              className: "text-lg font-bold text-white flex items-center gap-2",
                              children: [(0, t.jsx)("span", { children: "📚" }), (0, t.jsx)("span", { children: e("library.title") || "Penalty Libraries" })],
                            }),
                            (0, t.jsx)("p", { className: "text-sm text-white/60 mt-1", children: e("library.subtitle") || "Save and switch between different penalty collections" }),
                          ],
                        }),
                        (0, t.jsx)("button", {
                          onClick: () => D(!1),
                          className: "cursor-pointer rounded-full bg-white/5 size-8 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-colors",
                          children: "✕",
                        }),
                      ],
                    }),
                    I && (0, t.jsx)("div", { className: "mb-4 rounded-xl bg-rose-500/20 border border-rose-500/30 p-3 text-sm text-rose-200", children: I }),
                    (0, t.jsxs)("div", {
                      className: "mb-6 rounded-xl border border-white/10 bg-white/5 p-4",
                      children: [
                        (0, t.jsx)("label", { className: "text-sm font-semibold text-white/80 mb-2 block", children: e("library.newLabel") || "Save current penalties as new library" }),
                        (0, t.jsxs)("div", {
                          className: "flex flex-col sm:flex-row gap-2",
                          children: [
                            (0, t.jsx)("input", {
                              type: "text",
                              value: A,
                              onChange: (e) => $(e.target.value),
                              placeholder: e("library.namePlaceholder") || "Enter library name...",
                              className: "flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-white focus:outline-none focus:border-purple-500",
                              onKeyDown: (e) => "Enter" === e.key && eM(),
                            }),
                            (0, t.jsx)("button", {
                              onClick: eM,
                              className: "cursor-pointer rounded-xl bg-purple-600 px-6 py-2 font-bold text-white hover:bg-purple-500 whitespace-nowrap",
                              children: e("library.saveNew") || "Save",
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, t.jsx)("div", {
                      className: "flex-1 overflow-y-auto custom-scrollbar space-y-3",
                      children:
                        0 === Object.keys(C).length
                          ? (0, t.jsx)("div", {
                              className: "text-center py-12 text-white/40",
                              children: (0, t.jsx)("p", { children: e("library.empty") || "No saved libraries yet. Create one above!" }),
                            })
                          : Object.values(C)
                              .sort((e, t) => t.createdAt - e.createdAt)
                              .map((r) => {
                                let a = z === r.id,
                                  s = r.penalties.length;
                                return (0, t.jsx)(
                                  "div",
                                  {
                                    className: `rounded-xl border p-4 transition-all ${a ? "border-purple-500/50 bg-purple-500/10" : "border-white/10 bg-white/5"}`,
                                    children: (0, t.jsxs)("div", {
                                      className: "flex flex-col gap-3",
                                      children: [
                                        (0, t.jsxs)("div", {
                                          className: "flex-1",
                                          children: [
                                            (0, t.jsxs)("div", {
                                              className: "flex flex-wrap items-center gap-2 mb-1",
                                              children: [
                                                O === r.id
                                                  ? (0, t.jsx)("input", {
                                                      autoFocus: !0,
                                                      value: T,
                                                      onChange: (e) => B(e.target.value),
                                                      onBlur: () => eP(r.id),
                                                      onKeyDown: (e) => {
                                                        ("Enter" === e.key && eP(r.id), "Escape" === e.key && L(null));
                                                      },
                                                      className:
                                                        "bg-black/50 border border-white/20 rounded px-2 py-0.5 text-sm font-bold text-white focus:outline-none focus:border-purple-500 min-w-[150px]",
                                                      onClick: (e) => e.stopPropagation(),
                                                    })
                                                  : (0, t.jsx)("h4", {
                                                      className: `font-bold text-white ${!r.isDefault ? "cursor-pointer hover:underline hover:text-purple-300" : ""}`,
                                                      onClick: () => {
                                                        r.isDefault || (L(r.id), B(r.name));
                                                      },
                                                      title: r.isDefault ? "" : "Click to rename",
                                                      children: r.name,
                                                    }),
                                                a &&
                                                  (0, t.jsx)("span", {
                                                    className:
                                                      "rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-300 border border-purple-500/30 whitespace-nowrap",
                                                    children: e("library.activeBadge") || "Active",
                                                  }),
                                                r.isDefault &&
                                                  (0, t.jsx)("span", {
                                                    className: "rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/50 whitespace-nowrap",
                                                    children: e("library.defaultBadge") || "Default",
                                                  }),
                                              ],
                                            }),
                                            (0, t.jsx)("p", { className: "text-xs text-white/60", children: e("library.stats", { count: s }) || `${s} penalties` }),
                                          ],
                                        }),
                                        (0, t.jsxs)("div", {
                                          className: "flex flex-wrap gap-2 text-[11px]",
                                          children: [
                                            (0, t.jsx)("button", {
                                              onClick: () => {
                                                var e;
                                                let t;
                                                (t = C[(e = r.id)]) && (N([...t.penalties]), M(e), S(!0), D(!1), ep(!1), E(null));
                                              },
                                              className:
                                                "cursor-pointer rounded-full border border-sky-400/60 px-3 py-1 font-semibold uppercase tracking-widest text-sky-100 transition hover:border-sky-300 hover:text-sky-50 whitespace-nowrap",
                                              children: a ? e("library.reload") || "Reload" : e("library.use") || "Use",
                                            }),
                                            !r.isDefault &&
                                              (0, t.jsxs)(t.Fragment, {
                                                children: [
                                                  (0, t.jsx)("button", {
                                                    onClick: () =>
                                                      ((t) => {
                                                        let r = C[t];
                                                        if (!r) return;
                                                        if (r.isDefault) return void E(e("library.overwriteDefault") || "Cannot overwrite default library");
                                                        let a = { ...r, penalties: [...y], createdAt: Date.now() };
                                                        (_((e) => ({ ...e, [t]: a })), E(null));
                                                      })(r.id),
                                                    className:
                                                      "cursor-pointer rounded-full border border-amber-400/60 px-3 py-1 font-semibold uppercase tracking-widest text-amber-100 transition hover:border-amber-300 hover:text-amber-50 whitespace-nowrap",
                                                    children: e("library.overwrite") || "Overwrite",
                                                  }),
                                                  (0, t.jsx)("button", {
                                                    onClick: () =>
                                                      ((t) => {
                                                        let r = C[t];
                                                        if (!r) return;
                                                        if (r.isDefault) return void E(e("library.deleteDefault") || "Cannot delete default library");
                                                        let { [t]: a, ...s } = C;
                                                        (_(s), z === t && (M(null), N(Y()), S(!1)), E(null));
                                                      })(r.id),
                                                    className:
                                                      "cursor-pointer rounded-full border border-rose-400/60 px-3 py-1 font-semibold uppercase tracking-widest text-rose-100 transition hover:border-rose-300 hover:text-rose-50 whitespace-nowrap",
                                                    children: e("library.delete") || "Delete",
                                                  }),
                                                ],
                                              }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  },
                                  r.id,
                                );
                              }),
                    }),
                    (0, t.jsx)("div", {
                      className: "mt-6",
                      children: (0, t.jsx)("button", {
                        onClick: () => D(!1),
                        className: "cursor-pointer w-full rounded-xl bg-white py-3 text-sm font-bold text-black hover:bg-gray-200",
                        children: e("library.close") || "Close",
                      }),
                    }),
                  ],
                }),
              }),
              document.body,
            ),
          H &&
            (0, a.createPortal)(
              (0, t.jsx)("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in",
                children: (0, t.jsxs)("div", {
                  className: "w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-6 shadow-2xl",
                  children: [
                    (0, t.jsxs)("div", {
                      className: "flex items-center justify-between mb-6",
                      children: [
                        (0, t.jsx)("h3", { className: "text-lg font-bold text-white", children: e("stageConfigTitle") }),
                        (0, t.jsx)("button", {
                          onClick: () => U(!1),
                          className: "cursor-pointer rounded-full bg-white/5 size-8 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-colors",
                          children: "✕",
                        }),
                      ],
                    }),
                    (0, t.jsxs)("div", {
                      className: "space-y-4 mb-6",
                      children: [
                        (0, t.jsxs)("div", {
                          className: "flex flex-col gap-2",
                          children: [
                            (0, t.jsxs)("label", {
                              className: "text-sm text-white/70 flex items-center gap-2",
                              children: [
                                (0, t.jsx)("span", { className: "font-bold", children: e("stage1Label") }),
                                (0, t.jsx)("span", { className: "text-xs text-white/40", children: e("stage1Desc") }),
                              ],
                            }),
                            (0, t.jsx)("input", {
                              type: "number",
                              min: "1",
                              value: R.stage1,
                              onChange: (e) => X({ ...R, stage1: Math.max(1, parseInt(e.target.value) || 1) }),
                              className: "rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:outline-none focus:border-purple-500",
                            }),
                            (0, t.jsx)("span", { className: "text-xs text-white/40", children: e("playsNeededStage2") }),
                          ],
                        }),
                        (0, t.jsxs)("div", {
                          className: "flex flex-col gap-2",
                          children: [
                            (0, t.jsxs)("label", {
                              className: "text-sm text-white/70 flex items-center gap-2",
                              children: [
                                (0, t.jsx)("span", { className: "font-bold", children: e("stage2Label") }),
                                (0, t.jsx)("span", { className: "text-xs text-white/40", children: e("stage2Desc") }),
                              ],
                            }),
                            (0, t.jsx)("input", {
                              type: "number",
                              min: R.stage1 + 1,
                              value: R.stage2,
                              onChange: (e) => X({ ...R, stage2: Math.max(R.stage1 + 1, parseInt(e.target.value) || R.stage1 + 1) }),
                              className: "rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:outline-none focus:border-purple-500",
                            }),
                            (0, t.jsx)("span", { className: "text-xs text-white/40", children: e("playsNeededStage3") }),
                          ],
                        }),
                        (0, t.jsxs)("div", {
                          className: "flex flex-col gap-2",
                          children: [
                            (0, t.jsxs)("label", {
                              className: "text-sm text-white/70 flex items-center gap-2",
                              children: [
                                (0, t.jsx)("span", { className: "font-bold", children: e("stage3Label") }),
                                (0, t.jsx)("span", { className: "text-xs text-white/40", children: e("stage3Desc") }),
                              ],
                            }),
                            (0, t.jsx)("input", {
                              type: "number",
                              min: R.stage2 + 1,
                              value: R.stage3,
                              onChange: (e) => X({ ...R, stage3: Math.max(R.stage2 + 1, parseInt(e.target.value) || R.stage2 + 1) }),
                              className: "rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:outline-none focus:border-purple-500",
                            }),
                            (0, t.jsx)("span", { className: "text-xs text-white/40", children: e("playsNeededStage4") }),
                          ],
                        }),
                      ],
                    }),
                    (0, t.jsxs)("div", {
                      className: "bg-white/5 rounded-xl p-3 mb-6 text-xs text-white/60",
                      children: [
                        (0, t.jsx)("div", { className: "font-bold mb-1", children: e("currentProgress") }),
                        (0, t.jsxs)("div", { children: [J, " ", e("plays"), " / ", e("currentStage"), " ", V()] }),
                      ],
                    }),
                    (0, t.jsx)("button", { onClick: () => U(!1), className: "cursor-pointer w-full rounded-xl bg-white py-3 text-sm font-bold text-black hover:bg-gray-200", children: e("done") }),
                  ],
                }),
              }),
              document.body,
            ),
        ],
      });
    }
    let w = ({ index: e, penalty: a, totalPenalties: s, getStageColors: l, updatePenalty: i, updatePenaltyStage: o, removePenalty: n }) => {
      let [c, d] = (0, r.useState)(a.text),
        [x, p] = (0, r.useState)(a.text);
      return (
        x !== a.text && (p(a.text), d(a.text)),
        (0, t.jsxs)("div", {
          className: `group relative flex items-start gap-2 rounded-xl border border-white/5 p-3 hover:bg-white/10 ${l(a.stage).bg}`,
          children: [
            (0, t.jsxs)("span", { className: "text-xs font-bold text-white/30 mt-2", children: ["#", e + 1] }),
            (0, t.jsx)("textarea", {
              value: c,
              onChange: (e) => d(e.target.value),
              onBlur: () => i(e, c),
              rows: 1,
              className: "flex-1 bg-transparent text-sm text-white/90 focus:outline-none resize-none min-h-[3.5em] py-1",
            }),
            (0, t.jsxs)("select", {
              value: a.stage,
              onChange: (t) => o(e, Number(t.target.value)),
              className: `rounded px-2 py-1 text-[10px] text-white border border-white/20 focus:outline-none focus:border-white/40 ${l(a.stage).bg}`,
              style: { colorScheme: "dark" },
              children: [
                (0, t.jsx)("option", { value: "1", className: "bg-black text-white", children: "S1" }),
                (0, t.jsx)("option", { value: "2", className: "bg-black text-white", children: "S2" }),
                (0, t.jsx)("option", { value: "3", className: "bg-black text-white", children: "S3" }),
                (0, t.jsx)("option", { value: "4", className: "bg-black text-white", children: "S4" }),
              ],
            }),
            (0, t.jsx)("button", {
              onClick: () => n(e),
              disabled: s <= 1,
              className: `p-1 transition-opacity ${s <= 1 ? "text-white/10 cursor-not-allowed" : "cursor-pointer text-white/20 hover:text-rose-400 opacity-0 group-hover:opacity-100"}`,
              title: s <= 1 ? "Cannot delete the last penalty" : "Delete penalty",
              children: "✕",
            }),
          ],
        })
      );
    };
    e.s(["DiceGame", () => f]);
  },
  49834,
  (e) => {
    e.n(e.i(35200));
  },
]);
