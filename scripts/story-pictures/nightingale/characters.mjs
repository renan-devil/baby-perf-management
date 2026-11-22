import { PAL, transformPath } from '../lib.mjs';
import { at, compose, dot, f, limb, merge, oval, place } from '../stone-soup/characters.mjs';

// The Nightingale: the little brown nightingale, the jewelled golden bird, the Emperor, the little
// kitchen girl and the Chamberlain, with the throne, the window and the bed, drawn once here and
// placed in each picture with a transform (place); flip with scale(-1 1). The build only draws
// files named <n>.mjs, so this file is not a picture. Standing characters have their feet at y = 0
// and look at us. Simple palace clothes of old China: the Emperor in a long yellow robe with a
// little golden crown on his topknot.

export { at, compose, dot, merge, oval, place };

const Z = (d) => `${d}Z`;
const W = (list, d) => list.map((w) => ({ ...w, d }));

const BLACK = [
  { c: PAL.slate, o: 0.95 },
  { c: PAL.ink, o: 0.55 },
];
const YELLOW = [{ c: PAL.ochre, o: 0.72 }];
const GREEN = [{ c: PAL.green, o: 0.7 }];
// the nightingale's plain brown: a warm wash over a grey one
const BROWN = [
  { c: PAL.grey, o: 0.75 },
  { c: PAL.terracotta, o: 0.55 },
];

/** A four-pointed sparkle centred on (x, y), of half-size s. */
export const sparkle = (x, y, s) =>
  `M${f(x)} ${f(y - s)}L${f(x)} ${f(y + s)}M${f(x - s)} ${f(y)}L${f(x + s)} ${f(y)}M${f(x - s * 0.4)} ${f(y - s * 0.4)}L${f(x + s * 0.4)} ${f(y + s * 0.4)}M${f(x + s * 0.4)} ${f(y - s * 0.4)}L${f(x - s * 0.4)} ${f(y + s * 0.4)}`;

/** A music note (a filled head and a stem with a little flag), its head at (x, y), of size s. */
export function note(x, y, s = 1) {
  const head = transformPath(oval(0, 0, 3.4, 2.5), `translate(${x} ${y}) rotate(-20) scale(${s})`);
  const stem = transformPath('M3 -1L3 -15C6 -13 8 -11 8 -7', `translate(${x} ${y}) scale(${s})`);
  return { fine: [stem], fills: [head] };
}

/** An arm (limb along pts) in a sleeve (list of washes), ending in a round hand of radius r. */
function arm(pts, sleeve, r) {
  const n = pts.length;
  const [x, y] = pts[n - 1];
  const [px, py] = pts[n - 2];
  const l = Math.hypot(x - px, y - py);
  const k = Math.min(0.8, (r * 0.8) / l);
  const d = limb([...pts.slice(0, -1), [f(x - (x - px) * k), f(y - (y - py) * k), pts[n - 1][2]]]);
  const h = dot(x, y, r);
  return { lines: [d], fine: [h], washes: [...W(sleeve, Z(d)), { c: PAL.rose, o: 0.6, d: h }] };
}

/**
 * Eyes and mouth: eyes at (±ex, ey), mouth at my. mood: 'happy', 'wow' (eyes wide, brows up, a
 * small "o"), 'frown' (eyes wide, brows pulled down, a small "o": puzzled surprise), 'sad' (brows
 * up in the middle, mouth turned down), 'tear' (eyes closed, moved, a soft smile and a tear),
 * 'ill' (eyes closed, tired brows, a small flat mouth), 'shut' (eyes closed, a happy smile),
 * 'up' (looking up, smiling), 'admire' (looking down, smiling).
 */
