import { PAL, parseTransform, transformPath } from '../lib.mjs';
import { at, compose, dot, f, limb, merge, oval, place } from '../stone-soup/characters.mjs';

// The Enormous Turnip: Grandpa, Grandma, the little Granddaughter, the Dog, the Cat, the Mouse and the
// enormous turnip, shared by the five pictures. Each is drawn once here and placed in each picture
// with a transform (place). The build only draws files named <n>.mjs, so this file is not a picture.
// Everybody is seen from the side, facing right (towards the turnip), with the feet at y = 0.

export { at, compose, dot, merge, oval, place };

/** Where the picture point (x, y) lies in the drawing of a character placed with the transform t. */
export function toLocal(x, y, t) {
  const [a, b, c, d, e, g] = parseTransform(t);
  const det = a * d - b * c;
  return [f((d * (x - e) - c * (y - g)) / det), f((-b * (x - e) + a * (y - g)) / det)];
}

/** A limb along [x, y] points whose width goes from w0 to w1. */
function taper(pts, w0, w1) {
  return limb(pts.map(([x, y], i) => [x, y, w0 + ((w1 - w0) * i) / (pts.length - 1)]));
}

/** A round hand (or paw) at the end of an arm. */
function arm(pts, { w = 10, sleeve, o = 0.6, white = false, hand = 5, skin = PAL.rose }) {
  const d = taper(pts, w, w * 0.85);
  const [x, y] = pts[pts.length - 1];
  const h = dot(x, y, hand);
  const out = { lines: [d], fine: [h], washes: [{ c: skin, o: 0.55, d: h }] };
  if (sleeve) out.washes.push({ c: sleeve, o, d: `${d}Z` });
  if (white) out.whites = [`${d}Z`];
  return out;
}

/** A boot or shoe seen from the side, toe to the right, its sole on (0,0). */
const bootShape = (k = 1) => transformPath('M-5 -6C-6 -2 -6 0 -4 0L10 0C11 -4 7 -6 3 -6Z', `scale(${k})`);

/**
 * Builds a figure facing right around its hip. lean turns the body (negative: leaning back) about
 * the hip; arms and legs are lists of [x, y] points in the figure's own frame (feet at y = 0), the
 * arms starting from the shoulder, the legs from the hip. Returns the figure with its feet at y = 0.
 */
function poser({ H, torso, head, headAt, headScale, headTilt = 0, shoulder, lean = 0, arms, legs, armStyle, legStyle, lower = [] }) {
  const R = `rotate(${lean})`;
  const toHip = ([x, y]) => [x, y + H]; // feet frame → hip frame
  const sh = at(shoulder[0], shoulder[1], R);
  const armParts = arms.map((pts) => arm([sh, ...pts.map(toHip)], armStyle));
  const legParts = legs.map((pts, i) => {
    const p = legStyle.fromHem ? pts.map(toHip) : [[(i ? 1 : -1) * (legStyle.hipX ?? 5), 0], ...pts.map(toHip)];
    const d = taper(p, legStyle.w, legStyle.w * 0.82);
    const [x, y] = p[p.length - 1];
    if (legStyle.paw) {
      const pw = oval(x + 2, y + legStyle.w * 0.2, legStyle.w * 0.75, legStyle.w * 0.45);
      return { lines: [d], fine: [pw], washes: [{ c: legStyle.c, o: legStyle.o ?? 0.7, d: `${d}Z${pw}` }] };
    }
    const b = transformPath(bootShape(legStyle.boot ?? 1), `translate(${x} ${y + legStyle.w * 0.4})`);
    return {
      lines: [d, b],
      washes: [
        { c: legStyle.c, o: legStyle.o ?? 0.7, d: `${d}Z` },
        { c: legStyle.shoe ?? PAL.slate, o: 0.85, d: b },
        { c: PAL.ink, o: 0.25, d: b },
      ],
    };
  });
  const h = place(head, `${R} translate(${headAt[0]} ${headAt[1]}) rotate(${headTilt}) scale(${headScale})`);
  return place(merge(armParts[0], ...legParts, ...lower, place(torso, R), h, ...armParts.slice(1)), `translate(0 ${-H})`);
}

