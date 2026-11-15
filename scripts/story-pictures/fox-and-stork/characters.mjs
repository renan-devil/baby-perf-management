import { PAL, transformPath } from '../lib.mjs';
import { compose, dot, fox, limb, place } from '../fox-and-crow/characters.mjs';

// The Fox and the Stork: the characters shared by both pictures. The fox is the same red fox as in
// The Fox and the Crow (../fox-and-crow/characters.mjs); the stork and the dishes are drawn here.
// Not a picture: the build only draws files named <n>.mjs. Characters face right with their feet
// at y = 0; flip with scale(-1 1).

export { compose, dot, fox, place };

const f = (n) => Math.round(n * 10) / 10;

// ---------------------------------------------------------------------------------------------
// The Fox lapping: the sitting fox of the other stories with his head bent down and forward over
// a dish, his tongue out. The head shapes of fox() are turned about the neck.
const tongue = 'M52 -106C52 -97 56 -89 62 -88C67 -89 66 -97 60 -108';

export function foxLapping(turn = 26) {
  const fx = fox();
  const h = (d) => transformPath(d, `translate(12 -3) rotate(${turn} 22 -76)`);
  // washes[0] is back, head, ears and tail in one shape; washes[3] is the inner ears and the paws.
  const [back, head, ears, tail] = fx.washes[0].d.split('Z');
  const [ear1, ear2, paw1, paw2] = fx.washes[3].d.split('Z');
  const [chestWhite, tailTip, cheek] = fx.whites;
  // the neck, stretched forward to the dish
  const neck = `M-12 -56L6 -78${h('M10 -84L38 -82').replace('M', 'L')}L32 -50L12 -44Z`;
  return {
    lines: [...fx.lines.slice(0, 2), `${h('M36 -80')}C33 -66 31 -40 26 0`, ...fx.lines.slice(3, 5), h(fx.lines[5]), h(fx.lines[6])],
    fine: [...fx.fine.slice(0, 4).map(h), ...fx.fine.slice(4), h(tongue)],
    washes: [
      { ...fx.washes[0], d: `${back}Z${tail}Z${neck}${h(`${head}Z${ears}Z`)}` },
      fx.washes[1],
      { ...fx.washes[2], d: h(fx.washes[2].d) },
      { ...fx.washes[3], d: `${h(`${ear1}Z${ear2}Z`)}${paw1}Z${paw2}Z` },
      { c: PAL.rose, o: 0.9, d: h(`${tongue}Z`) },
    ],
    whites: [chestWhite, tailTip, h(cheek)],
    fills: fx.fills.map(h),
    glints: [],
  };
}

// ---------------------------------------------------------------------------------------------
// The Stork: a white bird on long thin red legs, black wing tips, her neck bent forward and her
// long pointy beak pointing down (to a plate, or into a jar). dip (0 to 1) is how much of the beak
// shows: below 1 the tip is hidden inside a jar.
const sBody = 'M-62 -146C-40 -152 -12 -160 14 -156C32 -153 42 -140 38 -126C34 -112 18 -104 -2 -104C-24 -104 -42 -118 -62 -146Z';
const sWingTips = 'M-14 -128C-30 -128 -46 -136 -60 -145L-67 -140L-59 -137L-65 -131L-55 -131L-58 -124C-42 -118 -28 -120 -14 -128Z';
const sWing = 'M30 -150C10 -144 -12 -138 -30 -136M-8 -146c6 2 10 6 12 10M10 -148c6 2 10 6 12 10';
const sNeckBack = 'M22 -155C30 -166 36 -177 48 -181C56 -184 66 -182 72 -176';
const sNeckFront = 'M38 -130C44 -142 50 -152 58 -158C62 -161 66 -162 70 -163';
const sNeck = `${sNeckBack}L70 -163C66 -162 62 -161 58 -158C50 -152 44 -142 38 -130Z`;
const sFeathers = 'M44 -146l4 3M48 -156l4 2';
const legPts = [
  [
    [-6, -106],
    [-12, -54],
    [-8, 0],
  ],
  [
    [8, -106],
    [2, -54],
    [9, 0],
  ],
];
const sLegs = legPts.map(([a, b, c]) => `M${a[0]} ${a[1]}L${b[0]} ${b[1]}L${c[0]} ${c[1]}`).join('');
const sKnees = 'M-14 -56c2 -1 4 -1 5 1M0 -56c2 -1 4 -1 5 1';
const sToes = 'M-8 0l-9 1M-8 0l10 1M9 0l-8 1M9 0l11 1';
const BEAK = { top: [73, -175], low: [69, -164], tip: [100, -94] };

