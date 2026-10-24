// ================= 大庄版新增 model：柴窯、射箭、樂樂棒球、烏魚食魚坊、智慧教室 =================
// 單位空間：底面 ±0.5，高 0–1.2，面向 +z；只用 kitPen 的實例化零件。
const dzC = { brick: '#b5553a', brickD: '#8e3f2c', brickL: '#cf7552', ash: '#6b625c', smoke: '#e6e1da', clay: '#c98a5a', clayD: '#a86a3e',
  celadon: '#9fc2ae', glazeB: '#4f6f9a', sand: '#ead9ad', roe: '#d9822b', roeD: '#b8641c', fish: '#a9b4bd', fishD: '#7f8b95', sea: '#7cc3cc' };

// 小陶瓶
function dzVase(p, x, y, z, s, c) {
  p.cyl(x, y, z, s * 0.55, s * 0.3, c); p.sph(x, y + s * 0.55, z, s * 0.8, c, 0.85);
  p.cyl(x, y + s * 1.05, z, s * 0.32, s * 0.45, c); p.cyl(x, y + s * 1.45, z, s * 0.45, s * 0.1, c);
}
// 弓（側視）：上下兩段弧＋弦
function dzBow(p, x, y, z, c = '#7a4a2c') {
  p.seg([x, y, z], [x, y + 0.07, z + 0.035], 0.005, c); p.seg([x, y + 0.07, z + 0.035], [x, y + 0.14, z], 0.005, c);
  p.seg([x, y, z], [x, y + 0.14, z], 0.0015, kitC.cream);
}