function faceMarks({ mood, ex, ey, my, r = 1.8, w = 4.5 }) {
  const fine = [];
  const fills = [];
  const glints = [];
  const washes = [];
  const closed = (up) => `M${-ex - 3} ${ey}q3 ${up ? -3.4 : 3} 6 0M${ex - 3} ${ey}q3 ${up ? -3.4 : 3} 6 0`;
  const eyes = (dx = 0, rr = r, dy = 0) => {
    fills.push(dot(-ex + dx, ey + dy, rr), dot(ex + dx, ey + dy, rr));
    glints.push(dot(-ex + dx - 0.5, ey + dy - 0.6, 0.55), dot(ex + dx - 0.5, ey + dy - 0.6, 0.55));
  };
  const smile = `M${-w} ${my}q${w} 5 ${2 * w} 0`;
  if (mood === 'wow') {
    eyes(0, r + 0.5);
    fine.push(`M${-ex - 3} ${ey - 5}q3 -2.4 6 0M${ex - 3} ${ey - 5}q3 -2.4 6 0`);
    fills.push(oval(0, my + 1.5, 2.3, 2.9));
  } else if (mood === 'frown') {
    eyes(0, r + 0.5);
    fine.push(`M${-ex - 4} ${ey - 7}L${-ex + 3.5} ${ey - 4}M${ex + 4} ${ey - 7}L${ex - 3.5} ${ey - 4}`, `M-1.5 ${my - 3.5}l0 2.5M1.5 ${my - 3.5}l0 2.5`);
    fills.push(oval(0, my + 2, 2, 2.4));
  } else if (mood === 'sad') {
    eyes(0, r);
    fine.push(`M${-ex - 3} ${ey - 4}L${-ex + 3} ${ey - 6.5}M${ex + 3} ${ey - 4}L${ex - 3} ${ey - 6.5}`, `M${-w + 1} ${my + 2.5}q${w - 1} -4 ${2 * w - 2} 0`);
  } else if (mood === 'tear') {
    fine.push(closed(false), `M${-ex - 3} ${ey - 5}L${-ex + 3} ${ey - 6.5}M${ex + 3} ${ey - 5}L${ex - 3} ${ey - 6.5}`, `M${-w + 1} ${my + 0.5}q${w - 1} 3 ${2 * w - 2} 0`);
    const tx = ex + 1;
    const ty = ey + 4;
    const tear = `M${tx} ${ty}C${tx - 2.2} ${ty + 3.5} ${tx - 2.8} ${ty + 6.5} ${tx} ${ty + 6.5}C${tx + 2.8} ${ty + 6.5} ${tx + 2.2} ${ty + 3.5} ${tx} ${ty}Z`;
    fine.push(tear);
    washes.push({ c: PAL.sky, o: 0.95, d: tear });
  } else if (mood === 'ill') {
    fine.push(closed(false), `M${-ex - 3} ${ey - 5}L${-ex + 3} ${ey - 6}M${ex + 3} ${ey - 5}L${ex - 3} ${ey - 6}`, `M${-w + 2} ${my + 1}l${2 * w - 4} 0`);
  } else if (mood === 'shut') {
    fine.push(closed(true), smile);
  } else if (mood === 'up') {
    eyes(0.8, r, -1.3);
    fine.push(smile);
  } else if (mood === 'admire') {
    eyes(0.6, r, 0.8);
    fine.push(smile);
  } else {
    eyes();
    fine.push(smile);
  }
  return { fine, fills, glints, washes };
}

// =============================================================================================
// THE NIGHTINGALE (middle of the body at 0,0, looking right), about 40 long: a small, plain brown
// bird with a paler belly, a long reddish-brown tail and a bright black eye. Her feet hold a branch
// at y = 13. beak: 'closed' or 'open' (singing). pose: 'perch' or 'fly' (wings up, no feet).
// =============================================================================================
const nBody = 'M-9 2C-11 -4 -5 -9 3 -9C5 -12 8 -13.5 11 -13.5C15 -13.5 17.5 -10.5 17 -7.5C16.5 -4 14 -2 13 0C12 5 6 9 -1 8.5C-5 8 -8 5.5 -9 2Z';
const nBelly = 'M13 -1C12 4 6 8.5 -1 8.5C-4 8.2 -6 7 -7.5 5C-2 6 6 4 13 -1Z';
const nTail = 'M-7 0L-22 7L-21 12L-5 6Z';
const nWing = 'M-7 -1C-3 -6 4 -6 9 -2C6 2 0 4 -6 4Z';
export function nightingale({ beak = 'closed', pose = 'perch' } = {}) {
  const open = beak === 'open';
  const bill = open ? 'M16.4 -10.5L23 -14L17 -8.6ZM16.6 -7.6L22.5 -4.5L15.8 -6Z' : 'M16.6 -9.6L22.5 -8.4L16.4 -7Z';
  const wing = pose === 'fly' ? 'M-4 -6C-10 -16 -8 -28 0 -34C4 -26 7 -16 7 -7Z' : nWing;
  const wing2 = pose === 'fly' ? 'M2 -8C4 -18 10 -26 18 -28C17 -20 12 -12 7 -6Z' : '';
  const tail = pose === 'fly' ? 'M-7 0L-22 2L-23 8L-6 5Z' : nTail;
  const legs = pose === 'fly' ? [] : ['M0 8L-1 13M4 7.6L4 13', 'M-3.5 13L1.5 13M2 13L7 13'];
  return {
    lines: [tail, nBody, wing, ...(wing2 ? [wing2] : [])],
    fine: [bill, pose === 'fly' ? 'M-3 -14l4 1M-2 -20l4 1M1 -26l4 1' : 'M-3 0l5 -1M0 2l5 -1', ...legs],
    washes: [
      ...W(BROWN, nBody + nBelly).map((w) => ({ ...w, rule: 'evenodd' })),
      ...W(BROWN, tail + (wing2 ? Z(wing2) : '')),
      { c: PAL.grey, o: 0.45, d: nBelly },
      { c: PAL.terracotta, o: 0.45, d: tail },
      ...W([{ c: PAL.terracotta, o: 0.4 }, { c: PAL.slate, o: 0.3 }], Z(wing)),
      { c: PAL.ochre, o: 0.35, d: nBelly },
      { c: PAL.slate, o: 0.6, d: bill },
    ],
    fills: [dot(12.6, -9.8, 1.5)],
    glints: [dot(12.1, -10.4, 0.5)],
  };
}

