import { PAL } from '../lib.mjs';
import { PETER_HEAD, dot, f, limb, merge, oval, place, rabbitHead } from '../peter-rabbit/characters.mjs';

// The Tale of Benjamin Bunny: the characters shared by the five pictures, drawn once here and placed
// in each picture with a transform (place). Peter comes from The Tale of Peter Rabbit
// (../peter-rabbit/characters.mjs) so that he looks the same in both stories. The build only draws
// files named <n>.mjs, so this file is not a picture.

// Peter, in his blue jacket, needs two more poses than in his own story: standing, and walking with
// something held in his front paw. They have the same shape as his own poses, and peter() takes them as `pose`.
export const PETER_MORE_POSES = {
  stand: {
    torso: '',
    head: 'rotate(-6)',
    ears: -14,
    arms: [
      [[4, -12, 7], [16, -16, 6.5], [27, -24, 6]],
      [[-2, -12, 6.5], [-8, 0, 6], [-10, 10, 5.5]],
    ],
    legs: [
      [[4, 14, 12], [6, 28, 10], [8, 38, 8], [18, 40, 7]],
      [[-6, 14, 13], [-6, 28, 11], [-4, 38, 8], [6, 40, 7]],
    ],
  },
  carry: {
    torso: 'rotate(6)',
    head: 'rotate(-6)',
    ears: -26,
    arms: [
      [[4, -12, 7], [14, -4, 6.5], [22, -2, 6]],
      [[-2, -12, 6.5], [-10, -2, 6], [-14, 8, 5.5]],
    ],
    legs: [
      [[2, 14, 12], [10, 26, 10], [14, 36, 8], [24, 38, 7]],
      [[-6, 14, 13], [-14, 26, 11], [-20, 34, 8], [-12, 40, 7]],
    ],
  },
};

// ---------------------------------------------------------------------------------------------
// Rabbit bodies built like Peter's (torso centred at 0,0, head at PETER_HEAD, limbs as centrelines
// in the torso's own coordinates), so that Benjamin, his father, and Peter in his handkerchief all
// share Peter's proportions.
export const BEN_FUR = PAL.terracotta;

function furLimb(l, fur) {
  const d = limb(l);
  return { lines: [d], washes: [{ c: fur, o: 0.6, d: `${d}Z` }, { c: PAL.ochre, o: 0.22, d: `${d}Z` }] };
}

function arm(a, sleeve, fur) {
  const d = limb(a);
  const n = a.length;
  const [x, y] = a[n - 1];
  const [px, py] = a[n - 2];
  const paw = dot(x + (x - px) * 0.25, y + (y - py) * 0.25, 3.6);
  return {
    lines: [d],
    fine: [paw],
    washes: [
      { c: sleeve, o: sleeve === fur ? 0.6 : 0.8, d: `${d}Z` },
      { c: fur, o: 0.6, d: paw },
    ],
  };
}

/** A rabbit from a pose, a torso part and a head part (head centred at 0,0, facing right). */
function rabbit({ pose, torso, head, sleeve, fur }) {
  const legs = pose.legs.map((l) => furLimb(l, fur));
  const arms = (pose.arms ?? []).map((a) => arm(a, sleeve, fur));
  const h = place(head, `translate(${PETER_HEAD[0]} ${PETER_HEAD[1]}) ${pose.head}`);
  const inner = merge(...legs.slice(1), legs[0], torso, ...arms.slice(1), h, ...arms.slice(0, 1));
  return pose.torso ? place(inner, pose.torso) : inner;
}

