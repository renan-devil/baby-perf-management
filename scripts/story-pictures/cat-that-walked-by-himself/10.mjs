import { PAL, hatch } from '../lib.mjs';
import { cat, caveInside, compose, dot, fire, merge, milkPot, place } from './characters.mjs';

// The Cat that Walked by Himself, 10: crack! The milk pot has split in two, and the Cat, snug by the
// fire in the Cave at last, laps up the warm white milk with his eyes shut. Lap, lap, lap.
const floor = 'M0 262C90 259 200 264 300 261C350 260 380 261 400 260';

// Little drops of milk flicked up by his tongue
const drops = dot(214, 238, 1.6) + dot(222, 230, 1.3) + dot(208, 228, 1.2);

export default compose({
  title: 'The Cat laps up the warm white milk by the fire',
  seed: 310,
  washes: [{ c: PAL.ochre, o: 0.3, d: 'M0 258C90 255 200 260 300 257C350 256 380 257 400 256L400 300L0 300Z' }],
  lines: [floor],
  fine: [hatch(14, 278, 388, 280, 12, 7, 165, 4)],
  parts: [
    caveInside(),
    // the Cat, the pot and the fire, a little larger about the floor
    place(
      merge(
        place(fire({ size: 0.95, glow: false }), 'translate(330 262)'),
        place(milkPot({ split: true }), 'translate(274 262) scale(1.3)'),
        place(cat({ pose: 'lap', mood: 'shut', tongue: true }), 'translate(140 262) scale(1.9)'),
        { fine: [drops] },
      ),
      'translate(-34 -52.4) scale(1.2)',
    ),
  ],
});
