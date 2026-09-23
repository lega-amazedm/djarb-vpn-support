window.DJARB = window.DJARB || {};

DJARB.USERS = {
  'said':    '25a010c3ee3a08c8f9c7eed6f69e194408ca0b6dd3eed2f363963c8a87c068ea',
  'maga':    'b2083bb5b2095c4cad3118bcf94546ba8204c028314a77466320b78d07d038e',
  'alberto': '1005cae2d5c6df18926a891950c4fa237ccfe51c5a238614e5daece0a9f1a8e5',
  'oksana':  '5e7f95ef86da0b2401079d615ed8a7e51ea885a13417d041388a14c2d15bcc9c',
  'dina':    '0eba8cada05effff8d2dc65ebf09ce6de3ae2618fc1f1eb73ab6547fc8fed879'
};

DJARB.DEFAULT_SUB = 'https://subikapi.org/c728b3kw/sub/bef018a8-4fce-4ed1-8d94-49ebe55a0431';

DJARB.PROFILES = {
  'said':    { name:'Саид',    subLink: DJARB.DEFAULT_SUB },
  'maga':    { name:'Мага',    subLink: DJARB.DEFAULT_SUB },
  'alberto': { name:'Альберто',subLink: DJARB.DEFAULT_SUB },
  'oksana':  { name:'Оксана',  subLink: DJARB.DEFAULT_SUB },
  'dina':    { name:'Дина',    subLink: DJARB.DEFAULT_SUB }
};

DJARB.SESSION_KEY = 'djarb_auth_v1';
DJARB.THEME_KEY = 'djarb_theme_v1';

DJARB.NAV = [
  { href:'index.html', id:'home', label:'Главная' },
  { href:'diag.html', id:'search', label:'Диагностика' },
  { href:'servers.html', id:'servers', label:'Сервера' },
  { href:'fix.html', id:'fix', label:'VPN не работает' },
  { href:'vless.html', id:'vless', label:'VLESS' },
  { href:'happ.html', id:'apps', label:'Happ' },
  { href:'incy.html', id:'incy', label:'Incy' },
  { href:'setup.html', id:'setup', label:'Настройка' },
  { href:'glossary.html', id:'glossary', label:'Термины' }
];
