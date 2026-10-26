# 结构说明 / 構成 / Architecture

[中文 README](../README.md) · [日本語 README](../README.ja.md) · [English README](../README.en.md)

## 中文

纯静态网页，无需框架或安装依赖；部署整个 `dist/`。`index.html` 按依赖顺序加载 `window.RAIL_*` 模块，保持现有顺序。浏览器设置键 `n-gauge-platform-board-v2` 兼容旧 v1，编组、四行自定义内容、按车型固定时间保存在当前浏览器。

| 文件 | 职责 |
|---|---|
| `dist/catalog*.js` | 237 预设、地区、类型、线路、行先 |
| `dist/special-services.js`、`service-ui.js` | 品牌、设备、座席图标与配置 |
| `dist/journey-data.js` | 线路、停站、席别参考 |
| `data/timetables.json` | 可编辑的固定日班次、完整度、官方来源、证据 |
| `tools/build-timetable.cjs` | 生成浏览器班次库与 TIMETABLES.md；重复字符串共享以缩减体积，不丢弃证据 |
| `dist/timetable-data.js` | 已生成、可直接静态部署的资料 |
| `dist/timetable-model.js`、`timetable-ui.js` | 班次套用、按车型记忆、手动修改、出发站／方向／时段／关键词筛选 |
| `dist/timetable.html`、`timetable-audit.js` | 来源与范围核对页，筛选后每页50条 |
| `dist/model.js` | 默认值、四行、场景、设置兼容、模型编组 |
| `dist/journey-model.js`、`journey-ui.js` | 停站、席别、跨午夜最近待发与滚动提示 |
| `dist/app.js`、`styles.css` | 编辑事件、保存、版式和显示 |

修改 JSON 后运行 `npm run build:timetable`，再运行 `npm test`。检查包含浏览器资料与 JSON 一致性、时分与来源、筛选不修改原数据、固定时间记忆、旧设置兼容、标识、停站及跨午夜。保留车辆 ID 与已存在的班次 ID，避免破坏用户固定班次记忆。

完整度 full 仅指 coverage.scope 的站点、方向和种别；运行日 dated／holiday／daily／calendar 是另一维度。具体车种混用、低床车代运、特别日历按备注处理。24:xx 转成 00:xx 显示时保留 sourceTime／serviceDayOffset。完整停站只在匹配的车次、方向、种别上使用，用户自定义号数不联网查询。

临时采集脚本和官方 PDF/HTML 原本保留在研究工作区，不放入公开仓库；公开 JSON 包含每条来源与证据，便于手动维护。`tools/build-reference.cjs` 属于既有目录／研究页生成器，不用于重建班次库。

## 日本語

フレームワーク不要の静的サイトです。`dist/` 全体を配信し、`index.html` の読込順を保持します。設定はブラウザーの `n-gauge-platform-board-v2` に保存し、旧 v1 と互換性があります。

編集元は `data/timetables.json` です。`npm run build:timetable` が出典・証拠を保持したブラウザー用データと範囲一覧を再生成します。繰り返す文字列だけを共有して容量を削減します。`npm test` でデータ一致、時刻・出典、絞り込み、固定時刻の保存、旧設定、ブランド、停車駅、日付をまたぐ案内を確認します。車両 ID・既存便 ID は変更しないでください。

`timetable-model.js`／`timetable-ui.js` が適用・保存・発駅／方向／時間帯／キーワード絞り込みを担当し、`timetable-audit.js` は確認一覧を50件ずつ描画します。`catalog*` は車両・路線、`special-services*` は設備とブランド、`journey-*` は停車駅・座席・スクロール、`model.js` は4行と設定、`app.js`／`styles.css` は画面です。

full は明記した駅・方向・種別の終日範囲のみを表し、運転日確認とは別です。形式共用や代車を保証せず、24時以降の原表記も保持します。収集用一時スクリプトと公式PDF原本は公開せず、JSONには確認用の出典・証拠を保存します。

## English

Deploy the complete `dist/` directory as a buildless static site and retain the script loading order. Settings use browser-local key `n-gauge-platform-board-v2`, with v1 compatibility.

The editable source is `data/timetables.json`. Run `npm run build:timetable` to regenerate browser data and the scope inventory. Repeated strings are shared without dropping provenance. `npm test` verifies exact JSON/browser equivalence, times and sources, non-mutating filters, pinned custom times, migration, service marks, stops and midnight handling. Preserve vehicle IDs and existing departure IDs.

`timetable-model.js`/`timetable-ui.js` apply and remember trips and filter by origin, direction, period and keywords. `timetable-audit.js` renders the audit 50 records at a time. `catalog*` defines vehicles/routes, `special-services*` handles marks, `journey-*` handles stops/seats/tickers, `model.js` manages the four rows and settings, and `app.js`/`styles.css` implement the UI.

Full coverage applies only within the stated station/direction/service scope, separately from operating-date verification. Mixed fleets and substitutions remain qualified. Original 24-hour-plus notation is preserved for after-midnight departures. Temporary collection scripts and original operator PDFs are excluded from the public repository; the editable data retains sources and evidence. `tools/build-reference.cjs` remains the older catalogue/research-page generator, not the timetable builder.
