// 產生 dazhuang-island/index.html：以 zgjh 引擎為底，換上大庄資料、大庄新模型、本機 three.js
// 用法：node build/build.js
const fs = require('fs'), path = require('path');
const SRC = process.env.ZGJH_SRC || 'C:/Users/User/AppData/Local/Temp/zgjh_source.html';
const OUT = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(SRC, 'utf8');

// ---- 1. 原 DATA（取 roles / carries / evidence / phases / travelers 規則） ----
const lines = html.split('\n');
const dStart = lines.findIndex(l => l.startsWith('const DATA = {'));
const dEnd = lines.findIndex((l, i) => i > dStart && l.startsWith('// ================= A｜SCENE'));
if (dStart < 0 || dEnd < 0) throw new Error('找不到 DATA 區段');
const orig = new Function(lines.slice(dStart, dEnd).join('\n') + '\nreturn DATA;')();
const dz = require('./data.js');

// 學生外觀：大庄運動服
const roles = JSON.parse(JSON.stringify(orig.roles));
roles.student.look = '大庄運動服';
const DATA = {
  ...dz,
  evidence: orig.evidence, phases: orig.phases, carries: orig.carries, roles,
  travelers: { ...orig.travelers, roles: dz.travelers.roles, nick: orig.travelers.nick }
};
// 檢查：模型、host、flow
const known = ['academy', 'stall', 'busstop', 'pavilion', 'library', 'bigbook', 'stage', 'river', 'lab', 'clock', 'court', 'coin', 'observatory', 'classroom', 'globe', 'house', 'bikerack', 'clinic', 'flowerbed', 'farm', 'track', 'tent', 'archgate', 'concert', 'robot', 'bank', 'newsroom', 'windvane', 'flagpole', 'podium', 'lectern', 'parade', 'kiln', 'archery', 'teeball', 'mullet', 'smartclass'];
const ids = new Set(DATA.islands.map(d => d.id)), itemIds = new Set();
DATA.islands.forEach(d => { if (!roles[d.host]) throw new Error('host? ' + d.host); d.items.forEach(i => { if (!known.includes(i.model)) throw new Error('model? ' + i.model); itemIds.add(i.id); }); });
DATA.flows.forEach(f => { if (!ids.has(f.from) || !ids.has(f.to)) throw new Error('flow? ' + f.id); f.crew.forEach(c => { if (!roles[c]) throw new Error('crew? ' + c); }); if (!orig.carries[f.carry]) throw new Error('carry? ' + f.carry); });
DATA.dayCycle.forEach(s => s.items.forEach(i => { if (!itemIds.has(i)) throw new Error('slot item? ' + i); }));

const dataJs = '// ================= DATA：大庄國小．窯海島（由 build/build.js 產生） =================\nconst DATA = ' + JSON.stringify(DATA, null, 1) + ';\n\n';
html = lines.slice(0, dStart).join('\n') + '\n' + dataJs + lines.slice(dEnd).join('\n');

// ---- 2. 新模型 ----
const models = fs.readFileSync(path.join(__dirname, 'models.js'), 'utf8');
const rep = (a, b, all) => { if (!html.includes(a)) throw new Error('找不到：' + a.slice(0, 60)); html = all ? html.split(a).join(b) : html.replace(a, b); };
rep('function kitModel(name) {', models + '\nfunction kitModel(name) {');
rep('lectern: kitMLectern, parade: kitMParade', 'lectern: kitMLectern, parade: kitMParade,\n    kiln: kitMKiln, archery: kitMArchery, teeball: kitMTeeball, mullet: kitMMullet, smartclass: kitMSmartclass');

// ---- 3. 本機 three.js ----
html = html.replace(/<script type="importmap">[\s\S]*?<\/script>/, '<script type="importmap">' + JSON.stringify({ imports: {
  'three': './vendor/three.module.min.js',
  'three/addons/controls/OrbitControls.js': './vendor/OrbitControls.js',
  'three/addons/renderers/CSS2DRenderer.js': './vendor/CSS2DRenderer.js',
  'three/addons/geometries/RoundedBoxGeometry.js': './vendor/RoundedBoxGeometry.js',
  'three/addons/utils/BufferGeometryUtils.js': './vendor/BufferGeometryUtils.js',
  'three/addons/math/SimplexNoise.js': './vendor/SimplexNoise.js'
} }) + '</script>');
html = html.split('cdn.jsdelivr.net').join('本機 vendor 檔案');

// ---- 4. 年段：七八九 → 低中高 ----
rep("const UI_GRADES = [['七', '7'], ['八', '8'], ['九', '9']];", "const UI_GRADES = [['低', '7'], ['中', '8'], ['高', '9']];");
rep("['七', '八', '九']", "['低', '中', '高']", true);
rep("[[/國一|初一|7年級|七年级|g7\\b|grade ?7/g, '七年級'], [/國二|初二|8年級|g8\\b|grade ?8/g, '八年級'], [/國三|初三|9年級|g9\\b|grade ?9/g, '九年級']]",
  "[[/一年級|二年級|低年段|lower/g, '低年級'], [/三年級|四年級|中年段|middle/g, '中年級'], [/五年級|六年級|高年段|upper/g, '高年級']]");
