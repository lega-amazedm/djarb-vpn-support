window.DJARB = window.DJARB || {};

DJARB.initSupportPage = function () {
  DJARB.mergeExtras();
  const items = DJARB.allItems();

  // Real numbers pulled straight from the error database, instead of
  // hardcoded placeholder figures.
  const counts = { crit: 0, warn: 0, info: 0 };
  items.forEach(function (it) {
    if (counts[it.sev] !== undefined) counts[it.sev]++;
  });
  function setNum(id, n) {
    const el = document.getElementById(id);
    if (el) el.textContent = n;
  }
  setNum('statCrit', counts.crit);
  setNum('statWarn', counts.warn);
  setNum('statInfo', counts.info);
  setNum('statUsers', Object.keys(DJARB.USERS || {}).length);

  // Search across the whole catalog (VLESS + Happ + Incy) right from the
  // support dashboard, so the team can find any known error in one place.
  DJARB.mountFilter('supportFilter', 'supportCount', 'supportCatalog', items);
  document.querySelectorAll('.filter-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      const sev = this.dataset.sev;
      document.querySelectorAll('.filter-chip').forEach(function (c) { c.classList.remove('active'); });
      if (sev) {
        this.classList.add('active');
        DJARB.setSeverityFilter(sev);
      } else {
        DJARB.setSeverityFilter(null);
      }
    });
  });
};
