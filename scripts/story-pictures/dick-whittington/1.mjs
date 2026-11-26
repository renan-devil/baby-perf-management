import { PAL, tufts } from '../lib.mjs';
import { at, compose, dot, f, limb, merge, oval, place } from '../stone-soup/characters.mjs';

// Dick Whittington and His Cat, 1 (cover): Dick sits on a milestone on a green hill, his bundle on a
// stick over his shoulder and his stripy cat beside him; far away, the little rooftops and church
// spires of London.
//
// This file also draws, once, the characters and things the other nine pictures reuse (each one
// placed with a transform): Dick (a boy and, grown up, the Lord Mayor), his stripy cat (sitting,
// pouncing, held), the rats and mice, the girl, Mr Fitzwarren, the captain, the King, the
// milestone, the bundle and London far away. Standing characters have their feet at y = 0 and look
// at us; flip with scale(-1 1).

export { at, compose, dot, f, limb, merge, oval, place };

const Z = (d) => `${d}Z`;

/** An arm (limb along pts) ending in a round hand of colour hc. */
export function arm(pts, c, o, r = 4.2, hc = PAL.rose, ho = 0.6) {
  const d = limb(pts);
  const [x, y, w] = pts[pts.length - 1];
  const [px, py] = pts[pts.length - 2];
  const l = Math.hypot(x - px, y - py);
  const h = dot(f(x + ((x - px) / l) * w * 0.45), f(y + ((y - py) / l) * w * 0.45), r);
  return { lines: [d], fine: [h], washes: [{ c, o, d: Z(d) }, { c: hc, o: ho, d: h }] };
}

/** Mirrors an arm's centreline to the other side. */
export const mirror = (pts) => pts.map(([x, y, w]) => [-x, y, w]);

/**
 * Eyes, brows and mouth of the people: eyes at (±ex, ey), mouth at my. mood: happy, smile (eyes
 * shut in a smile), sad, puzzled, sleep, listen (looking up, a little "o"), wow, laugh.
 * look: [dx, dy] moves the pupils.
 */
export function faceMarks({ mood, ex, ey, my, r = 1.8, w = 4.2, look = [0, 0] }) {
  const fine = [];
  const fills = [];
  const glints = [];
  const washes = [];
  const shutUp = `M${-ex - 3} ${ey}q3 -3.4 6 0M${ex - 3} ${ey}q3 -3.4 6 0`;
  const shutDown = `M${-ex - 3} ${ey}q3 3 6 0M${ex - 3} ${ey}q3 3 6 0`;
  const open = (rr = r) => {
    const [dx, dy] = look;
    fills.push(dot(-ex + dx, ey + dy, rr), dot(ex + dx, ey + dy, rr));
    glints.push(dot(-ex + dx - 0.5, ey + dy - 0.6, 0.55), dot(ex + dx - 0.5, ey + dy - 0.6, 0.55));
  };
  if (mood === 'laugh') {
    const mouth = `M${-w - 1} ${my - 1}C${-w} ${my + 8} ${w} ${my + 8} ${w + 1} ${my - 1}C${w / 2} ${my} ${-w / 2} ${my} ${-w - 1} ${my - 1}Z`;
    fine.push(shutUp, mouth);
    washes.push({ c: PAL.red, o: 0.75, d: mouth });
  } else if (mood === 'smile') {
    fine.push(shutUp, `M${-w} ${my}q${w} 5 ${2 * w} 0`);
  } else if (mood === 'sleep') {
    fine.push(shutDown, `M-2 ${my + 1}q2 1.6 4 0`);
  } else if (mood === 'sad') {
    open();
    fine.push(`M${-ex - 3.5} ${ey - 4}L${-ex + 2.5} ${ey - 6.5}M${ex + 3.5} ${ey - 4}L${ex - 2.5} ${ey - 6.5}`, `M${-w + 1} ${my + 2.5}q${w - 1} -4 ${2 * w - 2} 0`);
  } else if (mood === 'puzzled') {
    open();
    fine.push(`M${-ex - 3} ${ey - 5}q3 -3.5 6 -1M${ex - 3} ${ey - 5}l6 0.5`, `M-3.5 ${my + 1}q1.7 -2 3.5 0q1.7 2 3.5 0`);
  } else if (mood === 'listen' || mood === 'wow') {
    open(mood === 'wow' ? r + 0.5 : r);
    fine.push(`M${-ex - 3} ${ey - 5}q3 -2.4 6 0M${ex - 3} ${ey - 5}q3 -2.4 6 0`);
    fills.push(oval(0, my + 1.5, mood === 'wow' ? 2.6 : 1.8, mood === 'wow' ? 3.2 : 2.2));
  } else {
    open();
    fine.push(`M${-w} ${my}q${w} 5 ${2 * w} 0`);
  }
  return { fine, fills, glints, washes };
}

// =============================================================================================
// DICK, a poor boy of about ten: tousled ochre-brown hair, a patched terracotta coat, ragged grey
// breeches and bare feet. His upper body (dickUpper) is drawn with the hem of his coat at (0,0):
// shoulders at (±17,-40), head centre at (0,-60). dick() stands him up (feet at 0,0, about 120
// tall) or sits him down (pose 'sit': the seat at 0,0, his feet hanging to y = 36).
// =============================================================================================
export const D_ARMS = {
  down: [
    [[-17, -40, 8], [-22, -28, 7.5], [-25, -16, 7.5], [-26, -9, 7.5]],
    [[17, -40, 8], [22, -28, 7.5], [25, -16, 7.5], [26, -9, 7.5]],
  ],
  // the right hand up by the shoulder, holding the bundle's stick
  stick: [[17, -40, 8], [27, -30, 7.5], [30, -40, 7.5]],
  // the left hand resting on the knee (sitting)
  knee: [[-17, -40, 8], [-22, -26, 7.5], [-18, -12, 7.5], [-13, -4, 7.5]],
};

