import { PAL, hatch } from '../lib.mjs';
import { dot, f, limb, merge, oval, place } from '../peter-rabbit/characters.mjs';

// The Cat that Walked by Himself: the characters and things shared by the ten pictures, drawn once
// here and placed in each picture with a transform (place). The build only draws files named <n>.mjs,
// so this file is not a picture. Every character faces right with its feet on y = 0; flip it with
// scale(-1 1).

export { at, compose, dot, f, limb, merge, oval, place } from '../peter-rabbit/characters.mjs';

const closed = (d) => `${d}Z`;
const wash = (c, o, d, rule) => (rule ? { c, o, d, rule } : { c, o, d });

// ---------------------------------------------------------------------------------------------
// The Cat: a slim grey-and-ochre tabby with green eyes, a pink nose, dark tabby stripes and a long
// ringed tail. The same head in every pose. mood: 'open', 'up' (looking up), 'shut' (contented).
const FUR = (d) => [wash(PAL.grey, 0.62, d), wash(PAL.ochre, 0.42, d)];
const cHead = 'M-14 2C-15 -7 -9 -12 1 -12C10 -12 16 -7 16 1C16 8 10 12 1 12C-8 12 -13 8 -14 2Z';
const cEars = ['M-12.5 -4L-11 -22L-2 -11.5', 'M5 -11.5L13 -22L15.5 -3'];
const cEarsIn = 'M-10 -7L-9.5 -17L-4.5 -11.5ZM7.5 -10.5L12 -17L13.5 -6Z';
const cNose = 'M2.3 3L6.7 3L4.5 5.6Z';

export function catHead({ mood = 'open', tongue = false } = {}) {
  const fine = [
    cNose,
    'M4.5 5.6q-0.6 3 -4 2.6M4.5 5.6q0.6 3 4 2.6',
    'M-3 5l-13 -2.5M-3 7.5l-12 3M12 5l13 -2.5M12 7.5l12 3',
    'M4.5 -12l0 4.5M0.5 -11.5l1 4M8.5 -11.5l-1 4',
    'M-14 1l4 0.6M16 1l-4 0.6',
  ];
  const washes = [...FUR(cHead), ...cEars.map((d) => FUR(closed(d))).flat(), wash(PAL.rose, 0.7, cEarsIn), wash(PAL.rose, 0.95, cNose)];
  const fills = [];
  const glints = [];
  const eyes = [
    [-1.5, -1.5],
    [9.5, -1.5],
  ];
  if (mood === 'shut') {
    fine.push('M-4.5 -2q3 3 6 0M6.5 -2q3 3 6 0');
  } else {
    const dy = mood === 'up' ? -0.9 : 0;
    for (const [x, y] of eyes) {
      washes.push(wash(PAL.green, 0.95, oval(x, y, 3.2, 2.7)));
      fine.push(oval(x, y, 3.2, 2.7));
      fills.push(oval(x + 0.3, y + dy, 1, 2.3));
      glints.push(dot(x - 0.6, y - 1 + dy, 0.6));
    }
  }
  if (tongue) {
    const t = 'M2.8 7.5C2 15 7 15 6.2 7.5Z';
    washes.push(wash(PAL.rose, 0.95, t));
    fine.push(t);
  }
  return { lines: [cHead, ...cEars], fine, washes, fills, glints };
}

function catLeg(pts, pad = 'oval') {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const [px, py] = pts[pts.length - 2];
  const l = Math.hypot(x - px, y - py);
  const p = pad === 'oval' ? oval(x + 2, y + 0.5, 5, 3.2) : dot(x + ((x - px) / l) * 2, y + ((y - py) / l) * 2, 3.8);
  return { lines: [d], fine: [p], washes: [...FUR(closed(d)), ...FUR(p)] };
}

/** The ringed tail along a centreline, with tabby stripes across it and a dark tip. */
function catTail(pts) {
  const d = limb(pts);
  let rings = '';
  for (let i = 1; i < pts.length; i++) {
    for (const t of [0.35, 0.8]) {
      const [ax, ay, aw] = pts[i - 1];
      const [bx, by, bw] = pts[i];
      const x = ax + (bx - ax) * t;
      const y = ay + (by - ay) * t;
      const w = (aw + (bw - aw) * t) * 0.42;
      const l = Math.hypot(bx - ax, by - ay);
      const nx = (-(by - ay) / l) * w;
      const ny = ((bx - ax) / l) * w;
      rings += `M${f(x - nx)} ${f(y - ny)}L${f(x + nx)} ${f(y + ny)}`;
    }
  }
  const n = pts.length;
  const tip = limb([pts[n - 2].map((v, i) => (i < 2 ? (v + pts[n - 1][i]) / 2 : v)), pts[n - 1]]);
  return { lines: [d], fine: [rings], washes: [...FUR(closed(d)), wash(PAL.slate, 0.45, closed(tip))] };
}

