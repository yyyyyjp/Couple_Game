/* ============================================================
 * 桃色老虎机（Slots）
 * 三转轴随机组合 地点/动作/部位；扑克牌型计分；蓄力炸弹；
 * 先集满欲望条（默认 500 分）者胜
 * ============================================================ */
(function () {
  "use strict";
  var M = MESSAGES.games.slots;
  var e = scoped("games.slots");
  var root = document.getElementById("slots-root");
  var modalRoot = document.getElementById("slots-modal-root");

  /* ---------------- 常量 ---------------- */
  var SUITS = { spades: "♠️", hearts: "♥️", clubs: "♣️", diamonds: "♦️" };
  var SUIT_TEXT = { spades: "text-purple-200", hearts: "text-pink-200", clubs: "text-emerald-200", diamonds: "text-red-200" };
  var RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  var RANK_VAL = { 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, J: 11, Q: 12, K: 13, A: 14 };
  function randId() { return Math.random().toString(36).slice(2, 9); }
  function randSuit() { var ks = Object.keys(SUITS); return ks[Math.floor(4 * Math.random())]; }
  function randRank() { return RANKS[Math.floor(Math.random() * RANKS.length)]; }

  /* ---------------- 默认 / 搞笑转轴 ---------------- */
  function defaultReels() {
    return [
      [
        { id: "l1", text: e("defaults.locations.balcony") },
        { id: "l2", text: e("defaults.locations.sofa") },
        { id: "l3", text: e("defaults.locations.kitchen") },
        { id: "l4", text: e("defaults.locations.bed") },
        { id: "l5", text: e("defaults.locations.bathroom") }
      ],
      [
        { id: "a1", text: e("defaults.actions.kiss") },
        { id: "a2", text: e("defaults.actions.massage") },
        { id: "a3", text: e("defaults.actions.lick") },
        { id: "a4", text: e("defaults.actions.bite") },
        { id: "a5", text: e("defaults.actions.touch") },
        { id: "a6", text: e("defaults.actions.tickle") },
        { id: "a7", text: e("defaults.actions.hug") },
        { id: "a8", text: e("defaults.actions.blow") },
        { id: "a9", text: e("defaults.actions.pinch") },
        { id: "a10", text: e("defaults.actions.slap") },
        { id: "a11", text: e("defaults.actions.rub") },
        { id: "a12", text: e("defaults.actions.stare") },
        { id: "a13", text: e("defaults.actions.smell") },
        { id: "a14", text: e("defaults.actions.scratch") },
        { id: "a15", text: e("defaults.actions.hold") },
        { id: "a16", text: e("defaults.actions.squeeze") }
      ],
      [
        { id: "b1", text: e("defaults.bodyParts.neck") },
        { id: "b2", text: e("defaults.bodyParts.ear") },
        { id: "b3", text: e("defaults.bodyParts.thigh") },
        { id: "b4", text: e("defaults.bodyParts.lips") },
        { id: "b5", text: e("defaults.bodyParts.chest") },
        { id: "b6", text: e("defaults.bodyParts.hand") },
        { id: "b7", text: e("defaults.bodyParts.foot") },
        { id: "b8", text: e("defaults.bodyParts.back") },
        { id: "b9", text: e("defaults.bodyParts.waist") },
        { id: "b10", text: e("defaults.bodyParts.shoulder") },
        { id: "b11", text: e("defaults.bodyParts.hair") },
        { id: "b12", text: e("defaults.bodyParts.chin") },
        { id: "b13", text: e("defaults.bodyParts.cheek") },
        { id: "b14", text: e("defaults.bodyParts.collarbone") },
        { id: "b15", text: e("defaults.bodyParts.navel") },
        { id: "b16", text: e("defaults.bodyParts.wrist") },
        { id: "b17", text: e("defaults.bodyParts.ankle") }
      ]
    ];
  }
  function funnyReels() {
    return [
      [
        { id: "fl1", text: e("funny.locations.fridge") },
        { id: "fl2", text: e("funny.locations.sofa") },
        { id: "fl3", text: e("funny.locations.bed") },
        { id: "fl4", text: e("funny.locations.toilet") },
        { id: "fl5", text: e("funny.locations.balcony") },
        { id: "fl6", text: e("funny.locations.corner") },
        { id: "fl7", text: e("funny.locations.kitchen") },
        { id: "fl8", text: e("funny.locations.doorway") }
      ],
      [
        { id: "fa1", text: e("funny.actions.propose") },
        { id: "fa2", text: e("funny.actions.interview") },
        { id: "fa3", text: e("funny.actions.lecture") },
        { id: "fa4", text: e("funny.actions.dance") },
        { id: "fa5", text: e("funny.actions.praise") },
        { id: "fa6", text: e("funny.actions.stare") },
        { id: "fa7", text: e("funny.actions.confess") },
        { id: "fa8", text: e("funny.actions.argue") },
        { id: "fa9", text: e("funny.actions.breakup") },
        { id: "fa10", text: e("funny.actions.worship") },
        { id: "fa11", text: e("funny.actions.seduce") },
        { id: "fa12", text: e("funny.actions.rap") },
        { id: "fa13", text: e("funny.actions.apologize") },
        { id: "fa14", text: e("funny.actions.negotiate") },
        { id: "fa15", text: e("funny.actions.threaten") },
        { id: "fa16", text: e("funny.actions.kowtow") }
      ],
      [
        { id: "fb1", text: e("funny.bodyParts.soySauce") },
        { id: "fb2", text: e("funny.bodyParts.pillow") },
        { id: "fb3", text: e("funny.bodyParts.slipper") },
        { id: "fb4", text: e("funny.bodyParts.remote") },
        { id: "fb5", text: e("funny.bodyParts.air") },
        { id: "fb6", text: e("funny.bodyParts.tissue") },
        { id: "fb7", text: e("funny.bodyParts.cup") },
        { id: "fb8", text: e("funny.bodyParts.plant") },
        { id: "fb9", text: e("funny.bodyParts.trash") },
        { id: "fb10", text: e("funny.bodyParts.robot") },
        { id: "fb11", text: e("funny.bodyParts.toiletRoll") },
        { id: "fb12", text: e("funny.bodyParts.toothbrush") },
        { id: "fb13", text: e("funny.bodyParts.spoon") },
        { id: "fb14", text: e("funny.bodyParts.banana") },
        { id: "fb15", text: e("funny.bodyParts.phone") },
        { id: "fb16", text: e("funny.bodyParts.sock") }
      ]
    ];
  }
  function defaultLabels() { return [e("reels.location"), e("reels.action"), e("reels.bodyPart")]; }

  /* ---------------- 状态 ---------------- */
  var S = {
    reels: LG.loadJSON("slots.reels_v2", null) || defaultReels(),
    players: null,
    playerIdx: 0,
    phase: "idle",
    winScore: 500,
    resultName: "",
    resultScore: 0,
    bombCount: 0,
    bombExploding: false,
    labels: null,
    libs: {},
    activeLib: "default-content-library"
  };
  S.players = LG.loadJSON("slots.players", null) || [
    { id: "p1", name: e("defaults.player1"), score: 0, color: "#ec4899" },
    { id: "p2", name: e("defaults.player2"), score: 0, color: "#3b82f6" }
  ];
  var savedScore = localStorage.getItem("slots.winningScore");
  if (savedScore != null) S.winScore = Number(savedScore);
  S.labels = LG.loadJSON("slots.reelLabels", null) || defaultLabels();

  /* 内容库初始化 */
  (function initLibraries() {
    var data = LG.loadJSON("slots.contentLibraries", null);
    var user = {}, active = null;
    if (data && data.libraries && typeof data.libraries === "object") { user = data.libraries; active = data.activeId || null; }
    var builtins = [
      { id: "default-content-library", nameKey: "library.defaultName", create: defaultReels },
      { id: "funny-content-library", nameKey: "library.funnyName", create: funnyReels }
    ];
    var libs = Object.assign({}, user);
    builtins.forEach(function (b) {
      var name = e(b.nameKey), ex = libs[b.id];
      if (!ex || ex.name !== name) {
        libs[b.id] = { id: b.id, name: name, reels: b.create(), createdAt: ex ? ex.createdAt : Date.now(), isDefault: true };
      }
    });
    if (!active || !libs[active]) active = builtins[0].id;
    S.libs = libs; S.activeLib = active;
  })();

  /* ---------------- 音频 ---------------- */
  var bombAudio = new Audio("../assets/media/bomb.mp3");
  var bonusAudio = new Audio("../assets/media/bonus.mp3");
  var spinSoundTimer = null;

  /* ---------------- 转轴 Reel ---------------- */
  function Reel(idx) {
    this.idx = idx;
    this.offset = 0; this.raf = 0; this.spinning = false; this.target = null;
    this.items = S.reels[idx];
    this.el = document.createElement("div");
    this.el.className = "relative flex h-52 sm:h-64 w-full flex-col items-center overflow-hidden rounded-lg sm:rounded-xl border border-white/10 sm:border-2 bg-black/40 shadow-inner select-none";
    this.el.innerHTML =
      '<div class="pointer-events-none absolute inset-0 z-20 bg-gradient-to-b from-black/90 via-transparent to-black/90"></div>' +
      '<div class="pointer-events-none absolute top-1/2 left-0 right-0 z-10 h-0.5 -translate-y-1/2 bg-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>' +
      '<div class="reel-label absolute top-0.5 sm:top-1 left-0 right-0 z-30 text-center text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/30 backdrop-blur-lg border-b border-white/30"></div>';
    this.labelEl = this.el.querySelector(".reel-label");
    this.labelEl.textContent = S.labels[idx];
    this.strip = document.createElement("div");
    this.strip.className = "absolute w-full will-change-transform";
    this.el.appendChild(this.strip);
    this.buildRendered();
    this.draw(false);
  }
  Reel.prototype.buildRendered = function () {
    this.rendered = [];
    for (var rep = 0; rep < 3; rep++) {
      for (var i = 0; i < this.items.length; i++) {
        var it = this.items[i];
        this.rendered.push({ id: it.id, text: it.text, suit: randSuit(), rank: randRank() });
      }
    }
  };
  Reel.prototype.draw = function (animate) {
    var len = this.items.length, html = "", self = this;
    this.rendered.forEach(function (c, s) {
      var card = c;
      if (self.target && s === len + self.target.index)
        card = { id: c.id, text: c.text, suit: self.target.card.suit, rank: self.target.card.rank };
      html += Reel.cardHtml(card, self.spinning);
    });
    this.strip.innerHTML = html;
    this.strip.style.transition = animate ? "transform 2.5s cubic-bezier(0.1,0.9,0.2,1)" : "none";
    this.strip.style.transform = "translateY(-" + this.offset + "px)";
  };
  Reel.prototype.start = function () {
    cancelAnimationFrame(this.raf);
    this.target = null; this.spinning = true;
    this.draw(false);
    var self = this, len = this.items.length, off = this.offset;
    (function loop() {
      off = (off + 40) % (112 * len);
      self.offset = off;
      self.strip.style.transition = "none";
      self.strip.style.transform = "translateY(-" + off + "px)";
      self.raf = requestAnimationFrame(loop);
    })();
  };
  Reel.prototype.stopAt = function (index, card) {
    cancelAnimationFrame(this.raf);
    this.spinning = false;
    this.target = { index: index, card: card };
    var len = this.items.length;
    this.offset = 112 * len + 112 * index - 72;
    this.draw(true);
  };
  Reel.prototype.clearTarget = function () {
    cancelAnimationFrame(this.raf);
    this.spinning = false; this.target = null;
    this.draw(false);
  };
  Reel.prototype.destroy = function () { cancelAnimationFrame(this.raf); };
  Reel.cardHtml = function (c, spinning) {
    var tc = SUIT_TEXT[c.suit];
    return '<div class="flex h-28 w-full items-center justify-center px-1 sm:px-2 py-0.5 sm:py-1">' +
      '<div class="relative flex h-full w-full flex-col items-center justify-center rounded-md sm:rounded-lg border border-white/10 bg-white/5 p-1.5 sm:p-2 text-center backdrop-blur-sm ' + (spinning ? "blur-[2px]" : "") + ' overflow-hidden select-none">' +
      '<div class="absolute top-0.5 sm:top-1 left-1 sm:left-2 flex flex-col items-center leading-none ' + tc + '"><span class="text-xs sm:text-sm font-black">' + c.rank + '</span><span class="text-[10px] sm:text-xs">' + SUITS[c.suit] + '</span></div>' +
      '<div class="absolute bottom-0.5 sm:bottom-1 right-1 sm:right-2 flex flex-col items-center leading-none rotate-180 ' + tc + '"><span class="text-xs sm:text-sm font-black">' + c.rank + '</span><span class="text-[10px] sm:text-xs">' + SUITS[c.suit] + '</span></div>' +
      '<div class="flex flex-col items-center z-10 px-2 sm:px-4"><span class="line-clamp-2 text-xs sm:text-sm font-bold text-white drop-shadow-md leading-tight">' + LG.escapeHtml(c.text) + '</span></div>' +
      '<div class="absolute inset-0 opacity-10 flex items-center justify-center text-4xl sm:text-6xl select-none pointer-events-none ' + tc + '">' + SUITS[c.suit] + '</div>' +
      '</div></div>';
  };

  var reels = [new Reel(0), new Reel(1), new Reel(2)];
  function rebuildReels() {
    reels.forEach(function (r) { r.destroy(); });
    reels = [new Reel(0), new Reel(1), new Reel(2)];
  }

  /* ---------------- 牌型判定 ---------------- */
  function evaluateHand(cards) {
    var r0 = cards[0].rank, r1 = cards[1].rank, r2 = cards[2].rank;
    if (r0 === "A" && r1 === "A" && r2 === "4") return { score: 150, name: e("hand.inm114") };
    if (r0 === "5" && r1 === "A" && r2 === "4") return { score: 150, name: e("hand.inm514") };
    var vals = cards.map(function (c) { return RANK_VAL[c.rank]; }).sort(function (a, b) { return a - b; });
    var suits = cards.map(function (c) { return c.suit; });
    var sameSuit = suits[0] === suits[1] && suits[1] === suits[2];
    var straight = false;
    if (vals[1] === vals[0] + 1 && vals[2] === vals[1] + 1) straight = true;
    if (vals[0] === 2 && vals[1] === 3 && vals[2] === 14) straight = true;
    var threeKind = vals[0] === vals[1] && vals[1] === vals[2];
    var pair = vals[0] === vals[1] || vals[1] === vals[2] || vals[0] === vals[2];
    var sevens = threeKind && vals[0] === 7;
    if (sevens && sameSuit) return { score: 777, name: e("hand.luxury777") };
    if (sameSuit && straight) return { score: 500, name: e("hand.straightFlush") };
    if (sevens) return { score: 300, name: e("hand.777") };
    if (threeKind && sameSuit) return { score: 200, name: e("hand.luxuryThreeOfAKind") };
    if (threeKind) return { score: 100, name: e("hand.threeOfAKind") };
    if (straight) return { score: 50, name: e("hand.straight") };
    if (sameSuit) return { score: 30, name: e("hand.flush") };
    if (pair) return { score: 10, name: e("hand.pair") };
    return { score: -5, name: e("hand.noCombo") };
  }

  /* ---------------- 持久化 ---------------- */
  function persist() {
    LG.saveJSON("slots.reels_v2", S.reels);
    LG.saveJSON("slots.players", S.players);
    localStorage.setItem("slots.winningScore", String(S.winScore));
    var def = defaultLabels();
    var changed = S.labels.some(function (l, i) { return l !== def[i]; });
    if (changed) LG.saveJSON("slots.reelLabels", S.labels);
    else localStorage.removeItem("slots.reelLabels");
    if (Object.keys(S.libs).length) LG.saveJSON("slots.contentLibraries", { libraries: S.libs, activeId: S.activeLib });
  }

  /* ---------------- 图标 SVG ---------------- */
  var ICON_PIN = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 sm:size-5 text-pink-300 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/></svg>';
  var ICON_HEART = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 sm:size-5 text-pink-300 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/></svg>';
  var ICON_HAND = '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 1024 1024" stroke-width="1.5" stroke="currentColor" class="size-4 sm:size-5 text-pink-300 shrink-0"><path d="M809.472 406.016h-2.56c-16.896 0-31.232 5.12-44.544 13.312-11.776-34.304-41.984-59.392-80.896-59.392-16.896 0-33.28 5.12-47.104 13.312-11.776-34.304-41.984-59.392-80.896-59.392-15.36 0-29.184 3.584-41.472 10.24V235.52c0-48.128-36.352-87.552-85.504-87.552-48.64 0-88.064 39.424-88.064 87.552v339.968l-53.76-53.248c-34.304-34.304-95.232-29.184-124.928 0-29.184 29.184-48.64 88.576-6.656 130.56l246.272 244.736c5.12 5.12 10.752 9.216 16.384 12.8 45.056 36.864 96.256 58.368 205.312 58.368 248.832 0 271.872-134.144 271.872-299.52V494.08c1.024-48.64-34.304-88.064-83.456-88.064z m38.4 262.656c0 139.776-0.512 253.44-225.28 253.44-95.232 0-152.064-20.992-195.584-64L193.536 626.176c-20.48-20.48-15.36-47.104 1.536-64s48.12-17.408 64-1.024c0 0 40.96 40.448 76.288 75.776 26.624 26.624 50.176 49.664 50.176 49.664V244.736c0-23.04 18.944-41.472 41.984-41.472 23.04 0 38.912 18.432 38.912 41.472v281.088h0.512c-0.512 1.536-0.512 3.072-0.512 4.608 0 12.8 10.24 23.04 23.04 23.04 12.8 0 23.04-10.24 23.04-23.04 0-1.536 0-3.072-0.512-4.608h0.512v-115.2c0-23.04 16.896-41.472 39.936-41.472 0 0 40.96-0.512 40.96 41.472v152.064h0.512c-0.512 1.536-0.512 3.072-0.512 4.608 0 12.8 10.24 23.04 23.04 23.04 12.8 0 23.04-10.24 23.04-23.04 0-1.536 0-3.072-0.512-4.608h0.512V456.704c0-23.04 16.384-41.472 39.424-41.472 0 0 41.984 2.56 41.984 41.472v133.632h0.512c-0.512 1.536-0.512 3.072-0.512 4.608 0 12.8 10.24 23.04 23.04 23.04 12.8 0 22.528-10.24 22.528-23.04 0-1.536 0-3.072-0.512-4.608h0.512V499.2c0-23.04 17.408-41.472 40.448-41.472 0 0 40.448-1.536 40.448 41.472 0.512 0 0.512 132.608 0.512 169.472zM304.64 366.08V288.768a135.68 135.68 0 0 1-11.776-54.272 133.184 133.184 0 1 1 263.168 29.184c16.896 0.512 31.744 7.68 43.008 18.944a184.32 184.32 0 0 0 6.656-47.616c0-98.816-80.384-179.2-179.2-179.2a179.392 179.392 0 0 0-179.2 179.2A176.32 176.32 0 0 0 304.64 366.08z"/></svg>';

  /* ---------------- 胜利光点 / 彩纸 ---------------- */
  function winGlowHtml() {
    var colors = ["#ec4899", "#a855f7", "#fbbf24", "#34d399", "#f97316"], h = "";
    function dot(pos, color, delay) {
      return '<div class="absolute size-2.5 rounded-full" style="' + pos + ";background-color:" + color + ";box-shadow:0 0 15px 3px " + color + ";animation:pulse 0.4s ease-in-out infinite;animation-delay:" + delay + 's"></div>';
    }
    h += dot("top:-8px;left:-8px", "#ec4899", 0);
    h += dot("top:-8px;right:-8px", "#a855f7", 0.45);
    h += dot("bottom:-8px;left:-8px", "#fbbf24", 0.9);
    h += dot("bottom:-8px;right:-8px", "#34d399", 0.65);
    var i;
    for (i = 0; i < 16; i++) h += dot("top:-8px;left:" + ((i + 1) / 17 * 100) + "%", colors[i % 5], (i + 1) * 0.05);
    for (i = 0; i < 6; i++) h += dot("right:-8px;top:" + ((i + 1) / 7 * 100) + "%", colors[(i + 1) % 5], (i + 1) * 0.05 + 0.2);
    for (i = 0; i < 16; i++) h += dot("bottom:-8px;left:" + ((i + 1) / 17 * 100) + "%", colors[(i + 2) % 5], (i + 1) * 0.05 + 0.4);
    for (i = 0; i < 6; i++) h += dot("left:-8px;top:" + ((i + 1) / 7 * 100) + "%", colors[(i + 3) % 5], (i + 1) * 0.05 + 0.6);
    return h;
  }
  function confettiPortal() {
    var colors = ["#ec4899", "#a855f7", "#fbbf24", "#34d399"], h = "";
    for (var i = 0; i < 50; i++) {
      h += '<div class="absolute h-2 w-2 animate-fall" style="left:' + (100 * Math.random()) + '%;top:-10%;background-color:' + colors[Math.floor(4 * Math.random())] + ';animation-delay:' + (2 * Math.random()) + 's;animation-duration:' + (2 + 3 * Math.random()) + 's"></div>';
    }
    var fixed = document.createElement("div");
    fixed.className = "pointer-events-none fixed inset-0 z-[100] overflow-hidden";
    fixed.innerHTML = h;
    modalRoot.appendChild(fixed);
  }

  /* ---------------- 主渲染 ---------------- */
  function render() {
    root.innerHTML = "";
    modalRoot.innerHTML = "";
    var cur = S.players[S.playerIdx];

    var section = document.createElement("section");
    section.className = "glass-effect relative w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 p-4 sm:p-10";
    section.innerHTML =
      '<div class="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px] animate-pulse-slow"></div>' +
      '<div class="pointer-events-none absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-rose-600/20 blur-[120px] animate-pulse-slow" style="animation-delay:4s"></div>';

    /* header */
    var header = document.createElement("header");
    header.className = "relative z-10 flex flex-col items-center text-center";
    header.innerHTML =
      '<h1 class="bg-gradient-to-b from-white via-purple-100 to-white/60 bg-clip-text text-4xl font-black uppercase tracking-tighter text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] sm:text-5xl">' + LG.escapeHtml(e("title")) + "</h1>" +
      '<div class="mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-80"></div>' +
      '<p class="mt-4 text-sm font-medium tracking-[0.2em] text-white/40">' + LG.escapeHtml(e("tagline")) + "</p>";
    section.appendChild(header);

    var grid = document.createElement("div");
    grid.className = "mt-4 relative z-10 grid gap-8 lg:grid-cols-[1fr_320px]";

    /* ===== 左：游戏面板 ===== */
    var panel = document.createElement("div");
    panel.className = "relative flex flex-col items-center rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/5 to-white/10 p-4 sm:p-8 shadow-inner overflow-hidden";
    panel.innerHTML = '<div class="absolute inset-0 opacity-10" style="background-image:radial-gradient(#fff 1px, transparent 1px);background-size:24px 24px"></div>';

    /* 当前玩家胶囊 + 炸弹条 */
    var topBar = document.createElement("div");
    topBar.className = "relative z-10 mb-3 sm:mb-6 flex flex-col items-center justify-start gap-1.5 sm:gap-2 w-full min-h-[60px] sm:min-h-[80px]";
    topBar.innerHTML =
      '<div class="flex items-center justify-center gap-2 sm:gap-3 rounded-full border border-white/10 bg-black/40 px-3 sm:px-5 py-1.5 sm:py-2 shadow-lg backdrop-blur-md">' +
      '<div class="size-2 sm:size-2.5 rounded-full animate-pulse shadow-[0_0_8px_currentColor] shrink-0" style="background-color:' + cur.color + '"></div>' +
      '<div class="flex flex-col leading-none text-center"><span class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/40">' + LG.escapeHtml(e("resultPrefix")) + '</span>' +
      '<span class="text-xl sm:text-2xl font-bold text-white drop-shadow-md truncate max-w-[100px] sm:max-w-[120px]" style="color:' + cur.color + '">' + LG.escapeHtml(cur.name) + "</span></div></div>";
    if (S.bombCount > 0) topBar.innerHTML += bombBarHtml();
    panel.appendChild(topBar);

    /* 转轴网格 */
    var reelWrap = document.createElement("div");
    reelWrap.className = "relative z-10 w-full grid grid-cols-3 gap-2 sm:gap-4 " + (S.phase === "idle" || S.phase === "result" ? "cursor-pointer" : "");
    reelWrap.addEventListener("click", function () {
      if (S.phase === "idle") spin();
      else if (S.phase === "result") nextPlayer();
    });
    if ((S.phase === "result" || S.phase === "celebrating" || S.phase === "win") && S.resultScore > 10) {
      var glow = document.createElement("div");
      glow.className = "absolute -inset-2 pointer-events-none z-20";
      glow.innerHTML = winGlowHtml();
      reelWrap.appendChild(glow);
    }
    var mount0 = document.createElement("div");
    reelWrap.appendChild(mount0); mount0.appendChild(reels[0].el);
    var mount1 = document.createElement("div");
    reelWrap.appendChild(mount1); mount1.appendChild(reels[1].el);
    var mount2 = document.createElement("div");
    reelWrap.appendChild(mount2); mount2.appendChild(reels[2].el);
    panel.appendChild(reelWrap);

    /* 结果区 */
    var resultArea = document.createElement("div");
    resultArea.className = "relative z-10 h-[140px] sm:h-[200px] flex flex-col items-center justify-center w-full gap-1 sm:gap-2 mt-3 sm:mt-6";
    if (S.phase === "result" || S.phase === "celebrating" || S.phase === "win") {
      var box = document.createElement("div");
      box.className = "relative animate-pop-in flex flex-col items-center w-full";
      var inner = "";
      if (S.bombExploding) {
        inner += '<div class="absolute inset-x-0 -top-16 sm:-top-20 flex flex-col items-center justify-start z-30 animate-bounce">' +
          '<span class="text-3xl sm:text-5xl animate-ping-once">💥</span>' +
          '<span class="text-base sm:text-xl font-black text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] mt-0.5 sm:mt-1">' + LG.escapeHtml(e("bomb.exploded")) + "</span>" +
          '<span class="text-[10px] sm:text-xs font-bold text-red-400">-50 ' + LG.escapeHtml(e("bomb.penalty")) + "</span></div>";
      }
      if (S.resultName) {
        inner += '<div class="mb-1.5 sm:mb-2 flex flex-col items-center">' +
          '<span class="text-xl sm:text-3xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] animate-bounce">' + LG.escapeHtml(S.resultName) + "</span>" +
          '<span class="text-[10px] sm:text-xs font-bold uppercase tracking-widest ' + (S.resultScore > 0 ? "text-green-400" : "text-red-400") + '">' +
          (S.resultScore > 0 ? "+" : "") + S.resultScore + " pts</span></div>";
      }
      inner += comboSentenceHtml();
      box.innerHTML = inner;
      resultArea.appendChild(box);
    }
    panel.appendChild(resultArea);

    /* 按钮区 */
    var btnArea = document.createElement("div");
    btnArea.className = "relative z-10 w-full max-w-xs h-[52px] sm:h-[60px] flex items-center justify-center mt-2 sm:mt-0";
    if (S.phase === "idle") {
      btnArea.innerHTML = '<button data-spin class="cursor-pointer group relative w-full overflow-hidden rounded-xl sm:rounded-2xl bg-white py-3 sm:py-4 text-xs sm:text-sm font-black uppercase tracking-widest text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] active:scale-95"><span class="relative z-10">' + LG.escapeHtml(e("spin")) + '</span><div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gray-200 to-transparent transition-transform duration-700 group-hover:animate-shimmer"></div></button>';
      btnArea.querySelector("[data-spin]").addEventListener("click", function (ev) { ev.stopPropagation(); spin(); });
    } else if (S.phase === "result") {
      btnArea.innerHTML = '<button data-next class="cursor-pointer group w-full rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-400 to-green-600 py-3 sm:py-4 text-xs sm:text-sm font-black uppercase tracking-widest text-white shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] active:scale-95">' + LG.escapeHtml(e("nextPlayer")) + "</button>";
      btnArea.querySelector("[data-next]").addEventListener("click", function (ev) { ev.stopPropagation(); nextPlayer(); });
    } else if (S.phase === "win") {
      btnArea.innerHTML = '<button data-win class="cursor-pointer group w-full rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 py-3 sm:py-4 text-xs sm:text-sm font-black uppercase tracking-widest text-white shadow-[0_0_30px_rgba(192,38,211,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(192,38,211,0.7)] active:scale-95">' + LG.escapeHtml(e("playAgain")) + "</button>";
      btnArea.querySelector("[data-win]").addEventListener("click", function (ev) { ev.stopPropagation(); reset(); });
    }
    panel.appendChild(btnArea);

    grid.appendChild(panel);

    /* ===== 右：侧栏 ===== */
    var side = document.createElement("div");
    side.className = "flex flex-col gap-5";

    var playersCard = document.createElement("div");
    playersCard.className = "group rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/5 to-black/40 p-6 transition-colors hover:border-white/20 hover:bg-white/10 flex-1";
    playersCard.innerHTML =
      '<div class="flex items-center justify-between mb-5"><h3 class="text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white/70 transition-colors">' + LG.escapeHtml(e("editor.players")) + "</h3>" +
      '<button data-edit-players title="' + LG.escapeHtml(e("editor.players")) + '" class="cursor-pointer rounded-full bg-white/5 p-1.5 transition-colors hover:bg-white/10 text-white/40 hover:text-white">' +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z"/><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z"/></svg></button></div>';
    var list = document.createElement("div");
    list.className = "space-y-4 overflow-y-auto max-h-[130px] sm:max-h-[400px] custom-scrollbar pr-1";
    list.innerHTML = S.players.map(function (p, s) {
      return '<div id="player-card-' + s + '" class="relative overflow-hidden rounded-xl border p-3 transition-all duration-300 ' + (S.playerIdx === s ? "border-white/20 bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "border-white/5 bg-black/20 opacity-60 grayscale-[0.3]") + '">' +
        '<div class="flex items-center justify-between mb-2"><div class="flex items-center gap-2"><div class="size-6 rounded-full border border-white/20 shadow-lg text-white flex items-center justify-center font-bold text-[10px]" style="background-color:' + p.color + '">' + LG.escapeHtml(p.name.charAt(0)) + "</div>" +
        '<span class="font-bold text-white text-sm">' + LG.escapeHtml(p.name) + '</span></div><span class="text-sm font-black text-white/80">' + p.score + "</span></div>" +
        '<div class="h-1.5 w-full rounded-full bg-black/40 overflow-hidden"><div class="h-full transition-all duration-1000 ease-out relative" style="width:' + Math.min(p.score / S.winScore * 100, 100) + '%;background-color:' + p.color + '"></div></div></div>';
    }).join("");
    playersCard.appendChild(list);
    playersCard.querySelector("[data-edit-players]").addEventListener("click", openPlayersModal);
    side.appendChild(playersCard);

    /* 编辑入口卡 */
    var editCard = document.createElement("div");
    editCard.className = "group relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/5 to-black/40 p-6 cursor-pointer transition-all hover:border-pink-500/30 hover:bg-pink-900/10";
    editCard.innerHTML =
      '<div class="absolute top-3 right-3 z-20"><button data-open-libs title="' + LG.escapeHtml(e("library.title")) + '" class="cursor-pointer rounded-full bg-purple-500/20 p-2 text-purple-300 transition hover:bg-purple-500/30 border border-purple-500/30 hover:scale-105"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg></button></div>' +
      '<div class="relative z-10 flex flex-col h-full min-h-[100px] justify-center items-center text-center gap-3"><div class="rounded-full bg-white/5 p-3 transition-colors group-hover:bg-white/10"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white/40 group-hover:text-pink-300"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"/></svg></div>' +
      '<div><h3 class="text-sm font-bold text-white/60 group-hover:text-pink-200 transition-colors">' + LG.escapeHtml(e("editor.title")) + '</h3><p class="text-[10px] text-white/30 mt-1">' + LG.escapeHtml(e("editor.reels")) + "</p></div></div>";
    editCard.addEventListener("click", function (ev) {
      if (ev.target.closest("[data-open-libs]")) return;
      openEditorModal();
    });
    editCard.querySelector("[data-open-libs]").addEventListener("click", function (ev) { ev.stopPropagation(); openLibraryModal(); });
    side.appendChild(editCard);

    /* 重置按钮 */
    var resetBtn = document.createElement("button");
    resetBtn.className = "cursor-pointer group flex w-full items-center justify-center gap-2 rounded-[2rem] border border-white/10 bg-white/5 p-4 transition-all hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-200 text-white/40";
    resetBtn.innerHTML = '<span class="text-xs font-bold uppercase tracking-widest">' + LG.escapeHtml(e("playAgain")) + "</span>";
    resetBtn.addEventListener("click", reset);
    side.appendChild(resetBtn);

    grid.appendChild(side);
    section.appendChild(grid);
    root.appendChild(section);

    /* portals */
    if (S.phase === "celebrating" || S.phase === "win") confettiPortal();
    if (S.phase === "win") winModal();
    persist();
  }

  function bombBarHtml() {
    var c = S.bombCount;
    var barColor = c >= 4 ? "#ef4444" : c >= 3 ? "#f97316" : "#fbbf24";
    var shadow = c >= 4 ? "0 0 6px rgba(239,68,68,0.5)" : "0 0 4px rgba(249,115,22,0.4)";
    return '<div class="w-full max-w-md flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-orange-500/20 bg-black/30 backdrop-blur-sm">' +
      '<span class="text-base sm:text-lg shrink-0 ' + (c >= 4 ? "animate-bounce" : "") + ' ' + (S.bombExploding ? "animate-ping" : "") + '">💣</span>' +
      '<div class="flex-1 h-1 sm:h-1.5 rounded-full bg-black/60 overflow-hidden shadow-inner"><div class="h-full transition-all duration-300 ease-out ' + (c >= 4 ? "animate-pulse" : "") + '" style="width:' + (c / 5 * 100) + '%;background-color:' + barColor + ';box-shadow:' + shadow + '"></div></div>' +
      '<span class="text-[9px] sm:text-[10px] font-bold text-orange-400/80 shrink-0 min-w-[18px] sm:min-w-[20px] text-right">' + c + "/5</span></div>";
  }
  function comboSentenceHtml() {
    var ti = lastTargets;
    if (!ti) return "";
    var parts = [
      { text: S.reels[0][ti[0]].text, icon: ICON_PIN },
      { text: S.reels[1][ti[1]].text, icon: ICON_HAND },
      { text: S.reels[2][ti[2]].text, icon: ICON_HEART }
    ];
    var spans = parts.map(function (p) {
      return '<span class="flex items-center gap-0.5 sm:gap-1">' + p.icon + '<span class="truncate max-w-[80px] sm:max-w-none">' + LG.escapeHtml(p.text) + "</span></span>";
    }).join("");
    return '<div class="rounded-lg sm:rounded-xl border border-pink-500/30 bg-pink-500/10 px-3 sm:px-6 py-2 sm:py-3 backdrop-blur-md"><p class="flex flex-wrap justify-center items-center gap-x-1.5 sm:gap-x-2 text-sm sm:text-lg lg:text-xl font-bold text-white leading-relaxed drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">' + spans + "</p></div>";
  }

  /* ---------------- 胜利全屏弹窗 ---------------- */
  function winModal() {
    var cur = S.players[S.playerIdx];
    var msg = e("winMessage", { name: "" });
    if (typeof msg === "string") msg = msg.replace(/\s+/g, " ").trim();
    var overlay = document.createElement("div");
    overlay.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl fade-in";
    overlay.innerHTML =
      '<div class="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-yellow-500/30 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-8 text-center shadow-[0_0_60px_rgba(234,179,8,0.3)] modal-pop"><div class="relative z-10">' +
      '<div class="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-yellow-500/20 text-4xl animate-bounce">🏆</div>' +
      '<h2 class="text-2xl font-black uppercase tracking-tight text-yellow-400 mb-4">' + LG.escapeHtml(e("winTitle")) + "</h2>" +
      '<div class="mb-8 flex flex-col items-center gap-3"><span class="text-3xl font-black bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">' + LG.escapeHtml(cur.name) + "</span>" +
      '<p class="text-white/80 text-sm">' + LG.escapeHtml(msg) + "</p></div>" +
      '<button data-again class="cursor-pointer w-full rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 py-4 text-sm font-bold uppercase tracking-widest text-black transition hover:scale-105">' + LG.escapeHtml(e("playAgain")) + "</button></div></div>";
    overlay.querySelector("[data-again]").addEventListener("click", reset);
    overlay.addEventListener("click", function (ev) { if (ev.target === overlay) overlay.remove(); });
    modalRoot.appendChild(overlay);
  }

  /* ---------------- 游戏流程 ---------------- */
  var lastTargets = null, lastCards = null;
  function spin() {
    if (S.phase !== "idle") return;
    S.phase = "spinning";
    S.resultName = ""; S.resultScore = 0; S.bombExploding = false;
    lastTargets = [LG.randInt(S.reels[0].length), LG.randInt(S.reels[1].length), LG.randInt(S.reels[2].length)];
    lastCards = [{ suit: randSuit(), rank: randRank() }, { suit: randSuit(), rank: randRank() }, { suit: randSuit(), rank: randRank() }];
    reels.forEach(function (r) { r.start(); });
    LG.sound.play("spin");
    spinSoundTimer = setInterval(function () { LG.sound.play("spin"); }, 800);
    setTimeout(function () {
      reels.forEach(function (r, i) { r.stopAt(lastTargets[i], lastCards[i]); });
      S.phase = "settling";
      LG.recordDetailStat("slotsSpins");
    }, 2000);
    setTimeout(function () {
      clearInterval(spinSoundTimer);
      var hand = evaluateHand(lastCards);
      S.phase = "result";
      LG.sound.play("stop");
      S.resultName = hand.name; S.resultScore = hand.score;
      applyScore(hand);
      render();
    }, 4600);
  }
  function applyScore(hand) {
    var ps = S.players.map(function (p) { return Object.assign({}, p); });
    var delta = hand.score, explode = false, bomb = S.bombCount;
    if (hand.score <= 0) {
      bomb = S.bombCount + 1;
      if (bomb >= 5) { explode = true; delta -= 50; bomb = 0; }
    } else { bomb = 0; }
    S.bombCount = bomb;
    if (explode) {
      S.bombExploding = true;
      bombAudio.currentTime = 0; bombAudio.play().catch(function () {});
      setTimeout(function () { S.bombExploding = false; render(); }, 2000);
    }
    if (hand.score > 10) { bonusAudio.currentTime = 0; bonusAudio.play().catch(function () {}); }
    var newScore = Math.max(0, ps[S.playerIdx].score + delta);
    ps[S.playerIdx].score = newScore;
    S.players = ps;
    if (newScore >= S.winScore) {
      ps[S.playerIdx].score = S.winScore;
      LG.recordDetailStat("slotsWins");
      LG.incrementGameSession("slots", 5);
      setTimeout(function () {
        S.phase = "celebrating"; LG.sound.play("jackpot"); render();
        setTimeout(function () { S.phase = "win"; render(); }, 2000);
      }, 500);
    }
    if (hand.score === 150) LG.recordDetailStat("slotsInm");
    if (hand.score === 500) LG.recordDetailStat("slotsStraightFlush");
    if (hand.score === 30) LG.recordDetailStat("slotsFlush");
  }
  function nextPlayer() {
    LG.sound.play("select");
    if (S.phase === "win") return;
    S.phase = "idle"; S.resultName = ""; S.resultScore = 0;
    reels.forEach(function (r) { r.clearTarget(); });
    S.playerIdx = (S.playerIdx + 1) % S.players.length;
    render();
    var idx = S.playerIdx;
    setTimeout(function () {
      var card = document.getElementById("player-card-" + idx);
      if (card) card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  }
  function reset() {
    LG.sound.play("start");
    S.players = S.players.map(function (p) { return Object.assign({}, p, { score: 0 }); });
    S.phase = "idle"; S.resultName = ""; S.resultScore = 0; S.playerIdx = 0;
    S.bombCount = 0; S.bombExploding = false;
    reels.forEach(function (r) { r.clearTarget(); });
    render();
  }

  /* ---------------- 通用 overlay ---------------- */
  function overlay(box) {
    var ov = document.createElement("div");
    ov.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md fade-in";
    ov.appendChild(box);
    ov.addEventListener("click", function (ev) { if (ev.target === ov) ov.remove(); });
    modalRoot.appendChild(ov);
    return ov;
  }

  /* ---------------- 编辑器弹窗 ---------------- */
  var editorTab = 0;
  function openEditorModal() {
    editorTab = 0;
    var box = document.createElement("div");
    box.className = "w-full max-w-2xl flex-col rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-6 shadow-2xl max-h-[90vh] flex modal-pop";
    function draw() {
      var labelsHtml = S.labels.map(function (l, s) {
        return '<button data-tab="' + s + '" class="cursor-pointer flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ' + (editorTab === s ? "bg-white/10 text-white border-b-2 border-pink-500" : "text-white/40 hover:text-white hover:bg-white/5") + '">' + LG.escapeHtml(l) + "</button>";
      }).join("");
      var items = S.reels[editorTab];
      var itemsHtml = items.map(function (it) {
        return '<div class="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 hover:bg-white/10 transition-colors">' +
          '<input data-edit-item="' + it.id + '" value="' + LG.escapeHtml(it.text) + '" class="flex-1 bg-transparent text-sm font-medium text-white focus:outline-none" />' +
          '<button data-del-item="' + it.id + '" class="cursor-pointer p-1 text-white/20 hover:text-rose-500 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg></button></div>';
      }).join("");
      box.innerHTML =
        '<div class="flex items-center justify-between mb-6"><h3 class="text-lg font-bold text-white">' + LG.escapeHtml(e("editor.title")) + '</h3>' +
        '<button data-close class="cursor-pointer rounded-full bg-white/5 size-8 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-colors">✕</button></div>' +
        '<div class="flex border-b border-white/10 mb-4">' + labelsHtml + "</div>" +
        '<div class="rounded-xl bg-white/5 p-4 mb-4 border border-white/5"><h4 class="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">' + LG.escapeHtml(e("editor.editLabel")) + "</h4>" +
        '<div class="flex flex-col gap-2 sm:flex-row items-center"><input data-label value="' + LG.escapeHtml(S.labels[editorTab]) + '" placeholder="' + LG.escapeHtml(e("editor.labelPlaceholder")) + '" class="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-pink-500 focus:outline-none" />' +
        '<button data-reset-label class="cursor-pointer rounded-lg bg-white/10 px-4 py-2 font-bold text-white hover:bg-white/20 text-xs whitespace-nowrap">' + LG.escapeHtml(e("editor.resetLabel")) + "</button></div></div>" +
        '<div class="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-4"><div class="space-y-2">' + itemsHtml + "</div></div>" +
        '<div class="rounded-xl bg-white/5 p-4 mb-6 border border-white/5"><h4 class="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">' + LG.escapeHtml(e("editor.addNew")) + "</h4>" +
        '<div class="flex flex-col gap-2 sm:flex-row"><input data-new placeholder="' + LG.escapeHtml(e("editor.placeholder")) + '" class="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-pink-500 focus:outline-none" />' +
        '<button data-add class="cursor-pointer rounded-lg bg-pink-600 px-4 font-bold text-white hover:bg-pink-500">+</button></div></div>' +
        '<div class="mt-4 flex gap-3"><button data-defaults class="cursor-pointer flex-1 rounded-xl bg-white/10 py-3 text-sm font-bold text-rose-400 hover:bg-white/20 uppercase tracking-wide">' + LG.escapeHtml(e("resetToDefaults")) + "</button>" +
        '<button data-done class="cursor-pointer flex-1 rounded-xl bg-white py-3 text-sm font-bold text-black hover:bg-gray-200">' + LG.escapeHtml(e("done")) + "</button></div>";

      /* 事件 */
      box.querySelector("[data-close]").addEventListener("click", function () { ov.remove(); });
      box.querySelector("[data-done]").addEventListener("click", function () { ov.remove(); });
      box.querySelectorAll("[data-tab]").forEach(function (b) {
        b.addEventListener("click", function () { editorTab = Number(b.getAttribute("data-tab")); draw(); });
      });
      box.querySelector("[data-label]").addEventListener("input", function (ev) {
        var labs = S.labels.slice(); labs[editorTab] = ev.target.value; S.labels = labs;
        if (reels[editorTab]) reels[editorTab].labelEl.textContent = ev.target.value;
      });
      box.querySelector("[data-reset-label]").addEventListener("click", function () {
        var def = defaultLabels(), labs = S.labels.slice(); labs[editorTab] = def[editorTab]; S.labels = labs; draw();
        reels[editorTab].labelEl.textContent = def[editorTab];
      });
      box.querySelectorAll("[data-edit-item]").forEach(function (inp) {
        inp.addEventListener("input", function () {
          var id = inp.getAttribute("data-edit-item");
          var rs = S.reels.slice();
          rs[editorTab] = rs[editorTab].map(function (it) { return it.id === id ? { id: it.id, text: inp.value } : it; });
          S.reels = rs;
        });
      });
      box.querySelectorAll("[data-del-item]").forEach(function (b) {
        b.addEventListener("click", function () {
          if (S.reels[editorTab].length <= 1) return;
          var id = b.getAttribute("data-del-item");
          var rs = S.reels.slice();
          rs[editorTab] = rs[editorTab].filter(function (it) { return it.id !== id; });
          S.reels = rs; draw();
        });
      });
      var newInp = box.querySelector("[data-new]");
      box.querySelector("[data-add]").addEventListener("click", function () {
        if (!newInp.value.trim()) return;
        var rs = S.reels.slice();
        rs[editorTab] = rs[editorTab].concat([{ id: randId(), text: newInp.value }]);
        S.reels = rs; newInp.value = ""; draw();
      });
      newInp.addEventListener("keydown", function (ev) { if (ev.key === "Enter") box.querySelector("[data-add]").click(); });
      box.querySelector("[data-defaults]").addEventListener("click", function () {
        S.reels = defaultReels();
        localStorage.removeItem("slots.reels_v2");
        reels.forEach(function (r) { r.destroy(); });
        reels = [new Reel(0), new Reel(1), new Reel(2)];
        ov.remove();
      });
    }
    var ov = overlay(box);
    draw();
  }

  /* ---------------- 玩家弹窗 ---------------- */
  function openPlayersModal() {
    var box = document.createElement("div");
    box.className = "w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-6 shadow-2xl max-h-[90vh] flex flex-col modal-pop";
    function draw() {
      var rows = S.players.map(function (p, s) {
        return '<div class="flex gap-2 items-center bg-white/5 p-2 rounded-xl border border-white/5">' +
          '<input type="color" data-color="' + s + '" value="' + p.color + '" class="size-8 rounded cursor-pointer bg-transparent border-none shrink-0" />' +
          '<input data-pname="' + s + '" value="' + LG.escapeHtml(p.name) + '" class="flex-1 rounded bg-transparent px-2 py-1 text-sm text-white focus:outline-none focus:underline font-bold" />' +
          (S.players.length > 2 ? '<button data-pdel="' + s + '" class="cursor-pointer text-white/20 hover:text-red-500 p-2">✕</button>' : "") + "</div>";
      }).join("");
      box.innerHTML =
        '<div class="flex items-center justify-between mb-6"><h3 class="text-lg font-bold text-white">' + LG.escapeHtml(e("editor.players")) + "</h3>" +
        '<button data-close class="cursor-pointer rounded-full bg-white/5 size-8 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-colors">✕</button></div>' +
        '<div class="flex items-center gap-2 mb-4 p-3 bg-white/5 rounded-xl border border-white/5"><span class="text-sm text-white/60 uppercase tracking-wide flex-1">' + LG.escapeHtml(e("editor.targetScore")) + "</span>" +
        '<input type="number" data-score value="' + S.winScore + '" class="w-20 rounded bg-black/40 px-3 py-2 text-right text-white font-bold border border-white/10 focus:border-pink-500 focus:outline-none" /></div>' +
        '<div class="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1 flex-1">' + rows + "</div>" +
        '<button data-add class="cursor-pointer mt-4 w-full rounded-xl bg-white/10 py-3 text-sm font-bold text-pink-400 hover:bg-white/20 hover:text-pink-300 uppercase tracking-wide border border-dashed border-white/20">+ ' + LG.escapeHtml(e("editor.addPlayer")) + "</button>" +
        '<div class="mt-6"><button data-done class="cursor-pointer w-full rounded-xl bg-white py-3 text-sm font-bold text-black hover:bg-gray-200">' + LG.escapeHtml(e("done")) + "</button></div>";

      box.querySelector("[data-close]").addEventListener("click", function () { ov.remove(); });
      box.querySelector("[data-done]").addEventListener("click", function () { ov.remove(); });
      box.querySelector("[data-score]").addEventListener("input", function (ev) { S.winScore = Number(ev.target.value); });
      box.querySelectorAll("[data-color]").forEach(function (inp) {
        inp.addEventListener("input", function () {
          var s = Number(inp.getAttribute("data-color"));
          var ps = S.players.slice(); ps[s] = Object.assign({}, ps[s], { color: inp.value }); S.players = ps;
        });
      });
      box.querySelectorAll("[data-pname]").forEach(function (inp) {
        inp.addEventListener("input", function () {
          var s = Number(inp.getAttribute("data-pname"));
          var ps = S.players.slice(); ps[s] = Object.assign({}, ps[s], { name: inp.value }); S.players = ps;
        });
      });
      box.querySelectorAll("[data-pdel]").forEach(function (b) {
        b.addEventListener("click", function () {
          var s = Number(b.getAttribute("data-pdel"));
          S.players = S.players.filter(function (_, i) { return i !== s; });
          if (S.playerIdx >= S.players.length) S.playerIdx = 0;
          draw();
        });
      });
      box.querySelector("[data-add]").addEventListener("click", function () {
        S.players = S.players.concat([{ id: randId(), name: e("editor.newPlayer") + " " + (S.players.length + 1), score: 0, color: "#a855f7" }]);
        draw();
      });
    }
    var ov = overlay(box);
    draw();
  }

  /* ---------------- 内容库弹窗 ---------------- */
  var libRenameId = null, libRenameText = "";
  function openLibraryModal() {
    var box = document.createElement("div");
    box.className = "w-full max-w-2xl rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-6 shadow-2xl flex flex-col max-h-[80vh] modal-pop";
    function draw() {
      var listHtml;
      var all = Object.values(S.libs);
      if (!all.length) {
        listHtml = '<div class="text-center py-12 text-white/40"><p>' + LG.escapeHtml(e("library.empty")) + "</p></div>";
      } else {
        listHtml = all.sort(function (a, b) { return b.createdAt - a.createdAt; }).map(function (lib) {
          var isActive = S.activeLib === lib.id;
          var count = lib.reels[0].length + lib.reels[1].length + lib.reels[2].length;
          var title;
          if (libRenameId === lib.id) {
            title = '<input data-rename-input value="' + LG.escapeHtml(libRenameText) + '" class="w-full max-w-[200px] rounded border border-purple-500/50 bg-black/40 px-2 py-0.5 text-sm text-white font-bold focus:outline-none focus:border-purple-500" />';
          } else {
            title = '<h4 data-start-rename="' + lib.id + '" class="font-bold text-white ' + (lib.isDefault ? "" : "cursor-pointer hover:text-purple-300 hover:underline decoration-dashed underline-offset-4") + '" ' + (lib.isDefault ? "" : 'title="Click to rename"') + ">" + LG.escapeHtml(lib.name) + "</h4>";
          }
          var badges = "";
          if (isActive) badges += '<span class="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-300 border border-purple-500/30 whitespace-nowrap">' + LG.escapeHtml(e("library.activeBadge")) + "</span>";
          if (lib.isDefault) badges += '<span class="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/50 whitespace-nowrap">' + LG.escapeHtml(e("library.defaultBadge")) + "</span>";
          var btns = '<button data-use="' + lib.id + '" class="cursor-pointer rounded-full border border-sky-400/60 px-3 py-1 font-semibold uppercase tracking-widest text-sky-100 transition hover:border-sky-300 hover:text-sky-50 whitespace-nowrap">' + LG.escapeHtml(isActive ? e("library.reload") : e("library.use")) + "</button>";
          if (!lib.isDefault) {
            btns += '<button data-overwrite="' + lib.id + '" class="cursor-pointer rounded-full border border-amber-400/60 px-3 py-1 font-semibold uppercase tracking-widest text-amber-100 transition hover:border-amber-300 hover:text-amber-50 whitespace-nowrap">' + LG.escapeHtml(e("library.overwrite")) + "</button>";
            btns += '<button data-delete="' + lib.id + '" class="cursor-pointer rounded-full border border-rose-400/60 px-3 py-1 font-semibold uppercase tracking-widest text-rose-100 transition hover:border-rose-300 hover:text-rose-50 whitespace-nowrap">' + LG.escapeHtml(e("library.delete")) + "</button>";
          }
          return '<div class="rounded-xl border p-4 transition-all ' + (isActive ? "border-purple-500/50 bg-purple-500/10" : "border-white/10 bg-white/5") + '"><div class="flex flex-col gap-3"><div class="flex-1"><div class="flex flex-wrap items-center gap-2 mb-1">' + title + badges + '</div>' +
            '<p class="text-xs text-white/60">' + LG.escapeHtml(e("library.stats", { count: count })) + "</p></div>" +
            '<div class="flex flex-wrap gap-2 text-[11px]">' + btns + "</div></div></div>";
        }).join("");
      }
      box.innerHTML =
        '<div class="flex items-center justify-between mb-6"><div><h3 class="text-lg font-bold text-white flex items-center gap-2"><span>📚</span><span>' + LG.escapeHtml(e("library.title")) + '</span></h3>' +
        '<p class="text-sm text-white/60 mt-1">' + LG.escapeHtml(e("library.subtitle")) + "</p></div>" +
        '<button data-close class="cursor-pointer rounded-full bg-white/5 size-8 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-colors">✕</button></div>' +
        '<div data-error></div>' +
        '<div class="mb-6 rounded-xl border border-white/10 bg-white/5 p-4"><label class="text-sm font-semibold text-white/80 mb-2 block">' + LG.escapeHtml(e("library.newLabel")) + "</label>" +
        '<div class="flex flex-col sm:flex-row gap-2"><input data-newlib placeholder="' + LG.escapeHtml(e("library.namePlaceholder")) + '" class="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-white focus:outline-none focus:border-purple-500" />' +
        '<button data-savelib class="cursor-pointer rounded-xl bg-purple-600 px-6 py-2 font-bold text-white hover:bg-purple-500 whitespace-nowrap">' + LG.escapeHtml(e("library.saveNew")) + "</button></div></div>" +
        '<div class="flex-1 overflow-y-auto custom-scrollbar space-y-3">' + listHtml + "</div>" +
        '<div class="mt-6"><button data-done class="cursor-pointer w-full rounded-xl bg-white py-3 text-sm font-bold text-black hover:bg-gray-200">' + LG.escapeHtml(e("library.close")) + "</button></div>";

      box.querySelector("[data-close]").addEventListener("click", function () { ov.remove(); });
      box.querySelector("[data-done]").addEventListener("click", function () { ov.remove(); });

      var newInp = box.querySelector("[data-newlib]");
      function saveNew() {
        var name = newInp.value.trim();
        if (!name) { showLibError(e("library.nameRequired")); return; }
        if (Object.values(S.libs).some(function (l) { return l.name.toLowerCase() === name.toLowerCase(); })) { showLibError(e("library.nameExists")); return; }
        var lib = { id: randId(), name: name, reels: [S.reels[0].map(function (c) { return Object.assign({}, c); }), S.reels[1].map(function (c) { return Object.assign({}, c); }), S.reels[2].map(function (c) { return Object.assign({}, c); })], createdAt: Date.now() };
        S.libs[lib.id] = lib; S.activeLib = lib.id; newInp.value = ""; draw();
      }
      function showLibError(msg) { var ec = box.querySelector("[data-error]"); ec.innerHTML = '<div class="mb-4 rounded-xl bg-rose-500/20 border border-rose-500/30 p-3 text-sm text-rose-200">' + LG.escapeHtml(msg) + "</div>"; }
      box.querySelector("[data-savelib]").addEventListener("click", saveNew);
      newInp.addEventListener("keydown", function (ev) { if (ev.key === "Enter") saveNew(); });

      box.querySelectorAll("[data-use]").forEach(function (b) {
        b.addEventListener("click", function () { useLibrary(b.getAttribute("data-use")); });
      });
      box.querySelectorAll("[data-overwrite]").forEach(function (b) {
        b.addEventListener("click", function () {
          var id = b.getAttribute("data-overwrite"), t = S.libs[id];
          if (!t) return;
          if (t.isDefault) { showLibError(e("library.overwriteDefault")); return; }
          S.libs[id] = Object.assign({}, t, { reels: [S.reels[0].map(function (c) { return Object.assign({}, c); }), S.reels[1].map(function (c) { return Object.assign({}, c); }), S.reels[2].map(function (c) { return Object.assign({}, c); })], createdAt: Date.now() });
          draw();
        });
      });
      box.querySelectorAll("[data-delete]").forEach(function (b) {
        b.addEventListener("click", function () {
          var id = b.getAttribute("data-delete"), t = S.libs[id];
          if (!t) return;
          if (t.isDefault) { showLibError(e("library.deleteDefault")); return; }
          var rest = Object.assign({}, S.libs); delete rest[id];
          S.libs = rest;
          if (S.activeLib === id) {
            var def = Object.values(rest).find(function (l) { return l.isDefault; });
            if (def) { S.activeLib = def.id; useLibrary(def.id); return; }
          }
          draw();
        });
      });
      box.querySelectorAll("[data-start-rename]").forEach(function (h) {
        h.addEventListener("click", function () {
          var id = h.getAttribute("data-start-rename");
          libRenameId = id; libRenameText = S.libs[id].name; draw();
          var ri = box.querySelector("[data-rename-input]");
          if (ri) ri.focus();
        });
      });
      var ri2 = box.querySelector("[data-rename-input]");
      if (ri2) {
        ri2.addEventListener("blur", commitRename);
        ri2.addEventListener("keydown", function (ev) {
          if (ev.key === "Enter") commitRename();
          if (ev.key === "Escape") { libRenameId = null; draw(); }
        });
      }
      function commitRename() {
        if (!libRenameId) return;
        var name = ri2.value.trim();
        if (name) S.libs[libRenameId].name = name;
        libRenameId = null; draw();
      }
    }
    function useLibrary(id) {
      var lib = S.libs[id];
      if (!lib) return;
      S.reels = [lib.reels[0].map(function (c) { return Object.assign({}, c); }), lib.reels[1].map(function (c) { return Object.assign({}, c); }), lib.reels[2].map(function (c) { return Object.assign({}, c); })];
      S.activeLib = id;
      S.phase = "idle"; S.resultName = ""; S.resultScore = 0; S.bombCount = 0;
      rebuildReels();
      ov.remove();
      render();
    }
    var ov = overlay(box);
    draw();
  }

  /* ---------------- 启动 ---------------- */
  render();
})();
