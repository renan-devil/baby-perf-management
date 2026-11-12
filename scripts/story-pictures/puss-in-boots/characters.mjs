import { PAL } from '../lib.mjs';
import { compose, dot, f, limb, merge, oval, place } from '../stone-soup/characters.mjs';

// Puss in Boots: Puss, the miller's son, the King, the Princess, the farmers, the Ogre (and his lion
// and mouse shapes) and the things around them, drawn once here and placed in each picture with a
// transform (place). The build only draws files named <n>.mjs, so this file is not a picture.
// Standing characters have their feet at y = 0 and look at us (or to the right); flip with scale(-1 1).

export { compose, dot, merge, oval, place };

const Z = (d) => `${d}Z`;

/** A bumpy, cloud-like closed outline round (cx, cy): n bumps, each pushed out by k. */
export function bumpy(cx, cy, rx, ry, n = 9, k = 1.25, start = -90) {
  let d = '';
  for (let i = 0; i <= n; i++) {
    const a = ((i / n) * 360 + start) * (Math.PI / 180);
    const [x, y] = [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
    if (i === 0) d += `M${f(x)} ${f(y)}`;
    else {
      const m = a - Math.PI / n;
      d += `Q${f(cx + Math.cos(m) * rx * k)} ${f(cy + Math.sin(m) * ry * k)} ${f(x)} ${f(y)}`;
    }
  }
  return `${d}Z`;
}

/** An arm (limb along pts) ending in a round hand or paw of colour hc. */
function arm(pts, c, o, r, hc = PAL.rose, ho = 0.6) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const h = dot(x, y, r);
  return { lines: [d], fine: [h], washes: [{ c, o, d: Z(d) }, { c: hc, o: ho, d: h }] };
}

/** Eyes and mouth of the people: eyes at (±ex, ey), mouth at my. */
function faceMarks({ mood, ex, ey, my, r = 1.7, w = 4.5 }) {
  const fine = [];
  const fills = [];
  const glints = [];
  const washes = [];
  const shut = `M${-ex - 3} ${ey}q3 -3.4 6 0M${ex - 3} ${ey}q3 -3.4 6 0`;
  if (mood === 'laugh') {
    const mouth = `M${-w - 1} ${my - 1}C${-w} ${my + 8} ${w} ${my + 8} ${w + 1} ${my - 1}C${w / 2} ${my} ${-w / 2} ${my} ${-w - 1} ${my - 1}Z`;
    fine.push(shut, mouth);
    washes.push({ c: PAL.red, o: 0.75, d: mouth });
  } else if (mood === 'shy') {
    fine.push(`M${-ex - 3} ${ey + 0.5}q3 2.6 6 0M${ex - 3} ${ey + 0.5}q3 2.6 6 0`, `M${-w + 1} ${my}q${w - 1} 4 ${2 * w - 2} 0`);
  } else {
    const dx = mood === 'peep' ? 1.2 : mood === 'peepL' ? -1.2 : 0;
    const rr = mood === 'wow' ? r + 0.5 : r;
    fills.push(dot(-ex + dx, ey, rr), dot(ex + dx, ey, rr));
    glints.push(dot(-ex + dx - 0.5, ey - 0.6, 0.55), dot(ex + dx - 0.5, ey - 0.6, 0.55));
    if (mood === 'wow') {
      fills.push(oval(0, my + 1.5, 2.4, 3));
      fine.push(`M${-ex - 3} ${ey - 5}q3 -2 6 0M${ex - 3} ${ey - 5}q3 -2 6 0`);
    } else fine.push(`M${-w} ${my}q${w} 5 ${2 * w} 0`);
  }
  return { fine, fills, glints, washes };
}

// =============================================================================================
// PUSS: an orange cat standing on his hind legs, tall red boots, a wide slate hat with a red
// feather, a little brown bag on a strap. Feet at (0,0), about 120 tall without the hat (head
// centre at P_HEAD). The upper body turns round the hips P_HIP by lean (degrees, + bows to
// the right). arms: two limb centrelines from the shoulders (±15, -80) in the upper body's own
// coordinates (drawn with the hips at (0,-44)). legs: two {hip: [x, y], top: [x, y], toe: ±1} where top is the top of the boot.
// =============================================================================================
export const FUR = [
  { c: PAL.ochre, o: 0.85 },
  { c: PAL.terracotta, o: 0.5 },
];
const furWash = (d) => FUR.map((w) => ({ ...w, d }));
// the upper body is drawn with its hips at (0,-44) and lifted by UP onto the legs
const UP = 10;
export const P_HEAD = [0, -102 - UP];
export const P_HIP = [0, -44 - UP];

// the hat, round the centre of his head (0,0)
const hatBrim = 'M-28 -11C-22 -17 -8 -19 4 -18C18 -18 28 -16 33 -10C35 -6 30 -5 26 -8C14 -12 -12 -12 -24 -7C-30 -5 -32 -8 -28 -11Z';
const hatCrown = 'M-13 -15C-15 -30 -7 -35 2 -35C11 -35 16 -29 14 -15';
const hatBand = 'M-13.5 -16C-14 -19 -14 -21 -13.7 -23C-4 -25 6 -25 14.5 -23C14.8 -21 14.8 -19 14.2 -16C5 -18 -5 -18 -13.5 -16Z';
const feather = 'M-4 -28C-14 -44 -38 -46 -50 -28C-38 -36 -20 -36 -8 -22Z';
/** Puss's hat on its own, centred where his head would be. */
export function hat() {
  return {
    lines: [hatBrim, hatCrown],
    fine: [feather, 'M-5 -26C-16 -40 -36 -42 -49 -29', 'M-16 -37l-5 5M-26 -40l-5 5M-36 -38l-4 6'],
    washes: [
      { c: PAL.slate, o: 0.85, d: `${hatBrim}${hatCrown}C10 -13 -8 -13 -13 -15Z` },
      { c: PAL.ochre, o: 0.95, d: hatBand },
      { c: PAL.red, o: 0.9, d: feather },
    ],
    glints: ['M-6 -31C-3 -33 1 -33 3 -32C0 -31 -3 -30 -6 -28Z'],
  };
}

