# JR 四国候选预设与 N 产品核查（2026-10-28）

已写入 `work/shikoku-models-v13.json`：10 个铁路候选、15 个厂家确证 N 产品、12 个明确套装/组合建议；7 个候选有确证产品，8600 两项和 2600 一项保留待核实。不以近铁 8600、京阪 2600、HO 或近似 2700 代替。

`products` / `assemblies` 沿当前 schema；`trains` 是待 root 转换成预设的建议字段，`coverage` 是资料判断，不能直接代替主库运行时 coverage。

## 默认显示建议

| 候选 | 默认节数 | Green 默认 | 代表站与行先 | 模型证据 |
|---|---:|---|---|---|
| sq8000-shiokaze | 5 | 有 | 冈山 → 松山 | KATO 10-1938 |
| sq8000-ishizuchi | 3 | 无 | 高松 → 松山 | KATO 10-1939 |
| sq8600-shiokaze | 5 | 有 | 冈山 → 松山 | 未有完整品号 |
| sq8600-ishizuchi | 2 | 无 | 高松 → 松山 | 未有完整品号 |
| sq2700-nanpu | 3 | 有 | 冈山 → 高知 | TOMIX 98491 |
| sq2700-shimanto | 2 | 无 | 高松 → 高知／中村 | TOMIX 98492 为无动力增结盒；97950 为双服务併结5节盒 |
| sq2000-uwakai | 2 | 无 | 松山 → 宇和岛 | KATO 10-1504 旧形态三节；不同车头 N2000 的10-2104为差异款 |
| sq2000-ashizuri | 2 | 无 | 高知 → 中村／宿毛 | KATO 10-1504；10-2103为预定新品 |
| sq2600-uzushio | 2 | 无 | 高松 → 德岛 | 原厂纸套件证据未完成 |
| sq5000-marineliner | 5 | 有 | 冈山 → 高松 | TOMIX A～E 各一盒5节；F历史6节为差异款 |