// Poses, feet on y = 0, facing right: a body outline, its stripes, the legs behind and in front of
// the body (limb centrelines), the head's place and the tail's centreline (drawn behind, or in
// front of the paws when it curls round them).
const CAT_POSES = {
  walk: {
    body: 'M-26 -36C-27 -44 -14 -47 2 -46C16 -46 26 -44 27 -36C28 -27 20 -23 4 -23C-12 -23 -26 -26 -26 -36Z',
    stripes: 'M-16 -45q3 6 0 10M-7 -46q3 6 0 10M2 -46q3 6 0 10M11 -45q3 6 0 9M-24 -40q4 3 2 8',
    far: [
      [[12, -30, 7], [13, -15, 6], [11, -3, 5.5]],
      [[-18, -30, 10], [-22, -16, 6.5], [-21, -3, 5.5]],
    ],
    near: [
      [[19, -30, 7.5], [24, -16, 6.5], [27, -3, 5.5]],
      [[-13, -30, 11], [-9, -16, 6.5], [-5, -3, 5.5]],
    ],
    head: 'translate(30 -48)',
    tail: [[-23, -40, 6], [-33, -52, 5.5], [-37, -70, 5], [-34, -88, 4.5], [-26, -95, 4]],
  },
  sit: {
    body: 'M-18 0C-25 -8 -23 -24 -13 -34C-7 -42 4 -48 12 -44C18 -36 18 -16 15 0Z',
    stripes: 'M-17 -6C-16 -18 -6 -22 0 -12M-14 -31q5 2 8 -2M-19 -22q4 2 7 -1M-4 -42q3 2 6 -1',
    far: [],
    near: [[[9, -32, 8.5], [9, -16, 7.5], [10, -3, 6.5]]],
    head: 'translate(8 -52)',
    tail: [[-19, -9, 7], [-14, -3, 6.5], [0, -1.5, 6], [16, -2.5, 5.5], [26, -8, 5], [28, -15, 4]],
    tailFront: true,
  },
  crouch: {
    body: 'M-28 -24C-29 -32 -14 -35 2 -34C16 -34 24 -30 25 -24C26 -16 18 -12 2 -12C-14 -12 -28 -15 -28 -24Z',
    stripes: 'M-18 -33q3 6 0 10M-9 -34q3 6 0 10M0 -34q3 6 0 10M9 -34q3 6 0 9',
    far: [
      [[14, -18, 7], [20, -10, 6], [22, -3, 5.5]],
      [[-20, -18, 10], [-28, -9, 7], [-20, -3, 5.5]],
    ],
    near: [
      [[18, -18, 7.5], [27, -10, 6.5], [31, -3, 5.5]],
      [[-15, -18, 11], [-24, -8, 7], [-13, -3, 5.5]],
    ],
    head: 'translate(35 -31) rotate(-4)',
    tail: [[-26, -28, 6], [-40, -36, 5.5], [-46, -52, 5], [-42, -68, 4.5], [-34, -72, 4]],
  },
  // creeping up, one front paw lifted, as he peeps round the door
  peep: {
    body: 'M-28 -24C-29 -32 -14 -35 2 -34C16 -34 24 -30 25 -24C26 -16 18 -12 2 -12C-14 -12 -28 -15 -28 -24Z',
    stripes: 'M-18 -33q3 6 0 10M-9 -34q3 6 0 10M0 -34q3 6 0 10M9 -34q3 6 0 9',
    far: [
      [[14, -18, 7], [20, -10, 6], [22, -3, 5.5]],
      [[-20, -18, 10], [-28, -9, 7], [-20, -3, 5.5]],
    ],
    near: [
      [[18, -18, 7.5], [28, -18, 6.5], [33, -12, 5.5]],
      [[-15, -18, 11], [-24, -8, 7], [-13, -3, 5.5]],
    ],
    head: 'translate(36 -32) rotate(-4)',
    tail: [[-26, -28, 6], [-40, -36, 5.5], [-46, -52, 5], [-42, -68, 4.5], [-34, -72, 4]],
  },
  lap: {
    body: 'M-28 -26C-29 -34 -14 -37 2 -34C14 -32 22 -26 23 -20C24 -14 16 -11 2 -12C-14 -12 -28 -16 -28 -26Z',
    stripes: 'M-18 -35q3 6 0 10M-9 -35q3 6 0 10M0 -34q3 6 0 10M9 -32q3 6 0 9',
    far: [
      [[14, -16, 7], [20, -8, 6], [24, -3, 5.5]],
      [[-20, -20, 10], [-28, -10, 7], [-20, -3, 5.5]],
    ],
    near: [
      [[17, -15, 7.5], [24, -6, 6.5], [31, -3, 5.5]],
      [[-15, -20, 11], [-24, -9, 7], [-13, -3, 5.5]],
    ],
    head: 'translate(35 -12) rotate(30)',
    tail: [[-26, -30, 6], [-38, -40, 5.5], [-42, -56, 5], [-38, -70, 4.5], [-30, -72, 4]],
  },
  roll: {
    body: 'M-26 -14C-26 -24 -12 -28 2 -28C16 -28 26 -24 26 -14C26 -6 16 -2 0 -2C-14 -2 -26 -6 -26 -14Z',
    belly: 'M-17 -23C-6 -29 8 -29 18 -23C10 -17 -8 -17 -17 -23Z',
    stripes: 'M-16 -6q2 -5 0 -9M-6 -4q2 -5 0 -9M4 -4q2 -5 0 -9M14 -6q2 -5 0 -8',
    far: [
      [[-20, -22, 9], [-30, -30, 6.5], [-34, -40, 5.5]],
      [[8, -25, 7], [12, -40, 6], [16, -50, 5.5]],
    ],
    near: [
      [[-12, -24, 10], [-18, -36, 6.5], [-14, -46, 5.5]],
      [[10, -26, 7], [27, -42, 6], [49, -46, 5.5]],
    ],
    pad: 'round',
    head: 'translate(34 -15) rotate(14)',
    tail: [[-25, -12, 6], [-38, -8, 5.5], [-50, -10, 5], [-56, -18, 4.5], [-52, -26, 4]],
  },
};

export function cat({ pose = 'walk', mood = 'open', tongue = false } = {}) {
  const P = CAT_POSES[pose];
  const legs = (list) => list.map((l) => catLeg(l, P.pad ?? 'oval'));
  const body = {
    lines: [P.body],
    fine: [P.stripes],
    washes: FUR(P.body),
    whites: P.belly ? [P.belly] : [],
  };
  if (P.belly) body.washes.push(wash(PAL.ochre, 0.25, P.belly));
  const head = place(catHead({ mood, tongue }), P.head);
  const tail = catTail(P.tail);
  return P.tailFront
    ? merge(...legs(P.far), body, ...legs(P.near), tail, head)
    : merge(tail, ...legs(P.far), body, ...legs(P.near), head);
}