/** Puss's head (centre 0,0). mood: happy, proud, wow, fright, sly, roar? withHat: the hat on. */
export function pussHead({ mood = 'happy', withHat = true } = {}) {
  const head = 'M-16 0C-17 -10 -10 -16 0 -16C10 -16 17 -10 16 0C19 3 18 7 15 8C11 13 6 16 0 16C-6 16 -11 13 -15 8C-18 7 -19 3 -16 0Z';
  const earL = 'M-13 -8L-15 -26L-4 -15';
  const earR = 'M4 -15L15 -26L13 -8';
  const lines = [head];
  const fine = ['M-2 3L2 3L0 5.6Z', 'M-7 6l-14 -3M-7 8l-13 4M7 6l14 -3M7 8l13 4'];
  const washes = furWash(head);
  const whites = [oval(-3.6, 8, 5, 4.2), oval(3.6, 8, 5, 4.2)];
  const fills = [];
  const glints = [];
  if (!withHat) {
    lines.push(earL, earR);
    fine.push('M-3 -15l1 5M0 -16l0 6M3 -15l-1 5');
    washes.push(...furWash('M-13 -8L-15 -26L-4 -15ZM4 -15L15 -26L13 -8Z'), { c: PAL.rose, o: 0.75, d: 'M-11.5 -10L-13 -21L-6 -14ZM6 -14L13 -21L11.5 -10Z' });
  }
  washes.push({ c: PAL.rose, o: 0.9, d: 'M-2 3L2 3L0 5.6Z' });
  const almond = (x) => `M${x - 4.5} -2C${x - 3} -6 ${x + 3} -6 ${x + 4.5} -2C${x + 3} 1.5 ${x - 3} 1.5 ${x - 4.5} -2Z`;
  if (mood === 'wow' || mood === 'fright') {
    const r = mood === 'fright' ? 4.2 : 3.8;
    whites.push(dot(-6, -2.5, r), dot(6, -2.5, r));
    fine.push(dot(-6, -2.5, r), dot(6, -2.5, r));
    fills.push(dot(-6, -2.2, mood === 'fright' ? 1.3 : 1.8), dot(6, -2.2, mood === 'fright' ? 1.3 : 1.8));
    const mouth = mood === 'fright' ? 'M-3.5 9C-4 15 4 15 3.5 9C1 10 -1 10 -3.5 9Z' : 'M-2.4 9C-2.6 12.5 2.6 12.5 2.4 9C1 9.6 -1 9.6 -2.4 9Z';
    fine.push(mouth, 'M0 5.6L0 8.6');
    washes.push({ c: PAL.red, o: 0.8, d: mouth });
    if (mood === 'fright') fine.push('M-11 -9l6 2M11 -9l-6 2');
  } else if (mood === 'sly' || mood === 'proud') {
    // half-closed, pleased eyes and a wide grin
    fine.push('M-10.5 -2.5C-7 -4.5 -5 -4.5 -1.5 -2.5M1.5 -2.5C5 -4.5 7 -4.5 10.5 -2.5', 'M0 5.6q-3 5 -7 2M0 5.6q3 5 7 2');
    washes.push({ c: PAL.green, o: 0.85, d: 'M-10.5 -2.5C-7 1 -5 1 -1.5 -2.5ZM1.5 -2.5C5 1 7 1 10.5 -2.5Z' });
    fills.push('M-6 -3L-5.2 -1.2L-6 0.3L-6.8 -1.2ZM6 -3L6.8 -1.2L6 0.3L5.2 -1.2Z');
  } else {
    fine.push(almond(-6), almond(6), 'M0 5.6q-2.5 4 -5.5 1.6M0 5.6q2.5 4 5.5 1.6');
    washes.push({ c: PAL.green, o: 0.85, d: almond(-6) + almond(6) });
    fills.push('M-6 -5.2C-5 -3.4 -5 -0.6 -6 1.2C-7 -0.6 -7 -3.4 -6 -5.2ZM6 -5.2C7 -3.4 7 -0.6 6 1.2C5 -0.6 5 -3.4 6 -5.2Z');
    glints.push(dot(-6.9, -3.2, 0.6), dot(5.1, -3.2, 0.6));
  }
  washes.push({ c: PAL.rose, o: 0.5, d: dot(-11, 4, 2.4) + dot(11, 4, 2.4) });
  const out = { lines, fine, washes, whites, fills, glints };
  return withHat ? merge(out, place(hat(), 'translate(0 -3) rotate(-6)')) : out;
}

/** One of Puss's tall red boots, the top of the boot at (0,0), pointing down (+y), toe to +x. */
export function boot() {
  const shaft = 'M-6.5 0C-6.5 10 -7 20 -7.5 28C-8 32 -7 34 -4 34L15 34C19 34 19 29 15 27C11 25 8 24 6.5 21C6.5 14 6.5 7 6.5 0';
  const cuff = 'M-11.5 -7C-4 -10 4 -10 11.5 -7L7.5 4C3 3 -3 3 -7.5 4Z';
  return {
    lines: [shaft, cuff],
    fine: ['M-6.5 30.5L17 30.5'],
    washes: [
      { c: PAL.red, o: 0.95, d: Z(shaft) },
      { c: PAL.terracotta, o: 0.3, d: Z(shaft) },
      { c: PAL.red, o: 0.95, d: cuff },
      { c: PAL.terracotta, o: 0.5, d: cuff },
    ],
    glints: ['M-3.6 7L-2.6 7L-3 21L-4.2 21Z'],
  };
}

/** A leg: orange fur from the hip to the top of the boot, then the boot along the same line. */
function leg({ hip, top, toe = 1, turn = 0, bare = false }) {
  const [hx, hy] = hip;
  const [tx, ty] = top;
  const a = (Math.atan2(-(tx - hx), ty - hy) * 180) / Math.PI + turn;
  const d = limb([[hx, hy, 11], [(hx + tx) / 2, (hy + ty) / 2, 10.5], [tx, ty, 10]]);
  const fur = { lines: [d], washes: furWash(Z(d)) };
  if (bare) {
    const paw = `M-6 0C-6 6 -6 10 -5 12L12 12C14 8 10 6 6 6L6 0`;
    return merge(fur, place({ lines: [paw], washes: furWash(Z(paw)), fine: ['M6 8l1 4M9 8l1 4'] }, `translate(${tx} ${ty}) rotate(${f(a)}) scale(${toe} 1)`));
  }
  return merge(fur, place(boot(), `translate(${tx} ${ty}) rotate(${f(a)}) scale(${toe} 1)`));
}

export const PUSS_LEGS = {
  stand: [
    { hip: [-9, -52], top: [-10, -34], toe: -1 },
    { hip: [9, -52], top: [10, -34], toe: 1 },
  ],
};
export const PUSS_ARMS = {
  down: [
    [[-15, -80, 8], [-24, -70, 7], [-28, -58, 7]],
    [[15, -80, 8], [24, -70, 7], [28, -58, 7]],
  ],
};

/** The little brown bag on its strap (in the upper body's coordinates). */
function bag() {
  const pouch = 'M-28 -55C-30 -46 -26 -40 -20 -40C-14 -40 -11 -46 -13 -55Z';
  const flap = 'M-29.5 -55C-24 -50 -17 -50 -11.5 -55C-17 -58.5 -24 -58.5 -29.5 -55Z';
  return {
    lines: [pouch, flap],
    fine: ['M12 -85C4 -74 -6 -64 -16 -57', dot(-20.5, -51, 1.4)],
    washes: [
      { c: PAL.terracotta, o: 0.55, d: `${pouch}${flap}` },
      { c: PAL.grey, o: 0.7, d: `${pouch}${flap}` },
    ],
  };
}

export function puss({ mood = 'happy', withHat = true, arms = PUSS_ARMS.down, legs = PUSS_LEGS.stand, lean = 0, tilt = 0, withBag = true, bristle = false, tail = 'up' } = {}) {
  const torso = 'M-11 -86C-21 -82 -24 -64 -21 -50C-19 -43 -10 -40 0 -40C10 -40 19 -43 21 -50C24 -64 21 -82 11 -86';
  const belly = 'M-7 -80C-12 -70 -12 -54 -7 -46C-3 -43.5 3 -43.5 7 -46C12 -54 12 -70 7 -80C3 -83 -3 -83 -7 -80Z';
  const tailPts =
    tail === 'up'
      ? [[20, -48, 7], [32, -50, 6.5], [40, -62, 6], [38, -76, 5.5], [32, -82, 5]]
      : tail === 'left'
        ? [[-20, -48, 7], [-32, -50, 6.5], [-40, -62, 6], [-38, -76, 5.5], [-32, -82, 5]]
        : [[20, -48, 7], [34, -46, 6.5], [46, -50, 6], [56, -58, 5.5], [62, -60, 5]];
  const tailD = limb(tailPts);
  const upper = merge(
    {
      lines: [torso, tailD],
      fine: ['M-20 -70q4 1 6 4M-21 -60q4 1 6 4M20 -70q-4 1 -6 4M21 -60q-4 1 -6 4', tail === 'left' ? 'M-33 -51l-2 -5M-39 -63l5 -1' : tail === 'up' ? 'M33 -51l2 -5M39 -63l-5 -1' : 'M40 -47l1 -5M50 -53l-2 -5'],
      washes: [...furWash(`${torso}C6 -89 -6 -89 -11 -86Z`), ...furWash(Z(tailD))],
      whites: Math.abs(lean) > 30 ? [] : [belly],
    },
    ...(withBag ? [bag()] : []),
    ...arms.map((a) => arm(a, PAL.ochre, 0.85, 4.2, PAL.ochre, 0.9)),
    place(pussHead({ mood, withHat }), `translate(0 -102) rotate(${tilt})`),
  );
  if (bristle) {
    // fur standing on end: little spikes along the sides and the tail
    upper.fine.push(
      'M-22 -76l-5 -2M-23 -68l-6 0M-23 -60l-6 1M-22 -52l-5 3M22 -76l5 -2M23 -68l6 0M23 -60l6 1M22 -52l5 3',
      'M36 -50l4 -3M42 -58l5 -1M43 -68l5 0M41 -76l4 2M30 -44l2 4M-17 -112l-5 -4M17 -112l5 -4M-19 -102l-6 -1M19 -102l6 -1',
    );
  }
  const body = place(upper, `rotate(${lean} ${P_HIP[0]} ${P_HIP[1]}) translate(0 ${-UP})`);
  return merge(...legs.map(leg), body);
}