// ---------- 香山柴窯陶藝坊 ----------
function kitMKiln(p, o) {
  const G = kitG, C = kitC, D = dzC;
  p.rbox(0, 0, 0, 1, G, 1, C.paving);
  p.box(0.05, G, 0.36, 0.9, 0.006, 0.22, '#cdbb9f');
  // 登窯：三節階梯窯室，由前（低）往後（高）
  const ky = G, kx = -0.12;
  for (let i = 0; i < 3; i++) {
    const z = 0.12 - i * 0.17, y = ky + i * 0.05;
    p.box(kx, y, z, 0.42, 0.09 + (i ? 0.05 : 0), 0.18, D.brickD);              // 窯基
    p.dome(kx, y + 0.09 + (i ? 0.05 : 0), z, 0.2, D.brick, 0.95);              // 窯頂
    for (let k = 0; k < 4; k++) p.box(kx, y + 0.02 + k * 0.025, z + 0.091, 0.42, 0.004, 0.004, D.brickL); // 磚縫
    p.sph(kx + 0.16, y + 0.17 + (i ? 0.05 : 0), z, 0.016, D.ash);            // 投柴孔
  }
  // 窯門：拱形火口＋發光柴火
  p.box(kx, ky, 0.215, 0.14, 0.11, 0.02, D.brickD);
  p.gbox(kx, ky + 0.01, 0.222, 0.08, 0.07, 0.012, C.orange);
  p.torus(kx, ky + 0.08, 0.222, 0.045, D.brickD, 0, 0, 0, 0.4);
  p.gsph(kx - 0.02, ky + 0.025, 0.232, 0.014, C.yellow); p.gsph(kx + 0.02, ky + 0.02, 0.232, 0.012, C.red);
  // 煙囪＋煙
  const cx = kx, cz = -0.4, ch = o.main ? 0.62 : 0.5;
  p.box(cx, ky + 0.1, cz, 0.12, ch, 0.12, D.brick);
  for (let k = 1; k < 6; k++) p.box(cx, ky + 0.1 + k * ch / 6, cz, 0.124, 0.006, 0.124, D.brickL);
  p.box(cx, ky + 0.1 + ch, cz, 0.15, 0.03, 0.15, D.brickD);
  [[0, 0.06, 0.05], [0.04, 0.13, 0.06], [0.1, 0.2, 0.07], [0.18, 0.26, 0.06]].forEach(([dx, dy, r]) => p.sph(cx + dx, ky + 0.15 + ch + dy, cz + dx * 0.3, r, D.smoke));
  // 柴堆（相思木）
  for (let L = 0; L < 3; L++) for (let i = 0; i < 4 - L; i++) p.cylZ(0.24 + i * 0.05 + L * 0.025, G + 0.024 + L * 0.043, -0.3, 0.022, 0.2, (i + L) % 2 ? C.wood : C.woodD);
  p.box(0.32, G, -0.3, 0.24, 0.004, 0.24, C.soilD);
  // 拉坯桌＋陶工
  p.cyl(0.28, G, 0.12, 0.07, 0.07, C.woodD); p.cyl(0.28, G + 0.07, 0.12, 0.055, 0.012, C.stone);
  p.cyl(0.28, G + 0.082, 0.12, 0.028, 0.045, D.clay); p.cyl(0.28, G + 0.127, 0.12, 0.034, 0.01, D.clay);
  p.box(0.28, G, 0.24, 0.07, 0.04, 0.05, C.wood);
  kitMini(p, 0.28, G + 0.04, 0.24, '#7d6a8a', { hat: 'cap' });
  // 作品架（遮棚）
  const sx = 0.3, sz = -0.06;
  p.box(sx, G, sz, 0.26, 0.012, 0.09, C.woodD); p.box(sx, G + 0.1, sz, 0.26, 0.012, 0.09, C.woodD);
  for (const d of [-1, 1]) p.box(sx + d * 0.125, G, sz, 0.012, 0.22, 0.09, C.woodD);
  const vc = [D.celadon, D.clay, D.glazeB, C.cream, D.brickL];
  for (let i = 0; i < 4; i++) { dzVase(p, sx - 0.09 + i * 0.06, G + 0.012, sz, 0.022, vc[i]); dzVase(p, sx - 0.08 + i * 0.055, G + 0.112, sz, 0.02, vc[(i + 2) % 5]); }
  p.prism(sx, G + 0.22, sz, 0.32, 0.06, 0.16, C.eave);
  // 前院：大陶甕、搬柴學生、招牌
  dzVase(p, -0.4, G, 0.38, 0.05, D.clayD); dzVase(p, -0.3, G, 0.42, 0.035, D.celadon);
  kitMini(p, 0.05, G, 0.36, C.coral); p.cylX(0.05, G + 0.08, 0.4, 0.014, 0.12, C.wood);
  p.box(0.42, G, 0.36, 0.012, 0.16, 0.012, C.woodD); p.box(0.42, G + 0.12, 0.37, 0.12, 0.07, 0.014, o.ac); p.box(0.42, G + 0.13, 0.378, 0.09, 0.045, 0.003, C.cream);
  p.spill(kx, 0.3, 0.4, 0.2, G + 0.012, 0.9);
}

