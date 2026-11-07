import { PAL, hatch, paths, rng, tufts } from '../lib.mjs';

// The Lion and the Mouse, 3: WHOOSH! A rope net drops from a branch, and the lion looks up, startled.
const f1 = (n) => Math.round(n * 10) / 10;

/** A shaggy mane: a closed loop of curly bumps around (cx, cy) (as on the cover). */
function mane(cx, cy, rx, ry, n, bump, seed) {
  const r = rng(seed);
  const pt = (a, k) => [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
  let d = '';
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const [x, y] = pt(a, 1 + (r() - 0.5) * 0.08);
    if (i === 0) d += `M${f1(x)} ${f1(y)}`;
    else {
      const am = ((i - 0.5) / n) * Math.PI * 2;
      const [qx, qy] = pt(am, 1 + bump * (0.8 + r() * 0.5));
      d += `Q${f1(qx)} ${f1(qy)} ${f1(x)} ${f1(y)}`;
    }
  }
  return d + 'Z';
}

/**
 * Moves a part drawn in the cover's coordinates: (ox, oy) goes to (x, y), turned by deg and scaled by
 * (sx, sy) (a negative sx mirrors it). t is the SVG transform, for washes; line() bakes the same move into
 * path data, so the ink keeps the book's line weight at every display size; at() moves one point.
 */
function place(x, y, deg, sx, sy, ox, oy) {
  const r = (deg * Math.PI) / 180;
  const [a, b, c, d] = [Math.cos(r) * sx, Math.sin(r) * sx, -Math.sin(r) * sy, Math.cos(r) * sy];
  const [e, f] = [x - a * ox - c * oy, y - b * ox - d * oy];
  const at = (px, py) => [f1(a * px + c * py + e), f1(b * px + d * py + f)];
  const line = (path) => {
    if (/[AHSTVahstv]/.test(path)) throw new Error(`place() only moves M L C Q Z paths: ${path}`);
    return path.replace(/([MLCQmlcq])([^MLCQZmlcqz]*)/g, (_, cmd, args) => {
      const n = args.match(/-?(?:\d+\.?\d*|\.\d+)/g).map(Number);
      const rel = cmd === cmd.toLowerCase();
      const pts = [];
      for (let i = 0; i < n.length; i += 2) pts.push((rel ? [f1(a * n[i] + c * n[i + 1]), f1(b * n[i] + d * n[i + 1])] : at(n[i], n[i + 1])).join(' '));
      return cmd + pts.join(' ');
    });
  };
  return { t: `translate(${x} ${y}) rotate(${deg}) scale(${sx} ${sy}) translate(${-ox} ${-oy})`, at, line };
}

// The lion's head, drawn in the cover's coordinates (centred on 196,150), tipped back to look up.
const H = place(250, 186, -10, 0.64, 0.64, 196, 150);
// The cover's mane, puffed up in fright (same seed, bigger bumps), with hairs standing on end.
const maneOut = mane(196, 150, 74, 70, 17, 0.34, 4);
const maneCurls = (() => {
  const r = rng(9);
  let d = '';
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + 0.2;
    const x = 196 + Math.cos(a) * 56;
    const y = 150 + Math.sin(a) * 53;
    const s = 5 + r() * 3;
    d += `M${f1(x)} ${f1(y)}q${f1(Math.cos(a) * s - Math.sin(a) * s)} ${f1(Math.sin(a) * s + Math.cos(a) * s)} ${f1(Math.cos(a) * s * 1.6)} ${f1(Math.sin(a) * s * 1.6)}`;
  }
  return d;
})();
const bristles = (() => {
  const r = rng(12);
  let d = '';
  for (let i = 0; i < 13; i++) {
    const a = ((196 + i * 12.5 + (r() - 0.5) * 5) * Math.PI) / 180;
    const r1 = 94 + r() * 4;
    const r2 = r1 + 10 + r() * 6;
    d += `M${f1(196 + Math.cos(a) * r1)} ${f1(150 + Math.sin(a) * r1 * 0.95)}L${f1(196 + Math.cos(a) * r2)} ${f1(150 + Math.sin(a) * r2 * 0.95)}`;
  }
  return d;
})();
const face = 'M164 140C162 118 180 106 197 106C216 106 232 118 230 140C230 166 220 194 197 196C174 194 164 166 164 140Z';
const ears = 'M166 112C160 100 168 90 178 96M228 112C234 100 226 90 216 96';
const brows = 'M172 125C176 120 182 119 188 121M206 121C212 119 218 120 222 125';
// Wide-open eyes, looking straight up at the net.
const eyes = 'M174 142C174 130 191 130 191 142C191 154 174 154 174 142ZM203 142C203 130 220 130 220 142C220 154 203 154 203 142Z';
const nose = 'M186 160C186 153 208 153 208 160C208 168 200 174 197 174C194 174 186 168 186 160Z';
const mouth = 'M197 174L197 178M190 186C190 179 204 179 204 186C204 193 190 193 190 186Z';
const whiskers = 'M178 172l-14-6M178 177l-14 0M216 172l14-6M216 177l14 0';

