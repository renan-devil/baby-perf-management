import { PAL, transformPath } from '../lib.mjs';
import { at, compose, dot, f, limb, merge, oval, place } from '../stone-soup/characters.mjs';

// The Princess and the Pea: the princess, the old Queen, the old King, the Prince, the tall pile of
// mattresses and the tiny green pea, drawn once here and placed in each picture with a transform
// (place). The build only draws files named <n>.mjs, so this file is not a picture. Standing
// characters have their feet at y = 0 and face us; their eyes look left or right (look).

export { at, compose, dot, merge, oval, place };

const Z = (d) => `${d}Z`;

/** An arm (limb along pts) ending in a round hand; sleeve: list of wash colours {c, o}. */
function arm(pts, sleeve, hand = 4.5) {
  // the sleeve stops short of the hand, so the hand keeps its own colour
  const [x, y] = pts[pts.length - 1];
  const [px, py] = pts[pts.length - 2];
  const l = Math.hypot(x - px, y - py);
  const k = Math.min(0.7, (hand * 0.9) / l);
  const d = limb([...pts.slice(0, -1), [f(x - (x - px) * k), f(y - (y - py) * k), pts[pts.length - 1][2]]]);
  const h = dot(x, y, hand);
  return { lines: [d], fine: [h], washes: [...sleeve.map((w) => ({ ...w, d: Z(d) })), { c: PAL.rose, o: 0.55, d: h }] };
}

/** A shoe, ankle at (0,0), toe to the right (flip with scale(-1 1)). */
function shoe(c = PAL.slate) {
  const d = 'M-5 -4C-7 1 -6 4 -2 4L11 4C15 4 15 -1 11 -2C7 -3 4 -4 -5 -4Z';
  return { lines: [d], washes: [{ c, o: 0.85, d }] };
}

/** A small gold crown sitting on a head, its band at y = 0, w wide, h tall, with a red jewel. */
function crown(w = 10, h = 16) {
  const d = `M${-w} 0L${-w - 2} ${-h}L${-w / 2} ${-h * 0.55}L0 ${-h - 3}L${w / 2} ${-h * 0.55}L${w + 2} ${-h}L${w} 0C${w / 3} -2 ${-w / 3} -2 ${-w} 0Z`;
  return {
    lines: [d],
    washes: [
      { c: PAL.ochre, o: 1, d },
      { c: PAL.red, o: 0.95, d: dot(0, -h * 0.35, 2) },
    ],
    glints: [`M${-w + 2} ${-h * 0.8}l1.2 -0.8l0.8 ${h * 0.45}l-1.2 0.4Z`],
  };
}

/**
 * Eyes and mouth: eyes at (±ex, ey), mouth at my. look: -1, 0 or 1 (pupils left, middle, right);
 * up: pupils raised (looking up). mood: happy (dot eyes, smile), smile (eyes shut in a pleased curve,
 * a knowing smile), wow (eyes wide, mouth an "o"), worried (wide eyes, brows up in the middle, a
 * wobbly mouth), tired (heavy half-shut lids, bags under the eyes, a giant yawn).
 */
function faceMarks({ mood, ex, ey, my, r = 1.8, w = 5, look = 0, up = 0 }) {
  const fine = [];
  const fills = [];
  const glints = [];
  const washes = [];
  const whites = [];
  const dx = look * 1.3;
  const dy = -up * 1.2;
  const pupils = (rr) => {
    fills.push(dot(-ex + dx, ey + dy, rr), dot(ex + dx, ey + dy, rr));
    glints.push(dot(-ex + dx - 0.5, ey + dy - 0.6, 0.5), dot(ex + dx - 0.5, ey + dy - 0.6, 0.5));
  };
  if (mood === 'smile') {
    fine.push(`M${-ex - 3} ${ey + 1}q3 -3.4 6 0M${ex - 3} ${ey + 1}q3 -3.4 6 0`, `M${-w} ${my - 0.5}q${w} 5 ${2 * w} 0`);
  } else if (mood === 'tired') {
    // heavy lids: a flat line with half a pupil showing beneath, and little bags under the eyes
    fine.push(`M${-ex - 3.4} ${ey - 0.4}l6.8 0.6M${ex - 3.4} ${ey + 0.2}l6.8 -0.6`);
    fills.push(`M${-ex - 2.2} ${ey}a2.2 2 0 0 0 4.4 0ZM${ex - 2.2} ${ey}a2.2 2 0 0 0 4.4 0Z`);
    fine.push(`M${-ex - 2.6} ${ey + 3.6}q2.6 1.8 5.2 0M${ex - 2.6} ${ey + 3.6}q2.6 1.8 5.2 0`);
    washes.push({ c: PAL.slate, o: 0.45, d: oval(-ex, ey + 3.4, 3.2, 1.8) + oval(ex, ey + 3.4, 3.2, 1.8) });
    const yawn = oval(0, my + 2.5, w * 0.75, w * 1.05);
    fine.push(yawn);
    washes.push({ c: PAL.red, o: 0.85, d: yawn });
  } else if (mood === 'wow' || mood === 'worried') {
    const rw = 3.2;
    whites.push(dot(-ex, ey, rw), dot(ex, ey, rw));
    fine.push(dot(-ex, ey, rw), dot(ex, ey, rw));
    pupils(1.5);
    if (mood === 'worried') {
      fine.push(`M${-ex - 4} ${ey - 5}l7 -2.6M${ex + 4} ${ey - 5}l-7 -2.6`);
      fine.push(`M${-w + 1} ${my + 1}q${(w - 1) / 2} -2.5 ${w - 1} 0q${(w - 1) / 2} 2.5 ${w - 1} 0`);
    } else {
      fine.push(`M${-ex - 3} ${ey - 6}q3 -2.4 6 0M${ex - 3} ${ey - 6}q3 -2.4 6 0`);
      const o = oval(0, my + 2, 2.8, 3.6);
      fine.push(o);
      washes.push({ c: PAL.red, o: 0.8, d: o });
    }
  } else {
    pupils(r);
    fine.push(`M${-w} ${my}q${w} 5 ${2 * w} 0`);
  }
  return { fine, fills, glints, washes, whites };
}

