import { PAL, hatch, rays, transformPath, tufts } from '../lib.mjs';
import { ROPE, compose, donkey, dot, miller, place, son } from './characters.mjs';

// The Miller, His Son and the Donkey, 2: the miller and his son puff along with the donkey hung upside
// down from a long pole on their shoulders, his legs tied to it; the donkey brays and kicks one leg free.
const GROUND = 280;
const SON = [58, GROUND, 1.25];
const MILL = [338, GROUND, 1.22];
// the pole rests on the son's shoulder (54 above his feet) and on the miller's (104 above his)
const S = [SON[0], GROUND - 54 * SON[2]];
const M = [MILL[0], GROUND - 104 * MILL[2]];
const slope = (M[1] - S[1]) / (M[0] - S[0]);
const poleY = (x) => S[1] + slope * (x - S[0]);
const angle = (Math.atan(slope) * 180) / Math.PI;
const r1 = (n) => Math.round(n * 10) / 10;
const [x0, x1] = [18, 384];
const nx = -Math.sin((angle * Math.PI) / 180) * 3;
const ny = Math.cos((angle * Math.PI) / 180) * 3;
const pole = `M${r1(x0 - nx)} ${r1(poleY(x0) - ny)}L${r1(x1 - nx)} ${r1(poleY(x1) - ny)}M${r1(x0 + nx)} ${r1(poleY(x0) + ny)}L${r1(x1 + nx)} ${r1(poleY(x1) + ny)}`;
const poleFill = `M${r1(x0 - nx)} ${r1(poleY(x0) - ny)}L${r1(x1 - nx)} ${r1(poleY(x1) - ny)}L${r1(x1 + nx)} ${r1(poleY(x1) + ny)}L${r1(x0 + nx)} ${r1(poleY(x0) + ny)}Z`;
// the donkey, upside down under the pole and facing the miller: his tied hooves (donkey frame y = -3)
// sit on it, and he lifts his head to bray
const DX = 168;
const DS = 1.05;
const DT = `translate(${DX} ${r1(poleY(DX) - 3 * DS)}) rotate(${r1(angle)}) scale(${DS} ${-DS})`;
// kick lines by the free hind leg, and bray marks by his open mouth (donkey frame)
const kick = 'M-62 14L-74 16M-60 24L-70 32M-50 28L-52 40';
const bray = 'M93 -82L104 -88M94 -72L107 -71M89 -62L98 -54';
const HEAD = 70;
const flat = (d, ...ts) => ts.reduce((acc, t) => transformPath(acc, t), d);
const ground = `M0 ${GROUND - 4}C100 ${GROUND - 8} 200 ${GROUND - 2} 300 ${GROUND - 6}C340 ${GROUND - 8} 380 ${GROUND - 6} 400 ${GROUND - 6}`;
// sweat drops by the two carriers
const drop = (x, y) => `M${x} ${y}C${x - 3} ${y + 5} ${x - 3} ${y + 8} ${x} ${y + 8}C${x + 3} ${y + 8} ${x + 3} ${y + 5} ${x} ${y}Z`;
const drops = drop(32, 160) + drop(24, 174) + drop(300, 104) + drop(292, 118);

export default compose({
  title: 'The Miller, His Son and the Donkey',
  seed: 1133,
  washes: [
    { c: PAL.green, o: 0.34, d: `${ground}L400 300L0 300Z` },
    { c: PAL.ochre, o: 0.75, d: poleFill },
    { c: PAL.sky, o: 0.7, d: drops },
    { c: PAL.ochre, o: 0.7, d: dot(196, 52, 15) },
  ],
  lines: [ground],
  fine: [
    drops,
    dot(196, 52, 15),
    rays(196, 52, 20, 29, 9, 4),
    hatch(20, 292, 380, 292, 9, 5, 160, 4),
    tufts([[14, GROUND - 4], [150, GROUND - 4], [250, GROUND - 3], [392, GROUND - 6]], 9, 6),
  ],
  parts: [
    place(son({ mood: 'puff', arms: 'carry' }), `translate(${SON[0]} ${SON[1]}) scale(${SON[2]})`),
    place(miller({ mood: 'puff', arms: 'carry' }), `translate(${MILL[0]} ${MILL[1]}) scale(${MILL[2]})`),
    place(donkey({ mood: 'bray', legs: 'tied', headTurn: HEAD }), DT),
    { lines: [pole], fine: [flat(ROPE, DT), flat(kick, DT), flat(bray, `rotate(${HEAD} 34 -62)`, DT)] },
  ],
});
