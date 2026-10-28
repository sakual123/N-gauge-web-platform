(() => {
  'use strict';
  const D=window.RAIL_DATA,N=window.RAIL_NSCALE_MODEL,U=window.RAIL_NSCALE_UI,$=id=>document.getElementById(id),root=$('vehicles'),search=$('search'),pageSize=24;
  const keys=['region','category','route','maker','format','status','setKind','curve'],controls=Object.fromEntries(keys.map(k=>[k,$('filter-'+k)]));
  const params=new URLSearchParams(location.search),filters=Object.fromEntries(['q','vehicle',...keys].map(k=>[k,params.get(k)||'']));
  filters.assemblyOnly=params.get('assemblies')==='1';$('filter-assemblies').checked=filters.assemblyOnly;
  filters.q=filters.q.slice(0,120);
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
  for(const k of ['region','maker','format','status','setKind','curve']){controls[k].value=filters[k];if(controls[k].selectedIndex<0)controls[k].value='';filters[k]=controls[k].value;}
  cascade();search.value=filters.q;
  if(filters.setKind||filters.curve)$('more-filters').open=true;
  const stats=N.summary();for(const [value,label]of [[stats.products,'项产品资料'],[stats.covered+'/'+stats.presets,'个预设已覆盖'],[stats.makers,'家模型厂商']]){const el=e('div','catalogue-stat');el.append(e('strong','',String(value)),e('span','',label));$('catalogue-stats').append(el);}
  $('intro').textContent='资料核对：'+window.RAIL_NSCALE_DATA.checkedAt+' · 按车辆番台、涂装与厂家资料建立对应。';
  function address(){const query=new URLSearchParams();for(const k of ['q','vehicle',...keys])if(filters[k])query.set(k,filters[k]);if(filters.assemblyOnly)query.set('assemblies','1');if(page>1)query.set('page',String(page));history.replaceState(null,'',location.pathname+(query.toString()?'?'+query.toString():''));}
  function activeFilters(){
    const chips=$('active-filters');chips.replaceChildren();
    const add=(label,clear)=>{const button=e('button','catalogue-filter-chip',label+' ×');button.type='button';button.setAttribute('aria-label','移除筛选：'+label);button.addEventListener('click',()=>{clear();cascade();page=1;render();const next=chips.querySelector('button');(next||$('clear-filters')).focus();});chips.append(button);};
    if(filters.q)add('检索 · '+filters.q,()=>{filters.q='';search.value='';});
    for(const key of keys)if(filters[key]){const label=controls[key].options[controls[key].selectedIndex]?.textContent;add(controls[key].labels[0].textContent+' · '+label,()=>{filters[key]='';controls[key].value='';});}
    if(filters.assemblyOnly)add('有编成搭配',()=>{filters.assemblyOnly=false;$('filter-assemblies').checked=false;});
    chips.hidden=!chips.children.length;const count=Number(Boolean(filters.setKind))+Number(Boolean(filters.curve));$('more-filter-count').textContent=count?'已选 '+count+' 项':'';
  }
  function render(){
    results=N.search(filters);totalPages=Math.max(1,Math.ceil(results.length/pageSize));page=Math.min(Math.max(1,page),totalPages);root.replaceChildren();address();activeFilters();$('clear-query').hidden=!search.value;$('copy-status').textContent='';$('export-status').textContent='';
    const unique=new Set(results.flatMap(r=>r.products.map(p=>p.id)));$('count').textContent=results.length+' / '+D.vehicles.length+' 个预设 · '+unique.size+' 项产品';$('export-products').disabled=!unique.size;
    const scoped=D.vehicles.find(v=>v.id===filters.vehicle);$('vehicle-scope').hidden=!scoped;if(scoped)$('vehicle-scope-name').textContent='当前车型：'+scoped.label;
    if(!results.length){const empty=e('div','catalogue-empty');empty.append(e('h3','','没有符合条件的车型'),e('p','',filters.assemblyOnly&&filters.setKind?'编成搭配需要全部组件同时可见。请先移除套装类型筛选，再查看基本与增结的完整组合。':filters.curve==='282'||filters.curve==='315'?'此范围只收录厂家明确列出数值的产品；可移除曲线筛选，继续查看未列数值的产品与条件说明。':'可以减少筛选条件，或换用系列名、日文车名与品号检索。'));root.append(empty);}
    let previousRegion='';
    for(const found of results.slice((page-1)*pageSize,page*pageSize)){
      const v=found.vehicle,line=D.lines[v.line];
      if(v.region!==previousRegion){root.append(e('h3','catalogue-region',D.regions.find(r=>r.id===v.region).label));previousRegion=v.region;}
      const el=e('details','vehicle'),s=e('summary','vehicle-summary'),badge=e('span','catalogue-route',line.code);badge.style.setProperty('--route-color',line.color);
      const label=e('span','vehicle-summary-label');label.append(e('strong','',v.label),e('small','',v.series+' · '+D.routes[v.route].label));
      const meta=e('span','vehicle-summary-meta'),names=found.groups.slice(0,2).map(g=>g.maker.id==='MICROACE'?'MA':g.maker.id==='POPONDETTA'?'PP':g.maker.label);
      meta.append(e('span','vehicle-makers',names.join(' / ')+(found.groups.length>2?' +'+(found.groups.length-2):'')),e('span','vehicle-availability '+found.status,found.status==='unverified'?'待核实':found.status==='variant'?'仅版本参考':found.products.length+' 项产品'));const plans=N.assemblies(v.id,found.products);if(plans.length)meta.append(e('span','vehicle-assembly-count',plans.length+' 种编成搭配'));
      s.append(badge,label,meta,e('span','vehicle-chevron','⌄'));el.append(s);let ready=false;
      el.addEventListener('toggle',()=>{if(el.open&&!ready){const body=e('div','nscale-content');U.content(body,v,{showFilters:false,hideIdentity:true,showDirectoryLink:false,filters:{...filters}});el.append(body);ready=true;}});
      root.append(el);
    }
    $('pagination').hidden=!results.length;$('previous-page').disabled=page===1;$('next-page').disabled=page===totalPages;$('page-count').textContent=page+' / '+totalPages+' 页';
  }
  function change(){for(const k of keys)filters[k]=controls[k].value;filters.q=search.value.slice(0,120);filters.assemblyOnly=$('filter-assemblies').checked;cascade();page=1;render();}
  $('filter-assemblies').addEventListener('change',change);
  for(const control of Object.values(controls))control.addEventListener('change',change);search.addEventListener('input',change);
  $('clear-query').addEventListener('click',()=>{search.value='';change();search.focus();});
  $('clear-filters').addEventListener('click',()=>{search.value='';for(const k of keys){controls[k].value='';filters[k]='';}filters.q='';filters.assemblyOnly=false;$('filter-assemblies').checked=false;cascade();page=1;render();});
  $('clear-vehicle').addEventListener('click',()=>{filters.vehicle='';page=1;render();});
  for(const [id,step]of [['previous-page',-1],['next-page',1]])$(id).addEventListener('click',()=>{page+=step;render();$('results-heading').scrollIntoView({block:'start'});});
  $('copy-search').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);$('copy-status').textContent='链接已复制';}catch(_){$('copy-status').textContent='可从地址栏复制当前链接';}});
  $('export-products').addEventListener('click',()=>{
    const exporter=window.RAIL_NSCALE_EXPORT,rows=exporter.rows(results);if(rows.length<=1)return;
    let url;try{url=URL.createObjectURL(new Blob([exporter.csv(results)],{type:'text/csv;charset=utf-8'}));const download=e('a');download.href=url;download.download='n-gauge-models.csv';document.body.append(download);download.click();download.remove();$('export-status').textContent='已生成 '+(rows.length-1)+' 项产品的CSV清单，包含当前筛选全部页面；同品号已合并。表格软件导入时可将品号列设为文本。';setTimeout(()=>URL.revokeObjectURL(url),30000);}catch(_){if(url)URL.revokeObjectURL(url);$('export-status').textContent='下载未完成，可展开产品后复制品号。';}
  });
  render();
})();
