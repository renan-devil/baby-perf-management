import { PAL } from '../lib.mjs';
import { BED_PILLOW, bedsideTable, compose, dot, emperorInBed, goldenBird, merge, nightingale, note, oval, palaceWindow, place, sparkle } from './characters.mjs';

// The Nightingale, 9: tap, tap at the window... the real nightingale has come back! She sings in
// the moonlight at the open window, and the Emperor smiles as the colour comes back to his cheeks.
const S = 'translate(-22 -70) scale(1.3)';
const GB = 'translate(44 192) scale(0.85)';
const WX = 262;
const WY = 40;
const WW = 96;
const WH = 100;
const NB = 'translate(314 116) scale(-1.85 1.85)';
const moon = dot(318, 96, 34);
const win = `M${WX} ${WY}L${WX + WW} ${WY}L${WX + WW} ${WY + WH}L${WX} ${WY + WH}Z`;
const dark = 'M8 50C60 24 320 20 392 40C400 110 400 220 400 284L4 284C0 200 0 120 8 50Z';
const holes = place({ lines: [BED_PILLOW] }, S).lines[0] + place({ lines: [oval(-4, -3, 34, 21)] }, GB).lines[0];

export default compose({
  title: 'The nightingale comes back',
  seed: 1319,
  washes: [
    { c: PAL.slate, o: 0.5, d: dark + win + holes, rule: 'evenodd' },
    { c: PAL.slate, o: 0.75, d: win + moon, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.3, d: moon },
    { c: PAL.slate, o: 0.3, d: 'M0 284C100 280 300 280 400 284L400 300L0 300Z' },
  ],
  lines: ['M0 284C100 280 300 280 400 284'],
  fine: [moon, sparkle(272, 52, 3), sparkle(350, 132, 2.5)],
  parts: [
    place(palaceWindow(WW, WH), `translate(${WX} ${WY})`),
    place(bedsideTable(), 'translate(44 210)'),
    place(goldenBird(), GB),
    place(emperorInBed({ mood: 'shut', pale: false, rosy: true }), S),
    place(nightingale({ beak: 'open' }), NB),
    merge(note(204, 112, 1.5), note(184, 86, 1.3), note(166, 114, 1.1)),
  ],
});
