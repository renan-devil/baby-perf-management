import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, dog, donkey, place } from './characters.mjs';

// The Bremen Town Musicians, 3: the old Dog lies panting by the side of the road, and the Donkey
// bends down kindly to invite him along.
const road = 'M0 262C120 256 280 260 400 254';
const pant = 'M164 226q8 -2 12 4M168 214q10 -4 16 4';
const heart = 'M184 150C174 140 176 130 184 135C192 130 194 140 184 150Z';

export default compose({
  title: 'Come with me to Bremen!',
  seed: 63,
  washes: [
    { c: PAL.ochre, o: 0.45, d: 'M0 214C120 208 280 210 400 206L400 254C280 260 120 256 0 262Z' },
    { c: PAL.green, o: 0.4, d: 'M0 262C120 256 280 260 400 254L400 300L0 300Z' },
    { c: PAL.rose, o: 0.85, d: heart },
  ],
  lines: [road],
  fine: [pant, heart, hatch(20, 280, 380, 278, 10, 7, 170, 8), tufts([[30, 210], [370, 204], [90, 290], [300, 288]], 10, 3)],
  parts: [place(dog({ pose: 'lie' }), 'translate(96 280) scale(1.3)'), place(donkey(), 'translate(300 250) scale(-1.05 1.05)')],
});
