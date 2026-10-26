(() => {
  'use strict';
  const data=window.RAIL_NSCALE_DATA,byVehicle=new Map(),byProduct=new Map();
  for(const p of data.products){byProduct.set(p.id,p);for(const id of p.vehicleIds){if(!byVehicle.has(id))byVehicle.set(id,[]);byVehicle.get(id).push(p);}}
  const makers=new Map(data.makers.map(m=>[m.id,m]));
  const kinds={set:'套装',basic:'基本套装',addon:'增结套装',single:'单车'};
  function lookup(vehicleId){
    const products=[...(byVehicle.get(vehicleId)||[])].sort((a,b)=>(a.match==='exact'?0:1)-(b.match==='exact'?0:1)||data.makers.findIndex(m=>m.id===a.maker)-data.makers.findIndex(m=>m.id===b.maker)||a.sku.localeCompare(b.sku,'en',{numeric:true}));
    return {products,groups:data.makers.map(m=>({maker:m,products:products.filter(p=>p.maker===m.id)})).filter(g=>g.products.length),note:data.coverage[vehicleId]?.note||'此车型尚未收录已核对的 N 比例品号。'};
  }
  const description=p=>(p.cars?`${p.cars} 节`:'节数见厂家')+' · '+(kinds[p.setKind]||'套装');
  window.RAIL_NSCALE_MODEL={lookup,description,makers,byProduct};
})();
