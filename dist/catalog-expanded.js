/* V5: Kanto / Tokai local operators, Hokkaido municipal and third-sector rail,
   and JR / private / municipal rail in Kyushu. Initial lengths remain editable. */
(() => {
  'use strict';
  const D=window.RAIL_DATA;
  D.regions.push({id:'kyushu',label:'九州'});
  D.categories.find(c=>c.id==='private').label='私铁 / 地方交通';
  Object.assign(D.sources,{
    tobu:'https://www.tobu.co.jp/railway/special_express/vehicle/',
    seibu:'https://www.seiburailway.jp/railway/encyclopedia/',
    odakyu:'https://www.odakyu.jp/romancecar/line_up/',
    keisei:'https://www.keisei.co.jp/keisei/tetudou/accessj/sharyou.htm',
    keikyu:'https://www.keikyu.co.jp/trainmuseum/heisei.html',
    keio:'https://www.keio.co.jp/keiofan/museum/exist/',
    tokyu:'https://www.tokyu.co.jp/history/chapter09_2_1/',
    sotetsu:'https://www.sotetsu.co.jp/about/companies/transportation/',
    tokyoMetro:'https://www.tokyometro.jp/corporate/enterprise/passenger_rail/cars/working/index.html',
    toei:'https://www.kotsu.metro.tokyo.jp/pickup_information/gallery/subway.html',
    tx:'https://www.mir.co.jp/en/useful/outline.html',
    enoden:'https://www.enoden.co.jp/fan/museum/vehicle/300/',
    hakone:'https://www.hakonenavi.jp/special/features/',
    meitetsu1200:'https://www.meitetsu.co.jp/library/rolling_stock/detail_exp/1200.html',
    meitetsuFleet:'https://www.meitetsu.co.jp/ir/reference/integrated/2024_integratedreports_A4_1029.pdf',
    shizutetsu:'https://train.shizutetsu.co.jp/news/20241021/3771',
    entetsu:'https://www.entetsu.co.jp/tetsudou/library/kobore.html',
    izuhakone:'https://www.izuhakone.co.jp/izu-group/izu-recommendation-article/p000557.html',
    izukyu:'https://www.izukyu.co.jp/train/train.php',
    aikan:'https://www.aikanrailway.co.jp/pdf/company/CompanyProfile.pdf',
    aonami:'https://www.aonamiline.co.jp/guidance/safety',
    tenhama:'https://www.tenhama.co.jp/about/geton/',
    isaribi:'https://www.shr-isaribi.jp/enjoy/train/',
    sapporoMetro:'https://www.city.sapporo.jp/somu/koho-shi/202112/documents/2021201-22.pdf',
    sapporoTram:'https://www.stsp.or.jp/wp-content/uploads/2022/09/Safety-report2021.pdf',
    hakodateTram:'https://www.city.hakodate.hokkaido.jp/docs/2015070300040/',
    kyushu:'https://www.jrkyushu.co.jp/english/train/',
    kyushuSeats:'https://www.jrkyushu.co.jp/train/kids/guardian/train_equipment/index.html',
    kyushuDS:'https://www.jrkyushu.co.jp/trains/',
    nishitetsu:'https://www.nishitetsu.jp/train/sharyou/',
    fukuokaMetro:'https://subway.city.fukuoka.lg.jp/subway_webapp/files/uploads/第２章　施策体系と主要事業.pdf',
    kumaden:'https://www.kumamotodentetsu.co.jp/train/vehicles/',
    orange:'https://www.hs-orange.com/page87.html',
    minamiaso:'https://www.mt-torokko.com/2022/12/28/5895/'
  });
  const def=(id,name,en,code,color,source,ownership='私鉄')=>{D.lines[id]={name,en,code,color};D.routes[id]={label:name,source:D.sources[source],ownership};};
  const routes=[
    ['tb-nikko','東武｜スカイツリー・日光・鬼怒川線','Tobu Nikko / Kinugawa Line','TS','#b7864d','tobu'],
    ['tb-isesaki','東武｜伊勢崎・桐生線','Tobu Isesaki / Kiryu Line','TI','#c7434d','tobu'],
    ['tb-tojo','東武｜東上線','Tobu Tojo Line','TJ','#165caf','tobu'],
    ['tb-th','東武｜日比谷線直通 THライナー','Tobu TH Liner','TH','#8b425b','tobu'],
    ['sb-ikebukuro','西武｜池袋・西武秩父線','Seibu Ikebukuro / Chichibu Line','SI','#d6af34','seibu'],
    ['sb-shinjuku','西武｜新宿線','Seibu Shinjuku Line','SS','#5d93c1','seibu'],
    ['od-odawara','小田急｜小田原・箱根直通','Odakyu Odawara Line','OH','#3083bb','odakyu'],
    ['od-metro','小田急｜千代田線直通ロマンスカー','Odakyu Metro Romancecar','OH','#409ab2','odakyu'],
    ['ks-skyliner','京成｜成田スカイアクセス','Keisei Narita Sky Access','KS','#e47e24','keisei'],
    ['ks-main','京成｜本線','Keisei Main Line','KS','#3266aa','keisei'],
    ['kk-main','京急｜本線・久里浜線','Keikyu Main / Kurihama Line','KK','#d03239','keikyu'],
    ['kk-airport','京急｜空港線・羽田空港','Keikyu Airport Line','KK','#d03239','keikyu'],
    ['ko-main','京王｜京王・相模原・高尾線','Keio Line','KO','#ba3166','keio'],
    ['in-main','京王｜井の頭線','Keio Inokashira Line','IN','#4c84bf','keio'],
    ['ty-main','東急｜東横線','Tokyu Toyoko Line','TY','#d52a42','tokyu'],
    ['dt-main','東急｜田園都市線','Tokyu Den-en-toshi Line','DT','#299e68','tokyu'],
    ['mg-main','東急｜目黒線','Tokyu Meguro Line','MG','#238cb1','tokyu'],
    ['om-main','東急｜大井町線','Tokyu Oimachi Line','OM','#ef7f29','tokyu'],
    ['so-main','相鉄｜本線・JR直通','Sotetsu Main / JR Through Line','SO','#2776b0','sotetsu'],
    ['so-toyoko','相鉄｜新横浜・東横線直通','Sotetsu / Toyoko Through Line','SO','#2776b0','sotetsu'],
    ['so-meguro','相鉄｜新横浜・目黒線直通','Sotetsu / Meguro Through Line','SO','#2776b0','sotetsu'],
    ['tm-g','東京メトロ｜銀座線','Tokyo Metro Ginza Line','G','#f69b1d','tokyoMetro'],
    ['tm-m','東京メトロ｜丸ノ内線','Tokyo Metro Marunouchi Line','M','#e7364d','tokyoMetro'],
    ['tm-h','東京メトロ｜日比谷線','Tokyo Metro Hibiya Line','H','#b5b5ac','tokyoMetro'],
    ['tm-t','東京メトロ｜東西線','Tokyo Metro Tozai Line','T','#00a6b8','tokyoMetro'],
    ['tm-c','東京メトロ｜千代田線','Tokyo Metro Chiyoda Line','C','#26a87b','tokyoMetro'],
    ['tm-f','東京メトロ｜副都心線','Tokyo Metro Fukutoshin Line','F','#a57d54','tokyoMetro'],
    ['tm-z','東京メトロ｜半蔵門線','Tokyo Metro Hanzomon Line','Z','#9982c1','tokyoMetro'],
    ['tm-n','東京メトロ｜南北線','Tokyo Metro Namboku Line','N','#009c94','tokyoMetro'],
    ['te-a','都営｜浅草線','Toei Asakusa Line','A','#df7898','toei','公営地下鉄'],
    ['te-i','都営｜三田線','Toei Mita Line','I','#087bbb','toei','公営地下鉄'],
    ['tx-main','つくばエクスプレス','Tsukuba Express','TX','#d32a3f','tx','第三セクター'],
    ['en-main','江ノ電｜江ノ島電鉄線','Enoshima Electric Railway','EN','#418d60','enoden'],
    ['hk-tozan','箱根登山電車','Hakone Tozan Railway','OH','#a24937','hakone'],
    ['mt-seto','名鉄｜瀬戸線','Meitetsu Seto Line','ST','#e13b43','meitetsuFleet'],
    ['sz-main','静鉄｜静岡清水線','Shizuoka-Shimizu Line','S','#2d92b4','shizutetsu'],
    ['et-main','遠鉄｜鉄道線','Enshu Railway','ET','#c8403c','entetsu'],
    ['iz-sunzu','伊豆箱根｜駿豆線','Izuhakone Sunzu Line','IS','#2586bf','izuhakone'],
    ['iq-main','伊豆急｜伊豆急行線','Izu Kyuko Line','IZ','#4f99b9','izukyu'],
    ['ak-main','愛知環状鉄道','Aichi Loop Railway','AK','#3e9a65','aikan','第三セクター'],
    ['an-main','あおなみ線','Aonami Line','AN','#3d6faa','aonami','第三セクター'],
    ['th-main','天竜浜名湖鉄道','Tenryu Hamanako Railway','TH','#5b9b74','tenhama','第三セクター'],
    ['is-main','道南いさりび鉄道','South Hokkaido Railway','SH','#2a76ac','isaribi','第三セクター'],
    ['sp-n','札幌市営｜南北線','Sapporo Subway Namboku Line','N','#3caa76','sapporoMetro','公営地下鉄'],
    ['sp-t','札幌市営｜東西線','Sapporo Subway Tozai Line','T','#ec9030','sapporoMetro','公営地下鉄'],
    ['sp-h','札幌市営｜東豊線','Sapporo Subway Toho Line','H','#1c9bca','sapporoMetro','公営地下鉄'],
    ['sp-tram','札幌市電｜環状線','Sapporo Streetcar Loop','SC','#579c67','sapporoTram','公設民営軌道'],
    ['hd-tram','函館市電｜湯の川・谷地頭方面','Hakodate City Tram','DY','#368a9b','hakodateTram','公営軌道'],
    ['ky-shinkansen','JR九州｜九州新幹線','Kyushu Shinkansen','新','#cf263a','kyushuSeats','JR'],
    ['ky-nishi','JR九州｜西九州新幹線','Nishi Kyushu Shinkansen','新','#c43b3d','kyushuSeats','JR'],
    ['ky-nippo','JR九州｜日豊本線（ソニック）','JR Kyushu Nippo Line','JR','#2589bb','kyushu','JR'],
    ['ky-nagasaki','JR九州｜佐世保・長崎本線','JR Kyushu Nagasaki / Sasebo Line','JR','#dc8a40','kyushu','JR'],
    ['ky-south','JR九州｜南九州・日豊本線','JR Kyushu Southern Nippo Line','JR','#ba6956','kyushu','JR'],
    ['ky-kyudai','JR九州｜久大本線','JR Kyushu Kyudai Line','JR','#5a9b72','kyushuDS','JR'],
    ['ky-hohi','JR九州｜豊肥本線','JR Kyushu Hohi Line','JR','#bd9654','kyushuDS','JR'],
    ['ky-ibusuki','JR九州｜指宿枕崎線','JR Kyushu Ibusuki-Makurazaki Line','JR','#555d64','kyushuDS','JR'],
    ['ky-omura','JR九州｜大村線・ふたつ星4047','JR Kyushu Omura Line','JR','#c3b383','kyushuDS','JR'],
    ['ky-36','JR九州｜36ぷらす3 周遊','36+3 Railway Journey','JR','#b29454','kyushuDS','JR'],
    ['ky-kagoshima','JR九州｜鹿児島本線','JR Kyushu Kagoshima Line','JB','#cc313e','kyushu','JR'],
    ['ky-fukuhoku','JR九州｜福北ゆたか線','JR Kyushu Fukuhoku Yutaka Line','JC','#df9b34','kyushu','JR'],
    ['nt-main','西鉄｜天神大牟田線','Nishitetsu Tenjin Omuta Line','T','#c24b4b','nishitetsu'],
    ['nt-dazaifu','西鉄｜太宰府線・旅人','Nishitetsu Dazaifu Line','D','#bd8069','nishitetsu'],
    ['fk-airport','福岡市地下鉄｜空港線','Fukuoka Subway Airport Line','K','#e47e35','fukuokaMetro','公営地下鉄'],
    ['fk-nanakuma','福岡市地下鉄｜七隈線','Fukuoka Subway Nanakuma Line','N','#4c9b74','fukuokaMetro','公営地下鉄'],
    ['kd-main','熊本電鉄｜菊池・藤崎線','Kumamoto Electric Railway','KD','#52a681','kumaden'],
    ['or-main','肥薩おれんじ鉄道','Hisatsu Orange Railway','OR','#e5a246','orange','第三セクター'],
    ['ma-main','南阿蘇鉄道｜高森線','Minamiaso Railway','MT','#4fa0aa','minamiaso','第三セクター']
  ];routes.forEach(args=>def(...args));
  // Destination spellings are maintained separately from editable Japanese labels.
  Object.assign(D.destinations,{
    '浅草':'Asakusa','東武日光':'Tobu-Nikko','鬼怒川温泉':'Kinugawa-Onsen','会津田島':'Aizu-Tajima','赤城':'Akagi','館林':'Tatebayashi','池袋':'Ikebukuro','森林公園':'Shinrin-Koen','小川町':'Ogawamachi','久喜':'Kuki','恵比寿':'Ebisu','西武秩父':'Seibu-Chichibu','飯能':'Hanno','西武新宿':'Seibu-Shinjuku','本川越':'Hon-Kawagoe','元町・中華街':'Motomachi-Chukagai','小手指':'Kotesashi','箱根湯本':'Hakone-Yumoto','片瀬江ノ島':'Katase-Enoshima','本厚木':'Hon-Atsugi','北千住':'Kita-Senju','京成上野':'Keisei-Ueno','青砥':'Aoto','三崎口':'Misakiguchi','泉岳寺':'Sengakuji','羽田空港':'Haneda Airport','逗子・葉山':'Zushi-Hayama','京王八王子':'Keio-Hachioji','高尾山口':'Takaosanguchi','吉祥寺':'Kichijoji','渋谷':'Shibuya','中央林間':'Chuo-Rinkan','押上':'Oshiage','日吉':'Hiyoshi','目黒':'Meguro','大井町':'Oimachi','溝の口':'Mizonokuchi','和光市':'Wakoshi','武蔵小杉':'Musashi-Kosugi','横浜':'Yokohama','浅草':'Asakusa','荻窪':'Ogikubo','中目黒':'Naka-Meguro','南栗橋':'Minami-Kurihashi','西船橋':'Nishi-Funabashi','代々木上原':'Yoyogi-Uehara','北綾瀬':'Kita-Ayase','浦和美園':'Urawa-Misono','西馬込':'Nishi-Magome','西高島平':'Nishi-Takashimadaira','秋葉原':'Akihabara','つくば':'Tsukuba','鎌倉':'Kamakura','藤沢':'Fujisawa','強羅':'Gora','栄町':'Sakaemachi','尾張瀬戸':'Owari-Seto','新静岡':'Shin-Shizuoka','新清水':'Shin-Shimizu','新浜松':'Shin-Hamamatsu','西鹿島':'Nishi-Kajima','三島':'Mishima','伊東':'Ito','高蔵寺':'Kozoji','岡崎':'Okazaki','金城ふ頭':'Kinjo-futo','掛川':'Kakegawa','新所原':'Shinjohara','木古内':'Kikonai','上磯':'Kamiiso','麻生':'Asabu','真駒内':'Makomanai','宮の沢':'Miyanosawa','新さっぽろ':'Shin-Sapporo','栄町（札幌）':'Sakaemachi (Sapporo)','福住':'Fukuzumi','外回り':'Outer Loop','内回り':'Inner Loop','湯の川':'Yunokawa','谷地頭':'Yachigashira','函館どつく前':'Hakodate-Dock','武雄温泉':'Takeo-Onsen','長崎':'Nagasaki','大分':'Oita','別府':'Beppu','佐世保':'Sasebo','ハウステンボス':'Huis Ten Bosch','宮崎空港':'Miyazaki Airport','宮崎':'Miyazaki','延岡':'Nobeoka','由布院':'Yufuin','阿蘇':'Aso','指宿':'Ibusuki','諫早':'Isahaya','門司港':'Mojiko','折尾':'Orio','直方':'Nogata','鳥栖':'Tosu','佐伯':'Saiki','西鉄福岡（天神）':'Nishitetsu-Fukuoka (Tenjin)','大牟田':'Omuta','太宰府':'Dazaifu','福岡空港':'Fukuoka Airport','姪浜':'Meinohama','博多':'Hakata','御代志':'Miyoshi','藤崎宮前':'Fujisakigu-mae','八代':'Yatsushiro','川内':'Sendai (Kagoshima)','高森':'Takamori','立野':'Tateno','肥後大津':'Higo-Ozu','長洲':'Nagasu'
  });
  const brand=(id,label,theme,source)=>{D.additionalBrands??={};D.additionalBrands[id]={label,text:label,theme,format:'typeset',source:D.sources[source]};return id;};
  brand('spaciax','SPACIA X','silver','tobu');brand('spacia','SPACIA','orange','tobu');brand('revaty','Revaty','silver','tobu');brand('laview','Laview','yellow','seibu');brand('romancecar','Romancecar','red','odakyu');brand('skyliner','SKYLINER','blue','keisei');brand('panoramasuper','Panorama super','red','meitetsu1200');brand('yufuin','ゆふいんの森','blue','kyushuDS');brand('36plus3','36ぷらす3','purple','kyushuDS');brand('4047','ふたつ星4047','yellow','kyushuDS');
  function add(id,label,series,name,en,cars,region,route,type,destinations,extra={}){
    const r=D.routes[route],source=Object.keys(D.sources).find(k=>D.sources[k]===r.source),category=extra.category||'private';
    D.vehicles.push(Object.assign({id,label,series,name,en,cars,region,category,route,line:route,kind:category,type,destinations,operator:extra.operator||({east:'tokyoprivate',tokai:'tokaiprivate',hokkaido:'hokkaidotransit',kyushu:category==='private'?'kyushutransit':'jrkyushu'}[region]),source,number:['特急','新幹線'].includes(type)&&!/乗車券のみ|予約不要/.test(extra.seat||'')?'1号':'',seat:category==='commuter'?'':category==='shinkansen'?'指定席・自由席':type==='特急'?'全車指定席':'',accent:category==='private'?'#e8e6dc':D.lines[route].color,ownership:r.ownership||'私鉄'},extra));
  }
  // Kanto: major private railways plus metropolitan / local transport.
  add('tb-n100','N100 SPACIA X','東武N100系','スペーシア X','SPACIA X',6,'east','tb-nikko','特急',['東武日光','鬼怒川温泉','浅草'],{serviceFeatures:['compartment','cafe','premiumseat'],serviceBrand:'spaciax',seat:'全車指定席・プレミアム席あり'});
  add('tb100-spacia','100 SPACIA','東武100系','スペーシア','SPACIA',6,'east','tb-nikko','特急',['東武日光','鬼怒川温泉','浅草'],{serviceFeatures:['compartment'],serviceBrand:'spacia'});
  add('tb500-kegon','500 Revaty Kegon','東武500系','リバティけごん','REVATY KEGON',3,'east','tb-nikko','特急',['東武日光','浅草'],{serviceBrand:'revaty'});
  add('tb500-aizu','500 Revaty Aizu','東武500系','リバティ会津','REVATY AIZU',3,'east','tb-nikko','特急',['会津田島','浅草'],{serviceBrand:'revaty'});
  add('tb200-ryomo','200 两毛','東武200型','りょうもう','RYOMO',6,'east','tb-isesaki','特急',['赤城','館林','浅草']);
  add('tb50090-tj','50090 TJ Liner','東武50090型','TJライナー','TJ LINER',10,'east','tb-tojo','ライナー',['森林公園','小川町','池袋'],{serviceFeatures:['reserved'],seat:'座席指定サービス'});
  add('tb70090-th','70090 TH Liner','東武70090型','THライナー','TH LINER',7,'east','tb-th','ライナー',['久喜','恵比寿'],{serviceFeatures:['reserved'],seat:'座席指定サービス'});
  add('tb50050','50050 东武通勤','東武50050型','東武スカイツリーライン','TOBU SKYTREE LINE',10,'east','tb-nikko','急行',['南栗橋','久喜','中央林間'],{seat:'4ドア'});
  add('sb001-laview','001 Laview Chichibu','西武001系','ちちぶ','CHICHIBU',8,'east','sb-ikebukuro','特急',['西武秩父','飯能','池袋'],{serviceBrand:'laview'});
  add('sb10000-koedo','10000 New Red Arrow','西武10000系','小江戸','KOEDO',7,'east','sb-shinjuku','特急',['本川越','西武新宿']);
  add('sb40000-strain','40000 S-TRAIN','西武40000系','S-TRAIN','S-TRAIN',10,'east','sb-ikebukuro','ライナー',['西武秩父','元町・中華街','小手指'],{serviceFeatures:['reserved'],seat:'全車指定席'});
  add('sb30000','30000 Smile Train','西武30000系','西武池袋線','SEIBU IKEBUKURO LINE',8,'east','sb-ikebukuro','急行',['飯能','池袋'],{seat:'4ドア'});
  add('od70000-gse','70000 GSE Hakone','小田急70000形','はこね','HAKONE',7,'east','od-odawara','特急',['箱根湯本','新宿'],{serviceFeatures:['panorama'],serviceBrand:'romancecar'});
  add('od60000-mse','60000 MSE Metro Hakone','小田急60000形','メトロはこね','METRO HAKONE',6,'east','od-metro','特急',['箱根湯本','北千住'],{serviceBrand:'romancecar'});
  add('od30000-exe','30000 EXEα Hakone','小田急30000形','はこね','HAKONE',10,'east','od-odawara','特急',['箱根湯本','新宿'],{serviceBrand:'romancecar'});
  add('od5000','5000 小田急快速急行','小田急5000形','小田急線','ODAKYU LINE',10,'east','od-odawara','快速急行',['小田原','新宿','片瀬江ノ島'],{seat:'4ドア'});
  add('od4000','4000 小田急急行','小田急4000形','小田急線','ODAKYU LINE',10,'east','od-odawara','急行',['本厚木','新宿','代々木上原'],{seat:'4ドア'});
  add('ks-ae','AE Skyliner','京成AE形','スカイライナー','SKYLINER',8,'east','ks-skyliner','特急',['成田空港','京成上野'],{serviceFeatures:['airport'],serviceBrand:'skyliner'});
  add('ks3100','3100 Access特急','京成3100形','成田スカイアクセス','NARITA SKY ACCESS',8,'east','ks-skyliner','アクセス特急',['成田空港','羽田空港','京成上野'],{serviceFeatures:['airport'],seat:'乗車券のみ・予約不要'});
  add('ks3000','3000 京成本线','京成3000形','京成本線','KEISEI MAIN LINE',8,'east','ks-main','快速',['成田空港','京成上野','青砥'],{seat:'3ドア'});
  add('kk2100','2100 京急快特','京急2100形','京急本線','KEIKYU MAIN LINE',8,'east','kk-main','快特',['三崎口','泉岳寺'],{seat:'2ドア・転換クロスシート'});
  add('kk1000-airport','1000 京急机场线','京急1000形','京急空港線','KEIKYU AIRPORT LINE',8,'east','kk-airport','エアポート急行',['羽田空港','逗子・葉山'],{serviceFeatures:['airport'],seat:'乗車券のみ・予約不要'});
  add('kk2100-wing','2100 Wing号','京急2100形','ウィング号','WING',8,'east','kk-main','ライナー',['三崎口','品川'],{serviceFeatures:['reserved'],seat:'座席指定サービス'});
  add('ko5000-liner','5000 Keio Liner','京王5000系','京王ライナー','KEIO LINER',10,'east','ko-main','ライナー',['京王八王子','橋本','新宿'],{serviceFeatures:['reserved'],seat:'座席指定サービス'});
  add('ko9000','9000 京王特急','京王9000系','京王線','KEIO LINE',10,'east','ko-main','特急',['京王八王子','高尾山口','新宿'],{seat:'乗車券のみ・予約不要'});
  add('in1000','1000 井之头线','京王1000系','井の頭線','INOKASHIRA LINE',5,'east','in-main','急行',['吉祥寺','渋谷'],{seat:'4ドア'});
  add('ty5050','5050 东横线','東急5050系','東横線','TOYOKO LINE',10,'east','ty-main','特急',['元町・中華街','渋谷','和光市'],{seat:'乗車券のみ・予約不要'});
  add('dt2020','2020 田园都市线','東急2020系','田園都市線','DEN-EN-TOSHI LINE',10,'east','dt-main','急行',['中央林間','押上','南栗橋'],{seat:'4ドア'});
  add('mg3020','3020 目黑线','東急3020系','目黒線','MEGURO LINE',8,'east','mg-main','急行',['日吉','目黒','浦和美園'],{seat:'4ドア'});
  add('om6020','6020 大井町线','東急6020系','大井町線','OIMACHI LINE',7,'east','om-main','急行',['溝の口','大井町'],{seat:'Q SEATは対象列車のみ'});
  add('so12000','12000 相铁JR直通','相鉄12000系','相鉄・JR直通線','SOTETSU / JR THROUGH LINE',10,'east','so-main','特急',['海老名','新宿','横浜'],{seat:'乗車券のみ・予約不要'});
  add('so20000','20000 相铁东横直通','相鉄20000系','相鉄・東急直通線','SOTETSU / TOKYU THROUGH LINE',10,'east','so-toyoko','特急',['海老名','和光市','渋谷'],{seat:'乗車券のみ・予約不要'});
  add('so21000','21000 相铁目黑直通','相鉄21000系','相鉄・東急直通線','SOTETSU / MEGURO THROUGH LINE',8,'east','so-meguro','急行',['海老名','浦和美園','目黒'],{seat:'4ドア'});
  const metros=[['g','1000',6,'銀座線','GINZA LINE',['浅草','渋谷']],['m','2000',6,'丸ノ内線','MARUNOUCHI LINE',['池袋','荻窪']],['h','13000',7,'日比谷線','HIBIYA LINE',['中目黒','北千住','南栗橋']],['t','15000',10,'東西線','TOZAI LINE',['西船橋','中野']],['c','16000',10,'千代田線','CHIYODA LINE',['北綾瀬','代々木上原']],['f','17000',10,'副都心線','FUKUTOSHIN LINE',['和光市','元町・中華街']],['z','18000',10,'半蔵門線','HANZOMON LINE',['押上','中央林間']],['n','9000',6,'南北線','NAMBOKU LINE',['浦和美園','日吉']]];
  for(const [code,series,cars,name,en,dest] of metros)add('tm'+series+'-'+code,series+' '+name,'東京メトロ'+series+'系',name,en,cars,'east','tm-'+code,'各駅停車',dest,{operator:'tokyometro',seat:'一般車'});
  add('te5500','5500 都营浅草线','都営5500形','浅草線','ASAKUSA LINE',8,'east','te-a','普通',['西馬込','押上','羽田空港'],{operator:'toei',seat:'一般車'});
  add('te6500','6500 都营三田线','都営6500形','三田線','MITA LINE',8,'east','te-i','各駅停車',['西高島平','日吉'],{operator:'toei',seat:'一般車'});
  add('tx3000','TX-3000 筑波快线','TX-3000系','つくばエクスプレス','TSUKUBA EXPRESS',6,'east','tx-main','快速',['つくば','秋葉原'],{seat:'一般車'});
  add('en300','300 江之电','江ノ電300形','江ノ島電鉄線','ENOSHIMA ELECTRIC RAILWAY',2,'east','en-main','普通',['鎌倉','藤沢'],{seat:'連接車'});
  add('hk3000-tozan','3000 Allegra','箱根登山3000形','箱根登山電車','HAKONE TOZAN RAILWAY',3,'east','hk-tozan','普通',['強羅','箱根湯本'],{seat:'登山電車'});
  // Tokai: Nagoya suburban railways and Shizuoka / Izu / third-sector lines.
  add('mt1200','1200 Panorama super','名鉄1200系','名鉄特急','MEITETSU LIMITED EXPRESS',6,'tokai','meitetsu-main','特急',['豊橋','名鉄岐阜'],{source:'meitetsu1200',operator:'meitetsu',seat:'一部特別車',serviceFeatures:['specialcar','panorama'],serviceBrand:'panoramasuper'});
  add('mt9500','9500 名铁通勤','名鉄9500系','名鉄名古屋本線','MEITETSU NAGOYA MAIN LINE',4,'tokai','meitetsu-main','急行',['豊橋','名鉄岐阜','名鉄名古屋'],{source:'meitetsuFleet',operator:'meitetsu',seat:'一般車'});
  add('mt3500','3500 名铁通勤','名鉄3500系','名鉄名古屋本線','MEITETSU NAGOYA MAIN LINE',4,'tokai','meitetsu-main','準急',['名鉄岐阜','名鉄名古屋'],{source:'meitetsuFleet',operator:'meitetsu',seat:'一般車'});
  add('mt4000-seto','4000 名铁濑户线','名鉄4000系','名鉄瀬戸線','MEITETSU SETO LINE',4,'tokai','mt-seto','普通',['尾張瀬戸','栄町'],{operator:'meitetsu',seat:'一般車'});
  add('sz-a3000','A3000 静冈清水线','静鉄A3000形','静岡清水線','SHIZUOKA-SHIMIZU LINE',2,'tokai','sz-main','普通',['新清水','新静岡'],{seat:'ワンマン'});
  add('et2000','2000 远州铁道','遠鉄2000形','遠州鉄道線','ENSHU RAILWAY',2,'tokai','et-main','普通',['西鹿島','新浜松'],{seat:'一般車'});
  add('iz3000','3000 伊豆箱根骏豆线','伊豆箱根3000系','駿豆線','SUNZU LINE',3,'tokai','iz-sunzu','普通',['修善寺','三島'],{seat:'一般車'});
  add('iz7000','7000 伊豆箱根骏豆线','伊豆箱根7000系','駿豆線','SUNZU LINE',3,'tokai','iz-sunzu','普通',['修善寺','三島'],{seat:'クロスシート'});
  add('iq8000','8000 伊豆急','伊豆急8000系','伊豆急行線','IZU KYUKO LINE',3,'tokai','iq-main','普通',['伊豆急下田','伊東'],{seat:'普通車'});
  add('iq2100-kinme','2100 Kinme Train','伊豆急2100系','リゾート21 キンメ電車','RESORT 21 KINME TRAIN',7,'tokai','iq-main','普通',['伊豆急下田','伊東'],{seat:'全車普通車・予約不要',serviceFeatures:['panorama']});
  add('iq3000','3000 Aloha Train','伊豆急3000系','アロハ電車','ALOHA TRAIN',4,'tokai','iq-main','普通',['伊豆急下田','伊東'],{seat:'全車普通車'});
  add('ak2000','2000 爱知环状铁道','愛環2000系','愛知環状鉄道線','AICHI LOOP RAILWAY',2,'tokai','ak-main','普通',['高蔵寺','岡崎'],{seat:'一般車'});
  add('an1000','1000 青波线','あおなみ線1000形','あおなみ線','AONAMI LINE',4,'tokai','an-main','普通',['金城ふ頭','名古屋'],{seat:'一般車'});
  add('th2100','TH2100 天龙滨名湖','TH2100形','天竜浜名湖線','TENRYU HAMANAKO LINE',1,'tokai','th-main','普通',['新所原','掛川'],{seat:'ワンマン'});
  // Hokkaido has no large private suburban railway: label ownership explicitly.
  add('is-kiha40','KiHa40 道南渔火','キハ40形','道南いさりび鉄道','SOUTH HOKKAIDO RAILWAY',1,'hokkaido','is-main','普通',['木古内','函館','上磯'],{seat:'第三セクター・ワンマン'});
  add('is-nagamare','KiHa40 Nagamare海峡号','キハ40形','ながまれ海峡号','NAGAMARE KAIKYO',1,'hokkaido','is-main','観光列車',['木古内','函館'],{seat:'旅行商品・事前予約制'});
  add('sp5000','5000 札幌南北线','札幌市営5000形','南北線','NAMBOKU LINE',6,'hokkaido','sp-n','各駅停車',['真駒内','麻生'],{seat:'公営地下鉄'});
  add('sp8000','8000 札幌东西线','札幌市営8000形','東西線','TOZAI LINE',7,'hokkaido','sp-t','各駅停車',['新さっぽろ','宮の沢'],{seat:'公営地下鉄'});
  add('sp9000','9000 札幌东丰线','札幌市営9000形','東豊線','TOHO LINE',4,'hokkaido','sp-h','各駅停車',['福住','栄町（札幌）'],{seat:'公営地下鉄'});
  add('sp-a1200','A1200 Polaris','札幌市電A1200形','札幌市電 ポラリス','SAPPORO STREETCAR POLARIS',1,'hokkaido','sp-tram','普通',['外回り','内回り'],{seat:'3車体連接・1編成'});
  add('sp1100','1100 Sirius','札幌市電1100形','札幌市電 シリウス','SAPPORO STREETCAR SIRIUS',1,'hokkaido','sp-tram','普通',['外回り','内回り'],{seat:'低床単車'});
  add('hd9600','9600 函馆市电','函館市電9600形','函館市電 らっくる','HAKODATE CITY TRAM',1,'hokkaido','hd-tram','普通',['谷地頭','函館どつく前','湯の川'],{seat:'2車体連接・1編成'});
  // Kyushu Shinkansen / intercity / D&S / regional / local operators.
  const ky=(id,label,series,name,en,cars,route,type,dests,extra={})=>add(id,label,series,name,en,cars,'kyushu',route,type,dests,{category:'limited',...extra});
  ky('ky-n700-mizuho','N700 Mizuho','N700系','みずほ','MIZUHO',8,'ky-shinkansen','新幹線',['鹿児島中央','新大阪'],{category:'shinkansen',serviceFeatures:['green']});
  ky('ky-n700-sakura','N700 Sakura','N700系','さくら','SAKURA',8,'ky-shinkansen','新幹線',['鹿児島中央','新大阪','博多'],{category:'shinkansen',serviceFeatures:['green']});
  ky('ky800-sakura','800 Sakura','800系','さくら','SAKURA',6,'ky-shinkansen','新幹線',['鹿児島中央','博多'],{category:'shinkansen'});
  ky('ky800-tsubame','800 Tsubame','800系','つばめ','TSUBAME',6,'ky-shinkansen','新幹線',['鹿児島中央','熊本','博多'],{category:'shinkansen'});
  ky('ky-n700s-kamome','N700S Kamome','N700S系8000番台','かもめ','KAMOME',6,'ky-nishi','新幹線',['長崎','武雄温泉'],{category:'shinkansen'});
  ky('ky883-sonic','883 Sonic','883系','ソニック','SONIC',7,'ky-nippo','特急',['大分','別府','博多'],{seat:'指定席・自由席',serviceFeatures:['green']});
  ky('ky885-sonic','885 白色Sonic','885系','ソニック','SONIC',6,'ky-nippo','特急',['大分','別府','博多'],{seat:'指定席・自由席',serviceFeatures:['green']});
  ky('ky885-relay','885 Relay Kamome','885系','リレーかもめ','RELAY KAMOME',6,'ky-nagasaki','特急',['武雄温泉','博多'],{seat:'指定席・自由席',serviceFeatures:['green']});
  ky('ky787-relay','787 Relay Kamome','787系','リレーかもめ','RELAY KAMOME',8,'ky-nagasaki','特急',['武雄温泉','博多'],{seat:'指定席・自由席',serviceFeatures:['green','deluxe','compartment']});
  ky('ky783-midori','783 Midori','783系','みどり','MIDORI',4,'ky-nagasaki','特急',['佐世保','博多'],{seat:'指定席・自由席',serviceFeatures:['green']});
  ky('ky783-htb','783 Huis Ten Bosch','783系','ハウステンボス','HUIS TEN BOSCH',4,'ky-nagasaki','特急',['ハウステンボス','博多'],{seat:'指定席・自由席',serviceFeatures:['green']});
  ky('ky787-nichirin','787 Nichirin','787系','にちりん','NICHIRIN',4,'ky-south','特急',['宮崎空港','大分','延岡'],{serviceFeatures:['green']});
  ky('ky787-kirishima','787 Kirishima','787系','きりしま','KIRISHIMA',4,'ky-south','特急',['鹿児島中央','宮崎'],{seat:'指定席・自由席',serviceFeatures:['green']});
  ky('ky787-hyuga','787 Hyuga','787系','ひゅうが','HYUGA',4,'ky-south','特急',['宮崎空港','延岡'],{serviceFeatures:['green']});
  ky('ky185-yufu','KiHa185 Yufu','キハ185系','ゆふ','YUFU',3,'ky-kyudai','特急',['別府','博多','由布院'],{seat:'指定席・自由席'});
  ky('ky72-yufuin','KiHa72 由布院之森','キハ72系','ゆふいんの森','YUFUIN NO MORI',5,'ky-kyudai','特急',['由布院','別府','博多'],{serviceFeatures:['cafe'],serviceBrand:'yufuin'});
  ky('ky183-asoboy','KiHa183 Aso Boy','キハ183系1000番台','あそぼーい！','ASO BOY!',4,'ky-hohi','特急',['阿蘇','熊本'],{serviceFeatures:['cafe','panorama']});
  ky('ky47-ibutama','KiHa47 指宿玉手箱','キハ47・140形','指宿のたまて箱','IBUSUKI NO TAMATEBAKO',2,'ky-ibusuki','特急',['指宿','鹿児島中央']);
  ky('ky787-36plus3','787 36plus3','787系','36ぷらす3','36+3',6,'ky-36','特急',['鹿児島中央','宮崎','大分','博多'],{seat:'全車グリーン席',serviceFeatures:['green','compartment','cafe'],serviceBrand:'36plus3'});
  ky('ky47-4047','KiHa47 Futatsuboshi4047','キハ47・140形','ふたつ星4047','FUTATSUBOSHI 4047',3,'ky-omura','特急',['長崎','武雄温泉'],{serviceFeatures:['cafe'],serviceBrand:'4047'});
  ky('ky47-kanpachi','KiHa47 Kanpachi','キハ47・125形','かんぱち','KANPACHI',3,'ky-kyudai','特急',['別府','博多'],{seat:'全車グリーン席',serviceFeatures:['green','cafe','compartment']});
  ky('ky813','813 鹿儿岛本线','813系','鹿児島本線','KAGOSHIMA LINE',3,'ky-kagoshima','快速',['門司港','博多','鳥栖'],{category:'commuter'});
  ky('ky817','817 福北丰线','817系','福北ゆたか線','FUKUHOKU YUTAKA LINE',2,'ky-fukuhoku','普通',['直方','博多'],{category:'commuter',seat:'ワンマン'});
  ky('ky821','821 鹿儿岛本线','821系','鹿児島本線','KAGOSHIMA LINE',3,'ky-kagoshima','普通',['門司港','博多','鳥栖'],{category:'commuter'});
  ky('ky815','815 熊本地区','815系','鹿児島本線','KAGOSHIMA LINE',2,'ky-kagoshima','普通',['八代','熊本','鳥栖'],{category:'commuter',seat:'ワンマン'});
  ky('ky-yc1','YC1 长崎地区','YC1系','長崎本線・大村線','NAGASAKI / OMURA LINE',2,'ky-nagasaki','普通',['長崎','佐世保','諫早'],{category:'commuter',seat:'ワンマン'});
  ky('ky200','KiHa200 大分地区','キハ200系','豊肥本線','HOHI LINE',2,'ky-hohi','普通',['大分','豊後竹田'],{category:'commuter',seat:'ワンマン'});
  add('nt3000','3000 西铁特急','西鉄3000形','西鉄天神大牟田線','NISHITETSU TENJIN OMUTA LINE',6,'kyushu','nt-main','特急',['大牟田','西鉄福岡（天神）'],{seat:'乗車券のみ・予約不要'});
  add('nt9000','9000 西铁急行','西鉄9000形','西鉄天神大牟田線','NISHITETSU TENJIN OMUTA LINE',5,'kyushu','nt-main','急行',['大牟田','西鉄福岡（天神）'],{seat:'一般車'});
  // Retain the legacy ID for saved settings; the second-generation Tabito uses the 3000 series.
  add('nt6050-tabito','3000 西铁旅人','西鉄3000形','旅人','TABITO',5,'kyushu','nt-dazaifu','普通',['太宰府','西鉄福岡（天神）'],{seat:'一般車・予約不要'});
  add('fk4000','4000 福冈机场线','福岡市地下鉄4000系','空港線','FUKUOKA AIRPORT LINE',6,'kyushu','fk-airport','各駅停車',['福岡空港','姪浜'],{seat:'公営地下鉄'});
  add('fk3000','3000 福冈七隈线','福岡市地下鉄3000系','七隈線','NANAKUMA LINE',4,'kyushu','fk-nanakuma','各駅停車',['博多','橋本'],{seat:'公営地下鉄'});
  add('kd03','03 熊本电铁','熊本電鉄03形','熊本電鉄','KUMAMOTO ELECTRIC RAILWAY',2,'kyushu','kd-main','普通',['御代志','藤崎宮前'],{seat:'ワンマン'});
  add('or100','HSOR100 肥萨橙铁','HSOR-100A形','肥薩おれんじ鉄道','HISATSU ORANGE RAILWAY',1,'kyushu','or-main','普通',['川内','八代'],{seat:'第三セクター・ワンマン'});
  add('ma4000','MT4000 南阿苏铁道','MT-4000形','南阿蘇鉄道','MINAMIASO RAILWAY',1,'kyushu','ma-main','普通',['高森','立野','肥後大津'],{seat:'第三セクター・ワンマン'});
  Object.assign(D.destinations,{'豊後竹田':'Bungo-Taketa'});
  Object.assign(D.typeEnglish,{'アクセス特急':'Access Express','快特':'Rapid Ltd. Exp.','エアポート急行':'Airport Express','観光列車':'Sightseeing Train'});
  for(const t of Object.keys(D.typeEnglish))if(!D.types.includes(t))D.types.push(t);
  D.styles.push(['tokyoprivate','关东私铁'],['tokyometro','东京 Metro'],['toei','都营地下铁'],['tokaiprivate','东海地方铁道'],['hokkaidotransit','北海道地方交通'],['jrkyushu','JR 九州'],['kyushutransit','九州私铁 / 地方交通']);
})();
