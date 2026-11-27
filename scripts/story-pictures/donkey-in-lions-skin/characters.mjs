import { PAL } from '../lib.mjs';
import { dot, limb, merge, oval, place } from '../stone-soup/characters.mjs';

// The Donkey in the Lion's Skin: the little grey donkey and the golden lion skin, shared by the two
// pictures. Each is drawn once here and placed in each picture with a transform (place). The build
// only draws files named <n>.mjs, so this file is not a picture.

export { compose, place, dot, oval, at } from '../stone-soup/characters.mjs';

const r1 = (n) => Math.round(n * 10) / 10;

/**
 * A shaggy outline (a mane) round (cx, cy): n soft locks sticking out by about `depth`.
 * Deterministic: the locks vary a little with `seed`.
 */
export function shag(cx, cy, rx, ry, n, depth, seed = 1, a0 = 0) {
  let s = seed;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const base = [];
  const tips = [];
  for (let i = 0; i < n; i++) {
    const a = a0 + (i / n) * Math.PI * 2;
    const b = a + Math.PI / n;
    const k = 1 + (depth / Math.max(rx, ry)) * (0.75 + r() * 0.5);
    base.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
    tips.push([cx + Math.cos(b) * rx * k, cy + Math.sin(b) * ry * k]);
  }
  let d = `M${r1(base[0][0])} ${r1(base[0][1])}`;
  for (let i = 0; i < n; i++) {
    const [tx, ty] = tips[i];
    const [nx, ny] = base[(i + 1) % n];
    d += `Q${r1(tx)} ${r1(ty)} ${r1(nx)} ${r1(ny)}`;
  }
  return `${d}Z`;
}

/** A shaggy fringe from A to B: n little locks hanging down by about `depth`. */
function fringe(ax, ay, bx, by, n, depth) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const t0 = i / n;
    const t1 = (i + 1) / n;
    const tm = (t0 + t1) / 2;
    const x1 = ax + (bx - ax) * t1;
    const y1 = ay + (by - ay) * t1;
    const xm = ax + (bx - ax) * tm;
    const ym = ay + (by - ay) * tm + depth * (i % 2 ? 0.8 : 1.15);
    d += `Q${r1(xm)} ${r1(ym)} ${r1(x1)} ${r1(y1)}`;
  }
  return d;
}

/** A leg along pts, washed in colour, with a slate hoof at its end. */
function leg(pts, c, o) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const h = oval(x, y + 1, 5, 4.4);
  return { lines: [d], fine: [h], washes: [{ c, o, d: `${d}Z` }, { c: PAL.slate, o: 0.9, d: h }] };
}

// ---------------------------------------------------------------------------------------------
// The little grey donkey (hooves at y = 0, facing right, body centred on x = 0), about 150 long and
// 162 tall to the tips of his long ears: a round grey body, a pale belly and muzzle, a dark mane, a
// tufted tail and slate hooves.
//   mood: 'curious' (eye wide open, ears pricked) or 'bray' (eyes squeezed shut, mouth wide open)
//   headTurn: degrees the head and neck turn about the base of the neck (34, -70); + is down
//   skin: true when he wears the lion skin: a golden shaggy coat over his back, golden legs, a lion's
//   tail and a big golden mane round his head, with only his grey muzzle and long ears poking out.
const dBody =
  'M-46 -66C-48 -80 -32 -88 -8 -87C14 -86 32 -84 40 -76C49 -68 48 -50 40 -46C22 -40 -22 -40 -40 -45C-48 -50 -46 -58 -46 -66Z';
