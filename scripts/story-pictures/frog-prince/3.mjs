import { PAL, hatch, tufts } from '../lib.mjs';
import { P_ARMS, ball, compose, frog, place, princess, splash, well } from './characters.mjs';

// The Frog Prince, 3: splash! The frog bursts up out of the well with the golden ball in his mouth,
// and the princess holds up her hand: "Yes, yes, I promise!"
const ground = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';
const F = 'translate(290 150) scale(1.75)';

export default compose({
  title: 'I promise!',
  seed: 53,
  washes: [{ c: PAL.green, o: 0.32, d: 'M0 268C90 265 200 270 300 267C340 266 370 268 400 267L400 300L0 300Z' }],
  lines: [ground],
  fine: [hatch(14, 284, 384, 286, 12, 7, 165, 4), tufts([[24, 272], [190, 274], [392, 271]], 9, 5)],
  parts: [
    place(well({ w: 150, h: 64 }), 'translate(290 208)'),
    place(splash(1.3), 'translate(290 200)'),
    place(frog({ mood: 'happy', look: [-1.5, 0], mouth: false }), F),
    place(ball(9), `${F} translate(0 -22)`),
    place(princess({ mood: 'happy', tilt: 5, arms: P_ARMS.promise }), 'translate(112 278) scale(1.45)'),
  ],
});
