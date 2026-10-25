(() => {
  'use strict';
  const TT=window.RAIL_TIMETABLE_MODEL;
  const e=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
  function editor(row,state,onApply){
    const panel=e('div','timetable-panel'),caption=e('div','timetable-caption','固定班次 · '+TT.data.date+' 周日 · 日本时间');
    const select=e('select','control');select.id='reference-'+row.id;select.setAttribute('aria-label','官方参考班次');
    for(const t of TT.trips(row.vehicleId)){const o=e('option','',`${t.time} ${t.origin} → ${t.destination}${t.number?' · '+t.number:''}`);o.value=t.id;select.append(o);}
    select.value=row.referenceId||TT.trips(row.vehicleId)[0]?.id||'';
    const help=e('div','timetable-help');help.id='reference-info-'+row.id;help.setAttribute('aria-live','polite');
    function update(){help.replaceChildren();const t=TT.find(row)||TT.trips(row.vehicleId)[0];if(!t)return;const status=e('div','reference-status',TT.labels[t.status]||t.status);status.dataset.status=t.status;help.append(status,e('div','reference-current',`${row.origin||'出发站未设置'} ${row.time} → ${row.destination}${TT.modified(row)?' · 已手动调整':' · 与所选参考一致'}`));help.append(e('div','reference-note',t.note||''));if(t.trainNumber)help.append(e('div','reference-note','列车编号：'+t.trainNumber));if(t.source){const a=e('a','reference-source',t.sourceTitle||'查看官方时刻表');a.href=t.source;a.target='_blank';a.rel='noopener noreferrer';help.append(a);}}
    select.addEventListener('change',()=>{TT.apply(row,select.value);TT.remember(row,state);onApply();});
    const buttons=e('div','timetable-actions'),restore=e('button','small-button','恢复所选参考');restore.type='button';restore.id='restore-reference-'+row.id;restore.addEventListener('click',()=>{TT.apply(row,select.value);TT.remember(row,state);onApply();});
    const audit=e('a','reference-source','全部班次与核对记录');audit.href='timetable.html';audit.target='_blank';audit.rel='noopener';buttons.append(restore,audit);
    panel.append(caption,select,help,buttons);update();panel.updateReference=update;return panel;
  }
  window.RAIL_TIMETABLE_UI={editor,sync(){document.querySelectorAll('.timetable-panel').forEach(p=>p.updateReference?.());}};
})();
