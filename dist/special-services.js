/* Equipment and service markings, separate from the model's editable car count. */
(() => {
  'use strict';
  const D=window.RAIL_DATA,base='assets/special/';
  D.serviceFeatures={
    green:{label:'Green Car',short:'',src:base+'green-car.png',title:'グリーン車'},
    granclass:{label:'GranClass',short:'GC',src:base+'granclass.png',title:'グランクラス'},
    premiumgreen:{label:'Premium Green',short:'P.GREEN',shape:'diamond',title:'プレミアムグリーン'},
    compartment:{label:'個室',short:'個室',shape:'compartment',title:'個室車両'},
    sleeper:{label:'寝台',short:'寝台',shape:'bed',title:'寝台車'},
    cafe:{label:'カフェ / ラウンジ',short:'',shape:'cup',title:'カフェ・ラウンジ設備'},
    airport:{label:'空港アクセス',short:'',shape:'plane',title:'空港アクセス列車'},
    useat:{label:'u-seat',short:'u-seat',src:base+'u-seat.png',title:'普通車指定席 uシート（Green Carとは別）'},
    aseat:{label:'A-SEAT',short:'A-SEAT',title:'新快速 有料座席サービス Aシート'},
    premiumcar:{label:'PREMIUM CAR',short:'',src:base+'premiumcar.png',title:'京阪 座席指定特別車両 PREMIUM CAR',wide:true},
    privace:{label:'PRiVACE',short:'',src:base+'privace.svg',title:'阪急 座席指定サービス PRiVACE',wide:true},
    deluxe:{label:'Deluxe',short:'DX',title:'デラックスカー'},
    premiumseat:{label:'Premium Seat',short:'PREMIUM',title:'プレミアムシート'},
    superseat:{label:'Super Seat',short:'SUPER',title:'スーパーシート'},
    specialcar:{label:'特別車',short:'特別車',title:'特別車・ミューチケット対象'},
    reserved:{label:'指定席車',short:'指定席車',title:'座席指定車と一般車の混結'},
    doubledeck:{label:'2階建',short:'2階建',shape:'doubledeck',title:'2階建車両'},
    panorama:{label:'展望車',short:'展望',shape:'window',title:'展望席・展望車両'}
  };
  D.serviceBrands={
    hinotori:{label:'ひのとり',src:'assets/hinotori-official.jpg',source:D.sources.hinotori,format:'official',theme:'red'},
    shimakaze:{label:'しまかぜ',src:base+'shimakaze.png',source:'https://www.kintetsu.co.jp/senden/shimakaze/',format:'official',theme:'blue',tall:true},
    aoniyoshi:{label:'あをによし',src:base+'aoniyoshi.png',source:'https://www.kintetsu.co.jp/senden/aoniyoshi/',format:'official',theme:'purple',crop:[162,173,160,227],imageSize:[374,400]},
    symphony:{label:'青の交響曲',src:base+'blue-symphony.png',source:'https://www.kintetsu.co.jp/senden/blue_symphony/',format:'official',theme:'navy'},
    nex:{label:'N’EX',text:'N’EX',source:D.sources.nex,format:'typeset',theme:'nex'},
    sunrise:{label:'SUNRISE',text:'SUNRISE',source:D.sources.westServices,format:'typeset',theme:'sunrise'},
    ise:{label:'ISE-SHIMA LINER',text:'ISE-SHIMA LINER',source:'https://www.kintetsu.co.jp/gyoumu/Express/train/ise-liner.html',format:'typeset',theme:'yellow'},
    vista:{label:'VISTA EX',text:'VISTA EX',source:'https://www.kintetsu.jp/kouhou/Train/B01.html',format:'typeset',theme:'orange'},
    ace:{label:'Ace',text:'Ace',source:'https://www.kintetsu.jp/kouhou/Train/B54.html',format:'typeset',theme:'orange'},
    urbanplus:{label:'URBAN LINER plus',text:'URBAN LINER plus',source:'https://www.kintetsu.jp/kouhou/Train/B06.html',format:'typeset',theme:'silver'},
    urbannext:{label:'URBAN LINER next',text:'URBAN LINER next',source:'https://www.kintetsu.jp/kouhou/Train/B05.html',format:'typeset',theme:'silver'},
    sakura:{label:'SAKURA LINER',text:'SAKURA LINER',source:'https://www.kintetsu.co.jp/gyoumu/Express/train/sakura-liner.html',format:'typeset',theme:'pink'},
    garaku:{label:'京とれいん 雅洛',text:'京とれいん 雅洛',source:D.sources.hankyu,format:'typeset',theme:'purple'},
    rapit:{label:'Rapi:t',text:'Rapi:t',source:'https://www.nankai.co.jp/traffic/express/rapit.html',format:'typeset',theme:'blue'},
    southern:{label:'SOUTHERN',text:'SOUTHERN',source:D.sources.nankai,format:'typeset',theme:'blue'},
    koya:{label:'KOYA',text:'KOYA',source:D.sources.nankai,format:'typeset',theme:'red'},
    musky:{label:'μSKY',text:'μSKY',source:D.sources.meitetsu,format:'typeset',theme:'blue'}
  };
  Object.assign(D.serviceBrands,D.additionalBrands||{});
  for(const v of D.vehicles)v.special={features:(v.serviceFeatures||[]).slice(),optional:[],brand:v.serviceBrand||'',emphasis:'',note:v.serviceNote||'通常の種別・列車名表示',sources:[D.sources[v.source]],variants:[]};
  const byId=new Map(D.vehicles.map(v=>[v.id,v]));
  function add(ids,features,options={}){for(const id of ids.split(' ')){const v=byId.get(id);if(!v)throw Error('Unknown special service '+id);Object.assign(v.special,options);v.special.features=[...new Set([...v.special.features,...features])];}}
  const greenCommuters='e233-ueno-tokyo e235-yokosuka e235-sobu e233-chuo e531-joban e233-tokaido e233-utsunomiya e233-takasaki e233-shonan';
  add(greenCommuters,['green'],{note:'グリーン車連結の通勤・近郊列車',sources:['https://www.jreast.co.jp/multi/green/index.html',D.sources.chuo]});
  add('e353-azusa e353-kaiji e657-hitachi e657-tokiwa e259-nex e257-odoriko e257-shonan',['green']);
  add('789-hakucho 789-lilac 261-hokuto 261-ozora 261-tokachi',['green']);
  add('683-thunderbird 281-haruka 287-kuroshio 289-kounotori 287-kinosaki 273-yakumo hc85-hida 383-shinano',['green']);
  add('e261-saphir',['green','premiumgreen','compartment','cafe'],{emphasis:'green',note:'全車グリーン席。Premium Green・グリーン個室・カフェテリア',sources:['https://www.jreast.co.jp/saphir/cars/','https://ats-s.sakura.ne.jp/blog/?p=79494']});
  add('e5-hayabusa e5-yamabiko e5-nasuno e7-kagayaki e7-hakutaka e7-asama e7-toki e7-tanigawa w7-kagayaki w7-tsurugi h5-hayabusa h5-hayate',['green','granclass'],{note:'Green Car と GranClass を別々の標識で表示',sources:[D.sources.e5,D.sources.e7,D.sources.h5,'https://www.jr-odekake.net/railroad/shinkansen/seat/green/']});
  add('e6-komachi e8-tsubasa n700-sakura n700-mizuho n700s-nozomi n700s-hikari n700s-kodama n700a-nozomi n700a-hikari n700a-kodama',['green'],{note:'グリーン車あり。GranClass は設定しない',sources:[D.sources.e6,D.sources.e8,D.sources.n700,D.sources.west]});
  add('e353-fuji e257-akagi e257-kusatsu hc85-nanki 500-kodama 700-railstar',[],{note:'このプリセットに Green Car / GranClass を自動付与しない',sources:['https://www.jreast.co.jp/hachioji/aas/2019021_01.pdf',D.sources.akagi,D.sources.tokaiLimited,D.sources.kodama,D.sources.railstar]});
  add('e257-odoriko',[],{note:'基本の伊豆急下田編成はグリーン車あり。修善寺側表示では自動マークを外す'});
  add('789-kamui 733-airport',['useat'],{note:'u-seat は普通車指定席。Green Car とは区別',sources:['https://www.jrhokkaido.co.jp/train/tr013_01.html',D.sources.airport]});
  add('225-shinkaisoku',[],{optional:['aseat'],note:'A-SEAT は対応列車のみ。必要に応じて個別に有効化',sources:[D.sources.westServices]});
  add('hokutosei 285-sunrise-izumo 285-sunrise-seto',['sleeper','compartment'],{note:'寝台・個室の標識。Green Car として扱わない'});
  add('285-sunrise-izumo 285-sunrise-seto',[],{brand:'sunrise'});
  add('e259-nex',['airport'],{brand:'nex'});
  add('281-haruka 223-kanku 733-airport',['airport']);
  add('kintetsu-hinotori',['premiumseat'],{brand:'hinotori',note:'全席指定・プレミアム車両あり。近鉄公式ひのとり図案'});
  add('kt50000-shimakaze',['premiumseat','compartment','cafe','panorama'],{brand:'shimakaze',note:'観光特急・プレミアムシート・個室・カフェ',sources:['https://www.kintetsu.co.jp/senden/shimakaze/']});
  add('kt19200-aoniyoshi',['cafe'],{brand:'aoniyoshi',note:'ツイン / サロンシートの観光特急。JR Green Car は付けない',sources:['https://www.kintetsu.co.jp/senden/aoniyoshi/']});
  add('kt16200-symphony',['deluxe','cafe'],{brand:'symphony',note:'デラックスシート・ラウンジの観光特急',sources:['https://www.kintetsu.co.jp/senden/blue_symphony/']});
  add('kt23000-iseshima',['deluxe'],{brand:'ise'});
  add('kt30000-vista',['doubledeck'],{brand:'vista'});
  add('kt22600-ace',[],{brand:'ace'});
  add('kt21000-urban',['deluxe'],{brand:'urbanplus'});
  add('kt21020-urban',['deluxe'],{brand:'urbannext'});
  add('kt26000-sakura',['deluxe'],{brand:'sakura'});
  const keihanVariants=[{id:'',label:'通常の表示'},{id:'rakuraku',label:'快速特急 洛楽',name:'洛楽',en:'RAKU-RAKU',type:'快速特急'}];
  add('kh8000',['premiumcar','doubledeck'],{variants:keihanVariants,note:'Premium Car。8000系は2階建車あり',sources:['https://www.keihan.co.jp/traffic/premiumcar/train/']});
  add('kh3000',['premiumcar'],{variants:keihanVariants,note:'Premium Car。2025年10月から基本は5・6号車の2両',sources:['https://www.keihan.co.jp/traffic/premiumcar/pdf/20250818a.pdf']});
  add('hk2300',['privace'],{note:'PRiVACE 座席指定サービス',sources:['https://www.hankyu.co.jp/privace/index.html']});
  add('hk9300',[],{optional:['privace'],note:'9300系の PRiVACE は編成により異なるため手動指定',sources:['https://www.hankyu-hanshin.co.jp/release/docs/e4bd6252d590cbbb8a594f6263eeb1f682e0fa9b.pdf']});
  add('hk7000-garaku',[],{brand:'garaku',note:'京とれいん 雅洛。自由席の観光列車'});
  add('nk50000-rapit',['airport','superseat'],{brand:'rapit',variants:[{id:'',label:'ラピート（共通表示）'},{id:'alpha',label:'ラピートα',name:'ラピートα',en:'RAPI:T α'},{id:'beta',label:'ラピートβ',name:'ラピートβ',en:'RAPI:T β'}],note:'α / β は手動選択。全席指定・スーパーシートあり',sources:['https://www.nankai.co.jp/traffic/express/rapit.html']});
  add('nk12000-southern',['reserved'],{brand:'southern',note:'指定席車と一般車の混結。全車指定席と誤表示しない'});
  add('nk30000-koya',[],{brand:'koya',note:'全席指定の高野線特急'});
  add('meitetsu2000',['specialcar','airport'],{brand:'musky',note:'全車特別車 μSKY。JR Green Car ではない'});
  add('meitetsu2200',['specialcar'],{note:'一部特別車。JR Green Car ではない'});
  function variantFor(row,v){return v.special.variants.find(item=>item.id===row.serviceVariant)||v.special.variants[0]||null;}
  function featureIds(row,v){
    if(row.markerMode==='off')return[];
    if(row.markerMode==='custom')return [...new Set((Array.isArray(row.markerFeatures)?row.markerFeatures:[]).filter(id=>D.serviceFeatureIds.includes(id)))];
    const TT=window.RAIL_TIMETABLE_MODEL,trip=TT?.find(row);
    let ids=TT?.routeMatches(row,trip)&&trip.autoFeatures?trip.autoFeatures.slice():v.special.features.slice();
    if(v.id==='e257-odoriko'&&row.destination==='修善寺')ids=ids.filter(id=>id!=='green');
    if(['kh8000','kh3000'].includes(v.id)&&!['特急','快速特急','快速急行','通勤快急','ライナー'].includes(row.type))ids=ids.filter(id=>id!=='premiumcar');
    if(v.id==='hk2300'&&!['特急','準特急','通勤特急'].includes(row.type))ids=ids.filter(id=>id!=='privace');
    return ids;
  }
  function brandFor(row,v){return row.markerMode==='off'||row.showBrand===false?'':v.special.brand;}
  D.serviceFeatureIds=Object.keys(D.serviceFeatures);D.variantFor=variantFor;D.featureIds=featureIds;D.brandFor=brandFor;
  const types={'通勤特急':'Commuter Ltd. Exp.','通勤快急':'Commuter Rapid Exp.','区間急行':'Regional Express','区間準急':'Regional Semi Exp.','ライナー':'Liner'};
  Object.assign(D.typeEnglish,types);for(const type of Object.keys(types))if(!D.types.includes(type))D.types.push(type);
})();