const dickHair = 'M-14 -1C-19 -6 -18 -12 -14 -15L-19 -20L-10 -20C-10 -26 -4 -27 -1 -24L2 -31L6 -23C11 -25 16 -22 14 -16L20 -15L15 -10C17 -7 16 -4 14 -1L11 -7L8 -4L6 -9L2 -5L-1 -9L-4 -5L-7 -9L-10 -5Z';
// under a hat only the fringe and the side tufts show
const dickHairUnderHat = 'M-14 -1C-19 -6 -18 -12 -14 -14L14 -14C17 -12 18 -6 14 -1L11 -7L8 -4L6 -9L2 -5L-1 -9L-4 -5L-7 -9L-10 -5Z';
export function dickHead({ mood = 'happy', look = [0, 0], hat = false } = {}) {
  const hair = hat ? dickHairUnderHat : dickHair;
  const face = 'M-12.5 -3C-13 8 -7 14 0 14C7 14 13 8 12.5 -3C12 -10 7 -15 0 -15C-7 -15 -12 -10 -12.5 -3Z';
  const m = faceMarks({ mood, ex: 4.8, ey: 0, my: 7, w: 4, look });
  return {
    lines: [face, hair],
    fine: ['M-12.5 0q-4 1 -2 6M12.5 0q4 1 2 6', 'M0.5 1.5c1.6 1.2 1.6 2.6 -0.6 3', ...(hat ? [] : ['M-8 -15q2 -3 5 -3M1 -17q3 -2 5 0']), ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.32, d: face },
      { c: PAL.ochre, o: 0.9, d: hair },
      { c: PAL.terracotta, o: 0.45, d: hair },
      { c: PAL.rose, o: 0.6, d: dot(-8.5, 5, 2.5) + dot(8.5, 5, 2.5) },
      ...m.washes,
    ],
    fills: m.fills,
    glints: m.glints,
  };
}

const coat = 'M-9 -46C-18 -45 -21 -38 -21 -28C-21 -18 -23 -8 -24 0L-20 3L-16 0L-11 3L-6 1C2 2 10 2 24 0C23 -8 21 -18 21 -28C21 -38 18 -45 9 -46';
const coatFill = `${coat}C4 -43 -4 -43 -9 -46Z`;
const coatPatches = 'M-17 -26L-9 -27L-8 -18L-16 -17ZM8 -12L16 -13L16 -5L8 -4Z';
export function dickUpper({ mood = 'happy', tilt = 0, arms = D_ARMS.down, look = [0, 0], lean = 0 } = {}) {
  const sleeves = arms.map((a) => arm(a, PAL.terracotta, 0.75, 4.2));
  const up = merge(
    {
      lines: [coat],
      fine: ['M-9 -46L0 -37L9 -46', 'M0 -37L1 1', coatPatches, 'M-14 -22l3 3M12 -9l2 2'],
      washes: [
        { c: PAL.terracotta, o: 0.8, d: coatFill },
        { c: PAL.ochre, o: 0.9, d: 'M-17 -26L-9 -27L-8 -18L-16 -17Z' },
        { c: PAL.grey, o: 0.8, d: 'M8 -12L16 -13L16 -5L8 -4Z' },
      ],
      fills: [dot(3, -28, 1.3), dot(3, -18, 1.3)],
    },
    ...sleeves,
    place(dickHead({ mood, look }), `translate(0 -60) rotate(${tilt})`),
  );
  return lean ? place(up, `rotate(${lean})`) : up;
}

const bareFoot = (x, s) => {
  const d = `M${x - 6 * s} -6C${x - 9 * s} -4 ${x - 10 * s} 0 ${x - 6 * s} 0.5L${x + 5 * s} 0.5C${x + 8 * s} 0.5 ${x + 8 * s} -3 ${x + 5 * s} -5`;
  return {
    lines: [d],
    fine: [`M${x - 8 * s} -1l0 1.6M${x - 5 * s} -0.4l0 1.4`],
    washes: [{ c: PAL.rose, o: 0.55, d: Z(d) }],
  };
};

/** Dick. pose 'stand' (feet at 0,0) or 'sit' (seat at 0,0). feet: false leaves his feet out (stuck in mud). */
export function dick({ pose = 'stand', mood = 'happy', tilt = 0, arms = D_ARMS.down, look = [0, 0], lean = 0, feet = true } = {}) {
  const upper = dickUpper({ mood, tilt, arms, look, lean });
  if (pose === 'sit') {
    const breeches = 'M-20 -2C-22 4 -20 10 -14 10C-10 10 -6 8 -4 4L4 4C6 8 10 10 14 10C20 10 22 4 20 -2Z';
    const shins = [limb([[-12, 8, 9], [-12, 20, 8], [-12, 30, 7.5]]), limb([[12, 8, 9], [12, 20, 8], [12, 30, 7.5]])];
    return merge(
      { lines: shins, washes: shins.map((d) => ({ c: PAL.rose, o: 0.45, d: Z(d) })) },
      { lines: [breeches], fine: ['M-15 10l2 -3l2 3M13 10l2 -3l2 3'], washes: [{ c: PAL.grey, o: 0.85, d: breeches }] },
      place(bareFoot(-10, -1), 'translate(-2 36)'),
      place(bareFoot(10, 1), 'translate(2 36)'),
      upper,
    );
  }
  const breeches = 'M-17 -46L-18 -26L-14 -28L-10 -25L-4 -27L-1 -40L1 -40L4 -27L10 -25L14 -28L18 -26L17 -46Z';
  const shins = [limb([[-11, -28, 8], [-11, -16, 7.5], [-11, -5, 7]]), limb([[11, -28, 8], [11, -16, 7.5], [11, -5, 7]])];
  return merge(
    { lines: shins, washes: shins.map((d) => ({ c: PAL.rose, o: 0.45, d: Z(d) })) },
    { lines: [breeches], washes: [{ c: PAL.grey, o: 0.85, d: breeches }] },
    ...(feet ? [bareFoot(-12, -1), bareFoot(12, 1)] : []),
    place(upper, 'translate(0 -44)'),
  );
}

