import { PAL, tufts } from '../lib.mjs';
import { bumpy } from '../puss-in-boots/characters.mjs';
import { C_ARMS, chamberlain, compose, goldenBird, nightingale, palaceWindow, place, sparkle } from './characters.mjs';

// The Nightingale, 6: while everybody admires the jewelled golden bird on its red cushion, the
// little brown nightingale slips out through the open window, back to her green forest.
const C = 'translate(70 280) scale(1.02)';
const GB = 'translate(178 196) scale(1.45)';
const WX = 268;
const WY = 52;
const WW = 92;
const WH = 116;
const NB = 'translate(314 104) rotate(-14) scale(1.5)';
const cushion = 'M120 232C118 220 126 214 140 216C170 220 200 220 230 216C244 214 250 222 246 232C248 244 240 250 228 248C200 244 170 244 138 248C126 250 118 244 120 232Z';
const tassels = 'M122 220l-7 -5M122 244l-7 5M244 220l7 -5M244 244l7 5';
const table = 'M110 252L258 252L258 262L110 262ZM122 262L122 290M246 262L246 290';
// the forest seen through the window: green hills and two round trees, under a pale sky
const view = `M${WX} ${WY + 94}C${WX + 20} ${WY + 84} ${WX + 50} ${WY + 90} ${WX + WW} ${WY + 80}L${WX + WW} ${WY + WH}L${WX} ${WY + WH}Z`;
const trees = bumpy(WX + 20, WY + 84, 11, 10, 7) + bumpy(WX + 70, WY + 74, 13, 12, 8);
const trunks = `M${WX + 20} ${WY + 94}l0 10M${WX + 70} ${WY + 86}l0 12`;

export default compose({
  title: 'The nightingale flies away',
  seed: 1273,
  washes: [
    { c: PAL.ochre, o: 0.16, d: 'M0 0L400 0L400 284L0 284Z' },
    { c: PAL.terracotta, o: 0.4, d: 'M0 284L400 284L400 300L0 300Z' },
    { c: PAL.sky, o: 0.45, d: `M${WX} ${WY}L${WX + WW} ${WY}L${WX + WW} ${WY + WH}L${WX} ${WY + WH}Z` },
    { c: PAL.green, o: 0.75, d: view + trees },
    { c: PAL.red, o: 0.8, d: cushion },
    { c: PAL.ochre, o: 0.9, d: 'M115 215l-4 -4l3 -1ZM115 249l-4 4l3 1ZM251 215l4 -4l-3 -1ZM251 249l4 4l-3 1Z' },
    { c: PAL.terracotta, o: 0.75, d: 'M110 252L258 252L258 262L110 262Z' },
  ],
  lines: [cushion, table],
  fine: [tassels, trees, trunks, 'M0 284L400 284', 'M150 234q30 4 60 0', sparkle(150, 150, 6), sparkle(120, 170, 5), sparkle(204, 128, 4), tufts([[WX + 46, WY + WH]], 7, 4)],
  parts: [
    place(palaceWindow(WW, WH), `translate(${WX} ${WY})`),
    place(chamberlain({ mood: 'shut', tilt: 10, arms: C_ARMS.clasp }), C),
    place(goldenBird(), GB),
    place(nightingale({ pose: 'fly' }), NB),
  ],
});
