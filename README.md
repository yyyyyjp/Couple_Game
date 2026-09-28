# 情侣互动小游戏合集 (Couple Game)

<p align="center">
  <img src="assets/img/bg.png" alt="Couple Game Banner" width="680" style="border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.4);" />
</p>

<p align="center">
  <strong>🔥 专为亲密伴侣打造的私房互动小游戏 Web 合集 · 约会之夜前戏必备 🔥</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Fully%20Reconstructed-success?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/Architecture-Vanilla%20HTML%2FCSS%2FJS-blue?style=flat-square" alt="Architecture" />
  <img src="https://img.shields.io/badge/Languages-CN%20%7C%20TW%20%7C%20EN%20%7C%20JA%20%7C%20KO-pink?style=flat-square" alt="i18n" />
  <img src="https://img.shields.io/badge/Sound-Web%20Audio%20API-orange?style=flat-square" alt="Audio" />
  <img src="https://img.shields.io/badge/License-MIT%20%2F%20Open-lightgrey?style=flat-square" alt="License" />
</p>

<p align="center">
  <a href="https://yyyyyjp.github.io/Couple_Game/"><strong>🚀 在线体验 (GitHub Pages)</strong></a>
  ·
  <a href="https://github.com/yyyyyjp/Couple_Game"><strong>📦 GitHub 仓库</strong></a>
  ·
  <a href="#-游戏矩阵一览"><strong>🎮 游戏列表</strong></a>
</p>

---

## 📖 项目简介与背景

