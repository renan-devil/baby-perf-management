import { PAL, transformPath } from '../lib.mjs';
import { dot, limb, merge, oval, place } from '../stone-soup/characters.mjs';

// Belling the Cat: the mice (Grandpa Mouse, the young mouse and their friends), the little silver bell
// on its red ribbon and the big ginger Cat, shared by the two pictures. Each is drawn once here and
// placed in each picture with a transform (place); flip with scale(-1 1). The build only draws files
// named <n>.mjs, so this file is not a picture.

export { at, compose, merge, place } from '../stone-soup/characters.mjs';

const close = (list) => list.map((d) => `${d}Z`).join('');

// ---------------------------------------------------------------------------------------------
// The bell (hold point at 0,0, where a paw grips the ribbon): a red ribbon loop hanging down to a
// little round-shouldered silver bell with a clapper. ding: adds little ringing marks either side.
export function bell({ ding = false } = {}) {
  const ribbon = 'M0 0C-5 3 -5 9 -1 12C3 9 4 3 0 0Z';
  const tails = 'M0 0L-6 -5L-3 1ZM0 0L6 -4L3 1Z';
  const body = 'M-9 30C-9 20 -6 13 0 13C6 13 9 20 9 30C11 31 12 32 11 33L-11 33C-12 32 -11 31 -9 30Z';
  const shine = 'M-4 28C-5 23 -4 19 -2 17';
  const clapper = dot(0, 35.5, 2.6);
  return {
    lines: [body],
    fine: [ribbon, tails, 'M-6 30L6 30', ...(ding ? ['M-14 17l-6 -4M-15 24l-7 0M14 17l6 -4M15 24l7 0'] : [])],
    washes: [
      { c: PAL.grey, o: 0.9, d: body },
      { c: PAL.slate, o: 0.5, d: 'M3 15C7 18 9 24 9 30L11 33L4 33C6 26 5 19 3 15Z' },
      { c: PAL.red, o: 0.9, d: `${ribbon}${tails}` },
    ],
    whites: [`${shine}L-2 28Z`],
    fills: [clapper],
  };
}

// ---------------------------------------------------------------------------------------------
// A mouse seen from the side, facing right, feet at y = 0, about 92 tall to the ear tip: a pear body
// with a cream belly, a pointed head, a big round pink ear, a long curly tail.
// coat: 'grey', 'brown' or 'fawn'. pose: 'stand' or 'sit' (rounder, a big foot forward).
// arms: 'down', 'up' (one paw high above the head: holding up the bell), 'hold' (paws at the chest,
// the bell hanging below), 'clap' (both paws up in front, cheering).
// mood: 'happy' (smile), 'wow' (eye wide open), 'worried' (raised brow, little flat mouth).
// old: Grandpa Mouse, with bushy white eyebrows.
// withBell: the bell hangs from the front paw (arms 'up' or 'hold'). tail: false hides the tail (when
// it would lie behind another mouse).
const COATS = {
  grey: [{ c: PAL.grey, o: 0.85 }],
  brown: [
    { c: PAL.terracotta, o: 0.55 },
    { c: PAL.grey, o: 0.45 },
  ],
  fawn: [
    { c: PAL.ochre, o: 0.6 },
    { c: PAL.terracotta, o: 0.3 },
  ],
};
const mHead = 'M-12 -58C-14 -70 -4 -78 8 -76C16 -75 22 -70 28 -63C32 -60 35 -58 34 -55C32 -51 24 -50 14 -50C2 -49 -10 -51 -12 -58Z';
const mEar = 'M-8 -70C-20 -74 -20 -94 -4 -94C10 -94 14 -80 6 -73';
const mEarIn = 'M-6 -74C-14 -77 -13 -89 -4 -89C5 -89 7 -81 3 -76Z';
const mEarFar = 'M12 -75C11 -86 22 -89 25 -81C26 -76 24 -72 20 -70';
const mBody = {
  stand: 'M-14 -51C-24 -40 -24 -12 -16 -2C-8 3 10 3 15 -3C21 -15 19 -40 11 -51',
  sit: 'M-14 -51C-28 -40 -30 -8 -18 -1C-6 4 14 4 20 -3C27 -15 22 -40 11 -51',
};
const mBelly = {
  stand: 'M3 -48C13 -38 15 -16 9 -4C3 -2 -1 -8 0 -22C1 -32 0 -42 3 -48Z',
  sit: 'M3 -48C15 -38 19 -16 12 -4C5 -2 0 -8 0 -22C1 -32 0 -42 3 -48Z',
};
const mFeet = {
  stand: 'M-8 0C-10 -4 -2 -5 4 -2L5 1L-8 1ZM6 0C6 -4 14 -5 19 -1L19 1L6 1Z',
  sit: 'M8 0C9 -6 26 -7 32 -2C33 1 28 2 8 1Z',
};
const mTail = 'M-18 -6C-34 -2 -46 -8 -50 -18C-53 -27 -46 -32 -41 -27';
const ARMS = {
  down: [[4, -42, 7], [12, -32, 6], [14, -24, 5.5]],
  up: [[6, -42, 7], [40, -36, 6], [56, -78, 5.5], [62, -116, 5.5]],
  hold: [[4, -42, 7], [20, -32, 6], [30, -46, 5.5]],
  clap: [[4, -42, 7], [22, -40, 6], [30, -60, 5.5]],
};
const FAR_ARM = {
  down: null,
  up: [[-6, -44, 6.5], [-22, -38, 6], [-28, -26, 5.5]],
  hold: [[-2, -44, 6.5], [12, -38, 6], [24, -48, 5.5]],
  clap: [[-2, -44, 6.5], [14, -44, 6], [24, -62, 5.5]],
};
export const MOUSE_HAND = { up: [62, -116], hold: [30, -46] };

