/* ============================================================
   DJARB VPN Support — mobile UX layer
   Самостоятельный модуль: подключается на каждой странице после
   layout.js. Ничего не ломает, если отдельные части отсутствуют.
   ============================================================ */
(function () {
  'use strict';
  window.DJARB = window.DJARB || {};
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
  const LS = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const BOT_URL = 'https://t.me/djarbvpnbot';

  /* ---------- тост ---------- */
  function toast(msg) {
    let el = $('.cp-toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'cp-toast';
      el.innerHTML = '<span></span>';
      document.body.appendChild(el);
    }
    el.querySelector('span').textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('show'), 2200);
  }
  DJARB.toast = toast;

  /* ---------- нижняя навигация ---------- */
  const ICONS = {
    home: '<path d="M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    fix: '<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94z"/>',
    vless: '<path d="M12 3l10 18H2L12 3z"/><path d="M12 10v5M12 18h.01"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>'
  };
  function buildBottomNav() {
    if ($('.bnav') || !$('#siteContent')) return;
    const page = document.body.dataset.page || '';
    const items = [
      { id: 'home', href: 'index.html', label: 'Главная' },
      { id: 'search', href: 'diag.html', label: 'Диагностика' },
      { id: 'fix', href: 'fix.html', label: 'Решения' },
      { id: 'vless', href: 'vless.html', label: 'Ошибки' }
    ];
    const svg = n => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[n] + '</svg>';
    const nav = document.createElement('nav');
    nav.className = 'bnav';
    nav.setAttribute('aria-label', 'Быстрая навигация');
    nav.innerHTML = items.map(i =>
      '<a href="' + i.href + '"' + (i.id === page ? ' class="active" aria-current="page"' : '') + '>' + svg(i.id) + '<span class="lbl">' + i.label + '</span></a>'
    ).join('') + '<button type="button" id="bnavMenu" aria-label="Открыть меню">' + svg('menu') + '<span class="lbl">Меню</span></button>';
    document.body.appendChild(nav);
    $('#bnavMenu').addEventListener('click', () => { const b = $('#burgerBtn'); if (b) b.click(); });

    // клавиатура на телефоне: прячем панель, чтобы не перекрывала поле ввода
    const isField = t => t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
    document.addEventListener('focusin', e => { if (isField(e.target)) nav.classList.add('hide'); });
    document.addEventListener('focusout', () => setTimeout(() => { if (!isField(document.activeElement)) nav.classList.remove('hide'); }, 80));
    // при открытом меню панель не нужна
    const mm = $('#mobileMenu');
    if (mm && 'MutationObserver' in window) {
      new MutationObserver(() => nav.classList.toggle('hide', mm.classList.contains('open')))
        .observe(mm, { attributes: true, attributeFilter: ['class'] });
    }
  }

  /* ---------- «Наверх» ---------- */
  function buildToTop() {
    if ($('.to-top')) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'to-top';
    b.setAttribute('aria-label', 'Наверх');
    b.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    b.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(b);
    let tick = false;
    window.addEventListener('scroll', () => {
      if (tick) return; tick = true;
      requestAnimationFrame(() => { b.classList.toggle('show', window.scrollY > 700); tick = false; });
    }, { passive: true });
  }

  /* ---------- баннер сети и ошибок ---------- */
  function banner(html, kind, sticky) {
    let el = $('.net-banner');
    if (!el) {
      el = document.createElement('div');
      el.className = 'net-banner';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.className = 'net-banner' + (kind ? ' ' + kind : '');
    el.innerHTML = '<span aria-hidden="true">' + (kind === 'ok' ? '✅' : '⚠️') + '</span><div>' + html + '</div><button type="button" aria-label="Закрыть">×</button>';
    el.querySelector('button').onclick = () => el.classList.remove('show');
    requestAnimationFrame(() => el.classList.add('show'));
    clearTimeout(banner._t);
    if (!sticky) banner._t = setTimeout(() => el.classList.remove('show'), 4000);
  }
  function bindNetwork() {
    window.addEventListener('offline', () => banner('<b>Нет интернета</b>Раздел «Решения» и ранее открытые страницы доступны из кеша.', '', true));
    window.addEventListener('online', () => banner('<b>Связь восстановлена</b>', 'ok'));
    if (navigator.onLine === false) window.dispatchEvent(new Event('offline'));
  }
  function bindErrors() {
    let shown = false;
    const report = () => {
      if (shown) return; shown = true;
      banner('<b>Что-то пошло не так</b>Страница могла загрузиться не полностью. <a href="" onclick="location.reload();return false" style="color:var(--accent);font-weight:700">Обновить</a>', '', true);
    };
    window.addEventListener('error', e => {
      // ошибки загрузки наших скриптов/стилей — это уже поломка страницы
      const t = e.target;
      if (t && (t.tagName === 'SCRIPT' || t.tagName === 'LINK') && (t.src || t.href || '').indexOf(location.origin) === 0) report();
    }, true);
    window.addEventListener('unhandledrejection', () => {});
    window.addEventListener('error', e => { if (e.message && !e.target.tagName) setTimeout(() => { const m = $('#page, main'); if (m && m.textContent.trim().length < 40) report(); }, 1500); });
  }

  /* ---------- метки колонок таблиц (для карточек на телефоне) ---------- */
  function labelTables() {
    $$('.reco-table').forEach(t => {
      const heads = $$('thead th', t).map(th => th.textContent.trim());
      $$('tbody tr', t).forEach(tr => $$('td', tr).forEach((td, i) => { if (heads[i] && !td.dataset.label) td.dataset.label = heads[i]; }));
    });
  }

  /* ---------- карточки ошибок: шаги, прогресс, «помогло» ---------- */
  const STEPS_KEY = 'djarb_steps_v1';
  const FB_KEY = 'djarb_feedback_v1';

  function ensureProgress(item) {
    const ol = $('.fix-list', item);
    if (!ol || $('.item-progress', item)) { updateProgress(item); return; }
    const p = document.createElement('div');
    p.className = 'item-progress';
    p.innerHTML = '<span class="txt"></span><div class="bar"><i></i></div>';
    ol.parentNode.insertBefore(p, ol);
    const saved = (LS.get(STEPS_KEY, {}))[item.id] || [];
    $$('li', ol).forEach((li, i) => { if (saved.indexOf(i) !== -1) li.classList.add('step-done'); });
    const fb = (LS.get(FB_KEY, {}))[item.id];
    if (fb) markFeedback(item, fb, true);
    updateProgress(item);
  }
  function updateProgress(item) {
    const lis = $$('.fix-list li', item);
    const done = lis.filter(l => l.classList.contains('step-done')).length;
    const txt = $('.item-progress .txt', item);
    const bar = $('.item-progress .bar i', item);
    if (txt) txt.textContent = done + ' из ' + lis.length;
    if (bar) bar.style.width = (lis.length ? done / lis.length * 100 : 0) + '%';
  }
  function saveSteps(item) {
    const all = LS.get(STEPS_KEY, {});
    all[item.id] = $$('.fix-list li', item).map((l, i) => l.classList.contains('step-done') ? i : -1).filter(i => i >= 0);
    if (!all[item.id].length) delete all[item.id];
    LS.set(STEPS_KEY, all);
  }
  function markFeedback(item, val, silent) {
    const row = $('.item-actions', item);
    if (!row) return;
    $$('[data-act="yes"],[data-act="no"]', row).forEach(b => b.classList.toggle('on', b.dataset.act === val));
    const p = $('.item-feedback', row);
    if (!p) return;
    if (val === 'yes') {
      p.innerHTML = 'Отлично! Если проблема вернётся — эта инструкция всегда здесь.';
    } else {
      p.innerHTML = 'Попробуйте <a href="diag.html">описать проблему в диагностике</a> или <a href="' + BOT_URL + '" target="_blank" rel="noopener">написать в бота поддержки</a> — приложите скриншот и название приложения.';
    }
    p.hidden = false;
    if (!silent) resizePanel(item);
  }
  function resizePanel(item) {
    const panel = $('.item-panel', item);
    if (panel && item.classList.contains('open')) panel.style.maxHeight = panel.scrollHeight + 'px';
  }
  function bindItems() {
    document.addEventListener('click', e => {
      const head = e.target.closest('.item-head');
      if (head) { const it = document.getElementById(head.dataset.target); if (it) setTimeout(() => { if (it.classList.contains('open')) { ensureProgress(it); resizePanel(it); } }, 30); return; }

      const li = e.target.closest('.fix-list li');
      if (li) {
        const sel = window.getSelection && String(window.getSelection());
        if (sel) return;                       // человек выделяет текст — не отмечаем
        if (e.target.closest('a,button,code')) return;
        const item = li.closest('.item'); if (!item) return;
        li.classList.toggle('step-done');
        if (navigator.vibrate) { try { navigator.vibrate(8); } catch (x) {} }
        saveSteps(item); updateProgress(item);
        return;
      }

      const btn = e.target.closest('.item-actions [data-act]');
      if (btn) {
        const item = btn.closest('.item'); if (!item) return;
        const act = btn.dataset.act;
        if (act === 'link') {
          const url = location.origin + location.pathname + '#' + item.id;
          const title = ($('.item-title', item) || {}).textContent || 'DJARB VPN';
          if (navigator.share) { navigator.share({ title: title, url: url }).catch(() => {}); return; }
          if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => toast('Ссылка скопирована'), () => toast(url));
          else toast(url);
          return;
        }
        const all = LS.get(FB_KEY, {}); all[item.id] = act; LS.set(FB_KEY, all);
        markFeedback(item, act);
      }
    });

    // высота раскрытых панелей при повороте экрана / смене шрифта
    const fix = () => $$('.item.open').forEach(resizePanel);
    window.addEventListener('resize', fix);
    window.addEventListener('orientationchange', () => setTimeout(fix, 250));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fix);
  }

  /* ---------- быстрые переходы по группам ---------- */
  function buildGroupJump() {
    $$('[id$="Catalog"]').forEach(container => {
      if (container.dataset.jump) return;
      container.dataset.jump = '1';
      const bar = document.createElement('div');
      bar.className = 'group-jump';
      bar.setAttribute('role', 'navigation');
      bar.setAttribute('aria-label', 'Группы ошибок');
      container.parentNode.insertBefore(bar, container);
      const build = () => {
        const labels = $$('.cat-group-label', container);
        if (labels.length < 3) { bar.style.display = 'none'; return; }
        bar.style.display = '';
        bar.innerHTML = labels.map((l, i) => '<button type="button" data-i="' + i + '">' + l.textContent + '</button>').join('');
      };
      bar.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        const l = $$('.cat-group-label', container)[+b.dataset.i];
        if (!l) return;
        $$('button', bar).forEach(x => x.classList.toggle('on', x === b));
        const off = (document.querySelector('header.nav') || { offsetHeight: 64 }).offsetHeight + (window.innerWidth < 641 ? 120 : 20);
        window.scrollTo({ top: l.getBoundingClientRect().top + window.scrollY - off, behavior: 'smooth' });
      });
      build();
      if ('MutationObserver' in window) new MutationObserver(build).observe(container, { childList: true });
    });
  }

  /* ---------- меню: свайп вправо закрывает ---------- */
  function bindMenuSwipe() {
    const mm = $('#mobileMenu'); if (!mm) return;
    let x0 = null, y0 = null;
    mm.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    mm.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = Math.abs(e.changedTouches[0].clientY - y0);
      if (dx > 70 && dy < 50) { const b = $('#burgerBtn'); if (b && mm.classList.contains('open')) b.click(); }
      x0 = null;
    }, { passive: true });
    window.addEventListener('resize', () => { if (window.innerWidth > 900 && mm.classList.contains('open')) { const b = $('#burgerBtn'); if (b) b.click(); } });
  }

  /* ---------- цвет системной строки браузера ---------- */
  function syncThemeColor() {
    let m = $('meta[name="theme-color"]:not([media])');
    if (!m) { m = document.createElement('meta'); m.name = 'theme-color'; document.head.appendChild(m); }
    const apply = () => { const c = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim(); if (c) m.content = c; };
    apply();
    const btn = $('#themeBtn');
    if (btn) btn.addEventListener('click', () => setTimeout(apply, 30));
    if (window.matchMedia) { try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', apply); } catch (e) {} }
  }

  /* ---------- service worker ---------- */
  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    if (!(location.protocol === 'https:' || location.hostname === 'localhost')) return;
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }

  function init() {
    buildBottomNav(); buildToTop(); bindNetwork(); bindErrors(); labelTables();
    bindItems(); buildGroupJump(); bindMenuSwipe(); syncThemeColor(); registerSW();
    // если каталог уже раскрыт по ссылке #id — подготовим прогресс
    if (location.hash) setTimeout(() => { const it = document.getElementById(location.hash.slice(1)); if (it && it.classList.contains('item')) ensureProgress(it); }, 400);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
