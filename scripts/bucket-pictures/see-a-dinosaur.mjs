// See a dinosaur: a long-necked dinosaur skeleton stands on a low museum plinth, with a red rope
// barrier on two brass posts in front of it.
import { PAL, paths, transformPath } from '../story-pictures/lib.mjs';

const f = (n) => Math.round(n * 10) / 10;
const dot = (x, y, r, ry = r) => `M${f(x - r)} ${f(y)}a${r} ${ry} 0 1 0 ${f(2 * r)} 0a${r} ${ry} 0 1 0 ${f(-2 * r)} 0Z`;
const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k];
const pt = (p) => `${f(p[0])} ${f(p[1])}`;

// The backbone, from the tip of the tail to the head, as three curves.
const spine = [
  [[22, 214], [62, 206], [100, 140], [142, 122]], // tail
  [[142, 122], [172, 110], [212, 114], [238, 128]], // back
  [[238, 128], [266, 122], [298, 92], [312, 56]], // neck
];
const bez = ([a, b, c, d], t) => {
  const u = 1 - t;
  return [
    u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
    u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
  ];
};
// Fine samples of the whole backbone with their running length, for spacing the bones evenly.
const samples = [];
spine.forEach((seg, k) => {
  for (let i = 0; i <= 200; i++) {
    if (k > 0 && i === 0) continue;
    const p = bez(seg, i / 200);
    const prev = samples[samples.length - 1];
    samples.push({ p, s: prev ? prev.s + Math.hypot(p[0] - prev.p[0], p[1] - prev.p[1]) : 0, part: k });
  }
});
const total = samples[samples.length - 1].s;
const at = (s) => {
  const found = samples.findIndex((q) => q.s >= s);
  const i = Math.max(1, found < 0 ? samples.length - 1 : found);
  const a = samples[i - 1];
  const b = samples[Math.min(i, samples.length - 1)];
  const len = Math.hypot(b.p[0] - a.p[0], b.p[1] - a.p[1]) || 1;
  const t = [(b.p[0] - a.p[0]) / len, (b.p[1] - a.p[1]) / len];
  return { p: a.p, t, n: [t[1], -t[0]], part: a.part }; // n points to the dinosaur's back
};
// Size of a backbone bone along the way: small at the tail tip, big at the hips, small at the head.
const sTail = samples.findIndex((q) => q.part === 1);
const sNeck = samples.findIndex((q) => q.part === 2);
const lenTail = samples[sTail].s;
const lenBack = samples[sNeck].s;
const size = (s) => {
  if (s < lenTail) return 2.4 + (6.4 * s) / lenTail;
  if (s < lenBack) return 8.6;
  return 8 - (4 * (s - lenBack)) / (total - lenBack);
};

let vertebrae = '';
let spines = '';
let chevrons = '';
const bandTop = [];
const bandBottom = [];
for (let s = 4; s < total; ) {
  const z = size(s);
  const { p, t, n, part } = at(s);
  const a = part === 2 ? z * 1.25 : z * 0.75; // half length (neck bones are long)
  const b = z * 0.62; // half height
  const angle = (Math.atan2(t[1], t[0]) * 180) / Math.PI;
  const p1 = add(p, t, -a);
  const p2 = add(p, t, a);
  vertebrae += `M${pt(p1)}A${f(a)} ${f(b)} ${f(angle)} 0 1 ${pt(p2)}A${f(a)} ${f(b)} ${f(angle)} 0 1 ${pt(p1)}Z`;
  const h = part === 0 ? z * 1.2 : part === 1 ? 11 : z * 0.6; // spines on top
  spines += `M${pt(add(p, n, b))}L${pt(add(add(p, n, b + h), t, -2))}`;
  if (part === 0 && z > 3) chevrons += `M${pt(add(p, n, -b))}L${pt(add(add(p, n, -b - z * 1.1), t, -2.5))}`;
  bandTop.push(add(p, n, b + h * 0.8 + 2));
  bandBottom.push(add(p, n, -b - (part === 0 ? z : 2)));
  s += 2 * a + 1.2;
}
const band = `M${bandTop.map(pt).join('L')}L${bandBottom.reverse().map(pt).join('L')}Z`;

// Ribs hang from the back, longest in the middle.
let ribs = '';
for (let i = 0; i < 8; i++) {
  const t = 0.14 + i * 0.105;
  const [x, y] = bez(spine[1], t);
  const L = 30 + 44 * Math.sin(Math.PI * (0.25 + 0.7 * (i / 7)));
  ribs += `M${f(x)} ${f(y + 6)}C${f(x + 7)} ${f(y + 6 + L * 0.35)} ${f(x + 3)} ${f(y + 6 + L * 0.8)} ${f(x - 7)} ${f(y + 6 + L)}`;
}
const ribcage = 'M150 128C190 118 224 124 240 140C244 168 232 192 212 198C186 202 160 194 150 176C144 160 144 140 150 128Z';