/** His bundle: a red spotted cloth tied on a stick. The stick runs from (0,0) to (44,-52); the bundle hangs from its end. */
export function bundle() {
  const stick = limb([[-4, 5, 3.4], [20, -23, 3.4], [44, -52, 3]]);
  const cloth = 'M34 -50C26 -46 24 -32 30 -24C36 -18 50 -18 56 -24C62 -32 58 -46 50 -50C46 -52 38 -52 34 -50Z';
  const knot = 'M38 -51L42 -58L46 -51Z';
  return {
    lines: [cloth, stick, knot],
    washes: [
      { c: PAL.red, o: 0.8, d: cloth + knot },
      { c: PAL.ochre, o: 0.7, d: Z(stick) },
      { c: PAL.terracotta, o: 0.5, d: Z(stick) },
    ],
    whites: [dot(36, -42, 1.7), dot(45, -38, 1.7), dot(52, -44, 1.7), dot(40, -30, 1.7), dot(50, -28, 1.7), dot(55, -34, 1.6)],
  };
}

// =============================================================================================
// GROWN-UP DICK, LORD MAYOR (pose 'sit', seat at 0,0): the same hair, a long red robe with white
// fur trim, a gold chain of office and a soft black velvet hat. Head centre (0,-96).
// =============================================================================================
export function mayor({ mood = 'happy', arms } = {}) {
  const robe = 'M-12 -78C-28 -76 -34 -64 -34 -48C-34 -30 -36 -12 -40 0C-44 14 -42 34 -38 46C-14 50 14 50 38 46C42 34 44 14 40 0C36 -12 34 -30 34 -48C34 -64 28 -76 12 -78';
  const trim = 'M-12 -78C-6 -70 -4 -50 -7 -30L-20 46L20 46L7 -30C4 -50 6 -70 12 -78C6 -75 -6 -75 -12 -78Z';
  const lap = 'M-34 -2C-30 0 -26 1 -22 1.5M22 1.5C26 1 30 0 34 -2';
  const feet = 'M-26 46C-34 46 -35 52 -29 52L-12 52L-12 46ZM26 46C34 46 35 52 29 52L12 52L12 46Z';
  const links = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const x = -24 + 48 * t;
    const y = -76 + 16 * Math.sin(Math.PI * t);
    links.push(dot(f(x), f(y), 2.6));
  }
  const pendant = 'M0 -62L4 -58L0 -54L-4 -58Z';
  const a = arms ?? [
    [[-26, -68, 11], [-38, -50, 10], [-36, -28, 10], [-24, -10, 10]],
    [[26, -68, 11], [38, -50, 10], [36, -28, 10], [24, -10, 10]],
  ];
  const sleeves = a.map((p) => arm(p, PAL.red, 0.75, 5));
  const cuffs = a.map((p) => {
    const [x, y] = p[p.length - 2];
    return { fine: [dot(x, y, 6)], whites: [dot(x, y, 6)] };
  });
  const head = dickHead({ mood, hat: true });
  const hat = 'M-17 -15C-24 -18 -22 -28 -12 -30C-6 -36 6 -36 12 -30C22 -28 24 -18 17 -15C8 -18 -8 -18 -17 -15Z';
  return merge(
    {
      lines: [robe, lap, feet],
      // the white fur down the front is left as paper (a hole in the red), so a kitten on his lap keeps its colours
      washes: [{ c: PAL.red, o: 0.78, d: Z(robe) + trim, rule: 'evenodd' }, { c: PAL.slate, o: 0.9, d: feet }],
    },
    { fine: [trim] },
    { lines: links, washes: [{ c: PAL.ochre, o: 0.95, d: links.join('') + pendant }], fine: [pendant] },
    ...sleeves,
    ...cuffs,
    place(merge(head, { lines: [hat], washes: [{ c: PAL.ink, o: 0.75, d: hat }, { c: PAL.slate, o: 0.6, d: hat }], fine: ['M-12 -22q12 -4 24 0'] }), 'translate(0 -96) scale(1.15)'),
  );
}

// =============================================================================================
// THE CAT: a stripy ochre tabby with green eyes and a long tail. catSit: sitting, looking at us,
// her bottom at (0,0), about 56 tall (head centre 0,-42). mood: happy, smile (eyes shut, content),
// wow. catPounce: leaping to the right, her belly at (0,0), about 120 long.
// =============================================================================================
const FUR = [
  { c: PAL.ochre, o: 0.9 },
  { c: PAL.terracotta, o: 0.35 },
];
const furWash = (d) => FUR.map((w) => ({ ...w, d }));
const stripe = (d) => ({ fine: [d], washes: [{ c: PAL.terracotta, o: 0.8, d: Z(d) }] });