/** The point of Puss's upper body (its own coordinates) that lands on (x, y) when he leans by lean degrees. */
export const pussLocal = (x, y, lean) => {
  const r = (-lean * Math.PI) / 180;
  const [dx, dy] = [x - P_HIP[0], y - P_HIP[1]];
  return [P_HIP[0] + dx * Math.cos(r) - dy * Math.sin(r), P_HIP[1] + dx * Math.sin(r) + dy * Math.cos(r) + UP];
};

/** Where a point of Puss's upper body lands once he leans by lean degrees. */
export const pussAt = (x, y, lean) => {
  const r = (lean * Math.PI) / 180;
  const [dx, dy] = [x - P_HIP[0], y - UP - P_HIP[1]];
  return [P_HIP[0] + dx * Math.cos(r) - dy * Math.sin(r), P_HIP[1] + dx * Math.sin(r) + dy * Math.cos(r)];
};

// =============================================================================================
// THE MILLER'S SON (feet at 0,0), about 150 tall, dark brown hair. clothes: 'patched' (a brown
// tunic with ochre patches) or 'fine' (a blue velvet coat, white cravat, shiny shoes). Head at
// (0,-130); arms from the shoulders (±21,-108). clothes 'none': only his bare shoulders and arms,
// for swimming.
// =============================================================================================
export const Y_ARMS = {
  down: [
    [[-21, -108, 9], [-28, -94, 8.5], [-32, -80, 8.5], [-33, -70, 8.5]],
    [[21, -108, 9], [28, -94, 8.5], [32, -80, 8.5], [33, -70, 8.5]],
  ],
};
export function youthHead({ mood = 'happy', blush = false } = {}) {
  const face = 'M-12.5 -4C-13 7 -7 14 0 14C7 14 13 7 12.5 -4';
  const faceFill = `${face}C11 -9 -11 -9 -12.5 -4Z`;
  const hair = 'M-13.5 -2C-17 -14 -10 -21 -1 -21C9 -22 17 -15 13.5 -2C12 -6 9 -9 5 -8C3 -11 -1 -12 -3 -9C-7 -10 -11 -7 -13.5 -2Z';
  const m = faceMarks({ mood, ex: 4.6, ey: 0, my: 7, w: 4 });
  return {
    lines: [face, hair],
    fine: ['M-13 -1q-4 1 -2 6M13 -1q4 1 2 6', 'M0.5 1.5c1.6 1.2 1.6 2.6 -0.6 3', 'M-6 -18l-3 -5M2 -20l1 -5M8 -18l3 -4', 'M-8 4l0.4 0M-6 5.4l0.4 0M6 5.4l0.4 0M8 4l0.4 0', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.3, d: faceFill },
      { c: PAL.terracotta, o: 0.6, d: hair },
      { c: PAL.ink, o: 0.45, d: hair },
      { c: PAL.rose, o: blush ? 0.9 : 0.55, d: dot(-8, 5, blush ? 3 : 2.4) + dot(8, 5, blush ? 3 : 2.4) },
      ...m.washes,
    ],
    fills: m.fills,
    glints: m.glints,
  };
}
export function youth({ clothes = 'patched', mood = 'happy', tilt = 0, arms = Y_ARMS.down, blush = false } = {}) {
  const lines = [];
  const fine = [];
  const washes = [];
  const whites = [];
  const glints = [];
  let sleeve;
  if (clothes === 'none') {
    // swimming: only his bare shoulders show above the water (cut off at y = -96)
    const sh = 'M-10 -115C-20 -113 -25 -106 -26 -96M10 -115C20 -113 25 -106 26 -96';
    lines.push(sh);
    washes.push({ c: PAL.rose, o: 0.42, d: 'M-10 -115C-20 -113 -25 -106 -26 -96L26 -96C25 -106 20 -113 10 -115Z' });
    sleeve = [PAL.rose, 0.42];
  } else if (clothes === 'patched') {
    const tunic = 'M-10 -114C-20 -112 -23 -104 -23 -94C-23 -84 -24 -74 -25 -62C-10 -59 10 -59 25 -62C24 -74 23 -84 23 -94C23 -104 20 -112 10 -114';
    const legs = 'M-21 -61L-19 -8L-3 -8L-1 -48L1 -48L3 -8L19 -8L21 -61';
    const shoes = 'M-19 -8C-27 -8 -28 0 -22 0L-3 0L-3 -8ZM19 -8C27 -8 28 0 22 0L3 0L3 -8Z';
    const patches = 'M-17 -96L-7 -97L-6 -87L-16 -86ZM8 -26L17 -27L17 -17L8 -16Z';
    lines.push(tunic, legs, shoes);
    fine.push(patches, 'M-6 -112L0 -104L6 -112', 'M-24 -70C-10 -67 10 -67 24 -70', 'M-12 -50q2 8 1 14M12 -40q-1 6 0 12');
    washes.push(
      { c: PAL.terracotta, o: 0.5, d: Z(tunic) },
      { c: PAL.grey, o: 0.6, d: Z(tunic) },
      { c: PAL.grey, o: 0.6, d: Z(legs) },
      { c: PAL.slate, o: 0.35, d: Z(legs) },
      { c: PAL.ochre, o: 0.85, d: patches },
      { c: PAL.terracotta, o: 0.7, d: shoes },
      { c: PAL.grey, o: 0.5, d: shoes },
    );
    sleeve = [PAL.terracotta, 0.5];
  } else {
    const coat = 'M-10 -114C-21 -112 -24 -104 -24 -94C-25 -74 -27 -56 -29 -40C-18 -37 -8 -38 -2 -42L2 -42C8 -38 18 -37 29 -40C27 -56 25 -74 24 -94C24 -104 21 -112 10 -114';
    const legs = 'M-17 -40L-16 -8L-3 -8L-2 -42M2 -42L3 -8L16 -8L17 -40';
    const shoes = 'M-16 -8C-25 -8 -26 0 -20 0L-3 0L-3 -8ZM16 -8C25 -8 26 0 20 0L3 0L3 -8Z';
    const cravat = 'M-7 -115C-4 -110 -2 -104 0 -98C2 -104 4 -110 7 -115C3 -112 -3 -112 -7 -115Z';
    lines.push(coat, legs, shoes, cravat);
    fine.push('M0 -98L0 -42', dot(-4, -92, 1.6), dot(-4, -80, 1.6), dot(-4, -68, 1.6), dot(-4, -56, 1.6), 'M-24 -60l9 -1M24 -60l-9 -1', 'M-2 -104q2 3 4 0');
    washes.push(
      { c: PAL.sky, o: 0.85, d: Z(coat) },
      { c: PAL.slate, o: 0.45, d: Z(coat) },
      { c: PAL.ochre, o: 0.95, d: dot(-4, -92, 1.6) + dot(-4, -80, 1.6) + dot(-4, -68, 1.6) + dot(-4, -56, 1.6) },
      { c: PAL.grey, o: 0.55, d: 'M-17 -40L-16 -8L-3 -8L-2 -42ZM2 -42L3 -8L16 -8L17 -40Z' },
      { c: PAL.slate, o: 0.9, d: shoes },
    );
    whites.push(cravat);
    glints.push('M-22 -6C-20 -7 -17 -7 -15 -6C-17 -5 -20 -5 -22 -6ZM15 -6C17 -7 20 -7 22 -6C20 -5 17 -5 15 -6Z');
    sleeve = [PAL.sky, 0.85];
  }
  const parts = arms.map((a) => arm(a, sleeve[0], sleeve[1], 4.6));
  if (clothes === 'patched') parts.push(...arms.map((a) => ({ washes: [{ c: PAL.grey, o: 0.6, d: Z(limb(a)) }] })));
  else if (clothes === 'fine') parts.push(...arms.map((a) => ({ washes: [{ c: PAL.slate, o: 0.45, d: Z(limb(a)) }] })));
  const head = place(youthHead({ mood, blush }), `translate(0 -130) rotate(${tilt})`);
  return merge({ lines, fine, washes, whites, glints }, ...parts, head);
}

