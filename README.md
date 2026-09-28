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
| **✈️ 心动飞行棋 (Ludo)** | `cn/ludo.html` | 经典飞行棋融合情侣任务。支持 **2/3/4 人模式**、**1~4 颗棋子**；**多系统跨端深度 UI 自适应引擎**（专为**电脑 PC、华为平板 MatePad、iPad、iPhone 及各大安卓机型**深度优化）；提供 **🔄 自动适配 / 💻 电脑布局 / 📟 平板双栏 / 📱 手机紧凑** 实时无感切换条（带 LocalStorage 持久记忆）；电脑与平板模式下 **【#board】棋盘居左最大化展现，设置与骰子集中居右**，全屏一览无余彻底告别翻页；手机端单栏垂直居中与 $13 \times CELL + 32$ 纯数学动态缩放（彻底杜绝横向溢出）；支持触屏点击/悬停多模态格子检视；**全屏沉浸式事件弹窗与动态倒计时器**；**未起飞前戏惩罚互动**（亲吻、喝酒、深蹲、再掷一次）；顺时针轨道指引箭头；近道飞跃航线与撞子机制；**8 大主题内置事件库**随时切换；支持 **AI 一键生成事件 Prompt** 与自定义 `.txt`/`.json` 导入导出。 |
| **🎡 真心话大冒险 (Truth or Dare)** | `cn/truth-or-dare.html` | 60FPS 物理减速大转盘（抽选玩家、选择真心话、选择大冒险全链路覆盖飞旋动画），稳定精准指向针设计，自适应扇区字号与 Web Audio 物理减速咔嗒音效毫秒级同步，内置 8 大聚会情侣题库，支持自定义扩展。 |
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
3. **全局通用 3D 物理级实心圆润骰子引擎 (Dice3D)**：
   - **纯原生零依赖**：基于原生 CSS 3D + 欧拉角连续动力学实现，无需引入 Three.js 或 Cannon.js 等庞大依赖，极速秒开、性能优异；
   - **圆润面板与无缝密闭工艺**：采用 6 面基座微重叠密闭咬合技术，内嵌高雅圆角面板（10px 倒角半径 + 微凸高光与凹陷质感），在彻底根除空白缝隙与漏光空心感的同时，呈现出温润细腻的实心象牙树脂触感；
   - **全链路绝对同步飞旋**：垂直抛物线升降、触地微回弹、地面软阴影动态缩放与三维欧拉角旋转严格对齐在同一 900ms 物理时间轴上，告别多线程定时器打架与视觉卡顿；
   - **多骰并发统一角速度**：统一 3 圈整转（1080°）旋转动力学，多颗骰子同屏掷出时角速度与落地时钟完全步调一致，体验极度舒适解压；
   - **拟真音画触感交互**：落地瞬间精准触发 Web Audio 纯净落地撞击音效与移动端触觉震动反馈（Vibrate API）。
4. **真心话大冒险 60FPS 物理减速大转盘引擎 (玩家/真心话/大冒险全场景覆盖)**：
   - **全链路 100% 动画覆盖**：无论点击转盘中心【旋转】、顶部【选玩家】、模式弹窗中的【真心话】/【大冒险】或主界面顶部惩罚按钮，转盘均完整呈现 5.2 秒极速起转至真实贝塞尔曲线（`cubic-bezier(0.12, 0.85, 0.2, 1)`）平滑减速物理飞旋动画；
   - **原地 DOM 状态保全与防刷新机制**：杜绝中心按钮逻辑误拦截导致的“无动画直出结果”与“固定玩家1”缺陷，采用显式强制重排与精准动力学角位移计算，实现原地扇区无缝换肤与平滑飞旋；
   - **智能选人与随机/顺序双模飞旋**：随机模式下真随机命中在场玩家，顺序轮流模式下平滑旋转至下一位行动玩家，均带有完整减速悬停动效；
   - **纯净稳重指示针与物理咔嗒音效**：取消多余的指针机械晃动，保持顶部指针视线稳定精准，同时伴随转盘角速度递减播放 Web Audio 纯净咔嗒音效（Tick Sound）；
   - **智能容错与扇区自适应渲染**：支持任意时刻直接触发真心话或大冒险（自动就绪行动玩家），题库扇区文案依据扇区数量自适应字号与字数截断，兼顾转盘美观度与内容可读性。
5. **心动飞行棋多系统跨端深度自适应与多态布局切换引擎 (PC / Huawei MatePad / iPad / iPhone / Android)**：
   - **电脑与平板端【棋盘居左最大化 + 控制与设置居右】锁定双栏架构**：针对 PC 显示器、笔记本及各类平板屏幕（iPad、华为 MatePad），通过 CSS 强制横向锁定（`.ludo-side-by-side`，`flex-direction: row !important`），坚决杜绝【#control-card】与【#settings-card】掉落换行至下方的排版问题；
   - **棋盘尺寸最大化与卡片尺寸自适应**：以最大化棋盘视野为第一优先级，将 `CELL` 单元格尺寸上限突破至 84px（电脑大屏）/ 64px（平板）；同时右侧侧边栏宽度依据视口动态自适应调节（210px ~ 320px），控制卡片与设置卡片采用微调紧凑排版，全要素同屏展现且免除纵向页面滚动；
   - **手机端数学级严谨防溢出与等比缩放**：采用动态网格公式 $\text{CELL} = \lfloor(\min(\text{winW}-16, 520) - 32) / 13\rfloor$，针对 iPhone (375px/390px/430px) 及主流安卓设备（360px~412px）精准适配，消除页面横向晃动；
   - **格子内容响应式字号梯级**：根据当前网格单元尺寸自动适配中心终点奖杯、近道飞机、惩罚状态与长文案的字体尺寸（7px~12px+），在紧凑屏幕与大平板间保持极致美观清晰；
   - **四态布局切换器与持久化记忆**：顶部提供 Segmented 控制胶囊（**🔄 自动适配 / 💻 电脑布局 / 📟 平板双栏 / 📱 手机紧凑**），实时指示当前设备识别结果，支持随时自由手动覆盖并自动记录至 `localStorage`；
   - **移动端触控优化与点击检视**：全面引入 `touch-action: manipulation` 消除 300ms 延迟，支持触屏轻触任意格子弹出浮动详情，解决触屏设备无法 hover 窥探任务的交互短板。
6. **原生 Web Audio API 音效合成**：
   - 摆脱体积巨大的音频文件，利用 Web Audio API 在代码中实时合成掷骰、翻牌、转盘咔嗒、碰撞、庆祝等多频段音效，轻量且低延迟。
7. **动态 Canvas 背景**：
   - 细腻平滑的暗色星空粒子流体背景，烘托浪漫暧昧的游戏氛围。
8. **PWA 渐进式 Web 应用**：
   - 规范的 `manifest.json` 与 Service Worker 配置，可在手机（iOS Safari / Android Chrome）及电脑端直接“添加到主屏幕”，享受原生 App 般的沉浸式全屏体验。

---

## 📂 项目目录结构

```text
Couple_Game/
├── index.html               # 站点入口（自动重定向到对应语言首页）
├── manifest.json            # PWA 渐进式应用配置文件
├── README.md                # 项目详细说明文档
├── agent.md                 # AI 协作与开发规范指南 (代码变更必更 README)
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
