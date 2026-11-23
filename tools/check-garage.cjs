const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = { window: {}, TextEncoder };
const script = fs.readFileSync(path.join(__dirname, '../dist/garage-store.js'), 'utf8');
vm.runInNewContext(script, context);
const store = context.window.RAIL_GARAGE;
const records = new Map();
const storage = {
  getItem: key => records.get(key) ?? null,
  setItem: (key, value) => records.set(key, value)
};
const train = {
  id: 'train-1', name: '789系 スーパーホワイトアロー', sku: '10-1234',
  purchaseDate: '2024-02-29', price: 258000, currency: 'CNY', note: '',
  runs: []
};
const newer = { id: 'run-1', startedAt: '2026-11-23T02:30:00.000Z', minutes: 25, note: '' };
const older = { id: 'run-2', startedAt: '2026-11-21T10:30:00.000Z', minutes: null, note: '外圈' };

assert.equal(store.summarize(store.read(storage)).runs, 0);
store.update(storage, data => data.trains.push(train));
store.update(storage, data => data.trains[0].runs.push(newer));
store.update(storage, data => data.trains[0].runs.push(older));
const reloaded = store.read(storage);
assert.equal(reloaded.trains[0].purchaseDate, '2024-02-29');
assert.equal(reloaded.trains[0].price, 258000);
assert.equal(store.summarize(reloaded).runs, 2);
assert.equal(store.summarize(reloaded).lastRun, newer.startedAt);

const incoming = store.parse(JSON.stringify(store.envelope([
  { ...train, name: '旧备份里的名字', runs: [{ ...newer, minutes: 7 }, older, { ...older, id: 'run-3' }] },
  { ...train, id: 'another-copy', price: 0 }
])));
for (let i = 0; i < 2; i++) store.update(storage, data => store.merge(data, incoming));
const merged = store.read(storage);
assert.equal(merged.trains.length, 2, 'Two physical copies may have the same name');
assert.equal(merged.trains[0].name, train.name, 'Merge keeps fields already on this device');
assert.equal(merged.trains[0].runs[0].minutes, 25);
assert.equal(merged.trains[1].price, 0, 'Zero is distinct from unknown');
assert.equal(store.summarize(merged).runs, 3, 'Reimport must not duplicate runs');

const before = records.get(store.key);
assert.throws(() => store.update(storage, data => { data.trains[0].purchaseDate = '2025-02-29'; }));
assert.throws(() => store.update(storage, data => data.trains[0].runs.push(newer)));
assert.throws(() => store.parse(JSON.stringify({ version: 2, rows: [] })));
assert.equal(records.get(store.key), before, 'Invalid edits must leave stored history intact');
assert.throws(() => store.parseRunTime('2026-02-30T10:30'));
assert.equal(store.localInput(store.parseRunTime('2026-11-23T20:30')), '2026-11-23T20:30');
store.update(storage, data => { data.trains[0].runs = data.trains[0].runs.filter(run => run.id !== newer.id); });
assert.equal(store.summarize(store.read(storage)).lastRun, older.startedAt, 'Removing the latest event recalculates totals');
console.log('Garage persistence, dates, price, import merge and run totals: PASS');
