javascript:(() => {

  if (document.getElementById('dfj-host')) {
    document.getElementById('dfj-host').remove();
  }

  const STYLES = `
    :host { all: initial; }
    .dfj-wrap{position:fixed;top:16px;right:16px;z-index:2147483647;font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif}
    .card{background:#fff;border:1px solid #d9e2ec;border-radius:12px;box-shadow:0 10px 28px rgba(0,0,0,.12);padding:14px;min-width:340px}
    .title{font-weight:700;font-size:14px;margin:0 0 8px 0}
    .row{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px}
    .group{border:1px solid #eef2f6;border-radius:10px;padding:8px;margin-top:8px}
    .group legend{font-size:12px;font-weight:600;padding:0 4px;color:#334e68}
    label{font-size:12px;display:inline-flex;align-items:center;gap:6px;margin:4px 8px 4px 0}
    input[type=text],input[type=number]{width:100%;padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-size:12px}
    .actions{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
    button{border:0;border-radius:10px;padding:8px 10px;font-weight:600;cursor:pointer}
    .run{background:#0b69ff;color:#fff}
    .cancel{background:#e2e8f0}
    .tiny{font-size:11px;color:#475569;margin-top:6px}
  `;

  const FT = [
    {key:"pdf", label:"PDF"},
    {key:"ppt", label:"PPT/PPTX"},
    {key:"doc", label:"DOC/DOCX"},
    {key:"xls", label:"XLS/XLSX/CSV"},
    {key:"txt", label:"TXT/XML/RTF"},
  ];
  const ENGS = [
    {key:"google", label:"Google"},
    {key:"bing", label:"Bing"},
    {key:"ddg", label:"DuckDuckGo"},
  ];
  const FT_QUERIES = {
    pdf:"filetype:pdf OR ext:pdf",
    ppt:"filetype:ppt OR ext:ppt OR filetype:pptx OR ext:pptx",
    doc:"filetype:doc OR ext:doc OR filetype:docx OR ext:docx",
    xls:"filetype:xls OR ext:xls OR filetype:xlsx OR ext:xlsx OR filetype:csv OR ext:csv",
    txt:"filetype:txt OR ext:txt OR filetype:xml OR ext:xml OR filetype:rtf OR ext:rtf"
  };
  const ENGINES = {
    google:q=>`https://www.google.com/search?q=${encodeURIComponent(q)}&filter=0`,
    bing:q=>`https://www.bing.com/search?q=${encodeURIComponent(q)}`,
    ddg:q=>`https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
  };

  const STORE_KEY = 'dfj-settings-v3';
  const loadSettings = () => { try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch { return {}; } };
  const saveSettings = (obj) => { try { localStorage.setItem(STORE_KEY, JSON.stringify(obj)); } catch {} };

  const host = document.createElement('div');
  host.id = 'dfj-host';
  const root = host.attachShadow({mode:'closed'});
  const style = document.createElement('style');
  style.textContent = STYLES;
  const wrap = document.createElement('div');
  wrap.className = 'dfj-wrap';
  wrap.innerHTML = `
    <div class="card" role="dialog" aria-label="DocuFinderJS">
      <div class="title">DocuFinderJS — Nov 2025 Update in collab with K2SOsint.</div>
      <div class="row" style="align-items:center">
      Search engine reconnaisance for indexed documents, txt/rtf & MS Office files<br>WSTG Scenario ID: WSTG-INFO-01
      </div>
      <div class="row" style="align-items:center">
        <input type="text" id="domain" placeholder="Target domain (e.g. example.com)" value="example.com" />
        <label style="white-space:nowrap"><input type="checkbox" id="subs" checked> Include wildcard for subdomains</label>
      </div>
      <fieldset class="group">
        <legend>Filetypes</legend>
        <div class="row" id="ftRow"></div>
      </fieldset>
      <fieldset class="group">
        <legend>Search engines</legend>
        <div class="row" id="engRow"></div>
      </fieldset>
      <div class="row" style="margin-top:8px">
        <label style="flex:1 1 48%;">Delay ms
          <input type="number" id="delay" min="0" value="500">
        </label>
        <label style="flex:1 1 48%;">Max tabs (0 = no limit)
          <input type="number" id="maxTabs" min="0" value="0">
        </label>
      </div>
      <div class="tiny">Expands to wildcard subdomains — press Esc to close.</div>
      <div class="actions">
        <button class="run" id="runBtn">Run searches</button>
        <button class="cancel" id="cancelBtn">Cancel</button>
      </div>
    </div>
  `;
  root.appendChild(style);
  root.appendChild(wrap);
  document.body.appendChild(host);

  const $ = sel => root.querySelector(sel);
  const ftRow = $('#ftRow');
  const engRow = $('#engRow');

  function mkCheck(id, checked=true) {
    const i = document.createElement('input');
    i.type = 'checkbox'; i.id = id; i.checked = checked;
    return i;
  }
  FT.forEach(({key,label}) => {
    const lab = document.createElement('label');
    const cb = mkCheck(`ft-${key}`, true);
    cb.dataset.ft = key;
    lab.appendChild(cb); lab.append(label);
    ftRow.appendChild(lab);
  });
  ENGS.forEach(({key,label}) => {
    const lab = document.createElement('label');
    const cb = mkCheck(`eng-${key}`, true);
    cb.dataset.eng = key;
    lab.appendChild(cb); lab.append(label);
    engRow.appendChild(lab);
  });

  const saved = loadSettings();
  if (saved.domain) $('#domain').value = saved.domain;
  if (Number.isFinite(saved.delay)) $('#delay').value = String(saved.delay);
  if (Number.isFinite(saved.maxTabs)) $('#maxTabs').value = String(saved.maxTabs);
  if (typeof saved.includeSubs === 'boolean') $('#subs').checked = !!saved.includeSubs;
  if (Array.isArray(saved.fts)) {
    Array.from(root.querySelectorAll('input[data-ft]')).forEach(i => { i.checked = saved.fts.includes(i.dataset.ft); });
  }
  if (Array.isArray(saved.engs)) {
    Array.from(root.querySelectorAll('input[data-eng]')).forEach(i => { i.checked = saved.engs.includes(i.dataset.eng); });
  }

  function closePanel() { host.remove(); window.removeEventListener('keydown', onKey); }
  function onKey(e){ if(e.key === 'Escape') closePanel(); }
  window.addEventListener('keydown', onKey);

  function buildSiteTargets(domainRaw, includeSubs) {
    const core = domainRaw;
    const targets = new Set([core]);
    if (includeSubs) {
      const common = ["*"];
      common.forEach(s => targets.add(`${s}.${core}`));
    }
    return Array.from(targets);
  }

  function buildUrls(domainRaw, includeSubs, fts, engs) {
    const sites = buildSiteTargets(domainRaw, includeSubs);
    const siteClause = sites.length === 1
      ? `site:${sites[0]}`
      : `(${sites.map(s => 'site:' + s).join(' OR ')})`;

    const urls = [];
    for (const ft of fts) {
      const q = `(${FT_QUERIES[ft]}) ${siteClause}`;
      for (const e of engs) {
        const b = ENGINES[e];
        if (b) urls.push(b(q));
      }
    }
    return urls;
  }

  function currentSelections() {
    const domainRaw = $('#domain').value.trim().replace(/^https?:\/\//i,'').replace(/\/+$/,'');
    const includeSubs = $('#subs').checked;
    const delay = Math.max(0, parseInt($('#delay').value || '500', 10));
    const maxTabs = Math.max(0, parseInt($('#maxTabs').value || '0', 10));
    const fts = Array.from(root.querySelectorAll('input[type=checkbox][data-ft]'))
      .filter(i=>i.checked).map(i=>i.dataset.ft);
    const engs = Array.from(root.querySelectorAll('input[type=checkbox][data-eng]'))
      .filter(i=>i.checked).map(i=>i.dataset.eng);
    return { domainRaw, includeSubs, delay, maxTabs, fts, engs };
  }

  function persist({domainRaw, includeSubs, delay, maxTabs, fts, engs}) {
    saveSettings({ domain: domainRaw, includeSubs, delay, maxTabs, fts, engs });
  }

  function run() {
    try {
      const sel = currentSelections();
      const {domainRaw, includeSubs, delay, maxTabs, fts, engs} = sel;
      if (!domainRaw) { alert('Please enter a domain (e.g., example.com)'); return; }
      if (!fts.length){ alert('Select at least one filetype'); return; }
      if (!engs.length){ alert('Select at least one search engine'); return; }

      persist(sel);

      const urls = buildUrls(domainRaw, includeSubs, fts, engs);
      const list = (maxTabs && maxTabs>0) ? urls.slice(0, maxTabs) : urls;
      if (!list.length) { alert('Nothing to open.'); return; }

      list.forEach((u,i)=>setTimeout(()=>window.open(u,'_blank'), i*delay));
      closePanel();
    } catch (err) {
      alert('DocuFinderJS error: ' + (err && err.message ? err.message : err));
    }
  }

  $('#runBtn').addEventListener('click', run);
  $('#cancelBtn').addEventListener('click', closePanel);
})();
