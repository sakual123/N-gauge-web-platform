(() => {
 'use strict';
 const D=window.RAIL_DATA,TT=window.RAIL_TIMETABLE_MODEL,$=id=>document.getElementById(id),regionNames=Object.fromEntries(D.regions.map(r=>[r.id,r.label]));
 const inputs=['q','region','coverage','status','vehicle'].map($);let page=0,found=[];const size=50;
 const rows=D.vehicles.flatMap(v=>TT.trips(v.id).map(t=>({v,t,c:TT.coverage(v.id),search:[v.id,v.label,v.series,v.route,t.time,t.origin,t.destination,t.number,t.trainNumber,t.type,t.displayName].filter(Boolean).join(' ').normalize('NFKC').toLowerCase()})));
 function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
 function stat(value,label){const n=el('div',undefined,'stat');n.append(el('strong',Number(value||0).toLocaleString()),el('span',label));return n;}
 $('stats').append(stat(D.vehicles.length,'车辆／服务预设'),stat(rows.length,'参考记录（含共用班次）'),stat(TT.data.coverageCounts.full,'所列范围全天'),stat(TT.data.coverageCounts.partial,'尚有缺口'));
 for(const v of D.vehicles){const o=el('option',v.label);o.value=v.id;$('vehicle').append(o);}for(const r of D.regions){const o=el('option',r.label);o.value=r.id;$('region').append(o);}for(const [key,label] of Object.entries(TT.labels)){const o=el('option',label);o.value=key;$('status').append(o);}
 function sourceCell(t){const td=el('td');if(/^https:\/\//.test(t.source)){const a=el('a',t.sourceTitle||'官方来源 ↗');a.href=t.source;a.target='_blank';a.rel='noopener noreferrer';td.append(a);}return td;}
 function render(){
  const pages=Math.max(1,Math.ceil(found.length/size));page=Math.min(page,pages-1);const frag=document.createDocumentFragment();
  for(const {v,t,c} of found.slice(page*size,(page+1)*size)){
   const tr=el('tr'),vehicle=el('td',v.label);vehicle.append(el('small',(regionNames[v.region]||v.region)+' · '+v.series));
   const time=el('td');time.append(el('span',t.time,'time'),el('small',t.origin+' 发 · JST'+(t.serviceDayOffset?' · 原表 '+t.sourceTime:'')));
   const journey=el('td',(t.displayName||v.name)+(t.number?' '+t.number:''));journey.append(el('div',t.origin+' → '+t.destination),el('small',t.type+' · 列车编号 '+(t.trainNumber||'未标注')));
   const provenance=el('td'),label=el('span',TT.labels[t.status]||t.status,'status');label.dataset.status=t.status;
   const details=el('details'),summary=el('summary','范围与核对说明');details.append(summary,el('div',TT.coverageLabels[c.level]+'：'+c.scope),el('p',t.note||''),el('p',t.evidence||''));
   if(t.stops?.length)details.append(el('p',(t.stopsScope==='major'?'主要停站：':'停站：')+t.stops.join('・')));if(t.sourceSha256)details.append(el('small','来源指纹 '+t.sourceSha256.slice(0,16)));provenance.append(label,details);
   tr.append(vehicle,time,journey,provenance,sourceCell(t));frag.append(tr);
  }
  $('results').replaceChildren(frag);$('count').textContent=found.length.toLocaleString()+' 条 · 第 '+(page+1)+' / '+pages+' 页';$('previous').disabled=page===0;$('next').disabled=page>=pages-1;$('empty').hidden=found.length!==0;
 }
 function filter(){const [q,r,c,s,v]=inputs.map(n=>n.value.trim()),tokens=q.normalize('NFKC').toLowerCase().split(/\s+/).filter(Boolean);found=rows.filter(x=>(!r||x.v.region===r)&&(!c||x.c.level===c)&&(!s||x.t.status===s)&&(!v||x.v.id===v)&&tokens.every(t=>x.search.includes(t)));found.sort((a,b)=>a.v.label.localeCompare(b.v.label)||a.t.time.localeCompare(b.t.time));page=0;render();}
 inputs.forEach(n=>n.addEventListener(n.type==='search'?'input':'change',filter));$('previous').addEventListener('click',()=>{page--;render();});$('next').addEventListener('click',()=>{page++;render();});$('reset').addEventListener('click',()=>{inputs.forEach(n=>n.value='');filter();});filter();
})();
