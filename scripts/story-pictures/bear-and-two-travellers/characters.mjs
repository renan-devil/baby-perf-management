import { PAL } from '../lib.mjs';
import { dot, limb, merge, oval, place } from '../peter-rabbit/characters.mjs';

// The Bear and the Two Travellers: the tall thin friend, the short round friend and the big brown bear,
// shared by the two pictures. Each is drawn once here and placed in each picture with a transform
// (place). The build only draws files named <n>.mjs, so this file is not a picture.

export { compose, dot, merge, oval, place } from '../peter-rabbit/characters.mjs';

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

/** Eyes and mouth. mood: 'happy', 'shut' (eyes squeezed shut, lips pressed: keeping still) or 'scared'. */
function face({ mood, ex, ey, my, dx = 0, r = 1.9, w = 4 }) {
  const out = { fine: [], fills: [], glints: [], whites: [], washes: [] };
  const eyes = [-ex + dx, ex + dx];
  if (mood === 'shut') {
    for (const x of eyes) out.fine.push(`M${r1(x - 3)} ${r1(ey - 0.5)}q3 2.4 6 0`);
    out.fine.push(`M${r1(dx - w * 0.6)} ${r1(my + 1)}l${r1(w * 1.2)} 0`);
  } else if (mood === 'scared') {
    for (const x of eyes) {
      const e = oval(x, ey, r + 1.6, r + 2.2);
      out.whites.push(e);
      out.fine.push(e);
      out.fills.push(dot(x + 0.8, ey + 1, r * 0.75));
    }
    out.fine.push(`M${r1(-ex + dx - 3)} ${r1(ey - 6)}l5 -2M${r1(ex + dx - 2)} ${r1(ey - 8)}l5 2`);
    const m = oval(dx + 1, my + 1, 2.4, 3);
    out.fine.push(m);
    out.fills.push(m);
  } else {
    for (const x of eyes) {
      out.fills.push(dot(x, ey, r));
      out.glints.push(dot(x - 0.6, ey - 0.6, 0.6));
    }
    out.fine.push(`M${r1(dx - w)} ${my}q${w} 5 ${2 * w} 0`);
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// A bundle on a stick: the stick from (x1, y1) (the hand end) to (x2, y2), and a knotted cloth
// bundle hanging from the far end. Its cloth is washed in colour c with paper spots.
export function bundle(x1, y1, x2, y2, c, s = 1) {
  const bag = `M${r1(x2 - 2 * s)} ${r1(y2 + 2 * s)}C${r1(x2 - 16 * s)} ${r1(y2 + 4 * s)} ${r1(x2 - 18 * s)} ${r1(y2 + 26 * s)} ${r1(x2)} ${r1(y2 + 28 * s)}C${r1(x2 + 18 * s)} ${r1(y2 + 26 * s)} ${r1(x2 + 16 * s)} ${r1(y2 + 4 * s)} ${r1(x2 + 2 * s)} ${r1(y2 + 2 * s)}Z`;
  const knot = `M${r1(x2)} ${r1(y2 + 2 * s)}l${r1(-6 * s)} ${r1(-8 * s)}M${r1(x2)} ${r1(y2 + 2 * s)}l${r1(7 * s)} ${r1(-6 * s)}`;
  const stick = `M${x1} ${y1}L${r1(x2 - (x1 - x2) * 0.06)} ${r1(y2 - (y1 - y2) * 0.06)}`;
  const spots = dot(x2 - 6 * s, y2 + 14 * s, 1.6 * s) + dot(x2 + 5 * s, y2 + 11 * s, 1.6 * s) + dot(x2 + 1 * s, y2 + 21 * s, 1.6 * s);
  return {
    lines: [stick, bag],
    fine: [knot],
    washes: [
      { c: PAL.ochre, o: 0.8, d: `M${x1} ${y1 - 1.5}L${x2} ${y2 - 1.5}L${x2} ${y2 + 1.5}L${x1} ${y1 + 1.5}Z` },
      { c, o: 0.75, d: bag },
    ],
    glints: [spots],
  };
}

// ---------------------------------------------------------------------------------------------
// The tall thin friend (feet at 0,0, facing right), about 212 tall: a long green coat with three
// buttons, slate trousers, terracotta boots, a slate felt hat with a red band, ochre hair and a long nose.
// arms: 'walk' (back arm swinging, front hand holding a stick over his shoulder at about (20, -150))
// or 'hug' (both arms reaching left round a tree trunk at about x = -30).
// legs: 'walk' or 'sit' (sitting on a branch at y = -66, shins dangling).
const tHead = oval(0, -178, 12, 14);
const tNose = 'M10 -182C19 -181 22 -175 11 -172';
const tHair = 'M-12 -182C-17 -178 -16 -170 -11 -167M-12 -176l-5 2';
const tEar = 'M-8 -181C-12 -182 -12 -174 -8 -173';
const tHat = 'M-18 -188C-6 -193 12 -193 21 -188C10 -184 -6 -184 -18 -188ZM-11 -190C-12 -203 -7 -212 1 -212C9 -212 13 -203 12 -190';
const tHatFill = 'M-11 -190C-12 -203 -7 -212 1 -212C9 -212 13 -203 12 -190ZM-18 -188C-6 -193 12 -193 21 -188C10 -184 -6 -184 -18 -188Z';
const tBand = 'M-11.5 -195C-4 -197 6 -197 12.5 -195L12.3 -190.5C6 -192 -4 -192 -11.2 -190.5Z';
const tCoat =
  'M-8 -163C-15 -150 -16 -122 -17 -98C-18 -84 -19 -76 -21 -66C-8 -62 8 -62 21 -66C19 -78 17 -100 15 -124C14 -146 13 -158 8 -163C3 -161 -3 -161 -8 -163Z';
const tCollar = 'M-8 -163L0 -150L8 -163';
const tButtons = dot(1, -140, 1.6) + dot(1, -120, 1.6) + dot(1, -100, 1.6);
const T_ARMS = {
  walk: [
    [[-9, -156, 8], [-15, -128, 7], [-19, -104, 6.5]],
    [[9, -156, 8], [24, -138, 7], [20, -150, 6.5]],
  ],
  hug: [
    [[-9, -156, 8], [-22, -142, 7], [-31, -126, 6.5]],
    [[9, -156, 8], [-4, -136, 7], [-28, -138, 6.5]],
  ],
};
const T_LEGS = {
  walk: [
    [[-6, -70, 9], [-10, -36, 8], [-13, -5, 7]],
    [[6, -70, 9], [12, -36, 8], [16, -5, 7]],
  ],
  sit: [
    [[-4, -72, 9], [30, -71, 8], [34, -40, 7]],
    [[4, -72, 9], [40, -69, 8], [46, -42, 7]],
  ],
};

export function tall({ mood = 'happy', arms = 'walk', legs = 'walk' } = {}) {
  const f = face({ mood, ex: 4.5, ey: -181, my: -170, dx: 3, r: 1.7, w: 3.5 });
  const [aB, aF] = T_ARMS[arms];
  const L = T_LEGS[legs];
  const feet = L.map((pts) => pts[pts.length - 1]);
  const boots = feet.map(([x, y]) => boot(x - 2, y + 4, 0.75)).join('');
  return merge(
    part(aB, PAL.green, 0.7, { r: 3.6, c: PAL.rose }),
    ...L.map((pts) => part(pts, PAL.slate, 0.6)),
    {
      lines: [tCoat, tHead, tHat],
      fine: [tCollar, tNose, tHair, tEar, tBand, boots, ...f.fine],
      washes: [
        { c: PAL.green, o: 0.72, d: tCoat },
        { c: PAL.rose, o: 0.35, d: tHead },
        { c: PAL.rose, o: 0.55, d: 'M10 -182C19 -181 22 -175 11 -172Z' },
        { c: PAL.ochre, o: 0.85, d: 'M-12 -182C-17 -178 -16 -170 -11 -167L-9 -180Z' },
        { c: PAL.slate, o: 0.8, d: tHatFill },
        { c: PAL.red, o: 0.8, d: tBand },
        { c: PAL.terracotta, o: 0.85, d: boots },
        { c: PAL.rose, o: 0.55, d: dot(4, -173, 2.6) },
      ],
      whites: f.whites,
      fills: [tButtons, ...f.fills],
      glints: f.glints,
    },
    part(aF, PAL.green, 0.7, { r: 3.6, c: PAL.rose }),
  );
}

// ---------------------------------------------------------------------------------------------
// The short round friend (feet at 0,0, facing right), about 130 tall: a big round sky-blue tunic with a
// red belt, ochre trousers, slate boots, a red bobble cap and a round rosy nose.
// arms: 'walk' (front hand holding a stick over his shoulder at about (27, -80)) or 'still' (both
// arms straight down by his sides, for lying flat and keeping very still).
const sHead = oval(0, -101, 14, 15);
const sCap = 'M-14 -105C-16 -118 -7 -126 2 -126C11 -126 17 -118 15 -105C5 -109 -5 -109 -14 -105Z';
const sBobble = dot(-2, -129, 4.5);
const sNose = dot(14, -99, 3.6);
const sEar = 'M-12 -101C-17 -102 -17 -94 -12 -93';
const sBody = oval(0, -55, 29, 32);
const sBelt = 'M-28 -46C-10 -40 10 -40 28 -46L28 -40C10 -34 -10 -34 -28 -40Z';
const S_ARMS = {
  walk: [
    [[-24, -74, 10], [-32, -58, 9], [-34, -44, 8]],
    [[24, -74, 10], [37, -66, 9], [27, -80, 8]],
  ],
  still: [
    [[-24, -74, 10], [-29, -58, 9], [-30, -42, 8]],
    [[24, -74, 10], [29, -58, 9], [30, -42, 8]],
  ],
};
const S_LEGS = [
  [[-10, -26, 11], [-12, -13, 10], [-13, -5, 9]],
  [[10, -26, 11], [13, -13, 10], [15, -5, 9]],
];

export function short({ mood = 'happy', arms = 'walk' } = {}) {
  const f = face({ mood, ex: 4.5, ey: -103, my: -93, dx: 3, r: 1.8, w: 3.5 });
  const [aB, aF] = S_ARMS[arms];
  const boots = boot(-15, -1, 0.75) + boot(12, -1, 0.75);
  return merge(
    part(aB, PAL.sky, 0.65, { r: 4, c: PAL.rose }),
    ...S_LEGS.map((pts) => part(pts, PAL.ochre, 0.7)),
    {
      lines: [sBody, sHead, sCap],
      fine: [sBelt, sBobble, sNose, sEar, boots, ...f.fine],
      washes: [
        { c: PAL.sky, o: 0.72, d: sBody },
        { c: PAL.rose, o: 0.35, d: sHead },
        { c: PAL.red, o: 0.8, d: sCap + sBobble },
        { c: PAL.red, o: 0.75, d: sBelt },
        { c: PAL.rose, o: 0.9, d: sNose },
        { c: PAL.rose, o: 0.55, d: dot(-4, -95, 2.6) + dot(9, -93, 2.4) },
        { c: PAL.slate, o: 0.85, d: boots },
      ],
      whites: f.whites,
      fills: f.fills,
      glints: [...f.glints, dot(13, -100.5, 1)],
    },
    part(aF, PAL.sky, 0.65, { r: 4, c: PAL.rose }),
  );
}

// ---------------------------------------------------------------------------------------------
// The big brown bear (paws at y = 0, facing left, on all fours), about 235 long and 125 tall: a big
// round furry body with a hump at the shoulders, thick legs, a big round head held low to sniff the
// ground, small round ears, a pale ochre snout with a black nose at about (-132, -50), a little tail
// and a kind round eye.
const bBody =
  'M-58 -70C-58 -106 -30 -126 4 -124C40 -122 80 -110 94 -80C102 -60 96 -36 80 -28C40 -22 -28 -22 -50 -28C-62 -34 -60 -52 -58 -70Z';
const bNeck = 'M-56 -94C-62 -84 -66 -74 -68 -66M-50 -30C-54 -26 -58 -24 -62 -22';
const bNeckFill = 'M-57 -96C-63 -84 -68 -74 -70 -64L-62 -20C-56 -24 -52 -26 -48 -30Z';
const bHead = oval(-84, -42, 28, 27);
const bSnout = 'M-106 -54C-118 -54 -129 -47 -133 -39C-136 -31 -130 -24 -120 -23C-112 -22 -106 -25 -102 -29';
const bSnoutFill = `${bSnout}C-98 -36 -100 -48 -106 -54Z`;
const bNose = 'M-137 -40C-137 -46 -129 -47 -128 -41C-127 -35 -137 -34 -137 -40Z';
const bMouth = 'M-128 -28C-124 -25 -119 -25 -116 -28';
const bEars = [oval(-100, -70, 9.5, 9.5), oval(-72, -73, 9.5, 9.5)];
const bEarsIn = [oval(-100, -70, 5, 5), oval(-72, -73, 5, 5)];
const bTail = 'M94 -82C104 -86 108 -76 99 -72';
const bFur = 'M-30 -116l2 -6M0 -124l2 -6M32 -122l3 -5M62 -112l4 -4M84 -94l5 -2M-50 -100l-1 -6M-66 -58l-4 -2M-62 -36l-4 2';
const B_LEGS = [
  // far front, far hind, near front, near hind
  [[-28, -36, 22], [-30, -22, 20], [-30, -5, 19]],
  [[56, -36, 24], [58, -22, 20], [60, -5, 19]],
  [[-40, -35, 27], [-42, -22, 24], [-44, -5, 23]],
  [[74, -35, 28], [76, -22, 24], [78, -5, 23]],
];
const UP = 'translate(0 -10)';
const toes = (x) => `M${x - 7} -1l0 -5M${x - 1} -1l0 -5M${x + 5} -1l0 -5`;

export function bear() {
  const far = B_LEGS.slice(0, 2).map((pts) => part(pts, PAL.terracotta, 0.55));
  const near = B_LEGS.slice(2).map((pts) => part(pts, PAL.terracotta, 0.8));
  const toeMarks = B_LEGS.slice(2).map((pts) => toes(pts[pts.length - 1][0])).join('');
  const eye = [-100, -50];
  const fur = bBody + bNeckFill;
  // everything but the legs is drawn 10 higher (UP), so the bear stands tall on its legs
  const upper = merge({
    lines: [bBody, bTail],
    fine: [bFur],
    washes: [
      { c: PAL.terracotta, o: 0.75, d: fur },
      { c: PAL.slate, o: 0.3, d: fur },
      { c: PAL.terracotta, o: 0.7, d: `${bTail}Z` },
    ],
  });
  const head = {
    lines: [bNeck, bHead, bSnout, ...bEars],
    fine: [...bEarsIn, bMouth, 'M-108 -60c4 -3 9 -3 12 0'],
    washes: [
      { c: PAL.terracotta, o: 0.8, d: bHead + bEars.join('') },
      { c: PAL.slate, o: 0.3, d: bHead + bEars.join('') },
      { c: PAL.ochre, o: 0.9, d: bSnoutFill },
      { c: PAL.rose, o: 0.7, d: bEarsIn.join('') },
    ],
    fills: [bNose, dot(...eye, 2.6)],
    glints: [dot(-133.5, -42, 1), dot(eye[0] - 0.8, eye[1] - 0.9, 0.9)],
  };
  return merge(...far, place(upper, UP), ...near, { fine: [toeMarks] }, place(head, UP));
}

/** Sniff marks: little curls in the air beside the bear's nose (bear frame). */
export const SNIFF = 'M-144 -60c-4 -3 -4 -8 0 -10M-148 -48c-5 -2 -6 -7 -3 -10M-140 -70c-2 -4 0 -8 4 -9';
