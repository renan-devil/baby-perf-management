import { PAL, hatch, rng, transformPath } from '../lib.mjs';
import { compose, dot, duckling, limb, place } from './characters.mjs';

// The Ugly Duckling, 7: in the winter cold a kind farmer has lifted the duckling out of the frozen
// pond and holds him safe in his arms, while the snow falls.

// The farmer (feet at 0,0, facing right), drawn here once
const coat = 'M-36 -150C-44 -120 -48 -90 -42 -64L20 -64C26 -90 24 -124 14 -150C4 -158 -26 -158 -36 -150Z';
const legs = 'M-34 -64L-34 -10M-16 -64L-15 -10M-6 -64L-6 -10M12 -64L12 -10';
const boots = 'M-38 -12C-38 -2 -36 0 -24 0C-14 0 -12 -4 -14 -12ZM-8 -12C-8 -2 -6 0 6 0C18 0 20 -4 14 -12Z';
const head = 'M-24 -158C-28 -176 -18 -190 -4 -190C10 -190 18 -178 16 -164C14 -152 4 -146 -6 -146C-16 -146 -22 -150 -24 -158Z';
const brim = 'M-36 -184C-20 -191 12 -191 28 -184C12 -179 -20 -179 -36 -184Z';
const crown = 'M-22 -185C-22 -200 -18 -207 -4 -207C10 -207 14 -200 14 -185';
const hair = 'M-24 -170C-28 -166 -28 -160 -24 -156M-20 -180l-4 6';
const scarf = 'M-26 -153C-14 -145 6 -145 16 -153L17 -143C4 -137 -16 -137 -27 -143ZM-20 -140L-25 -116L-16 -116L-13 -140';
const face = 'M2 -176q4 -2 8 0M15 -169q6 3 1 7M2 -158q6 4 12 -1';
const buttons = 'M-14 -128l0 1M-14 -110l0 1M-14 -92l0 1';
const armBack = limb([[-30, -146, 15], [-36, -120, 13], [-20, -96, 12], [8, -86, 11], [36, -84, 10]]);
const armFront = limb([[8, -146, 15], [22, -122, 13], [38, -100, 12], [62, -90, 11], [92, -92, 10]]);
const mitts = 'M90 -98C98 -104 106 -98 102 -88C96 -84 90 -86 90 -92ZM34 -90C42 -94 48 -88 46 -80C40 -76 34 -78 34 -84Z';
const FT = 'translate(120 268) scale(1.15)';
const ft = (d) => transformPath(d, FT);

// snow: little flakes scattered over the sky
const flakes = (() => {
  const r = rng(77);
  let d = '';
  for (let i = 0; i < 46; i++) {
    const [x, y] = [8 + r() * 384, 8 + r() * 230];
    if (x > 70 && x < 250 && y > 20 && y < 270) continue;
    const s = 2 + r() * 2;
    d += `M${(x - s).toFixed(1)} ${y.toFixed(1)}l${(2 * s).toFixed(1)} 0M${x.toFixed(1)} ${(y - s).toFixed(1)}l0 ${(2 * s).toFixed(1)}`;
  }
  return d;
})();

const ground = 'M0 262C60 258 120 264 200 260';
const pond = 'M214 262C220 244 300 236 360 240C392 242 404 250 400 260C396 274 340 284 280 284C236 284 210 276 214 262Z';
const hole = 'M286 258C284 250 316 248 320 256C322 264 290 266 286 258Z';
const cracks = 'M320 256L340 250L352 254M286 258L262 266L250 262M300 250L296 240M240 254l14 2';

export default compose({
  title: 'The farmer finds the duckling',
  seed: 77,
  washes: [
    { c: PAL.sky, o: 0.18, d: 'M0 0L400 0L400 236C300 232 120 252 0 258Z' },
    { c: PAL.sky, o: 0.55, d: pond },
    { c: PAL.slate, o: 0.6, d: hole },
    { c: PAL.grey, o: 0.3, d: 'M0 262C60 258 120 264 200 260L214 268C140 274 60 276 0 280Z' },
    { c: PAL.terracotta, o: 0.6, d: ft(`${coat}${armBack}Z${armFront}Z`) },
    { c: PAL.slate, o: 0.65, d: ft(`M-38 -64L-12 -64L-12 -12L-38 -12ZM-10 -64L16 -64L16 -12L-10 -12Z${boots}${brim}${crown}Z`) },
    { c: PAL.rose, o: 0.5, d: ft(`${head}${dot(8, -160, 4)}`) },
    { c: PAL.grey, o: 0.5, d: ft('M-24 -170C-28 -166 -28 -160 -24 -156L-20 -158C-22 -164 -22 -168 -20 -172Z') },
    { c: PAL.red, o: 0.75, d: ft(`${scarf}${mitts}`) },
  ],
  lines: [ground, pond, ...[coat, legs, boots, head, brim, crown, armBack, armFront].map(ft)],
  fine: [hole, cracks, flakes, ...[hair, scarf, face, buttons, mitts].map(ft), hatch(20, 276, 190, 278, 6, 10, 176, 5)],
  fills: `<path d="${ft(dot(6, -169, 2))}"/>`,
  parts: [place(duckling({ head: -12 }), `${FT} translate(74 -91) scale(-0.92 0.92)`)],
});