export function catHead({ mood = 'happy', look = [0, 0] } = {}) {
  const head = 'M-13 0C-14 -8 -8 -13 0 -13C8 -13 14 -8 13 0C14 6 8 11 0 11C-8 11 -14 6 -13 0Z';
  const ears = 'M-12 -5L-12 -20L-3 -12M3 -12L12 -20L12 -5';
  const earFill = 'M-12 -5L-12 -20L-3 -12ZM3 -12L12 -20L12 -5Z';
  const fine = ['M-1.8 3L1.8 3L0 5Z', 'M0 5q-2 3 -4.5 1.5M0 5q2 3 4.5 1.5', 'M-6 4l-11 -2M-6 6l-10 3M6 4l11 -2M6 6l10 3', 'M-3 -12l0.5 4M0 -13l0 4.5M3 -12l-0.5 4'];
  const washes = [...furWash(head + earFill), { c: PAL.rose, o: 0.8, d: 'M-10.5 -8L-10.5 -16L-5 -11ZM5 -11L10.5 -16L10.5 -8Z' }, { c: PAL.rose, o: 0.9, d: 'M-1.8 3L1.8 3L0 5Z' }];
  const fills = [];
  const glints = [];
  const [dx, dy] = look;
  if (mood === 'smile') {
    fine.push('M-8.5 -2q3.5 -3 7 0M1.5 -2q3.5 -3 7 0');
  } else {
    const almond = (x) => `M${x - 4} -2C${x - 2.6} -5.6 ${x + 2.6} -5.6 ${x + 4} -2C${x + 2.6} 1.4 ${x - 2.6} 1.4 ${x - 4} -2Z`;
    const big = mood === 'wow';
    const eye = (x) => (big ? dot(x, -2.2, 4) : almond(x));
    fine.push(eye(-5), eye(5));
    washes.push({ c: PAL.green, o: 0.95, d: eye(-5) + eye(5) });
    const pupil = (x) => `M${x} ${-5 + dy}C${x + 1} ${-3.4 + dy} ${x + 1} ${-0.6 + dy} ${x} ${1 + dy}C${x - 1} ${-0.6 + dy} ${x - 1} ${-3.4 + dy} ${x} ${-5 + dy}Z`;
    fills.push(pupil(-5 + dx), pupil(5 + dx));
    glints.push(dot(-5.9 + dx, -3.4 + dy, 0.55), dot(4.1 + dx, -3.4 + dy, 0.55));
  }
  return { lines: [head, ears], fine, washes, fills, glints, whites: [oval(-3, 6.5, 4, 3), oval(3, 6.5, 4, 3)] };
}

export function catSit({ mood = 'happy', look = [0, 0], tail = 'right', tilt = 0 } = {}) {
  const body = 'M-11 0C-17 -8 -16 -22 -10 -30C-6 -34 6 -34 10 -30C16 -22 17 -8 11 0Z';
  const chest = 'M-6 -28C-9 -20 -8 -12 -4 -8L4 -8C8 -12 9 -20 6 -28C2 -30 -2 -30 -6 -28Z';
  const legs = 'M-6 -16L-6 -1M4 -16L4 -1';
  const tailD =
    tail === 'down'
      ? limb([[8, -4, 6], [13, 6, 5.5], [12, 18, 5], [16, 28, 4.5]])
      : tail === 'right'
      ? limb([[9, -3, 6], [20, -2, 5.5], [30, -6, 5], [34, -16, 4.5], [31, -24, 4]])
      : limb([[-9, -3, 6], [-20, -2, 5.5], [-30, -6, 5], [-34, -16, 4.5], [-31, -24, 4]]);
  const paws = oval(-7, -1, 4.5, 2.4) + oval(5, -1, 4.5, 2.4);
  const s = tail === 'right' ? 1 : -1;
  return merge(
    {
      lines: [tailD, body, paws],
      fine: [legs],
      washes: [...furWash(Z(tailD)), ...furWash(body + paws)],
      whites: [chest],
    },
    stripe('M-15 -18q4 -1 6 2q-3 -1 -6 1Z'),
    stripe('M-16 -10q4 -1 6 2q-3 -1 -6 1Z'),
    stripe('M15 -18q-4 -1 -6 2q3 -1 6 1Z'),
    stripe('M16 -10q-4 -1 -6 2q3 -1 6 1Z'),
    ...(tail === 'down'
      ? [stripe('M10 4q3 1 6 0q-3 2 -6 0Z'), stripe('M9 14q3 1 6 0q-3 2 -6 0Z'), stripe('M11 24q3 1 6 0q-3 2 -6 0Z')]
      : [
          stripe(`M${20 * s} -6q${2 * s} 3 ${-1 * s} 6q${1 * s} -3 ${1 * s} -6Z`),
          stripe(`M${29 * s} -11q${3 * s} 2 ${2 * s} 6q${-0.5 * s} -3 ${-2 * s} -6Z`),
          stripe(`M${30 * s} -21q${3 * s} 1 ${4 * s} 5q${-1.5 * s} -2.5 ${-4 * s} -5Z`),
        ]),
    place(catHead({ mood, look }), `translate(0 -40) rotate(${tilt})`),
  );
}