// =============================================================================================
// THE GOLDEN BIRD (middle of the body at 0,0, looking right), about 80 long: a plump mechanical
// bird of shining gold, studded with red, blue and pink jewels, with a crest of three jewelled
// plumes, a fanned tail tipped with jewels and a silver wind-up key in its back. Its stiff feet
// stand at y = 20. broken: a spring pops out of its side, its crest droops and its eye goes dull.
// =============================================================================================
const gBody = 'M-16 2C-18 -8 -8 -15 4 -14C7 -19 12 -22 18 -22C25 -22 29 -17 28 -11C27 -6 24 -3 22 1C20 11 9 15 -2 14C-10 13 -15 9 -16 2Z';
const gWing = 'M-10 -4C-4 -10 8 -10 14 -4C11 4 2 8 -8 7C-12 4 -12 0 -10 -4Z';
const gScallops = 'M-8 -1q3 3 6 0q3 3 6 0q3 3 6 0M-6 4q3 3 6 0q3 3 6 0';
const gBeak = 'M27.5 -14L36 -11.5L27.5 -9Z';
const gFeathers = [-168, -150, -132, -114].map((a) => transformPath(oval(-31, 0, 15, 4.6), `rotate(${a} -15 0)`));
const gTips = [-168, -150, -132, -114].map((a) => at(-44, 0, `rotate(${a} -15 0)`));
const gJewels = [
  [2, -9, PAL.red],
  [-4, 10, PAL.sky],
  [8, 10, PAL.red],
  [17, 4, PAL.rose],
  [20, -14, PAL.sky],
];
export function goldenBird({ broken = false } = {}) {
  const crest = broken ? 'M15 -21C13 -27 9 -28 6 -26M19 -22C19 -28 17 -31 14 -32M23 -21C26 -25 28 -24 30 -21' : 'M15 -21L10 -31M19 -22L19 -34M23 -21L28 -30';
  const crestTips = broken ? [[6, -26, PAL.red], [14, -32, PAL.sky], [30, -21, PAL.red]] : [[10, -31, PAL.red], [19, -34, PAL.sky], [28, -30, PAL.red]];
  const key = 'M-8 -11L-13 -21';
  const bow = transformPath(oval(-17, -24, 5, 3), 'rotate(-30 -17 -24)') + transformPath(oval(-11, -27, 5, 3), 'rotate(-80 -11 -27)');
  const legs = 'M2 14L0 20M8 13L9 20M-4 20L4 20M5 20L13 20';
  const jewelDots = gJewels.map(([x, y]) => dot(x, y, 2.3));
  const tipDots = gTips.map(([x, y]) => dot(x, y, 2.6));
  const crestDots = crestTips.map(([x, y]) => dot(x, y, 2.2));
  const jw = (c, list) => list.filter((j) => j[2] === c).map(([x, y]) => dot(x, y, 2.3)).join('');
  const out = {
    lines: [...gFeathers, gBody, gWing, key, bow],
    fine: [crest, gBeak, gScallops, ...jewelDots, ...tipDots, ...crestDots, legs, dot(22.5, -14, 2.4)],
    washes: [
      { c: PAL.ochre, o: 0.95, d: gBody + gFeathers.join('') + gBeak },
      { c: PAL.ochre, o: 0.5, d: gWing + gFeathers.join('') },
      { c: PAL.terracotta, o: 0.4, d: gBeak + 'M-16 2C-15 9 -10 13 -2 14C9 15 20 11 22 1C14 9 0 10 -16 2Z' },
      { c: PAL.slate, o: 0.6, d: bow },
      { c: PAL.red, o: 0.9, d: jw(PAL.red, gJewels) + [tipDots[0], tipDots[2], crestDots[0], crestDots[2]].join('') },
      { c: PAL.sky, o: 0.95, d: jw(PAL.sky, gJewels) + [tipDots[1], crestDots[1]].join('') },
      { c: PAL.rose, o: 0.95, d: jw(PAL.rose, gJewels) + tipDots[3] },
      { c: PAL.red, o: 0.6, d: dot(22.5, -14, 2.4) },
    ],
    whites: ['M-6 -10C0 -13 6 -13 9 -12C4 -11 -1 -10 -6 -8Z', 'M20 -20C22 -21 24 -21 25 -20C23 -19.5 21.5 -19 20 -18Z'],
    fills: [dot(22.5, -14, 1.2)],
    glints: broken ? [] : [dot(22, -14.6, 0.6)],
  };
  if (broken) {
    // a spring bursts out of a crack in its side, with a little cog and a loose screw
    const crack = 'M10 2L13 6L11 9L15 12';
    const spring = 'M14 8C22 4 24 12 20 14C16 16 22 22 27 18C32 14 32 24 27 26C22 28 30 34 35 30C40 26 40 36 35 38';
    const cog = dot(44, 22, 4) + 'M44 16.5l0 -2M44 27.5l0 2M38.5 22l-2 0M49.5 22l2 0M40 18l-1.5 -1.5M48 26l1.5 1.5M48 18l1.5 -1.5M40 26l-1.5 1.5';
    out.lines.push(spring);
    out.fine.push(crack, cog, 'M38 6l5 -4M42 12l6 -1');
    out.washes.push({ c: PAL.slate, o: 0.55, d: dot(44, 22, 4) });
  }
  return out;
}

