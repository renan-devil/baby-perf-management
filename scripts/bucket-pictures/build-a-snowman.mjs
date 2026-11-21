// Build a snowman: carrot nose, pebble eyes and smile, twig arms, red scarf and black hat, in the falling snow.
import { PAL, hatch, paths, transformPath } from '../story-pictures/lib.mjs';

const f = (n) => Math.round(n * 10) / 10;
const rad = (deg) => (deg * Math.PI) / 180;
const on = (cx, cy, r, deg) => [cx + Math.cos(rad(deg)) * r, cy + Math.sin(rad(deg)) * r];

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

/** An arc of the circle (cx, cy, r) from angle a0 to a1 (degrees, clockwise on screen). */
function arc(cx, cy, r, a0, a1) {
  const [x0, y0] = on(cx, cy, r, a0);
  const [x1, y1] = on(cx, cy, r, a1);
  return `M${f(x0)} ${f(y0)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${f(x1)} ${f(y1)}`;
}

/** The shadowed lower-right side of a snowball: a crescent from angle a0 to a1. */
function shade(cx, cy, r, a0, a1, depth = 0.3) {
  const outer = [];
  const inner = [];
  for (let i = 0; i <= 10; i++) {
    const a = a0 + ((a1 - a0) * i) / 10;
    outer.push(on(cx, cy, r, a));
    inner.unshift(on(cx, cy, r * (1 - depth * Math.sin((Math.PI * i) / 10)), a));
  }
  return loop([...outer, ...inner.slice(1, -1)]);
}

/** A six-armed snowflake of size s at (x, y). */
function flake(x, y, s, turn = 0) {
  let d = '';
  for (let i = 0; i < 3; i++) {
    const a = rad(turn + i * 60);
    d += `M${f(x - Math.cos(a) * s)} ${f(y - Math.sin(a) * s)}L${f(x + Math.cos(a) * s)} ${f(y + Math.sin(a) * s)}`;
  }
  return d;
}

const GY = 268; // where the snowman stands in the snow

// --- The snowman: head, body and base, each a ball of snow (paper) with a cool shadow. ---
const head = [200, 98, 28];
const body = [200, 158, 38];
const base = [200, 230, 50];
const headLine = arc(...head, 140, 400);
const bodyLine = arc(...body, -52, 232);
// The base shows only beside the body and above the snow.
const baseLeft = 'M176.4 186A50 50 0 0 0 164 264';
const baseRight = 'M223.6 186A50 50 0 0 1 236 264';
// The snowman's outline, to keep him white inside the pale winter sky behind him.
const silhouette =
  'M186.4 122.5A28 28 0 1 1 213.6 122.5A38 38 0 0 1 225 186.7A50 50 0 1 1 175 186.7A38 38 0 0 1 186.4 122.5Z';
const sky = loop([
  [40, 120], [52, 60], [100, 26], [170, 14], [250, 16], [320, 34], [362, 80], [370, 150], [360, 220], [330, GY - 8],
  [200, GY - 2], [70, GY - 8], [36, 200],
]);
const drift = `M0 ${GY - 6}C30 ${GY - 12} 60 ${GY - 2} 96 ${GY - 6}C126 ${GY - 10} 150 ${GY - 4} 164 264M236 264C252 ${GY - 6} 280 ${GY - 12} 312 ${GY - 6}C344 ${GY} 370 ${GY - 10} 400 ${GY - 8}`;
const front = `M150 ${GY + 2}C172 ${GY - 4} 228 ${GY - 4} 252 ${GY + 2}`;

// Face: pebble eyes, a smile of little pebbles and a carrot nose.
const smile = [[186, 108], [192, 112.5], [200, 114], [208, 112.5], [214, 108]];
const carrot = 'M201 95C214 97 226 100 238 105C226 106 214 106 201 104C199 101 199 98 201 95Z';
const carrotLines = 'M210 97l-2 7M219 99l-2 6M228 102l-1 3';

// The red scarf round the neck, one end hanging down with a fringe.
const scarf = 'M171 114C186 122 214 122 229 114L231 127C214 136 186 136 169 127Z';
const tail = 'M208 130C210 146 212 160 210 176L226 178C228 160 226 144 222 128Z';
const fringe = 'M211 176l-1 7M215 177l0 7M219 177l0 7M223 178l1 7';
const stripes = 'M184 119l-3 13M196 121l-2 13M216 120l2 13M211 146l13 1M211 160l14 1';

