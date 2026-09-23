window.DJARB = window.DJARB || {};

DJARB.initHappPage = function () {
  const about = document.getElementById('happAbout');
  if (about) about.innerHTML = DJARB.HAPP_ABOUT_HTML || '';
  DJARB.mergeExtras();
  DJARB.mountFilter('happFilter', 'happCount', 'happCatalog', DJARB.HAPP || []);
};