// ---------------------------------------------------------------------------------------------
// People: Stone-Age tunics of skin. A profile head (centre 0,0, facing right) and a body built
// around the hips (0,0): 'stand' or 'sit' (on a stool or log whose top is at y = -18 above the feet).
const face = 'M-9 -4C-9 -12 -2 -15 3 -14C9 -13 12 -8 12 -2C12 1 14 3 14 5C13 6 11 6 11 7C11 11 7 14 1 13C-5 13 -9 6 -9 -4Z';
const SKIN = PAL.rose;

const wHair = 'M12 -7C10 -15 2 -19 -5 -17C-13 -14 -15 -4 -14 6C-14 16 -16 24 -14 32C-10 35 -6 33 -5 28C-5 20 -6 12 -4 4C-3 -3 3 -9 12 -7Z';
export function womanHead({ mood = 'smile' } = {}) {
  const fine = ['M2 -6.5q3 -1.8 6 0', 'M-8 -2c-3 -1 -4 4 0 4'];
  const fills = [dot(5.5, -2.5, 1.7)];
  if (mood === 'smile') fine.push('M5 7.5q3 2.4 5.5 -0.5');
  if (mood === 'laugh') fills.push('M4.5 7Q8 12 11 7Z');
  return {
    lines: [face, wHair],
    fine,
    washes: [wash(SKIN, 0.45, face), wash(PAL.rose, 0.5, dot(5, 3.5, 2.6)), wash(PAL.terracotta, 0.85, wHair), wash(PAL.slate, 0.3, wHair)],
    fills,
    glints: [dot(5, -3.1, 0.5)],
  };
}

const wTorso = 'M-11 -58C-5 -64 8 -64 12 -58C14 -40 13 -20 12 0L-12 0C-14 -20 -15 -40 -11 -58Z';
const wSkirtStand = 'M-12 0C-14 10 -16 18 -17 25L-12 22L-7 28L-2 23L3 29L8 23L13 28L17 23C16 14 14 6 12 0Z';
const wSkirtSit = 'M-12 -2L12 -2C20 -4 27 -4 31 -2C34 3 33 8 31 11L27 8L23 12L19 8L15 12L11 8L7 12L3 8L-1 12L-5 8L-9 11C-13 8 -14 3 -12 -2Z';
const wStrap = 'M-10 -58L12 -36';
const wBelt = 'M-12 -10C-4 -7 4 -7 12 -10';
// Spots on the skin of a dress, as little patches.
const spots = (list) => list.map(([x, y], i) => oval(x, y, 3 + (i % 2), 2 + (i % 3) * 0.5)).join('');

function personArm(pts, tint = SKIN) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const hand = dot(x, y, 4.2);
  return { lines: [d], fine: [hand], washes: [wash(tint, 0.45, closed(d)), wash(SKIN, 0.5, hand)] };
}
function personLeg(pts, foot) {
  const d = limb(pts);
  return { lines: [d, foot], washes: [wash(SKIN, 0.45, closed(d)), wash(PAL.terracotta, 0.6, foot)] };
}
const footAt = (x, y) => `M${f(x - 4)} ${f(y - 5)}C${f(x - 5)} ${f(y - 1)} ${f(x - 5)} ${f(y + 1)} ${f(x - 3)} ${f(y + 1)}L${f(x + 9)} ${f(y + 1)}C${f(x + 10)} ${f(y - 2)} ${f(x + 6)} ${f(y - 4)} ${f(x + 2)} ${f(y - 5)}Z`;

export const WOMAN_ARMS = {
  down: [null, [[3, -54, 8], [4, -34, 7], [6, -16, 6]]],
};

/**
 * The Woman: long auburn hair, an ochre skin dress over one shoulder. Feet on y = 0. arms: two limb
 * centrelines in hip coordinates (back arm, front arm; null leaves one out), the shoulders being near
 * (±6, -54). pose: 'stand' or 'sit'; lean tips the upper body forward by that many degrees.
 */
export function woman({ pose = 'stand', mood = 'smile', arms = WOMAN_ARMS.down, headTilt = 0, lean = 0 } = {}) {
  const hipY = pose === 'stand' ? -54 : -28;
  const skirt = pose === 'stand' ? wSkirtStand : wSkirtSit;
  const legs =
    pose === 'stand'
      ? [personLeg([[-5, 22, 8.5], [-6, 38, 7.5], [-6, 50, 6.5]], footAt(-6, 53)), personLeg([[5, 22, 8.5], [6, 38, 7.5], [7, 50, 6.5]], footAt(7, 53))]
      : [personLeg([[20, 8, 8.5], [22, 18, 7.5], [23, 24, 6.5]], footAt(23, 27)), personLeg([[25, 8, 8.5], [28, 18, 7.5], [29, 24, 6.5]], footAt(29, 27))];
  // the upper body (torso, head and arms) can lean forward about the hips
  const up = (part) => (lean ? place(part, `rotate(${lean})`) : part);
  const torso = up({
    lines: [wTorso],
    fine: [wStrap, wBelt],
    washes: [wash(PAL.ochre, 0.62, wTorso), wash(PAL.terracotta, 0.18, wTorso), wash(PAL.terracotta, 0.6, spots([[-4, -40], [6, -24], [-6, -18]]))],
  });
  const skirtPart = {
    lines: [skirt],
    washes: [wash(PAL.ochre, 0.62, skirt), wash(PAL.terracotta, 0.18, skirt), wash(PAL.terracotta, 0.6, spots(pose === 'stand' ? [[4, 14], [-8, 12]] : [[8, 4], [20, 2]]))],
  };
  const neck = up({ washes: [wash(SKIN, 0.45, 'M-2 -60L-2 -68L6 -68L6 -60Z')] });
  const head = up(place(womanHead({ mood }), `translate(3 -76) rotate(${headTilt})`));
  const arm = (a) => (a ? [up(personArm(a))] : []);
  const inner = merge(...arm(arms[0]), ...legs, neck, skirtPart, torso, head, ...arm(arms[1]));
  return place(inner, `translate(0 ${hipY})`);
}

