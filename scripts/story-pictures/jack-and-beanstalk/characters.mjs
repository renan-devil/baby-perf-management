import { PAL } from '../lib.mjs';
import { at, compose, dot, f, limb, merge, oval, place } from '../stone-soup/characters.mjs';
import { bumpy } from '../puss-in-boots/characters.mjs';
import { note } from '../elves-and-shoemaker/characters.mjs';

// Jack and the Beanstalk: Jack, his mother, the little old man, Milky-White the cow, the Giant, the
// Giant's wife, the little brown hen, the golden egg, the golden harp, the beanstalk, the cottage
// and the clouds, drawn once here and placed in each picture with a transform (place); flip with
// scale(-1 1). The build only draws files named <n>.mjs, so this file is not a picture. Standing
// characters have their feet at y = 0 and look at us.

export { at, bumpy, compose, dot, merge, note, oval, place };

const Z = (d) => `${d}Z`;

/** An arm (limb along pts) in a sleeve of colour c, with a round hand of radius r. */
function arm(pts, c, o, r, extra = []) {
  // the sleeve stops at the wrist, so the hand keeps its own colour
  const n = pts.length;
  const [x, y] = pts[n - 1];
  const [px, py] = pts[n - 2];
  const l = Math.hypot(x - px, y - py);
  const k = Math.min(0.8, (r * 0.75) / l);
  const d = limb([...pts.slice(0, -1), [f(x - (x - px) * k), f(y - (y - py) * k), pts[n - 1][2]]]);
  const h = dot(x, y, r);
  return { lines: [d], fine: [h], washes: [{ c, o, d: Z(d) }, ...extra.map((w) => ({ ...w, d: Z(d) })), { c: PAL.rose, o: 0.6, d: h }] };
}

/** A leg (limb along pts) in trousers, with a shoe at the foot pointing to dir (-1 left, 1 right). */
function leg(pts, trousers, shoe, dir, size = 1) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const s = oval(x + dir * 3 * size, y + 5 * size, 7.5 * size, 4.6 * size);
  return { lines: [d, s], washes: [...trousers.map((w) => ({ ...w, d: Z(d) })), ...shoe.map((w) => ({ ...w, d: s }))] };
}

/**
 * Eyes and mouth of the people: eyes at (±ex, ey), mouth at my. mood: 'happy', 'wow' (eyes wide,
 * mouth a small "o", brows up), 'sad', 'cross' (brows down, shouting), 'laugh', 'shut' (beaming, eyes
 * closed), 'peep' / 'peepL' (looking right / left), 'hush' (looking left, lips pursed: tiptoeing).
 */
function faceMarks({ mood, ex, ey, my, r = 1.8, w = 4.5 }) {
  const fine = [];
  const fills = [];
  const glints = [];
  const washes = [];
  const shut = (up) => `M${-ex - 3} ${ey}q3 ${up ? -3.4 : 3} 6 0M${ex - 3} ${ey}q3 ${up ? -3.4 : 3} 6 0`;
  const eyes = (dx = 0, rr = r) => {
    fills.push(dot(-ex + dx, ey, rr), dot(ex + dx, ey, rr));
    glints.push(dot(-ex + dx - 0.5, ey - 0.6, 0.55), dot(ex + dx - 0.5, ey - 0.6, 0.55));
  };
  if (mood === 'laugh') {
    const mouth = `M${-w - 1} ${my - 1}C${-w} ${my + 8} ${w} ${my + 8} ${w + 1} ${my - 1}C${w / 2} ${my} ${-w / 2} ${my} ${-w - 1} ${my - 1}Z`;
    fine.push(shut(true), mouth);
    washes.push({ c: PAL.red, o: 0.75, d: mouth });
  } else if (mood === 'shut') {
    fine.push(shut(true), `M${-w} ${my}q${w} 5 ${2 * w} 0`);
  } else if (mood === 'wow' || mood === 'wowL') {
    eyes(mood === 'wowL' ? -1.2 : 0, r + 0.5);
    fine.push(`M${-ex - 3} ${ey - 5}q3 -2.4 6 0M${ex - 3} ${ey - 5}q3 -2.4 6 0`);
    const mouth = oval(0, my + 1.5, 2.4, 3);
    fills.push(mouth);
  } else if (mood === 'sad') {
    eyes();
    fine.push(`M${-ex - 3} ${ey - 4}L${-ex + 3} ${ey - 6}M${ex + 3} ${ey - 4}L${ex - 3} ${ey - 6}`, `M${-w + 1} ${my + 2}q${w - 1} -3.5 ${2 * w - 2} 0`);
  } else if (mood === 'cross') {
    eyes();
    fine.push(`M${-ex - 3.5} ${ey - 6.5}L${-ex + 3} ${ey - 3.5}M${ex + 3.5} ${ey - 6.5}L${ex - 3} ${ey - 3.5}`);
    const mouth = oval(0, my + 1.5, w * 0.75, 3.4);
    fine.push(mouth);
    washes.push({ c: PAL.red, o: 0.8, d: mouth });
  } else if (mood === 'hush') {
    eyes(-1.3);
    fills.push(oval(-1, my + 0.5, 1.6, 1.4));
  } else {
    const dx = mood === 'peep' ? 1.3 : mood === 'peepL' ? -1.3 : 0;
    eyes(dx);
    fine.push(`M${-w} ${my}q${w} 5 ${2 * w} 0`);
  }
  return { fine, fills, glints, washes };
}

