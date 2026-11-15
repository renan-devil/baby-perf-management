import { PAL, hatch, tufts } from '../lib.mjs';
import { cloud, compose, dragon, house, place } from './characters.mjs';

// The Great Race, 5: on his way, kind Dragon stops over a dry little village and makes rain fall on
// its thirsty fields. His long green body winds through the clouds above the houses.
const ground = 'M0 262C100 258 300 262 400 258';
const rain = hatch(150, 160, 330, 160, 14, 26, 105, 7, 0.4) + hatch(140, 200, 340, 200, 14, 22, 105, 8, 0.4);

export default compose({
  title: 'Dragon makes rain for a thirsty village',
  seed: 45,
  washes: [
    { c: PAL.green, o: 0.45, d: 'M0 258C100 254 300 258 400 254L400 300L0 300Z' },
    { c: PAL.sky, o: 0.25, d: 'M140 150L340 150L340 250L140 250Z' },
  ],
  lines: [ground],
  fine: [rain, tufts([[30, 262], [90, 260], [340, 260], [380, 258]], 8, 6)],
  parts: [
    place(cloud(), 'translate(220 150) scale(1.5 1.1)'),
    place(cloud(), 'translate(320 144) scale(-1.1 0.9)'),
    dragon(),
    place(house(), 'translate(150 268) scale(1.1)'),
    place(house(), 'translate(236 262) scale(1.25)'),
    place(house(), 'translate(318 270) scale(1)'),
  ],
});