/** The cat leaping to the right, front paws out, tail streaming behind. Belly at (0,0). */
export function catPounce({ mood = 'wow' } = {}) {
  const body = 'M-30 -14C-30 -26 -12 -32 6 -30C20 -29 30 -24 32 -16C32 -8 22 -2 6 -2C-12 -2 -30 -4 -30 -14Z';
  const front = [limb([[22, -12, 7], [36, -6, 6], [50, -2, 5.5]]), limb([[16, -8, 7], [32, 0, 6], [44, 6, 5.5]])];
  const back = [limb([[-24, -8, 8], [-40, -2, 7], [-54, 2, 6]]), limb([[-18, -4, 8], [-34, 4, 7], [-46, 10, 6]])];
  const tailD = limb([[-28, -18, 6], [-44, -28, 5.5], [-60, -32, 5], [-74, -28, 4.5], [-82, -20, 4]]);
  const limbs = [...front, ...back];
  return merge(
    {
      lines: [tailD, ...limbs, body],
      washes: [...furWash(Z(tailD)), ...limbs.flatMap((d) => furWash(Z(d))), ...furWash(body)],
      whites: ['M-4 -4C6 -3 18 -4 26 -9C20 -4 8 -1 -4 -2Z'],
      fine: ['M48 -6l4 1M48 -2l4 -1M42 3l4 1M42 7l4 -1'],
    },
    stripe('M-14 -30q2 6 0 12q-1 -6 0 -12Z'),
    stripe('M-4 -31q2 6 0 12q-1 -6 0 -12Z'),
    stripe('M6 -30q2 6 0 11q-1 -6 0 -11Z'),
    stripe('M-24 -26q2 6 0 11q-1 -6 0 -11Z'),
    stripe('M-46 -30q2 3 1 7q-2 -3 -1 -7Z'),
    stripe('M-64 -32q2 3 1 7q-2 -3 -1 -7Z'),
    place(catHead({ mood }), 'translate(36 -26) rotate(12)'),
  );
}

// =============================================================================================
// RATS AND MICE, running to the right (feet at 0,0). A mouse is about 34 long, a rat about 60.
// =============================================================================================
export function mouse({ big = false } = {}) {
  const body = 'M-12 -1C-14 -9 -6 -14 2 -13C8 -12 12 -8 16 -4C17 -2 16 -1 14 -1Z';
  const ear = dot(3, -13, 3.6);
  const tail = 'M-12 -3C-20 -2 -24 -8 -30 -6C-34 -5 -36 -1 -40 -2';
  const m = {
    lines: [body, ear],
    fine: [tail, 'M-6 -1l-4 3M-2 -1l3 3M6 -1l-3 3M9 -1l4 3', 'M15 -5l7 -2M15 -4l7 1'],
    washes: [
      { c: PAL.grey, o: 0.95, d: `${body}${ear}` },
      { c: PAL.slate, o: big ? 0.6 : 0.3, d: body },
      { c: PAL.rose, o: 0.85, d: dot(3, -13, 2) + dot(16.4, -3.6, 1.4) },
    ],
    fills: [dot(9, -8, 1.2)],
  };
  return big ? place(m, 'scale(1.5)') : m;
}

// =============================================================================================
// THE GIRL who sells the cat (feet at 0,0), about 112 tall: a rose dress, a white apron, two brown
// plaits and a green headscarf (apron: false leaves the apron off). Head centre (0,-96); arms from
// the shoulders (±14,-76).
// =============================================================================================
export function girl({ mood = 'happy', arms, look = [0, 0], apron = true } = {}) {
  const dress = 'M-8 -82C-16 -80 -18 -72 -18 -62C-20 -40 -24 -20 -28 -6C-10 -3 10 -3 28 -6C24 -20 20 -40 18 -62C18 -72 16 -80 8 -82';
  const apronD = 'M-12 -50C-14 -32 -16 -18 -16 -6L16 -6C16 -18 14 -32 12 -50C4 -48 -4 -48 -12 -50Z';
  const legs = 'M-9 -5L-9 -3M9 -5L9 -3';
  const shoes = oval(-10, -2, 6, 3) + oval(10, -2, 6, 3);
  const face = 'M-11.5 -2C-12 7 -6 13 0 13C6 13 12 7 11.5 -2C11 -9 6 -13 0 -13C-6 -13 -11 -9 -11.5 -2Z';
  const scarf = 'M-14 0C-16 -12 -9 -19 0 -19C9 -19 16 -12 14 0C11 -7 6 -9 0 -9C-6 -9 -11 -7 -14 0Z';
  const plaits = [limb([[-11, 2, 6], [-14, 12, 5.5], [-15, 22, 5]]), limb([[11, 2, 6], [14, 12, 5.5], [15, 22, 5]])];
  const m = faceMarks({ mood, ex: 4.4, ey: 0, my: 6.5, w: 3.6, look });
  const a = arms ?? [
    [[-14, -76, 7], [-20, -62, 6.5], [-23, -50, 6.5]],
    [[14, -76, 7], [20, -62, 6.5], [23, -50, 6.5]],
  ];
  const head = {
    lines: [...plaits, face, scarf],
    fine: ['M-15 22l2 3M15 22l-2 3', 'M0.5 1.5c1.4 1 1.4 2.4 -0.6 2.6', ...m.fine],
    washes: [
      ...plaits.map((d) => ({ c: PAL.terracotta, o: 0.8, d: Z(d) })),
      ...plaits.map((d) => ({ c: PAL.ink, o: 0.3, d: Z(d) })),
      { c: PAL.rose, o: 0.32, d: face },
      { c: PAL.green, o: 0.9, d: scarf },
      { c: PAL.rose, o: 0.6, d: dot(-8, 5, 2.3) + dot(8, 5, 2.3) },
      ...m.washes,
    ],
    whites: [dot(-6, -14, 1.3), dot(3, -15, 1.3), dot(9, -11, 1.3)],
    fills: m.fills,
    glints: m.glints,
  };
  return merge(
    {
      lines: [dress, shoes],
      fine: [...(apron ? [apronD] : []), legs],
      washes: [{ c: PAL.rose, o: 0.6, d: Z(dress) }, { c: PAL.slate, o: 0.8, d: shoes }],
      whites: apron ? [apronD] : [],
    },
    ...a.map((p) => arm(p, PAL.rose, 0.6, 3.8)),
    place(head, 'translate(0 -96)'),
  );
}

