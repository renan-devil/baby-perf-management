import { PAL } from '../lib.mjs';
import { at, compose, dot, f, limb, merge, oval, place } from '../stone-soup/characters.mjs';

// The Gingerbread Man: the gingerbread man, the little old woman and the little old man, the Cow, the
// Horse and the Fox, shared by the five pictures. Each is drawn once here and placed in each picture
// with a transform (place). The build only draws files named <n>.mjs, so this file is not a picture.
// Everybody has the feet at y = 0; the animals and the old couple face right (flip with scale(-1 1)).

export { at, compose, dot, merge, oval, place };

const closed = (list) => list.map((d) => `${d}Z`).join('');

// ---------------------------------------------------------------------------------------------
// The Gingerbread Man (feet at 0,0, facing us, about 88 tall): a round head, currant eyes, a cherry
// nose, an icing smile, three sweets for buttons (red, green, blue), a wavy line of icing round each
// wrist and ankle. arms / legs: centrelines of [x, y] points from the shoulder (±11, -48) or the hip
// (±7, -24). mood: 'happy', 'laugh' (eyes shut in a smile, mouth wide open), 'worried' (eyebrows up,
// a wobbly mouth), 'cheeky' (one eye winking, big smile).
export const GB_ARMS = {
  out: [
    [[-22, -50], [-33, -56]],
    [[22, -50], [33, -56]],
  ],
  up: [
    [[-20, -58], [-26, -72]],
    [[20, -58], [26, -72]],
  ],
  down: [
    [[-18, -42], [-22, -32]],
    [[18, -42], [22, -32]],
  ],
};
export const GB_LEGS = {
  stand: [
    [[-9, -14], [-11, -6]],
    [[9, -14], [11, -6]],
  ],
  // running: one leg forward (to our right), one back
  run: [
    [[-12, -14], [-22, -8]],
    [[12, -16], [20, -10]],
  ],
  // jumping: knees up, feet tucked
  hop: [
    [[-14, -16], [-12, -6]],
    [[14, -16], [12, -6]],
  ],
};

/** A wavy band of white icing across the end of a limb (p0 → p1, w wide). */
function icing(p0, p1, w) {
  const [x0, y0] = p0;
  const [x1, y1] = p1;
  const l = Math.hypot(x1 - x0, y1 - y0);
  const [ux, uy] = [(x1 - x0) / l, (y1 - y0) / l];
  const [nx, ny] = [-uy, ux];
  const c = [x1 - ux * 1.5, y1 - uy * 1.5];
  const pts = [];
  for (let i = 0; i <= 6; i++) {
    const s = (i / 6 - 0.5) * w * 1.04;
    const k = i % 2 ? 1.4 : -1.4;
    pts.push([c[0] + nx * s + ux * k, c[1] + ny * s + uy * k]);
  }
  const line = `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}`;
  const band = `M${pts.map(([x, y]) => `${f(x - ux * 1.3)} ${f(y - uy * 1.3)}`).join('L')}L${pts
    .slice()
    .reverse()
    .map(([x, y]) => `${f(x + ux * 1.3)} ${f(y + uy * 1.3)}`)
    .join('L')}Z`;
  return { line, band };
}

