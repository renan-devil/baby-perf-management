import { PAL, hatch, paths, rays, tufts } from '../lib.mjs';

// The crow sits down beside the pitcher, wing tip to her beak, and thinks very hard,
// looking at the pebbles on the path. (No pebble in her beak yet: the child guesses what comes next.)
const f1 = (n) => Math.round(n * 10) / 10;
/** Moves every absolute "x y" pair of a path through f (the cover's crow and pitcher paths are all absolute). */
const xf = (d, f) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (m, x, y) => f(+x, +y).map(f1).join(' '));
const pt = (p) => `${f1(p[0])} ${f1(p[1])}`;

const ground = 'M14 252C90 248 190 255 386 249';

// The pitcher, exactly as on the cover, moved a little to the right.
const PX = 28;
const P = (x, y) => [x + PX, y];
const pitcher =
  'M238 101C240 108 244 112 244 118C245 126 243 132 238 138C222 152 206 166 206 194C206 220 222 236 232 243L230 252L294 252L292 243C302 236 318 220 318 194C318 166 302 152 286 138C281 132 279 126 280 118C280 112 284 108 286 101';
const rim = 'M238 101C238 96 286 96 286 101C286 106 238 106 238 101Z';
const handle = 'M283 121C316 108 342 134 318 170M286 132C306 125 322 140 311 160';
const band = 'M209 172Q262 186 315 172M207 186Q262 201 317 186';
const zigzag = 'M214 179L222 184L230 179L238 185L246 180L254 186L262 181L270 186L278 180L286 185L294 179L302 184L310 178';
const pitcherWash =
  pitcher.replace(/(\d+) (\d+)/g, (m, x, y) => `${+x + 3} ${+y - 2}`) + 'Z M222 200C220 182 228 168 236 166C240 178 236 196 228 210C224 212 222 206 222 200Z';
const handleWash = 'M286 124C312 112 336 132 321 166L311 160C318 142 306 128 288 133Z';

// The crow's head from the cover, tilted down about her neck and set on a sitting body.
const crowHead = 'M147 121C152 108 168 106 177 118M145 146C138 137 139 127 147 121M170 149C164 153 152 153 145 146';
const beak = 'M177 118C191 113 204 113 214 117M177 137C190 133 203 126 213 120M178 128L203 121';
const tuft = 'M151 112L147 102M157 109L157 98M163 109L168 100';
const brow = 'M160 117L169 113';
const eyeWhite = 'M161 126C161 119 172 119 172 126C172 132 161 132 161 126Z';
const headSil = 'M142 148C136 136 138 124 146 116C156 104 176 108 180 122C184 136 178 150 170 152';
const beakSil = 'M178 117C192 112 206 112 214 117L212 122C200 128 188 134 178 136Z';

const ANG = 42; // head tilt, degrees
const NECK = [140, 152]; // where the cover's neck point (157,148) goes
const c = Math.cos((ANG * Math.PI) / 180);
const s = Math.sin((ANG * Math.PI) / 180);
const H = (x, y) => [NECK[0] + c * (x - 157) - s * (y - 148), NECK[1] + s * (x - 157) + c * (y - 148)];

const neckBack = H(145, 146);
const throat = H(170, 149);
const headStart = H(142, 148);

// Sitting body: back down to the tail on the path, belly on the ground, round chest up to the throat.
const back = `M${pt(neckBack)}C118 150 98 178 96 206C95 216 96 222 98 228`;
const tail = 'M98 228L56 228L47 238L60 237L53 247L68 243L68 251L84 245L100 246';
const belly = 'M100 246C118 252 146 252 160 246';
const chest = `M${pt(throat)}C162 168 170 180 172 192`;
const bodySil = `C${pt(throat)} ${pt(throat)} ${pt(throat)}C162 168 172 184 175 204C178 226 172 240 160 247C146 253 118 253 100 247L68 252L46 238L56 227L97 227C94 218 94 210 96 202C98 176 118 150 ${pt(headStart)}Z`;

// The near wing, bent like an arm in front of her chest, feather tips touching under her beak.
const wing =
  'M122 172C140 166 160 178 168 196L170 172L166 164L174 167L175 157L181 165L185 156L187 168L189 172C192 190 194 206 186 214C176 222 158 218 140 210C122 202 112 182 122 172Z';
const wingInk = 'M124 174C140 170 156 180 164 196C168 200 172 196 172 172';

const pebbles = [
  [190, 247, 6, 4.5],
  [204, 252, 7, 5],
  [220, 246, 5, 3.8],
  [233, 254, 6, 4.2],
  [247, 248, 4.5, 3.4],
  [338, 254, 6, 4.2],
  [360, 249, 4.5, 3.4],
  [26, 255, 5, 3.6],
];
const pebblePaths = pebbles
  .map(([x, y, rx, ry]) => `M${x - rx} ${y}C${x - rx} ${y - ry * 1.3} ${x + rx} ${y - ry * 1.4} ${x + rx} ${y}C${x + rx} ${y + ry * 1.1} ${x - rx} ${y + ry * 1.1} ${x - rx} ${y}Z`)
  .join('');

