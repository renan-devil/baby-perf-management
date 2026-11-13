import { PAL } from '../lib.mjs';
import { at, compose, dot, f, limb, merge, oval, place } from '../stone-soup/characters.mjs';

// The Emperor's New Clothes: the Emperor, the two tricksters, the old Minister, the little girl, her
// father, the two pages and the things around them (mirror, loom, bag of gold, candles, scissors),
// drawn once here and placed in each picture with a transform (place). The build only draws files
// named <n>.mjs, so this file is not a picture. Standing characters have their feet at y = 0 and
// face us; their eyes look left or right.

export { at, compose, dot, merge, oval, place };

const Z = (d) => `${d}Z`;
// the Emperor's purple: rose and slate washes laid one over the other
const PURPLE_W = [
  { c: PAL.red, o: 0.7 },
  { c: PAL.sky, o: 1 },
  { c: PAL.sky, o: 0.5 },
];
const PURPLE = (d) => PURPLE_W.map((w) => ({ ...w, d }));

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

/**
 * Eyes and mouth: eyes at (±ex, ey), mouth at my. look: -1, 0 or 1 (pupils left, middle, right).
 * mood: happy, sly (heavy lids, a crooked grin), wow (eyes wide, mouth an "o"), worried (wide eyes,
 * brows up in the middle, a wobbly mouth), proud (eyes shut smugly, a small smile), laugh (eyes
 * squeezed, mouth wide open).
 */
function faceMarks({ mood, ex, ey, my, r = 1.8, w = 5, look = 0, mouth = true }) {
  const fine = [];
  const fills = [];
  const glints = [];
  const washes = [];
  const whites = [];
  const dx = look * 1.3;
  const pupils = (rr, y = ey) => {
    fills.push(dot(-ex + dx, y, rr), dot(ex + dx, y, rr));
    glints.push(dot(-ex + dx - 0.5, y - 0.6, 0.5), dot(ex + dx - 0.5, y - 0.6, 0.5));
  };
  if (mood === 'laugh') {
    fine.push(`M${-ex - 3} ${ey}q3 -3.6 6 0M${ex - 3} ${ey}q3 -3.6 6 0`);
    if (mouth) {
      const m = `M${-w - 1} ${my - 1}C${-w} ${my + 9} ${w} ${my + 9} ${w + 1} ${my - 1}C${w / 2} ${my} ${-w / 2} ${my} ${-w - 1} ${my - 1}Z`;
      fine.push(m);
      washes.push({ c: PAL.red, o: 0.8, d: m });
    }
  } else if (mood === 'proud') {
    fine.push(`M${-ex - 3} ${ey}q3 2.8 6 0M${ex - 3} ${ey}q3 2.8 6 0`, `M${-ex - 3} ${ey - 5}q3 -2 6 0M${ex - 3} ${ey - 5}q3 -2 6 0`);
    if (mouth) fine.push(`M${-w + 1} ${my}q${w - 1} 3.5 ${2 * w - 2} 0`);
  } else if (mood === 'sly') {
    fine.push(`M${-ex - 3.2} ${ey - 0.6}l6.4 0M${ex - 3.2} ${ey - 0.6}l6.4 0`);
    fills.push(`M${-ex - 2.4 + dx} ${ey - 0.6}a2.2 2 0 0 0 4.4 0ZM${ex - 2.4 + dx} ${ey - 0.6}a2.2 2 0 0 0 4.4 0Z`);
    if (mouth) fine.push(`M${-w - 1} ${my - 1.5}C${-w / 2} ${my + 4} ${w / 2} ${my + 4} ${w + 1} ${my - 3}l1.5 -1`);
  } else if (mood === 'wow' || mood === 'worried') {
    const rw = mood === 'worried' ? 3.4 : 3;
    whites.push(dot(-ex, ey, rw), dot(ex, ey, rw));
    fine.push(dot(-ex, ey, rw), dot(ex, ey, rw));
    pupils(1.4);
    if (mood === 'worried') {
      fine.push(`M${-ex - 4} ${ey - 5}l7 -3M${ex + 4} ${ey - 5}l-7 -3`);
      if (mouth) fine.push(`M${-w + 1} ${my + 1}q${(w - 1) / 2} -2.5 ${w - 1} 0q${(w - 1) / 2} 2.5 ${w - 1} 0`);
    } else {
      fine.push(`M${-ex - 3} ${ey - 6}q3 -2.4 6 0M${ex - 3} ${ey - 6}q3 -2.4 6 0`);
      if (mouth) {
        const o = oval(0, my + 2, 3, 4);
        fine.push(o);
        washes.push({ c: PAL.red, o: 0.8, d: o });
      }
    }
  } else {
    pupils(r);
    if (mouth) fine.push(`M${-w} ${my}q${w} 5 ${2 * w} 0`);
  }
  return { fine, fills, glints, washes, whites };
}

/** A shoe, ankle at (0,0), toe to the right (flip with scale(-1 1)). */
function shoe(c = PAL.slate) {
  const d = 'M-5 -4C-7 1 -6 4 -2 4L11 4C15 4 15 -1 11 -2C7 -3 4 -4 -5 -4Z';
  return { lines: [d], washes: [{ c, o: 0.85, d }] };
}

