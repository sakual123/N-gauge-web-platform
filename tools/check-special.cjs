const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const file of ['catalog.js','catalog-regions.js','catalog-expanded.js','special-services.js','journey-data.js','timetable-data.js','timetable-model.js','model.js','journey-model.js'])vm.runInContext(fs.readFileSync(path.join(root,'dist',file),'utf8'),ctx,{filename:file});
const D=ctx.window.RAIL_DATA,M=ctx.window.RAIL_MODEL;
const marks=(id,patch={})=>D.featureIds(Object.assign(M.makeRow('test',1,id,'20:08'),patch),M.byId.get(id));
const has=(id,feature)=>assert(marks(id).includes(feature),id+' must have '+feature),lacks=(id,feature)=>assert(!marks(id).includes(feature),id+' must not have '+feature);
assert.equal(D.vehicles.length,237);assert.equal(D.serviceFeatureIds.length,18);assert.equal(Object.keys(D.serviceBrands).length,27);
const reaches=new Set();for(const r of D.regions)for(const c of D.availableCategories(r.id))for(const route of D.availableRoutes(r.id,c.id))for(const v of D.matchingVehicles(r.id,c.id,route.id)){assert(!reaches.has(v.id));reaches.add(v.id);}
assert.equal(reaches.size,237);
for(const v of D.vehicles){
  const s=v.special;assert(s,v.id);assert(Array.isArray(s.features)&&Array.isArray(s.optional)&&Array.isArray(s.sources));assert(s.sources.length&&s.sources.every(x=>typeof x==='string'&&x.startsWith('https://')),v.id+' needs sources');
  for(const id of [...s.features,...s.optional])assert(D.serviceFeatureIds.includes(id),v.id+':'+id);
  if(s.brand)assert(Object.hasOwn(D.serviceBrands,s.brand),v.id);
  assert(D.types.includes(v.type));assert(D.lines[v.line]&&D.routes[v.route]);assert(D.sources[v.source]);assert.equal(M.cars(v.cars),v.cars);
  for(const dest of v.destinations)assert(D.destinations[dest]);
  const row=M.makeRow('test',1,v.id,'20:08');assert.deepEqual(Array.from(marks(v.id,{markerMode:'off'})),[]);assert.equal(D.brandFor({...row,markerMode:'off'},v),'');
  assert.equal(D.brandFor({...row,showBrand:false},v),'');
}
for(const spec of [...Object.values(D.serviceFeatures),...Object.values(D.serviceBrands)])if(spec.src)assert(fs.existsSync(path.join(root,'dist',spec.src)),spec.src);
assert.deepEqual(Array.from(marks('e261-saphir')),['green','premiumgreen','compartment','cafe']);
for(const id of ['e5-hayabusa','e5-yamabiko','e5-nasuno','e7-kagayaki','e7-toki','w7-kagayaki','w7-tsurugi','h5-hayabusa']){has(id,'green');has(id,'granclass');}
for(const id of ['e6-komachi','e8-tsubasa','n700-sakura','n700-mizuho','n700s-nozomi','n700a-kodama']){has(id,'green');lacks(id,'granclass');}
for(const id of ['e353-fuji','e257-akagi','e257-kusatsu','hc85-nanki','500-kodama','700-railstar','789-kamui','733-airport','kintetsu-hinotori','kt50000-shimakaze','kh8000','hk2300'])lacks(id,'green');
has('789-kamui','useat');has('733-airport','useat');has('e233-chuo','green');has('273-yakumo','green');has('287-kinosaki','green');
has('e257-odoriko','green');assert(!marks('e257-odoriko',{destination:'修善寺'}).includes('green'));
has('kh8000','premiumcar');has('kh3000','premiumcar');assert(!marks('kh8000',{type:'普通'}).includes('premiumcar'));assert(marks('kh3000',{type:'通勤快急'}).includes('premiumcar'));
has('hk2300','privace');assert(!marks('hk2300',{type:'普通'}).includes('privace'));lacks('hk9300','privace');lacks('225-shinkaisoku','aseat');
assert.deepEqual(Array.from(marks('hk9300',{markerMode:'custom',markerFeatures:['privace','constructor','__proto__','privace']})),['privace']);
assert(marks('225-shinkaisoku',{markerMode:'custom',markerFeatures:['aseat']}).includes('aseat'));
for(const id of ['hokutosei','285-sunrise-seto','285-sunrise-izumo']){has(id,'sleeper');has(id,'compartment');lacks(id,'green');}
const old=M.defaults();old.rows[0].vehicleId='e261-saphir';old.rows[0].destination='模型町';old.rows[0].time='22:38';old.formations['e5-hayabusa']=8;delete old.rows[0].markerMode;delete old.rows[0].markerFeatures;delete old.rows[0].showBrand;
let restored=M.normalize(JSON.parse(JSON.stringify(old)));assert.equal(restored.rows[0].markerMode,'auto');assert.equal(restored.rows[0].destination,'模型町');assert.equal(restored.rows[0].time,'22:38');assert.equal(M.carsFor(restored,'e5-hayabusa'),8);assert(D.featureIds(restored.rows[0],M.byId.get('e261-saphir')).includes('green'));
old.rows[0].markerMode='custom';old.rows[0].markerFeatures=['green','constructor','green'];old.rows[0].showBrand=false;old.rows[0].seatAvailability='△';restored=M.normalize(old);assert.deepEqual(Array.from(restored.rows[0].markerFeatures),['green']);assert.equal(restored.rows[0].showBrand,false);assert.equal(restored.rows[0].seatAvailability,'△');
M.applyVehicle(restored.rows[0],'kh3000');assert.equal(restored.rows[0].markerMode,'auto');assert.equal(restored.rows[0].seatAvailability,'');assert.equal(restored.rows[0].time,ctx.window.RAIL_TIMETABLE_MODEL.trips('kh3000')[0].time);
old.version=1;assert.equal(M.normalize(old).rows[0].vehicleId,'e261-saphir');
for(const scene of ['east','express','shinkansen','mixed','original','west','kansai','tokai','hokkaido','specialJR','specialPrivate','specialSeats','kantoPrivate','tokaiPrivate','hokkaidoLocal','kyushu']){const s=M.scene(scene);assert.equal(s.rows.length,4);assert.deepEqual(Array.from(s.rows,r=>r.platform),[1,1,2,2]);for(const r of s.rows)assert(M.byId.has(r.vehicleId));}
const keep={'789-hakucho':6,'e233-keihin':10,'e233-ueno-tokyo':4,'e5-hayabusa':6,'e6-komachi':3,'hokutosei':6,'kintetsu-8a':4,'kintetsu-hinotori':6};for(const [id,n] of Object.entries(keep))assert.equal(M.carsFor(M.defaults(),id),n);
const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)){const ref=m[1].split('?')[0];if(!/^(?:https?:|data:)/.test(ref)&&!['special-services.html','scroll-research.html'].includes(ref))assert(fs.existsSync(path.join(root,'dist',ref)),ref);}
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
let md='# 特殊标识与全车型核对表 · V5\n\n237 个预设逐项配置，不按“特急”一律添加 Green Car。设备配置与模型编组节数独立。\n\n';
md+='右上角 `···` → 对应班次 → **特殊标识与座席图标**，支持自动、自定义、隐藏，以及品牌开关、洛楽 / ラピート αβ 和手动空席符号。更新后原有保存的车型会直接获得自动标识；自定义编组、车次与行先继续保留。\n\n';
md+='## 判定规则\n\n- 蓝宝石踊子在列车名旁显示官方 Green Car 图标，并附 Premium Green、个室、咖啡图示。\n- E5 / E7 / W7 / H5 显示 Green Car + GranClass；E6 / E8 / N700 不显示 GranClass。\n- 富士回游、赤城、草津四万、HC85 南纪、500 / Rail Star 不自动显示 Green Car。踊子修善寺支编组也不自动显示 Green Car。\n- 神威 / 快速 Airport 的 u-seat 与 Green Car 分开；225 A-SEAT、9300 PRiVACE 需手动指定，避免给不对应的编组加标。\n- 京阪 3000 系按 2025 年 10 月扩为两节 Premium Car 的资料核对；普通等非营业种别不显示 PC。8000 系另附双层车设备图示。阪急 2300 系 PRiVACE 同样按营业种别启用。\n- 北斗星 / Sunrise 标为寝台和个室；私铁高级座席不冒用 JR Green Car。\n- ○△× 仅手动设置，不推断或虚构实时余席。\n\n';
md+='## 图案与复现范围\n\n直接使用原始官方图案：Green Car、u-seat、GranClass（官方图案的 Commons 副本）、火鸟、岛风、青丹吉、青之交响曲、京阪 PREMIUM CAR、阪急 PRiVACE。青丹吉仅在显示时裁切营销背景，源图片不改写。其余 23 种品牌为文字名牌；Premium Green 等设备使用可读的示意图形，未宣称为逐像素官方图案。\n\n各站发车标的字体、图标位置、灯色、显示内容依设备和年代变化；这里将实拍与车型设备资料整合到 JR 东日本风格的四行界面。双层、展望、咖啡等为设备信息，不表示所有真实车站一定显示这些图标。\n\n';
let tableHtml='';
for(const region of D.regions){md+='## '+region.label+'\n\n| 类型 / 线路 | 车辆 / 服务 | 自动特殊标识 | 选配与说明 | 资料 |\n|---|---|---|---|---|\n';tableHtml+='<h2>'+esc(region.label)+'</h2><div class="table-scroll"><table><thead><tr><th>线路 / 服务</th><th>自动标识</th><th>规则与参考</th></tr></thead><tbody>';
for(const c of D.availableCategories(region.id))for(const route of D.availableRoutes(region.id,c.id))for(const v of D.matchingVehicles(region.id,c.id,route.id)){
 const s=v.special,labels=marks(v.id).map(id=>D.serviceFeatures[id].label);if(s.brand)labels.unshift(D.serviceBrands[s.brand].label+' '+(D.serviceBrands[s.brand].format==='official'?'官方图案':'文字名牌'));
 const opt=s.optional.length?'手动选配 '+s.optional.map(id=>D.serviceFeatures[id].label).join('、')+'。':'';
 const urls=[...new Set([...s.sources,...(s.brand?[D.serviceBrands[s.brand].source]:[])])];
 md+='| '+c.label+' / '+route.label+' | '+v.series+' / '+v.name+' | '+(labels.join('、')||'标准种别与列车名')+' | '+opt+s.note+' | '+urls.map((url,i)=>'[资料'+(i+1)+']('+url+')').join(' ')+' |\n';
 tableHtml+='<tr><td><small>'+esc(c.label+' · '+route.label)+'</small><br>'+esc(v.series+' / '+v.name)+'</td><td>'+esc(labels.join(' · ')||'标准种别与列车名')+'</td><td>'+esc(opt+s.note)+'<br>'+urls.map((url,i)=>'<a href="'+esc(url)+'" target="_blank" rel="noopener">资料 '+(i+1)+'</a>').join(' · ')+'</td></tr>';
}tableHtml+='</tbody></table></div>';}
fs.writeFileSync(path.join(root,'SPECIAL-DISPLAYS.md'),md);
fs.writeFileSync(path.join(root,'dist/special-services.html'),'<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>特殊标识 · 全车型核对表</title><style>body{margin:0;background:#10161a;color:#e3e8df;font:15px/1.7 system-ui,sans-serif}main{max-width:1160px;margin:auto;padding:28px 20px 60px}a{color:#b2d29c}h1{font-size:28px;font-weight:500}h2{font-size:21px;margin-top:35px}.intro{color:#b7c3b4;max-width:900px}.table-scroll{overflow-x:auto}table{border-collapse:collapse;width:100%;min-width:620px;font-size:13px}th,td{text-align:left;border-bottom:1px solid #35413b;padding:12px;vertical-align:top}th{background:#263229}td:first-child{width:31%}small{color:#a9b9a3}footer{margin-top:35px;color:#9aab93}</style><main><a href="index.html">← 返回发车标</a><h1>特殊标识 · 237 个预设核对表</h1><div class="intro"><p>右上角 ··· → 对应班次 → 特殊标识与座席图标，可选择自动、自定义或隐藏。模型节数的编辑不会错误改变实车座席等级。</p><p>Green Car / GranClass / u-seat / PREMIUM CAR / PRiVACE 独立配置。蓝宝石踊子、寝台特急、私铁品牌均有各自配置；选配设备按对应编组手动启用。○△× 只按手动设置显示。</p><p>原始官方图案：Green Car、u-seat、GranClass（官方图案的 Commons 副本）、火鸟、岛风、青丹吉、青之交响曲、PREMIUM CAR、PRiVACE。其他品牌为文字名牌；Premium Green、个室、咖啡、双层等为设备示意图。各站的实际显示依设备和年代变化，不将车型设备资料等同于每个车站的固定显示方式。</p><p><a href="assets/special/sources.json">图片原址与校验记录</a> · <a href="sources.html">原有线路资料与站台实拍</a></p></div>'+tableHtml+'<footer>模型駅 V6 · 2026-10-25 核对 · 手动站台模拟，无实时运营数据</footer></main></html>');
const result={result:'PASS',presets:D.vehicles.length,features:D.serviceFeatureIds.length,brands:Object.keys(D.serviceBrands).length,markedPresets:D.vehicles.filter(v=>v.special.features.length||v.special.brand).length,allPresetsHaveSources:true,metadataRules:'PASS',migration:'PASS',allScenes:'PASS'};
fs.writeFileSync(path.join(root,'VALIDATION-DATA.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));