export function stork(dip = 1) {
  const at = ([x, y]) => [f(x + (BEAK.tip[0] - x) * dip), f(y + (BEAK.tip[1] - y) * dip)];
  const [tx, ty] = at(BEAK.top);
  const [lx, ly] = at(BEAK.low);
  const beak = `M${BEAK.top.join(' ')}L${tx} ${ty}M${BEAK.low.join(' ')}L${lx} ${ly}`;
  const beakFill = `M${BEAK.top.join(' ')}L${tx} ${ty}L${lx} ${ly}L${BEAK.low.join(' ')}Z`;
  return {
    lines: [sBody, sNeckBack, sNeckFront, 'M72 -176C73 -172 73 -168 70 -163', beak, sLegs],
    fine: [sWing, sFeathers, sKnees, sToes, 'M74 -168l5 0'],
    washes: [
      { c: PAL.grey, o: 0.35, d: 'M-50 -128C-30 -112 -10 -106 6 -106C24 -108 34 -116 37 -128C24 -118 0 -116 -20 -120C-34 -122 -44 -126 -50 -128Z' },
      { c: PAL.sky, o: 0.18, d: `${sBody}${sNeck}` },
      { c: PAL.ink, o: 0.78, d: sWingTips },
      { c: PAL.red, o: 0.8, d: beakFill },
      { c: PAL.terracotta, o: 0.85, d: legPts.map((p) => `${limb(p.map(([x, y]) => [x, y, 4]))}Z`).join('') },
    ],
    whites: [],
    fills: [dot(63, -172, 2.5)],
    glints: [dot(63.8, -173, 0.8)],
  };
}

// ---------------------------------------------------------------------------------------------
// The dishes. A flat plate seen from the side, centre (x, y) on the table, with a little soup.
export function plate(x, y, soup = true) {
  const rim = `M${x - 23} ${y}C${x - 23} ${y - 7} ${x + 23} ${y - 7} ${x + 23} ${y}C${x + 23} ${y + 6} ${x - 23} ${y + 6} ${x - 23} ${y}Z`;
  const foot = `M${x - 10} ${y + 5}L${x - 9} ${y + 8}L${x + 9} ${y + 8}L${x + 10} ${y + 5}`;
  const s = `M${x - 15} ${y}C${x - 15} ${y - 4} ${x + 15} ${y - 4} ${x + 15} ${y}C${x + 15} ${y + 3} ${x - 15} ${y + 3} ${x - 15} ${y}Z`;
  return {
    lines: [rim, foot],
    fine: soup ? [s] : [],
    washes: [{ c: PAL.sky, o: 0.45, d: rim }, ...(soup ? [{ c: PAL.ochre, o: 0.85, d: s }] : [])],
    whites: [],
    fills: [],
    glints: [],
  };
}

/** A tall jar with a long thin neck standing on the ground at (x, y), its mouth h above. */
export function jar(x, y, h = 120) {
  const k = h / 120;
  const Y = (v) => f(y - v * k);
  const top = f(y - h);
  const side = (s) =>
    `M${x + s * 4} ${y}C${x + s * 26} ${y} ${x + s * 30} ${Y(22)} ${x + s * 28} ${Y(38)}C${x + s * 26} ${Y(54)} ${x + s * 9} ${Y(58)} ${x + s * 8} ${Y(70)}L${x + s * 7} ${Y(116)}`;
  const lip = `M${x - 11} ${top}C${x - 11} ${top - 5} ${x + 11} ${top - 5} ${x + 11} ${top}C${x + 11} ${top + 5} ${x - 11} ${top + 5} ${x - 11} ${top}Z`;
  const body = `M${x - 4} ${y}C${x - 26} ${y} ${x - 30} ${Y(22)} ${x - 28} ${Y(38)}C${x - 26} ${Y(54)} ${x - 9} ${Y(58)} ${x - 8} ${Y(70)}L${x - 7} ${Y(116)}L${x + 7} ${Y(116)}L${x + 8} ${Y(70)}C${x + 9} ${Y(58)} ${x + 26} ${Y(54)} ${x + 28} ${Y(38)}C${x + 30} ${Y(22)} ${x + 26} ${y} ${x + 4} ${y}Z`;
  const bands = `M${x - 28} ${Y(30)}C${x - 10} ${Y(25)} ${x + 10} ${Y(25)} ${x + 28} ${Y(30)}M${x - 26} ${Y(46)}C${x - 10} ${Y(41)} ${x + 10} ${Y(41)} ${x + 26} ${Y(46)}`;
  const zig = Array.from({ length: 6 }, (_, i) => `${i ? 'L' : 'M'}${f(x - 22 + i * 8.8)} ${Y(i % 2 ? 41 : 33)}`).join('');
  return {
    lines: [side(-1), side(1), lip, `M${x - 4} ${y}L${x + 4} ${y}`],
    fine: [bands, zig],
    washes: [
      { c: PAL.slate, o: 0.55, d: body },
      { c: PAL.sky, o: 0.35, d: body },
      { c: PAL.ink, o: 0.6, d: `M${x - 8} ${top}C${x - 8} ${top - 3} ${x + 8} ${top - 3} ${x + 8} ${top}C${x + 8} ${top + 3} ${x - 8} ${top + 3} ${x - 8} ${top}Z` },
    ],
    whites: [`M${x + 14} ${Y(50)}c5 5 8 12 8 20c-3 -5 -5 -12 -8 -20Z`],
    fills: [],
    glints: [],
  };
}