// ---------- 射箭訓練站 ----------
function kitMArchery(p, o) {
  const G = kitG, C = kitC;
  p.rbox(0, 0, 0, 1, G, 1, C.grass);
  for (let i = 0; i < 3; i++) p.box(-0.3 + i * 0.3, G, -0.05, 0.004, 0.003, 0.62, C.cream);   // 靶道線
  p.box(0, G, 0.22, 0.9, 0.004, 0.012, C.white);                                                // 發射線
  // 標靶三面（三腳架＋同心環）
  const tz = -0.33;
  [-0.3, 0, 0.3].forEach((x, i) => {
    const ty = G + 0.17 + (o.main && i === 1 ? 0.02 : 0);
    p.seg([x - 0.07, G, tz - 0.05], [x, ty + 0.06, tz - 0.02], 0.008, C.woodD); p.seg([x + 0.07, G, tz - 0.05], [x, ty + 0.06, tz - 0.02], 0.008, C.woodD);
    p.seg([x, G, tz - 0.12], [x, ty + 0.06, tz - 0.02], 0.008, C.woodD);
    p.cylZ(x, ty, tz, 0.11, 0.04, C.straw);
    [[0.1, C.white], [0.08, C.ink], [0.06, '#3f8fd2'], [0.04, C.red], [0.02, C.yellow]].forEach(([r, c], k) => p.cylZ(x, ty, tz + 0.022 + k * 0.002, r, 0.004, c));
    for (let a = 0; a < 2; a++) { const ax = x + (a ? 0.025 : -0.03), ay = ty + (a ? -0.02 : 0.015); p.seg([ax, ay, tz + 0.03], [ax, ay, tz + 0.12], 0.003, C.woodL); p.box(ax, ay - 0.008, tz + 0.115, 0.004, 0.016, 0.02, a ? C.red : C.yellow); }
  });
  // 防護網
  for (const x of [-0.46, 0.46]) p.box(x, G, -0.45, 0.014, 0.36, 0.014, C.post);
  p.box(0, G + 0.02, -0.455, 0.92, 0.32, 0.006, '#7f9a8a');
  for (let i = 0; i < 8; i++) p.box(-0.42 + i * 0.12, G + 0.02, -0.45, 0.003, 0.32, 0.004, '#64806f');
  // 發射區遮棚
  for (const x of [-0.42, 0.42]) for (const z of [0.26, 0.46]) p.cyl(x, G, z, 0.012, 0.3, C.woodD);
  p.box(0, G + 0.3, 0.36, 0.92, 0.02, 0.26, C.wood);
  p.prism(0, G + 0.32, 0.36, 0.94, 0.08, 0.3, o.ac);
  // 弓架、箭筒
  p.box(-0.36, G, 0.42, 0.14, 0.012, 0.03, C.woodD); p.box(-0.36, G + 0.14, 0.42, 0.14, 0.012, 0.03, C.woodD);
  for (let i = 0; i < 3; i++) dzBow(p, -0.41 + i * 0.05, G + 0.01, 0.43, ['#7a4a2c', '#2f3a55', '#a4473a'][i]);
  for (let i = 0; i < 2; i++) { const x = 0.32 + i * 0.07; p.cyl(x, G, 0.42, 0.02, 0.09, i ? C.red : C.teal); for (let k = 0; k < 3; k++) p.box(x - 0.01 + k * 0.01, G + 0.09, 0.42, 0.006, 0.025, 0.006, [C.yellow, C.red, C.cream][k]); }
  // 射手：面向標靶拉弓
  [-0.3, 0, 0.3].forEach((x, i) => {
    kitMini(p, x, G, 0.27, [C.indigo, C.coral, C.teal][i], { hat: i === 1 ? 'cap' : '' });
    p.push(x + 0.04, G + 0.03, 0.24, Math.PI / 2); dzBow(p, 0, 0, 0, '#5a3a28'); p.pop();
    p.seg([x + 0.04, G + 0.1, 0.24], [x + 0.04, G + 0.1, 0.14], 0.002, C.woodL);
  });
  // 教練＋風向旗
  kitMini(p, 0.12, G, 0.42, C.cream, { hat: 'cap' });
  p.cyl(0.46, G, 0.08, 0.006, 0.34, C.post); p.box(0.46 + 0.04, G + 0.29, 0.08, 0.08, 0.05, 0.004, C.yellow, 0, 0, 0);
  p.spill(0, 0.36, 0.8, 0.3, G + 0.012, 0.7);
}