/** A long bone from A to B, w wide, with knobbly ends. */
function bone(A, B, w) {
  const l = Math.hypot(B[0] - A[0], B[1] - A[1]);
  const u = [(B[0] - A[0]) / l, (B[1] - A[1]) / l];
  const n = [-u[1], u[0]];
  const h = w * 0.32;
  const k = w * 0.5;
  const P = (o, along, side) => pt(add(add(o, u, along), n, side));
  return (
    `M${P(A, 0, k)}Q${P(A, w * 0.5, h)} ${P(A, w, h)}L${P(B, -w, h)}Q${P(B, -w * 0.5, h)} ${P(B, 0, k)}` +
    `C${P(B, k * 1.1, k)} ${P(B, k * 1.1, -k)} ${P(B, 0, -k)}Q${P(B, -w * 0.5, -h)} ${P(B, -w, -h)}L${P(A, w, -h)}` +
    `Q${P(A, w * 0.5, -h)} ${P(A, 0, -k)}C${P(A, -k * 1.1, -k)} ${P(A, -k * 1.1, k)} ${P(A, 0, k)}Z`
  );
}
// Legs: thigh and shin, upper arm and forearm; the far legs sit a little behind.
const nearLegs = [
  bone([146, 138], [154, 186], 15),
  bone([154, 188], [148, 226], 12),
  bone([236, 146], [232, 188], 13),
  bone([232, 190], [236, 226], 11),
];
const farLegs = [bone([164, 136], [172, 182], 13), bone([172, 184], [168, 222], 10), bone([252, 142], [250, 184], 11), bone([250, 186], [254, 222], 9)];
const feet = 'M136 228C140 222 158 222 162 230L166 237L132 237ZM224 228C228 222 246 222 250 230L252 237L220 237Z';
const farFeet = 'M158 224C162 219 176 219 180 226L183 232L156 232ZM242 224C246 219 260 219 264 226L266 232L240 232Z';
const toes = 'M140 237l-2 -6M148 237l0 -7M156 237l2 -6M228 237l-2 -6M236 237l0 -7M244 237l2 -6';
const hip = 'M124 124C130 112 156 110 168 120C170 132 160 140 146 142C134 142 122 136 124 124Z';
const hipBones = 'M136 140L122 168M158 140L176 164';
const shoulder = 'M226 120C234 116 242 120 244 128L246 156C244 164 234 164 232 156Z';

// The head: a small skull with a big eye hole and a row of peg teeth.
const SK = (d) => transformPath(d, 'translate(4 6) rotate(16 308 56)');
const skull = SK('M306 52C304 43 312 37 323 37C334 37 343 42 347 50C349 56 345 60 339 60L314 60C309 60 307 57 306 52Z');
const jaw = SK('M310 60C318 66 334 66 344 59');
const teeth = SK('M328 60l0 3M333 60l0 3.5M338 60l0 3.5M342 59l0 3');
const holes = SK(`${dot(318, 47, 4.6, 4.2)}M330 45c3 -3 7 -3 9 0c-2 4 -7 4 -9 0Z`);

// Plinth with a little plaque, two museum rods, and the rope barrier in front.
const plinthTop = 'M40 240L56 228L370 228L356 240Z';
const plinthFront = 'M40 240L356 240L356 264L40 264Z';
const plinthSide = 'M356 240L370 228L370 252L356 264';
const plaque = 'M182 246L218 246L218 258L182 258Z';
const posts = 'M60 292L60 258M64 292L64 258M336 292L336 258M340 292L340 258';
const postWash = 'M59 258L65 258L65 292L59 292ZM335 258L341 258L341 292L335 292Z';
const knobs = `${dot(62, 253, 6)}${dot(338, 253, 6)}`;
const bases = 'M50 294C52 288 72 288 74 294ZM326 294C328 288 348 288 350 294Z';
const rope = 'M66 258C120 290 280 290 334 258';
const ropeLow = 'M66 264C120 296 280 296 334 264';
const ropeWash = 'M64 256C120 288 280 288 336 256L336 265C280 297 120 297 64 265Z';
const ropeTwist = (() => {
  let d = '';
  for (let i = 1; i < 14; i++) {
    const t = i / 14;
    const [x, y] = bez([[66, 261], [120, 293], [280, 293], [334, 261]], t);
    d += `M${f(x - 2)} ${f(y - 3)}l4 6`;
  }
  return d;
})();

export default {
  title: 'See a dinosaur',
  seed: 223,
  washes: [
    { c: PAL.grey, o: 0.45, d: plinthTop },
    { c: PAL.slate, o: 0.42, d: `${plinthFront}${plinthSide}Z` },
    { c: PAL.ochre, o: 0.8, d: plaque },
    { c: PAL.ochre, o: 0.28, d: ribcage },
    { c: PAL.ochre, o: 0.5, d: `${band}${hip}${shoulder}${skull}${nearLegs.join('')}${feet}` },
    { c: PAL.grey, o: 0.4, d: `${farLegs.join('')}${farFeet}${band}` },
    { c: PAL.ochre, o: 0.85, d: `${postWash}${knobs}${bases}` },
    { c: PAL.red, o: 0.85, d: ropeWash },
    { c: PAL.slate, o: 0.55, d: holes },
  ],
  lines: paths([skull, ...nearLegs, hip, shoulder, ribs, `${plinthTop}`, plinthFront, plinthSide, rope, ropeLow, knobs, bases, posts]),
  fine: paths([vertebrae, ...farLegs, feet, farFeet, toes, hipBones, jaw, teeth, holes, plaque, 'M188 250l24 0M190 254l18 0', ropeTwist]),
  once: `<path d="${spines}${chevrons}"/>`,
};