/** A little three-legged stool whose top is at y = -18 (the height a sitting person needs). */
export function stool() {
  const top = 'M-16 -20C-8 -23 8 -23 16 -20L16 -16C8 -13 -8 -13 -16 -16Z';
  return {
    lines: [top, 'M-12 -15L-15 0M12 -15L15 0M0 -14L0 -1'],
    washes: [wash(PAL.ochre, 0.7, top), wash(PAL.terracotta, 0.3, top)],
  };
}

/** A log to sit on, top at y = -18. */
export function log(w = 60) {
  const h = w / 2;
  const d = `M${-h} -18C${-h + 10} -20 ${h - 10} -20 ${h} -18L${h} 0L${-h} 0Z`;
  return {
    lines: [d],
    fine: [oval(h, -9, 4, 9), `M${-h + 8} -9l14 0M${f(-h / 3)} -13l12 0M${f(h / 3)} -6l10 0`],
    washes: [wash(PAL.terracotta, 0.55, d), wash(PAL.ochre, 0.5, d), wash(PAL.ochre, 0.6, oval(h, -9, 4, 9))],
  };
}

// The Man: bigger, with a shaggy dark mop of hair and a short beard, a terracotta skin tunic,
// sitting with his hands on his knees and a big open smile.
const mHair = 'M-11 -4C-15 -14 -6 -22 4 -19C10 -22 16 -16 13 -10C9 -13 3 -12 -1 -8C-3 -3 -5 1 -9 3C-12 1 -12 -2 -11 -4Z';
const mBeard = 'M-7 3C-7 12 -1 18 6 18C10 18 12 16 12 14C8 15 3 14 -1 11C-4 9 -6 6 -7 3Z';
export function manHead() {
  return {
    lines: [face, mHair],
    fine: [mBeard, 'M2 -6.5q3 -2.2 6.5 0', 'M-8 -2c-3 -1 -4 4 0 4'],
    washes: [wash(SKIN, 0.45, face), wash(PAL.slate, 0.8, mHair), wash(PAL.terracotta, 0.4, mHair), wash(PAL.slate, 0.45, mBeard), wash(PAL.rose, 0.5, dot(5, 2, 2.6))],
    fills: [dot(5.5, -2.5, 1.8), 'M2.5 4.5Q8 14 13.5 4Q8 7 2.5 4.5Z'],
    glints: [dot(5, -3.1, 0.5)],
  };
}
const mTunic = 'M-13 -62C-6 -68 10 -68 14 -62C16 -42 15 -20 14 -2L-2 -2L36 -4L33 1L37 5L32 9C16 11 0 11 -12 10C-16 -8 -17 -40 -13 -62Z';
export function man() {
  const legs = [
    personLeg([[22, 8, 9.5], [24, 18, 8.5], [25, 24, 7.5]], footAt(25, 27)),
    personLeg([[28, 8, 9.5], [31, 18, 8.5], [32, 24, 7.5]], footAt(32, 27)),
  ];
  const body = {
    lines: [mTunic],
    fine: ['M-13 -12C-4 -9 6 -9 14 -12'],
    washes: [wash(PAL.terracotta, 0.62, mTunic), wash(PAL.ochre, 0.25, mTunic), wash(PAL.slate, 0.4, spots([[-5, -44], [6, -26], [20, 2]]))],
  };
  const arms = [personArm([[5, -58, 9.5], [8, -34, 8.5], [26, -8, 7.5]])];
  const head = place(manHead(), 'translate(3 -80) scale(1.08)');
  return place(merge(...legs, body, head, arms[0]), 'translate(0 -28)');
}

// ---------------------------------------------------------------------------------------------
// Wild Dog: a rangy terracotta dog with upright pointed ears, a long snout and a bushy tail.
// pose: 'stand' or 'sleep' (curled up, chin on paws); mood: 'open' or 'shut'.
const DOGFUR = (d) => [wash(PAL.terracotta, 0.55, d), wash(PAL.ochre, 0.45, d)];
const dSkull = 'M-10 -2C-11 -10 -4 -14 4 -13C10 -12 13 -8 15 -4L26 -1C29 0 29 5 26 6L10 8C2 10 -9 7 -10 -2Z';
const dEars = ['M-8 -8L-6 -24L2 -12', 'M-1 -12L5 -25L9 -10'];
export function dogHead({ mood = 'open' } = {}) {
  const fine = ['M26 6C20 7 14 7 10 5', 'M-6 -6l-4 6'];
  const fills = [dot(27, 1.5, 2.4)];
  const glints = [];
  if (mood === 'shut') fine.push('M4 -5q3 2.5 6 0');
  else {
    fills.push(dot(7, -5.5, 1.9));
    glints.push(dot(6.4, -6.1, 0.55));
  }
  return {
    lines: [dSkull, ...dEars],
    fine,
    washes: [...DOGFUR(dSkull), ...dEars.map((d) => DOGFUR(closed(d))).flat(), wash(PAL.rose, 0.6, 'M-5.5 -11L-5 -20L-0.5 -12.5Z')],
    fills,
    glints,
  };
}
function dogLeg(pts) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const p = oval(x + 2.5, y + 0.5, 6, 3.4);
  return { lines: [d], fine: [p], washes: [...DOGFUR(closed(d)), ...DOGFUR(p)] };
}
function dogTail(pts) {
  const d = limb(pts);
  return { lines: [d], washes: DOGFUR(closed(d)) };
}
export function dog({ pose = 'stand', mood = 'open', head = '' } = {}) {
  if (pose === 'sleep') {
    const body = 'M-32 -12C-34 -26 -18 -34 0 -33C18 -32 30 -24 30 -12C30 -4 20 0 0 0C-20 0 -31 -4 -32 -12Z';
    const shag = hatch(-24, -30, 20, -31, 6, 6, 70, 9);
    const paws = dogLeg([[10, -10, 9], [26, -6, 8], [38, -3, 7]]);
    const tail = dogTail([[-30, -10, 9], [-26, 0, 10], [-4, 2, 9], [14, 0, 6]]);
    const h = place(dogHead({ mood: 'shut' }), `translate(22 -20) rotate(6) ${head}`);
    return merge({ lines: [body], fine: [shag, 'M-20 -6C-18 -16 -8 -20 0 -14'], washes: DOGFUR(body) }, paws, h, tail);
  }
  const body = 'M-30 -40C-30 -50 -14 -53 4 -51C18 -50 28 -48 30 -40C32 -30 22 -26 4 -26C-14 -26 -30 -30 -30 -40Z';
  const legs = (list) => list.map(dogLeg);
  const far = legs([
    [[15, -32, 8], [16, -16, 7], [15, -3, 6]],
    [[-21, -34, 11], [-25, -18, 7], [-23, -3, 6]],
  ]);
  const near = legs([
    [[22, -32, 8.5], [25, -16, 7], [26, -3, 6]],
    [[-16, -34, 12], [-14, -18, 7], [-14, -3, 6]],
  ]);
  const tail = dogTail([[-28, -44, 7], [-40, -52, 9], [-46, -64, 8], [-44, -76, 4]]);
  const h = place(dogHead({ mood }), `translate(30 -52) ${head}`);
  return merge(tail, ...far, { lines: [body], fine: [hatch(-22, -50, 20, -50, 6, 6, 75, 4)], washes: DOGFUR(body) }, ...near, h);
}

