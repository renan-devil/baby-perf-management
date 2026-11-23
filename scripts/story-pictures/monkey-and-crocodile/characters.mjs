import { PAL } from '../lib.mjs';
import { dot, f, limb, merge, oval, place } from '../stone-soup/characters.mjs';

// The Monkey and the Crocodile: the little monkey, the big green crocodile (swimming or sitting up),
// Mrs Crocodile, the rose-apple tree and its fruit, shared by the five pictures. Each is drawn once
// here and placed in each picture with a transform (place). The build only draws files named <n>.mjs,
// so this file is not a picture.

export { compose, place, merge, dot, oval, limb, at } from '../stone-soup/characters.mjs';

// ---------------------------------------------------------------------------------------------
// The little monkey (sitting, seat at 0,0, facing us), about 30 wide and 46 tall: a round terracotta
// head with big round ears and a heart-shaped ochre face, a pear-shaped body with an ochre tummy, thin
// arms and legs with ochre hands and feet, and a long tail that ends in a curl.
// mood: 'happy' (smile), 'laugh' (eyes squeezed shut, mouth open), 'think' (eyes up and to the side,
// mouth pushed to one side). arms / legs: two centrelines each (from shoulder or hip), tail: one.
const mHead = 'M0 -45C7 -45 11 -40 11 -34C11 -27 6 -23 0 -23C-6 -23 -11 -27 -11 -34C-11 -40 -7 -45 0 -45Z';
const mEars = [dot(-12.5, -35, 4.5), dot(12.5, -35, 4.5)];
// the ears' ink: only the outer part, so the line stops at the head
const mEarLines = ['M-10.6 -39.1A4.5 4.5 0 1 0 -10.6 -30.9', 'M10.6 -39.1A4.5 4.5 0 1 1 10.6 -30.9'];
const mInnerEars = dot(-12.5, -35, 2.3) + dot(12.5, -35, 2.3);
const mFace = 'M0 -38C-3 -43.5 -10 -42.5 -9 -35C-9 -28 -5 -24.5 0 -24.5C5 -24.5 9 -28 9 -35C10 -42.5 3 -43.5 0 -38Z';
const mTuft = 'M-3 -44.5C-2 -48 1 -49.5 3 -47.5M0 -45C1 -48 4 -48.5 5 -46.5';
const mBody = 'M-7 -24C-12 -18 -12.5 -5 -9 -1C-4 1.5 4 1.5 9 -1C12.5 -5 12 -18 7 -24';
const mTummy = oval(0, -9, 5.2, 7);

export const M_POSE = {
  // holding on with one hand, the other waving high; legs astride
  ride: {
    arms: [[[-8, -19, 4], [-14, -12, 3.6], [-13, -3, 3.4]], [[8, -19, 4], [16, -28, 3.6], [20, -40, 3.4]]],
    legs: [[[-6, -3, 5], [-14, 2, 4], [-17, 11, 3.6]], [[6, -3, 5], [14, 2, 4], [17, 11, 3.6]]],
    tail: [[7, -3, 3.4], [22, -2, 3], [34, -8, 2.8], [38, -18, 2.6], [32, -24, 2.4], [26, -20, 2.2], [29, -15, 2]],
  },
  // sitting on a branch, one arm reaching down to let go of a rose-apple, legs dangling
  drop: {
    arms: [[[-8, -19, 4], [-14, -12, 3.6], [-16, -3, 3.4]], [[8, -19, 4], [17, -11, 3.6], [24, 2, 3.4], [26, 10, 3.2]]],
    legs: [[[-6, -3, 5], [-7, 6, 4], [-9, 15, 3.6]], [[6, -3, 5], [8, 6, 4], [11, 14, 3.6]]],
    tail: [[-7, -3, 3.4], [-14, 6, 3], [-16, 18, 2.8], [-12, 27, 2.6], [-6, 26, 2.4], [-7, 20, 2.2], [-11, 21, 2]],
  },
  // finger on chin, the other hand holding on
  think: {
    arms: [[[-8, -19, 4], [-15, -11, 3.6], [-14, -2, 3.4]], [[8, -19, 4], [13, -14, 3.6], [5, -24.5, 3.2]]],
    legs: [[[-6, -3, 5], [-14, 2, 4], [-17, 11, 3.6]], [[6, -3, 5], [14, 2, 4], [17, 11, 3.6]]],
    tail: [[-7, -3, 3.4], [-22, -2, 3], [-34, -8, 2.8], [-38, -18, 2.6], [-32, -24, 2.4], [-26, -20, 2.2], [-29, -15, 2]],
  },
  // safe at the top: one hand on his heart, the other waving
  safe: {
    arms: [[[-8, -19, 4], [-16, -27, 3.6], [-20, -40, 3.4]], [[8, -19, 4], [9, -12, 3.6], [2, -14, 3.4]]],
    legs: [[[-6, -3, 5], [-12, 3, 4], [-13, 11, 3.6]], [[6, -3, 5], [12, 3, 4], [13, 11, 3.6]]],
    tail: [[7, -3, 3.4], [20, 4, 3], [26, 16, 2.8], [22, 26, 2.6], [15, 26, 2.4], [15, 20, 2.2], [19, 19, 2]],
  },
};

