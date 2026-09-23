window.DJARB = window.DJARB || {};

DJARB.initIncyPage = function () {
  const about = document.getElementById('incyAbout');
  if (about) about.innerHTML = DJARB.INCY_ABOUT_HTML || '';
  DJARB.mergeExtras();
  DJARB.mountFilter('incyFilter', 'incyCount', 'incyCatalog', DJARB.INCY || []);
};
