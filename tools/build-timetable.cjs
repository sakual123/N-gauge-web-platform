/* Rebuild browser data from editable JSON; no dependencies. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),data=JSON.parse(fs.readFileSync(path.join(root,'data/timetables.json'),'utf8'));
const entries=Object.values(data.presets),counts={},coverage={},presetStatuses={},ids=new Set();
for(const entry of entries){
 assert(entry.departures.length,'Missing trips');coverage[entry.coverage.level]=(coverage[entry.coverage.level]||0)+1;
 presetStatuses[entry.departures[0].status]=(presetStatuses[entry.departures[0].status]||0)+1;entry.coverage.count=entry.departures.length;
 for(const t of entry.departures){assert(/^([01]\d|2[0-3]):[0-5]\d$/.test(t.time),t.id+' invalid time');assert(!ids.has(t.id),'Duplicate '+t.id);ids.add(t.id);assert(t.source?.startsWith('https://')&&t.evidence,t.id+' missing source');counts[t.status]=(counts[t.status]||0)+1;}
}
Object.assign(data,{presetCount:entries.length,departureCount:ids.size,statusCounts:counts,coverageCounts:coverage,presetStatusCounts:presetStatuses});
/* Share repeated provenance strings without losing source notes in the browser. */
const freq=new Map();function count(v){if(typeof v==='string'&&v.length>=16)freq.set(v,(freq.get(v)||0)+1);else if(Array.isArray(v))v.forEach(count);else if(v&&typeof v==='object')Object.values(v).forEach(count);}count(data);
const pool=[...freq].filter(([s,n])=>n>1&&s.length*(n-1)>n*12).map(([s])=>s),indexes=new Map(pool.map((s,i)=>[s,i]));
const packed=JSON.stringify(data,(_,v)=>typeof v==='string'&&indexes.has(v)?{$s:indexes.get(v)}:v);
const js='/* Fixed '+data.date+' JST. Edit data/timetables.json. */\nwindow.RAIL_TIMETABLE=(()=>{const p='+JSON.stringify(pool)+',d='+packed+';function unpack(v){if(!v||typeof v!=="object")return v;if(!Array.isArray(v)&&Object.keys(v).length===1&&Number.isInteger(v.$s))return p[v.$s];for(const k of Object.keys(v))v[k]=unpack(v[k]);return v;}return unpack(d);})();\n';
fs.writeFileSync(path.join(root,'dist/timetable-data.js'),js);
const md=['# 固定周日班次库 · V7','','参考日 **'+data.date+'（周日）· Asia/Tokyo**。'+entries.length+' 个车辆／服务预设，'+ids.size.toLocaleString('en-US')+' 条参考记录。多个车型可能共用实际班次，记录数不等于独立列车数。','','## 核对范围','','- 所列范围全天：'+(coverage.full||0)+' 个预设。','- 仍有缺口：'+(coverage.partial||0)+' 个预设。','- 周日无运行或历史参考：'+(coverage.inactive||0)+' 个预设。','','“全天”按 coverage.scope 所列的出发站、方向、种别核对，不表示全网络或每个车底的运用。具体车型混用时，只保证同线路服务参考。运行日状态另行标注：dated 已核对指定日；holiday 土休日；daily 每日参考；calendar 班次公布但日期仍需核对；weekday 其他运行日；legacy 怀旧参考。','','## 使用与维护','','右上角设置 → 出发站、方向、时段、关键词 → 选择参考班次。筛选不修改当前行，选班后仍可修改时间。午夜后的末班显示00:xx；原表24:xx保留在sourceTime和serviceDayOffset。','','在线核对页 timetable.html 每页显示50条。编辑 data/timetables.json 后运行 `node tools/build-timetable.cjs`，再运行 `node tools/check-timetable.cjs` 和 `node tools/check-ticker.cjs`。浏览器版本仅共享重复字符串，完整来源证据保留。','','| 车辆／服务 | 记录数 | 完整度 | 实际范围 |','|---|---:|---|---|'];
for(const [id,e] of Object.entries(data.presets))md.push('| '+e.label+' (`'+id+'`) | '+e.departures.length+' | '+({full:'所列范围全天',partial:'尚有缺口',inactive:'周日无运行／历史'}[e.coverage.level]||e.coverage.level)+' | '+String(e.coverage.scope).replace(/\|/g,'／').replace(/\n/g,' ')+' |');
fs.writeFileSync(path.join(root,'TIMETABLES.md'),md.join('\n')+'\n');
console.log(JSON.stringify({presets:entries.length,references:ids.size,coverage,browserBytes:Buffer.byteLength(js),sharedStrings:pool.length},null,2));