/** A falling water drop, its tip at (x, y). */
export const drop = (x, y, s = 1) =>
  `M${f(x)} ${f(y)}C${f(x - 3 * s)} ${f(y + 5 * s)} ${f(x - 3 * s)} ${f(y + 8 * s)} ${f(x)} ${f(y + 8 * s)}C${f(x + 3 * s)} ${f(y + 8 * s)} ${f(x + 3 * s)} ${f(y + 5 * s)} ${f(x)} ${f(y)}Z`;

/** A little four-pointed star shape (for paper-white stars), centre at 0,0. */
export const star = (s = 5) => {
  const k = f(s * 0.28);
  return `M0 ${-s}L${k} ${-k}L${s} 0L${k} ${k}L0 ${s}L${-k} ${k}L${-s} 0L${-k} ${-k}Z`;
};

// =============================================================================================
// THE PRINCESS (feet at 0,0), about 112 tall: long golden hair falling to her shoulders, a little
// gold tiara, a rose dress and a gold sash, red slippers. Head at PR_HEAD; arms
// from the shoulders (±12,-80). wet: soaked through (hair hanging in straight wet strands, the dress
// darkened, drops running off her). sit: sitting on a flat top at y = 0, her skirt spread and her
// feet dangling over the front edge. legs: [left, right] leg centrelines for the climbing pose.
// =============================================================================================
export const PR_HEAD = [0, -96];
export const PR_ARMS = {
  down: [
    [[-12, -80, 7], [-17, -68, 6.5], [-20, -56, 6.5], [-20, -50, 6.5]],
    [[12, -80, 7], [17, -68, 6.5], [20, -56, 6.5], [20, -50, 6.5]],
  ],
};
export function princessHead({ mood = 'happy', look = 0, up = 0, wet = false, tiara = true, back = false } = {}) {
  if (back) return princessBack({ tiara });
  const face = 'M-12.6 -2C-13 9 -6.5 14 0 14C6.5 14 13 9 12.6 -2';
  const faceFill = `${face}C10 -8 6 -10 0 -8C-5 -10 -10 -8 -12.6 -2Z`;
  const top = 'M-13 1C-15 -13 -8 -19 0 -19C8 -19 15 -13 13 1C11 -6 6 -10 0 -8C-5 -10 -11 -6 -13 1Z';
  // long locks on each side of the face, falling to the shoulders (wet: straight and thin)
  const locks = wet
    ? 'M-13 -4C-16 6 -17 18 -16 28L-11 29C-11 18 -11 8 -10 -1ZM13 -4C16 6 17 18 16 28L11 29C11 18 11 8 10 -1Z'
    : 'M-13 -6C-20 4 -22 16 -19 26C-17 32 -11 32 -10 27C-13 22 -12 14 -10 6C-10 2 -10 -2 -11 -4ZM13 -6C20 4 22 16 19 26C17 32 11 32 10 27C13 22 12 14 10 6C10 2 10 -2 11 -4Z';
  const strands = wet
    ? 'M-14 4l-0.6 20M-12.4 6l0 20M14 4l0.6 20M12.4 6l0 20'
    : 'M-16 6q-3 8 -1 16M-13 8q-1 8 0 14M16 6q3 8 1 16M13 8q1 8 0 14';
  const m = faceMarks({ mood, ex: 4.8, ey: 0, my: 7, r: 1.7, w: 3.8, look, up });
  const parts = [
    {
      lines: [face, top, locks],
      fine: [strands, 'M-4 -14q2 3 1 6M3 -15q1 3 0 6', 'M0.5 2.4c1.5 1.1 1.5 2.3 -0.5 2.6', ...m.fine],
      washes: [
        { c: PAL.rose, o: 0.3, d: faceFill },
        { c: PAL.ochre, o: 0.95, d: `${top}${locks}` },
        ...(wet ? [{ c: PAL.slate, o: 0.3, d: `${top}${locks}` }] : []),
        { c: PAL.rose, o: mood === 'tired' ? 0.35 : 0.7, d: dot(-8, 5, 2.4) + dot(8, 5, 2.4) },
        ...m.washes,
      ],
      whites: m.whites,
      fills: m.fills,
      glints: m.glints,
    },
  ];
  if (tiara) {
    const t = 'M-8 -15L-9 -23L-4 -19L0 -26L4 -19L9 -23L8 -15C3 -17 -3 -17 -8 -15Z';
    parts.push({ lines: [t], washes: [{ c: PAL.ochre, o: 1, d: t }, { c: PAL.red, o: 0.9, d: dot(0, -19, 1.6) }] });
  }
  if (wet) {
    // drops running off her hair, nose and chin
    const drops = [drop(-14, 31, 0.8), drop(15, 32, 0.9), drop(-1, 17, 0.6), drop(-17, 42, 0.8), drop(16, 46, 0.9)].join('');
    parts.push({ fine: [drops, 'M-6 -24l-2 -5M0 -26l0 -5M6 -24l2 -5'], washes: [{ c: PAL.sky, o: 0.95, d: drops }] });
  }
  return merge(...parts);
}
/** The princess's head seen from behind: all golden hair, falling down her back, and the tiara. */
function princessBack({ tiara = true } = {}) {
  const hair = 'M-13 0C-15 -13 -8 -19 0 -19C8 -19 15 -13 13 0C14 12 16 24 14 36C6 40 -6 40 -14 36C-16 24 -14 12 -13 0Z';
  const strands = 'M-6 -10q-3 20 -2 42M0 -12q0 22 0 46M6 -10q3 20 2 42M-10 4q-2 14 -1 28M10 4q2 14 1 28';
  const t = 'M-8 -15L-9 -23L-4 -19L0 -26L4 -19L9 -23L8 -15C3 -17 -3 -17 -8 -15Z';
  return {
    lines: [hair, ...(tiara ? [t] : [])],
    fine: [strands, 'M-14 -2C-17 -4 -17 2 -14 3M14 -2C17 -4 17 2 14 3'],
    washes: [{ c: PAL.ochre, o: 0.95, d: hair }, { c: PAL.rose, o: 0.5, d: 'M-14 -2C-17 -4 -17 2 -14 3ZM14 -2C17 -4 17 2 14 3Z' }, ...(tiara ? [{ c: PAL.ochre, o: 1, d: t }] : [])],
  };
}
export function princess({ mood = 'happy', look = 0, up = 0, tilt = 0, arms = PR_ARMS.down, wet = false, tiara = true, sit = false, legs, back = false } = {}) {
  const parts = [];
  const dy = sit ? 42 : 0; // sitting: the upper body comes down so the seat is at y = 0
  const lift = (pts) => pts.map(([x, y, w]) => [x, y + dy, w]);
  const dressColour = [{ c: PAL.rose, o: 0.85 }, ...(wet ? [{ c: PAL.slate, o: 0.45 }] : [])];
  if (sit) {
    // the skirt spread over the seat and the feet dangling over the front edge
    const legLines = [limb([[-9, -2, 6], [-11, 10, 5.5], [-12, 20, 5]]), limb([[9, -2, 6], [11, 10, 5.5], [12, 20, 5]])];
    parts.push({ lines: legLines, washes: legLines.map((d) => ({ c: PAL.rose, o: 0.4, d: Z(d) })) });
    parts.push(place(shoe(PAL.red), 'translate(-12 21) scale(-0.65 0.65)'), place(shoe(PAL.red), 'translate(12 21) scale(0.65)'));
    const dress = 'M-8 -42C-14 -40 -16 -34 -16 -26C-16 -22 -17 -18 -18 -15C-26 -10 -34 -4 -36 2C-28 7 -16 6 -12 2C-4 5 4 5 12 2C16 6 28 7 36 2C34 -4 26 -10 18 -15C17 -18 16 -22 16 -26C16 -34 14 -40 8 -42';
    parts.push({
      lines: [dress],
      fine: ['M-18 -15C-6 -12 6 -12 18 -15', 'M-24 -4q-2 4 -1 7M24 -4q2 4 1 7'],
      washes: [...dressColour.map((w) => ({ ...w, d: Z(dress) })), { c: PAL.ochre, o: 0.95, d: 'M-17 -20C-6 -17 6 -17 17 -20L18 -15C6 -12 -6 -12 -18 -15Z' }],
    });
  } else {
    const lg = legs ?? [
      [[-7, -10, 5.5], [-7, -4, 5]],
      [[7, -10, 5.5], [7, -4, 5]],
    ];
    const legLines = lg.map((l) => limb(l));
    parts.push({ lines: legLines, washes: legLines.map((d) => ({ c: PAL.rose, o: 0.4, d: Z(d) })) });
    lg.forEach((l, i) => {
      const [x, y] = l[l.length - 1];
      parts.push(place(shoe(PAL.red), `translate(${x} ${y + 1}) scale(${i ? 0.65 : -0.65} 0.65)`));
    });
    const dress = wet
      ? 'M-8 -84C-14 -82 -16 -76 -16 -68C-16 -60 -18 -50 -20 -38C-22 -26 -24 -16 -24 -8L-18 -6L-14 -9L-8 -5L-2 -8L4 -5L10 -8L16 -5L24 -8C24 -16 22 -26 20 -38C18 -50 16 -60 16 -68C16 -76 14 -82 8 -84'
      : 'M-8 -84C-14 -82 -16 -76 -16 -68C-16 -62 -18 -54 -20 -44C-22 -32 -26 -18 -28 -8C-10 -3 10 -3 28 -8C26 -18 22 -32 20 -44C18 -54 16 -62 16 -68C16 -76 14 -82 8 -84';
    const frill = wet ? 'M-10 -20l-1 10M0 -22l0 12M10 -20l1 10' : 'M-25 -14C-8 -9 8 -9 25 -14';
    parts.push({
      lines: [dress],
      fine: [frill],
      washes: [...dressColour.map((w) => ({ ...w, d: Z(dress) })), { c: PAL.ochre, o: 0.95, d: 'M-16.4 -62C-6 -59 6 -59 16.4 -62L17.4 -56C6 -53 -6 -53 -17.4 -56Z' }],
    });
    if (wet) {
      const drops = [drop(-18, 0, 1), drop(-4, 2, 0.8), drop(12, 1, 1), drop(22, -2, 0.8)].join('');
      parts.push({ fine: [drops], washes: [{ c: PAL.sky, o: 0.95, d: drops }] });
    }
  }
  parts.push(...arms.map((a) => arm(lift(a), dressColour, 3.8)));
  const collar = `M-8 ${-84 + dy}C-5 ${-78 + dy} 5 ${-78 + dy} 8 ${-84 + dy}C4 ${-85 + dy} -4 ${-85 + dy} -8 ${-84 + dy}Z`;
  if (!back) parts.push({ fine: [collar], whites: [collar] });
  parts.push(place(princessHead({ mood, look, up, wet, tiara, back }), `translate(${PR_HEAD[0]} ${PR_HEAD[1] + dy}) rotate(${tilt})`));
  return merge(...parts);
}

