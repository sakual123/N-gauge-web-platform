(() => {
  'use strict';
  const M=window.RAIL_MODEL,MAX_BYTES=1024*1024,rowIds=['outer-first','outer-next','inner-first','inner-next'];
  function parse(text){
    if(typeof text!=='string'||text.length>MAX_BYTES)throw new Error('请选择1MB以内的设置JSON备份。');
    let raw;try{raw=JSON.parse(text.replace(/^\uFEFF/,''));}catch(_){throw new Error('文件不是有效的JSON设置备份。');}
    if(!raw||typeof raw!=='object'||![1,2].includes(raw.version)||!Array.isArray(raw.rows)||raw.rows.length!==4)throw new Error('这不是支持的四行站台设置备份（v1或v2）。');
    const ids=new Set();for(const row of raw.rows){
      if(!row||typeof row!=='object'||Array.isArray(row)||!rowIds.includes(row.id)||ids.has(row.id))throw new Error('四班列车的标识不完整或重复，未导入。');
      ids.add(row.id);if(!M.byId.has(row.vehicleId))throw new Error('备份含当前版本不认识的车型，未导入。');
      if(typeof row.time!=='string'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(row.time))throw new Error('备份含无效班次时间，未导入。');
    }
    return M.normalize(raw);
  }
  function summary(state){return state.rows.map(row=>({id:row.id,platform:row.platform,label:(row.platform===1?'1 外圈':'2 内圈')+' · '+(row.id.endsWith('first')?'先发':'次发'),train:M.byId.get(row.vehicleId).label,time:row.time,destination:row.destination,cars:M.carsFor(state,row.vehicleId)}));}
  function bind({getState,apply}){
    const $=id=>document.getElementById(id),input=$('settings-file'),preview=$('backup-preview'),list=$('backup-trains'),status=$('backup-status'),applyButton=$('apply-backup'),undo=$('undo-backup');
    let pending=null,previous=null,ticket=0;
    const clear=()=>{ticket++;pending=null;preview.hidden=true;applyButton.disabled=true;input.value='';};
    $('import-settings').addEventListener('click',()=>{input.value='';input.click();});
    input.addEventListener('change',async()=>{
      const file=input.files?.[0];if(!file)return;clear();const current=ticket;status.textContent='正在读取备份…';
      try{
        if(file.size>MAX_BYTES)throw new Error('请选择1MB以内的设置JSON备份。');
        const next=parse(await file.text());if(current!==ticket)return;pending=next;list.replaceChildren();
        for(const row of summary(next)){const item=document.createElement('li'),top=document.createElement('div'),time=document.createElement('time'),name=document.createElement('strong'),detail=document.createElement('p');
          time.textContent=row.time;name.textContent=row.train;top.append(time,name);detail.textContent=row.label+' → '+row.destination+' · '+row.cars+'节';item.append(top,detail);list.append(item);}
        $('backup-name').textContent=M.text(file.name,160);
        const theme=window.RAIL_THEMES?.byId.get(next.display.theme)?.label||(next.display.theme==='auto'?'跟随车型':'JR 东日本');
        $('backup-summary').textContent='屏幕：'+theme+' · 固定时间记忆：'+Object.keys(next.timetablePins).length+'项 · 自动播报：'+(next.announcements.auto?'开启':'关闭');
        preview.hidden=false;applyButton.disabled=false;status.textContent='已读取，尚未替换当前设置。';applyButton.focus();
      }catch(error){if(current!==ticket)return;status.textContent=error.message||'无法读取此备份，当前设置保持不变。';}
    });
    $('cancel-backup').addEventListener('click',()=>{clear();status.textContent='已取消导入。';$('import-settings').focus();});
    applyButton.addEventListener('click',()=>{if(!pending)return;const next=pending;previous=M.normalize(JSON.parse(JSON.stringify(getState())));clear();apply(next);undo.hidden=false;status.textContent='已导入并保存。播报声音需再次点击启用；本页可恢复导入前设置。';undo.focus();});
    undo.addEventListener('click',()=>{if(!previous)return;const before=previous;previous=null;clear();apply(before);undo.hidden=true;status.textContent='已恢复导入前设置并保存。';$('import-settings').focus();});
  }
  window.RAIL_SETTINGS_BACKUP={parse,summary,bind,MAX_BYTES};
})();