// Faces in profile (facing right). mood: 'happy' (eye open, smile), 'strain' (eye squeezed shut,
// teeth gritted, red face), 'laugh' (eye shut in a smile, mouth wide open).
function profileFace(mood, { eye, mouth, w = 8, r = 1.8 }) {
  const [ex, ey] = eye;
  const [mx, my] = mouth;
  const out = { fine: [], fills: [], glints: [], washes: [] };
  if (mood === 'strain') {
    out.fine.push(`M${ex - 3} ${ey - 3}l5 2.6l-5 2.4`, `M${mx} ${my}l${w} -1M${mx + 2} ${my - 1.4}l0 2.4M${mx + 5} ${my - 1.8}l0 2.4`);
  } else if (mood === 'laugh') {
    const m = `M${mx} ${my - 1}C${mx + 1} ${my + 7} ${mx + w} ${my + 7} ${mx + w + 1} ${my - 2}C${mx + w * 0.6} ${my} ${mx + w * 0.3} ${my} ${mx} ${my - 1}Z`;
    out.fine.push(`M${ex - 3} ${ey + 0.5}q3 -4 6 0`, m);
    out.washes.push({ c: PAL.red, o: 0.8, d: m });
  } else {
    out.fills.push(dot(ex, ey, r));
    out.glints.push(dot(ex - 0.5, ey - 0.6, 0.5));
    out.fine.push(`M${mx} ${my}q${w / 2} 3.4 ${w} -0.6`);
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// Grandpa's head (centre 0,0): a slate flat cap with its peak to the front, a big round rosy nose,
// a white beard and moustache, a bushy white eyebrow.
function grandpaHead(mood) {
  const back = 'M-15 -3C-16 5 -12 12 -5 15';
  const brow = 'M13 -4C14 -2 14 -1 13 1';
  const nose = dot(16, 3.5, 5);
  const ear = 'M-3 -2C-9 -3 -9 6 -3 5';
  const beard = 'M-6 3C-8 13 -2 25 8 28C16 27 21 18 19 8C15 10 11 9 8 7C3 9 -2 7 -6 3Z';
  const tash = 'M7 9C10 13 18 13 22 9C18 10 12 10 7 9Z';
  const cap = 'M-17 -5C-18 -15 -9 -22 3 -21C12 -20 17 -15 17 -11C22 -11 29 -10 29 -8C29 -6 22 -6 17 -6L-17 -5Z';
  const m = profileFace(mood, { eye: [8, 0], mouth: [10, 15], w: 7 });
  const skin = oval(0, 0, 15, 15);
  return {
    lines: [back, cap, beard],
    fine: [brow, nose, ear, tash, 'M3 -4q4 -3 9 -1', 'M-4 -20q2 8 1 15', 'M2 18q2 4 1 7M10 20q1 3 0 5', ...m.fine],
    washes: [
      { c: PAL.rose, o: mood === 'strain' ? 0.5 : 0.32, d: skin },
      ...(mood === 'strain' ? [{ c: PAL.red, o: 0.3, d: skin }] : []),
      { c: PAL.rose, o: 0.9, d: nose },
      { c: PAL.slate, o: 0.8, d: cap },
      { c: PAL.grey, o: 0.3, d: beard },
      ...m.washes,
    ],
    whites: [beard, tash, 'M3 -4q4 -3 9 -1q-4 2 -9 1Z'],
    fills: m.fills,
    glints: [...m.glints, dot(14, 1.5, 1)],
  };
}

// Grandpa (feet at 0,0), about 180 tall: a white shirt, a terracotta waistcoat with buttons, slate
// trousers and boots. The hip is at (0, -76); arms start at the shoulder.
export const GP_H = 76;
export function grandpa({ mood = 'happy', lean = 0, headTilt = 0, arms, legs } = {}) {
  const body = 'M-15 4C-19 -16 -18 -42 -13 -56C-8 -64 6 -64 12 -57C20 -46 24 -22 17 4Z';
  const collar = 'M-2 -62L6 -62L3 -55Z';
  const torso = {
    lines: [body],
    fine: [collar, 'M-14 -8L18 -8', dot(16, -44, 1.3), dot(19, -32, 1.3), dot(19.5, -20, 1.3), 'M-6 -50l1 4M-8 -30l1 5'],
    washes: [{ c: PAL.terracotta, o: 0.78, d: body }],
    whites: [collar],
  };
  return poser({
    H: GP_H,
    torso,
    head: grandpaHead(mood),
    headAt: [5, -80],
    headScale: 1.32,
    headTilt,
    shoulder: [1, -52],
    lean,
    arms: arms ?? [
      [[-6, -110], [-4, -86]],
      [[12, -112], [14, -88]],
    ],
    legs: legs ?? [
      [[-6, -40], [-5, -6]],
      [[6, -40], [7, -6]],
    ],
    armStyle: { w: 11, sleeve: PAL.grey, o: 0.38, hand: 5.4 },
    legStyle: { w: 13, c: PAL.slate, o: 0.75, shoe: PAL.terracotta, boot: 1.2 },
  });
}

// ---------------------------------------------------------------------------------------------
// Grandma's head (centre 0,0): grey hair in a bun at the back, little round spectacles, a small nose.
function grandmaHead(mood) {
  const hair = 'M-15 4C-18 -9 -10 -18 1 -18C9 -18 14 -13 15 -6C9 -10 3 -9 -2 -6C-6 -3 -11 1 -15 4Z';
  const bun = dot(-13, -14, 7);
  const back = 'M-15 3C-14 9 -10 13 -5 15';
  const face = 'M15 -6C16 -3 16 -1 16 0C20 2 20 5 16 5C16 11 11 15 4 15';
  const m = profileFace(mood, { eye: [7, -2], mouth: [8, 9], w: 6, r: 1.6 });
  const skin = oval(0, 0, 15, 15);
  return {
    lines: [hair, bun, back, face],
    fine: [dot(7, -2, 3.8), 'M3.2 -2.4L-3 -3', 'M-16 -16q3 3 6 1', 'M-2 -15q4 -2 9 0M-6 -11q6 -3 12 -1', ...m.fine],
    washes: [
      { c: PAL.rose, o: mood === 'strain' ? 0.5 : 0.3, d: skin },
      ...(mood === 'strain' ? [{ c: PAL.red, o: 0.3, d: skin }] : []),
      { c: PAL.grey, o: 0.85, d: `${hair}${bun}` },
      { c: PAL.rose, o: 0.7, d: dot(5, 6, 3) },
      ...m.washes,
    ],
    fills: m.fills,
    glints: m.glints,
  };
}

// Grandma (feet at 0,0), about 152 tall: a long red dress, a white apron, slate shoes. The hip is
// at (0, -66); the skirt hangs from the hip and its hem can swing by sway.
export const GM_H = 66;
export function grandma({ mood = 'happy', lean = 0, headTilt = 0, arms, legs, sway = 0, skirtTurn = 0 } = {}) {
  const body = 'M-12 4C-15 -14 -14 -38 -10 -50C-5 -57 6 -57 10 -50C15 -40 16 -16 13 4Z';
  const bib = 'M4 -40L13 -42C15 -30 15 -14 13 4L6 4Z';
  const torso = {
    lines: [body],
    fine: [bib, 'M-12 0q-6 2 -8 6M-12 0q-4 5 -3 9'],
    washes: [{ c: PAL.red, o: 0.62, d: body }],
    whites: [bib],
  };
  const s = sway;
  const skirt = `M-13 -2C-19 20 ${-24 + s * 0.6} 44 ${-27 + s} 60C${-9 + s} 66 ${12 + s} 66 ${30 + s} 60C${26 + s * 0.6} 44 20 20 14 -2Z`;
  const apron = `M5 -2C9 20 ${14 + s * 0.6} 42 ${18 + s} 63C${22 + s} 63 ${26 + s} 62 ${29 + s} 60C${25 + s * 0.6} 42 20 20 14 -2Z`;
  const lower = [
    place(
      {
        lines: [skirt],
        fine: [apron, `M-6 10q${-4 + s * 0.3} 20 ${-8 + s * 0.6} 46M6 14q${-1 + s * 0.3} 20 ${s * 0.6} 44`],
        washes: [{ c: PAL.red, o: 0.62, d: skirt }],
        whites: [apron],
      },
      `rotate(${skirtTurn})`,
    ),
  ];
  return poser({
    H: GM_H,
    torso,
    head: grandmaHead(mood),
    headAt: [3, -70],
    headScale: 1.05,
    headTilt,
    shoulder: [1, -46],
    lean,
    arms: arms ?? [
      [[-4, -92], [0, -72]],
      [[10, -94], [14, -74]],
    ],
    legs: legs ?? [
      [[-6, -10], [-5, -5]],
      [[6, -10], [8, -5]],
    ],
    armStyle: { w: 9.5, sleeve: PAL.red, o: 0.62, hand: 4.8 },
    legStyle: { w: 7, c: PAL.grey, o: 0.6, shoe: PAL.slate, fromHem: true },
    lower,
  });
}

// ---------------------------------------------------------------------------------------------
// The Granddaughter's head (centre 0,0): ochre hair with a fringe and two pigtails at the back tied
// with red ribbons, freckles, rosy cheeks.
function girlHead(mood) {
  const hair = 'M-13 4C-15 -8 -7 -15 2 -14C9 -14 13 -9 13 -4C9 -6 6 -5 4 -8C2 -5 -2 -4 -6 -3C-9 0 -11 3 -13 4Z';
  const tailA = 'M-11 -6C-19 -10 -26 -4 -26 4C-26 9 -22 9 -21 5C-20 0 -16 -2 -11 -1Z';
  const tailB = 'M-6 -12C-11 -21 -20 -22 -23 -16C-20 -15 -15 -13 -10 -8Z';
  const bows = 'M-12 -4L-16 -8L-16 -1ZM-12 -4L-9 -8L-8 -1ZM-8 -10L-11 -15L-6 -15Z';
  const back = 'M-12 3C-11 8 -7 11 -3 12';
  const face = 'M13 -4C14 -1 14 1 13 3C15 4 15 5 13 6C13 9 9 12 3 12';
  const m = profileFace(mood, { eye: [6, -1], mouth: [6, 6], w: 5, r: 1.6 });
  return {
    lines: [hair, tailA, tailB, back, face],
    fine: [bows, 'M-2 -12q2 4 1 7M5 -12q1 3 0 5', ...m.fine],
    washes: [
      { c: PAL.rose, o: mood === 'strain' ? 0.6 : 0.3, d: oval(0, 0, 13, 12) },
      { c: PAL.ochre, o: 0.9, d: `${hair}${tailA}${tailB}` },
      { c: PAL.red, o: 0.9, d: bows },
      { c: PAL.rose, o: 0.7, d: dot(4, 4, 2.6) },
      ...m.washes,
    ],
    fills: [...m.fills, dot(1, 2.5, 0.5), dot(3, 1.2, 0.5)],
    glints: m.glints,
  };
}

// The Granddaughter (feet at 0,0), about 105 tall: a sky-blue dress with a full skirt, bare legs,
// red shoes. The hip is at (0, -40). skirtBack(sway) says where the back of the skirt's hem is.
export const GD_H = 40;
const skirtPath = (s) => `M-10 -2C-15 8 ${-20 + s * 0.6} 17 ${-23 + s} 25C${-6 + s} 29 ${10 + s} 29 ${24 + s} 25C${21 + s * 0.6} 17 16 8 10 -2Z`;
export const skirtBack = (s = 0) => [-18 + s * 0.6, -GD_H + 14];
export function girl({ mood = 'happy', lean = 0, headTilt = 0, arms, legs, sway = 0, skirtTurn = 0 } = {}) {
  const body = 'M-9 2C-11 -10 -10 -26 -7 -34C-3 -39 4 -39 7 -34C10 -26 11 -10 9 2Z';
  const collar = 'M-3 -37C0 -33 4 -33 6 -36';
  const torso = { lines: [body], fine: [collar], washes: [{ c: PAL.sky, o: 0.7, d: body }] };
  const skirt = skirtPath(sway);
  const lower = [
    place(
      {
        lines: [skirt],
        fine: [`M-4 4q${-3 + sway * 0.3} 10 ${-5 + sway * 0.6} 20M5 4q${sway * 0.3} 10 ${2 + sway * 0.6} 21`],
        washes: [{ c: PAL.sky, o: 0.7, d: skirt }],
      },
      `rotate(${skirtTurn})`,
    ),
  ];
  return poser({
    H: GD_H,
    torso,
    head: girlHead(mood),
    headAt: [2, -51],
    headScale: 1.12,
    headTilt,
    shoulder: [0, -31],
    lean,
    arms: arms ?? [
      [[-4, -56], [-2, -44]],
      [[8, -58], [10, -46]],
    ],
    legs: legs ?? [
      [[-4, -17], [-4, -4]],
      [[5, -17], [6, -4]],
    ],
    armStyle: { w: 6.5, sleeve: PAL.rose, o: 0.4, hand: 3.6 },
    legStyle: { w: 5.5, c: PAL.rose, o: 0.4, shoe: PAL.red, boot: 0.8, fromHem: true },
    lower,
  });
}

// ---------------------------------------------------------------------------------------------
// The Dog: a brown-ochre dog facing right, floppy terracotta ears, a long straight tail. pose 'stand'
// or 'pull' (leaning back on his hind legs, front legs braced, head stretched forward with something
// held in his mouth). mood 'happy', 'strain' or 'laugh'. DOG_MOUTH[pose] is where his mouth grips;
// DOG_TAIL[pose] the tip of his tail.
function dogHead(mood) {
  const head = 'M-8 -2C-12 -16 -2 -26 10 -27C20 -28 26 -22 28 -16L40 -15C46 -14 47 -6 42 -2L26 -1C18 3 2 4 -8 -2Z';
  const ear = 'M6 -25C-2 -26 -8 -16 -6 -2C-2 1 3 -3 5 -9C7 -15 9 -21 6 -25Z';
  const out = {
    lines: [head, ear],
    fine: ['M16 -24q4 -2 7 0'],
    washes: [
      { c: PAL.ochre, o: 0.85, d: head },
      { c: PAL.terracotta, o: 0.85, d: ear },
    ],
    fills: [dot(43, -11, 3)],
    glints: [],
  };
  if (mood === 'strain') out.fine.push('M14 -20l5 2l-5 2', 'M28 -3q6 1 12 0');
  else if (mood === 'laugh') {
    const m = 'M27 -3C30 6 39 6 42 -2C37 -1 32 -1 27 -3Z';
    out.fine.push('M13 -17q3 -4 6 0', m);
    out.washes.push({ c: PAL.red, o: 0.7, d: m }, { c: PAL.rose, o: 0.9, d: 'M32 2C32 8 36 10 38 6Z' });
  } else {
    out.fills.push(dot(17, -17, 2.4));
    out.glints.push(dot(16.4, -17.8, 0.7));
    out.fine.push('M28 -4q5 2 9 -1');
  }
  return out;
}
const dogClose = (ls) => ls.map((d) => `${d}Z`).join('');
const DOG_HEAD = { stand: 'translate(26 -56)', pull: 'translate(30 -38) rotate(16)' };
export const DOG_MOUTH = { pull: at(44, -6, DOG_HEAD.pull) };
export const DOG_TAIL = { pull: [-54, -38], stand: [-50, -76] };
export function dog({ pose = 'pull', mood = 'happy' } = {}) {
  const body = 'M-34 -32C-38 -46 -24 -54 -6 -54C10 -54 24 -52 30 -46C36 -40 34 -30 26 -26C14 -22 -10 -22 -24 -24C-30 -26 -33 -28 -34 -32Z';
  const legs =
    pose === 'pull'
      ? [
          limb([[-24, -28, 10], [-34, -16, 8], [-28, -3, 7]]),
          limb([[-14, -26, 9], [-22, -14, 7.5], [-16, -3, 7]]),
          limb([[16, -28, 9], [30, -16, 7.5], [38, -3, 7]]),
          limb([[24, -30, 9], [38, -18, 7.5], [46, -3, 7]]),
        ]
      : [
          limb([[-26, -30, 10], [-28, -16, 7.5], [-26, -3, 7]]),
          limb([[-16, -28, 9], [-16, -16, 7.5], [-14, -3, 7]]),
          limb([[16, -30, 9], [18, -16, 7.5], [18, -3, 7]]),
          limb([[24, -30, 9], [27, -16, 7.5], [28, -3, 7]]),
        ];
  const tail = pose === 'pull' ? limb([[-32, -38, 8.5], [-42, -39, 7.5], [-52, -38, 7]]) : limb([[-32, -44, 6], [-44, -56, 5], [-48, -74, 4]]);
  return merge(
    {
      lines: [tail, ...legs, body],
      fine: ['M-20 -48q6 4 14 2', 'M-8 -30q8 3 16 0'],
      washes: [
        { c: PAL.ochre, o: 0.85, d: `${body}${dogClose(legs)}${tail}Z` },
        { c: PAL.terracotta, o: 0.35, d: `${legs[0]}Z${legs[1]}ZM-24 -52C-12 -55 4 -55 12 -52C4 -48 -12 -48 -24 -50Z` },
      ],
    },
    place(dogHead(mood), DOG_HEAD[pose]),
  );
}

// ---------------------------------------------------------------------------------------------
// The Cat (she): a grey cat with slate stripes, standing up on her hind legs like a person, facing
// right, her tail curling behind her. mood 'happy', 'strain' or 'laugh'.
function catHead(mood) {
  const head = 'M-12 0C-13 -10 -6 -14 1 -14C9 -14 13 -9 13 -2C14 3 16 4 15 6C13 9 8 11 1 11C-7 11 -12 7 -12 0Z';
  const ears = 'M-9 -9L-9 -24L-1 -14M3 -14L10 -24L10 -9';
  const m = profileFace(mood, { eye: [5, -3], mouth: [9, 7], w: 4, r: 1.7 });
  return {
    lines: [head, ears],
    fine: ['M-4 -13l1 4M0 -14l0 4', 'M10 4l12 -3M10 6l12 3', ...m.fine],
    washes: [
      { c: PAL.grey, o: 0.9, d: `${head}M-9 -9L-9 -24L-1 -14ZM3 -14L10 -24L10 -9Z` },
      { c: PAL.slate, o: 0.45, d: 'M-4 -13l1 4l1.5 0l-1 -4.5ZM0 -14l0 4l1.5 0l0 -4Z' },
      { c: PAL.rose, o: 0.8, d: 'M-7 -12L-7 -20L-3 -14ZM14 3L16 5L13 6Z' },
      ...m.washes,
    ],
    fills: m.fills,
    glints: m.glints,
  };
}
export const CAT_H = 14;
export function cat({ mood = 'happy', lean = 0, arms, legs } = {}) {
  const body = 'M-10 4C-14 -6 -13 -24 -7 -32C-2 -37 6 -36 9 -30C13 -20 12 -6 9 4Z';
  const stripes = 'M-12 -20q4 0 6 3M-12 -10q4 0 6 3M10 -22q-3 1 -4 4';
  const tail = limb([[-9, -4, 6], [-17, -8, 5.5], [-21, -20, 5], [-17, -32, 4.5]]);
  const torso = {
    lines: [body],
    fine: [stripes, 'M0 -30C4 -22 5 -10 3 0'],
    washes: [
      { c: PAL.grey, o: 0.9, d: body },
      { c: PAL.paper, o: 0.5, d: 'M2 -30C6 -22 7 -10 6 2L9 2C12 -8 12 -20 9 -28Z' },
    ],
  };
  const lower = [{ lines: [tail], fine: ['M-19 -12l4 -2M-20 -24l4 1'], washes: [{ c: PAL.grey, o: 0.9, d: `${tail}Z` }] }];
  return poser({
    H: CAT_H,
    torso,
    head: catHead(mood),
    headAt: [2, -44],
    headScale: 1,
    shoulder: [2, -28],
    lean,
    arms: arms ?? [
      [[-2, -32], [2, -24]],
      [[8, -34], [12, -26]],
    ],
    legs: legs ?? [
      [[-4, -6], [-3, -3]],
      [[5, -6], [6, -3]],
    ],
    armStyle: { w: 6, sleeve: PAL.grey, o: 0.9, hand: 3.4, skin: PAL.grey },
    legStyle: { w: 7, c: PAL.grey, o: 0.9, paw: true },
    lower,
  });
}

// ---------------------------------------------------------------------------------------------
// The Mouse: a tiny brown mouse with big round pink ears, a pointed nose and a long thin tail,
// standing on his hind legs, facing right, about 34 tall. arms: 'down', 'up' (waving, cheering) or
// 'peep' (only his head and paws, peeping over something at y = 0).
export function mouse({ arms = 'down', mood = 'happy' } = {}) {
  const head = 'M-8 -30C-10 -38 -4 -43 2 -42C7 -41 10 -38 13 -34C15 -32 17 -31 17 -29C16 -26 10 -25 4 -24C-2 -23 -7 -25 -8 -30Z';
  const ear = dot(-3, -43, 6);
  const earIn = dot(-3, -43, 3.4);
  const m = profileFace(mood, { eye: [5, -34], mouth: [9, -28], w: 4, r: 1.5 });
  const nose = dot(17, -30, 1.6);
  const headPart = {
    lines: [head, ear],
    fine: ['M13 -29l9 -3M13 -28l9 2', ...m.fine],
    washes: [
      { c: PAL.terracotta, o: 0.5, d: `${head}${ear}` },
      { c: PAL.grey, o: 0.7, d: `${head}${ear}` },
      { c: PAL.rose, o: 0.9, d: earIn },
      ...m.washes,
    ],
    fills: [...m.fills, nose],
    glints: m.glints,
  };
  if (arms === 'peep') {
    const paws = `${dot(-1, -20, 2.6)}${dot(9, -20, 2.6)}`;
    return place(merge(headPart, { fine: [paws], washes: [{ c: PAL.rose, o: 0.8, d: paws }] }), 'translate(0 20)');
  }
  const body = 'M-7 0C-10 -8 -9 -20 -3 -25C2 -27 7 -24 8 -18C9 -10 8 -4 5 0Z';
  const tail = 'M-7 -3C-16 -2 -22 -6 -26 -12C-28 -16 -32 -16 -34 -12';
  const armPts =
    arms === 'up'
      ? [limb([[-4, -20, 3.6], [-14, -23, 3.2], [-20, -31, 3]]), limb([[5, -20, 3.6], [15, -21, 3.2], [22, -28, 3]])]
      : [limb([[2, -20, 3.6], [8, -16, 3.2], [11, -12, 3]])];
  const feet = 'M-5 0C-6 -2 -2 -3 2 -1L3 0ZM2 0C2 -2 6 -3 9 -1L9 0Z';
  return merge(
    {
      lines: [body, ...armPts, feet],
      once: [tail],
      fine: ['M0 -20C3 -14 3 -6 1 -1'],
      washes: [
        { c: PAL.terracotta, o: 0.5, d: `${body}${dogClose(armPts)}` },
        { c: PAL.grey, o: 0.7, d: `${body}${dogClose(armPts)}` },
        { c: PAL.rose, o: 0.7, d: feet },
      ],
    },
    headPart,
  );
}

// ---------------------------------------------------------------------------------------------
// The enormous turnip (centre of its base on the ground at 0,0): a great cream bulb, rose-purple at
// the top, about 160 wide and 130 tall above the ground, with huge lobed green leaves. When whole
// (out of the ground) its pointed bottom and roots show. CROWN is where the leaves grow from.
export const CROWN = [0, -147];
const bulbTop = 'M-88 0C-102 -52 -80 -128 -22 -146C-10 -150 10 -150 22 -146C80 -128 102 -52 88 0';
const bulbBottom = 'C78 30 30 52 7 72C3 84 1 96 -1 110C-2 96 -3 84 -7 72C-30 52 -78 30 -88 0Z';
const purple = 'M-92 -74C-88 -106 -70 -132 -22 -146C-10 -150 10 -150 22 -146C70 -132 88 -106 92 -74C62 -84 40 -64 6 -76C-28 -86 -56 -64 -92 -74Z';

/** A big lobed leaf growing up from its stalk at (0,0), len long, w wide, bending sideways by bend. */
export function leaf(len = 110, w = 46, bend = 0.3) {
  const n = 26;
  const S = 0.3; // the bare stalk is the first part
  const c = (t) => [bend * len * t * t, -len * t];
  const L = [];
  const R = [];
  for (let i = 0; i <= n; i++) {
    const t = S + ((1 - S) * i) / n;
    const u = (t - S) / (1 - S);
    const [x, y] = c(t);
    const [x2, y2] = c(Math.min(1, t + 0.01));
    const [x1, y1] = c(Math.max(0, t - 0.01));
    const l = Math.hypot(x2 - x1, y2 - y1);
    const [nx, ny] = [-(y2 - y1) / l, (x2 - x1) / l];
    const lobe = 1 + 0.12 * Math.sin(u * Math.PI * 9);
    const half = ((w / 2) * Math.pow(Math.sin(Math.PI * Math.min(1, u * 1.04)), 0.6) || 0) * lobe;
    L.push([x + nx * half, y + ny * half]);
    R.push([x - nx * half, y - ny * half]);
  }
  const pts = [...L, ...R.reverse()];
  const blade = `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}Z`;
  const mid = [0, 0.3, 0.55, 0.8, 1].map((t) => c(t));
  const rib = `M0 0${mid.slice(1).map(([x, y]) => `L${f(x)} ${f(y)}`).join('')}`;
  const veins = [0.45, 0.6, 0.75, 0.88]
    .map((t, i) => {
      const [x, y] = c(t);
      const k = (w / 2) * 0.7 * (1 - (t - 0.4) * 0.8);
      const s = i % 2 ? 1 : -1;
      return `M${f(x)} ${f(y)}q${f(s * k * 0.5)} ${f(-k * 0.2)} ${f(s * k)} ${f(-k * 0.6)}M${f(x)} ${f(y)}q${f(-s * k * 0.5)} ${f(-k * 0.2)} ${f(-s * k)} ${f(-k * 0.6)}`;
    })
    .join('');
  const stalk = limb([[0, 0, 5], [c(S * 0.5)[0], c(S * 0.5)[1], 4.5], [c(S)[0], c(S)[1], 4]]);
  return {
    lines: [blade],
    fine: [rib, veins, stalk],
    washes: [
      { c: PAL.green, o: 0.8, d: blade },
      { c: PAL.green, o: 0.35, d: `M${L.map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}L${f(c(1)[0])} ${f(c(1)[1])}Z` },
      { c: PAL.green, o: 0.9, d: `${stalk}Z` },
    ],
  };
}

/**
 * The turnip. whole: draws it out of the ground, with its root. leaves: [angle, len, width, bend] for
 * each leaf from the crown. grip: [x, y], where a hand holds a bundle of stalks; held: the leaves
 * that grow from that hand ([angle, len, width, bend]).
 */
export function turnip({ whole = false, leaves, grip, held = [] } = {}) {
  const outline = whole ? `${bulbTop}${bulbBottom}` : bulbTop;
  const fill = whole ? outline : `${bulbTop}C40 4 -40 4 -88 0Z`;
  const ribs = 'M-62 -96C-76 -70 -78 -40 -70 -12M66 -60C72 -40 70 -24 66 -10M-30 -30q2 8 0 14M40 -24q2 6 1 12';
  const streaks = 'M-62 -76q4 8 2 16M-34 -76q3 6 1 12M8 -74q3 8 1 14M46 -76q4 6 2 12';
  const parts = [];
  const leafList = leaves ?? [
    [-62, 126, 72, -0.48],
    [-34, 130, 70, -0.3],
    [2, 118, 64, 0.05],
    [34, 128, 70, 0.32],
    [62, 128, 70, 0.42],
  ];
  for (const [a, len, w, bend] of leafList) parts.push(place(leaf(len, w, bend), `translate(${CROWN[0]} ${CROWN[1] + 4}) rotate(${a})`));
  const extra = { lines: [], fine: [], washes: [] };
  if (grip) {
    const [gx, gy] = grip;
    const [cx, cy] = [CROWN[0], CROWN[1] + 2];
    const mx = (cx + gx) / 2;
    const my = Math.min(cy, gy) - 14;
    for (const dy of [-2.5, 2.5]) {
      const s = limb([[cx, cy, 5], [mx, my + dy, 4.6], [gx, gy + dy, 4.4]]);
      extra.fine.push(s);
      extra.washes.push({ c: PAL.green, o: 0.9, d: `${s}Z` });
    }
    for (const [a, len, w, bend] of held) parts.push(place(leaf(len, w, bend), `translate(${gx} ${gy}) rotate(${a})`));
  }
  const body = {
    lines: [outline, 'M-7 -147C-5 -153 5 -153 7 -147'],
    fine: [ribs, streaks, ...(whole ? ['M-46 34q-8 6 -16 6M36 38q8 4 14 12M-12 62q-8 6 -10 14M9 66q8 8 10 16M-34 16l-7 2M58 16l7 3'] : [])],
    washes: [
      { c: PAL.ochre, o: 0.16, d: fill },
      { c: PAL.grey, o: 0.22, d: `${whole ? 'M-88 0C-78 30 -30 52 -7 72L-1 110C0 80 -12 46 -34 12C-58 -24 -70 -70 -58 -116C-84 -92 -96 -46 -88 0Z' : 'M-88 0C-96 -46 -84 -92 -58 -116C-70 -70 -62 -28 -46 2Z'}` },
      { c: PAL.rose, o: 0.75, d: purple },
      { c: PAL.slate, o: 0.28, d: purple },
    ],
    glints: ['M34 -132C50 -124 60 -112 66 -98C56 -108 46 -118 34 -128Z'],
  };
  return merge(...parts, body, extra);
}

/** The earth heaped round the turnip's base (centre 0,0), about 220 wide. */
export function mound(w = 110) {
  const d = `M${-w} 4C${-w * 0.8} -6 ${-w * 0.6} -8 ${-w * 0.45} -4C${-w * 0.2} 0 ${w * 0.2} 0 ${w * 0.45} -4C${w * 0.6} -8 ${w * 0.8} -6 ${w} 4C${w * 0.5} 8 ${-w * 0.5} 8 ${-w} 4Z`;
  return {
    fine: [`M${-w} 4C${-w * 0.8} -6 ${-w * 0.6} -8 ${-w * 0.45} -4M${w * 0.45} -4C${w * 0.6} -8 ${w * 0.8} -6 ${w} 4`],
    washes: [{ c: PAL.terracotta, o: 0.6, d }],
  };
}

/** A little sky-blue bird sitting, facing left, its feet at (0,0), about 22 tall. */
export function bird() {
  const body = 'M-10 -10C-10 -18 -4 -22 2 -20C8 -18 12 -12 16 -10C12 -6 6 -2 -2 -2C-7 -2 -10 -5 -10 -10Z';
  const head = dot(-6, -18, 5.5);
  const beak = 'M-11 -19L-16 -17L-11 -16Z';
  return {
    lines: [body, head],
    fine: [beak, 'M-1 -2L-2 1M3 -2L3 1', 'M0 -12q5 3 10 1'],
    washes: [
      { c: PAL.sky, o: 0.9, d: `${body}${head}` },
      { c: PAL.ochre, o: 0.95, d: beak },
      { c: PAL.rose, o: 0.5, d: 'M-10 -10C-8 -6 -4 -4 0 -4C-3 -8 -6 -10 -10 -10Z' },
    ],
    fills: [dot(-7, -19, 1.3)],
  };
}
