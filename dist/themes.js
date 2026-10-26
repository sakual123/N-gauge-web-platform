/* Representative station displays; individual stations and equipment differ. */
(() => {
 'use strict';
 const p=(id,label,station,brand,title,en,order,widths,colors)=>({id,label,station,brand,title,en,order:order.split(' '),widths,colors});
 const profiles=[
 p('jreast','JR 东日本','東京','JR EAST','今度の列車','Train Information','type train time destination cars track',[15.0454,29.18288,14.52659,26.58885,7.5227,7.13358],["#30383d","#80b748","#242a2e","#f5f6f3"]),
 p('jrwest','JR 西日本','大阪','JR WEST','列車のご案内','Train Departures','type time destination train cars track',[14.54545,14.02597,27.27273,29.22078,7.79221,7.14286],["#101213","#418cc7","#242a2e","#f5f6f3"]),
 p('jrtokai','JR 东海','名古屋','JR CENTRAL','列車のご案内','Train Departures','type time destination track train cars',[14.69816,15.09186,28.87139,7.21785,26.90289,7.21785],["#442708","#ff9b18","#242a2e","#f5f6f3"]),
 p('jrhokkaido','JR 北海道','札幌','JR HOKKAIDO','列車発車のご案内','Train Departures','type train time destination track cars',[14.47368,26.97368,15.13158,28.28947,7.89474,7.23685],["#16452b","#56c17e","#242a2e","#f5f6f3"]),
 p('jrkyushu','JR 九州','博多','JR KYUSHU','列車発車案内','Departure Information','time type train destination cars track',[14.37908,14.37908,28.75817,27.45098,7.84314,7.18955],["#222326","#d94346","#242a2e","#f5f6f3"]),
 p('jrshikoku','JR 四国','高松','JR SHIKOKU','列車のご案内','Train Information','type train time destination track cars',[14.28571,25.97403,15.58442,27.92208,8.44156,7.7922],["#45413b","#38c7bd","#242a2e","#f5f6f3"]),
 p('kintetsu','近铁','大阪難波','近鉄 KINTETSU','発車のご案内','Departure Information','time type destination train cars track',[13.81579,15.13158,29.60526,26.31579,7.89474,7.23684],["#26313e","#2861b8","#242a2e","#f5f6f3"]),
 p('hankyu','阪急','大阪梅田','阪急 HANKYU','発車のご案内','Train Information','track type destination time train cars',[7.84314,15.03268,28.10458,14.37908,27.45098,7.18954],["#3b222c","#a95c76","#242a2e","#f5f6f3"]),
 p('keihan','京阪','淀屋橋','京阪 KEIHAN','電車のご案内','Train Departures','track time type destination train cars',[7.84314,15.03268,14.37908,28.75817,26.79739,7.18954],["#141d52","#6579dc","#242a2e","#f5f6f3"]),
 p('nankai','南海','なんば','南海 NANKAI','電車のご案内','Train Departures','time type destination track train cars',[13.72549,15.03268,29.41176,7.84314,26.79739,7.18954],["#111c2b","#7eafd6","#242a2e","#f5f6f3"]),
 p('hanshin','阪神','大阪梅田','阪神 HANSHIN','電車のご案内','Train Information','time type destination track train cars',[13.72549,14.37908,29.41176,7.84314,27.45098,7.18955],["#c8cfca","#367ab9","#242a2e","#f5f6f3"]),
 p('tokyometro','东京 Metro','東京','東京メトロ','電車がまいります','Train Information','time type destination cars track train',[14.19355,14.19355,29.03226,7.74194,7.74194,27.09676],["#183542","#40afcd","#242a2e","#f5f6f3"])
 ];
 const byId=new Map(profiles.map(p=>[p.id,p]));
 function resolve(state){let id=state.display.theme||'jreast';if(id==='auto'){const v=window.RAIL_DATA.vehicles.find(v=>v.id===state.rows[0]?.vehicleId);id=({jreast:'jreast',jrwest:'jrwest',jrtokai:'jrtokai',jrhokkaido:'jrhokkaido',jrkyushu:'jrkyushu',kintetsu:'kintetsu',hankyu:'hankyu',keihan:'keihan',nankai:'nankai',hanshin:'hanshin',tokyometro:'tokyometro',toei:'tokyometro'})[v?.operator]||'jreast';}return byId.get(id)||byId.get('jreast');}
 function apply(board,state){const t=resolve(state);board.dataset.theme=t.id;board.setAttribute('aria-label',t.label+'参考风格模型列车信息牌');board.style.setProperty('--theme-areas','"'+t.order.join(' ')+'"');board.style.setProperty('--theme-columns',t.widths.map(n=>n+'%').join(' '));['header','accent','column-bg','column-ink'].forEach((key,i)=>board.style.setProperty('--theme-'+key,t.colors[i]));
  board.querySelector('.jr-mark').textContent=t.brand;const title=board.querySelector('.board-title');title.replaceChildren(document.createTextNode(t.title),Object.assign(document.createElement('small'),{textContent:t.en}));
  const columns=['type','train','time','destination','cars','track'];board.querySelectorAll('.column-head>div').forEach((n,i)=>n.dataset.column=columns[i]);
  const trackHead=board.querySelector('[data-column="track"] .jp');trackHead.textContent=t.id==='hankyu'?'号線':t.id==='jrwest'?'のりば':'番線';board.querySelector('.hero-aside').lastChild.textContent=trackHead.textContent;
 }
 window.RAIL_THEMES={profiles,byId,resolve,apply};
})();
