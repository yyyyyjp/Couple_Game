(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  87711,
  (e) => {
    "use strict";
    var t = e.i(43476),
      r = e.i(71645),
      a = e.i(74080),
      l = e.i(48148),
      s = e.i(18566),
      n = e.i(37902);
    let o = ({ onComplete: e, player1Label: a, player2Label: s }) => {
      let o = (0, l.useTranslations)("games.darkBeast.coinFlip"),
        [i, d] = (0, r.useState)(!0),
        [c] = (0, r.useState)(() => (0.5 > Math.random() ? "player1" : "player2")),
        [u, m] = (0, r.useState)("animate-spin-3d-fast");
      return (
        (0, r.useEffect)(() => {
          let t = setTimeout(() => {
              m(`${"player1" === c ? "land-player1" : "land-player2"}`);
            }, 2100),
            r = setTimeout(() => {
              (d(!1), e(c));
            }, 3500);
          return () => {
            (clearTimeout(t), clearTimeout(r));
          };
        }, [e, c]),
        (0, t.jsx)("div", {
          className: "flex flex-col items-center justify-center min-h-[60vh] w-full",
          children: (0, t.jsxs)("div", {
            className: "jsx-6857d1be2ea1da70 relative w-64 h-80 sm:w-72 sm:h-96 perspective-1000",
            children: [
              (0, t.jsx)(n.default, {
                id: "6857d1be2ea1da70",
                children:
                  '.card-container.jsx-6857d1be2ea1da70{width:100%;height:100%;transform-style:preserve-3d;border-radius:1.5rem;transition:transform 1.2s cubic-bezier(.175,.885,.32,1.275);position:relative}.card-face.jsx-6857d1be2ea1da70{backface-visibility:hidden;border-radius:1.5rem;flex-direction:column;justify-content:center;align-items:center;width:100%;height:100%;display:flex;position:absolute;overflow:hidden;box-shadow:0 20px 50px #00000080,inset 0 0 0 1px #ffffff1a}.card-face.jsx-6857d1be2ea1da70:before{content:"";opacity:.8;z-index:1;background:linear-gradient(135deg,#ffffff4d 0%,#fff0 60%);position:absolute;inset:0}.texture.jsx-6857d1be2ea1da70{opacity:.15;mix-blend-mode:overlay;z-index:0;background-image:url(/noise.png);position:absolute;inset:0}.content.jsx-6857d1be2ea1da70{z-index:10;text-align:center;position:relative;transform:translateZ(30px)}.card-face-back.jsx-6857d1be2ea1da70{transform:rotateY(180deg)}@keyframes spin-3d-fast{0%{transform:rotateY(0)rotateX(0)scale(.8)}50%{transform:rotateY(1800deg)rotateX(10deg)scale(1)}to{transform:rotateY(3600deg)rotateX(0)scale(.8)}}.animate-spin-3d-fast.jsx-6857d1be2ea1da70{animation:2.5s linear infinite spin-3d-fast}.land-player1.jsx-6857d1be2ea1da70{transform:rotateY(0)scale(1);box-shadow:0 0 50px #f43f5e99}.land-player2.jsx-6857d1be2ea1da70{transform:rotateY(180deg)scale(1);box-shadow:0 0 50px #3b82f699}.inner-border.jsx-6857d1be2ea1da70{z-index:2;border:2px solid #fff3;border-radius:1rem;position:absolute;inset:12px}',
              }),
              (0, t.jsxs)("div", {
                className: `jsx-6857d1be2ea1da70 card-container ${i ? u : "player1" === c ? "land-player1" : "land-player2"}`,
                children: [
                  (0, t.jsxs)("div", {
                    className: "jsx-6857d1be2ea1da70 card-face bg-gradient-to-br from-[#ff4d4d] via-[#a60000] to-[#4a0000]",
                    children: [
                      (0, t.jsx)("div", { className: "jsx-6857d1be2ea1da70 texture" }),
                      (0, t.jsx)("div", { className: "jsx-6857d1be2ea1da70 inner-border" }),
                      (0, t.jsxs)("div", {
                        className: "jsx-6857d1be2ea1da70 content flex flex-col items-center gap-4",
                        children: [
                          (0, t.jsx)("div", {
                            className: "jsx-6857d1be2ea1da70 size-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg text-6xl",
                            children: "🔥",
                          }),
                          (0, t.jsxs)("div", {
                            className: "jsx-6857d1be2ea1da70 flex flex-col items-center",
                            children: [
                              (0, t.jsx)("span", { className: "jsx-6857d1be2ea1da70 text-sm font-bold tracking-[0.3em] text-white/60 uppercase mb-1", children: o("firstTurn") }),
                              (0, t.jsx)("h2", { className: "jsx-6857d1be2ea1da70 text-4xl font-black text-white uppercase tracking-tighter drop-shadow-md", children: a.split(" ")[0] }),
                              (0, t.jsx)("div", { className: "jsx-6857d1be2ea1da70 h-1 w-12 bg-white/50 rounded-full mt-3" }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, t.jsxs)("div", {
                    className: "jsx-6857d1be2ea1da70 card-face card-face-back bg-gradient-to-br from-[#4d79ff] via-[#0033a6] to-[#00114a]",
                    children: [
                      (0, t.jsx)("div", { className: "jsx-6857d1be2ea1da70 texture" }),
                      (0, t.jsx)("div", { className: "jsx-6857d1be2ea1da70 inner-border" }),
                      (0, t.jsxs)("div", {
                        className: "jsx-6857d1be2ea1da70 content flex flex-col items-center gap-4",
                        children: [
                          (0, t.jsx)("div", {
                            className: "jsx-6857d1be2ea1da70 size-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg text-6xl",
                            children: "❄️",
                          }),
                          (0, t.jsxs)("div", {
                            className: "jsx-6857d1be2ea1da70 flex flex-col items-center",
                            children: [
                              (0, t.jsx)("span", { className: "jsx-6857d1be2ea1da70 text-sm font-bold tracking-[0.3em] text-white/60 uppercase mb-1", children: o("firstTurn") }),
                              (0, t.jsx)("h2", { className: "jsx-6857d1be2ea1da70 text-4xl font-black text-white uppercase tracking-tighter drop-shadow-md", children: s.split(" ")[0] }),
                              (0, t.jsx)("div", { className: "jsx-6857d1be2ea1da70 h-1 w-12 bg-white/50 rounded-full mt-3" }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              (0, t.jsx)("div", {
                className: `jsx-6857d1be2ea1da70 mt-16 text-center transition-opacity duration-500 ${i ? "opacity-100" : "opacity-0"}`,
                children: (0, t.jsx)("p", { className: "jsx-6857d1be2ea1da70 text-white/40 font-mono text-sm animate-pulse tracking-widest", children: o("decidingFate") }),
              }),
            ],
          }),
        })
      );
    };
    var i = e.i(8387),
      d = e.i(15972),
      c = e.i(26114),
      u = e.i(43517);
    let m = (e, t, r, a) => {
        let l = Math.abs(Math.floor(e / 4) - Math.floor(t / 4)),
          s = Math.abs((e % 4) - (t % 4));
        return l + s === 1 || (!!a && 4 === r && 1 === l && 1 === s);
      },
      p = (e, t, r) => (0 === e && 7 === t) || ((7 !== e || 0 !== t) && (!r || 0 !== t || 1 === e || 0 === e) && e >= t),
      x = (e, t, r) => {
        if (null === t) return null;
        let a = e.board[t];
        if (!a || a.owner !== r) return null;
        let l = e.oscillation[r][a.id];
        return !l || l.lastTo !== t || l.alternationCount < 6 ? null : l.lastFrom;
      },
      b = (e, t, r, a, l) => {
        let s = e.board[r];
        if (!s || !s.isRevealed || s.owner !== t || !m(r, a, s.rank, l.diagonalLeopard)) return !1;
        let n = e.board[a];
        if (n && (!n.isRevealed || n.owner === t || !p(s.rank, n.rank, l.onlyCatEatsRat))) return !1;
        let o = x(e, r, t);
        if (null === o || o !== a) return !1;
        let i = e.oscillation[t][s.id];
        return (
          !i ||
          6 !== i.alternationCount ||
          !!((e, t, r) => {
            for (let a = 0; a < e.board.length; a++) {
              let l = e.board[a];
              if (!l || !l.isRevealed || l.owner !== t) continue;
              let s = x(e, a, t);
              for (let n = 0; n < e.board.length; n++) {
                if (n === a || (null !== s && n === s) || !m(a, n, l.rank, r.diagonalLeopard)) continue;
                let o = e.board[n];
                if (!o) return !0;
                if (o.isRevealed && o.owner !== t && p(l.rank, o.rank, r.onlyCatEatsRat)) return !0;
              }
            }
            return !1;
          })(e, t, l)
        );
      };
    var f = e.i(87974);
    let h = "darkbeast_mp_session_v1",
      y = ["player2", "player1"],
      g = [
        { rank: 0, icon: "🐀", color: "from-gray-400 to-gray-600", nameKey: "0" },
        { rank: 1, icon: "🐈", color: "from-amber-300 to-amber-500", nameKey: "1" },
        { rank: 2, icon: "🐕", color: "from-orange-600 to-orange-800", nameKey: "2" },
        { rank: 3, icon: "🐺", color: "from-slate-400 to-slate-600", nameKey: "3" },
        { rank: 4, icon: "🐆", color: "from-yellow-400 to-yellow-600", nameKey: "4" },
        { rank: 5, icon: "🐅", color: "from-orange-500 to-red-600", nameKey: "5" },
        { rank: 6, icon: "🦁", color: "from-yellow-500 to-amber-700", nameKey: "6" },
        { rank: 7, icon: "🐘", color: "from-blue-400 to-blue-600", nameKey: "7" },
      ],
      w = ["player1", "player2"],
      v = () => ({ player1: {}, player2: {} }),
      j = () => {
        let [e, a] = (0, r.useState)([]);
        return ((0, r.useEffect)(() => {
          let e = setTimeout(() => {
            a(
              Array.from({ length: 30 }).map(() => ({
                left: `${100 * Math.random()}%`,
                backgroundColor: ["#fbbf24", "#ec4899", "#8b5cf6"][Math.floor(3 * Math.random())],
                animationDelay: `${2 * Math.random()}s`,
                animationDuration: `${3 + 2 * Math.random()}s`,
              })),
            );
          }, 0);
          return () => clearTimeout(e);
        }, []),
        0 === e.length)
          ? null
          : (0, t.jsx)("div", {
              className: "pointer-events-none absolute inset-0 overflow-hidden",
              children: e.map((e, r) =>
                (0, t.jsx)(
                  "div",
                  {
                    className: "absolute h-3 w-3 animate-fall",
                    style: { left: e.left, top: "-10%", backgroundColor: e.backgroundColor, animationDelay: e.animationDelay, animationDuration: e.animationDuration },
                  },
                  r,
                ),
              ),
            });
      };
    function k() {
      let e,
        n = (0, l.useTranslations)("games.darkBeast"),
        m = (0, l.useTranslations)("games.darkBeast.multiplayer"),
        p = (0, s.useSearchParams)(),
        x = p.get("join"),
        k = p.has("join"),
        C = (() => {
          if (k) return null;
          let e = (0, f.readStoredMpSession)(h);
          if (e?.roomId) return null;
          try {
            let e = localStorage.getItem("lovegame-darkbeast-state");
            if (!e) return null;
            let t = JSON.parse(e);
            if (!t.oscillation?.player1 || !t.oscillation?.player2) return { ...t, oscillation: v() };
            return t;
          } catch {
            return null;
          }
        })(),
        [$, R] = (0, r.useState)(C),
        [I, P] = (0, r.useState)([]),
        [_, E] = (0, r.useState)(null),
        [M, T] = (0, r.useState)(!C),
        [L, O] = (0, r.useState)(0),
        [z, A] = (0, r.useState)(!1),
        [D, K] = (0, r.useState)("player1"),
        [F, B] = (0, r.useState)(!1),
        [J, Y] = (0, r.useState)(!1),
        [G, H] = (0, r.useState)(() => {
          let e = {},
            t = {};
          return (
            g.forEach((r) => {
              ((e[r.rank] = n(`defaultPenaltiesP1.${r.rank}`)), (t[r.rank] = n(`defaultPenaltiesP2.${r.rank}`)));
            }),
            { player1: e, player2: t }
          );
        }),
        [U, W] = (0, r.useState)(() => ({ player1: n("defaultRewardP1"), player2: n("defaultRewardP2") })),
        [X, q] = (0, r.useState)(k),
        [V, Q] = (0, r.useState)(null),
        [Z, ee] = (0, r.useState)(!1),
        [et, er] = (0, r.useState)(null),
        [ea, el] = (0, r.useState)([]),
        [es, en] = (0, r.useState)(null),
        [eo, ei] = (0, r.useState)(!1),
        [ed, ec] = (0, r.useState)(!1),
        [eu, em] = (0, r.useState)(!1),
        [ep, ex] = (0, r.useState)(!1),
        eb = (0, r.useRef)(null),
        ef = (0, r.useRef)(!1),
        eh = (0, r.useRef)(null),
        ey = (0, r.useRef)(!1),
        eg = (0, r.useRef)(0),
        ew = (0, r.useRef)(null),
        { play: ev, startHeartbeat: ej, stopHeartbeat: ek } = (0, i.useGameSound)();
      ((0, r.useEffect)(() => (_ ? ej() : ek(), () => ek()), [_, ej, ek]),
        (0, r.useEffect)(() => {
          if ((!X || Z) && null === _ && I.length > 0) {
            let e = setTimeout(() => {
              P((e) => {
                if (0 === e.length) return e;
                let t = 0;
                for (let r of y) {
                  let a = e.findIndex((e) => e.player === r);
                  if (a >= 0) {
                    t = a;
                    break;
                  }
                }
                let r = e[t],
                  a = e.filter((e, r) => r !== t);
                return (E(r), a);
              });
            }, 0);
            return () => clearTimeout(e);
          }
        }, [_, X, Z, I]),
        (0, r.useEffect)(() => {
          k ||
            $ ||
            (() => {
              try {
                let e = localStorage.getItem("lovegame-darkbeast-state"),
                  t = localStorage.getItem("lovegame-darkbeast-settings"),
                  r = localStorage.getItem("lovegame-darkbeast-penalties"),
                  a = localStorage.getItem("lovegame-darkbeast-rewards");
                if (e) {
                  let t = JSON.parse(e);
                  (R(eN(t)), T(!1));
                }
                if (t) {
                  let { diagonalLeopard: e, onlyCatEatsRat: r } = JSON.parse(t);
                  ("boolean" == typeof e && B(e), "boolean" == typeof r && Y(r));
                }
                (r && H(JSON.parse(r)), a && W(JSON.parse(a)));
              } catch (e) {
                console.error("Failed to load game state", e);
              }
            })();
        }, [$, k]),
        (0, r.useEffect)(() => {
          $ && localStorage.setItem("lovegame-darkbeast-state", JSON.stringify($));
        }, [$]),
        (0, r.useEffect)(() => {
          localStorage.setItem("lovegame-darkbeast-settings", JSON.stringify({ diagonalLeopard: F, onlyCatEatsRat: J }));
        }, [F, J]),
        (0, r.useEffect)(() => {
          localStorage.setItem("lovegame-darkbeast-penalties", JSON.stringify(G));
        }, [G]),
        (0, r.useEffect)(() => {
          localStorage.setItem("lovegame-darkbeast-rewards", JSON.stringify(U));
        }, [U]));
      let eN = (0, r.useCallback)((e) => (e.oscillation?.player1 && e.oscillation?.player2 ? e : { ...e, oscillation: v() }), []),
        eS = (0, r.useCallback)((e) => {
          e &&
            (B(!!e.diagonalLeopard),
            Y(!!e.onlyCatEatsRat),
            e.customPenalties?.player1 && e.customPenalties?.player2 && H(e.customPenalties),
            e.customRewards?.player1 && e.customRewards?.player2 && W(e.customRewards));
        }, []),
        eC = (0, r.useCallback)((e) => {
          e && (e.gameState ? (R(eN(e.gameState)), P(e.penaltyQueue ?? []), E(e.activePenalty ?? null)) : R(eN(e)), T(!1));
        }, []),
        e$ = (0, r.useCallback)((e = !1) => {
          (u.multiplayerClient.disconnect({ silent: !0 }),
            Q(null),
            el([]),
            en(null),
            ee(!1),
            er(null),
            ei(!1),
            ec(!1),
            ex(!1),
            e || q(!1),
            (eh.current = null),
            (ey.current = !1),
            (eg.current = 0),
            ew.current && (window.clearTimeout(ew.current), (ew.current = null)),
            (0, f.clearStoredMpSession)(h));
        }, []),
        eR = (0, r.useCallback)(() => {
          window.confirm(m("confirmExit")) && (X && V && u.multiplayerClient.disbandRoom(), e$());
        }, [e$, X, V, m]),
        eI = (0, r.useCallback)(
          (e) => {
            if (!e?.roomId || ey.current) return;
            eg.current += 1;
            let t = eg.current;
            if (t > 5) {
              (ec(!1), e$(!0));
              return;
            }
            (ec(!0), (ey.current = !0));
            let r = Math.min(3e4, 1e3 * Math.pow(2, t - 1));
            (ew.current && window.clearTimeout(ew.current),
              (ew.current = window.setTimeout(() => {
                u.multiplayerClient.joinRoomWithResume(e.roomId, e.password, e.myPlayerId ?? void 0, "dark-beast").catch(() => {
                  ((ey.current = !1), eI(e));
                });
              }, r)));
          },
          [e$],
        );
      ((0, r.useEffect)(() => {
        u.multiplayerClient.setBaseUrl((0, f.resolveMultiplayerWsUrl)());
        let e = (0, f.readStoredMpSession)(h);
        e?.roomId &&
          (q(!0),
          Q(e.roomId),
          er(e.color ?? null),
          ec(!0),
          (ey.current = !0),
          u.multiplayerClient.joinRoomWithResume(e.roomId, e.password, e.myPlayerId ?? void 0).catch(() => {
            ((ey.current = !1), eI(e));
          }));
      }, [eI]),
        (0, r.useEffect)(
          () =>
            u.multiplayerClient.subscribe((e, t) => {
              switch (e) {
                case "ROOM_CREATED": {
                  (Q(t.roomId), ee(!0), er(t.color ?? null), en(t.id), el([{ id: t.id, color: t.color }]), ec(!0), (ey.current = !0), (eg.current = 0));
                  let e = eh.current?.kind === "create" ? eh.current.password : ((0, f.readStoredMpSession)(h)?.password ?? "");
                  ((0, f.writeStoredMpSession)(h, { roomId: t.roomId, password: e, color: t.color ?? null, myPlayerId: t.id }),
                    (eh.current = null),
                    u.multiplayerClient.joinRoomWithResume(t.roomId, e, t.id, "dark-beast").catch(() => {
                      ((ey.current = !1), ec(!1));
                    }));
                  break;
                }
                case "JOINED_ROOM":
                  (Q(t.roomId),
                    ee(!!t.isHost),
                    en(t.myPlayerId),
                    el(() => {
                      let e = new Map();
                      return (
                        (t.players ?? []).forEach((t) => {
                          e.set(t.id, t);
                        }),
                        Array.from(e.values())
                      );
                    }),
                    ei(!!t.gameStarted),
                    t.gameStarted && (T(!1), ex(!1)),
                    ec(!1),
                    (ey.current = !1),
                    (eg.current = 0));
                  {
                    let e = (0, f.readStoredMpSession)(h),
                      r = eh.current?.kind === "join" ? eh.current.password : (e?.password ?? ""),
                      a = e?.roomId === t.roomId ? (e.color ?? null) : null;
                    ((0, f.writeStoredMpSession)(h, { roomId: t.roomId, password: r, color: a, myPlayerId: t.myPlayerId }), (eh.current = null));
                  }
                  (t.state && (em(!0), eC(t.state), setTimeout(() => em(!1), 50)), t.settings && (em(!0), eS(t.settings), setTimeout(() => em(!1), 50)));
                  {
                    let e = (0, f.readStoredMpSession)(h),
                      r = e?.roomId === t.roomId ? (e.color ?? null) : null;
                    r && (new Set((t.players ?? []).map((e) => e.color).filter(Boolean)).has(r) || (er(r), u.multiplayerClient.selectColor(r)));
                  }
                  break;
                case "PLAYER_JOINED":
                  (el((e) => (e.some((e) => e.id === t.id) ? e : [...e, { id: t.id, color: null }])),
                    Z &&
                      $ &&
                      (u.multiplayerClient.syncState({ gameState: $, penaltyQueue: I, activePenalty: _ }),
                      u.multiplayerClient.syncSettings({ diagonalLeopard: F, onlyCatEatsRat: J, customPenalties: G, customRewards: U })));
                  break;
                case "PLAYER_LEFT":
                  el((e) => e.filter((e) => e.id !== t.id));
                  break;
                case "COLOR_SELECTED":
                  (el((e) => e.map((e) => (e.id === t.id ? { ...e, color: t.color } : e))), t.id === es && er(t.color ? t.color : null));
                  break;
                case "STATE_UPDATED":
                  t.state && (em(!0), eC(t.state), setTimeout(() => em(!1), 100));
                  break;
                case "SETTINGS_UPDATED":
                  (em(!0), eS(t.settings), setTimeout(() => em(!1), 50));
                  break;
                case "GAME_STARTED":
                  (ei(!0), ec(!1), ep || T(!1));
                  break;
                case "GAME_ACTION":
                  if (t?.type === "DB_CLICK") {
                    let e = t.index;
                    if (Number.isInteger(e)) {
                      let r = "string" == typeof t.player ? t.player : null;
                      if (!$ || !r || $.currentPlayer !== r) break;
                      eb.current?.(e, !0);
                    }
                  } else if (t?.type === "DB_ACK_PENALTY") {
                    if (!Z || !_) break;
                    let e = t.player,
                      r = t.penaltyKey;
                    e === _.player && r === _.penaltyKey && E(null);
                  }
                  break;
                case "ROOM_DISBANDED": {
                  let e = (0, f.readStoredMpSession)(h);
                  (e?.roomId === t.roomId && (0, f.clearStoredMpSession)(h), t.roomId && t.roomId === V && alert(m("errors.roomDisbanded")), e$());
                  break;
                }
                case "DISCONNECTED": {
                  if (!V || ey.current) break;
                  let e = (0, f.readStoredMpSession)(h);
                  e?.roomId && eI(e);
                  break;
                }
                case "ERROR":
                  if (ed) {
                    let e = t?.code;
                    (alert(
                      (() => {
                        switch (e) {
                          case "ROOM_NOT_FOUND":
                            return m("errors.roomNotFound");
                          case "INVALID_PASSWORD":
                            return m("errors.invalidPassword");
                          case "COLOR_ALREADY_TAKEN":
                            return m("errors.colorAlreadyTaken");
                          case "GAME_MISMATCH":
                            return m("errors.gameMismatch");
                          case "CREATE_ROOM_FAILED":
                            return m("errors.createRoomFailed");
                          default:
                            return "string" == typeof t?.message && t.message.trim() ? t.message : m("errors.reconnectFailed");
                        }
                      })(),
                    ),
                      e$(!0));
                  }
              }
            }),
          [_, eS, eC, G, U, F, $, e$, Z, es, ed, V, ep, m, J, I, eI],
        ),
        (0, r.useEffect)(() => {
          X && V && ef.current && !eu && $ && u.multiplayerClient.syncState({ gameState: $, penaltyQueue: I, activePenalty: _ });
        }, [_, $, X, V, eu, I]),
        (0, r.useEffect)(() => {
          X && V && Z && !eu && u.multiplayerClient.syncSettings({ diagonalLeopard: F, onlyCatEatsRat: J, customPenalties: G, customRewards: U });
        }, [G, U, F, X, Z, V, eu, J]),
        (0, r.useEffect)(() => {
          if (!X || !V || !et) return;
          let e = (0, f.readStoredMpSession)(h);
          e && e.roomId === V && e.color !== et && (0, f.writeStoredMpSession)(h, { ...e, color: et });
        }, [X, V, et]));
      let eP = (0, r.useCallback)((e) => (e ? n(`players.${e}`) : m("labels.selecting")), [m, n]),
        e_ = (0, r.useCallback)((e) => ("player1" === e ? "bg-rose-500" : "player2" === e ? "bg-sky-500" : "bg-zinc-600"), []),
        eE = (0, r.useCallback)((e) => {
          eh.current = e;
        }, []),
        eM = (0, r.useCallback)(async () => {
          if (!Z || ea.length !== w.length) return;
          let e = ea.filter((e) => !e.color),
            t = new Set(ea.map((e) => e.color).filter((e) => null !== e)),
            r = w.filter((e) => !t.has(e));
          for (let t = 0; t < e.length; t += 1) {
            let a = e[t],
              l = r[t];
            l && u.multiplayerClient.assignColor(a.id, l);
          }
          (R(null), P([]), E(null), T(!0), ex(!0), O((e) => e + 1), u.multiplayerClient.startGame());
        }, [Z, ea]),
        eT = (0, r.useCallback)(
          (e) => {
            ev("start");
            let t = [
              ...g.map((e) => ({ id: `p1-${e.rank}`, rank: e.rank, owner: "player1", isRevealed: !1 })),
              ...g.map((e) => ({ id: `p2-${e.rank}`, rank: e.rank, owner: "player2", isRevealed: !1 })),
            ];
            for (let e = t.length - 1; e > 0; e--) {
              let r = Math.floor(Math.random() * (e + 1));
              [t[e], t[r]] = [t[r], t[e]];
            }
            (R({ board: t, currentPlayer: e || "player1", selectedIndex: null, winner: null, player1Lost: [], player2Lost: [], gameLog: [n("log.start")], oscillation: v() }), P([]), E(null));
          },
          [n, ev],
        ),
        eL = (0, r.useCallback)(
          (e) => {
            (!X || Z) && (T(!1), X && ex(!1), eT(e));
          },
          [eT, X, Z],
        ),
        eO = (0, r.useCallback)(() => {
          (!X || Z) && (R(null), T(!0), O((e) => e + 1), P([]), E(null), localStorage.removeItem("lovegame-darkbeast-state"));
        }, [X, Z]),
        ez = (e) => n(`pieces.${e}`),
        eA = (e, t) => G[t][e],
        eD = (e, t, r, a, l) => {
          let s = e.oscillation[t],
            n = s[r.id],
            o = `${Math.min(a, l)}-${Math.max(a, l)}`,
            i = 1;
          return (
            n && n.pairKey === o && n.lastFrom === l && n.lastTo === a && (i = n.alternationCount + 1),
            { ...e.oscillation, [t]: { ...s, [r.id]: { lastFrom: a, lastTo: l, pairKey: o, alternationCount: i } } }
          );
        },
        eK = (e, t, r) => {
          let a = e[t];
          if (!a[r]) return e;
          let { [r]: l, ...s } = a;
          return { ...e, [t]: s };
        },
        eF = (e, t = !1) => {
          if (!$ || $.winner) return;
          if (X && !t) {
            if (!eo || !et || $.currentPlayer !== et) return;
            Z || u.multiplayerClient.sendGameAction({ type: "DB_CLICK", index: e, player: et });
          } else if (X && t && (!eo || !et)) return;
          let { board: r, currentPlayer: a, selectedIndex: l } = $,
            s = r[e];
          if (s && !s.isRevealed) {
            if (null !== l) return void R((e) => (e ? { ...e, selectedIndex: null } : null));
            ev("flip");
            let t = [...r],
              o = { ...s, isRevealed: !0 };
            return (
              (t[e] = o),
              void R({ ...$, board: t, currentPlayer: "player1" === a ? "player2" : "player1", gameLog: [n("log.flip", { player: n(`players.${a}`), piece: ez(o.rank) }), ...$.gameLog].slice(0, 6) })
            );
          }
          if (s && s.isRevealed && s.owner === a) return void R({ ...$, selectedIndex: l === e ? null : e });
          if (null !== l) {
            var o, i, d;
            let t,
              c,
              u = r[l];
            if (b($, a, l, e, { diagonalLeopard: F, onlyCatEatsRat: J })) return;
            if (((o = u.rank), (t = Math.abs(Math.floor(l / 4) - Math.floor(e / 4))) + (c = Math.abs((l % 4) - (e % 4))) !== 1 && (!F || 4 !== o || 1 !== t || 1 !== c) && 1))
              return void R({ ...$, selectedIndex: null });
            if (!s) {
              let t = [...r];
              ((t[e] = u), (t[l] = null));
              let s = eD($, a, u, l, e);
              R({
                ...$,
                board: t,
                selectedIndex: null,
                currentPlayer: "player1" === a ? "player2" : "player1",
                gameLog: [n("log.move", { player: n(`players.${a}`), piece: ez(u.rank) }), ...$.gameLog].slice(0, 6),
                oscillation: s,
              });
              return;
            }
            if (s.isRevealed && s.owner !== a) {
              if (((i = u.rank), (d = s.rank), 0 === i && 7 === d ? 0 : (7 === i && 0 === d) || (J && 0 === d && 1 !== i && 0 !== i) ? 1 : !(i >= d))) R({ ...$, selectedIndex: null });
              else {
                let t = [...r],
                  o = [...$.player1Lost],
                  i = [...$.player2Lost],
                  d = null,
                  c = "",
                  m = [],
                  p = $.oscillation;
                (ev("eat"),
                  u.rank === s.rank
                    ? ((t[e] = null),
                      (t[l] = null),
                      "player1" === u.owner ? o.push(u.rank) : i.push(u.rank),
                      "player1" === s.owner ? o.push(s.rank) : i.push(s.rank),
                      m.push({ player: u.owner, beastRank: u.rank, penaltyKey: `${u.rank}` }),
                      m.push({ player: s.owner, beastRank: s.rank, penaltyKey: `${s.rank}` }),
                      (c = n("log.mutual", { p1: ez(u.rank), p2: ez(s.rank) })),
                      (p = eK(p, u.owner, u.id)),
                      (p = eK(p, s.owner, s.id)))
                    : ((t[e] = u),
                      (t[l] = null),
                      "player1" === s.owner
                        ? (o.push(s.rank), m.push({ player: "player1", beastRank: s.rank, penaltyKey: `${s.rank}` }))
                        : (i.push(s.rank), m.push({ player: "player2", beastRank: s.rank, penaltyKey: `${s.rank}` })),
                      (c = n("log.eat", { player: n(`players.${a}`), attacker: ez(u.rank), defender: ez(s.rank) })),
                      (p = eK((p = eD($, a, u, l, e)), s.owner, s.id))));
                let x = t.filter((e) => e?.owner === "player1").length,
                  b = t.filter((e) => e?.owner === "player2").length;
                if (
                  (0 === x && 0 === b ? ((d = a), ev("win")) : 0 === x ? ((d = "player2"), ev("win")) : 0 === b && ((d = "player1"), ev("win")),
                  R({
                    ...$,
                    board: t,
                    selectedIndex: null,
                    currentPlayer: "player1" === a ? "player2" : "player1",
                    player1Lost: o,
                    player2Lost: i,
                    winner: d,
                    gameLog: [c, ...$.gameLog].slice(0, 6),
                    oscillation: p,
                  }),
                  !X || Z)
                ) {
                  let e = [...m].sort((e, t) => y.indexOf(e.player) - y.indexOf(t.player));
                  P((t) => [...t, ...e]);
                }
              }
              return;
            }
          }
          R({ ...$, selectedIndex: null });
        };
      ((0, r.useEffect)(() => {
        eb.current = eF;
      }, [eF]),
        (0, r.useEffect)(() => {
          ef.current = Z;
        }, [Z]));
      let eB = Z ? m("status.waitingForPlayers") : m("status.waitingForHost");
      if (M)
        e =
          !X || (eo && Z)
            ? (0, t.jsx)("div", {
                className: "relative flex w-full flex-col items-center justify-center min-h-[500px]",
                children: (0, t.jsx)(o, { onComplete: eL, player1Label: n("players.player1"), player2Label: n("players.player2") }, L),
              })
            : (0, t.jsx)("div", { className: "flex h-96 items-center justify-center text-white/60", children: eB });
      else if ($) {
        let r,
          l,
          s,
          o,
          i,
          d = (() => {
            let e = $.selectedIndex;
            if (null === e) return null;
            let t = $.board[e];
            if (!t || t.owner !== $.currentPlayer) return null;
            let r = $.oscillation[$.currentPlayer][t.id];
            if (!r || r.lastTo !== e || r.alternationCount < 6) return null;
            let a = r.lastFrom;
            return b($, $.currentPlayer, e, a, { diagonalLeopard: F, onlyCatEatsRat: J }) ? a : null;
          })();
        e = (0, t.jsx)("div", {
          className: "relative flex w-full flex-col items-center gap-10",
          children: (0, t.jsxs)("section", {
            className: "glass-effect relative w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 p-4 sm:p-10",
            children: [
              (0, t.jsx)("div", { className: "pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px] animate-pulse-slow" }),
              (0, t.jsx)("div", {
                className: "pointer-events-none absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-rose-600/20 blur-[120px] animate-pulse-slow",
                style: { animationDelay: "2s" },
              }),
              (0, t.jsxs)("div", {
                className: "pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[3rem]",
                children: [
                  (0, t.jsx)("div", {
                    className: `absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px] transition-all duration-1000 ${"player1" === $.currentPlayer ? "opacity-30 scale-90" : "opacity-60 scale-110"}`,
                  }),
                  (0, t.jsx)("div", {
                    className: `absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-rose-600/20 blur-[120px] transition-all duration-1000 ${"player1" === $.currentPlayer ? "opacity-60 scale-110" : "opacity-30 scale-90"}`,
                  }),
                ],
              }),
              (0, t.jsxs)("header", {
                className: "relative z-10 flex flex-col items-center text-center",
                children: [
                  (0, t.jsx)("h1", {
                    className:
                      "bg-gradient-to-b from-white via-purple-100 to-white/60 bg-clip-text text-4xl font-black uppercase tracking-tighter text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] sm:text-5xl",
                    children: n("title"),
                  }),
                  (0, t.jsx)("div", { className: "mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-80" }),
                  (0, t.jsx)("p", { className: "mt-4 text-sm font-medium tracking-[0.2em] text-white/40", children: n("tagline") }),
                ],
              }),
              (0, t.jsxs)("div", {
                className: "mt-4 relative z-10 flex flex-col gap-2 w-full darkbeast-layout",
                children: [
                  (0, t.jsx)("div", {
                    className: "order-3 w-full shrink darkbeast-panel-left",
                    children: (0, t.jsx)(N, {
                      t: n,
                      player: "player1",
                      isActive: "player1" === $.currentPlayer,
                      lostPieces: $.player1Lost,
                      label: n("players.player1"),
                      penaltyLabel: n("penaltyHistory"),
                      getPenaltyContent: eA,
                    }),
                  }),
                  (0, t.jsx)("div", {
                    className: "order-2 flex flex-col items-center justify-center perspective-1000 flex-grow darkbeast-board",
                    children: (0, t.jsxs)("div", {
                      className: `w-full relative grid grid-cols-4 gap-2 sm:gap-4 p-3 sm:p-5 rounded-[2rem] border shadow-2xl backdrop-blur-xl transition-all duration-1000 animate-gradient-x
              ${"player1" === $.currentPlayer ? "bg-gradient-to-r from-rose-900/40 via-pink-900/30 to-rose-900/40 border-rose-500/30 shadow-[0_0_40px_rgba(244,63,94,0.15)]" : "bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-blue-900/40 border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.15)]"}
           `,
                      children: [
                        (0, t.jsx)("div", { className: "absolute inset-0 pointer-events-none rounded-[2rem] border border-white/5 opacity-50" }),
                        (0, t.jsx)("div", {
                          className: `absolute inset-0 pointer-events-none rounded-[2rem] transition-all duration-1000 opacity-50
                  ${"player1" === $.currentPlayer ? "bg-rose-500/10" : "bg-blue-500/10"} animate-pulse-slow`,
                        }),
                        $.board.map((e, r) =>
                          (0, t.jsx)(S, { piece: e, isSelected: $.selectedIndex === r, isForbidden: r === d, onClick: () => eF(r), disabled: !!$.winner }, `${r}-${e?.id || "empty"}`),
                        ),
                      ],
                    }),
                  }),
                  (0, t.jsx)("div", {
                    className: "order-1 w-full shrink darkbeast-panel-right",
                    children: (0, t.jsx)(N, {
                      t: n,
                      player: "player2",
                      isActive: "player2" === $.currentPlayer,
                      lostPieces: $.player2Lost,
                      label: n("players.player2"),
                      penaltyLabel: n("penaltyHistory"),
                      getPenaltyContent: eA,
                    }),
                  }),
                  (0, t.jsx)("div", {
                    className: "order-4 w-full darkbeast-log",
                    children: (0, t.jsx)("div", {
                      className: "mt-4 sm:mt-8 w-full max-w-md rounded-xl border border-white/10 bg-black/60 p-4 shadow-inner mx-auto",
                      children: (0, t.jsx)("div", {
                        className: "flex flex-col-reverse h-20 overflow-y-auto custom-scrollbar space-y-1 space-y-reverse",
                        children: $.gameLog.map((e, r) =>
                          (0, t.jsxs)(
                            "div",
                            {
                              className: `flex items-center gap-3 text-xs font-mono py-1 border-b border-white/5 last:border-0 ${0 === r ? "text-white font-bold" : "text-white/40"}`,
                              children: [(0, t.jsx)("span", { className: "size-1.5 rounded-full bg-current opacity-50" }), (0, t.jsx)("span", { children: e })],
                            },
                            r,
                          ),
                        ),
                      }),
                    }),
                  }),
                ],
              }),
              (0, t.jsxs)("div", {
                className: "mt-4 flex flex-wrap justify-center gap-4 px-4",
                children: [
                  (0, t.jsxs)("button", {
                    onClick: () => document.getElementById("instructions")?.scrollIntoView({ behavior: "smooth" }),
                    className: "cursor-pointer group relative flex items-center gap-3 rounded-full bg-white/5 px-8 py-3 transition-all hover:bg-white/10 hover:scale-105 active:scale-95",
                    children: [
                      (0, t.jsx)("div", { className: "absolute inset-0 rounded-full border border-white/10 group-hover:border-white/30 transition-colors" }),
                      (0, t.jsx)("div", {
                        className: "absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-rose-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity",
                      }),
                      (0, t.jsx)("span", { className: "text-xl", children: "❓" }),
                      (0, t.jsx)("span", { className: "text-sm font-bold uppercase tracking-widest text-white/80 group-hover:text-white", children: n("howToPlay") }),
                    ],
                  }),
                  (!X || Z) &&
                    (0, t.jsxs)("button", {
                      onClick: () => A(!0),
                      className: "cursor-pointer group relative flex items-center gap-3 rounded-full bg-white/5 px-8 py-3 transition-all hover:bg-white/10 hover:scale-105 active:scale-95",
                      children: [
                        (0, t.jsx)("div", { className: "absolute inset-0 rounded-full border border-white/10 group-hover:border-white/30 transition-colors" }),
                        (0, t.jsx)("div", {
                          className: "absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-rose-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity",
                        }),
                        (0, t.jsx)("span", { className: "text-xl", children: "⚙️" }),
                        (0, t.jsx)("span", { className: "text-sm font-bold uppercase tracking-widest text-white/80 group-hover:text-white", children: n("settings") }),
                      ],
                    }),
                  (!X || Z) &&
                    (0, t.jsxs)("button", {
                      onClick: eO,
                      className: "cursor-pointer group relative flex items-center gap-3 rounded-full bg-white/5 px-8 py-3 transition-all hover:bg-white/10 hover:scale-105 active:scale-95",
                      children: [
                        (0, t.jsx)("div", { className: "absolute inset-0 rounded-full border border-white/10 group-hover:border-white/30 transition-colors" }),
                        (0, t.jsx)("div", {
                          className: "absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-rose-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity",
                        }),
                        (0, t.jsx)("span", { className: "text-xl", children: "↻" }),
                        (0, t.jsx)("span", { className: "text-sm font-bold uppercase tracking-widest text-white/80 group-hover:text-white", children: n("restart") }),
                      ],
                    }),
                ],
              }),
              z &&
                (0, a.createPortal)(
                  (0, t.jsx)("div", {
                    className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200",
                    children: (0, t.jsxs)("div", {
                      className: "w-full max-w-lg rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl flex flex-col max-h-[90vh]",
                      children: [
                        (0, t.jsxs)("div", {
                          className: "flex items-center justify-between mb-6",
                          children: [
                            (0, t.jsx)("h3", { className: "text-xl font-black uppercase tracking-widest text-white", children: n("settings") }),
                            (0, t.jsx)("button", { onClick: () => A(!1), className: "cursor-pointer text-white/50 hover:text-white", children: "✕" }),
                          ],
                        }),
                        (0, t.jsxs)("div", {
                          className: "flex-1 overflow-y-auto custom-scrollbar pr-2",
                          children: [
                            (0, t.jsxs)("div", {
                              className: "space-y-3 mb-6",
                              children: [
                                (0, t.jsxs)("div", {
                                  className: "flex items-center justify-between rounded-xl bg-white/5 p-4",
                                  children: [
                                    (0, t.jsx)("span", { className: "font-bold text-white/80", children: n("rules.diagonalLeopard") }),
                                    (0, t.jsx)("button", {
                                      onClick: () => B(!F),
                                      className: `cursor-pointer h-6 w-11 rounded-full transition-colors ${F ? "bg-rose-500" : "bg-white/20"}`,
                                      children: (0, t.jsx)("div", { className: `h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${F ? "translate-x-6" : "translate-x-1"}` }),
                                    }),
                                  ],
                                }),
                                (0, t.jsxs)("div", {
                                  className: "flex items-center justify-between rounded-xl bg-white/5 p-4",
                                  children: [
                                    (0, t.jsx)("span", { className: "font-bold text-white/80", children: n("rules.onlyCatEatsRat") }),
                                    (0, t.jsx)("button", {
                                      onClick: () => Y(!J),
                                      className: `cursor-pointer h-6 w-11 rounded-full transition-colors ${J ? "bg-rose-500" : "bg-white/20"}`,
                                      children: (0, t.jsx)("div", { className: `h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${J ? "translate-x-6" : "translate-x-1"}` }),
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            (0, t.jsxs)("div", {
                              className: "pt-4 border-t border-white/10",
                              children: [
                                (0, t.jsxs)("div", {
                                  className: "flex items-center justify-between mb-4",
                                  children: [
                                    (0, t.jsxs)("div", {
                                      children: [
                                        (0, t.jsx)("h4", { className: "font-bold text-white", children: n("penalties.title") }),
                                        (0, t.jsx)("p", { className: "text-xs text-white/40", children: n("penalties.desc") }),
                                      ],
                                    }),
                                    (0, t.jsx)("button", {
                                      onClick: () => {
                                        let e = {},
                                          t = {};
                                        (g.forEach((r) => {
                                          ((e[r.rank] = n(`defaultPenaltiesP1.${r.rank}`)), (t[r.rank] = n(`defaultPenaltiesP2.${r.rank}`)));
                                        }),
                                          H({ player1: e, player2: t }),
                                          W({ player1: n("defaultRewardP1"), player2: n("defaultRewardP2") }));
                                      },
                                      className: "cursor-pointer text-xs text-rose-400 hover:text-rose-300 hover:underline",
                                      children: n("penalties.reset"),
                                    }),
                                  ],
                                }),
                                (0, t.jsxs)("div", {
                                  className: "flex mb-4 bg-white/5 rounded-lg p-1",
                                  children: [
                                    (0, t.jsx)("button", {
                                      onClick: () => K("player1"),
                                      className: `cursor-pointer flex-1 py-2 rounded-md text-sm font-bold transition-all ${"player1" === D ? "bg-rose-500 text-white shadow-lg" : "text-white/50 hover:text-white"}`,
                                      children: n("penalties.player1"),
                                    }),
                                    (0, t.jsx)("button", {
                                      onClick: () => K("player2"),
                                      className: `cursor-pointer flex-1 py-2 rounded-md text-sm font-bold transition-all ${"player2" === D ? "bg-blue-500 text-white shadow-lg" : "text-white/50 hover:text-white"}`,
                                      children: n("penalties.player2"),
                                    }),
                                  ],
                                }),
                                (0, t.jsxs)("div", {
                                  className: "mb-4 rounded-lg bg-white/5 p-3 border border-white/10",
                                  children: [
                                    (0, t.jsx)("label", { className: "text-xs font-bold uppercase text-white/50 block mb-1", children: n("winReward") }),
                                    (0, t.jsx)("textarea", {
                                      value: U[D],
                                      onChange: (e) => W((t) => ({ ...t, [D]: e.target.value })),
                                      className:
                                        "w-full bg-black/20 rounded-lg p-2 text-sm font-bold text-white focus:outline-none border border-transparent focus:border-white/30 placeholder-white/10 transition-colors resize-none",
                                      placeholder: n("rewardPlaceholder"),
                                      rows: 2,
                                    }),
                                  ],
                                }),
                                (0, t.jsx)("div", {
                                  className: "grid grid-cols-1 gap-3",
                                  children: g.map((e) =>
                                    (0, t.jsxs)(
                                      "div",
                                      {
                                        className: "flex items-center gap-3 rounded-lg bg-white/5 p-2",
                                        children: [
                                          (0, t.jsx)("div", { className: "flex h-8 w-8 items-center justify-center rounded bg-black/40 text-lg border border-white/10", children: e.icon }),
                                          (0, t.jsxs)("div", {
                                            className: "flex-1",
                                            children: [
                                              (0, t.jsx)("label", { className: "text-[10px] font-bold uppercase text-white/30 block mb-1", children: ez(e.rank) }),
                                              (0, t.jsx)("input", {
                                                type: "text",
                                                value: G[D][e.rank] || "",
                                                onChange: (t) => H((r) => ({ ...r, [D]: { ...r[D], [e.rank]: t.target.value } })),
                                                className:
                                                  "w-full bg-transparent text-sm font-bold text-white focus:outline-none border-b border-transparent focus:border-white/30 placeholder-white/10 transition-colors",
                                                placeholder: n("penalties.placeholder"),
                                              }),
                                            ],
                                          }),
                                        ],
                                      },
                                      e.rank,
                                    ),
                                  ),
                                }),
                              ],
                            }),
                          ],
                        }),
                        (0, t.jsx)("div", {
                          className: "mt-6 flex justify-end",
                          children: (0, t.jsx)("button", {
                            onClick: () => A(!1),
                            className: "cursor-pointer rounded-lg bg-white px-6 py-2 text-sm font-bold text-black hover:bg-gray-200",
                            children: n("close"),
                          }),
                        }),
                      ],
                    }),
                  }),
                  document.body,
                ),
              _ &&
                (0, a.createPortal)(
                  (0, t.jsx)("div", {
                    className: "fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-2xl animate-in fade-in duration-300",
                    children:
                      ((l = (r = "player1" === _.player) ? "border-rose-500/30" : "border-blue-500/30"),
                      (s = r ? "bg-rose-500/10" : "bg-blue-500/10"),
                      (o = r ? "text-rose-400" : "text-blue-400"),
                      (i = !X || et === _.player),
                      (0, t.jsxs)("div", {
                        className: `relative w-full max-w-md overflow-hidden rounded-[2rem] border ${l} bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-8 text-center ${r ? "shadow-[0_0_60px_rgba(244,63,94,0.2)]" : "shadow-[0_0_60px_rgba(59,130,246,0.2)]"}`,
                        children: [
                          (0, t.jsx)("div", {
                            className: "pointer-events-none absolute inset-0 z-0",
                            children: (0, t.jsx)("div", { className: `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${s} blur-[100px] rounded-full` }),
                          }),
                          (0, t.jsxs)("div", {
                            className: "relative z-10 flex flex-col items-center",
                            children: [
                              (0, t.jsx)("div", { className: `mb-6 flex size-20 items-center justify-center rounded-full ${s} text-4xl animate-bounce border ${l} shadow-lg`, children: "🚨" }),
                              (0, t.jsx)("h2", { className: `text-2xl font-black uppercase tracking-tight ${o} mb-2 drop-shadow-lg`, children: n("penaltyTitle") }),
                              (0, t.jsx)("p", { className: "text-white/80 mb-2", children: n("penaltyMessage", { player: n(`players.${_.player}`), beast: ez(_.beastRank) }) }),
                              (0, t.jsx)("div", {
                                className: `mb-6 px-6 py-3 rounded-full ${s} border-2 ${l} backdrop-blur-md`,
                                children: (0, t.jsx)("p", { className: `text-2xl font-black ${o} animate-pulse drop-shadow-lg`, children: n(`players.${_.player}`) }),
                              }),
                              (0, t.jsxs)("div", {
                                className: "w-full rounded-xl bg-white/5 p-6 border border-white/10 backdrop-blur-md mb-8 transform rotate-1",
                                children: [
                                  (0, t.jsx)("p", { className: "text-sm text-white/40 uppercase tracking-widest mb-2", children: n("actionRequired") }),
                                  (0, t.jsx)("p", { className: "text-xl font-bold text-white animate-pulse", children: n("removeAction", { penalty: eA(_.beastRank, _.player) }) }),
                                ],
                              }),
                              (0, t.jsx)("button", {
                                onClick: () => {
                                  i && (X && !Z ? u.multiplayerClient.sendGameAction({ type: "DB_ACK_PENALTY", player: _.player, penaltyKey: _.penaltyKey }) : E(null));
                                },
                                disabled: !i,
                                className: `w-full rounded-xl bg-gradient-to-r ${r ? "from-rose-600 to-pink-600" : "from-blue-600 to-cyan-600"} py-4 text-sm font-black uppercase tracking-widest text-white transition shadow-lg ${r ? "hover:shadow-rose-500/30" : "hover:shadow-blue-500/30"} ${i ? "cursor-pointer hover:scale-[1.02]" : "opacity-50 cursor-not-allowed"}`,
                                children: n("confirmPenalty"),
                              }),
                            ],
                          }),
                        ],
                      })),
                  }),
                  document.body,
                ),
              $.winner &&
                !_ &&
                (0, a.createPortal)(
                  (0, t.jsxs)("div", {
                    className: "fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl animate-in fade-in duration-500",
                    children: [
                      (0, t.jsx)(j, {}),
                      (0, t.jsxs)("div", {
                        className: "relative w-full max-w-lg overflow-hidden rounded-[3rem] border border-white/10 bg-[#0f0f0f] p-10 text-center shadow-[0_0_100px_rgba(234,179,8,0.2)]",
                        children: [
                          (0, t.jsx)("div", {
                            className: "absolute top-0 left-1/2 -translate-x-1/2 h-64 w-64 bg-gradient-to-b from-yellow-500/20 to-transparent blur-[80px] rounded-full pointer-events-none",
                          }),
                          (0, t.jsxs)("div", {
                            className: "relative z-10 flex flex-col items-center",
                            children: [
                              (0, t.jsx)("div", {
                                className: "mb-6 flex size-28 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 text-6xl shadow-lg animate-bounce",
                                children: "🏆",
                              }),
                              (0, t.jsx)("h2", { className: "text-4xl font-black uppercase tracking-tighter text-white mb-2 drop-shadow-lg", children: n("win", { player: "" }).replace("!", "") }),
                              (0, t.jsx)("div", {
                                className: `mb-4 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${"player1" === $.winner ? "from-rose-400 to-red-600" : "from-blue-400 to-indigo-600"}`,
                                children: n(`players.${$.winner}`),
                              }),
                              (0, t.jsxs)("div", {
                                className: "mb-8 w-full rounded-xl bg-white/5 p-4 border border-white/10 backdrop-blur-md transform rotate-1",
                                children: [
                                  (0, t.jsx)("p", { className: "text-xs text-white/40 uppercase tracking-widest mb-2", children: n("winReward") }),
                                  (0, t.jsx)("p", { className: "text-lg font-bold text-white animate-pulse", children: U[$.winner] }),
                                ],
                              }),
                              (!X || Z) &&
                                (0, t.jsx)("button", {
                                  onClick: eO,
                                  className: "w-full rounded-xl bg-white py-4 text-sm font-black uppercase tracking-widest text-black transition hover:bg-gray-200 hover:scale-[1.02] shadow-lg",
                                  children: n("restart"),
                                }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  document.body,
                ),
            ],
          }),
        });
      } else e = (0, t.jsx)("div", { className: "flex h-96 items-center justify-center text-white/40 animate-pulse", children: n("loading") });
      return (0, t.jsxs)(t.Fragment, {
        children: [
          e,
          (0, t.jsx)(d.MultiplayerControl, {
            translationsNamespace: "games.darkBeast.multiplayer",
            isMultiplayer: X,
            gameType: "dark-beast",
            initialJoinId: x,
            onToggleMode: q,
            onRoomJoined: () => {},
            onLeaveRoom: eR,
            onAuthSubmit: eE,
            onColorSelected: (e) => {
              es && u.multiplayerClient.selectColor(e);
            },
            onSetMyColor: (e) => er(e),
            availableColors: w,
            currentPlayerColor: et,
            roomId: V,
            players: ea,
            getPlayerDisplayName: eP,
            getPlayerDotClass: e_,
            isHost: Z,
            gameStarted: eo,
            onStartGame: eM,
            isReconnecting: ed,
            hasJoinParam: k,
          }),
          (0, t.jsx)(c.MultiplayerOverlay, { visible: !ed && X && !!V && !eo, message: Z ? m("status.waitingForPlayers") : m("status.waitingForHost"), subtitle: m("overlay.waiting"), onCancel: eR }),
          (0, t.jsx)(c.MultiplayerOverlay, { visible: ed, message: m("status.reconnecting"), onCancel: eR }),
        ],
      });
    }
    let N = ({ t: e, player: r, isActive: a, lostPieces: l, label: s, penaltyLabel: n, getPenaltyContent: o }) => {
        let i = "player1" === r,
          d = i ? "text-rose-400" : "text-blue-400",
          c = i ? "border-rose-500/30" : "border-blue-500/30";
        return (0, t.jsxs)("div", {
          className: `darkbeast-player-panel relative flex flex-row items-center p-2 sm:flex-col sm:items-stretch sm:p-6 rounded-[2rem] border bg-black/20 transition-all duration-700 ${a ? `border-white/20 ${i ? "bg-rose-900/5" : "bg-blue-900/5"} scale-100 sm:scale-105 opacity-100` : "border-white/5 opacity-50 scale-95"}`,
          children: [
            a && (0, t.jsx)("div", { className: `absolute -inset-px rounded-[2rem] border opacity-50 animate-pulse pointer-events-none ${c}` }),
            (0, t.jsxs)("div", {
              className: "darkbeast-player-header flex flex-col items-center mr-2 sm:mr-0 shrink-0 sm:w-full",
              children: [
                (0, t.jsxs)("div", {
                  className: "flex items-center justify-between w-full mb-1 sm:mb-6",
                  children: [
                    (0, t.jsx)("div", { className: `size-3 rounded-full ${a ? "bg-green-400 shadow-[0_0_10px_#4ade80]" : "bg-white/10"}` }),
                    (0, t.jsx)("span", {
                      className: `hidden sm:block text-[10px] font-bold uppercase tracking-widest ${a ? "text-white" : "text-white/20"}`,
                      children: a ? e("status.active") : e("status.waiting"),
                    }),
                  ],
                }),
                (0, t.jsxs)("div", {
                  className: "relative flex flex-col items-center",
                  children: [
                    a &&
                      (0, t.jsxs)("div", {
                        className: "absolute -top-8 sm:-top-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none",
                        children: [
                          (0, t.jsx)("div", {
                            className: `text-2xl sm:text-4xl ${i ? "text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]" : "text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]"} animate-bounce`,
                            children: "▼",
                          }),
                          (0, t.jsx)("div", { className: `w-6 h-1.5 rounded-full blur-md -mt-1 sm:-mt-2 ${i ? "bg-rose-500" : "bg-blue-500"} animate-pulse` }),
                        ],
                      }),
                    (0, t.jsxs)("div", {
                      className: `mb-1 sm:mb-4 flex size-12 sm:size-16 items-center justify-center rounded-full border-2 bg-gradient-to-br from-white/5 to-white/0 text-xl sm:text-2xl shadow-2xl relative z-10 ${a ? c : "border-white/5"}`,
                      children: [
                        i ? "🔥" : "❄️",
                        a && (0, t.jsx)("div", { className: `absolute -inset-2 rounded-full border ${i ? "border-rose-500/50" : "border-blue-500/50"} animate-ping opacity-20` }),
                      ],
                    }),
                    (0, t.jsx)("h3", { className: `text-xs sm:text-lg font-black uppercase tracking-widest ${d} text-center`, children: s }),
                  ],
                }),
              ],
            }),
            (0, t.jsxs)("div", {
              className: "mt-0 w-full overflow-hidden",
              children: [
                (0, t.jsxs)("div", {
                  className: "flex justify-between items-end mb-1 sm:mb-3 border-b border-white/5 pb-1 sm:pb-2",
                  children: [
                    (0, t.jsx)("span", { className: "text-[8px] sm:text-[10px] font-bold uppercase text-white/30 tracking-widest whitespace-nowrap", children: n }),
                    (0, t.jsxs)("span", {
                      className: `text-base sm:text-xl font-black ${d} ml-2`,
                      children: [l.length, (0, t.jsx)("span", { className: "text-xs sm:text-sm text-white/20 font-normal", children: "/8" })],
                    }),
                  ],
                }),
                (0, t.jsx)("div", {
                  className: "darkbeast-penalty-list flex flex-row sm:flex-col gap-1 sm:gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[240px] custom-scrollbar pb-1 sm:pb-0 sm:pr-1",
                  children: g.map((a) => {
                    let s = l.includes(a.rank);
                    return (0, t.jsxs)(
                      "div",
                      {
                        className: `flex shrink-0 items-center gap-1 sm:gap-3 rounded-lg p-1 sm:p-2 transition-all border border-transparent ${s ? "bg-white/5 opacity-50 grayscale border-white/5" : "bg-white/10"}`,
                        children: [
                          (0, t.jsx)("span", { className: "text-base sm:text-lg", children: a.icon }),
                          (0, t.jsx)("div", {
                            className: "flex flex-col leading-none",
                            children: (0, t.jsx)("span", {
                              className: `text-[8px] sm:text-[10px] font-bold uppercase tracking-wide whitespace-nowrap ${s ? "text-white/30 line-through" : "text-white/80"}`,
                              children: o(a.rank, r),
                            }),
                          }),
                          s && (0, t.jsx)("span", { className: "ml-1 sm:ml-2 text-[8px] sm:text-xs text-rose-500 font-bold", children: e("lost") }),
                        ],
                      },
                      a.rank,
                    );
                  }),
                }),
              ],
            }),
          ],
        });
      },
      S = ({ piece: e, isSelected: r, isForbidden: a, onClick: l, disabled: s }) =>
        (0, t.jsxs)("button", {
          onClick: l,
          disabled: s,
          className: "relative w-full aspect-square perspective-1000 cursor-pointer group outline-none",
          children: [
            (0, t.jsxs)("div", {
              className: `relative h-full w-full duration-700 transform-style-preserve-3d transition-transform ${e?.isRevealed ? "rotate-y-180" : ""}`,
              children: [
                (0, t.jsxs)("div", {
                  className: `absolute inset-0 backface-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-black shadow-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-white/30 ${e && !e.isRevealed ? "opacity-100" : "opacity-0"}`,
                  children: [
                    (0, t.jsx)("div", { className: "absolute inset-1.5 sm:inset-2 rounded-lg sm:rounded-xl border border-white/5 bg-[url('/noise.png')] opacity-50" }),
                    (0, t.jsx)("div", {
                      className: "absolute inset-0 flex items-center justify-center",
                      children: (0, t.jsx)("div", {
                        className: "size-8 sm:size-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm",
                        children: (0, t.jsx)("span", { className: "text-white/50 text-xl font-bold", children: "?" }),
                      }),
                    }),
                    (0, t.jsx)("div", { className: "absolute inset-0 rounded-xl sm:rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" }),
                  ],
                }),
                (0, t.jsx)("div", {
                  className: `absolute inset-0 backface-hidden rounded-xl sm:rounded-2xl rotate-y-180 overflow-hidden shadow-2xl transition-all duration-300 ${r ? "ring-2 ring-yellow-400 scale-105 z-10 shadow-[0_0_30px_rgba(250,204,21,0.3)]" : "border border-white/10"} ${e ? "bg-gray-900" : "bg-transparent border-none shadow-none"}`,
                  children:
                    e &&
                    (0, t.jsxs)("div", {
                      className: `relative h-full w-full flex flex-col items-center justify-center bg-gradient-to-br ${"player1" === e.owner ? "from-rose-900/80 to-black" : "from-blue-900/80 to-black"}`,
                      children: [
                        (0, t.jsx)("div", { className: "absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none" }),
                        (0, t.jsx)("span", { className: "text-3xl sm:text-4xl drop-shadow-md z-10 transform transition-transform group-hover:scale-110", children: g[e.rank].icon }),
                        (0, t.jsx)("div", {
                          className: `absolute top-1 right-1 size-5 sm:size-6 rounded-full flex items-center justify-center text-[8px] sm:text-[10px] font-bold border bg-black/60 backdrop-blur-md z-20 ${"player1" === e.owner ? "border-rose-500/50 text-rose-400" : "border-blue-500/50 text-blue-400"}`,
                          children: e.rank,
                        }),
                        (0, t.jsx)("div", {
                          className: `absolute bottom-0 left-0 right-0 h-1 ${"player1" === e.owner ? "bg-rose-500 shadow-[0_0_10px_#f43f5e]" : "bg-blue-500 shadow-[0_0_10px_#3b82f6]"}`,
                        }),
                      ],
                    }),
                }),
              ],
            }),
            !e && r && (0, t.jsx)("div", { className: "absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-dashed border-white/20 animate-pulse" }),
            a && (0, t.jsx)("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl", children: "🚫" }),
          ],
        });
    e.s(["DarkBeastGame", () => k], 87711);
  },
  14470,
  (e) => {
    e.n(e.i(87711));
  },
]);
