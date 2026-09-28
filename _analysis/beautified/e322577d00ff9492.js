(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  8387,
  (e) => {
    "use strict";
    var t = e.i(71645);
    e.s([
      "useGameSound",
      0,
      () => {
        let e = (0, t.useRef)({ ctx: null, play: () => {}, startHeartbeat: () => {}, stopHeartbeat: () => {} });
        (0, t.useEffect)(() => {
          let t = window.AudioContext || window.webkitAudioContext;
          if (!t) return;
          let a = new t(),
            n = null,
            r = (e, t, n, r, i = 0.1) => {
              let s = a.createOscillator(),
                l = a.createGain();
              ((s.type = e),
                s.frequency.setValueAtTime(t, r),
                l.gain.setValueAtTime(i, r),
                l.gain.exponentialRampToValueAtTime(0.01, r + n),
                s.connect(l),
                l.connect(a.destination),
                s.start(r),
                s.stop(r + n));
            },
            i = () => {
              if (!a) return;
              let e = a.currentTime;
              (r("sine", 60, 0.15, e, 0.3), r("triangle", 40, 0.1, e, 0.1), r("sine", 70, 0.1, e + 0.3, 0.25), r("triangle", 50, 0.1, e + 0.3, 0.1), (n = window.setTimeout(i, 1200)));
            };
          return (
            (e.current = {
              ctx: a,
              play: (e) => {
                if (!a) return;
                "suspended" === a.state && a.resume();
                let t = a.currentTime;
                switch (e) {
                  case "flip":
                    (r("sine", 800, 0.1, t, 0.1), r("triangle", 1200, 0.05, t, 0.05));
                    break;
                  case "eat":
                    (r("square", 150, 0.2, t, 0.15), r("sawtooth", 100, 0.3, t, 0.15), r("sine", 50, 0.4, t, 0.3));
                    break;
                  case "start":
                    [220, 277, 330, 440].forEach((e, n) => {
                      let r = a.createOscillator(),
                        i = a.createGain();
                      ((r.type = "sine"),
                        r.frequency.setValueAtTime(e, t),
                        r.frequency.linearRampToValueAtTime(1.02 * e, t + 1.5),
                        i.gain.setValueAtTime(0, t),
                        i.gain.linearRampToValueAtTime(0.1, t + 0.1 + 0.05 * n),
                        i.gain.linearRampToValueAtTime(0, t + 2),
                        r.connect(i),
                        i.connect(a.destination),
                        r.start(t),
                        r.stop(t + 2));
                    });
                    break;
                  case "win":
                    [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98].forEach((e, a) => {
                      (r("triangle", e, 0.6, t + 0.08 * a, 0.1), r("sine", 2 * e, 0.8, t + 0.08 * a, 0.05));
                    });
                    break;
                  case "tick":
                    (r("square", 800, 0.03, t, 0.05), r("triangle", 2e3, 0.03, t, 0.02));
                    break;
                  case "select":
                    (r("sine", 440, 0.15, t, 0.1), r("sine", 587.33, 0.2, t + 0.1, 0.1));
                    break;
                  case "fanfare":
                    [523.25, 659.25, 783.99, 1046.5].forEach((e) => {
                      (r("sawtooth", e, 0.4, t, 0.08), r("triangle", e, 0.4, t, 0.08));
                    });
                    break;
                  case "roll":
                    for (let e = 0; e < 5; e++) {
                      let n = t + (e / 5) * 0.35 + 0.04 * Math.random(),
                        r = 0.04 * a.sampleRate,
                        i = a.createBuffer(1, r, a.sampleRate),
                        s = i.getChannelData(0);
                      for (let e = 0; e < r; e++) s[e] = 2 * Math.random() - 1;
                      let l = a.createBufferSource();
                      l.buffer = i;
                      let c = a.createBiquadFilter();
                      ((c.type = "lowpass"), (c.frequency.value = 1500 + 500 * Math.random()));
                      let o = a.createGain();
                      (o.gain.setValueAtTime(0.12, n), o.gain.exponentialRampToValueAtTime(0.001, n + 0.03), l.connect(c), c.connect(o), o.connect(a.destination), l.start(n));
                      let u = a.createOscillator(),
                        m = a.createGain();
                      ((u.type = "triangle"),
                        u.frequency.setValueAtTime(300 + 150 * Math.random(), n),
                        m.gain.setValueAtTime(0.15, n),
                        m.gain.exponentialRampToValueAtTime(0.001, n + 0.04),
                        u.connect(m),
                        m.connect(a.destination),
                        u.start(n),
                        u.stop(n + 0.04));
                    }
                    break;
                  case "success":
                    (r("sine", 659.25, 0.3, t, 0.1), r("sine", 880, 0.4, t + 0.1, 0.1));
                    break;
                  case "fail": {
                    (r("sawtooth", 440, 0.4, t, 0.1), r("sawtooth", 311.13, 0.4, t + 0.1, 0.1));
                    let e = a.createOscillator(),
                      n = a.createGain();
                    ((e.type = "triangle"),
                      e.frequency.setValueAtTime(200, t),
                      e.frequency.linearRampToValueAtTime(100, t + 0.4),
                      n.gain.setValueAtTime(0.1, t),
                      n.gain.linearRampToValueAtTime(0, t + 0.4),
                      e.connect(n),
                      n.connect(a.destination),
                      e.start(t),
                      e.stop(t + 0.4));
                    break;
                  }
                  case "levelUp":
                    [523.25, 659.25, 783.99, 1046.5].forEach((e, a) => {
                      r("square", e, 0.1, t + 0.05 * a, 0.05);
                    });
                    break;
                  case "spin":
                    for (let e = 0; e < 15; e++) {
                      let a = t + 0.06 * e,
                        n = 500 + 200 * Math.random();
                      (r("triangle", n, 0.04, a, 0.06), r("sine", 2 * n, 0.032, a, 0.03), r("square", 4 * n, 0.016, a, 0.012));
                    }
                    break;
                  case "stop":
                    (r("sine", 523.25, 0.18, t, 0.12), r("sine", 659.25, 0.22, t + 0.05, 0.08));
                    break;
                  case "jackpot":
                    [1, 1.25, 1.5, 2, 1.5, 1.25, 1, 0.75, 1].forEach((e, a) => {
                      let n = t + 0.15 * a;
                      (r("square", 523.25 * e, 0.2, n, 0.1), r("sine", 523.25 * e * 2, 0.3, n, 0.05), a % 2 == 0 && r("sine", 2e3 + 500 * Math.random(), 0.05, n, 0.05));
                    });
                    break;
                  case "move":
                    (r("sine", 300, 0.05, t, 0.2), r("square", 150, 0.02, t, 0.1));
                    break;
                  case "fly": {
                    let e = a.createBufferSource(),
                      n = 0.5 * a.sampleRate,
                      r = a.createBuffer(1, n, a.sampleRate),
                      i = r.getChannelData(0);
                    for (let e = 0; e < n; e++) i[e] = 2 * Math.random() - 1;
                    e.buffer = r;
                    let s = a.createBiquadFilter();
                    ((s.type = "lowpass"), s.frequency.setValueAtTime(200, t), s.frequency.linearRampToValueAtTime(2e3, t + 0.4));
                    let l = a.createGain();
                    (l.gain.setValueAtTime(0.1, t), l.gain.linearRampToValueAtTime(0, t + 0.5), e.connect(s), s.connect(l), l.connect(a.destination), e.start(t));
                    break;
                  }
                  case "land": {
                    (r("sine", 100, 0.15, t, 0.3), r("triangle", 60, 0.2, t, 0.2));
                    let e = a.createBufferSource(),
                      n = 0.1 * a.sampleRate,
                      i = a.createBuffer(1, n, a.sampleRate),
                      s = i.getChannelData(0);
                    for (let e = 0; e < n; e++) s[e] = 2 * Math.random() - 1;
                    e.buffer = i;
                    let l = a.createGain();
                    (l.gain.setValueAtTime(0.1, t), l.gain.exponentialRampToValueAtTime(0.01, t + 0.1), e.connect(l), l.connect(a.destination), e.start(t));
                  }
                }
              },
              startHeartbeat: () => {
                !a || ("suspended" === a.state && a.resume(), n || i());
              },
              stopHeartbeat: () => {
                n && (window.clearTimeout(n), (n = null));
              },
            }),
            () => {
              (n && window.clearTimeout(n), "closed" !== a.state && a.close());
            }
          );
        }, []);
        let a = (0, t.useCallback)((t) => {
          e.current.play && e.current.play(t);
        }, []);
        return {
          play: a,
          startHeartbeat: (0, t.useCallback)(() => {
            e.current.startHeartbeat && e.current.startHeartbeat();
          }, []),
          stopHeartbeat: (0, t.useCallback)(() => {
            e.current.stopHeartbeat && e.current.stopHeartbeat();
          }, []),
        };
      },
    ]);
  },
]);
