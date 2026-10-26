const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),data=JSON.parse(fs.readFileSync(path.join(root,'data/announcements.json'),'utf8'));
assert(data.stations&&data.profiles&&data.vehicleOverrides);for(const [route,s] of Object.entries(data.stations))assert(s.station&&s.reading&&s.source?.startsWith('https://'),route);
fs.writeFileSync(path.join(root,'dist/announcement-data.js'),'/* Representative stations and adapted Japanese speech templates. Not original station audio. */\nwindow.RAIL_ANNOUNCEMENT_DATA='+JSON.stringify(data)+';\n');
console.log(JSON.stringify({routes:Object.keys(data.stations).length,vehicleOverrides:Object.keys(data.vehicleOverrides).length,profiles:Object.keys(data.profiles).length}));
