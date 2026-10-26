(() => {
  'use strict';
  const TT=window.RAIL_TIMETABLE_MODEL,filterMemory=new Map();
  const e=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
  const option=(value,text)=>{const n=e('option','',text);n.value=value;return n;};
  function field(text,node){const wrapper=e('div','form-group'),label=e('label','form-label',text);label.htmlFor=node.id;wrapper.append(label,node);return wrapper;}
  function editor(row,state,onApply){
    const all=TT.trips(row.vehicleId),coverage=TT.coverage(row.vehicleId),key=row.id+':'+row.vehicleId;
    const filter={origin:'',direction:'',period:'',q:'',...filterMemory.get(key)};
    const panel=e('div','timetable-panel'),caption=e('div','timetable-caption','固定班次 · '+TT.data.date+' 周日 · 日本时间');
    const summary=e('div','timetable-coverage',`已收录 ${all.length} 班 · ${TT.coverageLabels[coverage.level]||'尚有缺口'}`);summary.dataset.level=coverage.level;
    const scope=e('div','reference-note','范围：'+coverage.scope);
    const grid=e('div','field-grid timetable-filters');
    const origin=e('select','control');origin.id='reference-origin-'+row.id;origin.append(option('','全部出发站'));
    [...new Set(all.map(t=>t.origin))].sort().forEach(v=>origin.append(option(v,v)));
    const direction=e('select','control');direction.id='reference-direction-'+row.id;direction.append(option('','全部方向'));
    [...new Set(all.map(TT.direction))].sort().forEach(v=>direction.append(option(v,v)));
    const period=e('select','control');period.id='reference-period-'+row.id;
    [['','全天'],['00-06','00:00–05:59'],['06-09','06:00–08:59'],['09-12','09:00–11:59'],['12-15','12:00–14:59'],['15-18','15:00–17:59'],['18-21','18:00–20:59'],['21-24','21:00–23:59']].forEach(([v,t])=>period.append(option(v,t)));
    const query=e('input','control');query.id='reference-search-'+row.id;query.type='search';query.placeholder='行先、号数、时间…';query.autocomplete='off';
    origin.value=filter.origin;direction.value=filter.direction;period.value=filter.period;query.value=filter.q;
    if(origin.selectedIndex<0)origin.value='';if(direction.selectedIndex<0)direction.value='';
    grid.append(field('出发站',origin),field('方向',direction),field('时段',period),field('检索班次',query));
    const select=e('select','control');select.id='reference-'+row.id;select.setAttribute('aria-label','官方参考班次');
    const count=e('div','timetable-count');count.id='reference-count-'+row.id;count.setAttribute('role','status');
    const help=e('div','timetable-help');help.id='reference-info-'+row.id;help.setAttribute('aria-live','polite');
    const buttons=e('div','timetable-actions'),restore=e('button','small-button','恢复所选参考'),clear=e('button','small-button','清除筛选');
    restore.type=clear.type='button';restore.id='restore-reference-'+row.id;
    const audit=e('a','reference-source','全部班次与核对记录');audit.href='timetable.html';audit.target='_blank';audit.rel='noopener';buttons.append(restore,clear,audit);
    function choices(){
      Object.assign(filter,{origin:origin.value,direction:direction.value,period:period.value,q:query.value});filterMemory.set(key,{...filter});
      const found=TT.filterTrips(row.vehicleId,filter);select.replaceChildren();
      const includes=found.some(t=>t.id===row.referenceId);
      if(!includes)select.append(option('',found.length?'请选择筛选出的班次…':'没有符合筛选的班次'));
      for(const t of found)select.append(option(t.id,`${t.time} ${t.origin} → ${t.destination}${t.number?' · '+t.number:''} · ${t.type}`));
      select.value=includes?row.referenceId:'';select.disabled=!found.length;restore.disabled=!select.value;
      count.textContent=`显示 ${found.length} / 共 ${all.length} 班`+(!includes&&row.referenceId?' · 当前班次在筛选范围外':'');
    }
    function update(){
      help.replaceChildren();const t=TT.find(row)||all[0];if(!t)return;
      const status=e('div','reference-status',TT.labels[t.status]||t.status);status.dataset.status=t.status;
      help.append(status,e('div','reference-current',`${row.origin||'出发站未设置'} ${row.time} → ${row.destination}${TT.modified(row)?' · 已手动调整':' · 与所选参考一致'}`),e('div','reference-note',t.note||''));
      if(t.trainNumber)help.append(e('div','reference-note','列车编号：'+t.trainNumber));
      if(t.source){const a=e('a','reference-source',t.sourceTitle||'查看官方时刻表');a.href=t.source;a.target='_blank';a.rel='noopener noreferrer';help.append(a);}
      if([...select.options].some(o=>o.value===row.referenceId))select.value=row.referenceId;
      restore.disabled=!select.value;
    }
    function apply(){if(!select.value)return;TT.apply(row,select.value);TT.remember(row,state);onApply();}
    select.addEventListener('change',apply);restore.addEventListener('click',apply);
    [origin,direction,period].forEach(n=>n.addEventListener('change',choices));query.addEventListener('input',choices);
    clear.addEventListener('click',()=>{origin.value=direction.value=period.value=query.value='';choices();});
    panel.append(caption,summary,scope,grid,count,select,help,buttons);choices();update();panel.updateReference=update;return panel;
  }
  window.RAIL_TIMETABLE_UI={editor,sync(){document.querySelectorAll('.timetable-panel').forEach(p=>p.updateReference?.());}};
})();
