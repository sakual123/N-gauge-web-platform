(() => {
  'use strict';
  const N=window.RAIL_NSCALE_MODEL,opened=new Map(),makerChoice=new Map();
  const E=(tag,cls,value)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(value!==undefined)el.textContent=value;return el;};
  function link(title,url){const a=E('a','reference-source',title);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}
  function productCard(p){
    const unlisted=p.codeType==='unlisted',codeName=p.codeType==='JAN'?'JAN':'品号',card=E('article','nscale-product'),head=E('div','nscale-product-head'),sku=E('code','nscale-sku',unlisted?'厂家未列品号':p.sku),copy=E('button','nscale-copy','复制'+codeName);
    card.dataset.match=p.match;card.dataset.format=N.format(p);copy.type='button';copy.setAttribute('aria-label','复制 '+N.makers.get(p.maker).label+' '+codeName+' '+p.sku);const status=E('span','nscale-copy-status');status.setAttribute('role','status');
    copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(p.sku);status.textContent='已复制';}catch(_){status.textContent='请长按品号复制';}});
    head.append(sku);if(!unlisted)head.append(copy);card.append(head,E('p','nscale-title',p.title));
    const tags=E('div','nscale-tags');if(p.codeType==='JAN')tags.append(E('span','','JAN 检索码'));tags.append(E('span','',N.description(p)),E('span','nscale-format',N.formats[N.format(p)]),E('span',p.match==='variant'?'nscale-variant':'nscale-exact',p.match==='variant'?'版本参考':'车型对应'));card.append(tags);
    if(p.note)card.append(E('p','nscale-note',p.note));
    const footer=E('div','nscale-product-footer'),source=link('厂家资料 ↗',p.source);source.title=p.sourceTitle;footer.append(source,status);card.append(footer);return card;
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
      if(found.products.length){for(const g of found.groups){const group=E('section','nscale-maker');group.dataset.maker=g.maker.id;const heading=E('h3','nscale-maker-name');heading.append(E('span','',g.maker.label),E('small','',String(g.products.length)));group.append(heading);const cards=E('div','nscale-maker-products');g.products.forEach(p=>cards.append(productCard(p)));group.append(cards);list.append(group);}}
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
