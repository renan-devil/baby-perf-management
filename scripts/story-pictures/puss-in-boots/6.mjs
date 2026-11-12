import { PAL, hatch } from '../lib.mjs';
import { compose, farmer, haystack, pitchfork, place, puss, scythe } from './characters.mjs';

// Puss in Boots, 6: in a big golden hay field, Puss (one paw on his hip, the other raised) talks to
// two laughing farmers, one cutting hay with a scythe, one with a pitchfork full of hay.
const field = 'M0 176C80 170 180 178 260 172C320 168 370 172 400 170';
const F1 = 'translate(256 272) scale(1.08)';
const F2 = 'translate(342 272) scale(1.08)';

export default compose({
  title: 'Whose fields are these?',
  seed: 117,
  washes: [
    { c: PAL.ochre, o: 0.42, d: `${field}L400 300L0 300Z` },
    { c: PAL.terracotta, o: 0.12, d: 'M0 240C100 236 300 240 400 236L400 300L0 300Z' },
  ],
  // the edge of the field is only drawn where nobody stands in front of it
  lines: ['M0 176C30 174 54 173 76 173', 'M160 176C180 177 200 176 222 175'],
  fine: [
    hatch(10, 192, 74, 191, 4, 9, -80, 11),
    hatch(156, 192, 220, 191, 4, 9, -80, 12),
    hatch(14, 236, 66, 236, 3, 9, -96, 14),
    hatch(160, 240, 214, 240, 3, 9, -96, 15),
    
    hatch(10, 286, 390, 288, 18, 10, -84, 13),
  ],
  parts: [
    place(haystack(52), 'translate(40 178)'),
    place(haystack(40), 'translate(196 176)'),
    place(
      puss({
        mood: 'happy',
        tilt: 6,
        tail: 'left',
        arms: [
          [[-15, -80, 8], [-30, -72, 7], [-24, -58, 7]],
          [[15, -80, 8], [30, -88, 7], [40, -100, 7]],
        ],
      }),
      'translate(116 272) scale(1.2)',
    ),
    place(scythe(), `${F1} translate(-16 -70)`),
    place(
      farmer({
        kind: 1,
        mood: 'laugh',
        tilt: -6,
        arms: [
          [[-20, -98, 9], [-28, -86, 8.5], [-26, -74, 8.5], [-18, -70, 8.5]],
          [[20, -98, 9], [24, -88, 8.5], [14, -86, 8.5], [4, -84, 8.5]],
        ],
      }),
      F1,
    ),
    place(pitchfork(), `${F2} translate(-6 -72)`),
    place(
      farmer({
        kind: 2,
        mood: 'laugh',
        tilt: -4,
        arms: [
          [[-20, -98, 9], [-26, -88, 8.5], [-20, -80, 8.5], [-12, -82, 8.5]],
          [[20, -98, 9], [26, -84, 8.5], [18, -70, 8.5], [6, -66, 8.5]],
        ],
      }),
      F2,
    ),
  ],
});
