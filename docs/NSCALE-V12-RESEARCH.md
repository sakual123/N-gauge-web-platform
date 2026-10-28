# V12 产品与编成核对 / 製品資料 / Model reference update

核对与发布检查日期：2026-10-28。

## 中文

新增49项产品，现有590项、10家厂家；585项有确认品号，5项未确认完整商品编号。237个预设中216个有车型对应、5个仅有注明差别的版本参考、16个仍待核实；覆盖预设数不等于不同实物车型数量。72个预设有多家厂家可选。

编成搭配由47种增至88种，覆盖78个预设。新增内容包括京王旧版6＋4与新版4＋6、东武TH Liner、东急及东京Metro早期版本、EXEα、HC85、Haruka彩绘、N700-8000与九州在来线等。不同厂家、涂装、番台、动力或Premium Car年代不能只凭节数混配。套装示意按盒内车辆分组，不表示实车号车顺序。

修正EXEα A6597增结盒也有动力；E353 10-1836付属三节不含动力，独立运行需适配动力装置。813增结盒逐盒动力归属未取得足够一手证据，删除原有无依据的“无动力”断言，保留按本品说明书核查的说明。KiHa200具体番台与当前泛称预设的关系也作了保守修订。

独立抽查了23项新增产品和19种搭配。HC85与GREENMAX若干编成图实际查看；无法读取的KATO S3图表没有标成已图审，相关配法仅在有明确原厂文字支持时采用。另检查既有KATO资料的87个来源页面，修复321两品的动态分页入口，并为北斗星两品补充官方品号目录。页面可读、品号可见和逐车图审是不同层次，未把它们等同。

17项产品有厂家明确的最小半径；R282／R315筛选只纳入明确数字，不从条件说明或同系列其他版本推断。新增的早期16000系R249仅适用于对应二次车产品，未外推第五批次。

目录新增套装类型与曲线条件筛选、单项移除标签、全页去重CSV。设置补齐JSON导入预览、应用和本页恢复导入前状态；刷新不保留内存撤销快照，迁移时应保留原JSON。实际浏览器验证了590项下载、错误文件拒绝、预览隔离、应用、恢复和刷新记忆。未在实体iPad Safari或实际扬声器上验证。

## 日本語

49件を追加し、10メーカー・590製品資料、88通りのセット組合せを収録しました。216プリセットが車種対応、5件が仕様差の参考、16件が未確認です。旧塗装・ラッピング・座席仕様・番台の違いを区別し、未確認品番を作って埋めていません。

23製品と19組合せを独立抽出確認しました。EXEαの増結にも動力がある点、E353付属編成に動力がない点などを修正しました。読めなかった公式図面は未図審と記録。最小半径の数値と条件付き説明は分けています。

セット種類・曲線資料の絞込み、CSV出力、設定JSONのプレビュー読込みと同一ページ内の復元を追加しました。実機iPad Safariと実音声の検証は未実施です。

## English

This release adds 49 records, reaching 590 products across ten makers and 88 documented assembly recipes. Preset coverage remains 216 matching, five variant-only and 16 unresolved; multiple service presets may share a physical model. Historical liveries, wrapped trains, seating versions and subseries remain distinguished.

A separate sample review checked 23 products and 19 recipes. Corrections include the powered EXE-alpha add-on and unpowered E353 supplementary set. Unsupported claims about individual 813 add-on motors were removed rather than guessed. Unreadable official diagrams were explicitly excluded from visual-verification claims. Seventeen products carry explicit manufacturer minimum-radius numbers; conditional notes do not become numeric specifications.

The interface adds package/curve filters, removable chips, full-result deduplicated CSV export and previewed JSON settings import with page-local restoration. Actual browser tests covered the 590-product download and import behavior at desktop/tablet/mobile widths. Physical iPad Safari and audible speech remain untested.

## 代表性一手资料 / Selected primary sources

- [GREENMAX 京王5000旧版配盒说明](https://www.gm-store.co.jp/blog/gmstore-staff/archives/53124)
- [GREENMAX 官方首页对GM通信的链接](https://www.greenmax.co.jp/)
- [TOMIX N700-8000基本98518](https://www.tomytec.co.jp/tomix/products/n/98518.html)
- [TOMIX Haruka Ougi修订公告](https://www.tomytec.co.jp/tomix/products/img/20250213-3.pdf)
- [KATO 321系当前详情](https://www.katomodels.com/product/n/321kei_vc)
- [KATO 北斗星车型与牵引说明](https://www.katomodels.com/product/n/24kei_hokutosei_dx)

逐项品号、盒数、适用预设、日期、原始来源和限制保存在[data/nscale-products.json](../data/nscale-products.json)。仓库不打包原厂PDF、产品照片或车站录音；资料包含历年及预告产品，不表示实时库存。