// =============================================================================================
// JACK (feet at 0,0), about 120 tall: a mop of spiky ochre hair, freckles, a green tunic with
// patches (ochre and terracotta) tied with a rope belt, slate trousers, terracotta shoes.
// Head at J_HEAD; arms are two limb centrelines from the shoulders (±16,-84); legs two
// { pts, dir } from the hips (±8,-47), dir: which way the shoe points. upper: only above y = -62.
// =============================================================================================
export const J_HEAD = [0, -104];
export const J_ARMS = {
  down: [
    [[-16, -84, 8], [-21, -71, 7.5], [-24, -58, 7]],
    [[16, -84, 8], [21, -71, 7.5], [24, -58, 7]],
  ],
};
export const J_LEGS = {
  stand: [
    { pts: [[-8, -47, 10], [-9, -27, 9.5], [-10, -8, 9]], dir: -1 },
    { pts: [[8, -47, 10], [9, -27, 9.5], [10, -8, 9]], dir: 1 },
  ],
};
export function jackHead({ mood = 'happy' } = {}) {
  const face = 'M-12.5 -3C-13 8 -7 14 0 14C7 14 13 8 12.5 -3';
  const faceFill = `${face}C11 -10 -11 -10 -12.5 -3Z`;
  const hair = 'M-14 1C-19 -8 -15 -19 -6 -20C-3 -25 5 -25 7 -20C15 -20 19 -10 14 1C13 -3 11 -6 7 -6L6 -10L2 -6L-1 -10L-4 -6C-8 -7 -12 -4 -14 1Z';
  const m = faceMarks({ mood, ex: 4.6, ey: 1, my: 8, w: 4 });
  return {
    lines: [face, hair],
    fine: ['M-12.6 -1q-4.5 0 -3 6M12.6 -1q4.5 0 3 6', 'M0.5 2.5c1.6 1.2 1.6 2.6 -0.6 3', 'M-4 -22q-2 -4 -6 -4M2 -23q1 -4 -1 -7M7 -21q3 -3 6 -2', ...m.fine],
    once: ['M-8.5 5l0.4 0M-6.5 6.6l0.4 0M6.5 6.6l0.4 0M8.5 5l0.4 0'],
    washes: [
      { c: PAL.rose, o: 0.3, d: faceFill },
      { c: PAL.ochre, o: 0.95, d: hair },
      { c: PAL.terracotta, o: 0.25, d: hair },
      { c: PAL.rose, o: 0.55, d: dot(-8, 5, 2.3) + dot(8, 5, 2.3) },
      ...m.washes,
    ],
    fills: m.fills,
    glints: m.glints,
  };
}
export function jack({ mood = 'happy', tilt = 0, arms = J_ARMS.down, legs = J_LEGS.stand, upper = false } = {}) {
  // upper: the tunic stops at y = -62 (he leans on a window sill there)
  const tunic = upper
    ? 'M-9 -90C-18 -88 -21 -80 -21 -70C-21 -66 -21 -64 -21.2 -62M21.2 -62C21 -64 21 -66 21 -70C21 -80 18 -88 9 -90'
    : 'M-9 -90C-18 -88 -21 -80 -21 -70C-21 -62 -22 -54 -23 -45C-8 -42 8 -42 23 -45C22 -54 21 -62 21 -70C21 -80 18 -88 9 -90';
  const tunicFill = upper ? 'M-9 -90C-18 -88 -21 -80 -21 -70C-21 -66 -21 -64 -21.2 -62L21.2 -62C21 -64 21 -66 21 -70C21 -80 18 -88 9 -90C6 -93 -6 -93 -9 -90Z' : `${tunic}C6 -93 -6 -93 -9 -90Z`;
  const patches = upper ? 'M-15 -79L-6 -80L-5 -71L-14 -70Z' : 'M-15 -79L-6 -80L-5 -71L-14 -70ZM7 -54L16 -55L17 -47L8 -46Z';
  const belt = 'M-21.5 -60C-8 -57 8 -57 21.5 -60';
  const legParts = upper ? [] : legs.map((l) => leg(l.pts, [{ c: PAL.slate, o: 0.55 }, { c: PAL.grey, o: 0.35 }], [{ c: PAL.terracotta, o: 0.8 }, { c: PAL.grey, o: 0.4 }], l.dir));
  return merge(
    ...legParts,
    {
      lines: [tunic],
      fine: [patches, 'M-5 -89L0 -83L5 -89', ...(upper ? [] : [belt, 'M-3 -58l2 6M1 -58l3 5'])],
      once: ['M-15 -75l-2.5 0M-5 -75l2.5 0', ...(upper ? [] : ['M12 -55l0 -2.5M12 -46l0 2.5'])],
      washes: [
        { c: PAL.green, o: 0.8, d: tunicFill },
        { c: PAL.ochre, o: 0.9, d: 'M-15 -79L-6 -80L-5 -71L-14 -70Z' },
        ...(upper
          ? []
          : [
              { c: PAL.terracotta, o: 0.8, d: 'M7 -54L16 -55L17 -47L8 -46Z' },
              { c: PAL.ochre, o: 0.7, d: 'M-21.5 -61C-8 -58 8 -58 21.5 -61L21.5 -58C8 -55 -8 -55 -21.5 -58Z' },
            ]),
      ],
    },
    ...arms.map((a) => arm(a, PAL.green, 0.8, 4.3)),
    place(jackHead({ mood }), `translate(${J_HEAD[0]} ${J_HEAD[1]}) rotate(${tilt})`),
  );
}

// =============================================================================================
// JACK'S MOTHER (feet at 0,0), about 140 tall: auburn hair in a bun, a long sky-blue dress, a
// white apron. Head at M_HEAD; arms from the shoulders (±17,-102). upper: only above y = -60.
// =============================================================================================
export const M_HEAD = [0, -124];
export const M_ARMS = {
  down: [
    [[-17, -102, 8], [-23, -88, 7.5], [-26, -74, 7]],
    [[17, -102, 8], [23, -88, 7.5], [26, -74, 7]],
  ],
};
export function motherHead({ mood = 'happy' } = {}) {
  const face = 'M-12 -3C-12.5 8 -7 14 0 14C7 14 12.5 8 12 -3';
  const faceFill = `${face}C10 -9 -10 -9 -12 -3Z`;
  const hair = 'M-13 2C-16 -10 -10 -18 0 -18C10 -18 16 -10 13 2C11 -4 7 -8 0 -8C-7 -8 -11 -4 -13 2Z';
  const bun = oval(0, -21, 8, 6.5);
  const m = faceMarks({ mood, ex: 4.4, ey: 0.5, my: 7.5, w: 3.8 });
  return {
    lines: [face, hair, bun],
    fine: ['M0.4 2c1.4 1 1.4 2.2 -0.5 2.6', 'M-6 -16q-4 6 -4 12M5 -16q4 6 4 12', 'M-4 -23q4 2 8 0', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.3, d: faceFill },
      { c: PAL.terracotta, o: 0.8, d: hair + bun },
      { c: PAL.grey, o: 0.3, d: hair + bun },
      { c: PAL.rose, o: 0.55, d: dot(-7.5, 5, 2.3) + dot(7.5, 5, 2.3) },
      ...m.washes,
    ],
    fills: m.fills,
    glints: m.glints,
  };
}
export function mother({ mood = 'happy', tilt = 0, arms = M_ARMS.down, upper = false } = {}) {
  const dress = upper
    ? 'M-10 -110C-20 -108 -23 -98 -23 -86C-23 -78 -24 -68 -25 -60M25 -60C24 -68 23 -78 23 -86C23 -98 20 -108 10 -110'
    : 'M-10 -110C-20 -108 -23 -98 -23 -86C-24 -60 -30 -30 -36 -4C-12 0 12 0 36 -4C30 -30 24 -60 23 -86C23 -98 20 -108 10 -110';
  const dressFill = upper ? 'M-10 -110C-20 -108 -23 -98 -23 -86C-23 -78 -24 -68 -25 -60L25 -60C24 -68 23 -78 23 -86C23 -98 20 -108 10 -110C5 -113 -5 -113 -10 -110Z' : `${dress}C5 -113 -5 -113 -10 -110Z`;
  const apron = upper ? 'M-15 -80C-15.5 -72 -16 -66 -16.5 -60M16.5 -60C16 -66 15.5 -72 15 -80C5 -77 -5 -77 -15 -80' : 'M-15 -80C-16 -56 -20 -30 -22 -10C-8 -7 8 -7 22 -10C20 -30 16 -56 15 -80C5 -77 -5 -77 -15 -80Z';
  const apronFill = upper ? 'M-15 -80C-15.5 -72 -16 -66 -16.5 -60L16.5 -60C16 -66 15.5 -72 15 -80C5 -77 -5 -77 -15 -80Z' : apron;
  const shoes = 'M-20 -3C-28 -3 -28 3 -22 3L-8 3L-8 -3ZM20 -3C28 -3 28 3 22 3L8 3L8 -3Z';
  return merge(
    {
      lines: [...(upper ? [] : [shoes]), dress, apron],
      fine: ['M-23 -80C-8 -77 8 -77 23 -80', 'M-6 -109L0 -102L6 -109', ...(upper ? [] : ['M-8 -40l5 -1l1 6l-5 1Z'])],
      washes: [
        ...(upper ? [] : [{ c: PAL.terracotta, o: 0.7, d: shoes }]),
        { c: PAL.sky, o: 0.75, d: dressFill },
        { c: PAL.slate, o: 0.3, d: dressFill },
        ...(upper ? [] : [{ c: PAL.rose, o: 0.7, d: 'M-8 -40l5 -1l1 6l-5 1Z' }]),
      ],
      whites: [apronFill],
    },
    ...arms.map((a) => arm(a, PAL.sky, 0.75, 4.4, [{ c: PAL.slate, o: 0.3 }])),
    place(motherHead({ mood }), `translate(${M_HEAD[0]} ${M_HEAD[1]}) rotate(${tilt})`),
  );
}

