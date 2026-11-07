import { PAL, hatch, paths, rays, rng, tufts } from '../lib.mjs';

// The North Wind gives up and the Sun shines gently: the traveller rests under a little tree,
// wiping his forehead, his red cloak and green hat on the grass beside him. The Wind sulks in the corner.
const f1 = (n) => Math.round(n * 10) / 10;
/** Moves every absolute "x y" pair of a path through f (the cover paths used here are all absolute). */
const xf = (d, f) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (m, x, y) => f(+x, +y).map(f1).join(' '));
const pt = (p) => `${f1(p[0])} ${f1(p[1])}`;

// The cover's ground line, from where the cloak ends (the cloak and hat lie in front of it).
const ground = 'M8 258C18 257.5 28 257.2 38 257M175.9 256.8C232.7 257 302.3 256.7 392 254';

// The Sun, exactly as on the cover.
const sun = 'M318 56C318 41 330 30 345 30C360 30 372 42 372 56C372 71 360 82 345 82C330 82 318 71 318 56Z';
const sunFace = 'M332 53Q336 47 340 53M351 53Q355 47 359 53M335 66Q346 76 357 66';

// The North Wind: the cover's cloud, shrunk and sagging, in the top-left corner.
const cloud =
  'M38 92C26 74 44 52 64 58C68 38 98 30 112 46C128 34 152 44 150 64C166 70 164 94 146 98C138 112 112 112 102 104C88 114 60 112 54 100C44 102 34 98 38 92Z';
const cloudWash1 = 'M36 88C28 70 46 56 64 62C70 44 98 38 112 52C126 42 148 50 146 68C160 74 158 92 142 96C134 108 112 108 102 100C88 110 62 108 56 98C46 100 40 94 36 88Z';
const cloudWash2 = 'M44 96C36 82 52 66 70 70C80 56 104 54 116 66C130 60 146 70 140 86C132 100 112 100 100 94C86 104 60 104 44 96Z';
const W = (x, y) => {
  const t = (y - 30) / 84;
  return [8 + 0.5 * (x - 26), 16 + 0.34 * (y - 30) + 5 * t * t * Math.sin((Math.PI * (x - 26)) / 140)];
};
const windBrows = 'M52 26L59 28M65 28L72 26';
const windLids = 'M52 31.5Q55.5 30 59 31.5M65 31.5Q68.5 30 72 31.5';
const windMouth = 'M58 41Q62.5 37.5 67 41';
const puffs = 'M77 42c0-2.8 4.4-2.8 4.4 0c0 2.8-4.4 2.8-4.4 0zM85.5 37.5c0-2 3-2 3 0c0 2-3 2-3 0z';
const windDrop = 'M23 16C21 20 19 23 20 25C21 28 26 28 26 25C27 23 25 20 23 16Z';

