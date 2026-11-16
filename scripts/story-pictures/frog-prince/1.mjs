import { PAL, hatch, tufts } from '../lib.mjs';
import { P_ARMS, ball, compose, frogPeep, limeTree, place, princess, well } from './characters.mjs';

// The Frog Prince, cover: by the old well under the lime tree, the little princess throws her golden
// ball high into the air (whoosh!), while a frog peeps over the rim of the well and watches.
const ground = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';
const whoosh = 'M196 52C190 62 190 70 194 78M212 56C208 64 208 70 210 76M226 52C228 60 228 68 224 76';

export default compose({
  title: 'The Frog Prince',
  seed: 51,
  washes: [
    { c: PAL.green, o: 0.32, d: 'M0 268C90 265 200 270 300 267C340 266 370 268 400 267L400 300L0 300Z' },
    { c: PAL.sky, o: 0.22, d: 'M120 40C150 8 260 4 300 26C330 44 320 80 290 92C250 104 160 100 130 84C112 72 110 54 120 40Z' },
  ],
  lines: [ground],
  fine: [whoosh, hatch(14, 284, 384, 286, 12, 7, 165, 4), tufts([[24, 272], [140, 274], [226, 272], [388, 271]], 9, 5)],
  parts: [
    place(limeTree(), 'translate(76 274) scale(0.86)'),
    place(well({ w: 140, h: 66 }), 'translate(318 202)'),
    place(frogPeep({ look: [-1.5, -1.6] }), 'translate(326 192) scale(1.5)'),
    place(princess({ mood: 'happy', tilt: -6, arms: P_ARMS.up }), 'translate(190 278) scale(1.42)'),
    place(ball(13), 'translate(212 30)'),
  ],
});