// =============================================================================================
// THE QUEEN (feet at 0,0), about 150 tall and round: grey hair in a bun, a tall gold crown, rosy
// cheeks and little smile lines (she is older), a long red gown with a gold hem and a white collar,
// a string of pearls. Head at Q_HEAD; arms from the shoulders (±22,-104).
// =============================================================================================
export const Q_HEAD = [0, -122];
export const Q_ARMS = {
  down: [
    [[-22, -104, 11], [-30, -88, 10], [-32, -74, 10], [-32, -68, 10]],
    [[22, -104, 11], [30, -88, 10], [32, -74, 10], [32, -68, 10]],
  ],
  folded: [
    [[-22, -104, 11], [-30, -88, 10], [-18, -78, 10], [-6, -80, 10]],
    [[22, -104, 11], [30, -88, 10], [18, -78, 10], [6, -80, 10]],
  ],
};
export function queenHead({ mood = 'happy', look = 0 } = {}) {
  const face = 'M-14 -2C-14 -12 -8 -17 0 -17C8 -17 14 -12 14 -2C14 9 8 16 0 16C-8 16 -14 9 -14 -2Z';
  const hair = 'M-15 2C-19 -10 -12 -21 0 -21C12 -21 19 -10 15 2C14 -6 10 -12 4 -13C-2 -11 -10 -10 -15 2Z';
  const bun = 'M-9 -24C-12 -34 12 -34 9 -24';
  const m = faceMarks({ mood, ex: 5.2, ey: -2, my: 8, r: 1.7, w: 4.2, look });
  return merge(
    {
      lines: [face, hair],
      fine: [
        bun,
        'M-11 -14q4 -4 8 -4M3 -17q5 0 8 4',
        // smile lines and crow's feet: she is not young any more
        'M-12 -3l-3 -1.4M-12 -0.6l-3 0.6M12 -3l3 -1.4M12 -0.6l3 0.6',
        'M-7 10q-2 -1 -2.6 -3.4M7 10q2 -1 2.6 -3.4',
        'M0.6 1.4c1.6 1.2 1.6 2.6 -0.6 3',
        ...m.fine,
      ],
      washes: [
        { c: PAL.rose, o: 0.38, d: face },
        { c: PAL.grey, o: 0.85, d: `${hair}${bun}Z` },
        { c: PAL.rose, o: 0.8, d: dot(-9, 5, 2.8) + dot(9, 5, 2.8) },
        ...m.washes,
      ],
      whites: m.whites,
      fills: m.fills,
      glints: m.glints,
    },
    place(crown(10, 18), 'translate(0 -18)'),
  );
}
export function queen({ mood = 'happy', look = 0, tilt = 0, lean = 0, arms = Q_ARMS.down } = {}) {
  const gown = 'M-14 -110C-28 -106 -34 -94 -34 -78C-34 -56 -38 -30 -44 -2C-16 3 16 3 44 -2C38 -30 34 -56 34 -78C34 -94 28 -106 14 -110';
  const hem = 'M-43 -10C-16 -5 16 -5 43 -10L44 -2C16 3 -16 3 -44 -2Z';
  const front = 'M-6 -102L-10 -4L10 -4L6 -102Z';
  const collar = 'M-15 -110C-10 -100 10 -100 15 -110C10 -114 -10 -114 -15 -110Z';
  const pearls = [-12, -7, -2, 2, 7, 12].map((x) => dot(x, -104 + Math.abs(x) * -0.25 + 4, 1.6)).join('');
  const upper = merge(
    {
      lines: [gown, hem],
      fine: [front, 'M-22 -70q-6 30 -10 62M22 -70q6 30 10 62', pearls],
      washes: [
        { c: PAL.red, o: 0.75, d: Z(gown) },
        { c: PAL.ochre, o: 0.95, d: hem },
        { c: PAL.ochre, o: 0.7, d: front },
      ],
      whites: [collar, pearls],
    },
    { fine: [collar] },
    ...arms.map((a) => arm(a, [{ c: PAL.red, o: 0.75 }], 5.2)),
    place(queenHead({ mood, look }), `translate(${Q_HEAD[0]} ${Q_HEAD[1]}) rotate(${tilt})`),
  );
  return lean ? place(upper, `rotate(${lean} 0 -10)`) : upper;
}

