import { PAL } from '../lib.mjs';
import { dot, limb, oval, place } from '../stone-soup/characters.mjs';

// The Miller, His Son and the Donkey: the plump miller, his little son and their grey donkey, shared by
// the two pictures. Each is drawn once here and placed in each picture with a transform (place). The
// build only draws files named <n>.mjs, so this file is not a picture.

export { compose, place, dot, oval, limb } from '../stone-soup/characters.mjs';

const r1 = (n) => Math.round(n * 10) / 10;

/** An arm or leg: a limb along pts, washed in colour, with a round end (hand) or none. */
function part(pts, c, o = 0.6, end = null) {
  const d = limb(pts);
  const out = { lines: [d], fine: [], washes: [{ c, o, d: `${d}Z` }] };
  if (end) {
    const [x, y] = pts[pts.length - 1];
    const h = dot(x, y, end.r);
    out.fine.push(h);
    out.washes.push({ c: end.c, o: end.o ?? 0.6, d: h });
  }
  return out;
}

/** A boot pointing right, heel at (x, y). */
const boot = (x, y, s = 1) =>
  `M${r1(x - 6 * s)} ${r1(y - 6 * s)}C${r1(x - 7 * s)} ${r1(y - 1 * s)} ${r1(x - 6 * s)} ${r1(y + 1 * s)} ${r1(x - 3 * s)} ${r1(y + 1 * s)}L${r1(x + 13 * s)} ${r1(y + 1 * s)}C${r1(x + 16 * s)} ${r1(y)} ${r1(x + 15 * s)} ${r1(y - 4 * s)} ${r1(x + 10 * s)} ${r1(y - 5 * s)}C${r1(x + 6 * s)} ${r1(y - 6 * s)} ${r1(x + 4 * s)} ${r1(y - 7 * s)} ${r1(x + 3 * s)} ${r1(y - 8 * s)}Z`;

/** Eyes and mouth: eyes at (±ex + dx, ey), mouth at my. mood: 'happy' or 'puff' (eyes squeezed, cheeks blown out). */
function face({ mood, ex, ey, my, dx = 0, r = 1.9, w = 5 }) {
  const fine = [];
  const fills = [];
  const glints = [];
  const washes = [];
  if (mood === 'puff') {
    // squeezed eyes: little ">" "<" marks, and a small round puffing mouth
    fine.push(`M${r1(-ex + dx - 3)} ${r1(ey - 2.5)}l3.5 2.5l-3.5 2.5M${r1(ex + dx + 3)} ${r1(ey - 2.5)}l-3.5 2.5l3.5 2.5`);
    fills.push(oval(dx + 1, my + 1, 2.2, 2.6));
  } else {
    fills.push(dot(-ex + dx, ey, r), dot(ex + dx, ey, r));
    glints.push(dot(-ex + dx - 0.6, ey - 0.6, 0.6), dot(ex + dx - 0.6, ey - 0.6, 0.6));
    fine.push(`M${r1(dx - w)} ${my}q${w} 5 ${2 * w} 0`);
  }
  return { fine, fills, glints, washes };
}

function merge(...list) {
  const out = {};
  for (const p of list) for (const [k, v] of Object.entries(p)) out[k] = [...(out[k] ?? []), ...v];
  return out;
}

// ---------------------------------------------------------------------------------------------
// The miller (feet at 0,0, walking to the right), about 158 tall: round and plump, a sky-blue shirt
// under a big floury white apron, slate trousers, terracotta boots, a slate cap with a peak, a round
// rosy nose and a big terracotta moustache. arms: 'walk' (swinging) or 'carry' (both hands up on a
// pole resting on his shoulder at y = -104).
const mHead = oval(0, -126, 15, 16);
const mCap = 'M-16 -131C-19 -146 -8 -156 2 -156C13 -156 20 -147 17 -132C8 -135 -8 -135 -16 -131Z';
const mPeak = 'M12 -134C19 -136 27 -135 30 -131C25 -128 18 -129 13 -131Z';
const mEar = 'M-15 -128C-20 -129 -20 -121 -15 -120';
const mStache = 'M-11 -116C-8 -122 -3 -122 1 -119C5 -122 10 -122 13 -116C10 -112 5 -113 1 -116C-3 -113 -8 -112 -11 -116Z';
const mBody =
  'M-13 -110C-32 -106 -42 -86 -41 -64C-40 -48 -33 -38 -24 -35C-10 -31 10 -31 24 -35C33 -38 40 -48 41 -64C42 -86 32 -106 13 -110C6 -108 -6 -108 -13 -110Z';
