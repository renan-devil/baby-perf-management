import { PAL, hatch, paths, rays, rng, tufts } from '../lib.mjs';

// The Lion and the Mouse, 5: best friends. The lion lies happily in the grass with the little mouse
// sitting on the very top of his head, like a little crown.
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

// The lion exactly as on the cover, lying down, but mirrored (free now, facing the other way) and a
// little smaller, so there is room for the mouse on top. Drawn in the cover's coordinates.
const L = place(160, 164, 0, -0.84, 0.84, 196, 150);
const maneOut = mane(196, 150, 74, 70, 17, 0.22, 4);
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
const face = 'M164 140C162 118 180 106 197 106C216 106 232 118 230 140C230 166 220 194 197 196C174 194 164 166 164 140Z';
const ears = 'M166 112C160 100 168 90 178 96M228 112C234 100 226 90 216 96';
// Content: eyes softly closed, a happy smile.
const brows = 'M172 131C176 128 182 127 188 129M206 129C212 127 218 128 222 131';
const eyes = 'M175 141C178 148 186 148 189 141M205 141C208 148 216 148 219 141';
const nose = 'M186 160C186 153 208 153 208 160C208 168 200 174 197 174C194 174 186 168 186 160Z';
const mouth = 'M197 174L197 180M180 182C186 191 194 189 197 180C200 189 208 191 214 182';
const whiskers = 'M178 176l-12-2M178 181l-12 3M216 176l12-2M216 181l12 3';
const body = 'M136 192C112 182 86 184 66 198C46 212 40 236 46 255M46 255L150 255';
const paws =
  'M150 255C146 244 150 232 162 230C176 230 182 240 180 255ZM196 255C194 242 200 232 212 232C226 232 230 244 228 255ZM158 248l0 7M166 247l0 8M206 248l0 7M214 247l0 8';
const tail = 'M48 232C24 228 14 208 24 192C28 186 36 186 38 192';
const tailTuft = 'M38 192C42 184 34 176 28 180C22 184 24 192 30 194Z';

// The cover's mouse, sitting on the very top of his mane, eyes closed and smiling too.
const MO = place(168, 87, 0, 0.8, 0.8, 338, 234);
const mouseBody = 'M318 256C308 236 318 214 338 212C358 214 366 236 356 256Z';
const mouseHead = 'M342 210C344 194 330 184 316 188C306 191 300 198 295 206C304 212 316 216 330 216C336 216 340 214 342 210Z';
const mouseEar = 'M332 192C324 176 344 166 350 180C353 188 346 194 338 194';
const mouseTail = 'M356 250C372 254 384 248 384 262C384 272 374 276 368 270';
const mouseArm = 'M326 226C322 232 322 238 328 242';
const mouseFace = 'M300 203l-9-5M299 207l-11-1M300 211l-9 4';
const mouseEye = 'M307 197C309 201 314 201 316 197';
const mouseSmile = 'M302 212C305 215 309 215 312 213';

/** A little five-petal flower on a stem, its head at (x, y). */
function flower(x, y, s, h) {
  let petals = '';
  for (let i = 0; i < 5; i++) {
    const a = ((i * 72 - 90) * Math.PI) / 180;
    const px = x + Math.cos(a) * 4.6 * s;
    const py = y + Math.sin(a) * 4.6 * s;
    petals += `M${f1(px - 3.4 * s)} ${f1(py)}a${f1(3.4 * s)} ${f1(3.4 * s)} 0 1 0 ${f1(6.8 * s)} 0a${f1(3.4 * s)} ${f1(3.4 * s)} 0 1 0 ${f1(-6.8 * s)} 0Z`;
  }
  const centre = `M${f1(x - 2.2 * s)} ${y}a${f1(2.2 * s)} ${f1(2.2 * s)} 0 1 0 ${f1(4.4 * s)} 0a${f1(2.2 * s)} ${f1(2.2 * s)} 0 1 0 ${f1(-4.4 * s)} 0Z`;
  const stem = `M${x} ${f1(y + 7 * s)}C${f1(x - 2)} ${f1(y + h * 0.5)} ${f1(x + 2)} ${f1(y + h * 0.8)} ${x} ${f1(y + h)}M${x} ${f1(y + h * 0.6)}c4 -2 7 -1 9 -5`;
  return { petals, centre, stem };
}
const flowers = [flower(44, 226, 1.1, 30), flower(72, 238, 0.9, 18), flower(342, 230, 1, 26), flower(372, 222, 1.15, 34), flower(318, 244, 0.8, 12)];
const petalsBy = (idx) => idx.map((i) => flowers[i].petals).join('');