// Standing body, facing right (this picture's own coordinates), kept as round and simple as on the cover.
const back = 'M204 157C176 151 140 151 114 158C94 164 84 182 88 200C90 216 92 236 94 250';
const thigh = 'M96 190C110 184 124 192 126 206C126 222 122 238 120 250';
const belly = 'M126 226C154 233 190 233 222 226';
const legs = 'M133 230L133 252M151 230L151 252M189 231L189 252M207 230L207 252M222 226L222 251';
const pawsNear = 'M88 262C86 252 92 245 103 245C115 245 121 252 120 262ZM218 262C216 251 222 244 234 244C246 244 252 251 251 262ZM99 255l0 7M107 254l0 8M230 254l0 8M238 254l0 8';
const pawsFar = 'M128 262C126 253 132 247 142 247C152 247 157 253 156 262ZM184 262C182 253 188 247 198 247C208 247 213 253 212 262Z';
// The far legs, a shade deeper, so they read as behind.
const farLegs = 'M133 229L151 229L156 262L128 262ZM189 229L207 229L212 262L184 262Z';
const bodyWash =
  'M112 158C140 150 190 150 222 160C238 168 246 186 246 204C246 214 244 222 238 226C210 232 160 234 128 228C100 222 86 206 86 188C86 174 96 164 112 158Z' +
  'M92 200L124 206L120 262L88 262ZM133 222L151 222L156 262L128 262ZM189 222L207 222L212 262L184 262ZM222 214L250 214L251 262L218 262Z';
// The cover's tail, standing up in alarm at the back.
const T = place(40, -42, 0, 1, 1, 0, 0);
const tail = 'M48 232C24 228 14 208 24 192C28 186 36 186 38 192';
const tailTuft = 'M38 192C42 184 34 176 28 180C22 184 24 192 30 194Z';

// The tree it fell from: a leafy branch reaching in from the right.
/** An almond leaf of length 14s from its stalk at (x, y), pointing at deg degrees. */
function leaf(x, y, s, deg) {
  const a = (deg * Math.PI) / 180;
  const p = (u, v) => `${f1(x + (Math.cos(a) * u - Math.sin(a) * v) * s)} ${f1(y + (Math.sin(a) * u + Math.cos(a) * v) * s)}`;
  return `M${x} ${y}C${p(4, -5)} ${p(10, -5)} ${p(14, 0)}C${p(10, 5)} ${p(4, 5)} ${x} ${y}Z`;
}
const branch = 'M398 10C356 12 306 14 258 20C218 25 184 27 150 28M398 28C356 29 312 31 270 34C230 37 190 33 150 28M300 16C294 10 286 8 278 8M230 35C226 40 220 43 212 44';
const branchWash = 'M398 10C356 12 306 14 258 20C218 25 184 27 150 28C190 33 230 37 270 34C312 31 356 29 398 28Z';
const leaves = [
  leaf(152, 28, 1.2, 170), leaf(170, 27, 1.2, -130), leaf(190, 31, 1.3, 60), leaf(212, 44, 1, 120), leaf(240, 23, 1.1, -110),
  leaf(262, 34, 1.3, 100), leaf(278, 8, 1, -170), leaf(298, 32, 1.3, 50), leaf(320, 15, 1.1, -70), leaf(340, 30, 1.3, 115),
  leaf(366, 28, 1.2, 70), leaf(376, 12, 1, -40),
];
// Leaves shaken loose, tumbling down beside the net.
const falling = [leaf(46, 78, 1.1, -20), leaf(334, 104, 1.1, 30), leaf(352, 162, 0.9, 160)];

