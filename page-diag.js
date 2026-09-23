window.DJARB = window.DJARB || {};

DJARB.initDiagPage = function () {
  const ALL = DJARB.allItems();

  const diagBody = document.getElementById('diagBody');
  const diagForm = document.getElementById('diagForm');
  const diagInput = document.getElementById('diagInput');
  if (!diagBody || !diagForm || !diagInput) return;
  const diagSendBtn = diagForm.querySelector('.diag-send');

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function addMsg(role, contentHTML) {
    const wrap = document.createElement('div');
    wrap.className = 'diag-msg ' + role;
    wrap.innerHTML = `<div class="avatar">${role === 'bot' ? 'D' : 'Вы'}</div><div class="bubble">${contentHTML}</div>`;
    diagBody.appendChild(wrap);
    diagBody.scrollTop = diagBody.scrollHeight;
    return wrap;
  }

  function addThinking() {
    const wrap = document.createElement('div');
    wrap.className = 'diag-msg bot';
    wrap.innerHTML = `<div class="avatar">D</div><div class="bubble"><span class="thinking"><span></span><span></span><span></span></span></div>`;
    diagBody.appendChild(wrap);
    diagBody.scrollTop = diagBody.scrollHeight;
    return wrap;
  }

  function resultCardsHtml(ids) {
    return ids.slice(0, 3).map(id => {
      const it = ALL.find(x => x.id === id);
      if (!it) return '';
      const appLabel = it._app ? (it._app === 'happ' ? 'Happ' : 'Incy') : 'VLESS';
      const page = it._page || 'vless.html';
      return `<a class="result-card" href="${page}#${it.id}">
        <span class="rc-tag">${appLabel} · ${it.code}</span>
        <span class="rc-title">${it.title}</span>
        <span class="rc-fix">${it.fix[0]}</span>
      </a>`;
    }).join('');
  }

  /* ---- local smart-search fallback (used when AI assistance is unavailable) ---- */
  const SYNONYMS = [
    ['нет интернета', ['нет инета', 'без интернета', 'интернета нет', 'сайты не открываются', 'не грузятся страницы', 'не грузит', 'страницы не загружаются']],
    ['разрывается', ['рвется', 'рвётся', 'обрывается', 'дисконнект', 'отваливается', 'вылетает соединение', 'отключается само']],
    ['медленно', ['тормозит', 'лагает', 'низкая скорость', 'тупит', 'грузит долго', 'виснет']],
    ['не запускается', ['не открывается', 'крашится', 'вылетает', 'падает при запуске', 'закрывается само']],
    ['фон', ['в фоне', 'background', 'сворачиваю', 'когда экран выключен', 'блокировка экрана', 'заблокирован экран']],
    ['подписка', ['список серверов пуст', 'сервера не обновляются', 'список пустой', 'список серверов пустой']],
    ['не подключается', ['не могу подключиться', 'не коннектится', 'не законнектился', 'не цепляется', 'не заходит']],
    ['разрешение', ['permission', 'доступ к vpn', 'нет доступа', 'отказано в доступе']],
    ['батарея', ['разряжается', 'жрёт батарею', 'садится телефон', 'расход заряда']],
    ['скриншот', ['ошибка на экране', 'вот что вижу', 'вот фото', 'вот картинка']]
  ];

  function expandQuery(q) {
    let extra = '';
    const lower = q.toLowerCase();
    SYNONYMS.forEach(([canon, aliases]) => {
      if (aliases.some(a => lower.includes(a)) || lower.includes(canon)) extra += ' ' + canon;
    });
    return q + extra;
  }

  function levenshtein(a, b) {
    if (a === b) return 0;
    const al = a.length, bl = b.length;
    if (al === 0) return bl; if (bl === 0) return al;
    let prev = Array.from({ length: bl + 1 }, (_, i) => i);
    for (let i = 1; i <= al; i++) {
      let cur = [i];
      for (let j = 1; j <= bl; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      }
      prev = cur;
    }
    return prev[bl];
  }

  function fuzzyHas(haystack, term) {
    if (haystack.includes(term)) return true;
    if (term.length < 4) return false;
    const words = haystack.split(/\s+/);
    const tolerance = term.length >= 8 ? 2 : 1;
    return words.some(w => Math.abs(w.length - term.length) <= tolerance && levenshtein(w, term) <= tolerance);
  }

  function score(item, query) {
    const q = expandQuery(query.toLowerCase());
    const terms = q.split(/\s+/).filter(Boolean);
    let s = 0;
    const haystacks = [
      { text: (item.title || '').toLowerCase(), w: 4 },
      { text: (item.symptom || '').toLowerCase(), w: 3 },
      { text: (item.cause || '').toLowerCase(), w: 1.5 },
      { text: (item.plain || '').toLowerCase(), w: 1.5 },
      { text: (item.log || '').toLowerCase(), w: 3.5 },
      { text: (item.code || '').toLowerCase(), w: 3 },
      { text: (item.group || '').toLowerCase(), w: 1 }
    ];
    terms.forEach(t => {
      if (t.length < 2) return;
      haystacks.forEach(h => { if (fuzzyHas(h.text, t)) s += h.w; });
    });
    return s;
  }

  function localSearch(q) {
    return ALL.map(it => ({ it, s: score(it, q) })).filter(r => r.s > 0).sort((a, b) => b.s - a.s).slice(0, 3);
  }

  function catalogBrief() {
    return ALL.map(it => {
      const app = it._app ? (it._app === 'happ' ? 'Happ' : 'Incy') : 'VLESS';
      return `${it.id} | ${app} | ${it.code} | ${it.title} — ${it.symptom}`;
    }).join('\n');
  }

  /* ---- AI (sample capability) wiring — only present when this page runs inside a published artifact ---- */
  let sampleFn = null;
  let imageCaps = null;
  const chatHistory = [];

  const fileInput = document.getElementById('fileInput');
  const attachBtn = document.getElementById('attachBtn');
  const attachPreview = document.getElementById('attachPreview');
  const diagHint = document.getElementById('diagHint');
  let pendingImage = null;
  if (attachBtn) attachBtn.hidden = true;

  (async function initSample() {
    try {
      if (!window.claude || !window.claude.use) return;
      sampleFn = await window.claude.use('sample');
      if (!sampleFn) return;
      imageCaps = await sampleFn.limits().then(l => l && l.images || null).catch(() => null);
      if (imageCaps) {
        if (attachBtn) attachBtn.hidden = false;
        if (diagHint) diagHint.hidden = false;
        if (imageCaps.mediaTypes && fileInput) fileInput.accept = imageCaps.mediaTypes.join(',');
      } else if (attachBtn) {
        attachBtn.hidden = true;
      }
    } catch (err) { if (attachBtn) attachBtn.hidden = true; }
  })();

  function historyBrief() {
    if (!chatHistory.length) return '';
    const recent = chatHistory.slice(-4);
    return '\n\nПредыдущий разговор (для контекста, самое свежее внизу):\n' +
      recent.map(h => `${h.role === 'user' ? 'Пользователь' : 'Ассистент'}: ${h.text}`).join('\n');
  }

  function buildTextPrompt(q) {
    return `Ты — тёплый и внимательный ассистент поддержки DJARB VPN. Пользователь пишет своими словами, как есть — с опечатками, сокращениями, без терминов. Твоя задача — понять, что реально происходит, как понял бы живой саппорт-специалист, а не просто искать точные совпадения слов.` +
      `\n\nВот база известных ошибок в формате id | приложение | код | заголовок — симптом:\n${catalogBrief()}` +
      historyBrief() +
      `\n\nНовое сообщение пользователя: "${q}"` +
      `\n\nВыбери до 3 наиболее подходящих id из базы выше (пустой список, если ничего явно не подходит — не притягивай за уши). Ответь ТОЛЬКО JSON в формате {"ids":["id1","id2"], "answer":"тёплое, ясное объяснение на русском простыми словами, 2-4 предложения: что похоже происходит и что в первую очередь стоит проверить"} без каких-либо других слов, без markdown-разметки.`;
  }

  function buildImagePrompt(caption) {
    return `Ты — ассистент поддержки DJARB VPN. Пользователь прислал скриншот ошибки VPN-приложения (VLESS/Xray, приложение Happ или Incy).` +
      (caption ? ` Подпись от пользователя: "${caption}".` : '') +
      `\n\nВот база известных ошибок в формате id | приложение | код | заголовок — симптом:\n${catalogBrief()}` +
      historyBrief() +
      `\n\nПосмотри на скриншот, прочитай текст ошибки или опиши видимые признаки проблемы. Выбери до 3 наиболее подходящих id из базы выше (могут отсутствовать, если ничего не подходит). Ответь ТОЛЬКО JSON в формате {"ids":["id1","id2"], "answer":"короткое объяснение на русском, 2-4 предложения: что видно на скриншоте и что скорее всего не так"} без каких-либо других слов.`;
  }

  function renderAnswer(wrap, data, fallbackNoMatch) {
    const ids = Array.isArray(data && data.ids) ? data.ids.filter(id => ALL.some(it => it.id === id)) : [];
    let html = `<p>${escapeHtml((data && data.answer) || fallbackNoMatch)}</p>`;
    if (ids.length) {
      html += resultCardsHtml(ids);
    } else if (!(data && data.answer)) {
      html += `<p>Посмотрите разделы <a href="vless.html">VLESS</a> и <a href="happ.html">Приложения</a> целиком, либо опишите ошибку чуть подробнее.</p>`;
    }
    wrap.querySelector('.bubble').innerHTML = html;
    diagBody.scrollTop = diagBody.scrollHeight;
  }

  function renderLocalAnswer(wrap, ranked) {
    if (ranked.length === 0) {
      wrap.querySelector('.bubble').innerHTML = `<p>Точного совпадения не нашлось. Попробуйте вставить точную строку из лога ошибки, описать симптом подробнее, либо посмотрите разделы <a href="vless.html">VLESS</a> и <a href="happ.html">Приложения</a> целиком.</p>`;
      return;
    }
    let html = `<p>Похоже на следующее (${ranked.length}):</p>`;
    html += resultCardsHtml(ranked.map(r => r.it.id));
    wrap.querySelector('.bubble').innerHTML = html;
    diagBody.scrollTop = diagBody.scrollHeight;
  }

  async function handleQuery(q) {
    if (!q.trim()) return;
    addMsg('user', `<p>${escapeHtml(q)}</p>`);
    chatHistory.push({ role: 'user', text: q });
    diagSendBtn.disabled = true;
    const wrap = addThinking();

    if (sampleFn) {
      try {
        const data = await sampleFn.json(buildTextPrompt(q), { modelTier: 'default', cache: false });
        renderAnswer(wrap, data, 'Похоже, точного совпадения в базе нет — но вот что может помочь.');
        chatHistory.push({ role: 'assistant', text: (data && data.answer) || '' });
        diagSendBtn.disabled = false;
        return;
      } catch (err) { /* graceful silent fallback to local search */ }
    }
    const ranked = localSearch(q);
    renderLocalAnswer(wrap, ranked);
    diagSendBtn.disabled = false;
  }

  async function handleImageQuery(file, caption) {
    const url = URL.createObjectURL(file);
    addMsg('user', `<img class="msg-shot" src="${url}" alt="Скриншот ошибки">${caption ? `<p>${escapeHtml(caption)}</p>` : ''}`);
    diagSendBtn.disabled = true;
    const wrap = addThinking();

    if (!sampleFn) {
      wrap.querySelector('.bubble').innerHTML = `<p>Разбор скриншотов сейчас недоступен в этом окне. Опишите ошибку текстом — я найду совпадение по базе.</p>`;
      diagSendBtn.disabled = false;
      return;
    }
    try {
      const data = await sampleFn.json(buildImagePrompt(caption), { images: file, modelTier: 'default', cache: false });
      renderAnswer(wrap, data, 'Вот что удалось определить по скриншоту.');
      chatHistory.push({ role: 'assistant', text: (data && data.answer) || '' });
    } catch (err) {
      const code = err && err.code;
      let msg = 'Не получилось разобрать скриншот. Опишите ошибку текстом — так тоже можно найти решение.';
      if (code === 'not_granted') msg = 'Нет разрешения на анализ изображений в этом окне. Опишите ошибку текстом.';
      if (code === 'image_rejected') msg = 'Не удалось прочитать этот файл — попробуйте другой скриншот (JPEG/PNG/WebP).';
      if (code === 'rate_limited') msg = 'Слишком много запросов подряд — подождите немного и попробуйте снова.';
      wrap.querySelector('.bubble').innerHTML = `<p>${msg}</p>`;
    }
    diagSendBtn.disabled = false;
  }

  /* ---------------- SCREENSHOT ATTACH ---------------- */
  function setPendingImage(file) {
    if (!file) return;
    pendingImage = file;
    const url = URL.createObjectURL(file);
    attachPreview.hidden = false;
    attachPreview.innerHTML = `
      <span class="attach-chip">
        <img src="${url}" alt="">
        Скриншот прикреплён
        <button type="button" class="attach-remove" id="removeAttach" aria-label="Убрать вложение">✕</button>
      </span>`;
    const removeBtn = document.getElementById('removeAttach');
    if (removeBtn) removeBtn.addEventListener('click', () => {
      pendingImage = null;
      attachPreview.hidden = true;
      attachPreview.innerHTML = '';
    });
  }

  if (attachBtn && fileInput) {
    attachBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) setPendingImage(fileInput.files[0]);
    });
  }
  if (diagInput) {
    diagInput.addEventListener('paste', (e) => {
      const items = e.clipboardData && e.clipboardData.items;
      if (!items) return;
      for (const item of items) {
        if (item.type && item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) setPendingImage(file);
        }
      }
    });
  }

  diagForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const q = diagInput.value;
    diagInput.value = '';
    if (pendingImage) {
      const file = pendingImage;
      pendingImage = null;
      attachPreview.hidden = true;
      attachPreview.innerHTML = '';
      handleImageQuery(file, q);
    } else {
      handleQuery(q);
    }
  });

  diagBody.addEventListener('click', function (e) {
    const card = e.target.closest('.result-card');
    if (card) {
      // let the link navigate normally to the catalog page + anchor
    }
  });

  const chipRow = document.getElementById('chipRow');
  if (chipRow) {
    const suggestions = [
      'не подключается второй день',
      'REALITY processed invalid connection',
      'Happ не тестирует соединение',
      'Incy отключается в фоне',
      'подключено, но нет интернета',
      'tls first record'
    ];
    suggestions.forEach(s => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'chip'; b.textContent = s;
      b.addEventListener('click', () => handleQuery(s));
      chipRow.appendChild(b);
    });
  }
};