// =============================================================================================
// MR FITZWARREN, the kind merchant (feet at 0,0), about 160 tall with the hat, stout: a long
// slate-blue coat with gold buttons, a white cravat, grey side whiskers and a tall slate hat. The
// upper body turns round the hips (0,-50) by lean (degrees, + bends to the right). Head centre
// (0,-114) before leaning; arms from the shoulders (±24,-96).
// =============================================================================================
export function fitzHead({ mood = 'happy' } = {}) {
  const face = 'M-13 -2C-14 8 -8 15 0 15C8 15 14 8 13 -2C13 -11 8 -15 0 -15C-8 -15 -13 -11 -13 -2Z';
  const whiskers = 'M-13 -4C-17 2 -16 10 -11 13C-11 8 -11 3 -10 -2ZM13 -4C17 2 16 10 11 13C11 8 11 3 10 -2Z';
  const brim = 'M-20 -11C-12 -15 12 -15 20 -11C21 -8 18 -7 14 -9C6 -11 -6 -11 -14 -9C-18 -7 -21 -8 -20 -11Z';
  const crown = 'M-12 -12L-13 -36C-6 -38 6 -38 13 -36L12 -12';
  const m = faceMarks({ mood, ex: 5, ey: -1, my: 7, w: 4 });
  return {
    lines: [face, crown, brim],
    fine: [whiskers, 'M0.5 0.5c1.8 1.2 1.8 3 -0.6 3.4', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.35, d: face },
      { c: PAL.grey, o: 0.85, d: whiskers },
      { c: PAL.slate, o: 0.95, d: `${crown}C6 -14 -6 -14 -12 -12Z${brim}` },
      { c: PAL.ink, o: 0.25, d: `${crown}C6 -14 -6 -14 -12 -12Z` },
      { c: PAL.rose, o: 0.75, d: dot(-8, 5, 2.8) + dot(8, 5, 2.8) + dot(0.6, 3, 2.4) },
      ...m.washes,
    ],
    whites: ['M-12 -20C-6 -21 6 -21 12 -20L12 -16C6 -17 -6 -17 -12 -16Z'],
    fills: m.fills,
    glints: m.glints,
  };
}
export function fitz({ mood = 'happy', lean = 0, arms } = {}) {
  const coatD = 'M-14 -102C-28 -98 -34 -86 -34 -70C-36 -50 -36 -30 -32 -16C-14 -12 14 -12 32 -16C36 -30 36 -50 34 -70C34 -86 28 -98 14 -102';
  const cravat = 'M-8 -103C-4 -96 -2 -90 0 -84C2 -90 4 -96 8 -103C3 -100 -3 -100 -8 -103Z';
  const legs = 'M-16 -16L-15 -6L-4 -6L-3 -16M3 -16L4 -6L15 -6L16 -16';
  const shoes = 'M-15 -6C-24 -6 -25 0 -19 0L-4 0L-4 -6ZM15 -6C24 -6 25 0 19 0L4 0L4 -6Z';
  const a = arms ?? [
    [[-26, -96, 10], [-34, -80, 9.5], [-38, -64, 9.5], [-38, -56, 9.5]],
    [[26, -96, 10], [34, -80, 9.5], [38, -64, 9.5], [38, -56, 9.5]],
  ];
  const buttons = [-74, -60, -46].map((y) => dot(4, y, 1.8)).join('');
  const upper = merge(
    {
      lines: [coatD, cravat],
      fine: ['M0 -84L1 -14', buttons, 'M-30 -40l10 0M30 -40l-10 0'],
      washes: [
        { c: PAL.slate, o: 0.85, d: Z(coatD) },
        { c: PAL.sky, o: 0.35, d: Z(coatD) },
        { c: PAL.ochre, o: 0.95, d: buttons },
      ],
      whites: [cravat],
    },
    ...a.map((p) => arm(p, PAL.slate, 0.85, 5)),
    place(fitzHead({ mood }), 'translate(0 -116)'),
  );
  return merge(
    {
      lines: [legs, shoes],
      washes: [{ c: PAL.grey, o: 0.7, d: 'M-16 -16L-15 -6L-4 -6L-3 -16ZM3 -16L4 -6L15 -6L16 -16Z' }, { c: PAL.ink, o: 0.6, d: shoes }],
    },
    place(upper, `rotate(${lean} 0 -50)`),
  );
}