席别已实际目视 root 下载渲染的[官方编成 PDF](https://www.jr-shikoku.co.jp/01_trainbus/jikoku/hensei.pdf)三页：标题是 **2025-03-15 改正**，读取于 2026-10-28 不能冒充为 2026 改正版；只能作为配置参考，不能担保 2026-10-25 车底。

- 8000 常规「しおかぜ＋いしづち」为5＋3；8600相应组为5＋2。Green在しおかぜ侧；独立运行的いしづち有其他节数和Green例外，默认短组不加Green。
- 南风三节图为半室Green＋普通指定、普通指定、自由；四万十两节没有Green。併结时不能把南风Green错加到四万十。
- 宇和海图示2／3／4节，无Green；普通2000足摺两节默认不加Green。足摺服务另有带Green三节例外，不能以服务名硬套车型。
- Marine Liner 典型5节为5000三节＋223-5000两节，1号上层Green、下层普通指定，2～5号自由；不是整列Green。早晚223-only两节没有5000，不能映射此5000候选。
- 2600两节无Green。JR无障碍页把2600／2700两节合列，不能凭两节与「うずしお」字样断言车型。

以上只建议默认席别文字，不建议给每个候选固化所有号车表。模型节数与当前班次节数应分别陈述。

## 已核的产品边界

[KATO 8000](https://www.katomodels.com/product/n/jrshikoku8000_2nd)：10-1938 五节L4与10-1939三节S5均含动力，可5＋3併结；是**2004年第一次更新**后形态，不是2023年第二次更新黑橙色。10-1940初始旧涂装8节由[厂家目录](https://www.katomodels.com/stock/result?page=41)确证，列差异款，不宣称现货。

[TOMIX 98491](https://www.tomytec.co.jp/tomix/products/n/98491.html)内容为2800＋2750＋2700(M)；[98492](https://www.tomytec.co.jp/tomix/products/n/98492.html)为2750＋2700(T)，无动力。98492不能标为开盒可自行走行的完整两节车。[97950原厂PDF](https://www.tomytec.co.jp/tomix/products/img/20230112-1.pdf)确证南风・四万十併结5节、含动力与各服务头牌；整盒不等于四万十单组5节。模型无振子机构。

[KATO 10-1504](https://www.katomodels.com/product/n/jrs_2000)为普通2000三节，无非贯通Green合造2000形，附宇和海、足摺等头牌，属于2000年代小门窗、室内更新后旧形态。[10-2103足摺](https://www.katomodels.com/product/n/jrs_2000_ashizuri)为2024年高知所更新形态两节；[10-2104宇和海](https://www.katomodels.com/product/n/jrs_n2000_uwakai)是车头不同的N2000三节。两个新品截至核查日均在[官方2026-10-29预定出货](https://www.katomodels.com/schedule)之前，必须写预定，且原厂明确更正为非DCC Friendly。若root把预设名改成“2000／N2000”才考虑把10-2104从variant改exact。

Marine Liner 已核各原厂内容列表：

| 品号 | 版本 | 盒内节数 | 编成／标识 |
|---|---|---:|---|
| [98259](https://www.tomytec.co.jp/tomix/products/n/98259.html) | A | 5 | M2 蓝带、桃太郎与猴 |
| [98260](https://www.tomytec.co.jp/tomix/products/n/98260.html) | B | 5 | M4 红带、桃太郎与犬；官网有涂装文字更正 |
| [98339](https://www.tomytec.co.jp/tomix/products/n/98339.html) | C | 5 | M1 蓝带、桃太郎与犬 |
| [98340](https://www.tomytec.co.jp/tomix/products/n/98340.html) | D | 5 | M6 红带、桃太郎与雉 |
| [98389](https://www.tomytec.co.jp/tomix/products/n/98389.html) | E | 5 | M3 蓝带、桃太郎与雉，M-13 |
| [98390](https://www.tomytec.co.jp/tomix/products/n/98390.html) | F | 6 | M5 红带、桃太郎与猴，2007—2010年含サハ223-2000的历史6节，variant |

一盒即含JR四国5000三节与JR西日本223-5000两节，动力在5000形，不需再购买另一个“增结盒”。上述仅列盒内节数，不表示当前在库可售。

## 未纳入的产品线索

- 8600：[KATO官方X公告](https://x.com/kato_team/status/2063093535616721295)目标为2027年度，详细品号、盒内节数未定。原帖403，但搜索索引可见公告原文；不计入已确认产品。没有以“2027年春”替换官方“2027年度”目标，也没编造2节/3节盒号。
- 2600：出版商2018年介绍指向PERMIL 1:150两节纸KIT，但[原厂商城](https://permil.cart.fc2.com/)当前403，未获原厂完整配置或品号，不录入。没有把商城内部ID当商品SKU。
- 未查到本轮候选的可靠原厂最小通过半径，不新增R282/R315数字。

铁路服务起讫由JR四国独立页面确证：[潮风](https://www.jr-shikoku.co.jp/01_trainbus/vehicle-info/shiokaze.html)、[石锤](https://www.jr-shikoku.co.jp/01_trainbus/vehicle-info/ishizuchi.html)、[宇和海](https://www.jr-shikoku.co.jp/01_trainbus/vehicle-info/uwakai.html)、[南风](https://www.jr-shikoku.co.jp/01_trainbus/vehicle-info/nanpu.html)、[四万十](https://www.jr-shikoku.co.jp/01_trainbus/vehicle-info/shimanto.html)、[足摺](https://www.jr-shikoku.co.jp/01_trainbus/vehicle-info/ashizuri.html)、[涡潮](https://www.jr-shikoku.co.jp/01_trainbus/vehicle-info/uzushio.html)、[Marine Liner](https://www.jr-shikoku.co.jp/01_trainbus/vehicle-info/marine.html)。日英名称采用[JR官方英文字词指南](https://www.jr-shikoku.co.jp/global/pdf_guide/english.pdf)，该指南写Nanpu，部分车头实物写Nampu，注意年代/显示方式差异。

仅修改研究文件；未改网站、主产品库、公开仓库或部署。