// =============================================================================================
// THE EMPEROR (feet at 0,0), about 160 tall and very round: a round pink face, a big curly ginger
// moustache, ginger tufts over the ears and a little gold crown perched on top. Head at E_HEAD;
// arms from the shoulders (±30,-98). dress: 'coat' (the grand purple coat, gold buttons, white
// ruff), 'pants' (only his baggy spotty underpants), 'blanket' (wrapped in a big red blanket).
// =============================================================================================
export const E_HEAD = [0, -136];
export const E_ARMS = {
  down: [
    [[-30, -98, 13], [-40, -82, 12], [-44, -66, 12], [-44, -58, 12]],
    [[30, -98, 13], [40, -82, 12], [44, -66, 12], [44, -58, 12]],
  ],
  hips: [
    [[-30, -98, 13], [-50, -86, 12], [-50, -72, 12], [-38, -66, 12]],
    [[30, -98, 13], [50, -86, 12], [50, -72, 12], [38, -66, 12]],
  ],
};
export const E_LEGS = [
  [[-14, -30, 12], [-14, -4, 10]],
  [[14, -30, 12], [14, -4, 10]],
];
const eFace = 'M-18 0C-18 -12 -10 -19 0 -19C10 -19 18 -12 18 0C18 12 10 19 0 19C-10 19 -18 12 -18 0Z';
const eCrown = 'M-10 -17L-12 -32L-5.5 -24L0 -35L5.5 -24L12 -32L10 -17C4 -19 -4 -19 -10 -17Z';
const eTache = 'M0 4C-5 1 -11 1 -15 5C-17 9 -22 8 -22 3C-22 -1 -18 -2 -17 1C-16 3 -18 4 -19 3M-15 5C-10 9 -4 9 0 7M0 4C5 1 11 1 15 5C17 9 22 8 22 3C22 -1 18 -2 17 1C16 3 18 4 19 3M15 5C10 9 4 9 0 7';
const eTacheFill = 'M0 4C-5 1 -11 1 -15 5C-17 9 -22 8 -22 3C-22 -1 -18 -2 -17 1C-15 6 -10 9 0 7C10 9 15 6 17 1C18 -2 22 -1 22 3C22 8 17 9 15 5C11 1 5 1 0 4Z';
const eTufts = 'M-17 -6C-23 -8 -24 -2 -20 0C-24 2 -22 8 -17 6ZM17 -6C23 -8 24 -2 20 0C24 2 22 8 17 6Z';
export function emperorHead({ mood = 'happy', look = 0, blush = false } = {}) {
  const m = faceMarks({ mood, ex: 6.5, ey: -6, my: 11, w: 5, look, r: 2 });
  return {
    lines: [eFace, eCrown, eTache],
    fine: ['M-8 18q8 4 16 0', 'M-17 -4q-3 2 -1 5M17 -4q3 2 1 5', ...m.fine],
    washes: [
      { c: PAL.rose, o: blush ? 0.75 : 0.4, d: eFace },
      { c: PAL.terracotta, o: 0.85, d: eTufts },
      { c: PAL.ochre, o: 1, d: eCrown },
      { c: PAL.red, o: 0.9, d: dot(0, -24, 2) },
      { c: PAL.sky, o: 0.9, d: dot(-6, -21, 1.4) + dot(6, -21, 1.4) },
      { c: PAL.rose, o: 0.95, d: dot(0, 1, 3.6) },
      { c: PAL.rose, o: 0.7, d: dot(-11, 4, 3) + dot(11, 4, 3) },
      { c: PAL.terracotta, o: 0.9, d: eTacheFill },
      ...m.washes,
    ],
    whites: m.whites,
    fills: m.fills,
    glints: [...m.glints, 'M-7 -28l1.4 -1l1 8l-1.4 0.6Z'],
  };
}

const ruff = 'M-20 -106C-24 -112 -18 -116 -13 -112C-12 -118 -4 -118 -3 -113C0 -118 8 -118 8 -112C12 -117 20 -114 18 -108C24 -106 22 -100 16 -100C12 -96 6 -98 4 -100C0 -96 -6 -97 -8 -100C-12 -96 -20 -98 -19 -102C-24 -102 -24 -106 -20 -106Z';