// =============================================================================================
// THE CAPTAIN (feet at 0,0), about 150 tall with the hat: a sky-blue sea coat with gold buttons,
// white trousers, black boots, a bushy terracotta beard and a black tricorn hat. Head centre
// (0,-112); arms from the shoulders (±21,-94).
// =============================================================================================
export function captainHead({ mood = 'happy' } = {}) {
  const face = 'M-12 -3C-13 7 -7 13 0 13C7 13 13 7 12 -3C12 -11 7 -14 0 -14C-7 -14 -12 -11 -12 -3Z';
  const beard = 'M-12 1C-15 14 -8 22 0 22C8 22 15 14 12 1C9 8 4 9 0 8C-4 9 -9 8 -12 1Z';
  const hat = 'M-24 -9C-20 -12 -14 -12 -10 -18C-6 -24 6 -24 10 -18C14 -12 20 -12 24 -9C18 -6 10 -10 0 -10C-10 -10 -18 -6 -24 -9Z';
  const m = faceMarks({ mood, ex: 4.6, ey: -2, my: 5, w: 3.4 });
  return {
    lines: [face, beard, hat],
    fine: ['M-6 5C-3 3 -1 3.5 0 4.5C1 3.5 3 3 6 5', 'M-5 13q1 3 0 6M5 13q-1 3 0 6', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.35, d: face },
      { c: PAL.terracotta, o: 0.85, d: beard },
      { c: PAL.ink, o: 0.8, d: hat },
      { c: PAL.rose, o: 0.75, d: dot(0.5, 1, 2.4) },
      ...m.washes,
    ],
    whites: ['M-20 -9.5C-14 -10 -8 -12 -2 -12.5L-2 -11C-8 -11 -14 -9 -20 -8Z'],
    fills: m.fills,
    glints: m.glints,
  };
}
export function captain({ mood = 'happy', arms, lean = 0 } = {}) {
  const coatD = 'M-10 -100C-22 -98 -27 -88 -27 -76C-28 -62 -29 -50 -31 -40C-14 -36 14 -36 31 -40C29 -50 28 -62 27 -76C27 -88 22 -98 10 -100';
  const legs = 'M-15 -40L-14 -20L-3 -20L-2 -40M2 -40L3 -20L14 -20L15 -40';
  const boots = 'M-15 -22L-15 -6C-24 -6 -26 0 -18 0L-2 0L-2 -22ZM15 -22L15 -6C24 -6 26 0 18 0L2 0L2 -22Z';
  const buttons = [-84, -72, -60, -48].flatMap((y) => [dot(-6, y, 1.7), dot(6, y, 1.7)]).join('');
  const a = arms ?? [
    [[-22, -94, 9], [-29, -80, 8.5], [-32, -66, 8.5], [-33, -58, 8.5]],
    [[22, -94, 9], [29, -80, 8.5], [32, -66, 8.5], [33, -58, 8.5]],
  ];
  const upper = merge(
    {
      lines: [coatD],
      fine: [buttons, 'M-10 -100L0 -88L10 -100', 'M-27 -62l8 0M27 -62l-8 0'],
      washes: [
        { c: PAL.sky, o: 0.95, d: `${coatD}C4 -96 -4 -96 -10 -100Z` },
        { c: PAL.slate, o: 0.35, d: `${coatD}C4 -96 -4 -96 -10 -100Z` },
        { c: PAL.ochre, o: 0.95, d: buttons },
      ],
    },
    ...a.map((p) => arm(p, PAL.sky, 0.95, 4.6)),
    ...a.map((p) => ({ washes: [{ c: PAL.slate, o: 0.35, d: Z(limb(p)) }] })),
    place(captainHead({ mood }), 'translate(0 -112)'),
  );
  return merge(
    {
      lines: [legs, boots],
      whites: ['M-15 -40L-14 -22L-3 -22L-2 -40ZM2 -40L3 -22L14 -22L15 -40Z'],
      washes: [{ c: PAL.ink, o: 0.75, d: boots }],
    },
    place(upper, `rotate(${lean} 0 -40)`),
  );
}

// =============================================================================================
// THE KING (feet at 0,0), about 150 tall and round: a long red robe with white fur trim, a round
// grey beard and a golden crown. Head centre (0,-118); arms from the shoulders (±26,-94).
// =============================================================================================
const ermine = (pts) => pts.map(([x, y]) => `M${x} ${y}l0.5 1.6`).join('');
export function kingHead({ mood = 'happy' } = {}) {
  const face = 'M-13 -2C-14 8 -8 14 0 14C8 14 14 8 13 -2C13 -12 8 -15 0 -15C-8 -15 -13 -12 -13 -2Z';
  const beard = 'M-12.5 5C-15 16 -9 26 0 26C9 26 15 16 12.5 5C9 12 4 13 0 11.5C-4 13 -9 12 -12.5 5Z';
  const crown = 'M-13 -12L-15 -30L-8 -21L-3 -33L2 -21L8 -32L12 -21L16 -29L13 -12C5 -14 -5 -14 -13 -12Z';
  const m = faceMarks({ mood, ex: 4.8, ey: -3, my: 6, w: 3.6 });
  return {
    lines: [face, beard, crown],
    fine: ['M-7 16q2 4 1 7M7 16q-2 4 -1 7', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.32, d: face },
      { c: PAL.grey, o: 0.75, d: beard },
      { c: PAL.ochre, o: 0.95, d: crown },
      { c: PAL.red, o: 0.9, d: dot(-3, -18, 1.8) + dot(8, -17, 1.6) },
      { c: PAL.sky, o: 0.9, d: dot(2.5, -17, 1.6) },
      { c: PAL.rose, o: 0.8, d: dot(0, 1.5, 2.8) },
      { c: PAL.rose, o: 0.6, d: dot(-9, 3, 2.6) + dot(9, 3, 2.6) },
      ...m.washes,
    ],
    fills: m.fills,
    glints: [...m.glints, 'M-10 -16l2 -8l1 0l-1 8Z'],
  };
}
export const K_ARMS = {
  down: [
    [[-28, -94, 11], [-40, -80, 10], [-46, -66, 10], [-47, -58, 10]],
    [[28, -94, 11], [40, -80, 10], [46, -66, 10], [47, -58, 10]],
  ],
  up: [
    [[-28, -94, 11], [-44, -104, 10], [-52, -122, 10], [-54, -134, 10]],
    [[28, -94, 11], [44, -104, 10], [52, -122, 10], [54, -134, 10]],
  ],
};
export function king({ mood = 'happy', arms = K_ARMS.down } = {}) {
  const robe = 'M-14 -102C-30 -98 -40 -80 -42 -50C-44 -26 -42 -8 -38 -2C-14 2 14 2 38 -2C42 -8 44 -26 42 -50C40 -80 30 -98 14 -102';
  const hem = 'M-40 -16C-14 -10 14 -10 40 -16L38 -2C14 2 -14 2 -38 -2Z';
  const cape = 'M-18 -104C-30 -100 -32 -90 -28 -84C-14 -79 14 -79 28 -84C32 -90 30 -100 18 -104C8 -99 -8 -99 -18 -104Z';
  const shoes = 'M-16 -1C-24 -1 -25 4 -19 4L-6 4L-6 0ZM16 -1C24 -1 25 4 19 4L6 4L6 0Z';
  const dots = ermine([[-32, -10], [-20, -8], [-8, -7], [4, -7], [16, -8], [28, -10], [-22, -92], [-10, -87], [2, -86], [14, -88], [24, -92]]);
  const cuffs = arms.map((a) => {
    const [x, y] = a[a.length - 2];
    return { fine: [dot(x, y, 5.8)], whites: [dot(x, y, 5.8)] };
  });
  return merge(
    {
      lines: [robe, hem, cape, shoes],
      fine: ['M-6 -82L-8 -14M6 -82L8 -14'],
      once: [dots],
      washes: [
        { c: PAL.red, o: 0.78, d: Z(robe) },
        { c: PAL.ochre, o: 0.85, d: 'M-6 -82L-8 -14L8 -14L6 -82Z' },
        { c: PAL.slate, o: 0.85, d: shoes },
      ],
      whites: [hem, cape],
    },
    ...arms.map((a) => arm(a, PAL.red, 0.78, 5.4)),
    ...cuffs,
    place(kingHead({ mood }), 'translate(0 -118) scale(1.1)'),
  );
}

