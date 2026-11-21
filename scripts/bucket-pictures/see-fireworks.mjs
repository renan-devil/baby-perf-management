import { PAL, paths, rays, rng } from '../story-pictures/lib.mjs';

// See fireworks: three bright bursts (red, gold, pink and blue) over the rooftops of a sleeping town.
const f1 = (n) => Math.round(n * 10) / 10;
const dot = (x, y, r = 1.6) => `M${f1(x - r)} ${f1(y)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
const star = (x, y, s = 4) => `M${x - s} ${y}L${x + s} ${y}M${x} ${y - s}L${x} ${y + s}`;

/**
 * One firework burst around (cx, cy): ink rays from r1 to r2, a thin coloured streak along each ray,
 * a spark at the end of every ray, and a soft flower-shaped glow behind.
 */
function burst(cx, cy, r1, r2, n, seed) {
  const r = rng(seed);
  let ink = '';
  let streaks = '';
  let sparks = '';
  let glow = '';
  const valley = (i) => {
    const b = ((i + 0.5) / n) * 2 * Math.PI;
    return `${f1(cx + Math.cos(b) * r2 * 0.5)} ${f1(cy + Math.sin(b) * r2 * 0.5)}`;
  };
  for (let i = 0; i < n; i++) {
    const a = ((i / n) * 360 + (r() - 0.5) * 8) * (Math.PI / 180);
    const [c, s] = [Math.cos(a), Math.sin(a)];
    const a1 = r1 + r() * 4;
    const a2 = r2 * (0.88 + r() * 0.16);
    const p = (k, w = 0) => `${f1(cx + c * k - s * w)} ${f1(cy + s * k + c * w)}`;
    ink += `M${p(a1)}L${p(a2)}`;
    streaks += `M${p(a1 - 2)}L${p((a1 + a2) / 2, 3.2)}L${p(a2 + 3)}L${p((a1 + a2) / 2, -3.2)}Z`;
    sparks += dot(cx + c * (a2 + 6), cy + s * (a2 + 6), 1.7);
    glow += `${i ? '' : `M${valley(n - 1)}`}Q${p(a2 * 1.05)} ${valley(i)}`;
  }
  glow += 'Z';
  return { ink, streaks, sparks, glow };
}

const red = burst(98, 100, 12, 60, 16, 3);
const gold = burst(236, 74, 11, 52, 15, 8);
const pink = burst(330, 146, 10, 50, 14, 12);

// Trails of the rockets rising from behind the roofs, wiggling a little
const trails =
  'M120 226C114 212 122 200 116 186C112 176 118 168 112 160' +
  'M226 220C232 198 222 176 230 154C236 138 228 122 234 110' +
  'M318 224C322 214 316 206 322 198';

// A row of little houses along the bottom
const roofs =
  'M0 252L34 222L70 250' +
  'M70 250L92 230L132 230L154 248' +
  'M154 248L186 214L218 246' +
  'M218 246L240 232L286 232L304 250' +
  'M304 250L330 222L356 248' +
  'M356 248L374 232L400 232';
const walls = 'M8 246L8 300M62 244L62 300M76 248L76 300M148 246L148 300M160 244L160 300M212 242L212 300M224 246L224 300M298 248L298 300M310 246L310 300M350 246L350 300M362 246L362 300';
const chimneys = 'M104 230L104 216L114 216L114 230M266 232L266 220L275 220L275 232M380 232L380 220L389 220L389 232';
const windows = [
  [26, 262, 16, 14],
  [96, 258, 14, 14],
  [124, 262, 14, 14],
  [178, 256, 16, 16],
  [242, 260, 14, 14],
  [268, 264, 14, 12],
  [322, 262, 16, 14],
  [372, 258, 14, 14],
];
const win = windows.map(([x, y, w, h]) => `M${x} ${y}L${x + w} ${y}L${x + w} ${y + h}L${x} ${y + h}Z`).join('');
const winBars = windows.map(([x, y, w, h]) => `M${x + w / 2} ${y}L${x + w / 2} ${y + h}`).join('');
const town = 'M0 252L34 222L70 250L92 230L132 230L154 248L186 214L218 246L240 232L286 232L304 250L330 222L356 248L374 232L400 232L400 300L0 300Z';

export default {
  title: 'See fireworks',
  seed: 627,
  washes: [
    // the night sky, lit up (left as paper) round each burst
    { c: PAL.slate, o: 0.36, rule: 'evenodd', d: 'M0 0L400 0L400 300L0 300Z' + town + red.glow + gold.glow + pink.glow },
    { c: PAL.red, o: 0.16, d: red.glow },
    { c: PAL.ochre, o: 0.22, d: gold.glow },
    { c: PAL.rose, o: 0.2, d: pink.glow },
    { c: PAL.red, o: 0.85, d: red.streaks },
    { c: PAL.ochre, o: 0.92, d: gold.streaks },
    { c: PAL.rose, o: 0.95, d: pink.streaks },
    { c: PAL.sky, o: 0.85, d: burst(330, 146, 8, 28, 9, 21).streaks },
    { c: PAL.grey, o: 0.55, d: town },
    { c: PAL.terracotta, o: 0.5, d: 'M0 252L34 222L70 250ZM70 250L92 230L132 230L154 248ZM154 248L186 214L218 246ZM218 246L240 232L286 232L304 250ZM304 250L330 222L356 248ZM356 248L374 232L400 232L400 248Z' },
    { c: PAL.ochre, o: 0.85, d: win },
  ],
  lines: paths([roofs, chimneys, win]),
  fine: paths([red.ink, gold.ink, pink.ink, rays(330, 146, 8, 28, 9, 21, 20), walls, winBars, star(30, 30), star(372, 40, 3), star(160, 160, 3), star(388, 196, 3), star(170, 22, 3)]),
  once: `<path d="${trails}" stroke-dasharray="4 5" stroke-width="1.4"/>`,
  fills: `<path d="${red.sparks}${gold.sparks}${pink.sparks}${dot(300, 30, 1.3)}${dot(40, 190, 1.2)}${dot(180, 120, 1.2)}"/>`,
  glints: `<path d="${dot(98, 100, 3)}${dot(236, 74, 3)}${dot(330, 146, 2.5)}"/>`,
};
