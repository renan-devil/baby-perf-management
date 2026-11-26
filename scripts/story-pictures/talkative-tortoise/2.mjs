import { PAL, hatch, rays, tufts } from '../lib.mjs';
import { transformPath } from '../lib.mjs';
import { compose, dot, place, tortoise, tortoiseBodyCut, tortoiseHeadCut } from './characters.mjs';

// The Talkative Tortoise, 2: no rain all summer. The pond has dried into cracked mud under a hot
// sun, and the tortoise sits in the middle of it, head hanging, with nothing at all to say.
const ground = 'M0 176C60 172 120 176 200 174C280 172 340 176 400 174';
const mudEdge = 'M24 228C30 192 110 180 200 180C296 180 372 192 378 230C384 268 300 286 200 286C100 286 18 268 24 228Z';
// cracks: a loose net of jagged lines across the mud (none under the tortoise)
const cracks =
  'M40 236L64 228L84 240L96 258M64 228L70 208M96 258L120 256L134 276' +
  'M96 196L108 210L94 222M60 256L80 266L92 260M226 284L234 274L250 278L262 270' +
  'M290 274L300 258L322 252L344 262L350 276M322 252L326 232L350 222L366 228M326 232L304 222L300 202' +
  'M300 202L320 194M150 196L164 202L184 194M240 194L256 200L274 192';
const sun = dot(334, 64, 24);
const sunRays = rays(334, 64, 32, 46, 12, 7);
const T = 'translate(184 258) scale(1.4)';

export default compose({
  title: 'The pond has dried up',
  seed: 43,
  washes: [
    { c: PAL.ochre, o: 0.28, d: 'M0 172C60 168 120 172 200 170C280 168 340 172 400 170L400 300L0 300Z' },
    { c: PAL.terracotta, o: 0.38, rule: 'evenodd', d: mudEdge + transformPath(tortoiseBodyCut + tortoiseHeadCut(18), T) },
    { c: PAL.ochre, o: 0.75, d: sun },
  ],
  lines: [mudEdge],
  fine: [
    ground,
    cracks,
    sun,
    sunRays,
    hatch(10, 206, 30, 290, 5, 6, 160, 3),
    hatch(380, 200, 394, 290, 5, 6, 160, 4),
    tufts([[16, 174], [384, 174], [390, 292], [12, 294]], 8, 7),
  ],
  parts: [place(tortoise({ mouth: 'sad', head: 18 }), T)],
});