export function monkey({ mood = 'happy', pose = M_POSE.ride } = {}) {
  const arms = pose.arms.map((p) => limb(p));
  const legs = pose.legs.map((p) => limb(p));
  const tail = limb(pose.tail);
  const ends = [...pose.arms, ...pose.legs].map((p) => p[p.length - 1]);
  const paws = ends.map(([x, y]) => dot(x, y, 2.6)).join('');
  const fine = [paws, mTuft, mInnerEars, 'M-2 -31.5l0.1 0.1M2 -31.5l0.1 0.1'];
  const fills = [];
  const glints = [];
  const washes = [];
  const eyes = [[-3.6, -35], [3.6, -35]];
  if (mood === 'laugh') {
    fine.push('M-6 -34.5q2.5 -3 5 0M1 -34.5q2.5 -3 5 0');
    const mouth = 'M-4.5 -30C-4 -25 4 -25 4.5 -30C2 -29 -2 -29 -4.5 -30Z';
    fine.push(mouth);
    washes.push({ c: PAL.red, o: 0.75, d: mouth });
  } else if (mood === 'think') {
    for (const [x, y] of eyes) {
      fills.push(dot(x + 1, y - 1, 1.6));
      glints.push(dot(x + 0.5, y - 1.6, 0.5));
    }
    fine.push('M-5 -40l3 -1.2M2.5 -41l3.5 0.8', 'M-1 -28.5q3 -0.8 5 -2.6');
  } else {
    for (const [x, y] of eyes) {
      fills.push(dot(x, y, 1.6));
      glints.push(dot(x - 0.5, y - 0.6, 0.5));
    }
    fine.push('M-4.5 -29.5q4.5 4 9 0');
  }
  return {
    lines: [tail, ...legs, mBody, ...arms, ...mEarLines, mHead],
    fine,
    washes: [
      // one wash per part: overlapping shapes in one path can cancel each other out
      { c: PAL.terracotta, o: 0.7, d: `${tail}Z${legs.map((d) => `${d}Z`).join('')}` },
      { c: PAL.terracotta, o: 0.7, d: `${mBody}C4 -26 -4 -26 -7 -24Z` },
      { c: PAL.terracotta, o: 0.7, d: arms.map((d) => `${d}Z`).join('') },
      { c: PAL.terracotta, o: 0.7, d: mHead + mFace, rule: 'evenodd' },
      { c: PAL.terracotta, o: 0.7, d: mEars.join('') },
      { c: PAL.ochre, o: 0.6, d: mFace + mTummy + mInnerEars },
      { c: PAL.ochre, o: 0.7, d: paws },
      { c: PAL.rose, o: 0.55, d: dot(-6.5, -30.5, 1.8) + dot(6.5, -30.5, 1.8) },
      ...washes,
    ],
    whites: [],
    fills,
    glints,
  };
}

/** Where the monkey's hand at the end of arm i (0 left, 1 right) is, in monkey coordinates. */
export const handOf = (pose, i) => pose.arms[i][pose.arms[i].length - 1].slice(0, 2);