// =============================================================================================
// THE KING (feet at 0,0), about 150 tall and round: a long red robe with white ermine trim, a
// round grey beard and a golden crown. Head at (0,-118); arms from the shoulders (±26,-94).
// =============================================================================================
export const K_ARMS = {
  down: [
    [[-28, -94, 11], [-40, -80, 10], [-46, -66, 10], [-47, -58, 10]],
    [[28, -94, 11], [40, -80, 10], [46, -66, 10], [47, -58, 10]],
  ],
};
const ermineDots = (pts) => pts.map(([x, y]) => `M${x} ${y}l0.5 1.6`).join('');
export function kingHead({ mood = 'happy' } = {}) {
  const face = 'M-13 -2C-14 8 -8 14 0 14C8 14 14 8 13 -2C13 -12 8 -15 0 -15C-8 -15 -13 -12 -13 -2Z';
  const beard = 'M-12.5 5C-15 16 -9 26 0 26C9 26 15 16 12.5 5C9 12 4 13 0 11.5C-4 13 -9 12 -12.5 5Z';
  const crown = 'M-13 -12L-15 -30L-8 -21L-3 -33L2 -21L8 -32L12 -21L16 -29L13 -12C5 -14 -5 -14 -13 -12Z';
  const m = faceMarks({ mood, ex: 4.8, ey: -3, my: 6, w: 3.6 });
  return {
    lines: [face, beard, crown],
    fine: ['M-8 6.5C-5 4 -2 4.5 0 5.5C2 4.5 5 4 8 6.5', 'M-7 16q2 4 1 7M7 16q-2 4 -1 7M0 18l0 6', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.32, d: face },
      { c: PAL.grey, o: 0.7, d: beard },
      { c: PAL.grey, o: 0.8, d: 'M-8 6.5C-5 4 -2 4.5 0 5.5C2 4.5 5 4 8 6.5C5 8.5 2 8 0 7C-2 8 -5 8.5 -8 6.5Z' },
      { c: PAL.ochre, o: 0.95, d: crown },
      { c: PAL.red, o: 0.9, d: dot(-3, -18, 1.8) + dot(8, -17, 1.6) },
      { c: PAL.sky, o: 0.9, d: dot(2.5, -17, 1.6) },
      { c: PAL.rose, o: 0.85, d: dot(0, 1.5, 3) },
      { c: PAL.rose, o: 0.6, d: dot(-9, 3, 2.6) + dot(9, 3, 2.6) },
      ...m.washes,
    ],
    fills: m.fills,
    glints: [...m.glints, 'M-10 -16l2 -8l1 0l-1 8Z'],
  };
}
export function king({ mood = 'happy', tilt = 0, arms = K_ARMS.down } = {}) {
  const robe = 'M-14 -102C-30 -98 -40 -80 -42 -50C-44 -26 -42 -8 -38 -2C-14 2 14 2 38 -2C42 -8 44 -26 42 -50C40 -80 30 -98 14 -102';
  const hem = 'M-40 -16C-14 -10 14 -10 40 -16L38 -2C14 2 -14 2 -38 -2Z';
  const cape = 'M-18 -104C-30 -100 -32 -90 -28 -84C-14 -79 14 -79 28 -84C32 -90 30 -100 18 -104C8 -99 -8 -99 -18 -104Z';
  const front = 'M-6 -82L-8 -14M6 -82L8 -14';
  const shoes = 'M-16 -1C-24 -1 -25 4 -19 4L-6 4L-6 0ZM16 -1C24 -1 25 4 19 4L6 4L6 0Z';
  const dots = ermineDots([[-32, -10], [-20, -8], [-8, -7], [4, -7], [16, -8], [28, -10], [-22, -92], [-10, -87], [2, -86], [14, -88], [24, -92]]);
  const parts = arms.map((a) => arm(a, PAL.red, 0.75, 5.4));
  const cuffs = arms.map((a) => {
    const [x, y] = a[a.length - 2];
    return { fine: [dot(x, y, 5.8)], whites: [dot(x, y, 5.8)] };
  });
  return merge(
    {
      lines: [robe, hem, cape, shoes],
      fine: [front],
      once: [dots],
      washes: [
        { c: PAL.red, o: 0.75, d: Z(robe) },
        { c: PAL.ochre, o: 0.85, d: 'M-6 -82L-8 -14L8 -14L6 -82Z' },
        { c: PAL.slate, o: 0.85, d: shoes },
      ],
      whites: [hem, cape],
    },
    ...parts,
    ...cuffs,
    place(kingHead({ mood }), `translate(0 -118) rotate(${tilt}) scale(1.1)`),
  );
}

// =============================================================================================
// THE PRINCESS (feet at 0,0), about 135 tall: a long rose dress, long golden hair and a tiara.
// Head at (0,-110); arms from the shoulders (±14,-90).
// =============================================================================================
export const PR_ARMS = {
  down: [
    [[-14, -90, 7], [-22, -80, 6.5], [-26, -70, 6.5], [-27, -64, 6.5]],
    [[14, -90, 7], [22, -80, 6.5], [26, -70, 6.5], [27, -64, 6.5]],
  ],
};
export function princessHead({ mood = 'happy', blush = false } = {}) {
  const face = 'M-11 -4C-11.5 6 -6 12 0 12C6 12 11.5 6 11 -4';
  const faceFill = `${face}C9 -9 -9 -9 -11 -4Z`;
  const hair = 'M-11 -3C-9 -9 -4 -10 0 -8C4 -10 9 -9 11 -3C13 6 13 16 17 24C10 27 4 22 10 12C11 6 11 1 11 -3M-11 -3C-13 6 -13 16 -17 24C-10 27 -4 22 -10 12C-11 6 -11 1 -11 -3C-15 -16 -7 -19 0 -19C7 -19 15 -16 11 -3';
  const hairFill = 'M-11 -3C-9 -9 -4 -10 0 -8C4 -10 9 -9 11 -3C13 6 13 16 17 24C10 27 4 22 10 12C12 4 12 -1 11 -3C15 -16 7 -19 0 -19C-7 -19 -15 -16 -11 -3C-12 -1 -12 4 -10 12C-4 22 -10 27 -17 24C-13 16 -13 6 -11 -3Z';
  const tiara = 'M-9 -14L-7 -22L-3 -16L0 -25L3 -16L7 -22L9 -14C3 -16 -3 -16 -9 -14Z';
  const m = faceMarks({ mood, ex: 4.2, ey: 0, my: 6.5, r: 1.6, w: 3.6 });
  return {
    lines: [face, hair, tiara],
    fine: ['M0.4 1.5c1.4 1 1.4 2.2 -0.5 2.6', 'M-14 8q2 6 0 12M14 8q-2 6 0 12', `M${-4.2 - 2.6} -2.6l-1.2 -1.2M${4.2 + 2.6} -2.6l1.2 -1.2`, ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.3, d: faceFill },
      { c: PAL.ochre, o: 0.9, d: hairFill },
      { c: PAL.ochre, o: 1, d: tiara },
      { c: PAL.sky, o: 0.9, d: dot(0, -18, 1.6) },
      { c: PAL.rose, o: blush ? 0.95 : 0.6, d: dot(-7, 4.5, blush ? 2.8 : 2.2) + dot(7, 4.5, blush ? 2.8 : 2.2) },
      { c: PAL.red, o: 0.5, d: `M-2.5 ${6.5 + 0.6}q2.5 2.8 5 0Z` },
      ...m.washes,
    ],
    fills: m.fills,
    glints: m.glints,
  };
}
export function princess({ mood = 'happy', tilt = 0, arms = PR_ARMS.down, blush = false } = {}) {
  const dress = 'M-9 -96C-16 -94 -18 -86 -18 -78C-20 -60 -26 -30 -34 -2C-12 2 12 2 34 -2C26 -30 20 -60 18 -78C18 -86 16 -94 9 -96';
  const sash = 'M-18 -72C-6 -68 6 -68 18 -72L19 -64C6 -60 -6 -60 -19 -64Z';
  const hem = 'M-31 -12C-12 -8 12 -8 31 -12';
  const neck = 'M-9 -96C-6 -90 6 -90 9 -96';
  return merge(
    {
      lines: [dress, sash],
      fine: [hem, neck, 'M-10 -50q-2 18 -4 40M10 -50q2 18 4 40M0 -60l0 52', dot(-20, -6, 1.6) + dot(-6, -4, 1.6) + dot(8, -4, 1.6) + dot(22, -6, 1.6)],
      washes: [
        { c: PAL.rose, o: 0.8, d: Z(dress) },
        { c: PAL.red, o: 0.6, d: sash },
        { c: PAL.ochre, o: 0.75, d: 'M-31 -12C-12 -8 12 -8 31 -12L34 -2C12 2 -12 2 -34 -2Z' },
      ],
    },
    ...arms.map((a) => arm(a, PAL.rose, 0.8, 3.6)),
    place(princessHead({ mood, blush }), `translate(0 -110) rotate(${tilt}) scale(1.05)`),
  );
}

