/* Vehicle and service presets. Quantities are editable model lengths, not a live timetable. */
(() => {
  'use strict';
  const sources = {
    network:'https://www.jreast.co.jp/map/pdf/map_tokyo.pdf',
    local:'https://www.jreast.co.jp/train/local/e233.html',
    e235:'https://www.jreast.co.jp/train/local/e235.html',
    e231:'https://www.jreast.co.jp/train/local/e231.html',
    e531:'https://www.jreast.co.jp/train/local/e531.html',
    e131:'https://www.jreast.co.jp/train/local/e131.html',
    chuo:'https://www.jreast.co.jp/press/2024/20240910_ho02.pdf',
    azusa:'https://www.jreast.co.jp/train/express/azusa_kaiji.html',
    hitachi:'https://www.jreast.co.jp/train/express/hitachi_tokiwa.html',
    nex:'https://www.jreast.co.jp/train/express/nex.html',
    odoriko:'https://www.jreast.co.jp/train/express/odoriko.html',
    akagi:'https://www.jreast.co.jp/train/express/akagi.html',
    saphir:'https://www.jreast.co.jp/saphir/',
    e5:'https://www.jreast.co.jp/train/shinkan/e5.html',
    e6:'https://www.jreast.co.jp/train/shinkan/e6.html',
    e7:'https://www.jreast.co.jp/train/shinkan/e7.html',
    e8:'https://www.jreast.co.jp/train/shinkan/e8.html',
    hinotori:'https://www.kintetsu.jp/kouhou/Train/hinotori.html',
    kintetsu8a:'https://www.kintetsu.jp/kouhou/Train/8a-1a-6a.html',
    hakucho:'https://www.jrhokkaido.co.jp/press/2016/161216-3.pdf',
    hokutosei:'https://hashimoto-tech.jp/diary/2015/11/14'
  };
  const lines = {
    model:{code:'M',name:'模型線',en:'Model Railway',color:'#4fa444'},
    jy:{code:'JY',name:'山手線',en:'Yamanote Line',color:'#80c241'},
    jk:{code:'JK',name:'京浜東北線',en:'Keihin-Tohoku Line',color:'#00a7e3'},
    jc:{code:'JC',name:'中央線快速',en:'Chuo Line (Rapid)',color:'#ef7b16'},
    jb:{code:'JB',name:'中央・総武線',en:'Chuo-Sobu Line (Local)',color:'#ffd400'},
    jo:{code:'JO',name:'横須賀・総武快速線',en:'Yokosuka / Sobu Rapid Line',color:'#007ac0'},
    jt:{code:'JT',name:'東海道線',en:'Tokaido Line',color:'#f68b1e'},
    ju:{code:'JU',name:'宇都宮・高崎線',en:'Utsunomiya / Takasaki Line',color:'#f68b1e'},
    js:{code:'JS',name:'湘南新宿ライン',en:'Shonan-Shinjuku Line',color:'#e21f26'},
    ja:{code:'JA',name:'埼京・川越線',en:'Saikyo / Kawagoe Line',color:'#00ac9a'},
    je:{code:'JE',name:'京葉線',en:'Keiyo Line',color:'#c9252c'},
    jm:{code:'JM',name:'武蔵野線',en:'Musashino Line',color:'#ef7b16'},
    jn:{code:'JN',name:'南武線',en:'Nambu Line',color:'#ffd400'},
    jh:{code:'JH',name:'横浜線',en:'Yokohama Line',color:'#7fc342'},
    jj:{code:'JJ',name:'常磐線',en:'Joban Line',color:'#00b261'},
    jl:{code:'JL',name:'常磐線各駅停車',en:'Joban Line (Local)',color:'#889b4b'},
    sagami:{code:'JR',name:'相模線',en:'Sagami Line',color:'#029dbe'},
    tohoku:{code:'新',name:'東北・北海道新幹線',en:'Tohoku / Hokkaido Shinkansen',color:'#259a67'},
    akita:{code:'新',name:'秋田新幹線',en:'Akita Shinkansen',color:'#d94783'},
    yamagata:{code:'新',name:'山形新幹線',en:'Yamagata Shinkansen',color:'#b47ac7'},
    hokuriku:{code:'新',name:'北陸新幹線',en:'Hokuriku Shinkansen',color:'#3599ca'},
    joetsu:{code:'新',name:'上越新幹線',en:'Joetsu Shinkansen',color:'#449868'},
    hokkaido:{code:'JR',name:'津軽海峡線',en:'Tsugaru-Kaikyo Line',color:'#71a540'},
    night:{code:'JR',name:'寝台特急',en:'Sleeper Limited Express',color:'#6388bb'},
    kintetsu:{code:'近',name:'近鉄線',en:'Kintetsu Railway',color:'#2864a6'}
  };
  const destinations = {
    '函館':'Hakodate','青森':'Aomori','新青森':'Shin-Aomori','大宮':'Omiya','大船':'Ofuna','南浦和':'Minami-Urawa','蒲田':'Kamata','赤羽':'Akabane','磯子':'Isogo','上野':'Ueno','東京':'Tokyo','品川':'Shinagawa','小金井':'Koganei','熱海':'Atami','新函館北斗':'Shin-Hakodate-Hokuto','仙台':'Sendai','秋田':'Akita','盛岡':'Morioka','札幌':'Sapporo','天理':'Tenri','平端':'Hirahata','大和西大寺':'Yamato-Saidaiji','大阪難波':'Osaka-Namba','近鉄名古屋':'Kintetsu-Nagoya','大阪上本町':'Osaka-Uehommachi',
    '新宿・渋谷方面':'Shinjuku & Shibuya','上野・池袋方面':'Ueno & Ikebukuro','池袋・新宿方面':'Ikebukuro & Shinjuku','東京・品川方面':'Tokyo & Shinagawa','逗子':'Zushi','久里浜':'Kurihama','千葉':'Chiba','成田空港':'Narita Airport','君津':'Kimitsu','高尾':'Takao','大月':'Otsuki','青梅':'Ome','豊田':'Toyoda','武蔵小金井':'Musashi-Koganei','中野':'Nakano','三鷹':'Mitaka','津田沼':'Tsudanuma','西船橋':'Nishi-Funabashi','大崎':'Osaki','新木場':'Shin-Kiba','川越':'Kawagoe','海老名':'Ebina','蘇我':'Soga','海浜幕張':'Kaihin-Makuhari','上総一ノ宮':'Kazusa-Ichinomiya','立川':'Tachikawa','川崎':'Kawasaki','稲城長沼':'Inagi-Naganuma','登戸':'Noborito','八王子':'Hachioji','東神奈川':'Higashi-Kanagawa','橋本':'Hashimoto','我孫子':'Abiko','取手':'Toride','綾瀬':'Ayase','北千住':'Kita-Senju','土浦':'Tsuchiura','水戸':'Mito','勝田':'Katsuta','高萩':'Takahagi','小田原':'Odawara','沼津':'Numazu','伊東':'Ito','宇都宮':'Utsunomiya','黒磯':'Kuroiso','高崎':'Takasaki','籠原':'Kagohara','前橋':'Maebashi','新宿':'Shinjuku','国府津':'Kozu','府中本町':'Fuchuhommachi','南船橋':'Minami-Funabashi','茅ケ崎':'Chigasaki','松本':'Matsumoto','甲府':'Kofu','竜王':'Ryuo','白馬':'Hakuba','河口湖':'Kawaguchiko','いわき':'Iwaki','伊豆急下田':'Izukyu-Shimoda','修善寺':'Shuzenji','長野原草津口':'Naganohara-Kusatsuguchi','那須塩原':'Nasushiobara','郡山':'Koriyama','敦賀':'Tsuruga','金沢':'Kanazawa','長野':'Nagano','新潟':'Niigata','越後湯沢':'Echigo-Yuzawa','新庄':'Shinjo','山形':'Yamagata'
  };
  const vehicles = [];
  function add(id,label,series,name,en,cars,line,kind,type,dests,extra={}) {
    vehicles.push(Object.assign({id,label,series,name,en,cars,line,kind,type,destinations:dests,operator:'jreast',owned:false,number:'',accent:lines[line].color,seat:kind==='commuter'?'4ドア':kind==='shinkansen'?'指定席・自由席':'全車指定席',source:kind==='commuter'?'local':'network'},extra));
  }
  add('789-hakucho','789 超级白鸟','789系','スーパー白鳥','SUPER HAKUCHO',6,'hokkaido','limited','特急',['函館','青森','新青森'],{owned:true,operator:'jrhokkaido',number:'1号',seat:'指定席・自由席',source:'hakucho',legacy:true});
  add('e233-keihin','E233 京滨东北线','E233系1000番台','京浜東北線','KEIHIN-TOHOKU LINE',10,'jk','commuter','各駅停車',['大船','大宮','南浦和','蒲田','赤羽','磯子'],{owned:true});
  add('e233-ueno-tokyo','E233 上野东京','E233系3000番台','上野東京ライン','UENO-TOKYO LINE',4,'ju','commuter','普通',['上野','東京','品川','熱海','宇都宮','高崎'],{owned:true,seat:'グリーン車あり'});
  add('e5-hayabusa','E5 Hayabusa','E5系','はやぶさ','HAYABUSA',6,'tohoku','shinkansen','新幹線',['新函館北斗','東京','新青森','仙台','盛岡'],{owned:true,number:'17号',accent:'#66d597',seat:'全車指定席',source:'e5'});
  add('e6-komachi','E6 Komachi','E6系','こまち','KOMACHI',3,'akita','shinkansen','新幹線',['秋田','東京','盛岡'],{owned:true,number:'21号',accent:'#ef8bb7',seat:'全車指定席',source:'e6'});
  add('hokutosei','寝台特急 北斗星','24系客車','北斗星','HOKUTOSEI',6,'night','limited','寝台特急',['札幌','上野'],{owned:true,operator:'legacy',accent:'#e0a8e6',seat:'寝台車',source:'hokutosei',legacy:true});
  add('kintetsu-8a','近铁 8A 天理线','近鉄8A系','天理線','TENRI LINE',4,'kintetsu','private','普通',['天理','平端','大和西大寺'],{owned:true,operator:'kintetsu',accent:'#dce9ff',seat:'4ドア',source:'kintetsu8a'});
  add('kintetsu-hinotori','近铁 80000 火鸟','近鉄80000系','ひのとり','HINOTORI',6,'kintetsu','private','特急',['近鉄名古屋','大阪難波','大阪上本町'],{owned:true,operator:'kintetsu',number:'17列車',accent:'#e9c76d',seat:'全席指定',logo:'assets/hinotori-official.jpg',source:'hinotori'});

  add('e235-yamanote','E235 山手线','E235系0番台','山手線','YAMANOTE LINE',11,'jy','commuter','各駅停車',['新宿・渋谷方面','上野・池袋方面','池袋・新宿方面','東京・品川方面'],{source:'e235'});
  add('e235-yokosuka','E235 横须贺线','E235系1000番台','横須賀線','YOKOSUKA LINE',11,'jo','commuter','普通',['久里浜','逗子','大船','東京','千葉'],{source:'e235',seat:'グリーン車あり'});
  add('e235-sobu','E235 总武快速线','E235系1000番台','総武線快速','SOBU LINE (RAPID)',11,'jo','commuter','快速',['千葉','成田空港','君津','東京','久里浜'],{source:'e235',seat:'グリーン車あり'});
  add('e233-chuo','E233 中央线快速','E233系0番台','中央線','CHUO LINE',12,'jc','commuter','快速',['高尾','大月','青梅','東京','豊田','武蔵小金井'],{source:'chuo',seat:'グリーン車あり'});
  add('e231-sobu','E231 中央总武各停','E231系500番台','中央・総武線','CHUO-SOBU LINE',10,'jb','commuter','各駅停車',['三鷹','中野','千葉','津田沼','西船橋'],{source:'e231'});
  add('e233-saikyo','E233 埼京川越线','E233系7000番台','埼京・川越線','SAIKYO / KAWAGOE LINE',10,'ja','commuter','各駅停車',['川越','大宮','新宿','大崎','新木場','海老名']);
  add('e233-keiyo','E233 京叶线','E233系5000番台','京葉線','KEIYO LINE',10,'je','commuter','各駅停車',['東京','蘇我','海浜幕張','上総一ノ宮']);
  add('e233-nambu','E233 南武线','E233系8000番台','南武線','NAMBU LINE',6,'jn','commuter','各駅停車',['立川','川崎','稲城長沼','登戸']);
  add('e233-yokohama','E233 横滨线','E233系6000番台','横浜線','YOKOHAMA LINE',8,'jh','commuter','各駅停車',['八王子','東神奈川','大船','橋本']);
  add('e233-joban-local','E233 常磐线各停','E233系2000番台','常磐線各駅停車','JOBAN LINE (LOCAL)',10,'jl','commuter','各駅停車',['我孫子','取手','綾瀬','北千住']);
  add('e531-joban','E531 常磐线','E531系','常磐線','JOBAN LINE',10,'jj','commuter','普通',['土浦','水戸','勝田','高萩','上野','品川'],{source:'e531',seat:'グリーン車あり'});
  add('e231-joban','E231 常磐快速线','E231系0番台','常磐線','JOBAN LINE (RAPID)',10,'jj','commuter','快速',['取手','我孫子','上野','品川'],{source:'e231'});
  add('e233-tokaido','E233 东海道线','E233系3000番台','東海道線','TOKAIDO LINE',10,'jt','commuter','普通',['熱海','小田原','沼津','伊東','東京'],{seat:'グリーン車あり'});
  add('e233-utsunomiya','E233 宇都宫线','E233系3000番台','宇都宮線','UTSUNOMIYA LINE',10,'ju','commuter','普通',['宇都宮','小金井','上野','東京','熱海'],{seat:'グリーン車あり'});
  add('e233-takasaki','E233 高崎线','E233系3000番台','高崎線','TAKASAKI LINE',10,'ju','commuter','普通',['高崎','籠原','前橋','上野','東京','熱海'],{seat:'グリーン車あり'});
  add('e233-shonan','E233 湘南新宿线','E233系3000番台','湘南新宿ライン','SHONAN-SHINJUKU LINE',10,'js','commuter','快速',['小田原','国府津','新宿','高崎','籠原'],{seat:'グリーン車あり'});
  add('e231-musashino','E231 武藏野线','E231系0番台','武蔵野線','MUSASHINO LINE',8,'jm','commuter','各駅停車',['府中本町','東京','南船橋'],{source:'e231'});
  add('e131-sagami','E131 相模线','E131系500番台','相模線','SAGAMI LINE',4,'sagami','commuter','各駅停車',['茅ケ崎','橋本'],{source:'e131',seat:'ワンマン'});

  add('e353-azusa','E353 梓 Azusa','E353系','あずさ','AZUSA',12,'jc','limited','特急',['松本','新宿','東京','白馬'],{number:'1号',accent:'#d9a6df',source:'azusa'});
  add('e353-kaiji','E353 甲斐路 Kaiji','E353系','かいじ','KAIJI',12,'jc','limited','特急',['甲府','竜王','新宿','東京'],{number:'7号',accent:'#d9a6df',source:'azusa'});
  add('e353-fuji','E353 富士回游','E353系','富士回遊','FUJI EXCURSION',3,'jc','limited','特急',['河口湖','新宿'],{number:'3号',accent:'#d9a6df',source:'azusa'});
  add('e657-hitachi','E657 日立 Hitachi','E657系','ひたち','HITACHI',10,'jj','limited','特急',['いわき','仙台','品川','上野'],{number:'9号',accent:'#f1a9bd',source:'hitachi'});
  add('e657-tokiwa','E657 常磐 Tokiwa','E657系','ときわ','TOKIWA',10,'jj','limited','特急',['勝田','土浦','高萩','品川','上野'],{number:'65号',accent:'#f1a9bd',source:'hitachi'});
  add('e259-nex','E259 成田特快 N’EX','E259系','成田エクスプレス','NARITA EXPRESS',6,'jo','limited','特急',['成田空港','東京','新宿','大船'],{number:'23号',accent:'#f3e4de',source:'nex'});
  add('e257-odoriko','E257 踊子','E257系2000番台','踊り子','ODORIKO',9,'jt','limited','特急',['伊豆急下田','修善寺','東京','新宿'],{number:'5号',accent:'#8dcbd5',source:'odoriko'});
  add('e257-shonan','E257 湘南','E257系2000番台','湘南','SHONAN',9,'jt','limited','特急',['小田原','平塚','東京','新宿'],{number:'1号',accent:'#8dcbd5',source:'odoriko'});
  destinations['平塚']='Hiratsuka';
  add('e261-saphir','E261 蓝宝石踊子','E261系','サフィール踊り子','SAPHIR ODORIKO',8,'jt','limited','特急',['伊豆急下田','東京','新宿'],{number:'1号',accent:'#d7c78e',seat:'全車グリーン席',source:'saphir'});
  add('e257-akagi','E257 赤城 Akagi','E257系5500番台','あかぎ','AKAGI',5,'ju','limited','特急',['高崎','前橋','上野','新宿'],{number:'1号',accent:'#bfda87',source:'akagi'});
  add('e257-kusatsu','E257 草津四万','E257系5500番台','草津・四万','KUSATSU-SHIMA',5,'ju','limited','特急',['長野原草津口','上野'],{number:'1号',accent:'#bfda87',source:'akagi'});

  add('e5-yamabiko','E5 山彦 Yamabiko','E5系','やまびこ','YAMABIKO',10,'tohoku','shinkansen','新幹線',['仙台','盛岡','東京'],{number:'207号',accent:'#a8dd78',source:'e5'});
  add('e5-nasuno','E5 那须野 Nasuno','E5系','なすの','NASUNO',10,'tohoku','shinkansen','新幹線',['那須塩原','郡山','東京'],{number:'263号',accent:'#a8dd78',source:'e5'});
  add('e7-kagayaki','E7 光辉 Kagayaki','E7系','かがやき','KAGAYAKI',12,'hokuriku','shinkansen','新幹線',['敦賀','金沢','東京'],{number:'501号',accent:'#bba5df',seat:'全車指定席',source:'e7'});
  add('e7-hakutaka','E7 白鹰 Hakutaka','E7系','はくたか','HAKUTAKA',12,'hokuriku','shinkansen','新幹線',['敦賀','金沢','東京'],{number:'555号',accent:'#dfb584',source:'e7'});
  add('e7-asama','E7 浅间 Asama','E7系','あさま','ASAMA',12,'hokuriku','shinkansen','新幹線',['長野','東京'],{number:'603号',accent:'#e3bf81',source:'e7'});
  add('e7-toki','E7 朱鹭 Toki','E7系','とき','TOKI',12,'joetsu','shinkansen','新幹線',['新潟','東京'],{number:'311号',accent:'#edb6c8',source:'e7'});
  add('e7-tanigawa','E7 谷川 Tanigawa','E7系','たにがわ','TANIGAWA',12,'joetsu','shinkansen','新幹線',['越後湯沢','東京'],{number:'403号',accent:'#edb6c8',source:'e7'});
  add('e8-tsubasa','E8 翼 Tsubasa','E8系','つばさ','TSUBASA',7,'yamagata','shinkansen','新幹線',['新庄','山形','東京'],{number:'121号',accent:'#edb45c',seat:'全車指定席',source:'e8'});
  window.RAIL_DATA={version:2,vehicles,lines,destinations,sources,types:['各駅停車','普通','快速','通勤快速','通勤特快','中央特快','青梅特快','特別快速','区間快速','急行','特急','新幹線','寝台特急'],typeEnglish:{'各駅停車':'Local','普通':'Local','快速':'Rapid','通勤快速':'Commuter Rapid','通勤特快':'Commuter Special Rapid','中央特快':'Chuo Special Rapid','青梅特快':'Ome Special Rapid','特別快速':'Special Rapid','区間快速':'Regional Rapid','急行':'Express','特急':'Limited Express','新幹線':'Shinkansen','寝台特急':'Sleeper Ltd. Exp.'}};
})();