// ---------------------------------------------------------------------------------------------
// Wild Horse: a bay horse (ochre and terracotta) with a dark slate mane and tail, his head bent low
// in front of him. halter: the plaited halter over his head.
const HIDE = (d) => [wash(PAL.terracotta, 0.5, d), wash(PAL.ochre, 0.55, d)];
const hHead = 'M-10 -6C-6 -13 6 -13 14 -8L36 4C42 8 41 16 34 17L14 13C3 12 -10 8 -10 -6Z';
const hEar = 'M-6 -9L-8 -22L1 -11';
export function horseHead({ halter = false } = {}) {
  const part = {
    lines: [hHead, hEar],
    fine: ['M41 13q-4 2.5 -9 1.5', 'M-2 -2C4 4 12 8 22 9'],
    washes: [...HIDE(hHead), ...HIDE(closed(hEar))],
    fills: [dot(4, -4, 2.1), oval(35.5, 7, 1.6, 1.2)],
    glints: [dot(3.4, -4.6, 0.6)],
  };
  if (halter) {
    // nose band and the strap behind the ears, both plaited (little cross ticks)
    const nose = 'M22 -1C19 5 19 10 22 14';
    const crown = 'M-4 -11C-5 -2 -3 6 1 11';
    const cheek = 'M1 8L21 9M21 10C24 20 20 28 12 32';
    const ticks = hatch(22, -1, 21, 14, 5, 4, 30, 2) + hatch(-4, -11, 1, 11, 6, 4, -30, 3) + hatch(2, 8, 20, 9, 4, 3.5, 60, 5);
    part.lines.push(nose, crown, cheek);
    part.fine.push(ticks);
  }
  return part;
}
function horseLeg(pts) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const hoof = `M${f(x - 5)} ${f(y - 3)}L${f(x - 6)} ${f(y + 3)}L${f(x + 6)} ${f(y + 3)}L${f(x + 5)} ${f(y - 3)}Z`;
  return { lines: [d, hoof], washes: [...HIDE(closed(d)), wash(PAL.slate, 0.8, hoof)] };
}
export function horse({ halter = false } = {}) {
  const body = 'M-50 -100C-52 -112 -30 -117 0 -115C26 -115 44 -112 48 -100C52 -86 40 -76 10 -76C-20 -76 -48 -80 -50 -100Z';
  const neck = closed(limb([[24, -100, 34], [48, -100, 26], [66, -88, 20], [76, -76, 16]]));
  const mane = 'M22 -117C38 -124 58 -116 72 -98L78 -88C66 -102 50 -112 30 -112Z';
  const legs = (list) => list.map(horseLeg);
  const far = legs([
    [[30, -86, 14], [32, -50, 10.5], [34, -3, 9]],
    [[-32, -90, 18], [-30, -50, 10.5], [-28, -3, 9]],
  ]);
  const near = legs([
    [[38, -86, 15], [40, -50, 11], [41, -3, 9.5]],
    [[-40, -90, 20], [-38, -50, 11], [-40, -3, 9.5]],
  ]);
  const tailD = limb([[-48, -104, 8], [-60, -92, 11], [-62, -64, 9], [-58, -46, 4]]);
  const tail = { lines: [tailD], fine: ['M-56 -92C-60 -78 -60 -64 -58 -54M-52 -96C-55 -82 -56 -68 -54 -58'], washes: [wash(PAL.slate, 0.75, closed(tailD))] };
  const head = place(horseHead({ halter }), 'translate(76 -76) rotate(58) scale(1.12)');
  return merge(
    tail,
    ...far,
    {
      lines: [body, limb([[24, -100, 34], [48, -100, 26], [66, -88, 20], [76, -76, 16]])],
      fine: [mane, 'M-40 -90C-36 -84 -26 -80 -18 -80'],
      washes: [...HIDE(body), ...HIDE(neck), wash(PAL.slate, 0.8, mane)],
    },
    ...near,
    head,
  );
}