export function emperor({ dress = 'coat', mood = 'happy', look = 0, tilt = 0, arms = E_ARMS.down, legs = E_LEGS, toes = [-1, 1], blush = false } = {}) {
  const skin = [{ c: PAL.rose, o: 0.42 }];
  const parts = [];
  // legs and shoes first (under the coat)
  const rootY = dress === 'pants' ? -21 : -25;
  const legLines = dress === 'blanket' ? [] : legs.map((l) => limb([[l[0][0], Math.max(l[0][1], rootY), l[0][2]], ...l.slice(1)]));
  const stocking = dress === 'coat' ? [{ c: PAL.grey, o: 0.18 }] : skin;
  parts.push({ lines: legLines, washes: legLines.flatMap((d) => stocking.map((w) => ({ ...w, d: Z(d) }))) });
  legs.forEach((l, i) => {
    const [x, y] = l[l.length - 1];
    parts.push(place(shoe(PAL.slate), `translate(${x} ${y + 1}) scale(${toes[i]} 1)`));
    if (dress === 'coat') parts.push({ washes: [{ c: PAL.ochre, o: 1, d: dot(x + toes[i] * 4, y + 1, 2) }] });
  });
  const sleeve = dress === 'coat' ? PURPLE_W : dress === 'blanket' ? [{ c: PAL.red, o: 0.8 }] : skin;
  if (dress === 'coat') {
    const coat = 'M-16 -108C-32 -104 -40 -90 -42 -72C-44 -54 -42 -40 -38 -28C-14 -23 14 -23 38 -28C42 -40 44 -54 42 -72C40 -90 32 -104 16 -108';
    const trim = 'M-39.5 -35C-14 -30 14 -30 39.5 -35L38 -28C14 -23 -14 -23 -38 -28Z';
    const buttons = [-92, -78, -64, -50].map((y) => dot(0, y, 2.4)).join('');
    parts.push({
      lines: [coat, trim, ruff],
      fine: ['M0 -100L0 -32', buttons, 'M-26 -86q-6 18 -4 46M26 -86q6 18 4 46'],
      washes: [...PURPLE(Z(coat)), { c: PAL.ochre, o: 0.95, d: trim }, { c: PAL.ochre, o: 1, d: buttons }],
      whites: [ruff],
    });
  } else if (dress === 'pants') {
    const body = 'M-16 -108C-32 -104 -40 -90 -42 -72C-43 -62 -42 -56 -40 -50M16 -108C32 -104 40 -90 42 -72C43 -62 42 -56 40 -50';
    const bodyFill = 'M-16 -108C-32 -104 -40 -90 -42 -72C-43 -62 -42 -57 -41 -54C-14 -58 14 -58 41 -54C42 -57 43 -62 42 -72C40 -90 32 -104 16 -108Z';
    const pants = 'M-41 -54C-14 -58 14 -58 41 -54C45 -44 45 -32 41 -22C30 -18 16 -19 9 -24C4 -27 -4 -27 -9 -24C-16 -19 -30 -18 -41 -22C-45 -32 -45 -44 -41 -54Z';
    const band = 'M-41 -54C-14 -58 14 -58 41 -54L41.6 -49C14 -53 -14 -53 -41.6 -49Z';
    const spots = [[-30, -42], [-16, -46], [-2, -42], [14, -46], [28, -42], [-34, -30], [-22, -32], [-8, -34], [22, -32], [34, -30], [6, -36]]
      .map(([x, y]) => dot(x, y, 2.5))
      .join('');
    parts.push({
      lines: [body, pants, 'M-14 -108C-6 -104 6 -104 14 -108'],
      fine: [band, 'M-2 -70q3 2 1 4', 'M-30 -78q4 -4 8 -2M30 -78q-4 -4 -8 -2', 'M0 -52l0 -2'],
      washes: [...skin.map((w) => ({ ...w, d: bodyFill })), { c: PAL.sky, o: 0.15, d: pants }, { c: PAL.red, o: 0.85, d: spots }, { c: PAL.sky, o: 0.5, d: band }],
    });
  } else if (dress === 'blanket') {
    const blanket = 'M-20 -112C-42 -106 -50 -84 -50 -56C-50 -34 -48 -18 -44 -8C-20 -3 20 -3 44 -8C48 -18 50 -34 50 -56C50 -84 42 -106 20 -112';
    const flap = 'M20 -112C6 -104 -4 -94 -2 -78C0 -56 8 -30 4 -5';
    const pantsPeek = 'M-12 -5C-10 -1 10 -1 12 -5';
    parts.push({
      lines: [blanket, flap],
      fine: ['M-30 -96q-8 30 -6 84M-16 -90q-4 40 -2 84M30 -96q8 30 6 84M18 -80q4 30 2 72', pantsPeek],
      washes: [
        { c: PAL.red, o: 0.85, d: Z(blanket) },
        { c: PAL.terracotta, o: 0.4, d: 'M20 -112C6 -104 -4 -94 -2 -78C0 -56 8 -30 4 -5C20 -3 34 -5 44 -8C48 -18 50 -34 50 -56C50 -84 42 -106 20 -112Z' },
      ],
    });
  }
  parts.push(...arms.map((a) => arm(a, sleeve, 6)));
  parts.push(place(emperorHead({ mood, look, blush }), `translate(${E_HEAD[0]} ${E_HEAD[1]}) rotate(${tilt}) scale(1.15)`));
  return merge(...parts);
}

// =============================================================================================
// THE TRICKSTERS (feet at 0,0), about 165 tall and very thin, with long pointed noses, sly grins
// and patched coats. who 'a': a tall crooked slate hat, a terracotta coat with green patches and a
// little pointed beard; who 'b': a floppy red cap, a green coat with ochre patches, scruffy ochre
// hair. The upper body is drawn with the hips at T_HIP and turns round them by lean (+ bows to
// the right). pose: 'stand' or 'sit' (on a stool, hips lower). Arms from the shoulders (±14,-128)
// in the upper body's own coordinates.
// =============================================================================================
export const T_HIP = [0, -72];
export const T_HEAD = [0, -154];
export const T_ARMS = {
  down: [
    [[-14, -128, 8], [-20, -112, 7], [-22, -96, 7], [-22, -88, 7]],
    [[14, -128, 8], [20, -112, 7], [22, -96, 7], [22, -88, 7]],
  ],
};
export function tricksterHead({ who = 'a', mood = 'sly', look = 1 } = {}) {
  const face = 'M-11 -6C-12 -14 -6 -18 0 -18C7 -18 12 -14 11 -4C11 6 6 16 0 19C-6 16 -11 8 -11 -6Z';
  const nose = 'M1 -3C3 0 7 3 11 4C8 6 4 6 1 5';
  const m = faceMarks({ mood, ex: 5, ey: -6, my: 10.5, w: 5.5, look, r: 1.6 });
  const head = {
    lines: [face, nose],
    fine: [...m.fine],
    washes: [{ c: PAL.rose, o: 0.35, d: face }, { c: PAL.rose, o: 0.8, d: `${nose}Z` }, ...m.washes],
    whites: m.whites,
    fills: m.fills,
    glints: m.glints,
  };
  if (who === 'a') {
    const brim = 'M-17 -15C-8 -19 8 -20 17 -17C18 -15 16 -14 14 -14C6 -16 -6 -15 -15 -12C-18 -12 -19 -14 -17 -15Z';
    const crown = 'M-11 -16C-12 -26 -12 -34 -9 -42C-2 -44 4 -44 9 -41C10 -33 10 -25 10 -17';
    const beard = 'M-4 15C-3 22 0 26 2 28C3 24 4 20 4 15C2 17 -2 17 -4 15Z';
    const hair = 'M-11 -12C-15 -10 -16 -4 -13 -1M11 -12C15 -10 16 -4 13 -1';
    return merge(head, {
      lines: [brim, crown],
      fine: [beard, hair, 'M-11 -22C-4 -24 4 -24 10 -21'],
      washes: [
        { c: PAL.slate, o: 0.85, d: `${brim}${crown}C4 -19 -6 -18 -11 -16Z` },
        { c: PAL.slate, o: 0.8, d: beard },
        { c: PAL.ink, o: 0.4, d: 'M-11 -12C-15 -10 -16 -4 -13 -1L-11 -1ZM11 -12C15 -10 16 -4 13 -1L11 -1Z' },
      ],
    });
  }
  const cap = 'M-13 -10C-15 -22 -6 -28 4 -27C14 -26 22 -18 26 -6C28 -2 24 0 22 -3C20 -8 16 -14 12 -14C4 -16 -6 -14 -13 -10Z';
  const hair = 'M-12 -10C-16 -8 -17 -3 -14 0C-17 2 -15 6 -12 5M12 -12C16 -10 17 -6 14 -3C17 -1 15 3 12 2';
  return merge(head, {
    lines: [cap],
    fine: [hair, dot(25, -2, 3.6), 'M-6 6l0 0.1M-4 9l0 0.1M4 12l0 0.1M-2 13l0 0.1'],
    washes: [
      { c: PAL.red, o: 0.85, d: cap },
      { c: PAL.ochre, o: 0.9, d: `${hair}Z` },
      { c: PAL.ochre, o: 0.9, d: dot(25, -2, 3.6) },
    ],
  });
}

