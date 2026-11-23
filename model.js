(() => {
  'use strict';
  const D=window.RAIL_DATA, TT=window.RAIL_TIMETABLE_MODEL, byId=new Map(D.vehicles.map(v=>[v.id,v]));
  const text=(s,max=48)=>typeof s==='string'?s.replace(/[\u0000-\u001f]/g,'').slice(0,max):'';
  const cars=n=>Number.isInteger(Number(n))&&Number(n)>=1&&Number(n)<=30?Number(n):null;
  function makeRow(id,platform,vehicleId,time){const v=byId.get(vehicleId);const row={id,platform,vehicleId,type:v.type,number:v.number,time,destination:v.destinations[0],destinationEn:D.destinations[v.destinations[0]]||'',seat:v.seat,style:'auto',markerMode:'auto',markerFeatures:[],showBrand:true,serviceVariant:'',seatAvailability:'',origin:'',stopsMode:'auto',stopsCustom:'',seatGuideMode:'auto',seatGuideCustom:'',reservationMode:'auto',referenceId:'',referenceDate:''};if(time===undefined)TT?.apply(row);return row;}
  function defaults(){return{version:2,announcements:{auto:false,volume:.8,rate:1,voiceURI:''},ticker:{enabled:true,paused:false,target:'nearest',clock:'wall',modelTime:'20:00',speed:55},formations:{},timetablePins:{},rows:[makeRow('outer-first',1,'e233-keihin'),makeRow('outer-next',1,'e5-hayabusa'),makeRow('inner-first',2,'e233-chuo'),makeRow('inner-next',2,'kintetsu-hinotori')],display:{english:true,matrix:false,mode:'lcd',showSeries:true,theme:'jreast'},message:'黄色い線の内側でお待ちください。'};}
  function normalize(raw){const result=defaults();if(!raw||![1,2].includes(raw.version)||!Array.isArray(raw.rows))return result;
    result.timetablePins=TT?.normalizePins(raw.timetablePins)||{};
    if(raw.version===2&&raw.formations&&typeof raw.formations==='object')for(const v of D.vehicles){const n=cars(raw.formations[v.id]);if(n!==null)result.formations[v.id]=n;}
    for(const row of result.rows){const old=raw.rows.find(r=>r&&r.id===row.id);if(!old)continue;const v=byId.get(old.vehicleId);if(!v)continue;Object.assign(row,makeRow(row.id,row.platform,v.id,row.time));if(D.types.includes(old.type))row.type=old.type;row.number=text(old.number,18);if(typeof old.time==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(old.time))row.time=old.time;row.destination=text(old.destination,24).trim()||row.destination;if(typeof old.destinationEn==='string')row.destinationEn=text(old.destinationEn,70);if(typeof old.seat==='string')row.seat=text(old.seat,32);if(D.styles.some(([id])=>id===old.style))row.style=old.style;if(['auto','custom','off'].includes(old.markerMode))row.markerMode=old.markerMode;row.markerFeatures=[...new Set((Array.isArray(old.markerFeatures)?old.markerFeatures:[]).filter(id=>D.serviceFeatureIds.includes(id)))];row.showBrand=old.showBrand!==false;if(v.special.variants.some(item=>item.id===old.serviceVariant))row.serviceVariant=old.serviceVariant;if(['','○','△','×'].includes(old.seatAvailability))row.seatAvailability=old.seatAvailability;row.origin=text(old.origin,30);row.stopsMode=old.stopsMode==='custom'?'custom':'auto';row.stopsCustom=text(typeof old.stopsCustom==='string'?old.stopsCustom.replace(/\r?\n/g,'、'):'',600);row.seatGuideMode=old.seatGuideMode==='custom'?'custom':'auto';row.seatGuideCustom=text(old.seatGuideCustom,260);row.reservationMode=old.reservationMode==='allReserved'?'allReserved':'auto';row.referenceId=TT?.trips(v.id).some(t=>t.id===old.referenceId)?old.referenceId:'';row.referenceDate=row.referenceId?TT.data.date:'';}
    if(raw.ticker&&typeof raw.ticker==='object'){const t=raw.ticker;result.ticker.enabled=t.enabled!==false;result.ticker.paused=t.paused===true;if(['nearest','platform1','platform2',...result.rows.map(r=>r.id)].includes(t.target))result.ticker.target=t.target;result.ticker.clock=t.clock==='model'?'model':'wall';if(typeof t.modelTime==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(t.modelTime))result.ticker.modelTime=t.modelTime;if(Number.isFinite(t.speed))result.ticker.speed=Math.max(25,Math.min(90,t.speed));}
    if(raw.display){result.display.english=raw.display.english!==false;if(raw.version===2){result.display.matrix=raw.display.matrix===true;result.display.mode=raw.display.mode==='led'?'led':'lcd';result.display.showSeries=raw.display.showSeries!==false;}}
    if(raw.display&&(['auto'].includes(raw.display.theme)||window.RAIL_THEMES?.byId.has(raw.display.theme)))result.display.theme=raw.display.theme;
    result.announcements=window.RAIL_ANNOUNCEMENT_MODEL?.normalize(raw.announcements)||result.announcements;
    if(typeof raw.message==='string')result.message=text(raw.message,100);return result;
  }
  function carsFor(state,id){return cars(state.formations[id])||byId.get(id).cars;}
  function applyVehicle(row,id,state){const v=byId.get(id);if(!v)return;Object.assign(row,{vehicleId:v.id,type:v.type,number:v.number,destination:v.destinations[0],destinationEn:D.destinations[v.destinations[0]]||'',seat:v.seat,style:'auto',markerMode:'auto',markerFeatures:[],showBrand:true,serviceVariant:'',seatAvailability:'',origin:'',stopsMode:'auto',stopsCustom:'',seatGuideMode:'auto',seatGuideCustom:'',reservationMode:'auto',referenceId:'',referenceDate:''});TT?.selectVehicle(row,state);}
  function scene(name){const s=defaults();const configs={
    kantoPrivate:[['tb-n100','20:08'],['sb001-laview','20:17'],['od70000-gse','20:11'],['ks-ae','20:24']],
    tokaiPrivate:[['mt1200','20:08'],['sz-a3000','20:17'],['iq2100-kinme','20:11'],['iz7000','20:24']],
    hokkaidoLocal:[['is-kiha40','20:08'],['sp5000','20:17'],['sp-a1200','20:11'],['hd9600','20:24']],
    shikoku:[['sq8000-shiokaze'],['sq2700-nanpu'],['sq5000-marineliner'],['sq2000-uwakai']],
    kyushu:[['ky-n700s-kamome','20:08'],['ky883-sonic','20:17'],['ky72-yufuin','20:11'],['nt3000','20:24']],
    specialJR:[['e261-saphir','20:08'],['e5-hayabusa','20:17'],['e259-nex','20:11'],['285-sunrise-izumo','20:24']],
    specialPrivate:[['kt50000-shimakaze','20:08'],['kt19200-aoniyoshi','20:17'],['kh8000','20:11'],['hk2300','20:24']],
    specialSeats:[['e6-komachi','20:08'],['e8-tsubasa','20:17'],['789-kamui','20:11'],['733-airport','20:24']],
    west:[['225-shinkaisoku','20:08'],['281-haruka','20:17'],['323-loop','20:11'],['273-yakumo','20:24']],
    kansai:[['hk9300','20:08'],['kh8000','20:17'],['nk50000-rapit','20:11'],['kintetsu-hinotori','20:24']],
    tokai:[['n700s-nozomi','20:08'],['n700a-hikari','20:17'],['383-shinano','20:11'],['313-tokaido','20:24']],
    hokkaido:[['h5-hayabusa','20:08'],['789-lilac','20:17'],['261-hokuto','20:11'],['733-airport','20:24']],
    east:[['e233-keihin','20:08'],['e235-yamanote','20:12'],['e233-chuo','20:11'],['e235-sobu','20:16']],
    express:[['e353-azusa','20:08'],['e259-nex','20:20'],['e657-hitachi','20:11'],['e261-saphir','20:24']],
    shinkansen:[['e5-hayabusa','20:08'],['e7-kagayaki','20:20'],['e6-komachi','20:11'],['e8-tsubasa','20:24']],
    mixed:[['e233-keihin','20:08'],['e5-hayabusa','20:17'],['kintetsu-8a','20:11'],['kintetsu-hinotori','20:21']],
    original:[['789-hakucho','20:08'],['e233-keihin','20:11'],['e5-hayabusa','20:17'],['e6-komachi','20:21']]
  };if(!configs[name])return null;s.rows=s.rows.map((r,i)=>makeRow(r.id,r.platform,configs[name][i][0]));return s;}
  window.RAIL_MODEL={defaults,normalize,makeRow,carsFor,applyVehicle,scene,text,cars,byId};
})();
