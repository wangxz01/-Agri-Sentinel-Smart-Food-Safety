# 神农·智察 Agri Sentinel – 智慧食安监管平台

**概览**
- 左侧为 KPI 与“实时风险事件”日志，支持严重级徽章、时间戳与相对时间显示。
- 右侧为区域地图（聚焦武汉市武昌区），使用国内底图（优先高德瓦片，失败自动回退到 OSM）。
- 支持模拟 AI 风险预警、多点高亮、AI 决策弹窗与区块链溯源时间线。

**技术栈**
- 前端框架：`Next.js 16`、`React 19`（`package.json`）。
- 地图：`Leaflet 1.9`（CDN 引入），底图优先使用高德瓦片，`tileerror` 自动回退到 `OSM`。
- 可视化/UI：原生 `HTML/CSS` 深色科技主题；KPI 迷你趋势（SVG）；事件徽章与相对时间。
- 其他：`ECharts CDN` 已引入但当前地图逻辑为 Leaflet-only；静态驾驶舱页面位于 `public/index.html`。

**目录与关键文件**
- 驾驶舱页面：`public/index.html`
- 样式主题：`public/style.css`
- 地图与交互：`public/app.js`
- Next 应用入口：`src/app/page.tsx`、布局与站点图标：`src/app/layout.tsx`

**运行方式**
- 安装依赖：`npm install`
- 启动开发：`npm run dev`
- 访问 Next 应用首页：`http://localhost:3000/`
- 访问驾驶舱页面：`http://localhost:3000/index.html`

**构建与生产启动**
- 构建：`npm run build`
- 启动：`npm start`

**主要功能点**
- 地图初始化与底图容错：高德瓦片加载失败自动切换到 OSM（`public/app.js:36` 附近）。
- 监管点绘制与点击溯源：点击点位弹出“区块链溯源”时间线（`public/app.js:21`）。
- 一键预警与联动：按钮触发多点预警、日志记录、AI 决策弹窗并自动适配视图（`public/app.js:113`）。
- 适配辖区范围：按钮 `适配辖区范围` 调整地图视野以紧凑包含所有点（`public/app.js:58` 定义）。
- 事件日志滚动：左侧事件列表独立滚动，不影响整体布局（`public/style.css` 的 `.event-list`）。

**地图与瓦片说明**
- 默认底图：高德（`style=7`），参数 `tileSize=512` 与 `zoomOffset=-1` 提升文字清晰度。
- 回退策略：监听 `tileerror`，自动切换到 `OSM` 并记录事件。
- 点位区域：本地化为武昌区，湖区点位通过坐标微调避免落水（`public/app.js:45` 的 `adjustToLand`）。

**交互与体验**
- 预警脉冲光环：高风险点叠加动态脉冲圈层提升空间可视化（`public/app.js:58`）。
- 事件结构化：严重级徽章与相对时间（`public/index.html:80` 的 `addEvent`）。
- 溯源时间线：垂直时间线样式的四步溯源（`public/app.js:21`）。

**自定义与扩展**
- 替换站点图标：将 `public/logo.png` 用你的图标替换；Next 配置在 `src/app/layout.tsx` 的 `metadata.icons`。
- 底图切换：在 `public/app.js` 中替换高德瓦片 URL 或改用其他国内源；必要时接入矢量地图（如 MapLibre GL）。
- 点位扩充：在 `public/app.js:7` 的 `points` 中增删本地化点位即可。

**部署建议**
- 可按 Next 官方流程部署到 Vercel 或自行托管。
- 静态驾驶舱页面通过 `public/index.html` 提供，无需服务端渲染。

**许可**
- 本项目示范用，地图瓦片来自公共服务，生产环境请遵守相应使用条款与并发限制。