// =============================================================================================
// THE LITTLE OLD MAN (feet at 0,0), about 90 tall to the hat brim and 150 to the tip of his tall,
// crooked red hat: a long white beard, a big rosy nose, a brown robe. Head at O_HEAD; arms from
// the shoulders (±13,-48).
// =============================================================================================
export const O_HEAD = [0, -64];
export const O_ARMS = {
  down: [
    [[-13, -48, 7], [-18, -36, 6.5], [-20, -26, 6]],
    [[13, -48, 7], [18, -36, 6.5], [20, -26, 6]],
  ],
};
export function oldMan({ arms = O_ARMS.down } = {}) {
  const face = 'M-10 -4C-10.5 5 -6 10 0 10C6 10 10.5 5 10 -4';
  const faceFill = `${face}C8 -8 -8 -8 -10 -4Z`;
  const beard = 'M-10 1C-13 12 -10 28 -2 42C-1 38 1 38 2 42C10 28 13 12 10 1C6 8 3 8 0 7C-3 8 -6 8 -10 1Z';
  const brim = 'M-19 -6C-12 -11 12 -11 19 -6C21 -3 17 -2 12 -4C4 -6 -4 -6 -12 -4C-17 -2 -21 -3 -19 -6Z';
  const crown = 'M-10 -8C-11 -24 -8 -38 -2 -50C2 -58 10 -63 18 -61C23 -60 23 -55 18 -55C12 -55 8 -50 7 -44C6 -32 7 -20 10 -8';
  const band = 'M-10.2 -9C-10.5 -12 -10.6 -14 -10.4 -16C-4 -17.5 4 -17.5 8.4 -16C8.5 -14 9 -12 10 -9C4 -10.5 -4 -10.5 -10.2 -9Z';
  const nose = oval(0, 1.5, 4, 3.6);
  const robe = 'M-8 -54C-16 -52 -19 -44 -20 -34C-21 -22 -23 -10 -25 -2C-10 1 10 1 25 -2C23 -10 21 -22 20 -34C19 -44 16 -52 8 -54';
  const shoes = 'M-12 -1C-22 -2 -24 3 -18 4L-4 4L-4 -1ZM12 -1C22 -2 24 3 18 4L4 4L4 -1Z';
  const brows = 'M-8.5 -3.6C-7 -6 -3 -6 -1.6 -3.8C-4 -4.4 -6 -4.2 -8.5 -3.6ZM8.5 -3.6C7 -6 3 -6 1.6 -3.8C4 -4.4 6 -4.2 8.5 -3.6Z';
  const hat = place(
    {
      lines: [brim, crown],
      washes: [
        { c: PAL.red, o: 0.85, d: `${brim}${crown}C6 -6 -6 -6 -10 -8Z` },
        { c: PAL.ochre, o: 0.95, d: band },
      ],
    },
    'translate(0 -5)',
  );
  const head = merge(hat, {
    lines: [face, beard, nose],
    fine: ['M-5 14q2 6 0 12M5 14q-2 6 0 12M0 18l0 12', brows],
    washes: [
      { c: PAL.rose, o: 0.32, d: faceFill },
      { c: PAL.rose, o: 0.9, d: nose },
      { c: PAL.rose, o: 0.6, d: dot(-7.5, 3.5, 2) + dot(7.5, 3.5, 2) },
    ],
    whites: [beard, brows],
    fills: [dot(-4.6, -1, 1.5), dot(4.6, -1, 1.5)],
    glints: [dot(-5, -1.5, 0.5), dot(4.2, -1.5, 0.5)],
  });
  return merge(
    {
      lines: [shoes, robe],
      fine: ['M-4 -30q-3 14 -4 28M6 -24q2 10 2 20'],
      washes: [
        { c: PAL.terracotta, o: 0.55, d: `${robe}C5 -57 -5 -57 -8 -54Z` },
        { c: PAL.grey, o: 0.55, d: `${robe}C5 -57 -5 -57 -8 -54Z` },
        { c: PAL.slate, o: 0.8, d: shoes },
      ],
    },
    ...arms.map((a) => arm(a, PAL.terracotta, 0.55, 4, [{ c: PAL.grey, o: 0.55 }])),
    place(head, `translate(${O_HEAD[0]} ${O_HEAD[1]})`),
  );
}

/** The five magic beans' colours: red, slate (purple-ish), speckled gold, green, rose. */
const BEAN_COLOURS = [PAL.red, PAL.slate, PAL.ochre, PAL.green, PAL.rose];
/** One shiny magic bean (i = 0 to 4), centred at (0,0), lying along x. */
export function bean(i = 0) {
  const d = oval(0, 0, 4.6, 3.1);
  return {
    fine: [d],
    once: i === 2 ? ['M-1.5 -0.5l0.3 0M1.5 1l0.3 0M2 -1l0.3 0'] : [],
    washes: [{ c: BEAN_COLOURS[i], o: 0.95, d }],
    glints: [dot(-1.4, -1, 0.9)],
  };
}
/** Five shiny magic beans in a little heap round (0,0), about 26 wide, with sparkles. */
export function beans({ sparkle = true } = {}) {
  const spots = [
    [-8, 0, -20],
    [0, 1, 10],
    [8, 0, 30],
    [-4, -5, 60],
    [5, -5, -30],
  ];
  return merge(
    ...spots.map(([x, y, a], i) => place(bean(i), `translate(${x} ${y}) rotate(${a})`)),
    sparkle ? { fine: ['M-13 -9l-3 -3M0 -11l0 -4M13 -9l3 -3M-15 0l-4 0M15 0l4 0'] } : {},
  );
}

