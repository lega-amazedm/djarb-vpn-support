window.DJARB = window.DJARB || {};

DJARB.initServersPage = function () {
  function currentSubLink() { return window.DJARB_SUB_LINK || DJARB.DEFAULT_SUB; }

  const copySubBtn = document.getElementById('copySubBtn');
  if (copySubBtn) {
    copySubBtn.addEventListener('click', async () => {
      const link = currentSubLink();
      try {
        await navigator.clipboard.writeText(link);
      } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = link; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
      }
      copySubBtn.classList.add('copied');
      setTimeout(() => copySubBtn.classList.remove('copied'), 1800);
    });
  }

  const qrBox = document.getElementById('qrBox');
  function renderQr() {
    if (!(qrBox && window.QRCode)) return;
    qrBox.innerHTML = '';
    try {
      new QRCode(qrBox, {
        text: currentSubLink(),
        width: 136, height: 136,
        colorDark: '#0B0F1A',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    } catch (err) { /* QR is a bonus, never block the page on it */ }
  }
  renderQr();
  window.addEventListener('djarb:unlocked', renderQr);
};
