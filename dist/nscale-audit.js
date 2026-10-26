(() => {
  'use strict';const D=window.RAIL_DATA,N=window.RAIL_NSCALE_MODEL,U=window.RAIL_NSCALE_UI,root=document.getElementById('vehicles'),search=document.getElementById('search');
  const text=value=>String(value||'').normalize('NFKC').toLocaleLowerCase();
  document.getElementById('intro').textContent=`收录 ${window.RAIL_NSCALE_DATA.products.length} 项已核对产品；按车辆预设分别列出。核对日：${window.RAIL_NSCALE_DATA.checkedAt}。资料可能涉及历史版本，购买前请按品号核对实物及包装。`;
  function render(){root.replaceChildren();const query=text(search.value).trim(),vehicles=D.vehicles.filter(v=>{const found=N.lookup(v.id);return text([v.label,v.series,v.name,D.lines[v.line]?.name,...found.products.flatMap(p=>[p.sku,p.title,N.makers.get(p.maker).label])].join(' ')).includes(query);});document.getElementById('count').textContent=`${vehicles.length} / ${D.vehicles.length} 个车辆预设`;
    for(const v of vehicles){const found=N.lookup(v.id),el=document.createElement('details'),s=document.createElement('summary');el.className='vehicle';s.textContent=v.label+' · '+(found.products.length?found.products.length+' 项产品':'暂未收录核对品号');el.append(s);let ready=false;el.addEventListener('toggle',()=>{if(el.open&&!ready){const body=document.createElement('div');body.className='nscale-content';U.content(body,v);const self=body.querySelector('a[href="nscale-models.html"]');self?.remove();el.append(body);ready=true;}});root.append(el);}
  }search.addEventListener('input',render);render();
})();