/** The trickster's stool (its seat top at y = -38). */
export function stool() {
  const seat = 'M-32 -38C-12 -41 12 -41 32 -38L32 -32C12 -29 -12 -29 -32 -32Z';
  const legs = 'M-26 -31L-30 0M26 -31L30 0';
  return { lines: [seat, legs], washes: [{ c: PAL.terracotta, o: 0.6, d: seat }] };
}

export function trickster({ who = 'a', mood = 'sly', look = 1, lean = 0, tilt = 0, pose = 'stand', arms = T_ARMS.down } = {}) {
  const coatC = who === 'a' ? [{ c: PAL.terracotta, o: 0.75 }] : [{ c: PAL.green, o: 0.8 }];
  const patchC = who === 'a' ? PAL.green : PAL.ochre;
  const coat = 'M-8 -134C-17 -132 -18 -124 -17 -112C-16 -96 -17 -80 -19 -62C-8 -60 8 -60 19 -62C17 -80 16 -96 17 -112C18 -124 17 -132 8 -134';
  const patches = who === 'a' ? 'M-12 -84L-4 -85L-3 -76L-12 -75ZM6 -114L13 -114L13 -106L6 -106Z' : 'M5 -82L13 -83L13 -74L5 -73ZM-13 -116L-6 -117L-6 -109L-13 -108Z';
  const stitches = who === 'a' ? 'M-13 -82l2 0M-13 -78l2 0M-4.6 -83l2 0M-4.6 -78l2 0M5 -112l2 0M12 -110l2 0' : 'M4 -80l2 0M4 -76l2 0M12 -81l2 0M12 -76l2 0M-14 -114l2 0M-7 -112l2 0';
  const buttons = dot(0, -116, 1.6) + dot(0, -102, 1.6) + dot(0, -88, 1.6);
  const upper = merge(
    {
      lines: [coat],
      fine: [patches, stitches, buttons, 'M0 -128L0 -64', 'M-6 -134C-3 -128 3 -128 6 -134'],
      washes: [...coatC.map((w) => ({ ...w, d: Z(coat) })), { c: patchC, o: 0.95, d: patches }, { c: PAL.slate, o: 0.8, d: buttons }],
    },
    ...arms.map((a) => arm(a, coatC, 3.8)),
    place(tricksterHead({ who, mood, look }), `translate(${T_HEAD[0]} ${T_HEAD[1]}) rotate(${tilt}) scale(1.2)`),
  );
  const parts = [];
  if (pose === 'sit') {
    const legs = [
      [[-8, -40, 9], [-20, -32, 8.5], [-21, -18, 8], [-20, -6, 8]],
      [[8, -40, 9], [20, -32, 8.5], [21, -18, 8], [20, -6, 8]],
    ];
    const ls = legs.map((l) => limb(l));
    parts.push({ lines: ls, washes: ls.map((d) => ({ c: PAL.slate, o: 0.75, d: Z(d) })) });
    parts.push(place(shoe(PAL.ink), 'translate(-20 -3) scale(-0.9 0.9)'), place(shoe(PAL.ink), 'translate(20 -3) scale(0.9)'));
    parts.push(place(upper, `translate(0 26) rotate(${lean} ${T_HIP[0]} ${T_HIP[1]})`));
  } else {
    const legs = [
      [[-7, -66, 9], [-8, -36, 8], [-8, -6, 8]],
      [[7, -66, 9], [8, -36, 8], [8, -6, 8]],
    ];
    const ls = legs.map((l) => limb(l));
    parts.push({ lines: ls, washes: ls.map((d) => ({ c: PAL.slate, o: 0.75, d: Z(d) })) });
    parts.push(place(shoe(PAL.ink), 'translate(-8 -3) scale(-0.9 0.9)'), place(shoe(PAL.ink), 'translate(8 -3) scale(0.9)'));
    parts.push(place(upper, `rotate(${lean} ${T_HIP[0]} ${T_HIP[1]})`));
  }
  return merge(...parts);
}