const dBelly = 'M-28 -44C-10 -50 14 -50 30 -45C14 -41 -12 -41 -28 -44Z';
const dNeck = 'M28 -82C34 -94 40 -104 46 -112M42 -64C50 -74 58 -86 64 -96';
const dNeckFill = 'M26 -82C33 -95 40 -106 46 -112L66 -96C58 -84 50 -72 42 -62Z';
const dHead = 'M44 -116C46 -130 62 -134 72 -124C80 -116 90 -108 96 -100C100 -92 94 -84 84 -86C74 -88 62 -94 54 -100C46 -104 43 -110 44 -116Z';
const dMuzzle = 'M80 -110C88 -104 94 -102 96 -100C100 -92 94 -84 84 -86C80 -87 77 -90 76 -94C76 -100 77 -106 80 -110Z';
// the visible front of his head when the lion's mane covers the rest
const dSnout = 'M72 -122C80 -115 90 -108 96 -100C100 -92 94 -84 84 -86C78 -87 72 -90 67 -93';
const dSnoutFill = `${dSnout}C64 -104 66 -116 72 -122Z`;
const dEars = 'M50 -126C44 -142 42 -156 46 -162C53 -158 57 -144 57 -128M60 -127C62 -143 68 -156 73 -159C78 -152 72 -138 65 -126';
const dEarsIn = 'M48.5 -136C47 -146 47 -154 48 -157C51 -152 53 -144 53 -136ZM62.5 -134C64 -143 68 -151 71 -154C72 -148 69 -140 65 -133Z';
const dEarTips = 'M46 -162C53 -158 55 -152 55 -149C51 -151 47 -154 45 -157ZM73 -159C78 -152 76 -148 74 -145C71 -148 70 -152 70 -155Z';
// longer ears, poking up out of the lion's mane
const sEars = 'M47 -130C38 -150 36 -168 41 -176C49 -170 54 -152 55 -132M62 -131C66 -151 74 -168 80 -171C85 -162 77 -146 68 -129';
const sEarsIn = 'M43 -150C41 -160 41 -167 42 -171C46 -165 49 -156 50 -147ZM67 -146C70 -155 75 -163 78 -166C79 -159 75 -150 70 -143Z';
const sEarTips = 'M41 -176C49 -170 51 -164 51 -161C47 -163 42 -167 40 -171ZM80 -171C85 -162 83 -158 81 -155C78 -158 77 -163 77 -167Z';
const dMane = 'M46 -118C40 -110 34 -100 28 -88L25 -82C32 -92 38 -102 47 -114Z';
const dManeHatch = 'M46 -118l-5 -2M42 -112l-5 -2M38 -106l-5 -2M34 -100l-5 -2M30 -94l-5 -2';
const dTail = 'M-46 -70C-54 -64 -58 -54 -58 -44';
const dTuft = 'M-58 -46C-63 -40 -62 -32 -58 -28C-54 -32 -53 -40 -58 -46Z';
const D_LEGS = [
  // far front, far hind, near front, near hind
  [[20, -50, 9], [18, -26, 7], [17, -3, 6.5]],
  [[-22, -50, 10], [-20, -26, 7], [-20, -3, 6.5]],
  [[30, -50, 10], [31, -26, 7.5], [32, -3, 7]],
  [[-32, -50, 11], [-34, -26, 7.5], [-35, -3, 7]],
];
// the lion skin worn as a coat: over his back from neck to rump, a shaggy fringe hanging below
const sCoatTop = 'M-52 -48C-56 -66 -48 -86 -26 -90C-4 -94 20 -92 34 -86';
const sCoat = `${sCoatTop}C44 -80 52 -66 50 -50${fringe(50, -50, -52, -48, 9, 9)}Z`;
const sNeck = 'M26 -86C34 -98 40 -108 44 -114L70 -98C62 -84 54 -70 48 -58Z';
const sTail = 'M-52 -66C-66 -62 -72 -48 -70 -34C-69 -26 -64 -22 -66 -16';
const sTailTuft = 'M-66 -18C-73 -12 -72 -2 -66 2C-60 -2 -59 -12 -66 -18Z';
const sMane = shag(45, -111, 24, 27, 14, 10, 11, 0.2);
const sManeLocks = 'M28 -124q-4 -4 -8 -4M36 -134q-2 -5 -6 -8M56 -136q2 -4 6 -7M26 -106q-5 0 -9 3M32 -92q-4 3 -6 7M48 -90q0 5 -3 8M38 -118q-3 -3 -7 -3M36 -104q-4 1 -7 4M58 -100q2 4 5 6';

