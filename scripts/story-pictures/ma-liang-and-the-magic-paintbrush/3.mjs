import { PAL, rays, zed } from '../lib.mjs';
import { at, brush, compose, dot, maLiangHead, oldMan, oval, place, sparkle } from './characters.mjs';

// Ma Liang and the Magic Paintbrush, 3: in a dream, in a soft golden light, the kind old man with
// the long white beard holds out the golden paintbrush to Ma Liang, asleep on his mat.
const O = 'translate(118 270) scale(1.3)';
const hand = [52, -86];
const [hx, hy] = at(...hand, O);
// only his head shows: the rest of him is tucked under the quilt
const B = 'translate(248 252) rotate(-90) scale(1.25)';
const glow = oval(150, 150, 130, 128);
const mat = 'M206 268L368 268L372 284L202 284Z';
const pillow = oval(226, 264, 24, 6);
// a quilt over him, from his shoulders to his feet
const quilt = 'M262 236C300 228 340 232 362 240C368 250 366 262 362 268L264 268C258 258 256 246 262 236Z';
const patches = 'M290 240L306 238L308 252L292 254ZM330 246L346 246L346 260L330 260Z';
const win = 'M300 34L370 34L370 104L300 104Z';
const moon = 'M346 52C334 56 330 74 340 86C326 84 318 70 324 58C328 50 338 48 346 52Z';

export default compose({
  title: 'The kind old man of the dream',
  seed: 833,
  washes: [
    { c: PAL.slate, o: 0.34, d: 'M0 0L400 0L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.75, d: glow },
    { c: PAL.ochre, o: 0.4, d: dot(hx, hy - 30, 34) },
    { c: PAL.slate, o: 0.5, d: win },
    { c: PAL.ochre, o: 0.95, d: moon },
    { c: PAL.ochre, o: 0.7, d: mat },
    { c: PAL.red, o: 0.65, d: quilt },
    { c: PAL.rose, o: 0.5, d: quilt },
    { c: PAL.ochre, o: 0.8, d: patches },
    { c: PAL.terracotta, o: 0.3, d: mat },
  ],
  whites: pillow,
  lines: [win, mat, pillow, quilt],

  fine: ['M335 34L335 104M300 69L370 69', moon, patches, 'M210 276L366 276', rays(hx, hy - 30, 30, 44, 12, 833), zed(262, 196, 12), zed(284, 172, 9), zed(300, 154, 7)],
  parts: [
    place(oldMan({ arms: [[[-18, -104, 13], [-28, -88, 13], [-24, -72, 12]], [[18, -104, 13], [36, -96, 13], [hand[0], hand[1], 12]]] }), O),
    place(brush(), `translate(${hx} ${hy}) rotate(30) scale(1.5)`),
    place(maLiangHead({ mood: 'sleep' }), B),
    { washes: [{ c: PAL.ochre, o: 0.95, d: sparkle(48, 72, 7) + sparkle(250, 92, 6) + sparkle(60, 214, 5) }] },
  ],
});