// ---------------------------------------------------------------------------------------------
// The tam-o'-shanter: Mr McGregor's big floppy Scottish bonnet, in head coordinates (the rabbit's
// head centred at 0,0, facing right). It is far too big, so it comes right down to Benjamin's eyes
// and squashes his ears, which flop out underneath at the back.
const tamBand = 'M-16 -6C-6 -9.5 8 -11 17.5 -8.5L17 -13C8 -15.5 -6 -14 -16 -10.5Z';
const tamCrown = 'M-16 -10.5C-32 -11 -42 -19 -35 -28C-26 -39 8 -41 24 -32C33 -27 30 -16 17 -13';
const tamCheck = 'M-30 -18C-12 -24 8 -26 26 -22M-34 -26C-16 -31 6 -33 20 -31M-20 -34L-12 -14M-2 -38L2 -15M14 -36L12 -14';
const tamPom = dot(-4, -41, 6);
// what shows of the head below the band, and the two flopped ears
const headLow = 'M16.5 -9C18.5 -7 20 -5 20 -3C22 2 19 7 13 9C6 12 -9 13 -15 2C-15.6 -1.5 -15.4 -4.5 -14.6 -7';
const headLowWash = `${headLow}C-4 -10 8 -11 16.5 -9Z`;
/** Benjamin's head and tam as one outline (without the ears), to keep a shadow off his face. */
export const TAM_HEAD_SHAPE = `${headLow}${tamCrown.replace('M', 'L')}Z`;
/** The outline of a rabbit's head as rabbitHead draws it (Peter's, without the ears). */
export const HEAD_SHAPE = 'M-15 2C-16 -9 -8 -16 2 -16C11 -16 17 -10 20 -3C22 2 19 7 13 9C6 12 -9 13 -15 2Z';
const floppy = [
  [[-14, -8, 7], [-22, -4, 8.5], [-28, 4, 7.5], [-30, 12, 4]],
  [[-13, -10, 7], [-24, -9, 8.5], [-33, -5, 7.5], [-38, 0, 4]],
];
const floppyIn = [
  [[-19, -6, 2.5], [-25, 0, 4], [-28, 7, 3], [-29, 10, 1.5]],
  [[-20, -9, 2.5], [-27, -8, 4], [-33, -4, 3], [-36, -1, 1.5]],
];

/** Benjamin's head. With the tam, the face is Peter's (rabbitHead) without its ears and top. */
export function benjaminHead({ mood = 'happy', tam = false, ears = -12, earSpread = 14 } = {}) {
  const head = rabbitHead({ mood, ears, earSpread, fur: BEN_FUR });
  if (!tam) return head;
  // rabbitHead lists its two ears first (one line, three washes each), then the head outline and its
  // fur (two washes); keep only the face
  const face = { ...head, lines: [], washes: head.washes.slice(8) };
  const earPart = merge(
    ...floppy.map((l, i) => {
      const d = limb(l);
      const inner = limb(floppyIn[i]);
      return {
        lines: [d],
        washes: [
          { c: BEN_FUR, o: 0.6, d: `${d}Z` },
          { c: PAL.ochre, o: 0.22, d: `${d}Z` },
          { c: PAL.rose, o: 0.6, d: `${inner}Z` },
        ],
      };
    }),
  );
  const bonnet = {
    lines: [tamCrown, tamBand, tamPom],
    fine: [tamCheck],
    washes: [
      { c: BEN_FUR, o: 0.6, d: headLowWash },
      { c: PAL.ochre, o: 0.25, d: headLowWash },
      { c: PAL.slate, o: 0.85, d: `${tamCrown}Z` },
      { c: PAL.sky, o: 0.3, d: `${tamCrown}Z` },
      { c: PAL.red, o: 0.85, d: tamBand + tamPom },
    ],
  };
  return merge(earPart, { lines: [headLow] }, face, bonnet);
}

// Benjamin's little green coat: no buttons, a collar and a patch pocket; a white tail behind.
const bCoat = 'M-9 -19C-16 -13 -18 2 -16 16C-6 20 6 20 14 16C17 4 15 -9 9 -19C4 -22 -4 -22 -9 -19Z';
const bCollar = 'M-9 -19C-5 -12 3 -12 9 -19M-9 -19L-6 -10M9 -19L6 -10';
const bPocket = 'M2 4L11 4L10 11L3 11Z';
const tail = dot(-19, 17, 5.5);
const COAT = PAL.green;
function coatTorso(shape, collar, pocket, coat) {
  return {
    lines: [shape, tail],
    fine: [collar, pocket],
    washes: [
      { c: coat, o: 0.85, d: shape },
      { c: PAL.slate, o: 0.15, d: shape },
    ],
  };
}