// ---------------------------------------------------------------------------------------------
// The crocodile's head (facing right; the neck, open, at x = 0), about 72 long: a round eye on a bump,
// a long snout with a nostril bump, rosy cheek, and a closed smiling mouth with three rounded little
// teeth. mood: 'smile', 'talk' (mouth a little open), 'worried' (raised brow, wobbly mouth), 'sulk'
// (eye shut, brow down, mouth turned down), 'ashamed' (heavy eyelid, eye looking down, mouth down).
// mrs: eyelashes and a pink flower behind the eye, so we always know Mrs Crocodile.
const cHead =
  'M0 -14C2 -24 8 -30 17 -30C26 -30 30 -24 30 -17C42 -16 54 -15 62 -14C65 -18 71 -17 72 -12C74 -6 71 1 64 3C46 7 22 9 0 10';
const cEye = dot(17, -20.5, 5.5);
const cTeeth = 'M54 0.6C54 4.2 58.5 4.2 58.5 0.4ZM43 0.9C43 4.5 47.5 4.5 47.5 0.8ZM32 0.6C32 4 36.5 4 36.5 0.6Z';
const cScales = 'M38 -11l3 -1.2M46 -10.5l3 -1.2M54 -10l3 -1.2M42 -7l3 -1M50 -6.5l3 -1';
const petals = (x, y, s = 1) =>
  [0, 72, 144, 216, 288]
    .map((a) => {
      const r = ((a - 90) * Math.PI) / 180;
      return oval(x + Math.cos(r) * 2.8 * s, y + Math.sin(r) * 2.8 * s, 2.3 * s, 2.3 * s);
    })
    .join('');

export function crocHead({ mood = 'smile', mrs = false, look = [0.6, 0] } = {}) {
  const fine = [cScales, 'M28 -16.5C26 -14 26 -11 28 -9'];
  const washes = [{ c: PAL.green, o: 0.85, d: `${cHead}Z` }];
  const whites = [];
  const fills = [dot(66.5, -12, 1.4)];
  const glints = [];
  const [lx, ly] = look;
  const openEye = (dx, dy) => {
    whites.push(cEye);
    fine.push(cEye);
    fills.push(dot(17 + dx, -20.5 + dy, 2.5));
    glints.push(dot(16.2 + dx, -21.4 + dy, 0.7));
  };
  const upper = 'M66 -1C50 1.5 32 1.5 20 -1';
  if (mood === 'sulk') {
    fine.push('M11.5 -20q5.5 3.5 11 0', 'M10 -30l14 4', `${upper}C17 0 15 2 14 5`, cTeeth);
    whites.push(cTeeth);
  } else if (mood === 'ashamed') {
    openEye(0.4, 2.4);
    fine.push('M11.6 -21.5C14 -24.6 20 -24.6 22.4 -21.5', 'M10 -27q6 -4 13 -1.5', `${upper}C17 0 15 2 14 5`);
    washes.push({ c: PAL.green, o: 0.9, d: 'M11.6 -21.5C11.5 -27 22.5 -27 22.4 -21.5C20 -24.6 14 -24.6 11.6 -21.5Z' });
  } else if (mood === 'worried') {
    openEye(lx, ly);
    fine.push('M10 -28q6 -6 13 -3', 'M66 -1C58 0 54 2 48 0.5C42 -1 38 2 32 0.5C27 -0.5 23 0.5 20 -1', 'M8 -34q-2 4 0 6');
  } else if (mood === 'talk') {
    openEye(lx, ly);
    const mouth = 'M64 -0.5C50 1.5 32 1.5 20 -1C26 7 42 11 60 6C62 5 63.4 2.6 64 -0.5Z';
    fine.push(mouth, cTeeth);
    washes.push({ c: PAL.red, o: 0.65, d: mouth });
    whites.push(cTeeth);
  } else {
    openEye(lx, ly);
    fine.push(`${upper}C16 -2 14 -5 15 -8`, cTeeth);
    whites.push(cTeeth);
  }
  if (mood !== 'sulk' && mood !== 'ashamed' && mood !== 'worried') fine.push('M11 -28.5q6 -4 12 -1');
  washes.push({ c: PAL.rose, o: 0.6, d: oval(27, -5, 4, 2.6) });
  if (mrs) {
    fine.push(mood === 'sulk' ? 'M13 -18l-1.5 3M17 -17l0 3.5M21 -18l1.5 3' : 'M12.5 -25l-2.5 -3.5M16.5 -26.5l-0.5 -4.2M20.5 -25.6l1.6 -3.8');
    fine.push(petals(5, -30, 1.45));
    washes.push({ c: PAL.rose, o: 0.95, d: petals(5, -30, 1.45) }, { c: PAL.ochre, o: 0.95, d: dot(5, -30, 2) });
  }
  return { lines: [cHead], fine, washes, whites, fills, glints };
}

