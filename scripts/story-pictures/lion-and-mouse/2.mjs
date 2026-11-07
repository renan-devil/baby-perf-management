import { PAL, hatch, paths, rng, tufts } from '../lib.mjs';

// The Lion and the Mouse, 2: Lion sits up roaring with laughter, the little Mouse dangling by her tail from his claws.
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

// The lion's head, drawn in the cover's coordinates (centred on 196,150), tipped back as he laughs.
const H = place(172, 112, -7, 0.82, 0.82, 196, 150);
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
// Laughing: the jaw drops, so the face is a little longer than on the cover.
const face = 'M164 140C162 118 180 106 197 106C216 106 232 118 230 140C231 168 224 204 197 208C170 204 163 168 164 140Z';
const faceWash = 'M166 140C164 120 180 108 197 108C214 108 230 120 228 140C229 166 222 201 197 206C172 201 165 166 166 140Z';
const ears = 'M166 112C160 100 168 90 178 96M228 112C234 100 226 90 216 96';
const brows = 'M172 125C177 120 183 119 189 122M205 122C211 119 217 120 222 125';
const eyesShut = 'M174 134C180 137 185 140 189 143C185 146 180 148 174 151M220 134C214 137 209 140 205 143C209 146 214 148 220 151';
const nose = 'M186 160C186 153 208 153 208 160C208 168 200 174 197 174C194 174 186 168 186 160Z';
const mouth = 'M197 174L197 179M177 180C186 186 208 186 217 180C216 195 208 203 197 203C186 203 178 195 177 180Z';
const mouthWash = 'M179 182C188 187 206 187 215 182C214 194 207 201 197 201C187 201 180 194 179 182Z';
const tongue = 'M187 198C190 192 204 192 207 198';
const whiskers = 'M177 170l-13-3M177 176l-13 2M217 170l13-3M217 176l13 2';

// Sitting body, facing right (this picture's own coordinates): haunch on the left, one front leg
// planted, the other raised with a bent elbow, the paw up beside his head.
const back = 'M126 166C98 174 76 200 74 228C73 246 80 256 94 258L190 258';
const thigh = 'M94 210C120 198 150 212 154 244';
const rearPaw = 'M122 258C120 247 128 239 140 239C154 239 160 247 158 258ZM134 251l0 7M143 250l0 8';
const leg = 'M196 198C192 218 192 236 194 248M232 200C228 214 226 232 224 250';
const frontPaw = 'M190 258C188 247 194 239 206 239C219 239 226 247 224 258ZM202 251l0 7M211 250l0 8';
const arm = 'M232 200C242 200 252 202 262 206C272 210 282 206 286 196C292 176 296 150 298 126M232 168C242 172 252 178 258 182C260 162 264 140 270 122';
const paw = 'M270 122C262 108 268 88 286 85C300 83 313 92 314 106C315 116 308 124 298 126';
const toes = 'M299 86l-2 8M309 94l-7 4';
// Two claws pinch the very tip of her tail.
const claws = '<path d="M311 99C317 95 324 96 328 101C323 100 317 100 312 103Z"/><path d="M310 111C316 113 323 111 327 106C322 108 316 109 311 107Z"/>';
const bodyWash = 'M126 166C98 174 76 200 74 228C73 246 80 256 94 258L224 258C226 236 228 214 232 200C242 200 252 202 262 206C272 210 282 206 286 196C292 176 296 150 298 126C308 124 315 116 314 106C313 92 300 83 286 85C268 88 262 108 270 122C264 140 260 162 258 182C252 178 242 172 232 168C200 160 150 160 126 166Z';
// The tail lies along the ground and curls up at the end, with the cover's tuft.
const tail = 'M82 254C62 260 42 256 36 244C32 236 36 228 44 229';
const tailTuft = 'M44 229C50 222 46 213 39 214C32 216 32 225 38 230Z';

