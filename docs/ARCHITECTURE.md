# 结构说明 / 構成 / Architecture

[中文 README](../README.md) · [日本語 README](../README.ja.md) · [English README](../README.en.md)

## 中文

这是无需构建的静态网站。`dist/index.html` 按依赖顺序载入全局 `window.RAIL_*` 模块；不要随意调整脚本顺序。`dist/` 就是完整的可部署站点，`tools/` 只在开发检查时使用。

| 模块 | 职责 |
|---|---|
| `catalog.js`、`catalog-regions.js`、`catalog-expanded.js` | 237 预设、地区／类别／线路层级、行先和基础配置 |
| `special-services.js`、`service-ui.js` | 设备、品牌、座席图标及显示配置 |
| `journey-data.js` | 线路路径、停站和座席参考 |
| `timetable-data.js` | 冻结日期的 425 条班次、来源、证据和状态 |
| `timetable-model.js`、`timetable-ui.js` | 套用班次、手动修改标记、每车型记忆和来源面板 |
| `model.js` | 四行模型、默认值、保存兼容、场景和模型节数 |
| `journey-model.js`、`journey-ui.js` | 匹配停站、座席号车、最近待发、跨午夜和滚动呈现 |
| `app.js`、`styles.css` | 页面编辑、事件、浏览器保存、显示样式和布局 |

浏览器本地存储键为 `n-gauge-platform-board-v2`，兼容旧 `v1`。按车型记录的编组和固定时间不等同于所有班次共用实车编成。设置不会上传到服务器。

修改资料时保留稳定的车辆 ID；新参考班次必须带来源、时间、发站、行先、状态、冻结日期和时区，并使用唯一 ID。修改号数或路径后，不能继续套用不匹配的完整停站。`timetable.html` 是对应的可读核对页，也需要随数据更新。

V6 数据生成用的临时采集脚本与原始官网 PDF／HTML 不包含在本仓库。`tools/build-reference.cjs` 用于目录与既有研究页面，**不会生成完整的班次数据库**。源数据变更应同时维护可读记录，再执行三组检查。

## 日本語

ビルド不要の静的サイトです。`dist/index.html` は依存順に `window.RAIL_*` のグローバルモジュールを読み込みます。スクリプト順序を不用意に変更しないでください。公開するのは `dist/` 全体で、`tools/` は開発用チェックです。

`catalog*.js` は車両・地域・路線、`special-services.js`／`service-ui.js` はブランドと設備、`journey-data.js` は経路資料です。`timetable-data.js` は基準日固定の 425 便と出典を持ち、`timetable-model.js`／`timetable-ui.js` が適用と手動編集の判定を担当します。`model.js` は 4 行の状態・互換性・シーン・模型編成、`journey-model.js`／`journey-ui.js` は停車駅・座席・日付をまたぐ直近便とスクロール、`app.js`／`styles.css` は画面と操作を担当します。

保存キーは `n-gauge-platform-board-v2` で、旧 `v1` と互換性があります。設定はブラウザー内のみで、サーバーへ送信しません。模型編成・固定時刻の記憶を実車の確定運用と解釈しないでください。

車両 ID は安定させ、新しい参考便には一意 ID、公式出典、時刻、発駅、行先、状態、固定日、タイムゾーンを設定してください。号数・経路が変わった便には別便の全停車駅を流用せず、`timetable.html` の確認記録も更新します。

V6 作成時の一時的な収集スクリプトと公式 PDF／HTML 原本は含みません。`tools/build-reference.cjs` は目録と既存調査ページ用で、班次データベース全体の生成器ではありません。データと可読資料を一緒に更新し、3 組のチェックを実行してください。

## English

This is a buildless static site. `dist/index.html` loads global `window.RAIL_*` modules in dependency order; preserve that order. Deploy the complete `dist/` directory. `tools/` is used for development checks only.

`catalog*.js` defines vehicles, regions and routes. `special-services.js`/`service-ui.js` handle brands and equipment, while `journey-data.js` contains route references. `timetable-data.js` contains the 425 frozen departures and provenance; `timetable-model.js`/`timetable-ui.js` apply references and track manual edits. `model.js` manages the four rows, defaults, migration, scenes and model formations. `journey-model.js`/`journey-ui.js` handle stopping patterns, seats, next departures across midnight and scrolling. `app.js`/`styles.css` implement the page and interactions.

The local-storage key is `n-gauge-platform-board-v2`, with legacy `v1` compatibility. Settings remain in the browser and are not sent to a server. Remembered model formations and fixed times do not establish real vehicle workings.

Preserve stable vehicle IDs. New departure references need unique IDs, official sources, times, origins, destinations, verification status, the frozen date and time zone. A changed service number or route must not retain an unrelated full stopping pattern. Keep the readable `timetable.html` audit in sync with source data.

Temporary V6 collection scripts and original operator PDFs/HTML are not included. `tools/build-reference.cjs` generates the catalogue and existing research pages; it does **not** regenerate the entire timetable database. Maintain data and readable records together, then run all three existing checks.
