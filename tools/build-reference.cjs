const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);for(const file of ['catalog','catalog-regions','catalog-expanded','special-services','journey-data','model','journey-model'])vm.runInContext(fs.readFileSync(path.join(root,'dist',file+'.js'),'utf8'),ctx);const D=ctx.window.RAIL_DATA;
let catalog='# 车辆与线路目录 · V5\n\n共 '+D.vehicles.length+' 个预设，比 V4 新增 103 个。按“地区 → 类型 → 线路 → 车辆”选择；初始节数是可编辑模型参考值，不保证等于实车编组。私铁 / 地方交通类包含明确标明运营性质的市营与第三部门铁路。\n\n| 地区 | 新干线 | 特急 | 通勤 | 私铁 / 地方交通 | 合计 |\n|---|---:|---:|---:|---:|---:|\n';
for(const r of D.regions)catalog+='| '+r.label+' | '+D.categories.map(c=>D.matchingVehicles(r.id,c.id).length).join(' | ')+' | '+D.matchingVehicles(r.id).length+' |\n';
for(const region of D.regions){catalog+='\n## '+region.label+'\n';for(const category of D.availableCategories(region.id)){catalog+='\n### '+category.label+'\n';for(const route of D.availableRoutes(region.id,category.id)){catalog+='\n#### '+route.label+'\n\n| 车辆 / 服务 | 车辆型号 | 初始节数 | 运营性质 | 官方资料 |\n|---|---|---:|---|---|\n';for(const v of D.matchingVehicles(region.id,category.id,route.id))catalog+='| '+v.label+' / '+v.name+' | '+v.series+' | '+v.cars+' | '+(v.ownership||D.routes[v.route].ownership||(/jr/.test(v.operator)?'JR':'私铁 / 地方交通'))+' | [资料]('+D.sources[v.source]+') |\n';}}}
fs.writeFileSync(path.join(root,'CATALOG.md'),catalog);
const references=[
 ['新大阪 LCD 发车标实拍，2016','https://ys223.blogspot.com/2016/12/jr.html','作者明确记录最底部滚动停站，日英主表的备注显示自由席。用于确定显示方式，旧自由席区分不照搬到现行列车。'],
 ['新宫站 LED 发车标实拍，2021','https://kansai-jruser.com/archives/shingu-electric-bulletin-board.html','最上行的黑潮先发时，最下行持续滚动该班停站。支持“跟随最近待发班次”的实现思路。'],
 ['米原白鹭号滚动座席实拍，2024年2月','https://kansai-jruser.com/archives/maibara-shirasagi-non-reserved.html','实拍记录自由席、指定席号车的滚动文字。文章同时指出之后改为全指定，证明不能把旧实拍的车厢号直接当现行规则。'],
 ['新大阪雷鸟号实拍，2024年3月','https://kansai-jruser.com/archives/shin-osaka-thunderbird-for-tsuruga.html','全指定席改正后，仍有停站滚动案内；行先已缩为敦贺。'],
 ['JR 东日本新干线 LCD 实拍及现场视频入口','https://r113.sakura.ne.jp/p/hasshahyo/jre-shinkansen-display/index.html','仙台实拍可见停站、全车指定席与编组信息。此类 LCD 也会使用静态分区，并非所有车站都使用相同的底部滚动条。'],
 ['JR 东海：2025年度希望号全指定席期间公告','https://jr-central.co.jp/news/release/_pdf/000044011.pdf','普通期希望号自由席为1、2号车，繁忙期有全车指定席。模型版用逐班开关处理，不根据设备当前日期擅自改变手动场景。'],
 ['JR 东海：希望号繁忙期全指定席','https://railway.jr-central.co.jp/nozomi/','核对现行规则与期间，注意普通期和繁忙期的区别。'],
 ['JR 北海道：2026年3月14日全车指定席化','https://www.jrhokkaido.co.jp/zensha/index.html?sp=1','现役道内特急不再自动显示自由席；超级白鸟是保留的怀旧服务，单独处理。'],
 ['JR 东日本：Saphir 停站与时刻','https://www.jreast.co.jp/saphir/cars/station/','完整核对东京发及新宿发不同停站；可按参考出发站截取或自定义本班停站。'],
 ['JR 九州：新干线与特急编组设备图','https://www.jrkyushu.co.jp/train/kids/guardian/train_equipment/index.html','逐图检查N700八节、800六节、N700S西九州六节。N700的6号车为Green合造车；800与西九州Kamome没有Green Car。图中也提示座席区分可随列车变化。'],
 ['JR 东日本：E5','https://www.jreast.co.jp/train/shinkan/e5.html','实车十节，Green为9号车、GranClass为10号车；六节模型不会显示这两个号车数字。'],
 ['JR 东日本：E6','https://www.jreast.co.jp/train/shinkan/e6.html','实车七节、号车编号为11至17，和模型从1开始的节数不同。'],
 ['东武 TH Liner 时刻及停站','https://www.tobu.co.jp/railway/th/timetable/','上下行停站及起终点不同；北千住不能按普通日比谷线停站处理。']
];
const sections=[
 ['考证结论','底部滚动停站与自由席 / 指定席号车有直接实拍依据。也有LCD静态分区、按站台轮播、广告或乘车提醒等方式，因此不把“全部站台都只滚最近一班”当作统一标准。本项目沿用JR东日本总框架，并按你的需求增加最底部独立滚动栏。'],
 ['本版滚动内容','番线、发车时刻、列车名 / 号数、行先 → 停站 → 座席说明。没有完整核对到某一具体班次的默认站表，明确写“主な停車駅”；普通 / 各停可显示“终点前各站停车”。准确复现某班时，在设置中选择自定义完整停站。'],
 ['最近班次的判定','默认比较四个手动时刻，以设备当前分钟为基准，按每日24小时循环选择下一个待发时刻。23:59后的00:01会正确排在次日前方；同分钟按屏幕行序选取。可改为1站台 / 2站台最近、固定某行，或指定模型时刻。不会删除已显示的手动班次，也不会查询真实运营数据。'],
 ['停站编辑','右上角··· → 对应班次 → 滚动停站与座席。可选择参考出发站，自动截取、反向参考路径；或输入顿号、逗号、换行分隔的完整停站。自定义行先没有匹配路径时提示个别设置，不把未知行先拼成虚构路线。'],
 ['座席号车与模型节数','已核对的实车编组与模型节数一致时显示号车；不一致时显示类别，例如“全车指定席、Green Car、GranClass”。E6 / E8的11至17号车是实车编号，不按七节模型擅自重编。也提供本班座席说明自由编辑。'],
 ['票制区别','京王、东急、相铁、西铁等不额外收费的“特急”使用一般车说明，不因名称含特急就增加指定席或Green。u-seat、PREMIUM CAR、PRiVACE、名铁特别车继续分开处理。800系和西九州Kamome不误加Green；36plus3等全Green服务不写成普通车自由席。'],
 ['滚动与可读性','文字从右向左连续循环，标准速度55px/s，可选30、45、70px/s；该速度是网页可读性设置，并非对实物屏幕测量出的统一值。支持暂停、关闭。系统启用减少动态效果时改为静态横向阅读。新增栏保留在通知栏下方，四行列车布局不变。'],
 ['分类范围','新增103个预设：关东46、东海14、北海道8、九州35。北海道包括道南渔火、札幌地下铁 / 市电及函馆市电，明确标注第三部门、公营地下铁或公设民营轨道。类型名称扩为“私铁 / 地方交通”，不会把这些运营性质混称为大手私铁。'],
 ['资料适用范围','核对日期2026-10-25。停站与座席可因班次、运行日、增解编、临时运用变化。这里是模型的手动班次显示；默认参考站表不等同于根据手填车次号查询的现实时刻表。旧实拍用于显示方式考证，现行座席按运营商资料处理。']
];
let md='# 滚动案内考证与实现 · V5\n\n';for(const [title,text] of sections)md+='## '+title+'\n\n'+text+'\n\n';md+='## 实拍与运营商依据\n\n';for(const [title,url,note] of references)md+='- ['+title+']('+url+')：'+note+'\n';md+='\n## 新增运营商车辆资料\n\n';for(const key of ['tobu','seibu','odakyu','keisei','keikyu','keio','tokyu','sotetsu','tokyoMetro','toei','tx','enoden','hakone','meitetsu1200','meitetsuFleet','shizutetsu','entetsu','izuhakone','izukyu','aikan','aonami','tenhama','isaribi','sapporoMetro','sapporoTram','hakodateTram','kyushu','kyushuDS','nishitetsu','fukuokaMetro','kumaden','orange','minamiaso'])md+='- ['+key+']('+D.sources[key]+')\n';fs.writeFileSync(path.join(root,'SCROLL-RESEARCH.md'),md);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
let body='<a href="index.html">← 返回站台</a><h1>滚动案内考证 · V5</h1>';for(const [title,text] of sections)body+='<h2>'+esc(title)+'</h2><p>'+esc(text)+'</p>';body+='<h2>实拍与运营商依据</h2><ul>';for(const [title,url,note] of references)body+='<li><a href="'+esc(url)+'" target="_blank" rel="noopener">'+esc(title)+'</a><p>'+esc(note)+'</p></li>';body+='</ul><h2>全车型目录</h2><p><a href="special-services.html">237个预设的特殊标识、车型与逐项资料</a></p>';
fs.writeFileSync(path.join(root,'dist/scroll-research.html'),'<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>滚动案内考证</title><style>body{margin:0;background:#10161a;color:#e0e6dc;font:15px/1.9 system-ui,sans-serif}main{max-width:940px;margin:auto;padding:30px 22px 70px}h1{font-size:28px}h2{font-size:20px;margin-top:30px;color:#d4e6c7}a{color:#afd196;text-underline-offset:3px}li{margin:15px 0}li p{font-size:13px;color:#b4c1ab;margin-top:4px}p{overflow-wrap:anywhere}</style><main>'+body+'</main></html>');
console.log('Catalog and scrolling research generated for '+D.vehicles.length+' presets.');
