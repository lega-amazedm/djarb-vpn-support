window.DJARB = window.DJARB || {};

(function () {
  'use strict';

  async function sha256(text) {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  window.djarbHash = (login, pass) => sha256(String(login).trim().toLowerCase() + ':' + String(pass));
  const isHash = v => typeof v === 'string' && /^[0-9a-f]{64}$/i.test(v);

  DJARB.currentUser = function () {
    try { return sessionStorage.getItem(DJARB.SESSION_KEY); } catch (e) { return null; }
  };

  DJARB.applyProfile = function (username) {
    const p = DJARB.PROFILES[username] || { name: username, subLink: null };
    const panel = document.getElementById('welcomePanel');
    const avatar = document.getElementById('wpAvatar');
    const hi = document.getElementById('wpHi');
    if (panel && hi) {
      if (avatar) avatar.textContent = (p.name || username).trim().charAt(0).toUpperCase();
      hi.textContent = 'Здравствуйте, ' + p.name + '!';
      panel.style.display = 'flex';
    }
    if (p.subLink) {
      const subText = document.getElementById('subLinkText');
      const subOpen = document.getElementById('subOpenLink');
      if (subText) subText.textContent = p.subLink;
      if (subOpen) subOpen.href = p.subLink;
      window.DJARB_SUB_LINK = p.subLink;
    }
  };

  DJARB.unlock = function (username) {
    const gate = document.getElementById('loginGate');
    const content = document.getElementById('siteContent');
    if (gate) gate.style.display = 'none';
    if (content) content.classList.add('unlocked');
    try { sessionStorage.setItem(DJARB.SESSION_KEY, username); } catch (e) {}
    DJARB.applyProfile(username);
    window.dispatchEvent(new CustomEvent('djarb:unlocked', { detail: { user: username } }));
  };

  DJARB.lock = function () {
    try { sessionStorage.removeItem(DJARB.SESSION_KEY); } catch (e) {}
    const content = document.getElementById('siteContent');
    const gate = document.getElementById('loginGate');
    if (content) content.classList.remove('unlocked');
    if (gate) gate.style.display = '';
    const form = document.getElementById('lgForm');
    if (form) form.reset();
    const errorEl = document.getElementById('lgError');
    if (errorEl) errorEl.classList.remove('show');
    const panel = document.getElementById('welcomePanel');
    if (panel) panel.style.display = 'none';
    const userInput = document.getElementById('lgUser');
    if (userInput) setTimeout(() => userInput.focus(), 0);
  };

  DJARB.bindAuth = function () {
    const form = document.getElementById('lgForm');
    const userInput = document.getElementById('lgUser');
    const passInput = document.getElementById('lgPass');
    const errorEl = document.getElementById('lgError');
    const submitBtn = document.getElementById('lgSubmit');
    const card = document.querySelector('.lg-card');
    const content = document.getElementById('siteContent');

    function fail() {
      if (errorEl) errorEl.classList.add('show');
      if (card) {
        card.classList.remove('shake');
        void card.offsetWidth;
        card.classList.add('shake');
      }
      if (passInput) { passInput.value = ''; passInput.focus(); }
    }

    try {
      const saved = sessionStorage.getItem(DJARB.SESSION_KEY);
      if (saved && DJARB.USERS[saved]) DJARB.unlock(saved);
    } catch (e) {}

    try {
      const qUser = new URLSearchParams(window.location.search).get('u');
      if (qUser && DJARB.USERS[qUser.toLowerCase()] && userInput && content && !content.classList.contains('unlocked')) {
        userInput.value = qUser.toLowerCase();
        userInput.readOnly = true;
        if (passInput) setTimeout(() => passInput.focus(), 0);
      }
    } catch (e) {}

    if (form) {
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (errorEl) errorEl.classList.remove('show');
        const login = userInput.value.trim().toLowerCase();
        const pass = passInput.value;
        const expected = DJARB.USERS[login];
        if (!expected) { fail(); return; }
        submitBtn.disabled = true;
        submitBtn.textContent = 'Проверяем…';
        let ok = false;
        try {
          if (isHash(expected)) ok = (await window.djarbHash(login, pass)) === expected.toLowerCase();
          else ok = (pass === expected);
        } catch (err) {
          ok = (pass === expected);
        }
        submitBtn.disabled = false;
        submitBtn.textContent = 'Войти';
        if (ok) DJARB.unlock(login);
        else fail();
      });
    }

    document.querySelectorAll('[data-logout]').forEach(btn => btn.addEventListener('click', DJARB.lock));
  };
})();
