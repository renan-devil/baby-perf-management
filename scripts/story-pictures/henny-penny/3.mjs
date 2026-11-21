import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, foxyBow, ground, henny, oak, place } from './characters.mjs';

// Henny Penny, 3: Foxy Loxy bows very low, smiling a sly smile, and points the way with his paw:
// "This way, it's a short cut!" Henny Penny, small beside him, listens. The characters are drawn in
// characters.mjs.

const G = 262;
// the "short cut": a little path of dashes leading off to the left, towards a far-off wood
const path = 'M176 266C140 266 104 256 84 244M74 236C66 228 60 220 58 212M56 204C54 198 52 194 50 190';
const hill = 'M0 196C30 184 70 182 110 192';

export default compose({
  title: 'Foxy Loxy bows and points the way',
  seed: 47,
  parts: [
    ground(G),
    {
      lines: [hill],
      fine: [path, tufts([[200, G], [380, G - 1], [30, G + 1]], 9, 5), hatch(10, 206, 90, 206, 5, 5, 160, 2)],
      washes: [
        { c: PAL.green, o: 0.3, d: 'M0 194C30 182 70 180 110 190C90 200 40 206 0 210Z' },
        { c: PAL.ochre, o: 0.35, d: 'M196 276C150 276 104 262 80 244C64 230 56 214 50 192L58 192C64 212 74 228 92 240C118 256 156 264 196 264Z' },
      ],
    },
    // far away at the end of the short cut: an oak (where the fox has his den)
    place(oak({ den: true }), 'translate(46 192) scale(0.3)'),
    place(henny({ mood: 'worried', look: [1, -0.6] }), `translate(104 ${G}) scale(1.05)`),
    place(foxyBow(), `translate(304 ${G}) scale(-1.6 1.6)`),
  ],
});
