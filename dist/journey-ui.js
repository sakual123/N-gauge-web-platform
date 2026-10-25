(() => {
  'use strict';const D=window.RAIL_DATA,J=D.journeyModel,M=window.RAIL_MODEL,U=window.RAIL_SERVICE_UI;
  const E=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
  const option=(value,label)=>{const el=E('option','',label);el.value=value;return el;};
  function field(label,input){const el=E('div','form-group'),caption=E('label','form-label',label);caption.htmlFor=input.id;el.append(caption,input);return el;}
  function select(id,value,choices){const el=E('select','control');el.id=id;for(const [key,label] of choices)el.append(option(key,label));el.value=value;return el;}
  function editor(row,v,onChange){
    const el=E('details','service-settings journey-settings');el.append(E('summary','','滚动停站与座席'));
    const origin=select('origin-'+row.id,row.origin||'',[['','自动选择参考出发站'],...J.originOptions(row,v).map(s=>[s,s])]);
    const stopsMode=select('stops-mode-'+row.id,row.stopsMode||'auto',[['auto','自动：代表停站 / 各站停车'],['custom','自定义：本班完整停站']]);
    const calls=E('textarea','control');calls.id='stops-custom-'+row.id;calls.rows=3;calls.maxLength=600;calls.value=row.stopsCustom||'';calls.placeholder='品川、横浜、熱海、伊東、伊豆高原、伊豆急下田';
    const callsField=field('停站顺序（顿号、逗号或换行分隔）',calls);callsField.hidden=stopsMode.value!=='custom';
    const status=E('p','journey-preview service-help');status.id='journey-preview-'+row.id;
    function preview(){const info=J.stops(row,v);status.textContent=(info.origin?'参考出发站：'+info.origin+'。':'')+info.label+'：'+info.text;}
    origin.addEventListener('change',()=>{row.origin=origin.value;preview();onChange();});
    stopsMode.addEventListener('change',()=>{if(stopsMode.value==='custom'&&!row.stopsCustom){row.stopsCustom=J.stops({...row,stopsMode:'auto'},v).calls.join('、');calls.value=row.stopsCustom;}row.stopsMode=stopsMode.value;callsField.hidden=stopsMode.value!=='custom';preview();onChange();});
    calls.addEventListener('input',()=>{row.stopsCustom=M.text(calls.value.replace(/\r?\n/g,'、'),600);preview();onChange();});
    const reservation=select('reservation-mode-'+row.id,row.reservationMode||'auto',[['auto','跟随车型 / 通常期'],['allReserved','本班全车指定席（如繁忙期希望号）']]);
    reservation.addEventListener('change',()=>{row.reservationMode=reservation.value;onChange();});
    const seatMode=select('seat-guide-mode-'+row.id,row.seatGuideMode||'auto',[['auto','自动座席说明'],['custom','自定义本班座席说明']]);
    const seat=E('textarea','control');seat.id='seat-guide-custom-'+row.id;seat.rows=3;seat.maxLength=260;seat.value=row.seatGuideCustom||'';seat.placeholder='自由席は1・2号車、指定席は3～7・11～16号車、グリーン車は8～10号車です。';
    const seatField=field('本班座席说明',seat);seatField.hidden=seatMode.value!=='custom';seatMode.addEventListener('change',()=>{row.seatGuideMode=seatMode.value;seatField.hidden=seatMode.value!=='custom';onChange();});seat.addEventListener('input',()=>{row.seatGuideCustom=M.text(seat.value.replace(/\r?\n/g,' '),260);onChange();});
    el.append(field('参考出发站（用于截取 / 反向停站）',origin),field('停站模式',stopsMode),callsField,status,field('指定席设置',reservation),field('座席说明模式',seatMode),seatField,E('p','service-help','有完整停站资料且班次信息一致时跟随所选参考；其余采用线路代表样例。手填号数不会查询新班次。座席号车按资料中的实车编组显示，模型节数不符时改为座席类别说明。'));
    preview();return el;
  }
  let lastKey='',currentState=null;
  function chunk(label,text,cls=''){const el=E('span','ticker-chunk '+cls);if(label)el.append(E('strong','ticker-key',label+' '));el.append(document.createTextNode(text));return el;}
  function fit(){const strip=document.getElementById('ticker-track'),group=strip?.firstElementChild;if(!group||!currentState)return;const viewport=strip.parentElement.clientWidth;for(const item of strip.children)item.style.minWidth=viewport+'px';const width=group.getBoundingClientRect().width;strip.style.setProperty('--ticker-distance',width+'px');strip.style.setProperty('--ticker-duration',Math.max(8,width/currentState.ticker.speed)+'s');}
  function render(state,now){
    currentState=state;const shell=document.getElementById('train-ticker'),track=document.getElementById('ticker-track');
    shell.hidden=!state.ticker.enabled;document.getElementById('board').classList.toggle('ticker-active',state.ticker.enabled);shell.classList.toggle('paused',state.ticker.paused);if(!state.ticker.enabled)return;
    const row=J.nearest(state,now);if(!row)return;const info=J.message(state,row),key=JSON.stringify([info.text,state.ticker.speed]);shell.dataset.rowId=row.id;shell.setAttribute('aria-label',info.text);document.getElementById('ticker-platform').textContent=row.platform+'番線';
    if(key===lastKey)return;lastKey=key;track.style.animation='none';track.textContent='';
    const group=E('div','ticker-group');group.append(chunk('',info.title,'ticker-train'),chunk(info.calls.label,info.calls.text,'ticker-stops'));
    if(info.seat.detailed){if(row.reservationMode==='allReserved'||/^全車指定席/.test(vSeat(info.v)))group.append(chunk('','全車指定席・自由席なし','ticker-seat'));for(const item of info.seat.items){const el=chunk('',item.label+' '+item.cars+'号車','ticker-seat');if(item.feature)el.prepend(U.feature(item.feature));group.append(el);}}
    else group.append(chunk('座席',info.seat.text,'ticker-seat'));
    const copy=group.cloneNode(true);copy.setAttribute('aria-hidden','true');track.append(group,copy);requestAnimationFrame(()=>{fit();track.style.animation='';});
  }
  function vSeat(v){return v.seating?.note||v.seat;}
  function bindSettings(getState,onChange){
    const state=getState();for(const [id,key] of [['ticker-enabled','enabled'],['ticker-paused','paused']]){const input=document.getElementById(id);input.checked=state.ticker[key];input.addEventListener('change',()=>{getState().ticker[key]=input.checked;onChange();});}
    for(const [id,key] of [['ticker-target','target'],['ticker-clock','clock'],['ticker-model-time','modelTime'],['ticker-speed','speed']]){const input=document.getElementById(id);input.value=state.ticker[key];input.addEventListener('change',()=>{if(key==='modelTime'&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.value)){input.value=getState().ticker.modelTime;return;}getState().ticker[key]=key==='speed'?Number(input.value):input.value;onChange();});}
  }
  function sync(state){for(const [id,key] of [['ticker-enabled','enabled'],['ticker-paused','paused']])document.getElementById(id).checked=state.ticker[key];for(const [id,key] of [['ticker-target','target'],['ticker-clock','clock'],['ticker-model-time','modelTime'],['ticker-speed','speed']])document.getElementById(id).value=state.ticker[key];document.getElementById('ticker-model-time-field').hidden=state.ticker.clock!=='model';for(const row of state.rows){const node=document.getElementById('journey-preview-'+row.id);if(node){const info=J.stops(row,M.byId.get(row.vehicleId));node.textContent=(info.origin?'参考出发站：'+info.origin+'。':'')+info.label+'：'+info.text;}}}
  window.RAIL_JOURNEY_UI={editor,render,fit,bindSettings,sync};
})();