// =============================================================================================
// THE EMPEROR (feet at 0,0), about 172 tall: a kind young face with no beard, black hair in a
// topknot under a little golden crown held by a pin, a long yellow robe with a red collar, a red
// sash and a red hem, and wide sleeves. Head at E_HEAD; arms from the shoulders (±22,-116).
// seated: on his throne (knees at y = -34); upper: only above y = -70. pale: ill (greyish face, no
// rosy cheeks); rosy: well again (bright rosy cheeks).
// =============================================================================================
export const E_HEAD = [0, -142];
export const E_ARMS = {
  down: [
    [[-22, -116, 13], [-29, -98, 15], [-32, -80, 16]],
    [[22, -116, 13], [29, -98, 15], [32, -80, 16]],
  ],
};
export function emperorHead({ mood = 'happy', pale = false, rosy = false, crown = true } = {}) {
  const face = 'M-13 -3C-13.5 9 -7 15.5 0 15.5C7 15.5 13.5 9 13 -3';
  const faceFill = `${face}C10 -11 -10 -11 -13 -3Z`;
  const hair = 'M-14 1C-16 -11 -9 -18 0 -18C9 -18 16 -11 14 1C12.5 -5 9 -9.5 0 -9.5C-9 -9.5 -12.5 -5 -14 1Z';
  const knot = oval(0, -21, 6, 5);
  const crownD = 'M-7.5 -18C-8.5 -25 -6 -31 0 -31C6 -31 8.5 -25 7.5 -18C3 -19.5 -3 -19.5 -7.5 -18Z';
  const pin = 'M-10 -24.5L10 -26';
  const m = faceMarks({ mood, ex: 5, ey: 1, my: 9, w: 4 });
  const cheeks = pale ? [] : [{ c: PAL.rose, o: rosy ? 0.85 : 0.5, d: dot(-8.5, 6, rosy ? 3 : 2.4) + dot(8.5, 6, rosy ? 3 : 2.4) }];
  return {
    lines: [face, hair, 'M-13 -3q-4 0 -3 6M13 -3q4 0 3 6', ...(crown ? [crownD] : [knot])],
    fine: ['M0.4 3c1.6 1.2 1.6 2.6 -0.6 3', 'M-6 -18c3 -2 9 -2 12 0', ...(crown ? [pin, 'M-6 -24.5l12 -0.6'] : []), ...m.fine],
    washes: [
      { c: PAL.rose, o: pale ? 0.12 : 0.32, d: faceFill },
      ...(pale ? [{ c: PAL.slate, o: 0.28, d: faceFill }] : []),
      ...W(BLACK, hair + knot),
      ...(crown ? [{ c: PAL.ochre, o: 0.95, d: crownD }] : []),
      ...cheeks,
      ...m.washes,
    ],
    whites: crown ? ['M-4 -27C-3 -29 -1 -29.5 1 -29.5C-1 -28 -2 -26 -2.5 -24Z'] : [],
    fills: m.fills,
    glints: m.glints,
  };
}