// =============================================================================================
// MILKY-WHITE (feet at 0,0), seen from the side facing left with her face turned to us: a white
// cow with grey patches, a pink muzzle, little horns, a long tufted tail. About 160 long, 100 tall.
// =============================================================================================
export const COW_NECK = [-62, -64];
export function cow({ mood = 'happy' } = {}) {
  const body = 'M-56 -78C-64 -70 -64 -48 -56 -40C-40 -34 30 -34 50 -38C62 -42 64 -60 60 -72C56 -84 40 -86 20 -84C-4 -82 -36 -84 -56 -78Z';
  const legsD = [-48, -34, 34, 48].map((x) => `M${x - 5} -38L${x - 5} -6L${x + 5} -6L${x + 5} -38`).join('');
  const hooves = [-48, -34, 34, 48].map((x) => `M${x - 5.5} -6L${x + 5.5} -6L${x + 6} 1L${x - 6} 1Z`).join('');
  const head = 'M-92 -78C-96 -66 -98 -52 -96 -42C-92 -36 -72 -36 -68 -42C-66 -52 -68 -66 -72 -78C-76 -84 -88 -84 -92 -78Z';
  const muzzle = oval(-82, -43, 13, 8.5);
  const ears = 'M-92 -76C-102 -80 -108 -76 -106 -72C-102 -70 -96 -71 -92 -72ZM-72 -76C-62 -80 -56 -76 -58 -72C-62 -70 -68 -71 -72 -72Z';
  const horns = 'M-88 -82C-92 -88 -92 -94 -88 -97C-87 -92 -85 -88 -83 -83M-76 -82C-72 -88 -72 -94 -76 -97C-77 -92 -79 -88 -81 -83';
  const patches = 'M-30 -82C-26 -70 -12 -64 -2 -70C4 -76 0 -82 -6 -83ZM20 -62C24 -50 40 -48 46 -58C46 -66 30 -70 20 -62ZM-58 -58C-50 -54 -44 -46 -48 -38C-54 -38 -58 -42 -60 -48Z';
  const udder = 'M14 -37C14 -28 28 -28 30 -37Z';
  const tail = 'M58 -70C68 -64 70 -48 68 -30';
  const tuft = 'M64 -32C62 -24 70 -22 72 -28C72 -32 68 -34 66 -32Z';
  const eyes = mood === 'sad' ? 'M-90 -62q3 2 6 0M-80 -62q3 2 6 0' : '';
  return {
    lines: [body, legsD, hooves, tail, ears, head, muzzle, horns],
    fine: [patches, udder, tuft, 'M-88 -42l0 0.5M-76 -42l0 0.5', eyes].filter(Boolean),
    washes: [
      { c: PAL.grey, o: 0.55, d: patches },
      { c: PAL.slate, o: 0.3, d: patches },
      { c: PAL.rose, o: 0.85, d: muzzle + udder },
      { c: PAL.rose, o: 0.5, d: 'M-100 -74C-98 -76 -95 -75 -93 -74C-96 -73 -98 -73 -100 -74ZM-64 -74C-66 -76 -69 -75 -71 -74C-68 -73 -66 -73 -64 -74Z' },
      { c: PAL.ochre, o: 0.7, d: 'M-88 -82C-92 -88 -92 -94 -88 -97C-87 -92 -85 -88 -83 -83ZM-76 -82C-72 -88 -72 -94 -76 -97C-77 -92 -79 -88 -81 -83Z' },
      { c: PAL.slate, o: 0.6, d: hooves + tuft },
      { c: PAL.grey, o: 0.25, d: `${body}${head}` },
    ],
    fills: mood === 'sad' ? [] : [dot(-85, -66, 2), dot(-75, -66, 2)],
    glints: mood === 'sad' ? [] : [dot(-85.6, -66.6, 0.6), dot(-75.6, -66.6, 0.6)],
  };
}