// Two little twinkles, as if she were a crown.
const twinkles = 'M112 34l0 12M106 40l12 0M109 37l6 6M115 37l-6 6M212 44l0 10M207 49l10 0';

// A warm sun in the corner.
const sun = 'M346 52C346 40 366 40 366 52C366 64 346 64 346 52Z';

export default {
  title: 'The lion and the mouse are best friends',
  seed: 85,
  washes: [
    { c: PAL.green, o: 0.4, d: 'M8 250C80 246 200 252 300 248C340 246 370 250 392 246L392 266C340 272 240 264 160 270C90 274 40 266 8 268Z' },
    { c: PAL.ochre, o: 0.55, t: L.t, d: 'M136 194C112 184 86 186 66 200C46 214 40 236 46 255L240 254C246 230 236 206 216 196C196 186 166 190 136 194ZM48 232C26 228 16 210 24 194C28 188 34 188 36 194L40 200C34 210 40 224 52 228Z' },
    { c: PAL.terracotta, o: 0.7, t: L.t, d: maneOut },
    { c: PAL.ochre, o: 0.7, t: L.t, d: 'M166 140C164 120 180 108 197 108C214 108 230 120 228 140C228 164 220 192 197 194C176 192 166 166 166 140Z' },
    { c: PAL.terracotta, o: 0.75, t: L.t, d: tailTuft + nose },
    { c: PAL.rose, o: 0.45, t: L.t, d: 'M170 160C170 154 180 154 180 160C180 166 170 166 170 160ZM214 160C214 154 224 154 224 160C224 166 214 166 214 160Z' },
    { c: PAL.grey, o: 0.75, t: MO.t, d: mouseBody + mouseHead + 'M332 192C324 176 344 166 350 180C353 188 346 194 338 194Z' },
    { c: PAL.rose, o: 0.6, t: MO.t, d: 'M336 188C332 180 342 176 345 182C347 188 342 191 336 188ZM293 205C292 201 298 201 298 205C298 208 293 208 293 205Z' },
    { c: PAL.rose, o: 0.7, d: petalsBy([0, 3]) },
    { c: PAL.sky, o: 0.7, d: petalsBy([1, 4]) },
    { c: PAL.red, o: 0.6, d: petalsBy([2]) },
    { c: PAL.ochre, o: 0.7, d: flowers.map((f) => f.centre).join('') + sun },
  ],
  lines:
    paths([body, tail, tailTuft, maneOut, face, ears, nose, paws].map(L.line)) +
    paths([mouseBody, mouseHead, mouseEar, mouseTail].map(MO.line)) +
    paths([sun]),
  fine:
    paths([maneCurls, brows, eyes, mouth, whiskers].map(L.line)) +
    paths([mouseArm, mouseFace, mouseEye, mouseSmile].map(MO.line)) +
    paths([
      ...flowers.map((f) => f.petals + f.stem),
      rays(356, 52, 17, 27, 11, 5, 8),
      twinkles,
      hatch(150, 262, 250, 262, 9, 6, 160, 3),
      hatch(20, 264, 90, 264, 6, 6, 160, 4),
      tufts([[14, 254], [110, 256], [300, 254], [386, 252]], 9, 6),
    ]),
};