/** The seated Emperor's outline (head and robe down to the knees), to leave a hole in the throne. */
export function emperorSeatedOutline() {
  const body =
    'M-11 -127C-23 -125 -29 -114 -30 -100C-31 -88 -34 -78 -40 -70C-46 -62 -46 -44 -42 -34L42 -34C46 -44 46 -62 40 -70C34 -78 31 -88 30 -100C29 -114 23 -125 11 -127C6 -130 -6 -130 -11 -127Z';
  return body + oval(E_HEAD[0], E_HEAD[1] - 1, 15, 17.5) + oval(E_HEAD[0], E_HEAD[1] - 24, 8.5, 8);
}

export function emperor({ mood = 'happy', tilt = 0, arms = E_ARMS.down, seated = false, upper = false, pale = false, rosy = false } = {}) {
  const top = 'M-11 -127C-23 -125 -29 -114 -30 -100';
  const topR = 'M11 -127C23 -125 29 -114 30 -100';
  let body;
  let fill;
  if (upper) {
    body = `${top}L-31 -70${topR}L31 -70`;
    fill = 'M-11 -127C-23 -125 -29 -114 -30 -100L-31 -70L31 -70L30 -100C29 -114 23 -125 11 -127Z';
  } else if (seated) {
    body = `${top}C-31 -88 -34 -78 -40 -70C-46 -62 -46 -44 -42 -34C-40 -22 -40 -10 -38 -2C-12 1 12 1 38 -2C40 -10 40 -22 42 -34C46 -44 46 -62 40 -70C34 -78 31 -88 30 -100C29 -114 23 -125 11 -127`;
    fill = Z(`${body}C6 -130 -6 -130 -11 -127`);
  } else {
    body = `${top}C-32 -70 -36 -36 -40 -2C-14 2 14 2 40 -2C36 -36 32 -70 30 -100C29 -114 23 -125 11 -127`;
    fill = Z(`${body}C6 -130 -6 -130 -11 -127`);
  }
  const collar = 'M-11 -127C-5 -118 1 -111 8 -105L12 -109C6 -115 3 -121 -1 -129C-5 -129 -8 -128 -11 -127Z';
  const sash = 'M-30 -88C-10 -84 10 -84 30 -88L30 -81C10 -77 -10 -77 -30 -81Z';
  const lines = [body];
  const fine = [collar, sash];
  const washes = [...W(YELLOW, fill), { c: PAL.red, o: 0.85, d: collar }, { c: PAL.red, o: 0.8, d: sash }];
  if (!upper) {
    const hem = seated ? 'M-40 -12C-14 -9 14 -9 40 -12L38 -2C12 1 -12 1 -38 -2Z' : 'M-39 -12C-14 -8 14 -8 39 -12L40 -2C14 2 -14 2 -40 -2Z';
    const shoes = 'M-22 0C-30 0 -32 6 -26 6L-10 6L-10 0ZM22 0C30 0 32 6 26 6L10 6L10 0Z';
    const ends = 'M6 -80L3 -56L10 -57L12 -80';
    lines.push(shoes);
    fine.push(hem, ends, seated ? 'M-40 -70C-28 -64 -12 -62 -2 -64M40 -70C28 -64 12 -62 2 -64M0 -62L0 -12' : 'M-8 -76q-2 30 -4 62M12 -54q2 20 2 40');
    washes.push({ c: PAL.red, o: 0.8, d: hem + Z(ends) }, ...W(BLACK, shoes));
  }
  return merge(
    { lines, fine, washes },
    ...arms.map((a) => arm(a, YELLOW, 5)),
    place(emperorHead({ mood, pale, rosy }), `translate(${E_HEAD[0]} ${E_HEAD[1]}) rotate(${tilt})`),
  );
}

