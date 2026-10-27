(() => {
  'use strict';
  const data=window.RAIL_NSCALE_DATA,D=window.RAIL_DATA,byVehicle=new Map(),byProduct=new Map(),makers=new Map(data.makers.map(m=>[m.id,m]));
  const makerOrder=new Map(data.makers.map((m,i)=>[m.id,i]));
  const kinds={set:'套装',basic:'基本套装',addon:'增结套装',single:'单车'},formats={ready:'完成品',static:'静态模型',kit:'制作套件'};
  const normalize=value=>String(value||'').normalize('NFKC').toLocaleLowerCase().replace(/[‐‑‒–—−]/g,'-');
  const compact=value=>normalize(value).replace(/[\s・._-]/g,'');
  const format=p=>p.format||(/静态|展示模型|鉄道コレクション|铁コレ/.test(p.title+' '+p.note)?'static':/紙製|纸制|树脂.*套件|ペーパーキット|車体キット/.test(p.title+' '+p.note)?'kit':'ready');
  const status=products=>products.some(p=>p.match==='exact')?'verified':products.length?'variant':'unverified';
  for(const p of data.products){byProduct.set(p.id,p);for(const id of p.vehicleIds){if(!byVehicle.has(id))byVehicle.set(id,[]);byVehicle.get(id).push(p);}}
  for(const list of byVehicle.values())list.sort((a,b)=>(a.match==='exact'?0:1)-(b.match==='exact'?0:1)||makerOrder.get(a.maker)-makerOrder.get(b.maker)||({set:0,basic:1,addon:2,single:3}[a.setKind]-{set:0,basic:1,addon:2,single:3}[b.setKind])||a.sku.localeCompare(b.sku,'en',{numeric:true}));
  function lookup(vehicleId,filters={}){
    const all=byVehicle.get(vehicleId)||[],products=all.filter(p=>(!filters.maker||p.maker===filters.maker)&&(!filters.format||format(p)===filters.format)&&(!filters.match||p.match===filters.match));
    return {products,total:all.length,status:status(products),groups:data.makers.map(m=>({maker:m,products:products.filter(p=>p.maker===m.id)})).filter(g=>g.products.length),note:data.coverage[vehicleId]?.note||'此车型尚未收录已核对的 N 比例品号。'};
  }
  const baseSearch=new Map(),productSearch=new Map();
  for(const v of D.vehicles){const region=D.regions.find(r=>r.id===v.region),category=D.categories.find(c=>c.id===v.category);baseSearch.set(v.id,normalize([v.label,v.series,v.series.replace(/系|番台/g,''),v.name,v.en,D.lines[v.line]?.name,D.routes[v.route]?.label,region?.label,category?.label].join(' ')));}
  for(const p of data.products)productSearch.set(p.id,normalize([p.sku,p.title,p.maker,makers.get(p.maker)?.label].join(' ')));
  const ordered=D.regions.flatMap(region=>D.availableCategories(region.id).flatMap(category=>D.availableRoutes(region.id,category.id).flatMap(route=>D.matchingVehicles(region.id,category.id,route.id))));
  function search(filters={}){
    const tokens=normalize(filters.q).trim().split(/\s+/).filter(Boolean),results=[];
    for(const v of ordered){
      if(filters.vehicle&&v.id!==filters.vehicle||filters.region&&v.region!==filters.region||filters.category&&v.category!==filters.category||filters.route&&v.route!==filters.route)continue;
      let found=lookup(v.id,filters);
      if((filters.maker||filters.format||filters.match)&&!found.products.length)continue;
      const matches=(s,t)=>s.includes(t)||compact(s).includes(compact(t)),productTokens=tokens.filter(t=>!matches(baseSearch.get(v.id),t));
      if(productTokens.length){const products=found.products.filter(p=>productTokens.every(t=>matches(productSearch.get(p.id),t)));if(!products.length)continue;found={...found,products,status:status(products),groups:found.groups.map(g=>({...g,products:g.products.filter(p=>products.includes(p))})).filter(g=>g.products.length)};}
      if(filters.status&&found.status!==filters.status)continue;
      results.push({vehicle:v,...found});
    }return results;
  }
  const description=p=>(p.cars?p.cars+' 节':'节数见厂家')+' · '+(kinds[p.setKind]||'套装');
  const summary=()=>({products:data.products.length,presets:D.vehicles.length,covered:D.vehicles.filter(v=>(byVehicle.get(v.id)||[]).length).length,makers:data.makers.filter(m=>data.products.some(p=>p.maker===m.id)).length});
  window.RAIL_NSCALE_MODEL={lookup,description,makers,byProduct,search,normalize,format,formats,status,summary};
})();
