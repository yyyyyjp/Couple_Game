(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  16015,
  (e, t, r) => {},
  98547,
  (e, t, r) => {
    var s = e.i(47167);
    e.r(16015);
    var o = e.r(71645),
      n = o && "object" == typeof o && "default" in o ? o : { default: o },
      i = void 0 !== s.default && s.default.env && !0,
      l = function (e) {
        return "[object String]" === Object.prototype.toString.call(e);
      },
      a = (function () {
        function e(e) {
          var t = void 0 === e ? {} : e,
            r = t.name,
            s = void 0 === r ? "stylesheet" : r,
            o = t.optimizeForSpeed,
            n = void 0 === o ? i : o;
          (c(l(s), "`name` must be a string"),
            (this._name = s),
            (this._deletedRulePlaceholder = "#" + s + "-deleted-rule____{}"),
            c("boolean" == typeof n, "`optimizeForSpeed` must be a boolean"),
            (this._optimizeForSpeed = n),
            (this._serverSheet = void 0),
            (this._tags = []),
            (this._injected = !1),
            (this._rulesCount = 0));
          var a = "undefined" != typeof window && document.querySelector('meta[property="csp-nonce"]');
          this._nonce = a ? a.getAttribute("content") : null;
        }
        var t,
          r = e.prototype;
        return (
          (r.setOptimizeForSpeed = function (e) {
            (c("boolean" == typeof e, "`setOptimizeForSpeed` accepts a boolean"),
              c(0 === this._rulesCount, "optimizeForSpeed cannot be when rules have already been inserted"),
              this.flush(),
              (this._optimizeForSpeed = e),
              this.inject());
          }),
          (r.isOptimizeForSpeed = function () {
            return this._optimizeForSpeed;
          }),
          (r.inject = function () {
            var e = this;
            if ((c(!this._injected, "sheet already injected"), (this._injected = !0), "undefined" != typeof window && this._optimizeForSpeed)) {
              ((this._tags[0] = this.makeStyleTag(this._name)),
                (this._optimizeForSpeed = "insertRule" in this.getSheet()),
                this._optimizeForSpeed || (i || console.warn("StyleSheet: optimizeForSpeed mode not supported falling back to standard mode."), this.flush(), (this._injected = !0)));
              return;
            }
            this._serverSheet = {
              cssRules: [],
              insertRule: function (t, r) {
                return ("number" == typeof r ? (e._serverSheet.cssRules[r] = { cssText: t }) : e._serverSheet.cssRules.push({ cssText: t }), r);
              },
              deleteRule: function (t) {
                e._serverSheet.cssRules[t] = null;
              },
            };
          }),
          (r.getSheetForTag = function (e) {
            if (e.sheet) return e.sheet;
            for (var t = 0; t < document.styleSheets.length; t++) if (document.styleSheets[t].ownerNode === e) return document.styleSheets[t];
          }),
          (r.getSheet = function () {
            return this.getSheetForTag(this._tags[this._tags.length - 1]);
          }),
          (r.insertRule = function (e, t) {
            if ((c(l(e), "`insertRule` accepts only strings"), "undefined" == typeof window))
              return ("number" != typeof t && (t = this._serverSheet.cssRules.length), this._serverSheet.insertRule(e, t), this._rulesCount++);
            if (this._optimizeForSpeed) {
              var r = this.getSheet();
              "number" != typeof t && (t = r.cssRules.length);
              try {
                r.insertRule(e, t);
              } catch (t) {
                return (i || console.warn("StyleSheet: illegal rule: \n\n" + e + "\n\nSee https://stackoverflow.com/q/20007992 for more info"), -1);
              }
            } else {
              var s = this._tags[t];
              this._tags.push(this.makeStyleTag(this._name, e, s));
            }
            return this._rulesCount++;
          }),
          (r.replaceRule = function (e, t) {
            if (this._optimizeForSpeed || "undefined" == typeof window) {
              var r = "undefined" != typeof window ? this.getSheet() : this._serverSheet;
              if ((t.trim() || (t = this._deletedRulePlaceholder), !r.cssRules[e])) return e;
              r.deleteRule(e);
              try {
                r.insertRule(t, e);
              } catch (s) {
                (i || console.warn("StyleSheet: illegal rule: \n\n" + t + "\n\nSee https://stackoverflow.com/q/20007992 for more info"), r.insertRule(this._deletedRulePlaceholder, e));
              }
            } else {
              var s = this._tags[e];
              (c(s, "old rule at index `" + e + "` not found"), (s.textContent = t));
            }
            return e;
          }),
          (r.deleteRule = function (e) {
            if ("undefined" == typeof window) return void this._serverSheet.deleteRule(e);
            if (this._optimizeForSpeed) this.replaceRule(e, "");
            else {
              var t = this._tags[e];
              (c(t, "rule at index `" + e + "` not found"), t.parentNode.removeChild(t), (this._tags[e] = null));
            }
          }),
          (r.flush = function () {
            ((this._injected = !1),
              (this._rulesCount = 0),
              "undefined" != typeof window
                ? (this._tags.forEach(function (e) {
                    return e && e.parentNode.removeChild(e);
                  }),
                  (this._tags = []))
                : (this._serverSheet.cssRules = []));
          }),
          (r.cssRules = function () {
            var e = this;
            return "undefined" == typeof window
              ? this._serverSheet.cssRules
              : this._tags.reduce(function (t, r) {
                  return (
                    r
                      ? (t = t.concat(
                          Array.prototype.map.call(e.getSheetForTag(r).cssRules, function (t) {
                            return t.cssText === e._deletedRulePlaceholder ? null : t;
                          }),
                        ))
                      : t.push(null),
                    t
                  );
                }, []);
          }),
          (r.makeStyleTag = function (e, t, r) {
            t && c(l(t), "makeStyleTag accepts only strings as second parameter");
            var s = document.createElement("style");
            (this._nonce && s.setAttribute("nonce", this._nonce), (s.type = "text/css"), s.setAttribute("data-" + e, ""), t && s.appendChild(document.createTextNode(t)));
            var o = document.head || document.getElementsByTagName("head")[0];
            return (r ? o.insertBefore(s, r) : o.appendChild(s), s);
          }),
          (t = [
            {
              key: "length",
              get: function () {
                return this._rulesCount;
              },
            },
          ]),
          (function (e, t) {
            for (var r = 0; r < t.length; r++) {
              var s = t[r];
              ((s.enumerable = s.enumerable || !1), (s.configurable = !0), "value" in s && (s.writable = !0), Object.defineProperty(e, s.key, s));
            }
          })(e.prototype, t),
          e
        );
      })();
    function c(e, t) {
      if (!e) throw Error("StyleSheet: " + t + ".");
    }
    var d = function (e) {
        for (var t = 5381, r = e.length; r;) t = (33 * t) ^ e.charCodeAt(--r);
        return t >>> 0;
      },
      u = {};
    function h(e, t) {
      if (!t) return "jsx-" + e;
      var r = String(t),
        s = e + r;
      return (u[s] || (u[s] = "jsx-" + d(e + "-" + r)), u[s]);
    }
    function m(e, t) {
      "undefined" == typeof window && (t = t.replace(/\/style/gi, "\\/style"));
      var r = e + t;
      return (u[r] || (u[r] = t.replace(/__jsx-style-dynamic-selector/g, e)), u[r]);
    }
    var p = (function () {
        function e(e) {
          var t = void 0 === e ? {} : e,
            r = t.styleSheet,
            s = void 0 === r ? null : r,
            o = t.optimizeForSpeed,
            n = void 0 !== o && o;
          ((this._sheet = s || new a({ name: "styled-jsx", optimizeForSpeed: n })),
            this._sheet.inject(),
            s && "boolean" == typeof n && (this._sheet.setOptimizeForSpeed(n), (this._optimizeForSpeed = this._sheet.isOptimizeForSpeed())),
            (this._fromServer = void 0),
            (this._indices = {}),
            (this._instancesCounts = {}));
        }
        var t = e.prototype;
        return (
          (t.add = function (e) {
            var t = this;
            (void 0 === this._optimizeForSpeed &&
              ((this._optimizeForSpeed = Array.isArray(e.children)), this._sheet.setOptimizeForSpeed(this._optimizeForSpeed), (this._optimizeForSpeed = this._sheet.isOptimizeForSpeed())),
              "undefined" == typeof window ||
                this._fromServer ||
                ((this._fromServer = this.selectFromServer()),
                (this._instancesCounts = Object.keys(this._fromServer).reduce(function (e, t) {
                  return ((e[t] = 0), e);
                }, {}))));
            var r = this.getIdAndRules(e),
              s = r.styleId,
              o = r.rules;
            if (s in this._instancesCounts) {
              this._instancesCounts[s] += 1;
              return;
            }
            var n = o
              .map(function (e) {
                return t._sheet.insertRule(e);
              })
              .filter(function (e) {
                return -1 !== e;
              });
            ((this._indices[s] = n), (this._instancesCounts[s] = 1));
          }),
          (t.remove = function (e) {
            var t = this,
              r = this.getIdAndRules(e).styleId;
            if (
              ((function (e, t) {
                if (!e) throw Error("StyleSheetRegistry: " + t + ".");
              })(r in this._instancesCounts, "styleId: `" + r + "` not found"),
              (this._instancesCounts[r] -= 1),
              this._instancesCounts[r] < 1)
            ) {
              var s = this._fromServer && this._fromServer[r];
              (s
                ? (s.parentNode.removeChild(s), delete this._fromServer[r])
                : (this._indices[r].forEach(function (e) {
                    return t._sheet.deleteRule(e);
                  }),
                  delete this._indices[r]),
                delete this._instancesCounts[r]);
            }
          }),
          (t.update = function (e, t) {
            (this.add(t), this.remove(e));
          }),
          (t.flush = function () {
            (this._sheet.flush(), this._sheet.inject(), (this._fromServer = void 0), (this._indices = {}), (this._instancesCounts = {}));
          }),
          (t.cssRules = function () {
            var e = this,
              t = this._fromServer
                ? Object.keys(this._fromServer).map(function (t) {
                    return [t, e._fromServer[t]];
                  })
                : [],
              r = this._sheet.cssRules();
            return t.concat(
              Object.keys(this._indices)
                .map(function (t) {
                  return [
                    t,
                    e._indices[t]
                      .map(function (e) {
                        return r[e].cssText;
                      })
                      .join(e._optimizeForSpeed ? "" : "\n"),
                  ];
                })
                .filter(function (e) {
                  return !!e[1];
                }),
            );
          }),
          (t.styles = function (e) {
            var t, r;
            return (
              (t = this.cssRules()),
              void 0 === (r = e) && (r = {}),
              t.map(function (e) {
                var t = e[0],
                  s = e[1];
                return n.default.createElement("style", { id: "__" + t, key: "__" + t, nonce: r.nonce ? r.nonce : void 0, dangerouslySetInnerHTML: { __html: s } });
              })
            );
          }),
          (t.getIdAndRules = function (e) {
            var t = e.children,
              r = e.dynamic,
              s = e.id;
            if (r) {
              var o = h(s, r);
              return {
                styleId: o,
                rules: Array.isArray(t)
                  ? t.map(function (e) {
                      return m(o, e);
                    })
                  : [m(o, t)],
              };
            }
            return { styleId: h(s), rules: Array.isArray(t) ? t : [t] };
          }),
          (t.selectFromServer = function () {
            return Array.prototype.slice.call(document.querySelectorAll('[id^="__jsx-"]')).reduce(function (e, t) {
              return ((e[t.id.slice(2)] = t), e);
            }, {});
          }),
          e
        );
      })(),
      f = o.createContext(null);
    function x() {
      return new p();
    }
    function w() {
      return o.useContext(f);
    }
    f.displayName = "StyleSheetContext";
    var b = n.default.useInsertionEffect || n.default.useLayoutEffect,
      g = "undefined" != typeof window ? x() : void 0;
    function y(e) {
      var t = g || w();
      return (
        t &&
          ("undefined" == typeof window
            ? t.add(e)
            : b(
                function () {
                  return (
                    t.add(e),
                    function () {
                      t.remove(e);
                    }
                  );
                },
                [e.id, String(e.dynamic)],
              )),
        null
      );
    }
    ((y.dynamic = function (e) {
      return e
        .map(function (e) {
          return h(e[0], e[1]);
        })
        .join(" ");
    }),
      (r.StyleRegistry = function (e) {
        var t = e.registry,
          r = e.children,
          s = o.useContext(f),
          i = o.useState(function () {
            return s || t || x();
          })[0];
        return n.default.createElement(f.Provider, { value: i }, r);
      }),
      (r.createStyleRegistry = x),
      (r.style = y),
      (r.useStyleRegistry = w));
  },
  37902,
  (e, t, r) => {
    t.exports = e.r(98547).style;
  },
  15972,
  43517,
  26114,
  87974,
  (e) => {
    "use strict";
    var t = e.i(43476),
      r = e.i(71645),
      s = e.i(48148);
    class o {
      ws = null;
      url;
      handlers = new Set();
      isConnected = !1;
      suppressNextCloseEvent = !1;
      connectedRoomId = null;
      constructor(e = "ws://localhost:8080") {
        this.url = e;
      }
      setBaseUrl(e) {
        this.url = e;
      }
      generateId() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
      }
      connect(e) {
        return (
          this.ws && this.disconnect({ silent: !0 }),
          new Promise((t, r) => {
            let s = e ? `${this.url}${this.url.includes("?") ? "&" : "?"}roomId=${e}` : this.url;
            ((this.ws = new WebSocket(s)),
              (this.connectedRoomId = e ?? null),
              (this.ws.onopen = () => {
                ((this.isConnected = !0), console.log("Connected to WebSocket server"), this.notify("CONNECTED", { roomId: e ?? null }), t());
              }),
              (this.ws.onerror = (e) => {
                (console.error("WebSocket error:", e), r(e));
              }),
              (this.ws.onclose = (e) => {
                ((this.isConnected = !1), console.log("Disconnected from WebSocket server"));
                let t = { roomId: this.connectedRoomId, code: e.code, reason: e.reason, wasClean: e.wasClean },
                  r = !this.suppressNextCloseEvent;
                ((this.suppressNextCloseEvent = !1), r && this.notify("DISCONNECTED", t));
              }),
              (this.ws.onmessage = (e) => {
                try {
                  let t = JSON.parse(e.data);
                  this.notify(t.type, t.payload);
                } catch (e) {
                  console.error("Failed to parse message:", e);
                }
              }));
          })
        );
      }
      disconnect(e) {
        this.ws && (e?.silent && (this.suppressNextCloseEvent = !0), this.ws.close(), (this.ws = null));
      }
      subscribe(e) {
        return (
          this.handlers.add(e),
          () => {
            this.handlers.delete(e);
          }
        );
      }
      notify(e, t) {
        this.handlers.forEach((r) => r(e, t));
      }
      send(e, t) {
        this.ws && this.ws.readyState === WebSocket.OPEN ? this.ws.send(JSON.stringify({ type: e, payload: t })) : console.warn("WebSocket is not connected");
      }
      async createRoom(e, t, r) {
        try {
          (await this.connect(), this.send("CREATE_ROOM", { password: e, playerColor: t, gameType: r }));
        } catch (e) {
          throw (console.error("Failed to connect for create room", e), e);
        }
      }
      async joinRoom(e, t, r) {
        try {
          (await this.connect(e), this.send("JOIN_ROOM", { roomId: e, password: t, gameType: r }));
        } catch (e) {
          throw (console.error("Failed to connect for join room", e), e);
        }
      }
      async joinRoomWithResume(e, t, r, s) {
        try {
          (await this.connect(e), this.send("JOIN_ROOM", { roomId: e, password: t, resumeId: r, gameType: s }));
        } catch (e) {
          throw (console.error("Failed to connect for join room", e), e);
        }
      }
      selectColor(e) {
        this.send("SELECT_COLOR", { color: e });
      }
      assignColor(e, t) {
        this.send("ASSIGN_COLOR", { playerId: e, color: t });
      }
      syncState(e) {
        this.send("SYNC_STATE", { state: e });
      }
      syncStateSnapshot(e, t) {
        this.send("SYNC_STATE", { state: e, broadcast: t?.broadcast });
      }
      syncSettings(e) {
        this.send("SYNC_SETTINGS", { settings: e });
      }
      syncEvents(e) {
        this.send("SYNC_EVENTS", { events: e });
      }
      syncTileEffects(e) {
        this.send("SYNC_TILE_EFFECTS", { tileEffects: e });
      }
      syncEventsForMode(e, t) {
        this.send("SYNC_EVENTS", { events: e, playerMode: t });
      }
      showEvent(e) {
        this.send("GAME_ACTION", { type: "SHOW_EVENT", ...e });
      }
      closeEvent(e) {
        this.send("GAME_ACTION", { type: "CLOSE_EVENT", sequence: e });
      }
      disbandRoom() {
        this.send("DISBAND_ROOM", {});
      }
      sendGameAction(e) {
        this.send("GAME_ACTION", e);
      }
      startGame() {
        this.send("START_GAME", {});
      }
    }
    let n = new o();
    function i({
      translationsNamespace: e = "games.ludo.multiplayer",
      gameType: o,
      isMultiplayer: i,
      onToggleMode: l,
      onRoomJoined: a,
      onLeaveRoom: c,
      onColorSelected: d,
      onSetMyColor: u,
      onAuthSubmit: h,
      availableColors: m,
      currentPlayerColor: p,
      roomId: f,
      players: x,
      getPlayerDisplayName: w,
      getPlayerDotClass: b,
      isHost: g,
      gameStarted: y,
      onStartGame: v,
      initialJoinId: S,
      isReconnecting: _,
      hasJoinParam: j,
    }) {
      let N = (0, s.useTranslations)(e),
        C = "lovegame-mp-button-clicked-v1",
        [R, k] = (0, r.useState)(null != S ? "join" : "create"),
        [E, T] = (0, r.useState)(S || ""),
        [O, A] = (0, r.useState)(""),
        [I, F] = (0, r.useState)(m[0]),
        [z, M] = (0, r.useState)(""),
        [D, L] = (0, r.useState)(null),
        [P, $] = (0, r.useState)(!1),
        [W, B] = (0, r.useState)(!1),
        [G, Y] = (0, r.useState)(() => "true" !== window.localStorage.getItem(C)),
        U = (0, r.useRef)(null),
        J = new Set(x.map((e) => e.color).filter(Boolean)),
        H = m.length || 4,
        V = g && !y && x.length === H;
      ((0, r.useEffect)(() => {
        y && setTimeout(() => B(!0), 0);
      }, [y]),
        (0, r.useEffect)(() => {
          (f && f !== U.current && setTimeout(() => B(!1), 0), (U.current = f));
        }, [f]),
        (0, r.useEffect)(() => {
          let e = m[0] ?? "";
          if (!e) {
            "" !== I && setTimeout(() => F(""), 0);
            return;
          }
          (I && m.includes(I)) || I === e || setTimeout(() => F(e), 0);
        }, [m, I]));
      let q = (0, r.useMemo)(() => (e) => (w ? w(e) : e || N("labels.selecting")), [w, N]),
        K = (0, r.useMemo)(
          () => (e) =>
            b
              ? b(e)
              : { male: "bg-violet-600", female: "bg-rose-600", red: "bg-red-600", yellow: "bg-amber-500", blue: "bg-sky-600", green: "bg-emerald-600", gray: "bg-zinc-600" }[e || "gray"] ||
                "bg-zinc-600",
          [b],
        ),
        Z = (0, r.useMemo)(
          () => (e) => {
            switch (e?.code) {
              case "ROOM_NOT_FOUND":
                return N("errors.roomNotFound");
              case "INVALID_PASSWORD":
                return N("errors.invalidPassword");
              case "COLOR_ALREADY_TAKEN":
                return N("errors.colorAlreadyTaken");
              case "GAME_MISMATCH":
                return N("errors.gameMismatch");
              case "CREATE_ROOM_FAILED":
                return N("errors.createRoomFailed");
              case "ONLY_HOST_CAN_DISBAND":
                return N("errors.onlyHostCanDisband");
              case "CANNOT_DISBAND_LOBBY":
                return N("errors.cannotDisbandLobby");
              case "CREATE_ROOM_WRONG_TARGET":
                return N("errors.createRoomWrongTarget");
              case "GAME_ALREADY_STARTED":
                return e.message || N("errors.gameAlreadyStarted");
              default:
                return "string" == typeof e?.message && e.message.trim() ? e.message : N("errors.unknown");
            }
          },
          [N],
        ),
        Q = async () => {
          if (f)
            try {
              (await navigator.clipboard.writeText(f), $(!0), setTimeout(() => $(!1), 2e3));
            } catch (e) {
              console.error("Failed to copy:", e);
            }
        },
        X = async () => {
          if (!f) return;
          let e = `${window.location.origin}${window.location.pathname}?join=${f}`,
            t = N("share.text", { roomId: f });
          if (navigator.share)
            try {
              await navigator.share({ title: N("share.title"), text: t, url: e });
            } catch (e) {}
          else
            try {
              (await navigator.clipboard.writeText(t), $(!0), setTimeout(() => $(!1), 2e3));
            } catch (e) {
              console.error("Failed to copy:", e);
            }
        };
      (0, r.useEffect)(
        () =>
          n.subscribe((e, t) => {
            "ROOM_CREATED" === e
              ? (a(t.roomId, !0, ""), M(N("status.roomCreated", { roomId: t.roomId })))
              : "JOINED_ROOM" === e
                ? (a(t.roomId, !1, ""), M(N("status.joinedRoom", { roomId: t.roomId })))
                : "ERROR" === e && (L(Z(t)), M(""));
          }),
        [a, Z, N],
      );
      let ee = j && _ && !f;
      return !i || (f && W) || ee
        ? (0, t.jsxs)("button", {
            onClick: () => {
              (window.localStorage.setItem(C, "true"), Y(!1), i ? B(!1) : l(!0));
            },
            className: `cursor-pointer fixed top-20 right-6 z-[120] group flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${G ? "bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-pink-500/50" : "bg-gradient-to-br from-pink-500/40 to-pink-600/40 text-white/50 shadow-pink-500/20 hover:from-pink-500 hover:to-pink-600 hover:text-white hover:shadow-pink-500/70"}`,
            title: f ? N("labels.onlineRoom", { roomId: f }) : N("onlinePlay"),
            children: [
              (0, t.jsxs)("svg", {
                className: `w-6 h-6 drop-shadow-md ${f ? "text-emerald-200" : ""}`,
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: [
                  (0, t.jsx)("circle", { cx: "12", cy: "12", r: "10" }),
                  (0, t.jsx)("line", { x1: "2", y1: "12", x2: "22", y2: "12" }),
                  (0, t.jsx)("path", { d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" }),
                ],
              }),
              f &&
                (0, t.jsxs)("span", {
                  className: "absolute -top-1 -right-1 flex h-3 w-3",
                  children: [
                    (0, t.jsx)("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }),
                    (0, t.jsx)("span", { className: "relative inline-flex rounded-full h-3 w-3 bg-emerald-500" }),
                  ],
                }),
              G && (0, t.jsx)("span", { className: "absolute inset-0 rounded-full bg-pink-400 animate-ping opacity-20" }),
            ],
          })
        : f
          ? (0, t.jsxs)("div", {
              className:
                "fixed top-20 right-6 z-[120] bg-[#0b0714]/90 border border-white/20 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-5 pb-8 rounded-3xl w-72 transition-all animate-in fade-in slide-in-from-top-2",
              children: [
                (0, t.jsxs)("div", {
                  className: "flex justify-between items-center mb-4",
                  children: [
                    (0, t.jsxs)("h3", {
                      className: "font-bold text-emerald-400 tracking-wide text-sm flex items-center gap-2",
                      children: [(0, t.jsx)("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }), N("labels.onlineRoom", { roomId: f })],
                    }),
                    (0, t.jsx)("div", {
                      className: "flex ml-2 gap-2 items-center",
                      children: (0, t.jsx)("button", {
                        onClick: c,
                        className: "cursor-pointer text-xs font-medium text-white/40 hover:text-rose-400 transition-colors uppercase tracking-wider",
                        children: N("actions.exit"),
                      }),
                    }),
                  ],
                }),
                (0, t.jsxs)("div", {
                  className: "flex gap-2 mb-5",
                  children: [
                    (0, t.jsx)("button", {
                      onClick: Q,
                      className: "cursor-pointer flex-1 bg-white/5 hover:bg-white/10 text-xs py-2 rounded-xl border border-white/10 transition-colors text-white/80 font-medium",
                      children: P ? N("actions.copied") : N("actions.copyId"),
                    }),
                    (0, t.jsx)("button", {
                      onClick: X,
                      className: "cursor-pointer flex-1 bg-white/5 hover:bg-white/10 text-xs py-2 rounded-xl border border-white/10 transition-colors text-white/80 font-medium",
                      children: N("actions.share"),
                    }),
                  ],
                }),
                (0, t.jsx)("div", { className: "text-xs mb-3 text-white/60 font-medium uppercase tracking-wider", children: N("labels.playersCount", { count: x.length, max: H }) }),
                (0, t.jsx)("ul", {
                  className: "space-y-2 mb-5",
                  children: x.map((e, r) =>
                    (0, t.jsxs)(
                      "li",
                      {
                        className: "flex items-center gap-3 text-sm text-white/90 bg-white/5 p-2 rounded-lg border border-white/5",
                        children: [
                          (0, t.jsx)("span", { className: `w-3 h-3 rounded-full ${K(e.color)} shadow-sm` }),
                          (0, t.jsx)("span", { className: "flex-1 font-medium", children: q(e.color) }),
                          e.color === p && (0, t.jsx)("span", { className: "text-xs text-white/40", children: N("labels.you") }),
                        ],
                      },
                      r,
                    ),
                  ),
                }),
                !p &&
                  (0, t.jsxs)("div", {
                    className: "mb-4 p-3 bg-white/5 rounded-xl border border-white/10",
                    children: [
                      (0, t.jsx)("p", { className: "text-xs mb-2 text-white/70", children: N("labels.selectColor") }),
                      (0, t.jsx)("div", {
                        className: "flex gap-2 flex-wrap justify-center",
                        children: m.map((e) =>
                          (0, t.jsx)(
                            "button",
                            {
                              onClick: () => !J.has(e) && d(e),
                              disabled: J.has(e),
                              className: `w-8 h-8 rounded-full border-2 transition-all ${K(e)} ${J.has(e) ? "opacity-20 cursor-not-allowed border-transparent grayscale" : "cursor-pointer hover:scale-110 border-white/50 hover:border-white shadow-md"}`,
                            },
                            e,
                          ),
                        ),
                      }),
                    ],
                  }),
                g &&
                  !y &&
                  (0, t.jsx)("button", {
                    onClick: v,
                    disabled: !V,
                    className:
                      "w-full cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:from-zinc-700 disabled:to-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-full text-sm font-bold uppercase tracking-widest shadow-xl shadow-emerald-500/50 border border-white/20 transition-all active:scale-[0.98] hover:shadow-emerald-500/70 !mt-8 mb-2",
                    children: N("actions.startGame"),
                  }),
                !y &&
                  !g &&
                  (0, t.jsx)("div", {
                    className: "py-3 rounded-full text-sm shadow-emerald-500/50 border border-white/20 text-center text-amber-300/80 animate-pulse font-medium bg-amber-900/20 py-2 mb-2",
                    children: N("status.waitingForHost"),
                  }),
                (0, t.jsx)("button", {
                  onClick: () => B(!0),
                  className:
                    "absolute cursor-pointer mb-1 bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors",
                  title: N("actions.minimize"),
                  children: (0, t.jsx)("svg", {
                    className: "w-5 h-5",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    viewBox: "0 0 24 24",
                    xmlns: "http://www.w3.org/2000/svg",
                    children: (0, t.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 15l7-7 7 7" }),
                  }),
                }),
              ],
            })
          : (0, t.jsx)("div", {
              className: "fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm",
              children: (0, t.jsxs)("div", {
                className: "relative w-full max-w-md rounded-3xl border border-white/20 bg-[#0b0714]/95 p-6 text-white shadow-[0_36px_100px_rgba(91,33,182,0.55)] backdrop-blur",
                onClick: (e) => e.stopPropagation(),
                children: [
                  (0, t.jsx)("button", {
                    onClick: () => l(!1),
                    className:
                      "absolute top-4 right-4 cursor-pointer rounded-full border border-white/25 w-8 h-8 flex items-center justify-center text-xs text-white/70 transition hover:border-white/40 hover:text-white",
                    children: "✕",
                  }),
                  (0, t.jsxs)("h2", {
                    className: "text-xl font-semibold tracking-wide text-center mb-6 flex items-center justify-center gap-2",
                    children: [(0, t.jsx)("span", { children: "🌍" }), (0, t.jsx)("span", { children: N("panelTitle") })],
                  }),
                  (0, t.jsxs)("div", {
                    className: "flex bg-white/5 rounded-2xl p-1 mb-6 border border-white/10",
                    children: [
                      (0, t.jsx)("button", {
                        className: `cursor-pointer flex-1 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${"create" === R ? "bg-white/10 text-white shadow-sm border border-white/10" : "text-white/60 hover:text-white/90 hover:bg-white/5"}`,
                        onClick: () => k("create"),
                        children: N("tabs.create"),
                      }),
                      (0, t.jsx)("button", {
                        className: `cursor-pointer flex-1 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${"join" === R ? "bg-white/10 text-white shadow-sm border border-white/10" : "text-white/60 hover:text-white/90 hover:bg-white/5"}`,
                        onClick: () => k("join"),
                        children: N("tabs.join"),
                      }),
                    ],
                  }),
                  D && (0, t.jsx)("div", { className: "bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded mb-4 text-sm", children: D }),
                  "create" === R
                    ? (0, t.jsxs)("div", {
                        className: "space-y-5",
                        children: [
                          (0, t.jsxs)("div", {
                            children: [
                              (0, t.jsx)("label", { className: "block text-xs font-medium uppercase tracking-wider text-white/60 mb-2", children: N("labels.passwordOptional") }),
                              (0, t.jsx)("input", {
                                type: "text",
                                value: O,
                                onChange: (e) => A(e.target.value),
                                className:
                                  "w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white shadow-inner transition focus:border-purple-400/50 focus:outline-none focus:ring-1 focus:ring-purple-400/30 placeholder:text-white/20",
                                placeholder: N("placeholders.passwordOptional"),
                              }),
                            ],
                          }),
                          (0, t.jsxs)("div", {
                            children: [
                              (0, t.jsx)("label", { className: "block text-xs font-medium uppercase tracking-wider text-white/60 mb-2 mt-2", children: N("labels.yourColor") }),
                              (0, t.jsx)("div", {
                                className: "flex gap-3 justify-center py-2",
                                children: m.map((e) =>
                                  (0, t.jsx)(
                                    "button",
                                    {
                                      onClick: () => F(e),
                                      className: `cursor-pointer w-10 h-10 rounded-full border-2 transition-transform shadow-lg ${I === e ? "scale-110 border-white shadow-[0_0_15px_white]" : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"} ${K(e)}`,
                                    },
                                    e,
                                  ),
                                ),
                              }),
                            ],
                          }),
                          (0, t.jsx)("button", {
                            onClick: () => {
                              (L(null), M(N("status.creatingRoom")));
                              let e = I || m[0] || "";
                              if (!e) {
                                (L(N("errors.unknown")), M(""));
                                return;
                              }
                              (u(e), h?.({ kind: "create", password: O }), n.createRoom(O, e, o).catch(() => L(N("errors.connectionFailed"))));
                            },
                            className:
                              "cursor-pointer w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-xl shadow-purple-500/40 border border-white/20 transition hover:scale-[1.02] hover:shadow-purple-500/60 hover:border-white/40 active:scale-[0.98] mt-4",
                            children: N("actions.createRoom"),
                          }),
                        ],
                      })
                    : (0, t.jsxs)("div", {
                        className: "space-y-5",
                        children: [
                          (0, t.jsxs)("div", {
                            children: [
                              (0, t.jsx)("label", { className: "block text-xs font-medium uppercase tracking-wider text-white/60 mb-2", children: N("labels.roomId") }),
                              (0, t.jsx)("input", {
                                type: "text",
                                value: E,
                                onChange: (e) => {
                                  let t = e.target.value;
                                  if (e.nativeEvent instanceof InputEvent && "insertFromPaste" === e.nativeEvent.inputType) {
                                    let e = t.match(/[A-Z0-9]{6}/);
                                    e
                                      ? T(e[0])
                                      : T(
                                          t
                                            .replace(/[^A-Z0-9]/g, "")
                                            .toUpperCase()
                                            .substring(0, 6),
                                        );
                                  } else
                                    T(
                                      t
                                        .toUpperCase()
                                        .replace(/[^A-Z0-9]/g, "")
                                        .substring(0, 6),
                                    );
                                },
                                className:
                                  "w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white shadow-inner transition focus:border-purple-400/50 focus:outline-none focus:ring-1 focus:ring-purple-400/30 placeholder:text-white/20 uppercase tracking-widest font-mono",
                                placeholder: N("placeholders.roomId"),
                              }),
                            ],
                          }),
                          (0, t.jsxs)("div", {
                            children: [
                              (0, t.jsx)("label", { className: "block text-xs font-medium uppercase tracking-wider text-white/60 mb-2 mt-2", children: N("labels.password") }),
                              (0, t.jsx)("input", {
                                type: "text",
                                value: O,
                                onChange: (e) => A(e.target.value),
                                className:
                                  "w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white shadow-inner transition focus:border-purple-400/50 focus:outline-none focus:ring-1 focus:ring-purple-400/30 placeholder:text-white/20",
                              }),
                            ],
                          }),
                          (0, t.jsx)("button", {
                            onClick: () => {
                              let e = E.trim().toUpperCase();
                              (L(null), M(N("status.joiningRoom")), h?.({ kind: "join", roomId: e, password: O }), n.joinRoom(e, O, o).catch(() => L(N("errors.connectionFailed"))));
                            },
                            className:
                              "cursor-pointer w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-xl shadow-purple-500/40 border border-white/20 transition hover:scale-[1.02] hover:shadow-purple-500/60 hover:border-white/40 active:scale-[0.98] mt-4",
                            children: N("actions.joinRoom"),
                          }),
                        ],
                      }),
                  z && (0, t.jsx)("p", { className: "text-center text-white/50 text-xs mt-4 animate-pulse", children: z }),
                ],
              }),
            });
    }
    function l({ visible: e, message: r, subtitle: o, onCancel: n }) {
      let i = (0, s.useTranslations)("games.ludo.multiplayer");
      return e
        ? (0, t.jsxs)("div", {
            className: "fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 rounded-xl animate-in fade-in duration-300",
            children: [
              (0, t.jsx)("div", { className: "w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6" }),
              (0, t.jsx)("h3", { className: "text-2xl font-bold text-white mb-2", children: r }),
              !!o && (0, t.jsx)("p", { className: "text-zinc-400 mb-8 max-w-sm", children: o }),
              (0, t.jsx)("button", { onClick: n, className: "px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 transition-colors", children: i("actions.exit") }),
            ],
          })
        : null;
    }
    (e.s(["multiplayerClient", 0, n], 43517),
      e.s(["MultiplayerControl", () => i], 15972),
      e.s(["MultiplayerOverlay", () => l], 26114),
      e.i(47167),
      e.s(
        [
          "clearStoredMpSession",
          0,
          (e) => {
            try {
              window.localStorage.removeItem(e);
            } catch {}
          },
          "readStoredMpSession",
          0,
          (e) => {
            try {
              let t = window.localStorage.getItem(e);
              if (!t) return null;
              let r = JSON.parse(t);
              if (!r || "string" != typeof r.roomId) return null;
              return {
                roomId: r.roomId.trim(),
                password: "string" == typeof r.password ? r.password : "",
                color: "string" == typeof r.color ? r.color : null,
                myPlayerId: "string" == typeof r.myPlayerId ? r.myPlayerId : null,
              };
            } catch {
              return null;
            }
          },
          "resolveMultiplayerWsUrl",
          0,
          () => "wss://lovegame-ws.hoothin.com/ws",
          "writeStoredMpSession",
          0,
          (e, t) => {
            try {
              window.localStorage.setItem(e, JSON.stringify(t));
            } catch {}
          },
        ],
        87974,
      ));
  },
]);