// The net from the cover: the same rope dome, in mid-air and about to land on him.
const domeEdge = 'M92 112C88 76 144 56 202 56C260 56 316 76 312 112';
const rim = 'M92 112C130 118 168 106 204 112C240 118 280 106 312 112';
const dome = 'M92 112C88 76 144 56 202 56C260 56 316 76 312 112C280 106 240 118 204 112C168 106 130 118 92 112Z';
const net = (() => {
  let d = '';
  for (let k = -300; k <= 400; k += 32) {
    d += `M${k} 300L${k + 300} 0`;
    d += `M${k + 160} 300L${k - 140} 0`;
  }
  return d;
})();
const ropeEnds = 'M104 114l-2 9M150 111l1 8M196 111l-1 9M244 114l2 8M292 109l1 9';
// WHOOSH: speed arcs trailing above it and swishes at its sides.
const whoosh =
  'M146 52C166 45 186 43 202 43M222 44C236 45 248 48 258 52M126 58C118 62 112 66 106 72' +
  'M82 106C74 90 76 74 86 60M72 100C66 88 68 78 74 68M322 106C330 90 328 74 318 60M332 100C338 88 336 78 330 68';

const [lx, ly] = H.at(182.5, 136);
const [rx, ry] = H.at(211.5, 136);
const eyeWhite = (cx, cy) => {
  const [x, y] = H.at(cx, cy);
  return `M${f1(x - 5)} ${y}a5 7 0 1 0 10 0a5 7 0 1 0 -10 0Z`;
};

export default {
  title: 'Whoosh! A net falls on the lion',
  seed: 63,
  washes: [
    { c: PAL.green, o: 0.4, d: 'M14 252C90 248 200 254 290 250C330 248 360 252 386 249L386 266C330 271 240 264 160 270C90 273 44 266 14 268Z' },
    { c: PAL.ochre, o: 0.5, d: branchWash },
    { c: PAL.green, o: 0.62, d: leaves.join('') + falling.join('') },
    { c: PAL.ochre, o: 0.55, d: bodyWash },
    { c: PAL.ochre, o: 0.3, d: farLegs },
    { c: PAL.ochre, o: 0.55, t: T.t, d: 'M48 232C26 228 16 210 24 194C28 188 34 188 36 194L40 200C34 210 40 224 52 228Z' },
    { c: PAL.terracotta, o: 0.7, t: H.t, d: maneOut },
    { c: PAL.ochre, o: 0.7, t: H.t, d: 'M166 140C164 120 180 108 197 108C214 108 230 120 228 140C228 164 220 192 197 194C176 192 166 166 166 140Z' },
    { c: PAL.terracotta, o: 0.75, t: H.t, d: nose },
    { c: PAL.terracotta, o: 0.75, t: T.t, d: tailTuft },
    { c: PAL.red, o: 0.55, t: H.t, d: 'M191 186C191 181 203 181 203 186C203 191 191 191 191 186Z' },
  ],
  whites: eyeWhite(182.5, 142) + eyeWhite(211.5, 142),
  lines:
    paths([back, pawsNear, pawsFar, domeEdge, rim, branch]) +
    paths([tail, tailTuft].map(T.line)) +
    paths([maneOut, face, ears, eyes, nose].map(H.line)),
  fine:
    paths([thigh, belly, legs, ropeEnds, whoosh, ...leaves, ...falling, hatch(60, 264, 150, 264, 9, 6, 160, 3), hatch(262, 266, 350, 266, 7, 6, 160, 4), tufts([[24, 256], [170, 258], [372, 254], [300, 258]], 9, 6)]) +
    paths([maneCurls, bristles, brows, mouth, whiskers].map(H.line)),
  once: `<g clip-path="url(#netclip3)" opacity="0.75" stroke-width="1.3"><path d="${net}"/></g>`,
  defsExtra: `<clipPath id="netclip3"><path d="${dome}"/></clipPath>`,
  fills: `<circle cx="${lx}" cy="${ly}" r="2.2"/><circle cx="${rx}" cy="${ry}" r="2.2"/>`,
  glints: `<circle cx="${f1(lx + 0.6)}" cy="${f1(ly - 0.7)}" r="0.7"/><circle cx="${f1(rx + 0.6)}" cy="${f1(ry - 0.7)}" r="0.7"/>`,
};