const mApron = 'M-23 -84C-26 -66 -28 -50 -25 -34C-10 -30 10 -30 25 -34C28 -50 26 -66 23 -84C9 -80 -9 -80 -23 -84Z';
const mBib = 'M-11 -100L-12 -84M11 -100L12 -84M-11 -100C-4 -98 4 -98 11 -100';
const mStrings = 'M-23 -78C-30 -76 -36 -77 -40 -80M23 -78C30 -76 36 -77 40 -80';
const mPocket = 'M-10 -62L-9.5 -49L9.5 -49L10 -62';
const mFlour = dot(-17, -74, 1) + dot(18, -44, 0.9) + dot(15, -77, 0.8) + dot(-16, -41, 0.8) + dot(3, -38, 0.9);
const M_ARMS = {
  walk: [
    [[-31, -98, 13], [-38, -82, 11], [-40, -66, 10]],
    [[31, -98, 13], [40, -84, 11], [47, -70, 10]],
  ],
  carry: [
    [[-30, -98, 13], [-42, -88, 11], [-39, -97, 10]],
    [[30, -98, 13], [45, -100, 11], [39, -112, 10]],
  ],
};
const M_LEGS = [
  [[-12, -36, 15], [-16, -18, 13], [-20, -4, 12]],
  [[12, -36, 15], [18, -18, 13], [22, -4, 12]],
];

export function miller({ mood = 'happy', arms = 'walk' } = {}) {
  const f = face({ mood, ex: 5.5, ey: -130, my: -113, dx: 2, w: 4 });
  const [aL, aR] = M_ARMS[arms];
  const legs = M_LEGS.map((pts) => part(pts, PAL.slate, 0.55));
  const boots = boot(-24, -2, 1) + boot(18, -2, 1);
  return merge(
    // back arm and legs first, so the body sits over them
    part(aL, PAL.sky, 0.6, { r: 4.6, c: PAL.rose }),
    ...legs,
    {
      lines: [mBody, mHead, mCap],
      fine: [mApron, mBib, mStrings, mPocket, mPeak, mEar, mStache, boots, 'M-4 -151q4 -3 8 0', ...f.fine],
      once: [mFlour],
      washes: [
        { c: PAL.sky, o: 0.6, d: mBody },
        { c: PAL.rose, o: 0.35, d: mHead },
        { c: PAL.slate, o: 0.75, d: mCap + mPeak },
        { c: PAL.terracotta, o: 0.85, d: mStache },
        { c: PAL.rose, o: 0.85, d: dot(3, -122, 3.6) },
        { c: PAL.rose, o: 0.6, d: dot(-8, -121, 3) + dot(13, -121, 3) },
        { c: PAL.terracotta, o: 0.85, d: boots },
        { c: PAL.grey, o: 0.25, d: mApron },
      ],
      whites: [mApron],
      fills: f.fills,
      glints: [...f.glints, dot(2, -123.5, 0.9)],
    },
    part(aR, PAL.sky, 0.6, { r: 4.6, c: PAL.rose }),
  );
}

// ---------------------------------------------------------------------------------------------
// The son (feet at 0,0, walking to the right), about 92 tall: tousled ochre hair, a green tunic with a
// belt, terracotta breeches, grey stockings and little slate shoes. arms: 'walk' or 'carry' (hands up
// on a pole resting on his shoulder at y = -54).
const sHead = oval(0, -74, 12, 13);
const sHair =
  'M-12 -76C-15 -84 -12 -92 -5 -94C-3 -98 4 -98 6 -94C12 -94 16 -88 13 -80C11 -84 8 -85 6 -84C4 -88 -1 -88 -2 -85C-6 -87 -10 -83 -12 -76Z';
