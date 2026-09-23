window.DJARB = window.DJARB || {};

DJARB.initHomePage = function () {
  const grid = document.getElementById('quickGrid');
  if (grid) {
    grid.innerHTML = (DJARB.QUICKSTART || []).map(q => `
      <div class="quick-card">
        <span class="quick-num">${q.n}</span>
        <h4>${q.title}</h4>
        <p>${q.text}</p>
      </div>
    `).join('');
  }

  const termBody = document.getElementById('termBody');
  if (termBody) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const termLines = [
      { t: '$ djarb-diag connect --profile vless-reality', c: 't-dim' },
      { t: '→ resolving server...', c: 't-dim' },
      { t: '→ tls: first record does not look like a TLS handshake', c: 't-err' },
      { t: '→ checking client config vs server config...', c: 't-dim' },
      { t: '✕ serverName mismatch detected', c: 't-warn' },
      { t: '→ suggested fix: sync serverName (SNI) with server dest', c: 't-accent' },
      { t: '→ retrying with corrected profile...', c: 't-dim' },
      { t: '✓ REALITY handshake completed', c: 't-ok' },
      { t: '✓ connected — 41ms', c: 't-ok' }
    ];
    function renderStatic() {
      termBody.innerHTML = termLines.map(l => `<div class="ln show"><span class="${l.c}">${l.t}</span></div>`).join('');
    }
    function typeLines() {
      let i = 0;
      function next() {
        if (i >= termLines.length) {
          const cur = document.createElement('span');
          cur.className = 'cursor';
          termBody.appendChild(cur);
          return;
        }
        const div = document.createElement('div');
        div.className = 'ln';
        div.innerHTML = `<span class="${termLines[i].c}">${termLines[i].t}</span>`;
        termBody.appendChild(div);
        requestAnimationFrame(() => div.classList.add('show'));
        i++;
        setTimeout(next, 480);
      }
      next();
    }
    if (reduceMotion) renderStatic(); else typeLines();
  }
};