// =============================================================================================
// THE GIANT (feet at 0,0), about 250 tall: a huge round bald head with ginger tufts over the ears
// and three hairs on top, big bushy ginger eyebrows, a round red nose, a droopy ginger moustache,
// a grey shirt straining over his big belly under a too-small red waistcoat, a belt with a golden
// buckle, patched slate trousers and big brown boots. More grumpy and silly than frightening.
// Head at G_HEAD (radius about 30), arms from the shoulders (±48,-160). seated: sitting (the
// upper body 40 lower, big knees, short shins); upper: no legs (behind a table). mood: 'grumpy', 'sniff' (eyes shut, nose up),
// 'sleep' (eyes shut, mouth open, snoring), 'roar' (shouting), 'fright' (eyes wide, mouth "o").
// =============================================================================================
export const G_HEAD = [0, -200];
export const G_SEAT = 40;
export const G_ARMS = {
  down: [
    [[-48, -160, 22], [-60, -130, 20], [-64, -100, 19]],
    [[48, -160, 22], [60, -130, 20], [64, -100, 19]],
  ],
};
const GINGER = [
  { c: PAL.terracotta, o: 0.85 },
  { c: PAL.ochre, o: 0.6 },
];
const ginger = (d) => GINGER.map((w) => ({ ...w, d }));
export function giantHead({ mood = 'grumpy' } = {}) {
  const face = 'M-28 -6C-30 -26 -18 -36 0 -36C18 -36 30 -26 28 -6C30 12 18 30 0 30C-18 30 -30 12 -28 -6Z';
  const ears = 'M-28 -8C-38 -12 -40 6 -28 6M28 -8C38 -12 40 6 28 6';
  const tufts = 'M-25 -20C-34 -26 -41 -16 -37 -10C-41 -6 -38 2 -30 0C-29 -8 -28 -14 -25 -20ZM25 -20C34 -26 41 -16 37 -10C41 -6 38 2 30 0C29 -8 28 -14 25 -20Z';
  const hairs = 'M-6 -36C-8 -44 -3 -49 1 -46M2 -36C2 -43 7 -46 10 -43M-1 -36C-2 -42 -1 -47 2 -50';
  const browL = mood === 'roar' || mood === 'grumpy' ? 'M-24 -19C-18 -23 -10 -21 -3 -12C-9 -12 -18 -13 -24 -14Z' : 'M-24 -16C-18 -24 -9 -24 -4 -18C-10 -17 -18 -16 -24 -16Z';
  const brows = browL + place({ lines: [browL] }, 'scale(-1 1)').lines[0];
  const nose = oval(0, 4, 9, 8);
  const tache = 'M0 12C-6 8 -16 8 -22 13C-27 17 -30 24 -26 25C-22 19 -13 18 -6 20C-3 20 -1 18 0 16C1 18 3 20 6 20C13 18 22 19 26 25C30 24 27 17 22 13C16 8 6 8 0 12Z';
  const out = {
    lines: [face, ears, nose],
    fine: [hairs, tufts, brows, tache],
    washes: [
      { c: PAL.rose, o: 0.35, d: Z(face) },
      { c: PAL.rose, o: 0.45, d: 'M-28 -8C-38 -12 -40 6 -28 6ZM28 -8C38 -12 40 6 28 6Z' },
      ...ginger(tufts + brows + tache),
      { c: PAL.rose, o: 0.95, d: nose },
      { c: PAL.red, o: 0.35, d: nose },
      { c: PAL.rose, o: 0.65, d: dot(-18, 10, 5) + dot(18, 10, 5) },
    ],
    whites: [],
    fills: [],
    glints: [dot(-3, 1, 1.6)],
    once: ['M-12 26l0.4 0M-6 28l0.4 0M6 28l0.4 0M12 26l0.4 0M0 29l0.4 0'],
  };
  if (mood === 'sleep' || mood === 'sniff') {
    out.fine.push('M-16 -6q5 4 10 0M6 -6q5 4 10 0');
    if (mood === 'sleep') {
      const m = oval(0, 26, 6, 4.5);
      out.fine.push(m);
      out.fills.push(m);
    } else out.fine.push('M-5 26q5 -3 10 0');
  } else if (mood === 'fright') {
    out.whites.push(dot(-11, -6, 6), dot(11, -6, 6));
    out.fine.push(dot(-11, -6, 6), dot(11, -6, 6));
    out.fills.push(dot(-11, -5, 2.6), dot(11, -5, 2.6));
    const m = oval(0, 27, 5, 5);
    out.fine.push(m);
    out.washes.push({ c: PAL.red, o: 0.85, d: m });
  } else if (mood === 'roar') {
    out.fills.push(dot(-11, -7, 3), dot(11, -7, 3));
    out.glints.push(dot(-12, -8, 1), dot(10, -8, 1));
    const m = 'M-13 21C-14 34 14 34 13 21C6 23 -6 23 -13 21Z';
    out.fine.push(m, 'M-4 22L-3 26L0 26L1 22.5');
    out.washes.push({ c: PAL.red, o: 0.85, d: m });
    out.whites.push('M-4 22L-3 26L0 26L1 22.5Z');
  } else {
    out.fills.push(dot(-11, -6, 3), dot(11, -6, 3));
    out.glints.push(dot(-12, -7, 1), dot(10, -7, 1));
    out.fine.push('M-7 27q7 -4 14 0');
  }
  return out;
}
export function giant({ mood = 'grumpy', tilt = 0, arms = G_ARMS.down, seated = false, legs = null, upper = false } = {}) {
  const shirt = 'M-24 -172C-44 -170 -54 -156 -56 -136C-62 -112 -60 -92 -50 -78C-30 -70 30 -70 50 -78C60 -92 62 -112 56 -136C54 -156 44 -170 24 -172';
  const shirtFill = `${shirt}C12 -176 -12 -176 -24 -172Z`;
  const vestL = 'M-24 -172C-42 -168 -50 -152 -52 -132C-54 -112 -52 -94 -46 -82L-22 -78C-20 -100 -18 -130 -8 -170C-12 -172 -18 -173 -24 -172Z';
  const vestR = place({ lines: [vestL] }, 'scale(-1 1)').lines[0];
  const buttons = dot(-20, -146, 2.6) + dot(-22, -122, 2.6) + dot(-23, -98, 2.6) + dot(20, -146, 2.6) + dot(22, -122, 2.6) + dot(23, -98, 2.6);
  const belt = 'M-50 -82C-30 -74 30 -74 50 -82L50 -70C30 -62 -30 -62 -50 -70Z';
  const buckle = 'M-9 -79L9 -79L9 -63L-9 -63Z';
  const upperParts = merge(
    {
      lines: [shirt, vestL, vestR, belt, buckle],
      fine: ['M-12 -120q0 -6 4 -8M8 -105q4 2 3 7M-6 -92q6 4 12 0', 'M-4 -64q0 0 0 0', buttons],
      washes: [
        { c: PAL.grey, o: 0.5, d: shirtFill },
        { c: PAL.red, o: 0.8, d: vestL + vestR },
        { c: PAL.terracotta, o: 0.3, d: vestL + vestR },
        { c: PAL.terracotta, o: 0.75, d: belt },
        { c: PAL.grey, o: 0.5, d: belt },
        { c: PAL.ochre, o: 0.95, d: buckle },
        { c: PAL.ochre, o: 0.95, d: buttons },
      ],
    },
    ...arms.map((a) => arm(a, PAL.grey, 0.5, 13)),
    place(giantHead({ mood }), `translate(${G_HEAD[0]} ${G_HEAD[1]}) rotate(${tilt})`),
  );
  const TR = [{ c: PAL.slate, o: 0.55 }, { c: PAL.grey, o: 0.4 }];
  const BOOT = [{ c: PAL.terracotta, o: 0.75 }, { c: PAL.grey, o: 0.5 }];
  let lower;
  if (legs) {
    // free legs: two limb centrelines from the hips (±24,-70), each ending in a big boot
    lower = merge(
      ...legs.map((pts, i) => {
        const d = limb(pts);
        const [x, y] = pts[pts.length - 1];
        const s = oval(x + (i ? 8 : -8), y + 8, 24, 13);
        return { lines: [d, s], washes: [...TR.map((w) => ({ ...w, d: Z(d) })), ...BOOT.map((w) => ({ ...w, d: s }))] };
      }),
    );
  } else if (seated) {
    // seen from the front, sitting: his round knees just under the belt, his boots just under them
    const knees = oval(-30, -24, 27, 13) + oval(30, -24, 27, 13);
    const boots = 'M-48 -12C-50 -6 -54 -2 -60 0C-64 4 -60 8 -50 8L-8 8L-10 -12ZM48 -12C50 -6 54 -2 60 0C64 4 60 8 50 8L8 8L10 -12Z';
    const patch = 'M-40 -30L-28 -31L-27 -21L-39 -20Z';
    lower = {
      lines: [boots, knees],
      fine: [patch],
      washes: [...TR.map((w) => ({ ...w, d: knees })), { c: PAL.ochre, o: 0.85, d: patch }, ...BOOT.map((w) => ({ ...w, d: boots }))],
    };
  } else {
    const trousers = 'M-50 -70C-52 -50 -50 -30 -48 -14L-8 -14L-4 -52L4 -52L8 -14L48 -14C50 -30 52 -50 50 -70';
    const boots = 'M-48 -14C-50 -6 -54 -2 -60 0C-64 4 -60 8 -50 8L-6 8L-8 -14ZM48 -14C50 -6 54 -2 60 0C64 4 60 8 50 8L6 8L8 -14Z';
    const patch = 'M-40 -46L-24 -47L-23 -32L-39 -31Z';
    lower = {
      lines: [trousers, boots],
      fine: [patch],
      once: ['M-40 -42l-3 0M-24 -42l3 0M-40 -36l-3 0M-24 -36l3 0'],
      washes: [...TR.map((w) => ({ ...w, d: Z(trousers) })), { c: PAL.ochre, o: 0.85, d: patch }, ...BOOT.map((w) => ({ ...w, d: boots }))],
    };
  }
  return merge(upper ? {} : lower, seated ? place(upperParts, `translate(0 ${G_SEAT})`) : upperParts);
}

