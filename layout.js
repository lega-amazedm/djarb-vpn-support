window.DJARB = window.DJARB || {};

/* ============================================================
   DJARB.initLayout(opts)
   Builds the shared page shell around whatever markup the page
   itself provides. Each page's <body> only needs:

     <body data-page="fix">
       <div id="djarbLoginGate"></div>
       <div id="siteContent">
         <div id="djarbHeader"></div>
         <div id="djarbMobileMenu"></div>
         <main class="page-main">
           <div class="wrap">
             <div id="page">
               ... page-specific content ...
             </div>
           </div>
         </main>
         <div id="djarbFooter"></div>
       </div>
       <script src="config.js"></script>
       <script src="auth.js"></script>
       <script src="catalog.js"></script>
       <script src="layout.js"></script>
       <script>DJARB.initLayout({page:'fix'});</script>
       ... page bootstrap script ...
     </body>

   opts.page must match one of DJARB.NAV[].id so the right nav
   link gets the "active" state.
   ============================================================ */

DJARB.loginGateHtml = function () {
  return `
  <div id="loginGate">
    <div class="grid-field" aria-hidden="true"></div>
    <div class="lg-card">
      <div class="lg-brand">
        <div class="brand-mark">DJ</div>
        <div>
          <div style="font-family:var(--font-display); font-weight:700;">DJARB VPN</div>
          <small style="color:var(--text-dim); font-size:.7rem;">Поддержка</small>
        </div>
      </div>
      <p class="lg-title">Вход</p>
      <p class="lg-sub">Введите логин и пароль для доступа к странице поддержки.</p>
      <form id="lgForm" autocomplete="off">
        <div class="lg-field">
          <label for="lgUser">Логин</label>
          <input type="text" id="lgUser" name="lgUser" autocomplete="username" required>
        </div>
        <div class="lg-field">
          <label for="lgPass">Пароль</label>
          <input type="password" id="lgPass" name="lgPass" autocomplete="current-password" required>
        </div>
        <p class="lg-error" id="lgError">Неверный логин или пароль</p>
        <button type="submit" class="lg-btn" id="lgSubmit">Войти</button>
      </form>
      <p class="lg-hint">Доступ ограничен. Обратитесь к администратору, если у вас нет данных для входа.</p>
    </div>
  </div>`;
};

DJARB.headerHtml = function (activePage) {
  const links = (DJARB.NAV || []).map(item =>
    `<a href="${item.href}"${item.id === activePage ? ' class="active"' : ''}>${item.label}</a>`
  ).join('\n      ');
  return `
  <header class="nav">
    <div class="wrap nav-inner">
      <a class="brand" href="index.html" style="text-decoration:none;">
        <span class="brand-mark">D</span>
        <span>DJARB<br><small>VPN Support</small></span>
      </a>
      <nav class="links">
      ${links}
      </nav>
      <div class="nav-actions">
        <div class="status-pill"><span class="status-dot"></span> Поддержка на связи</div>
        <button class="theme-btn" id="themeBtn" type="button" aria-label="Переключить тему">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.6"/></svg>
        </button>
        <button class="logout-btn" type="button" data-logout title="Выйти из аккаунта">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 4h3a2 2 0 012 2v12a2 2 0 01-2 2h-3M10 17l-5-5 5-5M5 12h11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Выйти
        </button>
        <button class="burger" id="burgerBtn" aria-label="Открыть меню" aria-expanded="false" aria-controls="mobileMenu">
          <svg class="icon-menu" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <svg class="icon-close" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>
  </header>`;
};

DJARB.mobileMenuHtml = function (activePage) {
  const links = (DJARB.NAV || []).map(item =>
    `<a href="${item.href}"${item.id === activePage ? ' class="active"' : ''}><span>${item.label}</span><span class="arrow">→</span></a>`
  ).join('\n    ');
  return `
  <div class="mobile-menu" id="mobileMenu">
    <div class="mobile-menu-inner">
    ${links}
      <div class="mm-pill status-pill"><span class="status-dot"></span> Поддержка на связи</div>
      <button class="logout-btn" type="button" data-logout>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 4h3a2 2 0 012 2v12a2 2 0 01-2 2h-3M10 17l-5-5 5-5M5 12h11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Выйти из аккаунта
      </button>
    </div>
  </div>`;
};

DJARB.footerHtml = function () {
  const links = (DJARB.NAV || []).filter(i => i.id !== 'home').map(item =>
    `<a href="${item.href}">${item.label}</a>`
  ).join('\n      ');
  return `
  <footer>
    <div class="wrap foot-inner">
      <p>© DJARB VPN · Поддержка и диагностика</p>
      <div class="foot-links">
      ${links}
      </div>
    </div>
  </footer>`;
};

DJARB.crumbHtml = function (title) {
  if (!title) return '';
  return `<div class="crumb"><a href="index.html">Главная</a><span class="sep">/</span><span>${title}</span></div>`;
};

/* ---------------- theme toggle ---------------- */
DJARB.bindTheme = function () {
  const btn = document.getElementById('themeBtn');
  function apply(theme) {
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }
  let saved = null;
  try { saved = localStorage.getItem(DJARB.THEME_KEY); } catch (e) {}
  if (saved) apply(saved);
  if (btn) {
    btn.addEventListener('click', function () {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const current = document.documentElement.getAttribute('data-theme') || (prefersDark ? 'dark' : 'light');
      const next = current === 'dark' ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem(DJARB.THEME_KEY, next); } catch (e) {}
    });
  }
};

