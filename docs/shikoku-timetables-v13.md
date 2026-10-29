# JR四国 V13 时刻资料核对

核对日期：2026-10-28。冻结业务日期保持 **2026-10-25（日曜日）、Asia/Tokyo**。

交付：`work/shikoku-timetables-v13.json`。未改网站、正式资料库或部署。十个 vehicleId 已按 root 确认统一为 `sq` 前缀。

## 可合入范围

| vehicleId | 代表站／所选服务与方向 | 班次数 |
|---|---|---:|
| sq8000-shiokaze | 岡山→松山／伊予西条、しおかぜ | 15 |
| sq8600-shiokaze | 同上；共享服务参考，不保证8600执行全部 | 15 |
| sq8000-ishizuchi | 高松→松山／伊予西条、いしづち | 17 |
| sq8600-ishizuchi | 同上；共享服务参考，不保证8600执行全部 | 17 |
| sq2700-nanpu | 岡山→高知、南風 | 14 |
| sq2700-shimanto | 高知→高松、しまんと | 2 |
| sq2000-uwakai | 松山→宇和島、宇和海 | 16 |
| sq2000-ashizuri | 高知→中村／宿毛、あしずり | 7 |
| sq2600-uzushio | 高松→徳島、うずしお（2600/2700混用） | 17 |
| sq5000-marineliner | 高松→岡山、マリンライナー4～70号 | 34 |

合计 **154条预设班次**；8000/8600重复共享服务后，唯一服务班次 **122条**。八个服务范围原始123条（包括不合入5000预设的Marine Liner 2号）。

`coverage.level=full` 指表中所选站、方向、列车名的全天，绝非全线路所有站、双方向或具体车底全天。每条 `t.note`、每个 `coverage.scope` 均明确：**10/25服务时刻已核，车型混用／替代另核，不保证当日车底**。不会凭列车名宣称具体车型或涂装。

## 一手日期证据

主要资料来自 JR西日本官方查询，对四国线路同样提供列车详情与运行日历：

