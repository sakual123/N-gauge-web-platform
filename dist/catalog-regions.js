/* Regional taxonomy and additional service presets. Loaded after catalog.js. */
(() => {
  'use strict';
  const D=window.RAIL_DATA;
  D.regions=[{id:'east',label:'东日本'},{id:'west',label:'西日本'},{id:'hokkaido',label:'北海道'},{id:'tokai',label:'东海'}];
  D.categories=[{id:'shinkansen',label:'新干线'},{id:'limited',label:'特急'},{id:'commuter',label:'通勤'},{id:'private',label:'私铁'}];
  D.routes=Object.fromEntries(Object.entries(D.lines).map(([id,v])=>[id,{label:v.name}]));
  Object.assign(D.routes,{
    'ueno-tokyo':{label:'上野東京ライン'},yokosuka:{label:'横須賀線'},'sobu-rapid':{label:'総武快速線'},utsunomiya:{label:'宇都宮線'},takasaki:{label:'高崎線'},
    'kt-tenri':{label:'近鉄｜天理線'},'kt-meihan':{label:'近鉄｜大阪・名古屋線（名阪特急）'}
  });
  const routeOverrides={'e233-ueno-tokyo':'ueno-tokyo','e235-yokosuka':'yokosuka','e235-sobu':'sobu-rapid','e233-utsunomiya':'utsunomiya','e233-takasaki':'takasaki','kintetsu-8a':'kt-tenri','kintetsu-hinotori':'kt-meihan'};
  for(const v of D.vehicles){v.region=v.operator==='kintetsu'?'west':['789-hakucho','hokutosei'].includes(v.id)?'hokkaido':'east';v.category=v.kind;v.route=routeOverrides[v.id]||v.line;delete v.owned;}
  Object.assign(D.sources,{
    west:'https://www.westjr.co.jp/company/info/issue/data/pdf/data2025_15.pdf',
    westServices:'https://www.jr-odekake.net/railroad/train/category/',
    haruka:'https://www.jr-odekake.net/railroad/train/haruka/',
    yakumo:'https://www.jr-odekake.net/railroad/yakumo/',
    railstar:'https://smart-ex.jp/en/beginner/equipment/railstar/',
    kodama:'https://smart-ex.jp/en/beginner/equipment/kodama08/',
    n700:'https://smart-ex.jp/en/beginner/equipment/n700/',
    kintetsu:'https://www.kintetsu.jp/kouhou/Train/list_type.html',
    aoniyoshi:'https://www.kintetsu.jp/kouhou/Train/aoniyoshi.html',
    keihan:'https://www.keihan.co.jp/traffic/railfan/vehicle/',
    hankyu:'https://www.hankyu.co.jp/railfan/maroon/index.html',
    hanshin:'https://www.hanshin.co.jp/fans/car/',
    nankai:'https://www.nankai.co.jp/traffic/museum/muse/ji0003.html',
    sanyo:'https://www.sanyo-railway.co.jp/railway/express.html',
    metro:'https://www.jametro.or.jp/subway/japan/osaka/guide.html',
    eizan:'https://eizandensha.co.jp/vehicle/75/',
    shintetsu:'https://www.shintetsu.co.jp/wp/wp-content/uploads/2026/02/260226.pdf',
    hokkaido:'https://www.jrhokkaido.co.jp/train/',
    h5:'https://www.jrhokkaido.co.jp/train/shinkansen.html',
    lilac:'https://www.jrhokkaido.co.jp/train/tr033_01.html',
    hokuto:'https://www.jrhokkaido.co.jp/train/tr003_01.html',
    airport:'https://www.jrhokkaido.co.jp/global/english/train/guide/muroran.html',
    tokai315:'https://railway.jr-central.co.jp/315s/index.html',
    tokai313:'https://railway.jr-central.co.jp/train/express/detail_02_07/index.html',
    tokaiLimited:'https://saiyo.jr-central.co.jp/company/business/conventional.html',
    meitetsu:'https://www.meitetsu.co.jp/location/location/vehicle.html'
  });
  Object.assign(D.destinations,{
    '大阪':'Osaka','京都':'Kyoto','新大阪':'Shin-Osaka','神戸':'Kobe','姫路':'Himeji','網干':'Aboshi','米原':'Maibara','長浜':'Nagahama','近江今津':'Omi-Imazu','西明石':'Nishi-Akashi','宝塚':'Takarazuka','新三田':'Shin-Sanda','篠山口':'Sasayamaguchi','同志社前':'Doshishamae','木津':'Kizu','京橋':'Kyobashi','天王寺':'Tennoji','大阪環状線':'Osaka Loop Line','ユニバーサルシティ・桜島':'Universal City / Sakurajima','桜島':'Sakurajima','加茂':'Kamo','奈良':'Nara','王寺':'Oji','関西空港':'Kansai Airport','和歌山':'Wakayama','鳳':'Otori','日根野':'Hineno','亀岡':'Kameoka','園部':'Sonobe','久宝寺':'Kyuhoji','広島':'Hiroshima','岩国':'Iwakuni','西条':'Saijo','糸崎':'Itozaki','城崎温泉':'Kinosaki-Onsen','福知山':'Fukuchiyama','白浜':'Shirahama','新宮':'Shingu','紀伊勝浦':'Kii-Katsuura','出雲市':'Izumoshi','高松':'Takamatsu','岡山':'Okayama','倉吉':'Kurayoshi','鳥取':'Tottori','博多':'Hakata','小倉':'Kokura','新下関':'Shin-Shimonoseki','鹿児島中央':'Kagoshima-Chuo','熊本':'Kumamoto','富山':'Toyama',
    '賢島':'Kashikojima','鳥羽':'Toba','宇治山田':'Ujiyamada','伊勢市':'Iseshi','近鉄奈良':'Kintetsu-Nara','橿原神宮前':'Kashiharajingu-mae','吉野':'Yoshino','大阪阿部野橋':'Osaka-Abenobashi','五十鈴川':'Isuzugawa','青山町':'Aoyamacho','名張':'Nabari','高安':'Takayasu','東花園':'Higashi-Hanazono','淀屋橋':'Yodoyabashi','出町柳':'Demachiyanagi','三条':'Sanjo','樟葉':'Kuzuha','枚方市':'Hirakatashi','中之島':'Nakanoshima','宇治':'Uji','中書島':'Chushojima','大阪梅田':'Osaka-Umeda','京都河原町':'Kyoto-Kawaramachi','桂':'Katsura','高槻市':'Takatsuki-shi','北千里':'Kita-Senri','神戸三宮':'Kobe-Sannomiya','西宮北口':'Nishinomiya-Kitaguchi','新開地':'Shinkaichi','雲雀丘花屋敷':'Hibari-gaoka-Hanayashiki','尼崎':'Amagasaki','高速神戸':'Kosoku-Kobe','阪神大阪梅田':'Hanshin Osaka-Umeda','山陽姫路':'Sanyo-Himeji','須磨浦公園':'Sumaura-koen','なんば':'Namba','和歌山市':'Wakayamashi','和歌山港':'Wakayamako','極楽橋':'Gokurakubashi','河内長野':'Kawachinagano','天下茶屋':'Tengachaya','羽倉崎':'Hagurazaki','高石':'Takaishi','飾磨':'Shikama','西代':'Nishidai','箕面萱野':'Minoh-Kayano','なかもず':'Nakamozu','江坂':'Esaka','夢洲':'Yumeshima','長田':'Nagata','学研奈良登美ヶ丘':'Gakken-Nara-Tomigaoka','鞍馬':'Kurama','有馬温泉':'Arima-Onsen','三田':'Sanda',
    '旭川':'Asahikawa','帯広':'Obihiro','釧路':'Kushiro','新千歳空港':'New Chitose Airport','小樽':'Otaru','新横浜':'Shin-Yokohama','名古屋':'Nagoya','三島':'Mishima','静岡':'Shizuoka','浜松':'Hamamatsu','高山':'Takayama','美濃太田':'Mino-Ota','多治見':'Tajimi','中津川':'Nakatsugawa','大垣':'Ogaki','豊橋':'Toyohashi','金山':'Kanayama','亀山':'Kameyama','四日市':'Yokkaichi','飯田':'Iida','中部国際空港':'Central Japan International Airport','名鉄名古屋':'Meitetsu-Nagoya','名鉄岐阜':'Meitetsu-Gifu','新鵜沼':'Shin-Unuma'
  });
  function route(id,label,en,code,color){D.lines[id]={name:label,en,code,color};D.routes[id]={label};}
  const routeRows=[
    ['west-a','琵琶湖・JR京都・JR神戸線','Biwako / JR Kyoto / JR Kobe Line','A','#168aca'],
    ['west-g','JR宝塚線','JR Takarazuka Line','G','#e8b82d'],['west-h','JR東西・学研都市線','JR Tozai / Gakkentoshi Line','H','#da7aa1'],
    ['west-o','大阪環状線','Osaka Loop Line','O','#e74843'],['west-p','JRゆめ咲線','JR Yumesaki Line','P','#387db4'],
    ['west-q','大和路線','Yamatoji Line','Q','#29a582'],['west-s','関西空港線・阪和線','Kansai Airport / Hanwa Line','S','#2f86bb'],
    ['west-r','阪和線・きのくに線','Hanwa / Kinokuni Line','R','#f09a35'],['west-d','奈良線','Nara Line','D','#b9936c'],
    ['west-e','嵯峨野線','Sagano Line','E','#c78cba'],['west-f','おおさか東線','Osaka Higashi Line','F','#8ca9c6'],
    ['west-hiroshima','山陽本線（広島地区）','Sanyo Line (Hiroshima)','R','#dd5151'],
    ['west-hokuriku','北陸本線','Hokuriku Line','B','#77bde1'],['west-san-in','山陰・福知山線','San-in / Fukuchiyama Line','E','#c78cba'],
    ['west-hakubi','伯備線','Hakubi Line','V','#73b86d'],['west-sleeper','山陽・伯備線（寝台）','Sanyo / Hakubi Sleeper','JR','#7287cf'],['west-seto','山陽・瀬戸大橋線（寝台）','Sanyo / Seto-Ohashi Sleeper','JR','#7287cf'],
    ['west-hakuto','山陽・智頭急行・山陰線','Sanyo / Chizu Express / San-in','JR','#b0a0d7'],
    ['west-sanyo-shinkansen','山陽新幹線','Sanyo Shinkansen','新','#5ea7e3'],['west-hokuriku-shinkansen','北陸新幹線','Hokuriku Shinkansen','新','#429acd'],
    ['kt-shima','近鉄｜大阪・山田・鳥羽・志摩線','Kintetsu Osaka / Shima Line','近','#2c6cac'],
    ['kt-meihan','近鉄｜大阪・名古屋線（名阪特急）','Kintetsu Osaka / Nagoya Line','近','#2c6cac'],
    ['kt-kyoto-nara','近鉄｜京都・橿原・奈良線','Kintetsu Kyoto / Nara Line','近','#2c6cac'],
    ['kt-yoshino','近鉄｜南大阪・吉野線','Kintetsu Minami-Osaka / Yoshino Line','近','#2c6cac'],
    ['kt-nara','近鉄｜奈良線','Kintetsu Nara Line','近','#2c6cac'],['kt-osaka','近鉄｜大阪線','Kintetsu Osaka Line','近','#2c6cac'],
    ['kh-main','京阪｜本線・鴨東線','Keihan Main / Oto Line','KH','#39a584'],['kh-uji','京阪｜宇治線','Keihan Uji Line','KH','#39a584'],
    ['hk-kyoto','阪急｜京都線','Hankyu Kyoto Line','HK','#a67eaf'],['hk-kobe','阪急｜神戸線','Hankyu Kobe Line','HK','#83a9d7'],['hk-takarazuka','阪急｜宝塚線','Hankyu Takarazuka Line','HK','#e9b264'],
    ['hs-namba','阪神｜なんば線・近鉄直通','Hanshin Namba Line','HS','#d4a75e'],['hs-main','阪神｜本線','Hanshin Main Line','HS','#5f98cd'],
    ['nk-airport','南海｜本線・空港線','Nankai Main / Airport Line','NK','#4488cc'],['nk-main','南海｜本線','Nankai Main Line','NK','#4488cc'],['nk-koya','南海｜高野線','Nankai Koya Line','NK','#438f61'],
    ['sy-main','山陽電鉄｜本線・阪神直通','Sanyo Electric Railway','SY','#d56058'],
    ['metro-m','Osaka Metro｜御堂筋線','Midosuji Line','M','#df4c53'],['metro-c','Osaka Metro｜中央線','Chuo Line','C','#4aa57b'],
    ['eizan-kurama','叡山電鉄｜鞍馬線','Eizan Kurama Line','E','#8cc069'],['shintetsu-arima','神戸電鉄｜有馬・三田線','Shintetsu Arima / Sanda Line','KB','#de6957'],
    ['hokkaido-shinkansen','北海道・東北新幹線','Hokkaido / Tohoku Shinkansen','新','#a68ac3'],['hokkaido-hakodate','函館本線（札幌・旭川）','Hakodate Line (Sapporo / Asahikawa)','JR','#79ad57'],
    ['hokkaido-hokuto','函館・室蘭・千歳線','Hakodate / Muroran / Chitose Line','JR','#79ad57'],['hokkaido-sekisho','千歳・石勝・根室線','Chitose / Sekisho / Nemuro Line','JR','#79ad57'],
    ['hokkaido-airport','千歳・函館本線（エアポート）','Chitose / Hakodate Line (Airport)','JR','#79ad57'],['hokkaido-liner','函館本線（はこだてライナー）','Hakodate Line (Hakodate Liner)','JR','#a68ac3'],
    ['tokai-shinkansen','東海道新幹線','Tokaido Shinkansen','新','#3f8ac8'],['tokai-takayama','高山本線','Takayama Line','CG','#b9587a'],['tokai-kisei','紀勢本線','Kisei Line','JR','#4bafbe'],
    ['tokai-chuo','中央本線（JR東海）','Chuo Line (JR Central)','CF','#559dcc'],['tokai-tokaido','東海道本線（名古屋地区）','Tokaido Line (Nagoya)','CA','#e58a31'],['tokai-shizuoka','東海道本線（静岡地区）','Tokaido Line (Shizuoka)','CA','#e58a31'],
    ['tokai-kansai','関西本線（名古屋地区）','Kansai Line (Nagoya)','CJ','#54ac91'],['tokai-iida','飯田線','Iida Line','CD','#8bb66e'],
    ['meitetsu-airport','名鉄｜常滑・空港線','Meitetsu Tokoname / Airport Line','名','#47a0ce'],['meitetsu-main','名鉄｜名古屋本線','Meitetsu Nagoya Main Line','名','#dd5452']
  ];
  routeRows.forEach(r=>route(...r));
  function add(id,label,series,name,en,cars,region,category,line,type,dests,extra={}){
    D.vehicles.push(Object.assign({id,label,series,name,en,cars,region,category,line,route:line,kind:category,type,destinations:dests,operator:region==='west'?'jrwest':region==='tokai'?'jrtokai':'jrhokkaido',number:category==='limited'||category==='shinkansen'?'1号':'',accent:category==='commuter'?'#f4f7f2':'#a9cae9',seat:category==='commuter'?'':category==='shinkansen'?'指定席・自由席':'全車指定席',source:region==='west'?'west':region==='tokai'?'tokai315':'hokkaido'},extra));
  }
  // JR West: commuter / regional services.
  add('225-shinkaisoku','225 新快速','225系','新快速','SPECIAL RAPID',12,'west','commuter','west-a','新快速',['姫路','網干','米原','長浜'],{seat:'Aシートは一部列車'});
  add('223-shinkaisoku','223 新快速','223系','新快速','SPECIAL RAPID',8,'west','commuter','west-a','新快速',['姫路','米原','近江今津','長浜']);
  add('321-kyoto','321 JR京都・神户线','321系','JR京都・神戸線','JR KYOTO / KOBE LINE',7,'west','commuter','west-a','普通',['京都','西明石','新三田']);
  add('207-takarazuka','207 JR宝塚线','207系','JR宝塚線','JR TAKARAZUKA LINE',7,'west','commuter','west-g','普通',['新三田','宝塚','大阪']);
  add('207-gakkentoshi','207 学研都市・东西线','207系','学研都市線','GAKKENTOSHI LINE',7,'west','commuter','west-h','普通',['同志社前','木津','新三田','京橋']);
  add('323-loop','323 大阪环状线','323系','大阪環状線','OSAKA LOOP LINE',8,'west','commuter','west-o','普通',['大阪環状線','天王寺','大阪','京橋'],{seat:'3ドア'});
  add('323-yumesaki','323 JR梦咲线','323系','ゆめ咲線','JR YUMESAKI LINE',8,'west','commuter','west-p','普通',['ユニバーサルシティ・桜島','桜島','大阪','天王寺'],{seat:'3ドア'});
  add('221-yamatoji','221 大和路快速','221系','大和路快速','YAMATOJI RAPID',8,'west','commuter','west-q','大和路快速',['奈良','加茂','天王寺','大阪'],{seat:'3ドア'});
  add('223-kanku','223 关空快速','223系2500番台','関空快速','KANSAI AIRPORT RAPID',4,'west','commuter','west-s','関空快速',['関西空港','大阪','天王寺'],{seat:'日根野で分割する列車あり'});
  add('225-kishuji','225 纪州路快速','225系5000番台','紀州路快速','KISHUJI RAPID',4,'west','commuter','west-r','紀州路快速',['和歌山','大阪','天王寺']);
  add('205-nara','205 奈良线','205系1000番台','奈良線','NARA LINE',4,'west','commuter','west-d','普通',['奈良','京都','城陽'],{seat:'4ドア'});
  D.destinations['城陽']='Joyo';
  add('221-sagano','221 嵯峨野线','221系','嵯峨野線','SAGANO LINE',4,'west','commuter','west-e','普通',['園部','亀岡','京都'],{seat:'3ドア'});
  add('221-osakahigashi','221 大阪东线','221系','おおさか東線','OSAKA HIGASHI LINE',6,'west','commuter','west-f','普通',['久宝寺','大阪','新大阪'],{seat:'3ドア'});
  add('227-hiroshima','227 广岛地区','227系0番台','山陽本線','SANYO LINE',3,'west','commuter','west-hiroshima','普通',['岩国','広島','西条','糸崎'],{seat:'3ドア'});
  // JR West: named express services.
  add('683-thunderbird','683 雷鸟 Thunderbird','683系','サンダーバード','THUNDERBIRD',9,'west','limited','west-hokuriku','特急',['敦賀','大阪'],{accent:'#9bc8ea'});
  add('281-haruka','281 遥 Haruka','281系','はるか','HARUKA',6,'west','limited','west-s','特急',['関西空港','京都','野洲'],{source:'haruka',accent:'#bbaff0'});
  D.destinations['野洲']='Yasu';
  add('287-kuroshio','287 黑潮 Kuroshio','287系','くろしお','KUROSHIO',6,'west','limited','west-r','特急',['白浜','新宮','京都','新大阪'],{accent:'#97d2df'});
  add('289-kounotori','289 白鹳 Kounotori','289系','こうのとり','KOUNOTORI',7,'west','limited','west-san-in','特急',['城崎温泉','福知山','新大阪'],{accent:'#e3acb6'});
  add('287-kinosaki','287 城崎 Kinosaki','287系','きのさき','KINOSAKI',4,'west','limited','west-san-in','特急',['城崎温泉','京都','福知山'],{accent:'#e3acb6'});
  add('273-yakumo','273 八云 Yakumo','273系','やくも','YAKUMO',4,'west','limited','west-hakubi','特急',['出雲市','岡山'],{source:'yakumo',accent:'#d5ad82'});
  add('285-sunrise-izumo','285 Sunrise 出云','285系','サンライズ出雲','SUNRISE IZUMO',7,'west','limited','west-sleeper','寝台特急',['出雲市','東京'],{seat:'寝台車',accent:'#e9c490'});
  add('285-sunrise-seto','285 Sunrise 濑户','285系','サンライズ瀬戸','SUNRISE SETO',7,'west','limited','west-seto','寝台特急',['高松','東京'],{seat:'寝台車',accent:'#e9c490'});
  // Sanyo and Hokuriku Shinkansen. Tokaido services appear only in Tokai.
  add('500-kodama','500 回声 Kodama','500系','こだま','KODAMA',8,'west','shinkansen','west-sanyo-shinkansen','新幹線',['博多','新大阪','岡山','広島'],{source:'kodama',accent:'#a0d9b1'});
  add('700-railstar','700 光 Rail Star','700系7000番台','ひかりレールスター','HIKARI RAIL STAR',8,'west','shinkansen','west-sanyo-shinkansen','新幹線',['博多','新大阪','岡山'],{source:'railstar',accent:'#f4cf73'});
  add('n700-sakura','N700 樱 Sakura','N700系7000・8000番台','さくら','SAKURA',8,'west','shinkansen','west-sanyo-shinkansen','新幹線',['鹿児島中央','熊本','新大阪','博多'],{source:'west',accent:'#f0a9c2'});
  add('n700-mizuho','N700 瑞穗 Mizuho','N700系7000・8000番台','みずほ','MIZUHO',8,'west','shinkansen','west-sanyo-shinkansen','新幹線',['鹿児島中央','新大阪','熊本'],{source:'west',accent:'#f3b36b'});
  add('w7-kagayaki','W7 光辉 Kagayaki','W7系','かがやき','KAGAYAKI',12,'west','shinkansen','west-hokuriku-shinkansen','新幹線',['敦賀','東京','金沢'],{seat:'全車指定席',accent:'#bba5df'});
  add('w7-tsurugi','W7 剑 Tsurugi','W7系','つるぎ','TSURUGI',12,'west','shinkansen','west-hokuriku-shinkansen','新幹線',['敦賀','富山','金沢'],{accent:'#a5d0a3'});
  // Kintetsu: all private-railway services are in the private category.
  function privateTrain(id,label,series,name,en,cars,line,type,dests,operator,extra={}){add(id,label,series,name,en,cars,'west','private',line,type,dests,Object.assign({operator,source:operator,accent:'#f0eee7',number:'',seat:''},extra));}
  privateTrain('kt50000-shimakaze','50000 岛风','近鉄50000系','しまかぜ','SHIMAKAZE',6,'kt-shima','特急',['賢島','大阪難波','京都','近鉄名古屋'],'kintetsu',{accent:'#b8dff0',seat:'全席指定',number:'1列車'});
  privateTrain('kt23000-iseshima','23000 伊势志摩 Liner','近鉄23000系','伊勢志摩ライナー','ISE-SHIMA LINER',6,'kt-shima','特急',['賢島','鳥羽','大阪難波','近鉄名古屋'],'kintetsu',{accent:'#f0d77f',seat:'全席指定'});
  privateTrain('kt30000-vista','30000 Vista EX','近鉄30000系','ビスタEX','VISTA EX',4,'kt-shima','特急',['賢島','鳥羽','宇治山田','大阪上本町'],'kintetsu',{accent:'#f0d19a',seat:'全席指定'});
  privateTrain('kt22600-ace','22600 Ace','近鉄22600系','近鉄特急','KINTETSU LIMITED EXPRESS',4,'kt-shima','特急',['賢島','宇治山田','大阪難波','近鉄名古屋'],'kintetsu',{seat:'全席指定'});
  privateTrain('kt21000-urban','21000 Urban Liner Plus','近鉄21000系','アーバンライナー','URBAN LINER PLUS',6,'kt-meihan','特急',['近鉄名古屋','大阪難波'],'kintetsu',{seat:'全席指定',accent:'#e8d7b4'});
  privateTrain('kt21020-urban','21020 Urban Liner Next','近鉄21020系','アーバンライナー','URBAN LINER NEXT',6,'kt-meihan','特急',['近鉄名古屋','大阪難波'],'kintetsu',{seat:'全席指定',accent:'#e8d7b4'});
  privateTrain('kt19200-aoniyoshi','19200 青丹吉','近鉄19200系','あをによし','AONIYOSHI',4,'kt-kyoto-nara','特急',['京都','大阪難波','近鉄奈良'],'kintetsu',{source:'aoniyoshi',accent:'#e6c58b',seat:'全席指定'});
  privateTrain('kt16200-symphony','16200 青之交响曲','近鉄16200系','青の交響曲','BLUE SYMPHONY',3,'kt-yoshino','特急',['吉野','大阪阿部野橋'],'kintetsu',{accent:'#b4ceec',seat:'全席指定'});
  privateTrain('kt26000-sakura','26000 樱 Liner','近鉄26000系','さくらライナー','SAKURA LINER',4,'kt-yoshino','特急',['吉野','大阪阿部野橋'],'kintetsu',{accent:'#f1c3d3',seat:'全席指定'});
  privateTrain('kt5800-nara','5800 奈良线 L/C','近鉄5800系','奈良線','NARA LINE',6,'kt-nara','快速急行',['近鉄奈良','大阪難波','神戸三宮'],'kintetsu');
  privateTrain('kt9820-nara','9820 Series 21','近鉄9820系','奈良線','NARA LINE',6,'kt-nara','普通',['近鉄奈良','大阪難波','東花園'],'kintetsu');
  privateTrain('kt5820-osaka','5820 大阪线 L/C','近鉄5820系','大阪線','OSAKA LINE',6,'kt-osaka','急行',['青山町','名張','大阪上本町','五十鈴川'],'kintetsu');
  // Keihan, Hankyu, Hanshin, Nankai and other Kansai railways.
  privateTrain('kh8000','8000 京阪特急','京阪8000系','京阪特急','KEIHAN LIMITED EXPRESS',8,'kh-main','特急',['出町柳','淀屋橋'],'keihan',{seat:'プレミアムカーあり',accent:'#f2c58f'});
  privateTrain('kh3000','3000 京阪快速急行','京阪3000系','京阪線','KEIHAN LINE',8,'kh-main','快速急行',['出町柳','淀屋橋','中之島'],'keihan',{seat:'プレミアムカーあり'});
  privateTrain('kh13000-main','13000 京阪本线','京阪13000系','京阪線','KEIHAN LINE',7,'kh-main','普通',['出町柳','淀屋橋','樟葉','枚方市'],'keihan');
  privateTrain('kh13000-uji','13000 宇治线','京阪13000系','宇治線','UJI LINE',4,'kh-uji','普通',['宇治','中書島'],'keihan');
  privateTrain('hk9300','9300 阪急京都线','阪急9300系','京都線','KYOTO LINE',8,'hk-kyoto','特急',['京都河原町','大阪梅田'],'hankyu');
  privateTrain('hk2300','2300 阪急 PRiVACE','阪急2300系','京都線','KYOTO LINE',8,'hk-kyoto','特急',['京都河原町','大阪梅田'],'hankyu',{seat:'PRiVACEあり'});
  privateTrain('hk1300','1300 阪急京都线','阪急1300系','京都線','KYOTO LINE',8,'hk-kyoto','準急',['京都河原町','大阪梅田','高槻市'],'hankyu');
  privateTrain('hk1000-kobe','1000 阪急神户线','阪急1000系','神戸線','KOBE LINE',8,'hk-kobe','特急',['神戸三宮','大阪梅田','新開地'],'hankyu');
  privateTrain('hk9000-takarazuka','9000 阪急宝塚线','阪急9000系','宝塚線','TAKARAZUKA LINE',8,'hk-takarazuka','急行',['宝塚','大阪梅田','雲雀丘花屋敷'],'hankyu');
  privateTrain('hk7000-garaku','7000 京 TRAIN 雅洛','阪急7000系','京とれいん雅洛','KYOTRAIN GARAKU',6,'hk-kyoto','快速特急',['京都河原町','大阪梅田'],'hankyu',{accent:'#e8cf9d',seat:'観光列車'});
  privateTrain('hs1000-namba','1000 阪神难波线','阪神1000系','阪神なんば線','HANSHIN NAMBA LINE',6,'hs-namba','快速急行',['近鉄奈良','神戸三宮','尼崎'],'hanshin');
  privateTrain('hs8000','8000 阪神直通特急','阪神8000系','阪神線','HANSHIN LINE',6,'hs-main','直通特急',['山陽姫路','大阪梅田','高速神戸'],'hanshin');
  privateTrain('hs5700','5700 阪神普通','阪神5700系','阪神線','HANSHIN LINE',4,'hs-main','普通',['高速神戸','大阪梅田','尼崎'],'hanshin');
  privateTrain('nk50000-rapit','50000 Rapi:t','南海50000系','ラピート','RAPI:T',6,'nk-airport','特急',['関西空港','なんば'],'nankai',{accent:'#bbd8fa',seat:'全席指定',number:'1号'});
  privateTrain('nk12000-southern','12000 Southern','南海12000系＋一般車','サザン','SOUTHERN',8,'nk-main','特急',['和歌山市','和歌山港','なんば'],'nankai',{accent:'#b4dded',seat:'一部指定席',number:'1号'});
  privateTrain('nk30000-koya','30000 高野 Koya','南海30000系','こうや','KOYA',4,'nk-koya','特急',['極楽橋','なんば'],'nankai',{seat:'全席指定',number:'1号'});
  privateTrain('nk8300-airport','8300 南海机场急行','南海8300系','南海空港線','NANKAI AIRPORT LINE',6,'nk-airport','空港急行',['関西空港','なんば'],'nankai');
  privateTrain('nk8300-koya','8300 南海高野线','南海8300系','高野線','KOYA LINE',6,'nk-koya','普通',['河内長野','なんば','橋本'],'nankai');
  privateTrain('sy5000','5000 山阳直通特急','山陽5000系','山陽電車','SANYO ELECTRIC RAILWAY',6,'sy-main','直通特急',['阪神大阪梅田','山陽姫路'],'sanyo');
  privateTrain('sy6000','6000 山阳普通','山陽6000系','山陽電車','SANYO ELECTRIC RAILWAY',3,'sy-main','普通',['山陽姫路','西代','飾磨'],'sanyo');
  privateTrain('metro30000-m','30000 御堂筋线','Osaka Metro 30000系','御堂筋線','MIDOSUJI LINE',10,'metro-m','普通',['箕面萱野','なかもず','江坂'],'metro');
  privateTrain('metro400-c','400 中央线','Osaka Metro 400系','中央線','CHUO LINE',6,'metro-c','普通',['夢洲','学研奈良登美ヶ丘','長田'],'metro');
  privateTrain('eizan900','900 叡山 Kirara','叡山900系','きらら','KIRARA',2,'eizan-kurama','普通',['鞍馬','出町柳'],'eizan',{accent:'#d5e5b3'});
  privateTrain('shintetsu6500','6500 神户电铁','神戸電鉄6500系','有馬・三田線','ARIMA / SANDA LINE',3,'shintetsu-arima','普通',['有馬温泉','三田','新開地'],'shintetsu');
  // Hokkaido.
  add('h5-hayabusa','H5 隼 Hayabusa','H5系','はやぶさ','HAYABUSA',10,'hokkaido','shinkansen','hokkaido-shinkansen','新幹線',['新函館北斗','東京','新青森'],{source:'h5',seat:'全車指定席',accent:'#bfa5d8'});
  add('h5-hayate','H5 疾风 Hayate','H5系','はやて','HAYATE',10,'hokkaido','shinkansen','hokkaido-shinkansen','新幹線',['新函館北斗','盛岡','新青森'],{source:'h5',seat:'全車指定席',accent:'#bfa5d8'});
  add('789-lilac','789 丁香 Lilac','789系0番台','ライラック','LILAC',6,'hokkaido','limited','hokkaido-hakodate','特急',['旭川','札幌'],{source:'lilac',accent:'#bba9df'});
  add('789-kamui','789 神威 Kamui','789系1000番台','カムイ','KAMUI',5,'hokkaido','limited','hokkaido-hakodate','特急',['旭川','札幌'],{accent:'#a8cae4'});
  add('261-hokuto','261 北斗 Hokuto','キハ261系1000番台','北斗','HOKUTO',5,'hokkaido','limited','hokkaido-hokuto','特急',['函館','札幌'],{source:'hokuto',accent:'#a4c7df'});
  add('261-ozora','261 大空 Ozora','キハ261系1000番台','おおぞら','OZORA',5,'hokkaido','limited','hokkaido-sekisho','特急',['釧路','札幌'],{accent:'#9acbe5'});
  add('261-tokachi','261 十胜 Tokachi','キハ261系1000番台','とかち','TOKACHI',5,'hokkaido','limited','hokkaido-sekisho','特急',['帯広','札幌'],{accent:'#b0d5b6'});
  add('733-airport','733 快速 Airport','733系3000番台','エアポート','AIRPORT',6,'hokkaido','commuter','hokkaido-airport','快速',['新千歳空港','小樽','札幌'],{source:'airport',number:'101号',seat:'4号車 uシート'});
  add('733-hakodate','733 函馆 Liner','733系1000番台','はこだてライナー','HAKODATE LINER',3,'hokkaido','commuter','hokkaido-liner','快速',['新函館北斗','函館'],{source:'h5',seat:'3ドア'});
  // JR Central: Tokaido Shinkansen, regional and limited-express trains.
  for(const series of ['N700S','N700A'])for(const [name,en,accent] of [['のぞみ','NOZOMI','#f2ce6e'],['ひかり','HIKARI','#f19a83'],['こだま','KODAMA','#8dc6e8']]){
    const dests=name==='のぞみ'?['博多','新大阪','東京','広島']:name==='ひかり'?['岡山','新大阪','東京']:['新大阪','名古屋','東京','三島'];
    add(series.toLowerCase()+'-'+en.toLowerCase(),series+' '+name,series,name,en,16,'tokai','shinkansen','tokai-shinkansen','新幹線',dests,{source:'n700',accent});
  }
  add('hc85-hida','HC85 飞驒 Hida','HC85系','ひだ','HIDA',4,'tokai','limited','tokai-takayama','特急',['高山','富山','名古屋','大阪'],{source:'tokaiLimited',seat:'指定席・自由席',accent:'#e6b28f'});
  add('hc85-nanki','HC85 南纪 Nanki','HC85系','南紀','NANKI',2,'tokai','limited','tokai-kisei','特急',['紀伊勝浦','新宮','名古屋'],{source:'tokaiLimited',seat:'指定席・自由席',accent:'#e6b28f'});
  add('383-shinano','383 信浓 Shinano','383系','しなの','SHINANO',6,'tokai','limited','tokai-chuo','特急',['長野','名古屋','松本'],{source:'tokaiLimited',seat:'指定席・自由席',accent:'#b3d4a2'});
  add('315-chuo','315 中央本线','315系0番台','中央本線','CHUO LINE',8,'tokai','commuter','tokai-chuo','普通',['中津川','名古屋','多治見'],{seat:'4ドア'});
  add('315-tokaido','315 东海道名古屋地区','315系3000番台','東海道本線','TOKAIDO LINE',4,'tokai','commuter','tokai-tokaido','普通',['豊橋','大垣','名古屋'],{seat:'4ドア'});
  add('315-shizuoka','315 东海道静冈地区','315系3000番台','東海道本線','TOKAIDO LINE',4,'tokai','commuter','tokai-shizuoka','普通',['熱海','静岡','浜松','沼津'],{seat:'4ドア'});
  add('315-kansai','315 关西本线名古屋地区','315系3000番台','関西本線','KANSAI LINE',4,'tokai','commuter','tokai-kansai','普通',['亀山','名古屋','四日市'],{seat:'ワンマン'});
  add('313-tokaido','313 东海道新快速','313系5000番台','東海道本線','TOKAIDO LINE',6,'tokai','commuter','tokai-tokaido','新快速',['豊橋','大垣','浜松','名古屋'],{source:'tokai313',seat:'転換クロスシート'});
  add('meitetsu2000','2000 名铁 μSKY','名鉄2000系','ミュースカイ','MU-SKY',4,'tokai','private','meitetsu-airport','ミュースカイ',['中部国際空港','名鉄名古屋','新鵜沼'],{operator:'meitetsu',source:'meitetsu',seat:'全車特別車',number:'1号',accent:'#afd9ec'});
  add('meitetsu2200','2200 名铁特急','名鉄2200系','名鉄特急','MEITETSU LIMITED EXPRESS',6,'tokai','private','meitetsu-main','特急',['中部国際空港','豊橋','名鉄岐阜'],{operator:'meitetsu',source:'meitetsu',seat:'一部特別車',number:'',accent:'#f0c1bb'});
  Object.assign(D.typeEnglish,{'新快速':'Special Rapid','大和路快速':'Yamatoji Rapid','関空快速':'Airport Rapid','紀州路快速':'Kishuji Rapid','快速急行':'Rapid Express','快速特急':'Rapid Ltd. Exp.','準特急':'Semi Ltd. Exp.','準急':'Semi Express','直通特急':'Direct Ltd. Exp.','空港急行':'Airport Express','ミュースカイ':'MU-SKY'});
  for(const type of Object.keys(D.typeEnglish))if(!D.types.includes(type))D.types.push(type);
  D.matchingVehicles=(region,category,route)=>D.vehicles.filter(v=>(!region||v.region===region)&&(!category||v.category===category)&&(!route||v.route===route));
  D.availableCategories=region=>D.categories.filter(c=>D.matchingVehicles(region,c.id).length);
  D.availableRoutes=(region,category)=>[...new Set(D.matchingVehicles(region,category).map(v=>v.route))].map(id=>({id,label:D.routes[id].label}));
  D.styles=[['auto','跟随车辆 / 运营商'],['jreast','JR 东日本'],['jrwest','JR 西日本'],['jrtokai','JR 东海'],['jrhokkaido','JR 北海道'],['kintetsu','近铁'],['keihan','京阪'],['hankyu','阪急'],['hanshin','阪神'],['nankai','南海'],['sanyo','山阳电铁'],['metro','Osaka Metro'],['eizan','叡山电铁'],['shintetsu','神户电铁'],['meitetsu','名铁']];
})();
