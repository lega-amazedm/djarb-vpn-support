window.DJARB = window.DJARB || {};

DJARB.initFixPage = function () {
  DJARB.bindCatalogOnce();
  DJARB.renderCatalog('fixIphoneCatalog', DJARB.FIX_IPHONE || []);
  DJARB.renderCatalog('fixAndroidCatalog', DJARB.FIX_ANDROID || []);
  DJARB.renderCatalog('fixWindowsCatalog', DJARB.FIX_WINDOWS || []);
  DJARB.renderCatalog('fixMacosCatalog', DJARB.FIX_MACOS || []);
  DJARB.renderCatalog('fixLinuxCatalog', DJARB.FIX_LINUX || []);

  if (location.hash) {
    const id = location.hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      const panel = el.closest('.device-panel');
      if (panel) {
        const device = panel.id.split('-').pop();
        const bar = document.getElementById('fixDeviceTabbar');
        const btn = bar && bar.querySelector(`[data-device="${device}"]`);
        if (btn) btn.click();
      }
      setTimeout(() => DJARB.openAndScroll(id), 0);
    }
  }
};
