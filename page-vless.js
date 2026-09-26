window.DJARB = window.DJARB || {};

DJARB.initVlessPage = function () {
  DJARB.mergeExtras();
  DJARB.mountFilter('vlessFilter', 'vlessCount', 'vlessCatalog', DJARB.VLESS || []);
  
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