// A little black hat with a red band, worn at a slight tilt.
const H = 'rotate(-10 200 72)';
const brim = 'M172 72C186 67 214 67 228 72C226 76 222 77 218 76C206 73 194 73 182 76C178 77 174 76 172 72Z';
const crown = 'M182 72L184 42C194 38 206 38 216 42L218 72';
const crownTop = 'M184 42C192 46 208 46 216 42';
const band = 'M183 62C194 65 206 65 217 62L217.6 70C206 73 194 73 182.6 70Z';

// Twig arms, the right one up as if waving.
const arms = 'M166 150C150 140 132 128 110 118M234 148C252 136 270 122 292 106';
const twigs = 'M128 126C124 120 122 114 122 106M110 118l-10 -6M110 118l-9 4M276 118C278 110 278 104 276 96M292 106l6 -10M292 106l10 -2';
const buttons = [[199, 146], [199, 164], [199, 182]];

// Snowflakes drifting down all around.
const flakes = [
  [40, 40, 6, 10], [92, 86, 5, 0], [30, 150, 6, 20], [76, 206, 5, 5], [126, 30, 5, 15], [272, 30, 6, 0], [336, 64, 6, 12],
  [370, 136, 5, 0], [318, 176, 6, 25], [366, 214, 5, 8], [118, 168, 4.5, 30], [252, 76, 4, 0],
]
  .map(([x, y, s, t]) => flake(x, y, s, t))
  .join('');
// Soft white flakes (paper showing through the sky).
const snow = [
  [70, 70], [120, 104], [86, 140], [140, 216], [60, 180], [104, 250], [160, 40], [236, 50], [300, 56], [262, 112],
  [330, 104], [346, 160], [280, 196], [312, 240], [350, 196], [150, 140], [244, 150], [96, 30], [310, 150],
];
const specks = [
  [64, 120], [150, 60], [304, 120], [350, 30], [20, 96], [108, 236], [290, 222], [236, 24], [388, 176], [56, 250], [340, 248],
];

export default {
  title: 'Build a snowman',
  seed: 127,
  washes: [
    { c: PAL.sky, o: 0.2, d: sky + silhouette, rule: 'evenodd' },
    { c: PAL.sky, o: 0.35, d: `M0 ${GY - 4}C30 ${GY - 10} 60 ${GY} 96 ${GY - 4}C130 ${GY - 8} 150 ${GY} 170 ${GY + 4}C200 ${GY + 8} 240 ${GY + 4} 270 ${GY}C300 ${GY - 6} 344 ${GY + 2} 400 ${GY - 6}L400 ${GY + 8}C340 ${GY + 16} 300 ${GY + 10} 250 ${GY + 16}C190 ${GY + 22} 120 ${GY + 10} 0 ${GY + 12}Z` },
    { c: PAL.slate, o: 0.38, d: `M190 ${GY + 2}C220 ${GY - 4} 280 ${GY - 4} 310 ${GY + 2}C290 ${GY + 10} 220 ${GY + 10} 190 ${GY + 2}Z` },
    { c: PAL.sky, o: 0.45, d: shade(...head, -30, 140) + shade(...body, -40, 130, 0.26) + shade(...base, -50, 125, 0.28) },
    { c: PAL.slate, o: 0.28, d: shade(...body, 10, 100, 0.14) + shade(...base, 0, 100, 0.14) },
    { c: PAL.red, o: 0.85, d: scarf + tail },
    { c: PAL.terracotta, o: 0.85, d: carrot },
    { c: PAL.ochre, o: 0.55, d: carrot },
    { c: PAL.ink, o: 0.6, d: transformPath(brim + 'M182 72L184 42C194 38 206 38 216 42L218 72Z', H) },
    { c: PAL.slate, o: 0.5, d: transformPath(brim + 'M182 72L184 42C194 38 206 38 216 42L218 72Z', H) },
    { c: PAL.red, o: 0.85, d: transformPath(band, H) },
  ],
  lines: paths([headLine, bodyLine, baseLeft, baseRight, scarf, tail, carrot, arms]) + paths([brim, crown], H),
  fine:
    paths([
      drift,
      front,
      fringe,
      stripes,
      carrotLines,
      twigs,
      flakes,
      hatch(30, 284, 380, 286, 9, 7, 170, 4),
      'M80 274c8-3 16-3 24 0M300 278c8-3 16-3 24 0',
    ]) + paths([crownTop, band], H),
  fills:
    [[190, 89], [210, 89]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="3.8"/>`).join('') +
    smile.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2"/>`).join('') +
    buttons.map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.6" ry="3.2"/>`).join('') +
    specks.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.3"/>`).join(''),
  glints:
    '<circle cx="191.2" cy="87.6" r="1"/><circle cx="211.2" cy="87.6" r="1"/>' +
    snow.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${2 + (i % 3) * 0.5}"/>`).join(''),
};