// =============================================================================================
// THE LITTLE KITCHEN GIRL (feet at 0,0), about 104 tall: black hair with a straight fringe and two
// round buns tied with red ribbons, rosy cheeks, a terracotta jacket with a white apron, grey
// trousers and black cloth shoes. Head at G_HEAD; arms from the shoulders (±13,-66).
// =============================================================================================
export const G_HEAD = [0, -84];
export const G_ARMS = {
  down: [
    [[-13, -66, 6.5], [-17, -55, 6], [-19, -44, 6]],
    [[13, -66, 6.5], [17, -55, 6], [19, -44, 6]],
  ],
  // pointing up and to the right
  point: [
    [[-13, -66, 6.5], [-17, -55, 6], [-15, -44, 6]],
    [[13, -66, 6.5], [24, -78, 6], [32, -96, 6]],
  ],
};
export function girl({ mood = 'happy', tilt = 0, arms = G_ARMS.down } = {}) {
  const coat = 'M-7 -72C-14 -70 -17 -64 -17 -56C-17 -50 -18 -44 -19 -36C-6 -33 6 -33 19 -36C18 -44 17 -50 17 -56C17 -64 14 -70 7 -72';
  const coatFill = Z(`${coat}C4 -74 -4 -74 -7 -72`);
  const apron = 'M-11 -56L11 -56L13 -35C5 -33 -5 -33 -13 -35Z';
  const legs = [limb([[-6, -35, 8], [-7, -20, 7.5], [-7, -6, 7]]), limb([[6, -35, 8], [7, -20, 7.5], [7, -6, 7]])];
  const shoes = oval(-9, -2.5, 6, 3.4) + oval(9, -2.5, 6, 3.4);
  const face = 'M-11 -3C-11.5 7 -6 12 0 12C6 12 11.5 7 11 -3';
  const hair = 'M-12 2C-14 -10 -8 -16 0 -16C8 -16 14 -10 12 2C11 -2 10 -4 7 -4.5C3 -5.5 -3 -5.5 -7 -4.5C-10 -4 -11 -2 -12 2Z';
  const buns = oval(-12, -12, 5.2, 5) + oval(12, -12, 5.2, 5);
  const ribbons = 'M-8 -15L-5 -18L-4 -13ZM8 -15L5 -18L4 -13Z';
  const m = faceMarks({ mood, ex: 4.4, ey: 1.5, my: 7.5, w: 3.5, r: 1.6 });
  const head = {
    lines: [face, buns, hair],
    fine: [ribbons, 'M0.4 3.5c1.2 0.9 1.2 2 -0.5 2.3', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.3, d: Z(`${face}C9 -9 -9 -9 -11 -3`) },
      ...W(BLACK, hair + buns),
      { c: PAL.red, o: 0.85, d: ribbons },
      { c: PAL.rose, o: 0.65, d: dot(-7, 5, 2.2) + dot(7, 5, 2.2) },
      ...m.washes,
    ],
    fills: m.fills,
    glints: m.glints,
  };
  return merge(
    { lines: [...legs, 'M-12 -1C-12 -6 -6 -6 -4 -3', shoes], washes: [{ c: PAL.grey, o: 0.7, d: legs.map(Z).join('') }, ...W(BLACK, shoes)] },
    { lines: [coat], fine: [apron, 'M-11 -56C-8 -62 -6 -66 -6 -71M11 -56C8 -62 6 -66 6 -71'], washes: [{ c: PAL.terracotta, o: 0.65, d: coatFill }], whites: [apron] },
    ...arms.map((a) => arm(a, [{ c: PAL.terracotta, o: 0.65 }], 3.8)),
    place(head, `translate(${G_HEAD[0]} ${G_HEAD[1]}) rotate(${tilt})`),
  );
}

