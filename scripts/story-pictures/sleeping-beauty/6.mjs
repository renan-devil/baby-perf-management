import { PAL, hatch, zed } from '../lib.mjs';
import { S_ARMS, bed, compose, oldWoman, place, princessLying, spindleDown } from './characters.mjs';

// Picture 6: the princess pricks her finger on the spindle and sinks gently down onto the old
// woman's bed, fast asleep; the old woman, worried, puts her hands to her cheeks.
const floor = 'M14 264C140 260 280 260 392 264';
const BED = 'translate(150 264) scale(1.3)';

export default compose({
  title: 'Asleep on the Old Woman’s Bed',
  seed: 2606,
  washes: [{ c: PAL.grey, o: 0.28, d: 'M14 264C140 260 280 260 392 264L392 284C280 288 140 288 12 284Z' }],
  lines: [floor],
  fine: [hatch(24, 274, 390, 274, 10, 6, 160, 9), zed(84, 132, 9), zed(100, 108, 12), zed(122, 78, 15)],
  parts: [
    place(bed({ hw: 84, foot: false, cover: 'none', gap: [-60, 84], pillow: 'end' }), BED),
    place(princessLying(), `${BED} translate(-48 -40)`),
    place(spindleDown(), 'translate(272 266) scale(0.9)'),
    place(oldWoman({ mood: 'worried', look: -1, arms: S_ARMS.cheeks }), 'translate(338 264) scale(1.3)'),
  ],
});
