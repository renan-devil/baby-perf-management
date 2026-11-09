import { PAL, hatch, zed } from '../lib.mjs';
import { bed, compose, goldiHead, place } from './characters.mjs';

// Goldilocks and the Three Bears, 4: upstairs, Goldilocks is fast asleep in the tiny little bed,
// her golden curls spread over the pillow. Zzzz…
const floor = 'M0 262C100 259 200 264 300 261C340 260 370 262 400 261';
const rug = 'M90 270C150 266 260 266 320 270C330 278 320 286 300 288C230 292 170 292 110 288C88 286 80 278 90 270Z';
const BT = 'translate(204 262) scale(1.7)';
// her head on the pillow, lying back with the top of her head towards the headboard
const HT = `${BT} translate(-44 -60) rotate(-62) scale(0.86)`;
// one hand resting on the blanket
const hand = 'M-30 -40C-34 -46 -26 -50 -22 -46C-20 -42 -26 -38 -30 -40Z';

export default compose({
  title: 'Fast asleep',
  seed: 84,
  washes: [
    { c: PAL.ochre, o: 0.32, d: 'M0 258C100 255 200 260 300 257C340 256 370 258 400 257L400 296C300 298 100 297 0 296Z' },
    { c: PAL.sky, o: 0.45, d: rug },
  ],
  lines: [floor],
  fine: [
    rug,
    'M100 278q100 -6 210 0',
    zed(186, 92, 12),
    zed(210, 64, 16),
    zed(240, 30, 21),
    hatch(14, 280, 80, 282, 3, 8, 172, 4),
    hatch(330, 280, 392, 282, 3, 8, 172, 7),
  ],
  parts: [
    place(bed({ lump: 'sleep' }), BT),
    place(goldiHead({ mood: 'sleep' }), HT),
    place({ lines: [hand], washes: [{ c: PAL.rose, o: 0.5, d: hand }] }, BT),
  ],
});
