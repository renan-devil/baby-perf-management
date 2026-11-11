import { PAL, hatch, rays, tufts } from '../lib.mjs';
import { compose, note, place, rooster } from './characters.mjs';

// The Bremen Town Musicians, 5: the Rooster stands on top of the farm gate, crowing with all his
// might.
const ground = 'M0 262C100 258 300 264 400 258';
const gate = [
  'M60 268L60 150L80 150L80 268', // posts
  'M320 268L320 150L340 150L340 268',
  'M80 162L320 162L320 176L80 176Z', // rails
  'M80 200L320 200L320 212L80 212Z',
  'M80 236L320 236L320 248L80 248Z',
  'M86 248L314 176', // diagonal brace
];
const crowing = 'M262 74q12 -8 20 4M266 60q20 -14 34 6M270 46q26 -18 46 8';

const N1 = note(334, 92, 1.1, 10);
const N2 = note(352, 52, 0.9, -8);
export default compose({
  title: 'Cock-a-doodle-doo!',
  seed: 65,
  washes: [
    { c: PAL.ochre, o: 0.55, d: 'M20 90C20 70 36 56 52 56C68 56 84 70 84 90Z' },
    { c: PAL.green, o: 0.4, d: `${ground}L400 300L0 300Z` },
    { c: PAL.ochre, o: 0.7, d: gate.slice(0, 5).map((d) => (d.endsWith('Z') ? d : `${d}Z`)).join('') },
    { c: PAL.terracotta, o: 0.35, d: 'M60 268L60 150L80 150L80 268ZM320 268L320 150L340 150L340 268Z' },
  ],
  lines: [ground, ...gate, 'M20 90C20 70 36 56 52 56C68 56 84 70 84 90'],
  fine: [
    crowing,
    ...N1.fine,
    ...N2.fine,
    rays(52, 90, 40, 52, 7, 2, 180),
    'M70 170l0 -4M330 180l0 -4M150 206l6 0M250 242l6 0',
    tufts([[30, 262], [100, 263], [360, 260], [200, 262]], 10, 7),
    hatch(20, 284, 380, 282, 10, 7, 170, 5),
  ],
  fills: N1.fills.concat(N2.fills).map((d) => `<path d="${d}"/>`).join(''),
  parts: [place(rooster({ pose: 'crow' }), 'translate(200 162) scale(1.35)')],
});