// =============================================================================================
// THE OLD MINISTER (feet at 0,0), about 145 tall: a long green robe with a gold chain, a bald head
// with a grey fringe and a little slate cap, round spectacles and a long white beard. Head at
// M_HEAD; arms from the shoulders (±22,-100).
// =============================================================================================
export const M_HEAD = [0, -120];
export const M_ARMS = {
  down: [
    [[-22, -100, 10], [-30, -86, 9], [-33, -72, 9], [-33, -64, 9]],
    [[22, -100, 10], [30, -86, 9], [33, -72, 9], [33, -64, 9]],
  ],
  behind: [
    [[-22, -100, 10], [-28, -86, 9], [-24, -72, 9]],
    [[22, -100, 10], [28, -86, 9], [24, -72, 9]],
  ],
};
export function ministerHead({ mood = 'worried', look = 0 } = {}) {
  const face = 'M-15 -2C-15 -13 -8 -19 0 -19C8 -19 15 -13 15 -2C15 4 12 8 8 10L-8 10C-12 8 -15 4 -15 -2Z';
  const fringe = 'M-15 -4C-19 -6 -20 2 -16 4C-19 7 -15 11 -12 8M15 -4C19 -6 20 2 16 4C19 7 15 11 12 8';
  const beard = 'M-13 4C-15 18 -10 34 0 44C10 34 15 18 13 4C9 9 4 9 0 8C-4 9 -9 9 -13 4Z';
  const cap = 'M-10 -16C-8 -22 8 -22 10 -16C4 -18 -4 -18 -10 -16Z';
  const m = faceMarks({ mood, ex: 6, ey: -3, my: 7, w: 3, look, r: 1.6 });
  const specs = dot(-6, -3, 4.6) + dot(6, -3, 4.6);
  const brows = mood === 'worried' ? [] : ['M-10 -10q4 -2 8 0M2 -10q4 -2 8 0'];
  return {
    lines: [face, beard, cap],
    fine: [specs, 'M-1.4 -3.4q1.4 -1.6 2.8 0M-10.6 -3l-4 -1M10.6 -3l4 -1', fringe, 'M-6 16q-1 8 1 16M0 14l0 20M6 16q1 8 -1 16', 'M-6 6C-3 4 -1 5 0 6C1 5 3 4 6 6', ...brows, ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.35, d: face },
      { c: PAL.grey, o: 0.6, d: `${fringe}Z` },
      { c: PAL.slate, o: 0.85, d: cap },
      { c: PAL.rose, o: 0.8, d: dot(0, 2, 2.6) },
      { c: PAL.sky, o: 0.3, d: specs },
      ...m.washes,
    ],
    whites: [beard, ...m.whites],
    fills: m.fills,
    glints: m.glints,
  };
}
export function minister({ mood = 'worried', look = 0, tilt = 0, lean = 0, arms = M_ARMS.down } = {}) {
  const robe = 'M-12 -104C-24 -100 -28 -86 -28 -66C-28 -42 -30 -20 -34 -2C-12 2 12 2 34 -2C30 -20 28 -42 28 -66C28 -86 24 -100 12 -104';
  const chain = 'M-16 -102C-12 -86 12 -86 16 -102';
  const medal = dot(0, -86, 4);
  const upper = merge(
    {
      lines: [robe],
      fine: [chain, medal, 'M-12 -60q-4 26 -8 54M12 -60q4 26 8 54'],
      washes: [{ c: PAL.green, o: 0.72, d: Z(robe) }, { c: PAL.slate, o: 0.25, d: Z(robe) }, { c: PAL.ochre, o: 1, d: medal }],
      once: ['M-15 -98l1 1M-13 -94l1 1M-10 -91l1 1M-6 -89l1 1M6 -89l1 1M10 -91l1 1M13 -94l1 1M15 -98l1 1'],
    },
    ...arms.map((a) => arm(a, [{ c: PAL.green, o: 0.72 }, { c: PAL.slate, o: 0.25 }], 4.6)),
    place(ministerHead({ mood, look }), `translate(${M_HEAD[0]} ${M_HEAD[1]}) rotate(${tilt})`),
  );
  const feet = merge(place(shoe(PAL.slate), 'translate(-12 -3) scale(-1 1)'), place(shoe(PAL.slate), 'translate(12 -3)'));
  return merge(feet, place(upper, `rotate(${lean} 0 -20)`));
}