const sTufts = 'M-5 -94l-3 -5M1 -96l1 -5M7 -94l4 -4M13 -84l4 -1';
const sBody = 'M-9 -61C-18 -58 -21 -46 -20 -30C-10 -27 10 -27 20 -30C21 -46 18 -58 9 -61C4 -59 -4 -59 -9 -61Z';
const sBelt = 'M-20 -40C-8 -37 8 -37 20 -40';
const sBreeches = 'M-17 -30C-18 -24 -16 -20 -12 -19L-2 -19L0 -25L2 -19L12 -19C16 -20 18 -24 17 -30Z';
const S_ARMS = {
  walk: [
    [[-17, -56, 8], [-22, -46, 7], [-24, -36, 6.5]],
    [[17, -56, 8], [24, -48, 7], [30, -40, 6.5]],
  ],
  carry: [
    [[-17, -56, 8], [-27, -54, 7], [-25, -48, 6.5]],
    [[17, -56, 8], [27, -52, 7], [29, -60, 6.5]],
  ],
};
const S_LEGS = [
  [[-7, -20, 7.5], [-10, -10, 6.5], [-12, -3, 6]],
  [[7, -20, 7.5], [11, -10, 6.5], [14, -3, 6]],
];

export function son({ mood = 'happy', arms = 'walk' } = {}) {
  const f = face({ mood, ex: 4.2, ey: -75, my: -67, dx: 1.5, r: 1.6, w: 3.5 });
  const [aL, aR] = S_ARMS[arms];
  const shoes = boot(-15, -1, 0.65) + boot(11, -1, 0.65);
  return merge(
    part(aL, PAL.green, 0.65, { r: 3.4, c: PAL.rose }),
    ...S_LEGS.map((pts) => part(pts, PAL.grey, 0.55)),
    {
      lines: [sBody, sHead, sHair, sBreeches],
      fine: [sBelt, sTufts, shoes, 'M-12 -74C-15 -74 -15 -69 -12 -68', ...f.fine],
      washes: [
        { c: PAL.green, o: 0.7, d: sBody },
        { c: PAL.terracotta, o: 0.7, d: sBreeches },
        { c: PAL.rose, o: 0.35, d: sHead },
        { c: PAL.ochre, o: 0.85, d: sHair },
        { c: PAL.rose, o: 0.6, d: dot(-6, -69, 2.3) + dot(9, -69, 2.3) },
        { c: PAL.slate, o: 0.85, d: shoes },
        { c: PAL.ochre, o: 0.7, d: 'M-20 -41C-8 -38 8 -38 20 -41L20 -38C8 -35 -8 -35 -20 -38Z' },
      ],
      fills: f.fills,
      glints: f.glints,
    },
    part(aR, PAL.green, 0.65, { r: 3.4, c: PAL.rose }),
  );
}

// ---------------------------------------------------------------------------------------------
// The little grey donkey (hooves at y = 0, facing right, body centred on x = 0), about 140 long and
// 134 tall to the tips of his long ears: a round grey body, a pale belly, a dark mane, a tufted tail and
// slate hooves. legs: 'walk' (trotting along), or 'tied' (three hooves bunched on a pole along y = 0,
// with rope, the near hind leg kicking free). mood: 'happy' or 'bray' (eye shut, mouth wide open).
const dBody =
  'M-42 -57C-44 -70 -30 -77 -10 -75C10 -74 26 -73 36 -67C45 -61 44 -45 36 -41C20 -36 -20 -36 -36 -41C-44 -45 -43 -51 -42 -57Z';
