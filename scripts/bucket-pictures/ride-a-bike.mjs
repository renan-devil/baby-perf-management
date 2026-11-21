// Ride a bike: a little red bicycle with a basket and a bell whizzes off, its two stabilisers left behind in the grass.
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
function ring(cx, cy, r, seed = 1, wob = 0.03, n = 12) {
  const R = rng(seed);
  return loop(
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * 2 * Math.PI;
      const k = r * (1 + (R() - 0.5) * wob);
      return [cx + Math.cos(a) * k, cy + Math.sin(a) * k];
    }),
  );
}

/** The polygon pushed out (d > 0) or pulled in (d < 0) by d, keeping its edges parallel. */
function grow(poly, d) {
  const area = poly.reduce((s, p, i) => s + p[0] * poly[(i + 1) % poly.length][1] - poly[(i + 1) % poly.length][0] * p[1], 0);
  const k = area > 0 ? -d : d;
  const n = poly.length;
  const edges = poly.map((p, i) => {
    const q = poly[(i + 1) % n];
    const [dx, dy] = [q[0] - p[0], q[1] - p[1]];
    const L = Math.hypot(dx, dy);
    return [p[0] + (dy / L) * k, p[1] - (dx / L) * k, dx, dy];
  });
  return poly.map((_, i) => {
    const a = edges[(i - 1 + n) % n];
    const b = edges[i];
    const t = ((b[0] - a[0]) * b[3] - (b[1] - a[1]) * b[2]) / (a[2] * b[3] - a[3] * b[2]);
    return [a[0] + a[2] * t, a[1] + a[3] * t];
  });
}
const poly = (pts) => `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}Z`;

/** A straight tube of width w from A to B: its two sides, and its shape for the wash. */
function tube([ax, ay], [bx, by], w) {
  const L = Math.hypot(bx - ax, by - ay);
  const [nx, ny] = [(-(by - ay) / L) * (w / 2), ((bx - ax) / L) * (w / 2)];
  const c = [[ax + nx, ay + ny], [bx + nx, by + ny], [bx - nx, by - ny], [ax - nx, ay - ny]];
  return { sides: `M${f(c[0][0])} ${f(c[0][1])}L${f(c[1][0])} ${f(c[1][1])}M${f(c[3][0])} ${f(c[3][1])}L${f(c[2][0])} ${f(c[2][1])}`, shape: poly(c) };
}

// --- The bicycle, facing right, its wheels on the ground at y = 254. ---
const R = [148, 210]; // rear hub
const F = [292, 210]; // front hub
const B = [214, 220]; // bottom bracket (pedals)
const S = [194, 160]; // where the seat tube meets the top tube
const H1 = [262, 146]; // top of the head tube
const H2 = [268, 170]; // bottom of the head tube
const W = 7; // tube width

const outer = grow([R, S, H1, H2, B], W / 2);
const frontHole = grow([S, H1, H2, B], -W / 2);
const rearHole = grow([R, S, B], -W / 2);
const frame = poly(outer) + poly(frontHole) + poly(rearHole);

const fork = tube(H2, F, 6);
const stem = tube(H1, [258, 120], 5);
const post = tube(S, [190, 138], 4.5);

const wheel = ([x, y], seed) => ({
  tyre: ring(x, y, 44, seed) + ring(x, y, 37.5, seed + 1),
  rim: ring(x, y, 34, seed + 2, 0.02),
  hub: ring(x, y, 4, seed + 3, 0.05, 8),
  spokes: Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * 2 * Math.PI + 0.2;
    return `M${f(x + Math.cos(a) * 5)} ${f(y + Math.sin(a) * 5)}L${f(x + Math.cos(a) * 33)} ${f(y + Math.sin(a) * 33)}`;
  }).join(''),
});
const rear = wheel(R, 11);
const front = wheel(F, 21);

const saddle = 'M166 134C168 126 190 125 208 131C211 135 204 138 192 138C180 139 168 141 166 134Z';
const bar = 'M258 121C250 118 244 115 236 113';
const grip = 'M237 109L222 107C218 107 218 115 222 115L237 117Z';
const bell = 'M242 113C241 100 259 100 258 113Z';
const bellBits = 'M250 102l0-3M258 110l5-3M241 113l18 0';
const chainring = ring(B[0], B[1], 12, 31, 0.04, 10);
const sprocket = ring(R[0], R[1], 6.5, 33, 0.04, 8);
const chain = `M${B[0]} ${B[1] - 12}L${R[0]} ${R[1] - 6.5}M${B[0]} ${B[1] + 12}L${R[0]} ${R[1] + 6.5}`;
const crank = 'M214 220L226 236M214 220L203 205';
const pedals = 'M219 237L234 237L234 242L219 242ZM196 202L210 202L210 207L196 207Z';

// The basket hangs in front of the handlebar, two flowers peeping out of it.
const basket = 'M266 106C282 104 302 102 320 102L314 140C313 145 309 147 304 147L282 148C277 148 274 146 273 141Z';
const basketRim = 'M266 112C282 110 302 108 319 108';
const weave = 'M270 122C286 121 302 119 317 118M272 132C287 131 302 130 315 129M276 141C288 141 300 140 312 139' +
  'M276 112L280 147M287 111L289 147M298 110L299 147M309 109L307 146';
