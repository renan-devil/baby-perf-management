import { PAL, hatch, tufts } from '../lib.mjs';
import { HANS_ARMS, HANS_LEGS, compose, dot, goose, hans, place, sparkles } from './characters.mjs';

// The Golden Goose, cover: Hans walks along the road, smiling, with the shining golden goose tucked
// under his arm. Hans and the goose are drawn in characters.mjs and placed here.
const ground = 'M0 266C80 262 160 268 240 265C300 263 350 266 400 264';
const hill = 'M0 210C60 192 130 190 200 204C260 214 330 186 400 194';
const H = 'translate(160 270) scale(1.8)';

export default compose({
  title: 'The Golden Goose',
  seed: 71,
  washes: [
    { c: PAL.green, o: 0.32, d: 'M0 262C80 258 160 264 240 261C300 259 350 262 400 260L400 300L0 300Z' },
    { c: PAL.green, o: 0.22, d: 'M0 210C60 192 130 190 200 204C260 214 330 186 400 194L400 262L0 262Z' },
    { c: PAL.ochre, o: 0.3, d: 'M120 300C150 284 170 274 176 266L232 266C250 276 276 288 300 300Z' },
    { c: PAL.sky, o: 0.18, d: 'M60 70C80 30 160 20 200 36C250 14 330 30 340 70C350 104 290 120 240 110C190 124 100 120 76 104C60 94 54 82 60 70Z' },
    { c: PAL.ochre, o: 0.22, d: dot(262, 140, 62) },
  ],
  lines: [ground],
  fine: [hill, hatch(20, 282, 380, 284, 12, 7, 165, 4), tufts([[30, 264], [120, 266], [298, 264], [380, 264]], 9, 5)],
  parts: [
    place(
      hans({
        mood: 'happy',
        tilt: 6,
        arms: HANS_ARMS.carry,
        legs: HANS_LEGS.walk,
        under: place(goose(), 'translate(40 -56) scale(0.8)'),
      }),
      H,
    ),
    place(sparkles([[306, 92, 10], [334, 132, 6.5], [262, 62, 6], [336, 188, 8], [236, 42, 4.5]]), ''),
  ],
});
