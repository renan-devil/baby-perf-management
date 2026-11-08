import { PAL, hatch, paths, transformPath, tufts } from '../lib.mjs';

// The Elephant's Child, 1 (cover): the little elephant, with his short bulgy nose like a boot (no trunk
// yet), plods along with a sack of bananas on his back, while the Kolokolo Bird flies above him.
// The elephant is drawn here once, in his own coordinates, and the other pictures import these shapes.
export const f = (n) => Math.round(n * 10) / 10;

/**
 * A smooth limb (leg, trunk, snake) along a centreline of [x, y, width] points, open at the root;
 * `openEnd` also leaves the far end open (for a neck that disappears behind a head).
 */
export function limb(pts, openEnd = false) {
  const n = pts.length;
  const side = (s) =>
    pts.map(([x, y, w], i) => {
      const a = pts[Math.max(0, i - 1)];
      const b = pts[Math.min(n - 1, i + 1)];
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      return [x - (s * (b[1] - a[1]) * w) / 2 / l, y + (s * (b[0] - a[0]) * w) / 2 / l];
    });
  const curve = (P) =>
    P.slice(1)
      .map((p2, j) => {
        const p0 = P[Math.max(0, j - 1)];
        const p1 = P[j];
        const p3 = P[Math.min(P.length - 1, j + 2)];
        return `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
      })
      .join('');
  const L = side(1);
  const R = side(-1).reverse();
  const [ex, ey, ew] = pts[n - 1];
  const [px, py] = pts[n - 2];
  const k = (ew * 0.66) / Math.hypot(ex - px, ey - py);
  const cap = `C${f(L[n - 1][0] + (ex - px) * k)} ${f(L[n - 1][1] + (ey - py) * k)} ${f(R[0][0] + (ex - px) * k)} ${f(R[0][1] + (ey - py) * k)} ${f(R[0][0])} ${f(R[0][1])}`;
  return `M${f(L[0][0])} ${f(L[0][1])}${curve(L)}${openEnd ? `M${f(R[0][0])} ${f(R[0][1])}` : cap}${curve(R)}`;
}

// ---- The Elephant's Child: facing right, feet on y = 0, body centred on x = 0 ----
export const E = {
  // outline pieces, drawn so that no line runs behind another shape
  bodyTop: 'M-1 -84C-18 -89 -38 -85 -47 -72C-55 -60 -54 -46 -48 -38',
  backLeg: 'M-48 -38C-48 -24 -47 -12 -46 0L-26 0C-25 -10 -24 -20 -23 -28',
  farBackLeg: 'M-25 -3L-10 -3L-10 -27',
  belly: 'M-10 -27C-4 -25 4 -26 10 -30',
  frontLeg: 'M10 -30C10 -18 10 -8 10 0L30 0C30 -14 31 -32 33 -50',
  farFrontLeg: 'M30 -3L43 -3C43 -18 44 -34 46 -51',
  ear: 'M30 -95C18 -104 1 -98 -1 -80C-3 -63 6 -49 18 -49C27 -49 31 -57 30 -65',
  head: 'M30 -95C42 -102 58 -97 63 -86C65 -82 65 -79 64 -77',
  nose: 'M64 -79C74 -83 85 -79 89 -70C93 -62 93 -51 86 -47C80 -44 74 -49 71 -55C69 -58 67 -59 64 -60',
  chin: 'M64 -60C61 -54 55 -51 48 -51C42 -51 37 -51 33 -50',
  tail: 'M-50 -58C-58 -54 -61 -46 -60 -38M-60 -38l-3 6M-60 -38l0 7M-60 -38l3 6',
  // fine details
  earIn: 'M24 -88C14 -94 6 -88 6 -78C6 -67 11 -59 19 -58',
  noseLines: 'M73 -80q-2 3 0 6M79 -79q-2 3 0 6M84 -52q2 -1 3 -3',
  toes: 'M-42 0q2 -4 5 0M-35 0q2 -4 5 0M14 0q2 -4 5 0M21 0q2 -4 5 0',
  knees: 'M-44 -15q4 2 8 0M14 -15q4 2 8 0',
  brow: 'M44 -91Q49 -94 54 -91',
  eye: 'M45 -81C45 -86 53 -86 53 -81C53 -76 45 -76 45 -81Z',
  smile: 'M53 -60Q57 -57 61 -60',
  // a happy, laughing eye (picture 5) in place of the open one
  happyEye: 'M45 -80Q49 -85 53 -80',
  pupil: [50, -80.5, 2.3],
};
// washes
E.bodyWash =
  'M-1 -86C-18 -89 -38 -85 -47 -72C-55 -60 -54 -46 -48 -38C-48 -24 -47 -12 -46 0L-26 0L-25 -3L-10 -3L-10 -27C-4 -25 4 -26 10 -30L10 0L30 0L43 -3C43 -18 44 -34 46 -51L64 -60L64 -77C64 -82 62 -97 42 -100C36 -100 32 -98 30 -95Z';
E.farLegWash = 'M-25 -28L-25 -3L-10 -3L-10 -27ZM30 -45L30 -3L43 -3C43 -18 44 -34 46 -51Z';
E.noseWash = 'M64 -79C74 -83 85 -79 89 -70C93 -62 93 -51 86 -47C80 -44 74 -49 71 -55C69 -58 67 -59 64 -60Z';
E.earWash = E.ear + 'Z';
E.earInWash = 'M24 -88C14 -94 6 -88 6 -78C6 -67 11 -59 19 -58C26 -60 28 -70 27 -80Z';
E.cheek = 'M52 -71C52 -74 58 -74 58 -71C58 -68 52 -68 52 -71Z';

/** The elephant's ink, washes, whites and pupil, placed by transform t; `nose` swaps his nose. */
export function elephant(t, { nose = [E.nose], noseWash = E.noseWash, eye = 'open', look = [0, 0], extraLines = [], skip = [] } = {}) {
  const keep = (k) => !skip.includes(k);
  const main = ['bodyTop', 'backLeg', 'farBackLeg', 'belly', 'frontLeg', 'farFrontLeg', 'ear', 'head', 'chin', 'tail'].filter(keep).map((k) => E[k]);
  const fine = [...['earIn', 'toes', 'knees', 'brow', 'smile'].filter(keep).map((k) => E[k]), ...(nose[0] === E.nose ? [E.noseLines] : []), eye === 'open' ? E.eye : E.happyEye];
  const [px, py, pr] = [E.pupil[0] + look[0], E.pupil[1] + look[1], E.pupil[2]];
  const P = (x, y) => transformPath(`M${x} ${y}`, t).slice(2).split(' ').map(Number);
  const [cx, cy] = P(px, py);
  const [gx, gy] = P(px - 0.8, py - 0.9);
  const s = Math.hypot(...P(1, 0).map((v, i) => v - P(0, 0)[i]));
  return {
    washes: [
      { c: PAL.grey, o: 0.62, t, d: E.bodyWash },
      { c: PAL.slate, o: 0.3, t, d: E.farLegWash },
      { c: PAL.slate, o: 0.32, t, d: noseWash },
      { c: PAL.grey, o: 0.5, t, d: E.earWash },
      { c: PAL.rose, o: 0.45, t, d: E.earInWash },
      { c: PAL.rose, o: 0.5, t, d: E.cheek },
    ],
    whites: eye === 'open' ? transformPath(E.eye, t) : '',
    lines: paths([...main, ...nose, ...extraLines], t),
    fine: paths(fine, t),
    fills: eye === 'open' ? `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(pr * s)}"/>` : '',
    glints: eye === 'open' ? `<circle cx="${f(gx)}" cy="${f(gy)}" r="${f(0.8 * s)}"/>` : '',
  };
}

