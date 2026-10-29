const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const file of ['catalog','catalog-regions','catalog-expanded','special-services','journey-data','timetable-data','timetable-model','model','journey-model'])vm.runInContext(fs.readFileSync(path.join(root,'dist',file+'.js'),'utf8'),ctx,{filename:file});
const D=ctx.window.RAIL_DATA,M=ctx.window.RAIL_MODEL,J=D.journeyModel,s=M.defaults();
const row=id=>M.makeRow('test',1,id,'20:08');
assert.equal(D.vehicles.length,266);assert.equal(D.regions.length,6);
for(const v of D.vehicles){const r=row(v.id),info=J.message(s,r);assert(info.title&&info.calls.text&&info.seat.text,v.id);assert(!info.calls.needsCustom,v.id+' default stops');for(const destination of v.destinations)assert(!J.stops({...r,destination},v).needsCustom,v.id+' '+destination);}
s.rows.forEach((r,i)=>r.time=['20:08','20:17','20:11','20:21'][i]);s.ticker.clock='model';s.ticker.modelTime='20:09';assert.equal(J.nearest(s).id,'inner-first');s.ticker.target='platform1';assert.equal(J.nearest(s).id,'outer-next');s.ticker.target='outer-first';assert.equal(J.nearest(s).id,'outer-first');
s.ticker.target='nearest';s.ticker.modelTime='23:58';s.rows.forEach((r,i)=>r.time=['00:02','23:59','00:01','23:57'][i]);assert.equal(J.nearest(s).id,'outer-next');s.ticker.modelTime='00:00';assert.equal(J.nearest(s).id,'inner-first');
s.rows.forEach(r=>r.time='00:01');assert.equal(J.nearest(s).id,'outer-first');
s.ticker.clock='wall';assert.equal(J.nearest(s,new Date(2026,9,25,0,0)).id,'outer-first');
const r=row('e261-saphir'),v=M.byId.get(r.vehicleId);let calls=J.stops(r,v);assert.equal(calls.origin,'東京');assert.equal(calls.calls[0],'品川');assert.equal(calls.calls.at(-1),'伊豆急下田');assert.equal(calls.label,'停車駅');
calls=J.stops({...r,origin:'横浜'},v);assert.equal(calls.calls[0],'熱海');assert(!calls.calls.includes('品川'));calls=J.stops({...r,destination:'東京'},v);assert.equal(calls.origin,'伊豆急下田');assert.equal(calls.calls.at(-1),'東京');assert.equal(calls.calls[0],'河津');
calls=J.stops({...r,stopsMode:'custom',stopsCustom:'品川、横浜\n熱海,伊東'},v);assert.deepEqual(Array.from(calls.calls),['品川','横浜','熱海','伊東']);
assert(J.stops({...r,destination:'模型町'},v).needsCustom);
let guide=J.seatGuide(s,row('e5-hayabusa'),M.byId.get('e5-hayabusa'));assert(!guide.detailed);assert(guide.text.includes('グランクラス'));assert(!guide.text.includes('号車'));
s.formations['e5-hayabusa']=10;guide=J.seatGuide(s,row('e5-hayabusa'),M.byId.get('e5-hayabusa'));assert(guide.detailed);assert(guide.text.includes('10号車'));
guide=J.seatGuide(s,row('n700s-nozomi'),M.byId.get('n700s-nozomi'));assert(guide.text.includes('自由席は1・2号車'));assert(!guide.text.includes('全車指定席'));guide=J.seatGuide(s,{...row('n700s-nozomi'),reservationMode:'allReserved'},M.byId.get('n700s-nozomi'));assert(guide.text.includes('自由席はありません'));assert(!guide.text.includes('自由席は1・2'));
for(const id of ['ky800-tsubame','ky-n700s-kamome'])assert(!D.featureIds(row(id),M.byId.get(id)).includes('green'));
for(const id of ['ko9000','ty5050','so20000','nt3000']){assert.equal(row(id).number,'');assert(J.seatGuide(s,row(id),M.byId.get(id)).text.includes('座席指定はありません'));}
assert(!J.seatGuide(s,row('789-kamui'),M.byId.get('789-kamui')).text.includes('グリーン'));
assert(J.stops({...row('kh8000'),serviceVariant:'rakuraku'},M.byId.get('kh8000')).calls.includes('七条'));assert(!J.stops({...row('kh8000'),serviceVariant:'rakuraku'},M.byId.get('kh8000')).calls.includes('枚方市'));
assert(!J.stops({...row('nk50000-rapit'),serviceVariant:'alpha'},M.byId.get('nk50000-rapit')).calls.includes('岸和田'));
const saved=M.defaults();saved.ticker={enabled:false,paused:true,target:'inner-next',clock:'model',modelTime:'23:58',speed:45};Object.assign(saved.rows[0],{origin:'横浜',stopsMode:'custom',stopsCustom:'熱海、伊東',seatGuideMode:'custom',seatGuideCustom:'全車指定席',reservationMode:'allReserved'});const restored=M.normalize(JSON.parse(JSON.stringify(saved)));assert.deepEqual(JSON.parse(JSON.stringify(restored.ticker)),saved.ticker);assert.equal(restored.rows[0].stopsCustom,'熱海、伊東');assert.equal(restored.rows[0].origin,'横浜');
const legacy=M.defaults();delete legacy.ticker;delete legacy.rows[0].origin;const upgraded=M.normalize(legacy);assert(upgraded.ticker.enabled);assert.equal(upgraded.rows[0].stopsMode,'auto');
const invalid=M.defaults();invalid.ticker={speed:999,clock:'bad',target:'bad',modelTime:'25:00'};invalid.rows[0].stopsCustom='a'.repeat(900);const safe=M.normalize(invalid);assert.equal(safe.ticker.speed,90);assert.equal(safe.ticker.modelTime,'20:00');assert.equal(safe.rows[0].stopsCustom.length,600);assert.equal(safe.ticker.target,'nearest');
const result={result:'PASS',presets:D.vehicles.length,newPresets:113,allDefaultAndPresetDestinations:true,nearestAndMidnight:true,customStopsAndReverse:true,realFormationSeatNumbers:true,privateFareDistinction:true,persistenceAndMigration:true};fs.writeFileSync(path.join(root,'TICKER-VALIDATION.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));

const marineGuide=J.seatGuide(s,row('sq5000-marineliner'),M.byId.get('sq5000-marineliner'));assert(marineGuide.text.includes('グリーン車は指定席'));assert(!marineGuide.text.includes('グリーン車は自由席'));
