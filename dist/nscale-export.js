(() => {
  'use strict';
  const N=window.RAIL_NSCALE_MODEL;
  function rows(results){
    const products=new Map();
    for(const found of results)for(const product of found.products){
      if(!products.has(product.id))products.set(product.id,{product,vehicles:new Set()});
      products.get(product.id).vehicles.add(found.vehicle.label);
    }
    const header=['厂家','品号或JAN','品号状态','产品名','盒内节数','套装类型','模型形态','对应情况','对应预设','厂家明确最小半径mm','官方曲线说明','产品备注','资料核对日期','已核实的预告信息','官方资料'];
    const records=[...products.values()].map(({product:p,vehicles})=>[
      N.makers.get(p.maker).label,p.codeType==='unlisted'?'':p.sku,
      p.codeType==='unlisted'?'资料未列品号':p.codeType==='JAN'?'JAN':'品号已核对',
      p.title,p.cars??'',({set:'一般套装',basic:'基本套装',addon:'增结套装',single:'单车'})[p.setKind],
      N.formats[N.format(p)],p.match==='exact'?'车型对应':'版本参考',[...vehicles].join(' / '),
      p.minimumRadiusMm??'',p.radiusNote||'',p.note||'',p.checkedAt,p.releaseStatus==='announced'?'预告产品'+(p.announcedAt?' · 公告 '+p.announcedAt:''):'',[p.source,p.codeSource].filter(Boolean).join(' | ')
    ]);
    return [header,...records];
  }
  function csv(results){
    const cell=value=>{let text=String(value??'');if(/^[\s]*[=+\-@]/.test(text))text="'"+text;return '"'+text.replace(/"/g,'""')+'"';};
    return '\uFEFF'+rows(results).map(row=>row.map(cell).join(',')).join('\r\n')+'\r\n';
  }
  window.RAIL_NSCALE_EXPORT={rows,csv};
})();
