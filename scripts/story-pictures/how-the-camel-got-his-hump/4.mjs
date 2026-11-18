import { PAL, paths, transformPath } from '../lib.mjs';
import { H, at, camel, f, sand } from './1.mjs';

// How the Camel Got His Hump, 4: the Djinn in charge of All Deserts comes spinning across the sand on
// a whirl of dust and finds the Camel bending over a little pool, admiring his own reflection.
// The Djinn is friendly: a round smiling face, a turban and a curly moustache, riding his whirlwind.

// ---- The Camel, on the left, his head bent down over the pool ----
const CT = 'translate(100 248) scale(1.12)';
const CHT = 'translate(100 -62) rotate(40) scale(1.3)';
const cm = camel(CT, { headT: CHT, twig: false, neckTop: [22, -22], neckFront: [24, -10], look: [1, 1] });
const ground = sand(248, 8);

// the pool, with his upside-down head in it (the head wash, mirrored), and a few ripples
const PX = 246;
const pool = transformPath('M-62 0C-62 -10 -30 -15 0 -15C34 -15 62 -10 62 0C62 10 34 15 0 15C-30 15 -62 10 -62 0Z', `translate(${PX} 268)`);
// his head, flipped upside down and squashed, in the middle of the pool
const [hx, hy] = at(`${CT} ${CHT}`, 20, 0);
const RT = `translate(${PX} 268) scale(0.85 -0.42) translate(${f(-hx)} ${f(-hy)}) ${CT} ${CHT}`;
const reflect = transformPath(H.wash, RT);
const reflectEye = transformPath(H.eyeLow + H.lidTop, RT);
const ripples = transformPath('M-52 2q10 -3 20 0M34 6q10 -3 18 0M-12 11q8 -2 16 0', `translate(${PX} 268)`);
// little sparkles: he thinks he looks wonderful
const sparkle = (x, y, r) => `M${x - r} ${y}L${x + r} ${y}M${x} ${y - r}L${x} ${y + r}`;
const sparkles = sparkle(PX - 40, 236, 5) + sparkle(PX + 46, 240, 4) + sparkle(PX + 8, 226, 3);

// ---- The Djinn's whirlwind: a spiral of dust from the sand up to where he sits ----
function whirl(cx, top, bottom, w) {
  const pts = [];
  const turns = 6.5;
  const n = 140;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = t * turns * Math.PI * 2;
    const r = w * Math.pow(1 - t, 0.9) + 3;
    const x = cx + Math.sin(t * 5) * 6 * (1 - t) + r * Math.cos(a);
    const y = top + (bottom - top) * t + r * 0.22 * Math.sin(a);
    pts.push(`${f(x)} ${f(y)}`);
  }
  return `M${pts[0]}L${pts.slice(1).join('L')}`;
}
const WX = 334;
const spiral = whirl(WX, 116, 246, 46);
const funnel = `M${WX - 50} 112C${WX - 40} 160 ${WX - 12} 220 ${WX - 2} 250L${WX + 6} 250C${WX + 14} 220 ${WX + 40} 160 ${WX + 52} 112C${WX + 30} 100 ${WX - 28} 100 ${WX - 50} 112Z`;
const dustPuff = `M${WX - 30} 252C${WX - 38} 250 ${WX - 36} 240 ${WX - 28} 242C${WX - 26} 234 ${WX - 14} 236 ${WX - 14} 242C${WX - 6} 238 ${WX + 4} 242 ${WX + 2} 248C${WX + 10} 244 ${WX + 22} 248 ${WX + 18} 254Z`;
const speed = 'M388 140l-12 2M392 170l-14 1M390 200l-12 2';

// ---- The Djinn, sitting on top of the whirl (his own coordinates, the whirl top at 0, 0) ----
const DJ = {
  face: 'M-13 -30C-13 -47 13 -47 13 -30C13 -15 -13 -15 -13 -30Z',
  turban: 'M-15 -37C-19 -52 -9 -61 0 -61C10 -61 19 -52 15 -37C6 -41 -6 -41 -15 -37Z',
  plume: 'M0 -61C1 -68 6 -72 10 -70C8 -66 4 -64 2 -60',
  folds: 'M-12 -44C-4 -50 6 -50 13 -44M-10 -51C-2 -56 6 -55 11 -51',
  robe: 'M-8 -17C-18 -10 -22 -2 -24 6M8 -17C18 -10 22 -2 24 6',
  sash: 'M-17 -6C-6 -2 6 -2 17 -6',
  armL: 'M-14 -12C-24 -14 -32 -22 -34 -32',
  armR: 'M14 -12C24 -12 32 -18 36 -26',
  eyes: 'M-7 -32q2 -3 4 0M3 -32q2 -3 4 0',
  smile: 'M-6 -23Q0 -18 6 -23',
  tache: 'M-1 -26C-4 -29 -9 -28 -11 -24M1 -26C4 -29 9 -28 11 -24',
  hands: 'M-34 -32C-38 -32 -40 -38 -36 -40C-32 -41 -30 -36 -34 -32ZM36 -26C38 -30 44 -30 44 -26C44 -22 38 -22 36 -26Z',
};
DJ.robeWash = 'M-8 -17C-18 -10 -22 -2 -24 6C-10 10 10 10 24 6C22 -2 18 -10 8 -17Z';
const DT = `translate(${WX} 114) scale(1.25)`;
const jewel = at(DT, 0, -44);
const cheeks = ['M-11 -26a3 2.4 0 1 0 6 0a3 2.4 0 1 0 -6 0Z', 'M5 -26a3 2.4 0 1 0 6 0a3 2.4 0 1 0 -6 0Z'].join('');

export default {
  title: 'The Djinn finds the Camel at the pool',
  seed: 74,
  washes: [
    { c: PAL.ochre, o: 0.32, d: ground.wash },
    { c: PAL.sky, o: 0.7, d: pool },
    { c: PAL.ochre, o: 0.6, d: reflect },
    ...cm.washes,
    { c: PAL.grey, o: 0.32, d: funnel },
    { c: PAL.ochre, o: 0.3, d: funnel + dustPuff },
    { c: PAL.sky, o: 0.75, d: transformPath(DJ.robeWash, DT) },
    { c: PAL.ochre, o: 0.55, d: transformPath(DJ.face + DJ.hands, DT) },
    { c: PAL.rose, o: 0.6, d: transformPath(cheeks, DT) },
    { c: PAL.red, o: 0.7, d: transformPath(DJ.turban, DT) },
    { c: PAL.green, o: 0.7, d: transformPath(DJ.plume + 'Z', DT) },
  ],
  whites: cm.whites,
  lines: cm.lines + paths([ground.line, pool]) + paths([DJ.face, DJ.turban, DJ.robe, DJ.armL, DJ.armR, DJ.hands], DT),
  fine:
    cm.fine +
    paths([ground.ripples, ripples, reflectEye, sparkles, spiral, dustPuff, speed]) +
    paths([DJ.plume, DJ.folds, DJ.sash, DJ.eyes, DJ.smile, DJ.tache], DT),
  fills: cm.fills + `<circle cx="${f(jewel[0])}" cy="${f(jewel[1])}" r="2.6"/>`,
  glints: cm.glints + `<circle cx="${f(jewel[0] - 0.8)}" cy="${f(jewel[1] - 0.8)}" r="0.9"/>`,
};
