import { PAL, hatch, paths, rays, rng, transformPath, tufts } from '../lib.mjs';
import { R, buttonAt, f, parsee, pt, ring } from './1.mjs';

// How the Rhinoceros Got His Skin, 4: the Parsee man, with a smile that goes all round his face (and
// his hat off, for the heatwave), shakes a sack of old, dry, stale cake crumbs and burnt currants into
// the Rhinoceros's empty skin, lying flat on the sand as in picture 3.

// ---- the empty skin, flat on the sand (same squashed outline as picture 3) ----
const KT = 'translate(118 268) rotate(-3) scale(1.3 0.56)';
const skinLines = [R.back, R.head, R.horn, R.horn2, R.ear, R.frontLeg, R.backLeg, R.tail];
const flap = 'M-40 -22C-20 -19 3 -19 23 -22M-38 -15C-18 -11 4 -11 22 -15';
const crumple = 'M-30 -60C-24 -50 -26 -40 -20 -34M6 -66C10 -56 8 -46 12 -38M50 -52q4 4 2 10';
const buttons = buttonAt.map(([x, y]) => {
  const [bx, by] = pt(x, y + 7, KT);
  return ring(f(bx), f(by), 3);
});

// ---- the Parsee man, hat off, pouring ----
const MT = 'translate(322 264) scale(1.45)';
const man = parsee(MT, { arms: 'pour', smile: 'big', hatOff: true });
const hair = 'M-12 -84C-12 -97 12 -97 12 -84C8 -91 -8 -91 -12 -84Z';
// the sack, held in both hands, its open mouth tipped down to the left (man coordinates)
const sack = 'M-36 -58C-42 -70 -58 -72 -66 -64C-70 -60 -72 -54 -73 -49M-30 -45C-40 -39 -54 -39 -65 -43';
const sackMouth = 'M-73 -49C-75 -44 -71 -41 -65 -43';
const sackWash = 'M-36 -58C-42 -70 -58 -72 -66 -64C-70 -60 -72 -54 -73 -49C-75 -44 -71 -41 -65 -43C-54 -39 -40 -39 -30 -45C-32 -50 -34 -54 -36 -58Z';
const patch = 'M-56 -62l6 0l0 6l-6 0Z';
const shake = 'M-46 -76l-3 -6M-56 -78l0 -7M-66 -74l3 -6';

// ---- the crumbs, falling from the sack into the skin, and a little heap on it ----
const [sx, sy] = pt(-72, -45, MT);
const r = rng(41);
let crumbs = '';
let currants = '';
for (let i = 0; i < 34; i++) {
  const t = r();
  const x = sx - 4 - t * 14 + (r() - 0.5) * 12;
  const y = sy + 4 + t * 36 + (r() - 0.5) * 6;
  const s = 1.4 + r() * 1.6;
  const d = `M${f(x - s)} ${f(y)}l${f(s)} ${f(-s * 0.8)}l${f(s)} ${f(s * 0.9)}l${f(-s * 0.7)} ${f(s)}Z`;
  if (i % 5 === 0) currants += d;
  else crumbs += d;
}
const heap = 'M184 240C188 232 202 230 210 236C216 238 218 242 216 244';

const beach = 'M8 270C90 266 180 272 260 268C320 265 360 269 392 267';
const sea = 'M8 140C80 138 150 142 230 139C260 138 280 140 290 140';

export default {
  title: 'Crumbs',
  seed: 74,
  washes: [
    { c: PAL.sky, o: 0.5, d: 'M8 140C80 138 150 142 230 139C300 136 360 140 392 138L392 194C300 198 120 190 8 196Z' },
    { c: PAL.ochre, o: 0.4, d: 'M8 194C120 188 300 196 392 192L394 290C300 294 140 286 8 292Z' },
    { c: PAL.ochre, o: 0.65, d: 'M48 62C48 44 74 44 74 62C74 80 48 80 48 62Z' },
    { c: PAL.grey, o: 0.62, t: KT, d: R.bodyWash },
    { c: PAL.slate, o: 0.3, t: KT, d: 'M-38 -15C-18 -11 4 -11 22 -15L23 -22C3 -19 -20 -19 -40 -22Z' },
    { c: PAL.ochre, o: 0.4, t: KT, d: R.hornWash },
    { c: PAL.ochre, o: 0.9, d: buttons.join('') },
    ...man.washes,
    { c: PAL.ink, o: 0.55, t: MT, d: hair },
    { c: PAL.ochre, o: 0.7, t: MT, d: sackWash },
    { c: PAL.terracotta, o: 0.5, t: MT, d: patch },
    { c: PAL.ochre, o: 0.85, d: crumbs + 'M184 240C188 232 202 230 210 236C216 238 218 242 216 244Z' },
  ],
  lines: paths(skinLines, KT) + man.lines + paths([sack, sackMouth], MT) + paths([beach]),
  fine:
    paths([flap, crumple, R.eye], KT) +
    paths(buttons) +
    man.fine +
    paths([patch, shake], MT) +
    paths([sea, heap, crumbs, rays(61, 62, 18, 30, 12, 6), tufts([[20, 270], [388, 267]], 8, 8), hatch(30, 284, 370, 282, 12, 6, 165, 11)]),
  fills: `<path d="${transformPath(R.eye, KT)}" fill-opacity="0.5"/>` + `<path d="${currants}"/>`,
};