// =============================================================================================
// THE LITTLE GIRL (feet at 0,0), about 88 tall: auburn hair in two bunches with sky ribbons, a
// sky dress with a white collar, red shoes. Head at G_HEAD; arms from the shoulders (±11,-58).
// sit: sitting astride (legs dangle forward from the hips at (0,-34)). medal: a golden medal.
// =============================================================================================
export const G_HEAD = [0, -72];
export const G_ARMS = {
  down: [
    [[-11, -58, 7], [-15, -48, 6.5], [-17, -38, 6.5], [-17, -34, 6.5]],
    [[11, -58, 7], [15, -48, 6.5], [17, -38, 6.5], [17, -34, 6.5]],
  ],
};
export function girlHead({ mood = 'happy', look = 0 } = {}) {
  const face = 'M-12 -2C-12.4 8 -6 13 0 13C6 13 12.4 8 12 -2';
  const faceFill = `${face}C10 -8 6 -10 0 -8C-5 -10 -10 -8 -12 -2Z`;
  const hair = 'M-12.4 0C-14 -13 -8 -18 0 -18C8 -18 14 -13 12.4 0C11 -7 6 -10 0 -8C-5 -10 -10 -7 -12.4 0Z';
  const bunL = 'M-12 -8C-20 -12 -26 -6 -26 2C-26 8 -22 10 -18 8C-20 4 -16 0 -12 -2Z';
  const bunR = 'M12 -8C20 -12 26 -6 26 2C26 8 22 10 18 8C20 4 16 0 12 -2Z';
  const bows = 'M-12 -8l-4 -5l-1 7ZM12 -8l4 -5l1 7Z';
  const m = faceMarks({ mood, ex: 4.4, ey: 0, my: 6.5, r: 1.6, w: 3.6, look });
  return {
    lines: [face, hair, bunL, bunR],
    fine: [bows, 'M-4 -13q2 3 1 5M3 -14q1 3 0 5M-22 -2q2 3 0 6M22 -2q-2 3 0 6', 'M0.5 2c1.5 1.1 1.5 2.3 -0.5 2.6', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.3, d: faceFill },
      { c: PAL.terracotta, o: 0.9, d: `${hair}${bunL}${bunR}` },
      { c: PAL.sky, o: 0.95, d: bows },
      { c: PAL.rose, o: 0.7, d: dot(-7.5, 4.5, 2.4) + dot(7.5, 4.5, 2.4) },
      ...m.washes,
    ],
    whites: m.whites,
    fills: m.fills,
    glints: m.glints,
  };
}
export function girl({ mood = 'happy', look = 0, tilt = 0, arms = G_ARMS.down, sit = false, medal = false } = {}) {
  const dress = sit
    ? 'M-7 -62C-12 -60 -14 -55 -14 -48C-15 -42 -17 -36 -20 -30C-8 -27 8 -27 20 -30C17 -36 15 -42 14 -48C14 -55 12 -60 7 -62'
    : 'M-7 -62C-12 -60 -14 -55 -14 -48C-16 -38 -19 -28 -21 -17C-8 -14 8 -14 21 -17C19 -28 16 -38 14 -48C14 -55 12 -60 7 -62';
  const collar = 'M-8 -62C-6 -55 -1 -55 0 -59C1 -55 6 -55 8 -62C4 -63 -4 -63 -8 -62Z';
  const parts = [];
  if (sit) {
    const legs = [limb([[-10, -32, 6], [-16, -22, 5.5], [-16, -6, 5]]), limb([[10, -32, 6], [16, -22, 5.5], [16, -6, 5]])];
    parts.push({ lines: legs, washes: legs.map((d) => ({ c: PAL.rose, o: 0.4, d: Z(d) })) });
    parts.push(place(shoe(PAL.red), 'translate(-16 -6) scale(-0.6 0.6)'), place(shoe(PAL.red), 'translate(16 -6) scale(0.6)'));
  } else {
    const legs = [limb([[-7, -16, 5], [-7, -4, 4.5]]), limb([[7, -16, 5], [7, -4, 4.5]])];
    parts.push({ lines: legs, washes: legs.map((d) => ({ c: PAL.rose, o: 0.4, d: Z(d) })) });
    parts.push(place(shoe(PAL.red), 'translate(-7 -3) scale(-0.6 0.6)'), place(shoe(PAL.red), 'translate(7 -3) scale(0.6)'));
  }
  parts.push({
    lines: [dress],
    fine: [collar, sit ? 'M-16 -34l3 1M14 -40l-3 1' : 'M-14 -26l3 1M12 -32l-3 1'],
    washes: [{ c: PAL.sky, o: 0.8, d: Z(dress) }],
    whites: [collar],
  });
  if (medal) {
    const ribbon = 'M-6 -56L-2 -46L2 -46L6 -56L2 -56L0 -50L-2 -56Z';
    const disc = dot(0, -42, 4.4);
    parts.push({ fine: [ribbon, disc, 'M-1.6 -42l1.6 -2l1.6 2l-1.6 2Z'], washes: [{ c: PAL.red, o: 0.95, d: ribbon }, { c: PAL.ochre, o: 1, d: disc }] });
  }
  parts.push(...arms.map((a) => arm(a, [{ c: PAL.sky, o: 0.8 }], 3.4)));
  parts.push(place(girlHead({ mood, look }), `translate(${G_HEAD[0]} ${G_HEAD[1]}) rotate(${tilt})`));
  return merge(...parts);
}

// =============================================================================================
// THE FATHER (feet at 0,0), about 150 tall: brown hair and beard, a slate coat with a green scarf.
// Head at F_HEAD; arms from the shoulders (±20,-106).
// =============================================================================================
export const F_HEAD = [0, -126];
export const F_ARMS = {
  down: [
    [[-20, -106, 10], [-28, -92, 9], [-31, -78, 9], [-31, -70, 9]],
    [[20, -106, 10], [28, -92, 9], [31, -78, 9], [31, -70, 9]],
  ],
};
export function father({ mood = 'happy', look = 0, tilt = 0, arms = F_ARMS.down } = {}) {
  const coat = 'M-10 -112C-20 -110 -23 -100 -23 -88C-23 -72 -24 -58 -25 -44L25 -44C24 -58 23 -72 23 -88C23 -100 20 -110 10 -112';
  const trousers = 'M-24 -44L-21 -6L-4 -6L-1 -32L1 -32L4 -6L21 -6L24 -44';
  const scarf = 'M-12 -112C-6 -106 6 -106 12 -112L11 -106C4 -101 -4 -101 -11 -106ZM4 -104L8 -82L13 -84L9 -104Z';
  const face = 'M-12 -4C-12.5 8 -7 14 0 14C7 14 12.5 8 12 -4C10 -8 -10 -8 -12 -4Z';
  const hair = 'M-13 -2C-15 -14 -8 -19 0 -19C8 -19 15 -14 13 -2C10 -8 4 -10 0 -8C-4 -10 -10 -8 -13 -2Z';
  const beard = 'M-12 3C-13 12 -7 18 0 18C7 18 13 12 12 3C9 9 4 10 0 9C-4 10 -9 9 -12 3Z';
  const m = faceMarks({ mood, ex: 4.6, ey: -1, my: 6, w: 3.6, look, r: 1.7 });
  const head = {
    lines: [face, hair, beard],
    fine: ['M0.5 1.5c1.5 1.1 1.5 2.4 -0.5 2.8', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.38, d: face },
      { c: PAL.terracotta, o: 0.6, d: hair + beard },
      { c: PAL.slate, o: 0.35, d: hair + beard },
      ...m.washes,
    ],
    whites: m.whites,
    fills: m.fills,
    glints: m.glints,
  };
  return merge(
    {
      lines: [coat, trousers, 'M-21 -6C-29 -6 -30 0 -24 0L-4 0L-4 -6ZM21 -6C29 -6 30 0 24 0L4 0L4 -6Z'],
      fine: [scarf, 'M0 -104L0 -46'],
      washes: [
        { c: PAL.slate, o: 0.7, d: Z(coat) },
        { c: PAL.terracotta, o: 0.55, d: Z(trousers) },
        { c: PAL.green, o: 0.95, d: scarf },
        { c: PAL.ink, o: 0.5, d: 'M-21 -6C-29 -6 -30 0 -24 0L-4 0L-4 -6ZM21 -6C29 -6 30 0 24 0L4 0L4 -6Z' },
      ],
    },
    ...arms.map((a) => arm(a, [{ c: PAL.slate, o: 0.7 }], 4.8)),
    place(head, `translate(${F_HEAD[0]} ${F_HEAD[1]}) rotate(${tilt})`),
  );
}

