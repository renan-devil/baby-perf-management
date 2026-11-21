// Climb a tree: a big tree with a rope ladder on its low branch, a child in a red hat waving from it, a bird in its nest.
import { PAL, hatch, paths, rng, tufts } from '../story-pictures/lib.mjs';

const f = (n) => Math.round(n * 10) / 10;

/** A smooth closed curve through the points (Catmull-Rom turned into cubic Béziers). */
function loop(pts) {
  const n = pts.length;
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [pts[(i - 1 + n) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return `${d}Z`;
}

/** A slightly uneven hand-drawn circle. */
function ring(cx, cy, r, seed = 1, wob = 0.05, n = 10) {
  const R = rng(seed);
  return loop(
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * 2 * Math.PI;
      const k = r * (1 + (R() - 0.5) * wob);
      return [cx + Math.cos(a) * k, cy + Math.sin(a) * k];
    }),
  );
}

/**
 * A leafy, scalloped outline through points given clockwise; each stretch bulges outwards. When open,
 * the last stretch (back to the first point) is left out.
 */
function cloud(pts, bulge = 0.42, open = false) {
  const n = pts.length;
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < (open ? n - 1 : n); i++) {
    const [p, q] = [pts[i], pts[(i + 1) % n]];
    const [dx, dy] = [q[0] - p[0], q[1] - p[1]];
    const L = Math.hypot(dx, dy);
    const [nx, ny] = [(dy / L) * L * bulge, (-dx / L) * L * bulge];
    d += `C${f(p[0] + dx * 0.05 + nx)} ${f(p[1] + dy * 0.05 + ny)} ${f(p[0] + dx * 0.95 + nx)} ${f(p[1] + dy * 0.95 + ny)} ${f(q[0])} ${f(q[1])}`;
  }
  return open ? d : `${d}Z`;
}

const GY = 262; // ground

// The crown: a broad, round cloud of leaves, open at the bottom where the trunk goes in.
const crownPts = [
  [164, 100], [130, 102], [94, 102], [58, 96], [40, 70], [52, 44], [84, 26], [126, 16], [176, 14], [224, 16], [266, 26],
  [300, 42], [324, 64], [320, 84], [290, 90], [258, 86], [226, 90], [196, 98],
];
const crown = cloud(crownPts, 0.3, true);
const crownWash = cloud(crownPts.map(([x, y]) => [x + 2, y + 2]), 0.26);
const crownShade = 'M70 92C76 76 104 70 126 80C146 72 174 78 180 92C170 102 140 104 120 100C100 104 78 102 70 92Z' +
  'M210 82C220 66 252 64 270 74C288 70 306 78 304 86C290 92 262 90 244 90C228 92 214 90 210 82Z';

// The trunk, with roots and the limbs that disappear into the leaves.
const trunk = `M146 ${GY}C156 248 160 226 160 198C160 168 158 136 162 102M214 ${GY}C204 248 200 228 200 204C200 172 202 136 196 100`;
const roots = `M146 ${GY}C138 ${GY + 2} 128 ${GY + 2} 120 ${GY}M214 ${GY}C222 ${GY + 2} 234 ${GY + 3} 244 ${GY}M168 ${GY}C170 254 174 252 178 254`;
const trunkWash = `M146 ${GY}C156 248 160 226 160 198C160 168 158 136 162 104C172 96 186 96 196 102C202 136 200 172 200 204C200 228 204 248 214 ${GY}Z`;
const limbs = 'M166 100C156 84 140 70 122 62M192 98C204 80 222 66 244 58M180 100C180 84 182 68 186 50';
const bark = 'M172 236c3-8 3-16 0-22M188 206c-3-7-3-14 0-20M174 168c3-6 3-12 0-18M186 136c-2-5-2-10 0-14';
const knot = 'M178 186C174 186 172 180 176 178C180 176 184 182 178 186Z';

// The sturdy low branch, reaching out to the right.
const branch = 'M199 182C236 174 292 168 348 160C355 161 356 170 348 172C294 182 240 196 200 208';
const branchWash = 'M199 182C236 174 292 168 348 160C355 161 356 170 348 172C294 182 240 196 200 208Z';
const branchEnd = cloud([[338, 158], [342, 144], [358, 138], [374, 146], [374, 162], [360, 170], [346, 170]], 0.4);
const twig = 'M330 164C336 154 342 148 350 146';

// The rope ladder, tied round the branch.
const ropes = 'M291 184C290 206 292 230 290 256M318 180C318 204 320 230 318 256';
const ties = 'M286 171C283 178 285 185 291 186C296 185 297 176 294 170M313 167C310 174 312 181 318 182C323 181 324 172 321 166';
const rungs = [201, 219, 237, 254].map((y) => `M283 ${y}L327 ${y - 1}C329 ${y + 1} 329 ${y + 5} 327 ${y + 6}L283 ${y + 7}C281 ${y + 5} 281 ${y + 2} 283 ${y}Z`).join('');