export const BEN_POSES = {
  // standing, one paw pushing up the brim of the big tam
  stand: {
    torso: '',
    head: 'rotate(-4)',
    arms: [
      [[6, -14, 7], [18, -22, 6.5], [22, -34, 6]],
      [[-4, -12, 6.5], [-10, 0, 6], [-12, 10, 5.5]],
    ],
    legs: [
      [[4, 14, 12], [6, 28, 10], [8, 38, 8], [18, 40, 7]],
      [[-6, 14, 13], [-6, 28, 11], [-4, 38, 8], [6, 40, 7]],
    ],
  },
  // a big bouncing hop, ears flying
  hop: {
    torso: 'rotate(42)',
    head: 'rotate(-34)',
    ears: -62,
    arms: [
      [[4, -12, 7], [14, -10, 6.5], [24, -16, 6]],
      [[0, -10, 6.5], [10, -2, 6], [20, -2, 5.5]],
    ],
    legs: [
      [[-8, 14, 13], [-12, 28, 11], [-10, 40, 8], [-8, 50, 7]],
      [[2, 14, 11], [4, 26, 9], [12, 34, 7], [18, 40, 6]],
    ],
  },
  // climbing down a tree trunk on his right: paws gripping above, a foot reaching down
  climb: {
    torso: 'rotate(-4)',
    head: 'rotate(18)',
    ears: -20,
    arms: [
      [[4, -14, 7], [14, -22, 6.5], [18, -34, 6]],
      [[4, -6, 6.5], [14, -4, 6], [20, -8, 5.5]],
    ],
    legs: [
      [[2, 12, 12], [12, 20, 10], [18, 14, 8], [20, 8, 7]],
      [[-4, 14, 12], [-2, 28, 10], [4, 40, 8], [10, 48, 7]],
    ],
  },
  // walking along behind his father
  walk: {
    torso: 'rotate(6)',
    head: 'rotate(-4)',
    arms: [
      [[4, -12, 7], [12, -2, 6.5], [20, 4, 6]],
      [[-2, -12, 6.5], [-10, -2, 6], [-16, 6, 5.5]],
    ],
    legs: [
      [[2, 14, 12], [10, 26, 10], [14, 36, 8], [24, 38, 7]],
      [[-6, 14, 13], [-14, 26, 11], [-20, 34, 8], [-12, 40, 7]],
    ],
  },
};

/** Benjamin Bunny (facing right): a brown rabbit in a little green coat (and, once he has found it, the big tam). */
export function benjamin({ pose = 'stand', mood = 'happy', tam = false, ears } = {}) {
  const P = BEN_POSES[pose];
  return rabbit({
    pose: P,
    torso: coatTorso(bCoat, bCollar, bPocket, COAT),
    head: benjaminHead({ mood, tam, ears: ears ?? P.ears ?? -12 }),
    sleeve: COAT,
    fur: BEN_FUR,
  });
}

// ---------------------------------------------------------------------------------------------
// Peter without his jacket, wrapped up in a red cotton handkerchief with white spots, knotted under
// his chin (facing right, same proportions as in ../peter-rabbit).
const hCloth = 'M-11 -19C-21 -10 -23 6 -19 19C-7 24 8 24 17 19C21 6 19 -9 11 -19C5 -23 -5 -23 -11 -19Z';
const hKnot = 'M2 -21C4 -24 9 -24 10 -20C9 -17 4 -17 2 -21Z';
const hTips = 'M10 -21L18 -28L15 -17ZM2 -21L-5 -28L-1 -18Z';
const hFolds = 'M-14 -4C-6 0 4 0 12 -6M-13 10C-4 13 6 12 14 8';
const SPOTS = [
  [-12, -8],
  [-4, -12],
  [-14, 3],
  [-6, 4],
  [2, 14],
  [-10, 15],
  [10, 12],
  [12, -2],
  [3, -6],
];
const spots = (r) => SPOTS.map(([x, y]) => dot(x, y, r)).join('');
export function hankyTorso() {
  return {
    lines: [hCloth],
    fine: [hKnot, hTips, hFolds],
    washes: [
      { c: PAL.red, o: 0.8, d: hCloth + hKnot + hTips },
      { c: PAL.rose, o: 0.3, d: hCloth },
    ],
    whites: [spots(1.9)],
  };
}

export const HANKY_POSES = {
  // sitting all alone and sorry for himself, a paw clutching the cloth, a foot poking out
  sit: {
    torso: '',
    head: 'rotate(16)',
    ears: -56,
    arms: [[[10, -10, 5], [14, -6, 4.5]]],
    legs: [[[-6, 16, 13], [2, 24, 11], [14, 26, 8], [24, 26, 7]]],
  },
  // tumbling head over heels: back legs kicking, front paws flung out
  tumble: {
    torso: '',
    head: 'rotate(-10)',
    ears: -40,
    arms: [
      [[8, -14, 6.5], [18, -18, 6], [26, -26, 5.5]],
      [[-6, -14, 6.5], [-16, -18, 6], [-24, -24, 5.5]],
    ],
    legs: [
      [[4, 16, 12], [12, 28, 10], [10, 40, 8], [16, 48, 7]],
      [[-6, 16, 12], [-12, 28, 10], [-20, 36, 8], [-22, 46, 7]],
    ],
  },
};

