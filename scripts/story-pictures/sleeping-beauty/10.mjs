import { PAL, hatch } from '../lib.mjs';
import { P_ARMS, R_ARMS, bed, compose, place, prince, princess, sparkles } from './characters.mjs';

// Picture 10: the princess wakes, sits up in bed and smiles at the prince, who kneels beside her.
const floor = 'M14 266C140 262 280 262 392 266';
const BED = 'translate(162 266) scale(1.35)';
const SX = -22;

export default compose({
  title: 'The Princess Wakes',
  seed: 3010,
  washes: [{ c: PAL.grey, o: 0.28, d: 'M14 266C140 262 280 262 392 266L392 284C280 288 140 288 12 284Z' }],
  lines: [floor],
  fine: [hatch(24, 276, 390, 276, 10, 6, 160, 12)],
  parts: [
    place(bed({ hw: 50, foot: false, cover: 'low', sx: SX }), BED),
    place(princess({ upper: true, mood: 'happy', look: 1, arms: P_ARMS.hold }), `${BED} translate(${SX} 4)`),
    place(prince({ legs: 'kneel', arms: R_ARMS.reach, look: -1, mood: 'happy' }), 'translate(280 266) scale(1.3)'),
    sparkles([
      [226, 110, 5],
      [250, 86, 4],
      [206, 84, 4],
    ]),
  ],
});