// ---------------------------------------------------------------------------------------------
// Wild Cow: a cream cow with soft terracotta patches, short curved horns and a pink udder, her
// broad face turned to us.
const cowBody = 'M-56 -96C-58 -106 -40 -110 0 -108C30 -108 50 -106 54 -96C58 -80 56 -62 48 -54C20 -50 -20 -50 -50 -54C-58 -64 -58 -82 -56 -96Z';
const cowPatches = 'M-40 -104C-30 -106 -20 -100 -22 -88C-24 -76 -38 -74 -44 -82C-50 -90 -48 -102 -40 -104ZM10 -100C20 -104 34 -100 32 -88C30 -78 16 -76 10 -84C6 -90 4 -98 10 -100Z';
export const COW_UDDER = [-26, -42];
export function cowHead() {
  const h = 'M-12 -12C-12 -20 12 -20 12 -12L10 10C10 16 -10 16 -10 10Z';
  const muzzle = oval(0, 13, 12, 7.5);
  const ears = 'M-12 -8L-25 -6C-25 -1 -18 0 -12 -2ZM12 -8L25 -6C25 -1 18 0 12 -2Z';
  const horns = 'M-9 -18C-16 -20 -20 -26 -17 -32C-15 -27 -10 -25 -6 -19M9 -18C16 -20 20 -26 17 -32C15 -27 10 -25 6 -19';
  return {
    lines: [h, muzzle, ears],
    fine: [horns, 'M-4 -18c2 -4 6 -4 7 -1', 'M-6 19q6 3 12 0'],
    washes: [wash(PAL.terracotta, 0.4, h), wash(PAL.ochre, 0.3, h), wash(PAL.rose, 0.75, muzzle), wash(PAL.terracotta, 0.4, ears), wash(PAL.grey, 0.5, horns + 'Z')],
    whites: ['M-6 -16C-2 -12 2 -12 6 -16L4 2C2 4 -2 4 -4 2Z'],
    fills: [dot(-6, -3, 2.1), dot(6, -3, 2.1), oval(-4.5, 12, 1.6, 2.2), oval(4.5, 12, 1.6, 2.2)],
    glints: [dot(-6.6, -3.6, 0.6), dot(5.4, -3.6, 0.6)],
  };
}
function cowLeg(pts) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const hoof = `M${f(x - 6)} ${f(y - 3)}L${f(x - 7)} ${f(y + 3)}L${f(x + 7)} ${f(y + 3)}L${f(x + 6)} ${f(y - 3)}Z`;
  return { lines: [d, hoof], washes: [wash(PAL.grey, 0.3, closed(d)), wash(PAL.slate, 0.75, hoof)] };
}
export function cow({ nearHind = true, tail = 'down' } = {}) {
  const udder = 'M-38 -53C-38 -42 -32 -38 -26 -38C-20 -38 -14 -42 -14 -53Z';
  const teats = 'M-33 -41l-1 6M-27 -39l0 6M-20 -41l1 6';
  // the tail hangs down (or is hidden: 'none')
  const tailPts = [[-54, -98, 5], [-62, -80, 4], [-64, -56, 3.5]];
  const tailD = limb(tailPts);
  const [tx, ty] = tailPts[2];
  const tuft = `M${tx} ${ty - 2}C${tx - 6} ${ty + 4} ${tx - 4} ${ty + 12} ${tx} ${ty + 16}C${tx + 4} ${ty + 12} ${tx + 6} ${ty + 4} ${tx} ${ty - 2}Z`;
  const legs = (list) => list.map(cowLeg);
  const far = legs([
    [[34, -60, 13], [36, -30, 10], [36, -3, 10]],
    [[-40, -60, 15], [-38, -30, 10], [-38, -3, 10]],
  ]);
  const near = legs([
    [[42, -60, 14], [44, -30, 11], [44, -3, 11]],
    [[-48, -60, 16], [-48, -30, 11], [-48, -3, 11]],
  ]).slice(0, nearHind ? 2 : 1);
  const neck = 'M40 -104C52 -108 62 -104 66 -96L62 -74C54 -70 46 -72 44 -78Z';
  return merge(
    tail === 'none' ? {} : { lines: [tailD, tuft], washes: [wash(PAL.grey, 0.4, closed(tailD)), wash(PAL.terracotta, 0.6, tuft)] },
    ...far,
    {
      lines: [cowBody, neck, udder],
      fine: [teats, 'M-30 -60C-20 -56 -6 -56 4 -60'],
      washes: [wash(PAL.grey, 0.25, cowBody + neck), wash(PAL.terracotta, 0.55, cowPatches), wash(PAL.ochre, 0.3, cowPatches), wash(PAL.rose, 0.75, udder)],
    },
    ...near,
    place(cowHead(), 'translate(70 -96) rotate(-6)'),
  );
}

// ---------------------------------------------------------------------------------------------
// The little Bat, hanging upside down by his feet from (0,0): slate wings folded round him, his
// round head at the bottom with ears pointing down, little bright eyes and a whispering mouth.
export function bat() {
  const body = 'M-8 6C-12 14 -11 26 -6 32L6 32C11 26 12 14 8 6C4 2 -4 2 -8 6Z';
  const wings = 'M-8 6C-16 12 -16 26 -8 34M8 6C16 12 16 26 8 34';
  const head = oval(0, 36, 8, 7);
  const ears = 'M-6 40L-9 49L-2 42ZM2 42L9 49L6 40Z';
  return {
    lines: [body, head, ears],
    fine: [wings, 'M-3 0l1 5M3 0l-1 5', 'M-6 14l4 4M6 14l-4 4M-6 22l4 4M6 22l-4 4'],
    washes: [wash(PAL.slate, 0.7, body + head + ears), wash(PAL.terracotta, 0.2, head), wash(PAL.rose, 0.6, 'M-5 41L-7 46L-3 42ZM3 42L7 46L5 41Z')],
    fills: [dot(-3, 37.5, 1.5), dot(3, 37.5, 1.5), oval(0, 32.5, 1.4, 1.1)],
    glints: [dot(-3.4, 37, 0.45), dot(2.6, 37, 0.45)],
  };
}

