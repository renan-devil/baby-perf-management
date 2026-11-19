import { PAL, hatch } from '../lib.mjs';
import { compose, dot, fisherman, ilsebill, oval, place } from './characters.mjs';

// The Fisherman and His Wife, 10: that evening the fisherman and Ilsebill share a big pot of fish
// soup at their little table by the open window, while the sun goes down over the calm sea. It is
// the best soup Ilsebill has ever tasted; they are content and cosy, at home.
const TOP = 206; // the top of the table
const table = `M56 ${TOP}L344 ${TOP}L344 ${TOP + 9}L56 ${TOP + 9}Z`;
const legs = `M72 ${TOP + 9}L72 280M328 ${TOP + 9}L328 280`;
const floor = 'M20 280C120 278 280 282 380 280';
const win = 'M146 54L254 54L254 170L146 170Z';
const horizon = 'M146 132L254 132';
const shutters = 'M146 54L124 62L124 162L146 170M254 54L276 62L276 162L254 170';
const sun = 'M180 132C180 108 220 108 220 132';
const bowl = `M166 ${TOP - 12}C168 ${TOP + 8} 232 ${TOP + 8} 234 ${TOP - 12}Z`;
const soup = oval(200, TOP - 12, 34, 5);
const steam = 'M186 180c-6 -8 4 -12 -1 -20c-4 -6 3 -10 0 -15M200 176c-6 -8 4 -12 -1 -20c-4 -6 3 -10 0 -15M214 180c-6 -8 4 -12 -1 -20c-4 -6 3 -10 0 -15';
const F = `translate(108 ${TOP + 46}) scale(1.15)`;
const I = `translate(294 ${TOP + 56}) scale(1.25)`;
const fArms = [
  [[-15, -84, 8], [-24, -62, 7], [-6, -46, 6]],
  [[15, -84, 8], [36, -66, 7], [60, -58, 6]],
];
const iArms = [
  [[-12, -86, 7], [-28, -72, 6], [-50, -70, 6]],
  [[12, -86, 7], [22, -72, 6], [10, -64, 6]],
];

export default compose({
  title: 'Fish soup by the open window',
  seed: 70,
  washes: [
    { c: PAL.ochre, o: 0.55, d: 'M146 54L254 54L254 132L146 132Z' },
    { c: PAL.rose, o: 0.4, d: 'M146 54L254 54L254 100C220 92 180 92 146 100Z' },
    { c: PAL.terracotta, o: 0.8, d: `${sun}Z` },
    { c: PAL.sky, o: 0.65, d: 'M146 132L254 132L254 170L146 170Z' },
    { c: PAL.ochre, o: 0.6, d: 'M184 140L216 140L214 144L186 144ZM188 152L212 152L210 156L190 156ZM192 163L208 163L206 166L194 166Z' },
    { c: PAL.terracotta, o: 0.4, d: 'M146 54L124 62L124 162L146 170ZM254 54L276 62L276 162L254 170Z' },
    { c: PAL.terracotta, o: 0.6, d: table },
    { c: PAL.ochre, o: 0.4, d: table },
    { c: PAL.sky, o: 0.7, d: bowl },
    { c: PAL.ochre, o: 0.75, d: soup },
    { c: PAL.terracotta, o: 0.5, d: dot(190, TOP - 12, 3) + dot(210, TOP - 13, 2.6) },
  ],
  lines: [win, shutters, table, legs, bowl, floor],
  fine: [
    horizon,
    sun,
    'M200 54L200 112M146 100L254 100',
    'M134 70l0 84M266 70l0 84',
    soup,
    steam,
    'M160 148q8 -4 16 0M228 156q8 -4 16 0',
    `M174 ${TOP - 30}L186 ${TOP - 10}`, // his spoon, dipping into the soup
    `M234 ${TOP - 18}L222 ${TOP - 30}`, // her spoon
    hatch(40, 290, 360, 290, 10, 6, 165, 4),
  ],
  parts: [
    place(fisherman({ mood: 'content', arms: fArms, legs: false }), F),
    place(ilsebill({ pose: 'upper', mood: 'content', arms: iArms }), I),
  ],
});
