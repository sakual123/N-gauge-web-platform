(() => {
  'use strict';
  const N=window.RAIL_NSCALE_MODEL,opened=new Map();
  const E=(tag,cls,value)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(value!==undefined)el.textContent=value;return el;};
  function link(title,url){const a=E('a','reference-source',title);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}
  function productCard(p){
    const codeName=p.codeType==='JAN'?'JAN':'品号',card=E('article','nscale-product'),head=E('div','nscale-product-head'),sku=E('code','nscale-sku',p.sku),copy=E('button','nscale-copy','复制'+codeName);
    copy.type='button';copy.setAttribute('aria-label','复制 '+N.makers.get(p.maker).label+' '+codeName+' '+p.sku);const status=E('span','nscale-copy-status');status.setAttribute('role','status');
    copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(p.sku);status.textContent='已复制';}catch(_){status.textContent='请长按品号复制';}});
    head.append(sku,copy);card.append(head,E('p','nscale-title',p.title));
    const tags=E('div','nscale-tags');if(p.codeType==='JAN')tags.append(E('span','','JAN 检索码'));tags.append(E('span','',N.description(p)),E('span',p.match==='variant'?'nscale-variant':'nscale-exact',p.match==='variant'?'版本参考':'车型对应'));card.append(tags);
    if(p.note)card.append(E('p','nscale-note',p.note));
    const footer=E('div','nscale-product-footer'),source=link('厂家资料 ↗',p.source);source.title=p.sourceTitle;footer.append(source,status);card.append(footer);return card;
  }
  function content(container,v){
    const found=N.lookup(v.id);container.append(E('p','nscale-current',v.label+' · '+v.series),E('p','service-help','按车辆番台和涂装匹配。套装节数与上方模型编组独立；基本套装和增结套装分别列出，增结通常需搭配基本套装。品号含历年产品，现货以店铺为准。'));
    if(found.products.length){for(const g of found.groups){const group=E('section','nscale-maker');group.append(E('h3','nscale-maker-name',g.maker.label));g.products.forEach(p=>group.append(productCard(p)));container.append(group);}if(found.note)container.append(E('p','service-help',found.note));}
    else container.append(E('p','nscale-empty',found.note));
    const help=E('p','service-help','MA = MICRO ACE，PP = ポポンデッタ（Popondetta）。未列出的厂家表示尚未收录已核对品号，不等于没有出品。');container.append(help,link('全部车型 · 品号与核对资料 ↗','nscale-models.html'));
  }
  function editor(row,v){
    const el=E('details','service-settings nscale-settings'),key=row.id,summary=E('summary','','对应N比例车型');el.dataset.nscaleVehicle=v.id;el.append(summary);
    let rendered=false;const body=E('div','nscale-content');el.append(body);
    const populate=()=>{if(!rendered){content(body,v);rendered=true;}};
    summary.addEventListener('click',()=>{opened.set(key,!el.open);if(!el.open)populate();});
    el.addEventListener('toggle',()=>{if(el.isConnected)opened.set(key,el.open);if(el.open)populate();});
    if(opened.get(key)){el.open=true;populate();}return el;
  }
  window.RAIL_NSCALE_UI={editor,content,productCard};
})();
