const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const f of ['catalog','catalog-regions','catalog-expanded','special-services','journey-data','timetable-data','timetable-model','model','nscale-data','nscale-model'])vm.runInContext(fs.readFileSync(path.join(root,'dist',f+'.js'),'utf8'),ctx,{filename:f});
const {RAIL_DATA:D,RAIL_MODEL:M,RAIL_NSCALE_DATA:data,RAIL_NSCALE_MODEL:N}=ctx.window;
assert.deepEqual(JSON.parse(JSON.stringify(data)),JSON.parse(fs.readFileSync(path.join(root,'data/nscale-products.json'),'utf8')),'Editable and deployed product data must match');
const known=new Set(D.vehicles.map(v=>v.id)),makerIds=new Set(data.makers.map(m=>m.id)),productIds=new Set();
const domains={KATO:['katomodels.com','kato-models.com','hobbycenterkato.com'],TOMIX:['tomytec.co.jp'],TOMYTEC:['tomytec.co.jp'],MICROACE:['microace-arii.co.jp'],POPONDETTA:['popondetta.com'],GREENMAX:['greenmax.co.jp'],MODEMO:['hasegawa-model.co.jp'],ONE_MILE:['one-mile.co.jp']};
for(const p of data.products){
 assert(makerIds.has(p.maker),p.maker);if(p.codeType==='unlisted'){assert.equal(p.sku,'');assert(p.id.startsWith(p.maker+':')&&p.format==='kit'&&/未|编号|品番|品号/.test(p.note),p.id);}else assert(p.id===p.maker+':'+p.sku&&p.sku.trim()===p.sku&&p.sku.length>0&&p.sku.length<40,p.id);assert(!productIds.has(p.id),'Duplicate '+p.id);productIds.add(p.id);
 assert(p.title&&p.note&&p.sourceTitle&&p.checkedAt,'Provenance missing: '+p.id);assert(['set','basic','addon','single'].includes(p.setKind));assert(['exact','variant'].includes(p.match));assert(p.cars===null||Number.isInteger(p.cars)&&p.cars>0&&p.cars<=20,p.id);
 if(/^\d{13}$/.test(p.sku)){assert(p.codeType==='JAN'&&/JAN/.test(p.note),'JAN must be explicitly labelled: '+p.id);const sum=[...p.sku.slice(0,12)].reduce((n,c,i)=>n+Number(c)*(i%2?3:1),0);assert.equal(Number(p.sku[12]),(10-sum%10)%10,'Invalid JAN check digit: '+p.id);}
 const url=new URL(p.source);assert(['https:','http:'].includes(url.protocol));const extra={PERMIL:['permil.cart.fc2.com'],HEYANONAKA:['heyanonaka.com','heyanonaka.official.ec']};assert((domains[p.maker]||extra[p.maker]||[]).some(d=>url.hostname===d||url.hostname.endsWith('.'+d)),'Not an official source: '+p.id+' '+p.source);if(p.format)assert(['ready','static','kit'].includes(p.format));
 assert(p.vehicleIds.length&&new Set(p.vehicleIds).size===p.vehicleIds.length);for(const id of p.vehicleIds)assert(known.has(id),'Unknown vehicle '+id);
 assert(!/\(HO\)|HOゲージ|1\/80|1:80/.test(p.title),'Wrong scale: '+p.id);
}
let verified=0,variant=0,unverified=0;for(const v of D.vehicles){const found=N.lookup(v.id),coverage=data.coverage[v.id];assert(coverage?.note&&['verified','variant','unverified'].includes(coverage.status),v.id);if(found.products.length){if(found.products.some(p=>p.match==='exact')){assert.equal(coverage.status,'verified');verified++;}else{assert.equal(coverage.status,'variant');variant++;}}else{assert.equal(coverage.status,'unverified');unverified++;}assert.equal(found.groups.flatMap(g=>g.products).length,found.products.length);}
assert.equal(Object.keys(data.coverage).length,D.vehicles.length);
// Adjacent route entries must never inherit a different subseries/livery through broad E233/N700/789 matching.
const disjoint=[['e233-keihin','e233-ueno-tokyo'],['e235-yamanote','e235-yokosuka'],['e257-odoriko','e257-akagi'],['e5-hayabusa','h5-hayabusa'],['n700s-nozomi','n700a-nozomi'],['789-hakucho','789-kamui'],['kt21000-urban','kt21020-urban'],['kt22600-ace','kt30000-vista']];
for(const [a,b]of disjoint){const ids=new Set(N.lookup(a).products.map(p=>p.id));assert(!N.lookup(b).products.some(p=>ids.has(p.id)),a+' incorrectly shares '+b);}
assert.equal(N.lookup('__unknown__').products.length,0);assert(N.lookup('__unknown__').note);
// Looking up a shortened model formation must never alter its saved car count, time, or selected reference.
const state=M.defaults();state.formations['e233-keihin']=4;state.rows[0].time='13:42';const before=JSON.stringify(state);for(const v of D.vehicles)N.lookup(v.id);assert.equal(JSON.stringify(state),before);
// DOM-level disclosure test: lazy construction, correct selected vehicle, copy button type, safe outbound links.
class Element{constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.listeners={};this.attributes={};this.open=false;}append(...n){this.children.push(...n);}replaceChildren(...n){this.children=[...n];}setAttribute(k,v){this.attributes[k]=v;}addEventListener(e,cb){this.listeners[e]=cb;}queryAll(tag){return this.children.flatMap(c=>c instanceof Element?[...(c.tagName===tag?[c]:[]),...c.queryAll(tag)]:[]);}}
ctx.document={createElement:tag=>new Element(tag)};vm.runInContext(fs.readFileSync(path.join(root,'dist/nscale-ui.js'),'utf8'),ctx);
const v=D.vehicles.find(v=>N.lookup(v.id).products.length);assert(v,'Need verified products to ship the feature');const row=Object.freeze({id:'outer-first',vehicleId:v.id}),el=ctx.window.RAIL_NSCALE_UI.editor(row,v);assert.equal(el.children[0].textContent,'对应N比例车型');assert.equal(el.children[1].children.length,0,'Closed lookup must render lazily');el.open=true;el.listeners.toggle();assert(el.queryAll('article').length===N.lookup(v.id).products.length);for(const b of el.queryAll('button'))assert.equal(b.type,'button');for(const a of el.queryAll('a'))assert(a.rel.includes('noopener'));
// Combined taxonomy, maker and full-width part-number searches must select the actual matching products.
assert(N.search({q:'１０－２１６３'}).some(r=>r.products.some(p=>p.id==='KATO:10-2163')));
assert.equal(N.search({q:'10-2163',maker:'TOMIX'}).length,0);
assert(N.search({q:'E233 TOMIX'}).every(r=>r.products.length&&r.products.every(p=>p.maker==='TOMIX')));
assert.equal(N.search({q:'10-1826 98502'}).length,0,'Two different product codes must not jointly match one vehicle');
const combined=N.search({region:'west',category:'private',maker:'GREENMAX'});assert(combined.length>0);for(const r of combined){assert.equal(r.vehicle.region,'west');assert.equal(r.vehicle.category,'private');assert(r.products.every(p=>p.maker==='GREENMAX'));}
assert.equal(N.search({status:'unverified'}).length,unverified);
for(const p of data.products.filter(p=>p.codeType==='unlisted')){const card=ctx.window.RAIL_NSCALE_UI.productCard(p);assert.equal(card.queryAll('button').length,0);assert(card.queryAll('code').some(n=>n.textContent==='厂家未列品号'));}
const result={result:'PASS',presets:D.vehicles.length,products:data.products.length,codedProducts:data.products.filter(p=>p.codeType!=='unlisted').length,unlistedCodeProducts:data.products.filter(p=>p.codeType==='unlisted').length,multiMakerPresets:D.vehicles.filter(v=>N.lookup(v.id).groups.length>1).length,makers:data.makers.filter(m=>data.products.some(p=>p.maker===m.id)).map(m=>m.id),verifiedPresets:verified,variantOnlyPresets:variant,unverifiedPresets:unverified,exactDataRoundtrip:true,subseriesIsolation:true,settingsUnchanged:true,lazyDisclosure:true,officialSourceDomains:true,combinedSearch:true};
fs.writeFileSync(path.join(root,'NSCALE-VALIDATION.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
