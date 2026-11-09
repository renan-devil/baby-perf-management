import { PAL, transformPath } from '../lib.mjs';

// The Three Little Pigs: the characters (and the brick house) shared by the five pictures, drawn once
// here and placed in each picture with a transform (place). The build only draws files named <n>.mjs,
// so this file is not a picture. Every character stands with its feet at y = 0.

const f = (n) => Math.round(n * 10) / 10;

/** A round dot (eye, pupil, glint) as path data. */
export const dot = (x, y, r) => `M${f(x - r)} ${f(y)}a${r} ${r} 0 1 0 ${f(2 * r)} 0a${r} ${r} 0 1 0 ${f(-2 * r)} 0Z`;

/** A smooth limb (leg, arm, tail) along a centreline of [x, y, width] points, open at the root. */
export function limb(pts) {
  const n = pts.length;
  const side = (s) =>
    pts.map(([x, y, w], i) => {
      const a = pts[Math.max(0, i - 1)];
      const b = pts[Math.min(n - 1, i + 1)];
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      return [x - (s * (b[1] - a[1]) * w) / 2 / l, y + (s * (b[0] - a[0]) * w) / 2 / l];
    });
  const curve = (P) =>
    P.slice(1)
      .map((p2, j) => {
        const p0 = P[Math.max(0, j - 1)];
        const p1 = P[j];
        const p3 = P[Math.min(P.length - 1, j + 2)];
        return `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
      })
      .join('');
  const L = side(1);
  const R = side(-1).reverse();
  const [ex, ey, ew] = pts[n - 1];
  const [px, py] = pts[n - 2];
  const k = (ew * 0.66) / Math.hypot(ex - px, ey - py);
  const cap = `C${f(L[n - 1][0] + (ex - px) * k)} ${f(L[n - 1][1] + (ey - py) * k)} ${f(R[0][0] + (ex - px) * k)} ${f(R[0][1] + (ey - py) * k)} ${f(R[0][0])} ${f(R[0][1])}`;
  return `M${f(L[0][0])} ${f(L[0][1])}${curve(L)}${cap}${curve(R)}`;
}

// A character: { lines: [d], fine: [d], washes: [{c, o, d}], whites: [d], fills: [d], glints: [d] }.
const tr = (d, t) => (t ? transformPath(d, t) : d);

/** Places a character with an SVG transform string (applied to the coordinates themselves). */
export function place(ch, t) {
  return {
    lines: (ch.lines ?? []).map((d) => tr(d, t)),
    fine: (ch.fine ?? []).map((d) => tr(d, t)),
    washes: (ch.washes ?? []).map((w) => ({ ...w, d: tr(w.d, t) })),
    whites: (ch.whites ?? []).map((d) => tr(d, t)),
    fills: (ch.fills ?? []).map((d) => tr(d, t)),
    glints: (ch.glints ?? []).map((d) => tr(d, t)),
  };
}

/** Joins placed characters with the scene's own shapes into the drawing that svg() takes. */
export function compose({ title, seed, washes = [], after = [], whites = '', lines = [], fine = [], once = '', fills = '', glints = '', parts = [] }) {
  const all = (k) => parts.flatMap((p) => p[k]);
  const pathTags = (list) => list.map((d) => `<path d="${d}"/>`).join('');
  return {
    title,
    seed,
    washes: [...washes, ...all('washes'), ...after],
    whites: [whites, ...all('whites')].filter(Boolean).join(''),
    lines: pathTags([...lines, ...all('lines')]),
    fine: pathTags([...fine, ...all('fine')]),
    once,
    fills: fills + pathTags(all('fills')),
    glints: glints + pathTags(all('glints')),
  };
}

const mirror = (pts) => pts.map(([x, y, w]) => [-x, y, w]);

// ---------------------------------------------------------------------------------------------
// A little pig, standing on his hind legs and facing us: round pink head with a big snout, floppy
// ears, a pear-shaped body, a curly tail and a neckerchief whose colour tells the brothers apart
// (straw: green, sticks: sky, bricks: slate). Feet at (0,0), about 110 tall.
//   arms: [left, right] poses, each 'down', 'out', 'up', 'hip' or 'front' (seen from the front,
//         left = our left);  legs: 'stand', 'run' or 'jump';  mouth: 'smile' or 'open'.
const ARMS = {
  down: [[-17, -46, 8], [-23, -36, 7], [-25, -25, 7]],
  out: [[-17, -46, 8], [-29, -45, 7], [-37, -52, 7]],
  up: [[-17, -48, 8], [-26, -60, 7], [-29, -75, 7]],
  hip: [[-17, -46, 8], [-29, -40, 7], [-21, -30, 7]],
  front: [[-17, -46, 8], [-21, -36, 7], [-11, -31, 7]],
  wave: [[-17, -48, 8], [-31, -54, 7], [-36, -68, 7]],
};
/** Where a pig's hand is for an arm pose (side -1 = our left, 1 = our right). */
export const pigHand = (pose, side = -1) => {
  const [x, y] = ARMS[pose][ARMS[pose].length - 1];
  return [side < 0 ? x : -x, y];
};

const pHead = 'M-22 -74C-23 -88 -12 -96 0 -96C13 -96 23 -88 22 -74C21 -62 12 -55 0 -55C-12 -55 -21 -62 -22 -74Z';
const pEars = 'M-15 -90C-21 -98 -22 -107 -18 -112C-11 -108 -6 -102 -5 -95ZM5 -95C7 -102 12 -108 19 -111C22 -105 21 -97 15 -90Z';
const pInnerEars = 'M-14 -93C-17 -98 -17 -103 -16 -107C-12 -104 -9 -100 -8 -96ZM8 -96C10 -101 13 -104 17 -106C18 -102 17 -97 14 -93Z';
const pSnout = 'M-9 -70C-9 -77 9 -77 9 -70C9 -63 -9 -63 -9 -70Z';
const pBody = 'M-13 -57C-23 -50 -25 -30 -21 -18C-17 -10 17 -10 21 -18C25 -30 23 -50 13 -57';
const pBodyFill = 'M-13 -57C-23 -50 -25 -30 -21 -18C-17 -10 17 -10 21 -18C25 -30 23 -50 13 -57Z';
const pTail = 'M19 -16c6 -2 10 2 7 6c-3 3 -7 0 -5 -3c2 -2 7 -1 8 3';
const pScarf = 'M-13 -58C-6 -52 6 -52 13 -58L13 -52C6 -47 -6 -47 -13 -52ZM3 -50L9 -40L13 -49Z';
const LEGS = {
  stand: { lines: 'M-12 -15L-12 0L-3 0L-3 -12M3 -12L3 0L12 0L12 -15', hooves: 'M-12 -4L-3 -4L-3 0L-12 0ZM3 -4L12 -4L12 0L3 0Z', fill: 'M-12 -15L-12 0L-3 0L-3 -12ZM3 -12L3 0L12 0L12 -15Z' },
  run: {
    lines: limb([[-8, -14, 9], [-18, -6, 8], [-26, -4, 8]]) + limb([[8, -14, 9], [12, -6, 8], [11, 2, 8]]),
    hooves: 'M-25 -8L-29 -1L-24 0L-21 -6ZM7 -2L15 -2L15 2L7 2Z',
    fill: `${limb([[-8, -14, 9], [-18, -6, 8], [-26, -4, 8]])}Z${limb([[8, -14, 9], [12, -6, 8], [11, 2, 8]])}Z`,
  },
  jump: {
    lines: limb([[-9, -14, 9], [-16, -8, 8], [-12, -1, 8]]) + limb([[9, -14, 9], [16, -8, 8], [12, -1, 8]]),
    hooves: 'M-16 -3L-9 1L-8 -3L-13 -5ZM16 -3L9 1L8 -3L13 -5Z',
    fill: `${limb([[-9, -14, 9], [-16, -8, 8], [-12, -1, 8]])}Z${limb([[9, -14, 9], [16, -8, 8], [12, -1, 8]])}Z`,
  },
};

export function pig({ scarf = PAL.green, arms = ['down', 'down'], legs = 'stand', mouth = 'smile', tail = true } = {}) {
  const armL = limb(ARMS[arms[0]]);
  const armR = limb(mirror(ARMS[arms[1]]));
  const L = LEGS[legs];
  const smile = mouth === 'open' ? 'M-6 -62C-5 -57 5 -57 6 -62C2 -60 -2 -60 -6 -62Z' : 'M-6 -61Q0 -57 6 -61';
  return {
    lines: [pHead, pEars, pBody, armL, armR, L.lines, ...(tail ? [pTail] : [])],
    fine: [pSnout, smile, 'M-13 -52C-6 -47 6 -47 13 -52M3 -50L9 -40L13 -49', 'M-3 -3L-7 -3M3 -3L7 -3'],
    washes: [
      { c: PAL.rose, o: 0.62, d: `${pHead}${pEars}${pBodyFill}${armL}Z${armR}Z${L.fill}` },
      { c: PAL.rose, o: 0.7, d: `${pSnout}${pInnerEars}${dot(-14, -66, 4)}${dot(14, -66, 4)}` },
      { c: scarf, o: 0.85, d: pScarf },
      { c: PAL.slate, o: 0.7, d: L.hooves },
      ...(mouth === 'open' ? [{ c: PAL.red, o: 0.7, d: smile }] : []),
    ],
    fills: [dot(-8, -81, 2.2), dot(8, -81, 2.2), dot(-3.5, -70, 1.5), dot(3.5, -70, 1.5)],
    glints: [dot(-8.6, -81.8, 0.7), dot(7.4, -81.8, 0.7)],
  };
}

/** Just a pig's head (centre of the face at 0,0), for peeping out of a window. */
export function pigFace({ mouth = 'smile' } = {}) {
  const p = pig({ mouth });
  const keep = (d) => transformPath(d, 'translate(0 74)');
  const smile = mouth === 'open' ? 'M-6 -62C-5 -57 5 -57 6 -62C2 -60 -2 -60 -6 -62Z' : 'M-6 -61Q0 -57 6 -61';
  return {
    lines: [keep(pHead), keep(pEars)],
    fine: [keep(pSnout), keep(smile)],
    washes: [
      { c: PAL.rose, o: 0.62, d: keep(pHead + pEars) },
      { c: PAL.rose, o: 0.7, d: keep(`${pSnout}${pInnerEars}${dot(-14, -66, 4)}${dot(14, -66, 4)}`) },
    ],
    fills: p.fills.map(keep),
    glints: p.glints.map(keep),
  };
}

// Things the pigs carry, drawn around their middle (0,0).
/** A bundle of straw, tied round the middle with a band. */
export function straw() {
  const outline = 'M-10 -26C-14 -14 -8 -6 -4 0C-8 6 -14 16 -12 28C-4 30 6 30 14 26C14 16 8 6 4 0C8 -6 14 -16 12 -26C4 -30 -4 -30 -10 -26Z';
  const stalks = 'M-6 -27L-2 0L-8 27M-1 -28L0 0L-3 28M4 -28L2 0L4 28M9 -26L3 0L10 26M-11 -24L-4 -4M12 -23L5 -4M-11 24L-4 4M12 23L5 4';
  const band = 'M-6 -3C-2 -1 2 -1 6 -3L6 3C2 5 -2 5 -6 3Z';
  return {
    lines: [outline],
    fine: [stalks, band],
    washes: [
      { c: PAL.ochre, o: 0.75, d: outline },
      { c: PAL.terracotta, o: 0.7, d: band },
    ],
  };
}
/** A bundle of sticks, crossed at the middle and tied. */
export function sticks() {
  const s = ['M-14 -26L10 26', 'M-6 -29L4 28', 'M4 -29L-4 28', 'M13 -26L-10 26', 'M0 -30L0 29'];
  const fill = 'M-15 -27L-12 -28L12 26L9 27ZM-7 -30L-4 -30L6 28L3 28ZM3 -30L6 -30L-2 28L-5 28ZM12 -27L15 -26L-9 27L-11 26ZM-2 -30L2 -30L2 29L-2 29Z';
  return {
    lines: s,
    fine: ['M-7 -3C-3 -1 3 -1 7 -3M-7 2C-3 4 3 4 7 2', 'M-9 -16l-4 -2M7 14l4 1'],
    washes: [
      { c: PAL.terracotta, o: 0.85, d: fill },
      { c: PAL.ochre, o: 0.5, d: 'M-7 -3C-3 -1 3 -1 7 -3L7 2C3 4 -3 4 -7 2Z' },
    ],
  };
}
/** One red brick, seen a little from above. */
export function brick() {
  const front = 'M-16 -4L14 -4L14 9L-16 9Z';
  const top = 'M-16 -4L-10 -10L20 -10L14 -4ZM14 -4L20 -10L20 3L14 9Z';
  return {
    lines: [`${front}${top}`],
    fine: ['M-10 2l2 1M2 -1l3 1M6 5l2 -1'],
    washes: [
      { c: PAL.red, o: 0.8, d: front },
      { c: PAL.terracotta, o: 0.8, d: top },
    ],
  };
}
/** A trowel, handle at (0,0), blade pointing right. */
export function trowel() {
  const handle = 'M-14 -2C-14 -5 -2 -5 0 -3L0 3C-2 5 -14 5 -14 2Z';
  const blade = 'M0 0L6 0M6 -6L24 0L6 6Z';
  return {
    lines: [handle, blade],
    washes: [
      { c: PAL.ochre, o: 0.8, d: handle },
      { c: PAL.grey, o: 0.6, d: 'M6 -6L24 0L6 6Z' },
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// The Big Bad Wolf: a lanky, scruffy grey wolf on his hind legs, facing right, with a long snout,
// tall pointy ears, big round goofy eyes and a bushy tail. Silly, never scary: no teeth. Feet at
// (0,0), about 170 tall.  pose 'puff' (cheeks blown up, hands on hips) or 'ow' (holding his hot
// bottom, mouth open in an "OW"); red turns his face red with effort.
const wBody = 'M-8 -104C-28 -96 -34 -70 -30 -48C-26 -30 -14 -24 0 -24C16 -24 28 -32 30 -50C32 -70 24 -96 8 -104';
const wBodyFill = `${wBody}Z`;
const wBelly = 'M5 -88C-5 -78 -7 -56 -1 -44C5 -36 15 -38 19 -48C23 -62 21 -80 13 -90Z';
const wFur = 'M-30 -60l-5 -2M-29 -52l-6 1M-28 -70l-5 -3M22 -96l4 -4M27 -86l5 -2';
const wTail = 'M-26 -38C-42 -36 -56 -44 -64 -60C-58 -60 -60 -68 -54 -70C-50 -62 -44 -56 -36 -54C-40 -60 -40 -66 -36 -68C-33 -61 -31 -57 -28 -54';
const wTailTip = 'M-64 -60C-58 -60 -60 -68 -54 -70C-52 -65 -50 -62 -48 -59C-54 -56 -60 -56 -64 -60Z';
const wLegs = {
  stand: [limb([[-12, -32, 14], [-14, -16, 11], [-13, -4, 10]]), limb([[12, -32, 14], [13, -16, 11], [13, -4, 10]])],
  dangle: [limb([[-12, -32, 14], [-18, -16, 11], [-20, -4, 10]]), limb([[12, -32, 14], [16, -18, 11], [22, -8, 10]])],
};
const wFeet = {
  stand: 'M-22 0C-24 -8 -6 -10 0 -5C3 -1 -2 1 -10 1C-16 1 -21 1 -22 0ZM4 0C2 -8 20 -10 26 -5C29 -1 24 1 16 1C10 1 5 1 4 0Z',
  dangle: 'M-28 -2C-30 -10 -12 -9 -10 -3C-9 1 -14 2 -20 2C-25 2 -28 1 -28 -2ZM14 -8C14 -16 32 -14 34 -8C35 -3 30 -2 24 -2C18 -2 14 -4 14 -8Z',
};
const wSkull = 'M-18 -122C-20 -138 -8 -148 6 -146C18 -144 24 -138 26 -132C38 -132 50 -130 56 -126C61 -122 59 -114 52 -112C42 -110 30 -108 20 -106C6 -104 -16 -108 -18 -122Z';
const wEars = 'M-11 -139L-18 -166L1 -146ZM6 -146L12 -170L20 -140Z';
const wInnerEars = 'M-10 -143L-14 -158L-4 -146ZM9 -146L12 -161L16 -142Z';
const wTuft = 'M-4 -146l-3 -7M1 -147l1 -8M6 -146l4 -6';
const wCheek = 'M18 -118C16 -134 42 -138 46 -122C49 -108 22 -102 18 -118Z';
const hotBottomLine = 'M-29 -62C-48 -62 -52 -32 -36 -24C-28 -20 -18 -21 -11 -25';
const hotBottom = `${hotBottomLine}C-20 -30 -27 -44 -29 -62Z`;
const ARMS_W = {
  puff: [limb([[-22, -92, 11], [-38, -76, 10], [-27, -62, 9]]), limb([[18, -92, 11], [32, -78, 10], [22, -64, 9]])],
  ow: [limb([[-16, -94, 11], [-36, -82, 10], [-40, -62, 10]]), limb([[16, -90, 11], [36, -82, 10], [52, -74, 9]])],
};

export function wolf({ pose = 'puff', red = false } = {}) {
  const legs = pose === 'ow' ? wLegs.dangle : wLegs.stand;
  const feet = pose === 'ow' ? wFeet.dangle : wFeet.stand;
  const arms = ARMS_W[pose];
  const eyeL = dot(10, -130, 6.5);
  const mouth =
    pose === 'puff'
      ? 'M56 -114C56 -118 62 -118 62 -114C62 -110 56 -110 56 -114Z'
      : 'M26 -108C32 -98 46 -94 54 -104C55 -108 54 -111 52 -112C42 -110 32 -110 26 -108Z';
  const brows = pose === 'puff' ? 'M2 -140Q10 -144 18 -139' : 'M0 -146Q10 -152 20 -146';
  const ow = pose === 'ow';
  // when his bottom is hot, it bulges out red and his tail trails stiffly below it
  const TU = 'translate(-8 14) rotate(-62 -27 -40)';
  const tail = ow ? transformPath(wTail, TU) : wTail;
  const tailTip = ow ? transformPath(wTailTip, TU) : wTailTip;
  return {
    lines: [tail, wBody, ...legs, wSkull, wEars, ...arms, ...(pose === 'puff' ? [wCheek] : [mouth, hotBottomLine])],
    fine: [wFur, wTuft, wInnerEars, feet, eyeL, brows, ...(ow ? [] : [mouth]), 'M-18 -10l3 0M18 -10l-3 0'],
    washes: [
      // a hot bottom is left out of the grey, so it glows bright red
      ...(ow
        ? [
            { c: PAL.slate, o: 0.62, d: `${wBodyFill}${hotBottom}`, rule: 'evenodd' },
            { c: PAL.slate, o: 0.62, d: `${tail}Z${legs[0]}Z${legs[1]}Z${wSkull}${wEars}${arms[0]}Z${arms[1]}Z` },
          ]
        : [{ c: PAL.slate, o: 0.62, d: `${wBodyFill}${tail}Z${legs[0]}Z${legs[1]}Z${wSkull}${wEars}${arms[0]}Z${arms[1]}Z` }]),
      { c: PAL.grey, o: 0.5, d: `${tailTip}${feet}` },
      { c: PAL.rose, o: 0.75, d: wInnerEars },
      ...(pose === 'puff' ? [{ c: red ? PAL.red : PAL.rose, o: red ? 0.75 : 0.55, d: wCheek }] : []),
      ...(red ? [{ c: PAL.red, o: 0.45, d: wSkull }] : []),
      ...(ow
        ? [
            { c: PAL.red, o: 0.9, d: hotBottom },
            { c: PAL.ink, o: 0.7, d: mouth },
            { c: PAL.rose, o: 0.9, d: 'M34 -102C38 -98 46 -97 50 -101C46 -104 38 -105 34 -102Z' },
          ]
        : []),
    ],
    whites: [wBelly, eyeL],
    fills: [dot(ow ? 10 : 12, ow ? -130 : -129, ow ? 1.7 : 2.4), 'M53 -124C53 -130 62 -130 62 -124C62 -119 53 -119 53 -124Z'],
    glints: [...(ow ? [] : [dot(11.3, -130, 0.8)]), dot(56, -126, 1)],
  };
}

// ---------------------------------------------------------------------------------------------
// The third pig's brick house (bottom centre at 0,0): red brick walls, a slate roof, a chimney on
// the right, a round-topped door and one window. windowFaces puts the three pigs peeping out.
const hWall = 'M-62 0L-62 -78L62 -78L62 0Z';
const hRoof = 'M-74 -76L0 -132L74 -76Z';
const hChimney = 'M30 -108L30 -142L48 -142L48 -94';
const hChimneyFill = 'M30 -108L30 -142L48 -142L48 -94Z';
const hChimneyTop = 'M27 -142L51 -142L51 -149L27 -149Z';
const hDoor = 'M-14 0L-14 -34C-14 -46 14 -46 14 -34L14 0';
const hDoorFill = `${hDoor}Z`;
const hWindow = 'M22 -64L54 -64L54 -34L22 -34Z';
const hWindow2 = 'M-54 -64L-22 -64L-22 -34L-54 -34Z';

function bricks() {
  let d = '';
  // courses of bricks like the wall the pig built (picture 2), around the door and windows; a few
  // bricks are left out, as a painter would
  for (let i = 0; i < 9; i++) {
    const y = -9 * (i + 1);
    for (let x = -60 + (i % 2 ? 0 : 8); x + 15 <= 61; x += 16) {
      const hits = (a, b, c, e) => x + 15 > a && x < b && y + 8 > c && y < e;
      if (hits(-16, 16, -46, 0) || hits(20, 56, -66, -32) || hits(-56, -20, -66, -32)) continue;
      if ((i * 5 + x * 3) % 7 === 0 || (i * 3 + x) % 11 === 0) continue;
      d += `M${x} ${y + 1}l14 0l0 7l-14 0Z`;
    }
  }
  return d;
}

export function brickHouse({ windowFaces = false, chimney = true } = {}) {
  return {
    lines: [hWall, hRoof, ...(chimney ? [hChimney, hChimneyTop] : []), hDoor, hWindow, hWindow2],
    fine: [bricks(), ...(windowFaces ? [] : ['M22 -49L54 -49M38 -64L38 -34', 'M-54 -49L-22 -49M-38 -64L-38 -34']), dot(8, -18, 1.6), 'M-60 -80l6 -4M-40 -95l8 -5M-14 -114l7 -5M18 -114l7 4M46 -95l8 6'],
    washes: [
      { c: PAL.red, o: 0.62, d: hWall + hDoorFill + hWindow + hWindow2, rule: 'evenodd' },
      { c: PAL.slate, o: 0.6, d: hRoof },
      ...(chimney ? [{ c: PAL.red, o: 0.7, d: hChimneyFill + hChimneyTop }] : []),
      { c: PAL.ochre, o: 0.75, d: hDoorFill },
      { c: PAL.sky, o: 0.45, d: hWindow + hWindow2 },
    ],
  };
}
