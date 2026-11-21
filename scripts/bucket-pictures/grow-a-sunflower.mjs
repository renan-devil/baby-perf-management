// Grow a sunflower: a tall sunflower with broad leaves towers over a little watering can sprinkling its roots.
import { PAL, hatch, paths, rng, transformPath, tufts } from '../story-pictures/lib.mjs';

const f = (n) => Math.round(n * 10) / 10;

/** A smooth closed curve through the points (Catmull-Rom turned into cubic Béziers). */
function loop(pts) {
  const n = pts.length;
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [pts[(i - 1 + n) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return `${d}Z`;
}

/** A slightly uneven hand-drawn circle. */
function ring(cx, cy, r, seed = 1, wob = 0.05, n = 12) {
  const R = rng(seed);
  return loop(
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * 2 * Math.PI;
      const k = r * (1 + (R() - 0.5) * wob);
      return [cx + Math.cos(a) * k, cy + Math.sin(a) * k];
    }),
  );
}

const GY = 266; // ground

// --- The flower head: a ring of pointed petals (and a second ring behind) round a seedy middle. ---
const [CX, CY] = [228, 86];
const polar = (r, a) => [CX + Math.cos(a) * r, CY + Math.sin(a) * r];
function petal(a, r0, r1, w) {
  return loop([polar(r0, a - (w * 0.6) / r0), polar((r0 + r1) / 2, a - w / ((r0 + r1) / 2)), polar(r1, a), polar((r0 + r1) / 2, a + w / ((r0 + r1) / 2)), polar(r0, a + (w * 0.6) / r0)]);
}
const R0 = rng(5);
const N = 14;
const front = Array.from({ length: N }, (_, i) => petal((i / N) * 2 * Math.PI + 0.1, 31, 62 + R0() * 6, 11)).join('');
const back = Array.from({ length: N }, (_, i) => petal(((i + 0.5) / N) * 2 * Math.PI + 0.1, 31, 55 + R0() * 5, 10)).join('');
const disk = ring(CX, CY, 33, 7, 0.04, 14);
const diskInner = ring(CX + 1, CY + 1, 24, 9, 0.06, 10);
// Criss-cross seeds inside the middle.
let seeds = '';
for (const s of [1, -1]) {
  for (let k = -28; k <= 28; k += 8) {
    const h = Math.sqrt(Math.max(0, 27 * 27 - k * k));
    if (h < 4) continue;
    // a line at 45° (or -45°), k away from the centre, between -h and h along it
    const [ux, uy] = [Math.SQRT1_2, s * Math.SQRT1_2];
    const [nx, ny] = [-uy, ux];
    seeds += `M${f(CX + nx * k - ux * h)} ${f(CY + ny * k - uy * h)}L${f(CX + nx * k + ux * h)} ${f(CY + ny * k + uy * h)}`;
  }
}

// --- The stem and its broad leaves. ---
const stem = `M226 146C223 166 226 200 228 232C229 250 228 ${GY - 6} 227 ${GY}M236 146C234 166 237 200 239 232C240 250 241 ${GY - 6} 241 ${GY}`;
const stemWash = `M227 142L236 142C234 166 237 200 239 232C240 250 241 ${GY - 6} 241 ${GY}L227 ${GY}C228 ${GY - 6} 229 250 228 232C226 200 223 166 227 142Z`;
const leafL = loop([[226, 184], [210, 162], [182, 150], [154, 146], [124, 136], [142, 158], [168, 174], [200, 184]]);
const leafR = loop([[240, 216], [258, 194], [288, 184], [318, 186], [346, 184], [326, 204], [294, 220], [264, 224]]);
const veins =
  'M226 184C200 172 166 156 130 139M208 176C206 166 200 160 192 156M186 166C182 158 176 154 168 152M196 172C188 176 180 178 172 178M166 156C160 160 154 162 148 162' +
  'M240 216C268 204 306 192 342 186M258 210C262 200 270 194 278 190M286 200C290 192 298 188 306 186M268 212C276 218 284 220 294 218M300 198C306 204 314 206 322 204';

