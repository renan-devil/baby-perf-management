import { PAL, hatch, rays, transformPath, tufts } from '../lib.mjs';
import { compose, place, rabbitHead } from '../peter-rabbit/characters.mjs';
import { HEAD_SHAPE, TAM_HEAD_SHAPE, basket, basketHole, benjaminHead, cat, onion } from './characters.mjs';

// The Tale of Benjamin Bunny, 4: the two little rabbits hide under a big upturned basket, and the big
// cat comes and sits on top of it, for five whole hours. Through a hole in the wicker we see the
// rabbits peeping out, Peter's eyes wide, Benjamin's tam over his eyes.
const ground = 'M0 262C90 259 190 264 290 261C340 260 370 262 400 261';
const B = 'translate(200 262) scale(1.2)';
// where the two heads go, and the shadow inside the hole, kept off their faces
const BEN = 'translate(158 246) scale(-1.35 1.35)';
const PETER = 'translate(250 248) scale(1.3)';
const shadow = transformPath(basketHole, B) + transformPath(TAM_HEAD_SHAPE, BEN) + transformPath(HEAD_SHAPE, PETER);
const sun = 'M372 30a20 20 0 1 0 0.1 0Z';

export default compose({
  title: 'A big cat sits on the basket, and the two little rabbits hide underneath',
  seed: 94,
  washes: [
    { c: PAL.green, o: 0.35, d: 'M0 258C90 255 190 260 290 257C340 256 370 258 400 257L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.6, d: sun },
    { c: PAL.slate, o: 0.55, d: shadow, rule: 'evenodd' },
  ],
  lines: [ground],
  fine: [sun, rays(372, 50, 28, 40, 10, 3), hatch(10, 280, 390, 282, 12, 6, 165, 2), tufts([[30, 262], [370, 261]], 8, 4)],
  parts: [
    place(basket(), B),
    place(cat(), 'translate(200 148) scale(0.86)'),
    place(benjaminHead({ mood: 'happy', tam: true }), BEN),
    place(rabbitHead({ mood: 'scared', ears: -40, earSpread: 14 }), PETER),
    place(onion(), 'translate(330 274) rotate(-70) scale(0.9)'),
    place(onion(), 'translate(54 276) rotate(80) scale(0.9)'),
  ],
});
