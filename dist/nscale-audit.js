(() => {
  'use strict';
  const D=window.RAIL_DATA,N=window.RAIL_NSCALE_MODEL,U=window.RAIL_NSCALE_UI,$=id=>document.getElementById(id),root=$('vehicles'),search=$('search'),pageSize=24;
  const keys=['region','category','route','maker','format','status'],controls=Object.fromEntries(keys.map(k=>[k,$('filter-'+k)]));
  const params=new URLSearchParams(location.search),filters=Object.fromEntries(['q','vehicle',...keys].map(k=>[k,params.get(k)||'']));
  if(!D.vehicles.some(v=>v.id===filters.vehicle))filters.vehicle='';
  let page=Math.max(1,Number.parseInt(params.get('page'),10)||1),totalPages=1,results=[];
  const e=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
  const option=(value,label)=>{const el=e('option','',label);el.value=value;return el;};
  function options(control,list,label){const prior=control.value;control.replaceChildren(option('',label));list.forEach(item=>control.append(option(item.id,item.label)));control.value=prior;if(control.selectedIndex<0)control.value='';}
  options(controls.region,D.regions,'全部地区');options(controls.maker,[...N.makers.values()].filter(m=>window.RAIL_NSCALE_DATA.products.some(p=>p.maker===m.id)),'全部厂家');
  function cascade(){
    options(controls.category,filters.region?D.availableCategories(filters.region):D.categories,'全部类型');controls.category.value=filters.category;if(controls.category.selectedIndex<0)controls.category.value='';filters.category=controls.category.value;
    const routes=D.regions.filter(r=>!filters.region||r.id===filters.region).flatMap(r=>D.availableCategories(r.id).filter(c=>!filters.category||c.id===filters.category).flatMap(c=>D.availableRoutes(r.id,c.id)));
    options(controls.route,[...new Map(routes.map(r=>[r.id,r])).values()],'全部线路');controls.route.value=filters.route;if(controls.route.selectedIndex<0)controls.route.value='';filters.route=controls.route.value;
  }
  for(const k of ['region','maker','format','status']){controls[k].value=filters[k];if(controls[k].selectedIndex<0)controls[k].value='';filters[k]=controls[k].value;}
  cascade();search.value=filters.q;
  const stats=N.summary();for(const [value,label]of [[stats.products,'项产品资料'],[stats.covered+'/'+stats.presets,'个预设已覆盖'],[stats.makers,'家模型厂商']]){const el=e('div','catalogue-stat');el.append(e('strong','',String(value)),e('span','',label));$('catalogue-stats').append(el);}
  $('intro').textContent='资料核对：'+window.RAIL_NSCALE_DATA.checkedAt+' · 按车辆番台、涂装与厂家资料建立对应。';
  function address(){const query=new URLSearchParams();for(const k of ['q','vehicle',...keys])if(filters[k])query.set(k,filters[k]);if(page>1)query.set('page',String(page));history.replaceState(null,'',location.pathname+(query.toString()?'?'+query.toString():''));}
  function render(){
    results=N.search(filters);totalPages=Math.max(1,Math.ceil(results.length/pageSize));page=Math.min(Math.max(1,page),totalPages);root.replaceChildren();address();$('clear-query').hidden=!search.value;
    const unique=new Set(results.flatMap(r=>r.products.map(p=>p.id)));$('count').textContent=results.length+' / '+D.vehicles.length+' 个预设 · '+unique.size+' 项产品';
    const scoped=D.vehicles.find(v=>v.id===filters.vehicle);$('vehicle-scope').hidden=!scoped;if(scoped)$('vehicle-scope-name').textContent='当前车型：'+scoped.label;
    if(!results.length){const empty=e('div','catalogue-empty');empty.append(e('h3','','没有符合条件的车型'),e('p','','可以减少筛选条件，或换用系列名、日文车名与品号检索。'));root.append(empty);}
    let previousRegion='';
    for(const found of results.slice((page-1)*pageSize,page*pageSize)){
      const v=found.vehicle,line=D.lines[v.line];
      if(v.region!==previousRegion){root.append(e('h3','catalogue-region',D.regions.find(r=>r.id===v.region).label));previousRegion=v.region;}
      const el=e('details','vehicle'),s=e('summary','vehicle-summary'),badge=e('span','catalogue-route',line.code);badge.style.setProperty('--route-color',line.color);
      const label=e('span','vehicle-summary-label');label.append(e('strong','',v.label),e('small','',v.series+' · '+D.routes[v.route].label));
      const meta=e('span','vehicle-summary-meta'),names=found.groups.slice(0,2).map(g=>g.maker.id==='MICROACE'?'MA':g.maker.id==='POPONDETTA'?'PP':g.maker.label);
      meta.append(e('span','vehicle-makers',names.join(' / ')+(found.groups.length>2?' +'+(found.groups.length-2):'')),e('span','vehicle-availability '+found.status,found.status==='unverified'?'待核实':found.status==='variant'?'仅版本参考':found.products.length+' 项产品'));
      s.append(badge,label,meta,e('span','vehicle-chevron','⌄'));el.append(s);let ready=false;
      el.addEventListener('toggle',()=>{if(el.open&&!ready){const body=e('div','nscale-content');U.content(body,v,{showFilters:false,hideIdentity:true,showDirectoryLink:false,filters:{...filters}});el.append(body);ready=true;}});
      root.append(el);
    }
    $('pagination').hidden=!results.length;$('previous-page').disabled=page===1;$('next-page').disabled=page===totalPages;$('page-count').textContent=page+' / '+totalPages+' 页';
  }
  function change(){for(const k of keys)filters[k]=controls[k].value;filters.q=search.value.slice(0,120);cascade();page=1;render();}
  for(const control of Object.values(controls))control.addEventListener('change',change);search.addEventListener('input',change);
  $('clear-query').addEventListener('click',()=>{search.value='';change();search.focus();});
  $('clear-filters').addEventListener('click',()=>{search.value='';for(const k of keys){controls[k].value='';filters[k]='';}filters.q='';cascade();page=1;render();});
  $('clear-vehicle').addEventListener('click',()=>{filters.vehicle='';page=1;render();});
  for(const [id,step]of [['previous-page',-1],['next-page',1]])$(id).addEventListener('click',()=>{page+=step;render();$('results-heading').scrollIntoView({block:'start'});});
  $('copy-search').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);$('copy-status').textContent='链接已复制';}catch(_){$('copy-status').textContent='可从地址栏复制当前链接';}});
  render();
})();
