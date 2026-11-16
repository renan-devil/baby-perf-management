import { PAL, hatch, tufts } from '../lib.mjs';
import { P_ARMS, compose, frog, place, princess, well } from './characters.mjs';

// The Frog Prince, 2: the golden ball has fallen into the well. The princess sobs (boo-hoo!), and a
// fat green frog, sitting on the rim of the well, asks her why she is crying.
const ground = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';
// rings on the water where the ball sank
const rings = 'M300 207C300 203 324 203 324 207C324 211 300 211 300 207ZM290 207C290 199 334 199 334 207';
// the frog's little "talking" marks
const talk = 'M226 160q-6 -2 -10 -8M224 170q-8 0 -13 -3';

export default compose({
  title: 'Why are you crying, princess?',
  seed: 52,
  washes: [{ c: PAL.green, o: 0.32, d: 'M0 268C90 265 200 270 300 267C340 266 370 268 400 267L400 300L0 300Z' }],
  lines: [ground],
  fine: [rings, talk, hatch(14, 284, 384, 286, 12, 7, 165, 4), tufts([[24, 272], [180, 274], [392, 271]], 9, 5)],
  parts: [
    place(well({ w: 150, h: 64 }), 'translate(300 208)'),
    place(frog({ mood: 'happy', look: [-2, 0] }), 'translate(268 205) scale(1.7)'),
    place(princess({ mood: 'cry', tilt: 4, arms: P_ARMS.cry }), 'translate(110 278) scale(1.45)'),
  ],
});
