window.DJARB = window.DJARB || {};

DJARB.sevLabel = { crit: 'Критично', warn: 'Важно', info: 'На заметку' };

DJARB.mergeExtras = function () {
  function merge(baseKey, extraKey) {
    const base = DJARB[baseKey] || [];
    const extra = DJARB[extraKey] || [];
    const ids = new Set(base.map(x => x.id));
    extra.forEach(x => { if (!ids.has(x.id)) base.push(x); });
    DJARB[baseKey] = base;
  }
  merge('VLESS', 'VLESS_EXTRA');
  merge('HAPP', 'HAPP_EXTRA');
  merge('INCY', 'INCY_EXTRA');
};

DJARB.allItems = function () {
  DJARB.mergeExtras();
  const happ = (DJARB.HAPP || []).map(x => Object.assign({}, x, { _app: 'happ', _page: 'happ.html' }));
  const incy = (DJARB.INCY || []).map(x => Object.assign({}, x, { _app: 'incy', _page: 'incy.html' }));
  const vless = (DJARB.VLESS || []).map(x => Object.assign({}, x, { _page: 'vless.html' }));
  return vless.concat(happ, incy);
};

DJARB.groupBy = function (arr, key) {
  const out = {};
  arr.forEach(it => { (out[it[key]] = out[it[key]] || []).push(it); });
  return out;
};

DJARB.itemHtml = function (it) {
  return `
        <div class="item" id="${it.id}">
          <button class="item-head" type="button" data-target="${it.id}">
            <span class="sev sev-${it.sev}" title="${DJARB.sevLabel[it.sev] || ''}"></span>
            <span class="item-head-text">
              <div class="item-title">${it.title}</div>
              <div class="item-symptom">${it.symptom || ''}</div>
            </span>
            <span class="item-code">${it.code || ''}</span>
            <svg class="chevron" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="item-panel">
            <div class="item-panel-inner">
              ${it.log ? `<div class="item-log">${it.log}<button class="copy-btn" type="button" data-copy="${encodeURIComponent(it.log)}">Копировать</button></div>` : ''}
              <dl class="kv">
                <dt>Причина</dt><dd>${it.cause || ''}</dd>
              </dl>
              ${it.plain ? `<div class="plain-note"><b>Простыми словами:</b> ${it.plain}</div>` : ''}
              <ol class="fix-list">
                ${(it.fix || []).map(step => `<li>${step}</li>`).join('')}
              </ol>
            </div>
          </div>
        </div>`;
};

DJARB.renderCatalog = function (containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!items.length) {
    container.innerHTML = '<p class="empty-filter">Ничего не найдено. Сбросьте фильтр или опишите ошибку другими словами.</p>';
    return;
  }
  const groups = DJARB.groupBy(items, 'group');
  let html = '';
  Object.keys(groups).forEach(gName => {
    html += `<div class="cat-group-label">${gName}</div>`;
    groups[gName].forEach(it => { html += DJARB.itemHtml(it); });
  });
  container.innerHTML = html;
};

DJARB.bindCatalogOnce = function () {
  if (DJARB._catalogBound) return;
  DJARB._catalogBound = true;
  document.body.addEventListener('click', function (e) {
    const head = e.target.closest('.item-head');
    if (head) {
      const item = document.getElementById(head.dataset.target);
      if (!item) return;
      const panel = item.querySelector('.item-panel');
      const wasOpen = item.classList.contains('open');
      const parent = item.parentElement;
      parent.querySelectorAll('.item.open').forEach(o => {
        if (o !== item) {
          o.classList.remove('open');
          const p = o.querySelector('.item-panel');
          if (p) p.style.maxHeight = null;
        }
      });
      if (wasOpen) {
        item.classList.remove('open');
        panel.style.maxHeight = null;
      } else {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
      return;
    }
    const copyBtn = e.target.closest('.copy-btn');
    if (copyBtn) {
      const txt = decodeURIComponent(copyBtn.dataset.copy);
      navigator.clipboard && navigator.clipboard.writeText(txt).then(() => {
        const orig = copyBtn.textContent;
        copyBtn.textContent = 'Скопировано';
        setTimeout(() => copyBtn.textContent = orig, 1400);
      }).catch(() => {});
    }
  });
};

DJARB.openAndScroll = function (id) {
  const item = document.getElementById(id);
  if (!item) return;
  document.querySelectorAll('.item.open').forEach(o => {
    o.classList.remove('open');
    const p = o.querySelector('.item-panel');
    if (p) p.style.maxHeight = null;
  });
  item.classList.add('open');
  const panel = item.querySelector('.item-panel');
  if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
  item.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

DJARB.mountFilter = function (inputId, countId, containerId, items) {
  const input = document.getElementById(inputId);
  const count = document.getElementById(countId);
  let activeSevFilter = null;
  
  function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
  }
  
  function apply() {
    const q = (input && input.value || '').trim().toLowerCase();
    const filtered = items.filter(it => {
      // Severity filter
      if (activeSevFilter && it.sev !== activeSevFilter) return false;
      
      // Text search
      if (!q) return true;
      const hay = [it.title, it.symptom, it.cause, it.plain, it.log, it.code, it.group, (it.fix || []).join(' ')].join(' ').toLowerCase();
      return hay.includes(q);
    });
    
    DJARB.renderCatalog(containerId, filtered, q);
    if (count) count.textContent = filtered.length + ' из ' + items.length;
    
    if (location.hash) {
      const id = location.hash.slice(1);
      if (document.getElementById(id)) DJARB.openAndScroll(id);
    }
  }
  
  // Enhanced render with highlighting
  const originalRender = DJARB.renderCatalog;
  DJARB.renderCatalog = function(containerId, items, query = '') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!items.length) {
      container.innerHTML = `
        <div class="no-results">
          <svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <h4>Ничего не найдено</h4>
          <p>Попробуйте другие ключевые слова или сбросьте фильтры</p>
        </div>`;
      return;
    }
    
    const groups = DJARB.groupBy(items, 'group');
    let html = '';
    Object.keys(groups).forEach(gName => {
      html += `<div class="cat-group-label">${gName}</div>`;
      groups[gName].forEach(it => { 
        const highlightedItem = {...it};
        if (query) {
          highlightedItem.title = highlightMatch(it.title, query);
          highlightedItem.symptom = highlightMatch(it.symptom || '', query);
          highlightedItem.code = highlightMatch(it.code || '', query);
        }
        html += DJARB.itemHtml(highlightedItem);
      });
    });
    container.innerHTML = html;
  };
  
  DJARB.bindCatalogOnce();
  if (input) input.addEventListener('input', apply);
  apply();
  
  // Reset function
  DJARB.resetFilter = function() {
    if (input) input.value = '';
    activeSevFilter = null;
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    apply();
  };
  
  // Severity filter
  DJARB.setSeverityFilter = function(sev) {
    activeSevFilter = sev === activeSevFilter ? null : sev;
    apply();
  };
  
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (id && document.getElementById(id)) DJARB.openAndScroll(id);
  });
};

DJARB.renderSteps = function (containerId, steps) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = (steps || []).map((s, i) => `
      <div class="step-seq-item">
        <div class="step-num">${i + 1}</div>
        <div class="step-body">
          <h4>${s.title}</h4>
          <p>${s.text}</p>
        </div>
      </div>`).join('');
};