// =============================================================================================
// THE PAGES (feet at 0,0), about 82 tall: two little boys with round pudding-bowl hair, a red and
// gold tabard and white tights. who 'a': ochre hair, red tabard; who 'b': terracotta hair, sky
// tabard. Head at PG_HEAD; arms from the shoulders (±10,-54).
// =============================================================================================
export const PG_HEAD = [0, -68];
export const PG_ARMS = {
  up: [
    [[-10, -54, 6.5], [-18, -66, 6], [-20, -80, 6]],
    [[10, -54, 6.5], [18, -66, 6], [20, -80, 6]],
  ],
};
export function page({ who = 'a', mood = 'proud', look = 0, tilt = 0, arms = PG_ARMS.up, legs } = {}) {
  const tabardC = who === 'a' ? PAL.red : PAL.sky;
  const hairC = who === 'a' ? PAL.ochre : PAL.terracotta;
  const tabard = 'M-7 -58C-12 -56 -13 -50 -13 -44C-13 -36 -14 -30 -15 -24L15 -24C14 -30 13 -36 13 -44C13 -50 12 -56 7 -58';
  const legPts = legs ?? [
    [[-6, -26, 6], [-6, -4, 5]],
    [[6, -26, 6], [6, -4, 5]],
  ];
  const ls = legPts.map((l) => limb(l));
  const face = 'M-11 -2C-11.4 7 -6 12 0 12C6 12 11.4 7 11 -2';
  const faceFill = `${face}C9 -4 -9 -4 -11 -2Z`;
  const hair = 'M-12 1C-14 -12 -8 -17 0 -17C8 -17 14 -12 12 1L11 -2C4 -4 -4 -4 -11 -2Z';
  const m = faceMarks({ mood, ex: 4.2, ey: 2, my: 7.5, r: 1.5, w: 3.4, look });
  const head = {
    lines: [face, hair],
    fine: m.fine,
    washes: [{ c: PAL.rose, o: 0.3, d: faceFill }, { c: hairC, o: 0.9, d: hair }, { c: PAL.rose, o: 0.7, d: dot(-7, 6, 2) + dot(7, 6, 2) }, ...m.washes],
    whites: m.whites,
    fills: m.fills,
    glints: m.glints,
  };
  const shoes = legPts.map((l, i) => {
    const [x, y] = l[l.length - 1];
    return place(shoe(PAL.slate), `translate(${x} ${y + 1}) scale(${i ? 0.55 : -0.55} 0.55)`);
  });
  return merge(
    { lines: ls, washes: ls.map((d) => ({ c: PAL.grey, o: 0.2, d: Z(d) })) },
    ...shoes,
    {
      lines: [tabard],
      fine: ['M-13 -36L13 -36', 'M0 -56L0 -24'],
      washes: [{ c: tabardC, o: 0.75, d: Z(tabard) }, { c: PAL.ochre, o: 0.95, d: 'M-13 -39L13 -39L13 -34L-13 -34Z' }],
    },
    ...arms.map((a) => arm(a, [{ c: tabardC, o: 0.75 }], 3.4)),
    place(head, `translate(${PG_HEAD[0]} ${PG_HEAD[1]}) rotate(${tilt})`),
  );
}

// =============================================================================================
// THINGS
// =============================================================================================

/** The tall standing mirror (feet at 0,0), about 170 tall: an ochre frame and a sky glass. */
export function mirror({ glint = true } = {}) {
  const frame = oval(0, -100, 32, 62);
  const glass = oval(0, -100, 24, 54);
  const stand = 'M-16 -40L-26 0M16 -40L26 0M-32 0L-20 0M20 0L32 0';
  return {
    lines: [frame, glass, stand],
    fine: [glint ? 'M-12 -126L6 -144M-14 -110L12 -136M8 -78L16 -86' : 'M10 -66L16 -74M12 -58L18 -66', dot(0, -164, 3.4)],
    washes: [
      { c: PAL.ochre, o: 0.9, d: frame + glass, rule: 'evenodd' },
      { c: PAL.terracotta, o: 0.35, d: frame + glass, rule: 'evenodd' },
      { c: PAL.sky, o: 0.45, d: glass },
      { c: PAL.ochre, o: 1, d: dot(0, -164, 3.4) },
    ],
    whites: glint ? ['M-14 -112L10 -138L14 -132L-10 -106Z'] : [],
  };
}

/** The empty wooden loom (feet at 0,0), 150 wide and 140 tall, with nothing on it. */
export function loom() {
  const posts = 'M-70 0L-68 -140M-58 0L-57 -140M70 0L68 -140M58 0L57 -140';
  const top = 'M-76 -146C-40 -150 40 -150 76 -146L76 -134C40 -138 -40 -138 -76 -134Z';
  const beam = 'M-62 -60C-30 -62 30 -62 62 -60L62 -52C30 -54 -30 -54 -62 -52Z';
  const low = 'M-62 -24L62 -24';
  const heddle = 'M-54 -110L54 -110M-54 -102L54 -102';
  const pegs = dot(-63, -128, 2.4) + dot(63, -128, 2.4);
  const wood = 'M-70 0L-68 -140L-57 -140L-58 0ZM58 0L57 -140L68 -140L70 0Z';
  return {
    lines: [posts, top, beam, low],
    fine: [heddle, pegs, 'M-64 -100l0 20M64 -100l0 20'],
    washes: [
      { c: PAL.terracotta, o: 0.65, d: wood + top + beam },
      { c: PAL.ochre, o: 0.4, d: wood + top + beam },
    ],
  };
}