// =============================================================================================
// THE GIANT'S WIFE (feet at 0,0), about 240 tall: a round kind face, dark hair in a big bun with a
// rose ribbon, red earrings, a long green dress with a white apron. Head at GW_HEAD; arms from
// the shoulders (±40,-160).
// =============================================================================================
export const GW_HEAD = [0, -196];
export const GW_ARMS = {
  down: [
    [[-40, -160, 18], [-52, -130, 17], [-56, -100, 16]],
    [[40, -160, 18], [52, -130, 17], [56, -100, 16]],
  ],
};
export function wifeHead({ mood = 'happy' } = {}) {
  const face = 'M-25 -6C-26 -24 -15 -32 0 -32C15 -32 26 -24 25 -6C26 12 15 26 0 26C-15 26 -26 12 -25 -6Z';
  const hair = 'M-26 -2C-32 -24 -18 -38 0 -38C18 -38 32 -24 26 -2C24 -14 18 -22 0 -22C-18 -22 -24 -14 -26 -2Z';
  const bun = oval(0, -44, 17, 12);
  const ribbon = 'M-6 -38L-16 -44L-15 -34ZM6 -38L16 -44L15 -34Z';
  const m = faceMarks({ mood, ex: 9.5, ey: -4, my: 12, r: 3, w: 8 });
  return {
    lines: [face, hair, bun],
    fine: [ribbon, 'M-24 0c-5 0 -6 8 -1 9M24 0c5 0 6 8 1 9', 'M1 0c3 3 3 6 -1 7', 'M-14 -12q4 -3 8 0M6 -12q4 -3 8 0', 'M-8 -44q8 4 16 0', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.32, d: face },
      { c: PAL.slate, o: 0.8, d: hair + bun },
      { c: PAL.ink, o: 0.2, d: hair + bun },
      { c: PAL.rose, o: 0.95, d: ribbon },
      { c: PAL.red, o: 0.9, d: dot(-26, 12, 2.6) + dot(26, 12, 2.6) },
      { c: PAL.rose, o: 0.65, d: dot(-15, 7, 5) + dot(15, 7, 5) },
      ...m.washes,
    ],
    fills: m.fills.map((d) => d),
    glints: m.glints,
  };
}
export function giantWife({ mood = 'happy', tilt = 0, arms = GW_ARMS.down } = {}) {
  const dress = 'M-18 -170C-38 -168 -46 -154 -46 -136C-46 -110 -60 -50 -72 -4C-30 2 30 2 72 -4C60 -50 46 -110 46 -136C46 -154 38 -168 18 -170';
  const apron = 'M-30 -120C-32 -84 -40 -40 -44 -14C-14 -8 14 -8 44 -14C40 -40 32 -84 30 -120C10 -114 -10 -114 -30 -120Z';
  const shoes = 'M-34 -3C-48 -3 -48 6 -38 6L-12 6L-12 -3ZM34 -3C48 -3 48 6 38 6L12 6L12 -3Z';
  return merge(
    {
      lines: [shoes, dress, apron],
      fine: ['M-46 -120C-16 -112 16 -112 46 -120', 'M-12 -169L0 -156L12 -169', 'M-12 -70l10 -2l2 10l-10 2Z'],
      washes: [
        { c: PAL.terracotta, o: 0.7, d: shoes },
        { c: PAL.green, o: 0.75, d: `${dress}C6 -174 -6 -174 -18 -170Z` },
        { c: PAL.slate, o: 0.15, d: `${dress}C6 -174 -6 -174 -18 -170Z` },
        { c: PAL.rose, o: 0.7, d: 'M-12 -70l10 -2l2 10l-10 2Z' },
      ],
      whites: [apron],
    },
    ...arms.map((a) => arm(a, PAL.green, 0.75, 11)),
    place(wifeHead({ mood }), `translate(${GW_HEAD[0]} ${GW_HEAD[1]}) rotate(${tilt})`),
  );
}

