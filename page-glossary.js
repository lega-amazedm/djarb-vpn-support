window.DJARB = window.DJARB || {};

DJARB.initGlossaryPage = function () {
  const el = document.getElementById('glossaryGrid');
  if (!el) return;
  el.innerHTML = (DJARB.GLOSSARY || []).map(g => `
    <div class="term-card">
      <dt>${g.term}</dt>
      <dd>${g.def}</dd>
    </div>
  `).join('');
};
