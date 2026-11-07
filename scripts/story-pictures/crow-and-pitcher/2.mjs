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
const NECK = [140, 154]; // where the cover's neck point (157,148) goes
const c = Math.cos((ANG * Math.PI) / 180);
const s = Math.sin((ANG * Math.PI) / 180);
const H = (x, y) => [NECK[0] + c * (x - 157) - s * (y - 148), NECK[1] + s * (x - 157) + c * (y - 148)];

const neckBack = H(145, 146);
const throat = H(170, 149);
const headStart = H(142, 148);

// Sitting body: back down to the tail on the path, belly on the ground, round chest up to the throat.
const back = `M${pt(neckBack)}C120 152 108 176 107 200C106 212 107 220 109 228`;
const tail = 'M109 228C96 228 80 227 64 224L53 232L67 234L57 243L73 241L70 250L87 245L108 246';
const belly = 'M108 246C124 252 150 253 164 247';
const chest = `M${pt(throat)}C156 166 163 172 168 180`;
const bodySil = `C158 168 166 178 170 192C176 214 176 236 164 247C148 254 122 254 106 247L88 246L70 251L56 243L52 232L64 223L108 227C107 216 107 206 108 198C109 176 121 154 ${pt(headStart)}Z`;

// The near wing, bent like an arm in front of her chest, its feather tips touching under her beak.
const wing =
  'M120 177C138 172 156 184 166 200C166 192 167 184 168 178L166 164L172 172L175 166L179 173L183 168L186 177C190 188 194 206 188 216C180 226 160 222 140 213C122 204 112 188 120 177Z';

const pebbles = [
  [196, 248, 7, 5],
  [212, 254, 8.5, 5.8],
  [227, 246, 6.5, 4.6],
  [241, 255, 6, 4.4],
  [252, 248, 5, 3.8],
  [222, 251, 4, 3],
  [184, 255, 4.5, 3.3],
  [342, 255, 6, 4.2],
  [364, 250, 5, 3.6],
  [30, 256, 5.5, 3.8],
  [14, 251, 3.5, 2.8],
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

// The cover's sun, nudged up and right to make room for the pitcher's handle.
const S = (x, y) => [x + 8, y - 8];
const sun = 'M314 58C314 44 326 34 339 34C352 34 362 45 362 58C362 72 351 82 338 82C325 82 314 71 314 58Z';
const sunWash = 'M312 60C310 40 330 30 344 33C360 38 368 52 362 68C356 82 336 88 324 80C316 75 313 68 312 60Z';

const eye = H(166.5, 126);
const pupil = [eye[0] + 1, eye[1] + 1.9];

export default {
  title: 'The crow thinks very hard',
  seed: 11,
  washes: [
    { c: PAL.ochre, o: 0.75, d: xf(sunWash, S) },
    { c: PAL.ochre, o: 0.4, d: 'M8 246C40 240 70 246 110 242C170 238 230 246 300 241C340 238 370 244 394 240L394 258C360 266 330 258 290 263C230 270 160 260 110 266C70 270 40 262 8 264Z' },
    { c: PAL.terracotta, o: 0.78, d: xf(pitcherWash, P), rule: 'evenodd' },
    { c: PAL.terracotta, o: 0.45, d: xf(handleWash, P) },
    { c: PAL.slate, o: 0.85, d: xf(headSil, H) + bodySil + wing },
    { c: PAL.ink, o: 0.5, d: xf(headSil, H) + bodySil + wing },
    { c: PAL.ink, o: 0.35, d: wing },
    { c: PAL.grey, o: 0.7, d: xf(beakSil, H) + pebblePaths },
    { c: PAL.green, o: 0.55, d: 'M20 252C24 244 34 242 40 250ZM330 250C334 240 346 240 352 249ZM366 249C369 243 377 243 380 248Z' },
  ],
  whites: xf(eyeWhite, H),
  lines: paths([ground, ...[pitcher, rim, handle].map((d) => xf(d, P)), xf(crowHead, H), xf(beak, H), back, tail, belly, chest, wing, xf(sun, S), ...swirls]),
  fine: paths([
    xf(band, P),
    xf(zigzag, P),
    xf(tuft, H),
    xf(brow, H),
    pebblePaths,
    'M132 186l4 4l3-5M147 198l4 3l3-5M176 190l4 3l3-5M176 204l4 3l3-5M116 210l5 3l2-5M124 230l5 3l2-5',
    hatch(298 + PX, 150, 312 + PX, 230, 9, 9, 120, 4),
    hatch(290, 256, 330, 256, 7, 7, 160, 5),
    hatch(30, 258, 150, 260, 10, 6, 160, 6),
    rays(346, 50, 31, 44, 12, 7),
    tufts([[28, 251], [340, 249], [372, 249], [176, 252]], 9, 8),
  ]),
  fills: `<circle cx="${f1(pupil[0])}" cy="${f1(pupil[1])}" r="3.2"/>`,
  glints: `<circle cx="${f1(pupil[0] + 1.3)}" cy="${f1(pupil[1] - 1.2)}" r="1.1"/>`,
};