// ---- This picture ----
const ET = 'translate(170 252) scale(1.42)';
const el = elephant(ET);

// the sack of bananas on his back, held by a strap round his tummy (elephant coordinates)
const sack = 'M-42 -79C-47 -92 -41 -105 -31 -109L-13 -111C-3 -108 2 -98 -2 -86';
const sackTie = 'M-31 -109C-25 -105 -18 -105 -13 -111';
const strap = 'M-30 -82C-28 -62 -24 -44 -18 -29M-24 -84C-22 -64 -18 -46 -12 -28';
const banana = 'M-4 0C-9 -10 -7 -23 1 -29L5 -28C-1 -20 -1 -10 4 0';
const bananaAt = ['translate(-24 -108) rotate(-14)', 'translate(-17 -108) rotate(24)', 'translate(-30 -108) rotate(-52)'];
const bananas = bananaAt.map((t) => transformPath(banana, t)).join('');
const bananaTips = bananaAt.map((t) => transformPath('M1 -29l4 1l0 -4l-4 0Z', t)).join('');
const bananaWash = bananaAt.map((t) => transformPath(banana + 'Z', t)).join('');
const sackWash = sack + 'C-14 -90 -30 -86 -42 -79Z';
const sackMarks = 'M-34 -96q6 2 12 0M-30 -88q8 1 16 -1';