// =============================================================================================
// THE CHAMBERLAIN (feet at 0,0), about 182 tall with his hat: a grand courtier with a long, tall
// black hat, a neat little black beard, a long green robe with an ochre collar and a grey sash.
// Head at C_HEAD; arms from the shoulders (±20,-104).
// =============================================================================================
export const C_HEAD = [0, -128];
export const C_ARMS = {
  down: [
    [[-20, -104, 12], [-26, -86, 13], [-28, -70, 14]],
    [[20, -104, 12], [26, -86, 13], [28, -70, 14]],
  ],
  // hands thrown up in surprise
  wow: [
    [[-20, -104, 12], [-36, -100, 13], [-42, -118, 13]],
    [[20, -104, 12], [36, -100, 13], [42, -118, 13]],
  ],
  // hands clasped in admiration
  clasp: [
    [[-20, -104, 12], [-26, -88, 13], [-6, -84, 13]],
    [[20, -104, 12], [26, -88, 13], [6, -84, 13]],
  ],
};
export function chamberlain({ mood = 'wow', tilt = 0, arms = C_ARMS.down } = {}) {
  const robe = 'M-10 -114C-21 -112 -25 -103 -26 -90C-28 -62 -31 -32 -34 -2C-11 2 11 2 34 -2C31 -32 28 -62 26 -90C25 -103 21 -112 10 -114';
  const robeFill = Z(`${robe}C5 -117 -5 -117 -10 -114`);
  const collar = 'M-10 -114C-5 -106 1 -99 7 -94L11 -98C5 -104 2 -109 -1 -116C-5 -116 -8 -115 -10 -114Z';
  const sash = 'M-27 -76C-9 -72 9 -72 27 -76L27 -69C9 -65 -9 -65 -27 -69Z';
  const shoes = 'M-20 0C-28 0 -30 6 -24 6L-8 6L-8 0ZM20 0C28 0 30 6 24 6L8 6L8 0Z';
  const face = 'M-12 -3C-12.5 8 -7 15 0 15C7 15 12.5 8 12 -3';
  const hat = 'M-12 -4C-13 -16 -14 -32 -13 -44C-5 -47 5 -47 13 -44C14 -32 13 -16 12 -4C5 -6 -5 -6 -12 -4Z';
  const band = 'M-12.4 -12C-5 -14 5 -14 12.4 -12L12.6 -8C5 -10 -5 -10 -12.6 -8Z';
  const beard = 'M-3 13C-3 18 -1.5 21 0 22C1.5 21 3 18 3 13C1.5 14.5 -1.5 14.5 -3 13Z';
  const tache = 'M0 8C-3 6.5 -6 7 -7.5 9.5C-5 9 -2.5 9 0 9.3C2.5 9 5 9 7.5 9.5C6 7 3 6.5 0 8Z';
  const m = faceMarks({ mood, ex: 4.8, ey: 1, my: 11, w: 3.5 });
  if (mood === 'wow' || mood === 'frown') m.fills.pop();
  if (mood === 'wow' || mood === 'frown') m.fills.push(oval(0, 12.5, 1.8, 2.2));
  const head = {
    lines: [face, hat, 'M-12 -3q-4 0 -3 6M12 -3q4 0 3 6'],
    fine: [band, beard, tache, 'M0.4 3c1.6 1.2 1.6 2.6 -0.6 3', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.32, d: Z(`${face}C9 -6 -9 -6 -12 -3`) },
      ...W(BLACK, hat + beard + tache),
      { c: PAL.ochre, o: 0.6, d: band },
      { c: PAL.rose, o: 0.45, d: dot(-8, 6, 2.2) + dot(8, 6, 2.2) },
      ...m.washes,
    ],
    fills: m.fills,
    glints: m.glints,
  };
  return merge(
    {
      lines: [robe, shoes],
      fine: [collar, sash, 'M-6 -66q-2 30 -4 60M10 -60q2 26 2 54'],
      washes: [...W(GREEN, robeFill), { c: PAL.ochre, o: 0.85, d: collar }, { c: PAL.grey, o: 0.8, d: sash }, ...W(BLACK, shoes)],
    },
    ...arms.map((a) => arm(a, GREEN, 4.6)),
    place(head, `translate(${C_HEAD[0]} ${C_HEAD[1]}) rotate(${tilt})`),
  );
}

