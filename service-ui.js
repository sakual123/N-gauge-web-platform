(() => {
  'use strict';
  const D=window.RAIL_DATA,ns='http://www.w3.org/2000/svg';let cropSequence=0;
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
  const svgEl=(tag,attrs={})=>{const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);return n;};
  const paths={
    diamond:['M3 10 10 3h12l7 7-13 19Z','M3 10h26M10 3l6 26L22 3M10 3l6 7 6-7'],
    compartment:['M5 29V3h22v26M11 29V15h10v14M10 10h12','M14 23h4'],
    bed:['M3 27V10M3 22h26v5M10 14h14q5 0 5 5v3H3','M8 13a3 3 0 1 0 0 .1'],
    cup:['M6 8h18v13q0 6-9 6t-9-6ZM24 10h3q5 0 2 7h-5M3 29h24','M11 3v2M17 3v2'],
    plane:['M15 2h2l1 11 11 7v3l-11-3v7l4 3v1l-6-2-6 2v-1l4-3v-7L3 23v-3l11-7Z'],
    doubledeck:['M3 5h26v22H3ZM3 16h26M8 8v5M15 8v5M23 8v5M8 19v5M15 19v5M23 19v5'],
    window:['M3 4h26v24H3ZM16 4v24M3 18h26M7 14l4-4 5 5 5-6 5 6']
  };
  function feature(id,large=false){
    const spec=D.serviceFeatures[id],wrap=el('span','service-feature'+(large?' primary-feature':''));wrap.dataset.feature=id;wrap.title=spec.title;wrap.setAttribute('role','img');wrap.setAttribute('aria-label',spec.label);
    if(spec.src){const img=el('img','feature-image');img.src=spec.src;img.alt='';img.setAttribute('aria-hidden','true');wrap.append(img);if(spec.wide)wrap.classList.add('wide-feature');}
    else if(spec.shape){const svg=svgEl('svg',{viewBox:'0 0 32 32','aria-hidden':'true',fill:spec.shape==='plane'?'currentColor':'none',stroke:'currentColor','stroke-width':'1.7','stroke-linejoin':'round','stroke-linecap':'round'});for(const d of paths[spec.shape])svg.append(svgEl('path',{d}));wrap.append(svg);}
    if(spec.short)wrap.append(el('span','feature-label',spec.short));return wrap;
  }
  function brand(id){
    const spec=D.serviceBrands[id],wrap=el('span','service-brand');wrap.dataset.brand=id;wrap.dataset.theme=spec.theme;wrap.title=spec.label;wrap.setAttribute('role','img');wrap.setAttribute('aria-label',spec.label);
    if(spec.crop){
      const svg=svgEl('svg',{viewBox:spec.crop.join(' '),'aria-hidden':'true'}),image=svgEl('image',{href:spec.src,width:spec.imageSize[0],height:spec.imageSize[1]});
      if(id==='aoniyoshi'){const clipId='service-brand-clip-'+(++cropSequence),defs=svgEl('defs'),clip=svgEl('clipPath',{id:clipId});clip.append(svgEl('polygon',{points:'190,173 322,173 322,400 162,400 162,210 190,210'}));defs.append(clip);svg.append(defs);image.setAttribute('clip-path','url(#'+clipId+')');}
      svg.append(image);wrap.append(svg);wrap.classList.add('tall-brand');
    }else if(spec.src){const img=el('img');img.src=spec.src;img.alt='';img.setAttribute('aria-hidden','true');wrap.append(img);if(spec.tall)wrap.classList.add('tall-brand');}
    else{wrap.append(el('span','brand-word',spec.text));wrap.classList.add('word-brand');}
    return wrap;
  }
  function presentation(row,v){const variant=D.variantFor(row,v);return{name:variant?.name||window.RAIL_TIMETABLE_MODEL?.displayName(row,v)||v.name,en:variant?.en||window.RAIL_TIMETABLE_MODEL?.displayEn(row,v)||v.en,features:D.featureIds(row,v),brand:D.brandFor(row,v)};}
  function strip(row,v,marks){
    const strip=el('div','service-strip');
    if(marks.brand)strip.append(brand(marks.brand));
    for(const id of marks.features){if(id==='green'&&v.special.emphasis==='green')continue;strip.append(feature(id));}
    if(row.markerMode!=='off'&&row.seatAvailability){const status=el('span','seat-availability','空席 '+row.seatAvailability);status.dataset.status=row.seatAvailability;status.title='手动设置的空席状态';strip.append(status);}
    return strip.childElementCount?strip:null;
  }
  const option=(value,text)=>{const n=el('option','',text);n.value=value;return n;};
  const field=(label,control)=>{const group=el('div','form-group'),caption=el('label','form-label',label);caption.htmlFor=control.id;group.append(caption,control);return group;};
  function editor(row,v,onChange){
    const details=el('details','service-settings'),summary=el('summary','', '特殊标识与座席图标');details.append(summary);
    const mode=el('select','control');mode.id='marker-mode-'+row.id;[['auto','自动：跟随车型与服务'],['custom','自定义设备图标'],['off','隐藏本行所有特殊标识']].forEach(([value,label])=>mode.append(option(value,label)));mode.value=row.markerMode||'auto';details.append(field('标识显示',mode));
    const help=el('p','service-help',v.special.note);details.append(help);
    const choices=el('div','feature-choices');choices.hidden=mode.value!=='custom';
    const active=row.markerMode==='custom'?(row.markerFeatures||[]):D.featureIds(Object.assign({},row,{markerMode:'auto'}),v);
    for(const [id,spec] of Object.entries(D.serviceFeatures)){const label=el('label','feature-choice'),input=el('input');input.type='checkbox';input.id='feature-'+row.id+'-'+id;input.value=id;input.checked=active.includes(id);input.addEventListener('change',()=>{row.markerFeatures=[...choices.querySelectorAll('input:checked')].map(i=>i.value);onChange();});label.append(input,el('span','',spec.label));choices.append(label);}details.append(choices);
    mode.addEventListener('change',()=>{if(mode.value==='custom'){row.markerFeatures=D.featureIds(Object.assign({},row,{markerMode:'auto'}),v);for(const input of choices.querySelectorAll('input'))input.checked=row.markerFeatures.includes(input.value);}row.markerMode=mode.value;choices.hidden=mode.value!=='custom';onChange();});
    if(v.special.brand){const label=el('label','check-label'),input=el('input');input.id='show-brand-'+row.id;input.type='checkbox';input.checked=row.showBrand!==false;input.addEventListener('change',()=>{row.showBrand=input.checked;onChange();});label.append(input,el('span','','显示列车品牌标识 / 专用名牌'));details.append(label);}
    if(v.special.variants.length){const variant=el('select','control');variant.id='service-variant-'+row.id;for(const item of v.special.variants)variant.append(option(item.id,item.label));variant.value=row.serviceVariant||'';variant.addEventListener('change',()=>{const previous=D.variantFor(row,v);row.serviceVariant=variant.value;const next=D.variantFor(row,v);if(next?.type)row.type=next.type;else if(previous?.type&&row.type===previous.type)row.type=v.type;onChange();});details.append(field('专用列车显示',variant));}
    const availability=el('select','control');availability.id='seat-availability-'+row.id;[['','不显示空席状态'],['○','○ 余裕'],['△','△ 残少'],['×','× 満席']].forEach(([value,label])=>availability.append(option(value,label)));availability.value=row.seatAvailability||'';availability.addEventListener('change',()=>{row.seatAvailability=availability.value;onChange();});details.append(field('空席状态（手动设置）',availability));
    return details;
  }
  window.RAIL_SERVICE_UI={feature,brand,presentation,strip,editor};
})();