// =============================================================================================
// THINGS AND PLACES
// =============================================================================================

/** The milestone: a grey stone with a rounded top, its top centre at (0,0), about 64 wide and 46 tall. */
export function milestone() {
  const stone = 'M-30 46C-32 30 -32 14 -28 4C-22 -2 22 -2 28 4C32 14 32 30 30 46';
  return {
    lines: [stone],
    fine: ['M-14 30l8 -2M10 38l10 -1', 'M-30 46C-10 49 10 49 30 46'],
    washes: [
      { c: PAL.grey, o: 0.9, d: Z(stone) },
      { c: PAL.slate, o: 0.25, d: 'M12 2C24 2 30 10 30 46L18 46C20 30 20 14 12 2Z' },
    ],
  };
}

/** London far away: little rooftops, a dome and church spires, the ground line at y = 0, from x = 0 to about 150. */
export function london() {
  const roofs =
    'M0 0L0 -10L8 -16L16 -10L16 -14L26 -14L26 -8L34 -8L34 -18L40 -24L46 -18L46 -6L56 -6L56 -12L66 -12L66 -4' +
    'M88 -4L88 -14L96 -20L104 -14L104 -8L114 -8L114 -16L124 -16L124 -6L134 -6L134 -12L142 -18L150 -12L150 0';
  const spire1 = 'M38 -18L38 -34L40 -50L42 -34L42 -18';
  const dome = 'M66 -4L66 -22C66 -34 88 -34 88 -22L88 -4M76 -32L77 -40L78 -32';
  const spire2 = 'M116 -16L116 -30L120 -46L124 -30L124 -16';
  const fill = `${roofs}L150 0L0 0Z`;
  return {
    lines: [roofs, spire1, dome, spire2],
    fine: ['M4 -6l3 0M20 -9l3 0M50 -4l2 0M94 -10l3 0M128 -4l2 0', 'M66 -18C70 -20 84 -20 88 -18'],
    washes: [
      { c: PAL.slate, o: 0.45, d: fill + Z(spire1) + Z(spire2) },
      { c: PAL.grey, o: 0.6, d: `${dome}Z` },
      { c: PAL.terracotta, o: 0.35, d: 'M0 -10L8 -16L16 -10ZM88 -14L96 -20L104 -14ZM134 -12L142 -18L150 -12Z' },
    ],
  };
}

/** The green hill of pictures 1 and 7: rises from the left to a top on the right, where the milestone stands. */
export const hill = {
  washes: [
    { c: PAL.green, o: 0.75, d: 'M-10 252C70 250 140 236 210 222C280 210 340 210 410 216L410 310L-10 310Z' },
    { c: PAL.green, o: 0.35, d: 'M-10 278C80 262 200 256 410 266L410 310L-10 310Z' },
  ],
  lines: ['M8 250C60 248 110 241 148 234M318 210C340 210 366 212 392 215'],
  fine: [tufts([[40, 250], [130, 238], [196, 225], [360, 213], [70, 284], [180, 280], [350, 284]], 9, 5)],
};

export const STONE = 'translate(270 176) scale(1.45)';
export const SEAT = [270, 179];
export const SIT = 'scale(1.45)';

export default compose({
  title: 'Dick Whittington and His Cat',
  seed: 211,
  washes: [{ c: PAL.green, o: 0.35, d: 'M6 207C50 203 120 203 166 209C130 216 60 218 6 215Z' }, ...hill.washes],
  lines: ['M8 207C50 203 120 203 166 209', ...hill.lines],
  fine: [...hill.fine],
  parts: [
    place(london(), 'translate(16 206) scale(0.85)'),
    place(milestone(), STONE),
    place(bundle(), `translate(${SEAT[0]} ${SEAT[1]}) ${SIT} translate(30 -40)`),
    place(dick({ pose: 'sit', mood: 'happy', arms: [D_ARMS.knee, D_ARMS.stick], look: [-1, 0] }), `translate(${SEAT[0]} ${SEAT[1]}) ${SIT}`),
    place(catSit({ mood: 'happy', tail: 'left', look: [1, 0] }), 'translate(194 262) scale(1.2)'),
  ],
});
