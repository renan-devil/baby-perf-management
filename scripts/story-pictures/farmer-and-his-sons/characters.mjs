import { PAL } from '../lib.mjs';
import { at, dot, limb, merge, oval, place } from '../stone-soup/characters.mjs';

// The Farmer and His Sons: the three sons, shared by the two pictures. Each son is drawn once here
// and placed in each picture with a transform (place). The build only draws files named <n>.mjs, so
// this file is not a picture. A son stands with his feet at y = 0 and is 137 tall before his scale.

export { compose, place, merge, at, dot, oval, limb } from '../stone-soup/characters.mjs';

// The three brothers: the eldest is the tallest (sky-blue shirt, red-brown hair with a quiff), the
// middle one has a red shirt and dark spiky hair, the youngest a green shirt and curly golden hair.
export const SONS = {
  eldest: { s: 1, shirt: PAL.sky, hair: PAL.terracotta, style: 'quiff' },
  middle: { s: 0.87, shirt: PAL.red, hair: PAL.slate, style: 'spiky' },
  youngest: { s: 0.72, shirt: PAL.green, hair: PAL.ochre, style: 'curly' },
};

const HAIR = {
  quiff: 'M-11.8 -1C-13.5 -12 -6 -16.5 1 -16.5C8 -16.5 13.5 -11 11.8 -1C10 -7 4 -9.5 -2 -9.5C-6 -8.5 -9.5 -6 -11.8 -1ZM-3 -16C0 -22 8 -22 10 -17C7 -18 2 -17 -3 -16Z',
  spiky: 'M-12 0C-14 -12 -6 -17 1 -17C9 -17 14 -11 12 0L9.5 -7L6.5 -4L4 -9.5L1 -5L-2 -9.5L-5 -5L-8 -8.5Z',
  curly:
    'M-12 0C-16 -4 -14 -11 -9 -11C-9 -17 -2 -19 1 -15C4 -19 11 -17 10.5 -11.5C15 -11 16 -4 12 0C10 -6 6 -8 1 -8C-4 -8 -9 -6 -12 0Z',
};

// The face (centre 0,0): eyes looking towards look (-1 left, 0 ahead, 1 right), a small rosy nose,
// cheeks, and a mouth for the mood: 'smile', 'oh' (a little round "oh") or 'grin' (open, cheerful).
function face({ look = 0, mood = 'smile' }) {
  const dx = look * 1.4;
  const fills = [dot(-4.5 + dx, -1, 1.8), dot(4.5 + dx, -1, 1.8)];
  const glints = [dot(-5 + dx, -1.6, 0.55), dot(4 + dx, -1.6, 0.55)];
  const fine = [`M${-7 + dx} -6q2.5 -1.6 5 -0.4M${2 + dx} -6.4q2.5 -1.2 5 0.4`];
  const washes = [{ c: PAL.rose, o: 0.7, d: dot(-7, 5, 2.3) + dot(7, 5, 2.3) }];
  const nose = `M${dx} 1.5q${2.5 * (look || 1)} 2.5 0 4`;
  fine.push(nose);
  if (mood === 'oh') fills.push(oval(dx, 8.5, 1.8, 2.3));
  else if (mood === 'grin') {
    const m = `M${-5 + dx} 7C${-4 + dx} 13 ${4 + dx} 13 ${5 + dx} 7C${2 + dx} 8 ${-2 + dx} 8 ${-5 + dx} 7Z`;
    fine.push(m);
    washes.push({ c: PAL.red, o: 0.7, d: m });
  } else fine.push(`M${-4 + dx} 8q4 3.6 8 0`);
  return { fills, glints, fine, washes };
}

const hFace = oval(0, 0, 11, 12);
const ears = 'M-11 -2C-15 -3 -15 4 -10.6 4M11 -2C15 -3 15 4 10.6 4';

export function sonHead(who, opts = {}) {
  const k = SONS[who];
  const hair = HAIR[k.style];
  const m = face(opts);
  return {
    lines: [hFace],
    fine: [ears, hair, ...m.fine],
    washes: [{ c: PAL.rose, o: 0.3, d: hFace + ears }, { c: k.hair, o: 0.85, d: hair }, ...m.washes],
    fills: m.fills,
    glints: m.glints,
  };
}