// ---------- 樂樂棒球場 ----------
function kitMTeeball(p, o) {
  const G = kitG, C = kitC, D = dzC, hz = 0.33;
  p.rbox(0, 0, 0, 1, G, 1, C.grassD);
  // 紅土內野＋草皮
  p.box(0, G, hz - 0.29, 0.5, 0.005, 0.5, D.clay, Math.PI / 4);
  p.box(0, G + 0.001, hz - 0.29, 0.34, 0.006, 0.34, C.grass, Math.PI / 4);
  p.cyl(0, G, hz - 0.29, 0.04, 0.012, D.clayD);                                // 投手丘
  // 壘包：本壘、一、二、三壘
  const bd = 0.205;
  p.box(0, G + 0.006, hz, 0.035, 0.008, 0.035, C.white, Math.PI / 4);
  p.box(bd, G + 0.006, hz - bd, 0.03, 0.012, 0.03, C.white, Math.PI / 4);
  p.box(0, G + 0.006, hz - bd * 2, 0.03, 0.012, 0.03, C.white, Math.PI / 4);
  p.box(-bd, G + 0.006, hz - bd, 0.03, 0.012, 0.03, C.white, Math.PI / 4);
  for (const s of [-1, 1]) p.seg([0, G + 0.007, hz], [s * 0.44, G + 0.007, hz - 0.44], 0.003, C.white, 'box', 0.001); // 界外線
  // 打擊座＋球＋打者
  p.cyl(0, G, hz - 0.02, 0.014, 0.006, C.ink); p.cyl(0, G + 0.006, hz - 0.02, 0.007, 0.07, C.yellow); p.sph(0, G + 0.085, hz - 0.02, 0.014, C.white);
  kitMini(p, 0.06, G, hz + 0.02, C.red, { hat: 'cap' }); p.seg([0.07, G + 0.08, hz], [0.02, G + 0.13, hz - 0.03], 0.007, C.woodL);
  kitMini(p, 0, G, hz + 0.1, C.ink, { hat: 'cap' });                                // 捕手
  // 守備員
  [[bd + 0.03, hz - bd - 0.02], [0.05, hz - bd * 2 - 0.04], [-bd - 0.03, hz - bd - 0.02], [-0.1, hz - 0.3], [0, hz - 0.29], [0.28, -0.32], [-0.28, -0.32]].forEach(([x, z], i) => kitMini(p, x, G, z, i % 2 ? C.indigo : '#3e6fb0', { hat: 'cap' }));
  // 外野圍籬
  for (let i = 0; i <= 12; i++) {
    const a = -0.72 + i * 0.12, r = 0.74, x = Math.sin(a) * r, z = hz - Math.cos(a) * r;
    if (Math.abs(x) > 0.47 || z < -0.47) continue;
    p.box(x, G, z, 0.1, 0.07, 0.012, '#3f7d5a', -a); p.box(x, G + 0.07, z, 0.1, 0.01, 0.014, C.yellow, -a);
  }
  // 計分板
  for (const s of [-1, 1]) p.box(-0.38 + s * 0.06, G, 0.3, 0.012, 0.22, 0.012, C.post);
  p.box(-0.38, G + 0.2, 0.3, 0.2, 0.12, 0.02, '#2f5a45');
  for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) p.gbox(-0.45 + c * 0.045, G + 0.23 + r * 0.045, 0.312, 0.03, 0.03, 0.004, c === 3 ? C.yellow : C.cream);
  p.box(-0.38, G + 0.32, 0.3, 0.2, 0.025, 0.024, o.ac);
  // 休息區
  p.box(0.36, G, 0.42, 0.22, 0.04, 0.05, C.wood); p.box(0.36, G, 0.45, 0.24, 0.16, 0.01, '#3e6fb0');
  p.box(0.36, G + 0.16, 0.43, 0.26, 0.012, 0.08, o.ac);
  for (let i = 0; i < 3; i++) kitMini(p, 0.29 + i * 0.07, G + 0.04, 0.42, [C.coral, C.yellow, C.teal][i], { hat: 'cap' });
  p.spill(0, 0.05, 0.8, 0.6, G + 0.012, 0.6);
}

