import { PAL } from '../lib.mjs';
import { cinderella, compose, dot, place, sparkles } from './characters.mjs';

// Cinderella, 5: the apron and the patched dress are gone. Cinderella stands in a wide gown of sky
// blue and silver, lifting her skirt a little, and looks down in wonder at the glass slippers on her
// feet, while sparkles still twinkle all around her.
// holding the front of the skirt up a little
const LIFT = [
  [[-12, -80, 7], [-24, -64, 6.5], [-22, -44, 6.5], [-18, -30, 6.5]],
  [[12, -80, 7], [24, -64, 6.5], [22, -44, 6.5], [18, -30, 6.5]],
];
const floor = 'M50 284C140 281 260 281 350 284';

export default compose({
  title: 'A Gown of Silver and Blue',
  seed: 1205,
  washes: [{ c: PAL.grey, o: 0.3, d: 'M80 282C150 274 250 274 320 282C316 292 250 296 200 296C150 296 82 292 80 282Z' }],
  lines: [floor],
  parts: [
    place(cinderella({ gown: true, hem: 'lift', mood: 'wow', up: -1, tilt: -6, arms: LIFT }), 'translate(200 282) scale(1.92)'),
    sparkles([
      [96, 120, 8],
      [306, 102, 9],
      [78, 214, 6],
      [324, 200, 7],
      [130, 52, 5],
      [270, 40, 6],
      [348, 150, 5],
      [52, 160, 5],
      [140, 272, 5],
      [262, 272, 5],
      [176, 250, 4],
      [226, 248, 4],
    ]),
    { glints: [dot(118, 90, 1.4), dot(286, 140, 1.2), dot(92, 254, 1.2), dot(316, 250, 1.2)] },
  ],
});