// Leaves on the branch, and the child peeping over them.
const clumpPts = [[226, 176], [222, 164], [232, 156], [250, 154], [268, 155], [282, 160], [286, 172], [270, 180], [248, 182]];
const clump = cloud(clumpPts, 0.3);
const hat = 'M236 134C234 116 262 114 262 134Z';
const brim = 'M233 133C242 131 254 131 265 133L265 139C254 137 242 137 233 139Z';
const bobble = ring(249, 116, 5.5, 61);
const face = 'M236 139C234 144 234 147 235 150M262 139C264 144 264 147 263 150';
const arm = 'M276 157C280 148 282 140 284 134M284 159C288 150 290 142 292 136';
const hand = 'M282 134C278 128 280 120 284 120L285 114C286 112 288 112 288 114L289 118L291 113C292 111 294 111 294 113L293 120L296 116C298 115 299 117 298 119L294 130C292 136 286 138 282 134Z';
const wave = 'M302 110c4 4 5 10 3 15M308 105c6 6 7 14 4 22M276 114c-3 4-3 9-1 13';

// The bird's nest, on a little twig on the left.
const twigL = 'M160 188C140 180 120 174 98 173C96 175 97 177 99 178C120 180 140 186 160 196';
const twigWash = 'M160 188C140 180 120 174 98 173C96 175 97 177 99 178C120 180 140 186 160 196Z';
const twigBits = 'M126 177C122 170 116 166 110 164';
const nest = 'M70 166C72 184 110 186 114 166C104 170 82 170 70 166Z';
const straws = 'M72 168C82 174 100 174 112 168M74 174C86 178 98 178 110 174M80 180l6-9M90 182l4-10M100 182l2-10M108 176l-4-8M66 168l8 2M116 166l-6 3';
const birdBody = 'M78 166C76 152 86 144 96 146C104 148 110 156 108 166';
const birdHead = 'M80 154C78 146 84 140 90 140C96 140 100 146 98 152';
const beak = 'M80 148L72 150L80 153';
const wing = 'M94 154C100 154 106 158 106 164';

export default {
  title: 'Climb a tree',
  seed: 83,
  washes: [
    { c: PAL.green, o: 0.4, d: `M0 ${GY - 4}C80 ${GY - 6} 160 ${GY - 2} 240 ${GY - 5}C310 ${GY - 7} 360 ${GY - 4} 400 ${GY - 6}L400 288C320 296 240 284 160 292C90 298 40 288 0 294Z` },
    { c: PAL.ochre, o: 0.5, d: trunkWash + branchWash + twigWash },
    { c: PAL.terracotta, o: 0.3, d: `M148 ${GY}C158 246 162 226 162 198C162 170 160 140 164 106L176 106C174 140 176 172 176 200C176 228 172 248 170 ${GY}Z` + 'M200 198C240 188 294 176 346 168L348 172C294 182 240 196 200 208Z' },
    { c: PAL.green, o: 0.62, d: crownWash },
    { c: PAL.green, o: 0.38, d: crownShade },
    { c: PAL.green, o: 0.66, d: cloud(clumpPts.map(([x, y]) => [x + 1, y + 1]), 0.32) + branchEnd },
    { c: PAL.terracotta, o: 0.75, d: rungs },
    { c: PAL.red, o: 0.85, d: hat + brim },
    { c: PAL.rose, o: 0.5, d: 'M236 139C242 138 256 138 262 139C264 144 264 148 263 152C254 150 244 150 235 152C234 147 234 142 236 139Z' + hand },
    { c: PAL.sky, o: 0.6, d: 'M276 157C280 148 282 140 284 134L292 136C290 142 288 150 284 159Z' },
    { c: PAL.ochre, o: 0.75, d: nest },
    { c: PAL.terracotta, o: 0.35, d: nest },
    { c: PAL.sky, o: 0.7, d: 'M78 166C76 154 80 148 84 144C82 140 88 138 92 140C98 140 100 146 98 150C104 152 110 158 108 166Z' },
    { c: PAL.ochre, o: 0.9, d: beak },
  ],
  lines: paths([`M0 ${GY + 1}C80 ${GY - 1} 160 ${GY + 3} 240 ${GY}C310 ${GY - 2} 360 ${GY + 1} 400 ${GY - 1}`, crown, trunk, roots, branch, ropes, rungs, clump, hat, brim, bobble, twigL, nest]),
  fine: paths([
    limbs,
    bark,
    knot,
    twig,
    branchEnd,
    ties,
    face,
    arm,
    hand,
    wave,
    twigBits,
    straws,
    birdBody,
    birdHead,
    beak,
    wing,
    hatch(70, 50, 120, 86, 6, 9, 125, 11),
    hatch(250, 40, 300, 70, 5, 9, 125, 12),
    'M100 34c3-5 8-5 10 0M160 22c3-5 8-5 10 0M220 30c3-5 8-5 10 0M276 52c3-5 8-5 10 0M140 54c3-5 8-5 10 0',
    'M234 168c3-4 7-4 9 0M262 166c3-4 7-4 9 0M354 152c3-4 7-4 9 0',
    hatch(14, 278, 390, 280, 12, 7, 165, 5),
    tufts([[24, GY + 1], [110, GY + 1], [254, GY], [300, GY], [352, GY], [390, GY - 1]], 9, 4),
  ]),
  fills: '<circle cx="243" cy="144" r="2"/><circle cx="255" cy="144" r="2"/><circle cx="85" cy="147" r="1.6"/>',
  glints: '<circle cx="243.6" cy="143.3" r="0.6"/><circle cx="255.6" cy="143.3" r="0.6"/>',
};
