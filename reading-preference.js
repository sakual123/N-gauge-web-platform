(() => {
  'use strict';
  const KEY='n-gauge-reading-v1',controls=[...document.querySelectorAll('[data-reading-control]')];let mode='standard';
  function apply(value){
    mode=value==='large'?'large':'standard';document.documentElement.dataset.reading=mode;
    for(const control of controls){if(control.tagName==='INPUT')control.checked=mode==='large';else{control.setAttribute('aria-pressed',String(mode==='large'));control.textContent=mode==='large'?'大字阅读 · 已开':'大字阅读';}}
  }
  function set(value){apply(value);try{localStorage.setItem(KEY,mode);}catch(_){}}
  try{apply(localStorage.getItem(KEY));}catch(_){apply('standard');}
  for(const control of controls)control.addEventListener(control.tagName==='INPUT'?'change':'click',()=>set(control.tagName==='INPUT'?(control.checked?'large':'standard'):(mode==='large'?'standard':'large')));
  window.addEventListener('storage',event=>{if(event.key===KEY||event.key===null)apply(event.newValue);});
  window.RAIL_READING={set,get:()=>mode,key:KEY};
})();
