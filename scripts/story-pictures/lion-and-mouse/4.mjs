import { PAL, paths, rng } from '../lib.mjs';

// The Lion and the Mouse, 4: the little mouse runs as fast as she can through the tall golden grass,
// towards a tiny lion caught in a net far away.
const f1 = (n) => Math.round(n * 10) / 10;

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

// The mouse, drawn in the cover's coordinates (facing left, as on the cover) and mirrored to run right.
const M = place(202, 188, 4, -1.25, 1.25, 370, 216);
const head = 'M342 210C344 194 330 184 316 188C306 191 300 198 295 206C304 212 316 216 330 216C336 216 340 214 342 210Z';
const ear = 'M332 192C322 172 344 160 352 176C355 186 348 194 338 194';
const earInner = 'M336 186C331 176 343 170 347 178C349 185 343 189 336 186Z';
const noseTip = 'M293 205C292 201 298 201 298 205C298 208 293 208 293 205Z';
const whiskers = 'M300 203l-9-5M299 207l-11-1M300 211l-9 4';
const smile = 'M303 212C306 215 310 215 313 213';
const brow = 'M304 193C308 190 313 189 318 190';
// Stretched out at full speed: front paws reaching forward, back paws kicking out behind.
const body = 'M334 214C338 196 366 190 390 196C410 202 416 220 406 231C394 240 362 241 346 235C337 231 332 223 334 214Z';
const legs =
  'M344 226C336 232 328 238 321 240C317 242 319 247 323 246C332 244 342 238 352 232Z' +
  'M352 232C348 240 343 246 337 250C334 253 337 257 341 255C348 250 354 243 359 236Z' +
  'M394 228C402 234 411 238 421 239C425 240 426 244 422 245C411 246 400 242 388 236Z' +
  'M384 236C388 243 393 249 399 253C402 256 399 259 395 257C388 254 382 247 377 240Z';
// The same legs as open strokes for the ink, so no line crosses her tummy.
const legLines = legs.replace(/Z/g, '');
const feet = 'M321 239C316 239 313 242 314 245C316 248 321 247 323 245ZM337 249C332 250 330 254 332 256C334 258 339 257 340 254ZM421 238C426 238 429 241 428 244C426 247 421 246 420 244ZM399 252C404 253 406 257 404 259C402 261 397 260 396 257Z';
const tail = 'M408 212C428 198 442 224 460 208C474 196 486 200 500 188';

// Speed lines and puffs of dust behind her.
const speed = 'M140 200L94 200M130 213L84 213M140 226L104 226M126 186L104 186';
const dust = 'M118 250C114 244 120 238 126 241C128 236 136 236 137 242C142 242 143 248 138 250ZM90 252C88 248 92 245 96 247C98 244 103 245 103 249C105 251 102 253 99 253Z';

// Far away on a little hill: a tiny lion caught in a net, roaring for help.
const hill = 'M262 126C296 114 340 112 394 120';
const tinyMane = 'M343 96C350 95 355 101 354 108C353 114 347 117 341 116C334 115 331 109 332 103C333 99 337 96 343 96Z';
const tinyFace = 'M343 102C345 102 347 104 347 107C347 110 345 112 343 112C341 112 339 110 339 107C339 104 341 102 343 102Z';
const tinyBack = 'M333 110C326 104 312 104 306 112';
const tinyBody = tinyBack + 'L306 118L332 118Z';
const tinyDome = 'M300 120C300 100 316 88 336 88C354 88 362 102 360 120';
const tinyClip = tinyDome + 'Z';
const tinyNet = (() => {
  let d = '';
  for (let k = 200; k <= 460; k += 9) d += `M${k} 160L${k - 80} 80M${k - 160} 160L${k - 80} 80`;
  return d;
})();
/** A short arc of a circle around (cx, cy) from angle a0 to a1 (degrees). */
const arc = (cx, cy, rr, a0, a1) => {
  const r = Math.PI / 180;
  const k = 1 / Math.cos(((a1 - a0) / 2) * r);
  const p = (a, m = 1) => `${f1(cx + Math.cos(a * r) * rr * m)} ${f1(cy + Math.sin(a * r) * rr * m)}`;
  return `M${p(a0)}Q${p((a0 + a1) / 2, k)} ${p(a1)}`;
};
// His roar spreading out across the grass.
const roar = arc(343, 106, 40, 205, 245) + arc(343, 106, 50, 208, 242) + arc(343, 106, 60, 211, 239);