// =============================================================================================
// THE FARMERS (feet at 0,0), about 140 tall: a wide straw hat, rolled-up shirt sleeves, slate
// trousers. kind 1: green shirt and a grey moustache; kind 2: sky shirt and a red neckerchief.
// Head at (0,-118); arms from the shoulders (±19,-98).
// =============================================================================================
export const F_ARMS = {
  down: [
    [[-20, -98, 9], [-28, -86, 8.5], [-31, -74, 8.5], [-31, -66, 8.5]],
    [[20, -98, 9], [28, -86, 8.5], [31, -74, 8.5], [31, -66, 8.5]],
  ],
};
export function farmer({ kind = 1, mood = 'laugh', tilt = 0, arms = F_ARMS.down } = {}) {
  const shirt = 'M-9 -104C-18 -102 -21 -94 -21 -86C-21 -76 -22 -66 -22 -56L22 -56C22 -66 21 -76 21 -86C21 -94 18 -102 9 -104';
  const legs = 'M-21 -56L-19 -8L-3 -8L-1 -42L1 -42L3 -8L19 -8L21 -56';
  const boots = 'M-19 -8C-27 -8 -28 0 -22 0L-3 0L-3 -8ZM19 -8C27 -8 28 0 22 0L3 0L3 -8Z';
  const shirtC = kind === 1 ? PAL.green : PAL.sky;
  const face = 'M-12 -4C-12.5 7 -7 13 0 13C7 13 12.5 7 12 -4C10 -8 -10 -8 -12 -4Z';
  const brim = 'M-30 -6C-22 -12 22 -12 30 -6C32 -3 28 -1 24 -3C12 -7 -12 -7 -24 -3C-28 -1 -32 -3 -30 -6Z';
  const crown = 'M-14 -8C-15 -18 -9 -22 0 -22C9 -22 15 -18 14 -8';
  const m = faceMarks({ mood, ex: 4.6, ey: 0, my: kind === 1 ? 8 : 7, w: 4 });
  const headFine = ['M0.5 1.5c1.6 1.2 1.6 2.6 -0.6 3', 'M-22 -8l2 2M-10 -10l1 2M4 -10l1 2M16 -9l2 2', ...m.fine];
  const headWashes = [
    { c: PAL.rose, o: 0.38, d: face },
    { c: PAL.ochre, o: 0.9, d: `${brim}${crown}C10 -10 -10 -10 -14 -8Z` },
    { c: PAL.terracotta, o: 0.5, d: 'M-14 -10C-5 -12 5 -12 14 -10L14 -8C5 -10 -5 -10 -14 -8Z' },
    { c: PAL.rose, o: 0.6, d: dot(-8, 4.5, 2.5) + dot(8, 4.5, 2.5) },
    ...m.washes,
  ];
  const headLines = [face, brim, crown];
  if (kind === 1) {
    const tache = 'M-1 5C-4 3 -9 4 -10 8C-6 7 -3 8 0 6.5C3 8 6 7 10 8C9 4 4 3 1 5Z';
    headLines.push(tache);
    headWashes.push({ c: PAL.grey, o: 0.95, d: tache });
  }
  const head = place({ lines: headLines, fine: headFine, washes: headWashes, fills: m.fills, glints: m.glints }, `translate(0 -118) rotate(${tilt})`);
  const extra =
    kind === 2
      ? { lines: ['M-9 -104C-4 -98 4 -98 9 -104L4 -94L-4 -94Z'], washes: [{ c: PAL.red, o: 0.85, d: 'M-9 -104C-4 -98 4 -98 9 -104L4 -94L-4 -94Z' }] }
      : { fine: ['M-5 -104L0 -96L5 -104'] };
  return merge(
    {
      lines: [shirt, legs, boots],
      fine: ['M-21 -62C-8 -60 8 -60 21 -62', 'M-10 -40q2 8 1 14'],
      washes: [
        { c: shirtC, o: 0.7, d: Z(shirt) },
        { c: PAL.slate, o: 0.6, d: Z(legs) },
        { c: PAL.terracotta, o: 0.6, d: boots },
        { c: PAL.grey, o: 0.6, d: boots },
      ],
    },
    extra,
    ...arms.map((a) => {
      // rolled-up sleeve to the elbow, then a bare forearm
      const sl = limb(a.slice(0, 2).map(([x, y, w]) => [x, y, w + 1.5]));
      return merge(arm(a, PAL.rose, 0.42, 4.6), { lines: [sl], washes: [{ c: shirtC, o: 0.7, d: Z(sl) }] });
    }),
    head,
  );
}

/** A scythe, held at (0,0): a long wooden handle down to the left, and at its foot the long curved
 * blade, sweeping along the grass to the left. */
export function scythe() {
  const h = limb([[16, -30, 4], [0, 0, 4], [-36, 66, 4]]);
  const blade = 'M-34 64C-50 70 -72 70 -92 60C-72 64 -52 62 -36 58Z';
  return {
    lines: [h, blade],
    fine: ['M-4 8l9 4'],
    washes: [{ c: PAL.terracotta, o: 0.7, d: Z(h) }, { c: PAL.grey, o: 0.95, d: blade }, { c: PAL.slate, o: 0.6, d: blade }],
    glints: ['M-80 64C-66 67 -52 66 -40 62C-52 64 -66 65 -80 64Z'],
  };
}

/** A pitchfork held at (0,0), with a tuft of hay on its prongs, up to the left. */
export function pitchfork() {
  const h = limb([[24, 44, 4], [0, 0, 4], [-30, -54, 4]]);
  const prongs = 'M-36 -52L-44 -66M-30 -55L-38 -70M-24 -58L-31 -72M-38 -50C-34 -54 -26 -58 -22 -59';
  const hay = 'M-56 -72C-50 -84 -30 -90 -20 -80C-16 -74 -22 -66 -30 -66C-40 -62 -52 -64 -56 -72Z';
  return {
    lines: [h, hay],
    fine: [prongs, 'M-50 -74l8 -4M-40 -80l8 2M-34 -72l10 -2M-46 -68l6 -4'],
    washes: [{ c: PAL.terracotta, o: 0.7, d: Z(h) }, { c: PAL.ochre, o: 0.95, d: hay }],
  };
}

/** A round haystack (bottom centre 0,0) of width w. */
export function haystack(w = 60) {
  const h = w * 0.85;
  const s = `M${-w / 2} 0C${-w / 2} ${-h * 0.7} ${-w * 0.3} ${-h} 0 ${-h}C${w * 0.3} ${-h} ${w / 2} ${-h * 0.7} ${w / 2} 0Z`;
  return {
    lines: [s],
    fine: [`M${-w * 0.3} ${-h * 0.4}q${w * 0.1} ${-h * 0.12} ${w * 0.16} 0M${w * 0.06} ${-h * 0.7}q${w * 0.1} ${-h * 0.12} ${w * 0.16} 0M${-w * 0.1} ${-h * 0.15}q${w * 0.1} ${-h * 0.12} ${w * 0.16} 0`],
    washes: [{ c: PAL.ochre, o: 0.9, d: s }, { c: PAL.terracotta, o: 0.25, d: s }],
  };
}

