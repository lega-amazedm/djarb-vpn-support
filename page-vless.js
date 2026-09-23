window.DJARB = window.DJARB || {};

DJARB.initVlessPage = function () {
  DJARB.mergeExtras();
  DJARB.mountFilter('vlessFilter', 'vlessCount', 'vlessCatalog', DJARB.VLESS || []);
};