function mouseFace(mood, old) {
  const out = { fine: [], fills: [dot(34, -56, 2.6)], glints: [dot(33.2, -56.8, 0.7)], washes: [], whites: [] };
  const whiskers = 'M30 -54l14 -4M30 -53l14 3M29 -52l11 7';
  out.fine.push(whiskers);
  if (mood === 'wow') {
    const eye = dot(15, -64, 3.6);
    out.whites.push(eye);
    out.fine.push(eye, 'M10 -71q5 -4 11 -1');
    out.fills.push(dot(16.2, -64, 2.1));
    out.glints.push(dot(15.4, -65, 0.7));
    const mouth = oval(26, -48.5, 2.2, 2);
    out.fine.push(mouth);
    out.washes.push({ c: PAL.red, o: 0.8, d: mouth });
  } else if (mood === 'worried') {
    out.fills.push(dot(16, -63, 2.2));
    out.glints.push(dot(15.3, -63.7, 0.7));
    out.fine.push('M11 -70q4 -3 9 -2', 'M23 -49q3 -1 6 0');
  } else {
    out.fills.push(dot(15, -63, 2.2));
    out.glints.push(dot(14.3, -63.7, 0.7));
    out.fine.push('M21 -51q4 3 9 -1');
  }
  if (old) {
    const brow = 'M8 -68C10 -74 18 -76 23 -72C19 -71 13 -70 8 -68Z';
    out.whites.push(brow);
    out.fine.push(brow);
  }
  return out;
}