// =============================================================================================
// Little things: the brown hen (facing right, feet at 0,0, about 40 tall), a golden egg (bottom at
// 0,0), the golden harp (base at 0,0, about 50 tall), a basket of golden eggs, an axe.
// =============================================================================================
export function hen({ mood = 'happy' } = {}) {
  const body = 'M-16 -14C-18 -24 -8 -28 4 -26C10 -32 12 -40 18 -40C24 -40 26 -34 24 -28C22 -22 22 -16 18 -10C12 -4 0 -4 -8 -6C-14 -8 -16 -10 -16 -14Z';
  const tail = 'M-14 -16C-22 -22 -24 -32 -20 -38C-16 -30 -12 -27 -8 -25';
  const comb = 'M16 -40C15 -44 18 -46 19 -43C20 -47 23 -47 23 -43C25 -45 28 -43 25 -39Z';
  const beak = 'M24.5 -35L31 -32.5L24 -30Z';
  const wing = 'M-6 -18C0 -24 10 -22 12 -16C6 -11 -2 -12 -6 -18Z';
  const feet = 'M0 -6L0 0M-3 1L0 0L3 1M7 -6L7 0M4 1L7 0L10 1';
  return {
    lines: [body, tail],
    fine: [comb, beak, wing, 'M-2 -16q4 1 8 0M-18 -26l3 2M-19 -32l4 3', feet, mood === 'shut' ? 'M17.5 -34q1.6 -1.6 3.2 0' : ''].filter(Boolean),
    washes: [
      { c: PAL.terracotta, o: 0.75, d: `${body}${tail}Z` },
      { c: PAL.ochre, o: 0.45, d: `${body}${tail}Z` },
      { c: PAL.terracotta, o: 0.5, d: wing },
      { c: PAL.red, o: 0.9, d: comb + dot(24, -27.5, 2.2) },
      { c: PAL.ochre, o: 0.95, d: beak },
    ],
    fills: mood === 'shut' ? [] : [dot(19.5, -34, 1.5)],
    glints: mood === 'shut' ? [] : [dot(19, -34.6, 0.5)],
  };
}
export function goldenEgg(s = 1) {
  const egg = oval(0, -7 * s, 5.4 * s, 7 * s);
  return {
    lines: [egg],
    washes: [
      { c: PAL.ochre, o: 0.95, d: egg },
      { c: PAL.terracotta, o: 0.35, d: `M${f(2 * s)} ${f(-13 * s)}C${f(6 * s)} ${f(-10 * s)} ${f(6 * s)} ${f(-3 * s)} ${f(1 * s)} ${f(-0.5 * s)}C${f(4 * s)} ${f(-4 * s)} ${f(4 * s)} ${f(-9 * s)} ${f(2 * s)} ${f(-13 * s)}Z` },
    ],
    glints: [oval(-2 * s, -10 * s, 1.2 * s, 2 * s)],
  };
}
/** Little shine marks round a golden thing at (0,0). */
export function shine(r = 12) {
  return { fine: [`M${-r} ${-r * 0.6}l${-r * 0.4} ${-r * 0.3}M0 ${-r}l0 ${-r * 0.5}M${r} ${-r * 0.6}l${r * 0.4} ${-r * 0.3}M${-r * 1.1} ${r * 0.2}l${-r * 0.45} 0M${r * 1.1} ${r * 0.2}l${r * 0.45} 0`] };
}
export function harp() {
  const column = limb([[-14, 2, 5.5], [-17, -24, 5], [-13, -48, 5]]);
  const neck = limb([[-14, -48, 5.5], [-2, -42, 5], [8, -46, 5], [18, -36, 5]]);
  const box = limb([[-12, 2, 8], [3, -15, 8], [17, -33, 6]]);
  const strings = 'M-9 -42L-9 -4M-4 -40L-4 -9M1 -41L1 -14M6 -42L6 -19M11 -40L11 -25';
  const gold = `${Z(column)}${Z(neck)}${Z(box)}`;
  return {
    lines: [column, neck, box],
    fine: [strings, 'M-12 -48c-4 -6 2 -9 4 -5'],
    washes: [
      { c: PAL.ochre, o: 0.95, d: gold },
      { c: PAL.terracotta, o: 0.25, d: Z(box) },
    ],
    glints: ['M-16 -10L-15 -10L-15.5 -36L-16.6 -36Z'],
  };
}
export function eggBasket() {
  const basket = 'M-28 -20L28 -20C26 -6 18 0 0 0C-18 0 -26 -6 -28 -20Z';
  const handle = 'M-24 -20C-22 -50 22 -50 24 -20';
  const eggs = [
    [-16, -18, -20],
    [-5, -21, 0],
    [7, -20, 15],
    [17, -17, 25],
    [1, -28, -5],
  ];
  const parts = eggs.map(([x, y, a]) => place(goldenEgg(1.05), `translate(${x} ${y + 8}) rotate(${a})`));
  return merge(...parts, {
    lines: [basket, handle],
    fine: ['M-26 -13C-10 -10 10 -10 26 -13M-22 -6C-8 -4 8 -4 22 -6M-14 -20l-2 18M0 -20l0 20M14 -20l2 18'],
    washes: [
      { c: PAL.terracotta, o: 0.6, d: basket },
      { c: PAL.ochre, o: 0.5, d: basket },
      { c: PAL.terracotta, o: 0.5, d: Z(`${handle}C20 -44 -20 -44 -24 -20`) },
    ],
  });
}
export function axe() {
  const handle = limb([[0, 4, 5.5], [1, -30, 5], [0, -62, 5]]);
  const head = 'M-2 -66L-17 -74C-22 -62 -22 -50 -17 -40L-2 -50Z';
  return {
    lines: [handle, head],
    washes: [
      { c: PAL.terracotta, o: 0.7, d: Z(handle) },
      { c: PAL.ochre, o: 0.4, d: Z(handle) },
      { c: PAL.grey, o: 0.85, d: head },
      { c: PAL.slate, o: 0.45, d: head },
    ],
    glints: ['M-16 -68C-19 -60 -19 -54 -16 -46L-15 -46C-17 -54 -17 -60 -15 -68Z'],
  };
}