// =============================================================================================
// THE KING (feet at 0,0), about 150 tall: an old man with a long white beard and moustache, white
// tufts of hair, a big rosy nose and a gold crown, in a long blue dressing gown with a white fur
// collar (black speckles) and a gold belt. Head at K_HEAD; arms from the shoulders (±22,-104).
// =============================================================================================
export const K_HEAD = [0, -124];
export const K_ARMS = {
  down: [
    [[-22, -104, 11], [-30, -88, 10], [-32, -74, 10], [-32, -68, 10]],
    [[22, -104, 11], [30, -88, 10], [32, -74, 10], [32, -68, 10]],
  ],
};
export function kingHead({ mood = 'happy', look = 0 } = {}) {
  const face = 'M-14 -2C-14 -12 -8 -17 0 -17C8 -17 14 -12 14 -2C14 6 10 10 6 11L-6 11C-10 10 -14 6 -14 -2Z';
  const brow = 'M-14 2C-15 -12 -8 -17 0 -17C8 -17 15 -12 14 2';
  const beard = 'M-14 0C-18 14 -12 34 0 44C12 34 18 14 14 0C10 8 5 10 0 9C-5 10 -10 8 -14 0Z';
  const tache = 'M0 5C-4 2 -10 3 -12 7C-8 9 -3 9 0 7C3 9 8 9 12 7C10 3 4 2 0 5Z';
  const tufts = 'M-14 -8C-21 -10 -22 -2 -17 0C-21 2 -19 8 -14 6ZM14 -8C21 -10 22 -2 17 0C21 2 19 8 14 6Z';
  // the beard is painted in paper white, so his mouth is drawn in ink (an "o" when surprised); his
  // own bushy white brows replace the drawn ones
  const m = faceMarks({ mood, ex: 5.6, ey: -4, my: 9, r: 1.7, w: 3, look });
  const wow = mood === 'wow';
  const marks = wow ? m.fine.slice(0, 2) : m.fine;
  const mouth = wow ? [oval(0, 11.5, 1.8, 2.3)] : [];
  const brows = wow ? 'M-11 -13C-9 -18 -3 -18 -1 -14C-4 -15 -8 -15 -11 -13ZM11 -13C9 -18 3 -18 1 -14C4 -15 8 -15 11 -13Z' : 'M-10 -11C-8 -15 -3 -15 -1 -12C-4 -13 -7 -13 -10 -11ZM10 -11C8 -15 3 -15 1 -12C4 -13 7 -13 10 -11Z';
  return merge(
    {
      lines: [brow, beard],
      fine: [tache, tufts, brows, 'M-6 20q-1 6 1 12M6 20q1 6 -1 12', ...marks],
      washes: [
        { c: PAL.rose, o: 0.38, d: face },
        { c: PAL.rose, o: 0.9, d: dot(0, 1.5, 3.4) },
        { c: PAL.grey, o: 0.35, d: `${beard}${tufts}` },
      ],
      whites: [beard, tache, tufts, brows, ...m.whites],
      fills: [...m.fills, ...mouth],
      glints: m.glints,
    },
    place(crown(10, 17), 'translate(0 -16)'),
  );
}
export function king({ mood = 'happy', look = 0, tilt = 0, arms = K_ARMS.down } = {}) {
  const gown = 'M-14 -110C-28 -106 -32 -94 -32 -78C-32 -56 -34 -30 -38 -2C-14 2 14 2 38 -2C34 -30 32 -56 32 -78C32 -94 28 -106 14 -110';
  const fur = 'M-24 -108C-30 -100 -26 -90 -18 -92C-12 -94 -8 -90 0 -86C8 -90 12 -94 18 -92C26 -90 30 -100 24 -108C14 -114 -14 -114 -24 -108Z';
  const furSpots = 'M-20 -102l0 2.6M-12 -96l0 2.6M12 -96l0 2.6M20 -102l0 2.6M-6 -104l0 2.6M6 -104l0 2.6';
  const belt = 'M-32.6 -64C-12 -60 12 -60 32.6 -64L32.9 -58C12 -54 -12 -54 -32.9 -58Z';
  const feet = merge(place(shoe(PAL.terracotta), 'translate(-12 -3) scale(-1 1)'), place(shoe(PAL.terracotta), 'translate(12 -3)'));
  return merge(
    feet,
    {
      lines: [gown, fur],
      fine: ['M0 -86L0 -2', 'M-18 -54q-4 26 -8 50M18 -54q4 26 8 50'],
      washes: [
        { c: PAL.sky, o: 0.9, d: Z(gown) },
        { c: PAL.slate, o: 0.45, d: Z(gown) },
        { c: PAL.ochre, o: 0.95, d: belt },
      ],
      whites: [fur],
      once: [furSpots],
    },
    ...arms.map((a) => arm(a, [{ c: PAL.sky, o: 0.9 }, { c: PAL.slate, o: 0.45 }], 5.2)),
    place(kingHead({ mood, look }), `translate(${K_HEAD[0]} ${K_HEAD[1]}) rotate(${tilt})`),
  );
}

