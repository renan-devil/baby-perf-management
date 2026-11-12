import { PAL, hatch, tufts } from '../lib.mjs';
import { castleDoor, compose, king, place, princess, puss, youth } from './characters.mjs';

// Puss in Boots, 10: at the castle door Puss makes his very best bow, one paw out, to welcome the
// King (his eyes wide open with surprise), the Princess and the young man in his blue coat, who come
// up hand in hand: "Welcome to the castle of the Marquis of Carabas!"
const ground = 'M0 280C90 276 190 282 290 278C340 276 370 279 400 277';
const lean = 40;
const P = 'translate(160 280) scale(0.9)';

export default compose({
  title: 'Welcome, Your Majesty!',
  seed: 137,
  washes: [{ c: PAL.green, o: 0.38, d: 'M0 278C90 274 190 280 290 276C340 274 370 277 400 275L400 300L0 300Z' }],
  lines: [ground],
  fine: [tufts([[196, 280], [392, 278]], 9, 10), hatch(14, 290, 386, 291, 10, 8, 172, 10)],
  parts: [
    place(castleDoor({ open: 'ajar', wall: 18, battlements: true }), 'translate(70 280) scale(0.9)'),
    place(
      puss({
        mood: 'sly',
        lean,
        tail: 'up',
        arms: [
          [[-15, -80, 8], [-28, -70, 7], [-38, -58, 7]],
          [[15, -80, 8], [32, -86, 7], [44, -88, 7]],
        ],
        legs: [
          { hip: [-9, -52], top: [-12, -34], toe: -1 },
          { hip: [9, -52], top: [10, -34], toe: 1 },
        ],
      }),
      P,
    ),
    place(
      king({
        mood: 'wow',
        arms: [
          [[-28, -94, 11], [-42, -98, 10], [-50, -108, 10], [-54, -114, 10]],
          [[28, -94, 11], [42, -102, 10], [52, -114, 10], [56, -122, 10]],
        ],
      }),
      'translate(258 280) scale(0.78)',
    ),
    place(
      princess({
        mood: 'happy',
        tilt: 4,
        arms: [
          [[-14, -90, 7], [-22, -80, 6.5], [-26, -70, 6.5], [-27, -64, 6.5]],
          [[14, -90, 7], [24, -82, 6.5], [32, -76, 6.5], [38, -74, 6.5]],
        ],
      }),
      'translate(320 280) scale(0.82)',
    ),
    place(
      youth({
        clothes: 'fine',
        mood: 'happy',
        tilt: -4,
        arms: [
          [[-21, -108, 9], [-30, -96, 8.5], [-36, -86, 8.5], [-40, -82, 8.5]],
          [[21, -108, 9], [28, -94, 8.5], [32, -80, 8.5], [33, -70, 8.5]],
        ],
      }),
      'translate(370 280) scale(0.8)',
    ),
  ],
});