// ---------------------------------------------------------------------------------------------
// The crocodile swimming (facing right, waterline at y = 10, the head's neck at 0,0), about 200 long:
// a long knobbly green back above the water and the tip of the tail flicking up behind.
// head: the transform of the head (default: in place); neck, neckFill: ink and wash for a turned head.
// BACK(x) gives a point on his back, where the monkey sits.
const backA = [[2, -15], [-14, -27], [-40, -33], [-66, -32]];
const backB = [[-66, -32], [-92, -31], [-122, -20], [-152, 10]];
const bez = (P, t) => {
  const u = 1 - t;
  return [0, 1].map((k) => u * u * u * P[0][k] + 3 * u * u * t * P[1][k] + 3 * u * t * t * P[2][k] + t * t * t * P[3][k]);
};
export function BACK(x) {
  const P = x > -66 ? backA : backB;
  let [lo, hi] = [0, 1];
  for (let i = 0; i < 30; i++) {
    const m = (lo + hi) / 2;
    if (bez(P, m)[0] > x) lo = m;
    else hi = m;
  }
  return bez(P, (lo + hi) / 2).map(f);
}
const cBack = `M2 -15C-14 -27 -40 -33 -66 -32C-92 -31 -122 -20 -152 10`;
const cTail = 'M-168 10C-178 4 -186 -6 -182 -14C-180 -8 -174 -2 -160 6';
const cTailFill = `${cTail}Z`;
const scutes = [-12, -26, -40, -54, -68, -82, -96, -110, -124]
  .map((x) => {
    const [px, py] = BACK(x);
    return `M${f(px - 3)} ${f(py + 0.6)}Q${f(px)} ${f(py - 5)} ${f(px + 3)} ${f(py + 0.6)}`;
  })
  .join('');
const flank = 'M-30 -14c5 2.5 10 2.5 15 0M-62 -18c5 2.5 10 2.5 15 0M-96 -12c5 2.5 10 2.5 15 0M-46 -2c5 2.5 10 2.5 15 0M-80 -2c5 2.5 10 2.5 15 0';

// short: only his front half shows above the water (when there is no room for all of him)
const cBackShort = 'M2 -15C-14 -27 -40 -33 -60 -30C-80 -27 -96 -12 -104 10';
const cTailShort = 'M-118 10C-128 4 -136 -6 -132 -14C-130 -8 -124 -2 -110 6';
const scutesShort = [-12, -26, -40, -54, -68]
  .map((x) => {
    const [px, py] = BACK(x);
    return `M${f(px - 3)} ${f(py + 0.6)}Q${f(px)} ${f(py - 5)} ${f(px + 3)} ${f(py + 0.6)}`;
  })
  .join('');

export function swimCroc({ mood = 'smile', look, head = '', neck = '', neckFill = '', mrs = false, short = false } = {}) {
  const h = place(crocHead({ mood, mrs, look }), head || 'translate(0 0)');
  // the head's green goes in the same wash as the back, so no darker seam shows where they meet (not
  // for a turned head: mirrored, its outline runs the other way and the overlap would cancel out)
  const headGreen = neck ? '' : h.washes.shift().d;
  const body = {
    // with a turned head, the back's ink stops where the neck rises
    lines: short ? [cBackShort, cTailShort] : [neck ? cBack.replace('M2 -15C-14 -27 -40 -33', 'M-8 -21.6C-24 -29 -44 -33') : cBack, cTail, ...(neck ? [neck] : [])],
    fine: short ? [scutesShort, 'M-30 -14c5 2.5 10 2.5 15 0M-62 -14c5 2.5 10 2.5 15 0M-46 -2c5 2.5 10 2.5 15 0'] : [scutes, flank],
    washes: [
      {
        c: PAL.green,
        o: 0.85,
        d: `${short ? 'M6 10L-104 10C-96 -12 -80 -27 -60 -30C-40 -33 -14 -27 2 -15L6 -14Z' : 'M6 10L-152 10C-122 -20 -92 -31 -66 -32C-40 -33 -14 -27 2 -15L6 -14Z'}${headGreen}${neckFill}`,
      },
      { c: PAL.green, o: 0.85, d: short ? `${cTailShort}Z` : cTailFill },
    ],
  };
  return merge(body, h);
}