// =============================================================================================
// THE PRINCE (feet at 0,0), about 140 tall: young, with wavy terracotta hair and a small gold crown,
// a green tunic with a gold belt, slate leggings and brown boots. Head at PC_HEAD; arms from the
// shoulders (±18,-102).
// =============================================================================================
export const PC_HEAD = [0, -122];
export const PC_ARMS = {
  down: [
    [[-18, -102, 10], [-26, -88, 9], [-28, -74, 9], [-28, -68, 9]],
    [[18, -102, 10], [26, -88, 9], [28, -74, 9], [28, -68, 9]],
  ],
};
export function princeHead({ mood = 'happy', look = 0 } = {}) {
  const face = 'M-13 -2C-13.4 9 -7 15 0 15C7 15 13.4 9 13 -2';
  const faceFill = `${face}C10 -8 6 -10 0 -8C-5 -10 -10 -8 -13 -2Z`;
  const hair = 'M-14 2C-17 -6 -14 -18 0 -19C14 -18 17 -6 14 2C13 -4 10 -8 6 -7C2 -11 -4 -10 -6 -7C-10 -8 -13 -4 -14 2Z';
  const m = faceMarks({ mood, ex: 5, ey: 0, my: 7.5, r: 1.7, w: 4, look });
  return merge(
    {
      lines: [face, hair],
      fine: ['M-8 -16q-3 3 -2 6M8 -16q3 3 2 6', 'M0.5 2.4c1.5 1.1 1.5 2.3 -0.5 2.6', ...m.fine],
      washes: [
        { c: PAL.rose, o: 0.33, d: faceFill },
        { c: PAL.terracotta, o: 0.9, d: hair },
        { c: PAL.rose, o: 0.6, d: dot(-8.5, 5.5, 2.4) + dot(8.5, 5.5, 2.4) },
        ...m.washes,
      ],
      whites: m.whites,
      fills: m.fills,
      glints: m.glints,
    },
    place(crown(8, 12), 'translate(0 -17)'),
  );
}
export function prince({ mood = 'happy', look = 0, tilt = 0, arms = PC_ARMS.down } = {}) {
  const tunic = 'M-10 -108C-22 -106 -24 -96 -24 -84C-24 -70 -25 -56 -27 -40C-10 -36 10 -36 27 -40C25 -56 24 -70 24 -84C24 -96 22 -106 10 -108';
  const belt = 'M-24.4 -66C-8 -62 8 -62 24.4 -66L24.8 -60C8 -56 -8 -56 -24.8 -60Z';
  const legs = [limb([[-9, -40, 10], [-9, -6, 9]]), limb([[9, -40, 10], [9, -6, 9]])];
  const boots = 'M-15 -16L-15 -2C-24 -2 -24 3 -18 3L-3 3L-3 -16ZM15 -16L15 -2C24 -2 24 3 18 3L3 3L3 -16Z';
  const collar = 'M-10 -108C-6 -100 6 -100 10 -108C6 -110 -6 -110 -10 -108Z';
  return merge(
    { lines: legs, washes: legs.map((d) => ({ c: PAL.slate, o: 0.7, d: Z(d) })) },
    { lines: [boots], washes: [{ c: PAL.terracotta, o: 0.85, d: boots }] },
    {
      lines: [tunic],
      fine: [collar, 'M0 -102L0 -66', 'M-14 -54l-2 12M14 -54l2 12'],
      washes: [
        { c: PAL.green, o: 0.85, d: Z(tunic) },
        { c: PAL.ochre, o: 0.95, d: belt },
      ],
      whites: [collar],
    },
    ...arms.map((a) => arm(a, [{ c: PAL.green, o: 0.85 }], 4.6)),
    place(princeHead({ mood, look }), `translate(${PC_HEAD[0]} ${PC_HEAD[1]}) rotate(${tilt})`),
  );
}

