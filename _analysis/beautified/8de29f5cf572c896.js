(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  15619,
  (e) => {
    "use strict";
    var t = e.i(43476),
      s = e.i(71645),
      r = e.i(74080),
      a = e.i(48148),
      l = e.i(8387),
      n = e.i(8598);
    let i = { spades: "♠️", hearts: "♥️", clubs: "♣️", diamonds: "♦️" },
      o = { spades: "text-purple-200", hearts: "text-pink-200", clubs: "text-emerald-200", diamonds: "text-red-200" },
      d = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
      c = () => Math.random().toString(36).slice(2, 9),
      x = () => Object.keys(i)[Math.floor(4 * Math.random())],
      u = () => d[Math.floor(Math.random() * d.length)],
      m = ({ items: e, isSpinning: r, targetIndex: a, label: l, resultCard: n }) => {
        let [d, c] = (0, s.useState)(0),
          [m, b] = (0, s.useState)(() => (e.length > 0 ? [...e, ...e, ...e].map((e) => ({ ...e, suit: x(), rank: u() })) : [])),
          [h, p] = (0, s.useState)(e);
        h !== e && (p(e), e.length > 0 && b([...e, ...e, ...e].map((e) => ({ ...e, suit: x(), rank: u() }))));
        let f = m.map((t, s) => (n && null !== a && s === e.length + a ? { ...t, suit: n.suit, rank: n.rank } : t));
        return (
          (0, s.useEffect)(() => {
            if (r) {
              let t,
                s = d,
                r = () => {
                  (c((s += 40) % (112 * e.length)), (t = requestAnimationFrame(r)));
                };
              return ((t = requestAnimationFrame(r)), () => cancelAnimationFrame(t));
            }
          }, [r, e.length, 112, d]),
          (0, s.useEffect)(() => {
            if (!r && null !== a) {
              let t = 112 * e.length + 112 * a - 72;
              requestAnimationFrame(() => {
                c(t);
              });
            }
          }, [r, a, e.length, 112]),
          (0, t.jsxs)("div", {
            className: "relative flex h-52 sm:h-64 w-full flex-col items-center overflow-hidden rounded-lg sm:rounded-xl border border-white/10 sm:border-2 bg-black/40 shadow-inner select-none",
            children: [
              (0, t.jsx)("div", { className: "pointer-events-none absolute inset-0 z-20 bg-gradient-to-b from-black/90 via-transparent to-black/90" }),
              (0, t.jsx)("div", { className: "pointer-events-none absolute top-1/2 left-0 right-0 z-10 h-0.5 -translate-y-1/2 bg-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.8)]" }),
              (0, t.jsx)("div", {
                className:
                  "absolute top-0.5 sm:top-1 left-0 right-0 z-30 text-center text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/30 backdrop-blur-lg border-b border-white/30",
                children: l,
              }),
              (0, t.jsx)("div", {
                className: "absolute w-full will-change-transform",
                style: { transform: `translateY(-${d}px)`, transition: r ? "none" : "transform 2.5s cubic-bezier(0.1, 0.9, 0.2, 1)" },
                children: f.map((e, s) =>
                  (0, t.jsx)(
                    "div",
                    {
                      className: "flex h-28 w-full items-center justify-center px-1 sm:px-2 py-0.5 sm:py-1",
                      children: (0, t.jsxs)("div", {
                        className: `relative flex h-full w-full flex-col items-center justify-center rounded-md sm:rounded-lg border border-white/10 bg-white/5 p-1.5 sm:p-2 text-center backdrop-blur-sm ${r ? "blur-[2px]" : ""} overflow-hidden select-none`,
                        children: [
                          (0, t.jsxs)("div", {
                            className: `absolute top-0.5 sm:top-1 left-1 sm:left-2 flex flex-col items-center leading-none ${o[e.suit]}`,
                            children: [
                              (0, t.jsx)("span", { className: "text-xs sm:text-sm font-black", children: e.rank }),
                              (0, t.jsx)("span", { className: "text-[10px] sm:text-xs", children: i[e.suit] }),
                            ],
                          }),
                          (0, t.jsxs)("div", {
                            className: `absolute bottom-0.5 sm:bottom-1 right-1 sm:right-2 flex flex-col items-center leading-none rotate-180 ${o[e.suit]}`,
                            children: [
                              (0, t.jsx)("span", { className: "text-xs sm:text-sm font-black", children: e.rank }),
                              (0, t.jsx)("span", { className: "text-[10px] sm:text-xs", children: i[e.suit] }),
                            ],
                          }),
                          (0, t.jsx)("div", {
                            className: "flex flex-col items-center z-10 px-2 sm:px-4",
                            children: (0, t.jsx)("span", { className: "line-clamp-2 text-xs sm:text-sm font-bold text-white drop-shadow-md leading-tight", children: e.text }),
                          }),
                          (0, t.jsx)("div", {
                            className: `absolute inset-0 opacity-10 flex items-center justify-center text-4xl sm:text-6xl select-none pointer-events-none ${o[e.suit]}`,
                            children: i[e.suit],
                          }),
                        ],
                      }),
                    },
                    `${e.id}-${s}`,
                  ),
                ),
              }),
            ],
          })
        );
      };
    function b({ locale: e, initialReels: i, defaults: o, onOpenLibrary: d }) {
      let b = (0, a.useTranslations)("games.slots"),
        { play: h } = (0, l.useGameSound)(),
        p = () => [
          [
            { id: "l1", text: b("defaults.locations.balcony") },
            { id: "l2", text: b("defaults.locations.sofa") },
            { id: "l3", text: b("defaults.locations.kitchen") },
            { id: "l4", text: b("defaults.locations.bed") },
            { id: "l5", text: b("defaults.locations.bathroom") },
          ],
          [
            { id: "a1", text: b("defaults.actions.kiss") },
            { id: "a2", text: b("defaults.actions.massage") },
            { id: "a3", text: b("defaults.actions.lick") },
            { id: "a4", text: b("defaults.actions.bite") },
            { id: "a5", text: b("defaults.actions.touch") },
            { id: "a6", text: b("defaults.actions.tickle") },
            { id: "a7", text: b("defaults.actions.hug") },
            { id: "a8", text: b("defaults.actions.blow") },
            { id: "a9", text: b("defaults.actions.pinch") },
            { id: "a10", text: b("defaults.actions.slap") },
            { id: "a11", text: b("defaults.actions.rub") },
            { id: "a12", text: b("defaults.actions.stare") },
            { id: "a13", text: b("defaults.actions.smell") },
            { id: "a14", text: b("defaults.actions.scratch") },
            { id: "a15", text: b("defaults.actions.hold") },
            { id: "a16", text: b("defaults.actions.squeeze") },
          ],
          [
            { id: "b1", text: b("defaults.bodyParts.neck") },
            { id: "b2", text: b("defaults.bodyParts.ear") },
            { id: "b3", text: b("defaults.bodyParts.thigh") },
            { id: "b4", text: b("defaults.bodyParts.lips") },
            { id: "b5", text: b("defaults.bodyParts.chest") },
            { id: "b6", text: b("defaults.bodyParts.hand") },
            { id: "b7", text: b("defaults.bodyParts.foot") },
            { id: "b8", text: b("defaults.bodyParts.back") },
            { id: "b9", text: b("defaults.bodyParts.waist") },
            { id: "b10", text: b("defaults.bodyParts.shoulder") },
            { id: "b11", text: b("defaults.bodyParts.hair") },
            { id: "b12", text: b("defaults.bodyParts.chin") },
            { id: "b13", text: b("defaults.bodyParts.cheek") },
            { id: "b14", text: b("defaults.bodyParts.collarbone") },
            { id: "b15", text: b("defaults.bodyParts.navel") },
            { id: "b16", text: b("defaults.bodyParts.wrist") },
            { id: "b17", text: b("defaults.bodyParts.ankle") },
          ],
        ],
        f = () => [
          [
            { id: "fl1", text: b("funny.locations.fridge") },
            { id: "fl2", text: b("funny.locations.sofa") },
            { id: "fl3", text: b("funny.locations.bed") },
            { id: "fl4", text: b("funny.locations.toilet") },
            { id: "fl5", text: b("funny.locations.balcony") },
            { id: "fl6", text: b("funny.locations.corner") },
            { id: "fl7", text: b("funny.locations.kitchen") },
            { id: "fl8", text: b("funny.locations.doorway") },
          ],
          [
            { id: "fa1", text: b("funny.actions.propose") },
            { id: "fa2", text: b("funny.actions.interview") },
            { id: "fa3", text: b("funny.actions.lecture") },
            { id: "fa4", text: b("funny.actions.dance") },
            { id: "fa5", text: b("funny.actions.praise") },
            { id: "fa6", text: b("funny.actions.stare") },
            { id: "fa7", text: b("funny.actions.confess") },
            { id: "fa8", text: b("funny.actions.argue") },
            { id: "fa9", text: b("funny.actions.breakup") },
            { id: "fa10", text: b("funny.actions.worship") },
            { id: "fa11", text: b("funny.actions.seduce") },
            { id: "fa12", text: b("funny.actions.rap") },
            { id: "fa13", text: b("funny.actions.apologize") },
            { id: "fa14", text: b("funny.actions.negotiate") },
            { id: "fa15", text: b("funny.actions.threaten") },
            { id: "fa16", text: b("funny.actions.kowtow") },
          ],
          [
            { id: "fb1", text: b("funny.bodyParts.soySauce") },
            { id: "fb2", text: b("funny.bodyParts.pillow") },
            { id: "fb3", text: b("funny.bodyParts.slipper") },
            { id: "fb4", text: b("funny.bodyParts.remote") },
            { id: "fb5", text: b("funny.bodyParts.air") },
            { id: "fb6", text: b("funny.bodyParts.tissue") },
            { id: "fb7", text: b("funny.bodyParts.cup") },
            { id: "fb8", text: b("funny.bodyParts.plant") },
            { id: "fb9", text: b("funny.bodyParts.trash") },
            { id: "fb10", text: b("funny.bodyParts.robot") },
            { id: "fb11", text: b("funny.bodyParts.toiletRoll") },
            { id: "fb12", text: b("funny.bodyParts.toothbrush") },
            { id: "fb13", text: b("funny.bodyParts.spoon") },
            { id: "fb14", text: b("funny.bodyParts.banana") },
            { id: "fb15", text: b("funny.bodyParts.phone") },
            { id: "fb16", text: b("funny.bodyParts.sock") },
          ],
        ],
        [g, w] = (0, s.useState)(() => {
          {
            let e = localStorage.getItem("slots.reels_v2");
            if (e)
              try {
                return JSON.parse(e);
              } catch (e) {
                console.error("Failed to parse saved reels", e);
              }
          }
          return p();
        }),
        [v, y] = (0, s.useState)(() => {
          {
            let e = localStorage.getItem("slots.players");
            if (e) return JSON.parse(e);
          }
          return [
            { id: "p1", name: b("defaults.player1"), score: 0, color: "#ec4899" },
            { id: "p2", name: b("defaults.player2"), score: 0, color: "#3b82f6" },
          ];
        }),
        [j, k] = (0, s.useState)(0),
        [N, S] = (0, s.useState)("idle"),
        [C, z] = (0, s.useState)(() => {
          {
            let e = localStorage.getItem("slots.winningScore");
            if (e) return Number(e);
          }
          return 500;
        }),
        [P, _] = (0, s.useState)(""),
        [$, A] = (0, s.useState)(0),
        [D, M] = (0, s.useState)(0),
        [L, I] = (0, s.useState)(!1),
        [O, E] = (0, s.useState)(null),
        [T, F] = (0, s.useState)(null),
        [B, R] = (0, s.useState)(!1),
        [K, J] = (0, s.useState)(!1),
        [V, W] = (0, s.useState)(0),
        [q, H] = (0, s.useState)(""),
        G = () => [b("reels.location"), b("reels.action"), b("reels.bodyPart")],
        [U, Z] = (0, s.useState)(() => {
          {
            let e = localStorage.getItem("slots.reelLabels");
            if (e)
              try {
                return JSON.parse(e);
              } catch (e) {
                console.error("Failed to parse saved reel labels", e);
              }
          }
          return G();
        }),
        [Q, Y] = (0, s.useState)({}),
        [X, ee] = (0, s.useState)(null),
        [et, es] = (0, s.useState)(!1),
        [er, ea] = (0, s.useState)(""),
        [el, en] = (0, s.useState)(null),
        [ei, eo] = (0, s.useState)(null),
        [ed, ec] = (0, s.useState)(""),
        ex = (0, s.useRef)(!1),
        eu = (0, s.useRef)(null),
        em = (0, s.useRef)(null);
      ((0, s.useEffect)(() => {
        ((eu.current = new Audio("/bomb.mp3")), (em.current = new Audio("/bonus.mp3")));
      }, []),
        (0, s.useEffect)(() => {
          if ("spinning" === N) {
            let e = setInterval(() => {
              h("spin");
            }, 800);
            return (h("spin"), () => clearInterval(e));
          }
        }, [N, h]),
        (0, s.useEffect)(() => {
          {
            let e = localStorage.getItem("slots.contentLibraries"),
              t = {},
              s = null;
            if (e)
              try {
                let r = JSON.parse(e);
                r.libraries && "object" == typeof r.libraries && ((t = r.libraries), (s = r.activeId || null));
              } catch (e) {
                console.error("Failed to parse content libraries", e);
              }
            let r = [
                { id: "default-content-library", nameKey: "library.defaultName", createReels: p },
                { id: "funny-content-library", nameKey: "library.funnyName", createReels: f },
              ],
              a = { ...t };
            (r.forEach((e) => {
              let t = b(e.nameKey),
                s = a[e.id];
              (s && s.name === t) || (a[e.id] = { id: e.id, name: t, reels: e.createReels(), createdAt: s?.createdAt || Date.now(), isDefault: !0 });
            }),
              (s && a[s]) || (s = r[0].id),
              Y(a),
              ee(s));
          }
        }, [b]),
        (0, s.useEffect)(() => {
          Object.keys(Q).length > 0 && localStorage.setItem("slots.contentLibraries", JSON.stringify({ libraries: Q, activeId: X }));
        }, [Q, X]),
        (0, s.useEffect)(() => {
          localStorage.setItem("slots.winningScore", C.toString());
        }, [C]),
        (0, s.useEffect)(() => {
          localStorage.setItem("slots.reels_v2", JSON.stringify(g));
        }, [g]),
        (0, s.useEffect)(() => {
          localStorage.setItem("slots.players", JSON.stringify(v));
        }, [v]),
        (0, s.useEffect)(() => {
          {
            let e = G();
            U.some((t, s) => t !== e[s]) ? localStorage.setItem("slots.reelLabels", JSON.stringify(U)) : localStorage.removeItem("slots.reelLabels");
          }
        }, [U]));
      let eb = v[j],
        eh = () => {
          if ("idle" !== N) return;
          (S("spinning"), E(null), F(null), _(""), A(0), (ex.current = !1));
          let e = Math.floor(Math.random() * g[0].length),
            t = Math.floor(Math.random() * g[1].length),
            s = Math.floor(Math.random() * g[2].length),
            r = { suit: x(), rank: u() },
            a = { suit: x(), rank: u() },
            l = { suit: x(), rank: u() };
          (setTimeout(() => {
            (E([e, t, s]), F([r, a, l]), S("settling"), (0, n.recordDetailStat)("slotsSpins"));
          }, 2e3),
            setTimeout(() => {
              let e = ((e) => {
                let t = e[0].rank,
                  s = e[1].rank,
                  r = e[2].rank;
                if ("A" === t && "A" === s && "4" === r) return { score: 150, name: b("hand.inm114") };
                if ("5" === t && "A" === s && "4" === r) return { score: 150, name: b("hand.inm514") };
                let a = e.map((e) => ({ 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, J: 11, Q: 12, K: 13, A: 14 })[e.rank]).sort((e, t) => e - t),
                  l = e.map((e) => e.suit),
                  n = l[0] === l[1] && l[1] === l[2],
                  i = !1;
                (a[1] === a[0] + 1 && a[2] === a[1] + 1 && (i = !0), 2 === a[0] && 3 === a[1] && 14 === a[2] && (i = !0));
                let o = a[0] === a[1] && a[1] === a[2],
                  d = a[0] === a[1] || a[1] === a[2] || a[0] === a[2],
                  c = o && 7 === a[0];
                return c && n
                  ? { score: 777, name: b("hand.luxury777") }
                  : n && i
                    ? { score: 500, name: b("hand.straightFlush") }
                    : c
                      ? { score: 300, name: b("hand.777") }
                      : o && n
                        ? { score: 200, name: b("hand.luxuryThreeOfAKind") }
                        : o
                          ? { score: 100, name: b("hand.threeOfAKind") }
                          : i
                            ? { score: 50, name: b("hand.straight") }
                            : n
                              ? { score: 30, name: b("hand.flush") }
                              : d
                                ? { score: 10, name: b("hand.pair") }
                                : { score: -5, name: b("hand.noCombo") };
              })([r, a, l]);
              (S("result"),
                h("stop"),
                _(e.name),
                A(e.score),
                y((t) => {
                  let s = [...t];
                  if (!ex.current) {
                    let r = e.score,
                      a = !1,
                      l = D;
                    (e.score <= 0 ? (l = D + 1) >= 5 && ((a = !0), (r -= 50), (l = 0)) : (l = 0),
                      M(l),
                      a && (I(!0), eu.current && ((eu.current.currentTime = 0), eu.current.play().catch((e) => console.error("Failed to play bomb sound:", e))), setTimeout(() => I(!1), 2e3)),
                      e.score > 10 && em.current && ((em.current.currentTime = 0), em.current.play().catch((e) => console.error("Failed to play bonus sound:", e))));
                    let i = Math.max(0, t[j].score + r);
                    ((s[j].score = i),
                      (ex.current = !0),
                      i >= C &&
                        ((s[j].score = C),
                        (0, n.recordDetailStat)("slotsWins"),
                        (0, n.incrementGameSession)("slots", 5),
                        setTimeout(() => {
                          (S("celebrating"),
                            h("jackpot"),
                            setTimeout(() => {
                              S("win");
                            }, 2e3));
                        }, 500)));
                  }
                  return (
                    150 === e.score && (0, n.recordDetailStat)("slotsInm"),
                    500 === e.score && (0, n.recordDetailStat)("slotsStraightFlush"),
                    30 === e.score && (0, n.recordDetailStat)("slotsFlush"),
                    s
                  );
                }));
            }, 4600));
        },
        ep = () => {
          if ((h("select"), "win" === N)) return;
          (S("idle"), E(null), F(null), _(""), A(0));
          let e = (j + 1) % v.length;
          (k(e),
            setTimeout(() => {
              let t = document.getElementById(`player-card-${e}`);
              t && t.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }, 100));
        },
        ef = () => {
          (h("start"), y(v.map((e) => ({ ...e, score: 0 }))), S("idle"), E(null), F(null), _(""), A(0), k(0), M(0), I(!1));
        },
        eg = () => {
          let e = er.trim();
          if (!e) return void en(b("library.nameRequired") || "Please enter a library name");
          if (Object.values(Q).some((t) => t.name.toLowerCase() === e.toLowerCase())) return void en(b("library.nameExists") || "A library with this name already exists");
          let t = { id: c(), name: e, reels: [[...g[0]], [...g[1]], [...g[2]]], createdAt: Date.now() };
          (Y((e) => ({ ...e, [t.id]: t })), ee(t.id), ea(""), en(null));
        },
        ew = () => {
          if (!ei) return;
          let e = ed.trim();
          e ? (Y((t) => ({ ...t, [ei]: { ...t[ei], name: e } })), eo(null), ec("")) : eo(null);
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
                style: { animationDelay: "4s" },
              }),
              ("celebrating" === N || "win" === N) &&
                "undefined" != typeof document &&
                (0, r.createPortal)(
                  (0, t.jsx)("div", {
                    className: "pointer-events-none fixed inset-0 z-[100] overflow-hidden",
                    children: Array.from({ length: 50 }).map((e, s) =>
                      (0, t.jsx)(
                        "div",
                        {
                          className: "absolute h-2 w-2 animate-fall",
                          style: {
                            left: `${100 * Math.random()}%`,
                            top: "-10%",
                            backgroundColor: ["#ec4899", "#a855f7", "#fbbf24", "#34d399"][Math.floor(4 * Math.random())],
                            animationDelay: `${2 * Math.random()}s`,
                            animationDuration: `${2 + 3 * Math.random()}s`,
                          },
                        },
                        s,
                      ),
                    ),
                  }),
                  document.body,
                ),
              (0, t.jsxs)("header", {
                className: "relative z-10 flex flex-col items-center text-center",
                children: [
                  (0, t.jsx)("h1", {
                    className:
                      "bg-gradient-to-b from-white via-purple-100 to-white/60 bg-clip-text text-4xl font-black uppercase tracking-tighter text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] sm:text-5xl",
                    children: b("title"),
                  }),
                  (0, t.jsx)("div", { className: "mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-80" }),
                  (0, t.jsx)("p", { className: "mt-4 text-sm font-medium tracking-[0.2em] text-white/40", children: b("tagline") }),
                ],
              }),
              (0, t.jsxs)("div", {
                className: "mt-4 relative z-10 grid gap-8 lg:grid-cols-[1fr_320px]",
                children: [
                  (0, t.jsxs)("div", {
                    className: "relative flex flex-col items-center rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/5 to-white/10 p-4 sm:p-8 shadow-inner overflow-hidden",
                    children: [
                      (0, t.jsx)("div", { className: "absolute inset-0 opacity-10", style: { backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" } }),
                      (0, t.jsxs)("div", {
                        className: "relative z-10 mb-3 sm:mb-6 flex flex-col items-center justify-start gap-1.5 sm:gap-2 w-full min-h-[60px] sm:min-h-[80px]",
                        children: [
                          (0, t.jsxs)("div", {
                            className: "flex items-center justify-center gap-2 sm:gap-3 rounded-full border border-white/10 bg-black/40 px-3 sm:px-5 py-1.5 sm:py-2 shadow-lg backdrop-blur-md",
                            children: [
                              (0, t.jsx)("div", { className: "size-2 sm:size-2.5 rounded-full animate-pulse shadow-[0_0_8px_currentColor] shrink-0", style: { backgroundColor: eb?.color } }),
                              (0, t.jsxs)("div", {
                                className: "flex flex-col leading-none text-center",
                                children: [
                                  (0, t.jsx)("span", { className: "text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/40", children: b("resultPrefix") }),
                                  (0, t.jsx)("span", {
                                    className: "text-xl sm:text-2xl font-bold text-white drop-shadow-md truncate max-w-[100px] sm:max-w-[120px]",
                                    style: { color: eb?.color || "white" },
                                    children: eb?.name,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          D > 0 &&
                            (0, t.jsxs)("div", {
                              className: "w-full max-w-md flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-orange-500/20 bg-black/30 backdrop-blur-sm",
                              children: [
                                (0, t.jsx)("span", { className: `text-base sm:text-lg shrink-0 ${D >= 4 ? "animate-bounce" : ""} ${L ? "animate-ping" : ""}`, children: "💣" }),
                                (0, t.jsx)("div", {
                                  className: "flex-1 h-1 sm:h-1.5 rounded-full bg-black/60 overflow-hidden shadow-inner",
                                  children: (0, t.jsx)("div", {
                                    className: `h-full transition-all duration-300 ease-out ${D >= 4 ? "animate-pulse" : ""}`,
                                    style: {
                                      width: `${(D / 5) * 100}%`,
                                      backgroundColor: D >= 4 ? "#ef4444" : D >= 3 ? "#f97316" : "#fbbf24",
                                      boxShadow: D >= 4 ? "0 0 6px rgba(239, 68, 68, 0.5)" : "0 0 4px rgba(249, 115, 22, 0.4)",
                                    },
                                  }),
                                }),
                                (0, t.jsxs)("span", { className: "text-[9px] sm:text-[10px] font-bold text-orange-400/80 shrink-0 min-w-[18px] sm:min-w-[20px] text-right", children: [D, "/5"] }),
                              ],
                            }),
                        ],
                      }),
                      (0, t.jsxs)("div", {
                        className: `relative z-10 w-full grid grid-cols-3 gap-2 sm:gap-4 ${"idle" === N || "result" === N ? "cursor-pointer" : ""}`,
                        onClick: () => {
                          "idle" === N ? eh() : "result" === N && ep();
                        },
                        children: [
                          ("result" === N || "celebrating" === N || "win" === N) &&
                            $ > 10 &&
                            (0, t.jsxs)("div", {
                              className: "absolute -inset-2 pointer-events-none z-20",
                              children: [
                                (0, t.jsx)("div", {
                                  className: "absolute -top-2 -left-2 size-2.5 rounded-full",
                                  style: { backgroundColor: "#ec4899", boxShadow: "0 0 15px 3px #ec4899", animation: "pulse 0.4s ease-in-out infinite", animationDelay: "0s" },
                                }),
                                (0, t.jsx)("div", {
                                  className: "absolute -top-2 -right-2 size-2.5 rounded-full",
                                  style: { backgroundColor: "#a855f7", boxShadow: "0 0 15px 3px #a855f7", animation: "pulse 0.4s ease-in-out infinite", animationDelay: "0.45s" },
                                }),
                                (0, t.jsx)("div", {
                                  className: "absolute -bottom-2 -left-2 size-2.5 rounded-full",
                                  style: { backgroundColor: "#fbbf24", boxShadow: "0 0 15px 3px #fbbf24", animation: "pulse 0.4s ease-in-out infinite", animationDelay: "0.9s" },
                                }),
                                (0, t.jsx)("div", {
                                  className: "absolute -bottom-2 -right-2 size-2.5 rounded-full",
                                  style: { backgroundColor: "#34d399", boxShadow: "0 0 15px 3px #34d399", animation: "pulse 0.4s ease-in-out infinite", animationDelay: "0.65s" },
                                }),
                                Array.from({ length: 16 }).map((e, s) =>
                                  (0, t.jsx)(
                                    "div",
                                    {
                                      className: "absolute -top-2 size-2.5 rounded-full",
                                      style: {
                                        left: `${((s + 1) / 17) * 100}%`,
                                        backgroundColor: ["#ec4899", "#a855f7", "#fbbf24", "#34d399", "#f97316"][s % 5],
                                        boxShadow: `0 0 15px 3px ${["#ec4899", "#a855f7", "#fbbf24", "#34d399", "#f97316"][s % 5]}`,
                                        animation: "pulse 0.4s ease-in-out infinite",
                                        animationDelay: `${(s + 1) * 0.05}s`,
                                      },
                                    },
                                    `top-${s}`,
                                  ),
                                ),
                                Array.from({ length: 6 }).map((e, s) =>
                                  (0, t.jsx)(
                                    "div",
                                    {
                                      className: "absolute -right-2 size-2.5 rounded-full",
                                      style: {
                                        top: `${((s + 1) / 7) * 100}%`,
                                        backgroundColor: ["#fbbf24", "#34d399", "#ec4899", "#a855f7", "#f97316"][s % 5],
                                        boxShadow: `0 0 15px 3px ${["#fbbf24", "#34d399", "#ec4899", "#a855f7", "#f97316"][s % 5]}`,
                                        animation: "pulse 0.4s ease-in-out infinite",
                                        animationDelay: `${(s + 1) * 0.05 + 0.2}s`,
                                      },
                                    },
                                    `right-${s}`,
                                  ),
                                ),
                                Array.from({ length: 16 }).map((e, s) =>
                                  (0, t.jsx)(
                                    "div",
                                    {
                                      className: "absolute -bottom-2 size-2.5 rounded-full",
                                      style: {
                                        left: `${((s + 1) / 17) * 100}%`,
                                        backgroundColor: ["#34d399", "#ec4899", "#a855f7", "#fbbf24", "#f97316"][s % 5],
                                        boxShadow: `0 0 15px 3px ${["#34d399", "#ec4899", "#a855f7", "#fbbf24", "#f97316"][s % 5]}`,
                                        animation: "pulse 0.4s ease-in-out infinite",
                                        animationDelay: `${(s + 1) * 0.05 + 0.4}s`,
                                      },
                                    },
                                    `bottom-${s}`,
                                  ),
                                ),
                                Array.from({ length: 6 }).map((e, s) =>
                                  (0, t.jsx)(
                                    "div",
                                    {
                                      className: "absolute -left-2 size-2.5 rounded-full",
                                      style: {
                                        top: `${((s + 1) / 7) * 100}%`,
                                        backgroundColor: ["#a855f7", "#fbbf24", "#34d399", "#ec4899", "#f97316"][s % 5],
                                        boxShadow: `0 0 15px 3px ${["#a855f7", "#fbbf24", "#34d399", "#ec4899", "#f97316"][s % 5]}`,
                                        animation: "pulse 0.4s ease-in-out infinite",
                                        animationDelay: `${(s + 1) * 0.05 + 0.6}s`,
                                      },
                                    },
                                    `left-${s}`,
                                  ),
                                ),
                              ],
                            }),
                          (0, t.jsx)(m, { label: U[0], items: g[0], isSpinning: "spinning" === N, targetIndex: O ? O[0] : null, resultCard: T ? T[0] : null }, `reel-0-${X}`),
                          (0, t.jsx)(m, { label: U[1], items: g[1], isSpinning: "spinning" === N, targetIndex: O ? O[1] : null, resultCard: T ? T[1] : null }, `reel-1-${X}`),
                          (0, t.jsx)(m, { label: U[2], items: g[2], isSpinning: "spinning" === N, targetIndex: O ? O[2] : null, resultCard: T ? T[2] : null }, `reel-2-${X}`),
                        ],
                      }),
                      (0, t.jsx)("div", {
                        className: "relative z-10 h-[140px] sm:h-[200px] flex flex-col items-center justify-center w-full gap-1 sm:gap-2 mt-3 sm:mt-6",
                        children:
                          ("result" === N || "celebrating" === N || "win" === N) &&
                          (0, t.jsxs)("div", {
                            className: "relative animate-pop-in flex flex-col items-center w-full",
                            children: [
                              L &&
                                (0, t.jsxs)("div", {
                                  className: "absolute inset-x-0 -top-18 sm:-top-22 flex flex-col items-center justify-start z-30 animate-bounce",
                                  children: [
                                    (0, t.jsx)("span", { className: "text-3xl sm:text-5xl animate-ping-once", children: "💥" }),
                                    (0, t.jsx)("span", {
                                      className: "text-base sm:text-xl font-black text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] mt-0.5 sm:mt-1",
                                      children: b("bomb.exploded"),
                                    }),
                                    (0, t.jsxs)("span", { className: "text-[10px] sm:text-xs font-bold text-red-400", children: ["-50 ", b("bomb.penalty")] }),
                                  ],
                                }),
                              P &&
                                (0, t.jsxs)("div", {
                                  className: "mb-1.5 sm:mb-2 flex flex-col items-center",
                                  children: [
                                    (0, t.jsx)("span", { className: "text-xl sm:text-3xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] animate-bounce", children: P }),
                                    (0, t.jsxs)("span", {
                                      className: `text-[10px] sm:text-xs font-bold uppercase tracking-widest ${$ > 0 ? "text-green-400" : "text-red-400"}`,
                                      children: [$ > 0 ? "+" : "", $, " pts"],
                                    }),
                                  ],
                                }),
                              (0, t.jsx)("div", {
                                className: "rounded-lg sm:rounded-xl border border-pink-500/30 bg-pink-500/10 px-3 sm:px-6 py-2 sm:py-3 backdrop-blur-md",
                                children: (0, t.jsx)("p", {
                                  className:
                                    "flex flex-wrap justify-center items-center gap-x-1.5 sm:gap-x-2 text-sm sm:text-lg lg:text-xl font-bold text-white leading-relaxed drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]",
                                  children:
                                    O &&
                                    [
                                      {
                                        text: g[0][O[0]].text,
                                        icon: (0, t.jsxs)("svg", {
                                          xmlns: "http://www.w3.org/2000/svg",
                                          fill: "none",
                                          viewBox: "0 0 24 24",
                                          strokeWidth: 1.5,
                                          stroke: "currentColor",
                                          className: "size-4 sm:size-5 text-pink-300 shrink-0",
                                          children: [
                                            (0, t.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" }),
                                            (0, t.jsx)("path", {
                                              strokeLinecap: "round",
                                              strokeLinejoin: "round",
                                              d: "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z",
                                            }),
                                          ],
                                        }),
                                      },
                                      {
                                        text: g[1][O[1]].text,
                                        icon: (0, t.jsx)("svg", {
                                          xmlns: "http://www.w3.org/2000/svg",
                                          fill: "currentColor",
                                          viewBox: "0 0 1024 1024",
                                          strokeWidth: 1.5,
                                          stroke: "currentColor",
                                          className: "size-4 sm:size-5 text-pink-300 shrink-0",
                                          children: (0, t.jsx)("path", {
                                            d: "M809.472 406.016h-2.56c-16.896 0-31.232 5.12-44.544 13.312-11.776-34.304-41.984-59.392-80.896-59.392-16.896 0-33.28 5.12-47.104 13.312-11.776-34.304-41.984-59.392-80.896-59.392-15.36 0-29.184 3.584-41.472 10.24V235.52c0-48.128-36.352-87.552-85.504-87.552-48.64 0-88.064 39.424-88.064 87.552v339.968l-53.76-53.248c-34.304-34.304-95.232-29.184-124.928 0-29.184 29.184-48.64 88.576-6.656 130.56l246.272 244.736c5.12 5.12 10.752 9.216 16.384 12.8 45.056 36.864 96.256 58.368 205.312 58.368 248.832 0 271.872-134.144 271.872-299.52V494.08c1.024-48.64-34.304-88.064-83.456-88.064z m38.4 262.656c0 139.776-0.512 253.44-225.28 253.44-95.232 0-152.064-20.992-195.584-64L193.536 626.176c-20.48-20.48-15.36-47.104 1.536-64s48.128-17.408 64-1.024c0 0 40.96 40.448 76.288 75.776 26.624 26.624 50.176 49.664 50.176 49.664V244.736c0-23.04 18.944-41.472 41.984-41.472 23.04 0 38.912 18.432 38.912 41.472v281.088h0.512c-0.512 1.536-0.512 3.072-0.512 4.608 0 12.8 10.24 23.04 23.04 23.04 12.8 0 23.04-10.24 23.04-23.04 0-1.536 0-3.072-0.512-4.608h0.512v-115.2c0-23.04 16.896-41.472 39.936-41.472 0 0 40.96-0.512 40.96 41.472v152.064h0.512c-0.512 1.536-0.512 3.072-0.512 4.608 0 12.8 10.24 23.04 23.04 23.04 12.8 0 23.04-10.24 23.04-23.04 0-1.536 0-3.072-0.512-4.608h0.512V456.704c0-23.04 16.384-41.472 39.424-41.472 0 0 41.984 2.56 41.984 41.472v133.632h0.512c-0.512 1.536-0.512 3.072-0.512 4.608 0 12.8 10.24 23.04 23.04 23.04 12.8 0 22.528-10.24 22.528-23.04 0-1.536 0-3.072-0.512-4.608h0.512V499.2c0-23.04 17.408-41.472 40.448-41.472 0 0 40.448-1.536 40.448 41.472 0.512 0 0.512 132.608 0.512 169.472zM304.64 366.08V288.768a135.68 135.68 0 0 1-11.776-54.272 133.184 133.184 0 1 1 263.168 29.184c16.896 0.512 31.744 7.68 43.008 18.944a184.32 184.32 0 0 0 6.656-47.616c0-98.816-80.384-179.2-179.2-179.2a179.392 179.392 0 0 0-179.2 179.2A176.32 176.32 0 0 0 304.64 366.08z",
                                          }),
                                        }),
                                      },
                                      {
                                        text: g[2][O[2]].text,
                                        icon: (0, t.jsx)("svg", {
                                          xmlns: "http://www.w3.org/2000/svg",
                                          fill: "none",
                                          viewBox: "0 0 24 24",
                                          strokeWidth: 1.5,
                                          stroke: "currentColor",
                                          className: "size-4 sm:size-5 text-pink-300 shrink-0",
                                          children: (0, t.jsx)("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            d: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z",
                                          }),
                                        }),
                                      },
                                    ].map((e, s) =>
                                      (0, t.jsxs)(
                                        "span",
                                        {
                                          className: "flex items-center gap-0.5 sm:gap-1",
                                          children: [e.icon, (0, t.jsx)("span", { className: "truncate max-w-[80px] sm:max-w-none", children: e.text })],
                                        },
                                        s,
                                      ),
                                    ),
                                }),
                              }),
                            ],
                          }),
                      }),
                      (0, t.jsxs)("div", {
                        className: "relative z-10 w-full max-w-xs h-[52px] sm:h-[60px] flex items-center justify-center mt-2 sm:mt-0",
                        children: [
                          "idle" === N &&
                            (0, t.jsxs)("button", {
                              onClick: (e) => {
                                (e.stopPropagation(), eh());
                              },
                              className:
                                "cursor-pointer group relative w-full overflow-hidden rounded-xl sm:rounded-2xl bg-white py-3 sm:py-4 text-xs sm:text-sm font-black uppercase tracking-widest text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] active:scale-95",
                              children: [
                                (0, t.jsx)("span", { className: "relative z-10", children: b("spin") }),
                                (0, t.jsx)("div", {
                                  className:
                                    "absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gray-200 to-transparent transition-transform duration-700 group-hover:animate-shimmer",
                                }),
                              ],
                            }),
                          "result" === N &&
                            (0, t.jsx)("button", {
                              onClick: (e) => {
                                (e.stopPropagation(), ep());
                              },
                              className:
                                "cursor-pointer group w-full rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-400 to-green-600 py-3 sm:py-4 text-xs sm:text-sm font-black uppercase tracking-widest text-white shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] active:scale-95",
                              children: b("nextPlayer"),
                            }),
                          "win" === N &&
                            (0, t.jsx)("button", {
                              onClick: ef,
                              className:
                                "cursor-pointer group w-full rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 py-3 sm:py-4 text-xs sm:text-sm font-black uppercase tracking-widest text-white shadow-[0_0_30px_rgba(192,38,211,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(192,38,211,0.7)] active:scale-95",
                              children: b("playAgain"),
                            }),
                        ],
                      }),
                    ],
                  }),
                  (0, t.jsxs)("div", {
                    className: "flex flex-col gap-5",
                    children: [
                      (0, t.jsxs)("div", {
                        className: "group rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/5 to-black/40 p-6 transition-colors hover:border-white/20 hover:bg-white/10 flex-1",
                        children: [
                          (0, t.jsxs)("div", {
                            className: "flex items-center justify-between mb-5",
                            children: [
                              (0, t.jsx)("h3", { className: "text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white/70 transition-colors", children: b("editor.players") }),
                              (0, t.jsx)("button", {
                                onClick: () => J(!0),
                                className: "cursor-pointer rounded-full bg-white/5 p-1.5 transition-colors hover:bg-white/10 text-white/40 hover:text-white",
                                title: b("editor.players"),
                                children: (0, t.jsxs)("svg", {
                                  xmlns: "http://www.w3.org/2000/svg",
                                  viewBox: "0 0 20 20",
                                  fill: "currentColor",
                                  className: "size-4",
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
                            className: "space-y-4 overflow-y-auto max-h-[130px] sm:max-h-[400px] custom-scrollbar pr-1",
                            children: v.map((e, s) =>
                              (0, t.jsxs)(
                                "div",
                                {
                                  id: `player-card-${s}`,
                                  className: `relative overflow-hidden rounded-xl border p-3 transition-all duration-300 ${j === s ? "border-white/20 bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "border-white/5 bg-black/20 opacity-60 grayscale-[0.3]"}`,
                                  children: [
                                    (0, t.jsxs)("div", {
                                      className: "flex items-center justify-between mb-2",
                                      children: [
                                        (0, t.jsxs)("div", {
                                          className: "flex items-center gap-2",
                                          children: [
                                            (0, t.jsx)("div", {
                                              className: "size-6 rounded-full border border-white/20 shadow-lg text-white flex items-center justify-center font-bold text-[10px]",
                                              style: { backgroundColor: e.color },
                                              children: e.name.charAt(0),
                                            }),
                                            (0, t.jsx)("span", { className: "font-bold text-white text-sm", children: e.name }),
                                          ],
                                        }),
                                        (0, t.jsx)("span", { className: "text-sm font-black text-white/80", children: e.score }),
                                      ],
                                    }),
                                    (0, t.jsx)("div", {
                                      className: "h-1.5 w-full rounded-full bg-black/40 overflow-hidden",
                                      children: (0, t.jsx)("div", {
                                        className: "h-full transition-all duration-1000 ease-out relative",
                                        style: { width: `${Math.min((e.score / C) * 100, 100)}%`, backgroundColor: e.color },
                                      }),
                                    }),
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
                          "group relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/5 to-black/40 p-6 cursor-pointer transition-all hover:border-pink-500/30 hover:bg-pink-900/10",
                        onClick: () => R(!0),
                        children: [
                          (0, t.jsx)("div", { className: "absolute inset-0 opacity-[0.03] bg-[url('/noise.png')]" }),
                          (0, t.jsx)("div", {
                            className: "absolute top-3 right-3 z-20",
                            children: (0, t.jsx)("button", {
                              onClick: (e) => {
                                (e.stopPropagation(), es(!0));
                              },
                              title: b("library.title") || "Content Libraries",
                              className: "cursor-pointer rounded-full bg-purple-500/20 p-2 text-purple-300 transition hover:bg-purple-500/30 border border-purple-500/30 hover:scale-105",
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
                          }),
                          (0, t.jsxs)("div", {
                            className: "relative z-10 flex flex-col h-full min-h-[100px] justify-center items-center text-center gap-3",
                            children: [
                              (0, t.jsx)("div", {
                                className: "rounded-full bg-white/5 p-3 transition-colors group-hover:bg-white/10",
                                children: (0, t.jsx)("svg", {
                                  xmlns: "http://www.w3.org/2000/svg",
                                  fill: "none",
                                  viewBox: "0 0 24 24",
                                  strokeWidth: 1.5,
                                  stroke: "currentColor",
                                  className: "size-6 text-white/40 group-hover:text-pink-300",
                                  children: (0, t.jsx)("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    d: "M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75",
                                  }),
                                }),
                              }),
                              (0, t.jsxs)("div", {
                                children: [
                                  (0, t.jsx)("h3", { className: "text-sm font-bold text-white/60 group-hover:text-pink-200 transition-colors", children: b("editor.title") }),
                                  (0, t.jsx)("p", { className: "text-[10px] text-white/30 mt-1", children: b("editor.reels") }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, t.jsx)("button", {
                        onClick: ef,
                        className:
                          "cursor-pointer group flex w-full items-center justify-center gap-2 rounded-[2rem] border border-white/10 bg-white/5 p-4 transition-all hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-200 text-white/40",
                        children: (0, t.jsx)("span", { className: "text-xs font-bold uppercase tracking-widest", children: b("playAgain") }),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          "win" === N &&
            (0, r.createPortal)(
              (0, t.jsx)("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl animate-in fade-in duration-300",
                children: (0, t.jsx)("div", {
                  className:
                    "relative w-full max-w-md overflow-hidden rounded-[2rem] border border-yellow-500/30 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-8 text-center shadow-[0_0_60px_rgba(234,179,8,0.3)]",
                  children: (0, t.jsxs)("div", {
                    className: "relative z-10",
                    children: [
                      (0, t.jsx)("div", { className: "mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-yellow-500/20 text-4xl animate-bounce", children: "🏆" }),
                      (0, t.jsx)("h2", { className: "text-2xl font-black uppercase tracking-tight text-yellow-400 mb-4", children: b("winTitle") }),
                      (0, t.jsxs)("div", {
                        className: "mb-8 flex flex-col items-center gap-3",
                        children: [
                          (0, t.jsx)("div", {
                            className: "flex items-center gap-2",
                            children: (0, t.jsx)("span", {
                              className: "text-3xl font-black bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]",
                              children: eb.name,
                            }),
                          }),
                          (0, t.jsx)("p", { className: "text-white/80 text-sm", children: b("winMessage", { name: "" }).replace(/\s+/g, " ").trim() }),
                        ],
                      }),
                      (0, t.jsx)("button", {
                        onClick: ef,
                        className:
                          "cursor-pointer w-full rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 py-4 text-sm font-bold uppercase tracking-widest text-black transition hover:scale-105",
                        children: b("playAgain"),
                      }),
                    ],
                  }),
                }),
              }),
              document.body,
            ),
          B &&
            (0, r.createPortal)(
              (0, t.jsx)("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in",
                children: (0, t.jsxs)("div", {
                  className: "w-full max-w-2xl flex-col rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-6 shadow-2xl max-h-[90vh] flex",
                  children: [
                    (0, t.jsxs)("div", {
                      className: "flex items-center justify-between mb-6",
                      children: [
                        (0, t.jsx)("h3", { className: "text-lg font-bold text-white", children: b("editor.title") }),
                        (0, t.jsx)("div", {
                          className: "flex items-center gap-3",
                          children: (0, t.jsx)("button", {
                            onClick: () => R(!1),
                            className: "cursor-pointer rounded-full bg-white/5 size-8 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-colors",
                            children: "✕",
                          }),
                        }),
                      ],
                    }),
                    (0, t.jsx)("div", {
                      className: "flex border-b border-white/10 mb-4",
                      children: U.map((e, s) =>
                        (0, t.jsx)(
                          "button",
                          {
                            onClick: () => W(s),
                            className: `cursor-pointer flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${V === s ? "bg-white/10 text-white border-b-2 border-pink-500" : "text-white/40 hover:text-white hover:bg-white/5"}`,
                            children: e,
                          },
                          s,
                        ),
                      ),
                    }),
                    (0, t.jsxs)("div", {
                      className: "rounded-xl bg-white/5 p-4 mb-4 border border-white/5",
                      children: [
                        (0, t.jsx)("h4", { className: "text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3", children: b("editor.editLabel") || "编辑标签名称" }),
                        (0, t.jsxs)("div", {
                          className: "flex flex-col gap-2 sm:flex-row items-center",
                          children: [
                            (0, t.jsx)("input", {
                              value: U[V],
                              onChange: (e) => {
                                let t = [...U];
                                ((t[V] = e.target.value), Z(t));
                              },
                              className: "flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-pink-500 focus:outline-none",
                              placeholder: b("editor.labelPlaceholder") || "输入标签名称",
                            }),
                            (0, t.jsx)("button", {
                              onClick: () => {
                                let e = G(),
                                  t = [...U];
                                ((t[V] = e[V]), Z(t));
                              },
                              className: "cursor-pointer rounded-lg bg-white/10 px-4 py-2 font-bold text-white hover:bg-white/20 text-xs whitespace-nowrap",
                              children: b("editor.resetLabel") || "重置",
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, t.jsx)("div", {
                      className: "flex-1 overflow-y-auto custom-scrollbar pr-2 mb-4",
                      children: (0, t.jsx)("div", {
                        className: "space-y-2",
                        children: g[V].map((e) =>
                          (0, t.jsxs)(
                            "div",
                            {
                              className: "flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 hover:bg-white/10 transition-colors",
                              children: [
                                (0, t.jsx)("input", {
                                  value: e.text,
                                  onChange: (t) => {
                                    var s, r;
                                    return (
                                      (s = e.id),
                                      (r = t.target.value),
                                      void w((e) => {
                                        let t = [...e];
                                        return ((t[V] = e[V].map((e) => (e.id === s ? { ...e, text: r } : e))), t);
                                      })
                                    );
                                  },
                                  className: "flex-1 bg-transparent text-sm font-medium text-white focus:outline-none",
                                }),
                                (0, t.jsx)("button", {
                                  onClick: () =>
                                    ((e, t) => {
                                      if (g[e].length <= 1) return;
                                      let s = [...g];
                                      ((s[e] = s[e].filter((e) => e.id !== t)), w(s));
                                    })(V, e.id),
                                  className: "cursor-pointer p-1 text-white/20 hover:text-rose-500 transition-colors",
                                  children: (0, t.jsx)("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    strokeWidth: 1.5,
                                    stroke: "currentColor",
                                    className: "size-5",
                                    children: (0, t.jsx)("path", {
                                      strokeLinecap: "round",
                                      strokeLinejoin: "round",
                                      d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0",
                                    }),
                                  }),
                                }),
                              ],
                            },
                            e.id,
                          ),
                        ),
                      }),
                    }),
                    (0, t.jsxs)("div", {
                      className: "rounded-xl bg-white/5 p-4 mb-6 border border-white/5",
                      children: [
                        (0, t.jsx)("h4", { className: "text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3", children: b("editor.addNew") }),
                        (0, t.jsxs)("div", {
                          className: "flex flex-col gap-2 sm:flex-row",
                          children: [
                            (0, t.jsx)("input", {
                              value: q,
                              onChange: (e) => H(e.target.value),
                              placeholder: b("editor.placeholder"),
                              className: "flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-pink-500 focus:outline-none",
                            }),
                            (0, t.jsx)("button", {
                              onClick: () => {
                                if (!q.trim()) return;
                                let e = { id: c(), text: q },
                                  t = [...g];
                                ((t[V] = [...t[V], e]), w(t), H(""));
                              },
                              className: "cursor-pointer rounded-lg bg-pink-600 px-4 font-bold text-white hover:bg-pink-500",
                              children: "+",
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, t.jsxs)("div", {
                      className: "mt-4 flex gap-3",
                      children: [
                        (0, t.jsx)("button", {
                          onClick: () => {
                            (w(p()), localStorage.removeItem("slots.reels_v2"), E(null), F(null), S("idle"), _(""), A(0));
                          },
                          className: "cursor-pointer flex-1 rounded-xl bg-white/10 py-3 text-sm font-bold text-rose-400 hover:bg-white/20 uppercase tracking-wide",
                          children: b("resetToDefaults"),
                        }),
                        (0, t.jsx)("button", { onClick: () => R(!1), className: "cursor-pointer flex-1 rounded-xl bg-white py-3 text-sm font-bold text-black hover:bg-gray-200", children: b("done") }),
                      ],
                    }),
                  ],
                }),
              }),
              document.body,
            ),
          et &&
            (0, r.createPortal)(
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
                              children: [(0, t.jsx)("span", { children: "📚" }), (0, t.jsx)("span", { children: b("library.title") || "Content Libraries" })],
                            }),
                            (0, t.jsx)("p", { className: "text-sm text-white/60 mt-1", children: b("library.subtitle") || "Save and switch between different content collections" }),
                          ],
                        }),
                        (0, t.jsx)("button", {
                          onClick: () => es(!1),
                          className: "cursor-pointer rounded-full bg-white/5 size-8 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-colors",
                          children: "✕",
                        }),
                      ],
                    }),
                    el && (0, t.jsx)("div", { className: "mb-4 rounded-xl bg-rose-500/20 border border-rose-500/30 p-3 text-sm text-rose-200", children: el }),
                    (0, t.jsxs)("div", {
                      className: "mb-6 rounded-xl border border-white/10 bg-white/5 p-4",
                      children: [
                        (0, t.jsx)("label", { className: "text-sm font-semibold text-white/80 mb-2 block", children: b("library.newLabel") || "Save current content as new library" }),
                        (0, t.jsxs)("div", {
                          className: "flex flex-col sm:flex-row gap-2",
                          children: [
                            (0, t.jsx)("input", {
                              type: "text",
                              value: er,
                              onChange: (e) => ea(e.target.value),
                              placeholder: b("library.namePlaceholder") || "Enter library name...",
                              className: "flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-white focus:outline-none focus:border-purple-500",
                              onKeyDown: (e) => "Enter" === e.key && eg(),
                            }),
                            (0, t.jsx)("button", {
                              onClick: eg,
                              className: "cursor-pointer rounded-xl bg-purple-600 px-6 py-2 font-bold text-white hover:bg-purple-500 whitespace-nowrap",
                              children: b("library.saveNew") || "Save",
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, t.jsx)("div", {
                      className: "flex-1 overflow-y-auto custom-scrollbar space-y-3",
                      children:
                        0 === Object.keys(Q).length
                          ? (0, t.jsx)("div", {
                              className: "text-center py-12 text-white/40",
                              children: (0, t.jsx)("p", { children: b("library.empty") || "No saved libraries yet. Create one above!" }),
                            })
                          : Object.values(Q)
                              .sort((e, t) => t.createdAt - e.createdAt)
                              .map((e) => {
                                let s = X === e.id,
                                  r = e.reels[0].length + e.reels[1].length + e.reels[2].length;
                                return (0, t.jsx)(
                                  "div",
                                  {
                                    className: `rounded-xl border p-4 transition-all ${s ? "border-purple-500/50 bg-purple-500/10" : "border-white/10 bg-white/5"}`,
                                    children: (0, t.jsxs)("div", {
                                      className: "flex flex-col gap-3",
                                      children: [
                                        (0, t.jsxs)("div", {
                                          className: "flex-1",
                                          children: [
                                            ei === e.id
                                              ? (0, t.jsx)("div", {
                                                  className: "flex items-center gap-2 mb-1",
                                                  children: (0, t.jsx)("input", {
                                                    autoFocus: !0,
                                                    value: ed,
                                                    onChange: (e) => ec(e.target.value),
                                                    onBlur: ew,
                                                    onKeyDown: (e) => {
                                                      ("Enter" === e.key && ew(), "Escape" === e.key && eo(null));
                                                    },
                                                    onClick: (e) => e.stopPropagation(),
                                                    className:
                                                      "w-full max-w-[200px] rounded border border-purple-500/50 bg-black/40 px-2 py-0.5 text-sm text-white font-bold focus:outline-none focus:border-purple-500",
                                                  }),
                                                })
                                              : (0, t.jsxs)("div", {
                                                  className: "flex flex-wrap items-center gap-2 mb-1",
                                                  children: [
                                                    (0, t.jsx)("h4", {
                                                      onClick: (t) => {
                                                        (t.stopPropagation(), e.isDefault || (eo(e.id), ec(e.name)));
                                                      },
                                                      className: `font-bold text-white ${!e.isDefault ? "cursor-pointer hover:text-purple-300 hover:underline decoration-dashed underline-offset-4" : ""}`,
                                                      title: e.isDefault ? "" : "Click to rename",
                                                      children: e.name,
                                                    }),
                                                    s &&
                                                      (0, t.jsx)("span", {
                                                        className:
                                                          "rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-300 border border-purple-500/30 whitespace-nowrap",
                                                        children: b("library.activeBadge") || "Active",
                                                      }),
                                                    e.isDefault &&
                                                      (0, t.jsx)("span", {
                                                        className: "rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/50 whitespace-nowrap",
                                                        children: b("library.defaultBadge") || "Default",
                                                      }),
                                                  ],
                                                }),
                                            (0, t.jsx)("p", { className: "text-xs text-white/60", children: b("library.stats", { count: r }) || `${r} items` }),
                                          ],
                                        }),
                                        (0, t.jsxs)("div", {
                                          className: "flex flex-wrap gap-2 text-[11px]",
                                          children: [
                                            (0, t.jsx)("button", {
                                              onClick: () => {
                                                var t;
                                                let s;
                                                (s = Q[(t = e.id)]) &&
                                                  (w([[...s.reels[0]], [...s.reels[1]], [...s.reels[2]]]), ee(t), es(!1), R(!1), en(null), E(null), F(null), S("idle"), _(""), A(0));
                                              },
                                              className:
                                                "cursor-pointer rounded-full border border-sky-400/60 px-3 py-1 font-semibold uppercase tracking-widest text-sky-100 transition hover:border-sky-300 hover:text-sky-50 whitespace-nowrap",
                                              children: s ? b("library.reload") || "Reload" : b("library.use") || "Use",
                                            }),
                                            !e.isDefault &&
                                              (0, t.jsxs)(t.Fragment, {
                                                children: [
                                                  (0, t.jsx)("button", {
                                                    onClick: () =>
                                                      ((e) => {
                                                        let t = Q[e];
                                                        if (!t) return;
                                                        if (t.isDefault) return void en(b("library.overwriteDefault") || "Cannot overwrite default library");
                                                        let s = { ...t, reels: [[...g[0]], [...g[1]], [...g[2]]], createdAt: Date.now() };
                                                        (Y((t) => ({ ...t, [e]: s })), en(null));
                                                      })(e.id),
                                                    className:
                                                      "cursor-pointer rounded-full border border-amber-400/60 px-3 py-1 font-semibold uppercase tracking-widest text-amber-100 transition hover:border-amber-300 hover:text-amber-50 whitespace-nowrap",
                                                    children: b("library.overwrite") || "Overwrite",
                                                  }),
                                                  (0, t.jsx)("button", {
                                                    onClick: () =>
                                                      ((e) => {
                                                        let t = Q[e];
                                                        if (!t) return;
                                                        if (t.isDefault) return void en(b("library.deleteDefault") || "Cannot delete default library");
                                                        let { [e]: s, ...r } = Q;
                                                        if ((Y(r), X === e)) {
                                                          let e = Object.values(r).find((e) => e.isDefault);
                                                          e && (ee(e.id), w([[...e.reels[0]], [...e.reels[1]], [...e.reels[2]]]));
                                                        }
                                                        en(null);
                                                      })(e.id),
                                                    className:
                                                      "cursor-pointer rounded-full border border-rose-400/60 px-3 py-1 font-semibold uppercase tracking-widest text-rose-100 transition hover:border-rose-300 hover:text-rose-50 whitespace-nowrap",
                                                    children: b("library.delete") || "Delete",
                                                  }),
                                                ],
                                              }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  },
                                  e.id,
                                );
                              }),
                    }),
                    (0, t.jsx)("div", {
                      className: "mt-6",
                      children: (0, t.jsx)("button", {
                        onClick: () => es(!1),
                        className: "cursor-pointer w-full rounded-xl bg-white py-3 text-sm font-bold text-black hover:bg-gray-200",
                        children: b("library.close") || "Close",
                      }),
                    }),
                  ],
                }),
              }),
              document.body,
            ),
          K &&
            (0, r.createPortal)(
              (0, t.jsx)("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in",
                children: (0, t.jsxs)("div", {
                  className: "w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-6 shadow-2xl max-h-[90vh] flex flex-col",
                  children: [
                    (0, t.jsxs)("div", {
                      className: "flex items-center justify-between mb-6",
                      children: [
                        (0, t.jsx)("h3", { className: "text-lg font-bold text-white", children: b("editor.players") }),
                        (0, t.jsx)("button", {
                          onClick: () => J(!1),
                          className: "cursor-pointer rounded-full bg-white/5 size-8 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-colors",
                          children: "✕",
                        }),
                      ],
                    }),
                    (0, t.jsxs)("div", {
                      className: "flex items-center gap-2 mb-4 p-3 bg-white/5 rounded-xl border border-white/5",
                      children: [
                        (0, t.jsx)("span", { className: "text-sm text-white/60 uppercase tracking-wide flex-1", children: b("editor.targetScore") }),
                        (0, t.jsx)("input", {
                          type: "number",
                          value: C,
                          onChange: (e) => z(Number(e.target.value)),
                          className: "w-20 rounded bg-black/40 px-3 py-2 text-right text-white font-bold border border-white/10 focus:border-pink-500 focus:outline-none",
                        }),
                      ],
                    }),
                    (0, t.jsx)("div", {
                      className: "space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1 flex-1",
                      children: v.map((e, s) =>
                        (0, t.jsxs)(
                          "div",
                          {
                            className: "flex gap-2 items-center bg-white/5 p-2 rounded-xl border border-white/5",
                            children: [
                              (0, t.jsx)("input", {
                                type: "color",
                                value: e.color,
                                onChange: (e) => {
                                  let t = [...v];
                                  ((t[s].color = e.target.value), y(t));
                                },
                                className: "size-8 rounded cursor-pointer bg-transparent border-none shrink-0",
                              }),
                              (0, t.jsx)("input", {
                                value: e.name,
                                onChange: (e) => {
                                  let t = [...v];
                                  ((t[s].name = e.target.value), y(t));
                                },
                                className: "flex-1 rounded bg-transparent px-2 py-1 text-sm text-white focus:outline-none focus:underline font-bold",
                              }),
                              v.length > 2 &&
                                (0, t.jsx)("button", { onClick: () => y(v.filter((t) => t.id !== e.id)), className: "cursor-pointer text-white/20 hover:text-red-500 p-2", children: "✕" }),
                            ],
                          },
                          e.id,
                        ),
                      ),
                    }),
                    (0, t.jsxs)("button", {
                      onClick: () => y([...v, { id: c(), name: `${b("editor.newPlayer")} ${v.length + 1}`, score: 0, color: "#a855f7" }]),
                      className:
                        "cursor-pointer mt-4 w-full rounded-xl bg-white/10 py-3 text-sm font-bold text-pink-400 hover:bg-white/20 hover:text-pink-300 uppercase tracking-wide border border-dashed border-white/20",
                      children: ["+ ", b("editor.addPlayer")],
                    }),
                    (0, t.jsx)("div", {
                      className: "mt-6",
                      children: (0, t.jsx)("button", {
                        onClick: () => J(!1),
                        className: "cursor-pointer w-full rounded-xl bg-white py-3 text-sm font-bold text-black hover:bg-gray-200",
                        children: b("done"),
                      }),
                    }),
                  ],
                }),
              }),
              document.body,
            ),
        ],
      });
    }
    e.s(["SlotsGame", () => b]);
  },
  56471,
  (e) => {
    e.n(e.i(15619));
  },
]);
