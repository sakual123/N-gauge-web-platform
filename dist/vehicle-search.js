(() => {
  'use strict';
  const D=window.RAIL_DATA;
  const fold=value=>String(value||'').normalize('NFKC').toLowerCase().replace(/[ぁ-ゖ]/g,c=>String.fromCharCode(c.charCodeAt(0)+96));
  const compact=value=>fold(value).replace(/[\s・._‐‑‒–—−'’\-]/g,'');
  const entries=D.vehicles.map((vehicle,index)=>{
    const region=D.regions.find(r=>r.id===vehicle.region),category=D.categories.find(c=>c.id===vehicle.category);
    return {vehicle,index,series:compact(vehicle.series.replace(/系.*$/,'')),label:compact(vehicle.label),text:compact([vehicle.label,vehicle.series,vehicle.series.replace(/系|番台/g,''),vehicle.name,vehicle.en,D.routes[vehicle.route]?.label,D.lines[vehicle.line]?.name,region?.label,category?.label].join(' '))};
  });
  function search(query){
    const terms=fold(query).replace(/([a-z0-9])([\u3040-\u30ff\u3400-\u9fff])/g,'$1 $2').replace(/([\u3040-\u30ff\u3400-\u9fff])([a-z0-9])/g,'$1 $2').trim().split(/\s+/).map(compact).filter(Boolean);if(!terms.length)return [];
    return entries.filter(e=>terms.every(term=>e.text.includes(term))).map(e=>({...e,score:terms.reduce((s,t)=>s+(e.series===t?20:0)+(e.label===t?30:0)+(e.label.startsWith(t)?5:0),0)})).sort((a,b)=>b.score-a.score||a.index-b.index).map(e=>e.vehicle);
  }
  window.RAIL_VEHICLE_SEARCH={search,fold};
})();
