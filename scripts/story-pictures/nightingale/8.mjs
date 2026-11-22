import { PAL } from '../lib.mjs';
import { BED_PILLOW, bedsideTable, compose, emperorInBed, goldenBird, oval, place } from './characters.mjs';

// The Nightingale, 8: years later, the Emperor is very ill. He lies pale and still in his big bed,
// in the dark, quiet room. Beside him the golden bird sits silent: nobody can wind it any more.
const S = 'translate(-22 -70) scale(1.3)';
const GB = 'translate(44 192) scale(0.85)';
// the window, shut tight for the night
const win = 'M282 58L360 58L360 140L282 140Z';
const lattice = 'M308 58L308 140M334 58L334 140M282 85L360 85M282 112L360 112';
const dark = 'M8 50C60 24 320 20 392 40C400 110 400 220 400 284L4 284C0 200 0 120 8 50Z';
// the pillow and the golden bird stay out of the dark, so they keep their colours
const holes = place({ lines: [BED_PILLOW] }, S).lines[0] + place({ lines: [oval(-4, -3, 34, 21)] }, GB).lines[0];

export default compose({
  title: 'The Emperor lies ill',
  seed: 1301,
  washes: [
    { c: PAL.slate, o: 0.6, d: dark + holes, rule: 'evenodd' },
    { c: PAL.red, o: 0.55, d: win },
    { c: PAL.slate, o: 0.3, d: 'M0 284C100 280 300 280 400 284L400 300L0 300Z' },
  ],
  lines: ['M0 284C100 280 300 280 400 284', win],
  fine: [lattice, 'M276 148L366 148'],
  parts: [place(bedsideTable(), 'translate(44 210)'), place(goldenBird(), GB), place(emperorInBed(), S)],
});
