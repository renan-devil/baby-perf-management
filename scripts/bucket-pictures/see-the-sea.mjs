// See the sea: curling waves rolling onto a sandy shore, a low sun on the horizon, two gulls, a shell.
import { PAL, hatch, paths, rays } from '../story-pictures/lib.mjs';

const r1 = (n) => Math.round(n * 10) / 10;

// One row of waves curling to the right: for each wave, its back and curl (line), its front face
// (line), and a foam crescent along the crest (painted paper-white over the sea).
function waves(x0, count, w, y, h) {
  const line = [];
  const foam = [];
  const hollow = [];
  for (let i = 0; i < count; i++) {
    const x = x0 + i * w;
    const p = (fx, fy) => `${r1(x + fx * w)} ${r1(y - fy * h)}`;
    line.push(
      `M${p(0, 0)}C${p(0.25, 0.05)} ${p(0.33, 1)} ${p(0.58, 1)}C${p(0.82, 1)} ${p(0.92, 0.5)} ${p(0.76, 0.42)}C${p(0.66, 0.38)} ${p(0.62, 0.6)} ${p(0.7, 0.64)}`,
      `M${p(0.9, 0.46)}C${p(0.93, 0.2)} ${p(0.97, 0.06)} ${p(1.04, 0)}`,
    );
    foam.push(
      `M${p(0.28, 0.6)}C${p(0.38, 1.04)} ${p(0.74, 1.1)} ${p(0.88, 0.7)}C${p(0.86, 0.56)} ${p(0.76, 0.52)} ${p(0.7, 0.58)}C${p(0.72, 0.78)} ${p(0.5, 0.84)} ${p(0.28, 0.6)}Z`,
      `M${p(0.97, 0.62)}c1.6 0 1.6 2.4 0 2.4c-1.6 0-1.6-2.4 0-2.4ZM${p(1.02, 0.4)}c1.2 0 1.2 2 0 2c-1.2 0-1.2-2 0-2Z`,
    );
    hollow.push(
      `M${p(0.02, 0)}C${p(0.25, 0.05)} ${p(0.33, 1)} ${p(0.58, 1)}C${p(0.82, 1)} ${p(0.92, 0.5)} ${p(0.9, 0.46)}C${p(0.93, 0.2)} ${p(0.97, 0.06)} ${p(1.04, 0)}C${p(0.9, -0.3)} ${p(0.3, -0.5)} ${p(0.02, 0)}Z`,
    );
  }
  return { line, foam, hollow };
}

const far = waves(10, 5, 73, 164, 23);
const near = waves(8, 4, 93, 210, 40);

const horizon = 'M6 124C90 122 200 125 394 122';
const sun = 'M276 98C276 84 288 74 302 74C316 74 328 85 328 98C328 112 316 122 302 122C288 122 276 112 276 98Z';
// The last foam line where the sea runs up the sand.
const shoreFoam =
  'M4 224C14 218 22 228 32 222C42 216 50 228 62 223C74 218 82 230 96 224C110 218 118 230 132 225C146 220 154 231 170 225C186 220 194 230 210 225C226 220 236 230 252 224C268 219 278 230 294 224C310 219 320 229 336 224C352 219 362 228 378 223C386 220 392 224 396 222';
const wetEdge = 'M14 238C40 236 62 238 84 236M196 240C224 238 250 239 270 237M318 236C340 235 360 237 384 235';
// Rays only above the sea.
const sunRays = rays(302, 98, 31, 44, 9, 5, 190).replace(/M[^M]*/g, (r) => (r.match(/-?[\d.]+/g).filter((v, i) => i % 2 && +v > 108).length ? '' : r));

const gulls = 'M88 62q9-11 18-1q8-11 18 1M146 40q6-8 13 0q6-8 13 1';

// A scallop shell lying on the sand, hinge at the bottom.
const shell =
  'M106 274C96 266 92 254 96 246C100 248 102 244 106 242C108 238 112 238 116 236C120 232 126 234 130 234C134 232 140 236 144 238C148 240 152 242 154 248C156 252 158 256 156 260C152 266 146 272 136 276Z';
const hinge = 'M106 274L102 282L140 284L136 276';
const ribs = 'M121 280L100 250M121 280L110 241M121 280L122 236M121 280L134 236M121 280L146 242M121 280L154 252';
const S = 'translate(132 286) rotate(-10) scale(1.15) translate(-121 -284)';

export default {
  title: 'See the sea',
  seed: 241,
  washes: [
    // sunset glow and sun
    { c: PAL.ochre, o: 0.2, d: 'M256 110C252 82 276 62 304 64C332 66 350 86 346 112C344 120 260 122 256 110Z' },
    { c: PAL.ochre, o: 0.82, d: 'M274 100C272 84 288 72 304 74C318 76 330 88 328 102C326 114 314 122 300 121C286 120 276 112 274 100Z' },
    // sky
    { c: PAL.rose, o: 0.25, d: 'M8 124C8 112 90 106 200 108C300 106 392 110 392 122Z' },
    // the sea
    { c: PAL.sky, o: 0.6, d: 'M6 122C100 120 200 123 394 120L394 224C300 230 200 222 100 228C60 230 20 224 6 226Z' },
    { c: PAL.slate, o: 0.4, d: 'M6 122C100 120 200 123 394 120L394 140C300 144 200 136 100 142C60 144 20 138 6 140Z' },
    { c: PAL.sky, o: 0.55, d: far.hollow.join('') },
    { c: PAL.slate, o: 0.38, d: near.hollow.join('') },
    // sun path on the water
    { c: PAL.ochre, o: 0.45, d: 'M282 128C294 126 312 126 322 128L318 132C306 134 296 134 286 132ZM288 138C298 136 310 136 318 138L314 142C304 143 296 143 290 141Z' },
    // sand, wet sand and the shell
    { c: PAL.ochre, o: 0.45, d: 'M6 222C100 218 200 228 300 220C340 218 380 222 394 220L394 292C300 296 200 290 100 294C60 296 20 292 6 294Z' },
    { c: PAL.ochre, o: 0.3, d: 'M6 224C100 220 200 228 300 222C340 220 380 224 394 222L394 242C320 246 240 238 160 244C100 246 40 240 6 244Z' },
    { c: PAL.rose, o: 0.72, t: S, d: 'M104 272C94 262 92 252 98 246C104 240 112 236 120 234C132 232 146 236 152 246C158 256 152 268 138 276C126 280 112 278 104 272Z' },
    { c: PAL.terracotta, o: 0.45, t: S, d: 'M102 280L104 274L136 276L140 284Z' },
  ],
  whites: far.foam.join('') + near.foam.join(''),
  lines: paths([horizon, sun, ...far.line, ...near.line, shoreFoam]) + paths([shell, hinge], S),
  fine:
    paths([ribs], S) +
    paths([
    gulls,
    wetEdge,
    sunRays,
    'M30 140q8-4 16 0M120 136q8-4 16 0M200 142q8-4 16 0M352 138q8-4 16 0M82 150q6-3 12 0M246 152q6-3 12 0',
    hatch(16, 262, 70, 266, 5, 6, 160, 4),
    hatch(200, 270, 380, 262, 12, 6, 160, 5),
    'M190 254l2 1M226 258l2 1M320 252l2 1M64 286l2 1M176 288l2 1M352 284l2 1M262 286l2 1',
    ]),
};