// ---------- 香山烏魚食魚坊 ----------
function kitMMullet(p, o) {
  const G = kitG, C = kitC, D = dzC;
  p.rbox(0, 0, 0, 1, G, 1, D.sand);
  p.box(0, G, -0.25, 1, 0.008, 0.5, D.sea);                               // 海水
  for (let i = 0; i < 6; i++) p.box(-0.4 + i * 0.16, G + 0.009, -0.12 - (i % 2) * 0.12, 0.08, 0.002, 0.01, C.cream);  // 浪花
  // 木棧碼頭
  for (let i = 0; i < 7; i++) p.box(0.28, G + 0.03, -0.02 - i * 0.06, 0.16, 0.012, 0.05, i % 2 ? C.wood : C.woodL);
  for (const z of [-0.05, -0.2, -0.36]) for (const s of [-1, 1]) p.cyl(0.28 + s * 0.07, G, z, 0.012, 0.06, C.woodD);
  // 小漁船
  p.push(-0.25, G + 0.008, -0.3, 0.3);
  p.box(0, 0, 0, 0.26, 0.05, 0.09, C.red); p.box(0, 0.05, 0, 0.27, 0.012, 0.095, C.cream);
  p.prism(0.14, 0, 0, 0.04, 0.05, 0.09, C.red); p.box(-0.03, 0.06, 0, 0.08, 0.06, 0.07, C.white);
  p.cyl(0.05, 0.06, 0, 0.006, 0.22, C.woodD); p.box(0.05, 0.24, 0, 0.004, 0.03, 0.08, C.yellow);
  p.pop();
  // 跳躍的烏魚
  [[-0.05, -0.18, 0.1, 0.5], [0.08, -0.36, 0.14, -0.6], [-0.4, -0.08, 0.08, 0.2]].forEach(([x, z, h, r]) => {
    p.add('sphere', x, G + h, z, 0.09, 0.035, 0.03, D.fish, 0, r, 0.5);
    p.add('sphere', x - Math.cos(r) * 0.01, G + h + 0.008, z + Math.sin(r) * 0.01, 0.07, 0.015, 0.024, D.fishD, 0, r, 0.5);
    p.add('prism', x - Math.cos(r) * 0.05, G + h - 0.02, z + Math.sin(r) * 0.05, 0.03, 0.03, 0.006, D.fishD, 0, r + Math.PI / 2, 0);
  });
  // 九降風曬烏魚子架
  const rx = -0.15, rz = 0.24;
  for (const s of [-1, 1]) { p.seg([rx + s * 0.2, G, rz - 0.05], [rx + s * 0.2, G + 0.14, rz], 0.008, C.woodD); p.seg([rx + s * 0.2, G, rz + 0.05], [rx + s * 0.2, G + 0.14, rz], 0.008, C.woodD); }
  for (let L = 0; L < 2; L++) {
    p.box(rx, G + 0.06 + L * 0.06, rz, 0.44, 0.008, 0.12, C.woodL);
    for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) p.add('sphere', rx - 0.17 + i * 0.068, G + 0.07 + L * 0.06, rz - 0.03 + j * 0.06, 0.05, 0.012, 0.028, (i + j) % 2 ? D.roe : D.roeD);
  }
  // 料理攤（食魚教育）
  const sx = 0.3, sz = 0.3;
  p.box(sx, G, sz, 0.26, 0.1, 0.14, C.wood); p.box(sx, G + 0.1, sz, 0.28, 0.012, 0.16, C.cream);
  p.cyl(sx - 0.06, G + 0.112, sz, 0.03, 0.02, C.ink); p.add('sphere', sx + 0.06, G + 0.118, sz, 0.08, 0.02, 0.03, D.fish);
  for (const a of [-1, 1]) for (const b of [-1, 1]) p.cyl(sx + a * 0.13, G, sz + b * 0.07, 0.008, 0.28, C.woodD);
  for (let i = 0; i < 4; i++) p.box(sx - 0.12 + i * 0.08, G + 0.29, sz, 0.08, 0.016, 0.2, i % 2 ? C.cream : o.ac, 0, 0.2);
  // 廚師（白高帽）＋學生
  kitMini(p, sx, G, sz - 0.12, C.white); p.cyl(sx, G + 0.13, sz - 0.12, 0.026, 0.035, C.white); p.sph(sx, G + 0.17, sz - 0.12, 0.034, C.white, 0.6);
  kitMini(p, sx - 0.08, G, sz + 0.13, C.yellow, { hat: 'cap' }); kitMini(p, sx + 0.06, G, sz + 0.14, C.teal);
  // 鷺鷥（香山濕地）
  p.add('sphere', -0.42, G + 0.09, 0.42, 0.05, 0.035, 0.03, C.white); p.seg([-0.42, G, 0.42], [-0.42, G + 0.07, 0.42], 0.003, C.ink);
  p.seg([-0.4, G + 0.1, 0.42], [-0.38, G + 0.15, 0.42], 0.006, C.white); p.cone(-0.37, G + 0.15, 0.42, 0.006, 0.03, C.orange, 0, 0, -Math.PI / 2);
  p.spill(sx, sz, 0.4, 0.3, G + 0.012, 0.8);
}

