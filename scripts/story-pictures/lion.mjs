import { PAL, hatch, paths, rng, tufts } from './lib.mjs';

// The Lion and the Mouse: a worried lion under a rope net, a small mouse gnawing a rope free.
const f1 = (n) => Math.round(n * 10) / 10;

/** A shaggy mane: a closed loop of curly bumps around (cx, cy). */
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
const brows = 'M171 133L188 125M206 125L223 133';
const eyes = 'M176 142C176 133 189 133 189 142C189 151 176 151 176 142ZM205 142C205 133 218 133 218 142C218 151 205 151 205 142Z';
const nose = 'M186 160C186 153 208 153 208 160C208 168 200 174 197 174C194 174 186 168 186 160Z';
const mouth = 'M197 174L197 181M183 186C189 192 195 187 197 181C199 187 205 192 211 186';
const whiskers = 'M178 176l-12-2M178 181l-12 3M216 176l12-2M216 181l12 3';

const body = 'M136 192C112 182 86 184 66 198C46 212 40 236 46 255M46 255L150 255';
const paws =
  'M150 255C146 244 150 232 162 230C176 230 182 240 180 255ZM196 255C194 242 200 232 212 232C226 232 230 244 228 255ZM158 248l0 7M166 247l0 8M206 248l0 7M214 247l0 8';
const tail = 'M48 232C24 228 14 208 24 192C28 186 36 186 38 192';
const tailTuft = 'M38 192C42 184 34 176 28 180C22 184 24 192 30 194Z';

// Rope net draped over the lion: a diagonal grid clipped to a dome.
const dome = 'M24 256C26 150 86 66 194 64C292 64 300 180 288 256Z';
const net = (() => {
  let d = '';
  for (let k = -300; k <= 400; k += 34) {
    d += `M${k} 300L${k + 300} 0`;
    d += `M${k + 160} 300L${k - 140} 0`;
  }
  return d;
})();
const domeEdge = 'M24 256C26 150 86 66 194 64C292 64 300 180 288 256';

// The mouse at the net's edge, gnawing through one of its ropes
const mouseBody = 'M318 256C308 236 318 214 338 212C358 214 366 236 356 256Z';
const mouseHead = 'M342 210C344 194 330 184 316 188C306 191 300 198 295 206C304 212 316 216 330 216C336 216 340 214 342 210Z';
const mouseEar = 'M332 192C324 176 344 166 350 180C353 188 346 194 338 194';
const mouseTail = 'M356 250C372 254 384 242 378 232C374 226 366 232 370 238';
const mouseArms = 'M320 224C314 220 308 216 304 210M324 230C316 228 308 222 303 216';
const mouseFace = 'M300 203l-9-5M299 207l-11-1M300 211l-9 4';
const broken = 'M291 214C296 220 300 226 302 234M302 234l-3 4M302 234l4 3M302 234l1 5';
const snap = 'M284 196l-6-6M290 192l0-9M297 194l6-7M282 204l-8 0';

export default {
  title: 'The Lion and the Mouse',
  seed: 41,
  washes: [
    { c: PAL.green, o: 0.4, d: 'M4 250C80 246 200 252 300 248C340 246 370 250 396 246L396 266C340 272 240 264 160 270C90 274 40 266 4 268Z' },
    { c: PAL.ochre, o: 0.55, d: 'M136 194C112 184 86 186 66 200C46 214 40 236 46 255L240 254C246 230 236 206 216 196C196 186 166 190 136 194ZM48 232C26 228 16 210 24 194C28 188 34 188 36 194L40 200C34 210 40 224 52 228Z' },
    { c: PAL.terracotta, o: 0.7, d: maneOut },
    { c: PAL.ochre, o: 0.7, d: 'M166 140C164 120 180 108 197 108C214 108 230 120 228 140C228 164 220 192 197 194C176 192 166 166 166 140Z' },
    { c: PAL.terracotta, o: 0.75, d: tailTuft + 'M186 160C186 153 208 153 208 160C208 168 200 174 197 174C194 174 186 168 186 160Z' },
    { c: PAL.grey, o: 0.75, d: 'M318 256C308 236 318 214 338 212C358 214 366 236 356 256ZM342 210C344 194 330 184 316 188C306 191 300 198 295 206C304 212 316 216 330 216C336 216 340 214 342 210ZM332 192C324 176 344 166 350 180C353 188 346 194 338 194Z' },
    { c: PAL.rose, o: 0.6, d: 'M336 188C332 180 342 176 345 182C347 188 342 191 336 188ZM293 205C292 201 298 201 298 205C298 208 293 208 293 205Z' },
  ],
  whites: 'M177 142C177 134 188 134 188 142C188 150 177 150 177 142ZM206 142C206 134 217 134 217 142C217 150 206 150 206 142Z',
  lines: paths([body, tail, tailTuft, maneOut, face, ears, eyes, nose, paws, mouseBody, mouseHead, mouseEar, mouseTail]),
  fine:
    paths([
      maneCurls,
      brows,
      mouth,
      whiskers,
      domeEdge,
      broken,
      snap,
      mouseArms,
      mouseFace,
      hatch(60, 262, 140, 262, 8, 6, 160, 3),
      hatch(240, 264, 300, 264, 6, 6, 160, 4),
      tufts([[14, 254], [248, 255], [386, 252], [300, 256]], 9, 6),
    ]),
  once: `<g clip-path="url(#netclip)" opacity="0.5" stroke-width="1.15"><path d="${net}"/></g>`,
  defsExtra: `<clipPath id="netclip"><path d="${dome}"/></clipPath>`,
  fills: '<circle cx="185" cy="146" r="3"/><circle cx="214" cy="146" r="3"/><circle cx="312" cy="198" r="2.4"/>',
  glints: '<circle cx="186" cy="144.8" r="1"/><circle cx="215" cy="144.8" r="1"/><circle cx="313" cy="197" r="0.8"/>',
};