// =============================================================================================
// THE OGRE (feet at 0,0), about 250 tall: big, round and grumpy but funny: olive skin, wild grey
// hair, bushy black eyebrows, a big round nose, two little teeth, a terracotta tunic with a belt.
// Head at (0,-212), drawn 1.3 times bigger; arms from the shoulders (±60,-158). mood: 'grumpy' or 'boom' (shouting).
// =============================================================================================
export const O_ARMS = {
  down: [
    [[-60, -158, 22], [-76, -130, 20], [-82, -100, 20], [-80, -86, 20]],
    [[60, -158, 22], [76, -130, 20], [82, -100, 20], [80, -86, 20]],
  ],
};
const SKIN = [
  { c: PAL.green, o: 0.5 },
  { c: PAL.ochre, o: 0.3 },
];
export function ogreHead({ mood = 'grumpy' } = {}) {
  const face = 'M-30 -8C-33 14 -20 32 0 32C20 32 33 14 30 -8C29 -26 16 -36 0 -36C-16 -36 -29 -26 -30 -8Z';
  const hair = bumpy(0, -38, 30, 10, 11, 1.7, 180);
  const ears = 'M-30 -6C-40 -10 -42 4 -31 6M30 -6C40 -10 42 4 31 6';
  const brows = 'M-25 -20C-20 -27 -10 -24 -2 -12C-10 -13 -17 -14 -25 -14ZM25 -20C20 -27 10 -24 2 -12C10 -13 17 -14 25 -14Z';
  const nose = oval(0, 4, 8, 7);
  const lines = [face, ears, nose];
  const fine = ['M-25 -20l-3 -3M-19 -24l-1 -4M-12 -23l0 -4M25 -20l3 -3M19 -24l1 -4M12 -23l0 -4', 'M-28 18l1 0M-24 22l1 0M28 18l-1 0M24 22l-1 0'];
  const washes = [...SKIN.map((w) => ({ ...w, d: face })), ...SKIN.map((w) => ({ ...w, d: 'M-30 -6C-40 -10 -42 4 -31 6ZM30 -6C40 -10 42 4 31 6Z' })), { c: PAL.rose, o: 0.8, d: nose }, { c: PAL.grey, o: 0.9, d: hair }];
  const fills = [brows, dot(-11, -6, 2.6), dot(11, -6, 2.6)];
  const glints = [dot(-11.7, -6.9, 0.8), dot(10.3, -6.9, 0.8), 'M-4 0C-3 -2 0 -2 1 -1C-1 -1 -3 0 -4 0Z'];
  const whites = [oval(-11, -6, 5.5, 4.5), oval(11, -6, 5.5, 4.5)];
  fine.push(oval(-11, -6, 5.5, 4.5), oval(11, -6, 5.5, 4.5));
  if (mood === 'boom') {
    const mouth = 'M-14 16C-14 30 14 30 14 16C6 13 -6 13 -14 16Z';
    const teeth = 'M-9 15.5L-7 20L-5 15ZM5 15L7 20L9 15.5Z';
    lines.push(mouth);
    fine.push(teeth);
    washes.push({ c: PAL.red, o: 0.85, d: mouth }, { c: PAL.ink, o: 0.3, d: 'M-8 22C-4 27 4 27 8 22C4 21 -4 21 -8 22Z' });
    whites.push(teeth);
  } else {
    const mouth = 'M-14 22C-8 15 8 15 14 22';
    const teeth = 'M-8 18L-7 13L-4 17ZM4 17L7 13L8 18Z';
    lines.push(mouth);
    fine.push(teeth);
    whites.push(teeth);
  }
  return { lines: [hair, ...lines], fine, washes, fills, glints, whites };
}
export function ogre({ mood = 'grumpy', tilt = 0, arms = O_ARMS.down } = {}) {
  const tunic = 'M-36 -172C-64 -166 -76 -140 -76 -110C-76 -84 -72 -64 -66 -48C-30 -42 30 -42 66 -48C72 -64 76 -84 76 -110C76 -140 64 -166 36 -172';
  const belt = 'M-72 -92C-30 -84 30 -84 72 -92L71 -78C30 -70 -30 -70 -71 -78Z';
  const buckle = 'M-10 -88L10 -88L10 -72L-10 -72Z';
  const legs = [limb([[-30, -50, 30], [-32, -26, 28], [-32, -12, 28]]), limb([[30, -50, 30], [32, -26, 28], [32, -12, 28]])];
  const boots = 'M-46 -14C-60 -14 -64 0 -54 0L-16 0L-18 -14ZM46 -14C60 -14 64 0 54 0L16 0L18 -14Z';
  const patches = 'M30 -140L46 -142L47 -126L31 -124Z';
  return merge(
    {
      lines: [tunic, belt, buckle, ...legs, boots],
      fine: [patches, 'M-44 -130q4 16 2 30M40 -66q4 8 2 14', 'M-20 -172C-10 -164 10 -164 20 -172'],
      washes: [
        { c: PAL.terracotta, o: 0.62, d: Z(tunic) },
        { c: PAL.slate, o: 0.75, d: belt },
        { c: PAL.ochre, o: 0.9, d: buckle },
        { c: PAL.ochre, o: 0.6, d: patches },
        { c: PAL.grey, o: 0.75, d: legs.map(Z).join('') },
        { c: PAL.slate, o: 0.9, d: boots },
      ],
    },
    ...arms.map((a) => merge(arm(a, SKIN[0].c, SKIN[0].o, 12, SKIN[0].c, SKIN[0].o), { washes: [{ c: SKIN[1].c, o: SKIN[1].o, d: Z(limb(a)) }] })),
    place(ogreHead({ mood }), `translate(0 -212) rotate(${tilt}) scale(1.3)`),
  );
}

/** The Ogre as a huge lion, roaring up to the right (feet at 0,0, about 200 long). */
export function lion() {
  const body = 'M22 -95C0 -97 -30 -97 -56 -94C-76 -90 -84 -76 -80 -62C-78 -50 -70 -44 -56 -44L24 -44C38 -46 44 -56 42 -68';
  const bodyFill = `${body}C40 -84 34 -92 22 -95Z`;
  const legs = [
    limb([[-66, -52, 17], [-68, -26, 15], [-70, -6, 15]]),
    limb([[-44, -50, 17], [-42, -26, 15], [-40, -6, 15]]),
    limb([[10, -50, 17], [10, -26, 15], [10, -6, 15]]),
    limb([[32, -52, 17], [36, -26, 15], [38, -6, 15]]),
  ];
  const paws = [[-72, -4], [-38, -4], [12, -4], [40, -4]].map(([x, y]) => oval(x, y, 11, 5)).join('');
  const tail = limb([[-78, -72, 6], [-96, -82, 5], [-104, -100, 4.5], [-100, -114, 4]]);
  const tuft = 'M-100 -112C-108 -118 -106 -130 -98 -132C-94 -126 -90 -120 -96 -110Z';
  const hc = [62, -112];
  const mane = bumpy(hc[0], hc[1], 44, 46, 12, 1.22, -60);
  const face = oval(62, -110, 28, 27);
  const mouth = 'M48 -102C48 -78 76 -78 76 -102C68 -98 56 -98 48 -102Z';
  const fangs = 'M50 -101L53 -94L56 -99.5ZM74 -101L71 -94L68 -99.5ZM55 -84L57 -89L59 -84.5ZM65 -84.5L67 -89L69 -84Z';
  const nose = 'M57 -110L67 -110L62 -104Z';
  return {
    lines: [tail, ...legs, body, mane, face, mouth],
    fine: [
      paws,
      'M-60 -4l0 -4M-56 -4l0 -4M-28 -4l0 -4M-24 -4l0 -4M22 -4l0 -4M26 -4l0 -4M50 -4l0 -4M46 -4l0 -4',
      'M-10 -94q4 10 2 22M-40 -96q4 8 2 18',
      // eyes squeezed shut with roaring, cross brows, whiskers
      'M46 -122q5 -4 10 0M68 -122q5 -4 10 0M45 -128l10 3M79 -128l-10 3',
      nose,
      'M44 -104l-14 -3M44 -100l-13 2M80 -104l14 -3M80 -100l13 2',
      fangs,
    ],
    washes: [
      { c: PAL.ochre, o: 0.9, d: `${bodyFill}${legs.map(Z).join('')}${Z(tail)}` },
      { c: PAL.ochre, o: 0.9, d: paws },
      { c: PAL.terracotta, o: 0.85, d: mane },
      { c: PAL.ochre, o: 0.6, d: mane },
      { c: PAL.terracotta, o: 0.9, d: tuft },
      { c: PAL.ochre, o: 1, d: face },
      { c: PAL.red, o: 0.9, d: mouth },
      { c: PAL.ink, o: 0.3, d: 'M54 -90C58 -86 66 -86 70 -90C66 -93 58 -93 54 -90Z' },
      { c: PAL.rose, o: 0.95, d: nose },
    ],
    whites: [fangs],
  };
}