const strap = 'M266 110L260 118M268 140L268 168';
const stalks = 'M284 104C284 96 282 90 280 86M300 102C301 94 304 86 307 80';
/** A little flower: n rounded petals around (x, y). */
const flower = (x, y, n = 6, r = 10, turn = 0) => {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI + turn;
    const [c, s] = [Math.cos(a), Math.sin(a)];
    const w = (r * 1.6) / n;
    d += loop([
      [x + c * 3, y + s * 3],
      [x + c * r * 0.6 - s * w, y + s * r * 0.6 + c * w],
      [x + c * r, y + s * r],
      [x + c * r * 0.6 + s * w, y + s * r * 0.6 - c * w],
    ]);
  }
  return d;
};

// Off it goes: speed lines and little puffs of dust behind.
const speed = 'M28 150L92 150M50 172L100 172M18 196L88 196M58 128L96 128';
const swish = 'M98 178C93 190 93 206 97 220M86 172C80 188 80 210 86 228';
const puffs = 'M84 252C78 252 76 244 82 242C82 236 92 236 94 241C100 240 102 248 96 250M58 248C54 248 53 242 58 241C59 237 66 237 67 241C71 241 72 246 68 248';

// A stabiliser, around (0,0) = its hub: a little wheel on a bent bracket.
const stab = {
  wheel: ring(0, 0, 13, 41, 0.05, 10) + ring(0, 0, 8.5, 43, 0.05, 10),
  hub: ring(0, 0, 3, 45, 0.05, 6),
  bracket: 'M-2 -3L-6 -28L-13 -30L-12 -44L3 -44L2 -29L-6 -28M2 -2L-1 -26',
  slot: 'M-5 -40L-5 -32',
};
const S1 = 'translate(48 272) rotate(-30) scale(1.2)';
const S2 = 'translate(118 279) rotate(104) scale(1.12)';
const stabLines = (t) => paths([stab.wheel, stab.bracket], t);

// The whole bicycle is drawn above at its own size, then enlarged a little and moved right, its
// wheels still on the ground.
const BK = 'translate(224 254) scale(1.1) translate(-214 -254)';
const bk = (d) => transformPath(d, BK);

const ground = 'M0 255C70 252 150 256 230 254C300 252 350 255 400 253';

export default {
  title: 'Ride a bike',
  seed: 71,
  washes: [
    { c: PAL.green, o: 0.42, d: 'M0 250C70 247 150 251 230 249C300 247 350 250 400 248L400 284C330 292 250 282 170 290C100 296 40 286 0 292Z' },
    { c: PAL.red, o: 0.82, d: bk(frame + fork.shape), rule: 'evenodd' },
    { c: PAL.slate, o: 0.6, d: bk(rear.tyre + front.tyre), rule: 'evenodd' },
    { c: PAL.grey, o: 0.45, d: bk(stem.shape + post.shape + chainring) },
    { c: PAL.slate, o: 0.85, d: bk(saddle + grip) },
    { c: PAL.ochre, o: 0.85, d: bk(bell) },
    { c: PAL.ochre, o: 0.6, d: bk(basket) },
    { c: PAL.terracotta, o: 0.3, d: bk('M268 112C284 110 302 108 318 108L314 140C313 145 309 147 304 147L282 148C277 148 274 146 273 141Z') },
    { c: PAL.rose, o: 0.75, d: bk(flower(280, 86, 6, 9)) },
    { c: PAL.sky, o: 0.6, d: bk(flower(306, 78, 5, 10, 0.3)) },
    { c: PAL.ochre, o: 0.9, d: bk(ring(280, 86, 3.2, 51) + ring(306, 78, 3.4, 52)) },
    { c: PAL.slate, o: 0.6, d: transformPath(stab.wheel, S1) + transformPath(stab.wheel, S2), rule: 'evenodd' },
    { c: PAL.red, o: 0.7, d: transformPath(stab.hub, S1) + transformPath(stab.hub, S2) },
    { c: PAL.grey, o: 0.55, d: transformPath('M-6 -28L-13 -30L-12 -44L3 -44L2 -29Z', S1) + transformPath('M-6 -28L-13 -30L-12 -44L3 -44L2 -29Z', S2) },
    { c: PAL.grey, o: 0.3, d: puffs },
  ],
  lines:
    paths([ground, speed]) +
    paths([frame, fork.sides, stem.sides, post.sides, rear.tyre, front.tyre, saddle, bar, grip, bell, basket, chainring, crank], BK) +
    stabLines(S1) +
    stabLines(S2),
  fine:
    paths(
      [
        rear.rim,
        front.rim,
        rear.hub,
        front.hub,
        rear.spokes,
        front.spokes,
        sprocket,
        chain,
        pedals,
        bellBits,
        basketRim,
        weave,
        strap,
        stalks,
        flower(280, 86, 6, 9),
        flower(306, 78, 5, 10, 0.3),
        ring(280, 86, 3.2, 51),
        ring(306, 78, 3.4, 52),
        'M240 97l-3-6M250 94l0-7M260 97l3-6',
      ],
      BK,
    ) +
    paths([
      swish,
      puffs,
      hatch(150, 272, 390, 276, 10, 7, 165, 5),
      tufts([[20, 255], [150, 256], [196, 255], [356, 254], [392, 253], [80, 282], [138, 270]], 9, 7),
    ]) +
    paths([stab.hub, stab.slot], S1) +
    paths([stab.hub, stab.slot], S2),
  glints: `<circle cx="${224 + (247 - 214) * 1.1}" cy="${254 - (254 - 106) * 1.1}" r="1.4"/>`,
};