export function gingerbread({ arms = GB_ARMS.out, legs = GB_LEGS.stand, mood = 'happy' } = {}) {
  const head = oval(0, -70, 17, 16);
  const torso = 'M-9 -55C-15 -50 -16 -34 -13 -22C-6 -19 6 -19 13 -22C16 -34 15 -50 9 -55';
  const limbs = [
    ...arms.map((pts, i) => [[i ? 10 : -10, -48], ...pts]),
    ...legs.map((pts, i) => [[i ? 7 : -7, -26], ...pts]),
  ];
  const ds = limbs.map((pts) => limb(pts.map(([x, y], j) => [x, y, 12.5 - (j * 1.5) / (pts.length - 1)])));
  const ice = limbs.map((pts) => icing(pts[pts.length - 2], pts[pts.length - 1], 11.5));
  const fill = `${head}${closed(ds)}`;
  const buttons = [
    [dot(0, -45, 3.3), PAL.red],
    [dot(0, -36, 3.3), PAL.green],
    [dot(0, -27, 3.3), PAL.sky],
  ];
  const holes = buttons.map(([d]) => d).join('');
  const out = {
    lines: [head, torso, ...ds],
    fine: [...ice.map((i) => i.line), ...buttons.map(([d]) => d), dot(0, -66, 3.2)],
    washes: [
      { c: PAL.terracotta, o: 0.72, d: fill },
      { c: PAL.ochre, o: 0.55, d: fill },
      // the body is left bare under the sweets, so their colours stay bright
      { c: PAL.terracotta, o: 0.72, d: `${torso}Z${holes}`, rule: 'evenodd' },
      { c: PAL.ochre, o: 0.55, d: `${torso}Z${holes}`, rule: 'evenodd' },
      { c: PAL.terracotta, o: 0.35, d: 'M5 -84C14 -80 18 -70 14 -60C10 -56 4 -55 0 -54C10 -60 12 -74 5 -84ZM10 -50C14 -42 14 -30 12 -22L6 -21C10 -30 10 -42 10 -50Z' },
      ...buttons.map(([d, c]) => ({ c, o: 0.95, d })),
      { c: PAL.red, o: 0.95, d: dot(0, -66, 3.2) },
    ],
    whites: ice.map((i) => i.band),
    fills: [],
    glints: [dot(-1, -67.2, 0.9), ...buttons.map((_, i) => dot(-1, -46 + i * 9, 0.9))],
  };
  // the face: currants for eyes, icing for the mouth
  const eyeL = [-6.5, -73];
  const eyeR = [6.5, -73];
  if (mood === 'laugh') {
    const m = 'M-9 -61C-8 -52 8 -52 9 -61C4 -59 -4 -59 -9 -61Z';
    out.fine.push('M-10 -73q3.5 -4 7 0M3 -73q3.5 -4 7 0', m);
    out.washes.push({ c: PAL.red, o: 0.8, d: m });
    out.whites.push('M-9 -61C-4 -59 4 -59 9 -61C8 -59.5 7 -58.5 6 -58C3 -59 -3 -59 -6 -58C-7 -58.5 -8 -59.5 -9 -61Z');
  } else {
    const wink = mood === 'cheeky';
    const r = mood === 'worried' ? 3 : 2.7;
    out.fills.push(dot(...eyeR, r));
    out.glints.push(dot(eyeR[0] - 0.8, eyeR[1] - 0.9, 0.8));
    if (wink) out.fine.push('M-10 -72q3.5 -3.5 7 0');
    else {
      out.fills.push(dot(...eyeL, r));
      out.glints.push(dot(eyeL[0] - 0.8, eyeL[1] - 0.9, 0.8));
    }
    if (mood === 'worried') {
      const m = 'M-6 -59.5q2 -2.5 4 0t4 0t4 0';
      out.fine.push('M-10 -78l6 -3M10 -78l-6 -3', m);
      out.whites.push('M-6.5 -58q2 -3.5 4.5 -1t4 0t4.5 1L6 -58.5q-2 -2.5 -4 0t-4 0t-4 0Z');
    } else {
      const s = 'M-10.5 -62C-6 -54 6 -54 10.5 -62C6 -58.5 -6 -58.5 -10.5 -62Z';
      out.fine.push(s);
      out.whites.push(s);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// The little old woman (feet at 0,0, facing right, running and leaning forward, about 135 tall):
// grey hair in a bun, a rose-pink dress, a white apron, both arms waving in the air, mouth open
// calling "Stop!".
export function oldWoman() {
  const H = 58; // the hip, in her own frame
  // upper body, around the hip (0,0), upright; turned forwards by `lean`
  const bodice = 'M-11 2C-14 -14 -13 -34 -8 -44C-3 -50 7 -50 10 -44C14 -34 15 -14 12 2';
  const head = oval(3, -63, 14, 14);
  const hair = 'M-11 -58C-14 -72 -5 -79 5 -78C11 -77 15 -74 16 -71C10 -73 4 -72 -1 -70C-5 -66 -8 -61 -11 -58Z';
  const bun = dot(-12, -74, 6.5);
  const nose = 'M16.5 -66C21 -64 21 -59 16.5 -59';
  const mouth = oval(12, -54.5, 2.6, 2.3);
  const armA = limb([[4, -42, 9], [20, -47, 8], [34, -58, 7.5]]);
  const armB = limb([[-2, -42, 9], [-20, -48, 8], [-30, -62, 7.5]]);
  const hands = `${dot(35, -60, 4.6)}${dot(-31, -64, 4.6)}`;
  const shawl = 'M-10 -40C-4 -36 6 -36 11 -42L12 -34C4 -30 -4 -30 -11 -32Z';
  const upper = {
    lines: [bodice, head, hair, bun, armA, armB],
    fine: [nose, mouth, hands, shawl, 'M-12 -78q-2 4 2 6M-2 -74q5 -3 10 -1', 'M8 -70q3 -2 6 0'],
    washes: [
      { c: PAL.rose, o: 0.7, d: `${bodice}Z${armA}Z${armB}Z` },
      { c: PAL.rose, o: 0.3, d: head },
      { c: PAL.grey, o: 0.85, d: `${hair}${bun}` },
      { c: PAL.rose, o: 0.8, d: `${dot(7, -57, 3)}${hands}` },
      { c: PAL.red, o: 0.8, d: mouth },
      { c: PAL.red, o: 0.75, d: shawl },
    ],
    fills: [dot(10, -65, 1.7)],
    glints: [dot(9.5, -65.6, 0.5)],
  };
  // skirt and apron, flaring back as she runs (feet frame)
  const skirt = `M-11 ${-H}C-18 -40 -28 -26 -34 -14C-14 -9 8 -9 24 -14C22 -30 18 -44 12 ${-H}`;
  const apron = 'M8 -52C12 -40 18 -26 22 -14C16 -12 10 -11 4 -11C4 -26 4 -40 2 -52Z';
  const legs = [limb([[-8, -16, 6], [-14, -8, 5.5], [-22, -4, 5]]), limb([[8, -16, 6], [12, -8, 5.5], [20, -6, 5]])];
  const shoes = 'M-22 -8C-30 -8 -32 -1 -27 0L-16 -1L-17 -6ZM18 -10C24 -12 30 -9 30 -5L20 -2L16 -6Z';
  return merge(
    {
      lines: [skirt, ...legs, shoes],
      fine: [apron, 'M-14 -40q-6 12 -12 22M2 -40q0 14 -2 26'],
      washes: [
        { c: PAL.rose, o: 0.7, d: `${skirt}Z` },
        { c: PAL.grey, o: 0.5, d: closed(legs) },
        { c: PAL.slate, o: 0.9, d: shoes },
      ],
      whites: [apron],
    },
    place(upper, `translate(0 ${-H}) rotate(16)`),
  );
}

// ---------------------------------------------------------------------------------------------
// The little old man (feet at 0,0, facing right, running and leaning forward, about 150 tall): an
// ochre flat cap, a big round nose, a white moustache, a slate waistcoat over a white shirt, grey
// trousers, brown boots, waving his walking stick in the air.
export function oldMan() {
  const H = 66;
  const body = 'M-13 2C-17 -16 -16 -40 -11 -52C-6 -60 8 -60 12 -52C18 -40 19 -16 15 2';
  const head = oval(3, -72, 14, 14);
  const cap = 'M-12 -74C-14 -84 -6 -90 4 -90C12 -89 16 -85 16 -80C21 -80 27 -79 27 -77C27 -75 21 -75 16 -75L-12 -73Z';
  const nose = dot(17, -70, 4.6);
  const tash = 'M8 -64C11 -60 18 -60 22 -64C18 -63 12 -63 8 -64Z';
  const back = 'M-12 -70C-13 -64 -10 -60 -6 -58';
  const armA = limb([[4, -48, 10], [24, -56, 9], [34, -74, 8.5]]);
  const armB = limb([[-2, -48, 10], [-18, -42, 9], [-30, -50, 8.5]]);
  const hands = `${dot(35, -76, 5)}${dot(-31, -52, 5)}`;
  const stick = 'M28 -100L46 -58M28 -100C24 -106 28 -112 34 -110';
  const upper = {
    lines: [body, back, cap, armA, armB, stick],
    fine: [nose, tash, hands, 'M-4 -56L2 -50L8 -56', dot(8, -42, 1.3), dot(9, -30, 1.3), dot(9, -18, 1.3), 'M-13 -6L16 -6', 'M2 -72q4 -3 9 -1'],
    washes: [
      { c: PAL.slate, o: 0.75, d: `${body}Z` },
      { c: PAL.grey, o: 0.35, d: `${armA}Z${armB}Z` },
      { c: PAL.rose, o: 0.32, d: head },
      { c: PAL.ochre, o: 0.85, d: cap },
      { c: PAL.rose, o: 0.9, d: `${nose}${hands}` },
      { c: PAL.terracotta, o: 0.8, d: 'M27 -101L45 -59L47 -57L29 -99Z' },
    ],
    whites: [tash, 'M-4 -56L2 -50L8 -56Z', 'M-12 -70C-14 -66 -12 -62 -8 -60C-9 -64 -9 -67 -12 -70Z'],
    fills: [dot(9, -75, 1.8)],
    glints: [dot(8.4, -75.6, 0.55), dot(15.5, -72, 1)],
  };
  // open mouth under the moustache, calling "Come back!"
  upper.fine.push(oval(14, -59, 2.6, 2));
  upper.washes.push({ c: PAL.red, o: 0.8, d: oval(14, -59, 2.6, 2) });
  const legs = [limb([[-5, -62, 13], [-16, -34, 11.5], [-30, -12, 10.5]]), limb([[6, -62, 13], [22, -40, 11.5], [24, -12, 10.5]])];
  const boots = 'M-30 -14C-40 -14 -42 -6 -38 -3L-24 -2L-25 -12ZM20 -12C30 -14 38 -8 37 -3L22 -2L20 -8Z';
  return merge(
    {
      lines: [...legs, boots],
      washes: [
        { c: PAL.grey, o: 0.75, d: closed(legs) },
        { c: PAL.terracotta, o: 0.85, d: boots },
        { c: PAL.ink, o: 0.25, d: boots },
      ],
    },
    place(upper, `translate(0 ${-H}) rotate(14)`),
  );
}

// ---------------------------------------------------------------------------------------------
// The Cow (she): a white cow with big slate spots, a pink muzzle, little horns, galloping to the right
// with her tail flying behind. Hooves on y = 0, about 130 tall and 190 long.
export function cow() {
  const body = 'M-58 -78C-62 -96 -48 -104 -20 -102C10 -100 34 -104 50 -96C62 -90 64 -70 58 -58C50 -46 30 -46 0 -46C-26 -46 -48 -46 -56 -56C-60 -62 -60 -70 -58 -78Z';
  const head = 'M54 -104C56 -114 68 -118 78 -114C86 -110 90 -100 92 -90C94 -82 92 -74 84 -72C74 -70 64 -76 58 -84C54 -90 53 -98 54 -104Z';
  const muzzle = 'M80 -92C90 -95 97 -88 96 -80C95 -73 87 -70 80 -72C76 -77 76 -88 80 -92Z';
  const horns = [limb([[64, -112, 5], [64, -122, 4], [70, -128, 2.5]]), limb([[74, -114, 5], [78, -123, 4], [85, -125, 2.5]])];
  const ear = 'M58 -104C48 -110 40 -106 42 -99C48 -98 54 -100 58 -102Z';
  const legs = [
    limb([[38, -56, 16], [56, -42, 13], [74, -34, 12]]),
    limb([[26, -54, 16], [36, -30, 13], [32, -8, 12]]),
    limb([[-42, -58, 17], [-62, -42, 14], [-82, -34, 12]]),
    limb([[-32, -54, 17], [-38, -30, 14], [-28, -8, 12]]),
  ];
  const hooves = `${oval(79, -33, 6, 7)}${oval(32, -3, 7, 5)}${oval(-87, -33, 6, 7)}${oval(-27, -3, 7, 5)}`;
  const udder = 'M-30 -48C-31 -38 -16 -37 -14 -48';
  const tail = 'M-58 -86C-72 -92 -82 -102 -94 -100';
  const tuft = 'M-92 -100C-98 -108 -108 -106 -110 -98C-104 -96 -98 -94 -92 -98Z';
  const spots =
    'M-40 -92C-30 -98 -18 -94 -20 -84C-22 -74 -36 -76 -42 -82C-44 -86 -43 -90 -40 -92ZM10 -97C20 -100 32 -96 30 -86C26 -80 14 -82 10 -88C8 -92 8 -95 10 -97ZM-6 -66C2 -72 14 -68 12 -60C8 -54 -2 -56 -6 -62Z';
  return {
    lines: [...legs, body, udder, ear, head, muzzle, ...horns, tail, tuft],
    fine: [spots, hooves, 'M86 -76q4 2 8 -1', 'M66 -116q4 -6 10 -4', 'M-50 -60q10 6 24 6'],
    washes: [
      { c: PAL.grey, o: 0.2, d: `${body}${closed(legs)}${head}` },
      { c: PAL.slate, o: 0.75, d: spots },
      { c: PAL.ink, o: 0.35, d: spots },
      { c: PAL.rose, o: 0.85, d: `${muzzle}${udder}Z` },
      { c: PAL.rose, o: 0.6, d: ear },
      { c: PAL.ochre, o: 0.7, d: closed(horns) },
      { c: PAL.slate, o: 0.9, d: `${hooves}${tuft}` },
    ],
    fills: [dot(71, -100, 2.6), oval(87, -84, 1.4, 2), oval(93, -83, 1.2, 1.8)],
    glints: [dot(70.3, -100.8, 0.8)],
  };
}

// ---------------------------------------------------------------------------------------------
// The Horse (he): a big brown horse with a dark mane and tail and a white blaze, galloping to the
// right. Hooves on y = 0, about 200 tall and 230 long.
export function horse() {
  const body = 'M-66 -118C-68 -136 -50 -144 -20 -142C10 -140 30 -144 46 -138C64 -128 66 -106 58 -94C48 -84 20 -86 -6 -86C-34 -86 -56 -86 -64 -98C-68 -104 -68 -112 -66 -118';
  const neck = 'M34 -140C46 -158 58 -172 72 -180M90 -150C80 -138 70 -120 62 -100';
  const head = 'M70 -180C74 -192 90 -194 100 -184C108 -174 118 -162 124 -152C127 -144 121 -137 112 -138C102 -140 94 -144 87 -149C80 -154 70 -166 70 -180Z';
  const ear = 'M76 -188L72 -204L86 -192';
  const blaze = 'M96 -184C102 -176 110 -164 116 -150C118 -146 114 -145 112 -148C106 -160 100 -172 94 -182Z';
  const mane = 'M76 -190C62 -186 50 -172 42 -156C38 -148 34 -142 30 -138C38 -138 42 -146 46 -150C48 -144 54 -150 56 -158C60 -154 63 -160 64 -168C68 -166 70 -174 72 -180C76 -180 80 -184 82 -190Z';
  const tail = 'M-62 -126C-80 -136 -100 -132 -116 -118C-108 -122 -100 -122 -96 -118C-108 -108 -114 -98 -116 -88C-102 -96 -88 -110 -64 -114Z';
  const legs = [
    limb([[44, -94, 19], [66, -72, 15], [88, -62, 13], [96, -50, 12]]),
    limb([[32, -92, 19], [42, -58, 15], [40, -28, 13], [46, -12, 12]]),
    limb([[-46, -96, 21], [-66, -68, 16], [-86, -46, 13], [-100, -34, 12]]),
    limb([[-36, -94, 21], [-44, -58, 16], [-40, -24, 13], [-34, -10, 12]]),
  ];
  const hooves = `${oval(100, -44, 7, 8)}${oval(48, -4, 8, 6)}${oval(-104, -30, 8, 7)}${oval(-32, -3, 8, 6)}`;
  const coat = `${body}Z${head}M34 -140C46 -158 58 -172 72 -180L90 -150C80 -138 70 -120 62 -100Z${closed(legs)}`;
  return {
    lines: [tail, ...legs, body, neck, head, ear, mane],
    fine: [blaze, hooves, 'M108 -142q6 1 10 -3', 'M-50 -100q16 10 40 10', 'M20 -128q8 8 10 20', 'M-90 -124q8 -2 14 2M-104 -108q8 -8 18 -10'],
    washes: [
      { c: PAL.terracotta, o: 0.78, d: coat },
      { c: PAL.ink, o: 0.16, d: coat },
      { c: PAL.ink, o: 0.55, d: `${mane}${tail}` },
      { c: PAL.slate, o: 0.6, d: `${mane}${tail}` },
      { c: PAL.ink, o: 0.4, d: `${ear}Z` },
      { c: PAL.slate, o: 0.9, d: hooves },
    ],
    whites: [blaze],
    fills: [dot(90, -174, 2.8), oval(118, -147, 1.4, 2)],
    glints: [dot(89.2, -175, 0.9)],
  };
}

// ---------------------------------------------------------------------------------------------
// The Fox (he): a red fox with a white cheek, chest and tail tip, and a very big bushy tail. His head
// (foxHead, centre 0,0, nose to the right at 36,-2) is shared by the sitting fox and the swimming
// fox. mood: 'sly' (eyes half shut, a wide sweet smile), 'snap' (eyes squeezed shut, jaws snapped
// shut on nothing).
export function foxHead(mood = 'sly') {
  const head = 'M-16 4C-20 -8 -12 -18 0 -18C8 -18 12 -15 16 -11C22 -9 30 -6 36 -3C39 -1 38 3 34 4C24 7 14 12 4 12C-6 12 -14 10 -16 4Z';
  const ears = 'M-12 -11L-15 -34L-1 -18M-3 -17L4 -38L10 -15';
  const inner = 'M-10 -14L-12 -28L-4 -18ZM0 -18L4 -32L7 -16Z';
  const cheek = 'M-14 6C-6 14 14 12 32 4C22 4 12 3 2 2C-6 2 -11 3 -14 6Z';
  const out = {
    lines: [head, ears],
    fine: [cheek, 'M-8 -6q4 2 6 -1'],
    washes: [
      { c: PAL.terracotta, o: 0.85, d: `${head}${ears}Z` },
      { c: PAL.red, o: 0.22, d: `${head}${ears}Z` },
      { c: PAL.ink, o: 0.55, d: inner },
    ],
    whites: [cheek],
    fills: [dot(36, -2.5, 2.8)],
    glints: [dot(35.4, -3.4, 0.8)],
  };
  if (mood === 'snap') {
    out.fine.push('M6 -12l6 3l-6 2.5', 'M3 -15q5 -1 9 2', 'M34 4C26 6 18 8 12 8', 'M31 4.6l-1.6 2.6l-1.8 -2l-1.6 2.6l-1.8 -2l-1.6 2.6l-1.8 -2l-1.6 2.6l-1.8 -2');
  } else {
    // a half-shut, sly eye and a long sweet smile curling up at the cheek
    out.fills.push('M8.5 -8.5C8.5 -5.5 13.5 -5.5 13.5 -8.5Z');
    out.fine.push('M7 -8.6q4 -2.4 8 0', 'M5 -14q5 -3 10 0');
    out.lines.push('M34 4Q24 9 13 5q-3 -1 -2 -4');
    out.washes.push({ c: PAL.rose, o: 0.7, d: dot(5, 0, 3.4) });
  }
  return out;
}

const foxTail = limb([
  [-26, -10, 16],
  [-46, -6, 22],
  [-66, -12, 24],
  [-80, -28, 18],
  [-84, -44, 9],
]);
const foxTailTip = 'M-76 -36C-82 -34 -88 -38 -90 -44C-88 -50 -84 -54 -80 -54C-79 -48 -78 -42 -76 -36Z';

/** The Fox sitting up, facing right, his big tail on the ground behind him; about 120 tall. */
export function fox({ mood = 'sly' } = {}) {
  const back = 'M14 -72C-4 -66 -22 -46 -28 -24C-31 -10 -24 0 -12 0L26 0';
  const chest = 'M34 -66C38 -48 34 -24 30 0';
  const haunch = 'M-26 -18C-22 -36 -4 -40 3 -25C6 -14 2 -4 -4 0';
  const legs = 'M14 -30L13 -1M24 -32L25 -1';
  const paws = 'M6 0C6 -5 14 -5 15 -1M18 0C18 -5 26 -5 28 -1';
  const chestWhite = 'M34 -66C38 -52 36 -36 32 -24C26 -32 22 -46 22 -58C24 -64 28 -68 34 -66Z';
  return merge(
    {
      lines: [foxTail, back, chest, haunch, legs],
      fine: [paws, 'M-74 -32C-78 -38 -79 -44 -80 -52', 'M-14 -46l6 3M-20 -34l6 3M-44 -12l8 1M-60 -16l7 -1', 'M22 -56l4 3M24 -44l4 3'],
      washes: [
        { c: PAL.terracotta, o: 0.85, d: `${back}L34 -66Z${foxTail}Z` },
        { c: PAL.red, o: 0.22, d: `${back}L34 -66Z${foxTail}Z` },
        { c: PAL.red, o: 0.2, d: `${haunch}Z` },
        { c: PAL.ink, o: 0.55, d: `${paws.replace(/M18/, 'ZM18')}Z` },
      ],
      whites: [chestWhite, foxTailTip],
    },
    place(foxHead(mood), 'translate(26 -86) rotate(10) scale(1.15)'),
  );
}

/**
 * The Fox swimming, facing right, his nose tipped up: only his head, a bit of his back and the tip
 * of his floating tail are above the water, whose surface is y = 0.
 */
export function swimmingFox({ mood = 'snap', tilt = -30 } = {}) {
  const neck = 'M-6 0C-12 -6 -14 -14 -12 -22M14 0C14 -6 16 -10 20 -14';
  const backHump = 'M-34 0C-30 -8 -20 -10 -12 -7';
  const tail = limb([[-38, 2, 12], [-52, -2, 15], [-66, -8, 13], [-74, -18, 8]]);
  const tip = 'M-70 -12C-74 -12 -78 -16 -78 -22C-74 -24 -71 -22 -69 -18Z';
  return merge(
    {
      lines: [neck, backHump, tail],
      washes: [
        { c: PAL.terracotta, o: 0.85, d: `M-12 -22C-14 -14 -12 -6 -6 0L14 0C14 -6 16 -10 20 -14Z${backHump}L-12 0Z${tail}Z` },
        { c: PAL.red, o: 0.22, d: `${tail}Z` },
      ],
      whites: [tip],
    },
    place(foxHead(mood), `translate(2 -26) rotate(${tilt})`),
  );
}