// =============================================================================================
// THE PALACE WINDOW (top left of the opening at 0,0), w wide and h tall: a red frame and two
// lattice shutters folded open outwards. view: the washes seen through it (path data inside the
// opening is up to the picture).
// =============================================================================================
export function palaceWindow(w, h) {
  const opening = `M0 0L${w} 0L${w} ${h}L0 ${h}Z`;
  const frame = `M-7 -7L${w + 7} -7L${w + 7} ${h + 7}L-7 ${h + 7}Z`;
  const sill = `M-14 ${h + 7}L${w + 14} ${h + 7}L${w + 14} ${h + 15}L-14 ${h + 15}Z`;
  const sw = Math.round(w * 0.32);
  const shutL = `M-7 -4L${-7 - sw} 6L${-7 - sw} ${h - 2}L-7 ${h + 4}Z`;
  const shutR = `M${w + 7} -4L${w + 7 + sw} 6L${w + 7 + sw} ${h - 2}L${w + 7} ${h + 4}Z`;
  let lattice = '';
  for (let i = 1; i < 4; i++) {
    const y1 = -4 + ((h + 8) * i) / 4;
    const y2 = 6 + ((h - 8) * i) / 4;
    lattice += `M-7 ${f(y1)}L${-7 - sw} ${f(y2)}M${w + 7} ${f(y1)}L${w + 7 + sw} ${f(y2)}`;
  }
  lattice += `M${f(-7 - sw / 2)} ${1}L${f(-7 - sw / 2)} ${h + 1}M${f(w + 7 + sw / 2)} ${1}L${f(w + 7 + sw / 2)} ${h + 1}`;
  return {
    lines: [frame, opening, sill, shutL, shutR],
    fine: [lattice],
    washes: [
      { c: PAL.red, o: 0.8, d: frame + opening, rule: 'evenodd' },
      { c: PAL.red, o: 0.7, d: sill },
      { c: PAL.terracotta, o: 0.55, d: shutL + shutR },
    ],
  };
}

// =============================================================================================
// THE THRONE (middle of the seat front at 0,0): a tall golden back with a red panel, arms and a
// red step. hole: path data (in picture coordinates after placing) kept free of its colours, inside
// the back; gap: half the width of the seat's middle left uncoloured (under the Emperor's lap).
// =============================================================================================
export function throne(t, hole = '', gap = 46) {
  const back = 'M-76 -24L-76 -178C-76 -208 -46 -222 0 -222C46 -222 76 -208 76 -178L76 -24Z';
  const panel = 'M-60 -38L-60 -172C-60 -194 -36 -204 0 -204C36 -204 60 -194 60 -172L60 -38Z';
  const seat = 'M-86 -38L86 -38L90 -6L-90 -6Z';
  const armL = 'M-86 -38L-86 -84C-86 -92 -74 -92 -74 -84L-74 -38';
  const armR = 'M74 -38L74 -84C74 -92 86 -92 86 -84L86 -38';
  const step = 'M-104 -6L104 -6L112 12L-112 12Z';
  const p = (d) => transformPath(d, t);
  return {
    lines: [p(back), p(seat), p(armL), p(armR), p(step)],
    fine: [p(panel), p('M-32 -184q32 -20 64 0')],
    washes: [
      { c: PAL.ochre, o: 0.85, d: p(back) + hole, rule: 'evenodd' },
      { c: PAL.red, o: 0.7, d: p(panel) + hole, rule: 'evenodd' },
      // the seat is coloured only at the sides, so the Emperor's lap stays yellow
      { c: PAL.red, o: 0.7, d: p(`M-86 -38L${-gap} -38L${-gap} -6L-90 -6ZM${gap} -38L86 -38L90 -6L${gap} -6Z`) },
      { c: PAL.ochre, o: 0.85, d: p(`${armL}Z${armR}Z`) },
      { c: PAL.red, o: 0.7, d: p(step) },
    ],
  };
}

/** A big open book (middle of the spine at 0,0), about 66 wide: a red cover and white pages. */
export function book() {
  const cover = 'M-33 -16L0 -11L33 -16L35 17L0 22L-35 17Z';
  const pageL = 'M-30 -17L0 -12L0 19L-31 14Z';
  const pageR = 'M0 -12L30 -17L31 14L0 19Z';
  let text = '';
  for (let i = 0; i < 5; i++) {
    const y = -9 + i * 5;
    text += `M-26 ${y - 3 + i * 0.3}L-5 ${y + 0.6}M5 ${y + 0.6}L26 ${y - 3 + i * 0.3}`;
  }
  return {
    lines: [cover, pageL, pageR],
    fine: [text],
    washes: [{ c: PAL.red, o: 0.8, d: cover }],
    whites: [pageL + pageR],
  };
}
