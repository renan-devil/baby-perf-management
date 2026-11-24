import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, horse, place, woman } from './characters.mjs';

// The Cat that Walked by Himself, 4: Wild Horse bends his head down to the sweet fresh grass, and the
// Woman slips a plaited halter over it.
const ground = 'M0 262C90 259 190 264 290 261C340 260 380 261 400 260';

// A bundle of fresh grass tied in the middle, lying on the ground under his nose
const blades = 'M208 258C218 250 232 246 246 244M210 262C222 256 236 254 252 254M212 264C226 262 240 262 256 262M206 258C200 252 192 250 184 250M206 262C198 258 190 258 182 260';
const grassWash = 'M184 248C200 246 236 240 254 244L258 264L182 264Z';
const tie = 'M204 254C206 258 206 262 204 266M210 253C212 258 212 262 210 266';

export default compose({
  title: 'Wild Horse bends his head, and the Woman slips a halter over it',
  seed: 304,
  washes: [
    { c: PAL.green, o: 0.32, d: 'M0 258C90 255 190 260 290 257C340 256 380 257 400 256L400 300L0 300Z' },
    { c: PAL.green, o: 0.7, d: grassWash },
  ],
  lines: [ground],
  fine: [blades, tie, hatch(14, 278, 388, 280, 12, 7, 165, 4), tufts([[24, 262], [110, 261], [370, 261]], 9, 5)],
  parts: [
    place(horse({ halter: true }), 'translate(310 262) scale(-1.25 1.25)'),
    place(
      woman({
        arms: [
          [[-2, -54, 8], [18, -46, 7], [34, -38, 6]],
          [[4, -54, 8], [24, -42, 7], [40, -33, 6]],
        ],
      }),
      'translate(154 262) scale(1.25)',
    ),
  ],
});