rep('([七八九])([上下])(?![學])', '([低中高])([上下])(?![學])');
rep('([七八九]年級)', '([低中高]年級)');
rep("|| '七'", "|| '低'", true);
rep("'Grade ' + e", "['Lower', 'Middle', 'Upper'][e - 7] + ' grades'", true);
rep("tr('七年級,八年級下學期,AI,社團,會考,得獎'", "tr('低年級,高年級,陶藝,射箭,樂樂棒球,得獎'");
rep("const UI_WIN = { W: ['Wisdom', '統整主題／議題探究', 'themed inquiry'], I: ['Inflect', '團隊經營', 'team building'], N: ['New', '社團技藝', 'clubs & crafts'] };",
  "const UI_WIN = { W: ['Inquiry', '在地探究', 'local inquiry'], I: ['Character', '品格生活', 'character & life'], N: ['Arts & sports', '藝能運動', 'arts & sports'] };");

// ---- 5. 文字替換（UI／HTML，DATA 已換過） ----
const T = [
  ['<title>竹光．逐光島</title>', '<title>大庄．窯海島</title>'],
  [/<meta name="description" content="[^"]*">/, '<meta name="description" content="新竹市香山區大庄國小的特色課程與年度活動，做成 14 座可以逛的 3D 小島：柴窯陶藝、射箭、樂樂棒球、食魚教育與永續智慧教室。">'],
  [/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="大庄．窯海島｜大庄國小特色課程與年度活動">'],
  [/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="香山海風吹過柴窯與射箭場：點一座島，看懂大庄孩子六年的學習旅程。">'],
  [/<meta property="og:image" content="[^"]*">/, ''],
  ['新竹市立竹光國民中學', '新竹市香山區大庄國民小學'],
  ['竹光．逐光島', '大庄．窯海島'], ['Zhuguang · Isles of Light', 'Dazhuang · Kiln & Sea Isles'],
  ['Zhuguang Junior High School, Hsinchu', 'Dazhuang Elementary School, Hsinchu'],
  ['竹光國中', '大庄國小'], ['Zhuguang JHS', 'Dazhuang ES'], ['Zhuguang', 'Dazhuang'], ['ZHUGUANG', 'DAZHUANG'],
  ['竹光 WIN 光', '大庄三大主軸'], ['竹光夥伴', '大庄夥伴'], ['竹光', '大庄'],
  ['Wisdom 統整主題／議題探究', 'W 在地探究'], ['Inflect 團隊經營', 'I 品格生活'], ['New 社團技藝', 'N 藝能運動'],
  ['Wisdom · themed inquiry', 'Local inquiry'], ['Inflect · team building', 'Character & life'], ['New · clubs &amp; crafts', 'Arts &amp; sports'],
  ['彈性課程', '特色課程'], ['FLEXIBLE COURSES', 'SIGNATURE COURSES'], ['FLEXIBLE COURSE', 'SIGNATURE COURSE'], ['Flexible course', 'Signature course'],
  ['三年旅程', '六年旅程'], ['3-yr journey', '6-yr journey'], ['Three-year journey', 'Six-year journey'], ['three-year journey', 'six-year journey'],
  ['從新鮮營到畢業典禮', '從新生入學到畢業典禮'], ['freshman camp', 'first day'],
  ['七、八、九年級', '低、中、高年級'], ['Grade 7, 8 or 9', 'lower, middle or upper grades'],
  ['三年的風景都在這裡了', '六年的風景都在這裡了'], ['跟著三年旅程', '跟著六年旅程'],
  ['115 學年度課程計畫', '公開課程資訊與校園新聞'], ['2026–27 (ROC 115) curriculum plan', 'public curriculum info'], ['2026–27 curriculum plan', 'public curriculum info'],
  ["「學校願景」是大庄的四個願景：活力、創意、合作、理性。「課程類型」是大庄 WIN 課程架構：W 統整主題、I 團隊經營、N 社團技藝。", "「學校願景」是大庄的四個方向：探究、創藝、友善、健康。「課程類型」是大庄三大主軸：W 在地探究、I 品格生活、N 藝能運動。"],
  ['zgjh-tour-v1', 'dzps-tour-v1'], ["'zgjh-big'", "'dzps-big'"], ["'zgjh-traveler'", "'dzps-traveler'"], ["'zgjh-passport'", "'dzps-passport'"],
  ['https://www.zgjh.hc.edu.tw/nss/p/${encodeURIComponent(o.page)}', '#']
];
for (const [a, b] of T) html = typeof a === 'string' ? html.split(a).join(b) : html.replace(a, b);

// 載入失敗提示：本機版不需 CDN
html = html.replace(/var e=document\.getElementById\('loader'\)[\s\S]*?\}, 25000\);/, "var e=document.getElementById('loader'),m=document.getElementById('loader-msg'); if(e&&!e.classList.contains('is-error')&&m){ e.classList.add('is-error'); m.textContent='載入時間過長：請確認瀏覽器支援 WebGL，並用 http://localhost:8080 開啟（不要直接雙擊檔案）。'; } } }, 25000);");

fs.writeFileSync(OUT, html, 'utf8');
// 抽出 module script 供語法檢查
const m = html.match(/<script type="module">([\s\S]*?)<\/script>/);
fs.writeFileSync(path.join(__dirname, 'check.mjs'), m[1], 'utf8');
console.log('OK', OUT, (html.length / 1024).toFixed(0) + ' KB', 'islands', DATA.islands.length, 'flows', DATA.flows.length);
