import { PAL, hatch, tufts, zed } from '../lib.mjs';
import { cat, cave, compose, dog, fire, place } from './characters.mjs';

// The Cat that Walked by Himself, 6: the Cat creeps up to the Cave and peeps in at the door. Inside,
// by the warm fire, the Dog lies curled up, dozing.
const ground = 'M0 262C90 259 190 264 290 261C340 260 380 261 400 260';

export default compose({
  title: 'The Cat peeps into the Cave, where the Dog dozes by the fire',
  seed: 306,
  washes: [{ c: PAL.green, o: 0.32, d: 'M0 258C90 255 190 260 290 257C340 256 380 257 400 256L400 300L0 300Z' }],
  lines: [ground],
  fine: [hatch(14, 278, 388, 280, 12, 7, 165, 4), tufts([[20, 262], [64, 261], [140, 262]], 9, 2)],
  once: `<path d="${zed(266, 196, 9)}${zed(282, 180, 7)}${zed(295, 167, 5)}"/>`,
  parts: [
    place(cave({ curtain: 'right', dark: 0.36, narrow: 0.42 }), 'translate(310 262) scale(1.2)'),
    place(fire({ size: 0.8 }), 'translate(338 262)'),
    place(dog({ pose: 'sleep' }), 'translate(268 262) scale(1.05)'),
    place(cat({ pose: 'peep' }), 'translate(100 262) scale(1.45)'),
  ],
});