/** A tuft of grass blades fanning up from (bx, by), with their ink and a thin golden wash. */
function tuft(bx, by, n, h, spread, seed) {
  const r = rng(seed);
  let wash = '';
  let ink = '';
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0 : i / (n - 1) - 0.5;
    const len = h * (0.75 + r() * 0.35);
    const lean = t * spread + (r() - 0.5) * 8;
    const x = bx + t * 10;
    const tx = x + lean;
    const ty = by - len;
    const cx = x + lean * 0.15;
    const cy = by - len * 0.65;
    ink += `M${f1(x)} ${by}Q${f1(cx)} ${f1(cy)} ${f1(tx)} ${f1(ty)}`;
    wash += `M${f1(x - 2.5)} ${by}Q${f1(cx - 2)} ${f1(cy)} ${f1(tx)} ${f1(ty)}Q${f1(cx + 2.5)} ${f1(cy)} ${f1(x + 2.5)} ${by}Z`;
  }
  return { wash, ink };
}
// Tall golden grass framing her on both sides, low where she runs.
const tufts = [
  tuft(32, 272, 6, 118, 40, 1), tuft(66, 272, 5, 64, 40, 2), tuft(100, 272, 4, 40, 36, 3),
  tuft(140, 272, 3, 28, 30, 4), tuft(196, 272, 3, 24, 30, 5), tuft(250, 272, 3, 30, 30, 6),
  tuft(300, 272, 4, 70, 40, 7), tuft(334, 272, 6, 118, 50, 8), tuft(368, 272, 5, 100, 40, 9),
];

const [ex, ey] = M.at(312, 198);

export default {
  title: 'The little mouse runs through the tall grass',
  seed: 74,
  washes: [
    { c: PAL.ochre, o: 0.42, d: 'M4 252C90 247 200 254 290 249C330 247 360 251 396 248L396 276L4 276Z' },
    { c: PAL.ochre, o: 0.6, d: tufts.map((t) => t.wash).join('') },
    { c: PAL.green, o: 0.38, d: 'M262 126C296 114 340 112 394 120L394 130C350 125 300 128 262 132Z' },
    { c: PAL.ochre, o: 0.65, d: tinyBody + tinyFace },
    { c: PAL.terracotta, o: 0.75, d: tinyMane },
    { c: PAL.grey, o: 0.75, t: M.t, d: body + head + legs + 'M332 192C322 172 344 160 352 176C355 186 348 194 338 194Z' },
    { c: PAL.rose, o: 0.65, t: M.t, d: earInner + noseTip + feet },
  ],
  lines: paths([body, head, ear, tail].map(M.line)) + paths([hill, tinyMane]),
  fine: paths([whiskers, smile, brow, legLines].map(M.line)) + paths([speed, dust, roar, tinyDome, tinyBack, ...tufts.map((t) => t.ink)]),
  once: `<g clip-path="url(#tinynet)" opacity="0.6" stroke-width="0.9"><path d="${tinyNet}"/></g>`,
  defsExtra: `<clipPath id="tinynet"><path d="${tinyClip}"/></clipPath>`,
  fills: `<circle cx="${ex}" cy="${ey}" r="3"/>`,
  glints: `<circle cx="${f1(ex + 1)}" cy="${f1(ey - 1.1)}" r="1"/>`,
};