// ---------------------------------------------------------------------------------------------
// The crocodile sitting up on his tail at home (feet at y = 0, facing right), about 80 tall without
// the head: a rounded green body with a pale ochre striped belly, stubby legs, a long tail along the
// ground behind him, curling up at the tip, and the same head on top (placed at HEAD_UP, tilt in degrees).
// arms: 'folded' (crossed over the belly: sulking) or 'wring' (hands together: worried).
const uBack = 'M-14 -2C-26 -30 -24 -62 -8 -84';
const uFront = 'M16 -2C26 -24 26 -50 14 -70';
const uBodyFill = 'M-14 -2C-26 -30 -24 -62 -8 -84C2 -92 18 -82 14 -70C26 -50 26 -24 16 -2Z';
const uBelly = 'M4 -6C14 -16 18 -40 12 -62C6 -50 2 -24 4 -6Z';
const uStripes = 'M8 -14l7 0M9 -24l8 -1M10 -34l8 -1M10 -44l7 -1M10 -54l5 -1';
const uTail = limb([[-12, -6, 16], [-32, -2, 12], [-48, -8, 9], [-54, -22, 6], [-48, -32, 3.5]]);
const uLegs = [limb([[-6, -10, 12], [-6, -4, 11], [-4, 0, 10]]), limb([[10, -10, 12], [12, -4, 11], [14, 0, 10]])];
const uToes = 'M-1 0.5l0 -3M3 0.5l0 -3M17 0.5l0 -3M21 0.5l0 -3';
// folded: one rounded bar across the chest, with a crease where the arms cross and a hand at each end;
// wring: the near arm reaching forward to two little hands clasped in front of the belly.
const U_ARMS = {
  folded: {
    lines: ['M-12 -60C-4 -54 10 -53 21 -57C27 -55 28 -47 22 -44C10 -40 -4 -41 -12 -46'],
    fine: ['M6 -55C4 -50 4 -46 6 -42', 'M21 -57C18 -54 18 -48 22 -44', 'M-12 -55C-8 -53 -4 -52 0 -52'],
    fill: 'M-12 -60C-4 -54 10 -53 21 -57C27 -55 28 -47 22 -44C10 -40 -4 -41 -12 -46Z',
  },
  wring: {
    lines: ['M-10 -62C-4 -52 6 -46 18 -46', 'M18 -46C20 -52 26 -54 29 -50C32 -46 28 -41 23 -41C20 -41 18 -43 18 -46'],
    fine: ['M-10 -54C-4 -48 4 -42 18 -42', 'M24 -53C26 -57 31 -57 32 -53C33 -49 30 -47 27 -48'],
    fill: 'M-10 -62C-4 -52 6 -46 18 -46C20 -52 26 -54 29 -50C32 -46 28 -41 23 -41C20 -41 18 -43 18 -42C4 -42 -4 -48 -10 -54Z',
  },
};
export const HEAD_UP = [-2, -82];

export function uprightCroc({ mood = 'smile', mrs = false, arms = 'folded', tilt = 0, look } = {}) {
  const a = U_ARMS[arms];
  const h = place(crocHead({ mood, mrs, look }), `translate(${HEAD_UP[0]} ${HEAD_UP[1]}) rotate(${tilt}) scale(0.92)`);
  const headGreen = h.washes.shift().d;
  const body = {
    lines: [uTail, ...uLegs, uBack, uFront],
    fine: [uStripes, uToes],
    washes: [
      { c: PAL.green, o: 0.85, d: `${uTail}Z` },
      { c: PAL.green, o: 0.85, d: uBodyFill + headGreen },
      { c: PAL.green, o: 0.85, d: uLegs.map((d) => `${d}Z`).join('') },
      { c: PAL.ochre, o: 0.5, d: uBelly },
    ],
  };
  const armPart = { lines: a.lines, fine: a.fine, washes: [{ c: PAL.green, o: 0.95, d: a.fill }] };
  return merge(body, h, armPart);
}

