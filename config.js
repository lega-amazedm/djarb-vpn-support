window.DJARB = window.DJARB || {};

DJARB.USERS = {
  'said':    '25a010c3ee3a08c8f9c7eed6f69e194408ca0b6dd3eed2f363963c8a87c068ea',
  'maga':    'b2083bb5b2095c4cad3118bcf94546ba8204c028314a77466320b78d07d038e',
  'alberto': '1005cae2d5c6df18926a891950c4fa237ccfe51c5a238614e5daece0a9f1a8e5',
  'oksana':  '5e7f95ef86da0b2401079d615ed8a7e51ea885a13417d041388a14c2d15bcc9c',
  'dina':    '0eba8cada05effff8d2dc65ebf09ce6de3ae2618fc1f1eb73ab6547fc8fed879',
  'gufik':   '301d46f3fb433c3779ba4d348b5b2d354d009b582ae20d12f22c4c6e06d87228'
};

DJARB.DEFAULT_SUB = '';

DJARB.PROFILES = {
  'said':    { name:'Саид',    subLink: '' },
  'maga':    { name:'Мага',    subLink: '' },
  'alberto': { name:'Альберто',subLink: '' },
  'oksana':  { name:'Оксана',  subLink: '' },
  'dina':    { name:'Дина',    subLink: '' },
  'gufik':   { name:'Gufik',   subLink: '' }
};

DJARB.SESSION_KEY = 'djarb_auth_v1';
DJARB.THEME_KEY = 'djarb_theme_v1';

DJARB.NAV = [
  { href:'index.html', id:'home', label:'Главная', primary:true },
  { href:'diag.html', id:'search', label:'Диагностика', primary:true },
  { href:'fix.html', id:'fix', label:'VPN не работает', primary:true },
  { href:'vless.html', id:'vless', label:'VLESS' },
  { href:'happ.html', id:'apps', label:'Happ' },
  { href:'incy.html', id:'incy', label:'Incy' },
  { href:'compare.html', id:'compare', label:'Сравнение' },
  { href:'support.html', id:'support', label:'Поддержка' },
  { href:'setup.html', id:'setup', label:'Настройка' },
  { href:'glossary.html', id:'glossary', label:'Термины' }
];