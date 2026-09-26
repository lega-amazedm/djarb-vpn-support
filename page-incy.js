window.DJARB = window.DJARB || {};

DJARB.initIncyPage = function () {
  const about = document.getElementById('incyAbout');
  if (about) about.innerHTML = DJARB.INCY_ABOUT_HTML || '';
  DJARB.mergeExtras();
  DJARB.mountFilter('incyFilter', 'incyCount', 'incyCatalog', DJARB.INCY || []);
  
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