本项目是对知名在线情侣互动游戏站 **[lovegame.hoothin.com](https://lovegame.hoothin.com/)** 及其配套开源配置仓库 **[hoothin/QingLv](https://github.com/hoothin/QingLv.git)** 进行 **1:1 完整逆向工程复刻** 的独立纯静态版本。

### 为什么进行复刻？
- **零构建与轻量化**：原网站基于 Next.js 与 Turbopack 打包，依赖庞大且高度封装。本项目将其完整逆向还原并重构为 **原生 HTML5 + Tailwind CSS + 原生 JavaScript**，彻底告别复杂的 Node.js 服务端依赖，秒开无延迟。
- **真正的离线可用**：所有逻辑、核心题库、事件机制、算法判定与音效均在前端本地运行，可直接双击或通过静态文件服务器运行，支持完全断网游玩。
- **绝对隐私安全**：情侣互动数据（战绩统计、自定义剧本等）全部保存在浏览器本地 LocalStorage 中，不上传任何第三方服务器，绝对安全放心。

---

## 🎮 游戏矩阵一览

本项目完整还原了原站的全部游戏生态，并保证核心玩法、视觉动效与操作细节的一致性：

| 游戏名称 | 页面入口 | 玩法特点 |
| :--- | :--- | :--- |
| **✈️ 心动飞行棋 (Ludo)** | `cn/ludo.html` | 经典飞行棋融合情侣任务。支持 **2/3/4 人模式**、**1~4 颗棋子**；**全屏沉浸式事件弹窗与动态倒计时器**；**未起飞前戏惩罚互动**（亲吻、喝酒、深蹲、再掷一次）；**自适应响应式棋盘**（手机/PC无溢出完美居中）；**顺时针轨道指引箭头**；**近道飞跃航线与撞子机制**；**8 大主题内置事件库**随时切换；支持 **AI 一键生成事件 Prompt** 与自定义 `.txt`/`.json` 导入导出。 |
| **🎡 真心话大冒险 (Truth or Dare)** | `cn/truth-or-dare.html` | 平滑物理旋转双轮盘，支持真心话与大冒险两种模式，内置百道暧昧、刺激互动题库，支持自定义题库扩展。 |
| **🎲 情趣动作骰子 (Dice)** | `cn/dice.html` | 动作骰子与部位骰子双骰联动，3D 翻滚动画与撞击音效，提供随机且充满惊喜的亲密指令。 |
| **🦁 欲望暗兽棋 (Dark Beast)** | `cn/dark-beast.html` | 斗兽棋经典暗棋翻牌机制（象 > 狮 > 虎 > 豹 > 狼 > 狗 > 猫 > 鼠，鼠吃象）。翻开未知棋子触发隐藏互动指令。 |
| **🎰 桃色老虎机 (Slots)** | `cn/slots.html` | 3 轴随机轮盘滚动与逐列刹车动效，配合音效触发多组连击互动奖励。 |
| **💎 午夜大富翁 (Monopoly)** | `cn/monopoly.html` | 保持与官方原站同步的“开发中”展位与引流页面。 |
| **📊 专属亲密战绩 (Statistics)** | `cn/statistics.html` | 记录对局总览、胜率统计、互动里程碑成就解锁。纯本地存储，专属私密报告。 |

---

## 🌟 核心技术亮点

1. **纯原生静态架构**：
   - 彻底脱除前端框架打包捆绑，所有页面开箱即用，方便二次修改与直接部署到任何静态服务器。
2. **多语言全量覆盖 (i18n)**：
   - 完整支持 5 种语言版本，所有游戏页面与内嵌文案均拥有独立镜像：
     - 🇨🇳 简体中文 (`cn/`)
     - 🇭🇰/🇹🇼 正體中文 (`tw/`)
     - 🇺🇸 English (`en/`)
     - 🇯🇵 日本語 (`ja/`)
     - 🇰🇷 한국어 (`ko/`)
3. **全局通用 3D 物理级骰子引擎 (Dice3D)**：
   - 纯原生 CSS 3D 实现，无需引入 Three.js 等庞大依赖，轻量且极致流畅；
   - 具备逼真的三轴多圈高速翻滚、腾空跳跃抛物线、地面动态椭圆投影与弹性落地回弹；
   - 支持点击骰子直接抛掷、单骰/多骰同步抛投、全屏弹窗抛骰，全面赋能情侣飞行棋与情趣骰子游戏。
4. **原生 Web Audio API 音效合成**：
   - 摆脱体积巨大的音频文件，利用 Web Audio API 在代码中实时合成掷骰、翻牌、碰撞、庆祝等多频段音效，轻量且低延迟。
5. **动态 Canvas 背景**：
   - 细腻平滑的暗色星空粒子流体背景，烘托浪漫暧昧的游戏氛围。
6. **PWA 渐进式 Web 应用**：
   - 规范的 `manifest.json` 与 Service Worker 配置，可在手机（iOS Safari / Android Chrome）及电脑端直接“添加到主屏幕”，享受原生 App 般的沉浸式全屏体验。

---

## 📂 项目目录结构

```text
Couple_Game/
├── index.html               # 站点入口（自动重定向到对应语言首页）
├── manifest.json            # PWA 渐进式应用配置文件
├── README.md                # 项目详细说明文档
├── .gitignore               # Git 忽略配置
│
├── cn/                      # 简体中文版页面目录
│   ├── index.html           # 游戏大厅 / 首页
│   ├── ludo.html            # 心动飞行棋
│   ├── truth-or-dare.html   # 真心话大冒险
│   ├── dice.html            # 情趣骰子
│   ├── dark-beast.html      # 欲望暗兽棋
│   ├── slots.html           # 桃色老虎机
│   ├── monopoly.html        # 午夜大富翁 (WIP)
│   └── statistics.html      # 亲密战绩统计报告
├── en/                      # 英文版页面目录 (结构同 cn/)
├── tw/                      # 正体中文版页面目录 (结构同 cn/)
├── ja/                      # 日文版页面目录 (结构同 cn/)
├── ko/                      # 韩文版页面目录 (结构同 cn/)
│
├── assets/                  # 核心静态资源
│   ├── css/
│   │   ├── tailwind.css     # Tailwind CSS 工具样式库
│   │   └── custom.css       # 项目自定义动画与微调样式
│   ├── js/
│   │   ├── core.js          # 共享核心库 (LocalStorage、Web Audio、Toast、Modal)
│   │   ├── home.js          # 首页大厅逻辑与 PWA 唤起
│   │   ├── ludo.js          # 心动飞行棋完整算法与渲染引擎
│   │   ├── truth-or-dare.js # 真心话大冒险轮盘物理引擎
│   │   ├── dice.js          # 情趣骰子玩法逻辑与阶段判定
│   │   ├── dice-3d.js       # 全局通用 3D 物理级骰子引擎 (真实翻滚/抛掷/回弹)
│   │   ├── dark-beast.js    # 暗兽棋翻牌逻辑与规则判定
│   │   ├── slots.js         # 老虎机滚动算法与连线判定
│   │   ├── statistics.js    # 战绩成就统计与图表展示
│   │   ├── background.js    # 动态粒子 Canvas 背景
│   │   ├── share.js         # 二维码与链接分享
│   │   ├── alipay.js        # 赞赏弹窗逻辑
│   │   ├── i18n.js          # 简体中文语言包
│   │   ├── i18n.en.js       # 英文语言包
│   │   ├── i18n.tw.js       # 正体中文语言包
│   │   ├── i18n.ja.js       # 日文语言包
│   │   ├── i18n.ko.js       # 韩文语言包
│   │   └── vendor/          # 第三方轻量依赖 (如 qrcode.min.js)
│   ├── img/                 # 页面图标与背景素材
│   └── media/               # 备用音频资源
│
├── source_repo/             # 原 GitHub 配置参考仓库 (包含各版本预设 .dat/.txt 剧本)
└── _analysis/               # 逆向工程分析、数据反编译与脚本工具目录
```

---

## 🚀 本地运行与快速部署

### 1. 本地快速运行

由于现代浏览器对 ES Module、LocalStorage 和绝对/相对路径的安全策略要求，建议通过简易 HTTP 服务器访问，而不要直接以 `file://` 双击打开：

#### 使用 Python (推荐，已内置)
```bash
# 在项目根目录执行：
python -m http.server 8080
```
然后在浏览器中打开：[http://localhost:8080](http://localhost:8080)

#### 使用 Node.js / npx
```bash
# 在项目根目录执行：
npx serve .
# 或
npx http-server -p 8080
```

#### 使用 VS Code
安装 **Live Server** 插件，右键项目根目录的 `index.html`，选择 **"Open with Live Server"** 即可。

---

### 2. 部署到云端 / 托管平台

本项目纯静态无服务端，可以 100% 免费部署到几乎所有静态托管平台：

- **GitHub Pages**：
  1. 将仓库推送到 GitHub。
  2. 进入仓库 **Settings** -> **Pages**。
  3. Source 选择 **Deploy from a branch**，分支选择 `main`，路径选择 `/ (root)`。
  4. 保存后稍等片刻，即可通过 `https://yyyyyjp.github.io/Couple_Game/` 在线游玩！
- **Vercel**：
  - 直接导入 GitHub 仓库，Framework Preset 选择 `Other`，根目录保持默认，一键部署完成。
- **Cloudflare Pages**：
  - 连接 GitHub 仓库，构建命令留空，输出目录填 `/` 或留空，立即全球 CDN 加速上线。

---

## 🔒 隐私与安全说明

- **无需注册登录**：打开即玩，不需要绑定手机号或授权个人隐私。
- **数据本地闭环**：所有战绩记录、自定义飞行棋剧本、游戏偏好均保存在设备本地，换用无痕模式或清除浏览器缓存即可一键重置。
- **文明健康体验**：请在情侣双方充分沟通、互相尊重并取得积极同意的前提下开展游戏互动。

---

## 🤝 致谢与声明

- 灵感与原设计源自 **[hoothin/QingLv](https://github.com/hoothin/QingLv.git)** 及 **[lovegame.hoothin.com](https://lovegame.hoothin.com/)**。
- 本项目仅供学习、交流与逆向工程前端复刻技术研究，版权归原作者所有。