/* ---------------- mobile menu + burger ---------------- */
DJARB.bindMobileMenu = function () {
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!burgerBtn || !mobileMenu) return;
  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    burgerBtn.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded', 'false');
  }
  burgerBtn.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burgerBtn.classList.toggle('open', open);
    burgerBtn.setAttribute('aria-expanded', String(open));
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));
};

/* ---------------- honest client-side content protection ----------------
   Blocks context menu, selection, image dragging and a few common
   "quick" devtools shortcuts. This is a barrier against casual/bulk
   copying, not real protection — all HTML/CSS/JS is always reachable
   via the browser's own view-source. */
DJARB.bindContentProtection = function () {
  let toastEl = document.querySelector('.cp-toast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'cp-toast';
    toastEl.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/></svg><span></span>`;
    document.body.appendChild(toastEl);
  }
  let toastTimer = null;
  function showToast(msg) {
    toastEl.querySelector('span').textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    showToast('Копирование содержимого сайта запрещено');
  });
  document.addEventListener('selectstart', function (e) {
    if (e.target.closest('input, textarea, [contenteditable="true"]')) return;
    e.preventDefault();
  });
  document.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'IMG') e.preventDefault();
  });
  document.addEventListener('keydown', function (e) {
    const k = e.key;
    if (k === 'F12') { e.preventDefault(); showToast('Инструменты разработчика отключены'); return; }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(k)) {
      e.preventDefault(); showToast('Инструменты разработчика отключены'); return;
    }
    if ((e.ctrlKey || e.metaKey) && ['u', 'U', 's', 'S'].includes(k)) {
      e.preventDefault(); showToast('Сохранение и просмотр кода страницы отключены');
    }
  });
};

/* ---------------- tabs / subtabs / device tabs (generic, reused on any page) ---------------- */
DJARB.bindTabs = function () {
  document.querySelectorAll('.tabbar').forEach(bar => {
    const scope = bar.closest('section') || bar.parentElement;
    bar.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        bar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        scope.querySelectorAll(':scope > .wrap > .tab-panel, .tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById('tab-' + btn.dataset.tab);
        if (target) target.classList.add('active');
      });
    });
  });

  document.querySelectorAll('.subtabbar').forEach(bar => {
    bar.querySelectorAll('.subtab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const scope = bar.closest('.tab-panel') || bar.parentElement;
        scope.querySelectorAll('.subtab-btn').forEach(b => b.classList.remove('active'));
        scope.querySelectorAll('.subtab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = scope.querySelector(`.subtab-panel[data-subtab="${btn.dataset.subtab}"]`);
        if (target) target.classList.add('active');
      });
    });
  });

  document.querySelectorAll('.device-tabbar').forEach(bar => {
    const scope = bar.closest('section') || bar.parentElement;
    const prefix = bar.dataset.section || (bar.closest('section') && bar.closest('section').id) || '';
    bar.querySelectorAll('.device-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        bar.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
        scope.querySelectorAll('.device-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById(prefix + '-' + btn.dataset.device);
        if (target) target.classList.add('active');
      });
    });
  });
};

/* ---------------- reveal-on-scroll + scrolled nav shadow ---------------- */
DJARB.bindScrollFx = function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObs.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
  }

  const navHeader = document.querySelector('header.nav');
  const onScrollNav = () => { if (navHeader) navHeader.classList.toggle('scrolled', window.scrollY > 8); };
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });
};

/* ---------------- decorative background ---------------- */
DJARB.bgHtml = function () {
  return `
  <div class="grid-field" aria-hidden="true"></div>
  <div class="glow-orb glow-1" aria-hidden="true"></div>
  <div class="glow-orb glow-2" aria-hidden="true"></div>
  <div class="glow-orb glow-3" aria-hidden="true"></div>`;
};

/* ---------------- entry point ---------------- */
DJARB.initLayout = function (opts) {
  opts = opts || {};
  const page = opts.page || document.body.dataset.page || '';

  if (opts.title) document.title = opts.title;

  const skip = document.createElement('a');
  skip.href = '#page';
  skip.className = 'skip-link';
  skip.textContent = 'Перейти к содержимому';
  document.body.insertBefore(skip, document.body.firstChild);

  const gateSlot = document.getElementById('djarbLoginGate');
  if (gateSlot) gateSlot.outerHTML = DJARB.loginGateHtml();

  const content = document.getElementById('siteContent');
  if (content) content.insertAdjacentHTML('afterbegin', DJARB.bgHtml());

  const headerSlot = document.getElementById('djarbHeader');
  if (headerSlot) headerSlot.outerHTML = DJARB.headerHtml(page);

  const mmSlot = document.getElementById('djarbMobileMenu');
  if (mmSlot) mmSlot.outerHTML = DJARB.mobileMenuHtml(page);

  const footSlot = document.getElementById('djarbFooter');
  if (footSlot) footSlot.outerHTML = DJARB.footerHtml();

  if (opts.crumb !== false) {
    const pageSlot = document.getElementById('page');
    if (pageSlot && opts.crumbTitle) {
      pageSlot.insertAdjacentHTML('afterbegin', DJARB.crumbHtml(opts.crumbTitle));
    }
  }

  if (typeof DJARB.bindAuth === 'function') DJARB.bindAuth();
  DJARB.bindTheme();
  DJARB.bindMobileMenu();
  DJARB.bindTabs();
  DJARB.bindScrollFx();
  DJARB.bindContentProtection();
};