/** The Ogre as a teeny-tiny grey mouse running to the right (feet at 0,0, about 30 long). */
export function mouse() {
  const body = 'M-12 -1C-14 -9 -6 -14 2 -13C8 -12 12 -8 16 -4C17 -2 16 -1 14 -1Z';
  const ear = dot(3, -13, 3.6);
  const tail = 'M-12 -3C-20 -2 -24 -8 -30 -6C-34 -5 -36 -1 -40 -2';
  return {
    lines: [body, ear],
    fine: [tail, 'M-6 -1l-4 3M-2 -1l3 3M6 -1l-3 3M9 -1l4 3', 'M15 -5l7 -2M15 -4l7 1'],
    washes: [
      { c: PAL.grey, o: 0.95, d: `${body}${ear}` },
      { c: PAL.slate, o: 0.35, d: body },
      { c: PAL.rose, o: 0.85, d: dot(3, -13, 2) + dot(16.4, -3.6, 1.4) },
    ],
    fills: [dot(9, -8, 1.2)],
  };
}

/** A soft grey "POOF!" cloud round (0,0) of radius r. */
export function poof(r = 40, seed = 0) {
  const c = bumpy(0, 0, r, r * 0.75, 9, 1.3, seed);
  const inner = bumpy(r * 0.1, -r * 0.05, r * 0.55, r * 0.4, 6, 1.3, seed + 20);
  return {
    fine: [c, inner, `M${-r * 1.3} ${-r * 0.4}l-8 -4M${r * 1.35} ${-r * 0.5}l9 -5M${-r * 1.2} ${r * 0.6}l-8 5M${r * 1.25} ${r * 0.55}l9 4`],
    washes: [{ c: PAL.grey, o: 0.5, d: c }, { c: PAL.sky, o: 0.25, d: inner }],
  };
}

// =============================================================================================
// THINGS
// =============================================================================================

/** A wicker basket (bottom centre 0,0) about 44 wide, heaped with golden pears and strawberries. */
export function fruitBasket() {
  const b = 'M-22 -18L22 -18C20 -11 18 -5 15 0L-15 0C-18 -5 -20 -11 -22 -18Z';
  const pear = (x, y, r = 0) => {
    const p = `M${x} ${y - 12}C${x + 3} ${y - 8} ${x + 7} ${y - 4} ${x + 7} ${y + 1}C${x + 7} ${y + 6} ${x - 7} ${y + 6} ${x - 7} ${y + 1}C${x - 7} ${y - 4} ${x - 3} ${y - 8} ${x} ${y - 12}Z`;
    return { p, stalk: `M${x} ${y - 12}l${1 + r} -4` };
  };
  const berry = (x, y) => `M${x - 5} ${y - 3}C${x - 4} ${y + 3} ${x - 1} ${y + 6} ${x} ${y + 6}C${x + 1} ${y + 6} ${x + 4} ${y + 3} ${x + 5} ${y - 3}C${x + 2} ${y - 5} ${x - 2} ${y - 5} ${x - 5} ${y - 3}Z`;
  const pears = [pear(-10, -22), pear(9, -24, 1), pear(-1, -30, -1)];
  const berries = [berry(-17, -20), berry(17, -20), berry(1, -19)];
  const leaves = berries.map((_, i) => [[-17, -23], [17, -23], [1, -22]][i]).map(([x, y]) => `M${x - 4} ${y}l4 -3l4 3`).join('');
  return {
    lines: [b, ...pears.map((p) => p.p), ...berries],
    fine: ['M-21 -12L21 -12M-19 -6L19 -6', 'M-10 -18L-9 0M0 -18L0 0M10 -18L9 0', ...pears.map((p) => p.stalk), leaves, 'M-18 -19l0.3 0M-16 -17l0.3 0M16 -19l0.3 0M18 -17l0.3 0M0 -17l0.3 0M2 -15l0.3 0'],
    washes: [
      { c: PAL.ochre, o: 0.95, d: pears.map((p) => p.p).join('') },
      { c: PAL.green, o: 0.3, d: pears.map((p) => p.p).join('') },
      { c: PAL.red, o: 0.95, d: berries.join('') },
      { c: PAL.ochre, o: 0.75, d: b },
      { c: PAL.terracotta, o: 0.45, d: b },
    ],
  };
}

/** A grey boulder (bottom centre 0,0) about w wide. */
export function rock(w = 70) {
  const k = w / 70;
  const s = (x, y) => `${f(x * k)} ${f(y * k)}`;
  const r = `M${s(-35, 0)}C${s(-38, -22)} ${s(-24, -40)} ${s(-4, -40)}C${s(18, -42)} ${s(36, -26)} ${s(35, 0)}Z`;
  return {
    lines: [r],
    fine: [`M${s(-20, -24)}q${s(8, -6)} ${s(16, -4)}M${s(10, -12)}q${s(8, -2)} ${s(14, 4)}`],
    washes: [{ c: PAL.grey, o: 0.95, d: r }, { c: PAL.slate, o: 0.35, d: r }],
  };
}

/** A golden carriage (bottom of the front wheel at 0,0): the body with a window, two big wheels. */
export function carriage() {
  const body = 'M-80 -40C-84 -80 -76 -118 -60 -126L60 -126C76 -118 84 -80 80 -40C40 -32 -40 -32 -80 -40Z';
  const roof = 'M-66 -126C-60 -140 60 -140 66 -126Z';
  const crown = 'M-10 -136L-12 -150L-4 -143L0 -152L4 -143L12 -150L10 -136Z';
  const win = 'M-50 -110C-50 -118 -34 -118 -34 -110L-34 -78L-50 -78Z';
  const win2 = 'M34 -110C34 -118 50 -118 50 -110L50 -78L34 -78Z';
  const door = 'M-20 -116L20 -116L20 -40L-20 -40Z';
  const wheel = (cx, r) => {
    const rim = dot(cx, -r, r);
    let sp = '';
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      sp += `M${f(cx)} ${f(-r)}L${f(cx + Math.cos(a) * r * 0.92)} ${f(-r + Math.sin(a) * r * 0.92)}`;
    }
    return { rim, sp, hub: dot(cx, -r, r * 0.18) };
  };
  const w1 = wheel(-56, 30);
  const w2 = wheel(56, 30);
  return {
    lines: [body, roof, w1.rim, w2.rim, door],
    fine: [win, win2, crown, w1.sp, w2.sp, w1.hub, w2.hub, 'M-80 -52C-40 -44 40 -44 80 -52', dot(14, -78, 2)],
    washes: [
      { c: PAL.ochre, o: 0.95, d: `${body}${roof}` },
      { c: PAL.terracotta, o: 0.25, d: body },
      { c: PAL.ochre, o: 1, d: crown },
      { c: PAL.sky, o: 0.8, d: win + win2 },
      { c: PAL.red, o: 0.7, d: door },
      { c: PAL.terracotta, o: 0.85, d: w1.rim + w2.rim },
    ],
    whites: [dot(-56, -30, 24), dot(56, -30, 24)],
    glints: ['M-74 -60C-76 -80 -72 -100 -64 -112C-68 -96 -70 -78 -70 -60Z'],
  };
}

/**
 * The castle door (bottom centre 0,0) in a patch of grey stone wall: a tall arched wooden door,
 * 110 wide and 190 tall, with iron bands and a ring. open: 'shut', 'ajar' (open with the dark hall
 * behind, the door leaf swung back to the left) or 'wide' (both leaves gone, only the dark hall).
 * dark: false keeps the hall pale, for someone standing in the doorway; battlements: merlons along
 * the top of the wall.
 */