/** Peter in the red handkerchief (facing right). */
export function peterHanky({ pose = 'sit', mood = 'cry', ears } = {}) {
  const P = HANKY_POSES[pose];
  return rabbit({
    pose: P,
    torso: hankyTorso(),
    head: rabbitHead({ mood, ears: ears ?? P.ears, earSpread: 16 }),
    sleeve: PAL.grey,
    fur: PAL.grey,
  });
}

// ---------------------------------------------------------------------------------------------
// Old Mr Benjamin Bunny, Benjamin's father (facing right): built like the little rabbits but placed
// bigger, with blue-grey fur, a stern brow, a long brown tweed coat, and a stout stick.
export const OLD_FUR = PAL.slate;
const oCoat = 'M-10 -20C-18 -12 -21 6 -22 26C-8 30 8 30 18 26C19 6 17 -10 10 -20C4 -23 -4 -23 -10 -20Z';
const oCollar = 'M-10 -20C-6 -12 4 -12 10 -20M-10 -20L-7 -8M10 -20L7 -8';
const oButtons = [dot(13, -6, 2), dot(14, 4, 2), dot(14, 14, 2)].join('');
const oTail = dot(-23, 20, 5.5);
const STICK = 'M30 -14L40 46';
export const OLD_POSES = {
  march: {
    torso: 'rotate(4)',
    head: 'rotate(-10)',
    ears: -10,
    arms: [
      [[4, -12, 7], [16, -6, 6.5], [28, -12, 6]],
      [[-2, -12, 6.5], [-12, -2, 6], [-18, 8, 5.5]],
    ],
    legs: [
      [[2, 22, 12], [12, 32, 10], [18, 40, 8], [28, 42, 7]],
      [[-8, 22, 13], [-14, 32, 11], [-20, 40, 8], [-10, 44, 7]],
    ],
  },
};
export function oldBunny({ pose = 'march' } = {}) {
  const P = OLD_POSES[pose];
  const head = rabbitHead({ mood: 'happy', ears: P.ears, earSpread: 12, fur: OLD_FUR });
  head.washes.push({ c: PAL.terracotta, o: 0.3, d: HEAD_SHAPE });
  head.lines.push('M1 -13L12 -9'); // a stern brow
  head.fine.push('M-6 6c-2 2 -6 3 -9 2M-4 9c-2 2 -5 3 -8 3'); // grizzled cheek fur
  const torso = {
    lines: [oCoat, oTail],
    fine: [oCollar, oButtons, 'M-16 14l4 0M-17 18l4 0'],
    washes: [
      { c: PAL.ochre, o: 0.8, d: oCoat },
      { c: PAL.terracotta, o: 0.5, d: oCoat },
      { c: PAL.slate, o: 0.9, d: oButtons },
    ],
  };
  const stick = { lines: [STICK], washes: [{ c: PAL.terracotta, o: 0.8, d: 'M28.5 -14L31.5 -14L41.5 46L38.5 46Z' }] };
  const body = rabbit({ pose: { ...P, torso: '' }, torso, head, sleeve: PAL.terracotta, fur: OLD_FUR });
  return place(merge(stick, body), P.torso);
}

