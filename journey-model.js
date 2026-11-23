(() => {
  'use strict';const D=window.RAIL_DATA,M=window.RAIL_MODEL;
  const localTypes=['普通','各駅停車'];
  const minutes=s=>{const m=/^([01]\d|2[0-3]):([0-5]\d)$/.exec(s);return m?Number(m[1])*60+Number(m[2]):null;};
  function nearest(state,now=new Date()){
    const mode=state.ticker.target,explicit=state.rows.find(r=>r.id===mode);if(explicit)return explicit;
    const rows=state.rows.filter(r=>mode==='platform1'?r.platform===1:mode==='platform2'?r.platform===2:true);
    const ref=state.ticker.clock==='model'?minutes(state.ticker.modelTime):((now.getUTCHours()+9)%24)*60+now.getUTCMinutes();
    return rows.map((row,index)=>({row,index,wait:(minutes(row.time)-(ref??0)+1440)%1440})).sort((a,b)=>a.wait-b.wait||a.index-b.index)[0]?.row||null;
  }
  function profile(row,v){
    if(row.serviceVariant==='rakuraku'&&['kh8000','kh3000'].includes(v.id))return{paths:[['淀屋橋','北浜','天満橋','京橋','七条','祇園四条','三条','出町柳']],mode:'full',source:D.sources.keihan};
    if(row.serviceVariant==='alpha'&&v.id==='nk50000-rapit')return{paths:[['なんば','新今宮','天下茶屋','泉佐野','りんくうタウン','関西空港']],mode:'full',source:D.sources.nankai};
    return v.journey||null;
  }
  function originOptions(row,v){return [...new Set([...(profile(row,v)?.paths.flat()||[]),...(window.RAIL_TIMETABLE_MODEL?.trips(v.id)||[]).flatMap(t=>[t.origin,t.destination]),row.origin].filter(Boolean))];}
  function stops(row,v){
    if(row.stopsMode==='custom'){
      const calls=(row.stopsCustom||'').split(/[\n、,，|・]+/).map(s=>s.trim()).filter(Boolean);
      return{label:'停車駅',text:calls.length?calls.join('・'):'停車駅を入力してください',origin:row.origin||'',calls,custom:true};
    }
    const TT=window.RAIL_TIMETABLE_MODEL,trip=TT?.find(row);
    if(TT?.routeMatches(row,trip)&&trip.stops?.length)return{label:trip.stopsScope==='major'?'主な停車駅':'停車駅',text:trip.stops.join('・'),origin:row.origin,calls:[...trip.stops],source:trip.source,exact:trip.stopsScope!=='major'};
    if(v.route==='sp-tram')return{label:'停車駅',text:'環状運転・各停留場に停車します。',origin:'',calls:[]};
    const p=profile(row,v),dest=row.destination;
    if(!p){return{label:localTypes.includes(row.type)?'停車駅':'停車案内',text:localTypes.includes(row.type)?`${dest}まで各駅に停車します。`:'停車駅は右上の列車設定から入力できます。',origin:row.origin||'',calls:[]};}
    const paths=p.paths.filter(path=>path.includes(dest));
    let selected=row.origin?paths.find(path=>path.includes(row.origin)&&row.origin!==dest):paths[0];
    if(!selected){if(localTypes.includes(row.type))return{label:'停車駅',text:`${dest}まで各駅に停車します。`,origin:row.origin||'',calls:[]};return{label:'停車案内',text:'この行先・出発駅の停車駅を個別設定してください。',origin:row.origin||'',calls:[],needsCustom:true};}
    const from=row.origin||(selected[0]===dest?selected[selected.length-1]:selected[0]);
    const a=selected.indexOf(from),b=selected.indexOf(dest);
    const calls=a<b?selected.slice(a+1,b+1):selected.slice(b,a).reverse();
    if(localTypes.includes(row.type)&&p.mode!=='full')return{label:'停車駅',text:`${dest}まで各駅に停車します。`,origin:from,calls:[]};
    return{label:p.mode==='full'?'停車駅':'主な停車駅',text:calls.join('・'),origin:from,calls,source:p.source};
  }
  function seatGuide(state,row,v){
    if(row.seatGuideMode==='custom')return{items:[],text:row.seatGuideCustom||'座席案内を入力してください',custom:true};
    const TT=window.RAIL_TIMETABLE_MODEL,trip=TT?.find(row);
    if(TT?.routeMatches(row,trip)&&trip.seatGuide)return{items:[],text:M.carsFor(state,v.id)===v.cars?trip.seatGuide:trip.seatGuide.replace(/2号車/g,'専用車両'),detailed:false,source:trip.source};
    const features=D.featureIds({...row,markerMode:'auto'},v),green=features.includes('green'),gc=features.includes('granclass');
    const allReserved=row.reservationMode==='allReserved',p=v.seating;
    if(p&&M.carsFor(state,v.id)===p.cars&&!allReserved){
      const items=p.items.map(([label,cars])=>({label,cars,feature:label==='グリーン車'?'green':label==='グランクラス'?'granclass':''}));
      return{items,text:items.map(item=>item.label+'は'+item.cars+'号車').join('。')+'。'+(p.note.startsWith('全車指定席')?'全車指定席・自由席はありません。':''),detailed:true};
    }
    if(p&&allReserved&&/n700[sa]-nozomi/.test(v.id)&&M.carsFor(state,v.id)===16){
      const items=[{label:'指定席',cars:'1～7・11～16'},{label:'グリーン車',cars:'8～10',feature:'green'}];return{items,text:'全車指定席・自由席はありません。指定席は1～7・11～16号車、グリーン車は8～10号車です。',detailed:true};
    }
    let text='';const seat=row.seat||v.seat;
    if(/全車グリーン/.test(v.seat))text='全車グリーン席・自由席はありません。'+(features.includes('premiumgreen')?'プレミアムグリーン・グリーン個室があります。':'');
    else if(features.includes('sleeper'))text='寝台・個室と指定席のご案内は車両設定をご確認ください。';
    else if(allReserved)text='全車指定席・自由席はありません。';
    else if(features.includes('premiumcar'))text='一般車は予約不要。PREMIUM CARは座席指定です。';
    else if(features.includes('privace'))text='一般車は予約不要。PRiVACEは座席指定です。';
    else if(v.operator==='meitetsu'&&features.includes('specialcar'))text=v.id==='meitetsu2000'?'全車特別車・ミューチケットが必要です。':'一般車と特別車を連結しています。特別車は座席指定です。';
    else if(features.includes('reserved')&&v.id==='nk12000-southern')text='一般車と座席指定車を連結しています。';
    else if(features.includes('useat')&&v.kind==='commuter')text='普通車は予約不要。u-seatは座席指定です。';
    else if(/乗車券のみ|一般車・予約不要/.test(v.seat))text='全車一般車・座席指定はありません。';
    else if(allReserved||/全車指定席|全席指定|座席指定サービス/.test(seat))text='全車指定席・自由席はありません。';
    else if(/指定席・自由席/.test(seat))text='普通車に自由席と指定席があります。';
    else if(v.kind==='commuter'||v.category==='private')text='全車一般車・座席指定はありません。';
    else text='座席区分は列車・運転日により異なります。';
    if(green&&!/全車グリーン/.test(v.seat))text+=v.kind==='commuter'&&v.id!=='sq5000-marineliner'?'普通列車グリーン車は自由席です。':'グリーン車は指定席です。';
    if(gc)text+='グランクラスがあります。';
    if(features.includes('useat')&&v.kind!=='commuter')text+='u-seatを連結しています。';
    return{items:[],text,detailed:false};
  }
  function message(state,row){const v=M.byId.get(row.vehicleId),variant=D.variantFor(row,v),calls=stops(row,v),seat=seatGuide(state,row,v);const title=`${row.platform}番線 ${row.time} ${variant?.name||window.RAIL_TIMETABLE_MODEL?.displayName(row,v)||v.name}${row.number?' '+row.number:''} ${row.destination}行き`;return{row,v,title,calls,seat,text:title+'。'+calls.label+'は、'+calls.text+'。'+seat.text};}
  D.journeyModel={minutes,nearest,profile,originOptions,stops,seatGuide,message};
})();