// Body parts (feet at 0,0, before the scale). The upper body (shirt, head, arms) can bend at the
// waist (0, -62); the head sits at (0, -121).
const WAIST = [0, -62];
export const S_HEAD = [0, -121];
const shirt = 'M-14 -104C-18 -92 -17 -76 -15 -62L15 -62C17 -76 18 -92 14 -104C8 -108 -8 -108 -14 -104Z';
const collar = 'M-6 -106L0 -99L6 -106';
const shirtMarks = 'M0 -99L0 -66M-14 -64C-5 -62 5 -62 14 -64';
const LEGS = {
  stand: 'M-15 -62C-16 -42 -16 -22 -15 -5L-3 -5L0 -44L3 -5L15 -5C16 -22 16 -42 15 -62Z',
  wide: 'M-15 -62C-19 -42 -22 -22 -24 -5L-12 -5L0 -42L12 -5L24 -5C22 -22 19 -42 15 -62Z',
};
const BOOTS = {
  stand: [oval(-10, -3, 8, 4), oval(10, -3, 8, 4)],
  wide: [oval(-19, -3, 8, 4), oval(19, -3, 8, 4)],
};

/** An arm along pts (shoulder first): a shirt sleeve with a round hand at its end. */
function arm(pts, sleeve) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const h = dot(x, y, 4.6);
  return { lines: [d], fine: [h], washes: [{ c: sleeve, o: 0.6, d: `${d}Z` }, { c: PAL.rose, o: 0.6, d: h }] };
}

/**
 * One son (feet at 0,0, unscaled; place him with a scale of SONS[who].s). arms: two lists of
 * [x, y, width] points from the shoulders (±13, -100), in the unbent body; bend: degrees the upper
 * body leans at the waist (negative = to the left); legs: 'stand' or 'wide'.
 */
export function son(who, { arms, bend = 0, legs = 'stand', look = 0, mood = 'smile' } = {}) {
  const k = SONS[who];
  const B = `rotate(${bend} ${WAIST[0]} ${WAIST[1]})`;
  const upper = merge(
    {
      lines: [shirt],
      fine: [collar, shirtMarks],
      washes: [{ c: k.shirt, o: 0.68, d: shirt }],
    },
    ...arms.map((a) => arm(a, k.shirt)),
    place(sonHead(who, { look, mood }), `translate(${S_HEAD[0]} ${S_HEAD[1]})`),
  );
  return merge(
    {
      lines: [LEGS[legs], ...BOOTS[legs]],
      washes: [
        { c: PAL.grey, o: 0.62, d: LEGS[legs] },
        { c: PAL.slate, o: 0.85, d: BOOTS[legs].join('') },
      ],
    },
    place(upper, B),
  );
}

/** Where a point of the unbent body lands once the son bends by bend and is placed with t. */
export const sonPoint = (x, y, bend, t) => at(...at(x, y, `rotate(${bend} ${WAIST[0]} ${WAIST[1]})`), t);

// A spade (the tip of the blade at 0,0, the handle pointing up, len long to the top of the grip):
// a wooden handle with a T grip and a slate iron blade.
export function spade(len = 110) {
  const blade = 'M-8 0C-9 -8 -9 -16 -8 -22L8 -22C9 -16 9 -8 8 0C4 3 -4 3 -8 0Z';
  const shaft = `M-2 -22L-2 ${-len + 6}M2 -22L2 ${-len + 6}`;
  const grip = `M-8 ${-len + 6}L8 ${-len + 6}L8 ${-len}L-8 ${-len}Z`;
  return {
    lines: [blade, shaft, grip],
    fine: ['M-5 -21L5 -21'],
    washes: [
      { c: PAL.slate, o: 0.7, d: blade },
      { c: PAL.ochre, o: 0.8, d: `M-2 -22L-2 ${-len + 6}L2 ${-len + 6}L2 -22Z${grip}` },
    ],
  };
}