// ---------------------------------------------------------------------------------------------
// An onion (root at 0,0, leaves up), and the onion bundle: the red spotted handkerchief tied up in a
// knot at the top (0,0), full of onions, with green onion tops poking out.
const oBulb = 'M0 0C-9 -1 -11 -11 -5 -17C-3 -19 -1 -22 0 -25C1 -22 3 -19 5 -17C11 -11 9 -1 0 0Z';
export function onion() {
  const leaves = [limb([[0, -24, 3], [-3, -34, 3], [-9, -44, 2]]), limb([[0, -24, 3], [2, -38, 3], [4, -48, 2]]), limb([[0, -24, 3], [5, -32, 3], [12, -38, 2]])];
  return {
    lines: [oBulb],
    fine: [...leaves, 'M-2 0l-2 3.5M0 0l0 4M2 0l2 3.5', 'M-3 -14C-4 -8 -3 -3 -1 -1M3 -14C4 -8 3 -3 1 -1'],
    washes: [
      { c: PAL.ochre, o: 0.7, d: oBulb },
      { c: PAL.terracotta, o: 0.35, d: oBulb },
      { c: PAL.green, o: 0.85, d: leaves.map((d) => `${d}Z`).join('') },
    ],
  };
}
const bBag = 'M-4 2C-18 4 -26 18 -24 32C-22 44 -10 50 2 50C16 50 26 42 26 30C26 16 16 4 4 2';
const bKnot = 'M-5 2C-6 -3 5 -3 5 2C4 6 -4 6 -5 2Z';
const bEars = 'M-5 1L-14 -6L-8 4ZM5 1L13 -7L8 4Z';
const BSPOTS = [
  [-14, 20],
  [-6, 34],
  [8, 22],
  [14, 38],
  [-16, 38],
  [2, 12],
];
export function bundle() {
  const tops = [limb([[-2, -2, 3], [-6, -14, 3], [-12, -24, 2]]), limb([[0, -2, 3], [2, -18, 3], [4, -28, 2]]), limb([[2, -2, 3], [8, -12, 3], [16, -18, 2]])];
  const d = `${bBag}C2 4 -2 4 -4 2Z`;
  return {
    lines: [d],
    fine: [bKnot, bEars, ...tops, 'M-16 26C-6 30 8 30 18 24'],
    washes: [
      { c: PAL.red, o: 0.8, d: d + bKnot + bEars },
      { c: PAL.green, o: 0.85, d: tops.map((t) => `${t}Z`).join('') },
    ],
    whites: [BSPOTS.map(([x, y]) => dot(x, y, 2)).join('')],
  };
}

// ---------------------------------------------------------------------------------------------
// The big cat (sitting, base centre 0,0, about 130 tall), a plump ginger tabby with long whiskers and
// round green eyes, her tail curled round her front paws: big, but sleepy-looking and kind.
const cBody = 'M-42 0C-52 -26 -46 -62 -24 -80C-10 -88 12 -88 26 -80C48 -62 54 -26 42 0C16 4 -16 4 -42 0Z';
const cHead = 'M-30 -96C-32 -112 -24 -124 -10 -128L-22 -150L0 -134C6 -135 12 -135 16 -134L34 -150L28 -126C38 -118 40 -104 34 -94C26 -80 -20 -80 -30 -96Z';
const cEarIn = 'M-18 -130L-21 -144L-8 -133ZM22 -131L30 -144L27 -128Z';
const cMuzzle = oval(3, -96, 10, 7);
const cNose = 'M0 -101L6 -101L3 -97Z';
const cMouth = 'M3 -97q0 4 -5 5M3 -97q0 4 5 5';
const cWhiskers = 'M-8 -96l-30 -6M-8 -93l-32 2M-7 -90l-26 8M14 -96l30 -6M14 -93l32 2M13 -90l26 8';
const cPaws = 'M-22 0C-24 -9 -12 -11 -8 -2M8 -2C10 -11 22 -9 20 0M-16 -4l0 3M14 -4l0 3';
const cTail = 'M30 -4C50 -2 56 8 44 12C20 16 -20 14 -38 8';
const cStripes = 'M-6 -126l2 8M4 -128l0 9M14 -127l-2 8M-38 -50c8 2 12 6 14 12M-42 -30c8 2 12 6 13 12M40 -50c-8 2 -12 6 -14 12M44 -30c-8 2 -12 6 -13 12M-30 -110l8 3M36 -110l-8 3';
const cChest = 'M-10 -84C-12 -70 -8 -60 2 -56C12 -60 16 -70 14 -84';
export function cat() {
  const eyes = oval(-9, -110, 6, 5.2) + oval(15, -110, 6, 5.2);
  return {
    lines: [cTail, cBody, cHead],
    fine: [cEarIn, cMuzzle, cNose, cMouth, cWhiskers, cPaws, cStripes, cChest, eyes, 'M-15 -114q6 -3 12 0M9 -114q6 -3 12 0'],
    washes: [
      { c: PAL.ochre, o: 0.85, d: cBody + cHead },
      { c: PAL.ochre, o: 0.85, d: `${cTail}C-20 6 20 8 30 2Z` },
      { c: PAL.terracotta, o: 0.3, d: cBody + cHead },
      { c: PAL.rose, o: 0.7, d: cEarIn + cNose },
      { c: PAL.green, o: 0.95, d: eyes },
    ],
    whites: [cChest + 'C8 -86 -4 -86 -10 -84Z', cMuzzle],
    fills: [dot(-8, -109.5, 2.6), dot(16, -109.5, 2.6)],
    glints: [dot(-8.8, -110.5, 0.8), dot(15.2, -110.5, 0.8)],
  };
}

