window.DJARB = window.DJARB || {};

DJARB.initHappPage = function () {
  const about = document.getElementById('happAbout');
  if (about) about.innerHTML = DJARB.HAPP_ABOUT_HTML || '';
  DJARB.mergeExtras();
  DJARB.mountFilter('happFilter', 'happCount', 'happCatalog', DJARB.HAPP || []);
  
  // Bind severity filter buttons
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', function() {
      const sev = this.dataset.sev;
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      if (sev) {
        this.classList.add('active');
        DJARB.setSeverityFilter(sev);
      } else {
        DJARB.setSeverityFilter(null);
      }
    });
  });
};