// =============================================================================================
// THE PEA: one tiny green pea (centre at 0,0) with a paper glint; shine: little rays of light.
// =============================================================================================
export function pea({ r = 4.2, shine = false } = {}) {
  const d = dot(0, 0, r);
  return {
    fine: [d, ...(shine ? [`M${-r - 4} ${-r - 4}l-4 -4M${r + 4} ${-r - 4}l4 -4M0 ${-r - 5}l0 -6M${-r - 5} 1l-6 0M${r + 5} 1l6 0`] : [])],
    washes: [{ c: PAL.green, o: 1, d }, { c: PAL.green, o: 0.6, d }],
    glints: [dot(-r * 0.35, -r * 0.35, r * 0.3)],
  };
}

// =============================================================================================
// THE PILE OF MATTRESSES (bottom centre at 0,0): a wooden bed with short legs, n plump mattresses in
// many colours piled on it (each h tall, w wide, wobbling a little from side to side), and q soft
// quilts on top. Returns the drawing and top: the y of the top of the pile.
// =============================================================================================
const MATTRESS = [
  { c: PAL.red, o: 0.75, mark: 'stripes' },
  { c: PAL.sky, o: 0.95, mark: 'spots' },
  { c: PAL.ochre, o: 0.9, mark: 'none' },
  { c: PAL.green, o: 0.9, mark: 'stripes' },
  { c: PAL.rose, o: 0.95, mark: 'spots' },
  { c: PAL.slate, o: 0.6, mark: 'none' },
  { c: PAL.terracotta, o: 0.8, mark: 'stripes' },
];
export function pile({ n = 12, q = 3, w = 170, h = 12, seed = 1, peaShown = true } = {}) {
  const wob = (i) => Math.round(Math.sin(i * 1.9 + seed) * 5 + Math.sin(i * 0.7 + seed * 2) * 3);
  const legsY = -14;
  const frame = `M${-w / 2 - 6} ${legsY}L${w / 2 + 6} ${legsY}L${w / 2 + 6} ${legsY + 6}L${-w / 2 - 6} ${legsY + 6}Z`;
  const bedLegs = `M${-w / 2} ${legsY + 6}L${-w / 2} 0M${-w / 2 + 8} ${legsY + 6}L${-w / 2 + 8} 0M${w / 2} ${legsY + 6}L${w / 2} 0M${w / 2 - 8} ${legsY + 6}L${w / 2 - 8} 0`;
  const out = { lines: [frame, bedLegs], fine: [], washes: [{ c: PAL.terracotta, o: 0.8, d: `${frame}M${-w / 2} ${legsY + 6}L${-w / 2 + 8} ${legsY + 6}L${-w / 2 + 8} 0L${-w / 2} 0ZM${w / 2 - 8} ${legsY + 6}L${w / 2} ${legsY + 6}L${w / 2} 0L${w / 2 - 8} 0Z` }], whites: [], glints: [], once: [] };
  let y = legsY - (peaShown ? 5 : 0); // the pea lifts the lowest mattress a little
  const layer = (i, hh, ww, style) => {
    const x = wob(i);
    const l = x - ww / 2;
    const r = x + ww / 2;
    const t = y - hh;
    const d = `M${l + 4} ${y}C${l - 2} ${y} ${l - 2} ${t} ${l + 4} ${t}L${r - 4} ${t}C${r + 2} ${t} ${r + 2} ${y} ${r - 4} ${y}Z`;
    out.lines.push(d);
    out.washes.push({ c: style.c, o: style.o, d });
    if (style.mark === 'stripes') {
      let s = '';
      for (let k = l + 16; k < r - 8; k += 16) s += `M${f(k)} ${f(t + 2.5)}l0 ${f(hh - 5)}`;
      out.fine.push(s);
    } else if (style.mark === 'spots') {
      out.fine.push(Array.from({ length: Math.floor(ww / 24) }, (_, k) => dot(l + 14 + k * 24, (y + t) / 2, 1.4)).join(''));
    }
    y = t;
  };
  for (let i = 0; i < n; i++) layer(i, h, w - (i % 3) * 4, MATTRESS[(i + seed) % MATTRESS.length]);
  // the quilts: puffier, in cream with coloured patches
  for (let i = 0; i < q; i++) {
    layer(n + i, h * 1.25, w + 8, { c: [PAL.sky, PAL.rose, PAL.green][i % 3], o: 0.5, mark: 'spots' });
    out.fine.push(`M${wob(n + i) - 30} ${f(y + h * 0.62)}l6 0M${wob(n + i) + 24} ${f(y + h * 0.62)}l6 0`);
  }
  if (peaShown) {
    // the tiny pea, peeping out under the lowest mattress
    const p = place(pea({ r: 3.6, shine: true }), `translate(${-w / 2 + 30} ${legsY - 3.4})`);
    for (const k of Object.keys(p)) out[k] = [...(out[k] ?? []), ...p[k]];
  }
  return { drawing: out, top: y, wob };
}

