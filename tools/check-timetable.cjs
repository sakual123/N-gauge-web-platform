const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const file of ['catalog','catalog-regions','catalog-expanded','special-services','journey-data','timetable-data','timetable-model','model','journey-model'])vm.runInContext(fs.readFileSync(path.join(root,'dist',file+'.js'),'utf8'),ctx,{filename:file});
const {RAIL_DATA:D,RAIL_MODEL:M,RAIL_TIMETABLE_MODEL:TT}=ctx.window,J=D.journeyModel,data=TT.data;
assert.equal(data.date,'2026-10-25');assert.equal(new Date(data.date+'T12:00:00+09:00').getUTCDay(),0);assert.equal(data.timezone,'Asia/Tokyo');assert.equal(data.presetCount,266);assert.equal(Object.keys(data.presets).length,266);
let count=0,fullCalls=0;const ids=new Set(),statuses={};
for(const v of D.vehicles){
 assert(TT.trips(v.id).length,v.id+' missing reference');
 for(const t of TT.trips(v.id)){
  count++;statuses[t.status]=(statuses[t.status]||0)+1;assert(TT.validTime(t.time),v.id);assert(t.origin&&t.destination);assert(D.types.includes(t.type),v.id+' unknown type '+t.type);assert(TT.labels[t.status]);assert.equal(t.date,data.date);assert.equal(t.timezone,data.timezone);assert(!ids.has(t.id));ids.add(t.id);
  if(t.status!=='model')assert(/^https?:\/\//.test(t.source)&&t.evidence,v.id+' no official provenance');
  const r=M.makeRow('test',1,v.id);TT.apply(r,t.id);assert.equal(r.time,t.time);assert.equal(r.destination,t.destination);assert.equal(r.origin,t.origin);assert.equal(r.number,t.number);assert.equal(r.referenceId,t.id);assert(!TT.modified(r));assert.equal(TT.displayName(r,v),t.displayName||v.name);
  if(t.stops?.length){const info=J.stops(r,v);assert.deepEqual(Array.from(info.calls),Array.from(t.stops));assert.equal(info.label,t.stopsScope==='major'?'主な停車駅':'停車駅');assert.equal(info.calls.at(-1),t.destination);fullCalls++;}
  r.time='23:57';assert.equal(TT.modified(r),t.time!=='23:57');assert(TT.routeMatches(r));
  r.number='CUSTOM';assert(!TT.routeMatches(r));
 }
}
assert.equal(count,data.departureCount);assert.deepEqual(JSON.parse(JSON.stringify(statuses)),JSON.parse(JSON.stringify(data.statusCounts)));
assert.equal(JSON.stringify(data),JSON.stringify(JSON.parse(fs.readFileSync(path.join(root,'data/timetables.json'),'utf8'))),'Packed browser data must preserve every source fact');
const coverageCounts={};for(const [id,entry] of Object.entries(data.presets)){const level=TT.coverage(id).level;assert(TT.coverageLabels[level]);coverageCounts[level]=(coverageCounts[level]||0)+1;assert.equal(entry.coverage.count,entry.departures.length);}
assert.deepEqual(coverageCounts,JSON.parse(JSON.stringify(data.coverageCounts)));
const filterId='e233-keihin',before=JSON.stringify(TT.trips(filterId)),filtered=TT.filterTrips(filterId,{origin:'東京',period:'18-21',q:'大宮'});
assert(filtered.length>2);assert(filtered.every(t=>t.origin==='東京'&&t.destination==='大宮'&&t.time>='18:00'&&t.time<'21:00'));
assert.equal(JSON.stringify(TT.trips(filterId)),before,'Filtering must not mutate canonical order/default');
assert.equal(TT.filterTrips(filterId,{q:'不存在の列車xyz'}).length,0);assert.equal(TT.filterTrips(filterId,{q:'１８：'}).length,TT.filterTrips(filterId,{q:'18:'}).length);
assert(TT.filterTrips(filterId,{period:'00-06'}).some(t=>t.time==='00:00'&&t.sourceTime==='24:00'&&t.serviceDayOffset===1));
assert(TT.trips(filterId).some(t=>t.type==='快速'&&t.time>='11:00'&&t.time<'15:00'),'Keihin daytime rapid services must not be omitted');
assert(TT.trips('e233-chuo').some(t=>t.type==='中央特快'),'Chuo Special Rapid must be included');
assert.equal(TT.trips('500-kodama').length,6,'10/25 official 500-series plan has six services');
assert.equal(TT.trips('500-kodama').find(t=>t.number==='947号').time,'10:37','Use the dated train table rather than erroneous campaign HTML');
assert(TT.trips('so12000').some(t=>t.destination==='海老名'&&t.stops?.includes('羽沢横浜国大')),'Do not truncate operator-boundary through services');
const old=M.defaults();Object.assign(old.rows[0],{time:'22:38',origin:'品川',destination:'模型町',number:'模型17号',referenceId:''});old.formations['e5-hayabusa']=8;
const migrated=M.normalize(JSON.parse(JSON.stringify(old)));assert.equal(migrated.rows[0].time,'22:38');assert.equal(migrated.rows[0].destination,'模型町');assert.equal(M.carsFor(migrated,'e5-hayabusa'),8);assert(TT.modified(migrated.rows[0]));
const s=M.defaults(),r=s.rows[0],vid=r.vehicleId,second=TT.trips(vid)[1];TT.apply(r,second.id);r.time='13:42';TT.remember(r,s);const normalized=M.normalize(JSON.parse(JSON.stringify(s)));assert.equal(normalized.rows[0].time,'13:42');assert.equal(normalized.timetablePins[vid].referenceId,second.id);
M.applyVehicle(r,'e233-chuo',s);assert.equal(r.time,TT.trips('e233-chuo')[0].time);M.applyVehicle(r,vid,s);assert.equal(r.time,'13:42');assert.equal(r.referenceId,second.id);TT.apply(r,second.id);assert.equal(r.time,second.time);assert(!TT.modified(r));
const bad=TT.normalizePins({[vid]:{time:'29:71'},fake:{time:'12:00'}});assert.equal(Object.keys(bad).length,0);
const stale=TT.normalizePins({[vid]:{time:'12:34',referenceId:'removed-trip'}});assert.equal(stale[vid].referenceId,'');
for(const scene of ['kantoPrivate','tokaiPrivate','hokkaidoLocal','kyushu','specialJR','specialPrivate','specialSeats','west','kansai','tokai','hokkaido','east','express','shinkansen','mixed','original'])for(const row of M.scene(scene).rows){assert(TT.find(row),scene);assert(!TT.modified(row),scene);}
const ex=M.makeRow('test',1,'e261-saphir'),v=M.byId.get(ex.vehicleId);assert(J.stops(ex,v).exact);ex.time='12:34';assert(J.stops(ex,v).exact);ex.number='999号';assert(!J.stops(ex,v).exact);ex.stopsMode='custom';ex.stopsCustom='品川、横浜';assert.equal(J.stops(ex,v).text,'品川・横浜');
const wing=M.makeRow('test',1,'kk2100-wing');assert(J.seatGuide(s,wing,M.byId.get(wing.vehicleId)).text.includes('2号車'));assert(!J.seatGuide(s,wing,M.byId.get(wing.vehicleId)).text.includes('全車指定席'));
const rapit=M.makeRow('test',1,'nk50000-rapit');assert.equal(rapit.serviceVariant,'alpha');assert(!J.stops(rapit,M.byId.get(rapit.vehicleId)).calls.includes('岸和田'));
const nag=M.makeRow('test',1,'is-nagamare');assert.equal(nag.type,'普通');assert.equal(nag.seat,'一般車・予約不要');assert.equal(TT.displayName(nag,M.byId.get(nag.vehicleId)),'ながまれ号');
assert.equal(TT.trips('e257-shonan')[0].status,'weekday');assert.equal(TT.trips('e257-akagi')[0].status,'weekday');assert.equal(TT.trips('hokutosei')[0].status,'legacy');assert.equal(TT.trips('789-hakucho')[0].status,'legacy');
const clock=M.defaults();clock.ticker.clock='wall';clock.rows.forEach((r,i)=>r.time=['08:30','09:01','08:59','07:00'][i]);assert.equal(J.nearest(clock,new Date('2026-10-25T00:00:00Z')).id,'outer-next');
clock.rows.forEach((r,i)=>r.time=['00:02','23:59','00:01','23:57'][i]);assert.equal(J.nearest(clock,new Date('2026-10-25T14:58:00Z')).id,'outer-next');
for(const file of fs.readdirSync(path.join(root,'dist')).filter(f=>f.endsWith('.js')))new vm.Script(fs.readFileSync(path.join(root,'dist',file),'utf8'),{filename:file});
const result={result:'PASS',date:data.date,presets:D.vehicles.length,departures:count,statusCounts:statuses,coverageCounts,referencesWithStops:fullCalls,manualPinsAndReload:true,legacyRowsPreserved:true,sourceAndTimeValidation:true,specialSeatAndVariantRules:true,japanClockAndMidnight:true,allScenesUseReferenceTrips:true,packedSourceRoundTrip:true,nonMutatingOriginDirectionTimeSearchFilters:true,rapidServiceCoverageRegression:true,operatorBoundaryAnd500SeriesRegression:true};fs.writeFileSync(path.join(root,'TIMETABLE-VALIDATION.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));

const sq=Object.entries(data.presets).filter(([id])=>id.startsWith('sq'));assert.equal(sq.length,10);assert.equal(sq.reduce((n,[,e])=>n+e.departures.length,0),154);for(const [id,e] of sq){assert.equal(e.coverage.level,'full');assert.equal(e.coverage.expectedCount,e.departures.length);for(const t of e.departures){assert.equal(t.status,'dated');assert(t.source.includes('date=20261025'));assert(t.calendarEvidence.includes('drivingday-01'));assert(/车底/.test(t.note));}}assert.equal(TT.trips('sq5000-marineliner').length,34);assert(!TT.trips('sq5000-marineliner').some(t=>t.number==='2号'));

const sqScene=M.scene('shikoku');assert(sqScene&&sqScene.rows.every(r=>r.vehicleId.startsWith('sq')&&TT.find(r)));

const classicEntries=Object.entries(data.presets).filter(([id])=>id.startsWith('classic-')||id.startsWith('cl'));assert.equal(classicEntries.length,19);for(const [id,e]of classicEntries){assert.equal(e.coverage.level,'model');assert(e.departures.every(t=>t.status==='model'));}assert.equal(data.coverageCounts.full,243);assert.equal(data.coverageCounts.inactive,4);