export function donkey({ mood = 'curious', headTurn = 0, skin = false } = {}) {
  const legC = skin ? PAL.ochre : PAL.grey;
  const far = D_LEGS.slice(0, 2).map((pts) => leg(pts, legC, skin ? 0.55 : 0.5));
  const near = D_LEGS.slice(2).map((pts) => leg(pts, legC, skin ? 0.75 : 0.8));
  const eye = [64, -115];
  const ears = skin ? sEars : dEars;
  const head = {
    lines: [skin ? dSnout : dHead, ears],
    fine: [skin ? sEarsIn : dEarsIn, dot(92, -96, 1.3)],
    washes: [
      { c: PAL.grey, o: 0.85, d: `${skin ? dSnoutFill : dHead}${ears.replace(/M6/, 'ZM6')}Z` },
      { c: PAL.slate, o: 0.75, d: skin ? sEarTips : dMane + dEarTips },
      { c: PAL.rose, o: 0.55, d: skin ? sEarsIn : dEarsIn },
    ],
    whites: [],
    fills: [],
    glints: [],
  };
  if (skin) {
    // the lion's mane, round the back of his head and over his neck
    head.lines.unshift(sMane);
    head.fine.push(sManeLocks);
    head.washes.unshift({ c: PAL.ochre, o: 0.85, d: sNeck + sMane }, { c: PAL.terracotta, o: 0.35, d: sMane });
  } else {
    head.lines.unshift(dNeck);
    head.fine.push(dManeHatch, 'M54 -128l-3 -6M58 -129l1 -6');
    head.washes.unshift({ c: PAL.grey, o: 0.85, d: dNeckFill });
  }
  if (mood === 'bray') {
    const mouth = 'M72 -92L100 -99C102 -84 94 -72 83 -72C77 -75 73 -83 72 -92Z';
    head.fine.push(mouth, 'M81 -79C85 -77 90 -78 93 -81');
    head.washes.push({ c: PAL.red, o: 0.8, d: mouth });
    head.whites.push('M86 -94.5L95 -96.8L95.6 -93.6L86.6 -91.4Z');
    head.fine.push('M86 -94.5L95 -96.8L95.6 -93.6L86.6 -91.4Z');
    // eye squeezed shut with joy (for the skin, on the grey snout by the mane)
    head.fine.push(skin ? 'M79 -104q4 -4 8 0' : `M${eye[0] - 3} ${eye[1]}q3 -3.4 6 0`);
  } else {
    if (!skin) head.whites.push(dMuzzle);
    head.fills.push(dot(...eye, 2.5));
    head.glints.push(dot(eye[0] - 0.8, eye[1] - 0.8, 0.75));
    head.fine.push('M82 -88q5 1 9 -2', `M${eye[0] - 4} ${eye[1] - 6}q4 -3 8 -1`);
  }
  const placedHead = headTurn ? place(head, `rotate(${headTurn} 34 -70)`) : head;
  const body = skin
    ? {
        lines: [sCoat, sTail],
        fine: [sTailTuft],
        washes: [
          { c: PAL.ochre, o: 0.8, d: sCoat },
          { c: PAL.ochre, o: 0.7, d: `${sTail}L-62 -16C-62 -26 -64 -50 -50 -60Z` },
          { c: PAL.terracotta, o: 0.8, d: sTailTuft },
        ],
      }
    : {
        lines: [dBody, dTail],
        fine: [dTuft],
        washes: [
          { c: PAL.grey, o: 0.85, d: dBody },
          { c: PAL.slate, o: 0.6, d: dTuft },
        ],
        whites: [dBelly],
      };
  return merge(...far, body, placedHead, ...near);
}

