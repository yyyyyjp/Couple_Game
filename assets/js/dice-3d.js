/* ============================================================
 * Dice3D - 全局通用 3D 物理级实心骰子引擎
 * 采用：
 * 1. 6 面高精度咬合 + 实心防漏光内胆 (彻底解决面与面之间空白空心问题)
 * 2. 连续动力学抛掷 (空中三轴飞旋 + 真实抛物线 + 落地双重弹性回弹，杜绝帧突变)
 * 3. 动态地面拟真投影 (随抛起高度软化变淡，落地聚拢)
 * ============================================================ */
(function (global) {
  "use strict";

  // 9 格点阵索引 (3x3: 0~8)
  const PIPS_MAP = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8]
  };

  // 6 个点数面对观察者时的基准旋转欧拉角 (0~360度标准角)
  const FACE_ANGLES = {
    1: { x: 0, y: 0 },
    2: { x: 90, y: 0 },
    3: { x: 0, y: 90 },
    4: { x: 0, y: 270 },
    5: { x: 270, y: 0 },
    6: { x: 180, y: 0 }
  };

  /**
   * 生成单个面 (face) 的 HTML，精雕凹陷圆点与内嵌圆润面板
   */
  function buildFaceHtml(val) {
    const pips = PIPS_MAP[val] || [];
    let pipsHtml = "";
    for (let i = 0; i < 9; i++) {
      const isPip = pips.includes(i);
      const isRed = (val === 1 || val === 4) && isPip;
      const pipClass = isPip ? `dice-pip ${isRed ? "pip-red" : ""}` : "w-2.5 h-2.5 opacity-0";
      pipsHtml += `<div class="${pipClass}"></div>`;
    }
    return `<div class="dice-3d-face dice-face-${val}"><div class="dice-face-inner">${pipsHtml}</div></div>`;
  }

  /**
   * 生成完整 3D 实心圆润骰子 HTML 结构
   * 包含：地面软阴影、垂直抛跃层 (toss)、6 个微重叠圆润面板
   */
  function buildDiceHtml(initialValue, id) {
    initialValue = initialValue || 1;
    let faces = "";
    for (let v = 1; v <= 6; v++) {
      faces += buildFaceHtml(v);
    }
    const base = FACE_ANGLES[initialValue] || FACE_ANGLES[1];
    const transform = `rotateX(${base.x}deg) rotateY(${base.y}deg) rotateZ(0deg)`;

    return `
      <div class="dice-3d-scene" data-dice-id="${id || 'dice'}">
        <div class="dice-3d-shadow"></div>
        <div class="dice-3d-toss">
          <div class="dice-3d-wrapper" style="transform:${transform}">
            ${faces}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 3D 实心骰子控制器类
   */
  class DiceInstance {
    constructor(container, options) {
      this.container = typeof container === "string" ? document.querySelector(container) : container;
      this.options = Object.assign({
        initialValue: 1,
        sound: true,
        id: "dice-" + Math.random().toString(36).slice(2, 7)
      }, options);

      this.value = this.options.initialValue;
      this.isRolling = false;

      // 跟踪累计旋转欧拉角，实现无限平滑连续翻滚
      const base = FACE_ANGLES[this.value] || FACE_ANGLES[1];
      this.currentX = base.x;
      this.currentY = base.y;
      this.currentZ = 0;

      this.render();
    }

    render() {
      if (!this.container) return;
      this.container.innerHTML = buildDiceHtml(this.value, this.options.id);
      this.sceneEl = this.container.querySelector(".dice-3d-scene");
      this.tossEl = this.container.querySelector(".dice-3d-toss");
      this.wrapperEl = this.container.querySelector(".dice-3d-wrapper");
      this.shadowEl = this.container.querySelector(".dice-3d-shadow");
    }

    /**
     * 执行真实物理抛掷动力学翻滚
     * @param {number} targetValue - 目标点数 (1~6)
     * @param {number} duration - 翻滚动画时长 (毫秒，推荐 900ms)
     * @returns {Promise<number>}
     */
    roll(targetValue, duration) {
      if (this.isRolling) return Promise.resolve(this.value);

      targetValue = targetValue || (Math.floor(Math.random() * 6) + 1);
      duration = duration || 900;
      this.isRolling = true;
      this.value = targetValue;

      // 播放抛掷音效
      if (this.options.sound && window.LG && window.LG.sound) {
        window.LG.sound.play("roll");
      }

      // 1. 触发纯 CSS 垂直抛物线与地面动态软阴影 (与三维飞旋严格 900ms 同步)
      this.sceneEl.classList.remove("is-tossing");
      void this.sceneEl.offsetWidth; // 触发 reflow 确保 keyframe 重新执行
      this.sceneEl.classList.add("is-tossing");

      // 2. 计算连续目标欧拉角 (统一 3 整圈 1080°，多骰并发时速度完全同步)
      const targetBase = FACE_ANGLES[targetValue] || FACE_ANGLES[1];
      const extraSpins = 3 * 360; // 统一 1080°，杜绝多骰间转速差异

      const curX = ((this.currentX % 360) + 360) % 360;
      const curY = ((this.currentY % 360) + 360) % 360;

      const diffX = targetBase.x - curX;
      const diffY = targetBase.y - curY;

      const nextX = this.currentX + extraSpins + diffX;
      const nextY = this.currentY + extraSpins + diffY;

      this.currentX = nextX;
      this.currentY = nextY;
      this.currentZ = 0;

      // 启动高速旋转 (平滑连续变换)
      this.wrapperEl.style.transform = `rotateX(${nextX}deg) rotateY(${nextY}deg) rotateZ(0deg)`;

      return new Promise((resolve) => {
        setTimeout(() => {
          // 落地瞬间播放清脆的骰子落地声与震动
          if (this.options.sound && window.LG && window.LG.sound) {
            window.LG.sound.play("stop");
          }
          if (navigator.vibrate) navigator.vibrate(35);

          this.sceneEl.classList.remove("is-tossing");
          this.isRolling = false;
          resolve(targetValue);
        }, duration);
      });
    }

    setValue(val) {
      this.value = val;
      const base = FACE_ANGLES[val] || FACE_ANGLES[1];
      this.currentX = base.x;
      this.currentY = base.y;
      this.currentZ = 0;
      if (this.wrapperEl) {
        this.wrapperEl.style.transform = `rotateX(${base.x}deg) rotateY(${base.y}deg) rotateZ(0deg)`;
      }
    }
  }

  /**
   * 静态快速调用与多骰支持
   */
  const Dice3D = {
    buildFaceHtml,
    buildDiceHtml,
    Instance: DiceInstance,

    /**
     * 在容器内初始化单个 3D 骰子
     */
    create(container, options) {
      return new DiceInstance(container, options);
    },

    /**
     * 针对现有容器快速抛掷
     */
    async roll(container, targetValue, duration) {
      let inst = container._diceInstance;
      if (!inst) {
        inst = new DiceInstance(container);
        container._diceInstance = inst;
      }
      return await inst.roll(targetValue, duration);
    },

    /**
     * 全屏 / 模态卡片投掷展示 (支持单骰或多骰)
     */
    showModalRoll({ count = 1, title = "掷骰中...", onComplete }) {
      if (!window.LG || !window.LG.openModal) return;

      const diceContainers = Array.from({ length: count }, (_, i) => `<div id="modal-dice-${i}"></div>`).join("");
      const m = window.LG.openModal(`
        <div class="text-center py-4 space-y-4">
          <h3 class="text-xl font-extrabold text-white">${title}</h3>
          <div class="flex flex-wrap items-center justify-center gap-4 my-6">
            ${diceContainers}
          </div>
          <div id="modal-dice-result" class="text-2xl font-black text-rose-300 min-h-[2rem]"></div>
        </div>
      `, { maxW: "max-w-sm" });

      const instances = Array.from({ length: count }, (_, i) => {
        return new DiceInstance(m.el.querySelector(`#modal-dice-${i}`));
      });

      const results = Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
      Promise.all(instances.map((inst, i) => inst.roll(results[i], 900))).then(() => {
        const sum = results.reduce((a, b) => a + b, 0);
        const resEl = m.el.querySelector("#modal-dice-result");
        if (resEl) {
          resEl.textContent = count > 1 ? `点数：${results.join(" + ")} = ${sum} 点！` : `点数：${sum} 点！`;
        }
        setTimeout(() => {
          m.close();
          if (onComplete) onComplete(results);
        }, 1200);
      });
    }
  };

  global.Dice3D = Dice3D;
})(typeof window !== "undefined" ? window : globalThis);
