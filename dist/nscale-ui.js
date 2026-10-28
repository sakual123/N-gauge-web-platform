(() => {
  'use strict';
  const N=window.RAIL_NSCALE_MODEL,opened=new Map(),makerChoice=new Map();
  const E=(tag,cls,value)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(value!==undefined)el.textContent=value;return el;};
  function link(title,url){const a=E('a','reference-source',title);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}
  function productCard(p){
    const unlisted=p.codeType==='unlisted',codeName=p.codeType==='JAN'?'JAN':'品号',card=E('article','nscale-product'),head=E('div','nscale-product-head'),sku=E('code','nscale-sku',unlisted?'资料未列品号':p.sku),copy=E('button','nscale-copy','复制'+codeName);
    card.dataset.match=p.match;card.dataset.format=N.format(p);copy.type='button';copy.setAttribute('aria-label','复制 '+N.makers.get(p.maker).label+' '+codeName+' '+p.sku);const status=E('span','nscale-copy-status');status.setAttribute('role','status');
    copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(p.sku);status.textContent='已复制';}catch(_){status.textContent='请长按品号复制';}});
    head.append(sku);if(!unlisted)head.append(copy);card.append(head,E('p','nscale-title',p.title));
    const tags=E('div','nscale-tags');if(p.codeType==='JAN')tags.append(E('span','','JAN 检索码'));tags.append(E('span','',N.description(p)),E('span','nscale-format',N.formats[N.format(p)]),E('span',p.match==='variant'?'nscale-variant':'nscale-exact',p.match==='variant'?'版本参考':'车型对应'));card.append(tags);
    if(p.note)card.append(E('p','nscale-note',p.note));
    if(p.minimumRadiusMm){const radius=E('div','nscale-radius');radius.append(E('span','','厂家标示最小半径'),E('strong','','R'+p.minimumRadiusMm));card.append(radius);}else if(p.radiusNote)card.append(E('div','nscale-radius','官方曲线条件'));
    if(p.radiusNote)card.append(E('p','nscale-radius-note',p.radiusNote));
    const footer=E('div','nscale-product-footer'),source=link(p.verificationUrl?'运营商官方资料 ↗':'厂家资料 ↗',p.source);source.title=p.sourceTitle;footer.append(source);if(p.codeSource){const codes=link('官方品号目录 ↗',p.codeSource);codes.title=p.codeSourceTitle||'官方品号核对资料';footer.append(codes);}if(p.radiusSource&&p.radiusSource!==p.source){const radiusLink=link('曲线条件资料 ↗',p.radiusSource);radiusLink.title=p.radiusSourceTitle||'厂家官方曲线条件';footer.append(radiusLink);}footer.append(status);card.append(footer);return card;
  }
  function assemblyCard(a,v){
    const card=E('section','nscale-assembly'),heading=E('div','assembly-heading'),diagram=E('div','assembly-diagram'),formula=E('p','assembly-formula');
    heading.append(E('h4','',a.label),E('strong','',a.totalCars+' 节'));card.append(heading);diagram.setAttribute('aria-label',a.parts.map(c=>c.product.sku+' '+c.product.cars*c.quantity+'节').join('，'));
    diagram.style.setProperty('--assembly-color',window.RAIL_DATA.lines[v.line].color);
    for(const part of a.parts){const cars=part.product.cars*part.quantity,group=E('div','assembly-part'),train=E('div','assembly-cars');group.style.setProperty('--part-cars',String(cars));for(let i=0;i<cars;i++)train.append(E('span','assembly-car'));group.append(train,E('span','assembly-part-code',part.product.sku+(part.quantity>1?' ×'+part.quantity:'')));diagram.append(group);}
    formula.textContent=a.parts.map(p=>p.product.sku+(p.quantity>1?' ×'+p.quantity:'')+'（'+p.product.cars*p.quantity+'节）').join(' + ')+' = '+a.totalCars+'节';card.append(diagram,formula);
    if(a.match==='variant')card.append(E('p','assembly-version','版本参考 · 请留意涂装与年代差别'));
    if(a.note)card.append(E('p','assembly-note',a.note));
    if(a.minimumRadiusMm)card.append(E('p','assembly-radius','此编成厂家标示最小半径 R'+a.minimumRadiusMm+(a.radiusNote?' · '+a.radiusNote:'')));
    const actions=E('div','assembly-actions'),copy=E('button','nscale-copy','复制搭配品号'),status=E('span','nscale-copy-status');copy.type='button';status.setAttribute('role','status');copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(a.parts.map(p=>p.product.sku+(p.quantity>1?' ×'+p.quantity:'')).join(' + '));status.textContent='已复制搭配';}catch(_){status.textContent='可长按上方品号复制';}});actions.append(copy,link('官方编成资料 ↗',a.source),status);card.append(actions);return card;
  }
  function assemblyPanel(group,v){
    const plans=N.assemblies(v.id,group.products);if(!plans.length)return null;
    const panel=E('details','nscale-assemblies'),summary=E('summary','','编成搭配 · '+plans.length+' 种'),body=E('div','assembly-plans'+(plans.length===1?' assembly-single':''));panel.append(summary);let rendered=false;
    panel.addEventListener('toggle',()=>{if(panel.open&&!rendered){plans.forEach(a=>body.append(assemblyCard(a,v)));body.append(E('p','assembly-help','按同厂家、对应版本组合；这里是产品搭配示例，不改变你的模型节数。实车号车顺序以官方编成图为准。'));panel.append(body);rendered=true;}});return panel;
  }
  function content(container,v,options={}){
    const initial=N.lookup(v.id,options.filters),identity=E('div','nscale-identity');identity.append(E('p','nscale-current',v.label),E('p','nscale-series',v.series));if(!options.hideIdentity)container.append(identity);
    const list=E('div','nscale-product-list'),count=E('p','nscale-result-count');count.setAttribute('role','status');
    const choice=E('select','nscale-maker-select');choice.setAttribute('aria-label','筛选此车型厂家');const opt=(value,label)=>{const node=E('option','',label);node.value=value;return node;};
    const groups=N.lookup(v.id).groups;choice.append(opt('','全部厂家 · '+N.lookup(v.id).total+' 项'));groups.forEach(g=>choice.append(opt(g.maker.id,g.maker.label+' · '+g.products.length+' 项')));
    choice.value=makerChoice.get(v.id)||'';if(choice.selectedIndex<0)choice.value='';
    if(options.showFilters!==false&&groups.length>1){const toolbar=E('div','nscale-toolbar');toolbar.append(choice);container.append(toolbar);}
    container.append(count,list);
    function draw(){
      list.replaceChildren();const filters={...options.filters};if(options.showFilters!==false&&choice.value)filters.maker=choice.value;const found=filters.q?N.search({...filters,vehicle:v.id})[0]||{products:[],groups:[],note:'没有符合检索条件的产品'}:N.lookup(v.id,filters);
      count.textContent=found.products.length?'显示 '+found.products.length+' 项 · 套装节数按实物标注':'暂未收录可核对品号';
      if(found.products.length){for(const g of found.groups){const group=E('section','nscale-maker');group.dataset.maker=g.maker.id;const heading=E('h3','nscale-maker-name');heading.append(E('span','',g.maker.label),E('small','',String(g.products.length)));group.append(heading);const plans=assemblyPanel(g,v);if(plans)group.append(plans);const cards=E('div','nscale-maker-products');g.products.forEach(p=>cards.append(productCard(p)));group.append(cards);list.append(group);}}
      else list.append(E('p','nscale-empty',found.note));
    }
    choice.addEventListener('change',()=>{makerChoice.set(v.id,choice.value);draw();});draw();
    const help=E('details','nscale-help'),helpSummary=E('summary','','品号与套装说明');help.append(helpSummary,E('p','service-help','基本与增结分别按盒内节数列出，增结通常需搭配基本套装。静态模型、套件及历史版本见各项备注。MA = MICRO ACE，PP = Popondetta。品号含历年产品，未列出不等于没有出品；现货以店铺为准。查询不改变你的模型编组。'));
    container.append(help);if(options.showDirectoryLink!==false){const footer=E('div','nscale-directory-link');footer.append(link('在完整目录中查看此车型 ↗','nscale-models.html?vehicle='+encodeURIComponent(v.id)));container.append(footer);}return initial;
  }
  function editor(row,v){
    const el=E('details','service-settings nscale-settings'),key=row.id,summary=E('summary','','对应N比例车型');el.dataset.nscaleVehicle=v.id;el.append(summary);
    let rendered=false;const body=E('div','nscale-content');el.append(body);
    const populate=()=>{if(!rendered){content(body,v);rendered=true;}};
    summary.addEventListener('click',()=>{opened.set(key,!el.open);if(!el.open)populate();});
    el.addEventListener('toggle',()=>{if(el.isConnected)opened.set(key,el.open);if(el.open)populate();});
    el.reveal=()=>{populate();el.open=true;};if(opened.get(key)){el.open=true;populate();}return el;
  }
  window.RAIL_NSCALE_UI={editor,content,productCard};
})();