// ---------------------------------------------------------------------------------------------
// The big wicker basket, turned upside down (rim on the ground, base centre 0,0, about 220 wide and
// 100 tall), a rounded dome woven in bands, with a broken hole low in its front through which the
// rabbits peep. basketHole is that hole as path data, so a picture can shade it.
const BW = 110;
const BH = 96;
const halfW = (y) => BW * Math.sqrt(1 - (y / (BH + 34)) ** 2);
const HOLE = { cx: -2, rx: 66, ry: 70 };
const inHole = (x, y) => ((x - HOLE.cx) / HOLE.rx) ** 2 + (y / HOLE.ry) ** 2 < 1;
export const basketHole = (() => {
  let d = '';
  for (let i = 0; i <= 24; i++) {
    const a = Math.PI + (Math.PI * i) / 24;
    const w = i % 2 ? 0.94 : 1.02; // ragged, broken edge
    d += `${i ? 'L' : 'M'}${f(HOLE.cx + Math.cos(a) * HOLE.rx * w)} ${f(Math.sin(a) * HOLE.ry * w)}`;
  }
  return `${d}Z`;
})();
/** A polyline sampled along fn(t) for t in 0…1, broken wherever it enters the hole. */
function outside(fn, n = 30) {
  let d = '';
  let pen = false;
  for (let i = 0; i <= n; i++) {
    const [x, y] = fn(i / n);
    if (inHole(x, y)) {
      pen = false;
      continue;
    }
    d += `${pen ? 'L' : 'M'}${f(x)} ${f(y)}`;
    pen = true;
  }
  return d;
}
const SIDE = Array.from({ length: 13 }, (_, i) => (-BH * i) / 12);
/** One side of the dome (k = -1 left, 1 right), from the ground up, or from the top down. */
const side = (k, down = false) =>
  (down ? [...SIDE].reverse() : SIDE).map((y, i) => `${i ? 'L' : 'M'}${f(k * halfW(y))} ${f(y)}`).join('');
// a row of the weave round the dome at height y (bowing down a little in the middle, as seen from in
// front)
const row = (y) => (t) => [-halfW(y) + 2 * halfW(y) * t, y + Math.sin(Math.PI * t) * 5 * (1 + y / BH)];
export function basket() {
  const tw = halfW(-BH);
  const top = `M${f(-tw)} ${-BH}C${f(-tw * 0.6)} ${-BH - 12} ${f(tw * 0.6)} ${-BH - 12} ${f(tw)} ${-BH}`;
  const shape = `${side(-1)}C${f(-tw * 0.6)} ${-BH - 12} ${f(tw * 0.6)} ${-BH - 12} ${f(tw)} ${-BH}${side(1, true).replace('M', 'L')}`;
  const ROWS = [-12, -34, -56, -76];
  const rows = ROWS.map((y) => outside(row(y), 40)).join('');
  // the weave: in each band, strands slanting one way, then the other
  const bands = [0, ...ROWS, -BH];
  let weave = '';
  for (let b = 0; b < bands.length - 1; b++) {
    const [y0, y1] = [bands[b], bands[b + 1]];
    const n = Math.round((halfW(y0) * 2) / 13);
    const lean = b % 2 ? 6 : -6;
    for (let k = 1; k < n; k++) {
      const t = k / n;
      const [xa, ya] = row(y0 - 2)(t);
      const [xb, yb] = row(y1 + 2)(t);
      weave += outside((s) => [xa + (xb - xa) * s + lean * (s - 0.5), ya + (yb - ya) * s], 4);
    }
  }
  const brokenEnds = 'M-54 -30l-9 -4M-46 -46l-6 -8M28 -46l6 -8M46 -26l9 -3M-28 -54l-2 -8M10 -56l2 -8';
  return {
    lines: [side(-1), side(1), top, rows],
    fine: [weave, brokenEnds, basketHole],
    washes: [
      { c: PAL.ochre, o: 0.75, d: `${shape}Z${basketHole}`, rule: 'evenodd' },
      { c: PAL.terracotta, o: 0.2, d: `${shape}Z${basketHole}`, rule: 'evenodd' },
    ],
  };
}
