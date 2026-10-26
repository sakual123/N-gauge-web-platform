(() => {
 'use strict';
 const D=window.RAIL_DATA,TT=window.RAIL_TIMETABLE_MODEL;
 const defaults=()=>({auto:false,volume:.8,rate:1,voiceURI:''});
 const normalize=raw=>{const a=defaults();if(!raw||typeof raw!=='object')return a;a.auto=raw.auto===true;for(const [k,min,max] of [['volume',0,1],['rate',.7,1.3]])if(Number.isFinite(raw[k]))a[k]=Math.min(max,Math.max(min,raw[k]));if(typeof raw.voiceURI==='string')a.voiceURI=raw.voiceURI.slice(0,240);return a;};
 function jst(date=new Date()){const d=new Date(date.getTime()+9*3600000),iso=d.toISOString();return{date:iso.slice(0,10),time:iso.slice(11,16),minute:iso.slice(0,16)};}
 const clean=s=>String(s||'').replace(/[<>\u0000-\u001f]/g,'').slice(0,240);
 function stationFor(v){const data=window.RAIL_ANNOUNCEMENT_DATA||{};return data.vehicleOverrides?.[v.id]||data.stations?.[v.route]||{station:'模型駅',reading:'もけいえき',operator:v.operator||'generic',note:'模型用通用案内'};}
 function profileFor(v){const data=window.RAIL_ANNOUNCEMENT_DATA||{},station=stationFor(v),family=station.operator||v.operator;const key=v.kind==='shinkansen'?({jreast:'jre-shinkansen',jrwest:'jrw-shin-osaka',jrtokai:'jrc-shinkansen'})[family]:family==='jrwest'&&station.station==='京都'?'jrw-kyoto':null;return data.profiles?.[key]||data.profiles?.[family]||data.profiles?.generic||{id:'generic',platformUnit:'番線',arrivalVerb:'まいります',warning:'危ないですから、黄色い点字ブロックの内側までお下がりください。'};}
 function spoken(text){return clean(text).replace(/N[’']?EX/gi,'成田エクスプレス').replace(/SPACIA\s?X/gi,'スペーシア エックス').replace(/S-TRAIN/g,'エストレイン').replace(/TJライナー/g,'ティージェイライナー').replace(/THライナー/g,'ティーエイチライナー').replace(/JR/g,'ジェイアール').replace(/・/g,'、');}
 function message(state,row){const v=D.vehicles.find(v=>v.id===row.vehicleId);if(!v)return null;const station=stationFor(v),profile=profileFor(v),name=TT?.displayName(row,v)||v.name,kind=clean(row.type),number=clean(row.number),dest=spoken(row.destination),bound=/方面$/.test(dest)?dest+'の電車':/環状/.test(dest)?'環状運転の電車':dest+'行き';
  const service=(kind==='新幹線'?'新幹線、':kind==='特急'?'特急、':kind==='寝台特急'?'寝台特急、':kind+'、')+spoken(name)+(number?'、'+spoken(number):'');
  const cars=window.RAIL_MODEL.carsFor(state,v.id),unit=profile.platformUnit||'番線',verb=profile.arrivalVerb||'まいります';
  const departure=profile.includeDepartureTime&&/^\d\d:\d\d$/.test(row.time)?`${Number(row.time.slice(0,2))}時${Number(row.time.slice(3))}分発、`:'';
  const prefix=profile.prefix||'まもなく、',formation=(profile.formationPattern||'{cars}両で').replace('{cars}',cars),warning=profile.warning||'黄色い点字ブロックの内側までお下がりください。';
  const subject=profile.order==='destination-service'?`${bound}の、${service}`:`${service}、${bound}`;
  const text=profile.order==='generic-approach-then-service'?`${prefix}${row.platform}${unit}に、電車が${verb}。${departure}${subject}、${cars}両編成です。${warning}`:`${prefix}${row.platform}${unit}に、${departure}${subject}が、${formation}${verb}。${warning}`;
  return{rowId:row.id,platform:row.platform,vehicleId:v.id,time:row.time,station:station.station,operator:station.operator,source:profile.source||station.source||'',text,label:`${row.platform}站台 ${row.time} ${name}${number} → ${row.destination}`,referenceNote:`参考站：${station.station} · 设备日语合成，模型番线`};
 }
 function due(state,date,seen=new Set()){const stamp=jst(date);return state.rows.map((row,index)=>({row,index})).filter(({row})=>row.time===stamp.time&&!seen.has(stamp.date+'|'+stamp.time+'|'+row.id)).sort((a,b)=>a.row.platform-b.row.platform||a.index-b.index).map(({row})=>({...message(state,row),key:stamp.date+'|'+stamp.time+'|'+row.id}));}
 window.RAIL_ANNOUNCEMENT_MODEL={defaults,normalize,jst,stationFor,profileFor,spoken,message,due};
})();