// ---------- 永續智慧教室 2.0（太陽能板＋觸控大屏＋碳盤查拼圖牆） ----------
function kitMSmartclass(p, o) {
  const G = kitG, C = kitC, bx = -0.05, bz = -0.12, W = 0.66, Dp = 0.42, H = 0.34;
  p.rbox(0, 0, 0, 1, G, 1, C.stoneL);
  p.box(bx, G, bz, W, H, Dp, C.wall);
  p.box(bx, G + H, bz, W + 0.04, 0.02, Dp + 0.04, C.roofB);
  // 屋頂太陽能板（斜排）
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) {
    const x = bx - 0.2 + i * 0.2, z = bz - 0.09 + j * 0.18;
    p.box(x, G + H + 0.04, z, 0.18, 0.01, 0.15, '#2b3e66', 0, -0.35);
    p.box(x, G + H + 0.045, z, 0.002, 0.012, 0.15, '#9fb4d6', 0, -0.35); p.box(x, G + H + 0.045, z, 0.18, 0.012, 0.002, '#9fb4d6', 0, -0.35);
    p.box(x, G + H, z + 0.05, 0.01, 0.04, 0.01, C.post);
  }
  // 綠牆＋大落地窗
  for (let i = 0; i < 3; i++) kitWin(p, bx - 0.2 + i * 0.2, G + 0.09, bz + Dp / 2, 0.14, 0.16);
  for (let i = 0; i < 6; i++) p.sph(bx + W / 2 + 0.005, G + 0.05 + (i % 3) * 0.1, bz - 0.15 + Math.floor(i / 3) * 0.3, 0.035, C.leaf2);
  // 門＋招牌
  p.gbox(bx + 0.27, G, bz + Dp / 2, 0.08, 0.16, 0.012, C.glass);
  p.box(bx, G + H - 0.06, bz + Dp / 2 + 0.008, 0.36, 0.05, 0.012, o.ac); p.box(bx, G + H - 0.05, bz + Dp / 2 + 0.016, 0.3, 0.025, 0.003, C.cream);
  // 前院：碳盤查拼圖桌（彩色方塊）、觸控大屏、學生
  p.box(0.12, G, 0.3, 0.26, 0.07, 0.14, C.woodL);
  const pc = [C.coral, C.yellow, C.teal, C.leaf1, C.indigo, C.pink];
  for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) p.box(0.03 + i * 0.036, G + 0.07, 0.27 + j * 0.06, 0.03, 0.012, 0.05, pc[(i + j * 3) % 6]);
  kitMini(p, 0.02, G, 0.42, C.coral); kitMini(p, 0.22, G, 0.42, C.teal, { hat: 'cap' });
  p.box(-0.34, G, 0.3, 0.02, 0.12, 0.02, C.post); p.box(-0.34, G + 0.12, 0.3, 0.2, 0.13, 0.02, C.ink); p.gbox(-0.34, G + 0.13, 0.312, 0.18, 0.11, 0.004, '#8fd0e8');
  for (let i = 0; i < 4; i++) p.box(-0.41 + i * 0.045, G + 0.15, 0.316, 0.025, 0.012 + i * 0.012, 0.002, [C.leaf1, C.yellow, C.coral, C.teal][i]);
  // 小風機
  p.cyl(0.4, G, -0.38, 0.008, 0.42, C.white);
  for (let i = 0; i < 3; i++) { const a = i * 2.094; p.seg([0.4, G + 0.42, -0.37], [0.4 + Math.cos(a) * 0.12, G + 0.42 + Math.sin(a) * 0.12, -0.37], 0.008, C.white, 'box', 0.003); }
  p.spill(bx, bz + 0.3, 0.6, 0.2, G + 0.012, 0.9);
}
