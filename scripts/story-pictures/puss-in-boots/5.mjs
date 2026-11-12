import { PAL, hatch, tufts } from '../lib.mjs';
import { carriage, compose, place, princess, youth } from './characters.mjs';

// Puss in Boots, 5: out of the river and dressed in a fine blue velvet coat, the miller's son smiles
// at the Princess beside the King's golden carriage; she smiles back, and both their cheeks go pink.
const road = 'M0 272C90 268 190 274 290 270C340 268 370 271 400 269';

export default compose({
  title: 'A fine blue coat',
  seed: 113,
  washes: [
    { c: PAL.ochre, o: 0.3, d: 'M0 268C90 264 190 270 290 266C340 264 370 267 400 265L400 296C300 300 100 298 0 296Z' },
    { c: PAL.rose, o: 0.9, d: 'M180 118C174 113 171 109 174 106C176 104 179 105 180 108C181 105 184 104 186 106C189 109 186 113 180 118Z' },
  ],
  lines: [road],
  fine: [hatch(14, 284, 386, 286, 12, 8, 172, 6), tufts([[24, 270], [150, 272]], 9, 3), 'M180 118C174 113 171 109 174 106C176 104 179 105 180 108C181 105 184 104 186 106C189 109 186 113 180 118Z'],
  parts: [
    place(carriage(), 'translate(372 272) scale(1.15)'),
    place(
      youth({
        clothes: 'fine',
        mood: 'happy',
        blush: true,
        tilt: 6,
        arms: [
          [[-21, -108, 9], [-28, -94, 8.5], [-32, -80, 8.5], [-33, -70, 8.5]],
          [[21, -108, 9], [34, -100, 8.5], [44, -92, 8.5], [50, -90, 8.5]],
        ],
      }),
      'translate(118 272) scale(1.18)',
    ),
    place(
      princess({
        mood: 'happy',
        blush: true,
        tilt: -6,
        arms: [
          [[-14, -90, 7], [-24, -84, 6.5], [-32, -80, 6.5], [-36, -80, 6.5]],
          [[14, -90, 7], [22, -80, 6.5], [26, -70, 6.5], [27, -64, 6.5]],
        ],
      }),
      'translate(226 272) scale(1.2)',
    ),
  ],
});