/** A fat bag of gold (bottom at 0,0), about 46 tall, with coins spilling out. */
export function goldBag() {
  const bag = 'M-10 -38C-14 -34 -24 -24 -24 -12C-24 -2 -14 2 0 2C14 2 24 -2 24 -12C24 -24 14 -34 10 -38';
  const neck = 'M-10 -38C-4 -36 4 -36 10 -38C12 -42 8 -46 4 -44C2 -48 -2 -48 -4 -44C-8 -46 -12 -42 -10 -38Z';
  const coins = [oval(30, -2, 6, 3), oval(38, 0, 6, 3), oval(34, -6, 6, 3), oval(-30, 0, 6, 3)];
  return {
    lines: [bag, neck],
    fine: ['M-10 -36C-4 -33 4 -33 10 -36', ...coins, 'M-6 -20L6 -20M0 -26L0 -14', 'M44 -16l3 -3M48 -8l4 0M-40 -10l-4 -2'],
    washes: [{ c: PAL.terracotta, o: 0.7, d: Z(bag) + neck }, { c: PAL.ochre, o: 1, d: coins.join('') }],
  };
}

/** A candle (bottom at 0,0) h tall, with its flame and a soft glow. */
export function candle(h = 40) {
  const body = `M-5 0L-5 ${-h}C-2 ${-h - 2} 2 ${-h - 2} 5 ${-h}L5 0`;
  const flame = `M0 ${-h - 4}C-4 ${-h - 9} -3 ${-h - 14} 0 ${-h - 20}C3 ${-h - 14} 4 ${-h - 9} 0 ${-h - 4}Z`;
  const drip = `M-5 ${-h + 6}q2 4 3 0`;
  return {
    lines: [body],
    fine: [flame, drip, `M0 ${-h - 1}l0 -3`],
    washes: [
      { c: PAL.grey, o: 0.15, d: `${body}Z` },
      { c: PAL.ochre, o: 1, d: flame },
      { c: PAL.red, o: 0.5, d: `M0 ${-h - 4}C-2 ${-h - 7} -2 ${-h - 10} 0 ${-h - 12}C2 ${-h - 10} 2 ${-h - 7} 0 ${-h - 4}Z` },
    ],
  };
}

/** A candlestick with three candles (bottom at 0,0). */
export function candlestick() {
  const base = 'M-16 0C-16 -6 -6 -8 -4 -12L-4 -40M4 -40L4 -12C6 -8 16 -6 16 0Z';
  const arms = 'M-4 -40C-12 -40 -26 -42 -28 -52M4 -40C12 -40 26 -42 28 -52M-4 -40L-4 -56M4 -40L4 -56';
  return merge(
    { lines: [base, arms], washes: [{ c: PAL.ochre, o: 0.8, d: 'M-16 0C-16 -6 -6 -8 -4 -12L-4 -40L4 -40L4 -12C6 -8 16 -6 16 0Z' }] },
    place(candle(30), 'translate(-28 -52)'),
    place(candle(38), 'translate(0 -56)'),
    place(candle(30), 'translate(28 -52)'),
  );
}

/** Big scissors, pivot at (0,0), blades pointing to +x, open by angle a (degrees). */
export function scissors(a = 30) {
  const blade = 'M0 0C10 -3 26 -4 40 -1C26 2 10 3 0 0Z';
  const ring = dot(-14, 5, 5);
  const one = { lines: [blade, 'M0 0L-9 3', ring], washes: [{ c: PAL.grey, o: 0.6, d: blade }, { c: PAL.red, o: 0.85, d: ring }] };
  return merge(place(one, `rotate(${-a / 2})`), place(one, `scale(1 -1) rotate(${-a / 2})`), { fine: [dot(0, 0, 1.6)] });
}

/** A long needle from (0,0) along +x, with an empty eye and no thread. */
export function needle(len = 34) {
  const d = `M0 -1.2L${len - 8} -1.6C${len - 4} -2 ${len} -1.4 ${len} 0C${len} 1.4 ${len - 4} 2 ${len - 8} 1.6L0 1.2L-4 0Z`;
  return { fine: [d, oval(len - 5, 0, 2.6, 0.9)], washes: [{ c: PAL.grey, o: 0.6, d }] };
}

/** A little sparkle (4-pointed star) of size s at (0,0). */
export const sparkle = (s = 6) => `M0 ${-s}L0 ${s}M${-s} 0L${s} 0M${-s * 0.5} ${-s * 0.5}l${s * 0.2} ${s * 0.2}M${s * 0.5} ${s * 0.5}l${-s * 0.2} ${-s * 0.2}`;

/** Bunting: little triangle flags along a sagging string from (x1,y1) to (x2,y2). */
export function bunting(x1, y1, x2, y2, n = 9, sag = 20) {
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2 + sag * 2;
  const string = `M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}`;
  const cols = [PAL.red, PAL.ochre, PAL.sky, PAL.green];
  const flags = [];
  const washes = [];
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const x = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t * t * x2;
    const y = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t * t * y2;
    const d = `M${f(x - 8)} ${f(y)}L${f(x + 8)} ${f(y)}L${f(x)} ${f(y + 16)}Z`;
    flags.push(d);
    washes.push({ c: cols[i % 4], o: 0.85, d });
  }
  return { lines: [string], fine: flags, washes };
}