export function mouse({ coat = 'grey', pose = 'stand', arms = 'down', mood = 'happy', old = false, withBell = false, tail = true } = {}) {
  const coatOf = (d) => COATS[coat].map((w) => ({ ...w, d }));
  const near = limb(ARMS[arms]);
  const far = FAR_ARM[arms] ? limb(FAR_ARM[arms]) : null;
  const paw = (pts) => dot(pts[pts.length - 1][0], pts[pts.length - 1][1], 4.4);
  const paws = [paw(ARMS[arms]), ...(far ? [paw(FAR_ARM[arms])] : [])].join('');
  const body = mBody[pose];
  const fur = `${mHead}${mEar}Z${mEarFar}Z${body}Z${close([near, ...(far ? [far] : [])])}`;
  const parts = [
    {
      lines: [...(far ? [far] : []), mEarFar, body, ...(tail ? [mTail] : []), mEar, mHead, near],
      fine: [mFeet[pose], paws, 'M-14 -30q-4 4 -2 10'],
      washes: [
        ...coatOf(fur),
        { c: PAL.rose, o: 0.85, d: `${mEarIn}${mFeet[pose]}${paws}` },
        { c: PAL.rose, o: 0.5, d: transformPath(mEarIn, 'translate(18 -80) scale(0.55) translate(4 82)') },
      ],
      whites: [mBelly[pose]],
    },
    mouseFace(mood, old),
  ];
  if (withBell && MOUSE_HAND[arms]) {
    const [x, y] = MOUSE_HAND[arms];
    parts.push(place(bell({ ding: arms === 'up' }), `translate(${x} ${y + 2}) scale(${arms === 'up' ? 1.5 : 1.15})`));
  }
  return merge(...parts);
}

// ---------------------------------------------------------------------------------------------
// The Cat: a big ginger tom curled up asleep, seen from the side, facing left, his round face
// resting on his front paws, his striped tail wrapped round in front. About 200 long and 92 tall,
// floor at y = 0.
const cHead = 'M-104 -24C-106 -46 -88 -56 -70 -56C-52 -56 -36 -46 -38 -24C-40 -8 -54 0 -72 0C-90 0 -102 -10 -104 -24Z';
const cEars = 'M-98 -42L-100 -70L-80 -54M-62 -55L-46 -70L-44 -42';
const cEarsFill = 'M-98 -42L-100 -70L-80 -54ZM-62 -55L-46 -70L-44 -42Z';
const cBody = 'M-42 -42C-24 -76 30 -84 64 -70C94 -58 104 -30 98 -10C96 -3 92 0 84 0L-44 0';
const cTail = limb([[96, -8, 15], [70, 4, 14], [10, 6, 13], [-34, 4, 12]]);
const cPaws = 'M-104 0C-110 -8 -96 -12 -86 -6C-82 -2 -86 2 -104 2ZM-64 0C-66 -8 -52 -10 -44 -4C-40 0 -46 2 -64 2Z';
const cStripes =
  'M-18 -62C-12 -54 -10 -44 -12 -34M4 -72C10 -62 12 -50 10 -38M28 -76C34 -66 36 -54 34 -42M54 -72C60 -62 62 -50 58 -40M78 -60C80 -52 80 -44 76 -36';
const cTailStripes = 'M60 -6C58 0 60 8 62 13M30 -2C28 4 30 10 32 14M0 -2C-2 4 0 9 2 13';
const cHeadStripes = 'M-76 -54l1 7M-70 -56l0 8M-64 -54l-1 7';
const cFace = 'M-90 -26q6 5 12 0M-64 -26q6 5 12 0M-71 -14q-3 4 -7 1M-71 -14q3 4 7 1';
const cWhiskers = 'M-84 -14l-22 -3M-84 -11l-21 4M-58 -14l22 -3M-58 -11l21 4';

export function cat() {
  const fur = `${cBody}Z${cTail}Z${cPaws}`;
  return {
    lines: [cBody, cTail, cHead, cEars, cPaws],
    fine: [cStripes, cTailStripes, cHeadStripes, cFace, cWhiskers, 'M-30 -8q30 6 60 2'],
    washes: [
      { c: PAL.ochre, o: 0.9, d: `${fur}${cHead}${cEarsFill}` },
      { c: PAL.terracotta, o: 0.55, d: `${cBody}Z` },
      { c: PAL.rose, o: 0.8, d: 'M-95 -46L-96 -62L-86 -52ZM-56 -51L-49 -62L-48 -46Z' },
    ],
    whites: ['M-88 -12C-88 -20 -54 -20 -54 -12C-56 -4 -86 -4 -88 -12Z'],
    fills: ['M-75 -19L-67 -19L-71 -14Z'],
  };
}