// ---------------------------------------------------------------------------------------------
// The lion skin lying flat on the grass (centre of the pelt at 0,0), about 190 long: a golden pelt
// with four floppy paws, a long tail with a terracotta tuft, and at the left a big shaggy mane round a
// flat, sleepy-looking face.
const lPelt = 'M-40 -12C-10 -18 34 -17 62 -11C76 -8 78 3 66 6C36 10 -10 10 -40 7C-48 4 -48 -9 -40 -12Z';
const paw = (pts) => limb(pts);
const lPaws = [
  [[-16, -12, 12], [-24, -24, 10], [-36, -30, 10]],
  [[-16, 6, 13], [-26, 14, 11], [-40, 18, 11]],
  [[52, -10, 12], [64, -20, 10], [76, -24, 10]],
  [[54, 4, 13], [68, 12, 11], [82, 15, 11]],
].map(paw);
const lToes = 'M-38 -35l2 4M-42 -31l3 2M-43 14l2 4M-46 18l3 1M78 -28l-1 4M82 -24l-3 2M84 11l-1 4M88 15l-3 1';
const lTail = 'M72 -2C84 0 92 -8 90 -20';
const lTailTuft = 'M90 -19C84 -24 86 -32 92 -34C97 -30 96 -22 90 -19Z';
const lMane = shag(-62, -8, 28, 22, 16, 10, 5, 0.1);
const lFace = oval(-62, -7, 16, 13);
const lEars = 'M-74 -15C-78 -21 -73 -25 -69 -20M-55 -20C-51 -25 -46 -21 -50 -15';
const lNose = 'M-66 -5L-58 -5L-62 -1Z';
const lMarks = 'M-70 -10q4 2.5 7 0M-61 -10q4 2.5 7 0M-62 -1L-62 1.5M-67 3q2.5 2 5 -1q2.5 3 5 1';
const lFur = 'M-20 -4q6 -3 12 -1M10 -7q6 -3 12 -1M34 -1q6 -3 12 -1';

export function lionSkin() {
  return {
    lines: [lPelt, ...lPaws, lTail, lMane],
    fine: [lTailTuft, lFace, lEars, lToes, lFur],
    once: [lMarks],
    washes: [
      { c: PAL.ochre, o: 0.8, d: `${lPelt}${lPaws.map((d) => `${d}Z`).join('')}` },
      { c: PAL.ochre, o: 0.7, d: `${lTail}L94 -18C96 -6 88 4 72 3Z` },
      { c: PAL.ochre, o: 0.85, d: lMane + lFace, rule: 'evenodd' },
      { c: PAL.terracotta, o: 0.5, d: lMane + lFace, rule: 'evenodd' },
      { c: PAL.ochre, o: 0.45, d: lFace },
      { c: PAL.terracotta, o: 0.8, d: lTailTuft },
      { c: PAL.terracotta, o: 0.85, d: lNose },
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// The fox (sitting, feet at 0,0, facing left), about 74 tall: a terracotta fox with a white chest,
// pointed ears and a big bushy tail with a white tip. mood: 'laugh' (eyes squeezed, mouth wide open).
const fBody = 'M-8 -42C-20 -32 -22 -12 -16 0L14 0C20 -12 18 -32 6 -44Z';
const fChest = 'M-13 -40C-16 -28 -14 -16 -9 -8C-5 -18 -5 -30 -6 -40Z';
const fHead = 'M-4 -42C-12 -44 -24 -48 -33 -52C-26 -58 -16 -65 -6 -64C3 -64 9 -57 7 -49C5 -44 0 -42 -4 -42Z';
const fEars = 'M-10 -63L-9 -78L-1 -64M0 -63L6 -76L8 -58';
const fTail = 'M14 -2C34 -2 46 -14 42 -32C40 -40 34 -42 30 -40C32 -30 28 -18 14 -12';
const fTip = 'M42 -32C40 -40 34 -42 30 -40C31 -36 31 -33 31 -30C35 -29 39 -30 42 -32Z';
const fLegs = 'M-10 -16L-12 -1M-3 -16L-4 -1';

export function fox() {
  const mouth = 'M-31 -51L-14 -48C-17 -42 -26 -43 -31 -51Z';
  return {
    lines: [fTail, fBody, fHead, fEars],
    fine: [fLegs, mouth, 'M-17 -56q3 -3.4 6 0'],
    washes: [
      { c: PAL.terracotta, o: 0.8, d: `${fTail}Z${fBody}${fHead}` },
      { c: PAL.terracotta, o: 0.8, d: 'M-10 -63L-9 -78L-1 -64ZM0 -63L6 -76L8 -58Z' },
      { c: PAL.red, o: 0.8, d: mouth },
    ],
    whites: [fChest, fTip],
    fills: [oval(-33, -52.5, 2, 1.8)],
    glints: [],
  };
}