// ---------------------------------------------------------------------------------------------
// A rose-apple (centre 0,0): a little purple bell (rose with slate over it) with a stalk.
const fruitD = 'M-3.2 -3C-4.4 0 -4.4 3.4 -2.4 4.4C-0.8 3.6 0.8 3.6 2.4 4.4C4.4 3.4 4.4 0 3.2 -3C2 -4.4 -2 -4.4 -3.2 -3Z';
export function fruit(s = 1) {
  const t = `scale(${s})`;
  const d = place({ lines: [], fine: [fruitD, 'M0 -4l1 -3'], washes: [{ c: PAL.rose, o: 0.95, d: fruitD }, { c: PAL.slate, o: 0.3, d: fruitD }] }, t);
  return d;
}

// ---------------------------------------------------------------------------------------------
// The rose-apple tree (trunk base at 0,0), about 190 tall: a sturdy trunk, a big round leafy crown
// with purple rose-apples, and (branch: true) a long branch reaching out to the right, where the
// monkey can sit at BRANCH_SEAT.
const tTrunk = 'M-12 2C-8 -40 -12 -80 -8 -124M12 2C8 -40 12 -84 8 -124';
const tRoots = 'M-12 2C-18 4 -24 5 -30 4M12 2C18 4 24 5 30 4';
const tBark = 'M-2 -30c2 5 2 10 0 14M4 -60c-2 5 -2 10 0 14M-3 -90c2 4 2 8 0 12';
const tCrown =
  'M-70 -122C-98 -130 -94 -170 -64 -172C-60 -204 -18 -214 0 -198C22 -216 66 -204 66 -176C96 -170 96 -130 68 -122C54 -106 24 -110 10 -116C-8 -106 -50 -106 -70 -122Z';
const tLeafMarks = 'M-56 -160c3 -5 8 -5 10 0M-20 -186c3 -5 8 -5 10 0M30 -180c3 -5 8 -5 10 0M44 -142c3 -5 8 -5 10 0M-40 -132c3 -5 8 -5 10 0M8 -150c3 -5 8 -5 10 0';
const tBranch = 'M8 -96C44 -102 110 -100 170 -92M9 -86C44 -90 110 -90 170 -84';
const tBranchEnd = 'M170 -92C174 -91 174 -85 170 -84';
const tBranchLeaves = 'M166 -92C170 -108 190 -110 194 -98C204 -96 204 -82 192 -80C184 -72 168 -76 168 -84Z';
export const BRANCH_SEAT = [114, -97];
const FRUITS = [[-60, -146], [-34, -170], [-6, -138], [18, -184], [40, -158], [62, -136], [-74, -128], [28, -126], [-20, -120], [-44, -186], [50, -190], [76, -150]];

export function tree({ branch = false, fruits = FRUITS } = {}) {
  const woodFill = 'M-12 2C-8 -40 -12 -80 -8 -124L8 -124C12 -84 8 -40 12 2Z';
  const branchFill = 'M8 -96C44 -102 110 -100 170 -92C174 -91 174 -85 170 -84C110 -90 44 -90 9 -86Z';
  const parts = [
    {
      lines: [tTrunk, tRoots, ...(branch ? [tBranch, tBranchEnd, tBranchLeaves] : []), tCrown],
      fine: [tBark, tLeafMarks, ...(branch ? ['M176 -96c3 -4 7 -4 9 0'] : [])],
      washes: [
        { c: PAL.terracotta, o: 0.5, d: woodFill + (branch ? branchFill : '') },
        { c: PAL.grey, o: 0.45, d: woodFill + (branch ? branchFill : '') },
        { c: PAL.green, o: 0.7, d: tCrown },
        { c: PAL.green, o: 0.35, d: 'M-50 -150C-36 -170 0 -176 24 -164C40 -156 34 -136 14 -134C-10 -132 -40 -132 -50 -150Z' },
        ...(branch ? [{ c: PAL.green, o: 0.75, d: tBranchLeaves }] : []),
      ],
    },
    ...fruits.map(([x, y]) => place(fruit(1.15), `translate(${x} ${y})`)),
  ];
  return merge(...parts);
}

// ---------------------------------------------------------------------------------------------
// Water ripples: short wavy strokes (centre x, y, width w).
export const ripple = (x, y, w = 20) => `M${f(x - w / 2)} ${f(y)}q${f(w / 4)} -3 ${f(w / 2)} 0q${f(w / 4)} 3 ${f(w / 2)} 0`;