- [2467 岡山・高松→四国方面](https://timetable.jr-odekake.net/line-timetable/2467?date=20261025)：しおかぜ、いしづち、南風。
- [2468 四国→岡山方面](https://timetable.jr-odekake.net/line-timetable/2468?date=20261025)：高松发Marine Liner。
- [2469 予讃・内子線下行](https://timetable.jr-odekake.net/line-timetable/2469?date=20261025)：松山发宇和海。
- [2471 土讃線下行](https://timetable.jr-odekake.net/line-timetable/2471?date=20261025)：高知发あしずり。
- [2473 土讃線上行](https://timetable.jr-odekake.net/line-timetable/2473?date=20261025)：高知发しまんと。
- [2479 高徳線下行](https://timetable.jr-odekake.net/line-timetable/2479?date=20261025)：高松发うずしお。

上述实际保存页均显示“2026年10月25日”。逐班列车详情选择同一天，**2026年10月日历的25格全部为 `drivingday-01`**（运行日）；同时保留 `operatingDaysRaw`。所有合入班次均取得具体详情；无旧时刻冒充 `dated`，没有仅挑两班或推算发车间隔。

官网详情页脚目前写JR時刻表2026年11月号，但本次以实际页面明确显示的2026-10-25查询与逐车日历为日期证据，不改为今天或11月日期。

## 抽查与关键选栏

官方併結详情有两套列车栏，不能一律取第一栏：

1. 区间表 `tr.train-name`、`tr.train-type-no`、`button.btn-detail[data]` 对齐取服务名、号数及详情链接。
2. 详情 `tbody.train-details` 的“列車名”行按完全相同服务名＋号数找到列号。例 `しおかぜ1号` 为第一栏，`いしづち1号` 为第二栏。
3. `tbody.time-details` 每站是“站名＋时刻/站台×列数”。取对应列；第二栏遇“併結”箭头后继承本体栏后续时刻。箭头前空值／`||`不作为停站。
4. 从代表站的“発”时间开始，逐站保留实际有数字时间的停站，排除“レ”。终点取最后实际到达站；所有 `stops[-1]` 已校验等于 `destination`。
5. 日历与原始运转日保留，原始详情SHA-256保留；稳定ID为vehicleId与该班身份字段的SHA-256前12位。

重点抽查记录：

- [しおかぜ1号／いしづち1号联合详情](https://timetable.jr-odekake.net/train-timetable/18541?date=20261025)：前者岡山07:22，后者高松07:37；后者宇多津併結，正确沿用到松山10:06，不能因第二栏后部留空就截断为宇多津。
- しおかぜ29号：岡山22:00→伊予西条；いしづち29号：高松22:20→伊予西条，不伪写松山。
- しまんと2号／4号：高知04:51／20:32→高松，全天只有两班，与先前“只补两班参考”情况不同。
- あしずり7号：高知15:49→宿毛；其余所选奇数号为中村，未混为同一终点。
- Marine Liner 2号：高松04:35→岡山，本次官方日期表有车，但官方编成图是两辆普通车，不带5000系双层Green／指定席车，因此从5000预设排除。4～70号34班保留。原始2号仍在 evidence scopes.json 中以便审计。

## JR四国资料交叉核对与车型限制

- [时刻表官方入口](https://www.jr-shikoku.co.jp/01_trainbus/jikoku/index.html)。松山／高知方向连接PDF均有 **2026年3月14日改正**题注；已下载并保存SHA。
- [予讃・松山方面2026连接表](https://www.jr-shikoku.co.jp/01_trainbus/jikoku/uwajima_matsuyama0314.pdf)。
- [土讃・高知方面连接表](https://www.jr-shikoku.co.jp/01_trainbus/jikoku/sukumo_kochi.pdf)。
- [高徳・高松方面连接表](https://www.jr-shikoku.co.jp/01_trainbus/jikoku/tokushima_takamatsu.pdf)。
- [列车编成官方PDF](https://www.jr-shikoku.co.jp/01_trainbus/jikoku/hensei.pdf)：三页已视觉查看，题注仍是 **2025年3月15日改正**，只作编成参考与Marine2号排除依据，不能当作2026-10-25每一班车底的指定保证。
- 高松站PDF仍标2025.03.15；高知站实际图像页脚2026.03.14。日期不同已记录，均没有拿旧站表冒充逐车日期验证。
- [官方うずしお无障碍车辆资料](https://www.jr-shikoku.co.jp/02_information/care/tokkyu_uzushio/)说明两辆编成可为2600或2700，故只凭两辆不能进一步断言2600。此次sq2600的17班范围明确为服务层面，不锁定2600系列。
- [2026官方アンパンマン列车册](https://www.jr-eki.com/aptrain/pdf/aptrain2026.pdf)第3页视觉查看可交叉看到しおかぜ9/21号、宇和海3/9/17号及うずしお9/15/21/27/33号等，册注自2026-03-01信息，检修可能普通车替代。未把这些涂装或编组保证扩大到其余班次。

## 原始证据文件

全部放在 `work/shikoku-timetable-evidence-v13/`，不建议把原厂家PDF、宣传册图像上传开源网站：

- `west-line-*.html`：区间表原始HTML。2467/2468/2469/2471/2473/2479为本次有效服务范围；其他探索页不进入数据。
- `train-*.html`：原始逐车详情，共146个URL缓存；併結详情会由两个服务共享。
- `parsed-trains.json`：选择正确列后的字段、日历格class与原始车站时刻。
- `scopes.json`：八个完整服务范围，包含Marine2号用于排除审计。
- `build.py`：选栏、日历断言和停站提取逻辑；`finalize.py`：十个固定ID映射、Marine排除与稳定ID。
- `*.pdf`、`*.json`、`*.txt`及渲染PNG：JR四国官方资料及SHA-256。

`rawStationTimes`、`equipmentRaw`、`operatingDaysRaw` 等可保留在正式数据，也可由root留在研究文件，仅正式合入现有schema需要的字段。原始内容始终保留在本交付和证据目录。