// ---------------------------------------------------------------------------------------------
// The Baby: sitting on his bottom (feet on y = 0, facing right), wrapped in a little ochre skin,
// one fat leg stretched out and one kicked up high, his arms waving, laughing with his eyes shut tight.
export function baby() {
  const head = oval(4, -48, 15, 14);
  const curl = 'M2 -62c-4 -5 3 -9 5 -4';
  const face = ['M-3 -50q2.5 -3.5 5 0M8 -50q2.5 -3.5 5 0'];
  const mouth = 'M1 -43Q5.5 -33 10 -43Q5.5 -41 1 -43Z';
  const wrap = 'M-14 -2C-20 -10 -18 -28 -8 -34C0 -38 12 -36 16 -28C20 -18 18 -6 12 -2C4 1 -8 1 -14 -2Z';
  const legs = [
    [[14, -6, 11], [24, -6, 10], [34, -6, 9]],
    [[13, -16, 11], [24, -26, 10], [34, -38, 9]],
  ].map((l) => {
    const d = limb(l);
    const [x, y] = l[l.length - 1];
    const [px, py] = l[l.length - 2];
    const u = [(x - px) / Math.hypot(x - px, y - py), (y - py) / Math.hypot(x - px, y - py)];
    // the sole faces forward along the leg, the toes peep up over the end of the foot
    const foot = oval(x + u[0] * 3, y + u[1] * 3 - 3, 5, 6.5);
    const tx = x + u[0] * 4;
    const ty = y + u[1] * 4 - 9;
    const toes = dot(tx - 3, ty + 1, 1.5) + dot(tx, ty, 1.5) + dot(tx + 3, ty + 1, 1.5);
    return { lines: [d], fine: [foot, toes], washes: [wash(SKIN, 0.5, closed(d)), wash(SKIN, 0.55, foot + toes)] };
  });
  const arm = (pts) => {
    const d = limb(pts);
    const [x, y] = pts[pts.length - 1];
    return { lines: [d], fine: [dot(x, y, 3.8)], washes: [wash(SKIN, 0.5, closed(d)), wash(SKIN, 0.5, dot(x, y, 3.8))] };
  };
  return merge(
    arm([[-8, -30, 7], [-16, -40, 6], [-20, -52, 5.5]]),
    { lines: [wrap], washes: [wash(PAL.ochre, 0.62, wrap), wash(PAL.terracotta, 0.5, spots([[-8, -22], [6, -12]]))] },
    ...legs,
    { lines: [head], fine: [curl, ...face], washes: [wash(SKIN, 0.45, head), wash(PAL.rose, 0.6, dot(-5, -44, 2.8) + dot(15, -44, 2.8))], fills: [mouth] },
    arm([[10, -30, 7], [20, -40, 6], [26, -52, 5.5]]),
  );
}

// ---------------------------------------------------------------------------------------------
// The Cave mouth: a hump of grey rock with an arched door (dark inside), the ground at y = 0 and
// the door's middle at x = 0. curtain: the curtain of skins hung on a pole across the door, drawn
// to the 'left' or 'right' side, or 'none'; narrow (0 to 1) bunches it up tighter against the side.
// dark: how dark the inside is (0 for no shade).
const caveOuter = 'M-130 0C-134 -70 -118 -150 -64 -186C-24 -210 40 -206 82 -176C120 -148 134 -76 132 0';
const caveDoor = 'M-70 0C-72 -70 -62 -132 0 -138C62 -132 72 -70 70 0';
export const CAVE_DOOR = caveDoor;
export function cave({ curtain = 'left', dark = 0.3, narrow = 1 } = {}) {
  const rock = `${caveOuter}Z${caveDoor}Z`;
  const cracks = 'M-104 -120l14 10l4 14M-120 -40l12 4M96 -150l-10 14l2 12M110 -60l12 -6M-30 -196l6 12M40 -192l-4 14';
  const part = {
    lines: [caveOuter, caveDoor],
    fine: [cracks, hatch(-124, -20, -90, -170, 7, 8, 200, 3), hatch(92, -170, 124, -20, 7, 8, -20, 5)],
    washes: [wash(PAL.grey, 0.6, rock, 'evenodd'), wash(PAL.slate, 0.2, rock, 'evenodd')],
  };
  if (dark) part.washes.push(wash(PAL.slate, dark, `${caveDoor}Z`));
  if (curtain !== 'none') {
    const pole = 'M-48 -126C-20 -130 20 -130 50 -124';
    const skins = 'M-44 -126L-6 -129C-12 -86 -20 -40 -24 0L-66 0C-66 -50 -58 -94 -44 -126Z';
    const seams = 'M-26 -128C-34 -84 -42 -40 -46 0M-56 -76l16 2M-50 -34l20 2';
    const stitches = hatch(-26, -128, -46, 0, 9, 4, 0, 7);
    part.lines.push(pole);
    const c0 = {
      lines: [skins],
      fine: [seams, stitches],
      washes: [wash(PAL.ochre, 0.7, skins), wash(PAL.terracotta, 0.3, skins), wash(PAL.terracotta, 0.7, 'M-20 -118l8 -2l-1 8l-8 1ZM-46 -60l6 0l0 7l-6 0ZM-36 -20l7 0l0 6l-7 0Z')],
    };
    const c = narrow === 1 ? c0 : place(c0, `translate(-64 0) scale(${narrow} 1) translate(64 0)`);
    const m = curtain === 'right' ? place(c, 'scale(-1 1)') : c;
    part.lines.push(...m.lines);
    part.fine.push(...m.fine);
    part.washes.push(...m.washes);
  }
  return part;
}

/** The inside of the Cave: a curved rock wall overhead (picture-wide), floor at y = 0. */
export function caveInside() {
  const wall = 'M-10 300C-6 160 40 46 200 34C360 46 406 160 410 300';
  const wallBand = `${wall}L430 300L430 -20L-30 -20L-30 300Z`;
  return {
    lines: [wall],
    fine: ['M30 120l14 8l2 14M362 110l-10 14l2 12M150 46l8 10M260 44l-6 12'],
    washes: [wash(PAL.grey, 0.5, wallBand), wash(PAL.slate, 0.18, wallBand)],
  };
}