// the Kolokolo Bird, flying right above him (her own coordinates, centre 0,0)
const BT = 'translate(262 52) rotate(-6) scale(1.3)';
const bird = 'M-12 0C-8 -6 6 -8 13 -3C9 3 -6 5 -12 0Z';
const wing1 = 'M-2 -4C-7 -15 -15 -20 -22 -20C-16 -13 -11 -6 -5 -2';
const wing2 = 'M2 -5C6 -17 14 -22 21 -24C17 -13 11 -6 5 -3';
const birdTail = 'M-12 0L-21 -5L-19 1L-22 5Z';
const beak = 'M13 -3L19 -2L13 0';
const birdWash = bird + wing1 + 'Z' + wing2 + 'Z' + birdTail;
const flight = 'M196 50C208 46 218 46 228 48M200 62C210 60 218 60 226 62';

// ground, a little dusty path and grass
const ground = 'M10 254C90 250 180 256 260 252C320 249 360 253 392 251';
const dust = 'M50 252C44 252 42 246 47 244C46 239 53 237 56 241C59 238 65 240 64 245C68 246 67 252 62 252Z';
const plod = 'M40 236l-6 -3M38 246l-7 0';

export default {
  title: 'The Elephant’s Child',
  seed: 61,
  washes: [
    { c: PAL.green, o: 0.38, d: 'M8 250C90 246 180 252 260 248C320 245 360 249 394 247L394 270C330 276 240 266 160 272C90 276 40 268 8 270Z' },
        ...el.washes,
    { c: PAL.ochre, o: 0.55, t: ET, d: sackWash },
    { c: PAL.ochre, o: 0.85, t: ET, d: bananaWash },
    { c: PAL.terracotta, o: 0.5, t: ET, d: 'M-31 -85L-25 -86L-13 -28L-19 -28Z' },
    { c: PAL.sky, o: 0.7, t: BT, d: birdWash },
    { c: PAL.ochre, o: 0.8, t: BT, d: beak + 'Z' },
    { c: PAL.grey, o: 0.3, d: dust },
  ],
  whites: el.whites,
  lines: el.lines + paths([sack, sackTie, bananas], ET) + paths([bird, wing1, wing2, birdTail, beak], BT) + paths([ground]),
  fine:
    el.fine +
    paths([strap, sackMarks], ET) +
    paths([flight, dust, plod, tufts([[24, 252], [120, 254], [300, 251], [372, 251]], 9, 5), hatch(110, 270, 330, 268, 10, 6, 165, 4)]),
  fills: el.fills + `<path d="${transformPath(bananaTips, ET)}"/>` + `<circle cx="8" cy="-3" r="1.6" transform="${BT}"/>`,
  glints: el.glints,
};