// A small leafy tree.
const scallop = (cx, cy, rx, ry, n, depth, seed) => {
  const r = rng(seed);
  const p = [];
  for (let i = 0; i < n; i++) {
    const a = ((i + (r() - 0.5) * 0.3) / n) * 2 * Math.PI;
    const k = 1 + (r() - 0.5) * 0.1;
    p.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  let d = `M${pt(p[0])}`;
  for (let i = 0; i < n; i++) {
    const a = p[i];
    const b = p[(i + 1) % n];
    const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    let nx = (b[1] - a[1]) / len;
    let ny = -(b[0] - a[0]) / len;
    if (nx * (m[0] - cx) + ny * (m[1] - cy) < 0) [nx, ny] = [-nx, -ny];
    d += `Q${pt([m[0] + nx * len * depth, m[1] + ny * len * depth])} ${pt(b)}`;
  }
  return d + 'Z';
};
const crown = scallop(158, 76, 58, 34, 10, 0.4, 5);
const trunk = 'M158 242C159 214 157 170 162 112M175 242C175 210 176 172 171 112';
const branches = 'M164 126C155 116 145 110 133 106M170 122C179 112 191 106 203 104M167 114L167 92';
const bark = 'M164 214c3 6 3 12 0 18M169 160c-3 6-3 12 0 16';
const leafMarks = 'M116 70q3 3.5 6 0q3 3.5 6 0M148 56q3 3.5 6 0q3 3.5 6 0M184 66q3 3.5 6 0q3 3.5 6 0M134 92q3 3.5 6 0q3 3.5 6 0';

// The traveller: the cover's head, turned to face the sun, on a new, lanky sitting body.
const head = 'M214 138C224 136 230 146 228 156C226 166 216 170 209 165C203 160 203 148 206 143C208 140 211 139 214 138Z';
const nose = 'M206 147C200 148 193 152 191 157C189 162 195 165 200 163C203 162 205 160 207 158';
const ear = 'M227 150C231 150 231 157 227 157';
const hair = 'M222 139L229 133M226 143L235 141M219 137L222 130';
const hairWash = 'M220 136C228 132 236 136 238 146C232 146 228 142 222 142Z';
const skinWash = 'M212 138C222 136 230 146 228 156C226 166 214 170 208 164C204 162 194 166 190 160C192 152 200 148 206 146C206 142 208 139 212 138Z';
const HC = [204, 148];
const HA = (-10 * Math.PI) / 180;
const HK = 1.6;
const HM = (x, y) => {
  const u = -(x - 216) * HK;
  const v = (y - 152) * HK;
  return [HC[0] + u * Math.cos(HA) - v * Math.sin(HA), HC[1] + u * Math.sin(HA) + v * Math.cos(HA)];
};
const [ex, ey] = HM(213.6, 146.6);
const eye = `M${f1(ex - 2)} ${f1(ey + 2.2)}Q${f1(ex + 2)} ${f1(ey - 3)} ${f1(ex + 6)} ${f1(ey + 2.2)}`;
const smile = 'M206 160Q213 168 221 162';
const cheek = 'M195 151C195 146 203 146 203 151C203 156 195 156 195 151Z';

// Far arm: hand and hanky pressed to his forehead, elbow poking out behind his head.
const farArm = 'M178 166C172 162 170 154 176 150C180 148 184 150 186 153M181 170C186 178 192 184 196 190';
const farArmWash = 'M186 153C182 148 172 150 172 158C172 164 178 170 182 172C186 180 190 186 196 190L200 184C196 178 192 172 188 166Z';
const hand = 'M217 128C217 121 226 118 231 122C234 125 233 130 229 133L222 136C219 135 217 132 217 128ZM226 121L230 116';
const hanky = 'M224 120C228 114 234 110 240 111C243 116 244 121 242 126C246 131 247 138 244 145C240 141 235 138 231 136C228 132 225 126 224 120Z';
const hankyDots = 'M235 116l0.1 0M239 122l0.1 0M240 131l0.1 0M235 128l0.1 0M242 139l0.1 0';
const sweat = 'M250 110C248 105 253 105 252 110C252 112 250 112 250 110ZM256 124C254 119 259 119 258 124C258 126 256 126 256 124Z';

// Body, near arm resting on the raised knee, long legs.
const neck = 'M199 171L198 190M208 176L209 190';
const shirtWash = 'M188 196C192 188 204 186 212 188C220 191 222 204 222 222C222 236 221 246 220 254L188 255C185 236 184 212 188 196Z';
const shirt = 'M188 196C192 188 204 186 212 188C216 189 219 193 220 199M188 196C185 214 185 236 187 255M222 230C222 240 221 248 220 254';
const nearArm = 'M207 196C214 208 220 220 227 228C237 221 247 213 256 207M215 192C220 202 226 210 230 214C238 208 245 202 252 197';
const nearArmWash = 'M203 197C210 210 218 222 226 229C236 222 246 214 256 207L252 196C244 202 237 208 230 214C224 206 219 198 214 190Z';
const nearHand = 'M252 197C258 192 267 195 269 201C271 206 271 212 268 216C265 217 263 213 264 209C260 208 256 206 254 205Z';
const nearFingers = 'M266 209l1 5';
const nearLeg = 'M212 246L252 204C256 199 264 200 266 206L278 250L269 252L258 214L222 254';
const farLeg = 'M229 246L263 246M280 247L312 248M296 255L312 256';
const shoes = 'M269 251L290 253C295 254 294 259 287 259L268 258ZM312 247L332 250C337 252 336 257 328 257L312 256Z';

// His red cloak, dropped in a heap at the foot of the tree right beside him; his green hat next to it.
const cloak = 'M148 258C150 248 145 238 135 234C127 231 118 233 112 238C104 236 96 240 91 246C79 246 66 248 56 250C48 251 42 254 44 259C50 262 58 261 64 263C70 261 76 264 84 262C104 263 126 262 148 258Z';
const collar = 'M122 235C127 230 137 230 141 236M137 236C141 240 143 245 142 250M132 237C134 242 134 247 132 250';
const cloakFolds = 'M112 240C108 247 107 254 109 261M91 247C82 252 70 256 58 258M100 244C97 250 95 256 97 262M124 238C121 246 121 253 124 260';
const lining = 'M112 239C118 241 124 244 128 250C122 251 116 248 112 239Z';
const T = (x, y) => [x - 206, y + 154]; // the cover's hat, set down on the grass
const C = (x, y) => [x + 30, y]; // the cloak lies along the foot of the tree
const hat = 'M250 92C250 80 268 76 276 86C280 92 278 96 288 100C278 104 254 104 242 98C246 96 248 94 250 92Z';
const hatBand = 'M250 92C258 94 270 94 277 91';

export default {
  title: 'The traveller rests in the sunshine',
  seed: 21,
  washes: [
    { c: PAL.slate, o: 0.5, d: xf(cloudWash1, W) },
    { c: PAL.sky, o: 0.45, d: xf(cloudWash2, W) + windDrop + sweat },
    { c: PAL.rose, o: 0.55, d: 'M329 64C327 58 335 57 336 63C336 68 330 69 329 64ZM356 64C355 58 363 57 364 63C364 68 357 69 356 64Z' + cheek },
    { c: PAL.ochre, o: 0.82, d: 'M316 54C314 38 332 26 348 30C364 34 376 48 372 62C368 78 352 88 336 84C324 80 317 68 316 54Z' },
    { c: PAL.ochre, o: 0.22, d: 'M302 56C300 28 328 14 354 20C384 28 394 56 382 78C370 98 340 102 320 90C308 82 302 70 302 56Z' },
    { c: PAL.green, o: 0.68, d: crown },
    { c: PAL.green, o: 0.35, d: 'M122 84C130 68 158 62 180 68C198 74 202 88 190 96C172 104 134 102 122 84Z' },
    { c: PAL.ochre, o: 0.55, d: 'M158 246C159 220 158 172 163 114L170 114C174 172 174 220 175 246Z' },
    { c: PAL.red, o: 0.82, d: xf(cloak, C) },
    { c: PAL.rose, o: 0.5, d: xf(lining, C) },
    { c: PAL.sky, o: 0.5, d: shirtWash + farArmWash + nearArmWash },
    { c: PAL.rose, o: 0.45, d: xf(skinWash, HM) + hand + nearHand },
    { c: PAL.ochre, o: 0.55, d: xf(hairWash, HM) },
    { c: PAL.slate, o: 0.6, d: 'M212 246L252 204C256 199 264 200 266 206L278 250L269 252L258 214L222 254ZM263 246L312 248L312 256L268 256Z' + shoes },
    { c: PAL.green, o: 0.72, d: xf(hat, T) },
    { c: PAL.green, o: 0.45, d: 'M6 252C60 246 120 252 180 249C240 246 320 252 394 247L394 268C330 274 250 266 180 270C110 274 50 266 6 268Z' },
  ],
  whites: hanky,
  lines:
    paths([xf(cloud, W), sun, crown, trunk, branches, xf(cloak, C), xf(hat, T), ground, farLeg, nearLeg, shoes, shirt, farArm, hand, hanky, nearArm, nearHand]) +
    paths([xf(head, HM), xf(nose, HM)]),
  fine: paths([
    windBrows,
    windLids,
    windMouth,
    puffs,
    windDrop,
    sunFace,
    rays(345, 56, 33, 47, 14, 9, 8),
    bark,
    leafMarks,
    hatch(170, 92, 206, 106, 6, 9, 125, 11),
    hatch(108, 80, 128, 98, 4, 8, 125, 12),
    xf(collar, C),
    xf(cloakFolds, C),
    xf(lining, C),
    xf(hatBand, T),
    xf(ear, HM),
    xf(hair, HM),
    eye,
    smile,
    neck,
    sweat,
    'M224 129l6-1',
    hatch(150, 266, 290, 265, 10, 6, 160, 3),
    hatch(300, 263, 386, 260, 7, 6, 160, 4),
    hatch(40, 271, 160, 272, 9, 6, 160, 6),
    nearFingers,
    tufts([[236, 258], [346, 256], [378, 255]], 9, 5),
  ]),
  once: `<path d="${hankyDots}" stroke-width="2.4"/><path d="M312 84Q290 98 272 112M322 94Q306 116 296 138M302 70Q280 76 262 86" stroke-dasharray="0.1 7" stroke-width="2.6"/>`,
  fills: '<circle cx="55.5" cy="32.8" r="1.4"/><circle cx="68.5" cy="32.8" r="1.4"/>',
};