// =============================================================================================
// THE BEANSTALK: a thick green stalk along a centreline of [x, y, width] points (open at the first
// point, the root), with big heart-shaped leaves at { at: [x, y], a: angle, s: size } (the stalk of
// the leaf at that point, pointing along the angle) and curly tendrils at [x, y, a, s].
// =============================================================================================
const LEAF = 'M0 0C6 -10 18 -16 32 -12C40 -10 46 -4 50 0C46 4 40 10 32 12C18 16 6 10 0 0Z';
const LEAF_VEINS = 'M0 0C14 -1 30 -1 46 0M16 -1l8 -7M28 -1l8 -6M16 1l8 7M28 1l8 6';
export function leaf(s = 1, a = 0) {
  const t = `rotate(${a}) scale(${s})`;
  return place({ lines: [LEAF], fine: [LEAF_VEINS], washes: [{ c: PAL.green, o: 0.85, d: LEAF }, { c: PAL.ochre, o: 0.18, d: LEAF }] }, t);
}
export function tendril(s = 1, a = 0) {
  return place({ fine: ['M0 0C6 -2 12 -8 12 -14C12 -20 4 -20 4 -14C4 -10 8 -10 8 -13'] }, `rotate(${a}) scale(${s})`);
}
/** The two sides of a limb along pts, without the cap (for a stalk that runs on into a cloud). */
function sides(pts) {
  const n = pts.length;
  const side = (s) =>
    pts.map(([x, y, w], i) => {
      const a = pts[Math.max(0, i - 1)];
      const b = pts[Math.min(n - 1, i + 1)];
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      return [x - (s * (b[1] - a[1]) * w) / 2 / l, y + (s * (b[0] - a[0]) * w) / 2 / l];
    });
  const curve = (P) =>
    `M${f(P[0][0])} ${f(P[0][1])}` +
    P.slice(1)
      .map((p2, j) => {
        const p0 = P[Math.max(0, j - 1)];
        const p1 = P[j];
        const p3 = P[Math.min(P.length - 1, j + 2)];
        return `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
      })
      .join('');
  return [curve(side(1)), curve(side(-1))];
}
/** open: the stalk runs on into a cloud at its last point (no rounded tip drawn in ink). */
export function beanstalk(pts, { leaves = [], tendrils = [], open = false } = {}) {
  const d = limb(pts);
  const stripe = limb(pts.map(([x, y, w]) => [x + w * 0.18, y, w * 0.25]));
  const parts = [
    {
      lines: open ? sides(pts) : [d],
      washes: [
        { c: PAL.green, o: 0.95, d: Z(d) },
        { c: PAL.slate, o: 0.18, d: Z(d) },
        { c: PAL.ochre, o: 0.25, d: Z(stripe) },
      ],
    },
    ...leaves.map((l) => place(leaf(l.s, l.a), `translate(${l.at[0]} ${l.at[1]})`)),
    ...tendrils.map(([x, y, a, s]) => place(tendril(s, a), `translate(${x} ${y})`)),
  ];
  return merge(...parts);
}

// =============================================================================================
// CLOUDS AND PLACES
// =============================================================================================
/** A puffy white cloud round (cx, cy): paper-white, with a pale sky shadow along the bottom. */
export function cloud(cx, cy, rx, ry, n = 9, seed = 0) {
  const d = bumpy(cx, cy, rx, ry, n, 1.4, -90 + seed * 13);
  return {
    lines: [d],
    washes: [{ c: PAL.sky, o: 0.25, d: `M${cx - rx} ${cy + ry * 0.2}C${cx - rx * 0.5} ${cy + ry * 1.05} ${cx + rx * 0.5} ${cy + ry * 1.05} ${cx + rx} ${cy + ry * 0.2}C${cx + rx * 0.4} ${cy + ry * 0.6} ${cx - rx * 0.4} ${cy + ry * 0.6} ${cx - rx} ${cy + ry * 0.2}Z` }],
    whites: [d],
  };
}

/** The cottage (bottom centre 0,0), 160 wide: whitewashed walls, a shaggy ochre thatch, a red door
 * on the left and a window with open shutters on the right (its opening at COT_WIN: x, y, w, h).
 * dark: the window's opening is shadowy (someone stands inside); win: a bigger window [x, y, w, h]. */
export const COT_WIN = [14, -76, 44, 40];
export function cottage({ dark = true, smoke = true, win = COT_WIN } = {}) {
  const walls = 'M-80 0L-80 -92M80 -92L80 0';
  const wallsFill = 'M-80 0L-80 -92L80 -92L80 0Z';
  const roof = 'M-98 -84C-84 -110 -50 -146 -6 -152C30 -150 70 -122 98 -84C70 -94 -70 -94 -98 -84Z';
  const door = 'M-58 0L-58 -52C-58 -66 -32 -66 -32 -52L-32 0';
  const [x, y, w, h] = win;
  const pane = `M${x} ${y}L${x + w} ${y}L${x + w} ${y + h}L${x} ${y + h}Z`;
  const shutters = `M${x} ${y}L${x - 16} ${y + 3}L${x - 16} ${y + h - 3}L${x} ${y + h}M${x + w} ${y}L${x + w + 16} ${y + 3}L${x + w + 16} ${y + h - 3}L${x + w} ${y + h}`;
  const shutFill = `M${x} ${y}L${x - 16} ${y + 3}L${x - 16} ${y + h - 3}L${x} ${y + h}ZM${x + w} ${y}L${x + w + 16} ${y + 3}L${x + w + 16} ${y + h - 3}L${x + w} ${y + h}Z`;
  const sill = `M${x - 6} ${y + h}L${x + w + 6} ${y + h}L${x + w + 5} ${y + h + 6}L${x - 5} ${y + h + 6}Z`;
  const chimney = 'M44 -132L44 -162L62 -162L62 -116';
  return {
    lines: [walls, 'M-84 0L84 0', door, chimney, roof, pane, shutters, sill],
    fine: [
      'M-80 -40l10 0M-70 -20l10 0M60 -14l12 0M-74 -70l10 0',
      'M-70 -98q4 -10 10 -18M-40 -104q2 -14 8 -28M-6 -108q0 -16 2 -34M30 -104q-2 -14 -8 -28M62 -98q-4 -10 -10 -18',
      `M${x - 8} ${y + 9}l-4 0M${x - 8} ${y + h - 9}l-4 0M${x + w + 8} ${y + 9}l4 0M${x + w + 8} ${y + h - 9}l4 0`,
      dot(-37, -28, 2),
      ...(smoke ? ['M54 -168C46 -176 60 -182 52 -192C46 -200 58 -206 54 -214'] : []),
    ],
    washes: [
      { c: PAL.ochre, o: 0.18, d: wallsFill },
      { c: PAL.ochre, o: 0.85, d: roof },
      { c: PAL.terracotta, o: 0.3, d: roof },
      { c: PAL.red, o: 0.7, d: Z(door) },
      { c: PAL.terracotta, o: 0.4, d: Z(door) },
      { c: PAL.terracotta, o: 0.6, d: `${chimney}Z` },
      { c: PAL.grey, o: 0.4, d: `${chimney}Z` },
      { c: dark ? PAL.slate : PAL.sky, o: dark ? 0.45 : 0.35, d: pane },
      { c: PAL.green, o: 0.7, d: shutFill },
      { c: PAL.ochre, o: 0.6, d: sill },
    ],
  };
}

/** A little castle (bottom centre 0,0), about 120 wide and 110 tall: grey walls, three towers with
 * red pointed roofs and flags, an arched door. */
export function castle() {
  const wall = 'M-44 0L-44 -50L44 -50L44 0';
  const merlons = 'M-44 -50L-44 -58L-34 -58L-34 -52L-22 -52L-22 -58L-10 -58L-10 -52L2 -52L2 -58L14 -58L14 -52L26 -52L26 -58L34 -58L34 -50';
  const towerL = 'M-60 0L-60 -70L-38 -70L-38 0';
  const towerR = 'M38 0L38 -70L60 -70L60 0';
  const towerM = 'M-14 -50L-14 -88L14 -88L14 -50';
  const roofL = 'M-64 -70L-49 -100L-34 -70Z';
  const roofR = 'M34 -70L49 -100L64 -70Z';
  const roofM = 'M-18 -88L0 -122L18 -88Z';
  const flags = 'M-49 -100L-49 -112L-40 -108L-49 -105M49 -100L49 -112L58 -108L49 -105M0 -122L0 -136L11 -131L0 -127';
  const door = 'M-10 0L-10 -18C-10 -30 10 -30 10 -18L10 0';
  const wins = 'M-52 -52l0 -8M46 -52l0 -8M-4 -70l0 -8M4 -70l0 -8';
  return {
    lines: [wall, merlons, towerL, towerR, towerM, roofL, roofR, roofM, door],
    fine: [flags, wins],
    washes: [
      { c: PAL.grey, o: 0.6, d: `M-60 0L-60 -70L-38 -70L-38 -58L-14 -58L-14 -88L14 -88L14 -58L38 -58L38 -70L60 -70L60 0Z` },
      { c: PAL.red, o: 0.8, d: roofL + roofR + roofM },
      { c: PAL.red, o: 0.9, d: 'M-49 -112L-40 -108L-49 -105ZM49 -112L58 -108L49 -105ZM0 -136L11 -131L0 -127Z' },
      { c: PAL.slate, o: 0.75, d: Z(door) },
    ],
  };
}