export const DOOR = { w: 110, h: 190 };
export function castleDoor({ open = 'shut', wall = 70, dark = true, battlements = false } = {}) {
  const W = DOOR.w / 2;
  const H = DOOR.h;
  const arch = `M${-W} 0L${-W} ${-H + W}C${-W} ${-H - 8} ${W} ${-H - 8} ${W} ${-H + W}L${W} 0`;
  const archFill = `${arch}Z`;
  const outerW = W + wall;
  const wallD = `M${-outerW} 2C${-outerW - 3} ${-H * 0.6} ${-outerW + 2} ${-H - 20} ${-outerW} ${-H - 46}L${outerW} ${-H - 46}C${outerW + 2} ${-H - 20} ${outerW - 3} ${-H * 0.6} ${outerW} 2Z`;
  // stone blocks: a few mortar lines here and there on the wall
  let blocks = '';
  for (let row = 0; row < 7; row++) {
    const y = -18 - row * 30;
    const len = Math.max(4, wall - 16);
    blocks += `M${-outerW + 6} ${y}l${len} 0M${W + 10} ${y - 8}l${len} 0`;
    blocks += `M${f(-outerW + wall * (0.3 + (row % 2) * 0.3))} ${y}l0 -30M${f(W + wall * (0.4 + (row % 2) * 0.3))} ${y - 8}l0 -30`;
  }
  const stones = `M${-W - 8} ${-H + W}C${-W - 8} ${-H - 18} ${W + 8} ${-H - 18} ${W + 8} ${-H + W}`;
  const out = {
    lines: [arch, stones],
    fine: [blocks, `M${-W - 8} ${-H + W}L${-W} ${-H + W}M${W} ${-H + W}L${W + 8} ${-H + W}M-20 ${-H - 4}l4 -11M20 ${-H - 4}l-4 -11M0 ${-H - 6}l0 -12`],
    washes: [{ c: PAL.grey, o: 0.65, d: `${wallD}${archFill}`, rule: 'evenodd' }],
    whites: [],
    glints: [],
  };
  if (battlements) {
    // merlons along the top of the wall
    const top = -H - 46;
    const n = Math.max(2, Math.round((2 * outerW) / 30));
    const step = (2 * outerW - 18) / (n - 1);
    let m = '';
    for (let i = 0; i < n; i++) {
      const x = -outerW + i * step;
      m += `M${f(x)} ${top}L${f(x)} ${top - 18}L${f(x + 18)} ${top - 18}L${f(x + 18)} ${top}`;
    }
    out.lines.push(m);
    out.washes.push({ c: PAL.grey, o: 0.65, d: m.replace(/M/g, 'ZM').slice(1) + 'Z' });
  }
  if (open === 'shut') {
    const planks = `M${-W / 2} ${-H + 12}L${-W / 2} 0M0 ${-H - 2}L0 0M${W / 2} ${-H + 12}L${W / 2} 0`;
    const bands = `M${-W} -40L${W} -40M${-W} ${-H + 70}L${W} ${-H + 70}`;
    out.fine.push(planks, dot(14, -92, 7), dot(14, -100, 2.4));
    out.lines.push(bands);
    out.washes.push({ c: PAL.terracotta, o: 0.75, d: archFill }, { c: PAL.ochre, o: 0.4, d: archFill }, { c: PAL.slate, o: 0.9, d: `M${-W} -44L${W} -44L${W} -36L${-W} -36ZM${-W} ${-H + 66}L${W} ${-H + 66}L${W} ${-H + 74}L${-W} ${-H + 74}Z` });
  } else {
    if (dark) out.washes.push({ c: PAL.slate, o: 0.85, d: archFill }, { c: PAL.ink, o: 0.4, d: archFill });
    else out.washes.push({ c: PAL.slate, o: 0.3, d: archFill });
    if (open === 'ajar') {
      // the leaf, seen edge-on as it swings in, along the left side of the opening
      const leaf = `M${-W} 0L${-W} ${-H + W}C${-W} ${-H + 10} ${-W + 18} ${-H + 6} ${-W + 26} ${-H + 16}L${-W + 26} -14Z`;
      out.lines.push(leaf);
      out.fine.push(`M${-W + 13} ${-H + 14}L${-W + 13} -7`);
      out.washes.push({ c: PAL.terracotta, o: 0.85, d: leaf }, { c: PAL.ochre, o: 0.4, d: leaf });
    }
  }
  return out;
}

/** A royal throne (bottom centre 0,0), about 116 wide and 220 tall: a tall golden back with a
 * blue cushion. Someone sits in front of it, so the cushion's outline stops at y = -104; hole: a
 * shape left out of the cushion's wash (the sitter's head). */
export function throne({ hole = '' } = {}) {
  const back = 'M-58 0L-58 -170C-58 -196 -30 -212 0 -214C30 -212 58 -196 58 -170L58 0';
  const cushion = 'M-46 -104L-46 -168C-46 -188 -24 -200 0 -202C24 -200 46 -188 46 -168L46 -104';
  const knobs = dot(-58, -172, 7) + dot(58, -172, 7) + dot(0, -220, 7);
  return {
    lines: [back, cushion],
    fine: [knobs, 'M-58 -40l-8 0l0 40M58 -40l8 0l0 40'],
    washes: [
      { c: PAL.ochre, o: 0.9, d: `${back}Z${cushion}L46 0L-46 0Z`, rule: 'evenodd' },
      { c: PAL.ochre, o: 0.9, d: `${knobs}M-58 -40L-66 -40L-66 0L-58 0ZM58 -40L66 -40L66 0L58 0Z` },
      { c: PAL.sky, o: 0.8, d: Z(cushion) + hole, rule: 'evenodd' },
      { c: PAL.slate, o: 0.35, d: Z(cushion) + hole, rule: 'evenodd' },
    ],
  };
}

/** A tall wooden cupboard (bottom centre 0,0), w wide and h tall. */
export function cupboard(w = 90, h = 170) {
  const W = w / 2;
  const box = `M${-W} 0L${-W} ${-h}L${W} ${-h}L${W} 0Z`;
  const top = `M${-W - 6} ${-h}L${W + 6} ${-h}L${W + 4} ${-h - 8}L${-W - 4} ${-h - 8}Z`;
  const doors = `M0 ${-h + 10}L0 -14M${-W + 8} ${-h + 10}L${W - 8} ${-h + 10}L${W - 8} -14L${-W + 8} -14Z`;
  return {
    lines: [box, top],
    fine: [doors, dot(-6, -h / 2, 2.4), dot(6, -h / 2, 2.4), `M${-W} -6L${W} -6`, `M${-W + 20} -40q4 -20 0 -40M${W - 20} ${-h + 40}q-4 16 0 34`],
    washes: [{ c: PAL.terracotta, o: 0.7, d: `${box}${top}` }, { c: PAL.ochre, o: 0.45, d: box }],
  };
}

/** A sleeve of the miller's son's old patched coat, poking out to the right of (0,0) from under
 * something, lying on the ground. */
export function sleevePeeking() {
  const sleeve = 'M0 0L0 -11C8 -12 16 -10 22 -8C27 -7 28 -1 24 0Z';
  const patch = 'M6 -10L13 -10L13 -3L6 -3Z';
  return {
    lines: [sleeve],
    fine: [patch, 'M20 -9l0 8'],
    washes: [
      { c: PAL.terracotta, o: 0.5, d: sleeve },
      { c: PAL.grey, o: 0.6, d: sleeve },
      { c: PAL.ochre, o: 0.85, d: patch },
    ],
  };
}

/** Splashes and ripples on water round (0,0). */
export function splash(r = 40) {
  return {
    fine: [
      `M${-r} 4q${r / 4} -5 ${r / 2} 0q${r / 4} 5 ${r / 2} 0M${r * 0.1} 6q${r / 4} -5 ${r / 2} 0q${r / 4} 5 ${r / 2} 0`,
      `M${-r * 0.7} -8l-8 -12M${-r * 0.5} -12l-2 -16M${r * 0.6} -10l8 -12M${r * 0.75} -6l12 -8`,
    ],
    washes: [{ c: PAL.sky, o: 0.7, d: `${dot(-r * 0.9, -22, 3)}${dot(-r * 0.55, -32, 2.5)}${dot(r * 0.85, -24, 3)}${dot(r * 1.05, -16, 2.4)}` }],
    once: [`${dot(-r * 0.9, -22, 3)}${dot(-r * 0.55, -32, 2.5)}${dot(r * 0.85, -24, 3)}${dot(r * 1.05, -16, 2.4)}`],
  };
}

/** Quick motion lines behind something running to the right, ending at (0,0). */
export function speed(n = 3, len = 30, gap = 8) {
  let d = '';
  for (let i = 0; i < n; i++) d += `M${-len - (i % 2) * 8} ${(i - (n - 1) / 2) * gap}l${len} 0`;
  return { fine: [d] };
}
