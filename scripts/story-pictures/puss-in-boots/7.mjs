import { PAL, hatch, tufts } from '../lib.mjs';
import { castleDoor, compose, ogre, place, puss } from './characters.mjs';

// Puss in Boots, 7: Puss has knocked at the huge castle door; it creaks open and there stands the
// big grumpy Ogre, as tall as a tree, booming "WHAT DO YOU WANT?". Puss, tiny beside him, looks up.
const ground = 'M0 284C90 280 190 286 290 282C340 280 370 283 400 281';
const D = 'translate(262 284) scale(1.3)';

export default compose({
  title: 'Knock, knock, knock!',
  seed: 121,
  washes: [{ c: PAL.green, o: 0.35, d: 'M0 282C90 278 190 284 290 280C340 278 370 281 400 279L400 300L0 300Z' }],
  lines: [ground],
  fine: [tufts([[20, 284], [130, 284]], 9, 8), hatch(14, 292, 386, 293, 10, 8, 172, 2), 'M150 170l10 -6M152 182l12 0M150 194l10 6'],
  parts: [
    place(castleDoor({ open: 'ajar', wall: 34, dark: false }), D),
    place(
      ogre({
        mood: 'boom',
        tilt: -8,
        arms: [
          [[-60, -158, 22], [-84, -146, 20], [-92, -124, 20], [-90, -110, 20]],
          [[60, -158, 22], [84, -138, 20], [86, -110, 20], [72, -96, 20]],
        ],
      }),
      'translate(266 284) scale(0.8)',
    ),
    place(
      puss({
        mood: 'wow',
        tilt: 10,
        tail: 'left',
        arms: [
          [[-15, -80, 8], [-26, -70, 7], [-28, -58, 7]],
          [[15, -80, 8], [28, -92, 7], [34, -106, 7]],
        ],
      }),
      'translate(112 284) scale(0.95)',
    ),
  ],
});
