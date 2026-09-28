/* ============================================================
 * Dice3D - 全局通用 3D 物理级骰子引擎
 * 纯原生 CSS 3D 实现，支持真实多轴翻滚、物理抛掷跳跃、
 * 弹性落地回弹、动态地面阴影与触觉/音效联动
 * ============================================================ */
(function (global) {
  "use strict";

  // 9格点阵映射 (0~8)
  const PIPS_MAP = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8]
  };

  // 目标点数对应的基准旋转欧拉角 (面向观察者)
  const BASE_ROTATIONS = {
    1: { x: 0, y: 0, z: 0 },
    2: { x: 90, y: 0, z: 0 },
    3: { x: 0, y: 90, z: 0 },
    4: { x: 0, y: -90, z: 0 },
    5: { x: -90, y: 0, z: 0 },
    6: { x: 180, y: 0, z: 0 }
  };

  /**
   * 生成单个面 (face) 的 HTML
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
    return `<div class="dice-3d-face dice-face-${val}">${pipsHtml}</div>`;
  }

  /**
   * 生成一个完整 3D 骰子的 HTML 结构
   */
  function buildDiceHtml(initialValue, id) {
    initialValue = initialValue || 1;
    let faces = "";
    for (let v = 1; v <= 6; v++) {
      faces += buildFaceHtml(v);
    }
    const initialRot = BASE_ROTATIONS[initialValue] || BASE_ROTATIONS[1];
    const transform = `rotateX(${initialRot.x}deg) rotateY(${initialRot.y}deg) rotateZ(${initialRot.z}deg)`;

    return `
      <div class="dice-3d-scene" data-dice-id="${id || 'dice'}">
        <div class="dice-3d-shadow"></div>
        <div class="dice-3d-wrapper" style="transform:${transform}">
          ${faces}
        </div>
      </div>
    `;
  }

  /**
   * 3D 骰子实例类
   */
  class DiceInstance {
    constructor(container, options) {
      this.container = typeof container === "string" ? document.querySelector(container) : container;
      this.options = Object.assign({
        size: 60,
        initialValue: 1,
        sound: true,
        id: "dice-" + Math.random().toString(36).slice(2, 7)
      }, options);

      this.value = this.options.initialValue;
      this.isRolling = false;
      this.totalTurns = 0;
      this.render();
    }

    render() {
      if (!this.container) return;
      this.container.innerHTML = buildDiceHtml(this.value, this.options.id);
      this.sceneEl = this.container.querySelector(".dice-3d-scene");
      this.wrapperEl = this.container.querySelector(".dice-3d-wrapper");
      this.shadowEl = this.container.querySelector(".dice-3d-shadow");
    }

    /**
     * 掷骰子动画
     * @param {number} targetValue - 目标点数 (1~6)
     * @param {number} duration - 翻滚总毫秒数 (默认 800ms)
     * @returns {Promise<number>}
     */
    roll(targetValue, duration) {
      if (this.isRolling) return Promise.resolve(this.value);

      targetValue = targetValue || (Math.floor(Math.random() * 6) + 1);
      duration = duration || 850;

      this.isRolling = true;
      this.value = targetValue;

      // 触发音效
      if (this.options.sound && window.LG && window.LG.sound) {
        window.LG.sound.play("roll");
      }

      // 添加起飞翻滚态
      this.sceneEl.classList.add("is-airborne");
      this.wrapperEl.classList.remove("is-bouncing");
      this.wrapperEl.classList.add("is-rolling");

      return new Promise((resolve) => {
        setTimeout(() => {
          // 停止翻滚动画，计算最终角度
          this.wrapperEl.classList.remove("is-rolling");
          this.sceneEl.classList.remove("is-airborne");

          // 累加整圈旋转，使得每次看起来都是真实从空中落下旋转停止
          this.totalTurns += 2 + Math.floor(Math.random() * 2);
          const base = BASE_ROTATIONS[targetValue] || BASE_ROTATIONS[1];
          const rx = base.x + this.totalTurns * 360;
          const ry = base.y + this.totalTurns * 360;
          const rz = base.z;

          this.wrapperEl.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;

          // 落地音效与触觉
          if (this.options.sound && window.LG && window.LG.sound) {
            window.LG.sound.play("stop");
          }
          if (navigator.vibrate) navigator.vibrate(30);

          // 触发落地回弹
          setTimeout(() => {
            this.wrapperEl.classList.add("is-bouncing");
            this.isRolling = false;
            resolve(targetValue);
          }, 50);

        }, duration);
      });
    }

    setValue(val) {
      this.value = val;
      const base = BASE_ROTATIONS[val] || BASE_ROTATIONS[1];
      if (this.wrapperEl) {
        this.wrapperEl.style.transform = `rotateX(${base.x}deg) rotateY(${base.y}deg) rotateZ(${base.z}deg)`;
      }
    }
  }

  /**
   * 静态快速调用 API
   */
  const Dice3D = {
    buildFaceHtml,
    buildDiceHtml,
    Instance: DiceInstance,

    /**
     * 在指定元素内一键挂载并创建骰子
     */
    create(container, options) {
      return new DiceInstance(container, options);
    },

    /**
     * 一键掷骰并更新容器
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
     * 全屏 / 模态卡片投掷展示
     */
    showModalRoll({ count = 1, title = "掷骰中...", onComplete }) {
      if (!window.LG || !window.LG.openModal) return;

      const diceContainers = Array.from({ length: count }, (_, i) => `<div id="modal-dice-${i}"></div>`).join("");
      const m = window.LG.openModal(`
        <div class="text-center py-4 space-y-4">
          <h3 class="text-xl font-bold text-white">${title}</h3>
          <div class="flex items-center justify-center gap-4 my-6">
            ${diceContainers}
          </div>
          <div id="modal-dice-result" class="text-2xl font-black text-rose-300 min-h-[2rem]"></div>
        </div>
      `, { maxW: "max-w-sm" });

      const instances = Array.from({ length: count }, (_, i) => {
        return new DiceInstance(m.el.querySelector(`#modal-dice-${i}`));
      });

      // 启动同时抛掷
      const results = Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
      Promise.all(instances.map((inst, i) => inst.roll(results[i], 900))).then(() => {
        const sum = results.reduce((a, b) => a + b, 0);
        const resEl = m.el.querySelector("#modal-dice-result");
        if (resEl) {
          resEl.textContent = count > 1 ? `点数：${results.join(" + ")} = ${sum}` : `点数：${sum} 点！`;
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
