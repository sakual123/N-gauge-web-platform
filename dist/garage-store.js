(() => {
  'use strict';

  const key = 'n-gauge-garage-v1';
  const maxBytes = 4 * 1024 * 1024;
  const currencies = new Set(['CNY', 'JPY', 'HKD', 'USD', 'TWD', 'EUR']);
  const envelope = trains => ({ format: 'n-gauge-garage', version: 1, trains });
  const invalid = () => new Error('车库文件格式无效，或包含无法识别的记录。');
  const isoDate = /^\d{4}-\d{2}-\d{2}$/;
  const isoInstant = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

  function isCanonicalDate(value, dateOnly = false) {
    if (typeof value !== 'string' || !(dateOnly ? isoDate : isoInstant).test(value)) return false;
    const date = new Date(value);
    return Number.isFinite(date.getTime()) && (dateOnly ? date.toISOString().slice(0, 10) : date.toISOString()) === value;
  }

  function cleanText(value, limit, required = false) {
    if (typeof value !== 'string' || value.length > limit || (required && !value.trim())) throw invalid();
    return value.trim();
  }

  function uniqueId(value, ids) {
    const id = cleanText(value, 80, true);
    if (!/^[a-zA-Z0-9_-]+$/.test(id) || ids.has(id)) throw invalid();
    ids.add(id);
    return id;
  }

  function parse(text) {
    if (typeof text !== 'string' || text.length > maxBytes) throw invalid();
    let data;
    try { data = JSON.parse(text.replace(/^\uFEFF/, '')); } catch { throw invalid(); }
    if (data?.format !== 'n-gauge-garage' || data.version !== 1 || !Array.isArray(data.trains)) throw invalid();
    const trainIds = new Set();
    return envelope(data.trains.map(train => {
      if (!train || !Array.isArray(train.runs) ||
          !(train.purchaseDate === '' || isCanonicalDate(train.purchaseDate, true)) ||
          !(train.price === null || (Number.isSafeInteger(train.price) && train.price >= 0 && train.price <= 99999999999)) ||
          !currencies.has(train.currency)) throw invalid();
      const runIds = new Set();
      const runs = train.runs.map(run => {
        if (!run || !isCanonicalDate(run.startedAt) ||
            !(run.minutes === null || (Number.isInteger(run.minutes) && run.minutes >= 1 && run.minutes <= 10080))) throw invalid();
        return {
          id: uniqueId(run.id, runIds),
          startedAt: run.startedAt,
          minutes: run.minutes,
          note: cleanText(run.note, 500)
        };
      });
      return {
        id: uniqueId(train.id, trainIds),
        name: cleanText(train.name, 100, true),
        sku: cleanText(train.sku, 60),
        purchaseDate: train.purchaseDate,
        price: train.price,
        currency: train.currency,
        note: cleanText(train.note, 500),
        runs
      };
    }));
  }

  function read(storage) {
    const saved = storage.getItem(key);
    return saved === null ? envelope([]) : parse(saved);
  }

  function update(storage, change) {
    const data = read(storage);
    change(data);
    const text = JSON.stringify(data);
    if (new TextEncoder().encode(text).length > maxBytes) throw new Error('车库已超过保存大小，请先导出备份。');
    const checked = parse(text);
    storage.setItem(key, JSON.stringify(checked));
    return checked;
  }

  function latest(runs) {
    return runs.reduce((last, run) => run.startedAt > last ? run.startedAt : last, '');
  }

  function summarize(data) {
    const result = { trains: data.trains.length, runs: 0, lastRun: '' };
    for (const train of data.trains) {
      result.runs += train.runs.length;
      const recent = latest(train.runs);
      if (recent > result.lastRun) result.lastRun = recent;
    }
    return result;
  }

  function merge(data, incoming) {
    const byId = new Map(data.trains.map(train => [train.id, train]));
    for (const train of incoming.trains) {
      const existing = byId.get(train.id);
      if (!existing) {
        data.trains.push(train);
        continue;
      }
      const seen = new Set(existing.runs.map(run => run.id));
      existing.runs.push(...train.runs.filter(run => !seen.has(run.id)));
    }
  }

  function localInput(instant = new Date()) {
    const date = new Date(instant);
    const pad = part => String(part).padStart(2, '0');
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) + ':' + pad(date.getMinutes());
  }

  function parseRunTime(value) {
    const date = new Date(value);
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) ||
        !Number.isFinite(date.getTime()) || localInput(date) !== value) {
      throw new Error('请选择有效的本地日期和时间。');
    }
    return date.toISOString();
  }

  window.RAIL_GARAGE = { key, maxBytes, envelope, parse, read, update, latest, summarize, merge, localInput, parseRunTime };
})();