// The cover's mouse, tipped up so she looks up at him, dangling by her tail with her feet in the air.
const M = place(330, 190, 20, 0.85, 0.85, 338, 234);
const mouseBody = 'M318 252C306 236 316 214 338 212C360 214 370 236 358 252C352 262 324 262 318 252Z';
const mouseHead = 'M342 210C344 194 330 184 316 188C306 191 300 198 295 206C304 212 316 216 330 216C336 216 340 214 342 210Z';
const mouseEar = 'M332 192C324 176 344 166 350 180C353 188 346 194 338 194';
const mouseFace = 'M300 203l-9-5M299 207l-11-1M300 211l-9 4';
const mouseBrow = 'M305 191C308 188 312 187 316 189';
const mouseFeet = 'M322 258C320 264 320 270 324 271C328 272 330 266 329 259ZM345 259C345 266 347 271 351 271C355 271 355 265 352 258Z';
// Paws pressed together under her chin: please, Mr Lion!
const mouseArms = 'M322 225C318 225 314 224 311 222M324 232C319 233 314 231 310 228';
const mousePaws = 'M300 218C301 213 307 212 310 216C312 220 312 226 309 229C305 231 301 228 300 224C299 222 299 220 300 218ZM304 215L307 229';
// Her tail loops up from her bottom to his claws.
const [tx, ty] = M.at(358, 251);
const mouseTail = `M${tx} ${ty}C${f1(tx + 16)} ${f1(ty + 2)} ${f1(tx + 28)} ${f1(ty - 12)} ${f1(tx + 28)} ${f1(ty - 38)}C${f1(tx + 28)} ${f1(ty - 64)} 352 110 327 103`;
const [ex, ey] = M.at(311, 199);

/** A short arc of the ellipse (cx, cy, rx, ry) from angle a0 to a1 (degrees). */
const arc = (cx, cy, rx, ry, a0, a1) => {
  const r = Math.PI / 180;
  const k = 1 / Math.cos(((a1 - a0) / 2) * r);
  const p = (a, s = 1) => `${f1(cx + Math.cos(a * r) * rx * s)} ${f1(cy + Math.sin(a * r) * ry * s)}`;
  return `M${p(a0)}Q${p((a0 + a1) / 2, k)} ${p(a1)}`;
};
// Shaking with laughter: little arcs hugging his mane and his tummy.
const shakes =
  arc(172, 112, 86, 82, 150, 172) + arc(172, 112, 95, 91, 154, 168) +
  arc(172, 112, 86, 82, 192, 212) + arc(172, 112, 95, 91, 195, 209) +
  arc(172, 112, 86, 82, 300, 318) + arc(172, 112, 95, 91, 303, 315) +
  arc(112, 222, 48, 44, 160, 182) + arc(112, 222, 57, 52, 163, 179);

export default {
  title: 'The lion laughs at the little mouse',
  seed: 52,
  washes: [
    { c: PAL.green, o: 0.4, d: 'M18 252C90 248 200 254 290 250C330 248 360 252 384 249L384 266C330 271 240 264 160 270C90 273 44 266 18 268Z' },
    { c: PAL.ochre, o: 0.55, d: bodyWash },
    { c: PAL.ochre, o: 0.55, d: 'M84 252C62 258 44 254 38 244C35 237 37 232 42 230L44 236C44 244 56 250 82 248Z' },
    { c: PAL.terracotta, o: 0.7, t: H.t, d: maneOut },
    { c: PAL.ochre, o: 0.7, t: H.t, d: faceWash },
    { c: PAL.terracotta, o: 0.75, t: H.t, d: nose },
    { c: PAL.terracotta, o: 0.75, d: tailTuft },
    { c: PAL.red, o: 0.6, t: H.t, d: mouthWash },
    { c: PAL.grey, o: 0.75, t: M.t, d: mouseBody + mouseHead + 'M332 192C324 176 344 166 350 180C353 188 346 194 338 194Z' },
    { c: PAL.rose, o: 0.6, t: M.t, d: 'M336 188C332 180 342 176 345 182C347 188 342 191 336 188ZM293 205C292 201 298 201 298 205C298 208 293 208 293 205Z' + mousePaws + mouseFeet },
  ],
  lines:
    paths([back, rearPaw, frontPaw, leg, arm, paw]) +
    paths([tail, tailTuft]) +
    paths([maneOut, face, ears, nose, mouth].map(H.line)) +
    paths([mouseBody, mouseHead, mouseEar].map(M.line)) +
    paths([mouseTail]),
  fine:
    paths([thigh, toes, shakes, hatch(70, 264, 160, 264, 9, 6, 160, 3), hatch(250, 266, 330, 266, 7, 6, 160, 4), tufts([[26, 256], [250, 257], [372, 254], [300, 258]], 9, 6)]) +
    paths([maneCurls, brows, eyesShut, tongue, whiskers].map(H.line)) +
    paths([mouseFace, mouseBrow, mouseFeet, mouseArms, mousePaws].map(M.line)),
  fills: `<circle cx="${ex}" cy="${ey}" r="2.7"/>` + claws,
  glints: `<circle cx="${f1(ex - 0.9)}" cy="${f1(ey - 1)}" r="0.9"/>`,
};