const dBelly = 'M-26 -40C-10 -45 12 -45 28 -40C14 -37 -12 -37 -26 -40Z';
const dNeck = 'M28 -71C35 -81 41 -89 47 -95M40 -58C46 -66 52 -74 58 -80';
const dNeckFill = 'M26 -71C33 -82 40 -90 47 -95L60 -80C54 -72 48 -64 40 -56Z';
const dHead = 'M44 -97C48 -105 60 -105 66 -99C74 -93 82 -85 85 -79C87 -73 81 -68 74 -70C66 -72 58 -76 52 -80C46 -84 42 -90 44 -97Z';
const dMuzzle = 'M72 -88C78 -84 83 -82 85 -79C87 -73 81 -68 74 -70C71 -71 69 -73 68 -76C68 -81 69 -85 72 -88Z';
const dEars = 'M49 -100C44 -116 43 -130 47 -134C53 -131 56 -117 55 -103M58 -101C60 -117 66 -129 70 -131C75 -125 69 -112 62 -100';
const dEarsIn = 'M48.5 -108C47 -118 47 -126 48 -129C51 -124 52 -116 52 -108ZM61 -106C63 -115 66 -122 68 -125C69 -120 66 -112 63 -105Z';
const dEarTips = 'M47 -134C53 -131 55 -125 55 -122C51 -124 47 -126 46 -129ZM70 -131C75 -125 73 -121 71 -118C68 -121 67 -125 67 -127Z';
const dMane = 'M44 -96C38 -90 34 -84 28 -76L26 -72C33 -80 39 -87 46 -94Z';
const dManeHatch = 'M44 -96l-5 -2M40 -91l-5 -2M36 -86l-5 -2M32 -81l-5 -2';
const dTail = 'M-42 -61C-50 -56 -54 -46 -54 -36';
const dTuft = 'M-54 -38C-59 -32 -58 -24 -54 -21C-50 -24 -49 -32 -54 -38Z';
const D_LEGS = {
  // [far front, far hind, near front, near hind]
  walk: [
    [[18, -44, 8], [14, -22, 6.5], [10, -2, 6]],
    [[-20, -44, 9], [-14, -22, 6.5], [-10, -2, 6]],
    [[28, -44, 9], [33, -22, 7], [36, -2, 6.5]],
    [[-30, -44, 10], [-35, -22, 7], [-38, -2, 6.5]],
  ],
  tied: [
    [[18, -44, 8], [14, -22, 6.5], [11, -3, 6]],
    [[-20, -44, 9], [-14, -22, 6.5], [-7, -3, 6]],
    [[28, -44, 9], [24, -22, 7], [17, -3, 6.5]],
    [[-30, -44, 10], [-42, -14, 7], [-50, 16, 6.5]],
  ],
};
const hoof = (pts) => {
  const [x, y] = pts[pts.length - 1];
  const [px, py] = pts[pts.length - 2];
  const l = Math.hypot(x - px, y - py);
  const [ux, uy] = [(x - px) / l, (y - py) / l];
  return oval(r1(x + ux * 2), r1(y + uy * 2), 4.2, 4.2);
};

export function donkey({ mood = 'happy', legs = 'walk', headTurn = 0 } = {}) {
  const L = D_LEGS[legs];
  const far = L.slice(0, 2).map((pts) => part(pts, PAL.grey, 0.5));
  const near = L.slice(2).map((pts) => part(pts, PAL.grey, 0.8));
  const hooves = L.map(hoof).join('');
  const eye = [61, -93];
  const head = {
    lines: [dNeck, dHead, dEars],
    fine: [dEarsIn, dManeHatch, dot(80, -77, 1.2)],
    washes: [
      { c: PAL.grey, o: 0.85, d: dNeckFill },
      { c: PAL.grey, o: 0.85, d: `${dHead}${dEars.replace(/M58/, 'ZM58')}Z` },
      { c: PAL.slate, o: 0.75, d: dMane + dEarTips },
      { c: PAL.rose, o: 0.55, d: dEarsIn },
    ],
    whites: [],
    fills: [],
    glints: [],
  };
  if (mood === 'bray') {
    const mouth = 'M69 -74L88 -79C88 -70 82 -63 74 -62C71 -64 69 -68 69 -74Z';
    head.fine.push(`M${eye[0] - 3} ${eye[1]}q3 2.6 6 0`, mouth, 'M76 -76l1 3l2 -3.5');
    head.washes.push({ c: PAL.red, o: 0.8, d: mouth });
  } else {
    head.whites.push(dMuzzle);
    head.fills.push(dot(...eye, 2.1));
    head.glints.push(dot(eye[0] - 0.7, eye[1] - 0.7, 0.65));
    head.fine.push('M74 -71q4 1 7 -2');
  }
  // the head and neck can turn about the base of the neck (34, -62)
  const placedHead = headTurn ? place(head, `rotate(${headTurn} 34 -62)`) : head;
  const body = {
    lines: [dBody, dTail],
    fine: [dTuft, hooves],
    washes: [
      { c: PAL.grey, o: 0.85, d: dBody },
      { c: PAL.slate, o: 0.6, d: dTuft },
      { c: PAL.slate, o: 0.9, d: hooves },
    ],
    whites: [dBelly],
  };
  return merge(...far, placedHead, body, ...near);
}

/** Rope round the tied hooves (donkey frame), for the 'tied' legs. */
export const ROPE = [
  [11, -3],
  [-7, -3],
  [17, -3],
].map(([x, y]) => `M${x - 6} ${y - 5}C${x - 2} ${y - 1} ${x + 2} ${y - 1} ${x + 6} ${y - 5}M${x - 6} ${y - 1}C${x - 2} ${y + 3} ${x + 2} ${y + 3} ${x + 6} ${y - 1}`).join('');
