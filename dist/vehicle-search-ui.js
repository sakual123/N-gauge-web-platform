(() => {
  'use strict';
  const D=window.RAIL_DATA,S=window.RAIL_VEHICLE_SEARCH;
  const e=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
  function editor(row,onChoose){
    const box=e('details','vehicle-quick-search'),summary=e('summary','','快速找车'),body=e('div','vehicle-search-body'),label=e('label','form-label','车名、系列或线路'),input=e('input','control vehicle-search-input'),results=e('div','vehicle-search-results'),status=e('p','vehicle-search-status');
    input.type='search';input.id='quick-search-'+row.id;input.placeholder='例如 E233、ひのとり、京阪';input.autocomplete='off';input.maxLength=80;label.htmlFor=input.id;status.setAttribute('role','status');results.id='vehicle-search-results-'+row.id;input.setAttribute('aria-controls',results.id);
    function draw(){
      results.replaceChildren();const query=input.value.trim(),found=S.search(query);status.textContent=!query?'跨地区搜索，选择后应用到当前这一班':found.length?'找到 '+found.length+' 个预设'+(found.length>12?' · 先显示12个，请补充线路缩小范围':''):'没有找到，试试系列名或日文车名';
      for(const v of found.slice(0,12)){
        const button=e('button','vehicle-search-result'),line=D.lines[v.line],badge=e('span','vehicle-search-route',line.code),text=e('span','vehicle-search-label');badge.style.setProperty('--route-color',line.color);button.type='button';button.dataset.vehicleId=v.id;
        text.append(e('strong','',v.label),e('small','',D.regions.find(r=>r.id===v.region).label+' · '+D.routes[v.route].label+' · '+v.series));button.append(badge,text,e('span','vehicle-search-arrow',v.id===row.vehicleId?'当前':'↗'));button.disabled=v.id===row.vehicleId;button.addEventListener('click',()=>onChoose(v.id));results.append(button);
      }
    }
    input.addEventListener('input',draw);input.addEventListener('keydown',event=>{const first=[...results.children].find(b=>!b.disabled);if(event.key==='ArrowDown'&&first){event.preventDefault();first.focus();}else if(event.key==='Enter'){event.preventDefault();if(results.children.length===1&&first)first.click();}});
    results.addEventListener('keydown',event=>{const items=[...results.children].filter(b=>!b.disabled),index=items.indexOf(document.activeElement);if(index<0)return;if(event.key==='ArrowDown'){event.preventDefault();items[Math.min(index+1,items.length-1)].focus();}else if(event.key==='ArrowUp'){event.preventDefault();if(index===0)input.focus();else items[index-1].focus();}});
    box.addEventListener('toggle',()=>{if(box.open)input.focus({preventScroll:true});});body.append(label,input,status,results);box.append(summary,body);draw();return box;
  }
  window.RAIL_VEHICLE_SEARCH_UI={editor};
})();