// =============================================================================================
// A CANDLE in a little brass holder with a ring handle (the holder's base at 0,0), its flame lit.
// =============================================================================================
export function candle() {
  const dish = 'M-12 0C-12 -5 12 -5 12 0C12 3 -12 3 -12 0Z';
  const ring = 'M12 -2C20 -4 20 6 12 4';
  const wax = 'M-4 -3L-4 -26L4 -26L4 -3';
  const flame = 'M0 -40C-5 -34 -5 -28 0 -27C5 -28 5 -34 0 -40Z';
  return {
    lines: [dish, wax],
    fine: [ring, flame, 'M0 -26l0 -2', 'M-12 -38l-5 -3M12 -38l5 -3M0 -46l0 -5'],
    washes: [
      { c: PAL.ochre, o: 0.95, d: `${dish}${ring}Z` },
      { c: PAL.paper, o: 1, d: `${wax}Z` },
      { c: PAL.red, o: 0.7, d: flame },
      { c: PAL.ochre, o: 1, d: flame },
    ],
  };
}

// =============================================================================================
// THE BEDROOM WINDOW (bottom left of the sill at 0,0; 128 wide, 184 tall): a tall arched window at
// night with a crossbar, the moon and paper-white stars, and a wooden sill.
// =============================================================================================
export function bedroomWindow() {
  const win = 'M8 -8L8 -128C8 -164 32 -184 64 -184C96 -184 120 -164 120 -128L120 -8Z';
  const bars = 'M64 -184L64 -8M8 -94L120 -94';
  const sill = 'M0 -8L128 -8L128 0L0 0Z';
  const moon = 'M50 -164C36 -160 28 -146 30 -132C32 -118 44 -108 58 -110C50 -116 44 -126 44 -136C44 -148 46 -156 50 -164Z';
  const stars = [
    [94, -156, 4.5],
    [32, -70, 3.5],
    [100, -66, 4],
    [78, -126, 3],
    [48, -38, 3],
    [96, -28, 3],
  ];
  return {
    lines: [win, sill],
    fine: [moon, bars],
    washes: [
      { c: PAL.slate, o: 0.75, d: win },
      { c: PAL.sky, o: 0.5, d: win },
      { c: PAL.terracotta, o: 0.7, d: sill },
      { c: PAL.ochre, o: 1, d: moon },
    ],
    whites: stars.map(([x, y, k]) => transformPath(star(k), `translate(${x} ${y})`)),
  };
}
