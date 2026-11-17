import { PAL, hatch } from '../lib.mjs';
import { FLOOR, boards, floorWash } from './6.mjs';
import { compose, place, windowFrame, wolf, woodcutter } from './characters.mjs';

// Little Red Riding Hood, 9: the tall woodcutter fills the doorway, his axe resting on his shoulder:
// "What's going on here?" And the wolf, still in Grandmother's nightcap, jumps straight out of the
// window. Crash!
const doorway = 'M14 258L14 40C14 22 140 22 140 40L140 258';
const door = 'M14 258L14 40L-8 50L-8 264Z';
const crash = 'M376 52l10 -12M380 74l14 -4M362 40l2 -14M276 56l-10 -8M392 100l8 4';

export default compose({
  title: 'Out of the window',
  seed: 131,
  washes: [
    floorWash,
    { c: PAL.sky, o: 0.3, d: `${doorway}Z` },
    { c: PAL.green, o: 0.35, d: 'M14 210C50 200 100 206 140 200L140 258L14 258Z' },
    { c: PAL.green, o: 0.7, d: door },
  ],
  lines: [FLOOR, doorway, door],
  fine: [boards, hatch(150, 276, 390, 280, 7, 6, 170, 9), crash, 'M150 120l8 0M150 180l8 0'],
  parts: [
    place(woodcutter({ mood: 'wow' }), 'translate(78 262) scale(1.04)'),
    place(windowFrame({ open: true }), 'translate(322 110) scale(1.35)'),
    place(wolf({ pose: 'dive', cap: true, dress: true, mouth: 'roar' }), 'translate(236 176) rotate(-12) scale(0.9)'),
  ],
});