// Scribbly "thinking" swirls above her head.
const swirl = (cx, cy, r, turns, a0) => {
  const n = Math.round(turns * 16);
  let d = '';
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = a0 + t * turns * 2 * Math.PI;
    const rr = r * (0.12 + 0.88 * t);
    d += `${i ? 'L' : 'M'}${f1(cx + Math.cos(a) * rr)} ${f1(cy + Math.sin(a) * rr * 0.85)}`;
  }
  return d;
};
const swirls = [swirl(142, 88, 8, 2.2, 0), swirl(172, 70, 10, 2.4, 2), swirl(204, 84, 7, 2, 4)];

const SUN = [346, 50];
const sun = `M${SUN[0] - 24} ${SUN[1]}C${SUN[0] - 24} ${SUN[1] - 14} ${SUN[0] - 12} ${SUN[1] - 24} ${SUN[0] + 1} ${SUN[1] - 24}C${SUN[0] + 14} ${SUN[1] - 24} ${SUN[0] + 24} ${SUN[1] - 13} ${SUN[0] + 24} ${SUN[1]}C${SUN[0] + 24} ${SUN[1] + 14} ${SUN[0] + 13} ${SUN[1] + 24} ${SUN[0]} ${SUN[1] + 24}C${SUN[0] - 13} ${SUN[1] + 24} ${SUN[0] - 24} ${SUN[1] + 13} ${SUN[0] - 24} ${SUN[1]}Z`;
const sunWash = `M${SUN[0] - 26} ${SUN[1] + 2}C${SUN[0] - 28} ${SUN[1] - 18} ${SUN[0] - 8} ${SUN[1] - 28} ${SUN[0] + 6} ${SUN[1] - 25}C${SUN[0] + 22} ${SUN[1] - 20} ${SUN[0] + 30} ${SUN[1] - 6} ${SUN[0] + 24} ${SUN[1] + 10}C${SUN[0] + 18} ${SUN[1] + 24} ${SUN[0] - 2} ${SUN[1] + 30} ${SUN[0] - 14} ${SUN[1] + 22}C${SUN[0] - 22} ${SUN[1] + 17} ${SUN[0] - 25} ${SUN[1] + 10} ${SUN[0] - 26} ${SUN[1] + 2}Z`;

const eye = H(166.5, 126);
const pupil = [eye[0] + 1, eye[1] + 1.9];

export default {
  title: 'The crow sits and thinks',
  seed: 11,
  washes: [
    { c: PAL.ochre, o: 0.75, d: sunWash },
    { c: PAL.ochre, o: 0.4, d: 'M8 246C40 240 70 246 110 242C170 238 230 246 300 241C340 238 370 244 394 240L394 258C360 266 330 258 290 263C230 270 160 260 110 266C70 270 40 262 8 264Z' },
    { c: PAL.terracotta, o: 0.78, d: xf(pitcherWash, P), rule: 'evenodd' },
    { c: PAL.terracotta, o: 0.45, d: xf(handleWash, P) },
    { c: PAL.slate, o: 0.85, d: xf(headSil, H) + bodySil },
    { c: PAL.ink, o: 0.5, d: xf(headSil, H) + bodySil },
    { c: PAL.ink, o: 0.35, d: wing },
    { c: PAL.grey, o: 0.7, d: xf(beakSil, H) + pebblePaths },
    { c: PAL.green, o: 0.55, d: 'M20 252C24 244 34 242 40 250ZM330 250C334 240 346 240 352 249ZM366 249C369 243 377 243 380 248Z' },
  ],
  whites: xf(eyeWhite, H),
  lines: paths([ground, ...[pitcher, rim, handle].map((d) => xf(d, P)), xf(crowHead, H), xf(beak, H), back, tail, belly, chest, wing, sun, ...swirls]),
  fine: paths([
    xf(band, P),
    xf(zigzag, P),
    xf(tuft, H),
    xf(brow, H),
    pebblePaths,
    'M136 186l4 4l3-5M150 198l4 3l3-5M176 196l4 3l3-5M110 206l5 3l2-5M118 226l5 3l2-5',
    hatch(298 + PX, 150, 312 + PX, 230, 9, 9, 120, 4),
    hatch(290, 256, 330, 256, 7, 7, 160, 5),
    hatch(30, 258, 150, 260, 10, 6, 160, 6),
    rays(SUN[0], SUN[1], 31, 43, 12, 7),
    tufts([[28, 251], [340, 249], [372, 249], [176, 252]], 9, 8),
  ]),
  fills: `<circle cx="${f1(pupil[0])}" cy="${f1(pupil[1])}" r="3.2"/>`,
  glints: `<circle cx="${f1(pupil[0] + 1.3)}" cy="${f1(pupil[1] - 1.2)}" r="1.1"/>`,
};