// --- The watering can, drawn upright around (0,0) = the middle of its base, then tipped. ---
const C = 'translate(112 226) rotate(40)';
const canBody = 'M-25 -42C-26 -28 -27 -12 -26 -3C-26 0 -24 1 -21 1L21 1C24 1 26 0 26 -3C27 -12 26 -28 25 -42Z';
const canTop = 'M-25 -42C-14 -46 14 -46 25 -42C14 -38 -14 -38 -25 -42Z';
const handle = 'M-18 -44C-16 -62 10 -62 12 -44M-12 -44C-10 -55 6 -55 7 -44';
const spout = 'M25 -12L60 -38M25 -22L56 -42';
const rose = 'M56 -44L60 -36L74 -48C72 -54 68 -57 64 -56Z';
const roseFace = 'M64 -56C68 -57 73 -53 74 -48';
const bands = 'M-26 -10C-10 -7 10 -7 26 -10M-25 -33C-10 -31 10 -31 25 -33';
const canWash = 'M-25 -42C-26 -28 -27 -12 -26 -3C-26 0 -24 1 -21 1L21 1C24 1 26 0 26 -3L25 -12L60 -38L56 -42L25 -22L25 -42C14 -46 -14 -46 -25 -42Z' + rose;
const handleWash = 'M-18 -44C-16 -62 10 -62 12 -44L7 -44C6 -55 -10 -55 -12 -44Z';
const at = (d) => transformPath(d, C);
const shine = at('M-16 -20').slice(1).trim().split(' ').map(Number); // a highlight on the can's side

// Drops falling from the rose onto the soil at the foot of the stem.
const drop = (x, y, s = 1) => `M${x} ${y}C${f(x + 3 * s)} ${f(y + 4 * s)} ${f(x + 4 * s)} ${f(y + 7 * s)} ${x} ${f(y + 8 * s)}C${f(x - 4 * s)} ${f(y + 7 * s)} ${f(x - 3 * s)} ${f(y + 4 * s)} ${x} ${y}Z`;
const drops = drop(200, 238, 1.3) + drop(212, 248, 1.2) + drop(196, 252, 1.1) + drop(218, 234, 1.1);
const streaks = 'M204 228l3 6M214 226l5 5M196 232l-1 6';
const mound = `M188 ${GY}C196 ${GY - 9} 216 ${GY - 12} 234 ${GY - 12}C252 ${GY - 12} 268 ${GY - 8} 276 ${GY}`;

export default {
  title: 'Grow a sunflower',
  seed: 97,
  washes: [
    { c: PAL.green, o: 0.38, d: `M0 ${GY - 3}C90 ${GY - 6} 170 ${GY - 1} 250 ${GY - 4}C320 ${GY - 6} 360 ${GY - 2} 400 ${GY - 5}L400 288C320 296 240 284 160 292C90 298 40 288 0 294Z` },
    { c: PAL.terracotta, o: 0.45, d: `${mound}L276 ${GY + 4}C250 ${GY + 7} 210 ${GY + 7} 188 ${GY + 4}Z` },
    { c: PAL.green, o: 0.7, d: stemWash },
    { c: PAL.green, o: 0.66, d: leafL + leafR },
    { c: PAL.ochre, o: 0.72, d: back },
    { c: PAL.terracotta, o: 0.18, d: back },
    { c: PAL.ochre, o: 0.8, d: front },
    { c: PAL.terracotta, o: 0.85, d: disk },
    { c: PAL.ink, o: 0.3, d: diskInner },
    { c: PAL.sky, o: 0.72, d: at(canWash) },
    { c: PAL.sky, o: 0.6, d: at(handleWash) },
    { c: PAL.slate, o: 0.3, d: at('M10 -40C14 -24 16 -10 14 0L21 1C24 1 26 0 26 -3C27 -12 26 -28 25 -42Z') },
    { c: PAL.sky, o: 0.6, d: drops },
  ],
  lines: paths([`M0 ${GY}C90 ${GY - 3} 170 ${GY + 2} 250 ${GY - 1}C320 ${GY - 3} 360 ${GY + 1} 400 ${GY - 2}`, stem, leafL, leafR, disk]) + paths([canBody, handle, spout, rose], C),
  fine:
    paths([
      front,
      seeds,
      veins,
      mound,
      drops,
      streaks,
      hatch(14, 280, 390, 282, 12, 7, 165, 5),
      tufts([[34, GY - 1], [70, GY - 1], [150, GY], [300, GY - 2], [342, GY - 2], [380, GY - 2]], 10, 5),
    ]) + paths([canTop, roseFace, bands], C),
  glints: `<ellipse cx="${shine[0]}" cy="${shine[1]}" rx="1.5" ry="7" transform="rotate(40 ${shine[0]} ${shine[1]})"/>`,
};