// ---------------------------------------------------------------------------------------------
// The fire: a ring of stones, crossed sticks, and red and ochre flames; base centre at 0,0.
export function fire({ size = 1, glow = true } = {}) {
  const flames = 'M-16 -6C-22 -18 -12 -26 -10 -38C-5 -30 -3 -32 0 -48C4 -34 8 -36 11 -42C16 -30 22 -18 15 -6Z';
  const core = 'M-8 -6C-10 -14 -4 -19 -2 -27C0 -21 4 -21 6 -27C10 -17 10 -10 6 -6Z';
  const stones = oval(-24, -3, 7, 4.5) + oval(-10, 0, 7, 4) + oval(6, 0, 7, 4) + oval(22, -3, 7, 4.5);
  const sticks = 'M-20 -4L18 -12M-18 -12L20 -4';
  const sparks = 'M-14 -52l-2 -4M14 -54l2 -5M2 -62l0 -5';
  const washes = [];
  if (glow) washes.push(wash(PAL.ochre, 0.22, oval(0, -22, 52, 40)));
  washes.push(wash(PAL.red, 0.75, flames), wash(PAL.ochre, 0.95, core), wash(PAL.grey, 0.65, stones), wash(PAL.terracotta, 0.6, 'M-20 -4L18 -12L19 -8L-19 0ZM-18 -12L20 -4L19 0L-19 -8Z'));
  return place({ lines: [flames, stones], fine: [core, sticks, sparks], washes }, `scale(${size})`);
}

// ---------------------------------------------------------------------------------------------
// The milk pot: a round terracotta clay pot (base centre 0,0) full of frothing white milk. split:
// the pot cracked in two, its halves fallen apart to the right, and the milk spread in a puddle
// out to the left of them.
const potLeft = 'M-15 -30C-20 -20 -19 -6 -10 0L-1 0L2 -8L-2 -14L3 -22L0 -30Z';
const potRight = 'M0 -30L3 -22L-2 -14L2 -8L-1 0L10 0C19 -6 20 -20 15 -30Z';
const potRim = 'M-17 -30C-8 -33 8 -33 17 -30';
const froth = 'M-16 -30C-17 -37 -10 -41 -5 -38C-2 -44 7 -44 9 -39C14 -42 20 -37 17 -30C8 -28 -8 -28 -16 -30Z';
export function milkPot({ split = false } = {}) {
  const potBand = 'M-17 -22C-6 -19 6 -19 17 -22';
  if (!split) {
    const pot = 'M-15 -30C-20 -20 -19 -6 -10 0L10 0C19 -6 20 -20 15 -30Z';
    return {
      lines: [pot, potRim],
      fine: [potBand, froth, dot(-7, -34, 1.4), dot(4, -36, 1.6), dot(11, -33, 1.1)],
      washes: [wash(PAL.terracotta, 0.7, pot), wash(PAL.ochre, 0.3, pot), wash(PAL.sky, 0.18, froth)],
      whites: [froth],
    };
  }
  const L = place({ lines: [potLeft], fine: ['M-17 -22C-10 -20 -4 -19 0 -19'], washes: [wash(PAL.terracotta, 0.7, potLeft), wash(PAL.ochre, 0.3, potLeft)] }, 'translate(-4 0) rotate(-14 -10 0)');
  const R = place({ lines: [potRight], fine: ['M1 -19C5 -19 10 -20 17 -22'], washes: [wash(PAL.terracotta, 0.7, potRight), wash(PAL.ochre, 0.3, potRight)] }, 'translate(16 0) rotate(16 10 0)');
  const puddle = 'M-50 4C-54 -2 -34 -5 -16 -4C4 -3 26 -2 30 3C32 9 8 11 -16 11C-34 11 -48 9 -50 4Z';
  const crack = 'M-4 -40l-4 -6M16 -40l4 -6M6 -44l0 -7';
  return merge({ fine: [puddle], washes: [wash(PAL.sky, 0.22, puddle)], whites: [puddle] }, L, R, { fine: [crack] });
}

// ---------------------------------------------------------------------------------------------
// The roasted bone (centre 0,0, lying along x) and a stick with a roast of meat on it.
export function bone() {
  const d = 'M-16 -3C-20 -8 -26 -4 -22 0C-26 4 -20 8 -16 3L-2 3C2 6 8 7 10 3L16 3C20 8 26 4 22 0C26 -4 20 -8 16 -3L10 -3C8 -8 2 -8 -2 -4Z';
  const meat = 'M-4 -5C0 -9 8 -9 11 -4C13 0 10 6 4 6C-2 6 -6 0 -4 -5Z';
  return { lines: [d], fine: [meat], washes: [wash(PAL.paper, 1, d), wash(PAL.ochre, 0.35, d), wash(PAL.terracotta, 0.8, meat)] };
}
export function roast() {
  const stick = 'M-40 0L40 0';
  const meat = 'M-12 -2C-12 -12 12 -12 14 -2C16 8 -10 10 -12 -2Z';
  return {
    lines: [stick, meat],
    fine: ['M-6 -6c3 -2 8 -2 11 1M-4 2c4 2 8 1 12 -2', 'M-6 -16c-2 -3 2 -5 0 -8M4 -18c-2 -3 2 -5 0 -8'],
    washes: [wash(PAL.terracotta, 0.8, meat), wash(PAL.red, 0.3, meat), wash(PAL.ochre, 0.7, 'M-40 -1.5L40 -1.5L40 1.5L-40 1.5Z')],
  };
}

/** A soft "whisper" mark: three small arcs opening to the right, centred at (0,0). */
export const whisper = (s = 1) =>
  [6, 11, 16].map((r) => `M${f(r * 0.5 * s)} ${f(-r * 0.6 * s)}Q${f(r * s)} 0 ${f(r * 0.5 * s)} ${f(r * 0.6 * s)}`).join('');

export { spots };
