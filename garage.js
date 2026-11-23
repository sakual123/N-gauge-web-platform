(() => {
  'use strict';

  const store = window.RAIL_GARAGE;
  const get = id => document.getElementById(id);
  const trainDialog = get('train-dialog');
  const runDialog = get('run-dialog');
  const importDialog = get('import-dialog');
  const trainForm = get('train-form');
  const runForm = get('run-form');
  const fileInput = get('garage-file');
  const search = get('train-search');
  const list = get('train-list');
  const status = get('garage-status');
  const openHistory = new Set();
  const clock = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  });
  let data = store.envelope([]);
  let editing = null;
  let pendingImport = null;
  let importRequest = 0;

  function message(text, error = false) {
    status.textContent = text;
    status.toggleAttribute('data-error', error);
  }

  function node(tag, text = '', className = '') {
    const el = document.createElement(tag);
    el.textContent = text;
    if (className) el.className = className;
    return el;
  }

  function button(text, onClick, className) {
    const el = node('button', text, className);
    el.type = 'button';
    el.addEventListener('click', onClick);
    return el;
  }

  function newId() {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes, part => part.toString(16).padStart(2, '0')).join('');
  }

  function lookup(current, id) {
    const train = current.trains.find(item => item.id === id);
    if (!train) throw new Error('这列车已从车库移除。');
    return train;
  }

  function write(change, success) {
    data = store.update(localStorage, change);
    render();
    message(success);
  }

  function changeOrReport(change, success) {
    try { write(change, success); }
    catch (error) { message(explain(error), true); }
  }

  function explain(error) {
    if (['QuotaExceededError', 'SecurityError'].includes(error.name)) return '浏览器无法保存本次修改。请检查存储设置或空间。';
    return error.message || '保存失败，请重试。';
  }

  function showForm(dialog, form, values) {
    form.reset();
    form.querySelector('.form-status').textContent = '';
    for (const [key, value] of Object.entries(values)) form.elements.namedItem(key).value = value ?? '';
    dialog.showModal();
  }

  function editTrain(train) {
    editing = train ? { trainId: train.id } : null;
    get('train-form-title').textContent = train ? '编辑购车记录' : '添加列车';
    const values = train ? {
      name: train.name, sku: train.sku, purchaseDate: train.purchaseDate, currency: train.currency,
      price: train.price === null ? '' : (train.price / 100).toFixed(2), note: train.note
    } : {};
    showForm(trainDialog, trainForm, values);
  }

  function editRun(train, run) {
    editing = { trainId: train.id, runId: run?.id };
    get('run-form-title').textContent = run ? '编辑跑车记录' : '记录跑车';
    get('run-train-name').textContent = train.name;
    showForm(runDialog, runForm, {
      startedAt: store.localInput(run?.startedAt ?? new Date()), minutes: run?.minutes, note: run?.note ?? ''
    });
  }

  function dateTime(value) {
    if (!value) return node('span', '暂无记录');
    const el = node('time', clock.format(new Date(value)));
    el.dateTime = value;
    return el;
  }

  function metric(label, value) {
    const group = node('div');
    const description = node('dd');
    description.append(value);
    group.append(node('dt', label), description);
    return group;
  }

  function historyRow(train, run) {
    const row = node('li', '', 'run-row');
    const detail = node('div');
    detail.append(dateTime(run.startedAt));
    if (run.minutes !== null) detail.append(document.createTextNode(' · ' + run.minutes + ' 分钟'));
    if (run.note) detail.append(node('p', run.note, 'run-note'));
    const actions = node('div', '', 'actions');
    actions.append(button('编辑', () => editRun(train, run)), button('删除', () => {
      if (!confirm('删除这次跑车记录？')) return;
      changeOrReport(current => {
        const target = lookup(current, train.id);
        target.runs = target.runs.filter(item => item.id !== run.id);
      }, '已删除跑车记录。');
    }, 'danger'));
    row.append(detail, actions);
    return row;
  }

  function trainCard(train) {
    const card = node('article', '', 'train-card');
    const head = node('div', '', 'train-head');
    const title = node('div');
    title.append(node('h2', train.name));
    if (train.sku) title.append(node('p', '品号 ' + train.sku, 'sku'));
    const actions = node('div', '', 'actions');
    actions.append(
      button('记录跑车', () => editRun(train), 'primary'),
      button('编辑购车', () => editTrain(train))
    );
    head.append(title, actions);
    const metadata = node('dl', '', 'train-meta');
    const price = train.price === null ? '未填写' :
      new Intl.NumberFormat('zh-CN', { style: 'currency', currency: train.currency, currencyDisplay: 'code', minimumFractionDigits: 2 }).format(train.price / 100);
    metadata.append(
      metric('购买日期', train.purchaseDate || '未填写'),
      metric('购买价格', price),
      metric('最近一次跑车', dateTime(store.latest(train.runs))),
      metric('累计次数', train.runs.length + ' 次')
    );
    card.append(head, metadata);
    if (train.note) card.append(node('p', train.note, 'train-note'));

    const history = node('details', '', 'history');
    history.open = openHistory.has(train.id);
    history.addEventListener('toggle', () => {
      if (history.open) openHistory.add(train.id);
      else openHistory.delete(train.id);
    });
    history.append(node('summary', '跑车历史 · ' + train.runs.length + ' 条'));
    if (train.runs.length) {
      const entries = node('ol');
      const sorted = [...train.runs].sort((a, b) => b.startedAt.localeCompare(a.startedAt));
      entries.append(...sorted.map(run => historyRow(train, run)));
      history.append(entries);
    } else history.append(node('p', '还没有跑车记录。'));
    history.append(button('移除列车', () => {
      if (!confirm('从车库移除「' + train.name + '」及其全部跑车记录？')) return;
      changeOrReport(current => {
        current.trains = current.trains.filter(item => item.id !== train.id);
      }, '已移除列车。');
    }, 'danger'));
    card.append(history);
    return card;
  }

  function render() {
    const totals = store.summarize(data);
    get('train-count').textContent = totals.trains + ' 列';
    get('run-count').textContent = totals.runs + ' 次';
    get('last-run').replaceChildren(dateTime(totals.lastRun));
    get('search-field').hidden = !data.trains.length;
    if (!data.trains.length) search.value = '';
    const matchText = value => value.trim().normalize('NFKC').toLowerCase();
    const query = matchText(search.value);
    const matches = data.trains.filter(train => matchText([train.name, train.sku, train.note].join(' ')).includes(query));
    if (matches.length) list.replaceChildren(...matches.map(trainCard));
    else list.replaceChildren(node('p', data.trains.length ? '没有符合的列车。' : '车库还是空的。添加一列，开始记录购车与跑车。', 'empty'));
  }

  function submit(form, dialog, action) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      try {
        action(new FormData(form));
        dialog.close();
      } catch (error) {
        form.querySelector('.form-status').textContent = explain(error);
      }
    });
  }

  submit(trainForm, trainDialog, fields => {
    const name = fields.get('name').trim();
    if (!name) throw new Error('请输入车名。');
    const price = fields.get('price');
    const values = {
      name,
      sku: fields.get('sku').trim(),
      purchaseDate: fields.get('purchaseDate'),
      price: price === '' ? null : Math.round(Number(price) * 100),
      currency: fields.get('currency'),
      note: fields.get('note').trim()
    };
    write(current => {
      if (editing) Object.assign(lookup(current, editing.trainId), values);
      else current.trains.unshift({ id: newId(), ...values, runs: [] });
    }, '已保存购车记录。');
  });

  submit(runForm, runDialog, fields => {
    const { trainId, runId } = editing;
    const minutes = fields.get('minutes');
    const values = {
      startedAt: store.parseRunTime(fields.get('startedAt')),
      minutes: minutes === '' ? null : Number(minutes),
      note: fields.get('note').trim()
    };
    openHistory.add(trainId);
    write(current => {
      const train = lookup(current, trainId);
      if (!runId) train.runs.push({ id: newId(), ...values });
      else {
        const run = train.runs.find(item => item.id === runId);
        if (!run) throw new Error('这条跑车记录已被删除。');
        Object.assign(run, values);
      }
    }, '已保存跑车记录。');
  });

  get('export-garage').addEventListener('click', () => {
    try {
      const saved = store.read(localStorage);
      const url = URL.createObjectURL(new Blob([JSON.stringify(saved)], { type: 'application/json' }));
      const download = node('a');
      download.href = url;
      download.download = 'model-station-garage-' + store.localInput().slice(0, 10) + '.json';
      document.body.append(download);
      download.click();
      download.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      message('车库备份已生成。');
    } catch (error) { message(explain(error), true); }
  });

  get('import-garage').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    fileInput.value = '';
    if (!file) return;
    const request = ++importRequest;
    try {
      if (file.size > store.maxBytes) throw new Error('请选择 4 MB 以内的车库备份。');
      const incoming = store.parse(await file.text());
      if (request !== importRequest) return;
      pendingImport = incoming;
      const totals = store.summarize(incoming);
      get('import-summary').textContent = '备份包含 ' + totals.trains + ' 列车和 ' + totals.runs + ' 条跑车记录。';
      importDialog.querySelector('.form-status').textContent = '';
      importDialog.showModal();
    } catch (error) {
      if (request === importRequest) message(explain(error), true);
    }
  });
  submit(get('import-form'), importDialog, () => {
    write(current => store.merge(current, pendingImport), '车库备份已合并。');
  });
  importDialog.addEventListener('close', () => { pendingImport = null; });
  document.querySelectorAll('[data-cancel]').forEach(el => el.addEventListener('click', () => el.closest('dialog').close()));
  get('add-train').addEventListener('click', () => editTrain());
  search.addEventListener('input', render);

  function refresh() {
    try {
      data = store.read(localStorage);
      render();
    } catch (error) {
      render();
      message('暂时无法读取此浏览器的车库。' + explain(error), true);
    }
  }
  window.addEventListener('storage', event => { if (event.key === store.key || event.key === null) refresh(); });
  window.addEventListener('pageshow', event => { if (event.persisted) refresh(); });
  refresh();
})();
