/* Frozen Sunday reference trips. Independent of the device clock. */
(() => {
  'use strict';
  const D=window.RAIL_DATA, data=window.RAIL_TIMETABLE;
  const fields=['time','origin','destination','number','type'];
  const validTime=s=>typeof s==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(s);
  const trips=id=>data.presets[id]?.departures||[];
  const direction=t=>t.direction||t.destination+'方面';
  const coverage=id=>data.presets[id]?.coverage||{level:'partial',scope:'已收录代表班次，尚未收齐全天'};
  const coverageLabels={model:'模型演示 · 未录真实时刻',full:'所列范围全天已收齐',partial:'尚有缺口',inactive:'周日无运行班次／历史参考'};
  function filterTrips(id,filters={}){
    const query=String(filters.q||'').normalize('NFKC').toLowerCase().trim().split(/\s+/).filter(Boolean);
    const period=/^\d{2}-\d{2}$/.test(filters.period||'')?filters.period.split('-').map(Number):null;
    return trips(id).filter(t=>!((filters.origin&&t.origin!==filters.origin)||(filters.direction&&direction(t)!==filters.direction)||(period&&(Number(t.time.slice(0,2))<period[0]||Number(t.time.slice(0,2))>=period[1])))).filter(t=>{const text=[t.time,t.origin,t.destination,t.number,t.trainNumber,t.type,t.displayName].filter(Boolean).join(' ').normalize('NFKC').toLowerCase();return query.every(q=>text.includes(q));}).slice().sort((a,b)=>a.time.localeCompare(b.time)||a.origin.localeCompare(b.origin)||a.destination.localeCompare(b.destination));
  }
  const find=row=>trips(row.vehicleId).find(t=>t.id===row.referenceId);
  const routeMatches=(row,t=find(row))=>Boolean(t&&['origin','destination','number','type'].every(k=>t[k]===undefined||row[k]===t[k])&&(row.serviceVariant||'')===(t.serviceVariant||''));
  const displayName=(row,v)=>{const t=find(row);return t&&row.origin===t.origin&&row.destination===t.destination&&t.displayName?t.displayName:v.name;};
  const displayEn=(row,v)=>{const t=find(row);return t&&row.origin===t.origin&&row.destination===t.destination&&t.displayEn?t.displayEn:v.en;};
  function apply(row,id){const t=trips(row.vehicleId).find(t=>t.id===id)||trips(row.vehicleId)[0];if(!t)return false;for(const k of fields)if(t[k]!==undefined)row[k]=t[k];const v=D.vehicles.find(v=>v.id===row.vehicleId);row.seat=t.seat||v.seat;row.serviceVariant=t.serviceVariant||'';row.destinationEn=D.destinations[row.destination]||'';row.referenceId=t.id;row.referenceDate=data.date;return true;}
  function modified(row){const t=find(row);return !t||fields.some(k=>t[k]!==undefined&&row[k]!==t[k]);}
  function remember(row,state){if(!validTime(row.time))return;state.timetablePins??={};const pin={referenceId:row.referenceId||'',referenceDate:row.referenceDate||data.date};for(const k of fields)pin[k]=row[k];state.timetablePins[row.vehicleId]=pin;}
  function selectVehicle(row,state){const pin=state?.timetablePins?.[row.vehicleId];if(pin&&validTime(pin.time)){apply(row,pin.referenceId);for(const k of [...fields,'referenceId','referenceDate'])if(pin[k]!==undefined)row[k]=pin[k];row.destinationEn=D.destinations[row.destination]||'';}else apply(row);}
  function normalizePins(raw){const out={};if(!raw||typeof raw!=='object'||Array.isArray(raw))return out;for(const v of D.vehicles){const p=raw[v.id];if(!p||!validTime(p.time))continue;out[v.id]={time:p.time,origin:String(p.origin||'').slice(0,30),destination:String(p.destination||v.destinations[0]).slice(0,24),number:String(p.number||'').slice(0,18),type:D.types.includes(p.type)?p.type:v.type,referenceId:trips(v.id).some(t=>t.id===p.referenceId)?p.referenceId:'',referenceDate:data.date};}return out;}
  const labels={dated:'已核对 10/25 运行日',holiday:'官方土休日参考',daily:'官方每日时刻参考',calendar:'官方时刻 · 运行日需确认',outdated:'官方旧表参考 · 现行未核实',weekday:'周日无班次 · 其他运行日参考',legacy:'已停运 · 怀旧参考',model:'模型自定 · 未取得可靠班次'};
  window.RAIL_TIMETABLE_MODEL={data,trips,find,routeMatches,displayName,displayEn,apply,modified,remember,selectVehicle,normalizePins,validTime,labels,fields,filterTrips,direction,coverage,coverageLabels};
})();
